"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { RequestType, EmployeeRequestWithRelations, EligibleApprover } from "@/lib/types/database"

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

// Lấy thông tin quyền duyệt của user hiện tại
export async function getCurrentApproverInfo() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: employee } = await supabase
    .from("employees")
    .select(`
      id,
      full_name,
      position_id,
      position:positions!position_id(id, name, level)
    `)
    .eq("user_id", user.id)
    .single()

  if (!employee) return null

  // Lấy roles của user
  const { data: userRoles } = await supabase
    .from("user_roles")
    .select(`
      role:roles!role_id(code, name)
    `)
    .eq("user_id", user.id)

  return {
    employeeId: employee.id,
    fullName: employee.full_name,
    positionId: employee.position_id,
    positionName: (employee.position as any)?.name || null,
    positionLevel: (employee.position as any)?.level || 0,
    roles: userRoles?.map((ur: any) => ur.role?.code).filter(Boolean) || []
  }
}

// Kiểm tra xem user có quyền duyệt phiếu không (dựa trên level chức vụ)
export async function checkCanApproveRequests(): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  // Lấy level chức vụ của user
  const { data: employee } = await supabase
    .from("employees")
    .select(`
      id,
      position:positions!position_id(level)
    `)
    .eq("user_id", user.id)
    .single()

  if (!employee) return false

  const userLevel = (employee.position as any)?.level || 0

  // Lấy tất cả loại phiếu đang active
  const { data: requestTypes } = await supabase
    .from("request_types")
    .select("min_approver_level, max_approver_level")
    .eq("is_active", true)

  if (!requestTypes || requestTypes.length === 0) return false

  // Kiểm tra xem user có nằm trong khoảng level duyệt của bất kỳ loại phiếu nào không
  for (const rt of requestTypes) {
    const minLevel = rt.min_approver_level || 0
    const maxLevel = rt.max_approver_level || 999

    if (userLevel >= minLevel && userLevel <= maxLevel) {
      return true
    }
  }

  return false
}

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

// Lấy danh sách phiếu kèm trạng thái duyệt của người dùng hiện tại
// Cho người duyệt: chỉ lấy phiếu mà họ được chỉ định duyệt hoặc có quyền duyệt theo level
export async function listEmployeeRequestsWithMyApprovalStatus(filters?: {
  status?: string
  request_type_id?: string
  employee_id?: string
}): Promise<(EmployeeRequestWithRelations & { my_approval_status?: string })[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Lấy thông tin employee và level của user hiện tại
  const { data: currentEmployee } = await supabase
    .from("employees")
    .select(`
      id,
      position:positions!position_id(level)
    `)
    .eq("user_id", user.id)
    .single()

  if (!currentEmployee) return []

  // Lấy roles của user
  const { data: userRoles } = await supabase
    .from("user_roles")
    .select(`
      role:roles!role_id(code)
    `)
    .eq("user_id", user.id)

  const roleCodes = userRoles?.map((ur: any) => ur.role?.code).filter(Boolean) || []
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")
  const userLevel = (currentEmployee.position as any)?.level || 0

  // Nếu là HR/Admin, lấy tất cả phiếu
  if (isHROrAdmin) {
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

    // Lấy trạng thái duyệt của user hiện tại cho các phiếu
    const requestIds = data?.map(r => r.id) || []
    const { data: myApprovals } = await supabase
      .from("request_assigned_approvers")
      .select("request_id, status")
      .eq("approver_id", currentEmployee.id)
      .in("request_id", requestIds)

    const approvalMap = new Map(myApprovals?.map(a => [a.request_id, a.status]) || [])
    
    return (data || []).map(r => ({
      ...r,
      my_approval_status: approvalMap.get(r.id) || undefined
    })) as (EmployeeRequestWithRelations & { my_approval_status?: string })[]
  }

  // Nếu không phải HR/Admin, chỉ lấy phiếu mà user được chỉ định duyệt
  // Bước 1: Lấy danh sách request_id mà user được chỉ định làm người duyệt
  const { data: assignedRequests } = await supabase
    .from("request_assigned_approvers")
    .select("request_id, status")
    .eq("approver_id", currentEmployee.id)

  if (!assignedRequests || assignedRequests.length === 0) {
    return []
  }

  const assignedRequestIds = assignedRequests.map(r => r.request_id)
  const approvalMap = new Map(assignedRequests.map(a => [a.request_id, a.status]))

  // Bước 2: Lấy chi tiết các phiếu đó
  let query = supabase
    .from("employee_requests")
    .select(`
      *,
      employee:employees!employee_id(id, full_name, employee_code, department_id),
      approver:employees!approver_id(id, full_name),
      request_type:request_types!request_type_id(*)
    `)
    .in("id", assignedRequestIds)
    .order("created_at", { ascending: false })

  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.request_type_id) query = query.eq("request_type_id", filters.request_type_id)
  if (filters?.employee_id) query = query.eq("employee_id", filters.employee_id)

  const { data, error } = await query.limit(100)

  if (error) {
    console.error("Error listing employee requests:", error)
    return []
  }

  return (data || []).map(r => ({
    ...r,
    my_approval_status: approvalMap.get(r.id) || undefined
  })) as (EmployeeRequestWithRelations & { my_approval_status?: string })[]
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
  assigned_approver_ids?: string[] // Danh sách người duyệt được chỉ định
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

  // Validate người duyệt bắt buộc
  if (!input.assigned_approver_ids || input.assigned_approver_ids.length === 0) {
    return { success: false, error: "Vui lòng chọn ít nhất 1 người duyệt" }
  }

  // Tạo phiếu
  const { data: newRequest, error } = await supabase.from("employee_requests").insert({
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
  }).select("id").single()

  if (error) {
    console.error("Error creating employee request:", error)
    return { success: false, error: error.message }
  }

  // Lưu danh sách người duyệt được chỉ định
  if (newRequest) {
    const approverRecords = input.assigned_approver_ids!.map((approverId, index) => ({
      request_id: newRequest.id,
      approver_id: approverId,
      display_order: index + 1,
      status: "pending" as const,
    }))

    const { error: approverError } = await supabase
      .from("request_assigned_approvers")
      .insert(approverRecords)

    if (approverError) {
      console.error("Error saving assigned approvers:", approverError)
      // Xóa phiếu nếu không lưu được người duyệt
      await supabase.from("employee_requests").delete().eq("id", newRequest.id)
      return { success: false, error: "Không thể lưu danh sách người duyệt" }
    }
  }

  revalidatePath("/dashboard/leave")
  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

