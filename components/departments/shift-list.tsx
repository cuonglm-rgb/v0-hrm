"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TimeInput } from "@/components/ui/time-input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Clock, Plus, Pencil, Trash2, Coffee } from "lucide-react"
import { toast } from "sonner"
import { createWorkShift, updateWorkShift, deleteWorkShift } from "@/lib/actions/shift-actions"
import type { WorkShift } from "@/lib/types/database"

interface ShiftListProps {
  shifts: WorkShift[]
  isHROrAdmin: boolean
}

export function ShiftList({ shifts, isHROrAdmin }: ShiftListProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<WorkShift | null>(null)
  const [deleting, setDeleting] = useState<WorkShift | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    start_time: "08:00",
    end_time: "17:00",
    break_start: "12:00",
    break_end: "13:30",
  })

  const handleOpenCreate = () => {
    setEditing(null)
    setFormData({
      name: "",
      start_time: "08:00",
      end_time: "17:00",
      break_start: "12:00",
      break_end: "13:30",
    })
    setOpen(true)
  }

  const handleOpenEdit = (shift: WorkShift) => {
    setEditing(shift)
    setFormData({
      name: shift.name,
      start_time: shift.start_time?.slice(0, 5) || "08:00",
      end_time: shift.end_time?.slice(0, 5) || "17:00",
      break_start: shift.break_start?.slice(0, 5) || "12:00",
      break_end: shift.break_end?.slice(0, 5) || "13:30",
    })
    setOpen(true)
  }

  const calculateBreakMinutes = (start: string, end: string): number => {
    const [sh, sm] = start.split(":").map(Number)
    const [eh, em] = end.split(":").map(Number)
    return (eh * 60 + em) - (sh * 60 + sm)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Tên ca làm là bắt buộc")
      return
    }

    setSaving(true)
    try {
      const breakMinutes = calculateBreakMinutes(formData.break_start, formData.break_end)

      if (editing) {
        const result = await updateWorkShift(editing.id, {
          name: formData.name,
          start_time: formData.start_time,
          end_time: formData.end_time,
          break_start: formData.break_start,
          break_end: formData.break_end,
          break_minutes: breakMinutes,
        })
        if (result.success) {
          toast.success("Đã cập nhật ca làm")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createWorkShift({
          name: formData.name,
          start_time: formData.start_time,
          end_time: formData.end_time,
          break_start: formData.break_start,
          break_end: formData.break_end,
          break_minutes: breakMinutes,
        })
        if (result.success) {
          toast.success("Đã tạo ca làm mới")
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
    const result = await deleteWorkShift(deleting.id)
    if (result.success) {
      toast.success("Đã xóa ca làm")
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setDeleting(null)
  }

  const formatTime = (time: string | null) => {
    if (!time) return "-"
    return time.slice(0, 5)
  }

  return (
    <div className="space-y-4">
      {isHROrAdmin && (
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm ca làm
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Sửa ca làm" : "Thêm ca làm mới"}</DialogTitle>
                <DialogDescription>
                  {editing ? "Cập nhật thông tin ca làm" : "Tạo ca làm mới"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên ca làm *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Ca hành chính"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Giờ bắt đầu</Label>
                    <TimeInput
                      id="start_time"
                      value={formData.start_time}
                      onChange={(value) => setFormData({ ...formData, start_time: value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_time">Giờ kết thúc</Label>
                    <TimeInput
                      id="end_time"
                      value={formData.end_time}
                      onChange={(value) => setFormData({ ...formData, end_time: value })}
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Coffee className="h-4 w-4 text-amber-600" />
                    <Label className="text-amber-800">Giờ nghỉ trưa</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="break_start" className="text-sm">Bắt đầu nghỉ</Label>
                      <TimeInput
                        id="break_start"
                        value={formData.break_start}
                        onChange={(value) => setFormData({ ...formData, break_start: value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="break_end" className="text-sm">Kết thúc nghỉ</Label>
                      <TimeInput
                        id="break_end"
                        value={formData.break_end}
                        onChange={(value) => setFormData({ ...formData, break_end: value })}
                      />
                    </div>
                  </div>
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
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ca làm</TableHead>
                <TableHead>Giờ làm việc</TableHead>
                <TableHead>Giờ nghỉ trưa</TableHead>
                <TableHead>Thời gian nghỉ</TableHead>
                {isHROrAdmin && <TableHead className="text-right">Thao tác</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isHROrAdmin ? 5 : 4} className="text-center py-8 text-muted-foreground">
                    Chưa có ca làm nào
                  </TableCell>
                </TableRow>
              ) : (
                shifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{shift.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {shift.break_start && shift.break_end ? (
                        <Badge variant="secondary" className="font-mono">
                          <Coffee className="h-3 w-3 mr-1" />
                          {formatTime(shift.break_start)} - {formatTime(shift.break_end)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {shift.break_minutes > 0 ? (
                        <span>{shift.break_minutes} phút</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    {isHROrAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(shift)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleting(shift)}
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
      </Card>

      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa ca làm "{deleting?.name}"?
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
    </div>
  )
}
