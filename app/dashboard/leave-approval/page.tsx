import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { listLeaveRequests } from "@/lib/actions/leave-actions"
import { LeaveApprovalPanel } from "@/components/leave/leave-approval-panel"

export default async function LeaveApprovalPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, leaveRequests] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listLeaveRequests({ status: "pending" }),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const canApprove = roleCodes.includes("hr") || roleCodes.includes("admin") || roleCodes.includes("manager")

  if (!canApprove) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayout employee={employee} userRoles={userRoles}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Duyệt nghỉ phép</h1>
          <p className="text-muted-foreground">Xem xét và duyệt đơn xin nghỉ phép</p>
        </div>
        <LeaveApprovalPanel leaveRequests={leaveRequests} />
      </div>
    </DashboardLayout>
  )
}
