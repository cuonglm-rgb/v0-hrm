"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCalculationLog(payroll_item_id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payroll_items")
    .select("calculation_log, employee:employees(full_name, employee_code)")
    .eq("id", payroll_item_id)
    .single()

  if (error || !data) {
    return { success: false, error: "Không tìm thấy log tính lương" }
  }

  return {
    success: true,
    log: data.calculation_log || "Chưa có log tính lương",
    employee: data.employee as { full_name: string; employee_code: string }
  }
}