export async function approveEmployeeRequest(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  // Lấy thông tin employee và position level của người duyệt
  const { data: approverEmployee } = await supabase
    .from("employees")
    .select(`
      id,
      position_id,
      position:positions!position_id(id, level)
    `)
    .eq("user_id", user.id)
    .single()

  if (!approverEmployee) return { success: false, error: "Employee not found" }

  // Lấy thông tin phiếu và loại phiếu
  const { data: request } = await supabase
    .from("employee_requests")
    .select(`
      *,
      request_type:request_types!request_type_id(*)
    `)
    .eq("id", id)
    .eq("status", "pending")
    .single()

  if (!request) return { success: false, error: "Phiếu không tồn tại hoặc đã được xử lý" }

  const requestType = request.request_type

  // Kiểm tra quyền duyệt dựa trên level chức vụ
  const approverLevel = (approverEmployee.position as any)?.level || 0
  
  if (requestType?.min_approver_level && approverLevel < requestType.min_approver_level) {
    return { 
      success: false, 
      error: `Bạn cần có chức vụ level ${requestType.min_approver_level} trở lên để duyệt loại phiếu này` 
    }
  }
  
  if (requestType?.max_approver_level && approverLevel > requestType.max_approver_level) {
    return { 
      success: false, 
      error: `Chức vụ của bạn (level ${approverLevel}) vượt quá level tối đa (${requestType.max_approver_level}) cho loại phiếu này` 
    }
  }

  // Kiểm tra xem có danh sách người duyệt được chỉ định không
  const canApprove = await checkApproverPermission(supabase, request.request_type_id, approverEmployee.id, approverEmployee.position_id)
  if (!canApprove.allowed) {
    return { success: false, error: canApprove.reason || "Bạn không có quyền duyệt loại phiếu này" }
  }

  const approvalMode = requestType?.approval_mode || "any"

  // Nếu approval_mode = "all", cần kiểm tra người duyệt được chỉ định khi tạo phiếu
  if (approvalMode === "all") {
    // Lấy danh sách người duyệt được chỉ định khi tạo phiếu
    const { data: assignedApprovers } = await supabase
      .from("request_assigned_approvers")
      .select("*")
      .eq("request_id", id)

    // Nếu có danh sách người duyệt được chỉ định khi tạo phiếu
    if (assignedApprovers && assignedApprovers.length > 0) {
      // Kiểm tra người duyệt hiện tại có trong danh sách không
      const isAssigned = assignedApprovers.some(a => a.approver_id === approverEmployee.id)
      if (!isAssigned) {
        return { success: false, error: "Bạn không nằm trong danh sách người duyệt được chỉ định cho phiếu này" }
      }

      // Cập nhật trạng thái duyệt của người này
      const { error: updateApproverError } = await supabase
        .from("request_assigned_approvers")
        .update({ 
          status: "approved",
          approved_at: new Date().toISOString()
        })
        .eq("request_id", id)
        .eq("approver_id", approverEmployee.id)

      if (updateApproverError) {
        console.error("Error updating approver status:", updateApproverError)
        return { success: false, error: updateApproverError.message }
      }

      // Kiểm tra xem tất cả người duyệt đã duyệt chưa
      const { data: updatedApprovers } = await supabase
        .from("request_assigned_approvers")
        .select("*")
        .eq("request_id", id)

      const allApproved = updatedApprovers?.every(a => a.status === "approved")
      const anyRejected = updatedApprovers?.some(a => a.status === "rejected")

      if (anyRejected) {
        // Nếu có người từ chối -> phiếu bị từ chối
        const { error } = await supabase
          .from("employee_requests")
          .update({
            status: "rejected",
            approver_id: approverEmployee.id,
            approved_at: new Date().toISOString(),
          })
          .eq("id", id)

        if (error) {
          console.error("Error rejecting request:", error)
          return { success: false, error: error.message }
        }
      } else if (allApproved) {
        // Tất cả đã duyệt -> phiếu được duyệt
        const { error } = await supabase
          .from("employee_requests")
          .update({
            status: "approved",
            approver_id: approverEmployee.id,
            approved_at: new Date().toISOString(),
          })
          .eq("id", id)

        if (error) {
          console.error("Error approving request:", error)
          return { success: false, error: error.message }
        }
      }
      // Nếu chưa đủ người duyệt -> giữ nguyên status pending

      revalidatePath("/dashboard/leave")
      revalidatePath("/dashboard/leave-approval")
      
      const pendingCount = updatedApprovers?.filter(a => a.status === "pending").length || 0
      if (pendingCount > 0) {
        return { success: true, message: `Đã duyệt. Còn ${pendingCount} người cần duyệt nữa.` }
      }
      return { success: true }
    }
    
    // Nếu không có người duyệt được chỉ định khi tạo phiếu
    // -> Sử dụng bảng request_approvals để track
    // Cập nhật trạng thái duyệt của người này vào request_approvals
    const { error: approvalError } = await supabase
      .from("request_approvals")
      .upsert({
        request_id: id,
        approver_id: approverEmployee.id,
        status: "approved",
        approved_at: new Date().toISOString(),
      }, { onConflict: "request_id,approver_id" })

    if (approvalError) {
      console.error("Error saving approval:", approvalError)
      // Nếu bảng không tồn tại, fallback về duyệt trực tiếp
      if (approvalError.code === "42P01") {
        // Table doesn't exist, approve directly
        const { error } = await supabase
          .from("employee_requests")
          .update({
            status: "approved",
            approver_id: approverEmployee.id,
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
      return { success: false, error: approvalError.message }
    }

    // Kiểm tra xem đã đủ người duyệt chưa theo request_type_approvers
    await checkAndFinalizeApproval(supabase, id, request.request_type_id, approverEmployee.id)

    revalidatePath("/dashboard/leave")
    revalidatePath("/dashboard/leave-approval")
    
    // Kiểm tra lại trạng thái phiếu
    const { data: updatedRequest } = await supabase
      .from("employee_requests")
      .select("status")
      .eq("id", id)
      .single()
    
    if (updatedRequest?.status === "pending") {
      return { success: true, message: "Đã duyệt. Cần thêm người duyệt khác." }
    }
    return { success: true }
  }

  // Nếu approval_mode = "any" -> Duyệt trực tiếp
  const { error } = await supabase
    .from("employee_requests")
    .update({
      status: "approved",
      approver_id: approverEmployee.id,
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

// Helper function để kiểm tra và finalize approval khi approval_mode = "all"
async function checkAndFinalizeApproval(
  supabase: any,
  requestId: string,
  requestTypeId: string,
  currentApproverId: string
) {
  // Lấy danh sách người duyệt được cấu hình cho loại phiếu
  const { data: requiredApprovers } = await supabase
    .from("request_type_approvers")
    .select(`
      *,
      position:positions!approver_position_id(id)
    `)
    .eq("request_type_id", requestTypeId)

  // Nếu không có ai được chỉ định -> chỉ cần 1 người duyệt
  if (!requiredApprovers || requiredApprovers.length === 0) {
    await supabase
      .from("employee_requests")
      .update({
        status: "approved",
        approver_id: currentApproverId,
        approved_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("status", "pending")
    return
  }

  // Lấy danh sách người đã duyệt
  const { data: approvals } = await supabase
    .from("request_approvals")
    .select("*")
    .eq("request_id", requestId)

  if (!approvals || approvals.length === 0) return

  // Kiểm tra từng required approver
  let allApproved = true
  
  for (const required of requiredApprovers) {
    let found = false
    
    if (required.approver_employee_id) {
      // Kiểm tra employee cụ thể đã duyệt chưa
      found = approvals.some((a: any) => 
        a.approver_id === required.approver_employee_id && a.status === "approved"
      )
    } else if (required.approver_position_id) {
      // Kiểm tra có ai có position đó đã duyệt chưa
      const { data: positionEmployees } = await supabase
        .from("employees")
        .select("id")
        .eq("position_id", required.approver_position_id)
      
      const positionEmployeeIds = positionEmployees?.map((e: any) => e.id) || []
      found = approvals.some((a: any) => 
        positionEmployeeIds.includes(a.approver_id) && a.status === "approved"
      )
    } else if (required.approver_role_code) {
      // Kiểm tra có ai có role đó đã duyệt chưa
      const { data: role } = await supabase
        .from("roles")
        .select("id")
        .eq("code", required.approver_role_code)
        .single()
      
      if (role) {
        const { data: roleUsers } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role_id", role.id)
        
        if (roleUsers) {
          const { data: roleEmployees } = await supabase
            .from("employees")
            .select("id")
            .in("user_id", roleUsers.map((r: any) => r.user_id))
          
          const roleEmployeeIds = roleEmployees?.map((e: any) => e.id) || []
          found = approvals.some((a: any) => 
            roleEmployeeIds.includes(a.approver_id) && a.status === "approved"
          )
        }
      }
    }
    
    if (!found) {
      allApproved = false
      break
    }
  }
  
  if (allApproved) {
    await supabase
      .from("employee_requests")
      .update({
        status: "approved",
        approver_id: currentApproverId,
        approved_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("status", "pending")
  }
}

// Helper function để kiểm tra quyền duyệt
async function checkApproverPermission(
  supabase: any, 
  requestTypeId: string, 
  approverId: string, 
  approverPositionId: string | null
): Promise<{ allowed: boolean; reason?: string }> {
  // Lấy danh sách người duyệt được chỉ định cho loại phiếu này
  const { data: approvers } = await supabase
    .from("request_type_approvers")
    .select("*")
    .eq("request_type_id", requestTypeId)

  // Nếu không có ai được chỉ định -> cho phép tất cả (theo level đã check ở trên)
  if (!approvers || approvers.length === 0) {
    return { allowed: true }
  }

  // Kiểm tra xem người duyệt có trong danh sách không
  for (const approver of approvers) {
    // Chỉ định theo employee cụ thể
    if (approver.approver_employee_id && approver.approver_employee_id === approverId) {
      return { allowed: true }
    }
    
    // Chỉ định theo position
    if (approver.approver_position_id && approverPositionId && approver.approver_position_id === approverPositionId) {
      return { allowed: true }
    }
    
    // Chỉ định theo role (cần check thêm user_roles)
    if (approver.approver_role_code) {
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select(`
          role:roles!role_id(code)
        `)
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
      
      const hasRole = userRoles?.some((ur: any) => ur.role?.code === approver.approver_role_code)
      if (hasRole) {
        return { allowed: true }
      }
    }
  }

  return { 
    allowed: false, 
    reason: "Bạn không nằm trong danh sách người duyệt được chỉ định cho loại phiếu này" 
  }
}

export async function rejectEmployeeRequest(id: string, rejection_reason?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  // Lấy thông tin employee và position level của người duyệt
  const { data: approverEmployee } = await supabase
    .from("employees")
    .select(`
      id,
      position_id,
      position:positions!position_id(id, level)
    `)
    .eq("user_id", user.id)
    .single()

  if (!approverEmployee) return { success: false, error: "Employee not found" }

  // Lấy thông tin phiếu và loại phiếu
  const { data: request } = await supabase
    .from("employee_requests")
    .select(`
      *,
      request_type:request_types!request_type_id(*)
    `)
    .eq("id", id)
    .eq("status", "pending")
    .single()

  if (!request) return { success: false, error: "Phiếu không tồn tại hoặc đã được xử lý" }

  const requestType = request.request_type

  // Kiểm tra quyền duyệt dựa trên level chức vụ
  const approverLevel = (approverEmployee.position as any)?.level || 0
  
  if (requestType?.min_approver_level && approverLevel < requestType.min_approver_level) {
    return { 
      success: false, 
      error: `Bạn cần có chức vụ level ${requestType.min_approver_level} trở lên để từ chối loại phiếu này` 
    }
  }
  
  if (requestType?.max_approver_level && approverLevel > requestType.max_approver_level) {
    return { 
      success: false, 
      error: `Chức vụ của bạn (level ${approverLevel}) vượt quá level tối đa (${requestType.max_approver_level}) cho loại phiếu này` 
    }
  }

  // Kiểm tra xem có danh sách người duyệt được chỉ định không
  const canApprove = await checkApproverPermission(supabase, request.request_type_id, approverEmployee.id, approverEmployee.position_id)
  if (!canApprove.allowed) {
    return { success: false, error: canApprove.reason || "Bạn không có quyền từ chối loại phiếu này" }
  }

  const approvalMode = requestType?.approval_mode || "any"

  // Nếu approval_mode = "all", cập nhật trạng thái người duyệt trước
  if (approvalMode === "all") {
    const { data: assignedApprovers } = await supabase
      .from("request_assigned_approvers")
      .select("*")
      .eq("request_id", id)

    if (assignedApprovers && assignedApprovers.length > 0) {
      // Kiểm tra người duyệt hiện tại có trong danh sách không
      const isAssigned = assignedApprovers.some(a => a.approver_id === approverEmployee.id)
      if (!isAssigned) {
        return { success: false, error: "Bạn không nằm trong danh sách người duyệt được chỉ định cho phiếu này" }
      }

      // Cập nhật trạng thái từ chối của người này
      await supabase
        .from("request_assigned_approvers")
        .update({ 
          status: "rejected",
          approved_at: new Date().toISOString()
        })
        .eq("request_id", id)
        .eq("approver_id", approverEmployee.id)
    }
  }

  // Khi có 1 người từ chối -> phiếu bị từ chối ngay lập tức
  const { error } = await supabase
    .from("employee_requests")
    .update({
      status: "rejected",
      approver_id: approverEmployee.id,
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

export async function updateEmployeeRequest(
  id: string,
  input: {
    from_date?: string
    to_date?: string
    request_date?: string
    request_time?: string
    from_time?: string
    to_time?: string
    reason?: string
    attachment_url?: string
    assigned_approver_ids?: string[]
  }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  // Lấy thông tin phiếu hiện tại
  const { data: currentRequest } = await supabase
    .from("employee_requests")
    .select("employee_id, status")
    .eq("id", id)
    .single()

  if (!currentRequest) {
    return { success: false, error: "Phiếu không tồn tại" }
  }

  // Chỉ cho phép sửa phiếu pending
  if (currentRequest.status !== "pending") {
    return { success: false, error: "Chỉ có thể sửa phiếu đang chờ duyệt" }
  }

  // Kiểm tra quyền sở hữu
  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee || employee.id !== currentRequest.employee_id) {
    return { success: false, error: "Bạn không có quyền sửa phiếu này" }
  }

  // Validate date range
  if (input.from_date && input.to_date && input.from_date > input.to_date) {
    return { success: false, error: "Ngày bắt đầu phải trước ngày kết thúc" }
  }

  // Validate người duyệt bắt buộc khi update
  if (input.assigned_approver_ids !== undefined && input.assigned_approver_ids.length === 0) {
    return { success: false, error: "Vui lòng chọn ít nhất 1 người duyệt" }
  }

  // Cập nhật phiếu
  const { error } = await supabase
    .from("employee_requests")
    .update({
      from_date: input.from_date,
      to_date: input.to_date,
      request_date: input.request_date,
      request_time: input.request_time,
      from_time: input.from_time,
      to_time: input.to_time,
      reason: input.reason,
      attachment_url: input.attachment_url,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating employee request:", error)
    return { success: false, error: error.message }
  }

  // Cập nhật danh sách người duyệt nếu có
  if (input.assigned_approver_ids && input.assigned_approver_ids.length > 0) {
    // Bước 1: Xóa toàn bộ danh sách người duyệt cũ
    const { error: deleteError } = await supabase
      .from("request_assigned_approvers")
      .delete()
      .eq("request_id", id)

    // Nếu có lỗi khi xóa (trừ lỗi không tìm thấy record)
    if (deleteError && deleteError.code !== "PGRST116") {
      console.error("Error deleting old approvers:", deleteError)
      return { success: false, error: `Lỗi khi xóa người duyệt cũ: ${deleteError.message}` }
    }

    // Bước 2: Thêm danh sách người duyệt mới
    const approverRecords = input.assigned_approver_ids.map((approverId, index) => ({
      request_id: id,
      approver_id: approverId,
      display_order: index + 1,
      status: "pending" as const,
    }))

    const { error: insertError } = await supabase
      .from("request_assigned_approvers")
      .insert(approverRecords)

    if (insertError) {
      console.error("Error inserting new approvers:", insertError)
      return { success: false, error: `Lỗi khi thêm người duyệt mới: ${insertError.message}` }
    }
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
// ELIGIBLE APPROVERS (Lấy danh sách người có quyền duyệt)
// =============================================

export async function getEligibleApprovers(requestTypeId: string): Promise<EligibleApprover[]> {
  const supabase = await createClient()

  // Lấy thông tin loại phiếu
  const { data: requestType } = await supabase
    .from("request_types")
    .select("*")
    .eq("id", requestTypeId)
    .single()

  if (!requestType) return []

  // Lấy danh sách người duyệt được chỉ định cho loại phiếu này
  const { data: designatedApprovers } = await supabase
    .from("request_type_approvers")
    .select(`
      *,
      employee:employees!approver_employee_id(id, full_name, employee_code, position_id, department_id),
      position:positions!approver_position_id(id, name, level)
    `)
    .eq("request_type_id", requestTypeId)

  const eligibleApprovers: EligibleApprover[] = []
  const addedIds = new Set<string>()

  // Nếu có danh sách người duyệt được chỉ định
  if (designatedApprovers && designatedApprovers.length > 0) {
    for (const approver of designatedApprovers) {
      // Chỉ định theo employee cụ thể
      if (approver.approver_employee_id && approver.employee) {
        const emp = approver.employee as any
        if (!addedIds.has(emp.id)) {
          // Lấy thêm thông tin position và department
          const { data: empDetails } = await supabase
            .from("employees")
            .select(`
              id, full_name, employee_code,
              position:positions!position_id(name, level),
              department:departments!department_id(name)
            `)
            .eq("id", emp.id)
            .single()

          if (empDetails) {
            eligibleApprovers.push({
              id: empDetails.id,
              full_name: empDetails.full_name,
              employee_code: empDetails.employee_code,
              position_name: (empDetails.position as any)?.name || null,
              position_level: (empDetails.position as any)?.level || 0,
              department_name: (empDetails.department as any)?.name || null,
            })
            addedIds.add(emp.id)
          }
        }
      }

      // Chỉ định theo position
      if (approver.approver_position_id) {
        const { data: positionEmployees } = await supabase
          .from("employees")
          .select(`
            id, full_name, employee_code,
            position:positions!position_id(name, level),
            department:departments!department_id(name)
          `)
          .eq("position_id", approver.approver_position_id)
          .eq("status", "active")

        if (positionEmployees) {
          for (const emp of positionEmployees) {
            if (!addedIds.has(emp.id)) {
              eligibleApprovers.push({
                id: emp.id,
                full_name: emp.full_name,
                employee_code: emp.employee_code,
                position_name: (emp.position as any)?.name || null,
                position_level: (emp.position as any)?.level || 0,
                department_name: (emp.department as any)?.name || null,
              })
              addedIds.add(emp.id)
            }
          }
        }
      }

      // Chỉ định theo role
      if (approver.approver_role_code) {
        const { data: roleUsers } = await supabase
          .from("user_roles")
          .select(`
            user_id,
            role:roles!role_id(code)
          `)
          .eq("role_id", (await supabase.from("roles").select("id").eq("code", approver.approver_role_code).single()).data?.id)

        if (roleUsers) {
          const userIds = roleUsers.map(r => r.user_id)
          const { data: roleEmployees } = await supabase
            .from("employees")
            .select(`
              id, full_name, employee_code,
              position:positions!position_id(name, level),
              department:departments!department_id(name)
            `)
            .in("user_id", userIds)
            .eq("status", "active")

          if (roleEmployees) {
            for (const emp of roleEmployees) {
              if (!addedIds.has(emp.id)) {
                eligibleApprovers.push({
                  id: emp.id,
                  full_name: emp.full_name,
                  employee_code: emp.employee_code,
                  position_name: (emp.position as any)?.name || null,
                  position_level: (emp.position as any)?.level || 0,
                  department_name: (emp.department as any)?.name || null,
                })
                addedIds.add(emp.id)
              }
            }
          }
        }
      }
    }
  } else {
    // Nếu không có danh sách chỉ định -> lấy theo level
    let query = supabase
      .from("employees")
      .select(`
        id, full_name, employee_code,
        position:positions!position_id(name, level),
        department:departments!department_id(name)
      `)
      .eq("status", "active")

    const { data: employees } = await query

    if (employees) {
      for (const emp of employees) {
        const level = (emp.position as any)?.level || 0

        // Kiểm tra level
        if (requestType.min_approver_level && level < requestType.min_approver_level) continue
        if (requestType.max_approver_level && level > requestType.max_approver_level) continue

        if (!addedIds.has(emp.id)) {
          eligibleApprovers.push({
            id: emp.id,
            full_name: emp.full_name,
            employee_code: emp.employee_code,
            position_name: (emp.position as any)?.name || null,
            position_level: level,
            department_name: (emp.department as any)?.name || null,
          })
          addedIds.add(emp.id)
        }
      }
    }
  }

  // Sắp xếp theo level giảm dần
  return eligibleApprovers.sort((a, b) => b.position_level - a.position_level)
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

  // Lấy thông tin employee và position level của người duyệt
  const { data: approverEmployee } = await supabase
    .from("employees")
    .select(`
      id,
      position_id,
      position:positions!position_id(id, level)
    `)
    .eq("user_id", user.id)
    .single()

  if (!approverEmployee) return { success: false, error: "Employee not found" }

  // Lấy thông tin phiếu và loại phiếu
  const { data: request } = await supabase
    .from("employee_requests")
    .select(`
      *,
      request_type:request_types!request_type_id(*)
    `)
    .eq("id", requestId)
    .eq("status", "pending")
    .single()

  if (!request) return { success: false, error: "Phiếu không tồn tại hoặc đã được xử lý" }

  const requestType = request.request_type

  // Kiểm tra quyền duyệt dựa trên level chức vụ
  const approverLevel = (approverEmployee.position as any)?.level || 0
  
  if (requestType?.min_approver_level && approverLevel < requestType.min_approver_level) {
    return { 
      success: false, 
      error: `Bạn cần có chức vụ level ${requestType.min_approver_level} trở lên để duyệt loại phiếu này` 
    }
  }
  
  if (requestType?.max_approver_level && approverLevel > requestType.max_approver_level) {
    return { 
      success: false, 
      error: `Chức vụ của bạn (level ${approverLevel}) vượt quá level tối đa (${requestType.max_approver_level}) cho loại phiếu này` 
    }
  }

  // Kiểm tra xem có danh sách người duyệt được chỉ định không
  const canApprove = await checkApproverPermission(supabase, request.request_type_id, approverEmployee.id, approverEmployee.position_id)
  if (!canApprove.allowed) {
    return { success: false, error: canApprove.reason || "Bạn không có quyền duyệt loại phiếu này" }
  }

  // Cập nhật trạng thái duyệt của người này
  const { error: approvalError } = await supabase
    .from("request_approvals")
    .upsert({
      request_id: requestId,
      approver_id: approverEmployee.id,
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

  // Lấy thông tin employee và position level của người duyệt
  const { data: approverEmployee } = await supabase
    .from("employees")
    .select(`
      id,
      position_id,
      position:positions!position_id(id, level)
    `)
    .eq("user_id", user.id)
    .single()

  if (!approverEmployee) return { success: false, error: "Employee not found" }

  // Lấy thông tin phiếu và loại phiếu
  const { data: request } = await supabase
    .from("employee_requests")
    .select(`
      *,
      request_type:request_types!request_type_id(*)
    `)
    .eq("id", requestId)
    .eq("status", "pending")
    .single()

  if (!request) return { success: false, error: "Phiếu không tồn tại hoặc đã được xử lý" }

  const requestType = request.request_type

  // Kiểm tra quyền duyệt dựa trên level chức vụ
  const approverLevel = (approverEmployee.position as any)?.level || 0
  
  if (requestType?.min_approver_level && approverLevel < requestType.min_approver_level) {
    return { 
      success: false, 
      error: `Bạn cần có chức vụ level ${requestType.min_approver_level} trở lên để từ chối loại phiếu này` 
    }
  }
  
  if (requestType?.max_approver_level && approverLevel > requestType.max_approver_level) {
    return { 
      success: false, 
      error: `Chức vụ của bạn (level ${approverLevel}) vượt quá level tối đa (${requestType.max_approver_level}) cho loại phiếu này` 
    }
  }

  // Kiểm tra xem có danh sách người duyệt được chỉ định không
  const canApprove = await checkApproverPermission(supabase, request.request_type_id, approverEmployee.id, approverEmployee.position_id)
  if (!canApprove.allowed) {
    return { success: false, error: canApprove.reason || "Bạn không có quyền từ chối loại phiếu này" }
  }

  // Cập nhật trạng thái từ chối
  const { error: approvalError } = await supabase
    .from("request_approvals")
    .upsert({
      request_id: requestId,
      approver_id: approverEmployee.id,
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
      approver_id: approverEmployee.id,
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
    // Cần tất cả người duyệt được chỉ định
    const { data: requiredApprovers } = await supabase
      .from("request_type_approvers")
      .select(`
        *,
        position:positions!approver_position_id(id)
      `)
      .eq("request_type_id", request.request_type_id)

    // Nếu không có ai được chỉ định -> chỉ cần 1 người duyệt (fallback)
    if (!requiredApprovers || requiredApprovers.length === 0) {
      if (approvedCount >= 1) {
        const approver = approvals.find(a => a.status === "approved")
        await supabase
          .from("employee_requests")
          .update({
            status: "approved",
            approver_id: approver?.approver_id,
            approved_at: new Date().toISOString(),
          })
          .eq("id", requestId)
      }
      return
    }

    // Đếm số người duyệt cần thiết (unique)
    // Với approver_employee_id: cần đúng người đó
    // Với approver_position_id: cần 1 người có position đó
    // Với approver_role_code: cần 1 người có role đó
    
    let allApproved = true
    
    for (const required of requiredApprovers) {
      let found = false
      
      if (required.approver_employee_id) {
        // Kiểm tra employee cụ thể đã duyệt chưa
        found = approvals.some(a => 
          a.approver_id === required.approver_employee_id && a.status === "approved"
        )
      } else if (required.approver_position_id) {
        // Kiểm tra có ai có position đó đã duyệt chưa
        const { data: positionEmployees } = await supabase
          .from("employees")
          .select("id")
          .eq("position_id", required.approver_position_id)
        
        const positionEmployeeIds = positionEmployees?.map(e => e.id) || []
        found = approvals.some(a => 
          positionEmployeeIds.includes(a.approver_id) && a.status === "approved"
        )
      } else if (required.approver_role_code) {
        // Kiểm tra có ai có role đó đã duyệt chưa
        const { data: roleUsers } = await supabase
          .from("user_roles")
          .select(`
            user_id,
            role:roles!role_id(code)
          `)
          .eq("roles.code", required.approver_role_code)
        
        if (roleUsers) {
          const { data: roleEmployees } = await supabase
            .from("employees")
            .select("id")
            .in("user_id", roleUsers.map(r => r.user_id))
          
          const roleEmployeeIds = roleEmployees?.map(e => e.id) || []
          found = approvals.some(a => 
            roleEmployeeIds.includes(a.approver_id) && a.status === "approved"
          )
        }
      }
      
      if (!found) {
        allApproved = false
        break
      }
    }
    
    if (allApproved) {
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

// =============================================
// REQUEST ASSIGNED APPROVERS (Người duyệt được chỉ định khi tạo phiếu)
// =============================================

export async function getRequestAssignedApprovers(requestId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("request_assigned_approvers")
    .select(`
      *,
      approver:employees!approver_id(id, full_name, employee_code)
    `)
    .eq("request_id", requestId)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error getting assigned approvers:", error)
    return []
  }

  return data || []
}
