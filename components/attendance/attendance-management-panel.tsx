"use client"

import { useState, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  importAttendanceFromExcel,
  generateAttendanceTemplate,
} from "@/lib/actions/attendance-import-actions"
import type { AttendanceLogWithRelations, WorkShift } from "@/lib/types/database"
import { formatDateVN, formatTimeVN, formatSourceVN } from "@/lib/utils/date-utils"
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, AlertTriangle, Clock, Filter, Search } from "lucide-react"

interface AttendanceManagementPanelProps {
  attendanceLogs: (AttendanceLogWithRelations & { employee?: { shift?: WorkShift | null } | null })[]
}

interface ImportResult {
  success: boolean
  total: number
  imported: number
  skipped: number
  errors: string[]
}

interface AttendanceViolation {
  type: "late" | "early_leave" | "no_checkin" | "no_checkout"
  minutes?: number
  message: string
}

const months = [
  { value: "01", label: "Tháng 1" },
  { value: "02", label: "Tháng 2" },
  { value: "03", label: "Tháng 3" },
  { value: "04", label: "Tháng 4" },
  { value: "05", label: "Tháng 5" },
  { value: "06", label: "Tháng 6" },
  { value: "07", label: "Tháng 7" },
  { value: "08", label: "Tháng 8" },
  { value: "09", label: "Tháng 9" },
  { value: "10", label: "Tháng 10" },
  { value: "11", label: "Tháng 11" },
  { value: "12", label: "Tháng 12" },
]

// Hàm kiểm tra vi phạm chấm công
function checkViolations(
  checkIn: string | null,
  checkOut: string | null,
  shift: WorkShift | null | undefined
): AttendanceViolation[] {
  const violations: AttendanceViolation[] = []

  if (!shift) return violations

  // Parse shift times
  const shiftStart = shift.start_time?.slice(0, 5) // "08:00"
  const shiftEnd = shift.end_time?.slice(0, 5) // "17:00"

  if (!shiftStart || !shiftEnd) return violations

  // Check late arrival
  if (checkIn) {
    const checkInTime = new Date(checkIn)
    const checkInHHMM = `${String(checkInTime.getHours()).padStart(2, "0")}:${String(checkInTime.getMinutes()).padStart(2, "0")}`

    const [shiftH, shiftM] = shiftStart.split(":").map(Number)
    const [checkH, checkM] = checkInHHMM.split(":").map(Number)

    const shiftMinutes = shiftH * 60 + shiftM
    const checkMinutes = checkH * 60 + checkM
    const lateMinutes = checkMinutes - shiftMinutes

    if (lateMinutes > 0) {
      violations.push({
        type: "late",
        minutes: lateMinutes,
        message: `Đi muộn ${lateMinutes} phút (vào lúc ${checkInHHMM}, ca bắt đầu ${shiftStart})`,
      })
    }
  } else {
    violations.push({
      type: "no_checkin",
      message: "Quên chấm công vào",
    })
  }

  // Check early leave
  if (checkOut) {
    const checkOutTime = new Date(checkOut)
    const checkOutHHMM = `${String(checkOutTime.getHours()).padStart(2, "0")}:${String(checkOutTime.getMinutes()).padStart(2, "0")}`

    const [shiftH, shiftM] = shiftEnd.split(":").map(Number)
    const [checkH, checkM] = checkOutHHMM.split(":").map(Number)

    const shiftMinutes = shiftH * 60 + shiftM
    const checkMinutes = checkH * 60 + checkM
    const earlyMinutes = shiftMinutes - checkMinutes

    if (earlyMinutes > 0) {
      violations.push({
        type: "early_leave",
        minutes: earlyMinutes,
        message: `Về sớm ${earlyMinutes} phút (ra lúc ${checkOutHHMM}, ca kết thúc ${shiftEnd})`,
      })
    }
  } else if (checkIn) {
    // Có check in nhưng không có check out
    violations.push({
      type: "no_checkout",
      message: "Quên chấm công ra",
    })
  }

  return violations
}

