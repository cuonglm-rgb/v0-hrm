"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { lockPayroll, markPayrollPaid, sendPayrollForReview, getPayrollAdjustmentDetails } from "@/lib/actions/payroll-actions"
import type { PayrollRun, PayrollItemWithRelations } from "@/lib/types/database"
import { formatCurrency } from "@/lib/utils/format-utils"
import { ArrowLeft, Lock, CheckCircle, Users, Wallet, Calculator, Eye, Calendar, TrendingUp, TrendingDown } from "lucide-react"

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
  }
}

export function PayrollDetailPanel({ 
  payrollRun, 
  payrollItems, 
  standardWorkingDays = 26,
  workingDaysInfo 
}: PayrollDetailPanelProps) {
  const [loading, setLoading] = useState<"review" | "lock" | "paid" | null>(null)
  const [selectedItem, setSelectedItem] = useState<PayrollItemWithRelations | null>(null)
  const [adjustmentDetails, setAdjustmentDetails] = useState<AdjustmentDetail[]>([])
  const [isLoading, setIsLoading] = useState(false)

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

  const handleViewDetails = (item: PayrollItemWithRelations) => {
    setSelectedItem(item)
    loadAdjustmentDetails(item.id)
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

  // Tính tổng
  const totalGross = payrollItems.reduce((sum, item) => sum + (item.total_income || 0), 0)
  const totalDeduction = payrollItems.reduce((sum, item) => sum + (item.total_deduction || 0), 0)
  const totalNet = payrollItems.reduce((sum, item) => sum + (item.net_salary || 0), 0)

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
                ({workingDaysInfo.totalDays} ngày - {workingDaysInfo.sundays} CN - {workingDaysInfo.saturdaysOff} T7 nghỉ - {workingDaysInfo.holidays} lễ)
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
            <p className="text-2xl font-bold mt-1">{payrollItems.length}</p>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground">
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                payrollItems.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewDetails(item)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.employee?.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.employee?.employee_code}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{item.working_days || 0}</TableCell>
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog chi tiết cơ cấu lương */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết cơ cấu lương</DialogTitle>
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
                        Lương theo ngày công ({selectedItem.working_days} ngày)
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
                              {detail.adjustment_type.name}
                              {detail.reason && detail.reason !== detail.adjustment_type.name && (
                                <span className="text-xs ml-1">({detail.reason})</span>
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
                  {/* Nghỉ không lương */}
                  {selectedItem.unpaid_leave_days > 0 && (
                    <div className="flex justify-between items-center py-1 gap-4">
                      <span className="text-sm text-muted-foreground flex-1 min-w-0">
                        Nghỉ không lương ({selectedItem.unpaid_leave_days} ngày)
                      </span>
                      <span className="text-sm text-red-600 whitespace-nowrap tabular-nums">
                        -{formatCurrency((selectedItem.base_salary / (selectedItem.standard_working_days || standardWorkingDays)) * selectedItem.unpaid_leave_days)}
                      </span>
                    </div>
                  )}

                  {/* Khấu trừ (BHXH, quỹ...) */}
                  {!isLoading && adjustmentDetails.filter((d) => d.category === "deduction").length > 0 && (
                    <>
                      {adjustmentDetails
                        .filter((d) => d.category === "deduction")
                        .map((detail, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1 gap-4">
                            <span className="text-sm text-muted-foreground flex-1 min-w-0">
                              {detail.adjustment_type.name}
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
