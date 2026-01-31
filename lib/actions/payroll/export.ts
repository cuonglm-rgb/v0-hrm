"use server"

import { createClient } from "@/lib/supabase/server"
import type { PayrollExportData } from "./types"

// =============================================
// EXPORT PAYROLL TO XLSX
// =============================================

export async function getPayrollExportData(
  payroll_run_id: string,
  employee_ids?: string[]
): Promise<{ success: boolean; data?: PayrollExportData[]; error?: string; month?: number; year?: number }> {
  const supabase = await createClient()

  const { data: payrollRun, error: runError } = await supabase
    .from("payroll_runs")
    .select("*")
    .eq("id", payroll_run_id)
    .single()

  if (runError || !payrollRun) {
    return { success: false, error: "Không tìm thấy bảng lương" }
  }

  let query = supabase
    .from("payroll_items")
    .select(`
      *,
      employee:employees(id, full_name, employee_code, email)
    `)
    .eq("payroll_run_id", payroll_run_id)
    .order("created_at", { ascending: true })

  if (employee_ids && employee_ids.length > 0) {
    query = query.in("employee_id", employee_ids)
  }

  const { data: items, error: itemsError } = await query

  if (itemsError || !items) {
    return { success: false, error: "Không thể lấy dữ liệu lương" }
  }

  const itemIds = items.map((i) => i.id)
  const { data: allAdjustments } = await supabase
    .from("payroll_adjustment_details")
    .select(`
      *,
      adjustment_type:payroll_adjustment_types(id, name, code, category)
    `)
    .in("payroll_item_id", itemIds)

  const adjustmentsByItem = new Map<string, any[]>()
  for (const adj of allAdjustments || []) {
    const list = adjustmentsByItem.get(adj.payroll_item_id) || []
    list.push(adj)
    adjustmentsByItem.set(adj.payroll_item_id, list)
  }

  const employeeIds = items.map((i) => i.employee_id)
  const { data: salaries } = await supabase
    .from("salary_structure")
    .select("*")
    .in("employee_id", employeeIds)
    .order("effective_date", { ascending: false })

  const salaryByEmployee = new Map<string, any>()
  for (const sal of salaries || []) {
    if (!salaryByEmployee.has(sal.employee_id)) {
      salaryByEmployee.set(sal.employee_id, sal)
    }
  }

  const exportData: PayrollExportData[] = []
  let stt = 1

  for (const item of items) {
    const emp = item.employee as any
    const adjustments = adjustmentsByItem.get(item.id) || []
    const salary = salaryByEmployee.get(item.employee_id)

    let tangCaThuong = 0
    let tangCaNgayNghi = 0
    let tangCaNgayLe = 0
    let phuCapThucTe = 0
    let bhxh = 0
    let quy = 0
    let congKhac = 0
    let truKhac = 0
    let truPhuCap = 0

    for (const adj of adjustments) {
      const code = (adj.adjustment_type?.code || "").toUpperCase()
      const category = adj.category

      if (code === "OVERTIME") {
        const reason = adj.reason || ""
        if (reason.includes("ngày lễ")) {
          tangCaNgayLe += adj.final_amount
        } else if (reason.includes("ngày nghỉ") || reason.includes("cuối tuần")) {
          tangCaNgayNghi += adj.final_amount
        } else {
          tangCaThuong += adj.final_amount
        }
      } else if (category === "allowance") {
        if (code.startsWith("MANUAL")) {
          congKhac += adj.final_amount
        } else if (code === "KPI_BONUS") {
          congKhac += adj.final_amount
        } else {
          phuCapThucTe += adj.final_amount
        }
      } else if (category === "deduction") {
        if (code === "SOCIAL_INSURANCE" || code === "BHXH") {
          bhxh += adj.final_amount
        } else if (code === "COMMON_FUND" || code === "FUND" || code === "QUY") {
          quy += adj.final_amount
        } else if (code.startsWith("MANUAL")) {
          truKhac += adj.final_amount
        } else {
          truKhac += adj.final_amount
        }
      } else if (category === "penalty") {
        truPhuCap += adj.final_amount
      }
    }

    const standardDays = item.standard_working_days || 26
    const dailySalary = item.base_salary / standardDays
    const luongThucTe = dailySalary * item.working_days
    const mucPhuCapNgay = salary?.daily_allowance || 0
    const ck = item.net_salary - quy

    exportData.push({
      stt: stt++,
      hoTen: emp?.full_name || "",
      mcc: emp?.employee_code || "",
      ngayCongChuan: standardDays,
      mucLuongThang: item.base_salary,
      mucPhuCapNgay: mucPhuCapNgay,
      congTinhLuong: item.working_days,
      tangCaThuong,
      tangCaNgayNghi,
      tangCaNgayLe,
      phep: item.leave_days || 0,
      truPhuCap,
      luongThucTe,
      phuCapThucTe,
      bhxh,
      congKhac,
      truKhac,
      thucNhan: item.net_salary,
      quy,
      ck,
      email: emp?.email || "",
    })
  }

  return {
    success: true,
    data: exportData,
    month: payrollRun.month,
    year: payrollRun.year,
  }
}
