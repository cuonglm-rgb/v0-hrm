"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createEmployeeRequest, cancelEmployeeRequest } from "@/lib/actions/request-type-actions"
import { cancelLeaveRequest } from "@/lib/actions/leave-actions"
import type { LeaveRequest, RequestType, EmployeeRequestWithRelations } from "@/lib/types/database"
import { formatDateVN, calculateDays } from "@/lib/utils/date-utils"
import { Plus, X, Calendar, Clock, FileText } from "lucide-react"

interface LeaveRequestPanelProps {
  leaveRequests: LeaveRequest[]
  requestTypes: RequestType[]
  employeeRequests: EmployeeRequestWithRelations[]
}

export function LeaveRequestPanel({ leaveRequests, requestTypes, employeeRequests }: LeaveRequestPanelProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<RequestType | null>(null)

  const handleSubmitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedType) return

    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    const result = await createEmployeeRequest({
      request_type_id: selectedType.id,
      from_date: selectedType.requires_date_range ? formData.get("from_date") as string : undefined,
      to_date: selectedType.requires_date_range ? formData.get("to_date") as string : undefined,
      request_date: selectedType.requires_single_date ? formData.get("request_date") as string : undefined,
      request_time: selectedType.requires_time ? formData.get("request_time") as string : undefined,
      reason: formData.get("reason") as string,
    })

    if (!result.success) {
      setError(result.error || "Không thể tạo phiếu")
    } else {
      setOpen(false)
      setSelectedType(null)
    }
    setLoading(false)
  }

  const handleCancelLeave = async (id: string) => {
    if (!confirm("Bạn có chắc muốn hủy đơn này?")) return
    await cancelLeaveRequest(id)
  }

  const handleCancelRequest = async (id: string) => {
    if (!confirm("Bạn có chắc muốn hủy phiếu này?")) return
    await cancelEmployeeRequest(id)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã duyệt</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Từ chối</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ duyệt</Badge>
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

  // Thống kê
  const pendingLeave = leaveRequests.filter((r) => r.status === "pending").length
  const pendingRequest = employeeRequests.filter((r) => r.status === "pending").length
  const approvedLeave = leaveRequests.filter((r) => r.status === "approved").length
  const approvedRequest = employeeRequests.filter((r) => r.status === "approved").length

  return (
    <div className="space-y-6">
      {/* Thống kê */}
      <div className="grid grid-cols-4 gap-4">
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
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="text-sm text-muted-foreground">Chờ duyệt</span>
            </div>
            <p className="text-2xl font-bold mt-1">{pendingLeave + pendingRequest}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="text-sm text-muted-foreground">Đã duyệt</span>
            </div>
            <p className="text-2xl font-bold mt-1">{approvedLeave + approvedRequest}</p>
          </CardContent>
        </Card>
      </div>

      {/* Nút tạo phiếu */}
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setSelectedType(null); setError(null) } }}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tạo phiếu mới
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          {!selectedType ? (
            <>
              <DialogHeader>
                <DialogTitle>Chọn loại phiếu</DialogTitle>
                <DialogDescription>Chọn loại phiếu bạn muốn tạo</DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 py-4 max-h-[400px] overflow-y-auto">
                {requestTypes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Chưa có loại phiếu nào được cấu hình
                  </p>
                ) : (
                  requestTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant="outline"
                      className="justify-start h-auto py-3 px-4"
                      onClick={() => setSelectedType(type)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{type.name}</div>
                        {type.description && (
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        )}
                      </div>
                    </Button>
                  ))
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmitRequest}>
              <DialogHeader>
                <DialogTitle>{selectedType.name}</DialogTitle>
                <DialogDescription>{selectedType.description}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {selectedType.requires_date_range && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Từ ngày *</Label>
                      <Input type="date" name="from_date" required />
                    </div>
                    <div className="grid gap-2">
                      <Label>Đến ngày *</Label>
                      <Input type="date" name="to_date" required />
                    </div>
                  </div>
                )}
                {selectedType.requires_single_date && (
                  <div className="grid gap-2">
                    <Label>Ngày *</Label>
                    <Input type="date" name="request_date" required />
                  </div>
                )}
                {selectedType.requires_time && (
                  <div className="grid gap-2">
                    <Label>Giờ *</Label>
                    <Input type="time" name="request_time" required />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label>Lý do {selectedType.requires_reason && "*"}</Label>
                  <Textarea 
                    name="reason" 
                    placeholder="Nhập lý do..." 
                    required={selectedType.requires_reason}
                    rows={3}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelectedType(null)}>Quay lại</Button>
                <Button type="submit" disabled={loading}>{loading ? "Đang gửi..." : "Gửi phiếu"}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Tabs danh sách */}
      <Tabs defaultValue="leave">
        <TabsList>
          <TabsTrigger value="leave">Đơn nghỉ phép ({leaveRequests.length})</TabsTrigger>
          <TabsTrigger value="other">Phiếu khác ({employeeRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="leave" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Danh sách đơn nghỉ phép
              </CardTitle>
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
                        <TableCell>
                          <Badge variant="secondary">{getLeaveTypeLabel(request.leave_type)}</Badge>
                        </TableCell>
                        <TableCell>{formatDateVN(request.from_date)}</TableCell>
                        <TableCell>{formatDateVN(request.to_date)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {calculateDays(request.from_date, request.to_date)} ngày
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{request.reason || "-"}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {request.status === "pending" && (
                            <Button variant="ghost" size="sm" onClick={() => handleCancelLeave(request.id)}>
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
        </TabsContent>

        <TabsContent value="other" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Danh sách phiếu khác
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loại phiếu</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Giờ</TableHead>
                    <TableHead>Lý do</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Chưa có phiếu nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    employeeRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <Badge variant="secondary">{request.request_type?.name || "N/A"}</Badge>
                        </TableCell>
                        <TableCell>
                          {request.from_date && request.to_date ? (
                            <span>{formatDateVN(request.from_date)} - {formatDateVN(request.to_date)}</span>
                          ) : request.request_date ? (
                            formatDateVN(request.request_date)
                          ) : "-"}
                        </TableCell>
                        <TableCell>{request.request_time || "-"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{request.reason || "-"}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {request.status === "pending" && (
                            <Button variant="ghost" size="sm" onClick={() => handleCancelRequest(request.id)}>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
