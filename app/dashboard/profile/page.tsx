import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { checkCanApproveRequests, getAnnualLeaveUsage } from "@/lib/actions/request-type-actions"
import { ProfileView } from "@/components/profile/profile-view"
import { listDepartments, listPositions } from "@/lib/actions/department-actions"
import { listWorkShifts } from "@/lib/actions/shift-actions"
import { listRoles } from "@/lib/actions/role-actions"
import { getEmployeeJobHistory } from "@/lib/actions/job-history-actions"
import { listSalaryStructure } from "@/lib/actions/payroll-actions"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [
    employee,
    userRoles,
    canApproveRequests,
    departments,
    positions,
    shifts,
    roles,
  ] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    checkCanApproveRequests(),
    listDepartments(),
    listPositions(),
    listWorkShifts(),
    listRoles(),
  ])

  if (!employee) {
    return (
      <DashboardLayout employee={null} userRoles={[]} breadcrumbs={[{ label: "Hồ sơ của tôi" }]} canApproveRequests={false}>
        <div className="p-4">Không tìm thấy thông tin nhân viên</div>
      </DashboardLayout>
    )
  }

  const [jobHistory, salaryHistory, leaveUsage] = await Promise.all([
    getEmployeeJobHistory(employee.id),
    listSalaryStructure(employee.id),
    getAnnualLeaveUsage(employee.id, new Date().getFullYear()),
  ])

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} breadcrumbs={[{ label: "Hồ sơ của tôi" }]} canApproveRequests={canApproveRequests}>
      <ProfileView
        employee={employee}
        userRoles={userRoles}
        departments={departments}
        positions={positions}
        shifts={shifts}
        roles={roles}
        jobHistory={jobHistory}
        salaryHistory={salaryHistory}
        leaveUsage={leaveUsage}
      />
    </DashboardLayout>
  )
}
