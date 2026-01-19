"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { PayrollItemWithRelations } from "@/lib/types/database"
import { formatCurrency } from "@/lib/utils/format-utils"
import { Wallet, Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { useState } from "react"
import { getPayrollAdjustmentDetails } from "@/lib/actions/payroll-actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PayslipPanelProps {
  payslips: PayrollItemWithRelations[]
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

export function PayslipPanel({ payslips }: PayslipPanelProps) {
  const latestPayslip = payslips[0]
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollItemWithRelations | null>(null)
  const [adjustmentDetails, setAdjustmentDetails] = useState<AdjustmentDetail[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">✅ Đã trả</Badge>
      case "locked":
        return <Badge className="bg-blue-100 text-blue-800">🔒 Đã khóa</Badge>
      case "review":
        return <Badge className="bg-amber-100 text-amber-800">👁️ Đang xem xét</Badge>
      default:
        return <Badge variant="secondary">Chờ xử lý</Badge>
    }
  }

  const loadAdjustmentDetails = async (payslipId: string) => {
    setIsLoading(true)
    console.log('[PayslipPanel] Loading adjustment details for:', payslipId)
    try {
      const details = await getPayrollAdjustmentDetails(payslipId)
      console.log('[PayslipPanel] Loaded adjustment details:', details)
      setAdjustmentDetails(details as AdjustmentDetail[])
    } catch (error) {
      console.error("[PayslipPanel] Error loading adjustment details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (payslip: PayrollItemWithRelations) => {
    setSelectedPayslip(payslip)
    loadAdjustmentDetails(payslip.id)
  }

  return (
    <div className="space-y-6">
      {/* Phiếu lương mới nhất */}
      {latestPayslip && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Phiếu lương tháng {latestPayslip.payroll_run?.month}/
                  {latestPayslip.payroll_run?.year}
                </CardTitle>
                <CardDescription>Kỳ lương gần nhất</CardDescription>
              </div>
              {getStatusBadge(latestPayslip.payroll_run?.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Ngày công</p>
                <p className="text-2xl font-bold">{latestPayslip.working_days || 0}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Nghỉ phép</p>
                <p className="text-2xl font-bold">{latestPayslip.leave_days || 0}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Nghỉ không lương</p>
                <p className="text-2xl font-bold">{latestPayslip.unpaid_leave_days || 0}</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Thực lĩnh</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(latestPayslip.net_salary)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Lương cơ bản</span>
                <span className="font-medium">{formatCurrency(latestPayslip.base_salary)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Phụ cấp</span>
                <span className="font-medium">{formatCurrency(latestPayslip.allowances)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Tổng thu nhập
                </span>
                <span className="font-medium text-blue-600">
                  {formatCurrency(latestPayslip.total_income)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  Khấu trừ
                </span>
                <span className="font-medium text-red-600">
                  {formatCurrency(latestPayslip.total_deduction)}
                </span>
              </div>
              <div className="flex justify-between py-3 bg-green-50 rounded-lg px-3">
                <span className="font-semibold">Thực lĩnh</span>
                <span className="font-bold text-lg text-green-600">
                  {formatCurrency(latestPayslip.net_salary)}
                </span>
              </div>
              
              <button
                onClick={() => handleViewDetails(latestPayslip)}
                className="w-full mt-4 py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Xem chi tiết cơ cấu lương
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lịch sử phiếu lương */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Lịch sử phiếu lương
          </CardTitle>
          <CardDescription>Các kỳ lương trước đó</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kỳ lương</TableHead>
                <TableHead className="text-right">Ngày công</TableHead>
                <TableHead className="text-right">Thu nhập</TableHead>
                <TableHead className="text-right">Khấu trừ</TableHead>
                <TableHead className="text-right">Thực lĩnh</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Chưa có phiếu lương nào
                  </TableCell>
                </TableRow>
              ) : (
                payslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell className="font-medium">
                      Tháng {payslip.payroll_run?.month}/{payslip.payroll_run?.year}
                    </TableCell>
                    <TableCell className="text-right">{payslip.working_days || 0}</TableCell>
                    <TableCell className="text-right text-blue-600">
                      {formatCurrency(payslip.total_income)}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(payslip.total_deduction)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      {formatCurrency(payslip.net_salary)}
                    </TableCell>
                    <TableCell>{getStatusBadge(payslip.payroll_run?.status)}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleViewDetails(payslip)}
                        className="text-sm text-primary hover:underline"
                      >
                        Chi tiết
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog chi tiết cơ cấu lương */}
      <Dialog open={!!selectedPayslip} onOpenChange={(open) => !open && setSelectedPayslip(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết cơ cấu lương</DialogTitle>
            {selectedPayslip && (
              <p className="text-sm text-muted-foreground">
                {selectedPayslip.employee?.full_name} - NV{selectedPayslip.employee?.employee_code} - Tháng {selectedPayslip.payroll_run?.month}/{selectedPayslip.payroll_run?.year}
              </p>
            )}
          </DialogHeader>

          {selectedPayslip && (
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
                  <p className="text-lg font-bold">{formatCurrency(selectedPayslip.base_salary)}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Lương ngày</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedPayslip.base_salary / (selectedPayslip.standard_working_days || 25))}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Công chuẩn</p>
                  <p className="text-lg font-bold">{selectedPayslip.standard_working_days || 25} ngày</p>
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
                  {selectedPayslip.working_days > 0 && (
                    <div className="flex justify-between items-center py-1 gap-4">
                      <span className="text-sm text-muted-foreground flex-1 min-w-0">
                        Lương theo ngày công ({selectedPayslip.working_days} ngày)
                      </span>
                      <span className="text-sm text-green-600 whitespace-nowrap tabular-nums">
                        +{formatCurrency((selectedPayslip.base_salary / (selectedPayslip.standard_working_days || 25)) * selectedPayslip.working_days)}
                      </span>
                    </div>
                  )}

                  {/* Lương nghỉ phép có lương */}
                  {selectedPayslip.leave_days > 0 && (
                    <div className="flex justify-between items-center py-1 gap-4">
                      <span className="text-sm text-muted-foreground flex-1 min-w-0">
                        Lương nghỉ phép có lương ({selectedPayslip.leave_days} ngày)
                      </span>
                      <span className="text-sm text-green-600 whitespace-nowrap tabular-nums">
                        +{formatCurrency((selectedPayslip.base_salary / (selectedPayslip.standard_working_days || 25)) * selectedPayslip.leave_days)}
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
                  {!isLoading && adjustmentDetails.length === 0 && selectedPayslip.allowances > 0 && (
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
                          +{formatCurrency(selectedPayslip.allowances)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tổng thu nhập */}
                  <div className="flex justify-between items-center py-1 pt-3 border-t font-semibold gap-4">
                    <span className="flex-1 min-w-0">Tổng thu nhập</span>
                    <span className="text-blue-600 whitespace-nowrap tabular-nums">
                      {formatCurrency(selectedPayslip.total_income)}
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
                  {selectedPayslip.unpaid_leave_days > 0 && (
                    <div className="flex justify-between items-center py-1 gap-4">
                      <span className="text-sm text-muted-foreground flex-1 min-w-0">
                        Nghỉ không lương ({selectedPayslip.unpaid_leave_days} ngày)
                      </span>
                      <span className="text-sm text-red-600 whitespace-nowrap tabular-nums">
                        -{formatCurrency((selectedPayslip.base_salary / (selectedPayslip.standard_working_days || 25)) * selectedPayslip.unpaid_leave_days)}
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
                  {!isLoading && adjustmentDetails.filter((d) => d.category === "deduction" || d.category === "penalty").length === 0 && selectedPayslip.total_deduction > 0 && (
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center py-1 gap-4">
                        <span className="text-sm text-muted-foreground flex-1 min-w-0">
                          Các khoản khấu trừ và phạt
                        </span>
                        <span className="text-sm text-red-600 whitespace-nowrap tabular-nums">
                          -{formatCurrency(selectedPayslip.total_deduction - (selectedPayslip.unpaid_leave_days * (selectedPayslip.base_salary / (selectedPayslip.standard_working_days || 25))))}
                        </span>
                      </div>

                    </div>
                  )}

                  {/* Tổng khấu trừ */}
                  <div className="flex justify-between items-center py-1 pt-3 border-t font-semibold gap-4">
                    <span className="flex-1 min-w-0">Tổng khấu trừ</span>
                    <span className="text-red-600 whitespace-nowrap tabular-nums">
                      {formatCurrency(selectedPayslip.total_deduction)}
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
                    {formatCurrency(selectedPayslip.net_salary)}
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
