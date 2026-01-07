"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { checkIn, checkOut, getMyApprovedLeaveRequests } from "@/lib/actions/attendance-actions"
import type { AttendanceLog, WorkShift, EmployeeRequestWithRelations } from "@/lib/types/database"
import {
  formatDateVN,
  formatTimeVN,
  formatCurrentTimeVN,
  getTodayVN,
  formatSourceVN,
} from "@/lib/utils/date-utils"
import { Clock, LogIn, LogOut, CheckCircle2, XCircle, Timer, AlertTriangle, Filter, Calendar } from "lucide-react"

interface AttendanceViolation {
  type: "late" | "early_leave" | "no_checkin" | "no_checkout"
  minutes?: number
  message: string
}

// Hàm kiểm tra vi phạm chấm công
function checkViolations(
  checkInTime: string | null,
  checkOutTime: string | null,
  shift: WorkShift | null | undefined
): AttendanceViolation[] {
  const violations: AttendanceViolation[] = []

  if (!shift) return violations

  const shiftStart = shift.start_time?.slice(0, 5)
  const shiftEnd = shift.end_time?.slice(0, 5)

  if (!shiftStart || !shiftEnd) return violations

  // Check late arrival
  if (checkInTime) {
    const checkIn = new Date(checkInTime)
    const checkInHHMM = `${String(checkIn.getHours()).padStart(2, "0")}:${String(checkIn.getMinutes()).padStart(2, "0")}`

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
  if (checkOutTime) {
    const checkOut = new Date(checkOutTime)
    const checkOutHHMM = `${String(checkOut.getHours()).padStart(2, "0")}:${String(checkOut.getMinutes()).padStart(2, "0")}`

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
  } else if (checkInTime) {
    violations.push({
      type: "no_checkout",
      message: "Quên chấm công ra",
    })
  }

  return violations
}

// Hàm kiểm tra xem ngày có phải ngày cuối tuần không
// Chủ nhật luôn nghỉ, Thứ 7 xen kẽ theo quy luật
const REFERENCE_DATE = new Date(Date.UTC(2026, 0, 6)) // 6/1/2026
const REFERENCE_WEEK_IS_OFF = true // Tuần này nghỉ thứ 7

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function isSaturdayOff(date: Date): boolean {
  const refWeek = getISOWeekNumber(REFERENCE_DATE)
  const currentWeek = getISOWeekNumber(date)
  
  const refIsOdd = refWeek % 2 === 1
  const currentIsOdd = currentWeek % 2 === 1
  
  if (REFERENCE_WEEK_IS_OFF) {
    return refIsOdd === currentIsOdd
  } else {
    return refIsOdd !== currentIsOdd
  }
}

function isWeekend(date: Date): boolean {
  const day = date.getDay()
  // Chủ nhật luôn nghỉ
  if (day === 0) return true
  // Thứ 7 xen kẽ
  if (day === 6) return isSaturdayOff(date)
  return false
}

// Hàm tạo danh sách ngày làm việc trong khoảng thời gian
function generateWorkingDays(fromDate: Date, toDate: Date): string[] {
  const days: string[] = []
  const current = new Date(fromDate)
  
  while (current <= toDate) {
    // Thêm tất cả các ngày, không loại trừ cuối tuần
    days.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  
  return days
}

// Hàm kiểm tra xem ngày có phiếu nghỉ được duyệt không
function getLeaveRequestForDate(date: string, leaveRequests: EmployeeRequestWithRelations[]) {
  return leaveRequests.find((req) => {
    if (!req.from_date || !req.to_date) return false
    return date >= req.from_date && date <= req.to_date
  })
}

interface AttendancePanelProps {
  attendanceLogs: AttendanceLog[]
  shift?: WorkShift | null
  leaveRequests?: EmployeeRequestWithRelations[]
}

// Tạm ẩn phần chấm công hôm nay - có thể bật lại sau
const SHOW_TODAY_CHECKIN = false

export function AttendancePanel({ attendanceLogs, shift, leaveRequests = [] }: AttendancePanelProps) {
  const [loading, setLoading] = useState<"checkin" | "checkout" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Bộ lọc lịch sử chấm công
  const currentDate = new Date()
  const [filterMonth, setFilterMonth] = useState<string>((currentDate.getMonth() + 1).toString())
  const [filterYear, setFilterYear] = useState<string>(currentDate.getFullYear().toString())
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Cập nhật giờ mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const today = getTodayVN()
  const todayLog = attendanceLogs.find((log) => log.check_in?.startsWith(today))

  const hasCheckedIn = !!todayLog
  const hasCheckedOut = !!todayLog?.check_out

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
      
      // Lọc theo trạng thái
      if (filterStatus !== "all") {
        const violations = checkViolations(log.check_in, log.check_out, shift)
        const hasViolation = violations.length > 0
        
        if (filterStatus === "violation" && !hasViolation) return false
        if (filterStatus === "complete" && (hasViolation || !log.check_out)) return false
        if (filterStatus === "incomplete" && log.check_out) return false
      }
      
      return true
    })
  }, [attendanceLogs, filterMonth, filterYear, filterStatus, shift])

  // Tạo danh sách ngày làm việc kết hợp với attendance logs
  const workingDaysWithAttendance = useMemo(() => {
    // Xác định khoảng thời gian cần hiển thị
    const now = new Date()
    let startDate: Date
    let endDate: Date = now
    
    if (filterMonth !== "all" && filterYear !== "all") {
      const year = parseInt(filterYear)
      const month = parseInt(filterMonth)
      startDate = new Date(year, month - 1, 1)
      endDate = new Date(year, month, 0) // Ngày cuối tháng
    } else if (filterYear !== "all") {
      const year = parseInt(filterYear)
      startDate = new Date(year, 0, 1)
      endDate = new Date(year, 11, 31)
    } else {
      // Mặc định hiển thị 30 ngày gần nhất
      startDate = new Date(now)
      startDate.setDate(startDate.getDate() - 30)
    }
    
    // Tạo danh sách ngày làm việc
    const workingDays = generateWorkingDays(startDate, endDate)
    
    // Kết hợp với attendance logs
    const combined = workingDays.map((date) => {
      const log = filteredLogs.find((l) => l.check_in?.startsWith(date))
      const leaveRequest = getLeaveRequestForDate(date, leaveRequests)
      
      return {
        date,
        log,
        leaveRequest,
      }
    })
    
    // Sắp xếp theo ngày giảm dần
    return combined.reverse()
  }, [filteredLogs, filterMonth, filterYear, leaveRequests])

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

  const handleCheckIn = async () => {
    setLoading("checkin")
    setError(null)
    const result = await checkIn()
    if (!result.success) {
      setError(result.error || "Không thể chấm công vào")
    }
    setLoading(null)
  }

  const handleCheckOut = async () => {
    setLoading("checkout")
    setError(null)
    const result = await checkOut()
    if (!result.success) {
      setError(result.error || "Không thể chấm công ra")
    }
    setLoading(null)
  }

  const getStatusDisplay = () => {
    if (!hasCheckedIn) {
      return {
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        text: "Chưa chấm công vào",
        color: "text-red-600",
      }
    }
    if (hasCheckedIn && !hasCheckedOut) {
      return {
        icon: <Timer className="h-5 w-5 text-blue-500" />,
        text: `Đã vào lúc ${formatTimeVN(todayLog?.check_in)}`,
        color: "text-blue-600",
      }
    }
    return {
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      text: `Hoàn thành - Ra lúc ${formatTimeVN(todayLog?.check_out)}`,
      color: "text-green-600",
    }
  }

  const status = getStatusDisplay()

  return (
    <div className="space-y-6">
      {/* Card chấm công hôm nay - Tạm ẩn */}
      {SHOW_TODAY_CHECKIN && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Chấm công hôm nay
          </CardTitle>
          <CardDescription>
            {formatDateVN(new Date().toISOString())}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Giờ hiện tại & Ca làm */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Giờ hiện tại (Việt Nam)</p>
              <p className="text-2xl font-bold">
                {formatCurrentTimeVN(currentTime)}
              </p>
            </div>
            {shift && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Ca làm việc</p>
                <p className="font-medium">{shift.name}</p>
                <p className="text-sm text-muted-foreground">
                  {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                </p>
              </div>
            )}
          </div>

          {/* Trạng thái */}
          <div className={`flex items-center gap-2 ${status.color}`}>
            {status.icon}
            <span className="font-medium">{status.text}</span>
          </div>

          {/* Nút chấm công */}
          <div className="flex gap-4">
            <Button
              onClick={handleCheckIn}
              disabled={hasCheckedIn || loading === "checkin"}
              className="gap-2"
              size="lg"
            >
              <LogIn className="h-4 w-4" />
              {loading === "checkin" ? "Đang xử lý..." : "Vào làm"}
            </Button>
            <Button
              onClick={handleCheckOut}
              disabled={!hasCheckedIn || hasCheckedOut || loading === "checkout"}
              variant="outline"
              className="gap-2"
              size="lg"
            >
              <LogOut className="h-4 w-4" />
              {loading === "checkout" ? "Đang xử lý..." : "Ra về"}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Tóm tắt hôm nay */}
          {todayLog && (
            <div className="flex gap-6 pt-2 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Giờ vào</p>
                <p className="font-medium">{formatTimeVN(todayLog.check_in)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Giờ ra</p>
                <p className="font-medium">{formatTimeVN(todayLog.check_out)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Lịch sử chấm công */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử chấm công</CardTitle>
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
            <span className="text-sm text-muted-foreground ml-auto">
              {workingDaysWithAttendance.length} bản ghi
            </span>
          </div>

          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Giờ vào</TableHead>
                  <TableHead>Giờ ra</TableHead>
                  <TableHead>Nguồn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workingDaysWithAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Không có dữ liệu chấm công
                    </TableCell>
                  </TableRow>
                ) : (
                  workingDaysWithAttendance.map(({ date, log, leaveRequest }) => {
                    const violations = log ? checkViolations(log.check_in, log.check_out, shift) : []
                    const hasViolation = violations.length > 0
                    const isLate = violations.some((v) => v.type === "late")
                    const isEarlyLeave = violations.some((v) => v.type === "early_leave")
                    const noCheckIn = violations.some((v) => v.type === "no_checkin")
                    const noCheckOut = violations.some((v) => v.type === "no_checkout")
                    
                    // Nếu không có log chấm công
                    const hasNoAttendance = !log
                    const hasApprovedLeave = !!leaveRequest
                    const leaveTypeName = leaveRequest?.request_type?.name || "Nghỉ phép"
                    
                    // Kiểm tra xem có phải ngày nghỉ cuối tuần không
                    const dateObj = new Date(date)
                    const isWeekendDay = isWeekend(dateObj)

                    return (
                      <TableRow key={date} className={hasViolation || (hasNoAttendance && !hasApprovedLeave && !isWeekendDay) ? "bg-red-50" : ""}>
                        <TableCell>{formatDateVN(date)}</TableCell>
                        <TableCell>
                          {hasNoAttendance ? (
                            <span className="text-muted-foreground">-</span>
                          ) : noCheckIn ? (
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
                          {hasNoAttendance ? (
                            <span className="text-muted-foreground">-</span>
                          ) : noCheckOut ? (
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
                          {log ? (
                            <Badge variant="outline">{formatSourceVN(log.source)}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {hasNoAttendance ? (
                            isWeekendDay ? (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                Ngày nghỉ
                              </Badge>
                            ) : hasApprovedLeave ? (
                              <Badge className="bg-blue-100 text-blue-800 gap-1">
                                <Calendar className="h-3 w-3" />
                                {leaveTypeName}
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Nghỉ không phép
                              </Badge>
                            )
                          ) : hasViolation ? (
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
    </div>
  )
}
