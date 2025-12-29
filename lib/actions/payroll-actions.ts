"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type {
  PayrollRun,
  PayrollItemWithRelations,
  SalaryStructure,
  PayrollAdjustmentType,
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
// HR ACTIONS - GENERATE PAYROLL (với phụ cấp, quỹ, phạt)
// =============================================

interface AttendanceViolation {
  date: string
  lateMinutes: number
  earlyMinutes: number
  hasApprovedRequest: boolean
}

async function getEmployeeViolations(
  supabase: any,
  employeeId: string,
  startDate: string,
  endDate: string,
  shiftStartTime: string
): Promise<AttendanceViolation[]> {
  const violations: AttendanceViolation[] = []

  // Lấy attendance logs
  const { data: logs } = await supabase
    .from("attendance_logs")
    .select("check_in, check_out")
    .eq("employee_id", employeeId)
    .gte("check_in", startDate)
    .lte("check_in", endDate + "T23:59:59")

  // Lấy time adjustment requests đã approved
  const { data: approvedRequests } = await supabase
    .from("time_adjustment_requests")
    .select("request_date")
    .eq("employee_id", employeeId)
    .eq("status", "approved")
    .gte("request_date", startDate)
    .lte("request_date", endDate)

  const approvedDates = new Set((approvedRequests || []).map((r: any) => r.request_date))

  if (logs) {
    const [shiftH, shiftM] = shiftStartTime.split(":").map(Number)
    const shiftMinutes = shiftH * 60 + shiftM

    for (const log of logs) {
      if (!log.check_in) continue

      const checkInDate = new Date(log.check_in)
      const dateStr = checkInDate.toISOString().split("T")[0]
      const checkInHour = checkInDate.getHours()
      const checkInMin = checkInDate.getMinutes()
      const checkInMinutes = checkInHour * 60 + checkInMin

      const lateMinutes = Math.max(0, checkInMinutes - shiftMinutes)

      violations.push({
        date: dateStr,
        lateMinutes,
        earlyMinutes: 0, // TODO: tính về sớm nếu cần
        hasApprovedRequest: approvedDates.has(dateStr),
      })
    }
  }

  return violations
}

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
    // Xóa payroll items và adjustment details cũ
    await supabase.from("payroll_adjustment_details").delete().in(
      "payroll_item_id",
      (await supabase.from("payroll_items").select("id").eq("payroll_run_id", existingRun.id)).data?.map((i: any) => i.id) || []
    )
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

  // Lấy danh sách nhân viên active hoặc onboarding
  const { data: employees, error: empError } = await supabase
    .from("employees")
    .select("id, full_name, employee_code, shift_id")
    .in("status", ["active", "onboarding"])

  if (empError || !employees || employees.length === 0) {
    return { success: false, error: "Không có nhân viên. Vui lòng kiểm tra trạng thái nhân viên." }
  }

  // Lấy các loại điều chỉnh active
  const { data: adjustmentTypes } = await supabase
    .from("payroll_adjustment_types")
    .select("*")
    .eq("is_active", true)

  // Lấy work shifts
  const { data: shifts } = await supabase.from("work_shifts").select("*")
  const shiftMap = new Map((shifts || []).map((s: any) => [s.id, s]))

  // Tính ngày đầu và cuối tháng
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`
  const endDate = new Date(year, month, 0).toISOString().split("T")[0]

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

    const baseSalary = salary?.base_salary || 0
    const salaryAllowance = salary?.allowance || 0
    const dailySalary = baseSalary / STANDARD_WORKING_DAYS

    // Đếm ngày công
    const { count: workingDaysCount } = await supabase
      .from("attendance_logs")
      .select("*", { count: "exact", head: true })
      .eq("employee_id", emp.id)
      .gte("check_in", startDate)
      .lte("check_in", endDate + "T23:59:59")

    // Đếm ngày nghỉ phép
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
        const leaveStart = new Date(Math.max(new Date(leave.from_date).getTime(), new Date(startDate).getTime()))
        const leaveEnd = new Date(Math.min(new Date(leave.to_date).getTime(), new Date(endDate).getTime()))
        const days = Math.ceil((leaveEnd.getTime() - leaveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1

        if (leave.leave_type === "unpaid") {
          unpaidLeaveDays += days
        } else {
          leaveDays += days
        }
      }
    }

    const workingDays = workingDaysCount || 0

    // Lấy shift của nhân viên
    const shift = emp.shift_id ? shiftMap.get(emp.shift_id) : null
    const shiftStartTime = shift?.start_time?.slice(0, 5) || "08:00"

    // Lấy vi phạm chấm công
    const violations = await getEmployeeViolations(supabase, emp.id, startDate, endDate, shiftStartTime)
    const lateCount = violations.filter((v) => v.lateMinutes > 0).length

    // Lấy các điều chỉnh được gán cho nhân viên
    const { data: empAdjustments } = await supabase
      .from("employee_adjustments")
      .select("*, adjustment_type:payroll_adjustment_types(*)")
      .eq("employee_id", emp.id)
      .lte("effective_date", endDate)
      .or(`end_date.is.null,end_date.gte.${startDate}`)

    // =============================================
    // TÍNH TOÁN PHỤ CẤP, KHẤU TRỪ, PHẠT
    // =============================================
    let totalAllowances = salaryAllowance // Phụ cấp từ salary structure
    let totalDeductions = 0
    let totalPenalties = 0
    const adjustmentDetails: any[] = []

    // Xử lý các loại điều chỉnh tự động
    if (adjustmentTypes) {
      for (const adjType of adjustmentTypes as PayrollAdjustmentType[]) {
        if (!adjType.is_auto_applied) continue

        const rules = adjType.auto_rules
        if (!rules) continue

        if (adjType.category === "allowance") {
          // Phụ cấp ăn trưa - tính theo ngày công
          if (adjType.calculation_type === "daily") {
            let eligibleDays = workingDays

            // Trừ ngày nghỉ
            if (rules.deduct_on_absent) {
              eligibleDays -= unpaidLeaveDays
            }

            // Trừ nếu đi muộn quá số lần cho phép
            if (rules.deduct_on_late && rules.late_grace_count !== undefined) {
              const excessLateDays = Math.max(0, lateCount - rules.late_grace_count)
              eligibleDays -= excessLateDays
            }

            eligibleDays = Math.max(0, eligibleDays)
            const amount = eligibleDays * adjType.amount

            if (amount > 0) {
              totalAllowances += amount
              adjustmentDetails.push({
                adjustment_type_id: adjType.id,
                category: "allowance",
                base_amount: workingDays * adjType.amount,
                adjusted_amount: (workingDays - eligibleDays) * adjType.amount,
                final_amount: amount,
                reason: `${eligibleDays} ngày x ${adjType.amount.toLocaleString()}đ`,
                occurrence_count: eligibleDays,
              })
            }
          }

          // Phụ cấp chuyên cần - mất toàn bộ nếu vi phạm
          if (adjType.calculation_type === "fixed" && rules.full_deduct_threshold !== undefined) {
            const shouldDeduct = lateCount > rules.full_deduct_threshold || unpaidLeaveDays > 0
            if (!shouldDeduct) {
              totalAllowances += adjType.amount
              adjustmentDetails.push({
                adjustment_type_id: adjType.id,
                category: "allowance",
                base_amount: adjType.amount,
                adjusted_amount: 0,
                final_amount: adjType.amount,
                reason: "Đủ điều kiện chuyên cần",
                occurrence_count: 1,
              })
            } else {
              adjustmentDetails.push({
                adjustment_type_id: adjType.id,
                category: "allowance",
                base_amount: adjType.amount,
                adjusted_amount: adjType.amount,
                final_amount: 0,
                reason: `Mất phụ cấp: đi muộn ${lateCount} lần, nghỉ không phép ${unpaidLeaveDays} ngày`,
                occurrence_count: 0,
              })
            }
          }
        }

        // Phạt đi muộn - đọc threshold từ auto_rules
        if (adjType.category === "penalty" && rules.trigger === "late") {
          const thresholdMinutes = rules.late_threshold_minutes || 30
          const exemptWithRequest = rules.exempt_with_request !== false // Mặc định là true

          // Lọc các ngày vi phạm theo threshold từ database
          const penaltyDays = violations.filter((v) => {
            if (v.lateMinutes <= thresholdMinutes) return false
            if (exemptWithRequest && v.hasApprovedRequest) return false
            return true
          })

          for (const v of penaltyDays) {
            let penaltyAmount = 0
            if (rules.penalty_type === "half_day_salary") {
              penaltyAmount = dailySalary / 2
            } else if (rules.penalty_type === "full_day_salary") {
              penaltyAmount = dailySalary
            } else if (rules.penalty_type === "fixed_amount") {
              penaltyAmount = adjType.amount
            }

            totalPenalties += penaltyAmount
            adjustmentDetails.push({
              adjustment_type_id: adjType.id,
              category: "penalty",
              base_amount: penaltyAmount,
              adjusted_amount: 0,
              final_amount: penaltyAmount,
              reason: `Đi muộn ${v.lateMinutes} phút ngày ${v.date}`,
              occurrence_count: 1,
            })
          }
        }
      }
    }

    // Xử lý các điều chỉnh được gán thủ công cho nhân viên
    if (empAdjustments) {
      for (const empAdj of empAdjustments) {
        const adjType = empAdj.adjustment_type as PayrollAdjustmentType
        if (!adjType || adjType.is_auto_applied) continue // Bỏ qua auto-applied (đã xử lý ở trên)

        const amount = empAdj.custom_amount || adjType.amount

        if (adjType.category === "allowance") {
          totalAllowances += amount
        } else if (adjType.category === "deduction") {
          // Tính BHXH theo % lương cơ bản
          let finalAmount = amount
          if (adjType.auto_rules?.calculate_from === "base_salary" && adjType.auto_rules?.percentage) {
            finalAmount = (baseSalary * adjType.auto_rules.percentage) / 100
          }
          totalDeductions += finalAmount
          adjustmentDetails.push({
            adjustment_type_id: adjType.id,
            category: "deduction",
            base_amount: amount,
            adjusted_amount: 0,
            final_amount: finalAmount,
            reason: adjType.name,
            occurrence_count: 1,
          })
        } else if (adjType.category === "penalty") {
          totalPenalties += amount
        }
      }
    }

    // =============================================
    // TÍNH LƯƠNG CUỐI CÙNG
    // =============================================
    const grossSalary = dailySalary * workingDays + dailySalary * leaveDays + totalAllowances
    const totalDeduction = dailySalary * unpaidLeaveDays + totalDeductions + totalPenalties
    const netSalary = grossSalary - totalDeduction

    // Insert payroll item
    const { data: payrollItem, error: insertError } = await supabase
      .from("payroll_items")
      .insert({
        payroll_run_id: run.id,
        employee_id: emp.id,
        working_days: workingDays,
        leave_days: leaveDays,
        unpaid_leave_days: unpaidLeaveDays,
        base_salary: baseSalary,
        allowances: totalAllowances,
        total_income: grossSalary,
        total_deduction: totalDeduction,
        net_salary: netSalary,
        note: totalPenalties > 0 
          ? `Đi muộn: ${lateCount} lần, Phạt: ${adjustmentDetails.filter(d => d.category === 'penalty').length} lần`
          : `Đi muộn: ${lateCount} lần`,
      })
      .select()
      .single()

    if (insertError) {
      console.error(`Error inserting payroll item for ${emp.full_name}:`, insertError)
    } else {
      processedCount++

      // Insert adjustment details
      if (payrollItem && adjustmentDetails.length > 0) {
        const detailsWithItemId = adjustmentDetails.map((d) => ({
          ...d,
          payroll_item_id: payrollItem.id,
        }))
        await supabase.from("payroll_adjustment_details").insert(detailsWithItemId)
      }
    }
  }

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

// =============================================
// PAYROLL ADJUSTMENT DETAILS
// =============================================

export async function getPayrollAdjustmentDetails(payroll_item_id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payroll_adjustment_details")
    .select(`
      *,
      adjustment_type:payroll_adjustment_types(id, name, code, category)
    `)
    .eq("payroll_item_id", payroll_item_id)
    .order("category")

  if (error) {
    console.error("Error fetching adjustment details:", error)
    return []
  }

  return data || []
}
