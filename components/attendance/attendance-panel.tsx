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
import { checkIn, checkOut } from "@/lib/actions/attendance-actions"
import type { AttendanceLog, WorkShift, EmployeeRequestWithRelations, SpecialWorkDay } from "@/lib/types/database"
import type { Holiday } from "@/lib/actions/attendance-actions"
import type { SaturdaySchedule } from "@/lib/actions/saturday-schedule-actions"
import {
  formatDateVN,
  formatTimeVN,
  formatCurrentTimeVN,
  getTodayVN,
  formatSourceVN,
  calculateLeaveDays,
} from "@/lib/utils/date-utils"
import { calculateLeaveEntitlement } from "@/lib/utils/leave-utils"
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
  shift: WorkShift | null | undefined,
  options?: { isAfternoonOnly?: boolean; isMorningOnly?: boolean }
): AttendanceViolation[] {
  const violations: AttendanceViolation[] = []

  if (!shift) return violations

  const shiftStart = shift.start_time?.slice(0, 5)
  const shiftEnd = shift.end_time?.slice(0, 5)
  const breakStart = shift.break_start?.slice(0, 5) || "12:00"
  const breakEnd = shift.break_end?.slice(0, 5) || "13:00"

  if (!shiftStart || !shiftEnd) return violations

  // Check late arrival
  if (checkInTime) {
    const checkIn = new Date(checkInTime)
    const checkInHHMM = `${String(checkIn.getHours()).padStart(2, "0")}:${String(checkIn.getMinutes()).padStart(2, "0")}`

    // Nếu là làm buổi chiều (nghỉ buổi sáng), so sánh với giờ kết thúc nghỉ trưa thay vì giờ bắt đầu ca
    const compareTime = options?.isAfternoonOnly ? breakEnd : shiftStart
    const [shiftH, shiftM] = compareTime.split(":").map(Number)
    const [checkH, checkM] = checkInHHMM.split(":").map(Number)

    const shiftMinutes = shiftH * 60 + shiftM
    const checkMinutes = checkH * 60 + checkM
    const lateMinutes = checkMinutes - shiftMinutes

    if (lateMinutes > 0) {
      violations.push({
        type: "late",
        minutes: lateMinutes,
        message: options?.isAfternoonOnly
          ? `Đi muộn ${lateMinutes} phút (vào lúc ${checkInHHMM}, ca chiều bắt đầu ${breakEnd})`
          : `Đi muộn ${lateMinutes} phút (vào lúc ${checkInHHMM}, ca bắt đầu ${shiftStart})`,
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

    // Nếu là làm buổi sáng (nghỉ buổi chiều), so sánh với giờ bắt đầu nghỉ trưa thay vì giờ kết thúc ca
    const compareTime = options?.isMorningOnly ? breakStart : shiftEnd
    const [shiftH, shiftM] = compareTime.split(":").map(Number)
    const [checkH, checkM] = checkOutHHMM.split(":").map(Number)

    const shiftMinutes = shiftH * 60 + shiftM
    const checkMinutes = checkH * 60 + checkM
    const earlyMinutes = shiftMinutes - checkMinutes

    if (earlyMinutes > 0) {
      violations.push({
        type: "early_leave",
        minutes: earlyMinutes,
        message: options?.isMorningOnly
          ? `Về sớm ${earlyMinutes} phút (ra lúc ${checkOutHHMM}, ca sáng kết thúc ${breakStart})`
          : `Về sớm ${earlyMinutes} phút (ra lúc ${checkOutHHMM}, ca kết thúc ${shiftEnd})`,
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

// Hàm lấy tên thứ trong tuần
function getDayOfWeekVN(date: string): string {
  const dateObj = new Date(date)
  const dayOfWeek = dateObj.getDay()
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
  return days[dayOfWeek]
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

function isSaturdayOff(date: Date, saturdaySchedules: SaturdaySchedule[] = []): boolean {
  // Format date để so sánh
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  
  // Kiểm tra xem có schedule cho ngày này không
  const schedule = saturdaySchedules.find(s => s.work_date === dateStr)
  
  if (schedule) {
    // Nếu có schedule: is_working = true -> làm việc, is_working = false -> nghỉ
    return !schedule.is_working
  }
  
  // Nếu không có schedule cho ngày này, kiểm tra xem nhân viên có được setup không
  // Nếu có bất kỳ record nào trong saturdaySchedules -> nhân viên được setup -> các thứ 7 khác là nghỉ
  if (saturdaySchedules.length > 0) {
    return true // Nghỉ (vì không có trong danh sách được setup)
  }
  
  // Không có schedule nào -> theo logic xen kẽ mặc định
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

function isWeekend(date: Date, saturdaySchedules: SaturdaySchedule[] = []): boolean {
  const day = date.getDay()
  // Chủ nhật luôn nghỉ
  if (day === 0) return true
  // Thứ 7 xen kẽ hoặc theo lịch tùy chỉnh
  if (day === 6) return isSaturdayOff(date, saturdaySchedules)
  return false
}

// Hàm tạo danh sách ngày làm việc trong khoảng thời gian
function generateWorkingDays(fromDate: Date, toDate: Date): string[] {
  const days: string[] = []
  const current = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate())
  const end = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate())

  while (current <= end) {
    // Format ngày theo YYYY-MM-DD
    const year = current.getFullYear()
    const month = String(current.getMonth() + 1).padStart(2, '0')
    const day = String(current.getDate()).padStart(2, '0')
    days.push(`${year}-${month}-${day}`)
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

// Hàm kiểm tra xem ngày có phải ngày lễ không
function getHolidayForDate(date: string, holidays: Holiday[]): Holiday | undefined {
  return holidays.find((h) => h.holiday_date === date)
}

// Hàm kiểm tra xem ngày có phải ngày đặc biệt không
function getSpecialDayForDate(date: string, specialDays: SpecialWorkDay[]): SpecialWorkDay | undefined {
  return specialDays.find((s) => s.work_date === date)
}

interface AttendancePanelProps {
  attendanceLogs: AttendanceLog[]
  shift?: WorkShift | null
  leaveRequests?: EmployeeRequestWithRelations[]
  officialDate?: string | null
  holidays?: Holiday[]
  specialDays?: SpecialWorkDay[]
  saturdaySchedules?: SaturdaySchedule[]
}

// Tạm ẩn phần chấm công hôm nay - có thể bật lại sau
const SHOW_TODAY_CHECKIN = false

export function AttendancePanel({ attendanceLogs, shift, leaveRequests = [], officialDate = null, holidays = [], specialDays = [], saturdaySchedules = [] }: AttendancePanelProps) {
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
      // Lấy date từ check_in hoặc check_out (trường hợp check_in null - quên chấm công vào)
      const dateSource = log.check_in || log.check_out
      if (!dateSource) return false

      const logDate = new Date(dateSource)
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

  // Tính toán trạng thái quỹ phép cho từng ngày
  const leaveUsageMap = useMemo(() => {
    const map = new Map<string, "ok" | "exceeded">()
    if (!officialDate) return map

    // Nhóm annual leave requests theo năm
    const requestsByYear = new Map<number, typeof leaveRequests>()

    leaveRequests.forEach(req => {
      // Chỉ xét annual leave và đã duyệt
      // Note: logic cũ check code annual_leave hoặc deduct_leave_balance. Assuming "annual_leave" code mostly.
      // Hoặc check req.request_type.deduct_leave_balance
      if (req.status !== 'approved') return
      if (req.request_type?.code !== 'annual_leave' && !req.request_type?.deduct_leave_balance) return

      const year = new Date(req.from_date || req.request_date || "").getFullYear()
      if (!year) return

      const list = requestsByYear.get(year) || []
      list.push(req)
      requestsByYear.set(year, list)
    })

    // Xử lý từng năm
    requestsByYear.forEach((requests, year) => {
      const entitlement = calculateLeaveEntitlement(officialDate, year)
      let used = 0

      // Sort requests by date
      requests.sort((a, b) => (a.from_date || "").localeCompare(b.from_date || ""))

      requests.forEach(req => {
        const from = req.from_date || req.request_date
        const to = req.to_date || req.request_date
        if (!from) return

        // Calculate days for this request
        // We need simpler logic to just assign status to DATES.
        // If a request spans multiple days, we iterate them.

        const days = calculateLeaveDays(
          req.from_date,
          req.to_date,
          req.from_time,
          req.to_time,
          {
            requires_date_range: req.request_type?.requires_date_range,
            requires_single_date: req.request_type?.requires_single_date
          }
        )

        // Check current usage BEFORE adding (or AFTER? usually consecutive days matter)
        // If current used < entitlement, but used + days > entitlement => some days ok, some exceeded.

        // Let's iterate day by day for this request to be precise
        const current = new Date(from)
        const end = new Date(to || from)

        // Is this a partial day request?
        const isPartial = days < 1
        const dailyCost = isPartial ? days : 1
        // Note: If multi-day request has times (partial start/end), it's complex.
        // Simplified: Multi-day usually full days. Single day can be partial.

        while (current <= end) {
          const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`

          // Add cost
          used += dailyCost

          if (used > entitlement) {
            map.set(dateStr, "exceeded")
          } else {
            map.set(dateStr, "ok")
          }

          current.setDate(current.getDate() + 1)
        }
      })
    })

    return map
  }, [leaveRequests, officialDate])

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
      // Tìm log theo check_in hoặc check_out (trường hợp check_in null - quên chấm công vào)
      const log = filteredLogs.find((l) => 
        l.check_in?.startsWith(date) || l.check_out?.startsWith(date)
      )
      const leaveRequest = getLeaveRequestForDate(date, leaveRequests)
      const holiday = getHolidayForDate(date, holidays)
      const specialDay = getSpecialDayForDate(date, specialDays)

      return {
        date,
        log,
        leaveRequest,
        holiday,
        specialDay,
      }
    })

    // Lọc theo trạng thái
    const filtered = combined.filter(({ date, log, leaveRequest, holiday, specialDay }) => {
      if (filterStatus === "all") return true

      const dateObj = new Date(date)
      const isWeekendDay = isWeekend(dateObj, saturdaySchedules)
      const hasApprovedLeave = !!leaveRequest
      const isHolidayDay = !!holiday
      const isCompanyHoliday = specialDay?.is_company_holiday

      // Nếu filter "Hoàn thành", loại bỏ ngày nghỉ
      if (filterStatus === "complete") {
        // Loại bỏ ngày lễ, cuối tuần, ngày nghỉ công ty
        if (isHolidayDay || isWeekendDay || isCompanyHoliday) return false
        // Loại bỏ ngày có phiếu nghỉ được duyệt (nghỉ cả ngày)
        if (hasApprovedLeave && !log) return false
        // Chỉ hiển thị ngày có checkout và không có vi phạm
        const violations = log ? checkViolations(log.check_in, log.check_out, shift) : []
        return log && log.check_out && violations.length === 0
      }

      // Logic lọc khác giữ nguyên
      if (filterStatus === "incomplete") {
        return log && !log.check_out
      }

      if (filterStatus === "violation") {
        const violations = log ? checkViolations(log.check_in, log.check_out, shift) : []
        return violations.length > 0
      }

      return true
    })

    // Sắp xếp theo ngày giảm dần
    return filtered.reverse()
  }, [filteredLogs, filterMonth, filterYear, leaveRequests, holidays, specialDays, saturdaySchedules, filterStatus, shift])

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
                <SelectTrigger className="w-[110px]">
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
                  <TableHead>Thứ</TableHead>
                  <TableHead>Giờ vào</TableHead>
                  <TableHead>Giờ ra</TableHead>
                  <TableHead>Nguồn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workingDaysWithAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Không có dữ liệu chấm công
                    </TableCell>
                  </TableRow>
                ) : (
                  workingDaysWithAttendance.map(({ date, log, leaveRequest, holiday, specialDay }) => {
                    // Kiểm tra nếu là làm nửa ngày (check in/out trong giờ nghỉ trưa) - cần xác định trước khi gọi checkViolations
                    let isHalfDayWork = false
                    let isAfternoonOnly = false // Nghỉ buổi sáng, làm buổi chiều
                    let isMorningOnly = false // Làm buổi sáng, nghỉ buổi chiều
                    if (log && log.check_in && log.check_out && shift) {
                      const checkInDate = new Date(log.check_in)
                      const checkOutDate = new Date(log.check_out)
                      const checkInMinutes = checkInDate.getHours() * 60 + checkInDate.getMinutes()
                      const checkOutMinutes = checkOutDate.getHours() * 60 + checkOutDate.getMinutes()

                      const breakStart = shift.break_start?.slice(0, 5) || "12:00"
                      const breakEnd = shift.break_end?.slice(0, 5) || "13:00"
                      const [bsH, bsM] = breakStart.split(":").map(Number)
                      const [beH, beM] = breakEnd.split(":").map(Number)
                      const breakStartMinutes = bsH * 60 + bsM
                      const breakEndMinutes = beH * 60 + beM

                      // Trường hợp 1: Nghỉ buổi chiều - check in trước nghỉ trưa và check out trong/trước nghỉ trưa
                      if (checkInMinutes < breakStartMinutes && checkOutMinutes <= breakEndMinutes) {
                        isHalfDayWork = true
                        isMorningOnly = true
                      }
                      // Trường hợp 2: Nghỉ buổi sáng - check in trong giờ nghỉ trưa và check out sau giờ nghỉ trưa (làm buổi chiều)
                      else if (checkInMinutes >= breakStartMinutes && checkInMinutes <= breakEndMinutes + 15 &&
                        checkOutMinutes > breakEndMinutes) {
                        isHalfDayWork = true
                        isAfternoonOnly = true
                      }
                      // Trường hợp 3: Check in và check out đều trong giờ nghỉ trưa (hiếm gặp)
                      else if (checkInMinutes >= breakStartMinutes && checkInMinutes <= breakEndMinutes + 15 &&
                        checkOutMinutes >= breakStartMinutes && checkOutMinutes <= breakEndMinutes + 15) {
                        isHalfDayWork = true
                      }
                    }

                    const violations = log ? checkViolations(log.check_in, log.check_out, shift, { isAfternoonOnly, isMorningOnly }) : []
                    const hasViolation = violations.length > 0
                    const isLate = violations.some((v) => v.type === "late")
                    const isEarlyLeave = violations.some((v) => v.type === "early_leave")
                    const noCheckIn = violations.some((v) => v.type === "no_checkin")
                    const noCheckOut = violations.some((v) => v.type === "no_checkout")

                    // Nếu không có log chấm công
                    const hasNoAttendance = !log
                    const hasApprovedLeave = !!leaveRequest
                    const leaveTypeName = leaveRequest?.request_type?.name || "Nghỉ phép"

                    // Kiểm tra xem có phải ngày lễ không
                    const isHolidayDay = !!holiday
                    const holidayName = holiday?.name || "Nghỉ lễ"

                    // Kiểm tra xem có phải ngày nghỉ cuối tuần không
                    const dateObj = new Date(date)
                    const isWeekendDay = isWeekend(dateObj, saturdaySchedules)

                    // Kiểm tra ngày tương lai
                    const isFutureDate = dateObj > new Date()

                    return (
                      <TableRow
                        key={date}
                        className={
                          isHalfDayWork
                            ? "bg-yellow-50"
                            : hasViolation || (hasNoAttendance && !hasApprovedLeave && !isWeekendDay && !isHolidayDay && !isFutureDate)
                              ? "bg-red-50"
                              : ""
                        }
                      >
                        <TableCell>{formatDateVN(date)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {getDayOfWeekVN(date)}
                          </Badge>
                        </TableCell>
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
                          ) : isHalfDayWork ? (
                            <span className="text-yellow-600 font-medium">{formatTimeVN(log.check_in)}</span>
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
                          ) : isHalfDayWork ? (
                            <span className="text-yellow-600 font-medium">{formatTimeVN(log.check_out)}</span>
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
                            specialDay?.is_company_holiday ? (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge className="bg-purple-100 text-purple-800 gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Ngày nghỉ công ty
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>{specialDay.reason}</TooltipContent>
                              </Tooltip>
                            ) : isHolidayDay ? (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge className="bg-purple-100 text-purple-800 gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Nghỉ lễ
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>{holidayName}</TooltipContent>
                              </Tooltip>
                            ) : isWeekendDay ? (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                Ngày nghỉ
                              </Badge>
                            ) : hasApprovedLeave ? (
                              <Badge className={
                                leaveUsageMap.get(date) === "exceeded"
                                  ? "bg-red-100 text-red-800 gap-1"
                                  : "bg-blue-100 text-blue-800 gap-1"
                              }>
                                <Calendar className="h-3 w-3" />
                                {leaveUsageMap.get(date) === "exceeded" ? "Quỹ phép hết" : leaveTypeName}
                              </Badge>
                            ) : dateObj > new Date() ? (
                              // Ngày tương lai - không hiển thị gì
                              <span className="text-muted-foreground">-</span>
                            ) : (
                              <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Nghỉ không phép
                              </Badge>
                            )
                          ) : isHalfDayWork ? (
                            hasApprovedLeave ? (
                              <Badge className={
                                leaveUsageMap.get(date) === "exceeded"
                                  ? "bg-red-100 text-red-800 gap-1"
                                  : "bg-yellow-100 text-yellow-800 gap-1"
                              }>
                                <Calendar className="h-3 w-3" />
                                {leaveUsageMap.get(date) === "exceeded" ? "Quỹ phép hết" : "Nghỉ nửa ngày phép năm"}
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800 gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Nghỉ nửa ngày không phép
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
