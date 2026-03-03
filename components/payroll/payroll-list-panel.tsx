"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
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
import { generatePayroll, deletePayrollRun, refreshPayroll } from "@/lib/actions/payroll-actions"
import type { PayrollRun } from "@/lib/types/database"
import { formatDateVN } from "@/lib/utils/date-utils"
import { Plus, Eye, Trash2, Calculator, Wallet, RefreshCw, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { usePagination } from "@/hooks/use-pagination"
import { DataPagination } from "@/components/shared/data-pagination"

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
  const [refreshingId, setRefreshingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [progressDialogOpen, setProgressDialogOpen] = useState(false)
  const [progressStep, setProgressStep] = useState(0)
  const [progressMessage, setProgressMessage] = useState("")

  const progressSteps = [
    { step: 1, message: "Đang tải danh sách nhân viên..." },
    { step: 2, message: "Đang tính ngày công chuẩn..." },
    { step: 3, message: "Đang tính chấm công và phụ cấp..." },
    { step: 4, message: "Đang tính lương cơ bản..." },
    { step: 5, message: "Đang tính khấu trừ và phạt..." },
    { step: 6, message: "Đang lưu kết quả..." },
  ]

  // Check if any calculation is in progress
  const isCalculating = loading || refreshingId !== null

  const simulateProgress = async () => {
    for (let i = 0; i < progressSteps.length; i++) {
      setProgressStep(progressSteps[i].step)
      setProgressMessage(progressSteps[i].message)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  const handleGenerate = async () => {
    if (!selectedMonth || !selectedYear) {
      setError("Vui lòng chọn tháng và năm")
      return
    }

    setLoading(true)
    setError(null)
    setOpen(false)
    setProgressDialogOpen(true)
    setProgressStep(0)
    setProgressMessage("Bắt đầu tính lương...")

    // Start progress simulation
    const progressPromise = simulateProgress()

    try {
      const result = await generatePayroll(parseInt(selectedMonth), parseInt(selectedYear))

      // Wait for progress animation to complete
      await progressPromise
      setProgressStep(progressSteps.length)
      setProgressMessage("Hoàn thành!")

      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500))

      if (!result.success) {
        setError(result.error || "Không thể tạo bảng lương")
        setProgressDialogOpen(false)
        setOpen(true)
      } else {
        setSelectedMonth("")
        setProgressDialogOpen(false)
        toast.success(result.message || "Đã tạo bảng lương thành công")
      }
    } catch (err) {
      setError("Lỗi không xác định khi tạo bảng lương")
      setProgressDialogOpen(false)
      console.error(err)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bảng lương này?")) return
    const result = await deletePayrollRun(id)
    if (result.success) {
      toast.success("Đã xóa bảng lương")
    } else {
      toast.error(result.error || "Không thể xóa bảng lương")
    }
  }

  const handleRefresh = async (id: string) => {
    if (!confirm("Tính lại bảng lương sẽ cập nhật tất cả dữ liệu. Tiếp tục?")) return
    
    setRefreshingId(id)
    setProgressDialogOpen(true)
    setProgressStep(0)
    setProgressMessage("Bắt đầu tính lại lương...")

    // Start progress simulation
    const progressPromise = simulateProgress()

    try {
      const result = await refreshPayroll(id)
      
      // Wait for progress animation to complete
      await progressPromise
      setProgressStep(progressSteps.length)
      setProgressMessage("Hoàn thành!")

      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500))
      setProgressDialogOpen(false)

      if (!result.success) {
        toast.error(result.error || "Không thể tính lại bảng lương")
      } else {
        toast.success(result.message || "Đã tính lại bảng lương")
      }
    } catch (err) {
      setProgressDialogOpen(false)
      toast.error("Lỗi khi tính lại bảng lương")
      console.error(err)
    }
    setRefreshingId(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "locked":
        return <Badge className="bg-blue-100 text-blue-800">🔒 Đã khóa</Badge>
      case "paid":
        return <Badge className="bg-green-100 text-green-800">✅ Đã trả</Badge>
      case "review":
        return <Badge className="bg-amber-100 text-amber-800">👁️ Đang xem xét</Badge>
      default:
        return <Badge variant="secondary">📝 Nháp</Badge>
    }
  }

  const {
    paginatedData: paginatedRuns,
    currentPage,
    totalPages,
    pageSize,
    totalItems: totalRuns,
    setPage,
    setPageSize,
  } = usePagination(payrollRuns, 50)

  // Stats
  const draftCount = payrollRuns.filter((r) => r.status === "draft").length
  const reviewCount = payrollRuns.filter((r) => r.status === "review").length
  const lockedCount = payrollRuns.filter((r) => r.status === "locked").length
  const paidCount = payrollRuns.filter((r) => r.status === "paid").length

  return (
    <div className="space-y-6">
      {/* Thống kê */}
      <div className="grid grid-cols-4 gap-4">
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
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="text-sm text-muted-foreground">Đang xem xét</span>
            </div>
            <p className="text-2xl font-bold mt-1">{reviewCount}</p>
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
              {paginatedRuns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Chưa có bảng lương nào
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">
                      Tháng {run.month}/{run.year}
                    </TableCell>
                    <TableCell>{getStatusBadge(run.status)}</TableCell>
                    <TableCell>{formatDateVN(run.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          asChild 
                          disabled={isCalculating}
                          className={isCalculating ? "pointer-events-none opacity-50" : ""}
                        >
                          <Link href={`/dashboard/payroll/${run.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Xem
                          </Link>
                        </Button>
                        {(run.status === "draft" || run.status === "review") && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRefresh(run.id)}
                              disabled={isCalculating}
                              title="Tính lại bảng lương"
                            >
                              <RefreshCw className={`h-4 w-4 ${refreshingId === run.id ? 'animate-spin' : ''}`} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(run.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={isCalculating}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            totalItems={totalRuns}
          />
        </CardContent>
      </Card>

      {/* Progress Dialog */}
      <Dialog open={progressDialogOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Đang tính lương
            </DialogTitle>
            <DialogDescription>
              Vui lòng chờ trong khi hệ thống xử lý...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Progress value={(progressStep / progressSteps.length) * 100} className="h-2" />
            <div className="space-y-2">
              {progressSteps.map((step) => (
                <div 
                  key={step.step} 
                  className={`flex items-center gap-2 text-sm ${
                    progressStep >= step.step 
                      ? progressStep === step.step 
                        ? "text-primary font-medium" 
                        : "text-muted-foreground"
                      : "text-muted-foreground/50"
                  }`}
                >
                  {progressStep > step.step ? (
                    <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : progressStep === step.step ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-muted-foreground/30" />
                  )}
                  <span>{step.message}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
