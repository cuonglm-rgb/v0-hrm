"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { PayrollItemWithRelations } from "@/lib/types/database"
import { formatCurrency } from "@/lib/utils/format-utils"
import { Wallet, Calendar, TrendingUp, TrendingDown } from "lucide-react"

interface PayslipPanelProps {
  payslips: PayrollItemWithRelations[]
}

export function PayslipPanel({ payslips }: PayslipPanelProps) {
  const latestPayslip = payslips[0]

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">✅ Đã trả</Badge>
      case "locked":
        return <Badge className="bg-blue-100 text-blue-800">🔒 Đã khóa</Badge>
      default:
        return <Badge variant="secondary">Chờ xử lý</Badge>
    }
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
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
