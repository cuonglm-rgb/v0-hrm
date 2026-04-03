"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { lockPayroll, markPayrollPaid, sendPayrollForReview, getPayrollAdjustmentDetails, addManualAdjustment, deleteAdjustmentDetail, recalculateSingleEmployee, getPayrollExportData, getCalculationLog } from "@/lib/actions/payroll-actions"
import type { PayrollRun, PayrollItemWithRelations, Department } from "@/lib/types/database"
import { formatCurrency } from "@/lib/utils/format-utils"
import { ArrowLeft, Lock, CheckCircle, Users, Wallet, Calculator, Eye, Calendar, TrendingUp, TrendingDown, RefreshCw, Pencil, Plus, Trash2, Download, CheckSquare, Square, Search, Filter, FileText } from "lucide-react"
import * as XLSX from "xlsx"
import { toast } from "sonner"

interface WorkingDaysInfo {
  totalDays: number
  sundays: number
  saturdaysOff: number
  holidays: number
  standardDays: number
}

interface PayrollDetailPanelProps {
  payrollRun: PayrollRun
  payrollItems: PayrollItemWithRelations[]
  standardWorkingDays?: number
  workingDaysInfo?: WorkingDaysInfo
  departments?: Department[]
}

interface AdjustmentDetail {
  id: string
  category: string
  final_amount: number
  reason: string
  occurrence_count: number
  adjustment_type: {
    id: string
    name: string
    code: string
    category: string
  } | null
}

