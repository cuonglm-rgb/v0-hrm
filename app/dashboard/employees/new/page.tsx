import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { listDepartments, listPositions } from "@/lib/actions/department-actions"
import { CreateEmployeeForm } from "@/components/employees/create-employee-form"

export default async function NewEmployeePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, departments, positions] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listDepartments(),
    listPositions(),
  ])

  // Check permission
  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  if (!isHROrAdmin) {
    redirect("/dashboard/employees")
  }

  return (
    <DashboardLayout
      employee={employee}
      userRoles={userRoles}
      breadcrumbs={[{ label: "Employees", href: "/dashboard/employees" }, { label: "New Employee" }]}
    >
      <CreateEmployeeForm departments={departments} positions={positions} />
    </DashboardLayout>
  )
}
