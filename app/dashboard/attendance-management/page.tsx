import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { listAttendance } from "@/lib/actions/attendance-actions"
import { checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { AttendanceManagementPanel } from "@/components/attendance/attendance-management-panel"

export default async function AttendanceManagementPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, attendanceLogs, canApproveRequests] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listAttendance(),
    checkCanApproveRequests(),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  if (!isHROrAdmin) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} canApproveRequests={canApproveRequests}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý chấm công</h1>
          <p className="text-muted-foreground">Import và quản lý dữ liệu chấm công</p>
        </div>
        <AttendanceManagementPanel attendanceLogs={attendanceLogs} />
      </div>
    </DashboardLayout>
  )
}
