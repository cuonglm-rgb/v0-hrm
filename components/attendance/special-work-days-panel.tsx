"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Calendar, CloudRain, Clock, Filter, Users } from "lucide-react"
import { toast } from "sonner"
import type { SpecialWorkDayWithEmployees, EmployeeWithRelations } from "@/lib/types/database"
import {
  createSpecialWorkDay,
  updateSpecialWorkDay,
  deleteSpecialWorkDay,
} from "@/lib/actions/special-work-day-actions"
import { listEmployees } from "@/lib/actions/employee-actions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TimeInput } from "@/components/ui/time-input"
import { EmployeeMultiSelect } from "@/components/ui/employee-multi-select"

interface SpecialWorkDaysPanelProps {
  specialDays: SpecialWorkDayWithEmployees[]
}

export function SpecialWorkDaysPanel({ specialDays }: SpecialWorkDaysPanelProps) {
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const [editingDay, setEditingDay] = useState<SpecialWorkDayWithEmployees | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [filterYear, setFilterYear] = useState<string>("all")
  
  // Danh sách nhân viên để chọn
  const [employees, setEmployees] = useState<EmployeeWithRelations[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(false)

  // Lọc theo năm
  const filteredDays = filterYear === "all" 
    ? specialDays 
    : specialDays.filter(day => day.work_date.startsWith(filterYear))

  // Lấy danh sách năm từ dữ liệu
  const availableYears = Array.from(
    new Set(specialDays.map(day => day.work_date.split('-')[0]))
  ).sort((a, b) => b.localeCompare(a))

  const [formData, setFormData] = useState({
    work_date: "",
    reason: "",
    allow_early_leave: true,
    allow_late_arrival: false,
    is_company_holiday: false,
    apply_to_selected_employees: false, // Mới: toggle chọn nhân viên cụ thể
    selected_employee_ids: [] as string[], // Mới: danh sách ID nhân viên được chọn
    custom_start_time: "",
    custom_end_time: "",
    note: "",
  })
  
  // Load danh sách nhân viên khi cần
  useEffect(() => {
    if (formData.is_company_holiday && formData.apply_to_selected_employees && employees.length === 0) {
      setLoadingEmployees(true)
      listEmployees()
        .then(setEmployees)
        .finally(() => setLoadingEmployees(false))
    }
  }, [formData.is_company_holiday, formData.apply_to_selected_employees, employees.length])

  const handleOpenDialog = (day?: SpecialWorkDayWithEmployees) => {
    if (day) {
      setEditingDay(day)
      // Lấy danh sách employee_ids từ assigned_employees
      const assignedIds = day.assigned_employees?.map(ae => ae.employee_id) || []
      setFormData({
        work_date: day.work_date,
        reason: day.reason,
        allow_early_leave: day.allow_early_leave,
        allow_late_arrival: day.allow_late_arrival,
        is_company_holiday: day.is_company_holiday,
        apply_to_selected_employees: assignedIds.length > 0,
        selected_employee_ids: assignedIds,
        custom_start_time: day.custom_start_time || "",
        custom_end_time: day.custom_end_time || "",
        note: day.note || "",
      })
    } else {
      setEditingDay(null)
      setFormData({
        work_date: "",
        reason: "",
        allow_early_leave: true,
        allow_late_arrival: false,
        is_company_holiday: false,
        apply_to_selected_employees: false,
        selected_employee_ids: [],
        custom_start_time: "",
        custom_end_time: "",
        note: "",
      })
    }
    setShowDialog(true)
  }

  const handleSave = async () => {
    if (!formData.work_date || !formData.reason) {
      toast.error("Vui lòng nhập đầy đủ thông tin")
      return
    }

    // Validate: Nếu chọn áp dụng cho nhân viên cụ thể thì phải chọn ít nhất 1 nhân viên
    if (formData.is_company_holiday && formData.apply_to_selected_employees && formData.selected_employee_ids.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 nhân viên")
      return
    }

    setSaving(true)
    try {
      // Nếu không áp dụng cho nhân viên cụ thể, gửi mảng rỗng (= toàn công ty)
      const employeeIds = formData.is_company_holiday && formData.apply_to_selected_employees
        ? formData.selected_employee_ids
        : []

      const result = editingDay
        ? await updateSpecialWorkDay(editingDay.id, {
            reason: formData.reason,
            allow_early_leave: formData.allow_early_leave,
            allow_late_arrival: formData.allow_late_arrival,
            is_company_holiday: formData.is_company_holiday,
            custom_start_time: formData.custom_start_time || null,
            custom_end_time: formData.custom_end_time || null,
            note: formData.note || null,
            employee_ids: employeeIds,
          })
        : await createSpecialWorkDay({
            work_date: formData.work_date,
            reason: formData.reason,
            allow_early_leave: formData.allow_early_leave,
            allow_late_arrival: formData.allow_late_arrival,
            is_company_holiday: formData.is_company_holiday,
            custom_start_time: formData.custom_start_time || null,
            custom_end_time: formData.custom_end_time || null,
            note: formData.note || null,
            employee_ids: employeeIds,
          })

      if (result.success) {
        toast.success(editingDay ? "Cập nhật thành công" : "Thêm ngày đặc biệt thành công")
        setShowDialog(false)
        router.refresh()
      } else {
        toast.error(result.error || "Có lỗi xảy ra")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    const result = await deleteSpecialWorkDay(deletingId)
    if (result.success) {
      toast.success("Xóa thành công")
      setDeletingId(null)
      router.refresh()
    } else {
      toast.error(result.error || "Có lỗi xảy ra")
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CloudRain className="h-5 w-5" />
              Ngày làm việc đặc biệt
            </CardTitle>
            <CardDescription>
              Quản lý các ngày có điều kiện làm việc đặc biệt (bão, sự kiện, được về sớm hợp lệ)
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm ngày
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Bộ lọc năm */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Năm:</span>
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground ml-auto">
            {filteredDays.length} ngày
          </span>
        </div>

        {filteredDays.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có ngày làm việc đặc biệt nào</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Quy định</TableHead>
                <TableHead>Giờ tùy chỉnh</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDays.map((day) => (
                <TableRow key={day.id}>
                  <TableCell className="font-medium">{formatDate(day.work_date)}</TableCell>
                  <TableCell>{day.reason}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {day.is_company_holiday ? (
                        <>
                          <Badge variant="outline" className="w-fit text-xs bg-purple-50 text-purple-700">
                            Ngày nghỉ công ty
                          </Badge>
                          {day.assigned_employees && day.assigned_employees.length > 0 ? (
                            <Badge variant="outline" className="w-fit text-xs bg-blue-50 text-blue-700 gap-1">
                              <Users className="h-3 w-3" />
                              {day.assigned_employees.length} nhân viên
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="w-fit text-xs bg-green-50 text-green-700">
                              Toàn công ty
                            </Badge>
                          )}
                        </>
                      ) : (
                        <>
                          {day.allow_early_leave && (
                            <Badge variant="outline" className="w-fit text-xs">
                              Được về sớm
                            </Badge>
                          )}
                          {day.allow_late_arrival && (
                            <Badge variant="outline" className="w-fit text-xs">
                              Được đi muộn
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {day.custom_start_time || day.custom_end_time ? (
                      <div className="flex items-center gap-1 text-sm font-mono">
                        <Clock className="h-3 w-3" />
                        {day.custom_start_time?.slice(0, 5) || "??:??"}
                        {" - "}
                        {day.custom_end_time?.slice(0, 5) || "??:??"}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">Theo ca</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {day.note || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(day)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(day.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Dialog thêm/sửa */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDay ? "Chỉnh sửa ngày đặc biệt" : "Thêm ngày làm việc đặc biệt"}
            </DialogTitle>
            <DialogDescription>
              Đánh dấu các ngày có điều kiện làm việc đặc biệt để không tính vi phạm
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="work_date">Ngày *</Label>
                <Input
                  id="work_date"
                  type="date"
                  value={formData.work_date}
                  onChange={(e) => setFormData({ ...formData, work_date: e.target.value })}
                  disabled={!!editingDay}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Lý do *</Label>
                <Input
                  id="reason"
                  placeholder="VD: Bão số 5, Sự kiện công ty..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm">Quy định cho ngày này:</h4>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_company_holiday">Ngày nghỉ công ty</Label>
                  <p className="text-xs text-muted-foreground">
                    Nhân viên nghỉ toàn bộ, trừ 1 ngày công chuẩn trong payroll
                  </p>
                </div>
                <Switch
                  id="is_company_holiday"
                  checked={formData.is_company_holiday}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_company_holiday: checked })
                  }
                />
              </div>
              
              {/* Phần chọn phạm vi áp dụng - chỉ hiển thị khi is_company_holiday = true */}
              {formData.is_company_holiday && (
                <div className="pt-3 border-t space-y-3">
                  <Label className="text-sm">Phạm vi áp dụng:</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input
                        type="radio"
                        name="apply_scope"
                        checked={!formData.apply_to_selected_employees}
                        onChange={() => setFormData({ 
                          ...formData, 
                          apply_to_selected_employees: false,
                          selected_employee_ids: []
                        })}
                        className="h-4 w-4 text-primary"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Toàn công ty</div>
                        <p className="text-xs text-muted-foreground">Áp dụng cho tất cả nhân viên</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input
                        type="radio"
                        name="apply_scope"
                        checked={formData.apply_to_selected_employees}
                        onChange={() => setFormData({ 
                          ...formData, 
                          apply_to_selected_employees: true
                        })}
                        className="h-4 w-4 text-primary mt-0.5"
                      />
                      <div className="flex-1 space-y-2">
                        <div>
                          <div className="font-medium text-sm">Nhân viên cụ thể</div>
                          <p className="text-xs text-muted-foreground">Chỉ áp dụng cho các nhân viên được chọn</p>
                        </div>
                        {formData.apply_to_selected_employees && (
                          <div className="space-y-2">
                            <EmployeeMultiSelect
                              employees={employees}
                              selected={formData.selected_employee_ids}
                              onChange={(ids) => setFormData({ ...formData, selected_employee_ids: ids })}
                              loading={loadingEmployees}
                              placeholder="Tìm và chọn nhân viên..."
                              maxHeight="150px"
                            />
                            {formData.selected_employee_ids.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                Đã chọn {formData.selected_employee_ids.length} nhân viên
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              )}
              
              {!formData.is_company_holiday && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow_early_leave">Cho phép về sớm</Label>
                      <p className="text-xs text-muted-foreground">
                        Nhân viên về sớm sẽ không bị tính vi phạm
                      </p>
                    </div>
                    <Switch
                      id="allow_early_leave"
                      checked={formData.allow_early_leave}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, allow_early_leave: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow_late_arrival">Cho phép đi muộn</Label>
                      <p className="text-xs text-muted-foreground">
                        Nhân viên đi muộn sẽ không bị tính vi phạm
                      </p>
                    </div>
                    <Switch
                      id="allow_late_arrival"
                      checked={formData.allow_late_arrival}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, allow_late_arrival: checked })
                      }
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Giờ làm tùy chỉnh (tùy chọn)
              </h4>
              <p className="text-xs text-muted-foreground">
                Nếu để trống, hệ thống sẽ sử dụng giờ làm theo ca của nhân viên
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custom_start_time">Giờ vào</Label>
                  <TimeInput
                    id="custom_start_time"
                    value={formData.custom_start_time}
                    onChange={(value) =>
                      setFormData({ ...formData, custom_start_time: value })
                    }
                    placeholder="Chọn giờ vào"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom_end_time">Giờ ra</Label>
                  <TimeInput
                    id="custom_end_time"
                    value={formData.custom_end_time}
                    onChange={(value) =>
                      setFormData({ ...formData, custom_end_time: value })
                    }
                    placeholder="Chọn giờ ra"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                placeholder="Thông tin bổ sung..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Đang lưu..." : editingDay ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa ngày làm việc đặc biệt này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
