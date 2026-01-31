"use server"

import { toDateStringVN, getTimePartsVN } from "@/lib/utils/date-utils"
import type { AttendanceViolation, ShiftInfo } from "./types"

// =============================================
// ATTENDANCE VIOLATIONS
// =============================================

export async function getEmployeeViolations(
  supabase: any,
  employeeId: string,
  startDate: string,
  endDate: string,
  shift: ShiftInfo
): Promise<AttendanceViolation[]> {
  const violations: AttendanceViolation[] = []

  // Lấy attendance logs
  const { data: logs } = await supabase
    .from("attendance_logs")
    .select("check_in, check_out")
    .eq("employee_id", employeeId)
    .gte("check_in", startDate)
    .lte("check_in", endDate + "T23:59:59")

  // Lấy danh sách ngày đặc biệt
  const { data: specialWorkDays } = await supabase
    .from("special_work_days")
    .select("*")
    .gte("work_date", startDate)
    .lte("work_date", endDate)

  const specialDayMap = new Map<string, any>()
  for (const day of specialWorkDays || []) {
    specialDayMap.set(day.work_date, day)
  }

  // Lấy phiếu đã approved
  const { data: approvedRequests } = await supabase
    .from("employee_requests")
    .select(`
      request_date,
      request_type:request_types!request_type_id(code)
    `)
    .eq("employee_id", employeeId)
    .eq("status", "approved")
    .gte("request_date", startDate)
    .lte("request_date", endDate)

  const approvedByDate = new Map<string, string[]>()
  for (const req of approvedRequests || []) {
    const reqType = req.request_type as any
    if (reqType?.code) {
      const types = approvedByDate.get(req.request_date) || []
      types.push(reqType.code)
      approvedByDate.set(req.request_date, types)
    }
  }

  if (logs) {
    let breakStartMinutes = 0
    let breakEndMinutes = 0
    if (shift.breakStart && shift.breakEnd) {
      const [bsH, bsM] = shift.breakStart.split(":").map(Number)
      const [beH, beM] = shift.breakEnd.split(":").map(Number)
      breakStartMinutes = bsH * 60 + bsM
      breakEndMinutes = beH * 60 + beM
    }

    for (const log of logs) {
      if (!log.check_in) continue

      const checkInDate = new Date(log.check_in)
      const dateStr = toDateStringVN(checkInDate)
      const { hours: checkInHour, minutes: checkInMin } = getTimePartsVN(checkInDate)
      const checkInMinutes = checkInHour * 60 + checkInMin

      const approvedRequestTypes = approvedByDate.get(dateStr) || []
      const hasApprovedRequest = approvedRequestTypes.length > 0

      // Kiểm tra ngày đặc biệt
      const specialDay = specialDayMap.get(dateStr)
      const isSpecialDay = !!specialDay
      const allowEarlyLeave = specialDay?.allow_early_leave ?? false
      const allowLateArrival = specialDay?.allow_late_arrival ?? false

      let effectiveShiftStart = shift.startTime
      let effectiveShiftEnd = shift.endTime
      if (specialDay?.custom_start_time) {
        effectiveShiftStart = specialDay.custom_start_time.slice(0, 5)
      }
      if (specialDay?.custom_end_time) {
        effectiveShiftEnd = specialDay.custom_end_time.slice(0, 5)
      }

      const [shiftH, shiftM] = effectiveShiftStart.split(":").map(Number)
      const shiftStartMinutes = shiftH * 60 + shiftM
      const [shiftEndH, shiftEndM] = effectiveShiftEnd.split(":").map(Number)
      const shiftEndMinutes = shiftEndH * 60 + shiftEndM

      let checkOutMinutes = 0
      let hasCheckOut = false
      if (log.check_out) {
        const checkOutDate = new Date(log.check_out)
        const { hours: checkOutHour, minutes: checkOutMin } = getTimePartsVN(checkOutDate)
        checkOutMinutes = checkOutHour * 60 + checkOutMin
        hasCheckOut = true
      }

      let isHalfDay = false
      let lateMinutes = 0
      let earlyMinutes = 0
      let forgotCheckOut = false
      
      if (!hasCheckOut) {
        forgotCheckOut = true
        lateMinutes = 0
        earlyMinutes = 0
        isHalfDay = false
      } else if (breakStartMinutes > 0 && breakEndMinutes > 0) {
        if (checkInMinutes >= breakStartMinutes && checkInMinutes <= breakEndMinutes + 15) {
          isHalfDay = true
          lateMinutes = 0
          if (checkOutMinutes >= breakStartMinutes && checkOutMinutes <= breakEndMinutes + 15) {
            earlyMinutes = 0
          } else if (checkOutMinutes < shiftEndMinutes) {
            earlyMinutes = shiftEndMinutes - checkOutMinutes
          }
        } else if (checkInMinutes > breakEndMinutes + 15) {
          lateMinutes = checkInMinutes - breakEndMinutes
          isHalfDay = true
        } else {
          lateMinutes = Math.max(0, checkInMinutes - shiftStartMinutes)
          if (checkOutMinutes <= breakEndMinutes) {
            isHalfDay = true
            earlyMinutes = 0
          } else if (checkOutMinutes < shiftEndMinutes) {
            earlyMinutes = shiftEndMinutes - checkOutMinutes
          }
        }
      } else {
        lateMinutes = Math.max(0, checkInMinutes - shiftStartMinutes)
        if (checkOutMinutes < shiftEndMinutes) {
          earlyMinutes = shiftEndMinutes - checkOutMinutes
        }
      }

      if (isSpecialDay) {
        if (allowLateArrival) lateMinutes = 0
        if (allowEarlyLeave) earlyMinutes = 0
      }

      const finalIsAbsent = hasCheckOut && lateMinutes > 60 && !hasApprovedRequest

      violations.push({
        date: dateStr,
        lateMinutes,
        earlyMinutes,
        isHalfDay,
        isAbsent: finalIsAbsent,
        hasApprovedRequest,
        approvedRequestTypes,
        forgotCheckOut,
        hasCheckIn: true,
        hasCheckOut,
      })
    }
  }

  return violations
}
