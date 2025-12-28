"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type {
  PayrollRun,
  PayrollItemWithRelations,
  SalaryStructure,
} from "@/lib/types/database"

const STANDARD_WORKING_DAYS = 26 // Công chuẩn VN

// =============================================
// EMPLOYEE ACTIONS
// =============================================

export async function getMyPayslips(): Promise<PayrollItemWithRelations[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return []

  const { data, error } = await supabase
    .from("payroll_items")
    .select(
      `
      *,
      payroll_run:payroll_runs(*)
    `
    )
    .eq("employee_id", employee.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payslips:", error)
    return []
  }

  return (data || []) as PayrollItemWithRelations[]
}

// =============================================
// HR ACTIONS - PAYROLL RUNS
// =============================================

export async function listPayrollRuns(): Promise<PayrollRun[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payroll_runs")
    .select("*")
    .order("year", { ascending: false })
    .order("month", { ascending: false })

  if (error) {
    console.error("Error listing payroll runs:", error)
    return []
  }

  return data || []
}

export async function getPayrollRun(id: string): Promise<PayrollRun | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payroll_runs")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching payroll run:", error)
    return null
  }

  return data
}

export async function getPayrollItems(
  payroll_run_id: string
): Promise<PayrollItemWithRelations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payroll_items")
    .select(
      `
      *,
      employee:employees(id, full_name, employee_code, department_id, department:departments(name))
    `
    )
    .eq("payroll_run_id", payroll_run_id)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching payroll items:", error)
    return []
  }

  return (data || []) as PayrollItemWithRelations[]
}

// =============================================
// HR ACTIONS - GENERATE PAYROLL
// =============================================

