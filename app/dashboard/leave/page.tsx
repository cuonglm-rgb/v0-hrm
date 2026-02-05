import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { listRequestTypes, getMyEmployeeRequests, checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { checkSaturdaySchedulePermission } from "@/lib/actions/saturday-schedule-actions"
import { LeaveRequestPanel } from "@/components/leave/leave-request-panel"

export default async function LeavePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, requestTypes, employeeRequests, canApproveRequests, saturdayPermission] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listRequestTypes(true),
    getMyEmployeeRequests(),
    checkCanApproveRequests(),
    checkSaturdaySchedulePermission(),
  ])

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} canApproveRequests={canApproveRequests} canAccessSaturdaySchedule={saturdayPermission.allowed}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tạo phiếu phép</h1>
          <p className="text-muted-foreground">Tạo và theo dõi các loại phiếu yêu cầu</p>
        </div>
        <LeaveRequestPanel 
          requestTypes={requestTypes}
          employeeRequests={employeeRequests}
        />
      </div>
    </DashboardLayout>
  )
}
