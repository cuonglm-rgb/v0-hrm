"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { approveEmployeeRequest, rejectEmployeeRequest } from "@/lib/actions/request-type-actions"
import type { EmployeeRequestWithRelations } from "@/lib/types/database"
import { formatDateVN, calculateLeaveDays } from "@/lib/utils/date-utils"
import { Check, X, Users, Clock, FileText, Filter, Search, Paperclip, ShieldCheck, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface ApproverInfo {
  employeeId: string
  fullName: string
  positionId: string | null
  positionName: string | null
  positionLevel: number
  roles: string[]
}

interface LeaveApprovalPanelProps {
  employeeRequests: (EmployeeRequestWithRelations & { my_approval_status?: string })[]
  approverInfo?: ApproverInfo | null
}

// Unified request type for combined list
interface UnifiedApprovalRequest {
  id: string
  typeName: string
  typeCode: string
  employeeName: string
  employeeCode: string
  fromDate: string | null
  toDate: string | null
  time: string | null
  reason: string | null
  status: string
  attachmentUrl: string | null
  createdAt: string
  myApprovalStatus?: string
  approvalMode?: string
  originalData: EmployeeRequestWithRelations & { my_approval_status?: string }
}

export function LeaveApprovalPanel({ employeeRequests, approverInfo }: LeaveApprovalPanelProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  // Filter states - mặc định hiển thị phiếu chờ duyệt
  const [filterStatus, setFilterStatus] = useState<string>("pending")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterFromDate, setFilterFromDate] = useState<string>("")
  const [filterToDate, setFilterToDate] = useState<string>("")
  const [searchText, setSearchText] = useState<string>("")

  // Combine and normalize all requests
  const allRequests = useMemo<UnifiedApprovalRequest[]>(() => {
    return employeeRequests.map((r) => ({
      id: r.id,
      typeName: r.request_type?.name || "N/A",
      typeCode: r.request_type?.code || "",
      employeeName: r.employee?.full_name || "N/A",
      employeeCode: r.employee?.employee_code || "",
      fromDate: r.from_date || r.request_date,
      toDate: r.to_date,
      time: r.request_time || (r.from_time && r.to_time ? `${r.from_time} - ${r.to_time}` : null),
      reason: r.reason,
      status: r.status,
      attachmentUrl: r.attachment_url,
      createdAt: r.created_at,
      myApprovalStatus: r.my_approval_status,
      approvalMode: r.request_type?.approval_mode,
      originalData: r,
    })).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [employeeRequests])

  // Get unique type options for filter
  const typeOptions = useMemo(() => {
    const types = new Map<string, string>()
    allRequests.forEach((r) => {
      if (!types.has(r.typeCode)) {
        types.set(r.typeCode, r.typeName)
      }
    })
    return Array.from(types.entries())
  }, [allRequests])

  // Stats
  const stats = useMemo(() => {
    const pending = allRequests.filter((r) => r.status === "pending")
    const approved = allRequests.filter((r) => r.status === "approved")
    const rejected = allRequests.filter((r) => r.status === "rejected")
    
    // Unique employees with pending requests
    const pendingEmployees = new Set(pending.map((r) => r.employeeCode))
    
    // Total leave days for pending (chỉ tính phiếu có date range)
    const pendingLeaveDays = pending
      .filter((r) => r.fromDate)
      .reduce((sum, r) => sum + calculateLeaveDays(
        r.fromDate, 
        r.toDate, 
        r.originalData.from_time, 
        r.originalData.to_time,
        r.originalData.request_type ? {
          requires_date_range: r.originalData.request_type.requires_date_range,
          requires_single_date: r.originalData.request_type.requires_single_date,
          requires_time_range: r.originalData.request_type.requires_time_range,
        } : undefined
      ), 0)

    return {
      total: allRequests.length,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
      pendingEmployees: pendingEmployees.size,
      pendingLeaveDays,
    }
  }, [allRequests])

  // Apply filters
  const filteredRequests = useMemo(() => {
    return allRequests.filter((r) => {
      // Filter by status
      if (filterStatus !== "all" && r.status !== filterStatus) return false

      // Filter by type
      if (filterType !== "all" && r.typeCode !== filterType) return false

      // Filter by date range
      if (filterFromDate && r.fromDate && r.fromDate < filterFromDate) return false
      if (filterToDate && r.fromDate && r.fromDate > filterToDate) return false

      // Search by employee name, code, or reason
      if (searchText) {
        const search = searchText.toLowerCase()
        const matchName = r.employeeName.toLowerCase().includes(search)
        const matchCode = r.employeeCode.toLowerCase().includes(search)
        const matchReason = r.reason?.toLowerCase().includes(search)
        const matchType = r.typeName.toLowerCase().includes(search)
        if (!matchName && !matchCode && !matchReason && !matchType) return false
      }

      return true
    })
  }, [allRequests, filterStatus, filterType, filterFromDate, filterToDate, searchText])

  const handleApprove = async (request: UnifiedApprovalRequest) => {
    setLoadingId(request.id)
    const result = await approveEmployeeRequest(request.id)
    setLoadingId(null)
    if (result.success) {
      if (result.message) {
        toast.success(result.message)
      } else {
        toast.success("Đã duyệt phiếu thành công")
      }
    } else {
      toast.error(result.error || "Có lỗi xảy ra khi duyệt phiếu")
    }
  }

  const handleReject = async (request: UnifiedApprovalRequest) => {
    const reason = prompt("Nhập lý do từ chối (không bắt buộc):")
    if (reason === null) return // User cancelled
    
    setLoadingId(request.id)
    const result = await rejectEmployeeRequest(request.id, reason || undefined)
    setLoadingId(null)
    if (result.success) {
      toast.success("Đã từ chối phiếu")
    } else {
      toast.error(result.error || "Có lỗi xảy ra khi từ chối phiếu")
    }
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

  const clearFilters = () => {
    setFilterStatus("pending")
    setFilterType("all")
    setFilterFromDate("")
    setFilterToDate("")
    setSearchText("")
  }

  const hasActiveFilters = filterStatus !== "pending" || filterType !== "all" || filterFromDate || filterToDate || searchText

  // Kiểm tra xem user có thể duyệt phiếu cụ thể không (dựa trên level)
  const canApproveRequest = (request: UnifiedApprovalRequest): boolean => {
    if (!approverInfo) return false
    const requestType = request.originalData.request_type
    if (!requestType) return true
    
    const { positionLevel } = approverInfo
    if (requestType.min_approver_level && positionLevel < requestType.min_approver_level) return false
    if (requestType.max_approver_level && positionLevel > requestType.max_approver_level) return false
    
    return true
  }

  return (
    <div className="space-y-6">
      {/* Thông tin quyền duyệt */}
      {approverInfo && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">
                  Quyền duyệt của bạn: {approverInfo.fullName}
                </p>
                <p className="text-sm text-blue-700">
                  Chức vụ: {approverInfo.positionName || "Chưa có"} (Level {approverInfo.positionLevel})
                  {approverInfo.roles.length > 0 && ` • Vai trò: ${approverInfo.roles.join(", ")}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Thống kê */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="text-sm text-muted-foreground">Chờ duyệt</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="text-sm text-muted-foreground">Đã duyệt</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <span className="text-sm text-muted-foreground">Từ chối</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.rejected}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">NV chờ duyệt</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.pendingEmployees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Ngày nghỉ chờ</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.pendingLeaveDays}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tên, mã NV, lý do..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Trạng thái</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Loại phiếu</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {typeOptions.map(([code, name]) => (
                    <SelectItem key={code} value={code}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Từ ngày</Label>
              <Input type="date" value={filterFromDate} onChange={(e) => setFilterFromDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Đến ngày</Label>
              <Input type="date" value={filterToDate} onChange={(e) => setFilterToDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">&nbsp;</Label>
              {hasActiveFilters && (
                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bảng danh sách */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Danh sách phiếu ({filteredRequests.length})
          </CardTitle>
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
                <TableHead>File</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    {hasActiveFilters ? "Không tìm thấy phiếu phù hợp" : "Không có phiếu nào"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.employeeName}</div>
                        <div className="text-sm text-muted-foreground">{request.employeeCode}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {request.typeName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.fromDate && request.toDate && request.fromDate !== request.toDate ? (
                        <span>{formatDateVN(request.fromDate)} - {formatDateVN(request.toDate)}</span>
                      ) : request.fromDate ? (
                        formatDateVN(request.fromDate)
                      ) : "-"}
                      {request.fromDate && (
                        <div className="text-xs text-muted-foreground">
                          {calculateLeaveDays(
                            request.fromDate, 
                            request.toDate, 
                            request.originalData.from_time, 
                            request.originalData.to_time,
                            request.originalData.request_type ? {
                              requires_date_range: request.originalData.request_type.requires_date_range,
                              requires_single_date: request.originalData.request_type.requires_single_date,
                              requires_time_range: request.originalData.request_type.requires_time_range,
                            } : undefined
                          )} ngày
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{request.time || "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{request.reason || "-"}</TableCell>
                    <TableCell>
                      {request.attachmentUrl ? (
                        <a 
                          href={request.attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Paperclip className="h-3 w-3" />
                          Xem
                        </a>
                      ) : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {request.status === "pending" ? (
                        <div className="flex flex-col gap-1">
                          {/* Nếu đã duyệt rồi (với approval_mode = all) */}
                          {request.myApprovalStatus === "approved" ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-sm">Bạn đã duyệt</span>
                            </div>
                          ) : request.myApprovalStatus === "rejected" ? (
                            <div className="flex items-center gap-2 text-red-600">
                              <X className="h-4 w-4" />
                              <span className="text-sm">Bạn đã từ chối</span>
                            </div>
                          ) : (
                            <>
                              {!canApproveRequest(request) && (
                                <span className="text-xs text-orange-600">
                                  Level {request.originalData.request_type?.min_approver_level || "?"} trở lên
                                </span>
                              )}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(request)}
                                  disabled={loadingId === request.id || !canApproveRequest(request)}
                                  className="gap-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                  title={!canApproveRequest(request) ? "Bạn không đủ quyền duyệt loại phiếu này" : ""}
                                >
                                  <Check className="h-4 w-4" />
                                  Duyệt
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(request)}
                                  disabled={loadingId === request.id || !canApproveRequest(request)}
                                  className="gap-1 text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50"
                                  title={!canApproveRequest(request) ? "Bạn không đủ quyền từ chối loại phiếu này" : ""}
                                >
                                  <X className="h-4 w-4" />
                                  Từ chối
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
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
