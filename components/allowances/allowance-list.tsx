"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Coins, Plus, Pencil, Trash2, AlertTriangle, Wallet, Ban, Users } from "lucide-react"
import { toast } from "sonner"
import {
  createAdjustmentType,
  updateAdjustmentType,
  deleteAdjustmentType,
} from "@/lib/actions/allowance-actions"
import { formatCurrency } from "@/lib/utils/format-utils"
import type {
  PayrollAdjustmentType,
  AdjustmentAutoRules,
  AdjustmentCategory,
  ExemptRequestType,
  RequestType,
  PenaltyCondition,
  EmployeeWithRelations,
} from "@/lib/types/database"
import { listRequestTypes } from "@/lib/actions/request-type-actions"
import { listEmployees } from "@/lib/actions/employee-actions"
import { EmployeeMultiSelect } from "@/components/ui/employee-multi-select"

interface AllowanceListProps {
  adjustments: PayrollAdjustmentType[]
  isHROrAdmin: boolean
}

const categoryConfig: Record<
  AdjustmentCategory,
  { label: string; icon: React.ReactNode; color: string }
> = {
  allowance: { label: "Phụ cấp", icon: <Coins className="h-4 w-4" />, color: "bg-green-100 text-green-700" },
  deduction: { label: "Khấu trừ", icon: <Wallet className="h-4 w-4" />, color: "bg-blue-100 text-blue-700" },
  penalty: { label: "Phạt", icon: <Ban className="h-4 w-4" />, color: "bg-red-100 text-red-700" },
}

const defaultAutoRules: AdjustmentAutoRules = {
  trigger: "attendance",
  deduct_on_absent: true,
  deduct_on_late: true,
  late_grace_count: 4,
  late_threshold_minutes: 15,
}

