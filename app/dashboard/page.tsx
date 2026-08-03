import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import {
  checkCanApproveRequests,
  getMyEmployeeRequests,
} from "@/lib/actions/request-type-actions"
import { checkSaturdaySchedulePermission } from "@/lib/actions/saturday-schedule-actions"
import { listPublishedNews } from "@/lib/actions/company-news-actions"
import {
  getWorkScheduleSummary,
  getCalendarEvents,
  getUpcomingBirthdays,
  getSeniorityData,
  getMyLeaveBalanceForYear,
  type MyLeaveBalance,
} from "@/lib/actions/dashboard-actions"
import { getTodayVN, getLastDayOfMonthVN } from "@/lib/utils/date-utils"
import { resolveScheduleScope } from "@/lib/utils/dashboard-scope"
import { DashboardHome } from "@/components/dashboard/dashboard-home"
import type { RequestLite } from "@/components/dashboard/widgets/my-requests-widget"

function fmtUTC(y: number, m0: number, d: number): string {
  const dt = new Date(Date.UTC(y, m0, d))
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const today = getTodayVN()
  const [ty, tm, td] = today.split("-").map(Number)
  const tomorrow = fmtUTC(ty, tm - 1, td + 1)

  // Tuần hiện tại (Thứ 2 -> Chủ nhật)
  const dow = new Date(Date.UTC(ty, tm - 1, td)).getUTCDay() // 0=CN
  const offsetToMon = (dow + 6) % 7
  const weekStart = fmtUTC(ty, tm - 1, td - offsetToMon)
  const weekEnd = fmtUTC(ty, tm - 1, td - offsetToMon + 6)

  // Tháng hiện tại cho lịch sự kiện
  const monthFrom = `${ty}-${String(tm).padStart(2, "0")}-01`
  const monthTo = getLastDayOfMonthVN(ty, tm)

  const [
    employee,
    userRoles,
    canApproveRequests,
    saturdayPermission,
    news,
    todaySummary,
    calendarEvents,
    birthdays,
    seniority,
  ] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    checkCanApproveRequests(),
    checkSaturdaySchedulePermission(),
    listPublishedNews(5),
    getWorkScheduleSummary(today),
    getCalendarEvents(monthFrom, monthTo),
    getUpcomingBirthdays(30),
    getSeniorityData(30),
  ])

  // Phân quyền hiển thị widget "Lịch làm việc": HR/Admin (all), leader (phòng ban), nhân viên (ẩn)
  const roleCodes = userRoles.map((ur) => ur.role.code)
  const managerDeptIds = userRoles
    .filter((ur) => ur.role.code === "manager" && ur.department_id)
    .map((ur) => ur.department_id as string)
  const scheduleScope = resolveScheduleScope({
    roleCodes,
    positionLevel: employee?.position?.level ?? 0,
    managerDeptIds,
    ownDeptId: employee?.department_id ?? null,
    ownEmployeeId: employee?.id ?? null,
  })
  const showWorkSchedule = scheduleScope.mode !== "none"

  // Phép của tôi (năm hiện tại) & danh sách đơn của tôi (client tự lọc theo tháng/khoảng)
  let leave: MyLeaveBalance = { year: ty, total: 0, remaining: 0, used: 0, expired: 0 }
  let requestList: RequestLite[] = []

  if (employee) {
    const [leaveBalance, myRequests] = await Promise.all([
      getMyLeaveBalanceForYear(ty),
      getMyEmployeeRequests(),
    ])
    leave = leaveBalance
    requestList = myRequests.map((r) => ({
      status: r.status,
      applyDate: r.from_date || r.request_date,
    }))
  }

  return (
    <DashboardLayout
      employee={employee}
      userRoles={userRoles}
      canApproveRequests={canApproveRequests}
      canAccessSaturdaySchedule={saturdayPermission.allowed}
    >
      <DashboardHome
        news={news}
        showWorkSchedule={showWorkSchedule}
        schedule={{ initialSummary: todaySummary, today, tomorrow, weekStart, weekEnd }}
        calendar={{ year: ty, month: tm, events: calendarEvents }}
        birthdays={birthdays}
        seniority={seniority}
        leave={leave}
        requests={{ list: requestList, year: ty, month: tm }}
      />
    </DashboardLayout>
  )
}
