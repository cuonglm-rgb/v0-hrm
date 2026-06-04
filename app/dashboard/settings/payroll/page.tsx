import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { getProbationSalaryRate } from "@/lib/actions/payroll-settings-actions"
import { PayrollSettingsForm } from "@/components/settings/payroll-settings-form"

export default async function PayrollSettingsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect("/login")

  const [employee, userRoles, canApproveRequests, probationRate] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    checkCanApproveRequests(),
    getProbationSalaryRate(),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")
  if (!isHROrAdmin) redirect("/dashboard")

  return (
    <DashboardLayout
      employee={employee}
      userRoles={userRoles}
      breadcrumbs={[{ label: "Settings", href: "/dashboard/settings" }, { label: "Cấu hình lương" }]}
      canApproveRequests={canApproveRequests}
    >
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Cấu hình lương</h1>
          <p className="text-muted-foreground">Các tham số dùng khi tính bảng lương hàng tháng</p>
        </div>

        <PayrollSettingsForm initialProbationRate={probationRate} />
      </div>
    </DashboardLayout>
  )
}
