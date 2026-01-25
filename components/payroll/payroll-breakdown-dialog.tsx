"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getPayrollAdjustmentDetails } from "@/lib/actions/payroll-actions"
import { getOTBreakdownForPayroll, type OTBreakdownItem } from "@/lib/actions/overtime-actions"
import type { PayrollItemWithRelations } from "@/lib/types/database"
import { formatCurrency } from "@/lib/utils/format-utils"
import { Loader2, TrendingUp, TrendingDown, AlertTriangle, Wallet, Timer } from "lucide-react"

interface PayrollBreakdownDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payrollItem: PayrollItemWithRelations | null
  standardWorkingDays: number
  month?: number
  year?: number
}

interface AdjustmentDetail {
  id: string
  category: string
  base_amount: number
  adjusted_amount: number
  final_amount: number
  reason: string | null
  occurrence_count: number
  adjustment_type?: {
    id: string
    name: string
    code: string | null
    category: string
  } | null
}

export function PayrollBreakdownDialog({
  open,
  onOpenChange,
  payrollItem,
  standardWorkingDays = 26,
  month,
  year,
}: PayrollBreakdownDialogProps) {
  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState<AdjustmentDetail[]>([])
  const [otItems, setOtItems] = useState<OTBreakdownItem[]>([])

  useEffect(() => {
    if (open && payrollItem) {
      loadDetails()
    }
  }, [open, payrollItem])

  const loadDetails = async () => {
    if (!payrollItem) return
    setLoading(true)
    
    const [adjustmentData, otData] = await Promise.all([
      getPayrollAdjustmentDetails(payrollItem.id),
      month && year && payrollItem.employee?.id
        ? getOTBreakdownForPayroll(
            payrollItem.employee.id,
            payrollItem.base_salary || 0,
            standardWorkingDays,
            month,
            year
          )
        : Promise.resolve([]),
    ])
    
    setDetails(adjustmentData)
    setOtItems(otData)
    setLoading(false)
  }

  if (!payrollItem) return null

  const dailySalary = (payrollItem.base_salary || 0) / standardWorkingDays
  
  // Parse note để lấy chi tiết ngày công
  const parseWorkingDaysFromNote = (note: string | null) => {
    if (!note) return { attendance: 0, wfh: 0, paidLeave: 0 }
    
    const attendanceMatch = note.match(/Chấm công: ([\d.]+) ngày/)
    const wfhMatch = note.match(/WFH: ([\d.]+) ngày/)
    const paidLeaveMatch = note.match(/Nghỉ phép: ([\d.]+) ngày/)
    
    return {
      attendance: attendanceMatch ? parseFloat(attendanceMatch[1]) : 0,
      wfh: wfhMatch ? parseFloat(wfhMatch[1]) : 0,
      paidLeave: paidLeaveMatch ? parseFloat(paidLeaveMatch[1]) : 0,
    }
  }
  
  const workingDaysDetail = parseWorkingDaysFromNote(payrollItem.note)
  
  // Tính lương theo từng loại
  const attendanceSalary = dailySalary * workingDaysDetail.attendance
  const wfhSalary = dailySalary * workingDaysDetail.wfh
  const paidLeaveSalary = dailySalary * workingDaysDetail.paidLeave
  // KHÔNG TRỪ LƯƠNG CHO NGHỈ KHÔNG LƯƠNG - chỉ ghi nhận số ngày
  // const unpaidDeduction = dailySalary * (payrollItem.unpaid_leave_days || 0)

  const allowances = details.filter((d) => d.category === "allowance")
  const deductions = details.filter((d) => d.category === "deduction")
  const penalties = details.filter((d) => d.category === "penalty")

  const totalAllowanceFromDetails = allowances.reduce((sum, d) => sum + d.final_amount, 0)
  const totalDeductionFromDetails = deductions.reduce((sum, d) => sum + d.final_amount, 0)
  const totalPenaltyFromDetails = penalties.reduce((sum, d) => sum + d.final_amount, 0)

  // Tính tiền OT từ otItems
  const totalOTHours = otItems.reduce((sum, item) => sum + item.hours, 0)
  const totalOTPay = otItems.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Chi tiết cơ cấu lương
          </DialogTitle>
          <DialogDescription>
            {payrollItem.employee?.full_name} - {payrollItem.employee?.employee_code}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Lương cơ bản</p>
                <p className="font-semibold">{formatCurrency(payrollItem.base_salary)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lương ngày</p>
                <p className="font-semibold">{formatCurrency(dailySalary)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Công chuẩn</p>
                <p className="font-semibold">{standardWorkingDays} ngày</p>
              </div>
            </div>

            {/* Thu nhập */}
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Thu nhập
              </h4>
              <div className="space-y-2 pl-6">
                {workingDaysDetail.attendance > 0 && (
                  <div className="flex justify-between items-center text-sm gap-4">
                    <span className="flex-1 min-w-0">Lương theo ngày công ({workingDaysDetail.attendance} ngày)</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">+{formatCurrency(attendanceSalary)}</span>
                  </div>
                )}
                {workingDaysDetail.wfh > 0 && (
                  <div className="flex justify-between items-center text-sm gap-4">
                    <span className="flex-1 min-w-0">Làm việc từ xa ({workingDaysDetail.wfh} ngày)</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">+{formatCurrency(wfhSalary)}</span>
                  </div>
                )}
                {workingDaysDetail.paidLeave > 0 && (
                  <div className="flex justify-between items-center text-sm gap-4">
                    <span className="flex-1 min-w-0">Lương nghỉ phép có lương ({workingDaysDetail.paidLeave} ngày)</span>
                    <span className="font-medium text-green-600 whitespace-nowrap">+{formatCurrency(paidLeaveSalary)}</span>
                  </div>
                )}

                {/* Phụ cấp */}
                {allowances.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <p className="text-xs text-muted-foreground font-medium">Phụ cấp:</p>
                    {allowances.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm gap-4">
                        <span className="flex items-center gap-2 flex-1 min-w-0">
                          {item.adjustment_type?.name || "Phụ cấp"}
                          {item.reason && (
                            <span className="text-xs text-muted-foreground">({item.reason})</span>
                          )}
                        </span>
                        <span className="font-medium text-green-600 whitespace-nowrap">
                          +{formatCurrency(item.final_amount)}
                        </span>
                      </div>
                    ))}
                  </>
                )}

                {/* Tiền tăng ca (OT) */}
                {otItems.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      Tiền tăng ca:
                    </p>
                    
                    {(() => {
                      // Group OT items by type
                      const otByType = new Map<string, OTBreakdownItem[]>()
                      
                      const typeNames: Record<string, string> = {
                        'OT_NORMAL': 'Tăng ca ngày thường',
                        'OT_WEEKEND': 'Tăng ca ngày nghỉ',
                        'OT_HOLIDAY': 'Tăng ca ngày lễ',
                      }
                      
                      for (const item of otItems) {
                        if (!otByType.has(item.otType)) {
                          otByType.set(item.otType, [])
                        }
                        otByType.get(item.otType)!.push(item)
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
                              <p className="text-xs font-medium text-green-700 mb-1.5">
                                {typeNames[type] || type}:
                              </p>
                              {items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-sm py-1 gap-4 ml-3">
                                  <span className="text-muted-foreground">
                                    {formatDate(item.date)} ({item.hours.toFixed(1)}h x {item.multiplier})
                                  </span>
                                  <span className="font-medium text-green-600 whitespace-nowrap">
                                    +{formatCurrency(item.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </>
                      )
                    })()}
                    
                    <div className="flex justify-between items-center text-sm font-medium text-amber-600 pl-4 pt-1 border-t gap-4">
                      <span>Tổng OT ({totalOTHours.toFixed(1)}h)</span>
                      <span className="whitespace-nowrap">+{formatCurrency(totalOTPay)}</span>
                    </div>
                  </>
                )}

                <Separator className="my-2" />
                <div className="flex justify-between items-center font-medium gap-4">
                  <span className="flex-1 min-w-0">Tổng thu nhập</span>
                  <span className="text-blue-600 whitespace-nowrap">{formatCurrency(payrollItem.total_income)}</span>
                </div>
              </div>
            </div>

            {/* Khấu trừ */}
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <TrendingDown className="h-4 w-4 text-red-600" />
                Khấu trừ
              </h4>
              <div className="space-y-2 pl-6">
                {/* KHÔNG HIỂN THỊ NGHỈ KHÔNG LƯƠNG VÌ KHÔNG TRỪ TIỀN */}
                
                {/* Khấu trừ từ adjustment */}
                {deductions.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm gap-4">
                    <span className="flex-1 min-w-0">{item.adjustment_type?.name || "Khấu trừ"}</span>
                    <span className="font-medium text-red-600 whitespace-nowrap">
                      -{formatCurrency(item.final_amount)}
                    </span>
                  </div>
                ))}

                {/* Phạt */}
                {penalties.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Tiền phạt:
                    </p>
                    {penalties.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm gap-4">
                        <span className="flex items-center gap-2 flex-1 min-w-0">
                          {item.adjustment_type?.name || "Phạt"}
                          {item.reason && (
                            <span className="text-xs text-muted-foreground">({item.reason})</span>
                          )}
                        </span>
                        <span className="font-medium text-red-600 whitespace-nowrap">
                          -{formatCurrency(item.final_amount)}
                        </span>
                      </div>
                    ))}
                  </>
                )}

                <Separator className="my-2" />
                <div className="flex justify-between items-center font-medium gap-4">
                  <span className="flex-1 min-w-0">Tổng khấu trừ</span>
                  <span className="text-red-600 whitespace-nowrap">{formatCurrency(payrollItem.total_deduction)}</span>
                </div>
              </div>
            </div>

            {/* Thực lĩnh */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-800">THỰC LĨNH</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(payrollItem.net_salary)}
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                = Thu nhập ({formatCurrency(payrollItem.total_income)}) - Khấu trừ ({formatCurrency(payrollItem.total_deduction)})
              </p>
            </div>

            {/* Ghi chú */}
            {payrollItem.note && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Ghi chú:</span> {payrollItem.note}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
