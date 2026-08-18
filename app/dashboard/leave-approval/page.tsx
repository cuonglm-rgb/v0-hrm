import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { listRequestTypes, listEmployeeRequestsWithMyApprovalStatus, getCurrentApproverInfo, checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import { listPositions } from "@/lib/actions/department-actions"
import { checkSaturdaySchedulePermission } from "@/lib/actions/saturday-schedule-actions"
import { LeaveApprovalPanel } from "@/components/leave/leave-approval-panel"
import { RequestTypeManagement } from "@/components/leave/request-type-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function LeaveApprovalPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  // Tải sẵn: TẤT CẢ phiếu đang chờ duyệt (dù cũ đến đâu) + lịch sử 30 ngày gần nhất.
  //
  // Trước đây lấy tất cả -> ~1,8 MB mỗi lần vào trang, và bị PostgREST cắt ở 1000
  // dòng nên phiếu cũ nhất âm thầm biến mất (1306 phiếu -> mất 306 phiếu).
  //
  // Vì sao 30 ngày: công ty tạo ~250-280 phiếu/tháng, và 82/83 phiếu đang chờ
  // duyệt đều thuộc tháng hiện tại. 30 ngày ra ~270 phiếu; 180 ngày ra 1215 phiếu
  // (gần như toàn bộ) nên không giải quyết được gì.
  //
  // Muốn xem cũ hơn: chọn bộ lọc "Từ ngày", panel sẽ tự tải thêm từ server.
  const HISTORY_DAYS = 30
  const historyFrom = new Date()
  historyFrom.setDate(historyFrom.getDate() - HISTORY_DAYS)
  const historyFromDate = historyFrom.toISOString().slice(0, 10)

  const [employee, userRoles, requestTypes, employeeRequests, positions, approverInfo, canApproveRequests, saturdayPermission] = await Promise.all([
    getMyEmployee(),
    getMyRoles(),
    listRequestTypes(false),
    listEmployeeRequestsWithMyApprovalStatus({ historyFrom: historyFromDate }),
    listPositions(),
    getCurrentApproverInfo(),
    checkCanApproveRequests(),
    checkSaturdaySchedulePermission(),
  ])

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  // Kiểm tra quyền truy cập: HR/Admin hoặc có level phù hợp để duyệt
  if (!isAdmin && !canApproveRequests) {
    redirect("/dashboard")
  }

  // Đếm số phiếu pending
  const pendingCount = employeeRequests.filter(r => r.status === "pending").length

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} canApproveRequests={canApproveRequests} canAccessSaturdaySchedule={saturdayPermission.allowed}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Duyệt phiếu phép</h1>
          <p className="text-muted-foreground">Xem xét và duyệt các loại phiếu từ nhân viên</p>
        </div>

        <Tabs defaultValue="approval">
          <TabsList>
            <TabsTrigger value="approval">
              Duyệt phiếu {pendingCount > 0 && `(${pendingCount} chờ duyệt)`}
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="types">Quản lý loại phiếu</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="approval" className="mt-4">
            <LeaveApprovalPanel
              employeeRequests={employeeRequests}
              approverInfo={approverInfo}
              historyFrom={historyFromDate}
            />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="types" className="mt-4">
              <RequestTypeManagement requestTypes={requestTypes} positions={positions} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
