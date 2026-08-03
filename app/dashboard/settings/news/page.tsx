import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { checkSaturdaySchedulePermission } from "@/lib/actions/saturday-schedule-actions"
import { listAllNews } from "@/lib/actions/company-news-actions"
import { NewsManager } from "@/components/settings/news-manager"

export default async function NewsSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, canApproveRequests, saturdayPermission] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    checkCanApproveRequests(),
    checkSaturdaySchedulePermission(),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  if (!isHROrAdmin) {
    redirect("/dashboard")
  }

  const news = await listAllNews()

  return (
    <DashboardLayout
      employee={employee}
      userRoles={userRoles}
      breadcrumbs={[{ label: "Cài đặt", href: "/dashboard/settings" }, { label: "Tin tức" }]}
      canApproveRequests={canApproveRequests}
      canAccessSaturdaySchedule={saturdayPermission.allowed}
    >
      <NewsManager news={news} />
    </DashboardLayout>
  )
}
