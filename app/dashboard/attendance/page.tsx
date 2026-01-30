import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { getMyAttendance, getMyApprovedLeaveRequests, getHolidays } from "@/lib/actions/attendance-actions"
import { getMyShift } from "@/lib/actions/shift-actions"
import { checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { AttendancePanel } from "@/components/attendance/attendance-panel"

export default async function AttendancePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const currentYear = new Date().getFullYear()
  const [employee, userRoles, attendanceLogs, shift, canApproveRequests, leaveRequests, holidaysCurrentYear, holidaysPrevYear] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    getMyAttendance(),
    getMyShift(),
    checkCanApproveRequests(),
    getMyApprovedLeaveRequests(),
    getHolidays(currentYear),
    getHolidays(currentYear - 1),
  ])
  
  const holidays = [...holidaysCurrentYear, ...holidaysPrevYear]

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} canApproveRequests={canApproveRequests}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Chấm công</h1>
          <p className="text-muted-foreground">Check in/out và xem lịch sử chấm công</p>
        </div>
        <AttendancePanel
          attendanceLogs={attendanceLogs}
          shift={shift}
          leaveRequests={leaveRequests}
          officialDate={employee?.official_date || null}
          holidays={holidays}
        />
      </div>
    </DashboardLayout>
  )
}
