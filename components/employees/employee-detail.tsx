"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Save, ArrowLeft, Shield, Building2, User, Briefcase, History, Wallet, Clock, Timer } from "lucide-react"
import { updateEmployee } from "@/lib/actions/employee-actions"
import { assignRole, removeRole } from "@/lib/actions/role-actions"
import { EmployeeSalaryTab } from "./employee-salary-tab"
import { EmployeeOTRatesTab } from "./employee-ot-rates-tab"
import type { EmployeeWithRelations, Department, Position, Role, RoleCode, EmployeeJobHistoryWithRelations, SalaryStructure, WorkShift } from "@/lib/types/database"
import Link from "next/link"
import { useMemo } from "react"
import { calculateAvailableBalance } from "@/lib/utils/leave-utils"

interface EmployeeDetailProps {
  employee: EmployeeWithRelations
  employeeRoles: { role: Role }[]
  departments: Department[]
  positions: Position[]
  shifts: WorkShift[]
  roles: Role[]
  isHROrAdmin: boolean
  jobHistory?: EmployeeJobHistoryWithRelations[]
  salaryHistory?: SalaryStructure[]
}

const statusColors: Record<string, string> = {
  onboarding: "bg-amber-100 text-amber-700",
  active: "bg-green-100 text-green-700",
  resigned: "bg-slate-100 text-slate-700",
}

const statusLabels: Record<string, string> = {
  onboarding: "Đang onboard",
  active: "Đang làm việc",
  resigned: "Đã nghỉ việc",
}

