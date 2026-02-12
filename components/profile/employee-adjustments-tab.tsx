"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Coins, Wallet, Ban, AlertTriangle, Calendar } from "lucide-react"
import { formatCurrency } from "@/lib/utils/format-utils"
import type { PayrollAdjustmentType, AdjustmentCategory } from "@/lib/types/database"

interface EmployeeAdjustmentsTabProps {
  autoAdjustments: PayrollAdjustmentType[]
  manualAdjustments: any[]
}

const categoryConfig: Record<
  AdjustmentCategory,
  { label: string; icon: React.ReactNode; color: string }
> = {
  allowance: { label: "Phụ cấp", icon: <Coins className="h-4 w-4" />, color: "bg-green-100 text-green-700" },
  deduction: { label: "Khấu trừ", icon: <Wallet className="h-4 w-4" />, color: "bg-blue-100 text-blue-700" },
  penalty: { label: "Phạt", icon: <Ban className="h-4 w-4" />, color: "bg-red-100 text-red-700" },
}

export function EmployeeAdjustmentsTab({ autoAdjustments, manualAdjustments }: EmployeeAdjustmentsTabProps) {
  const allowances = autoAdjustments.filter((a) => a.category === "allowance")
  const deductions = autoAdjustments.filter((a) => a.category === "deduction")
  const penalties = autoAdjustments.filter((a) => a.category === "penalty")

  const manualAllowances = manualAdjustments.filter((a) => a.adjustment_type?.category === "allowance")
  const manualDeductions = manualAdjustments.filter((a) => a.adjustment_type?.category === "deduction")

  const renderAutoSection = (items: PayrollAdjustmentType[], category: AdjustmentCategory) => {
    if (items.length === 0) return null

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            {categoryConfig[category].icon}
            {categoryConfig[category].label} tự động ({items.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Các khoản được áp dụng tự động mỗi tháng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead>Cách tính</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      {item.code && (
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{item.code}</code>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.description || "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.amount > 0 ? (
                      <>
                        {item.calculation_type === "percentage" ? (
                          <span className="text-blue-600">{item.amount}%</span>
                        ) : (
                          formatCurrency(item.amount)
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground text-xs">Theo công thức</span>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  const renderManualSection = (items: any[], category: AdjustmentCategory) => {
    if (items.length === 0) return null

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            {categoryConfig[category].icon}
            {categoryConfig[category].label} riêng ({items.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Các khoản được gán riêng cho bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Hiệu lực</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const type = item.adjustment_type
                const displayAmount = item.custom_amount || type?.amount || 0
                const displayPercentage = item.custom_percentage || type?.amount || 0
                const isPercentage = type?.calculation_type === "percentage"

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{type?.name}</span>
                        {type?.code && (
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{type.code}</code>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {isPercentage ? (
                        <span className="text-blue-600">{displayPercentage}%</span>
                      ) : (
                        formatCurrency(displayAmount)
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.effective_date).toLocaleDateString("vi-VN")}
                        {item.end_date && (
                          <span> - {new Date(item.end_date).toLocaleDateString("vi-VN")}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.note || "-"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  const hasAnyData = 
    allowances.length > 0 || 
    deductions.length > 0 || 
    penalties.length > 0 ||
    manualAllowances.length > 0 ||
    manualDeductions.length > 0

  if (!hasAnyData) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Chưa có phụ cấp hoặc khấu trừ nào được áp dụng</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Thông báo */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 mb-1">Thông tin phụ cấp & khấu trừ</h4>
            <p className="text-sm text-blue-700">
              Dưới đây là danh sách các khoản phụ cấp và khấu trừ được áp dụng cho bạn. 
              Số tiền thực tế có thể thay đổi tùy theo điều kiện làm việc và chấm công hàng tháng.
            </p>
          </div>
        </div>
      </div>

      {/* Phụ cấp tự động */}
      {renderAutoSection(allowances, "allowance")}

      {/* Phụ cấp riêng */}
      {renderManualSection(manualAllowances, "allowance")}

      {/* Khấu trừ tự động */}
      {renderAutoSection(deductions, "deduction")}

      {/* Khấu trừ riêng */}
      {renderManualSection(manualDeductions, "deduction")}

      {/* Phạt tự động */}
      {renderAutoSection(penalties, "penalty")}
    </div>
  )
}
