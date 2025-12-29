"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { approveLeaveRequest, rejectLeaveRequest } from "@/lib/actions/leave-actions"
import { approveEmployeeRequest, rejectEmployeeRequest } from "@/lib/actions/request-type-actions"
import type { LeaveRequestWithRelations, EmployeeRequestWithRelations } from "@/lib/types/database"
import { formatDateVN, calculateDays } from "@/lib/utils/date-utils"
import { Check, X, Users, Clock, Calendar, FileText } from "lucide-react"

interface LeaveApprovalPanelProps {
  leaveRequests: LeaveRequestWithRelations[]
  employeeRequests?: EmployeeRequestWithRelations[]
}

export function LeaveApprovalPanel({ leaveRequests, employeeRequests = [] }: LeaveApprovalPanelProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleApproveLeave = async (id: string) => {
    setLoadingId(id)
    await approveLeaveRequest(id)
    setLoadingId(null)
  }

  const handleRejectLeave = async (id: string) => {
    if (!confirm("Bạn có chắc muốn từ chối đơn này?")) return
    setLoadingId(id)
    await rejectLeaveRequest(id)
    setLoadingId(null)
  }

  const handleApproveRequest = async (id: string) => {
    setLoadingId(id)
    await approveEmployeeRequest(id)
    setLoadingId(null)
  }

  const handleRejectRequest = async (id: string) => {
    if (!confirm("Bạn có chắc muốn từ chối phiếu này?")) return
    setLoadingId(id)
    await rejectEmployeeRequest(id)
    setLoadingId(null)
  }

  const getLeaveTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      annual: "Nghỉ phép năm",
      sick: "Nghỉ ốm",
      unpaid: "Nghỉ không lương",
      maternity: "Nghỉ thai sản",
      other: "Khác",
    }
    return labels[type] || type
  }

  const getLeaveTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      annual: "bg-blue-100 text-blue-800",
      sick: "bg-orange-100 text-orange-800",
      unpaid: "bg-gray-100 text-gray-800",
      maternity: "bg-pink-100 text-pink-800",
      other: "bg-purple-100 text-purple-800",
    }
    return (
      <Badge className={`${colors[type] || colors.other} hover:${colors[type] || colors.other}`}>
        {getLeaveTypeLabel(type)}
      </Badge>
    )
  }

  // Nhóm theo nhân viên
  const groupedByEmployee = leaveRequests.reduce(
    (acc, request) => {
      const empId = request.employee_id
      if (!acc[empId]) {
        acc[empId] = {
          employee: request.employee,
          requests: [],
        }
      }
      acc[empId].requests.push(request)
      return acc
    },
    {} as Record<string, { employee: (typeof leaveRequests)[0]["employee"]; requests: typeof leaveRequests }>
  )

  const totalDays = leaveRequests.reduce(
    (sum, r) => sum + calculateDays(r.from_date, r.to_date),
    0
  )

  const totalRequests = leaveRequests.length + employeeRequests.length

  return (
    <div className="space-y-6">
      {/* Thống kê */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Nhân viên</span>
            </div>
            <p className="text-2xl font-bold mt-1">{Object.keys(groupedByEmployee).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Đơn nghỉ phép</span>
            </div>
            <p className="text-2xl font-bold mt-1">{leaveRequests.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Phiếu khác</span>
            </div>
            <p className="text-2xl font-bold mt-1">{employeeRequests.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tổng ngày nghỉ</span>
            </div>
            <p className="text-2xl font-bold mt-1">{totalDays}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leave">
        <TabsList>
          <TabsTrigger value="leave">Đơn nghỉ phép ({leaveRequests.length})</TabsTrigger>
          <TabsTrigger value="other">Phiếu khác ({employeeRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="leave" className="mt-4">
          {/* Bảng đơn nghỉ phép */}
          <Card>
            <CardHeader>
              <CardTitle>Đơn nghỉ phép chờ duyệt</CardTitle>
              <CardDescription>{leaveRequests.length} đơn đang chờ xử lý</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Từ ngày</TableHead>
                    <TableHead>Đến ngày</TableHead>
                    <TableHead>Số ngày</TableHead>
                    <TableHead>Lý do</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        Không có đơn nào chờ duyệt
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.employee?.full_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {request.employee?.employee_code}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getLeaveTypeBadge(request.leave_type)}</TableCell>
                        <TableCell>{formatDateVN(request.from_date)}</TableCell>
                        <TableCell>{formatDateVN(request.to_date)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {calculateDays(request.from_date, request.to_date)} ngày
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.reason || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveLeave(request.id)}
                              disabled={loadingId === request.id}
                              className="gap-1 bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4" />
                              Duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectLeave(request.id)}
                              disabled={loadingId === request.id}
                              className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                              Từ chối
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="mt-4">
          {/* Bảng phiếu khác */}
          <Card>
            <CardHeader>
              <CardTitle>Phiếu yêu cầu khác</CardTitle>
              <CardDescription>{employeeRequests.length} phiếu đang chờ xử lý</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead>Loại phiếu</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Giờ</TableHead>
                    <TableHead>Lý do</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Không có phiếu nào chờ duyệt
                      </TableCell>
                    </TableRow>
                  ) : (
                    employeeRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.employee?.full_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {request.employee?.employee_code}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {request.request_type?.name || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.from_date && request.to_date ? (
                            <span>
                              {formatDateVN(request.from_date)} - {formatDateVN(request.to_date)}
                            </span>
                          ) : request.request_date ? (
                            formatDateVN(request.request_date)
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{request.request_time || "-"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.reason || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveRequest(request.id)}
                              disabled={loadingId === request.id}
                              className="gap-1 bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4" />
                              Duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectRequest(request.id)}
                              disabled={loadingId === request.id}
                              className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                              Từ chối
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
