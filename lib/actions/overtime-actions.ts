"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { OTSetting, OvertimeRecordWithRelations } from "@/lib/types/database"

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

  revalidatePath("/dashboard/organization")
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

  revalidatePath("/dashboard/organization")
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

  revalidatePath("/dashboard/organization")
  revalidatePath("/dashboard/allowances")
  return { success: true }
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
    const endDate = new Date(filters.year, filters.month, 0).toISOString().split("T")[0]
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
      approved_at: new Date().toISOString(),
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

  const { data: records } = await supabase
    .from("overtime_records")
    .select(`
      *,
      ot_setting:ot_settings(name, multiplier)
    `)
    .eq("employee_id", employeeId)
    .eq("status", "approved")
    .gte("ot_date", startDate)
    .lte("ot_date", endDate)

  if (!records || records.length === 0) {
    return { totalOTHours: 0, totalOTPay: 0, details: [] }
  }

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

  for (const record of records) {
    const multiplier = (record.ot_setting as any)?.multiplier || 1.5
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

  return { totalOTHours, totalOTPay, details }
}
