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
  break_start: string | null
  break_end: string | null
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
// PAYROLL ADJUSTMENT TYPES
// =============================================

export type AdjustmentCategory = "allowance" | "deduction" | "penalty"
export type AdjustmentCalculationType = "fixed" | "daily" | "per_occurrence"
export type ExemptRequestType = "late_arrival" | "early_leave" | "half_day_leave"

export interface AdjustmentAutoRules {
  trigger?: "attendance" | "late" | "absent"
  deduct_on_absent?: boolean
  deduct_on_late?: boolean
  late_grace_count?: number
  late_threshold_minutes?: number
  full_deduct_threshold?: number
  penalty_type?: "half_day_salary" | "full_day_salary" | "fixed_amount"
  exempt_with_request?: boolean
  exempt_request_types?: ExemptRequestType[] // Loại phiếu được miễn
  multiplier?: number
  calculate_from?: "base_salary"
  percentage?: number
}

export interface PayrollAdjustmentType {
  id: string
  name: string
  code: string | null
  category: AdjustmentCategory
  amount: number
  calculation_type: AdjustmentCalculationType
  is_auto_applied: boolean
  auto_rules: AdjustmentAutoRules | null
  description: string | null
  is_active: boolean
  created_at: string
}

export interface EmployeeAdjustment {
  id: string
  employee_id: string
  adjustment_type_id: string
  custom_amount: number | null
  effective_date: string
  end_date: string | null
  note: string | null
  created_at: string
}

export interface EmployeeAdjustmentWithType extends EmployeeAdjustment {
  adjustment_type?: PayrollAdjustmentType | null
}

export interface PayrollAdjustmentDetail {
  id: string
  payroll_item_id: string
  adjustment_type_id: string
  category: AdjustmentCategory
  base_amount: number
  adjusted_amount: number
  final_amount: number
  reason: string | null
  occurrence_count: number
  created_at: string
}

export interface PayrollAdjustmentDetailWithType extends PayrollAdjustmentDetail {
  adjustment_type?: PayrollAdjustmentType | null
}

export type TimeRequestType = "late_arrival" | "early_leave"
export type TimeRequestStatus = "pending" | "approved" | "rejected"

export interface TimeAdjustmentRequest {
  id: string
  employee_id: string
  request_type: TimeRequestType
  request_date: string
  reason: string | null
  status: TimeRequestStatus
  approver_id: string | null
  approved_at: string | null
  created_at: string
}

export interface TimeAdjustmentRequestWithRelations extends TimeAdjustmentRequest {
  employee?: Employee | null
  approver?: Employee | null
}

// =============================================
// REQUEST TYPES (Loại phiếu)
// =============================================

export type RequestStatus = "pending" | "approved" | "rejected"
export type ApprovalMode = "any" | "all"

export interface RequestType {
  id: string
  name: string
  code: string
  description: string | null
  requires_date_range: boolean
  requires_single_date: boolean
  requires_time: boolean
  requires_time_range: boolean
  requires_reason: boolean
  requires_attachment: boolean
  affects_attendance: boolean
  affects_payroll: boolean
  deduct_leave_balance: boolean
  approval_mode: ApprovalMode
  min_approver_level: number | null
  max_approver_level: number | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface EmployeeRequest {
  id: string
  employee_id: string
  request_type_id: string
  from_date: string | null
  to_date: string | null
  request_date: string | null
  request_time: string | null
  from_time: string | null
  to_time: string | null
  reason: string | null
  attachment_url: string | null
  status: RequestStatus
  approver_id: string | null
  approved_at: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface EmployeeRequestWithRelations extends EmployeeRequest {
  employee?: Employee | null
  approver?: Employee | null
  request_type?: RequestType | null
}

// Request Type Approvers
export interface RequestTypeApprover {
  id: string
  request_type_id: string
  approver_employee_id: string | null
  approver_position_id: string | null
  approver_role_code: string | null
  display_order: number
  created_at: string
}

export interface RequestTypeApproverWithRelations extends RequestTypeApprover {
  employee?: Employee | null
  position?: Position | null
}

// Request Approvals (trạng thái duyệt của từng người)
export interface RequestApproval {
  id: string
  request_id: string
  approver_id: string
  status: RequestStatus
  comment: string | null
  approved_at: string | null
  created_at: string
}

export interface RequestApprovalWithRelations extends RequestApproval {
  approver?: Employee | null
}
