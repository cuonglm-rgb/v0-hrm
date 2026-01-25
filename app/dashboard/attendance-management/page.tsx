import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { listAttendance } from "@/lib/actions/attendance-actions"
import { checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { listSpecialWorkDays } from "@/lib/actions/special-work-day-actions"
import { AttendanceManagementPanel } from "@/components/attendance/attendance-management-panel"
import { SpecialWorkDaysPanel } from "@/components/attendance/special-work-days-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CloudRain } from "lucide-react"

export default async function AttendanceManagementPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, attendanceLogs, canApproveRequests, specialDays] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listAttendance(),
    checkCanApproveRequests(),
    listSpecialWorkDays(), // Load tất cả các năm
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  if (!isHROrAdmin) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} canApproveRequests={canApproveRequests}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý chấm công</h1>
          <p className="text-muted-foreground">Import và quản lý dữ liệu chấm công</p>
        </div>

        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="attendance" className="gap-2">
              <Calendar className="h-4 w-4" />
              Dữ liệu chấm công
            </TabsTrigger>
            <TabsTrigger value="special-days" className="gap-2">
              <CloudRain className="h-4 w-4" />
              Ngày đặc biệt
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <AttendanceManagementPanel attendanceLogs={attendanceLogs} specialDays={specialDays} />
          </TabsContent>

          <TabsContent value="special-days">
            <SpecialWorkDaysPanel specialDays={specialDays} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

