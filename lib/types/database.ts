export type EmployeeStatus = "onboarding" | "active" | "resigned"

export type RoleCode = "admin" | "hr" | "manager" | "employee"

export interface Department {
  id: string
  name: string
  code: string | null
  parent_id: string | null
  created_at: string
}

export interface Position {
  id: string
  name: string
  level: number
  created_at: string
}

export interface Role {
  id: string
  code: RoleCode
  name: string
  description: string | null
  created_at: string
}

export interface Employee {
  id: string
  user_id: string | null
  employee_code: string | null
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  department_id: string | null
  position_id: string | null
  manager_id: string | null
  shift_id: string | null
  join_date: string | null
  status: EmployeeStatus
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role_id: string
  department_id: string | null
  created_at: string
}

// Extended types with relations
export interface EmployeeWithRelations extends Employee {
  department?: Department | null
  position?: Position | null
  manager?: Employee | null
  shift?: WorkShift | null
}

export interface UserRoleWithRelations extends UserRole {
  role: Role
}

// =============================================
// EXTENDED TYPES (theo doc CORE HRM)
// =============================================

export type LeaveStatus = "pending" | "approved" | "rejected"
export type LeaveType = "annual" | "sick" | "unpaid" | "maternity" | "other"
export type PayrollStatus = "draft" | "locked" | "paid"

// Work Shift
export interface WorkShift {
  id: string
  name: string
  start_time: string
  end_time: string
  break_minutes: number
  created_at: string
}

export interface EmployeeJobHistory {
  id: string
  employee_id: string
  department_id: string | null
  position_id: string | null
  salary: number | null
  start_date: string
  end_date: string | null
  created_at: string
}

export interface AttendanceLog {
  id: string
  employee_id: string
  check_in: string | null
  check_out: string | null
  source: string | null
  note: string | null
  created_at: string
}

export interface LeaveRequest {
  id: string
  employee_id: string
  leave_type: LeaveType
  from_date: string
  to_date: string
  reason: string | null
  status: LeaveStatus
  approver_id: string | null
  approved_at: string | null
  created_at: string
}

export interface PayrollRun {
  id: string
  month: number
  year: number
  status: PayrollStatus
  note: string | null
  created_by: string | null
  created_at: string
}

export interface PayrollItem {
  id: string
  payroll_run_id: string
  employee_id: string
  working_days: number
  leave_days: number
  unpaid_leave_days: number
  base_salary: number
  allowances: number
  total_income: number
  total_deduction: number
  net_salary: number
  note: string | null
  created_at: string
}

// Salary Structure (lịch sử lương)
export interface SalaryStructure {
  id: string
  employee_id: string
  base_salary: number
  allowance: number
  effective_date: string
  note: string | null
  created_at: string
}

// Extended types with relations
export interface EmployeeJobHistoryWithRelations extends EmployeeJobHistory {
  department?: Department | null
  position?: Position | null
}

export interface AttendanceLogWithRelations extends AttendanceLog {
  employee?: Employee | null
}

export interface LeaveRequestWithRelations extends LeaveRequest {
  employee?: Employee | null
  approver?: Employee | null
}

export interface PayrollItemWithRelations extends PayrollItem {
  employee?: Employee | null
  payroll_run?: PayrollRun | null
}


// =============================================
// ALLOWANCE TYPES
// =============================================

export type AllowanceCalculationType = "fixed" | "daily"

export interface AllowanceDeductionRules {
  deduct_on_absent?: boolean      // Trừ khi nghỉ làm
  deduct_on_late?: boolean        // Trừ khi đi muộn
  late_grace_count?: number       // Số lần đi muộn được miễn
  late_threshold_minutes?: number // Muộn bao nhiêu phút tính là đi muộn
  full_deduct_threshold?: number  // Số lần vi phạm để mất toàn bộ
}

export interface AllowanceType {
  id: string
  name: string
  code: string | null
  amount: number
  calculation_type: AllowanceCalculationType
  is_deductible: boolean
  deduction_rules: AllowanceDeductionRules | null
  description: string | null
  is_active: boolean
  created_at: string
}

export interface EmployeeAllowance {
  id: string
  employee_id: string
  allowance_type_id: string
  custom_amount: number | null
  effective_date: string
  end_date: string | null
  note: string | null
  created_at: string
}

export interface EmployeeAllowanceWithType extends EmployeeAllowance {
  allowance_type?: AllowanceType | null
}

export interface PayrollAllowanceDetail {
  id: string
  payroll_item_id: string
  allowance_type_id: string
  base_amount: number
  deducted_amount: number
  final_amount: number
  deduction_reason: string | null
  late_count: number
  absent_days: number
  created_at: string
}

export interface PayrollAllowanceDetailWithType extends PayrollAllowanceDetail {
  allowance_type?: AllowanceType | null
}
