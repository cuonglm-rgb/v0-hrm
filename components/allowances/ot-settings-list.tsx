"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Clock, Plus, Pencil, Trash2, Timer } from "lucide-react"
import { toast } from "sonner"
import {
  createOTSetting,
  updateOTSetting,
  deleteOTSetting,
  updateOTHoursPerDay,
} from "@/lib/actions/overtime-actions"
import type { OTSetting } from "@/lib/types/database"

interface OTSettingsListProps {
  settings: OTSetting[]
  isHROrAdmin: boolean
  otHoursPerDay: number
}

export function OTSettingsList({ settings, isHROrAdmin, otHoursPerDay }: OTSettingsListProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<OTSetting | null>(null)
  const [deleting, setDeleting] = useState<OTSetting | null>(null)
  const [saving, setSaving] = useState(false)
  const [hoursPerDay, setHoursPerDay] = useState(String(otHoursPerDay))
  const [savingHours, setSavingHours] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    multiplier: "1.5",
    description: "",
    display_order: "0",
  })

  const handleOpenCreate = () => {
    setEditing(null)
    setFormData({
      name: "",
      code: "",
      multiplier: "1.5",
      description: "",
      display_order: String(settings.length + 1),
    })
    setOpen(true)
  }

  const handleSaveHoursPerDay = async () => {
    const value = parseFloat(hoursPerDay)
    if (isNaN(value) || value <= 0 || value > 24) {
      toast.error("Giờ công chuẩn OT phải từ 0.5 đến 24")
      return
    }
    setSavingHours(true)
    try {
      const result = await updateOTHoursPerDay(value)
      if (result.success) {
        toast.success("Đã cập nhật giờ công chuẩn OT")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } finally {
      setSavingHours(false)
    }
  }

  const handleOpenEdit = (item: OTSetting) => {
    setEditing(item)
    setFormData({
      name: item.name,
      code: item.code,
      multiplier: item.multiplier.toString(),
      description: item.description || "",
      display_order: item.display_order.toString(),
    })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Tên là bắt buộc")
      return
    }
    if (!formData.code.trim()) {
      toast.error("Mã là bắt buộc")
      return
    }

    const multiplier = parseFloat(formData.multiplier)
    if (isNaN(multiplier) || multiplier <= 0) {
      toast.error("Hệ số phải lớn hơn 0")
      return
    }

    setSaving(true)
    try {
      const data = {
        name: formData.name,
        code: formData.code,
        multiplier,
        description: formData.description || undefined,
        display_order: parseInt(formData.display_order) || 0,
      }

      if (editing) {
        const result = await updateOTSetting(editing.id, data)
        if (result.success) {
          toast.success("Đã cập nhật hệ số OT")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createOTSetting(data)
        if (result.success) {
          toast.success("Đã tạo hệ số OT mới")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    const result = await deleteOTSetting(deleting.id)
    if (result.success) {
      toast.success("Đã xóa")
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setDeleting(null)
  }

  const handleToggleActive = async (item: OTSetting) => {
    const result = await updateOTSetting(item.id, { is_active: !item.is_active })
    if (result.success) {
      toast.success(item.is_active ? "Đã tắt" : "Đã bật")
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 3) return "bg-red-100 text-red-700"
    if (multiplier >= 2) return "bg-orange-100 text-orange-700"
    return "bg-green-100 text-green-700"
  }

  return (
    <div className="space-y-4">
      {/* Giờ công chuẩn OT */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Giờ công chuẩn OT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="ot_hours_per_day">Số giờ/ngày để tính lương OT</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="ot_hours_per_day"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  className="w-24"
                  disabled={!isHROrAdmin}
                />
                <span className="text-sm text-muted-foreground">giờ/ngày</span>
                {isHROrAdmin && (
                  <Button
                    size="sm"
                    onClick={handleSaveHoursPerDay}
                    disabled={savingHours || String(otHoursPerDay) === hoursPerDay}
                  >
                    {savingHours ? "Đang lưu..." : "Lưu"}
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Công thức:</strong> Lương OT/giờ = Lương cơ bản ÷ Công chuẩn ÷ <strong>{hoursPerDay}</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              VD: 12,000,000 ÷ 26 ÷ {hoursPerDay} = {Math.round(12000000 / 26 / (parseFloat(hoursPerDay) || 8)).toLocaleString()}đ/giờ
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bảng hệ số OT */}
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Hệ số tăng ca (OT) ({settings.length})
        </CardTitle>
        {isHROrAdmin && (
          <Button size="sm" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-1" />
            Thêm
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Mã</TableHead>
              <TableHead className="text-center">Hệ số</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Trạng thái</TableHead>
              {isHROrAdmin && <TableHead className="text-right">Thao tác</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isHROrAdmin ? 6 : 5} className="text-center py-6 text-muted-foreground">
                  Chưa có dữ liệu. Vui lòng chạy script 022-overtime-settings.sql
                </TableCell>
              </TableRow>
            ) : (
              settings.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{item.code}</code>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getMultiplierColor(item.multiplier)}>
                      x{item.multiplier}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {item.description || "-"}
                  </TableCell>
                  <TableCell>
                    {item.is_active ? (
                      <Badge className="bg-green-100 text-green-700 text-xs">Hoạt động</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Tạm dừng</Badge>
                    )}
                  </TableCell>
                  {isHROrAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleting(item)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog thêm/sửa */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Sửa" : "Thêm"} hệ số tăng ca</DialogTitle>
            <DialogDescription>
              Thiết lập hệ số nhân cho các loại tăng ca khác nhau
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên loại OT *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Tăng ca ngày thường"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="VD: OT_NORMAL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="multiplier">Hệ số nhân *</Label>
                <Input
                  id="multiplier"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.multiplier}
                  onChange={(e) => setFormData({ ...formData, multiplier: e.target.value })}
                  placeholder="1.5"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Công thức:</strong> Tiền OT = Lương giờ × Số giờ OT × Hệ số
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Lương giờ = Lương cơ bản ÷ Công chuẩn ÷ {otHoursPerDay}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả chi tiết..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Thứ tự hiển thị</Label>
              <Input
                id="display_order"
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa hệ số "{deleting?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
    </div>
  )
}
