import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles, getEmployee } from "@/lib/actions/employee-actions"
import { listDepartments, listPositions } from "@/lib/actions/department-actions"
import { listWorkShifts } from "@/lib/actions/shift-actions"
import { getUserRoles, listRoles } from "@/lib/actions/role-actions"
import { getEmployeeJobHistory } from "@/lib/actions/job-history-actions"
import { listSalaryStructure } from "@/lib/actions/payroll-actions"
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

  const [currentEmployee, currentUserRoles, targetEmployee, departments, positions, shifts, roles, jobHistory] =
    await Promise.all([
      getMyEmployee(),
      getMyRoles(),
      getEmployee(id),
      listDepartments(),
      listPositions(),
      listWorkShifts(),
      listRoles(),
      getEmployeeJobHistory(id),
    ])

  if (!targetEmployee) {
    notFound()
  }

  // Get target employee roles if HR/Admin
  const currentRoleCodes = currentUserRoles.map((ur) => ur.role.code)
  const isHROrAdmin = currentRoleCodes.includes("hr") || currentRoleCodes.includes("admin")

  let targetUserRoles: any[] = []
  let salaryHistory: any[] = []

  if (isHROrAdmin) {
    if (targetEmployee.user_id) {
      targetUserRoles = await getUserRoles(targetEmployee.user_id)
    }
    salaryHistory = await listSalaryStructure(id)
  }

  return (
    <DashboardLayout
      employee={currentEmployee}
      userRoles={currentUserRoles}
      breadcrumbs={[{ label: "Nhân viên", href: "/dashboard/employees" }, { label: targetEmployee.full_name }]}
    >
      <EmployeeDetail
        employee={targetEmployee}
        employeeRoles={targetUserRoles}
        departments={departments}
        positions={positions}
        shifts={shifts}
        roles={roles}
        isHROrAdmin={isHROrAdmin}
        jobHistory={jobHistory}
        salaryHistory={salaryHistory}
      />
    </DashboardLayout>
  )
}
