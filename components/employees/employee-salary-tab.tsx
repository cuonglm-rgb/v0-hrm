"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { toast } from "sonner"
import { Plus, Wallet, TrendingUp, Shield, Trash2, Receipt, Pencil } from "lucide-react"
import { createSalaryStructure } from "@/lib/actions/payroll-actions"
import {
  listAdjustmentTypes,
  listEmployeeAdjustments,
  assignAdjustmentToEmployee,
  removeEmployeeAdjustment,
  updateEmployeeAdjustment,
} from "@/lib/actions/allowance-actions"
import { formatCurrency } from "@/lib/utils/format-utils"
import { formatDateVN } from "@/lib/utils/date-utils"
import type { SalaryStructure, PayrollAdjustmentType, EmployeeAdjustmentWithType } from "@/lib/types/database"

interface EmployeeSalaryTabProps {
  employeeId: string
  salaryHistory: SalaryStructure[]
  isHROrAdmin: boolean
}

export function EmployeeSalaryTab({ employeeId, salaryHistory, isHROrAdmin }: EmployeeSalaryTabProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    base_salary: "",
    allowance: "",
    effective_date: new Date().toISOString().split("T")[0],
    note: "",
  })

  // State cho phần khấu trừ/phụ cấp
  const [adjustmentTypes, setAdjustmentTypes] = useState<PayrollAdjustmentType[]>([])
  const [employeeAdjustments, setEmployeeAdjustments] = useState<EmployeeAdjustmentWithType[]>([])
  const [adjustmentOpen, setAdjustmentOpen] = useState(false)
  const [adjustmentSaving, setAdjustmentSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingAdjustment, setEditingAdjustment] = useState<EmployeeAdjustmentWithType | null>(null)
  const [adjustmentForm, setAdjustmentForm] = useState({
    adjustment_type_id: "",
    custom_amount: "",
    custom_percentage: "",
    effective_date: new Date().toISOString().split("T")[0],
    end_date: "",
    note: "",
  })

  const currentSalary = salaryHistory[0] // Lương hiện tại (mới nhất)

  // Load adjustment types và employee adjustments
  useEffect(() => {
    const loadData = async () => {
      const [types, empAdj] = await Promise.all([
        listAdjustmentTypes(),
        listEmployeeAdjustments(employeeId),
      ])
      // Lấy tất cả các loại active (bao gồm cả auto-applied để override)
      setAdjustmentTypes(types.filter((t) => t.is_active))
      setEmployeeAdjustments(empAdj)
    }
    loadData()
  }, [employeeId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const result = await createSalaryStructure({
        employee_id: employeeId,
        base_salary: parseFloat(formData.base_salary.replace(/[^\d]/g, "")) || 0,
        allowance: parseFloat(formData.allowance.replace(/[^\d]/g, "")) || 0,
        effective_date: formData.effective_date,
        note: formData.note || undefined,
      })

      if (result.success) {
        toast.success("Đã cập nhật lương thành công")
        setOpen(false)
        setFormData({
          base_salary: "",
          allowance: "",
          effective_date: new Date().toISOString().split("T")[0],
          note: "",
        })
        router.refresh()
      } else {
        toast.error(result.error || "Không thể cập nhật lương")
      }
    } finally {
      setSaving(false)
    }
  }

  const formatInputCurrency = (value: string) => {
    const num = value.replace(/[^\d]/g, "")
    if (!num) return ""
    return new Intl.NumberFormat("vi-VN").format(parseInt(num))
  }

  // Xử lý thêm khấu trừ/phụ cấp
  const handleAddAdjustment = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdjustmentSaving(true)

    try {
      const result = await assignAdjustmentToEmployee({
        employee_id: employeeId,
        adjustment_type_id: adjustmentForm.adjustment_type_id,
        custom_amount: adjustmentForm.custom_amount
          ? parseFloat(adjustmentForm.custom_amount.replace(/[^\d]/g, ""))
          : undefined,
        custom_percentage: adjustmentForm.custom_percentage
          ? parseFloat(adjustmentForm.custom_percentage.replace(/[^\d.,]/g, "").replace(",", "."))
          : undefined,
        effective_date: adjustmentForm.effective_date,
        end_date: adjustmentForm.end_date || undefined,
        note: adjustmentForm.note || undefined,
      })

      if (result.success) {
        toast.success("Đã thêm khoản điều chỉnh")
        setAdjustmentOpen(false)
        setAdjustmentForm({
          adjustment_type_id: "",
          custom_amount: "",
          custom_percentage: "",
          effective_date: new Date().toISOString().split("T")[0],
          end_date: "",
          note: "",
        })
        // Reload data
        const empAdj = await listEmployeeAdjustments(employeeId)
        setEmployeeAdjustments(empAdj)
        router.refresh()
      } else {
        toast.error(result.error || "Không thể thêm khoản điều chỉnh")
      }
    } finally {
      setAdjustmentSaving(false)
    }
  }

  // Xử lý sửa khấu trừ/phụ cấp
  const handleEditAdjustment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAdjustment) return
    setAdjustmentSaving(true)

    try {
      const result = await updateEmployeeAdjustment(editingAdjustment.id, {
        custom_amount: adjustmentForm.custom_amount
          ? parseFloat(adjustmentForm.custom_amount.replace(/[^\d]/g, ""))
          : null,
        custom_percentage: adjustmentForm.custom_percentage
          ? parseFloat(adjustmentForm.custom_percentage.replace(/[^\d.,]/g, "").replace(",", "."))
          : null,
        effective_date: adjustmentForm.effective_date,
        end_date: adjustmentForm.end_date || null,
        note: adjustmentForm.note || null,
      })

      if (result.success) {
        toast.success("Đã cập nhật khoản điều chỉnh")
        setEditingAdjustment(null)
        setAdjustmentForm({
          adjustment_type_id: "",
          custom_amount: "",
          custom_percentage: "",
          effective_date: new Date().toISOString().split("T")[0],
          end_date: "",
          note: "",
        })
        // Reload data
        const empAdj = await listEmployeeAdjustments(employeeId)
        setEmployeeAdjustments(empAdj)
        router.refresh()
      } else {
        toast.error(result.error || "Không thể cập nhật khoản điều chỉnh")
      }
    } finally {
      setAdjustmentSaving(false)
    }
  }

  // Mở dialog sửa
  const openEditDialog = (adj: EmployeeAdjustmentWithType) => {
    setEditingAdjustment(adj)
    setAdjustmentForm({
      adjustment_type_id: adj.adjustment_type_id,
      custom_amount: adj.custom_amount ? formatInputCurrency(adj.custom_amount.toString()) : "",
      custom_percentage: adj.custom_percentage ? adj.custom_percentage.toString() : "",
      effective_date: adj.effective_date,
      end_date: adj.end_date || "",
      note: adj.note || "",
    })
  }

  // Xử lý xóa khấu trừ/phụ cấp
  const handleDeleteAdjustment = async () => {
    if (!deleteId) return

    try {
      const result = await removeEmployeeAdjustment(deleteId)
      if (result.success) {
        toast.success("Đã xóa khoản điều chỉnh")
        const empAdj = await listEmployeeAdjustments(employeeId)
        setEmployeeAdjustments(empAdj)
        router.refresh()
      } else {
        toast.error(result.error || "Không thể xóa")
      }
    } finally {
      setDeleteId(null)
    }
  }

  // Lấy thông tin loại điều chỉnh đã chọn
  const selectedAdjType = adjustmentTypes.find((t) => t.id === adjustmentForm.adjustment_type_id)

  // Helper để hiển thị category
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "allowance":
        return <Badge className="bg-green-100 text-green-700">Phụ cấp</Badge>
      case "deduction":
        return <Badge className="bg-orange-100 text-orange-700">Khấu trừ</Badge>
      case "penalty":
        return <Badge className="bg-red-100 text-red-700">Phạt</Badge>
      default:
        return <Badge>{category}</Badge>
    }
  }

  // Kiểm tra còn hiệu lực
  const isActive = (adj: EmployeeAdjustmentWithType) => {
    const today = new Date().toISOString().split("T")[0]
    if (adj.effective_date > today) return false
    if (adj.end_date && adj.end_date < today) return false
    return true
  }

  return (
    <div className="space-y-6">
      {/* Current Salary Card */}
      {currentSalary ? (
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Wallet className="h-4 w-4" />
                Lương hiện tại (từ {formatDateVN(currentSalary.effective_date)})
              </p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {formatCurrency(currentSalary.base_salary + currentSalary.allowance)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Lương cơ bản</p>
              <p className="font-medium">{formatCurrency(currentSalary.base_salary)}</p>
              <p className="text-sm text-muted-foreground mt-1">Phụ cấp</p>
              <p className="font-medium">{formatCurrency(currentSalary.allowance)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-amber-700">Chưa có thông tin lương. Vui lòng thêm mức lương cho nhân viên.</p>
        </div>
      )}

      {/* Add Salary Button */}
      {isHROrAdmin && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {currentSalary ? "Điều chỉnh lương" : "Thêm mức lương"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {currentSalary ? "Điều chỉnh lương" : "Thêm mức lương mới"}
                </DialogTitle>
                <DialogDescription>
                  Thêm mức lương mới sẽ có hiệu lực từ ngày được chọn
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="base_salary">Lương cơ bản (VND)</Label>
                  <Input
                    id="base_salary"
                    value={formData.base_salary}
                    onChange={(e) =>
                      setFormData({ ...formData, base_salary: formatInputCurrency(e.target.value) })
                    }
                    placeholder="15,000,000"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="allowance">Phụ cấp (VND)</Label>
                  <Input
                    id="allowance"
                    value={formData.allowance}
                    onChange={(e) =>
                      setFormData({ ...formData, allowance: formatInputCurrency(e.target.value) })
                    }
                    placeholder="2,000,000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="effective_date">Ngày hiệu lực</Label>
                  <Input
                    id="effective_date"
                    type="date"
                    value={formData.effective_date}
                    onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Input
                    id="note"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Lý do điều chỉnh..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Salary History */}
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Lịch sử lương
        </h4>
        {salaryHistory.length === 0 ? (
          <p className="text-muted-foreground text-sm">Chưa có lịch sử lương</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày hiệu lực</TableHead>
                <TableHead className="text-right">Lương cơ bản</TableHead>
                <TableHead className="text-right">Phụ cấp</TableHead>
                <TableHead className="text-right">Tổng</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaryHistory.map((record, index) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {formatDateVN(record.effective_date)}
                    {index === 0 && (
                      <Badge className="ml-2 bg-green-100 text-green-700">Hiện tại</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(record.base_salary)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(record.allowance)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(record.base_salary + record.allowance)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{record.note || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Khấu trừ / Phụ cấp thủ công */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Khấu trừ
          </h4>
          {isHROrAdmin && (
            <Dialog open={adjustmentOpen} onOpenChange={setAdjustmentOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleAddAdjustment}>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Thêm khấu trừ / phụ cấp
                    </DialogTitle>
                    <DialogDescription>
                      Gán khoản khấu trừ hoặc phụ cấp cho nhân viên này
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Loại điều chỉnh</Label>
                      <Select
                        value={adjustmentForm.adjustment_type_id}
                        onValueChange={(v) => setAdjustmentForm({ ...adjustmentForm, adjustment_type_id: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại..." />
                        </SelectTrigger>
                        <SelectContent>
                          {adjustmentTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center gap-2">
                                {getCategoryBadge(type.category)}
                                <span>{type.name}</span>
                                {type.amount > 0 && (
                                  <span className="text-muted-foreground text-xs">
                                    ({formatCurrency(type.amount)})
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedAdjType?.description && (
                        <p className="text-xs text-muted-foreground">{selectedAdjType.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Số tiền cố định (VND)</Label>
                        <Input
                          value={adjustmentForm.custom_amount}
                          onChange={(e) =>
                            setAdjustmentForm({ 
                              ...adjustmentForm, 
                              custom_amount: formatInputCurrency(e.target.value),
                              custom_percentage: "" // Clear percentage khi nhập số tiền
                            })
                          }
                          placeholder={selectedAdjType ? formatCurrency(selectedAdjType.amount) : "Số tiền..."}
                          disabled={!!adjustmentForm.custom_percentage}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Hoặc % lương cơ bản</Label>
                        <div className="relative">
                          <Input
                            value={adjustmentForm.custom_percentage}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^\d.,]/g, "")
                              setAdjustmentForm({ 
                                ...adjustmentForm, 
                                custom_percentage: val,
                                custom_amount: "" // Clear amount khi nhập %
                              })
                            }}
                            placeholder={selectedAdjType?.auto_rules?.percentage?.toString()}
                            disabled={!!adjustmentForm.custom_amount}
                            className="pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {adjustmentForm.custom_percentage 
                        ? `Sẽ tính ${adjustmentForm.custom_percentage}% lương cơ bản mỗi tháng`
                        : adjustmentForm.custom_amount
                        ? `Số tiền cố định: ${adjustmentForm.custom_amount} VND/tháng`
                        : selectedAdjType?.auto_rules?.percentage
                        ? `Mặc định: ${selectedAdjType.auto_rules.percentage}% lương cơ bản`
                        : "Để trống để dùng giá trị mặc định của loại điều chỉnh"
                      }
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Ngày bắt đầu</Label>
                        <Input
                          type="date"
                          value={adjustmentForm.effective_date}
                          onChange={(e) => setAdjustmentForm({ ...adjustmentForm, effective_date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Ngày kết thúc (tùy chọn)</Label>
                        <Input
                          type="date"
                          value={adjustmentForm.end_date}
                          onChange={(e) => setAdjustmentForm({ ...adjustmentForm, end_date: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Ghi chú</Label>
                      <Input
                        value={adjustmentForm.note}
                        onChange={(e) => setAdjustmentForm({ ...adjustmentForm, note: e.target.value })}
                        placeholder="Lý do áp dụng..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setAdjustmentOpen(false)}>
                      Hủy
                    </Button>
                    <Button type="submit" disabled={adjustmentSaving || !adjustmentForm.adjustment_type_id}>
                      {adjustmentSaving ? "Đang lưu..." : "Thêm"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {employeeAdjustments.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Chưa có khoản khấu trừ/phụ cấp nào được gán cho nhân viên này.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead>Hiệu lực</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
                {isHROrAdmin && <TableHead className="w-[50px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeAdjustments.map((adj) => (
                <TableRow key={adj.id} className={!isActive(adj) ? "opacity-50" : ""}>
                  <TableCell>{adj.adjustment_type && getCategoryBadge(adj.adjustment_type.category)}</TableCell>
                  <TableCell className="font-medium">{adj.adjustment_type?.name || "-"}</TableCell>
                  <TableCell className="text-right">
                    {adj.custom_percentage
                      ? `${adj.custom_percentage}% lương`
                      : adj.custom_amount
                      ? formatCurrency(adj.custom_amount)
                      : adj.adjustment_type?.auto_rules?.percentage
                      ? `${adj.adjustment_type.auto_rules.percentage}% lương`
                      : formatCurrency(adj.adjustment_type?.amount || 0)}
                  </TableCell>
                  <TableCell>
                    {formatDateVN(adj.effective_date)}
                    {adj.end_date && ` - ${formatDateVN(adj.end_date)}`}
                  </TableCell>
                  <TableCell>
                    {isActive(adj) ? (
                      <Badge className="bg-green-100 text-green-700">Đang áp dụng</Badge>
                    ) : (
                      <Badge variant="secondary">Hết hiệu lực</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{adj.note || "-"}</TableCell>
                  {isHROrAdmin && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(adj)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(adj.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Alert Dialog xác nhận xóa */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa khoản điều chỉnh này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAdjustment} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog sửa khấu trừ/phụ cấp */}
      <Dialog open={!!editingAdjustment} onOpenChange={(open) => !open && setEditingAdjustment(null)}>
        <DialogContent>
          <form onSubmit={handleEditAdjustment}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-5 w-5" />
                Sửa khấu trừ / phụ cấp
              </DialogTitle>
              <DialogDescription>
                {editingAdjustment?.adjustment_type?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Số tiền cố định (VND)</Label>
                  <Input
                    value={adjustmentForm.custom_amount}
                    onChange={(e) =>
                      setAdjustmentForm({ 
                        ...adjustmentForm, 
                        custom_amount: formatInputCurrency(e.target.value),
                        custom_percentage: ""
                      })
                    }
                    placeholder="Số tiền..."
                    disabled={!!adjustmentForm.custom_percentage}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Hoặc % lương cơ bản</Label>
                  <div className="relative">
                    <Input
                      value={adjustmentForm.custom_percentage}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d.,]/g, "")
                        setAdjustmentForm({ 
                          ...adjustmentForm, 
                          custom_percentage: val,
                          custom_amount: ""
                        })
                      }}
                      placeholder="%"
                      disabled={!!adjustmentForm.custom_amount}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Ngày bắt đầu</Label>
                  <Input
                    type="date"
                    value={adjustmentForm.effective_date}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, effective_date: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Ngày kết thúc (tùy chọn)</Label>
                  <Input
                    type="date"
                    value={adjustmentForm.end_date}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Ghi chú</Label>
                <Input
                  value={adjustmentForm.note}
                  onChange={(e) => setAdjustmentForm({ ...adjustmentForm, note: e.target.value })}
                  placeholder="Lý do áp dụng..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingAdjustment(null)}>
                Hủy
              </Button>
              <Button type="submit" disabled={adjustmentSaving}>
                {adjustmentSaving ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
