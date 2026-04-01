"use server"

import { createClient, createServiceClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { RequestType, EmployeeRequestWithRelations, EligibleApprover, CustomField, RequestTypeApproverWithRelations } from "@/lib/types/database"
import { getNowVN, calculateLeaveDays } from "@/lib/utils/date-utils"
import { validateTimeSlot, validateNoOverlap } from "@/lib/utils/time-slot-utils"
import { calculateAvailableBalance } from "@/lib/utils/leave-utils"
import { isMakeupRequestType, isEmployeeOffDay, isSameMonth, LINKED_DEFICIT_DATE_KEY, LINKED_DEFICIT_LINKS_KEY, getMakeupDeficitLinks, type MakeupDeficitLink } from "@/lib/utils/makeup-utils"
import { getEmployeeViolations } from "./payroll/violations"
import type { ShiftInfo } from "./payroll/types"
import { differenceInDays, parseISO, startOfDay } from "date-fns"
import { getCurrentSequentialStep, isApproverAtCurrentStep } from "@/lib/utils/approval-utils"

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
  submission_deadline?: number | null
  custom_fields?: CustomField[] | null
  display_order?: number
  allows_multiple_time_slots?: boolean
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
    submission_deadline: input.submission_deadline,
    custom_fields: input.custom_fields || null,
    display_order: input.display_order ?? 0,
    allows_multiple_time_slots: input.allows_multiple_time_slots ?? false,
  })

  if (error) {
    console.error("Error creating request type:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

export async function updateRequestTypeOrder(
  items: { id: string; display_order: number }[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  for (const item of items) {
    const { error } = await supabase
      .from("request_types")
      .update({ display_order: item.display_order })
      .eq("id", item.id)

    if (error) {
      console.error("Error updating request type order:", error)
      return { success: false, error: error.message }
    }
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
    submission_deadline: number | null
    custom_fields: CustomField[] | null
    is_active: boolean
    display_order: number
    allows_multiple_time_slots: boolean
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

// Kiểm tra xem user có quyền duyệt phiếu không (dựa trên level chức vụ hoặc role HR/Admin)
export async function checkCanApproveRequests(): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  // Kiểm tra xem user có phải HR/Admin không - họ luôn có quyền duyệt
  const { data: userRoles } = await supabase
    .from("user_roles")
    .select(`role:roles!role_id(code)`)
    .eq("user_id", user.id)

  const isHrOrAdmin = userRoles?.some((ur: any) =>
    ur.role?.code === 'admin' || ur.role?.code === 'hr'
  )

  if (isHrOrAdmin) return true

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
      request_type:request_types!request_type_id(*),
      time_slots:request_time_slots(*)
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
        request_type:request_types!request_type_id(*),
        time_slots:request_time_slots(*)
      `)
      .order("created_at", { ascending: false })

    if (filters?.status) query = query.eq("status", filters.status)
    if (filters?.request_type_id) query = query.eq("request_type_id", filters.request_type_id)
    if (filters?.employee_id) query = query.eq("employee_id", filters.employee_id)

    const { data, error } = await query

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
  // và thông tin thứ tự duyệt (display_order) + trạng thái hiện tại
  const { data: assignedRequests } = await supabase
    .from("request_assigned_approvers")
    .select("request_id, status, display_order")
    .eq("approver_id", currentEmployee.id)

  if (!assignedRequests || assignedRequests.length === 0) {
    return []
  }

  const assignedRequestIds = assignedRequests.map(r => r.request_id)

  // Bước 2: Lấy toàn bộ người duyệt của các phiếu đó để xác định bước hiện tại.
  // Dùng service client để thấy TẤT CẢ assignees (bypass RLS), tránh người bước 2 thấy phiếu chưa qua bước 1.
  const serviceSupabase = createServiceClient()
  const { data: allApprovers } = await serviceSupabase
    .from("request_assigned_approvers")
    .select("request_id, status, display_order")
    .in("request_id", assignedRequestIds)

  const approvalMap = new Map<string, string>(assignedRequests.map(a => [a.request_id, a.status]))
  const myDisplayOrderByRequest = new Map<string, number>(assignedRequests.map((a: any) => [a.request_id, a.display_order ?? 1]))

  // Tính bước hiện tại từng phiếu (để UI biết phiếu nào user được phép duyệt ngay)
  const currentStepByRequest = new Map<string, number | null>()
  if (allApprovers) {
    for (const row of allApprovers) {
      const requestId = row.request_id as string
      if (!currentStepByRequest.has(requestId)) {
        const pendingForRequest = allApprovers.filter((r: any) => r.request_id === requestId && r.status === "pending")
        if (pendingForRequest.length === 0) {
          currentStepByRequest.set(requestId, null)
        } else {
          const minOrder = Math.min(...pendingForRequest.map((r: any) => r.display_order || 1))
          currentStepByRequest.set(requestId, minOrder)
        }
      }
    }
  }

  // Lấy TẤT CẢ phiếu mà user được chỉ định duyệt (mọi trạng thái: chờ duyệt, đã duyệt, từ chối)
  const uniqueRequestIds = [...new Set(assignedRequestIds)]

  // Bước 2: Lấy chi tiết các phiếu đó
  let query = supabase
    .from("employee_requests")
    .select(`
      *,
      employee:employees!employee_id(id, full_name, employee_code, department_id),
      approver:employees!approver_id(id, full_name),
      request_type:request_types!request_type_id(*),
      time_slots:request_time_slots(*)
    `)
    .in("id", uniqueRequestIds)
    .order("created_at", { ascending: false })

  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.request_type_id) query = query.eq("request_type_id", filters.request_type_id)
  if (filters?.employee_id) query = query.eq("employee_id", filters.employee_id)

  const { data, error } = await query

  if (error) {
    console.error("Error listing employee requests:", error)
    return []
  }

  return (data || []).map(r => {
    const myStatus = approvalMap.get(r.id)
    const currentStep = currentStepByRequest.get(r.id)
    const myOrder = myDisplayOrderByRequest.get(r.id) ?? 1
    const canApproveNow =
      r.status === "pending" &&
      myStatus === "pending" &&
      currentStep != null &&
      myOrder === currentStep
    return {
      ...r,
      my_approval_status: myStatus,
      can_approve_now: canApproveNow,
    }
  }) as (EmployeeRequestWithRelations & { my_approval_status?: string; can_approve_now?: boolean })[]
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
      approver:employees!approver_id(id, full_name),
      time_slots:request_time_slots(*)
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
  assigned_approver_ids?: string[] // Danh sách người duyệt được chỉ định (legacy, không mang thông tin bước)
  assigned_approvers_with_order?: { approver_id: string; display_order: number }[] // Hỗ trợ nhiều người / bước
  custom_data?: Record<string, string> // Dữ liệu từ custom fields
  time_slots?: { from_time: string; to_time: string }[] // Nhiều khung giờ
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
  const hasApproversByIds = !!input.assigned_approver_ids && input.assigned_approver_ids.length > 0
  const hasApproversWithOrder =
    !!input.assigned_approvers_with_order && input.assigned_approvers_with_order.length > 0

  if (!hasApproversByIds && !hasApproversWithOrder) {
    return { success: false, error: "Vui lòng chọn ít nhất 1 người duyệt" }
  }

  // Validate số dư phép và thời hạn tạo phiếu
  const { data: requestType } = await supabase
    .from("request_types")
    .select("code, deduct_leave_balance, submission_deadline, allows_multiple_time_slots")
    .eq("id", input.request_type_id)
    .single()

  // Validate deadline (Giới hạn thời gian tạo phiếu)
  if (requestType?.submission_deadline && requestType.submission_deadline > 0) {
    const eventDateStr = input.from_date || input.request_date
    // Nếu eventDateStr < today -> là phiếu bổ sung cho quá khứ
    if (eventDateStr) {
      const eventDate = startOfDay(parseISO(eventDateStr))
      const today = startOfDay(new Date())

      // Nếu ngày sự việc là quá khứ, kiểm tra deadline
      // differenceInDays(later, earlier) returns positive integer
      const dayDiff = differenceInDays(today, eventDate)

      if (dayDiff > requestType.submission_deadline) {
        return {
          success: false,
          error: `Quá hạn tạo phiếu. Quy định yêu cầu tạo trong vòng ${requestType.submission_deadline} ngày sau khi sự việc xảy ra (bạn đang tạo trễ ${dayDiff} ngày).`
        }
      }
    }
  }

  if (requestType && (requestType.deduct_leave_balance || requestType.code.includes("annual"))) {
    const { data: empData } = await supabase.from("employees").select("official_date").eq("id", employee.id).single()

    // Calculate requested days
    // Note: If requires_time is true, logic might differ, but calculateLeaveDays handles it if we pass times.
    const requestedDays = calculateLeaveDays(
      input.from_date || null,
      input.to_date || null,
      input.from_time,
      input.to_time
    )

    const currentYear = new Date().getFullYear()

    // We need getAnnualLeaveUsage. It is defined in this file.
    // However, it is an async function.
    const usedDays = await getAnnualLeaveUsage(employee.id, currentYear)

    // Calculate balance
    // Note: calculateAvailableBalance expects usedDays to subtract from total to give remaining.
    // But here we want the entitlement data to check logic.
    const { availableToUse } = calculateAvailableBalance(
      empData?.official_date || null,
      0, // Pass 0 as usedDays to get the full accrued amount so far
      new Date()
    )

    // Real remaining = (Accrued Limit) - (Actually Used)
    const remaining = availableToUse - usedDays

    if (requestedDays > remaining) {
      return { success: false, error: `Số dư phép không đủ. Bạn có ${remaining} ngày, yêu cầu ${requestedDays} ngày.` }
    }
  }

  // Validate phiếu làm bù
  let normalizedMakeupCustomData: Record<string, unknown> | undefined
  if (requestType && isMakeupRequestType(requestType.code)) {
    const cd = (input.custom_data || {}) as Record<string, unknown>
    let links: MakeupDeficitLink[] = []
    const rawLinks = cd[LINKED_DEFICIT_LINKS_KEY]
    if (Array.isArray(rawLinks) && rawLinks.length > 0) {
      links = rawLinks.filter((l: any) => l && typeof l.deficit_date === "string" && typeof l.amount === "number").map((l: any) => ({ deficit_date: l.deficit_date, amount: l.amount }))
    }
    if (links.length === 0) {
      const single = cd[LINKED_DEFICIT_DATE_KEY] as string | undefined
      if (single) links = [{ deficit_date: single, amount: 1 }]
    }
    if (links.length === 0) {
      return { success: false, error: "Vui lòng chọn ngày thiếu công gốc" }
    }
    if (!input.request_date) {
      return { success: false, error: "Vui lòng chọn ngày làm bù" }
    }

    const firstDeficitDate = links[0].deficit_date
    if (requestType.code === "late_early_makeup" && !isSameMonth(input.request_date, firstDeficitDate)) {
      return { success: false, error: "Phiếu đi muộn/về sớm làm bù chỉ được tạo trong cùng tháng với ngày thiếu công" }
    }

    if (requestType.code === "full_day_makeup") {
      const totalAmount = links.reduce((s, l) => s + l.amount, 0)
      if (totalAmount > 1) {
        return { success: false, error: "Tổng số ngày bù không được vượt quá 1 ngày" }
      }
      for (const l of links) {
        if (l.amount !== 0.5 && l.amount !== 1) {
          return { success: false, error: "Mỗi ngày thiếu công chỉ được nhập 0,5 hoặc 1 ngày" }
        }
      }

      const { data: satSchedules } = await supabase
        .from("saturday_work_schedule")
        .select("employee_id, work_date, is_working")
        .eq("employee_id", employee.id)

      const { data: holidays } = await supabase
        .from("holidays")
        .select("holiday_date")
        .eq("holiday_date", input.request_date)

      if (!isEmployeeOffDay(input.request_date, satSchedules || [], employee.id, holidays || [])) {
        return { success: false, error: "Ngày làm bù phải là ngày nghỉ của nhân viên (Chủ nhật, Thứ 7 nghỉ theo lịch, hoặc ngày lễ)" }
      }

      // Over-consume: deficit amount và đã consumed theo từng ngày
      const deficitDates = [...new Set(links.map((l) => l.deficit_date))]
      const startDate = deficitDates.reduce((a, b) => (a < b ? a : b))
      const endDate = deficitDates.reduce((a, b) => (a > b ? a : b))
      const { data: empWithShift } = await supabase.from("employees").select("shift_id").eq("id", employee.id).single()
      const shiftId = (empWithShift as any)?.shift_id
      let shiftInfo: ShiftInfo = { startTime: "08:00", endTime: "17:00", breakStart: null, breakEnd: null }
      if (shiftId) {
        const { data: shiftRow } = await supabase.from("work_shifts").select("start_time, end_time, break_start, break_end").eq("id", shiftId).single()
        if (shiftRow) {
          shiftInfo = {
            startTime: (shiftRow as any).start_time?.slice(0, 5) || "08:00",
            endTime: (shiftRow as any).end_time?.slice(0, 5) || "17:00",
            breakStart: (shiftRow as any).break_start?.slice(0, 5) || null,
            breakEnd: (shiftRow as any).break_end?.slice(0, 5) || null,
          }
        }
      }
      const violations = await getEmployeeViolations(supabase, employee.id, startDate, endDate, shiftInfo)
      const deficitAmountByDate: Record<string, number> = {}
      for (const v of violations) {
        if (v.isAbsent) deficitAmountByDate[v.date] = 1
        else if (v.isHalfDay) deficitAmountByDate[v.date] = 0.5
        else if (deficitAmountByDate[v.date] === undefined) deficitAmountByDate[v.date] = 0
      }

      // Lấy saturday schedules và holidays cho các ngày thiếu công
      // để kiểm tra ngày nào là ngày làm việc nhưng không có attendance log (vắng cả ngày)
      const { data: deficitSatSchedules } = await supabase
        .from("saturday_work_schedule")
        .select("employee_id, work_date, is_working")
        .eq("employee_id", employee.id)
        .in("work_date", deficitDates)

      const { data: deficitHolidays } = await supabase
        .from("holidays")
        .select("holiday_date")
        .in("holiday_date", deficitDates)

      // Nếu ngày thiếu công là ngày làm việc (không phải off day) nhưng không có violation
      // → nhân viên vắng cả ngày (không chấm công) → deficit = 1
      for (const dd of deficitDates) {
        if (deficitAmountByDate[dd] === undefined) {
          const isOff = isEmployeeOffDay(dd, deficitSatSchedules || [], employee.id, deficitHolidays || [])
          if (!isOff) {
            deficitAmountByDate[dd] = 1
          }
        }
      }
      const { data: existingMakeup } = await supabase
        .from("employee_requests")
        .select("id, custom_data, request_type:request_types!request_type_id(code)")
        .eq("employee_id", employee.id)
        .eq("status", "approved")
      const consumedByDate: Record<string, number> = {}
      for (const r of existingMakeup || []) {
        if ((r as any).request_type?.code !== "full_day_makeup") continue
        const existingLinks = getMakeupDeficitLinks((r as any).custom_data as Record<string, unknown>)
        for (const el of existingLinks) {
          consumedByDate[el.deficit_date] = (consumedByDate[el.deficit_date] || 0) + el.amount
        }
      }
      for (const link of links) {
        const def = deficitAmountByDate[link.deficit_date] ?? 0
        if (def <= 0) {
          return { success: false, error: `Ngày ${link.deficit_date} không có thiếu công (nửa ngày/cả ngày) để bù` }
        }
        const consumed = consumedByDate[link.deficit_date] || 0
        if (consumed + link.amount > def) {
          return { success: false, error: `Ngày thiếu công ${link.deficit_date} đã được bù đủ (còn lại ${def - consumed} ngày). Không thể bù thêm ${link.amount} ngày.` }
        }
      }

      // Nếu user không chọn giờ cho full_day_makeup → mặc định theo ca làm
      if (!input.from_time || !input.to_time) {
        input.from_time = shiftInfo.startTime
        input.to_time = shiftInfo.endTime
      }

      normalizedMakeupCustomData = { [LINKED_DEFICIT_LINKS_KEY]: links }
      if (links.length === 1) (normalizedMakeupCustomData as Record<string, string>)[LINKED_DEFICIT_DATE_KEY] = links[0].deficit_date
    } else {
      normalizedMakeupCustomData = { [LINKED_DEFICIT_DATE_KEY]: firstDeficitDate }
    }
    // late_early_makeup vẫn bắt buộc nhập giờ bù
    if (requestType.code === "late_early_makeup" && (!input.from_time || !input.to_time)) {
      return { success: false, error: "Vui lòng nhập giờ bắt đầu và kết thúc làm bù" }
    }

    const { data: existingOT } = await supabase
      .from("employee_requests")
      .select("id, from_time, to_time, request_type:request_types!request_type_id(code)")
      .eq("employee_id", employee.id)
      .eq("status", "approved")
      .eq("request_date", input.request_date)

    const otConflict = (existingOT || []).some((req: any) => {
      if (req.request_type?.code !== "overtime") return false
      if (!req.from_time || !req.to_time || !input.from_time || !input.to_time) return false
      return req.from_time < input.to_time && req.to_time > input.from_time
    })
    if (otConflict) {
      return { success: false, error: "Khung giờ làm bù trùng với phiếu tăng ca đã duyệt. Vui lòng chọn khung giờ khác." }
    }
  }

  // Tạo phiếu (dùng normalized custom_data cho makeup để lưu linked_deficit_links)
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
    custom_data: normalizedMakeupCustomData ?? input.custom_data ?? null,
    status: "pending",
  }).select("id").single()

  if (error) {
    console.error("Error creating employee request:", error)
    return { success: false, error: error.message }
  }

  // Lưu danh sách người duyệt được chỉ định
  if (newRequest) {
    const records: {
      request_id: string
      approver_id: string
      display_order: number
      status: "pending"
    }[] = []

    if (hasApproversWithOrder) {
      for (const row of input.assigned_approvers_with_order!) {
        records.push({
          request_id: newRequest.id,
          approver_id: row.approver_id,
          display_order: row.display_order,
          status: "pending",
        })
      }
    } else if (hasApproversByIds) {
      // Chế độ "chỉ cần 1 người duyệt": tất cả cùng bước (display_order 1), 1 người đồng ý là đủ
      input.assigned_approver_ids!.forEach((approverId) => {
        records.push({
          request_id: newRequest.id,
          approver_id: approverId,
          display_order: 1,
          status: "pending",
        })
      })
    }

    if (records.length > 0) {
      const { error: approverError } = await supabase
        .from("request_assigned_approvers")
        .insert(records)

      if (approverError) {
        console.error("Error saving assigned approvers:", approverError)
        // Xóa phiếu nếu không lưu được người duyệt
        await supabase.from("employee_requests").delete().eq("id", newRequest.id)
        return { success: false, error: "Không thể lưu danh sách người duyệt" }
      }
    }
  }

  // Lưu nhiều khung giờ nếu loại phiếu hỗ trợ
  if (newRequest && requestType?.allows_multiple_time_slots && input.time_slots && input.time_slots.length > 0) {
    // Validate từng khung giờ
    for (const slot of input.time_slots) {
      const slotValidation = validateTimeSlot(slot.from_time, slot.to_time)
      if (!slotValidation.valid) {
        await supabase.from("employee_requests").delete().eq("id", newRequest.id)
        return { success: false, error: slotValidation.error }
      }
    }

    // Validate không chồng chéo
    const overlapValidation = validateNoOverlap(input.time_slots)
    if (!overlapValidation.valid) {
      await supabase.from("employee_requests").delete().eq("id", newRequest.id)
      return { success: false, error: overlapValidation.error }
    }

    // Insert time slots
    const timeSlotRecords = input.time_slots.map((slot, index) => ({
      request_id: newRequest.id,
      from_time: slot.from_time,
      to_time: slot.to_time,
      slot_order: index,
    }))

    const { error: timeSlotsError } = await supabase
      .from("request_time_slots")
      .insert(timeSlotRecords)

    if (timeSlotsError) {
      console.error("Error saving time slots:", timeSlotsError)
      await supabase.from("employee_requests").delete().eq("id", newRequest.id)
      return { success: false, error: "Không thể lưu khung giờ" }
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

  // Kiểm tra xem người duyệt có phải HR/Admin không
  const { data: approverRoles } = await supabase
    .from("user_roles")
    .select(`role:roles!role_id(code)`)
    .eq("user_id", user.id)

  const isHrOrAdmin = approverRoles?.some((ur: any) =>
    ur.role?.code === 'admin' || ur.role?.code === 'hr'
  )

  const approvalMode = requestType?.approval_mode || "any"

  // Luồng duyệt tuần tự theo danh sách request_assigned_approvers:
  // - Ưu tiên dùng khi có cấu hình nhiều người/bước (display_order)
  // - Không phụ thuộc hoàn toàn vào approval_mode của request_type
  // Dùng service client để đọc TẤT CẢ assignees (bypass RLS), tránh trường hợp mỗi user chỉ thấy dòng của mình -> anyPending sai -> phiếu bị duyệt sớm
  const serviceSupabase = createServiceClient()
  const { data: assignedApprovers } = await serviceSupabase
    .from("request_assigned_approvers")
    .select("*")
    .eq("request_id", id)

  const hasSequentialApprovers = assignedApprovers && assignedApprovers.length > 0

  // Nếu có cấu hình người duyệt được chỉ định
  if (hasSequentialApprovers) {
    if (assignedApprovers && assignedApprovers.length > 0) {
      const myRow = assignedApprovers.find((a) => a.approver_id === approverEmployee.id)
      const isAssigned = !!myRow
      if (!isAssigned && !isHrOrAdmin) {
        return { success: false, error: "Bạn không nằm trong danh sách người duyệt được chỉ định cho phiếu này" }
      }

      // Chế độ "chỉ cần 1 người duyệt": 1 người đồng ý → tất cả coi như đã duyệt, phiếu approved (kể cả phiếu cũ lưu 2 bước)
      if (approvalMode === "any") {
        const now = getNowVN()
        const { error: updateAllError } = await serviceSupabase
          .from("request_assigned_approvers")
          .update({ status: "approved", approved_at: now })
          .eq("request_id", id)
          .eq("status", "pending")

        if (updateAllError) {
          console.error("Error updating all approvers (any mode):", updateAllError)
          return { success: false, error: updateAllError.message }
        }

        const { data: afterApprovers } = await serviceSupabase
          .from("request_assigned_approvers")
          .select("status")
          .eq("request_id", id)

        const anyRejected = afterApprovers?.some((a) => a.status === "rejected")
        if (anyRejected) {
          const { error } = await supabase
            .from("employee_requests")
            .update({
              status: "rejected",
              approver_id: approverEmployee.id,
              approved_at: getNowVN(),
            })
            .eq("id", id)
          if (error) {
            console.error("Error rejecting request:", error)
            return { success: false, error: error.message }
          }
        } else {
          const { error } = await supabase
            .from("employee_requests")
            .update({
              status: "approved",
              approver_id: approverEmployee.id,
              approved_at: getNowVN(),
            })
            .eq("id", id)
          if (error) {
            console.error("Error approving request (any mode):", error)
            return { success: false, error: error.message }
          }
        }
        revalidatePath("/dashboard/leave")
        revalidatePath("/dashboard/leave-approval")
        return { success: true }
      }

      // Chế độ "cần tất cả người duyệt": luồng tuần tự theo bước
      const sequentialApprovers = assignedApprovers.map((a: any) => ({
        display_order: a.display_order as number | null,
        status: a.status as string,
      }))
      const currentStep = getCurrentSequentialStep(sequentialApprovers)

      // Nếu không còn bước nào pending -> phiếu đã xong hoặc dữ liệu không hợp lệ
      if (currentStep == null) {
        return { success: false, error: "Phiếu đã được xử lý xong" }
      }

      // HR/Admin có thể duyệt bất kỳ bước nào; người thường chỉ được duyệt khi đến lượt
      if (!isHrOrAdmin && !isApproverAtCurrentStep(myRow?.display_order ?? null, sequentialApprovers)) {
        return { success: false, error: "Chưa đến lượt bạn duyệt phiếu này" }
      }

      // Trong luồng tuần tự: chỉ duyệt bước hiện tại (currentStep), không duyệt hết tất cả bước.
      // HR/Admin cũng chỉ duyệt một bước mỗi lần để giữ đúng thứ tự.
      const now = getNowVN()
      if (isHrOrAdmin) {
        // HR/Admin: duyệt toàn bộ người ở bước hiện tại (currentStep)
        const { error: updateStepError } = await supabase
          .from("request_assigned_approvers")
          .update({
            status: "approved",
            approved_at: now,
          })
          .eq("request_id", id)
          .eq("display_order", currentStep)
          .eq("status", "pending")

        if (updateStepError) {
          console.error("Error updating step approvers (HR/Admin):", updateStepError)
          return { success: false, error: updateStepError.message }
        }
      } else if (isAssigned) {
        // Người duyệt thường: duyệt bước hiện tại
        // 1) Cập nhật trạng thái cho bản ghi của chính họ
        const { error: updateSelfError } = await supabase
          .from("request_assigned_approvers")
          .update({
            status: "approved",
            approved_at: now,
          })
          .eq("request_id", id)
          .eq("approver_id", approverEmployee.id)

        if (updateSelfError) {
          console.error("Error updating approver status:", updateSelfError)
          return { success: false, error: updateSelfError.message }
        }

        // 2) Tự động coi như cả bước đã hoàn thành:
        // tất cả bản ghi cùng display_order còn pending sẽ được auto-approved
        const { error: autoStepError } = await supabase
          .from("request_assigned_approvers")
          .update({
            status: "approved",
            approved_at: now,
          })
          .eq("request_id", id)
          .eq("display_order", myRow?.display_order ?? currentStep)
          .eq("status", "pending")

        if (autoStepError) {
          console.error("Error auto-approving step approvers:", autoStepError)
          return { success: false, error: autoStepError.message }
        }
      }

      // Kiểm tra lại tất cả người duyệt sau khi cập nhật (dùng service client để thấy đủ mọi dòng, tránh RLS)
      const { data: updatedApprovers } = await serviceSupabase
        .from("request_assigned_approvers")
        .select("*")
        .eq("request_id", id)

      const anyRejected = updatedApprovers?.some((a) => a.status === "rejected")
      const anyPending = updatedApprovers?.some((a) => a.status === "pending")

      if (anyRejected) {
        // Nếu có người từ chối -> phiếu bị từ chối
        const { error } = await supabase
          .from("employee_requests")
          .update({
            status: "rejected",
            approver_id: approverEmployee.id,
            approved_at: getNowVN(),
          })
          .eq("id", id)

        if (error) {
          console.error("Error rejecting request:", error)
          return { success: false, error: error.message }
        }
      } else if (!anyPending) {
        // Không còn ai pending -> phiếu được duyệt
        const { error } = await supabase
          .from("employee_requests")
          .update({
            status: "approved",
            approver_id: approverEmployee.id,
            approved_at: getNowVN(),
          })
          .eq("id", id)

        if (error) {
          console.error("Error approving request:", error)
          return { success: false, error: error.message }
        }
      }

      revalidatePath("/dashboard/leave")
      revalidatePath("/dashboard/leave-approval")

      const pendingCount = updatedApprovers?.filter((a) => a.status === "pending").length || 0
      if (pendingCount > 0) {
        return { success: true, message: `Đã duyệt. Còn ${pendingCount} người cần duyệt nữa.` }
      }
      return { success: true }
    }
  }

  // Nếu không có cấu hình request_assigned_approvers (duyệt tuần tự),
  // fallback về cơ chế cũ dựa trên request_approvals + approval_mode

  // Nếu approval_mode = "all", lưu vào request_approvals và check đủ người duyệt
  if (approvalMode === "all") {
    const { error: approvalError } = await supabase
      .from("request_approvals")
      .upsert({
        request_id: id,
        approver_id: approverEmployee.id,
        status: "approved",
        approved_at: getNowVN(),
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
            approved_at: getNowVN(),
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
      approved_at: getNowVN(),
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
        approved_at: getNowVN(),
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

        const roleUserIds = roleUsers?.map((u: any) => u.user_id) || []

        // Find employees for these users
        const { data: roleEmployees } = await supabase
          .from("employees")
          .select("id")
          .in("user_id", roleUserIds)

        const roleEmployeeIds = roleEmployees?.map((e: any) => e.id) || []
        found = approvals.some((a: any) =>
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
    await supabase
      .from("employee_requests")
      .update({
        status: "approved",
        approver_id: currentApproverId,
        approved_at: getNowVN(),
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
  // Kiểm tra xem người duyệt có phải HR/Admin không - họ có quyền duyệt mọi phiếu
  const { data: userRolesCheck } = await supabase
    .from("user_roles")
    .select(`
      role:roles!role_id(code)
    `)
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id)

  const isHrOrAdmin = userRolesCheck?.some((ur: any) =>
    ur.role?.code === 'admin' || ur.role?.code === 'hr'
  )

  // HR/Admin có quyền duyệt mọi phiếu
  if (isHrOrAdmin) {
    return { allowed: true }
  }

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
      const hasRole = userRolesCheck?.some((ur: any) => ur.role?.code === approver.approver_role_code)
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

  // Kiểm tra xem người duyệt có phải HR/Admin không
  const { data: approverRoles } = await supabase
    .from("user_roles")
    .select(`role:roles!role_id(code)`)
    .eq("user_id", user.id)

  const isHrOrAdmin = approverRoles?.some((ur: any) =>
    ur.role?.code === 'admin' || ur.role?.code === 'hr'
  )

  // Nếu approval_mode = "all", cập nhật trạng thái người duyệt trước
  if (approvalMode === "all") {
    const { data: assignedApprovers } = await supabase
      .from("request_assigned_approvers")
      .select("*")
      .eq("request_id", id)

    if (assignedApprovers && assignedApprovers.length > 0) {
      const myRow = assignedApprovers.find((a) => a.approver_id === approverEmployee.id)
      const isAssigned = !!myRow

      if (!isAssigned && !isHrOrAdmin) {
        return { success: false, error: "Bạn không nằm trong danh sách người duyệt được chỉ định cho phiếu này" }
      }

      // Tính bước duyệt hiện tại
      const sequentialApprovers = assignedApprovers.map((a: any) => ({
        display_order: a.display_order as number | null,
        status: a.status as string,
      }))
      const currentStep = getCurrentSequentialStep(sequentialApprovers)

      if (currentStep == null) {
        return { success: false, error: "Phiếu đã được xử lý xong" }
      }

      if (!isHrOrAdmin && !isApproverAtCurrentStep(myRow?.display_order ?? null, sequentialApprovers)) {
        return { success: false, error: "Chưa đến lượt bạn duyệt phiếu này" }
      }

      const now = getNowVN()

      if (isHrOrAdmin) {
        // HR/Admin: từ chối thay cho tất cả
        await supabase
          .from("request_assigned_approvers")
          .update({
            status: "rejected",
            approved_at: now,
          })
          .eq("request_id", id)
          .eq("status", "pending")
      } else if (isAssigned) {
        // Người duyệt thường: chỉ cập nhật bản ghi của mình
        await supabase
          .from("request_assigned_approvers")
          .update({
            status: "rejected",
            approved_at: now,
          })
          .eq("request_id", id)
          .eq("approver_id", approverEmployee.id)
      }
    }
  } else {
    // Nếu approval_mode = "any", vẫn cần cập nhật trạng thái người duyệt
    const { data: assignedApproversAny } = await supabase
      .from("request_assigned_approvers")
      .select("*")
      .eq("request_id", id)

    if (assignedApproversAny && assignedApproversAny.length > 0) {
      await supabase
        .from("request_assigned_approvers")
        .update({
          status: "rejected",
          approved_at: getNowVN()
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
      approved_at: getNowVN(),
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

/** Chính sách chỉnh sửa phiếu: sau bước 1 chỉ được sửa trường tùy chỉnh (editable_while_approving); sau bước cuối không được sửa. */
export async function getRequestEditPolicy(requestId: string): Promise<{
  canEdit: boolean
  onlyCustomFields: boolean
  editableCustomFieldIds: string[]
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { canEdit: false, onlyCustomFields: false, editableCustomFieldIds: [] }

  const { data: request } = await supabase
    .from("employee_requests")
    .select("id, status, employee_id, request_type_id")
    .eq("id", requestId)
    .single()

  if (!request) return { canEdit: false, onlyCustomFields: false, editableCustomFieldIds: [] }
  if (request.status !== "pending") return { canEdit: false, onlyCustomFields: false, editableCustomFieldIds: [] }

  const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single()
  if (!employee || employee.id !== request.employee_id) return { canEdit: false, onlyCustomFields: false, editableCustomFieldIds: [] }

  const { data: requestType } = await supabase
    .from("request_types")
    .select("custom_fields")
    .eq("id", request.request_type_id)
    .single()

  const serviceSupabase = createServiceClient()
  const { data: assignees } = await serviceSupabase
    .from("request_assigned_approvers")
    .select("status")
    .eq("request_id", requestId)

  const hasAnyApproved = assignees?.some((a: { status: string }) => a.status === "approved") ?? false
  const customFields = (requestType?.custom_fields as { id: string; editable_while_approving?: boolean }[] | null) ?? []

  if (hasAnyApproved) {
    const editableIds = customFields.filter((f) => f.editable_while_approving).map((f) => f.id)
    return { canEdit: true, onlyCustomFields: true, editableCustomFieldIds: editableIds }
  }

  return { canEdit: true, onlyCustomFields: false, editableCustomFieldIds: customFields.map((f) => f.id) }
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
    assigned_approvers_with_order?: { approver_id: string; display_order: number }[]
    custom_data?: Record<string, string>
    time_slots?: { from_time: string; to_time: string }[]
  }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  // Lấy thông tin phiếu hiện tại
  const { data: currentRequest } = await supabase
    .from("employee_requests")
    .select("employee_id, status, request_type_id")
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

  // Sau khi có người duyệt ở bước 1 trở lên: chỉ cho sửa trường tùy chỉnh có editable_while_approving.
  // Sau khi bước cuối duyệt (status !== pending) đã chặn ở trên.
  const serviceSupabase = createServiceClient()
  const { data: assignees } = await serviceSupabase
    .from("request_assigned_approvers")
    .select("status")
    .eq("request_id", id)

  const hasAnyApproved = assignees?.some((a: { status: string }) => a.status === "approved") ?? false

  if (hasAnyApproved) {
    const { data: requestType } = await supabase
      .from("request_types")
      .select("custom_fields")
      .eq("id", currentRequest.request_type_id ?? "")
      .single()

    const customFields = (requestType?.custom_fields as { id: string; editable_while_approving?: boolean }[] | null) ?? []
    const allowedCustomKeys = new Set(customFields.filter((f) => f.editable_while_approving).map((f) => f.id))

    const hasDisallowedUpdate =
      input.from_date !== undefined ||
      input.to_date !== undefined ||
      input.request_date !== undefined ||
      input.request_time !== undefined ||
      input.from_time !== undefined ||
      input.to_time !== undefined ||
      input.reason !== undefined ||
      input.attachment_url !== undefined ||
      input.assigned_approver_ids !== undefined ||
      input.assigned_approvers_with_order !== undefined ||
      input.time_slots !== undefined

    if (hasDisallowedUpdate) {
      return { success: false, error: "Phiếu đã có người duyệt, chỉ được sửa một số trường tùy chỉnh (nếu loại phiếu cho phép)." }
    }

    if (input.custom_data !== undefined) {
      const { data: current } = await supabase.from("employee_requests").select("custom_data").eq("id", id).single()
      const existing = (current?.custom_data as Record<string, string> | null) ?? {}
      const merged: Record<string, string> = { ...existing }
      for (const key of Object.keys(input.custom_data)) {
        if (allowedCustomKeys.has(key)) merged[key] = input.custom_data[key]
      }
      const { error: updateError } = await supabase
        .from("employee_requests")
        .update({ custom_data: Object.keys(merged).length ? merged : null })
        .eq("id", id)
      if (updateError) {
        console.error("Error updating employee request (custom only):", updateError)
        return { success: false, error: updateError.message }
      }
    }
    revalidatePath("/dashboard/leave")
    revalidatePath("/dashboard/leave-approval")
    return { success: true }
  }

  // Validate date range
  if (input.from_date && input.to_date && input.from_date > input.to_date) {
    return { success: false, error: "Ngày bắt đầu phải trước ngày kết thúc" }
  }

  // Validate người duyệt bắt buộc khi update
  if (
    input.assigned_approver_ids !== undefined &&
    input.assigned_approver_ids.length === 0 &&
    (!input.assigned_approvers_with_order || input.assigned_approvers_with_order.length === 0)
  ) {
    return { success: false, error: "Vui lòng chọn ít nhất 1 người duyệt" }
  }

  // Cập nhật phiếu (chưa có ai duyệt)
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
      custom_data: input.custom_data || null,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating employee request:", error)
    return { success: false, error: error.message }
  }

  // Cập nhật danh sách người duyệt nếu có
  const hasUpdatedApproversByIds =
    !!input.assigned_approver_ids && input.assigned_approver_ids.length > 0
  const hasUpdatedApproversWithOrder =
    !!input.assigned_approvers_with_order && input.assigned_approvers_with_order.length > 0

  if (hasUpdatedApproversByIds || hasUpdatedApproversWithOrder) {
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
    const approverRecords: {
      request_id: string
      approver_id: string
      display_order: number
      status: "pending"
    }[] = []

    if (hasUpdatedApproversWithOrder) {
      for (const row of input.assigned_approvers_with_order!) {
        approverRecords.push({
          request_id: id,
          approver_id: row.approver_id,
          display_order: row.display_order,
          status: "pending",
        })
      }
    } else if (hasUpdatedApproversByIds) {
      input.assigned_approver_ids!.forEach((approverId, index) => {
        approverRecords.push({
          request_id: id,
          approver_id: approverId,
          display_order: index + 1,
          status: "pending",
        })
      })
    }

    if (approverRecords.length > 0) {
      const { error: insertError } = await supabase
        .from("request_assigned_approvers")
        .insert(approverRecords)

      if (insertError) {
        console.error("Error inserting new approvers:", insertError)
        return { success: false, error: `Lỗi khi thêm người duyệt mới: ${insertError.message}` }
      }
    }
  }

  // Cập nhật time slots nếu có
  if (input.time_slots !== undefined) {
    // Validate từng khung giờ
    for (const slot of input.time_slots) {
      const slotValidation = validateTimeSlot(slot.from_time, slot.to_time)
      if (!slotValidation.valid) {
        return { success: false, error: slotValidation.error }
      }
    }

    // Validate không chồng chéo
    const overlapValidation = validateNoOverlap(input.time_slots)
    if (!overlapValidation.valid) {
      return { success: false, error: overlapValidation.error }
    }

    // Xóa slots cũ
    const { error: deleteTimeSlotsError } = await supabase
      .from("request_time_slots")
      .delete()
      .eq("request_id", id)

    if (deleteTimeSlotsError && deleteTimeSlotsError.code !== "PGRST116") {
      console.error("Error deleting old time slots:", deleteTimeSlotsError)
      return { success: false, error: `Lỗi khi xóa khung giờ cũ: ${deleteTimeSlotsError.message}` }
    }

    // Insert slots mới
    if (input.time_slots.length > 0) {
      const timeSlotRecords = input.time_slots.map((slot, index) => ({
        request_id: id,
        from_time: slot.from_time,
        to_time: slot.to_time,
        slot_order: index,
      }))

      const { error: insertTimeSlotsError } = await supabase
        .from("request_time_slots")
        .insert(timeSlotRecords)

      if (insertTimeSlotsError) {
        console.error("Error inserting new time slots:", insertTimeSlotsError)
        return { success: false, error: `Lỗi khi lưu khung giờ mới: ${insertTimeSlotsError.message}` }
      }
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

  return (data || []) as RequestTypeApproverWithRelations[]
}

/**
 * Ghi lại toàn bộ danh sách người duyệt theo thứ tự (display_order) cho 1 loại phiếu.
 * Hiện tại chỉ hỗ trợ cấu hình theo position (approver_position_id).
 * Hàm sẽ:
 * - Xóa tất cả request_type_approvers cũ của loại phiếu
 * - Thêm lại các bản ghi mới với display_order = index + 1
 */
export async function resetRequestTypeApprovers(input: {
  request_type_id: string
  approver_position_ids: string[]
}) {
  const supabase = await createClient()

  // Xóa cấu hình cũ
  const { error: deleteError } = await supabase
    .from("request_type_approvers")
    .delete()
    .eq("request_type_id", input.request_type_id)

  if (deleteError && deleteError.code !== "PGRST116") {
    console.error("Error deleting old request_type_approvers:", deleteError)
    return { success: false, error: deleteError.message }
  }

  // Nếu không còn bước nào -> coi như xóa hết cấu hình
  if (input.approver_position_ids.length === 0) {
    revalidatePath("/dashboard/leave-approval")
    return { success: true }
  }

  const rows = input.approver_position_ids.map((positionId, index) => ({
    request_type_id: input.request_type_id,
    approver_employee_id: null,
    approver_position_id: positionId,
    approver_role_code: null,
    display_order: index + 1,
  }))

  const { error: insertError } = await supabase
    .from("request_type_approvers")
    .insert(rows)

  if (insertError) {
    console.error("Error inserting request_type_approvers:", insertError)
    return { success: false, error: insertError.message }
  }

  revalidatePath("/dashboard/leave-approval")
  return { success: true }
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
      position:positions!approver_position_id(id, name, level)
    `)
    .eq("request_type_id", requestTypeId)

  const eligibleApprovers: EligibleApprover[] = []
  const addedIds = new Set<string>()

  // Luôn thêm Admin và HR vào danh sách người duyệt (họ có quyền duyệt mọi phiếu)
  const { data: adminHrApprovers } = await supabase
    .rpc('get_approvers_by_role', { p_role_code: 'admin' })

  if (adminHrApprovers) {
    for (const emp of adminHrApprovers) {
      if (!addedIds.has(emp.id)) {
        eligibleApprovers.push({
          id: emp.id,
          full_name: emp.full_name,
          employee_code: emp.employee_code,
          position_name: emp.position_name,
          position_level: emp.position_level || 0,
          department_name: emp.department_name,
        })
        addedIds.add(emp.id)
      }
    }
  }

  const { data: hrApprovers } = await supabase
    .rpc('get_approvers_by_role', { p_role_code: 'hr' })

  if (hrApprovers) {
    for (const emp of hrApprovers) {
      if (!addedIds.has(emp.id)) {
        eligibleApprovers.push({
          id: emp.id,
          full_name: emp.full_name,
          employee_code: emp.employee_code,
          position_name: emp.position_name,
          position_level: emp.position_level || 0,
          department_name: emp.department_name,
        })
        addedIds.add(emp.id)
      }
    }
  }

  // Nếu có danh sách người duyệt được chỉ định
  if (designatedApprovers && designatedApprovers.length > 0) {
    for (const approver of designatedApprovers) {
      // Chỉ định theo employee cụ thể - sử dụng RPC function (bypass RLS)
      if (approver.approver_employee_id) {
        const { data: empData } = await supabase
          .rpc('get_employee_as_approver', { p_employee_id: approver.approver_employee_id })

        if (empData && empData.length > 0) {
          const emp = empData[0]
          if (!addedIds.has(emp.id)) {
            eligibleApprovers.push({
              id: emp.id,
              full_name: emp.full_name,
              employee_code: emp.employee_code,
              position_name: emp.position_name,
              position_level: emp.position_level || 0,
              department_name: emp.department_name,
            })
            addedIds.add(emp.id)
          }
        }
      }

      // Chỉ định theo position - sử dụng RPC function (bypass RLS)
      if (approver.approver_position_id) {
        const { data: positionEmployees } = await supabase
          .rpc('get_approvers_by_position', { p_position_id: approver.approver_position_id })

        if (positionEmployees) {
          for (const emp of positionEmployees) {
            if (!addedIds.has(emp.id)) {
              eligibleApprovers.push({
                id: emp.id,
                full_name: emp.full_name,
                employee_code: emp.employee_code,
                position_name: emp.position_name,
                position_level: emp.position_level || 0,
                department_name: emp.department_name,
              })
              addedIds.add(emp.id)
            }
          }
        }
      }

      // Chỉ định theo role - sử dụng RPC function (bypass RLS)
      if (approver.approver_role_code) {
        const { data: roleEmployees } = await supabase
          .rpc('get_approvers_by_role', { p_role_code: approver.approver_role_code })

        if (roleEmployees) {
          for (const emp of roleEmployees) {
            if (!addedIds.has(emp.id)) {
              eligibleApprovers.push({
                id: emp.id,
                full_name: emp.full_name,
                employee_code: emp.employee_code,
                position_name: emp.position_name,
                position_level: emp.position_level || 0,
                department_name: emp.department_name,
              })
              addedIds.add(emp.id)
            }
          }
        }
      }
    }
  } else {
    // Nếu không có danh sách chỉ định -> lấy theo level (đã bao gồm Admin/HR trong function)
    // Sử dụng RPC function (bypass RLS)
    const { data: employees } = await supabase
      .rpc('get_eligible_approvers_by_level', {
        p_min_level: requestType.min_approver_level,
        p_max_level: requestType.max_approver_level
      })

    if (employees) {
      for (const emp of employees) {
        if (!addedIds.has(emp.id)) {
          eligibleApprovers.push({
            id: emp.id,
            full_name: emp.full_name,
            employee_code: emp.employee_code,
            position_name: emp.position_name,
            position_level: emp.position_level || 0,
            department_name: emp.department_name,
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
      approved_at: getNowVN(),
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
      approved_at: getNowVN(),
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
      approved_at: getNowVN(),
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
        approved_at: getNowVN(),
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
        approved_at: getNowVN(),
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
            approved_at: getNowVN(),
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
          approved_at: getNowVN(),
        })
        .eq("id", requestId)
    }
  }
}

// =============================================
// REQUEST ASSIGNED APPROVERS (Người duyệt được chỉ định khi tạo phiếu)
// =============================================

export async function getRequestAssignedApprovers(requestId: string) {
  // Dùng service client để trả về đầy đủ danh sách người duyệt (mọi bước), bypass RLS.
  // Tránh người duyệt bước 1 chỉ thấy mình, không thấy người bước 2 và ngược lại.
  const supabase = createServiceClient()

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



export async function getAnnualLeaveUsage(employeeId: string, year: number) {
  const supabase = await createClient()

  const { data: typeData } = await supabase
    .from("request_types")
    .select("id")
    .ilike("code", "%annual%")
    .limit(1)
    .single()

  if (!typeData) return 0

  const requestTypeId = typeData.id

  const startDate = `${year}-01-01`
  const endDate = `${year}-12-31`

  const { data: requests } = await supabase
    .from("employee_requests")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("request_type_id", requestTypeId)
    .eq("status", "approved")
    .gte("from_date", startDate)
    .lte("from_date", endDate)

  if (!requests) return 0

  let totalDays = 0
  for (const req of requests) {
    if (req.from_date) {
      const days = calculateLeaveDays(
        req.from_date,
        req.to_date || req.from_date,
        req.from_time,
        req.to_time
      )
      totalDays += days
    }
  }

  return totalDays
}
