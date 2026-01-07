import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles, listEmployees } from "@/lib/actions/employee-actions"
import { listDepartments } from "@/lib/actions/department-actions"
import { checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, employees, departments, canApproveRequests] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listEmployees(),
    listDepartments(),
    checkCanApproveRequests(),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} canApproveRequests={canApproveRequests}>
      <DashboardOverview
        employee={employee}
        userRoles={userRoles}
        totalEmployees={isHROrAdmin ? employees.length : undefined}
        totalDepartments={departments.length}
      />
    </DashboardLayout>
  )
}
