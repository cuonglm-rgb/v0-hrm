"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { SpecialWorkDay, SpecialWorkDayWithEmployees } from "@/lib/types/database"
import { getNowVN } from "@/lib/utils/date-utils"
import { isOffByCompanyDefault } from "@/lib/utils/makeup-utils"
import { getSaturdayDefaultConfig } from "./work-schedule-settings-actions"

const WEEKDAY_NAMES_VN = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]

function formatDMY(dateStr: string): string {
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

function makeupReason(holidayDate: string, holidayReason: string): string {
  return `Làm bù cho ngày nghỉ ${formatDMY(holidayDate)} (${holidayReason})`
}

/**
 * Kiểm tra ngày làm bù cho ngày nghỉ công ty `holidayDate`.
 * Ngày làm bù phải đang là ngày nghỉ theo lịch mặc định (CN / T7 nghỉ), không phải ngày lễ,
 * và chưa có ngày đặc biệt nào khác (special_work_days.work_date là UNIQUE).
 * `ownMakeupId`: dòng làm bù hiện tại của ngày nghỉ này (khi sửa) — được phép trùng chính nó.
 */
async function validateMakeupDate(
  supabase: Awaited<ReturnType<typeof createClient>>,
  makeupDate: string,
  holidayDate: string,
  ownMakeupId?: string | null
): Promise<string | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(makeupDate)) return "Ngày làm bù không hợp lệ"
  if (makeupDate === holidayDate) return "Ngày làm bù phải khác ngày nghỉ"

  const saturdayConfig = await getSaturdayDefaultConfig()
  if (!isOffByCompanyDefault(makeupDate, saturdayConfig)) {
    const dow = new Date(makeupDate + "T00:00:00Z").getUTCDay()
    return `Ngày làm bù phải là ngày nghỉ theo lịch (Chủ nhật hoặc Thứ 7 nghỉ) — bạn đang chọn ${formatDMY(makeupDate)} (${WEEKDAY_NAMES_VN[dow]})`
  }

  const { data: holiday } = await supabase
    .from("holidays")
    .select("name")
    .eq("holiday_date", makeupDate)
    .maybeSingle()
  if (holiday) return `Ngày ${formatDMY(makeupDate)} là ngày lễ (${holiday.name}), không thể làm bù`

  const { data: existing } = await supabase
    .from("special_work_days")
    .select("id, reason")
    .eq("work_date", makeupDate)
    .maybeSingle()
  if (existing && existing.id !== ownMakeupId) {
    return `Ngày ${formatDMY(makeupDate)} đã có ngày đặc biệt khác (${existing.reason})`
  }

  return null
}

// Thay danh sách nhân viên áp dụng của 1 ngày đặc biệt (rỗng = toàn công ty)
async function replaceAssignedEmployees(
  supabase: Awaited<ReturnType<typeof createClient>>,
  specialWorkDayId: string,
  employeeIds: string[]
) {
  await supabase
    .from("special_work_day_employees")
    .delete()
    .eq("special_work_day_id", specialWorkDayId)

  if (employeeIds.length === 0) return

  const { error } = await supabase
    .from("special_work_day_employees")
    .insert(employeeIds.map(empId => ({ special_work_day_id: specialWorkDayId, employee_id: empId })))

  if (error) {
    console.error("Error updating employees for special work day:", error)
  }
}

export async function listSpecialWorkDays(year?: number): Promise<SpecialWorkDayWithEmployees[]> {
  const supabase = await createClient()

  let query = supabase
    .from("special_work_days")
    .select(`
      *,
      assigned_employees:special_work_day_employees(
        employee_id,
        employee:employees(id, full_name, employee_code)
      )
    `)
    .order("work_date", { ascending: false })

  if (year) {
    query = query
      .gte("work_date", `${year}-01-01`)
      .lte("work_date", `${year}-12-31`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error listing special work days:", error)
    return []
  }

  return (data || []) as SpecialWorkDayWithEmployees[]
}

export async function getSpecialWorkDay(date: string): Promise<SpecialWorkDay | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("special_work_days")
    .select("*")
    .eq("work_date", date)
    .single()

  if (error) {
    return null
  }

  return data as SpecialWorkDay
}

