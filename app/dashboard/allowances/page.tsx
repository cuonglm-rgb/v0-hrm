import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { listAdjustmentTypes } from "@/lib/actions/allowance-actions"
import { listOTSettings, listHolidays } from "@/lib/actions/overtime-actions"
import { checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { AllowanceList } from "@/components/allowances/allowance-list"
import { OTSettingsList } from "@/components/allowances/ot-settings-list"
import { HolidayList } from "@/components/allowances/holiday-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Timer, CalendarDays } from "lucide-react"

export default async function AllowancesPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, adjustments, otSettings, holidays, canApproveRequests] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listAdjustmentTypes(),
    listOTSettings(),
    listHolidays(),
    checkCanApproveRequests(),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} breadcrumbs={[{ label: "Phụ cấp & Khấu trừ" }]} canApproveRequests={canApproveRequests}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý phụ cấp & khấu trừ</h1>
          <p className="text-muted-foreground">Thiết lập phụ cấp, quỹ chung, phạt, hệ số tăng ca và ngày lễ</p>
        </div>

        <Tabs defaultValue="adjustments">
          <TabsList>
            <TabsTrigger value="adjustments" className="gap-2">
              <Coins className="h-4 w-4" />
              Phụ cấp & Khấu trừ
            </TabsTrigger>
            <TabsTrigger value="overtime" className="gap-2">
              <Timer className="h-4 w-4" />
              Hệ số tăng ca ({otSettings.length})
            </TabsTrigger>
            <TabsTrigger value="holidays" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              Ngày lễ ({holidays.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="adjustments" className="mt-4">
            <AllowanceList adjustments={adjustments} isHROrAdmin={isHROrAdmin} />
          </TabsContent>

          <TabsContent value="overtime" className="mt-4">
            <OTSettingsList settings={otSettings} isHROrAdmin={isHROrAdmin} />
          </TabsContent>

          <TabsContent value="holidays" className="mt-4">
            <HolidayList holidays={holidays} isHROrAdmin={isHROrAdmin} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