export function AllowanceList({ adjustments, isHROrAdmin }: AllowanceListProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PayrollAdjustmentType | null>(null)
  const [deleting, setDeleting] = useState<PayrollAdjustmentType | null>(null)
  const [saving, setSaving] = useState(false)
  const [requestTypes, setRequestTypes] = useState<RequestType[]>([])
  
  // Danh sách nhân viên để chọn
  const [employees, setEmployees] = useState<EmployeeWithRelations[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "allowance" as AdjustmentCategory,
    amount: "",
    calculation_type: "fixed" as "fixed" | "daily" | "per_occurrence" | "percentage",
    is_auto_applied: false,
    description: "",
    auto_rules: { ...defaultAutoRules },
    apply_to_selected_employees: false, // Mới: toggle chọn nhân viên cụ thể
    selected_employee_ids: [] as string[], // Mới: danh sách ID nhân viên được chọn
  })

  // Load danh sách loại phiếu từ database
  useEffect(() => {
    const loadRequestTypes = async () => {
      const types = await listRequestTypes(true)
      setRequestTypes(types)
    }
    loadRequestTypes()
  }, [])
  
  // Load danh sách nhân viên khi cần
  useEffect(() => {
    if (formData.is_auto_applied && formData.apply_to_selected_employees && employees.length === 0) {
      setLoadingEmployees(true)
      listEmployees()
        .then(setEmployees)
        .finally(() => setLoadingEmployees(false))
    }
  }, [formData.is_auto_applied, formData.apply_to_selected_employees, employees.length])

  const allowances = adjustments.filter((a) => a.category === "allowance")
  const deductions = adjustments.filter((a) => a.category === "deduction")
  const penalties = adjustments.filter((a) => a.category === "penalty")

  const handleOpenCreate = (category: AdjustmentCategory) => {
    setEditing(null)
    setFormData({
      name: "",
      code: "",
      category,
      amount: "",
      calculation_type: category === "penalty" ? "per_occurrence" : "fixed",
      is_auto_applied: false,
      description: "",
      auto_rules: { ...defaultAutoRules },
      apply_to_selected_employees: false,
      selected_employee_ids: [],
    })
    setOpen(true)
  }

  const handleOpenEdit = (item: PayrollAdjustmentType) => {
    setEditing(item)
    const rules = (item.auto_rules as AdjustmentAutoRules) || { ...defaultAutoRules }
    
    // Lấy danh sách employee_ids từ assigned_employees
    const assignedIds = (item as any).assigned_employees?.map((ae: any) => ae.employee_id) || []
    
    setFormData({
      name: item.name,
      code: item.code || "",
      category: item.category,
      amount: item.calculation_type === "percentage" 
        ? item.amount.toString() 
        : formatInputCurrency(item.amount.toString()),
      calculation_type: item.calculation_type,
      is_auto_applied: item.is_auto_applied,
      description: item.description || "",
      auto_rules: {
        ...defaultAutoRules,
        ...rules,
        calculate_from: rules.calculate_from || "base_salary", // Đảm bảo có giá trị mặc định
      },
      apply_to_selected_employees: assignedIds.length > 0,
      selected_employee_ids: assignedIds,
    })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Tên là bắt buộc")
      return
    }

    // Validate: Nếu chọn áp dụng cho nhân viên cụ thể thì phải chọn ít nhất 1 nhân viên
    if (formData.is_auto_applied && formData.apply_to_selected_employees && formData.selected_employee_ids.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 nhân viên")
      return
    }

    setSaving(true)
    try {
      // Tự động set trigger dựa trên penalty_conditions
      let autoRules = formData.auto_rules
      if (formData.is_auto_applied && formData.category === "penalty" && formData.auto_rules.penalty_conditions) {
        const conditions = formData.auto_rules.penalty_conditions
        const hasLateOrEarly = conditions.includes("late_arrival") || conditions.includes("early_leave")
        const hasForgot = conditions.includes("forgot_checkin") || conditions.includes("forgot_checkout")
        
        // Ưu tiên "attendance" nếu có điều kiện quên chấm công
        // Nếu chỉ có đi muộn/về sớm thì dùng "late"
        if (hasForgot) {
          autoRules = { ...autoRules, trigger: "attendance" }
        } else if (hasLateOrEarly) {
          autoRules = { ...autoRules, trigger: "late" }
        }
      }

      // Đảm bảo calculate_from được set cho percentage type
      if (formData.calculation_type === "percentage") {
        autoRules = {
          ...autoRules,
          calculate_from: formData.auto_rules.calculate_from || "base_salary"
        }
      }

      // Nếu không áp dụng cho nhân viên cụ thể, gửi mảng rỗng (= toàn công ty)
      const employeeIds = formData.is_auto_applied && formData.apply_to_selected_employees
        ? formData.selected_employee_ids
        : []

      const data = {
        name: formData.name,
        code: formData.code || undefined,
        category: formData.category,
        amount: formData.calculation_type === "percentage" 
          ? parseFloat(formData.amount) || 0
          : parseFloat(formData.amount.replace(/[^\d]/g, "")) || 0,
        calculation_type: formData.calculation_type,
        is_auto_applied: formData.is_auto_applied,
        description: formData.description || undefined,
        auto_rules: formData.is_auto_applied || formData.calculation_type === "percentage" 
          ? autoRules 
          : undefined,
        employee_ids: employeeIds,
      }

      if (editing) {
        const result = await updateAdjustmentType(editing.id, data)
        if (result.success) {
          toast.success("Đã cập nhật")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createAdjustmentType(data)
        if (result.success) {
          toast.success("Đã tạo mới")
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
    const result = await deleteAdjustmentType(deleting.id)
    if (result.success) {
      toast.success("Đã xóa")
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

  const renderTable = (items: PayrollAdjustmentType[], category: AdjustmentCategory) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {categoryConfig[category].icon}
          {categoryConfig[category].label} ({items.length})
        </CardTitle>
        {isHROrAdmin && (
          <Button size="sm" onClick={() => handleOpenCreate(category)}>
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
              <TableHead className="text-right">Số tiền</TableHead>
              <TableHead>Cách tính</TableHead>
              <TableHead>Tự động</TableHead>
              <TableHead>Phạm vi</TableHead>
              <TableHead>Trạng thái</TableHead>
              {isHROrAdmin && <TableHead className="text-right">Thao tác</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isHROrAdmin ? 8 : 7} className="text-center py-6 text-muted-foreground">
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const assignedEmployees = (item as any).assigned_employees || []
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{item.name}</span>
                        {item.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.code ? (
                        <code className="text-xs bg-muted px-2 py-1 rounded">{item.code}</code>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.amount > 0 ? (
                        <>
                          {item.calculation_type === "percentage" ? (
                            <>{item.amount}%</>
                          ) : (
                            formatCurrency(item.amount)
                          )}
                          {item.calculation_type === "daily" && (
                            <span className="text-xs text-muted-foreground">/ngày</span>
                          )}
                          {item.calculation_type === "per_occurrence" && (
                            <span className="text-xs text-muted-foreground">/lần</span>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground">Theo công thức</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {item.calculation_type === "fixed"
                          ? "Cố định"
                          : item.calculation_type === "daily"
                          ? "Theo ngày"
                          : item.calculation_type === "percentage"
                          ? "% lương"
                          : "Theo lần"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.is_auto_applied ? (
                        <Badge className="bg-amber-100 text-amber-700 text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Tự động
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Thủ công</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.is_auto_applied ? (
                        assignedEmployees.length > 0 ? (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 gap-1">
                            <Users className="h-3 w-3" />
                            {assignedEmployees.length} NV
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            Toàn công ty
                          </Badge>
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
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
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="allowance">
        <TabsList>
          <TabsTrigger value="allowance" className="gap-2">
            <Coins className="h-4 w-4" />
            Phụ cấp ({allowances.length})
          </TabsTrigger>
          <TabsTrigger value="deduction" className="gap-2">
            <Wallet className="h-4 w-4" />
            Khấu trừ ({deductions.length})
          </TabsTrigger>
          <TabsTrigger value="penalty" className="gap-2">
            <Ban className="h-4 w-4" />
            Phạt ({penalties.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="allowance" className="mt-4">
          {renderTable(allowances, "allowance")}
        </TabsContent>
        <TabsContent value="deduction" className="mt-4">
          {renderTable(deductions, "deduction")}
        </TabsContent>
        <TabsContent value="penalty" className="mt-4">
          {renderTable(penalties, "penalty")}
        </TabsContent>
      </Tabs>

      {/* Dialog thêm/sửa */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Sửa" : "Thêm"} {categoryConfig[formData.category].label.toLowerCase()}
            </DialogTitle>
            <DialogDescription>
              {editing ? "Cập nhật thông tin" : "Tạo mới"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên *</Label>
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

            {/* Hiển thị field Số tiền hoặc % tùy theo calculation_type */}
            {formData.calculation_type === "percentage" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="amount">Phần trăm lương (%)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="8"
                  />
                  <p className="text-xs text-muted-foreground">
                    VD: 8 = 8% lương
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Tính từ</Label>
                  <Select
                    value={formData.auto_rules.calculate_from || "base_salary"}
                    onValueChange={(v: "base_salary" | "insurance_salary") =>
                      setFormData({
                        ...formData,
                        auto_rules: { ...formData.auto_rules, calculate_from: v },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base_salary">Lương cơ bản</SelectItem>
                      <SelectItem value="insurance_salary">Lương BHXH</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Chọn loại lương để tính %
                  </p>
                </div>
              </>
            ) : (formData.category !== "penalty" || formData.auto_rules.penalty_type === "fixed_amount") && (
              <div className="space-y-2">
                <Label htmlFor="amount">
                  Số tiền (VND)
                  {formData.category === "penalty" && formData.auto_rules.penalty_type === "fixed_amount" && " *"}
                </Label>
                <Input
                  id="amount"
                  value={formData.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, amount: formatInputCurrency(e.target.value) })
                  }
                  placeholder="35,000"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.category === "penalty" && formData.auto_rules.penalty_type === "fixed_amount"
                    ? "Số tiền phạt cố định cho mỗi lần vi phạm"
                    : "Để trống nếu tính theo công thức"}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Cách tính</Label>
              <Select
                value={formData.calculation_type}
                onValueChange={(v: "fixed" | "daily" | "per_occurrence" | "percentage") =>
                  setFormData({ ...formData, calculation_type: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Cố định/tháng</SelectItem>
                  <SelectItem value="daily">Theo ngày công</SelectItem>
                  <SelectItem value="per_occurrence">Theo lần vi phạm</SelectItem>
                  <SelectItem value="percentage">Theo % lương</SelectItem>
                </SelectContent>
              </Select>
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

            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <Label htmlFor="is_auto" className="text-amber-800">
                  Tự động áp dụng
                </Label>
              </div>
              <Switch
                id="is_auto"
                checked={formData.is_auto_applied}
                onCheckedChange={(v: boolean) => setFormData({ ...formData, is_auto_applied: v })}
              />
            </div>

            {formData.is_auto_applied && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium">Quy tắc tự động</h4>
                
                {/* Phần chọn phạm vi áp dụng */}
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

                {formData.category === "allowance" && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label>Trừ khi nghỉ làm</Label>
                      <Switch
                        checked={formData.auto_rules.deduct_on_absent}
                        onCheckedChange={(v: boolean) =>
                          setFormData({
                            ...formData,
                            auto_rules: { ...formData.auto_rules, deduct_on_absent: v },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Trừ khi đi muộn</Label>
                      <Switch
                        checked={formData.auto_rules.deduct_on_late}
                        onCheckedChange={(v: boolean) =>
                          setFormData({
                            ...formData,
                            auto_rules: { ...formData.auto_rules, deduct_on_late: v },
                          })
                        }
                      />
                    </div>
                    {formData.auto_rules.deduct_on_late && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Số lần miễn trừ</Label>
                          <Input
                            type="number"
                            min={0}
                            value={formData.auto_rules.late_grace_count || 0}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                auto_rules: {
                                  ...formData.auto_rules,
                                  late_grace_count: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Muộn từ (phút)</Label>
                          <Input
                            type="number"
                            min={0}
                            value={formData.auto_rules.late_threshold_minutes ?? 15}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                auto_rules: {
                                  ...formData.auto_rules,
                                  late_threshold_minutes: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Miễn trừ nếu có phiếu xin phép */}
                    <div className="flex items-center justify-between">
                      <Label>Miễn trừ nếu có phiếu xin phép</Label>
                      <Switch
                        checked={formData.auto_rules.exempt_with_request}
                        onCheckedChange={(v: boolean) =>
                          setFormData({
                            ...formData,
                            auto_rules: { 
                              ...formData.auto_rules, 
                              exempt_with_request: v,
                              exempt_request_types: v ? (formData.auto_rules.exempt_request_types || []) : undefined,
                            },
                          })
                        }
                      />
                    </div>
                    {formData.auto_rules.exempt_with_request && (
                      <div className="space-y-2 pl-4 border-l-2 border-green-300">
                        <Label className="text-sm">Loại phiếu được miễn:</Label>
                        <p className="text-xs text-muted-foreground">
                          Nếu nhân viên có phiếu được duyệt trong ngày, sẽ không bị trừ phụ cấp
                        </p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {requestTypes.map((rt) => (
                            <div key={rt.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`allowance_exempt_${rt.code}`}
                                checked={formData.auto_rules.exempt_request_types?.includes(rt.code as ExemptRequestType) ?? false}
                                onChange={(e) => {
                                  const types = formData.auto_rules.exempt_request_types || []
                                  const newTypes: ExemptRequestType[] = e.target.checked
                                    ? [...types.filter(t => t !== rt.code), rt.code as ExemptRequestType]
                                    : types.filter(t => t !== rt.code)
                                  setFormData({
                                    ...formData,
                                    auto_rules: { ...formData.auto_rules, exempt_request_types: newTypes },
                                  })
                                }}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <Label htmlFor={`allowance_exempt_${rt.code}`} className="text-sm font-normal">{rt.name}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {formData.category === "penalty" && (
                  <>
                    <div className="space-y-2">
                      <Label>Điều kiện phạt</Label>
                      <div className="space-y-2 p-3 bg-background rounded-md border">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="penalty_late_arrival"
                            checked={formData.auto_rules.penalty_conditions?.includes("late_arrival") ?? false}
                            onChange={(e) => {
                              const conditions = formData.auto_rules.penalty_conditions || []
                              const newConditions: PenaltyCondition[] = e.target.checked
                                ? [...conditions, "late_arrival"]
                                : conditions.filter(c => c !== "late_arrival")
                              setFormData({
                                ...formData,
                                auto_rules: { ...formData.auto_rules, penalty_conditions: newConditions },
                              })
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="penalty_late_arrival" className="text-sm font-normal">Đi làm muộn</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="penalty_early_leave"
                            checked={formData.auto_rules.penalty_conditions?.includes("early_leave") ?? false}
                            onChange={(e) => {
                              const conditions = formData.auto_rules.penalty_conditions || []
                              const newConditions: PenaltyCondition[] = e.target.checked
                                ? [...conditions, "early_leave"]
                                : conditions.filter(c => c !== "early_leave")
                              setFormData({
                                ...formData,
                                auto_rules: { ...formData.auto_rules, penalty_conditions: newConditions },
                              })
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="penalty_early_leave" className="text-sm font-normal">Đi về sớm</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="penalty_forgot_checkin"
                            checked={formData.auto_rules.penalty_conditions?.includes("forgot_checkin") ?? false}
                            onChange={(e) => {
                              const conditions = formData.auto_rules.penalty_conditions || []
                              const newConditions: PenaltyCondition[] = e.target.checked
                                ? [...conditions, "forgot_checkin"]
                                : conditions.filter(c => c !== "forgot_checkin")
                              setFormData({
                                ...formData,
                                auto_rules: { ...formData.auto_rules, penalty_conditions: newConditions },
                              })
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="penalty_forgot_checkin" className="text-sm font-normal">Quên chấm công đến</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="penalty_forgot_checkout"
                            checked={formData.auto_rules.penalty_conditions?.includes("forgot_checkout") ?? false}
                            onChange={(e) => {
                              const conditions = formData.auto_rules.penalty_conditions || []
                              const newConditions: PenaltyCondition[] = e.target.checked
                                ? [...conditions, "forgot_checkout"]
                                : conditions.filter(c => c !== "forgot_checkout")
                              setFormData({
                                ...formData,
                                auto_rules: { ...formData.auto_rules, penalty_conditions: newConditions },
                              })
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="penalty_forgot_checkout" className="text-sm font-normal">Quên chấm công về</Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Muộn từ (phút)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={formData.auto_rules.late_threshold_minutes ?? 30}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            auto_rules: {
                              ...formData.auto_rules,
                              late_threshold_minutes: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">Áp dụng cho điều kiện đi muộn/về sớm. Nhập 0 để tính từ phút đầu tiên.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Loại phạt</Label>
                      <Select
                        value={formData.auto_rules.penalty_type || "half_day_salary"}
                        onValueChange={(v) =>
                          setFormData({
                            ...formData,
                            auto_rules: {
                              ...formData.auto_rules,
                              penalty_type: v as "half_day_salary" | "full_day_salary" | "fixed_amount",
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="half_day_salary">Nửa ngày lương</SelectItem>
                          <SelectItem value="full_day_salary">Một ngày lương</SelectItem>
                          <SelectItem value="fixed_amount">Số tiền cố định</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Chỉ hiển thị field Số tiền khi chọn "Số tiền cố định" */}
                    {formData.auto_rules.penalty_type === "fixed_amount" && (
                      <div className="space-y-2 pl-4 border-l-2 border-blue-300">
                        <Label htmlFor="penalty_amount">Số tiền phạt (VND) *</Label>
                        <Input
                          id="penalty_amount"
                          value={formData.amount}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, amount: formatInputCurrency(e.target.value) })
                          }
                          placeholder="50,000"
                        />
                        <p className="text-xs text-muted-foreground">Số tiền phạt cố định cho mỗi lần vi phạm</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Label>Miễn nếu có phiếu xin phép</Label>
                      <Switch
                        checked={formData.auto_rules.exempt_with_request}
                        onCheckedChange={(v: boolean) =>
                          setFormData({
                            ...formData,
                            auto_rules: { 
                              ...formData.auto_rules, 
                              exempt_with_request: v,
                              exempt_request_types: v ? (formData.auto_rules.exempt_request_types || []) : undefined,
                            },
                          })
                        }
                      />
                    </div>
                    {formData.auto_rules.exempt_with_request && (
                      <div className="space-y-2 pl-4 border-l-2 border-amber-300">
                        <Label className="text-sm">Loại phiếu được miễn:</Label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {requestTypes.map((rt) => (
                            <div key={rt.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`exempt_${rt.code}`}
                                checked={formData.auto_rules.exempt_request_types?.includes(rt.code as ExemptRequestType) ?? false}
                                onChange={(e) => {
                                  const types = formData.auto_rules.exempt_request_types || []
                                  const newTypes: ExemptRequestType[] = e.target.checked
                                    ? [...types.filter(t => t !== rt.code), rt.code as ExemptRequestType]
                                    : types.filter(t => t !== rt.code)
                                  setFormData({
                                    ...formData,
                                    auto_rules: { ...formData.auto_rules, exempt_request_types: newTypes },
                                  })
                                }}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <Label htmlFor={`exempt_${rt.code}`} className="text-sm font-normal">{rt.name}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa "{deleting?.name}"?
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
