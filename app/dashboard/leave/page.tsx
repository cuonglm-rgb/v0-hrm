import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { getMyLeaveRequests } from "@/lib/actions/leave-actions"
import { listRequestTypes, getMyEmployeeRequests } from "@/lib/actions/request-type-actions"
import { LeaveRequestPanel } from "@/components/leave/leave-request-panel"

export default async function LeavePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, leaveRequests, requestTypes, employeeRequests] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    getMyLeaveRequests(),
    listRequestTypes(true),
    getMyEmployeeRequests(),
  ])

  return (
    <DashboardLayout employee={employee} userRoles={userRoles}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tạo phiếu phép</h1>
          <p className="text-muted-foreground">Tạo và theo dõi các loại phiếu yêu cầu</p>
        </div>
        <LeaveRequestPanel 
          leaveRequests={leaveRequests} 
          requestTypes={requestTypes}
          employeeRequests={employeeRequests}
        />
      </div>
    </DashboardLayout>
  )
}
