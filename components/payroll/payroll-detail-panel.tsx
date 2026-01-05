"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { lockPayroll, markPayrollPaid } from "@/lib/actions/payroll-actions"
import { PayrollBreakdownDialog } from "./payroll-breakdown-dialog"
import type { PayrollRun, PayrollItemWithRelations } from "@/lib/types/database"
import { formatCurrency } from "@/lib/utils/format-utils"
import { ArrowLeft, Lock, CheckCircle, Users, Wallet, Calculator, Eye } from "lucide-react"

const STANDARD_WORKING_DAYS = 26

interface PayrollDetailPanelProps {
  payrollRun: PayrollRun
  payrollItems: PayrollItemWithRelations[]
}

export function PayrollDetailPanel({ payrollRun, payrollItems }: PayrollDetailPanelProps) {
  const [loading, setLoading] = useState<"lock" | "paid" | null>(null)
  const [selectedItem, setSelectedItem] = useState<PayrollItemWithRelations | null>(null)
  const [showBreakdown, setShowBreakdown] = useState(false)

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
                    onClick={() => {
                      setSelectedItem(item)
                      setShowBreakdown(true)
                    }}
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
                          setSelectedItem(item)
                          setShowBreakdown(true)
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
      <PayrollBreakdownDialog
        open={showBreakdown}
        onOpenChange={setShowBreakdown}
        payrollItem={selectedItem}
        standardWorkingDays={STANDARD_WORKING_DAYS}
        month={payrollRun.month}
        year={payrollRun.year}
      />
    </div>
  )
}
