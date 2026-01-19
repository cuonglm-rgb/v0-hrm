"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Employee, EmployeeWithRelations, UserRoleWithRelations } from "@/lib/types/database"
import { getTodayVN, getNowVN } from "@/lib/utils/date-utils"

export async function getMyEmployee(): Promise<EmployeeWithRelations | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("employees")
    .select(`
      *,
      department:departments(*),
      position:positions(*),
      manager:employees!manager_id(id, full_name, email)
    `)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error fetching employee:", error)
    return null
  }

  return data as EmployeeWithRelations
}

export async function getMyRoles(): Promise<UserRoleWithRelations[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("user_roles")
    .select(`
      *,
      role:roles(*)
    `)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching roles:", error)
    return []
  }

  return (data || []) as UserRoleWithRelations[]
}

export async function listEmployees(): Promise<EmployeeWithRelations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("employees")
    .select(`
      *,
      department:departments(*),
      position:positions(*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error listing employees:", error)
    return []
  }

  return (data || []) as EmployeeWithRelations[]
}

export async function getEmployee(id: string): Promise<EmployeeWithRelations | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("employees")
    .select(`
      *,
      department:departments(*),
      position:positions(*),
      manager:employees!manager_id(id, full_name, email),
      shift:work_shifts(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching employee:", error)
    return null
  }

  return data as EmployeeWithRelations
}

export async function updateEmployee(
  id: string,
  data: Partial<Pick<Employee, "full_name" | "phone" | "department_id" | "position_id" | "shift_id" | "status" | "join_date" | "official_date">>,
) {
  const supabase = await createClient()

  // 1. Fetch current employee to check status transition
  const { data: currentEmp } = await supabase
    .from("employees")
    .select("status, official_date")
    .eq("id", id)
    .single()

  const updateData: any = { ...data, updated_at: new Date().toISOString() }

  // Sanitize potentially empty strings for date fields
  if (updateData.join_date === "") updateData.join_date = null
  // official_date often leaks in from formData as "" but shouldn't be updated unless we mean it.
  // Ideally we ignore it if it's "" unless we set it below.
  if (updateData.official_date === "") updateData.official_date = null

  // If transitioning to Active and official_date is not set, set it to today
  if (currentEmp && data.status === "active" && currentEmp.status !== "active" && !currentEmp.official_date) {
    updateData.official_date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  }

  const { error } = await supabase
    .from("employees")
    .update({ ...data, updated_at: getNowVN() })
    .eq("id", id)

  if (error) {
    console.error("Error updating employee:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  revalidatePath(`/dashboard/employees/${id}`)
  return { success: true }
}

export async function updateMyProfile(data: Partial<Pick<Employee, "full_name" | "phone">>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { error } = await supabase
    .from("employees")
    .update({ ...data, updated_at: getNowVN() })
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/profile")
  return { success: true }
}

export async function createEmployee(data: {
  full_name: string
  email: string
  phone?: string | null
  department_id?: string | null
  position_id?: string | null
  join_date?: string | null
}) {
  const supabase = await createClient()

  // Generate employee code
  const code = `NV${getNowVN().slice(0, 7).replace("-", "")}${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`

  const { error } = await supabase.from("employees").insert({
    employee_code: code,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    department_id: data.department_id,
    position_id: data.position_id,
    join_date: data.join_date,
    status: "onboarding",
  })

  if (error) {
    console.error("Error creating employee:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

// Đổi phòng ban + lưu lịch sử
export async function changeDepartment(
  employeeId: string,
  newDepartmentId: string,
  salary?: number
) {
  const supabase = await createClient()

  // Lấy thông tin hiện tại
  const { data: employee } = await supabase
    .from("employees")
    .select("department_id, position_id")
    .eq("id", employeeId)
    .single()

  if (!employee) return { success: false, error: "Employee not found" }

  const today = getTodayVN()

  // Đóng record lịch sử cũ
  await supabase
    .from("employee_job_history")
    .update({ end_date: today })
    .eq("employee_id", employeeId)
    .is("end_date", null)

  // Tạo record lịch sử mới
  await supabase.from("employee_job_history").insert({
    employee_id: employeeId,
    department_id: newDepartmentId,
    position_id: employee.position_id,
    salary: salary || null,
    start_date: today,
  })

  // Update employee
  const { error } = await supabase
    .from("employees")
    .update({ department_id: newDepartmentId, updated_at: getNowVN() })
    .eq("id", employeeId)

  if (error) {
    console.error("Error changing department:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  revalidatePath(`/dashboard/employees/${employeeId}`)
  return { success: true }
}

// Đổi chức vụ + lưu lịch sử
export async function changePosition(
  employeeId: string,
  newPositionId: string,
  salary?: number
) {
  const supabase = await createClient()

  // Lấy thông tin hiện tại
  const { data: employee } = await supabase
    .from("employees")
    .select("department_id, position_id")
    .eq("id", employeeId)
    .single()

  if (!employee) return { success: false, error: "Employee not found" }

  const today = getTodayVN()

  // Đóng record lịch sử cũ
  await supabase
    .from("employee_job_history")
    .update({ end_date: today })
    .eq("employee_id", employeeId)
    .is("end_date", null)

  // Tạo record lịch sử mới
  await supabase.from("employee_job_history").insert({
    employee_id: employeeId,
    department_id: employee.department_id,
    position_id: newPositionId,
    salary: salary || null,
    start_date: today,
  })

  // Update employee
  const { error } = await supabase
    .from("employees")
    .update({ position_id: newPositionId, updated_at: getNowVN() })
    .eq("id", employeeId)

  if (error) {
    console.error("Error changing position:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  revalidatePath(`/dashboard/employees/${employeeId}`)
  return { success: true }
}
