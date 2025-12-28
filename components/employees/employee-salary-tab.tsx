"use client"

import { useState } from "react"
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
import { toast } from "sonner"
import { Plus, Wallet, TrendingUp } from "lucide-react"
import { createSalaryStructure } from "@/lib/actions/payroll-actions"
import { formatCurrency } from "@/lib/utils/format-utils"
import { formatDateVN } from "@/lib/utils/date-utils"
import type { SalaryStructure } from "@/lib/types/database"

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

  const currentSalary = salaryHistory[0] // Lương hiện tại (mới nhất)

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
    </div>
  )
}
