import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { getMyLeaveRequests } from "@/lib/actions/leave-actions"
import { LeaveRequestPanel } from "@/components/leave/leave-request-panel"

export default async function LeavePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, leaveRequests] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    getMyLeaveRequests(),
  ])

  return (
    <DashboardLayout employee={employee} userRoles={userRoles}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Nghỉ phép</h1>
          <p className="text-muted-foreground">Tạo và theo dõi đơn xin nghỉ phép</p>
        </div>
        <LeaveRequestPanel leaveRequests={leaveRequests} />
      </div>
    </DashboardLayout>
  )
}
