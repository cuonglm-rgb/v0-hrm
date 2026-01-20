import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { KPIEvaluationPanel } from "@/components/kpi/kpi-evaluation-panel"

export default async function KPIPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, canApproveRequests] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
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
          <h1 className="text-2xl font-bold">Đánh giá KPI</h1>
          <p className="text-muted-foreground">Đánh giá KPI và mức thưởng cho nhân viên theo tháng</p>
        </div>
        <KPIEvaluationPanel />
      </div>
    </DashboardLayout>
  )
}
