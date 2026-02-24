"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { OTSetting, OvertimeRecordWithRelations, EmployeeOTRateWithRelations, Holiday } from "@/lib/types/database"
import { getLastDayOfMonthVN, getNowVN } from "@/lib/utils/date-utils"
import { lunarToSolarDate } from "@/lib/utils/lunar-calendar"

// =============================================
// OT SETTINGS ACTIONS
// =============================================

export async function listOTSettings(): Promise<OTSetting[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("ot_settings")
    .select("*")
    .order("display_order")

  if (error) {
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      console.warn("Bảng ot_settings chưa tồn tại. Vui lòng chạy script 022-overtime-settings.sql")
    } else {
      console.error("Error listing OT settings:", error.message || error)
    }
    return []
  }

  return data || []
}

export async function createOTSetting(input: {
  name: string
  code: string
  multiplier: number
  description?: string
  display_order?: number
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("ot_settings").insert({
    name: input.name,
    code: input.code.toUpperCase(),
    multiplier: input.multiplier,
    description: input.description || null,
    display_order: input.display_order || 0,
    is_active: true,
  })

  if (error) {
    console.error("Error creating OT setting:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/allowances")
  return { success: true }
}

export async function updateOTSetting(
  id: string,
  input: {
    name?: string
    code?: string
    multiplier?: number
    description?: string
    is_active?: boolean
    display_order?: number
  }
) {
  const supabase = await createClient()

  const updateData: any = { ...input }
  if (input.code) {
    updateData.code = input.code.toUpperCase()
  }

  const { error } = await supabase
    .from("ot_settings")
    .update(updateData)
    .eq("id", id)

  if (error) {
    console.error("Error updating OT setting:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/allowances")
  return { success: true }
}

export async function deleteOTSetting(id: string) {
  const supabase = await createClient()

  // Kiểm tra có phiếu OT nào đang dùng không
  const { count } = await supabase
    .from("overtime_records")
    .select("*", { count: "exact", head: true })
    .eq("ot_setting_id", id)

  if (count && count > 0) {
    return { success: false, error: "Không thể xóa loại OT đang có phiếu sử dụng" }
  }

  const { error } = await supabase.from("ot_settings").delete().eq("id", id)

  if (error) {
    console.error("Error deleting OT setting:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/allowances")
  return { success: true }
}

// =============================================
// EMPLOYEE OT RATES ACTIONS (Hệ số riêng cho nhân viên)
// =============================================

export async function listEmployeeOTRates(employee_id: string): Promise<EmployeeOTRateWithRelations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("employee_ot_rates")
    .select(`
      *,
      ot_setting:ot_settings(*)
    `)
    .eq("employee_id", employee_id)
    .order("effective_date", { ascending: false })

  if (error) {
    console.error("Error listing employee OT rates:", error)
    return []
  }

  return (data || []) as EmployeeOTRateWithRelations[]
}

export async function createEmployeeOTRate(input: {
  employee_id: string
  ot_setting_id: string
  multiplier: number
  effective_date: string
  end_date?: string
  note?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("employee_ot_rates").insert({
    employee_id: input.employee_id,
    ot_setting_id: input.ot_setting_id,
    multiplier: input.multiplier,
    effective_date: input.effective_date,
    end_date: input.end_date || null,
    note: input.note || null,
  })

  if (error) {
    console.error("Error creating employee OT rate:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

export async function deleteEmployeeOTRate(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("employee_ot_rates").delete().eq("id", id)

  if (error) {
    console.error("Error deleting employee OT rate:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

// Lấy hệ số OT cho nhân viên (ưu tiên hệ số riêng, fallback về mặc định)
export async function getEmployeeOTMultiplier(
  employeeId: string,
  otSettingId: string,
  date: string
): Promise<number> {
  const supabase = await createClient()

  // Tìm hệ số riêng của nhân viên
  const { data: customRate } = await supabase
    .from("employee_ot_rates")
    .select("multiplier")
    .eq("employee_id", employeeId)
    .eq("ot_setting_id", otSettingId)
    .lte("effective_date", date)
    .or(`end_date.is.null,end_date.gte.${date}`)
    .order("effective_date", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (customRate) {
    return customRate.multiplier
  }

  // Fallback về hệ số mặc định
  const { data: defaultSetting } = await supabase
    .from("ot_settings")
    .select("multiplier")
    .eq("id", otSettingId)
    .single()

  return defaultSetting?.multiplier || 1.5
}

// =============================================
// HOLIDAYS ACTIONS (Ngày lễ)
// =============================================

export async function listHolidays(year?: number): Promise<Holiday[]> {
  const supabase = await createClient()

  let query = supabase
    .from("holidays")
    .select("*")
    .order("holiday_date")

  if (year) {
    query = query.eq("year", year)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error listing holidays:", error)
    return []
  }

  return data || []
}

export async function createHoliday(input: {
  name: string
  holiday_date: string
  year: number
  is_recurring?: boolean
  is_lunar?: boolean
  lunar_month?: number
  lunar_day?: number
  description?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("holidays").insert({
    name: input.name,
    holiday_date: input.holiday_date,
    year: input.year,
    is_recurring: input.is_recurring || false,
    is_lunar: input.is_lunar || false,
    lunar_month: input.lunar_month || null,
    lunar_day: input.lunar_day || null,
    description: input.description || null,
  })

  if (error) {
    console.error("Error creating holiday:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/allowances")
  return { success: true }
}

export async function createHolidayRange(input: {
  name: string
  start_date: string
  end_date: string
  is_recurring?: boolean
  is_lunar?: boolean
  lunar_month?: number
  lunar_day?: number
  lunar_end_day?: number
  description?: string
}) {
  const supabase = await createClient()

  const start = new Date(input.start_date)
  const end = new Date(input.end_date)

  if (end < start) {
    return { success: false, error: "Ngày kết thúc phải sau ngày bắt đầu" }
  }

  const rows: {
    name: string
    holiday_date: string
    year: number
    is_recurring: boolean
    is_lunar: boolean
    lunar_month: number | null
    lunar_day: number | null
    description: string | null
  }[] = []

  let lunarDayCounter = input.lunar_day || 0
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0]
    rows.push({
      name: input.name,
      holiday_date: dateStr,
      year: d.getFullYear(),
      is_recurring: input.is_recurring || false,
      is_lunar: input.is_lunar || false,
      lunar_month: input.lunar_month || null,
      lunar_day: input.is_lunar ? lunarDayCounter : null,
      description: input.description || null,
    })
    lunarDayCounter++
  }

  const { error } = await supabase.from("holidays").insert(rows)

  if (error) {
    console.error("Error creating holiday range:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/allowances")
  return { success: true, count: rows.length }
}

export async function updateHoliday(
  id: string,
  input: {
    name?: string
    holiday_date?: string
    year?: number
    is_recurring?: boolean
    is_lunar?: boolean
    lunar_month?: number | null
    lunar_day?: number | null
    description?: string
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("holidays")
    .update(input)
    .eq("id", id)

  if (error) {
    console.error("Error updating holiday:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/allowances")
  return { success: true }
}

export async function deleteHoliday(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("holidays").delete().eq("id", id)

  if (error) {
    console.error("Error deleting holiday:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/allowances")
  return { success: true }
}

export async function regenerateLunarHolidays(year: number) {
  const supabase = await createClient()

  // Get all lunar-based recurring holidays (get unique lunar dates from any year)
  const { data: lunarHolidays, error: fetchError } = await supabase
    .from("holidays")
    .select("*")
    .eq("is_lunar", true)
    .eq("is_recurring", true)
    .not("lunar_month", "is", null)
    .not("lunar_day", "is", null)

  if (fetchError) {
    console.error("Error fetching lunar holidays:", fetchError)
    return { success: false, error: fetchError.message }
  }

  if (!lunarHolidays || lunarHolidays.length === 0) {
    return { success: true, count: 0 }
  }

  // Group by name to handle date ranges
  const grouped = new Map<string, typeof lunarHolidays>()
  for (const h of lunarHolidays) {
    const key = h.name
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(h)
  }

  // Delete existing lunar entries for this year with same names
  const names = [...grouped.keys()]
  await supabase
    .from("holidays")
    .delete()
    .eq("year", year)
    .eq("is_lunar", true)
    .in("name", names)

  // Create new entries with converted dates
  const rows: {
    name: string
    holiday_date: string
    year: number
    is_recurring: boolean
    is_lunar: boolean
    lunar_month: number
    lunar_day: number
    description: string | null
  }[] = []

  for (const [name, items] of grouped) {
    const lunarDays = [...new Set(items.map(i => `${i.lunar_month}-${i.lunar_day}`))]
    for (const ld of lunarDays) {
      const [lm, ldDay] = ld.split("-").map(Number)
      const solarDate = lunarToSolarDate(ldDay, lm, year)
      if (solarDate) {
        rows.push({
          name,
          holiday_date: solarDate,
          year,
          is_recurring: true,
          is_lunar: true,
          lunar_month: lm,
          lunar_day: ldDay,
          description: items[0].description,
        })
      }
    }
  }

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("holidays").insert(rows)
    if (insertError) {
      console.error("Error regenerating lunar holidays:", insertError)
      return { success: false, error: insertError.message }
    }
  }

  revalidatePath("/dashboard/allowances")
  return { success: true, count: rows.length }
}

// Kiểm tra ngày có phải ngày lễ không
export async function isHoliday(date: string): Promise<boolean> {
  const supabase = await createClient()
  const year = new Date(date).getFullYear()

  const { count } = await supabase
    .from("holidays")
    .select("*", { count: "exact", head: true })
    .eq("holiday_date", date)
    .eq("year", year)

  return (count || 0) > 0
}

// Gợi ý loại OT dựa trên ngày
export async function suggestOTType(date: string): Promise<string> {
  // Kiểm tra ngày lễ
  if (await isHoliday(date)) {
    return "OT_HOLIDAY"
  }

  // Kiểm tra cuối tuần - chỉ Chủ nhật (dayOfWeek = 0) mới tính OT_WEEKEND
  // Thứ 7 (dayOfWeek = 6) tính như ngày thường
  const dayOfWeek = new Date(date).getDay()
  if (dayOfWeek === 0) {
    return "OT_WEEKEND"
  }

  return "OT_NORMAL"
}


// =============================================
// OVERTIME RECORDS ACTIONS
// =============================================

export async function listOvertimeRecords(filters?: {
  employee_id?: string
  month?: number
  year?: number
  status?: string
}): Promise<OvertimeRecordWithRelations[]> {
  const supabase = await createClient()

  let query = supabase
    .from("overtime_records")
    .select(`
      *,
      employee:employees(id, full_name, employee_code, department:departments(name)),
      approver:employees!overtime_records_approver_id_fkey(id, full_name),
      ot_setting:ot_settings(*)
    `)
    .order("ot_date", { ascending: false })

  if (filters?.employee_id) {
    query = query.eq("employee_id", filters.employee_id)
  }

  if (filters?.month && filters?.year) {
    const startDate = `${filters.year}-${String(filters.month).padStart(2, "0")}-01`
    const endDate = getLastDayOfMonthVN(filters.year, filters.month)
    query = query.gte("ot_date", startDate).lte("ot_date", endDate)
  }

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error listing overtime records:", error)
    return []
  }

  return (data || []) as OvertimeRecordWithRelations[]
}

export async function getMyOvertimeRecords(month?: number, year?: number): Promise<OvertimeRecordWithRelations[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return []

  return listOvertimeRecords({
    employee_id: employee.id,
    month,
    year,
  })
}

export async function createOvertimeRecord(input: {
  ot_date: string
  ot_setting_id: string
  hours: number
  reason?: string
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Chưa đăng nhập" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return { success: false, error: "Không tìm thấy nhân viên" }

  const { error } = await supabase.from("overtime_records").insert({
    employee_id: employee.id,
    ot_date: input.ot_date,
    ot_setting_id: input.ot_setting_id,
    hours: input.hours,
    reason: input.reason || null,
    status: "pending",
  })

  if (error) {
    console.error("Error creating overtime record:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/attendance")
  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

export async function createOvertimeRecordForEmployee(input: {
  employee_id: string
  ot_date: string
  ot_setting_id: string
  hours: number
  reason?: string
  status?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("overtime_records").insert({
    employee_id: input.employee_id,
    ot_date: input.ot_date,
    ot_setting_id: input.ot_setting_id,
    hours: input.hours,
    reason: input.reason || null,
    status: input.status || "pending",
  })

  if (error) {
    console.error("Error creating overtime record:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/attendance")
  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

export async function approveOvertimeRecord(id: string, status: "approved" | "rejected", note?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Chưa đăng nhập" }

  const { data: approver } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  const { error } = await supabase
    .from("overtime_records")
    .update({
      status,
      approver_id: approver?.id,
      approved_at: getNowVN(),
      note: note || null,
    })
    .eq("id", id)

  if (error) {
    console.error("Error approving overtime record:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

export async function deleteOvertimeRecord(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("overtime_records")
    .delete()
    .eq("id", id)
    .eq("status", "pending") // Chỉ xóa được pending

  if (error) {
    console.error("Error deleting overtime record:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/attendance")
  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

export async function listPendingOvertimeRecords(): Promise<OvertimeRecordWithRelations[]> {
  return listOvertimeRecords({ status: "pending" })
}

// =============================================
// CALCULATE OT FOR PAYROLL
// =============================================

export async function calculateOvertimePay(
  employeeId: string,
  baseSalary: number,
  standardWorkingDays: number,
  startDate: string,
  endDate: string
): Promise<{
  totalOTHours: number
  totalOTPay: number
  details: Array<{
    date: string
    hours: number
    multiplier: number
    otType: string
    amount: number
  }>
}> {
  const supabase = await createClient()

  console.log(`[OT] Calculating OT for employee ${employeeId} from ${startDate} to ${endDate}`)

  const hourlyRate = baseSalary / standardWorkingDays / 8 // Lương theo giờ
  let totalOTHours = 0
  let totalOTPay = 0
  const details: Array<{
    date: string
    hours: number
    multiplier: number
    otType: string
    amount: number
  }> = []

  // 1. Lấy phiếu tăng ca từ employee_requests (request_type.code = 'overtime')
  // Join thêm request_time_slots cho nhiều khung giờ
  const { data: otRequests } = await supabase
    .from("employee_requests")
    .select(`
      *,
      request_type:request_types!request_type_id(code, name),
      time_slots:request_time_slots(*)
    `)
    .eq("employee_id", employeeId)
    .eq("status", "approved")
    .gte("request_date", startDate)
    .lte("request_date", endDate)

  // Lọc chỉ lấy phiếu overtime
  const overtimeRequests = (otRequests || []).filter(
    (r: any) => r.request_type?.code === "overtime"
  )

  console.log(`[OT] Found ${overtimeRequests.length} approved OT requests from employee_requests`)

  // Xử lý phiếu từ employee_requests
  for (const request of overtimeRequests) {
    // Lấy danh sách khung giờ (ưu tiên request_time_slots, fallback về from_time/to_time)
    const reqTimeSlots = (request as any).time_slots as any[] | null
    const timeSlots: { from_time: string; to_time: string }[] = []
    
    if (reqTimeSlots && reqTimeSlots.length > 0) {
      for (const slot of reqTimeSlots) {
        if (slot.from_time && slot.to_time) {
          timeSlots.push({ from_time: slot.from_time, to_time: slot.to_time })
        }
      }
    } else if (request.from_time && request.to_time) {
      timeSlots.push({ from_time: request.from_time, to_time: request.to_time })
    }

    // Tính tổng số giờ từ tất cả khung giờ
    let hours = 0
    for (const slot of timeSlots) {
      const [fromH, fromM] = slot.from_time.split(":").map(Number)
      const [toH, toM] = slot.to_time.split(":").map(Number)
      let slotHours = (toH * 60 + toM - fromH * 60 - fromM) / 60
      if (slotHours < 0) slotHours += 24 // Qua đêm
      hours += slotHours
    }

    if (hours <= 0) continue

    const otDate = request.request_date
    
    // Xác định loại OT và hệ số dựa trên ngày
    const suggestedType = await suggestOTType(otDate)
    const { data: otSetting } = await supabase
      .from("ot_settings")
      .select("*")
      .eq("code", suggestedType)
      .single()

    // Lấy hệ số (ưu tiên hệ số riêng của nhân viên)
    let multiplier = otSetting?.multiplier || 1.5
    if (otSetting) {
      multiplier = await getEmployeeOTMultiplier(employeeId, otSetting.id, otDate)
    }

    const otType = otSetting?.name || "Tăng ca"
    const amount = hourlyRate * hours * multiplier

    totalOTHours += hours
    totalOTPay += amount

    details.push({
      date: otDate,
      hours,
      multiplier,
      otType,
      amount,
    })
  }

  // 2. Cũng kiểm tra bảng overtime_records (nếu có dùng)
  const { data: otRecords } = await supabase
    .from("overtime_records")
    .select(`
      *,
      ot_setting:ot_settings(name, multiplier, code)
    `)
    .eq("employee_id", employeeId)
    .eq("status", "approved")
    .gte("ot_date", startDate)
    .lte("ot_date", endDate)

  console.log(`[OT] Found ${otRecords?.length || 0} approved OT records from overtime_records`)

  // Xử lý phiếu từ overtime_records (nếu có)
  if (otRecords && otRecords.length > 0) {
    for (const record of otRecords) {
      let multiplier = record.multiplier_used
      
      if (!multiplier) {
        multiplier = await getEmployeeOTMultiplier(employeeId, record.ot_setting_id, record.ot_date)
      }
      
      const otType = (record.ot_setting as any)?.name || "Tăng ca"
      const amount = hourlyRate * record.hours * multiplier

      totalOTHours += record.hours
      totalOTPay += amount

      details.push({
        date: record.ot_date,
        hours: record.hours,
        multiplier,
        otType,
        amount,
      })
    }
  }

  console.log(`[OT] Total: ${totalOTHours}h, ${totalOTPay} VND`)

  return { totalOTHours, totalOTPay, details }
}


// =============================================
// GET OT DATA FOR BREAKDOWN DIALOG
// =============================================

export interface OTBreakdownItem {
  id: string
  date: string
  hours: number
  multiplier: number
  otType: string
  amount: number
  source: "employee_requests" | "overtime_records"
}

export async function getOTBreakdownForPayroll(
  employeeId: string,
  baseSalary: number,
  standardWorkingDays: number,
  month: number,
  year: number
): Promise<OTBreakdownItem[]> {
  const supabase = await createClient()
  
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`
  const endDate = getLastDayOfMonthVN(year, month)
  const hourlyRate = baseSalary / standardWorkingDays / 8

  const items: OTBreakdownItem[] = []

  // 1. Lấy từ employee_requests (join thêm request_time_slots)
  const { data: otRequests } = await supabase
    .from("employee_requests")
    .select(`
      *,
      request_type:request_types!request_type_id(code, name),
      time_slots:request_time_slots(*)
    `)
    .eq("employee_id", employeeId)
    .eq("status", "approved")
    .gte("request_date", startDate)
    .lte("request_date", endDate)

  const overtimeRequests = (otRequests || []).filter(
    (r: any) => r.request_type?.code === "overtime"
  )

  for (const request of overtimeRequests) {
    // Lấy danh sách khung giờ (ưu tiên request_time_slots, fallback về from_time/to_time)
    const reqTimeSlots = (request as any).time_slots as any[] | null
    const timeSlots: { from_time: string; to_time: string }[] = []
    
    if (reqTimeSlots && reqTimeSlots.length > 0) {
      for (const slot of reqTimeSlots) {
        if (slot.from_time && slot.to_time) {
          timeSlots.push({ from_time: slot.from_time, to_time: slot.to_time })
        }
      }
    } else if (request.from_time && request.to_time) {
      timeSlots.push({ from_time: request.from_time, to_time: request.to_time })
    }

    // Tính tổng số giờ từ tất cả khung giờ
    let hours = 0
    for (const slot of timeSlots) {
      const [fromH, fromM] = slot.from_time.split(":").map(Number)
      const [toH, toM] = slot.to_time.split(":").map(Number)
      let slotHours = (toH * 60 + toM - fromH * 60 - fromM) / 60
      if (slotHours < 0) slotHours += 24
      hours += slotHours
    }

    if (hours <= 0) continue

    const otDate = request.request_date
    const suggestedType = await suggestOTType(otDate)
    const { data: otSetting } = await supabase
      .from("ot_settings")
      .select("*")
      .eq("code", suggestedType)
      .single()

    let multiplier = otSetting?.multiplier || 1.5
    if (otSetting) {
      multiplier = await getEmployeeOTMultiplier(employeeId, otSetting.id, otDate)
    }

    items.push({
      id: request.id,
      date: otDate,
      hours,
      multiplier,
      otType: otSetting?.name || "Tăng ca",
      amount: hourlyRate * hours * multiplier,
      source: "employee_requests",
    })
  }

  // 2. Lấy từ overtime_records
  const { data: otRecords } = await supabase
    .from("overtime_records")
    .select(`
      *,
      ot_setting:ot_settings(name, multiplier, code)
    `)
    .eq("employee_id", employeeId)
    .eq("status", "approved")
    .gte("ot_date", startDate)
    .lte("ot_date", endDate)

  if (otRecords) {
    for (const record of otRecords) {
      let multiplier = record.multiplier_used
      if (!multiplier) {
        multiplier = await getEmployeeOTMultiplier(employeeId, record.ot_setting_id, record.ot_date)
      }

      items.push({
        id: record.id,
        date: record.ot_date,
        hours: record.hours,
        multiplier,
        otType: (record.ot_setting as any)?.name || "Tăng ca",
        amount: hourlyRate * record.hours * multiplier,
        source: "overtime_records",
      })
    }
  }

  return items
}
