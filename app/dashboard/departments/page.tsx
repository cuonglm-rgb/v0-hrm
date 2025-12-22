import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { listDepartments } from "@/lib/actions/department-actions"
import { DepartmentList } from "@/components/departments/department-list"

export default async function DepartmentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, departments] = await Promise.all([getMyEmployee(), getMyRoles(), listDepartments()])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} breadcrumbs={[{ label: "Departments" }]}>
      <DepartmentList departments={departments} isHROrAdmin={isHROrAdmin} />
    </DashboardLayout>
  )
}
