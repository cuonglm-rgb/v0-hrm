import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { getPayrollRun, getPayrollItems, calculateStandardWorkingDays } from "@/lib/actions/payroll-actions"
import { PayrollDetailPanel } from "@/components/payroll/payroll-detail-panel"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PayrollDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, payrollRun, payrollItems] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    getPayrollRun(id),
    getPayrollItems(id),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  if (!isHROrAdmin) {
    redirect("/dashboard")
  }

  if (!payrollRun) {
    notFound()
  }

  // Tính công chuẩn động theo tháng
  const workingDaysInfo = await calculateStandardWorkingDays(payrollRun.month, payrollRun.year)

  return (
    <DashboardLayout employee={employee} userRoles={userRoles}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Bảng lương tháng {payrollRun.month}/{payrollRun.year}
          </h1>
          <p className="text-muted-foreground">Chi tiết lương từng nhân viên</p>
        </div>
        <PayrollDetailPanel 
          payrollRun={payrollRun} 
          payrollItems={payrollItems} 
          standardWorkingDays={workingDaysInfo.standardDays}
          workingDaysInfo={workingDaysInfo}
        />
      </div>
    </DashboardLayout>
  )
}
