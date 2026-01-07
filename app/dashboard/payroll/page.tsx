import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { listPayrollRuns } from "@/lib/actions/payroll-actions"
import { checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { PayrollListPanel } from "@/components/payroll/payroll-list-panel"

export default async function PayrollPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, payrollRuns, canApproveRequests] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listPayrollRuns(),
    checkCanApproveRequests(),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  if (!isHROrAdmin) {
    redirect("/dashboard/payslip")
  }

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} canApproveRequests={canApproveRequests}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý bảng lương</h1>
          <p className="text-muted-foreground">Tạo và quản lý bảng lương hàng tháng</p>
        </div>
        <PayrollListPanel payrollRuns={payrollRuns} />
      </div>
    </DashboardLayout>
  )
}
