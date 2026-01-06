"use client"

import { useState, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { uploadRequestAttachment } from "@/lib/actions/upload-actions"
import type { RequestType, EmployeeRequestWithRelations } from "@/lib/types/database"
import { formatDateVN, calculateDays } from "@/lib/utils/date-utils"
import { Plus, X, Calendar, FileText, Paperclip, Upload, Loader2, Filter, Search } from "lucide-react"

interface LeaveRequestPanelProps {
  requestTypes: RequestType[]
  employeeRequests: EmployeeRequestWithRelations[]
}

// Unified request type for combined list
interface UnifiedRequest {
  id: string
  typeName: string
  typeCode: string
  fromDate: string | null
  toDate: string | null
  time: string | null
  reason: string | null
  status: string
  attachmentUrl: string | null
  createdAt: string
  originalData: EmployeeRequestWithRelations
}

export function LeaveRequestPanel({ requestTypes, employeeRequests }: LeaveRequestPanelProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<RequestType | null>(null)
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null)
  const [attachmentName, setAttachmentName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter states
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterFromDate, setFilterFromDate] = useState<string>("")
  const [filterToDate, setFilterToDate] = useState<string>("")
  const [searchText, setSearchText] = useState<string>("")

  // Normalize all requests
  const allRequests = useMemo<UnifiedRequest[]>(() => {
    return employeeRequests.map((r) => ({
      id: r.id,
      typeName: r.request_type?.name || "N/A",
      typeCode: r.request_type?.code || "",
      fromDate: r.from_date || r.request_date,
      toDate: r.to_date,
      time: r.request_time || (r.from_time && r.to_time ? `${r.from_time} - ${r.to_time}` : null),
      reason: r.reason,
      status: r.status,
      attachmentUrl: r.attachment_url,
      createdAt: r.created_at,
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

  // Apply filters
  const filteredRequests = useMemo(() => {
    return allRequests.filter((r) => {
      // Filter by type
      if (filterType !== "all" && r.typeCode !== filterType) return false

      // Filter by status
      if (filterStatus !== "all" && r.status !== filterStatus) return false

      // Filter by date range
      if (filterFromDate && r.fromDate && r.fromDate < filterFromDate) return false
      if (filterToDate && r.fromDate && r.fromDate > filterToDate) return false

      // Search by reason
      if (searchText && r.reason && !r.reason.toLowerCase().includes(searchText.toLowerCase())) {
        if (!r.typeName.toLowerCase().includes(searchText.toLowerCase())) {
          return false
        }
      }

      return true
    })
  }, [allRequests, filterType, filterStatus, filterFromDate, filterToDate, searchText])

  // Stats
  const stats = useMemo(() => ({
    total: allRequests.length,
    pending: allRequests.filter((r) => r.status === "pending").length,
    approved: allRequests.filter((r) => r.status === "approved").length,
    rejected: allRequests.filter((r) => r.status === "rejected").length,
  }), [allRequests])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("File không được vượt quá 5MB")
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadRequestAttachment(formData)

    if (result.success && result.url) {
      setAttachmentUrl(result.url)
      setAttachmentName(file.name)
    } else {
      setError(result.error || "Không thể upload file")
    }
    setUploading(false)
  }

  const handleRemoveAttachment = () => {
    setAttachmentUrl(null)
    setAttachmentName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

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
      from_time: selectedType.requires_time_range ? formData.get("from_time") as string : undefined,
      to_time: selectedType.requires_time_range ? formData.get("to_time") as string : undefined,
      reason: formData.get("reason") as string,
      attachment_url: attachmentUrl || undefined,
    })

    if (!result.success) {
      setError(result.error || "Không thể tạo phiếu")
    } else {
      setOpen(false)
      setSelectedType(null)
      setAttachmentUrl(null)
      setAttachmentName(null)
    }
    setLoading(false)
  }

  const handleCancel = async (request: UnifiedRequest) => {
    if (!confirm("Bạn có chắc muốn hủy phiếu này?")) return
    await cancelEmployeeRequest(request.id)
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
    setFilterType("all")
    setFilterStatus("all")
    setFilterFromDate("")
    setFilterToDate("")
    setSearchText("")
  }

  const hasActiveFilters = filterType !== "all" || filterStatus !== "all" || filterFromDate || filterToDate || searchText

  return (
    <div className="space-y-6">
      {/* Thống kê */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tổng phiếu</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </CardContent>
        </Card>
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
      </div>

      {/* Nút tạo phiếu */}
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setSelectedType(null); setError(null); setAttachmentUrl(null); setAttachmentName(null) } }}>
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
                {selectedType.requires_time_range && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Từ giờ *</Label>
                      <Input type="time" name="from_time" required />
                    </div>
                    <div className="grid gap-2">
                      <Label>Đến giờ *</Label>
                      <Input type="time" name="to_time" required />
                    </div>
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
                {selectedType.requires_attachment && (
                  <div className="grid gap-2">
                    <Label>File đính kèm *</Label>
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                      />
                      {!attachmentUrl ? (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Đang upload...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              Chọn file (PDF, DOC, JPG, PNG - tối đa 5MB)
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 w-full p-2 border rounded-md bg-muted/50">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1 truncate text-sm">{attachmentName}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={handleRemoveAttachment}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelectedType(null)}>Quay lại</Button>
                <Button type="submit" disabled={loading || (selectedType.requires_attachment && !attachmentUrl)}>
                  {loading ? "Đang gửi..." : "Gửi phiếu"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Bộ lọc */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo lý do..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-8"
                />
              </div>
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
              <Label className="text-xs">Từ ngày</Label>
              <Input type="date" value={filterFromDate} onChange={(e) => setFilterFromDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Đến ngày</Label>
              <div className="flex gap-2">
                <Input type="date" value={filterToDate} onChange={(e) => setFilterToDate(e.target.value)} />
                {hasActiveFilters && (
                  <Button variant="ghost" size="icon" onClick={clearFilters} title="Xóa bộ lọc">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bảng danh sách */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Danh sách phiếu ({filteredRequests.length})
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
                <TableHead>File</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    {hasActiveFilters ? "Không tìm thấy phiếu phù hợp" : "Chưa có phiếu nào"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
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
                      {request.fromDate && request.toDate && (
                        <div className="text-xs text-muted-foreground">
                          {calculateDays(request.fromDate, request.toDate)} ngày
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
                      {request.status === "pending" && (
                        <Button variant="ghost" size="sm" onClick={() => handleCancel(request)}>
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
