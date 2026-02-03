"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { SpecialWorkDay, SpecialWorkDayWithEmployees } from "@/lib/types/database"
import { getNowVN } from "@/lib/utils/date-utils"

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
}) {
  const supabase = await createClient()

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
  }
) {
  const supabase = await createClient()

  // Tách employee_ids ra khỏi data trước khi update
  const { employee_ids, ...updateData } = data

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
    // Xóa tất cả nhân viên cũ
    await supabase
      .from("special_work_day_employees")
      .delete()
      .eq("special_work_day_id", id)

    // Thêm nhân viên mới (nếu có)
    if (employee_ids.length > 0) {
      const employeeRecords = employee_ids.map(empId => ({
        special_work_day_id: id,
        employee_id: empId,
      }))

      const { error: empError } = await supabase
        .from("special_work_day_employees")
        .insert(employeeRecords)

      if (empError) {
        console.error("Error updating employees for special work day:", empError)
      }
    }
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
