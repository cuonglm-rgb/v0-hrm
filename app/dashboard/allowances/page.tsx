import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { listAdjustmentTypes } from "@/lib/actions/allowance-actions"
import { AllowanceList } from "@/components/allowances/allowance-list"

export default async function AllowancesPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, adjustments] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listAdjustmentTypes(),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} breadcrumbs={[{ label: "Phụ cấp & Khấu trừ" }]}>
      <AllowanceList adjustments={adjustments} isHROrAdmin={isHROrAdmin} />
    </DashboardLayout>
  )
}
