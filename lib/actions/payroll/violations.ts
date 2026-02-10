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

  // Lấy attendance logs - bao gồm cả logs có check_in và logs chỉ có check_out (quên check_in)
  const { data: logs } = await supabase
    .from("attendance_logs")
    .select("check_in, check_out")
    .eq("employee_id", employeeId)
    .or(`and(check_in.gte.${startDate},check_in.lte.${endDate}T23:59:59),and(check_out.gte.${startDate},check_out.lte.${endDate}T23:59:59)`)

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
      request_time,
      request_type:request_types!request_type_id(code)
    `)
    .eq("employee_id", employeeId)
    .eq("status", "approved")
    .gte("request_date", startDate)
    .lte("request_date", endDate)

  const approvedByDate = new Map<string, string[]>()
  // Map để lưu giờ trong phiếu quên chấm công (để bổ sung check_in/check_out)
  const forgotCheckinTimeByDate = new Map<string, string>()
  const forgotCheckoutTimeByDate = new Map<string, string>()
  
  console.log(`[Violations] Tìm thấy ${approvedRequests?.length || 0} phiếu đã duyệt`)
  
  for (const req of approvedRequests || []) {
    const reqType = req.request_type as any
    if (reqType?.code) {
      const types = approvedByDate.get(req.request_date) || []
      types.push(reqType.code)
      approvedByDate.set(req.request_date, types)
      
      // Lưu giờ trong phiếu quên chấm công
      if (reqType.code === "forgot_checkin" && req.request_time) {
        forgotCheckinTimeByDate.set(req.request_date, req.request_time)
        console.log(`[Violations] Phiếu quên chấm công đến ngày ${req.request_date} lúc ${req.request_time}`)
      }
      if (reqType.code === "forgot_checkout" && req.request_time) {
        forgotCheckoutTimeByDate.set(req.request_date, req.request_time)
        console.log(`[Violations] Phiếu quên chấm công về ngày ${req.request_date} lúc ${req.request_time}`)
      }
    }
  }

  if (logs) {
    console.log(`[Violations] Xử lý ${logs.length} attendance logs`)
    
    let breakStartMinutes = 0
    let breakEndMinutes = 0
    if (shift.breakStart && shift.breakEnd) {
      const [bsH, bsM] = shift.breakStart.split(":").map(Number)
      const [beH, beM] = shift.breakEnd.split(":").map(Number)
      breakStartMinutes = bsH * 60 + bsM
      breakEndMinutes = beH * 60 + beM
    }

    for (const log of logs) {
      // Xác định ngày của log - ưu tiên check_in, nếu không có thì dùng check_out
      let dateStr: string
      let checkInDate: Date | null = null
      let checkInMinutes = 0
      let hasCheckIn = false
      
      if (log.check_in) {
        checkInDate = new Date(log.check_in)
        dateStr = toDateStringVN(checkInDate)
        const { hours: checkInHour, minutes: checkInMin } = getTimePartsVN(checkInDate)
        checkInMinutes = checkInHour * 60 + checkInMin
        hasCheckIn = true
      } else if (log.check_out) {
        // Trường hợp chỉ có check_out (quên check_in)
        const checkOutDate = new Date(log.check_out)
        dateStr = toDateStringVN(checkOutDate)
        
        // Dùng giờ trong phiếu quên chấm công đến (nếu có)
        const forgotCheckinTime = forgotCheckinTimeByDate.get(dateStr)
        if (forgotCheckinTime) {
          const [hour, minute] = forgotCheckinTime.split(":").map(Number)
          checkInMinutes = hour * 60 + minute
          hasCheckIn = true
          console.log(`[Violations] Ngày ${dateStr}: Dùng giờ từ phiếu forgot_checkin: ${forgotCheckinTime} (${checkInMinutes} phút)`)
        }
      } else {
        // Không có cả check_in và check_out - bỏ qua
        continue
      }

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
      } else {
        // Nếu không có check_out nhưng có phiếu quên chấm công về đã duyệt
        // thì dùng giờ trong phiếu làm check_out
        const forgotCheckoutTime = forgotCheckoutTimeByDate.get(dateStr)
        if (forgotCheckoutTime) {
          const [hour, minute] = forgotCheckoutTime.split(":").map(Number)
          checkOutMinutes = hour * 60 + minute
          hasCheckOut = true
          console.log(`[Violations] Ngày ${dateStr}: Dùng giờ từ phiếu forgot_checkout: ${forgotCheckoutTime} (${checkOutMinutes} phút)`)
        }
      }

      let isHalfDay = false
      let lateMinutes = 0
      let earlyMinutes = 0
      let forgotCheckOut = false
      let forgotCheckIn = false
      
      // Kiểm tra xem có phiếu quên chấm công không
      const hasForgotCheckinRequest = forgotCheckinTimeByDate.has(dateStr)
      const hasForgotCheckoutRequest = forgotCheckoutTimeByDate.has(dateStr)
      
      console.log(`[Violations] Ngày ${dateStr}: check_in=${log.check_in ? 'có' : 'không'}, check_out=${log.check_out ? 'có' : 'không'}, phiếu_checkin=${hasForgotCheckinRequest}, phiếu_checkout=${hasForgotCheckoutRequest}`)
      
      // ƯU TIÊN: Nếu có phiếu quên chấm công được duyệt → TÍNH LÀ VI PHẠM
      if (hasForgotCheckinRequest) {
        forgotCheckIn = true
        console.log(`[Violations] Ngày ${dateStr}: Có phiếu quên chấm công đến - TÍNH LÀ VI PHẠM`)
        lateMinutes = 0
        earlyMinutes = 0
        isHalfDay = false
      } else if (hasForgotCheckoutRequest) {
        forgotCheckOut = true
        console.log(`[Violations] Ngày ${dateStr}: Có phiếu quên chấm công về - TÍNH LÀ VI PHẠM`)
        lateMinutes = 0
        earlyMinutes = 0
        isHalfDay = false
      }
      // Nếu không có phiếu, kiểm tra check_in/check_out gốc
      else if (!log.check_in) {
        forgotCheckIn = true
        lateMinutes = 0
        earlyMinutes = 0
        isHalfDay = false
      } 
      else if (!log.check_out) {
        forgotCheckOut = true
        lateMinutes = 0
        earlyMinutes = 0
        isHalfDay = false
      } else {
        // Có đủ check_in và check_out - áp dụng logic 120 phút cho mỗi ca
        const THRESHOLD_MINUTES = 120
        
        // Tính vi phạm cho mỗi ca
        let morningSessionValid = true  // Ca sáng có hợp lệ không
        let afternoonSessionValid = true // Ca chiều có hợp lệ không
        
        if (breakStartMinutes > 0 && breakEndMinutes > 0) {
          // === CA SÁNG: từ shiftStart đến breakStart ===
          // Kiểm tra đi muộn ca sáng
          const morningLateMinutes = Math.max(0, checkInMinutes - shiftStartMinutes)
          
          // Kiểm tra về sớm ca sáng (nếu checkout trước giờ nghỉ trưa)
          let morningEarlyMinutes = 0
          if (checkOutMinutes < breakStartMinutes) {
            morningEarlyMinutes = breakStartMinutes - checkOutMinutes
          }
          
          // Ca sáng không hợp lệ nếu muộn hoặc về sớm quá 120 phút
          if (morningLateMinutes > THRESHOLD_MINUTES || morningEarlyMinutes > THRESHOLD_MINUTES) {
            morningSessionValid = false
          }
          
          // === CA CHIỀU: từ breakEnd đến shiftEnd ===
          // Kiểm tra đi muộn ca chiều (nếu checkin sau giờ nghỉ trưa)
          let afternoonLateMinutes = 0
          if (checkInMinutes > breakEndMinutes) {
            afternoonLateMinutes = checkInMinutes - breakEndMinutes
          }
          
          // Kiểm tra về sớm ca chiều
          let afternoonEarlyMinutes = 0
          // Nếu checkout trước hoặc trong giờ nghỉ trưa → không làm ca chiều
          if (checkOutMinutes <= breakEndMinutes) {
            // Coi như không làm ca chiều, set về sớm = vô cùng để đánh dấu ca không hợp lệ
            afternoonEarlyMinutes = 999999
          } else if (checkOutMinutes < shiftEndMinutes) {
            // Checkout sau giờ nghỉ nhưng trước giờ tan ca
            afternoonEarlyMinutes = shiftEndMinutes - checkOutMinutes
          }
          
          // Ca chiều không hợp lệ nếu muộn hoặc về sớm quá 120 phút
          if (afternoonLateMinutes > THRESHOLD_MINUTES || afternoonEarlyMinutes > THRESHOLD_MINUTES) {
            afternoonSessionValid = false
          }
          
          // Xác định isHalfDay dựa trên ca nào hợp lệ
          if (!morningSessionValid && !afternoonSessionValid) {
            // Cả 2 ca đều không hợp lệ → vắng mặt, KHÔNG tính phạt
            isHalfDay = false
            lateMinutes = 0
            earlyMinutes = 0
          } else if (!morningSessionValid) {
            // Chỉ ca chiều hợp lệ → làm nửa ngày chiều
            // Ca sáng không tính công → KHÔNG phạt ca sáng
            isHalfDay = true
            lateMinutes = afternoonLateMinutes
            earlyMinutes = afternoonEarlyMinutes
          } else if (!afternoonSessionValid) {
            // Chỉ ca sáng hợp lệ → làm nửa ngày sáng
            // Ca chiều không tính công → KHÔNG phạt ca chiều
            isHalfDay = true
            lateMinutes = morningLateMinutes
            earlyMinutes = morningEarlyMinutes
            console.log(`[Violations] Ngày ${dateStr}: Chỉ làm ca sáng (checkout lúc ${Math.floor(checkOutMinutes/60)}:${String(checkOutMinutes%60).padStart(2,'0')})`)
          } else {
            // Cả 2 ca đều hợp lệ → làm cả ngày
            isHalfDay = false
            lateMinutes = morningLateMinutes
            
            // Tính về sớm nếu checkout trước giờ tan ca
            if (checkOutMinutes < shiftEndMinutes) {
              earlyMinutes = shiftEndMinutes - checkOutMinutes
            }
          }
        } else {
          // Không có giờ nghỉ trưa → tính như cũ
          lateMinutes = Math.max(0, checkInMinutes - shiftStartMinutes)
          if (checkOutMinutes < shiftEndMinutes) {
            earlyMinutes = shiftEndMinutes - checkOutMinutes
          }
        }
      }

      if (isSpecialDay) {
        if (allowLateArrival) lateMinutes = 0
        if (allowEarlyLeave) earlyMinutes = 0
      }

      const finalIsAbsent = hasCheckOut && hasCheckIn && lateMinutes > 60 && !hasApprovedRequest

      violations.push({
        date: dateStr,
        lateMinutes,
        earlyMinutes,
        isHalfDay,
        isAbsent: finalIsAbsent,
        hasApprovedRequest,
        approvedRequestTypes,
        forgotCheckIn,
        forgotCheckOut,
        hasCheckIn,
        hasCheckOut,
      })
    }
  }

  return violations
}
