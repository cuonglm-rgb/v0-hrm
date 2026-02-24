"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createRequestType, updateRequestType, deleteRequestType } from "@/lib/actions/request-type-actions"
import { applyToggleCoupling } from "@/lib/utils/time-slot-utils"
import type { RequestType, Position, CustomField, CustomFieldType } from "@/lib/types/database"
import { Plus, Pencil, Trash2, FileText, Calendar, Clock, Paperclip, Users, GripVertical } from "lucide-react"
import { toast } from "sonner"

interface RequestTypeManagementProps {
  requestTypes: RequestType[]
  positions?: Position[]
}

export function RequestTypeManagement({ requestTypes, positions = [] }: RequestTypeManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingType, setEditingType] = useState<RequestType | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    requires_date_range: true,
    requires_single_date: false,
    requires_time: false,
    requires_time_range: false,
    allows_multiple_time_slots: false,
    requires_reason: true,
    requires_attachment: false,
    affects_attendance: false,
    affects_payroll: false,
    deduct_leave_balance: false,
    approval_mode: "any" as "any" | "all",
    min_approver_level: null as number | null,
    max_approver_level: null as number | null,
    submission_deadline: null as number | null,
    custom_fields: [] as CustomField[],
  })

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      requires_date_range: true,
      requires_single_date: false,
      requires_time: false,
      requires_time_range: false,
      allows_multiple_time_slots: false,
      requires_reason: true,
      requires_attachment: false,
      affects_attendance: false,
      affects_payroll: false,
      deduct_leave_balance: false,
      approval_mode: "any",
      min_approver_level: null,
      max_approver_level: null,
      submission_deadline: null,
      custom_fields: [],
    })
  }

  // Custom fields handlers
  const addCustomField = () => {
    const newField: CustomField = {
      id: crypto.randomUUID(),
      label: "",
      type: "text",
      required: false,
      placeholder: "",
    }
    setFormData((prev) => ({
      ...prev,
      custom_fields: [...prev.custom_fields, newField],
    }))
  }

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setFormData((prev) => ({
      ...prev,
      custom_fields: prev.custom_fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    }))
  }

  const removeCustomField = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      custom_fields: prev.custom_fields.filter((field) => field.id !== id),
    }))
  }

  const handleCreate = async () => {
    if (!formData.name || !formData.code) return
    setLoading(true)
    const result = await createRequestType({
      ...formData,
      custom_fields: formData.custom_fields.length > 0 ? formData.custom_fields : null,
    })
    setLoading(false)
    if (result.success) {
      toast.success("Đã tạo loại phiếu mới")
      setIsCreateOpen(false)
      resetForm()
    } else {
      toast.error(result.error || "Không thể tạo loại phiếu")
    }
  }

  const handleEdit = (type: RequestType) => {
    setEditingType(type)
    setFormData({
      name: type.name,
      code: type.code,
      description: type.description || "",
      requires_date_range: type.requires_date_range,
      requires_single_date: type.requires_single_date,
      requires_time: type.requires_time,
      requires_time_range: type.requires_time_range,
      allows_multiple_time_slots: type.allows_multiple_time_slots || false,
      requires_reason: type.requires_reason,
      requires_attachment: type.requires_attachment,
      affects_attendance: type.affects_attendance,
      affects_payroll: type.affects_payroll,
      deduct_leave_balance: type.deduct_leave_balance,
      approval_mode: type.approval_mode || "any",
      min_approver_level: type.min_approver_level,
      max_approver_level: type.max_approver_level,
      submission_deadline: type.submission_deadline,
      custom_fields: type.custom_fields || [],
    })
  }

  const handleUpdate = async () => {
    if (!editingType) return
    setLoading(true)
    const { code, ...updateData } = formData
    const result = await updateRequestType(editingType.id, {
      ...updateData,
      custom_fields: updateData.custom_fields.length > 0 ? updateData.custom_fields : null,
    })
    setLoading(false)
    if (result.success) {
      toast.success("Đã cập nhật loại phiếu")
      setEditingType(null)
      resetForm()
    } else {
      toast.error(result.error || "Không thể cập nhật loại phiếu")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa loại phiếu này?")) return
    const result = await deleteRequestType(id)
    if (result.success) {
      toast.success("Đã xóa loại phiếu")
    } else {
      toast.error(result.error || "Không thể xóa loại phiếu")
    }
  }

  const handleToggleActive = async (type: RequestType) => {
    const result = await updateRequestType(type.id, { is_active: !type.is_active })
    if (result.success) {
      toast.success(type.is_active ? "Đã tắt loại phiếu" : "Đã bật loại phiếu")
    } else {
      toast.error(result.error || "Không thể cập nhật trạng thái")
    }
  }

  // Nhóm positions theo level và lấy tên các chức vụ
  const levelPositions = positions.reduce((acc, p) => {
    if (!acc[p.level]) {
      acc[p.level] = []
    }
    acc[p.level].push(p.name)
    return acc
  }, {} as Record<number, string[]>)

  const positionLevels = Object.keys(levelPositions).map(Number).sort((a, b) => a - b)

  const formFieldsContent = (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên loại phiếu *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="VD: Nghỉ phép năm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Mã code *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            placeholder="VD: annual_leave"
            disabled={!!editingType}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Mô tả chi tiết về loại phiếu..."
        />
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium">Cấu hình trường nhập</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="requires_date_range">Cần từ ngày - đến ngày</Label>
            <Switch
              id="requires_date_range"
              checked={formData.requires_date_range}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, requires_date_range: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="requires_single_date">Chỉ cần 1 ngày</Label>
            <Switch
              id="requires_single_date"
              checked={formData.requires_single_date}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, requires_single_date: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="requires_time">Cần chọn giờ</Label>
            <Switch
              id="requires_time"
              checked={formData.requires_time}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, requires_time: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="requires_time_range">Cần từ giờ - đến giờ</Label>
            <Switch
              id="requires_time_range"
              checked={formData.requires_time_range}
              onCheckedChange={(checked) => {
                const coupled = applyToggleCoupling(formData.allows_multiple_time_slots, checked)
                setFormData((prev) => ({
                  ...prev,
                  requires_time_range: coupled.requires_time_range,
                  allows_multiple_time_slots: coupled.allows_multiple_time_slots,
                }))
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="allows_multiple_time_slots">Cho phép nhiều khung giờ</Label>
            <Switch
              id="allows_multiple_time_slots"
              checked={formData.allows_multiple_time_slots}
              onCheckedChange={(checked) => {
                const coupled = applyToggleCoupling(checked, formData.requires_time_range)
                setFormData((prev) => ({
                  ...prev,
                  allows_multiple_time_slots: coupled.allows_multiple_time_slots,
                  requires_time_range: coupled.requires_time_range,
                }))
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="requires_reason">Bắt buộc lý do</Label>
            <Switch
              id="requires_reason"
              checked={formData.requires_reason}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, requires_reason: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="requires_attachment">Cần đính kèm file</Label>
            <Switch
              id="requires_attachment"
              checked={formData.requires_attachment}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, requires_attachment: checked }))}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium">Cấu hình quy định</h4>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="submission_deadline">Giới hạn thời gian tạo phiếu (ngày)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="submission_deadline"
                type="number"
                min="0"
                value={formData.submission_deadline || ""}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  submission_deadline: e.target.value ? parseInt(e.target.value) : null
                }))}
                placeholder="VD: 3 (phải tạo trong vòng 3 ngày sau khi sự việc xảy ra)"
                className="max-w-[200px]"
              />
              <span className="text-sm text-muted-foreground">Để trống là không giới hạn</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Ví dụ: Đi muộn ngày 1/1, nếu giới hạn là 3 ngày thì phải tạo phiếu trước ngày 4/1.
            </p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium">Ảnh hưởng</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="affects_attendance">Ảnh hưởng chấm công</Label>
            <Switch
              id="affects_attendance"
              checked={formData.affects_attendance}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, affects_attendance: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="affects_payroll">Ảnh hưởng lương</Label>
            <Switch
              id="affects_payroll"
              checked={formData.affects_payroll}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, affects_payroll: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="deduct_leave_balance">Trừ phép năm</Label>
            <Switch
              id="deduct_leave_balance"
              checked={formData.deduct_leave_balance}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, deduct_leave_balance: checked }))}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Users className="h-4 w-4" />
          Cấu hình người duyệt
        </h4>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Chế độ duyệt</Label>
            <Select
              value={formData.approval_mode}
              onValueChange={(value: "any" | "all") => setFormData((prev) => ({ ...prev, approval_mode: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Chỉ cần 1 người duyệt</SelectItem>
                <SelectItem value="all">Cần tất cả người duyệt đồng ý</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Level chức vụ tối thiểu</Label>
              <Select
                value={formData.min_approver_level?.toString() || "none"}
                onValueChange={(value) => setFormData((prev) => ({
                  ...prev,
                  min_approver_level: value === "none" ? null : parseInt(value)
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Không giới hạn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không giới hạn</SelectItem>
                  {positionLevels.map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      Level {level} - {levelPositions[level].join(", ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level chức vụ tối đa</Label>
              <Select
                value={formData.max_approver_level?.toString() || "none"}
                onValueChange={(value) => setFormData((prev) => ({
                  ...prev,
                  max_approver_level: value === "none" ? null : parseInt(value)
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Không giới hạn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không giới hạn</SelectItem>
                  {positionLevels.map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      Level {level} - {levelPositions[level].join(", ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {formData.approval_mode === "any"
              ? "Phiếu sẽ được duyệt khi có ít nhất 1 người trong danh sách đồng ý"
              : "Phiếu chỉ được duyệt khi tất cả người trong danh sách đều đồng ý"}
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Trường tùy chỉnh
          </h4>
          <Button type="button" variant="outline" size="sm" onClick={addCustomField}>
            <Plus className="h-4 w-4 mr-1" />
            Thêm trường
          </Button>
        </div>

        {formData.custom_fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Chưa có trường tùy chỉnh. Nhấn "Thêm trường" để bổ sung.
          </p>
        ) : (
          <div className="space-y-3">
            {formData.custom_fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-3 space-y-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Trường {index + 1}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 h-8 w-8 p-0"
                    onClick={() => removeCustomField(field.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Tên trường *</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                      placeholder="VD: Mô tả chi tiết"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Loại trường</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value: CustomFieldType) => updateCustomField(field.id, { type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Ô nhập text</SelectItem>
                        <SelectItem value="textarea">Ô nhập text nhiều dòng</SelectItem>
                        <SelectItem value="number">Ô nhập số</SelectItem>
                        <SelectItem value="select">Dropdown chọn</SelectItem>
                        <SelectItem value="image">Hình ảnh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Placeholder</Label>
                    <Input
                      value={field.placeholder || ""}
                      onChange={(e) => updateCustomField(field.id, { placeholder: e.target.value })}
                      placeholder="VD: Nhập mô tả..."
                    />
                  </div>
                  <div className="flex items-center justify-between pt-5">
                    <Label className="text-xs">Bắt buộc nhập</Label>
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) => updateCustomField(field.id, { required: checked })}
                    />
                  </div>
                </div>

                {field.type === "select" && (
                  <div className="space-y-1">
                    <Label className="text-xs">Các lựa chọn (mỗi dòng 1 lựa chọn)</Label>
                    <Textarea
                      value={field.options?.join("\n") || ""}
                      onChange={(e) => updateCustomField(field.id, {
                        options: e.target.value.split("\n").filter(Boolean)
                      })}
                      placeholder="Lựa chọn 1&#10;Lựa chọn 2&#10;Lựa chọn 3"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const getApprovalModeLabel = (mode: string) => {
    return mode === "all" ? "Tất cả duyệt" : "1 người duyệt"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Quản lý loại phiếu</CardTitle>
          <CardDescription>Tạo và quản lý các template loại phiếu</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm loại phiếu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo loại phiếu mới</DialogTitle>
              <DialogDescription>Định nghĩa template cho loại phiếu mới</DialogDescription>
            </DialogHeader>
            {formFieldsContent}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Hủy</Button>
              <Button onClick={handleCreate} disabled={loading || !formData.name || !formData.code}>
                {loading ? "Đang tạo..." : "Tạo loại phiếu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên loại phiếu</TableHead>
              <TableHead>Mã</TableHead>
              <TableHead>Cấu hình</TableHead>
              <TableHead>Người duyệt</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requestTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Chưa có loại phiếu nào
                </TableCell>
              </TableRow>
            ) : (
              requestTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{type.name}</div>
                      {type.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {type.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{type.code}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {type.requires_date_range && (
                        <Badge variant="outline" className="gap-1">
                          <Calendar className="h-3 w-3" />
                          Khoảng ngày
                        </Badge>
                      )}
                      {type.requires_single_date && (
                        <Badge variant="outline" className="gap-1">
                          <Calendar className="h-3 w-3" />
                          1 ngày
                        </Badge>
                      )}
                      {type.requires_time && (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Giờ
                        </Badge>
                      )}
                      {type.requires_time_range && (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Từ-đến giờ
                        </Badge>
                      )}
                      {type.allows_multiple_time_slots && (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Nhiều khung giờ
                        </Badge>
                      )}
                      {type.requires_reason && (
                        <Badge variant="outline" className="gap-1">
                          <FileText className="h-3 w-3" />
                          Lý do
                        </Badge>
                      )}
                      {type.requires_attachment && (
                        <Badge variant="outline" className="gap-1">
                          <Paperclip className="h-3 w-3" />
                          File
                        </Badge>
                      )}
                      {type.custom_fields && type.custom_fields.length > 0 && (
                        <Badge variant="secondary" className="gap-1">
                          <Plus className="h-3 w-3" />
                          {type.custom_fields.length} trường tùy chỉnh
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary" className="w-fit">
                        {getApprovalModeLabel(type.approval_mode)}
                      </Badge>
                      {(type.min_approver_level || type.max_approver_level) && (
                        <span className="text-xs text-muted-foreground">
                          Level: {type.min_approver_level || "?"} - {type.max_approver_level || "?"}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={type.is_active}
                      onCheckedChange={() => handleToggleActive(type)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(type)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => handleDelete(type.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        <Dialog open={!!editingType} onOpenChange={(open) => !open && setEditingType(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Sửa loại phiếu</DialogTitle>
              <DialogDescription>Cập nhật thông tin loại phiếu</DialogDescription>
            </DialogHeader>
            {formFieldsContent}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingType(null)}>Hủy</Button>
              <Button onClick={handleUpdate} disabled={loading || !formData.name}>
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
