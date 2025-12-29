import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { listLeaveRequests } from "@/lib/actions/leave-actions"
import { listRequestTypes, listEmployeeRequests } from "@/lib/actions/request-type-actions"
import { LeaveApprovalPanel } from "@/components/leave/leave-approval-panel"
import { RequestTypeManagement } from "@/components/leave/request-type-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function LeaveApprovalPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, leaveRequests, requestTypes, employeeRequests] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listLeaveRequests({ status: "pending" }),
    listRequestTypes(false),
    listEmployeeRequests({ status: "pending" }),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const canApprove = roleCodes.includes("hr") || roleCodes.includes("admin") || roleCodes.includes("manager")
  const isAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

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
              Duyệt phiếu ({leaveRequests.length + employeeRequests.length})
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="types">Quản lý loại phiếu</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="approval" className="mt-4">
            <LeaveApprovalPanel 
              leaveRequests={leaveRequests} 
              employeeRequests={employeeRequests}
            />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="types" className="mt-4">
              <RequestTypeManagement requestTypes={requestTypes} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
