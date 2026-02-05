import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { getMyPayslips } from "@/lib/actions/payroll-actions"
import { checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { checkSaturdaySchedulePermission } from "@/lib/actions/saturday-schedule-actions"
import { PayslipPanel } from "@/components/payroll/payslip-panel"

export default async function PayslipPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, payslips, canApproveRequests, saturdayPermission] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    getMyPayslips(),
    checkCanApproveRequests(),
    checkSaturdaySchedulePermission(),
  ])

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} canApproveRequests={canApproveRequests} canAccessSaturdaySchedule={saturdayPermission.allowed}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Phiếu lương</h1>
          <p className="text-muted-foreground">Xem chi tiết lương hàng tháng của bạn</p>
        </div>
        <PayslipPanel payslips={payslips} />
      </div>
    </DashboardLayout>
  )
}