export function PayrollDetailPanel({ 
  payrollRun, 
  payrollItems, 
  standardWorkingDays = 26,
  workingDaysInfo,
  departments = []
}: PayrollDetailPanelProps) {
  const [loading, setLoading] = useState<"review" | "lock" | "paid" | null>(null)
  const [selectedItem, setSelectedItem] = useState<PayrollItemWithRelations | null>(null)
  const [adjustmentDetails, setAdjustmentDetails] = useState<AdjustmentDetail[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [reloadingId, setReloadingId] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [addCategory, setAddCategory] = useState<"allowance" | "deduction">("allowance")
  const [addAmount, setAddAmount] = useState("")
  const [addReason, setAddReason] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set())
  const [isExporting, setIsExporting] = useState(false)
  
  // Calculation log states
  const [showLogDialog, setShowLogDialog] = useState(false)
  const [calculationLog, setCalculationLog] = useState<string>("")
  const [isLoadingLog, setIsLoadingLog] = useState(false)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "salary-asc" | "salary-desc" | "days-asc" | "days-desc">("name-asc")

  const loadAdjustmentDetails = async (payrollItemId: string) => {
    setIsLoading(true)
    console.log('[PayrollDetailPanel] Loading adjustment details for:', payrollItemId)
    try {
      const details = await getPayrollAdjustmentDetails(payrollItemId)
      console.log('[PayrollDetailPanel] Loaded adjustment details:', details)
      setAdjustmentDetails(details as AdjustmentDetail[])
    } catch (error) {
      console.error("[PayrollDetailPanel] Error loading adjustment details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCalculationLog = async (payrollItemId: string) => {
    setIsLoadingLog(true)
    try {
      const result = await getCalculationLog(payrollItemId)
      if (result.success && result.log) {
        setCalculationLog(result.log)
      } else {
        setCalculationLog("Không có log tính lương")
      }
    } catch (error) {
      console.error("[PayrollDetailPanel] Error loading calculation log:", error)
      setCalculationLog("Có lỗi khi tải log")
    } finally {
      setIsLoadingLog(false)
    }
  }

  // Filter and sort logic
  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...payrollItems]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) => {
        const name = item.employee?.full_name?.toLowerCase() || ""
        const code = item.employee?.employee_code?.toLowerCase() || ""
        return name.includes(query) || code.includes(query)
      })
    }

    // Department filter
    if (selectedDepartment !== "all") {
      filtered = filtered.filter((item) => item.employee?.department_id === selectedDepartment)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.employee?.full_name || "").localeCompare(b.employee?.full_name || "", "vi")
        case "name-desc":
          return (b.employee?.full_name || "").localeCompare(a.employee?.full_name || "", "vi")
        case "salary-asc":
          return (a.net_salary || 0) - (b.net_salary || 0)
        case "salary-desc":
          return (b.net_salary || 0) - (a.net_salary || 0)
        case "days-asc":
          return (a.working_days || 0) - (b.working_days || 0)
        case "days-desc":
          return (b.working_days || 0) - (a.working_days || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [payrollItems, searchQuery, selectedDepartment, sortBy])

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedEmployeeIds.size === filteredAndSortedItems.length) {
      setSelectedEmployeeIds(new Set())
    } else {
      setSelectedEmployeeIds(new Set(filteredAndSortedItems.map((item) => item.employee_id)))
    }
  }

  const toggleSelectEmployee = (employeeId: string) => {
    const newSet = new Set(selectedEmployeeIds)
    if (newSet.has(employeeId)) {
      newSet.delete(employeeId)
    } else {
      newSet.add(employeeId)
    }
    setSelectedEmployeeIds(newSet)
  }

  // Export handler
  const handleExport = async (exportAll: boolean = false) => {
    setIsExporting(true)
    try {
      const employeeIds = exportAll ? undefined : Array.from(selectedEmployeeIds)
      
      if (!exportAll && employeeIds && employeeIds.length === 0) {
        toast.error("Vui lòng chọn ít nhất 1 nhân viên để export")
        setIsExporting(false)
        return
      }

      const result = await getPayrollExportData(payrollRun.id, employeeIds)
      
      if (!result.success || !result.data) {
        toast.error(result.error || "Không thể export dữ liệu")
        setIsExporting(false)
        return
      }

      // Tạo workbook
      const wb = XLSX.utils.book_new()

      // Tạo header theo format CSV mẫu
      const headers = [
        "STT",
        "HỌ TÊN",
        "MCC",
        "NGÀY CÔNG CHUẨN",
        "MỨC LƯƠNG THÁNG",
        "MỨC PHỤ CẤP NGÀY",
        "CÔNG TÍNH LƯƠNG",
        "TĂNG CA THƯỜNG",
        "TĂNG CA NGÀY NGHỈ",
        "TĂNG CA NGÀY LỄ",
        "PHÉP",
        "TRỪ PHỤ CẤP",
        "LƯƠNG THỰC TẾ",
        "PHỤ CẤP THỰC TẾ",
        "BHXH",
        "CỘNG KHÁC",
        "TRỪ KHÁC",
        "THỰC NHẬN",
        "QUỸ",
        "CK",
        "EMAIL",
      ]

      // Chuyển data sang array format
      const rows = result.data.map((item) => [
        item.stt,
        item.hoTen,
        item.mcc,
        item.ngayCongChuan,
        item.mucLuongThang,
        item.mucPhuCapNgay,
        item.congTinhLuong,
        item.tangCaThuong,
        item.tangCaNgayNghi,
        item.tangCaNgayLe,
        item.phep,
        item.truPhuCap,
        item.luongThucTe,
        item.phuCapThucTe,
        item.bhxh,
        item.congKhac,
        item.truKhac,
        item.thucNhan,
        item.quy,
        item.ck,
        item.email,
      ])

      // Tạo worksheet
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])

      // Set column widths
      ws["!cols"] = [
        { wch: 5 },   // STT
        { wch: 25 },  // HỌ TÊN
        { wch: 10 },  // MCC
        { wch: 15 },  // NGÀY CÔNG CHUẨN
        { wch: 18 },  // MỨC LƯƠNG THÁNG
        { wch: 18 },  // MỨC PHỤ CẤP NGÀY
        { wch: 15 },  // CÔNG TÍNH LƯƠNG
        { wch: 15 },  // TĂNG CA THƯỜNG
        { wch: 18 },  // TĂNG CA NGÀY NGHỈ
        { wch: 15 },  // TĂNG CA NGÀY LỄ
        { wch: 8 },   // PHÉP
        { wch: 12 },  // TRỪ PHỤ CẤP
        { wch: 15 },  // LƯƠNG THỰC TẾ
        { wch: 15 },  // PHỤ CẤP THỰC TẾ
        { wch: 12 },  // BHXH
        { wch: 12 },  // CỘNG KHÁC
        { wch: 12 },  // TRỪ KHÁC
        { wch: 15 },  // THỰC NHẬN
        { wch: 12 },  // QUỸ
        { wch: 15 },  // CK
        { wch: 30 },  // EMAIL
      ]

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, `Lương T${result.month}_${result.year}`)

      // Tạo tên file
      const fileName = `Bang_Luong_T${result.month}_${result.year}${exportAll ? "_TatCa" : "_ChonLoc"}.xlsx`

      // Download file
      XLSX.writeFile(wb, fileName)

      toast.success(`Đã export ${result.data.length} nhân viên`)
    } catch (error) {
      console.error("Export error:", error)
      toast.error("Có lỗi xảy ra khi export")
    } finally {
      setIsExporting(false)
    }
  }

  const handleViewDetails = (item: PayrollItemWithRelations) => {
    setSelectedItem(item)
    setIsEditMode(false)
    loadAdjustmentDetails(item.id)
  }

  const handleReloadEmployee = async (item: PayrollItemWithRelations, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Tính lại lương cho ${item.employee?.full_name}?`)) return
    
    setReloadingId(item.id)
    try {
      const result = await recalculateSingleEmployee(item.id)
      if (result.success) {
        // Reload the page to get fresh data
        window.location.reload()
      } else {
        alert(result.error || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error reloading employee:", error)
      alert("Có lỗi xảy ra khi tính lại lương")
    } finally {
      setReloadingId(null)
    }
  }

  const handleAddAdjustment = async () => {
    if (!selectedItem || !addAmount || !addReason) return
    
    setIsAdding(true)
    try {
      const result = await addManualAdjustment({
        payroll_item_id: selectedItem.id,
        category: addCategory,
        amount: parseFloat(addAmount),
        reason: addReason
      })
      
      if (result.success) {
        // Reload adjustment details
        await loadAdjustmentDetails(selectedItem.id)
        setShowAddDialog(false)
        setAddAmount("")
        setAddReason("")
        // Reload page to update totals
        window.location.reload()
      } else {
        alert(result.error || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error adding adjustment:", error)
      alert("Có lỗi xảy ra")
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteAdjustment = async (detailId: string) => {
    if (!confirm("Xóa khoản điều chỉnh này?")) return
    
    try {
      const result = await deleteAdjustmentDetail(detailId)
      if (result.success) {
        await loadAdjustmentDetails(selectedItem!.id)
        window.location.reload()
      } else {
        alert(result.error || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Error deleting adjustment:", error)
      alert("Có lỗi xảy ra")
    }
  }

  const handleSendForReview = async () => {
    if (!confirm("Gửi bảng lương cho nhân viên xem xét và kiến nghị?")) return
    setLoading("review")
    await sendPayrollForReview(payrollRun.id)
    setLoading(null)
  }

  const handleLock = async () => {
    if (!confirm("Sau khi khóa sẽ không thể chỉnh sửa. Bạn có chắc?")) return
    setLoading("lock")
    await lockPayroll(payrollRun.id)
    setLoading(null)
  }

  const handleMarkPaid = async () => {
    if (!confirm("Xác nhận đã thanh toán lương?")) return
    setLoading("paid")
    await markPayrollPaid(payrollRun.id)
    setLoading(null)
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

  // Tính tổng (dựa trên filtered items)
  const totalGross = filteredAndSortedItems.reduce((sum, item) => sum + (item.total_income || 0), 0)
  const totalDeduction = filteredAndSortedItems.reduce((sum, item) => sum + (item.total_deduction || 0), 0)
  const totalNet = filteredAndSortedItems.reduce((sum, item) => sum + (item.net_salary || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/payroll">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {/* Export buttons */}
          <Button
            variant="outline"
            onClick={() => handleExport(false)}
            disabled={isExporting || selectedEmployeeIds.size === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Đang export..." : `Export (${selectedEmployeeIds.size})`}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport(true)}
            disabled={isExporting}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Đang export..." : "Export tất cả"}
          </Button>
          
          {getStatusBadge(payrollRun.status)}
          {payrollRun.status === "draft" && (
            <>
              <Button 
                onClick={handleSendForReview} 
                disabled={loading === "review"} 
                variant="outline"
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                {loading === "review" ? "Đang gửi..." : "Gửi xem xét"}
              </Button>
              <Button onClick={handleLock} disabled={loading === "lock"} className="gap-2">
                <Lock className="h-4 w-4" />
                {loading === "lock" ? "Đang khóa..." : "Khóa ngay"}
              </Button>
            </>
          )}
          {payrollRun.status === "review" && (
            <Button onClick={handleLock} disabled={loading === "lock"} className="gap-2">
              <Lock className="h-4 w-4" />
              {loading === "lock" ? "Đang khóa..." : "Khóa bảng lương"}
            </Button>
          )}
          {payrollRun.status === "locked" && (
            <Button
              onClick={handleMarkPaid}
              disabled={loading === "paid"}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              {loading === "paid" ? "Đang xử lý..." : "Đánh dấu đã trả"}
            </Button>
          )}
        </div>
      </div>

      {/* Thông tin công chuẩn */}
      {workingDaysInfo && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Công chuẩn tháng {payrollRun.month}/{payrollRun.year}:</span>
                <span className="font-bold text-blue-600">{workingDaysInfo.standardDays} ngày</span>
              </div>
              <div className="text-muted-foreground">
                ({workingDaysInfo.totalDays} ngày - {workingDaysInfo.sundays} CN - {workingDaysInfo.saturdaysOff} T7 nghỉ)
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Thống kê */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Nhân viên</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {filteredAndSortedItems.length}
              {filteredAndSortedItems.length !== payrollItems.length && (
                <span className="text-sm text-muted-foreground ml-1">/ {payrollItems.length}</span>
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tổng thu nhập</span>
            </div>
            <p className="text-xl font-bold mt-1 text-blue-600">{formatCurrency(totalGross)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Tổng khấu trừ</span>
            </div>
            <p className="text-xl font-bold mt-1 text-red-600">{formatCurrency(totalDeduction)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tổng thực lĩnh</span>
            </div>
            <p className="text-xl font-bold mt-1 text-green-600">{formatCurrency(totalNet)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Bộ lọc và tìm kiếm</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tìm kiếm */}
            <div className="space-y-2">
              <Label>Tìm kiếm nhân viên</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tên hoặc mã nhân viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Lọc theo phòng ban */}
            <div className="space-y-2">
              <Label>Phòng ban</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phòng ban</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sắp xếp */}
            <div className="space-y-2">
              <Label>Sắp xếp theo</Label>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Tên (A → Z)</SelectItem>
                  <SelectItem value="name-desc">Tên (Z → A)</SelectItem>
                  <SelectItem value="salary-desc">Lương (Cao → Thấp)</SelectItem>
                  <SelectItem value="salary-asc">Lương (Thấp → Cao)</SelectItem>
                  <SelectItem value="days-desc">Ngày công (Nhiều → Ít)</SelectItem>
                  <SelectItem value="days-asc">Ngày công (Ít → Nhiều)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hiển thị số kết quả */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Hiển thị {filteredAndSortedItems.length} / {payrollItems.length} nhân viên
            </span>
            {(searchQuery || selectedDepartment !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedDepartment("all")
                }}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bảng chi tiết */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết lương nhân viên</CardTitle>
          <CardDescription>
            Kỳ lương tháng {payrollRun.month}/{payrollRun.year} - Click vào dòng để xem cơ cấu chi tiết
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center justify-center"
                    title={selectedEmployeeIds.size === filteredAndSortedItems.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  >
                    {selectedEmployeeIds.size === filteredAndSortedItems.length && filteredAndSortedItems.length > 0 ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead className="text-right">Ngày công</TableHead>
                <TableHead className="text-right">Nghỉ phép</TableHead>
                <TableHead className="text-right">Nghỉ KL</TableHead>
                <TableHead className="text-right">Lương CB</TableHead>
                <TableHead className="text-right">Phụ cấp</TableHead>
                <TableHead className="text-right">Thu nhập</TableHead>
                <TableHead className="text-right">Khấu trừ</TableHead>
                <TableHead className="text-right">Thực lĩnh</TableHead>
                <TableHead className="text-center">Chi tiết</TableHead>
                <TableHead className="text-center">Log</TableHead>
                {(payrollRun.status === "draft" || payrollRun.status === "review") && (
                  <TableHead className="text-center">Thao tác</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center text-muted-foreground">
                    {searchQuery || selectedDepartment !== "all" 
                      ? "Không tìm thấy nhân viên phù hợp" 
                      : "Chưa có dữ liệu"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedItems.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewDetails(item)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleSelectEmployee(item.employee_id)}
                        className="flex items-center justify-center"
                      >
                        {selectedEmployeeIds.has(item.employee_id) ? (
                          <CheckSquare className="h-4 w-4 text-primary" />
                        ) : (
                          <Square className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.employee?.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.employee?.employee_code}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.working_days ? item.working_days.toFixed(1).replace(/\.0$/, '') : 0}
                    </TableCell>
                    <TableCell className="text-right">{item.leave_days || 0}</TableCell>
                    <TableCell className="text-right">{item.unpaid_leave_days || 0}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.base_salary)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.allowances)}</TableCell>
                    <TableCell className="text-right text-blue-600">
                      {formatCurrency(item.total_income)}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(item.total_deduction)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      {formatCurrency(item.net_salary)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDetails(item)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          loadCalculationLog(item.id)
                          setShowLogDialog(true)
                        }}
                        title="Xem log tính lương"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    {(payrollRun.status === "draft" || payrollRun.status === "review") && (
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedItem(item)
                              setIsEditMode(true)
                              loadAdjustmentDetails(item.id)
                            }}
                            title="Sửa điều chỉnh"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleReloadEmployee(item, e)}
                            disabled={reloadingId === item.id}
                            title="Tính lại lương"
                          >
                            <RefreshCw className={`h-4 w-4 ${reloadingId === item.id ? 'animate-spin' : ''}`} />
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

      {/* Dialog chi tiết cơ cấu lương */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => { if (!open) { setSelectedItem(null); setIsEditMode(false); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{isEditMode ? "Chỉnh sửa điều chỉnh lương" : "Chi tiết cơ cấu lương"}</DialogTitle>
              {(payrollRun.status === "draft" || payrollRun.status === "review") && !isEditMode && (
                <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Sửa
                </Button>
              )}
            </div>
            {selectedItem && (
              <p className="text-sm text-muted-foreground">
                {selectedItem.employee?.full_name} - NV{selectedItem.employee?.employee_code} - Tháng {payrollRun.month}/{payrollRun.year}
              </p>
            )}
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 mt-4">
              {isLoading && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Đang tải chi tiết...</p>
                </div>
              )}
              
              {/* Thông tin tổng quan */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Lương cơ bản</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedItem.base_salary)}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Lương ngày</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedItem.base_salary / (selectedItem.standard_working_days || standardWorkingDays))}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Công chuẩn</p>
                  <p className="text-lg font-bold">{selectedItem.standard_working_days || standardWorkingDays} ngày</p>
                </div>
              </div>

              {/* Thu nhập */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-600">Thu nhập</h3>
                </div>
                
                <div className="space-y-2 pl-7">
                  {/* Lương theo ngày công */}
                  {selectedItem.working_days > 0 && (
                    <div className="flex justify-between items-center py-1 gap-4">
                      <span className="text-sm text-muted-foreground flex-1 min-w-0">
                        Lương theo ngày công ({selectedItem.working_days.toFixed(1).replace(/\.0$/, '')} ngày)
                      </span>
                      <span className="text-sm text-green-600 whitespace-nowrap tabular-nums">
                        +{formatCurrency((selectedItem.base_salary / (selectedItem.standard_working_days || standardWorkingDays)) * selectedItem.working_days)}
                      </span>
                    </div>
                  )}

                  {/* Lương nghỉ phép có lương */}
                  {selectedItem.leave_days > 0 && (
                    <div className="flex justify-between items-center py-1 gap-4">
                      <span className="text-sm text-muted-foreground flex-1 min-w-0">
                        Lương nghỉ phép có lương ({selectedItem.leave_days} ngày)
                      </span>
                      <span className="text-sm text-green-600 whitespace-nowrap tabular-nums">
                        +{formatCurrency((selectedItem.base_salary / (selectedItem.standard_working_days || standardWorkingDays)) * selectedItem.leave_days)}
                      </span>
                    </div>
                  )}

                  {/* Phụ cấp */}
                  {!isLoading && adjustmentDetails.filter((d) => d.category === "allowance" && d.adjustment_type?.code !== 'overtime').length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-1.5">Phụ cấp:</p>
                      {adjustmentDetails
                        .filter((d) => d.category === "allowance" && d.adjustment_type?.code !== 'overtime')
                        .map((detail, idx) => (
                          <div key={idx} className="flex justify-between items-center py-0.5 gap-4">
                            <span className="text-sm text-muted-foreground flex-1 min-w-0">
                              {detail.adjustment_type?.code?.startsWith("MANUAL") 
                                ? detail.reason 
                                : (
                                  <>
                                    {detail.adjustment_type?.name || detail.reason}
                                    {detail.reason && detail.reason !== detail.adjustment_type?.name && !detail.adjustment_type?.code?.startsWith("MANUAL") && (
                                      <span className="text-xs ml-1">({detail.reason})</span>
                                    )}
                                  </>
                                )}
                            </span>
                            <span className="text-sm text-green-600 whitespace-nowrap tabular-nums">
                              +{formatCurrency(detail.final_amount)}
                            </span>
                          </div>
                        ))}
                      {/* Tổng phụ cấp */}
                      <div className="flex justify-between items-center py-1 pt-2 border-t mt-1 gap-4">
                        <span className="text-sm flex-1 min-w-0">Tổng phụ cấp</span>
                        <span className="text-sm text-green-600 whitespace-nowrap tabular-nums">
                          +{formatCurrency(adjustmentDetails
                            .filter((d) => d.category === "allowance" && d.adjustment_type?.code !== 'overtime')
                            .reduce((sum, d) => sum + d.final_amount, 0))}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tiền tăng ca */}
                  {!isLoading && adjustmentDetails.filter(d => d.adjustment_type?.code === 'overtime').length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-1.5">Tiền tăng ca:</p>
                      
                      {(() => {
                        // Parse và nhóm OT theo loại
                        const otDetails = adjustmentDetails.filter((d) => d.adjustment_type?.code === 'overtime')
                        
                        // Group by type name
                        const otByType = new Map<string, Array<{
                          date: string
                          hours: number
                          multiplier: number
                          amount: number
                        }>>()
                        
                        for (const detail of otDetails) {
                          // Parse reason: "Tăng ca ngày thường (2h x 1.5) ngày 2025-12-05"
                          const match = detail.reason.match(/^([^(]+)\s*\(([\d.]+)h?\s*x\s*([\d.]+)\)\s*ngày\s*([\d-]+)/)
                          
                          if (match) {
                            const [, typeName, hours, multiplier, date] = match
                            const type = typeName.trim() // "Tăng ca ngày thường", etc.
                            
                            if (!otByType.has(type)) {
                              otByType.set(type, [])
                            }
                            otByType.get(type)!.push({
                              date,
                              hours: parseFloat(hours),
                              multiplier: parseFloat(multiplier),
                              amount: detail.final_amount,
                            })
                          }
                        }
                        
                        // Format date from YYYY-MM-DD to DD/MM/YYYY
                        const formatDate = (dateStr: string) => {
                          const [year, month, day] = dateStr.split('-')
                          return `${day}/${month}/${year}`
                        }
                        
                        return (
                          <>
                            {Array.from(otByType.entries()).map(([type, items]) => (
                              <div key={type} className="mb-2">
                                <p className="text-sm text-muted-foreground mb-1">
                                  {type}:
                                </p>
                                {items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center py-0.5 gap-4 ml-3">
                                    <span className="text-sm text-muted-foreground tabular-nums">
                                      {formatDate(item.date)} ({item.hours}h x {item.multiplier})
                                    </span>
                                    <span className="text-sm text-green-600 whitespace-nowrap tabular-nums">
                                      +{formatCurrency(item.amount)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </>
                        )
                      })()}
                      
                      {/* Tổng tăng ca */}
                      <div className="flex justify-between items-center py-1 pt-2 border-t mt-1 gap-4">
                        <span className="text-sm flex-1 min-w-0">
                          Tổng tăng ca ({adjustmentDetails
                            .filter((d) => d.adjustment_type?.code === 'overtime')
                            .reduce((sum, d) => sum + (d.occurrence_count || 0), 0).toFixed(1)}h)
                        </span>
                        <span className="text-sm text-green-600 whitespace-nowrap tabular-nums">
                          +{formatCurrency(adjustmentDetails
                            .filter((d) => d.adjustment_type?.code === 'overtime')
                            .reduce((sum, d) => sum + d.final_amount, 0))}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Fallback nếu không có chi tiết */}
                  {!isLoading && adjustmentDetails.length === 0 && selectedItem.allowances > 0 && (
                    <div className="pt-2 border-t">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                        <p className="text-xs font-medium text-amber-800 mb-1">⚠️ Chi tiết chưa khả dụng</p>
                        <p className="text-xs text-amber-700">
                          Bảng lương này được tạo trước khi cập nhật hệ thống. Vui lòng yêu cầu HR tạo lại bảng lương để xem chi tiết phụ cấp và tăng ca.
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1.5">Phụ cấp và tăng ca:</p>
                      <div className="flex justify-between items-center py-1.5 gap-4">
                        <span className="text-sm text-muted-foreground flex-1 min-w-0">
                          Tổng phụ cấp và tăng ca
                        </span>
                        <span className="text-sm font-medium text-green-600 whitespace-nowrap">
                          +{formatCurrency(selectedItem.allowances)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tổng thu nhập */}
                  <div className="flex justify-between items-center py-1 pt-3 border-t font-semibold gap-4">
                    <span className="flex-1 min-w-0">Tổng thu nhập</span>
                    <span className="text-blue-600 whitespace-nowrap tabular-nums">
                      {formatCurrency(selectedItem.total_income)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Khấu trừ */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-600">Khấu trừ</h3>
                </div>
                
                <div className="space-y-2 pl-7">
                  {/* KHÔNG HIỂN THỊ NGHỈ KHÔNG LƯƠNG VÌ KHÔNG TRỪ TIỀN */}

                  {/* Khấu trừ (BHXH, quỹ...) */}
                  {!isLoading && adjustmentDetails.filter((d) => d.category === "deduction").length > 0 && (
                    <>
                      {adjustmentDetails
                        .filter((d) => d.category === "deduction")
                        .map((detail, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1 gap-4">
                            <span className="text-sm text-muted-foreground flex-1 min-w-0">
                              {detail.adjustment_type?.code?.startsWith("MANUAL") 
                                ? detail.reason 
                                : detail.adjustment_type?.name || detail.reason}
                            </span>
                            <span className="text-sm text-red-600 whitespace-nowrap tabular-nums">
                              -{formatCurrency(detail.final_amount)}
                            </span>
                          </div>
                        ))}
                    </>
                  )}

                  {/* Phạt */}
                  {!isLoading && adjustmentDetails.filter((d) => d.category === "penalty").length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-1.5">Phạt:</p>
                      {adjustmentDetails
                        .filter((d) => d.category === "penalty")
                        .map((detail, idx) => (
                          <div key={idx} className="flex justify-between items-center py-0.5 gap-4">
                            <span className="text-sm text-muted-foreground flex-1 min-w-0">
                              {detail.reason}
                            </span>
                            <span className="text-sm text-red-600 whitespace-nowrap tabular-nums">
                              -{formatCurrency(detail.final_amount)}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                  
                  {/* Fallback nếu không có chi tiết nhưng có khấu trừ */}
                  {!isLoading && adjustmentDetails.filter((d) => d.category === "deduction" || d.category === "penalty").length === 0 && selectedItem.total_deduction > 0 && (
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center py-1 gap-4">
                        <span className="text-sm text-muted-foreground flex-1 min-w-0">
                          Các khoản khấu trừ và phạt
                        </span>
                        <span className="text-sm text-red-600 whitespace-nowrap tabular-nums">
                          -{formatCurrency(selectedItem.total_deduction - (selectedItem.unpaid_leave_days * (selectedItem.base_salary / (selectedItem.standard_working_days || standardWorkingDays))))}
                        </span>
                      </div>

                    </div>
                  )}

                  {/* Tổng khấu trừ */}
                  <div className="flex justify-between items-center py-1 pt-3 border-t font-semibold gap-4">
                    <span className="flex-1 min-w-0">Tổng khấu trừ</span>
                    <span className="text-red-600 whitespace-nowrap tabular-nums">
                      {formatCurrency(selectedItem.total_deduction)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Thực lĩnh */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Thực lĩnh</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedItem.net_salary)}
                  </span>
                </div>
              </div>

              {/* Edit Mode - Thêm/Xóa điều chỉnh */}
              {isEditMode && (payrollRun.status === "draft" || payrollRun.status === "review") && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Điều chỉnh thủ công</h3>
                      <Button size="sm" onClick={() => setShowAddDialog(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm điều chỉnh
                      </Button>
                    </div>

                    {/* Danh sách điều chỉnh có thể xóa */}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Các khoản cộng lương (có thể thêm: phụ cấp khác, thưởng khác, chênh lệch khác):</p>
                      {adjustmentDetails
                        .filter((d) => d.category === "allowance")
                        .map((detail) => (
                          <div key={detail.id} className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg">
                            <div className="flex-1">
                              <span className="text-sm">{detail.adjustment_type?.name || detail.reason}</span>
                              {detail.reason && detail.reason !== detail.adjustment_type?.name && (
                                <span className="text-xs text-muted-foreground ml-2">({detail.reason})</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-green-600 font-medium">+{formatCurrency(detail.final_amount)}</span>
                              {detail.adjustment_type?.code?.startsWith("MANUAL") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteAdjustment(detail.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}

                      <p className="text-sm text-muted-foreground mt-4">Các khoản trừ lương (có thể thêm: vi phạm khác, ứng lương, chênh lệch khác):</p>
                      {adjustmentDetails
                        .filter((d) => d.category === "deduction" || d.category === "penalty")
                        .map((detail) => (
                          <div key={detail.id} className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg">
                            <div className="flex-1">
                              <span className="text-sm">{detail.adjustment_type?.name || detail.reason}</span>
                              {detail.reason && detail.reason !== detail.adjustment_type?.name && (
                                <span className="text-xs text-muted-foreground ml-2">({detail.reason})</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-red-600 font-medium">-{formatCurrency(detail.final_amount)}</span>
                              {detail.adjustment_type?.code?.startsWith("MANUAL") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteAdjustment(detail.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog thêm điều chỉnh */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm điều chỉnh lương</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Loại điều chỉnh</Label>
              <Select value={addCategory} onValueChange={(v) => setAddCategory(v as "allowance" | "deduction")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allowance">Cộng lương (phụ cấp khác, thưởng khác, chênh lệch...)</SelectItem>
                  <SelectItem value="deduction">Trừ lương (vi phạm khác, ứng lương, chênh lệch...)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Số tiền (VNĐ)</Label>
              <Input
                type="text"
                placeholder="Nhập số tiền (VD: 900.000)"
                value={addAmount ? Number(addAmount.replace(/\./g, '')).toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  // Chỉ giữ lại số
                  const rawValue = e.target.value.replace(/\D/g, '')
                  setAddAmount(rawValue)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Lý do / Ghi chú</Label>
              <Input
                placeholder="VD: Thưởng dự án, Ứng lương, Chênh lệch tháng trước..."
                value={addReason}
                onChange={(e) => setAddReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Hủy</Button>
            <Button onClick={handleAddAdjustment} disabled={isAdding || !addAmount || !addReason}>
              {isAdding ? "Đang thêm..." : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog hiển thị log tính lương */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Log quy trình tính lương
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {isLoadingLog ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Đang tải log...</p>
              </div>
            ) : (
              <div className="bg-slate-950 text-green-400 p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap" style={{ fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', 'Courier New', monospace" }}>
                {calculationLog}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogDialog(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
