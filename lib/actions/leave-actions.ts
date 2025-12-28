"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { LeaveRequest, LeaveRequestWithRelations, LeaveType } from "@/lib/types/database"

export async function getMyLeaveRequests(): Promise<LeaveRequest[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return []

  const { data, error } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("employee_id", employee.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching leave requests:", error)
    return []
  }

  return data || []
}

export async function createLeaveRequest(input: {
  leave_type: LeaveType
  from_date: string
  to_date: string
  reason?: string
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return { success: false, error: "Employee not found" }

  // Validate: from_date <= to_date
  if (input.from_date > input.to_date) {
    return { success: false, error: "From date must be before or equal to To date" }
  }

  // Validate: chống đè ngày nghỉ (overlap)
  const { data: overlap } = await supabase
    .from("leave_requests")
    .select("id")
    .eq("employee_id", employee.id)
    .neq("status", "rejected") // Chỉ check pending và approved
    .lte("from_date", input.to_date)
    .gte("to_date", input.from_date)

  if (overlap && overlap.length > 0) {
    return { success: false, error: "Leave dates overlap with existing request" }
  }

  const { error } = await supabase.from("leave_requests").insert({
    employee_id: employee.id,
    leave_type: input.leave_type,
    from_date: input.from_date,
    to_date: input.to_date,
    reason: input.reason,
    status: "pending",
  })

  if (error) {
    console.error("Error creating leave request:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave")
  return { success: true }
}

export async function cancelLeaveRequest(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  // Chỉ có thể hủy đơn pending của mình
  const { error } = await supabase
    .from("leave_requests")
    .delete()
    .eq("id", id)
    .eq("status", "pending")

  if (error) {
    console.error("Error canceling leave request:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave")
  return { success: true }
}

export async function listLeaveRequests(filters?: {
  status?: string
  employee_id?: string
}): Promise<LeaveRequestWithRelations[]> {
  const supabase = await createClient()

  let query = supabase
    .from("leave_requests")
    .select(`
      *,
      employee:employees!employee_id(id, full_name, employee_code, department_id),
      approver:employees!approver_id(id, full_name)
    `)
    .order("created_at", { ascending: false })

  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.employee_id) query = query.eq("employee_id", filters.employee_id)

  const { data, error } = await query.limit(100)

  if (error) {
    console.error("Error listing leave requests:", error)
    return []
  }

  return (data || []) as LeaveRequestWithRelations[]
}

export async function approveLeaveRequest(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  const { error } = await supabase
    .from("leave_requests")
    .update({
      status: "approved",
      approver_id: employee?.id,
      approved_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending")

  if (error) {
    console.error("Error approving leave request:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave")
  return { success: true }
}

export async function rejectLeaveRequest(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  const { error } = await supabase
    .from("leave_requests")
    .update({
      status: "rejected",
      approver_id: employee?.id,
      approved_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending")

  if (error) {
    console.error("Error rejecting leave request:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave")
  return { success: true }
}
