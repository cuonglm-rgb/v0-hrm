"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { RequestType, EmployeeRequestWithRelations } from "@/lib/types/database"

// =============================================
// REQUEST TYPES (Loại phiếu)
// =============================================

export async function listRequestTypes(activeOnly = true): Promise<RequestType[]> {
  const supabase = await createClient()

  let query = supabase
    .from("request_types")
    .select("*")
    .order("display_order", { ascending: true })

  if (activeOnly) {
    query = query.eq("is_active", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error listing request types:", error)
    return []
  }

  return data || []
}

export async function getRequestType(id: string): Promise<RequestType | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("request_types")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error getting request type:", error)
    return null
  }

  return data
}

export async function createRequestType(input: {
  name: string
  code: string
  description?: string
  requires_date_range?: boolean
  requires_single_date?: boolean
  requires_time?: boolean
  requires_time_range?: boolean
  requires_reason?: boolean
  requires_attachment?: boolean
  affects_attendance?: boolean
  affects_payroll?: boolean
  deduct_leave_balance?: boolean
  approval_mode?: "any" | "all"
  min_approver_level?: number | null
  max_approver_level?: number | null
  display_order?: number
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("request_types").insert({
    name: input.name,
    code: input.code.toLowerCase().replace(/\s+/g, "_"),
    description: input.description,
    requires_date_range: input.requires_date_range ?? true,
    requires_single_date: input.requires_single_date ?? false,
    requires_time: input.requires_time ?? false,
    requires_time_range: input.requires_time_range ?? false,
    requires_reason: input.requires_reason ?? true,
    requires_attachment: input.requires_attachment ?? false,
    affects_attendance: input.affects_attendance ?? false,
    affects_payroll: input.affects_payroll ?? false,
    deduct_leave_balance: input.deduct_leave_balance ?? false,
    approval_mode: input.approval_mode ?? "any",
    min_approver_level: input.min_approver_level,
    max_approver_level: input.max_approver_level,
    display_order: input.display_order ?? 0,
  })

  if (error) {
    console.error("Error creating request type:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

export async function updateRequestType(
  id: string,
  input: Partial<{
    name: string
    description: string
    requires_date_range: boolean
    requires_single_date: boolean
    requires_time: boolean
    requires_time_range: boolean
    requires_reason: boolean
    requires_attachment: boolean
    affects_attendance: boolean
    affects_payroll: boolean
    deduct_leave_balance: boolean
    approval_mode: "any" | "all"
    min_approver_level: number | null
    max_approver_level: number | null
    is_active: boolean
    display_order: number
  }>
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("request_types")
    .update(input)
    .eq("id", id)

  if (error) {
    console.error("Error updating request type:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

export async function deleteRequestType(id: string) {
  const supabase = await createClient()

  // Check if any requests use this type
  const { data: requests } = await supabase
    .from("employee_requests")
    .select("id")
    .eq("request_type_id", id)
    .limit(1)

  if (requests && requests.length > 0) {
    return { success: false, error: "Không thể xóa loại phiếu đã có phiếu sử dụng" }
  }

  const { error } = await supabase
    .from("request_types")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting request type:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}


// =============================================
// EMPLOYEE REQUESTS (Phiếu yêu cầu)
// =============================================

export async function listEmployeeRequests(filters?: {
  status?: string
  request_type_id?: string
  employee_id?: string
}): Promise<EmployeeRequestWithRelations[]> {
  const supabase = await createClient()

  let query = supabase
    .from("employee_requests")
    .select(`
      *,
      employee:employees!employee_id(id, full_name, employee_code, department_id),
      approver:employees!approver_id(id, full_name),
      request_type:request_types!request_type_id(*)
    `)
    .order("created_at", { ascending: false })

  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.request_type_id) query = query.eq("request_type_id", filters.request_type_id)
  if (filters?.employee_id) query = query.eq("employee_id", filters.employee_id)

  const { data, error } = await query.limit(100)

  if (error) {
    console.error("Error listing employee requests:", error)
    return []
  }

  return (data || []) as EmployeeRequestWithRelations[]
}

export async function getMyEmployeeRequests(): Promise<EmployeeRequestWithRelations[]> {
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
    .from("employee_requests")
    .select(`
      *,
      request_type:request_types!request_type_id(*),
      approver:employees!approver_id(id, full_name)
    `)
    .eq("employee_id", employee.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching my requests:", error)
    return []
  }

  return (data || []) as EmployeeRequestWithRelations[]
}

export async function createEmployeeRequest(input: {
  request_type_id: string
  from_date?: string
  to_date?: string
  request_date?: string
  request_time?: string
  from_time?: string
  to_time?: string
  reason?: string
  attachment_url?: string
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

  // Validate date range
  if (input.from_date && input.to_date && input.from_date > input.to_date) {
    return { success: false, error: "Ngày bắt đầu phải trước ngày kết thúc" }
  }

  const { error } = await supabase.from("employee_requests").insert({
    employee_id: employee.id,
    request_type_id: input.request_type_id,
    from_date: input.from_date,
    to_date: input.to_date,
    request_date: input.request_date,
    request_time: input.request_time,
    from_time: input.from_time,
    to_time: input.to_time,
    reason: input.reason,
    attachment_url: input.attachment_url,
    status: "pending",
  })

  if (error) {
    console.error("Error creating employee request:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave")
  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

export async function approveEmployeeRequest(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  const { error } = await supabase
    .from("employee_requests")
    .update({
      status: "approved",
      approver_id: employee?.id,
      approved_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending")

  if (error) {
    console.error("Error approving request:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave")
  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

export async function rejectEmployeeRequest(id: string, rejection_reason?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  const { error } = await supabase
    .from("employee_requests")
    .update({
      status: "rejected",
      approver_id: employee?.id,
      approved_at: new Date().toISOString(),
      rejection_reason,
    })
    .eq("id", id)
    .eq("status", "pending")

  if (error) {
    console.error("Error rejecting request:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave")
  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

export async function cancelEmployeeRequest(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("employee_requests")
    .delete()
    .eq("id", id)
    .eq("status", "pending")

  if (error) {
    console.error("Error canceling request:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave")
  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}


// =============================================
// REQUEST TYPE APPROVERS
// =============================================

export async function listRequestTypeApprovers(requestTypeId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("request_type_approvers")
    .select(`
      *,
      employee:employees!approver_employee_id(id, full_name, employee_code),
      position:positions!approver_position_id(id, name, level)
    `)
    .eq("request_type_id", requestTypeId)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error listing approvers:", error)
    return []
  }

  return data || []
}

export async function addRequestTypeApprover(input: {
  request_type_id: string
  approver_employee_id?: string
  approver_position_id?: string
  approver_role_code?: string
  display_order?: number
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("request_type_approvers").insert({
    request_type_id: input.request_type_id,
    approver_employee_id: input.approver_employee_id,
    approver_position_id: input.approver_position_id,
    approver_role_code: input.approver_role_code,
    display_order: input.display_order ?? 0,
  })

  if (error) {
    console.error("Error adding approver:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

export async function removeRequestTypeApprover(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("request_type_approvers")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error removing approver:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

// =============================================
// REQUEST APPROVALS (Duyệt phiếu)
// =============================================

export async function getRequestApprovals(requestId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("request_approvals")
    .select(`
      *,
      approver:employees!approver_id(id, full_name, employee_code)
    `)
    .eq("request_id", requestId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error getting approvals:", error)
    return []
  }

  return data || []
}

export async function approveRequestByApprover(requestId: string, comment?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return { success: false, error: "Employee not found" }

  // Cập nhật trạng thái duyệt của người này
  const { error: approvalError } = await supabase
    .from("request_approvals")
    .upsert({
      request_id: requestId,
      approver_id: employee.id,
      status: "approved",
      comment,
      approved_at: new Date().toISOString(),
    }, { onConflict: "request_id,approver_id" })

  if (approvalError) {
    console.error("Error approving:", approvalError)
    return { success: false, error: approvalError.message }
  }

  // Kiểm tra xem phiếu đã đủ điều kiện duyệt chưa
  await checkAndUpdateRequestStatus(requestId)

  revalidatePath("/dashboard/leave")
  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

export async function rejectRequestByApprover(requestId: string, comment?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return { success: false, error: "Employee not found" }

  // Cập nhật trạng thái từ chối
  const { error: approvalError } = await supabase
    .from("request_approvals")
    .upsert({
      request_id: requestId,
      approver_id: employee.id,
      status: "rejected",
      comment,
      approved_at: new Date().toISOString(),
    }, { onConflict: "request_id,approver_id" })

  if (approvalError) {
    console.error("Error rejecting:", approvalError)
    return { success: false, error: approvalError.message }
  }

  // Nếu 1 người từ chối thì phiếu bị từ chối
  await supabase
    .from("employee_requests")
    .update({
      status: "rejected",
      approver_id: employee.id,
      approved_at: new Date().toISOString(),
      rejection_reason: comment,
    })
    .eq("id", requestId)
    .eq("status", "pending")

  revalidatePath("/dashboard/leave")
  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

async function checkAndUpdateRequestStatus(requestId: string) {
  const supabase = await createClient()

  // Lấy thông tin phiếu và loại phiếu
  const { data: request } = await supabase
    .from("employee_requests")
    .select(`
      *,
      request_type:request_types!request_type_id(approval_mode)
    `)
    .eq("id", requestId)
    .single()

  if (!request || request.status !== "pending") return

  const approvalMode = request.request_type?.approval_mode || "any"

  // Lấy danh sách người duyệt đã duyệt
  const { data: approvals } = await supabase
    .from("request_approvals")
    .select("*")
    .eq("request_id", requestId)

  if (!approvals || approvals.length === 0) return

  const approvedCount = approvals.filter(a => a.status === "approved").length
  const rejectedCount = approvals.filter(a => a.status === "rejected").length

  // Nếu có người từ chối -> phiếu bị từ chối
  if (rejectedCount > 0) {
    const rejector = approvals.find(a => a.status === "rejected")
    await supabase
      .from("employee_requests")
      .update({
        status: "rejected",
        approver_id: rejector?.approver_id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", requestId)
    return
  }

  // Kiểm tra điều kiện duyệt
  if (approvalMode === "any" && approvedCount >= 1) {
    // Chỉ cần 1 người duyệt
    const approver = approvals.find(a => a.status === "approved")
    await supabase
      .from("employee_requests")
      .update({
        status: "approved",
        approver_id: approver?.approver_id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", requestId)
  } else if (approvalMode === "all") {
    // Cần tất cả người duyệt
    // Lấy số người duyệt được chỉ định
    const { data: requiredApprovers } = await supabase
      .from("request_type_approvers")
      .select("id")
      .eq("request_type_id", request.request_type_id)

    const requiredCount = requiredApprovers?.length || 1
    
    if (approvedCount >= requiredCount) {
      const lastApprover = approvals.filter(a => a.status === "approved").pop()
      await supabase
        .from("employee_requests")
        .update({
          status: "approved",
          approver_id: lastApprover?.approver_id,
          approved_at: new Date().toISOString(),
        })
        .eq("id", requestId)
    }
  }
}
