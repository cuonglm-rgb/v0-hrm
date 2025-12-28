import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { getMyAttendance } from "@/lib/actions/attendance-actions"
import { getMyShift } from "@/lib/actions/shift-actions"
import { AttendancePanel } from "@/components/attendance/attendance-panel"

export default async function AttendancePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, attendanceLogs, shift] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    getMyAttendance(),
    getMyShift(),
  ])

  return (
    <DashboardLayout employee={employee} userRoles={userRoles}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Chấm công</h1>
          <p className="text-muted-foreground">Check in/out và xem lịch sử chấm công</p>
        </div>
        <AttendancePanel attendanceLogs={attendanceLogs} shift={shift} />
      </div>
    </DashboardLayout>
  )
}
