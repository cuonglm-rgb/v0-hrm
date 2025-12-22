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
}

export interface UserRoleWithRelations extends UserRole {
  role: Role
}
