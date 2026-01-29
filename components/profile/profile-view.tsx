"use client"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Save, Building2, Calendar, Shield, Mail, Briefcase, User, History, Wallet, Timer, Clock } from "lucide-react"
import { updateMyProfile } from "@/lib/actions/employee-actions"
import { EmployeeSalaryTab } from "../employees/employee-salary-tab"
import { EmployeeOTRatesTab } from "../employees/employee-ot-rates-tab"
import { calculateAvailableBalance } from "@/lib/utils/leave-utils"
import type {
  EmployeeWithRelations,
  UserRoleWithRelations,
  Department,
  Position,
  WorkShift,
  Role,
  EmployeeJobHistoryWithRelations,
  SalaryStructure
} from "@/lib/types/database"

interface ProfileViewProps {
  employee: EmployeeWithRelations | null
  userRoles: UserRoleWithRelations[]
  departments: Department[]
  positions: Position[]
  shifts: WorkShift[]
  roles: Role[]
  jobHistory: EmployeeJobHistoryWithRelations[]
  salaryHistory: SalaryStructure[]
  leaveUsage: number
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

export function ProfileView({
  employee,
  userRoles,
  departments,
  positions,
  shifts,
  roles,
  jobHistory,
  salaryHistory,
  leaveUsage
}: ProfileViewProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: employee?.full_name || "",
    phone: employee?.phone || "",
  })

  // Calculate Leave Fund
  const currentYear = new Date().getFullYear()
  const { totalEntitlement, availableToUse, remaining, isRestricted } = useMemo(() => {
    if (!employee) return { totalEntitlement: 0, availableToUse: 0, remaining: 0, isRestricted: false }
    return calculateAvailableBalance(
      employee.official_date,
      leaveUsage,
      new Date()
    )
  }, [employee?.official_date, leaveUsage])

  const initials =
    employee?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await updateMyProfile(formData)
      if (result.success) {
        toast.success("Cập nhật hồ sơ thành công")
        router.refresh()
      } else {
        toast.error(result.error || "Không thể cập nhật hồ sơ")
      }
    } finally {
      setSaving(false)
    }
  }

  if (!employee) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Không tìm thấy hồ sơ nhân viên. Vui lòng liên hệ HR.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hồ sơ của tôi</h1>
          <p className="text-muted-foreground">Xem thống tin công việc, lương và lịch sử</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
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
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{employee.email}</span>
                </div>
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
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.join_date ? new Date(employee.join_date).toLocaleDateString("vi-VN") : "Not set"}</span>
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
                <TabsTrigger value="salary">
                  <Wallet className="h-4 w-4 mr-1" />
                  Lương
                </TabsTrigger>
                <TabsTrigger value="ot-rates">
                  <Timer className="h-4 w-4 mr-1" />
                  Hệ số OT
                </TabsTrigger>
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
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee_code">Mã nhân viên</Label>
                    <Input id="employee_code" value={employee.employee_code || ""} disabled />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Vai trò trên hệ thống
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userRoles.map((ur) => (
                      <Badge key={ur.id} variant="secondary">
                        {ur.role.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="work" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phòng ban</Label>
                    <Input value={employee.department?.name || "-"} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Vị trí</Label>
                    <Input value={employee.position?.name || "-"} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      <Clock className="h-4 w-4 inline mr-1" />
                      Ca làm việc
                    </Label>
                    <Input 
                      value={
                        employee.shift 
                          ? `${employee.shift.name} (${employee.shift.start_time?.slice(0, 5)} - ${employee.shift.end_time?.slice(0, 5)})`
                          : "-"
                      } 
                      disabled 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trạng thái</Label>
                    <Input value={statusLabels[employee.status]} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Ngày vào làm</Label>
                    <Input value={employee.join_date || "-"} disabled type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Ngày chính thức</Label>
                    <Input value={employee.official_date || "-"} disabled type="date" />
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

              <TabsContent value="salary" className="mt-0">
                <EmployeeSalaryTab
                  employeeId={employee.id}
                  salaryHistory={salaryHistory}
                  isHROrAdmin={false}
                />
              </TabsContent>

              <TabsContent value="ot-rates" className="mt-0">
                <EmployeeOTRatesTab
                  employeeId={employee.id}
                  isHROrAdmin={false}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
