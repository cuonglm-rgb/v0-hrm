"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AttendancePanel } from "@/components/attendance/attendance-panel"
import {
  importAttendanceGroups,
  generateAttendanceTemplate,
} from "@/lib/actions/attendance-import-actions"
import { parseAttendanceSheet } from "@/lib/utils/attendance-excel-parse"
import { listAttendance, getAllApprovedLeaveRequests } from "@/lib/actions/attendance-actions"
import type { AttendanceLog, WorkShift, EmployeeRequestWithRelations, Employee } from "@/lib/types/database"
import type { Holiday } from "@/lib/actions/attendance-actions"
import type { SpecialWorkDayWithEmployees } from "@/lib/types/database"
import type { SaturdaySchedule } from "@/lib/actions/saturday-schedule-actions"
import { Users, Check, ChevronsUpDown, FileSpreadsheet, Download, Upload, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmployeeWithShift extends Employee {
  shift?: WorkShift | null
}

interface AttendanceManagementViewProps {
  employees: EmployeeWithShift[]
  attendanceLogs: AttendanceLog[]
  leaveRequests: EmployeeRequestWithRelations[]
  holidays: Holiday[]
  specialDays: SpecialWorkDayWithEmployees[]
  saturdaySchedules: SaturdaySchedule[]
  canEdit?: boolean
}

export function AttendanceManagementView({
  employees,
  attendanceLogs,
  leaveRequests,
  holidays,
  specialDays,
  saturdaySchedules,
  canEdit = false,
}: AttendanceManagementViewProps) {
  const [open, setOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    employees[0]?.id || ""
  )

  // Import state
  const [importing, setImporting] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: boolean
    total: number
    imported: number
    skipped: number
    errors: string[]
  } | null>(null)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [importProgress, setImportProgress] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Số nhóm (nhân viên + ngày) gửi lên server mỗi request.
  // Giữ payload nhỏ hơn nhiều so với giới hạn 4.5MB body của Vercel.
  const IMPORT_CHUNK_SIZE = 1000

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ]
    if (!validTypes.includes(file.type) && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setImportResult({
        success: false, total: 0, imported: 0, skipped: 0,
        errors: ["Chỉ hỗ trợ file Excel (.xlsx, .xls)"],
      })
      setShowResultDialog(true)
      return
    }

    setImporting(true)
    setImportProgress("Đang đọc file...")

    try {
      // Parse Excel ngay trên trình duyệt: chỉ gửi lên server dữ liệu đã gộp,
      // tránh upload cả file (Vercel trả 413 khi request body > 4.5MB).
      const XLSX = await import("xlsx")
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: "array" })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][]
      const parsed = parseAttendanceSheet(rawData)

      if (!parsed.success) {
        setImportResult({
          success: false, total: 0, imported: 0, skipped: 0,
          errors: parsed.errors,
        })
        setShowResultDialog(true)
        return
      }

      const { groups } = parsed
      let imported = 0
      let skipped = parsed.skipped
      const errors: string[] = [...parsed.errors]
      let failed = false

      const totalChunks = Math.max(1, Math.ceil(groups.length / IMPORT_CHUNK_SIZE))
      for (let i = 0; i < groups.length; i += IMPORT_CHUNK_SIZE) {
        const chunkIndex = Math.floor(i / IMPORT_CHUNK_SIZE) + 1
        setImportProgress(`Đang import phần ${chunkIndex}/${totalChunks}...`)

        const result = await importAttendanceGroups(groups.slice(i, i + IMPORT_CHUNK_SIZE))
        imported += result.imported
        skipped += result.skipped
        errors.push(...result.errors)
        if (!result.success) failed = true
      }

      setImportResult({
        success: !failed,
        total: parsed.total,
        imported,
        skipped,
        errors: errors.slice(0, 10),
      })
      setShowResultDialog(true)
    } catch (error) {
      setImportResult({
        success: false, total: 0, imported: 0, skipped: 0,
        errors: [`Lỗi khi import: ${error instanceof Error ? error.message : "Lỗi không xác định"}`],
      })
      setShowResultDialog(true)
    } finally {
      setImporting(false)
      setImportProgress("")
      if (fileInputRef.current) fileInputRef.current.value = ""
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

  // Lọc dữ liệu theo nhân viên được chọn
  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmployeeId)
  }, [employees, selectedEmployeeId])

  // Dữ liệu ban đầu (lọc từ props global) - dùng làm fallback cho lần render đầu tiên.
  // Lưu ý: props global bị giới hạn số dòng mặc định của PostgREST nên có thể thiếu.
  const initialAttendanceLogs = useMemo(() => {
    return attendanceLogs.filter((log) => log.employee_id === selectedEmployeeId)
  }, [attendanceLogs, selectedEmployeeId])

  const initialLeaveRequests = useMemo(() => {
    return leaveRequests.filter((req) => req.employee_id === selectedEmployeeId)
  }, [leaveRequests, selectedEmployeeId])

  // Dữ liệu đầy đủ được nạp theo đúng nhân viên đang chọn (không dính giới hạn số dòng).
  const [scopedAttendanceLogs, setScopedAttendanceLogs] = useState<AttendanceLog[] | null>(null)
  const [scopedLeaveRequests, setScopedLeaveRequests] = useState<EmployeeRequestWithRelations[] | null>(null)
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    if (!selectedEmployeeId) return
    let cancelled = false
    setLoadingData(true)
    setScopedAttendanceLogs(null)
    setScopedLeaveRequests(null)
    Promise.all([
      listAttendance({ employee_id: selectedEmployeeId }),
      getAllApprovedLeaveRequests(undefined, undefined, selectedEmployeeId),
    ])
      .then(([logs, requests]) => {
        if (cancelled) return
        setScopedAttendanceLogs(logs as AttendanceLog[])
        setScopedLeaveRequests(requests as EmployeeRequestWithRelations[])
      })
      .finally(() => {
        if (!cancelled) setLoadingData(false)
      })
    return () => {
      cancelled = true
    }
    // Phụ thuộc thêm attendanceLogs/leaveRequests để refetch lại khi server refresh
    // (VD sau khi HR chỉnh sửa chấm công -> router.refresh() cập nhật props mới)
  }, [selectedEmployeeId, attendanceLogs, leaveRequests])

  const filteredAttendanceLogs = scopedAttendanceLogs ?? initialAttendanceLogs
  const filteredLeaveRequests = scopedLeaveRequests ?? initialLeaveRequests

  const filteredSaturdaySchedules = useMemo(() => {
    return saturdaySchedules.filter((sch) => sch.employee_id === selectedEmployeeId)
  }, [saturdaySchedules, selectedEmployeeId])

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
              {importing && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {importProgress || "Đang import..."}
                </div>
              )}
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
                    <th className="px-3 py-1 text-left">Chức vụ</th>
                    <th className="px-3 py-1 text-left">Ngày</th>
                    <th className="px-3 py-1 text-left">Thứ</th>
                    <th className="px-3 py-1 text-left">Vào</th>
                    <th className="px-3 py-1 text-left">Ra</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-1">2</td>
                    <td className="px-3 py-1">Nguyễn Văn A</td>
                    <td className="px-3 py-1">Văn phòng</td>
                    <td className="px-3 py-1">Nhân viên</td>
                    <td className="px-3 py-1">02/01/2026</td>
                    <td className="px-3 py-1">Sáu</td>
                    <td className="px-3 py-1">7:53</td>
                    <td className="px-3 py-1">17:25</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              * Chỉ cần các cột: Mã N.Viên, Ngày (dd/mm/yyyy), Vào, Ra. Các cột khác có thể bỏ qua.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Import Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {importResult?.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Kết quả import
            </DialogTitle>
            <DialogDescription>
              {importResult?.success ? "Import hoàn tất" : "Import thất bại"}
            </DialogDescription>
          </DialogHeader>
          {importResult && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{importResult.total}</div>
                  <div className="text-sm text-muted-foreground">Tổng dòng</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{importResult.imported}</div>
                  <div className="text-sm text-muted-foreground">Đã import</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{importResult.skipped}</div>
                  <div className="text-sm text-muted-foreground">Bỏ qua</div>
                </div>
              </div>
              {importResult.errors.length > 0 && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="font-medium text-red-700 mb-1">Lỗi:</p>
                  <ul className="text-sm text-red-600 space-y-1">
                    {importResult.errors.map((err, i) => (
                      <li key={i}>• {err}</li>
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

      {/* Employee Selector with Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Chọn nhân viên
          </CardTitle>
          <CardDescription>Xem lịch sử chấm công của nhân viên</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedEmployee ? (
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {selectedEmployee.employee_code}
                    </span>
                    <span>-</span>
                    <span>{selectedEmployee.full_name}</span>
                  </span>
                ) : (
                  "Chọn nhân viên..."
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[600px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Tìm theo mã NV, tên, email..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy nhân viên</CommandEmpty>
                  <CommandGroup>
                    {employees.map((emp) => (
                      <CommandItem
                        key={emp.id}
                        value={`${emp.employee_code} ${emp.full_name} ${emp.email || ""}`}
                        onSelect={() => {
                          setSelectedEmployeeId(emp.id)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedEmployeeId === emp.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            {emp.employee_code}
                          </span>
                          <span>-</span>
                          <span>{emp.full_name}</span>
                          {emp.email && (
                            <span className="text-xs text-muted-foreground">
                              ({emp.email})
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Selected Employee Info */}
          {selectedEmployee && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Mã NV:</span>
                  <span className="ml-2 font-medium">{selectedEmployee.employee_code}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Họ tên:</span>
                  <span className="ml-2 font-medium">{selectedEmployee.full_name}</span>
                </div>
                {selectedEmployee.shift && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Ca làm:</span>
                    <span className="ml-2 font-medium">
                      {selectedEmployee.shift.name} (Ca {selectedEmployee.shift.start_time?.slice(0, 5)} - {selectedEmployee.shift.end_time?.slice(0, 5)}
                      {selectedEmployee.shift.break_start && selectedEmployee.shift.break_end && (
                        <>; Nghỉ: {selectedEmployee.shift.break_start.slice(0, 5)} - {selectedEmployee.shift.break_end.slice(0, 5)}</>
                      )})
                    </span>
                  </div>
                )}
                {selectedEmployee.email && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="ml-2 font-medium">{selectedEmployee.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Panel - giống hệt /dashboard/attendance */}
      {selectedEmployee && loadingData && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang tải dữ liệu chấm công của nhân viên...
        </div>
      )}
      {selectedEmployee && (
        <AttendancePanel
          attendanceLogs={filteredAttendanceLogs}
          shift={selectedEmployee.shift}
          leaveRequests={filteredLeaveRequests}
          officialDate={selectedEmployee.official_date}
          holidays={holidays}
          specialDays={specialDays}
          saturdaySchedules={filteredSaturdaySchedules}
          employeeId={selectedEmployeeId}
          editable={canEdit}
        />
      )}
    </div>
  )
}
