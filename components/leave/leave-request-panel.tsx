"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createLeaveRequest, cancelLeaveRequest } from "@/lib/actions/leave-actions"
import type { LeaveRequest, LeaveType } from "@/lib/types/database"
import { formatDateVN, calculateDays } from "@/lib/utils/date-utils"
import { CalendarPlus, X, Calendar, Clock } from "lucide-react"

interface LeaveRequestPanelProps {
  leaveRequests: LeaveRequest[]
}

export function LeaveRequestPanel({ leaveRequests }: LeaveRequestPanelProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createLeaveRequest({
      leave_type: formData.get("leave_type") as LeaveType,
      from_date: formData.get("from_date") as string,
      to_date: formData.get("to_date") as string,
      reason: formData.get("reason") as string,
    })

    if (!result.success) {
      setError(result.error || "Không thể tạo đơn nghỉ phép")
    } else {
      setOpen(false)
    }
    setLoading(false)
  }

  const handleCancel = async (id: string) => {
    if (!confirm("Bạn có chắc muốn hủy đơn này?")) return
    await cancelLeaveRequest(id)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">🟢 Đã duyệt</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">🔴 Từ chối</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">🟡 Chờ duyệt</Badge>
    }
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

  // Thống kê
  const pendingCount = leaveRequests.filter((r) => r.status === "pending").length
  const approvedCount = leaveRequests.filter((r) => r.status === "approved").length
  const rejectedCount = leaveRequests.filter((r) => r.status === "rejected").length

  return (
    <div className="space-y-6">
      {/* Thống kê */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="text-sm text-muted-foreground">Chờ duyệt</span>
            </div>
            <p className="text-2xl font-bold mt-1">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="text-sm text-muted-foreground">Đã duyệt</span>
            </div>
            <p className="text-2xl font-bold mt-1">{approvedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <span className="text-sm text-muted-foreground">Từ chối</span>
            </div>
            <p className="text-2xl font-bold mt-1">{rejectedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Nút tạo đơn */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <CalendarPlus className="h-4 w-4" />
            Tạo đơn nghỉ phép
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Tạo đơn nghỉ phép</DialogTitle>
              <DialogDescription>
                Điền thông tin để gửi đơn xin nghỉ phép
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="leave_type">Loại nghỉ phép</Label>
                <Select name="leave_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại nghỉ phép" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Nghỉ phép năm</SelectItem>
                    <SelectItem value="sick">Nghỉ ốm</SelectItem>
                    <SelectItem value="unpaid">Nghỉ không lương</SelectItem>
                    <SelectItem value="maternity">Nghỉ thai sản</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="from_date">Từ ngày</Label>
                  <Input type="date" name="from_date" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to_date">Đến ngày</Label>
                  <Input type="date" name="to_date" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">Lý do</Label>
                <Input name="reason" placeholder="Nhập lý do (không bắt buộc)" />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi đơn"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bảng danh sách đơn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Danh sách đơn nghỉ phép
          </CardTitle>
          <CardDescription>Các đơn nghỉ phép bạn đã gửi</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại</TableHead>
                <TableHead>Từ ngày</TableHead>
                <TableHead>Đến ngày</TableHead>
                <TableHead>Số ngày</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Chưa có đơn nghỉ phép nào
                  </TableCell>
                </TableRow>
              ) : (
                leaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{getLeaveTypeBadge(request.leave_type)}</TableCell>
                    <TableCell>{formatDateVN(request.from_date)}</TableCell>
                    <TableCell>{formatDateVN(request.to_date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {calculateDays(request.from_date, request.to_date)} ngày
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {request.reason || "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(request.id)}
                          title="Hủy đơn"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
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
