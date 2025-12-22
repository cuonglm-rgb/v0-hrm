import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles, getEmployee } from "@/lib/actions/employee-actions"
import { listDepartments, listPositions } from "@/lib/actions/department-actions"
import { getUserRoles, listRoles } from "@/lib/actions/role-actions"
import { EmployeeDetail } from "@/components/employees/employee-detail"

interface EmployeeDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [currentEmployee, currentUserRoles, targetEmployee, departments, positions, roles] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    getEmployee(id),
    listDepartments(),
    listPositions(),
    listRoles(),
  ])

  if (!targetEmployee) {
    notFound()
  }

  // Get target employee roles if HR/Admin
  const currentRoleCodes = currentUserRoles.map((ur) => ur.role.code)
  const isHROrAdmin = currentRoleCodes.includes("hr") || currentRoleCodes.includes("admin")

  let targetUserRoles: any[] = []
  if (isHROrAdmin && targetEmployee.user_id) {
    targetUserRoles = await getUserRoles(targetEmployee.user_id)
  }

  return (
    <DashboardLayout
      employee={currentEmployee}
      userRoles={currentUserRoles}
      breadcrumbs={[{ label: "Employees", href: "/dashboard/employees" }, { label: targetEmployee.full_name }]}
    >
      <EmployeeDetail
        employee={targetEmployee}
        employeeRoles={targetUserRoles}
        departments={departments}
        positions={positions}
        roles={roles}
        isHROrAdmin={isHROrAdmin}
      />
    </DashboardLayout>
  )
}
