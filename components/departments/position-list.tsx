"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Briefcase, Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { toast } from "sonner"
import { createPosition, updatePosition, deletePosition } from "@/lib/actions/department-actions"
import type { Position } from "@/lib/types/database"

interface PositionListProps {
  positions: Position[]
  isHROrAdmin: boolean
}

const levelLabels: Record<number, { label: string; color: string }> = {
  1: { label: "Nhân viên", color: "bg-slate-100 text-slate-700" },
  2: { label: "Chuyên viên", color: "bg-blue-100 text-blue-700" },
  3: { label: "Trưởng nhóm", color: "bg-indigo-100 text-indigo-700" },
  4: { label: "Trưởng phòng", color: "bg-purple-100 text-purple-700" },
  5: { label: "Giám đốc", color: "bg-amber-100 text-amber-700" },
}

export function PositionList({ positions, isHROrAdmin }: PositionListProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editingPos, setEditingPos] = useState<Position | null>(null)
  const [deletePos, setDeletePos] = useState<Position | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ name: "", level: 1 })

  const handleOpenCreate = () => {
    setEditingPos(null)
    setFormData({ name: "", level: 1 })
    setOpen(true)
  }

  const handleOpenEdit = (pos: Position) => {
    setEditingPos(pos)
    setFormData({ name: pos.name, level: pos.level })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Tên vị trí là bắt buộc")
      return
    }

    setSaving(true)
    try {
      if (editingPos) {
        const result = await updatePosition(editingPos.id, {
          name: formData.name,
          level: formData.level,
        })
        if (result.success) {
          toast.success("Đã cập nhật vị trí")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createPosition({
          name: formData.name,
          level: formData.level,
        })
        if (result.success) {
          toast.success("Đã tạo vị trí mới")
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
    if (!deletePos) return

    const result = await deletePosition(deletePos.id)
    if (result.success) {
      toast.success("Đã xóa vị trí")
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setDeletePos(null)
  }

  const getLevelBadge = (level: number) => {
    const config = levelLabels[level] || { label: `Level ${level}`, color: "bg-gray-100 text-gray-700" }
    return <Badge className={config.color}>{config.label}</Badge>
  }

  return (
    <div className="space-y-4">
      {isHROrAdmin && (
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm vị trí
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingPos ? "Sửa vị trí" : "Thêm vị trí mới"}</DialogTitle>
                <DialogDescription>
                  {editingPos ? "Cập nhật thông tin vị trí" : "Tạo vị trí mới trong tổ chức"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên vị trí *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Nhân viên kinh doanh"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Cấp bậc (1-5)</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setFormData({ ...formData, level: Math.max(1, formData.level - 1) })}
                      disabled={formData.level <= 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Input
                      id="level"
                      type="number"
                      min={1}
                      max={5}
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: Math.min(5, Math.max(1, parseInt(e.target.value) || 1)) })}
                      className="w-20 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setFormData({ ...formData, level: Math.min(5, formData.level + 1) })}
                      disabled={formData.level >= 5}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">
                      {levelLabels[formData.level]?.label || `Level ${formData.level}`}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    1 = Nhân viên, 2 = Chuyên viên, 3 = Trưởng nhóm, 4 = Trưởng phòng, 5 = Giám đốc
                  </p>
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
                <TableHead>Vị trí</TableHead>
                <TableHead>Cấp bậc</TableHead>
                <TableHead>Ngày tạo</TableHead>
                {isHROrAdmin && <TableHead className="text-right">Thao tác</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isHROrAdmin ? 4 : 3} className="text-center py-8 text-muted-foreground">
                    Chưa có vị trí nào
                  </TableCell>
                </TableRow>
              ) : (
                positions.map((pos) => (
                  <TableRow key={pos.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                          <Briefcase className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium">{pos.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getLevelBadge(pos.level)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(pos.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    {isHROrAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(pos)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletePos(pos)}
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletePos} onOpenChange={() => setDeletePos(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa vị trí "{deletePos?.name}"? Hành động này không thể hoàn tác.
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
