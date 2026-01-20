"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Target, Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils/format-utils"
import { 
  listKPIEvaluations, 
  saveKPIEvaluation, 
  deleteKPIEvaluation,
  getEmployeesWithoutKPI 
} from "@/lib/actions/kpi-actions"
import type { KPIEvaluationWithRelations, KPIStatus, KPIBonusType } from "@/lib/types/database"

interface Employee {
  id: string
  full_name: string
  employee_code: string | null
  department?: { name: string } | null
}

export function KPIEvaluationPanel() {
  const currentDate = new Date()
  const [month, setMonth] = useState(currentDate.getMonth() + 1)
  const [year, setYear] = useState(currentDate.getFullYear())
  const [evaluations, setEvaluations] = useState<KPIEvaluationWithRelations[]>([])
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvaluation, setEditingEvaluation] = useState<KPIEvaluationWithRelations | null>(null)

  // Form state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
  const [status, setStatus] = useState<KPIStatus>("achieved")
  const [bonusType, setBonusType] = useState<KPIBonusType>("percentage")
  const [bonusPercentage, setBonusPercentage] = useState<string>("")
  const [bonusAmount, setBonusAmount] = useState<string>("")
  const [note, setNote] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [evals, employees] = await Promise.all([
        listKPIEvaluations(month, year),
        getEmployeesWithoutKPI(month, year)
      ])
      setEvaluations(evals)
      // Transform employees data to match Employee interface
      const transformedEmployees = (employees as any[]).map(emp => ({
        id: emp.id,
        full_name: emp.full_name,
        employee_code: emp.employee_code,
        department: emp.department || null
      }))
      setAvailableEmployees(transformedEmployees)
    } catch (error) {
      console.error("Error loading KPI data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [month, year])


  const resetForm = () => {
    setSelectedEmployeeId("")
    setStatus("achieved")
    setBonusType("percentage")
    setBonusPercentage("")
    setBonusAmount("")
    setNote("")
    setEditingEvaluation(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (evaluation: KPIEvaluationWithRelations) => {
    setEditingEvaluation(evaluation)
    setSelectedEmployeeId(evaluation.employee_id)
    setStatus(evaluation.status)
    setBonusType(evaluation.bonus_type)
    setBonusPercentage(evaluation.bonus_percentage?.toString() || "")
    setBonusAmount(evaluation.bonus_amount?.toString() || "")
    setNote(evaluation.note || "")
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!editingEvaluation && !selectedEmployeeId) {
      alert("Vui lòng chọn nhân viên")
      return
    }

    setIsSaving(true)
    try {
      const result = await saveKPIEvaluation({
        employeeId: editingEvaluation?.employee_id || selectedEmployeeId,
        month,
        year,
        status,
        bonusType,
        bonusPercentage: bonusPercentage ? parseFloat(bonusPercentage) : null,
        bonusAmount: bonusAmount ? parseFloat(bonusAmount) : null,
        note: note || null,
      })

      if (result.success) {
        setIsDialogOpen(false)
        resetForm()
        loadData()
      } else {
        alert(result.error || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error saving KPI:", error)
      alert("Có lỗi xảy ra")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa đánh giá KPI này?")) return

    try {
      const result = await deleteKPIEvaluation(id)
      if (result.success) {
        loadData()
      } else {
        alert(result.error || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error deleting KPI:", error)
    }
  }

  const getStatusBadge = (status: KPIStatus) => {
    if (status === "achieved") {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Đạt KPI
        </Badge>
      )
    }
    return (
      <Badge className="bg-red-100 text-red-800">
        <XCircle className="h-3 w-3 mr-1" />
        Không đạt
      </Badge>
    )
  }

  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Đánh giá KPI nhân viên
              </CardTitle>
              <CardDescription>
                Đánh giá KPI và mức thưởng cho nhân viên theo tháng
              </CardDescription>
            </div>
            <Button onClick={openAddDialog} disabled={availableEmployees.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm đánh giá
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bộ lọc tháng/năm */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Label>Tháng:</Label>
              <Select value={month.toString()} onValueChange={(v: string) => setMonth(parseInt(v))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m} value={m.toString()}>
                      Tháng {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label>Năm:</Label>
              <Select value={year.toString()} onValueChange={(v: string) => setYear(parseInt(v))}>
                <SelectTrigger className="w-24">
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
            </div>
          </div>

          {/* Bảng đánh giá */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Loại thưởng</TableHead>
                <TableHead className="text-right">Mức thưởng</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : evaluations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Chưa có đánh giá KPI nào trong tháng {month}/{year}
                  </TableCell>
                </TableRow>
              ) : (
                evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{evaluation.employee?.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          NV{evaluation.employee?.employee_code}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {(evaluation.employee as any)?.department?.name || "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                    <TableCell>
                      {evaluation.bonus_type === "percentage" ? (
                        <span>{evaluation.bonus_percentage}% lương</span>
                      ) : (
                        <span>Số tiền cố định</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {evaluation.final_bonus > 0 ? formatCurrency(evaluation.final_bonus) : "-"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {evaluation.note || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(evaluation)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(evaluation.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Thống kê */}
          {evaluations.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Tổng đánh giá</p>
                <p className="text-2xl font-bold">{evaluations.length}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Đạt KPI</p>
                <p className="text-2xl font-bold text-green-600">
                  {evaluations.filter((e) => e.status === "achieved").length}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Tổng thưởng</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(evaluations.reduce((sum, e) => sum + e.final_bonus, 0))}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>


      {/* Dialog thêm/sửa đánh giá */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEvaluation ? "Sửa đánh giá KPI" : "Thêm đánh giá KPI"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Chọn nhân viên (chỉ khi thêm mới) */}
            {!editingEvaluation && (
              <div className="space-y-2">
                <Label>Nhân viên</Label>
                <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.full_name} - NV{emp.employee_code}
                        {emp.department?.name && ` (${emp.department.name})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {editingEvaluation && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{editingEvaluation.employee?.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  NV{editingEvaluation.employee?.employee_code}
                </p>
              </div>
            )}

            {/* Trạng thái KPI */}
            <div className="space-y-2">
              <Label>Trạng thái KPI</Label>
              <RadioGroup
                value={status}
                onValueChange={(v) => setStatus(v as KPIStatus)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="achieved" id="achieved" />
                  <Label htmlFor="achieved" className="text-green-600 cursor-pointer">
                    ✅ Đạt KPI
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not_achieved" id="not_achieved" />
                  <Label htmlFor="not_achieved" className="text-red-600 cursor-pointer">
                    ❌ Không đạt
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Mức thưởng (chỉ hiện khi đạt KPI) */}
            {status === "achieved" && (
              <>
                <div className="space-y-2">
                  <Label>Loại thưởng</Label>
                  <RadioGroup
                    value={bonusType}
                    onValueChange={(v) => setBonusType(v as KPIBonusType)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percentage" id="percentage" />
                      <Label htmlFor="percentage" className="cursor-pointer">
                        % Lương tháng
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed" className="cursor-pointer">
                        Số tiền cố định
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {bonusType === "percentage" ? (
                  <div className="space-y-2">
                    <Label>Phần trăm thưởng (%)</Label>
                    <Input
                      type="number"
                      placeholder="VD: 10"
                      value={bonusPercentage}
                      onChange={(e) => setBonusPercentage(e.target.value)}
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-muted-foreground">
                      Thưởng = Lương cơ bản × {bonusPercentage || 0}%
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Số tiền thưởng (VNĐ)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="VD: 4,000,000"
                      value={bonusAmount ? Number(bonusAmount).toLocaleString('vi-VN') : ''}
                      onChange={(e) => {
                        // Loại bỏ tất cả ký tự không phải số
                        const rawValue = e.target.value.replace(/[^\d]/g, '')
                        setBonusAmount(rawValue)
                      }}
                    />
                  </div>
                )}
              </>
            )}

            {/* Ghi chú */}
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                placeholder="Nhận xét về hiệu suất làm việc..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Đang lưu..." : "Lưu đánh giá"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
