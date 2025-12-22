import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
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

  const [employee, userRoles] = await Promise.all([getMyEmployee(), getMyRoles()])

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} breadcrumbs={[{ label: "My Profile" }]}>
      <ProfileView employee={employee} userRoles={userRoles} />
    </DashboardLayout>
  )
}
