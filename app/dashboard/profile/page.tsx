import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { ProfileView } from "@/components/profile/profile-view"

export default async function ProfilePage() {
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

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} breadcrumbs={[{ label: "My Profile" }]} canApproveRequests={canApproveRequests}>
      <ProfileView employee={employee} userRoles={userRoles} />
    </DashboardLayout>
  )
}
