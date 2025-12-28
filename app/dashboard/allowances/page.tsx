import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { listAllowanceTypes } from "@/lib/actions/allowance-actions"
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

  const [employee, userRoles, allowances] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listAllowanceTypes(),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} breadcrumbs={[{ label: "Phụ cấp" }]}>
      <AllowanceList allowances={allowances} isHROrAdmin={isHROrAdmin} />
    </DashboardLayout>
  )
}
