"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
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
  DialogTrigger,
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
import { Coins, Plus, Pencil, Trash2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { createAllowanceType, updateAllowanceType, deleteAllowanceType } from "@/lib/actions/allowance-actions"
import { formatCurrency } from "@/lib/utils/format-utils"
import type { AllowanceType, AllowanceDeductionRules } from "@/lib/types/database"

interface AllowanceListProps {
  allowances: AllowanceType[]
  isHROrAdmin: boolean
}

const defaultDeductionRules: AllowanceDeductionRules = {
  deduct_on_absent: true,
  deduct_on_late: true,
  late_grace_count: 4,
  late_threshold_minutes: 15,
}

export function AllowanceList({ allowances, isHROrAdmin }: AllowanceListProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AllowanceType | null>(null)
  const [deleting, setDeleting] = useState<AllowanceType | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    amount: "",
    calculation_type: "fixed" as "fixed" | "daily",
    is_deductible: false,
    description: "",
    deduction_rules: { ...defaultDeductionRules },
  })

  const handleOpenCreate = () => {
    setEditing(null)
    setFormData({
      name: "",
      code: "",
      amount: "",
      calculation_type: "fixed",
      is_deductible: false,
      description: "",
      deduction_rules: { ...defaultDeductionRules },
    })
    setOpen(true)
  }

  const handleOpenEdit = (item: AllowanceType) => {
    setEditing(item)
    setFormData({
      name: item.name,
      code: item.code || "",
      amount: item.amount.toString(),
      calculation_type: item.calculation_type,
      is_deductible: item.is_deductible,
      description: item.description || "",
      deduction_rules: (item.deduction_rules as AllowanceDeductionRules) || { ...defaultDeductionRules },
    })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Tên phụ cấp là bắt buộc")
      return
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Số tiền phải lớn hơn 0")
      return
    }

    setSaving(true)
    try {
      const data = {
        name: formData.name,
        code: formData.code || undefined,
        amount: parseFloat(formData.amount.replace(/[^\d]/g, "")),
        calculation_type: formData.calculation_type,
        is_deductible: formData.is_deductible,
        description: formData.description || undefined,
        deduction_rules: formData.is_deductible ? formData.deduction_rules : undefined,
      }

      if (editing) {
        const result = await updateAllowanceType(editing.id, data)
        if (result.success) {
          toast.success("Đã cập nhật phụ cấp")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createAllowanceType(data)
        if (result.success) {
          toast.success("Đã tạo phụ cấp mới")
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
    const result = await deleteAllowanceType(deleting.id)
    if (result.success) {
      toast.success("Đã xóa phụ cấp")
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setDeleting(null)
  }

  const formatInputCurrency = (value: string) => {
    const num = value.replace(/[^\d]/g, "")
    if (!num) return ""
    return new Intl.NumberFormat("vi-VN").format(parseInt(num))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý phụ cấp</h1>
          <p className="text-muted-foreground">Thiết lập các loại phụ cấp và quy tắc trừ phụ cấp</p>
        </div>
        {isHROrAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm phụ cấp
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editing ? "Sửa phụ cấp" : "Thêm phụ cấp mới"}</DialogTitle>
                <DialogDescription>
                  {editing ? "Cập nhật thông tin phụ cấp" : "Tạo loại phụ cấp mới"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên phụ cấp *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Phụ cấp ăn trưa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Mã</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="VD: LUNCH"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Số tiền (VND) *</Label>
                    <Input
                      id="amount"
                      value={formData.amount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, amount: formatInputCurrency(e.target.value) })}
                      placeholder="35,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cách tính</Label>
                    <Select
                      value={formData.calculation_type}
                      onValueChange={(v: "fixed" | "daily") => setFormData({ ...formData, calculation_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Cố định/tháng</SelectItem>
                        <SelectItem value="daily">Theo ngày công</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về phụ cấp..."
                    rows={2}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <Label htmlFor="is_deductible" className="text-amber-800">
                      Có thể bị trừ
                    </Label>
                  </div>
                  <Switch
                    id="is_deductible"
                    checked={formData.is_deductible}
                    onCheckedChange={(v: boolean) => setFormData({ ...formData, is_deductible: v })}
                  />
                </div>

                {formData.is_deductible && (
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium">Quy tắc trừ phụ cấp</h4>
                    
                    <div className="flex items-center justify-between">
                      <Label>Trừ khi nghỉ làm</Label>
                      <Switch
                        checked={formData.deduction_rules.deduct_on_absent}
                        onCheckedChange={(v: boolean) =>
                          setFormData({
                            ...formData,
                            deduction_rules: { ...formData.deduction_rules, deduct_on_absent: v },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Trừ khi đi muộn</Label>
                      <Switch
                        checked={formData.deduction_rules.deduct_on_late}
                        onCheckedChange={(v: boolean) =>
                          setFormData({
                            ...formData,
                            deduction_rules: { ...formData.deduction_rules, deduct_on_late: v },
                          })
                        }
                      />
                    </div>

                    {formData.deduction_rules.deduct_on_late && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Số lần miễn trừ</Label>
                            <Input
                              type="number"
                              min={0}
                              value={formData.deduction_rules.late_grace_count || 0}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  deduction_rules: {
                                    ...formData.deduction_rules,
                                    late_grace_count: parseInt(e.target.value) || 0,
                                  },
                                })
                              }
                            />
                            <p className="text-xs text-muted-foreground">
                              Đi muộn trong số lần này không bị trừ
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label>Muộn từ (phút)</Label>
                            <Input
                              type="number"
                              min={1}
                              value={formData.deduction_rules.late_threshold_minutes || 15}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  deduction_rules: {
                                    ...formData.deduction_rules,
                                    late_threshold_minutes: parseInt(e.target.value) || 15,
                                  },
                                })
                              }
                            />
                            <p className="text-xs text-muted-foreground">
                              Muộn từ bao nhiêu phút tính là đi muộn
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
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
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phụ cấp</TableHead>
                <TableHead>Mã</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead>Cách tính</TableHead>
                <TableHead>Trừ phụ cấp</TableHead>
                <TableHead>Trạng thái</TableHead>
                {isHROrAdmin && <TableHead className="text-right">Thao tác</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {allowances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isHROrAdmin ? 7 : 6} className="text-center py-8 text-muted-foreground">
                    Chưa có loại phụ cấp nào
                  </TableCell>
                </TableRow>
              ) : (
                allowances.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                          <Coins className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <span className="font-medium">{item.name}</span>
                          {item.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.code ? (
                        <code className="text-sm bg-muted px-2 py-1 rounded">{item.code}</code>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.amount)}
                      {item.calculation_type === "daily" && (
                        <span className="text-xs text-muted-foreground">/ngày</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.calculation_type === "fixed" ? "Cố định" : "Theo ngày"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.is_deductible ? (
                        <Badge className="bg-amber-100 text-amber-700">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Có thể trừ
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Không trừ</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.is_active ? (
                        <Badge className="bg-green-100 text-green-700">Hoạt động</Badge>
                      ) : (
                        <Badge variant="secondary">Tạm dừng</Badge>
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
      </Card>

      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa phụ cấp "{deleting?.name}"?
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
