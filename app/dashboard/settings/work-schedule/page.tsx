import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { getSaturdayDefaultConfig } from "@/lib/actions/work-schedule-settings-actions"
import { WorkScheduleSettingsForm } from "@/components/settings/work-schedule-settings-form"
import { getTodayVN } from "@/lib/utils/date-utils"

export default async function WorkScheduleSettingsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect("/login")

  const [employee, userRoles, canApproveRequests, saturdayConfig] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    checkCanApproveRequests(),
    getSaturdayDefaultConfig(),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")
  if (!isHROrAdmin) redirect("/dashboard")

  return (
    <DashboardLayout
      employee={employee}
      userRoles={userRoles}
      breadcrumbs={[{ label: "Settings", href: "/dashboard/settings" }, { label: "Lịch làm việc" }]}
      canApproveRequests={canApproveRequests}
    >
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold">Lịch làm việc</h1>
          <p className="text-muted-foreground">Cấu hình thứ 7 mặc định của công ty</p>
        </div>

        <WorkScheduleSettingsForm initialConfig={saturdayConfig} today={getTodayVN()} />
      </div>
    </DashboardLayout>
  )
}