export async function createSpecialWorkDay(data: {
  work_date: string
  reason: string
  allow_early_leave?: boolean
  allow_late_arrival?: boolean
  is_company_holiday?: boolean
  custom_start_time?: string | null
  custom_end_time?: string | null
  note?: string | null
  employee_ids?: string[] // Danh sách nhân viên áp dụng (nếu rỗng = toàn công ty)
  makeup_date?: string | null // Ngày làm bù cho ngày nghỉ công ty (nếu có)
}) {
  const supabase = await createClient()

  const makeupDate = data.is_company_holiday ? data.makeup_date || null : null
  if (makeupDate) {
    const makeupError = await validateMakeupDate(supabase, makeupDate, data.work_date)
    if (makeupError) return { success: false, error: makeupError }
  }

  // Get current employee
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return { success: false, error: "Employee not found" }

  const { data: created, error } = await supabase.from("special_work_days").insert({
    work_date: data.work_date,
    reason: data.reason,
    allow_early_leave: data.allow_early_leave ?? true,
    allow_late_arrival: data.allow_late_arrival ?? false,
    is_company_holiday: data.is_company_holiday ?? false,
    custom_start_time: data.custom_start_time || null,
    custom_end_time: data.custom_end_time || null,
    note: data.note || null,
    created_by: employee.id,
  }).select().single()

  if (error) {
    console.error("Error creating special work day:", error)
    return { success: false, error: error.message }
  }

  // Nếu có danh sách nhân viên được chọn, lưu vào bảng junction
  if (data.employee_ids && data.employee_ids.length > 0 && created) {
    const employeeRecords = data.employee_ids.map(empId => ({
      special_work_day_id: created.id,
      employee_id: empId,
    }))

    const { error: empError } = await supabase
      .from("special_work_day_employees")
      .insert(employeeRecords)

    if (empError) {
      console.error("Error adding employees to special work day:", empError)
      // Không return lỗi vì ngày đặc biệt đã được tạo thành công
    }
  }

  // Ngày làm bù: dòng riêng trỏ về ngày nghỉ, cùng phạm vi nhân viên, tính như ngày công bình thường
  if (makeupDate && created) {
    const { data: makeup, error: makeupError } = await supabase.from("special_work_days").insert({
      work_date: makeupDate,
      reason: makeupReason(data.work_date, data.reason),
      allow_early_leave: false,
      allow_late_arrival: false,
      is_company_holiday: false,
      is_makeup_workday: true,
      makeup_for_id: created.id,
      created_by: employee.id,
    }).select("id").single()

    if (makeupError || !makeup) {
      console.error("Error creating makeup work day:", makeupError)
      // Không để lại ngày nghỉ thiếu ngày làm bù
      await supabase.from("special_work_days").delete().eq("id", created.id)
      return { success: false, error: makeupError?.message || "Không tạo được ngày làm bù" }
    }

    await replaceAssignedEmployees(supabase, makeup.id, data.employee_ids || [])
  }

  revalidatePath("/dashboard/attendance-management")
  return { success: true, id: created?.id }
}