export function AttendanceManagementPanel({ attendanceLogs }: AttendanceManagementPanelProps) {
  const currentDate = new Date()
  const [importing, setImporting] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, "0"))
  const [selectedYear, setSelectedYear] = useState(String(currentDate.getFullYear()))
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Bộ lọc dữ liệu chấm công
  const [filterMonth, setFilterMonth] = useState<string>((currentDate.getMonth() + 1).toString())
  const [filterYear, setFilterYear] = useState<string>(currentDate.getFullYear().toString())
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterEmployee, setFilterEmployee] = useState<string>("")

  // Lọc dữ liệu chấm công
  const filteredLogs = useMemo(() => {
    return attendanceLogs.filter((log) => {
      if (!log.check_in) return false
      
      const logDate = new Date(log.check_in)
      const logMonth = logDate.getMonth() + 1
      const logYear = logDate.getFullYear()
      
      // Lọc theo tháng/năm
      if (filterMonth !== "all" && logMonth !== parseInt(filterMonth)) return false
      if (filterYear !== "all" && logYear !== parseInt(filterYear)) return false
      
      // Lọc theo nhân viên
      if (filterEmployee) {
        const searchLower = filterEmployee.toLowerCase()
        const matchName = log.employee?.full_name?.toLowerCase().includes(searchLower)
        const matchCode = log.employee?.employee_code?.toLowerCase().includes(searchLower)
        if (!matchName && !matchCode) return false
      }
      
      // Lọc theo trạng thái
      if (filterStatus !== "all") {
        const shift = log.employee?.shift
        const violations = checkViolations(log.check_in, log.check_out, shift)
        const hasViolation = violations.length > 0
        
        if (filterStatus === "violation" && !hasViolation) return false
        if (filterStatus === "complete" && (hasViolation || !log.check_out)) return false
        if (filterStatus === "incomplete" && log.check_out) return false
      }
      
      return true
    })
  }, [attendanceLogs, filterMonth, filterYear, filterStatus, filterEmployee])

  // Lấy danh sách năm từ dữ liệu
  const availableYears = useMemo(() => {
    const years = new Set<number>()
    attendanceLogs.forEach((log) => {
      if (log.check_in) {
        years.add(new Date(log.check_in).getFullYear())
      }
    })
    return Array.from(years).sort((a, b) => b - a)
  }, [attendanceLogs])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ]
      if (!validTypes.includes(file.type) && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        setImportResult({
          success: false,
          total: 0,
          imported: 0,
          skipped: 0,
          errors: ["Chỉ hỗ trợ file Excel (.xlsx, .xls)"],
        })
        setShowResultDialog(true)
        return
      }
      setSelectedFile(file)
      setShowImportDialog(true)
    }
  }

  const handleImport = async () => {
    if (!selectedFile) return

    setImporting(true)
    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("monthYear", `${selectedYear}-${selectedMonth}`)

    try {
      const result = await importAttendanceFromExcel(formData)
      setImportResult(result)
      setShowImportDialog(false)
      setShowResultDialog(true)
    } catch (error) {
      setImportResult({
        success: false,
        total: 0,
        imported: 0,
        skipped: 0,
        errors: ["Lỗi không xác định khi import"],
      })
      setShowImportDialog(false)
      setShowResultDialog(true)
    } finally {
      setImporting(false)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDownloadTemplate = async () => {
    setDownloading(true)
    try {
      const result = await generateAttendanceTemplate()
      if (result.success && result.data) {
        const byteCharacters = atob(result.data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })

        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "mau_cham_cong.xlsx"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error downloading template:", error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import chấm công từ Excel
          </CardTitle>
          <CardDescription>
            Upload file Excel để import dữ liệu chấm công hàng loạt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={importing}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Hỗ trợ file .xlsx, .xls
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                disabled={downloading}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {downloading ? "Đang tải..." : "Tải file mẫu"}
              </Button>
            </div>
          </div>

          {/* Format guide */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Định dạng file Excel:</h4>
            <div className="overflow-x-auto">
              <table className="text-sm border-collapse w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-3 py-1 text-left">Mã N.Viên</th>
                    <th className="px-3 py-1 text-left">Tên nhân viên</th>
                    <th className="px-3 py-1 text-left">Phòng ban</th>
                    <th className="px-3 py-1 text-left">Ngày</th>
                    <th className="px-3 py-1 text-left">Thứ</th>
                    <th className="px-3 py-1 text-left">Vào</th>
                    <th className="px-3 py-1 text-left">Ra</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-1">NV001</td>
                    <td className="px-3 py-1">Nguyễn Văn A</td>
                    <td className="px-3 py-1">IT</td>
                    <td className="px-3 py-1">1</td>
                    <td className="px-3 py-1">T2</td>
                    <td className="px-3 py-1">08:30</td>
                    <td className="px-3 py-1">17:30</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              * Cột "Ngày" là ngày trong tháng (1-31). Tháng/năm sẽ chọn khi import.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle>Dữ liệu chấm công</CardTitle>
          <CardDescription>Vi phạm được đánh dấu màu đỏ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bộ lọc */}
          <div className="flex flex-wrap gap-3 items-center p-3 bg-muted/50 rounded-lg">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Tháng:</span>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Tháng {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Năm:</span>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trạng thái:</span>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="complete">Hoàn thành</SelectItem>
                  <SelectItem value="incomplete">Chưa ra</SelectItem>
                  <SelectItem value="violation">Vi phạm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc mã NV..."
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
                className="h-9"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {filteredLogs.length} bản ghi
            </span>
          </div>

          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Giờ vào</TableHead>
                  <TableHead>Giờ ra</TableHead>
                  <TableHead>Ca làm</TableHead>
                  <TableHead>Nguồn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Không có dữ liệu chấm công
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => {
                    const shift = log.employee?.shift
                    const violations = checkViolations(log.check_in, log.check_out, shift)
                    const hasViolation = violations.length > 0
                    const isLate = violations.some((v) => v.type === "late")
                    const isEarlyLeave = violations.some((v) => v.type === "early_leave")
                    const noCheckIn = violations.some((v) => v.type === "no_checkin")
                    const noCheckOut = violations.some((v) => v.type === "no_checkout")

                    return (
                      <TableRow key={log.id} className={hasViolation ? "bg-red-50" : ""}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.employee?.full_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {log.employee?.employee_code}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDateVN(log.check_in)}</TableCell>
                        <TableCell>
                          {noCheckIn ? (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Thiếu
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>Quên chấm công vào</TooltipContent>
                            </Tooltip>
                          ) : isLate ? (
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="text-red-600 font-medium">
                                  {formatTimeVN(log.check_in)}
                                  <AlertTriangle className="h-3 w-3 inline ml-1" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {violations.find((v) => v.type === "late")?.message}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-green-600">{formatTimeVN(log.check_in)}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {noCheckOut ? (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Thiếu
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>Quên chấm công ra</TooltipContent>
                            </Tooltip>
                          ) : isEarlyLeave ? (
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="text-red-600 font-medium">
                                  {formatTimeVN(log.check_out)}
                                  <AlertTriangle className="h-3 w-3 inline ml-1" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {violations.find((v) => v.type === "early_leave")?.message}
                              </TooltipContent>
                            </Tooltip>
                          ) : log.check_out ? (
                            <span className="text-green-600">{formatTimeVN(log.check_out)}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {shift ? (
                            <Badge variant="outline" className="font-mono text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {shift.start_time?.slice(0, 5)}-{shift.end_time?.slice(0, 5)}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">Chưa có ca</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{formatSourceVN(log.source)}</Badge>
                        </TableCell>
                        <TableCell>
                          {hasViolation ? (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Vi phạm
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <ul className="text-xs">
                                  {violations.map((v, i) => (
                                    <li key={i}>• {v.message}</li>
                                  ))}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          ) : log.check_out ? (
                            <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
                          ) : (
                            <Badge variant="secondary">Chưa ra</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Import Dialog - Chọn tháng/năm */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import chấm công
            </DialogTitle>
            <DialogDescription>
              Chọn tháng/năm cho dữ liệu chấm công trong file
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">File:</span> {selectedFile?.name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tháng</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Năm</Label>
                <Input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  min={2020}
                  max={2100}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleImport} disabled={importing} className="gap-2">
              <Upload className="h-4 w-4" />
              {importing ? "Đang import..." : "Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {importResult?.success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Import hoàn tất
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  Import thất bại
                </>
              )}
            </DialogTitle>
            <DialogDescription>Kết quả import dữ liệu chấm công</DialogDescription>
          </DialogHeader>

          {importResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">{importResult.total}</p>
                  <p className="text-sm text-muted-foreground">Tổng dòng</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{importResult.imported}</p>
                  <p className="text-sm text-muted-foreground">Thành công</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600">{importResult.skipped}</p>
                  <p className="text-sm text-muted-foreground">Bỏ qua</p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-red-700">Lỗi:</span>
                  </div>
                  <ul className="text-sm text-red-600 space-y-1 max-h-40 overflow-y-auto">
                    {importResult.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowResultDialog(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
