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
import { createRequestType, updateRequestType, deleteRequestType } from "@/lib/actions/request-type-actions"
import type { RequestType } from "@/lib/types/database"
import { Plus, Pencil, Trash2, FileText, Calendar, Clock, Paperclip } from "lucide-react"

interface RequestTypeManagementProps {
  requestTypes: RequestType[]
}

export function RequestTypeManagement({ requestTypes }: RequestTypeManagementProps) {
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
    requires_reason: true,
    requires_attachment: false,
    affects_attendance: false,
    affects_payroll: false,
    deduct_leave_balance: false,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      requires_date_range: true,
      requires_single_date: false,
      requires_time: false,
      requires_reason: true,
      requires_attachment: false,
      affects_attendance: false,
      affects_payroll: false,
      deduct_leave_balance: false,
    })
  }

  const handleCreate = async () => {
    if (!formData.name || !formData.code) return
    setLoading(true)
    const result = await createRequestType(formData)
    setLoading(false)
    if (result.success) {
      setIsCreateOpen(false)
      resetForm()
    } else {
      alert(result.error)
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
      requires_reason: type.requires_reason,
      requires_attachment: type.requires_attachment,
      affects_attendance: type.affects_attendance,
      affects_payroll: type.affects_payroll,
      deduct_leave_balance: type.deduct_leave_balance,
    })
  }

  const handleUpdate = async () => {
    if (!editingType) return
    setLoading(true)
    const { code, ...updateData } = formData
    const result = await updateRequestType(editingType.id, updateData)
    setLoading(false)
    if (result.success) {
      setEditingType(null)
      resetForm()
    } else {
      alert(result.error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa loại phiếu này?")) return
    const result = await deleteRequestType(id)
    if (!result.success) {
      alert(result.error)
    }
  }

  const handleToggleActive = async (type: RequestType) => {
    await updateRequestType(type.id, { is_active: !type.is_active })
  }

  const FormFields = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên loại phiếu *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="VD: Nghỉ phép năm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Mã code *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              onCheckedChange={(checked) => setFormData({ ...formData, requires_date_range: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="requires_single_date">Chỉ cần 1 ngày</Label>
            <Switch
              id="requires_single_date"
              checked={formData.requires_single_date}
              onCheckedChange={(checked) => setFormData({ ...formData, requires_single_date: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="requires_time">Cần chọn giờ</Label>
            <Switch
              id="requires_time"
              checked={formData.requires_time}
              onCheckedChange={(checked) => setFormData({ ...formData, requires_time: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="requires_reason">Bắt buộc lý do</Label>
            <Switch
              id="requires_reason"
              checked={formData.requires_reason}
              onCheckedChange={(checked) => setFormData({ ...formData, requires_reason: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="requires_attachment">Cần đính kèm file</Label>
            <Switch
              id="requires_attachment"
              checked={formData.requires_attachment}
              onCheckedChange={(checked) => setFormData({ ...formData, requires_attachment: checked })}
            />
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
              onCheckedChange={(checked) => setFormData({ ...formData, affects_attendance: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="affects_payroll">Ảnh hưởng lương</Label>
            <Switch
              id="affects_payroll"
              checked={formData.affects_payroll}
              onCheckedChange={(checked) => setFormData({ ...formData, affects_payroll: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="deduct_leave_balance">Trừ phép năm</Label>
            <Switch
              id="deduct_leave_balance"
              checked={formData.deduct_leave_balance}
              onCheckedChange={(checked) => setFormData({ ...formData, deduct_leave_balance: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  )

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
            <FormFields />
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
              <TableHead>Ảnh hưởng</TableHead>
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
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {type.affects_attendance && (
                        <Badge className="bg-blue-100 text-blue-800">Chấm công</Badge>
                      )}
                      {type.affects_payroll && (
                        <Badge className="bg-green-100 text-green-800">Lương</Badge>
                      )}
                      {type.deduct_leave_balance && (
                        <Badge className="bg-orange-100 text-orange-800">Trừ phép</Badge>
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
            <FormFields />
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