export async function updateSpecialWorkDay(
  id: string,
  data: {
    reason?: string
    allow_early_leave?: boolean
    allow_late_arrival?: boolean
    is_company_holiday?: boolean
    custom_start_time?: string | null
    custom_end_time?: string | null
    note?: string | null
    employee_ids?: string[] // Danh sách nhân viên áp dụng (nếu rỗng = toàn công ty)
    makeup_date?: string | null // Ngày làm bù (null = bỏ làm bù, undefined = giữ nguyên)
  }
) {
  const supabase = await createClient()

  // Tách employee_ids, makeup_date ra khỏi data trước khi update
  const { employee_ids, makeup_date, ...updateData } = data

  const { data: current, error: currentError } = await supabase
    .from("special_work_days")
    .select("id, work_date, reason, is_company_holiday, created_by")
    .eq("id", id)
    .single()

  if (currentError || !current) {
    return { success: false, error: currentError?.message || "Không tìm thấy ngày đặc biệt" }
  }

  const { data: existingMakeup } = await supabase
    .from("special_work_days")
    .select("id")
    .eq("makeup_for_id", id)
    .maybeSingle()

  // Ngày làm bù chỉ đi kèm ngày nghỉ công ty: bỏ ngày nghỉ công ty thì bỏ luôn làm bù
  const isCompanyHoliday = updateData.is_company_holiday ?? current.is_company_holiday
  const nextMakeupDate = isCompanyHoliday ? makeup_date : null
  if (nextMakeupDate) {
    const makeupError = await validateMakeupDate(supabase, nextMakeupDate, current.work_date, existingMakeup?.id)
    if (makeupError) return { success: false, error: makeupError }
  }

  const { error } = await supabase
    .from("special_work_days")
    .update({ ...updateData, updated_at: getNowVN() })
    .eq("id", id)

  if (error) {
    console.error("Error updating special work day:", error)
    return { success: false, error: error.message }
  }

  // Cập nhật danh sách nhân viên áp dụng
  if (employee_ids !== undefined) {
    await replaceAssignedEmployees(supabase, id, employee_ids)
  }

  // Cập nhật ngày làm bù
  let makeupId: string | null = existingMakeup?.id ?? null
  if (nextMakeupDate === null && existingMakeup) {
    await supabase.from("special_work_days").delete().eq("id", existingMakeup.id)
    makeupId = null
  } else if (nextMakeupDate) {
    const makeupFields = {
      work_date: nextMakeupDate,
      reason: makeupReason(current.work_date, updateData.reason ?? current.reason),
      updated_at: getNowVN(),
    }
    if (existingMakeup) {
      const { error: makeupError } = await supabase
        .from("special_work_days")
        .update(makeupFields)
        .eq("id", existingMakeup.id)
      if (makeupError) {
        console.error("Error updating makeup work day:", makeupError)
        return { success: false, error: makeupError.message }
      }
    } else {
      const { data: makeup, error: makeupError } = await supabase.from("special_work_days").insert({
        ...makeupFields,
        allow_early_leave: false,
        allow_late_arrival: false,
        is_company_holiday: false,
        is_makeup_workday: true,
        makeup_for_id: id,
        created_by: current.created_by,
      }).select("id").single()
      if (makeupError || !makeup) {
        console.error("Error creating makeup work day:", makeupError)
        return { success: false, error: makeupError?.message || "Không tạo được ngày làm bù" }
      }
      makeupId = makeup.id
    }
  } else if (existingMakeup && updateData.reason !== undefined) {
    // Giữ ngày làm bù, chỉ đồng bộ lý do
    await supabase
      .from("special_work_days")
      .update({ reason: makeupReason(current.work_date, updateData.reason), updated_at: getNowVN() })
      .eq("id", existingMakeup.id)
  }

  // Ngày làm bù luôn cùng phạm vi nhân viên với ngày nghỉ
  if (makeupId) {
    const scopeIds = employee_ids !== undefined
      ? employee_ids
      : ((await supabase
          .from("special_work_day_employees")
          .select("employee_id")
          .eq("special_work_day_id", id)).data || []).map(r => r.employee_id as string)
    await replaceAssignedEmployees(supabase, makeupId, scopeIds)
  }

  revalidatePath("/dashboard/attendance-management")
  return { success: true }
}

export async function deleteSpecialWorkDay(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("special_work_days")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting special work day:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/attendance-management")
  return { success: true }
}