export function EmployeeDetail({
  employee,
  employeeRoles,
  departments,
  positions,
  shifts,
  roles,
  isHROrAdmin,
  jobHistory = [],
  salaryHistory = [],
  leaveUsage = 0,
}: EmployeeDetailProps & { leaveUsage?: number }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    full_name: employee.full_name,
    phone: employee.phone || "",
    department_id: employee.department_id || "",
    position_id: employee.position_id || "",
    shift_id: employee.shift_id || "",
    status: employee.status,
    join_date: employee.join_date || "",
    official_date: employee.official_date || "",
  })

  // Calculate Leave Fund
  const currentYear = new Date().getFullYear()
  const { totalEntitlement, availableToUse, remaining, isRestricted } = useMemo(() => {
    // Note: leaveUsage passed from server is total used. 
    // We need to calculate available balance.
    // If official_date is not set, we can't calculate properly, assume 0.

    // Import dynamically or assume it's available? 
    // I need to import it at the top. But I can't add imports with replace_file_content easily without context.
    // I will add the import in a separate step or assume I can do it here if I replace the top.

    // Actually, I should use the utility. 
    // Let's rely on adding the import later or now.
    // For now, let's implement the UI logic assuming the function is available or logic is inline (but logic is complex).
    // I'll add the import in the next step.

    return calculateAvailableBalance(
      employee.official_date,
      leaveUsage,
      new Date()
    )
  }, [employee.official_date, leaveUsage])

  const initials = employee.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const employeeRoleCodes = employeeRoles.map((er) => er.role.code)

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await updateEmployee(employee.id, {
        ...formData,
        department_id: formData.department_id || null,
        position_id: formData.position_id || null,
        shift_id: formData.shift_id || null,
        join_date: formData.join_date || null,
        official_date: formData.official_date || null,
      })

      if (result.success) {
        toast.success("Cập nhật nhân viên thành công")
        router.refresh()
      } else {
        toast.error(result.error || "Không thể cập nhật nhân viên")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleToggleRole = async (roleCode: RoleCode) => {
    if (!employee.user_id) return

    const hasRole = employeeRoleCodes.includes(roleCode)

    if (hasRole) {
      const result = await removeRole(employee.user_id, roleCode)
      if (result.success) {
        toast.success(`Đã gỡ quyền ${roleCode}`)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } else {
      const result = await assignRole(employee.user_id, roleCode)
      if (result.success) {
        toast.success(`Đã gán quyền ${roleCode}`)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/employees">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{employee.full_name}</h1>
            <p className="text-muted-foreground">
              {employee.employee_code} • {employee.email}
            </p>
          </div>
        </div>
        {isHROrAdmin && (
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={employee.avatar_url || ""} alt={employee.full_name} />
                <AvatarFallback className="bg-indigo-100 text-indigo-600 text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{employee.full_name}</h3>
              <p className="text-sm text-muted-foreground">{employee.position?.name || "No position"}</p>
              <Badge className={`mt-2 ${statusColors[employee.status]}`}>{statusLabels[employee.status]}</Badge>

              <Separator className="my-4" />

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.department?.name || "No department"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.position?.name || "No position"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.manager?.full_name || "No manager"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Tabs */}
        <Card className="lg:col-span-2">
          <Tabs defaultValue="info">
            <CardHeader>
              <TabsList>
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="work">Công việc</TabsTrigger>
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-1" />
                  Lịch sử
                </TabsTrigger>
                {isHROrAdmin && (
                  <TabsTrigger value="salary">
                    <Wallet className="h-4 w-4 mr-1" />
                    Lương
                  </TabsTrigger>
                )}
                {isHROrAdmin && (
                  <TabsTrigger value="ot-rates">
                    <Timer className="h-4 w-4 mr-1" />
                    Hệ số OT
                  </TabsTrigger>
                )}
                {isHROrAdmin && <TabsTrigger value="roles">Quyền</TabsTrigger>}
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="info" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Họ và tên</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={!isHROrAdmin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={employee.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isHROrAdmin}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee_code">Mã nhân viên</Label>
                    <Input id="employee_code" value={employee.employee_code || ""} disabled />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="work" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Phòng ban</Label>
                    <Select
                      value={formData.department_id}
                      onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                      disabled={!isHROrAdmin}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phòng ban" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Vị trí</Label>
                    <Select
                      value={formData.position_id}
                      onValueChange={(value) => setFormData({ ...formData, position_id: value })}
                      disabled={!isHROrAdmin}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vị trí" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((pos) => (
                          <SelectItem key={pos.id} value={pos.id}>
                            {pos.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shift">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Ca làm việc
                    </Label>
                    <Select
                      value={formData.shift_id}
                      onValueChange={(value) => setFormData({ ...formData, shift_id: value })}
                      disabled={!isHROrAdmin}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ca làm" />
                      </SelectTrigger>
                      <SelectContent>
                        {shifts.map((shift) => (
                          <SelectItem key={shift.id} value={shift.id}>
                            {shift.name} ({shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                      disabled={!isHROrAdmin}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onboarding">Đang onboard</SelectItem>
                        <SelectItem value="active">Đang làm việc</SelectItem>
                        <SelectItem value="resigned">Đã nghỉ việc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="join_date">Ngày vào làm</Label>
                    <Input
                      id="join_date"
                      type="date"
                      value={formData.join_date}
                      onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                      disabled={!isHROrAdmin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="official_date">Ngày chính thức</Label>
                    <Input
                      id="official_date"
                      type="date"
                      value={formData.official_date}
                      onChange={(e) => setFormData({ ...formData, official_date: e.target.value })}
                      disabled={!isHROrAdmin}
                    />
                    {!formData.official_date && formData.status === "active" && (
                      <p className="text-xs text-muted-foreground">Sẽ tự động cập nhật khi lưu trạng thái "Đang làm việc" nếu để trống</p>
                    )}
                  </div>
                </div>

                {/* Quỹ phép năm */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-medium text-orange-800 flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4" />
                    Quỹ phép năm {currentYear}
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                    <div className="bg-white p-3 rounded border border-orange-100">
                      <span className="text-gray-500 block text-xs uppercase mb-1">Tổng quỹ phép</span>
                      <span className="text-xl font-bold text-orange-600">{totalEntitlement}</span>
                      <span className="text-xs text-gray-400 ml-1">ngày</span>
                    </div>
                    <div className="bg-white p-3 rounded border border-orange-100">
                      <span className="text-gray-500 block text-xs uppercase mb-1">Đã sử dụng</span>
                      <span className="text-xl font-bold text-gray-700">{leaveUsage}</span>
                      <span className="text-xs text-gray-400 ml-1">ngày</span>
                    </div>
                    <div className="bg-white p-3 rounded border border-orange-100">
                      <span className="text-gray-500 block text-xs uppercase mb-1">Còn lại</span>
                      <span className="text-xl font-bold text-green-600">{remaining}</span>
                      <span className="text-xs text-gray-400 ml-1">ngày</span>
                    </div>
                  </div>
                  {isRestricted && (
                    <div className="mt-2 text-xs text-amber-700 bg-amber-100 p-2 rounded">
                      * Nhân viên đang trong thời gian thử việc/mới chính thức (dưới 5 tháng), quỹ phép được giới hạn 1 ngày/tháng.
                    </div>
                  )}
                </div>

                {/* Hiển thị thông tin ca làm hiện tại */}
                {employee.shift && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      Ca làm hiện tại: {employee.shift.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">Giờ làm:</span>{" "}
                        <span className="font-mono">{employee.shift.start_time?.slice(0, 5)} - {employee.shift.end_time?.slice(0, 5)}</span>
                      </div>
                      {employee.shift.break_start && employee.shift.break_end && (
                        <div>
                          <span className="text-blue-600">Nghỉ trưa:</span>{" "}
                          <span className="font-mono">{employee.shift.break_start?.slice(0, 5)} - {employee.shift.break_end?.slice(0, 5)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Lịch sử công việc
                  </h4>
                  {jobHistory.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Chưa có lịch sử công việc</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Phòng ban</TableHead>
                          <TableHead>Vị trí</TableHead>
                          <TableHead>Lương</TableHead>
                          <TableHead>Ngày bắt đầu</TableHead>
                          <TableHead>Ngày kết thúc</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobHistory.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.department?.name || "-"}</TableCell>
                            <TableCell>{record.position?.name || "-"}</TableCell>
                            <TableCell>
                              {record.salary
                                ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(record.salary)
                                : "-"}
                            </TableCell>
                            <TableCell>{record.start_date}</TableCell>
                            <TableCell>
                              {record.end_date || <Badge variant="outline">Hiện tại</Badge>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>

              {isHROrAdmin && (
                <TabsContent value="salary" className="mt-0">
                  <EmployeeSalaryTab
                    employeeId={employee.id}
                    salaryHistory={salaryHistory}
                    isHROrAdmin={isHROrAdmin}
                  />
                </TabsContent>
              )}

              {isHROrAdmin && (
                <TabsContent value="ot-rates" className="mt-0">
                  <EmployeeOTRatesTab
                    employeeId={employee.id}
                    isHROrAdmin={isHROrAdmin}
                  />
                </TabsContent>
              )}

              {isHROrAdmin && (
                <TabsContent value="roles" className="space-y-4 mt-0">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Quyền được gán
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {roles.map((role) => {
                        const hasRole = employeeRoleCodes.includes(role.code as RoleCode)
                        return (
                          <div
                            key={role.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${hasRole ? "bg-indigo-50 border-indigo-200" : "bg-muted/50"
                              }`}
                          >
                            <div>
                              <p className="font-medium">{role.name}</p>
                              <p className="text-xs text-muted-foreground">{role.description}</p>
                            </div>
                            <Button
                              variant={hasRole ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleToggleRole(role.code as RoleCode)}
                            >
                              {hasRole ? "Gỡ bỏ" : "Gán"}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </TabsContent>
              )}
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
