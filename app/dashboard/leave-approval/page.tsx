import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { listRequestTypes, listEmployeeRequests, getCurrentApproverInfo } from "@/lib/actions/request-type-actions"
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
  const [employee, userRoles, requestTypes, employeeRequests, positions, approverInfo] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listRequestTypes(false),
    listEmployeeRequests({}), // Lấy tất cả
    listPositions(),
    getCurrentApproverInfo(),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const canApprove = roleCodes.includes("hr") || roleCodes.includes("admin") || roleCodes.includes("manager")
  const isAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  // Đếm số phiếu pending
  const pendingCount = employeeRequests.filter(r => r.status === "pending").length

  if (!canApprove) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayout employee={employee} userRoles={userRoles}>
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
