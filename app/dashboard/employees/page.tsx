import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles, listEmployees } from "@/lib/actions/employee-actions"
import { listDepartments } from "@/lib/actions/department-actions"
import { EmployeeList } from "@/components/employees/employee-list"

export default async function EmployeesPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, employees, departments] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listEmployees(),
    listDepartments(),
  ])

  // Check permission
  const roleCodes = userRoles.map((ur) => ur.role.code)
  const hasAccess = roleCodes.includes("hr") || roleCodes.includes("admin") || roleCodes.includes("manager")

  if (!hasAccess) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} breadcrumbs={[{ label: "Employees" }]}>
      <EmployeeList employees={employees} userRoles={userRoles} departments={departments} />
    </DashboardLayout>
  )
}