export async function generatePayroll(month: number, year: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Chưa đăng nhập" }

  // Kiểm tra đã có payroll run chưa
  const { data: existingRun } = await supabase
    .from("payroll_runs")
    .select("id, status")
    .eq("month", month)
    .eq("year", year)
    .single()

  if (existingRun) {
    if (existingRun.status !== "draft") {
      return { success: false, error: "Bảng lương tháng này đã khóa, không thể tạo lại" }
    }
    // Xóa payroll items cũ để tạo lại
    await supabase.from("payroll_items").delete().eq("payroll_run_id", existingRun.id)
    await supabase.from("payroll_runs").delete().eq("id", existingRun.id)
  }

  // Tạo payroll run mới
  const { data: run, error: runError } = await supabase
    .from("payroll_runs")
    .insert({
      month,
      year,
      status: "draft",
      created_by: user.id,
    })
    .select()
    .single()

  if (runError) {
    console.error("Error creating payroll run:", runError)
    return { success: false, error: runError.message }
  }

  // Lấy danh sách nhân viên active hoặc onboarding (không tính resigned)
  const { data: employees, error: empError } = await supabase
    .from("employees")
    .select("id, full_name, employee_code")
    .in("status", ["active", "onboarding"])

  if (empError) {
    console.error("Error fetching employees:", empError)
    return { success: false, error: "Lỗi khi lấy danh sách nhân viên: " + empError.message }
  }

  if (!employees || employees.length === 0) {
    return { success: false, error: "Không có nhân viên. Vui lòng kiểm tra trạng thái nhân viên." }
  }

  console.log(`Found ${employees.length} employees (active/onboarding)`)

  // Tính ngày đầu và cuối tháng
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`
  const endDate = new Date(year, month, 0).toISOString().split("T")[0]

  // Tạo payroll items cho từng nhân viên
  let processedCount = 0
  for (const emp of employees) {
    // Lấy lương hiệu lực
    const { data: salary } = await supabase
      .from("salary_structure")
      .select("*")
      .eq("employee_id", emp.id)
      .lte("effective_date", endDate)
      .order("effective_date", { ascending: false })
      .limit(1)
      .maybeSingle()

    // Nếu không có salary structure, vẫn tạo payroll item với lương = 0
    const baseSalary = salary?.base_salary || 0
    const allowance = salary?.allowance || 0

    console.log(`Processing ${emp.full_name}: base=${baseSalary}, allowance=${allowance}`)

    // Đếm ngày công (có check_in)
    const { count: workingDaysCount } = await supabase
      .from("attendance_logs")
      .select("*", { count: "exact", head: true })
      .eq("employee_id", emp.id)
      .gte("check_in", startDate)
      .lte("check_in", endDate + "T23:59:59")

    // Đếm ngày nghỉ phép (approved)
    const { data: leaveRequests } = await supabase
      .from("leave_requests")
      .select("from_date, to_date, leave_type")
      .eq("employee_id", emp.id)
      .eq("status", "approved")
      .lte("from_date", endDate)
      .gte("to_date", startDate)

    let leaveDays = 0
    let unpaidLeaveDays = 0

    if (leaveRequests) {
      for (const leave of leaveRequests) {
        // Tính số ngày nghỉ trong tháng
        const leaveStart = new Date(
          Math.max(new Date(leave.from_date).getTime(), new Date(startDate).getTime())
        )
        const leaveEnd = new Date(
          Math.min(new Date(leave.to_date).getTime(), new Date(endDate).getTime())
        )
        const days =
          Math.ceil((leaveEnd.getTime() - leaveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1

        if (leave.leave_type === "unpaid") {
          unpaidLeaveDays += days
        } else {
          leaveDays += days // Nghỉ có lương
        }
      }
    }

    const workingDays = workingDaysCount || 0
    const dailySalary = baseSalary / STANDARD_WORKING_DAYS

    // Tính lương
    // Gross = (lương ngày * ngày công) + (lương ngày * ngày nghỉ có lương) + phụ cấp
    const grossSalary = dailySalary * workingDays + dailySalary * leaveDays + allowance

    // Khấu trừ = lương ngày * ngày nghỉ không lương
    const deduction = dailySalary * unpaidLeaveDays

    // Net = Gross - Khấu trừ
    const netSalary = grossSalary - deduction

    const { error: insertError } = await supabase.from("payroll_items").insert({
      payroll_run_id: run.id,
      employee_id: emp.id,
      working_days: workingDays,
      leave_days: leaveDays,
      unpaid_leave_days: unpaidLeaveDays,
      base_salary: baseSalary,
      allowances: allowance,
      total_income: grossSalary,
      total_deduction: deduction,
      net_salary: netSalary,
    })

    if (insertError) {
      console.error(`Error inserting payroll item for ${emp.full_name}:`, insertError)
    } else {
      processedCount++
    }
  }

  console.log(`Processed ${processedCount}/${employees.length} employees`)

  revalidatePath("/dashboard/payroll")
  return { success: true, data: run, message: `Đã tạo bảng lương cho ${processedCount} nhân viên` }
}

// =============================================
// HR ACTIONS - LOCK/UNLOCK PAYROLL
// =============================================

export async function lockPayroll(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("payroll_runs")
    .update({ status: "locked" })
    .eq("id", id)
    .eq("status", "draft")

  if (error) {
    console.error("Error locking payroll:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/payroll")
  return { success: true }
}

export async function markPayrollPaid(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("payroll_runs")
    .update({ status: "paid" })
    .eq("id", id)
    .eq("status", "locked")

  if (error) {
    console.error("Error marking payroll as paid:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/payroll")
  return { success: true }
}

export async function deletePayrollRun(id: string) {
  const supabase = await createClient()

  // Chỉ xóa được draft
  const { error } = await supabase
    .from("payroll_runs")
    .delete()
    .eq("id", id)
    .eq("status", "draft")

  if (error) {
    console.error("Error deleting payroll run:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/payroll")
  return { success: true }
}

// =============================================
// HR ACTIONS - SALARY STRUCTURE
// =============================================

export async function listSalaryStructure(
  employee_id: string
): Promise<SalaryStructure[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("salary_structure")
    .select("*")
    .eq("employee_id", employee_id)
    .order("effective_date", { ascending: false })

  if (error) {
    console.error("Error listing salary structure:", error)
    return []
  }

  return data || []
}

export async function createSalaryStructure(input: {
  employee_id: string
  base_salary: number
  allowance?: number
  effective_date: string
  note?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("salary_structure").insert({
    employee_id: input.employee_id,
    base_salary: input.base_salary,
    allowance: input.allowance || 0,
    effective_date: input.effective_date,
    note: input.note,
  })

  if (error) {
    console.error("Error creating salary structure:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

export async function getMySalary(): Promise<SalaryStructure | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return null

  const { data } = await supabase
    .from("salary_structure")
    .select("*")
    .eq("employee_id", employee.id)
    .order("effective_date", { ascending: false })
    .limit(1)
    .single()

  return data || null
}
