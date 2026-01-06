"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { CalendarDays, Plus, Pencil, Trash2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { createHoliday, updateHoliday, deleteHoliday } from "@/lib/actions/overtime-actions"
import type { Holiday } from "@/lib/types/database"

interface HolidayListProps {
  holidays: Holiday[]
  isHROrAdmin: boolean
}

export function HolidayList({ holidays, isHROrAdmin }: HolidayListProps) {
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Holiday | null>(null)
  const [deleting, setDeleting] = useState<Holiday | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    holiday_date: "",
    year: currentYear,
    is_recurring: false,
    description: "",
  })

  const filteredHolidays = holidays.filter((h) => h.year === selectedYear)
  const years = [...new Set(holidays.map((h) => h.year))].sort((a, b) => b - a)
  if (!years.includes(currentYear)) years.unshift(currentYear)
  if (!years.includes(currentYear + 1)) years.push(currentYear + 1)

  const handleOpenCreate = () => {
    setEditing(null)
    setFormData({
      name: "",
      holiday_date: "",
      year: selectedYear,
      is_recurring: false,
      description: "",
    })
    setOpen(true)
  }

  const handleOpenEdit = (item: Holiday) => {
    setEditing(item)
    setFormData({
      name: item.name,
      holiday_date: item.holiday_date,
      year: item.year,
      is_recurring: item.is_recurring,
      description: item.description || "",
    })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Tên ngày lễ là bắt buộc")
      return
    }
    if (!formData.holiday_date) {
      toast.error("Ngày lễ là bắt buộc")
      return
    }

    setSaving(true)
    try {
      const data = {
        name: formData.name,
        holiday_date: formData.holiday_date,
        year: formData.year,
        is_recurring: formData.is_recurring,
        description: formData.description || undefined,
      }

      if (editing) {
        const result = await updateHoliday(editing.id, data)
        if (result.success) {
          toast.success("Đã cập nhật ngày lễ")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createHoliday(data)
        if (result.success) {
          toast.success("Đã thêm ngày lễ")
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
    const result = await deleteHoliday(deleting.id)
    if (result.success) {
      toast.success("Đã xóa")
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setDeleting(null)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Ngày lễ ({filteredHolidays.length})
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isHROrAdmin && (
            <Button size="sm" onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-1" />
              Thêm
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Tên ngày lễ</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="text-center">Lặp lại</TableHead>
              {isHROrAdmin && <TableHead className="text-right">Thao tác</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHolidays.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isHROrAdmin ? 5 : 4} className="text-center py-6 text-muted-foreground">
                  Chưa có ngày lễ nào cho năm {selectedYear}
                </TableCell>
              </TableRow>
            ) : (
              filteredHolidays.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {formatDate(item.holiday_date)}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {item.description || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.is_recurring ? (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Hàng năm
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Một lần</Badge>
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
            <DialogTitle>{editing ? "Sửa" : "Thêm"} ngày lễ</DialogTitle>
            <DialogDescription>
              Ngày lễ sẽ được dùng để tự động xác định loại OT (x3.0)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên ngày lễ *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Tết Nguyên Đán"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="holiday_date">Ngày *</Label>
                <Input
                  id="holiday_date"
                  type="date"
                  value={formData.holiday_date}
                  onChange={(e) => {
                    const date = e.target.value
                    const year = date ? new Date(date).getFullYear() : formData.year
                    setFormData({ ...formData, holiday_date: date, year })
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Năm</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || currentYear })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="VD: Mùng 1 Tết"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-600" />
                <Label htmlFor="is_recurring" className="text-blue-800">
                  Lặp lại hàng năm
                </Label>
              </div>
              <Switch
                id="is_recurring"
                checked={formData.is_recurring}
                onCheckedChange={(v) => setFormData({ ...formData, is_recurring: v })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Bật nếu ngày lễ có ngày cố định hàng năm (VD: 1/1, 30/4, 1/5, 2/9)
            </p>
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
              Bạn có chắc muốn xóa ngày lễ "{deleting?.name}" ({deleting?.holiday_date})?
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
  )
}
