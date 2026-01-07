import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { listRequestTypes, listEmployeeRequestsWithMyApprovalStatus, getCurrentApproverInfo, checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { listPositions } from "@/lib/actions/department-actions"
import { LeaveApprovalPanel } from "@/components/leave/leave-approval-panel"
import { RequestTypeManagement } from "@/components/leave/request-type-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function LeaveApprovalPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  // Lấy tất cả phiếu (không chỉ pending) để có thể xem lịch sử
  const [employee, userRoles, requestTypes, employeeRequests, positions, approverInfo, canApproveRequests] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listRequestTypes(false),
    listEmployeeRequestsWithMyApprovalStatus({}), // Lấy tất cả kèm trạng thái duyệt của user hiện tại
    listPositions(),
    getCurrentApproverInfo(),
    checkCanApproveRequests(),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  // Kiểm tra quyền truy cập: HR/Admin hoặc có level phù hợp để duyệt
  if (!isAdmin && !canApproveRequests) {
    redirect("/dashboard")
  }

  // Đếm số phiếu pending
  const pendingCount = employeeRequests.filter(r => r.status === "pending").length

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} canApproveRequests={canApproveRequests}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Duyệt phiếu phép</h1>
          <p className="text-muted-foreground">Xem xét và duyệt các loại phiếu từ nhân viên</p>
        </div>

        <Tabs defaultValue="approval">
          <TabsList>
            <TabsTrigger value="approval">
              Duyệt phiếu {pendingCount > 0 && `(${pendingCount} chờ duyệt)`}
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="types">Quản lý loại phiếu</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="approval" className="mt-4">
            <LeaveApprovalPanel 
              employeeRequests={employeeRequests}
              approverInfo={approverInfo}
            />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="types" className="mt-4">
              <RequestTypeManagement requestTypes={requestTypes} positions={positions} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
