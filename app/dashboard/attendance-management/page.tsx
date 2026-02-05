import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles, listEmployees } from "@/lib/actions/employee-actions"
import { listAttendance, getHolidays, getAllApprovedLeaveRequests } from "@/lib/actions/attendance-actions"
import { checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { listSpecialWorkDays } from "@/lib/actions/special-work-day-actions"
import { checkSaturdaySchedulePermission, listSaturdaySchedules } from "@/lib/actions/saturday-schedule-actions"
import { AttendanceManagementView } from "@/components/attendance/attendance-management-view"
import { SpecialWorkDaysPanel } from "@/components/attendance/special-work-days-panel"
import { SaturdaySchedulePanel } from "@/components/attendance/saturday-schedule-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CloudRain, CalendarClock } from "lucide-react"

export default async function AttendanceManagementPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const currentYear = new Date().getFullYear()
  const [employee, userRoles, employees, attendanceLogs, canApproveRequests, specialDays, holidaysCurrentYear, holidaysPrevYear, leaveRequests, saturdayPermission] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listEmployees(),
    listAttendance(),
    checkCanApproveRequests(),
    listSpecialWorkDays(),
    getHolidays(currentYear),
    getHolidays(currentYear - 1),
    getAllApprovedLeaveRequests(),
    checkSaturdaySchedulePermission(),
  ])
  
  const holidays = [...holidaysCurrentYear, ...holidaysPrevYear]

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  // Cho phép HR/Admin hoặc level >= 3 truy cập
  if (!isHROrAdmin && !saturdayPermission.allowed) {
    redirect("/dashboard")
  }

  // Load saturday schedules if has permission
  let saturdaySchedules: any[] = []
  let filteredEmployees = employees
  
  if (saturdayPermission.allowed) {
    saturdaySchedules = await listSaturdaySchedules()
    
    // Filter employees based on level
    if (saturdayPermission.level === 3 && saturdayPermission.departmentId) {
      filteredEmployees = employees.filter(emp => emp.department_id === saturdayPermission.departmentId)
    }
  }

  // Level 3 (không phải HR/Admin) chỉ thấy tab Lịch làm thứ 7
  const isLevel3Only = saturdayPermission.allowed && saturdayPermission.level === 3 && !isHROrAdmin

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} canApproveRequests={canApproveRequests} canAccessSaturdaySchedule={saturdayPermission.allowed}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý chấm công</h1>
          <p className="text-muted-foreground">
            {isLevel3Only ? "Thiết lập lịch làm việc thứ 7" : "Xem lịch sử chấm công của nhân viên"}
          </p>
        </div>

        {isLevel3Only ? (
          // Level 3 chỉ thấy tab Lịch làm thứ 7
          <SaturdaySchedulePanel
            employees={filteredEmployees}
            schedules={saturdaySchedules}
            canManageAll={false}
          />
        ) : (
          // HR/Admin thấy tất cả tabs
          <Tabs defaultValue="attendance" className="space-y-6">
            <TabsList>
              <TabsTrigger value="attendance" className="gap-2">
                <Calendar className="h-4 w-4" />
                Lịch sử chấm công
              </TabsTrigger>
              <TabsTrigger value="special-days" className="gap-2">
                <CloudRain className="h-4 w-4" />
                Ngày đặc biệt
              </TabsTrigger>
              {saturdayPermission.allowed && (
                <TabsTrigger value="saturday-schedule" className="gap-2">
                  <CalendarClock className="h-4 w-4" />
                  Lịch làm thứ 7
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="attendance">
              <AttendanceManagementView
                employees={employees}
                attendanceLogs={attendanceLogs}
                leaveRequests={leaveRequests}
                holidays={holidays}
                specialDays={specialDays}
                saturdaySchedules={saturdaySchedules}
              />
            </TabsContent>

            <TabsContent value="special-days">
              <SpecialWorkDaysPanel specialDays={specialDays} />
            </TabsContent>

            {saturdayPermission.allowed && (
              <TabsContent value="saturday-schedule">
                <SaturdaySchedulePanel
                  employees={filteredEmployees}
                  schedules={saturdaySchedules}
                  canManageAll={saturdayPermission.level !== null && saturdayPermission.level > 3}
                />
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  )
}

