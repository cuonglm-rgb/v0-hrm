"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { generatePayroll, deletePayrollRun } from "@/lib/actions/payroll-actions"
import type { PayrollRun } from "@/lib/types/database"
import { formatDateVN } from "@/lib/utils/date-utils"
import { Plus, Eye, Trash2, Calculator, Wallet } from "lucide-react"

interface PayrollListPanelProps {
  payrollRuns: PayrollRun[]
}

const months = [
  { value: "1", label: "Tháng 1" },
  { value: "2", label: "Tháng 2" },
  { value: "3", label: "Tháng 3" },
  { value: "4", label: "Tháng 4" },
  { value: "5", label: "Tháng 5" },
  { value: "6", label: "Tháng 6" },
  { value: "7", label: "Tháng 7" },
  { value: "8", label: "Tháng 8" },
  { value: "9", label: "Tháng 9" },
  { value: "10", label: "Tháng 10" },
  { value: "11", label: "Tháng 11" },
  { value: "12", label: "Tháng 12" },
]

export function PayrollListPanel({ payrollRuns }: PayrollListPanelProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())

  const handleGenerate = async () => {
    if (!selectedMonth || !selectedYear) {
      setError("Vui lòng chọn tháng và năm")
      return
    }

    setLoading(true)
    setError(null)

    const result = await generatePayroll(parseInt(selectedMonth), parseInt(selectedYear))

    if (!result.success) {
      setError(result.error || "Không thể tạo bảng lương")
    } else {
      setOpen(false)
      setSelectedMonth("")
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bảng lương này?")) return
    await deletePayrollRun(id)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "locked":
        return <Badge className="bg-blue-100 text-blue-800">🔒 Đã khóa</Badge>
      case "paid":
        return <Badge className="bg-green-100 text-green-800">✅ Đã trả</Badge>
      default:
        return <Badge variant="secondary">📝 Nháp</Badge>
    }
  }

  // Stats
  const draftCount = payrollRuns.filter((r) => r.status === "draft").length
  const lockedCount = payrollRuns.filter((r) => r.status === "locked").length
  const paidCount = payrollRuns.filter((r) => r.status === "paid").length

  return (
    <div className="space-y-6">
      {/* Thống kê */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Nháp</span>
            </div>
            <p className="text-2xl font-bold mt-1">{draftCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-400" />
              <span className="text-sm text-muted-foreground">Đã khóa</span>
            </div>
            <p className="text-2xl font-bold mt-1">{lockedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="text-sm text-muted-foreground">Đã trả</span>
            </div>
            <p className="text-2xl font-bold mt-1">{paidCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Nút tạo bảng lương */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tạo bảng lương
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo bảng lương mới</DialogTitle>
            <DialogDescription>
              Chọn tháng và năm để tính lương cho tất cả nhân viên
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Tháng</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tháng" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Năm</Label>
                <Input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  min={2020}
                  max={2100}
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? "Đang tính..." : "Tạo bảng lương"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Danh sách bảng lương */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Danh sách bảng lương
          </CardTitle>
          <CardDescription>Các đợt tính lương đã tạo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kỳ lương</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollRuns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Chưa có bảng lương nào
                  </TableCell>
                </TableRow>
              ) : (
                payrollRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">
                      Tháng {run.month}/{run.year}
                    </TableCell>
                    <TableCell>{getStatusBadge(run.status)}</TableCell>
                    <TableCell>{formatDateVN(run.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/payroll/${run.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Xem
                          </Link>
                        </Button>
                        {run.status === "draft" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(run.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
