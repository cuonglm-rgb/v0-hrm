"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TimeInput } from "@/components/ui/time-input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ApproverSelect } from "@/components/ui/approver-select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createEmployeeRequest, updateEmployeeRequest, cancelEmployeeRequest, getEligibleApprovers, getRequestAssignedApprovers } from "@/lib/actions/request-type-actions"
import { uploadRequestAttachment } from "@/lib/actions/upload-actions"
import type { RequestType, EmployeeRequestWithRelations, EligibleApprover, CustomField } from "@/lib/types/database"
import { formatDateVN, calculateDays, calculateLeaveDays } from "@/lib/utils/date-utils"
import { validateTimeSlot, validateNoOverlap, addTimeSlot, removeTimeSlot, getTimeSlotsWithFallback, formatTimeSlots } from "@/lib/utils/time-slot-utils"
import { Plus, X, Calendar, FileText, Paperclip, Upload, Loader2, Filter, Search, Users, Edit, Clock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react"

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
  
  // Custom field images
  const [customFieldImages, setCustomFieldImages] = useState<Record<string, { url: string; name: string }>>({})
  const [uploadingFieldId, setUploadingFieldId] = useState<string | null>(null)
  const customFieldInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  
  // Multi time slots
  const [timeSlots, setTimeSlots] = useState<{ from_time: string; to_time: string }[]>([{ from_time: "", to_time: "" }])

  // Edit mode
  const [editingRequest, setEditingRequest] = useState<UnifiedRequest | null>(null)

  // Detail view mode
  const [viewingRequest, setViewingRequest] = useState<UnifiedRequest | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [assignedApprovers, setAssignedApprovers] = useState<Array<{
    id: string
    approver_id: string
    status: string
    display_order: number
    approver?: { id: string; full_name: string; employee_code: string } | null
  }>>([])
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Người duyệt
  const [eligibleApprovers, setEligibleApprovers] = useState<EligibleApprover[]>([])
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([])
  const [loadingApprovers, setLoadingApprovers] = useState(false)

  // Filter states
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterFromDate, setFilterFromDate] = useState<string>("")
  const [filterToDate, setFilterToDate] = useState<string>("")
  const [searchText, setSearchText] = useState<string>("")

  // Load danh sách người duyệt khi chọn loại phiếu
  const selectedTypeId = selectedType?.id
  useEffect(() => {
    if (selectedTypeId) {
      let cancelled = false
      setLoadingApprovers(true)
      setSelectedApprovers([])
      setEligibleApprovers([])
      
      getEligibleApprovers(selectedTypeId)
        .then(approvers => {
          if (!cancelled) {
            setEligibleApprovers(approvers)
          }
        })
        .finally(() => {
          if (!cancelled) {
            setLoadingApprovers(false)
          }
        })
      
      return () => {
        cancelled = true
      }
    } else {
      setEligibleApprovers([])
      setSelectedApprovers([])
    }
  }, [selectedTypeId])

  // Reset timeSlots khi đổi loại phiếu
  useEffect(() => {
    setTimeSlots([{ from_time: "", to_time: "" }])
  }, [selectedTypeId])

  // Normalize all requests
  const allRequests = useMemo<UnifiedRequest[]>(() => {
    return employeeRequests.map((r) => ({
      id: r.id,
      typeName: r.request_type?.name || "N/A",
      typeCode: r.request_type?.code || "",
      fromDate: r.from_date || r.request_date,
      toDate: r.to_date,
      time: r.request_time || (() => {
        const slots = getTimeSlotsWithFallback(r.time_slots, r.from_time, r.to_time)
        return slots.length > 0 ? formatTimeSlots(slots) : null
      })(),
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

  const handleCustomFieldImageUpload = async (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("File không được vượt quá 5MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file hình ảnh")
      return
    }

    setUploadingFieldId(fieldId)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadRequestAttachment(formData)

    if (result.success && result.url) {
      setCustomFieldImages(prev => ({
        ...prev,
        [fieldId]: { url: result.url!, name: file.name }
      }))
    } else {
      setError(result.error || "Không thể upload hình ảnh")
    }
    setUploadingFieldId(null)
  }

  const handleRemoveCustomFieldImage = (fieldId: string) => {
    setCustomFieldImages(prev => {
      const newImages = { ...prev }
      delete newImages[fieldId]
      return newImages
    })
    const inputRef = customFieldInputRefs.current[fieldId]
    if (inputRef) {
      inputRef.value = ""
    }
  }

  const handleSubmitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedType) return

    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    // Validate multi time slots nếu loại phiếu hỗ trợ
    if (selectedType.allows_multiple_time_slots) {
      const filledSlots = timeSlots.filter(s => s.from_time || s.to_time)
      
      // Kiểm tra ít nhất 1 slot có đầy đủ from_time và to_time
      const completeSlots = timeSlots.filter(s => s.from_time && s.to_time)
      if (completeSlots.length === 0) {
        setError("Vui lòng nhập đầy đủ giờ bắt đầu và kết thúc cho ít nhất 1 khung giờ")
        setLoading(false)
        return
      }

      // Kiểm tra slot có from_time hoặc to_time trống (nhập dở)
      for (const slot of filledSlots) {
        if (!slot.from_time || !slot.to_time) {
          setError("Vui lòng nhập đầy đủ giờ bắt đầu và kết thúc")
          setLoading(false)
          return
        }
      }

      // Validate từng slot: from < to
      for (const slot of completeSlots) {
        const result = validateTimeSlot(slot.from_time, slot.to_time)
        if (!result.valid) {
          setError(result.error || "Khung giờ không hợp lệ")
          setLoading(false)
          return
        }
      }

      // Validate không chồng chéo
      if (completeSlots.length > 1) {
        const overlapResult = validateNoOverlap(completeSlots)
        if (!overlapResult.valid) {
          setError(overlapResult.error || "Các khung giờ không được chồng chéo")
          setLoading(false)
          return
        }
      }
    }

    // Thu thập custom_data từ custom fields
    let customData: Record<string, string> | undefined = undefined
    if (selectedType.custom_fields && selectedType.custom_fields.length > 0) {
      customData = {}
      for (const field of selectedType.custom_fields) {
        if (field.type === "image") {
          const imageData = customFieldImages[field.id]
          if (imageData?.url) {
            customData[field.id] = imageData.url
          }
        } else {
          const value = formData.get(`custom_${field.id}`) as string
          if (value) {
            customData[field.id] = value
          }
        }
      }
      if (Object.keys(customData).length === 0) {
        customData = undefined
      }
    }

    // Chuẩn bị time_slots cho multi-slot
    const validTimeSlots = selectedType.allows_multiple_time_slots
      ? timeSlots.filter(s => s.from_time && s.to_time)
      : undefined
    
    const requestData = {
      from_date: selectedType.requires_date_range ? formData.get("from_date") as string : undefined,
      to_date: selectedType.requires_date_range ? formData.get("to_date") as string : undefined,
      request_date: selectedType.requires_single_date ? formData.get("request_date") as string : undefined,
      request_time: selectedType.requires_time ? formData.get("request_time") as string : undefined,
      from_time: (selectedType.requires_time_range && !selectedType.allows_multiple_time_slots) ? formData.get("from_time") as string : undefined,
      to_time: (selectedType.requires_time_range && !selectedType.allows_multiple_time_slots) ? formData.get("to_time") as string : undefined,
      reason: formData.get("reason") as string,
      attachment_url: attachmentUrl || undefined,
      assigned_approver_ids: selectedApprovers.length > 0 ? selectedApprovers : undefined,
      custom_data: customData,
      time_slots: validTimeSlots,
    }
    
    let result
    if (editingRequest) {
      // Update existing request
      result = await updateEmployeeRequest(editingRequest.id, requestData)
    } else {
      // Create new request
      result = await createEmployeeRequest({
        request_type_id: selectedType.id,
        ...requestData,
      })
    }

    if (!result.success) {
      setError(result.error || (editingRequest ? "Không thể cập nhật phiếu" : "Không thể tạo phiếu"))
    } else {
      setOpen(false)
      setSelectedType(null)
      setAttachmentUrl(null)
      setAttachmentName(null)
      setSelectedApprovers([])
      setEligibleApprovers([])
      setEditingRequest(null)
      setCustomFieldImages({})
      setTimeSlots([{ from_time: "", to_time: "" }])
    }
    setLoading(false)
  }

  const handleEdit = (request: UnifiedRequest) => {
    setEditingRequest(request)
    const requestType = requestTypes.find(rt => rt.id === request.originalData.request_type_id)
    if (requestType) {
      setSelectedType(requestType)
      // Load time slots for editing
      if (requestType.allows_multiple_time_slots) {
        const slots = getTimeSlotsWithFallback(
          request.originalData.time_slots,
          request.originalData.from_time,
          request.originalData.to_time
        )
        setTimeSlots(slots.length > 0 ? slots : [{ from_time: "", to_time: "" }])
      } else {
        setTimeSlots([{ from_time: "", to_time: "" }])
      }
      setAttachmentUrl(request.attachmentUrl)
      setAttachmentName(request.attachmentUrl ? "File đính kèm" : null)
      setOpen(true)
    }
  }

  const handleViewDetail = async (request: UnifiedRequest) => {
    setViewingRequest(request)
    setViewDialogOpen(true)
    setLoadingDetail(true)
    
    try {
      const approvers = await getRequestAssignedApprovers(request.id)
      setAssignedApprovers(approvers)
    } catch (error) {
      console.error("Error loading approvers:", error)
      setAssignedApprovers([])
    } finally {
      setLoadingDetail(false)
    }
  }

  const getApproverStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getApproverStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Đã duyệt"
      case "rejected":
        return "Từ chối"
      default:
        return "Chờ duyệt"
    }
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
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setSelectedType(null); setError(null); setAttachmentUrl(null); setAttachmentName(null); setSelectedApprovers([]); setEligibleApprovers([]); setEditingRequest(null); setCustomFieldImages({}); setTimeSlots([{ from_time: "", to_time: "" }]) } }}>
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
                <DialogTitle>{editingRequest ? "Sửa phiếu" : selectedType.name}</DialogTitle>
                <DialogDescription>{editingRequest ? selectedType.name : selectedType.description}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {selectedType.requires_date_range && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Từ ngày *</Label>
                      <Input 
                        type="date" 
                        name="from_date" 
                        required 
                        defaultValue={editingRequest?.originalData.from_date || ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Đến ngày *</Label>
                      <Input 
                        type="date" 
                        name="to_date" 
                        required 
                        defaultValue={editingRequest?.originalData.to_date || ""}
                      />
                    </div>
                  </div>
                )}
                {selectedType.requires_single_date && (
                  <div className="grid gap-2">
                    <Label>Ngày *</Label>
                    <Input 
                      type="date" 
                      name="request_date" 
                      required 
                      defaultValue={editingRequest?.originalData.request_date || ""}
                    />
                  </div>
                )}
                {selectedType.requires_time && (
                  <div className="grid gap-2">
                    <Label>Giờ *</Label>
                    <TimeInput 
                      name="request_time" 
                      required 
                      value={editingRequest?.originalData.request_time || undefined}
                    />
                  </div>
                )}
                {selectedType.requires_time_range && !selectedType.allows_multiple_time_slots && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Từ giờ *</Label>
                      <TimeInput 
                        name="from_time" 
                        required 
                        value={editingRequest?.originalData.from_time || undefined}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Đến giờ *</Label>
                      <TimeInput 
                        name="to_time" 
                        required 
                        value={editingRequest?.originalData.to_time || undefined}
                      />
                    </div>
                  </div>
                )}
                {selectedType.allows_multiple_time_slots && (
                  <div className="space-y-3">
                    <Label>Khung giờ *</Label>
                    {timeSlots.map((slot, index) => (
                      <div key={index} className="flex items-end gap-2">
                        <div className="grid gap-1 flex-1">
                          <Label className="text-xs">Từ giờ</Label>
                          <TimeInput
                            value={slot.from_time}
                            onChange={(val) => {
                              const updated = [...timeSlots]
                              updated[index] = { ...updated[index], from_time: val }
                              setTimeSlots(updated)
                            }}
                          />
                        </div>
                        <div className="grid gap-1 flex-1">
                          <Label className="text-xs">Đến giờ</Label>
                          <TimeInput
                            value={slot.to_time}
                            onChange={(val) => {
                              const updated = [...timeSlots]
                              updated[index] = { ...updated[index], to_time: val }
                              setTimeSlots(updated)
                            }}
                          />
                        </div>
                        {timeSlots.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => setTimeSlots(removeTimeSlot(timeSlots, index))}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => setTimeSlots(addTimeSlot(timeSlots))}>
                      <Plus className="h-4 w-4 mr-1" />
                      Thêm khung giờ
                    </Button>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label>Lý do {selectedType.requires_reason && "*"}</Label>
                  <Textarea 
                    name="reason" 
                    placeholder="Nhập lý do..." 
                    required={selectedType.requires_reason}
                    rows={3}
                    defaultValue={editingRequest?.reason || ""}
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
                
                {/* Phần chọn người duyệt */}
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Người duyệt *
                  </Label>
                  <ApproverSelect
                    approvers={eligibleApprovers}
                    selected={selectedApprovers}
                    onChange={setSelectedApprovers}
                    loading={loadingApprovers}
                    placeholder="Tìm người duyệt..."
                  />
                  {eligibleApprovers.length > 0 && selectedApprovers.length === 0 && (
                    <p className="text-sm text-destructive">Vui lòng chọn ít nhất 1 người duyệt</p>
                  )}
                </div>

                {/* Custom fields */}
                {selectedType.custom_fields && selectedType.custom_fields.length > 0 && (
                  <div className="space-y-4 border-t pt-4">
                    <Label className="text-sm font-medium">Thông tin bổ sung</Label>
                    {selectedType.custom_fields.map((field) => (
                      <div key={field.id} className="grid gap-2">
                        <Label>
                          {field.label} {field.required && "*"}
                        </Label>
                        {field.type === "text" && (
                          <Input
                            name={`custom_${field.id}`}
                            placeholder={field.placeholder}
                            required={field.required}
                            defaultValue={editingRequest?.originalData.custom_data?.[field.id] || ""}
                          />
                        )}
                        {field.type === "textarea" && (
                          <Textarea
                            name={`custom_${field.id}`}
                            placeholder={field.placeholder}
                            required={field.required}
                            rows={3}
                            defaultValue={editingRequest?.originalData.custom_data?.[field.id] || ""}
                          />
                        )}
                        {field.type === "number" && (
                          <Input
                            type="number"
                            name={`custom_${field.id}`}
                            placeholder={field.placeholder}
                            required={field.required}
                            defaultValue={editingRequest?.originalData.custom_data?.[field.id] || ""}
                          />
                        )}
                        {field.type === "select" && field.options && (
                          <Select
                            name={`custom_${field.id}`}
                            required={field.required}
                            defaultValue={editingRequest?.originalData.custom_data?.[field.id] || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={field.placeholder || "Chọn..."} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {field.type === "image" && (
                          <div className="space-y-2">
                            <input
                              ref={(el) => { customFieldInputRefs.current[field.id] = el }}
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleCustomFieldImageUpload(field.id, e)}
                            />
                            {!customFieldImages[field.id]?.url && !editingRequest?.originalData.custom_data?.[field.id] ? (
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full gap-2"
                                onClick={() => customFieldInputRefs.current[field.id]?.click()}
                                disabled={uploadingFieldId === field.id}
                              >
                                {uploadingFieldId === field.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Đang upload...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4" />
                                    Chọn hình ảnh (tối đa 5MB)
                                  </>
                                )}
                              </Button>
                            ) : (
                              <div className="space-y-2">
                                <div className="relative border rounded-md overflow-hidden">
                                  <img 
                                    src={customFieldImages[field.id]?.url || editingRequest?.originalData.custom_data?.[field.id]} 
                                    alt={field.label}
                                    className="w-full h-40 object-contain bg-muted"
                                  />
                                  <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="sm" 
                                    className="absolute top-2 right-2"
                                    onClick={() => handleRemoveCustomFieldImage(field.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                  {customFieldImages[field.id]?.name || "Hình ảnh đã upload"}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setSelectedType(null); setEditingRequest(null) }}>Quay lại</Button>
                <Button 
                  type="submit" 
                  disabled={
                    loading || 
                    (selectedType.requires_attachment && !attachmentUrl) ||
                    (eligibleApprovers.length > 0 && selectedApprovers.length === 0)
                  }
                >
                  {loading ? (editingRequest ? "Đang cập nhật..." : "Đang gửi...") : (editingRequest ? "Cập nhật" : "Gửi phiếu")}
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
                  <TableRow 
                    key={request.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewDetail(request)}
                  >
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
                            request.originalData.to_time
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
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Paperclip className="h-3 w-3" />
                          Xem
                        </a>
                      ) : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(request)} title="Sửa phiếu">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleCancel(request)} title="Hủy phiếu">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog xem chi tiết phiếu */}
      <Dialog open={viewDialogOpen} onOpenChange={(o) => { setViewDialogOpen(o); if (!o) { setViewingRequest(null); setAssignedApprovers([]) } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Chi tiết phiếu
            </DialogTitle>
            <DialogDescription>
              {viewingRequest?.typeName}
            </DialogDescription>
          </DialogHeader>
          
          {viewingRequest && (
            <div className="space-y-4">
              {/* Trạng thái */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Trạng thái</span>
                {getStatusBadge(viewingRequest.status)}
              </div>

              {/* Thông tin ngày giờ */}
              <div className="space-y-3">
                {viewingRequest.fromDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Ngày</p>
                      <p className="text-sm text-muted-foreground">
                        {viewingRequest.fromDate && viewingRequest.originalData.to_date && viewingRequest.fromDate !== viewingRequest.originalData.to_date ? (
                          <>
                            {formatDateVN(viewingRequest.fromDate)} - {formatDateVN(viewingRequest.originalData.to_date)}
                            <span className="ml-2">
                              ({calculateLeaveDays(
                                viewingRequest.fromDate, 
                                viewingRequest.originalData.to_date, 
                                viewingRequest.originalData.from_time, 
                                viewingRequest.originalData.to_time
                              )} ngày)
                            </span>
                          </>
                        ) : (
                          formatDateVN(viewingRequest.fromDate)
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {viewingRequest.time && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Giờ</p>
                      {(() => {
                        const slots = getTimeSlotsWithFallback(
                          viewingRequest.originalData.time_slots,
                          viewingRequest.originalData.from_time,
                          viewingRequest.originalData.to_time
                        )
                        if (slots.length > 1) {
                          return (
                            <div className="space-y-1">
                              {slots.map((slot, i) => (
                                <p key={i} className="text-sm text-muted-foreground">
                                  Khung {i + 1}: {slot.from_time} - {slot.to_time}
                                </p>
                              ))}
                            </div>
                          )
                        }
                        return <p className="text-sm text-muted-foreground">{viewingRequest.time}</p>
                      })()}
                    </div>
                  </div>
                )}

                {viewingRequest.reason && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Lý do</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingRequest.reason}</p>
                    </div>
                  </div>
                )}

                {viewingRequest.attachmentUrl && (
                  <div className="flex items-start gap-3">
                    <Paperclip className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">File đính kèm</p>
                      <a 
                        href={viewingRequest.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Xem file
                      </a>
                    </div>
                  </div>
                )}

                {/* Custom fields */}
                {viewingRequest.originalData.custom_data && Object.keys(viewingRequest.originalData.custom_data).length > 0 && (
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm font-medium mb-2">Thông tin bổ sung</p>
                    {Object.entries(viewingRequest.originalData.custom_data).map(([key, value]) => {
                      const requestType = requestTypes.find(rt => rt.id === viewingRequest.originalData.request_type_id)
                      const field = requestType?.custom_fields?.find(f => f.id === key)
                      const isImage = field?.type === "image" || (typeof value === "string" && (value.includes("/storage/") || value.match(/\.(jpg|jpeg|png|gif|webp)$/i)))
                      return (
                        <div key={key} className="flex items-start gap-3 mb-2">
                          <div className="text-sm w-full">
                            <span className="text-muted-foreground">{field?.label || key}:</span>
                            {isImage ? (
                              <div className="mt-2">
                                <a href={value} target="_blank" rel="noopener noreferrer">
                                  <img 
                                    src={value} 
                                    alt={field?.label || key}
                                    className="max-w-full h-40 object-contain rounded-md border cursor-pointer hover:opacity-80"
                                  />
                                </a>
                              </div>
                            ) : (
                              <span className="ml-1">{value}</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Lý do từ chối */}
                {viewingRequest.status === "rejected" && viewingRequest.originalData.rejection_reason && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <XCircle className="h-4 w-4 mt-0.5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Lý do từ chối</p>
                      <p className="text-sm text-red-700">{viewingRequest.originalData.rejection_reason}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Danh sách người duyệt */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Người duyệt</p>
                </div>
                
                {loadingDetail ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : assignedApprovers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Không có thông tin người duyệt</p>
                ) : (
                  <div className="space-y-2">
                    {assignedApprovers.map((approver, index) => (
                      <div key={approver.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-5">{index + 1}.</span>
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{approver.approver?.full_name || "N/A"}</p>
                            <p className="text-xs text-muted-foreground">{approver.approver?.employee_code || ""}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getApproverStatusIcon(approver.status)}
                          <span className="text-xs">{getApproverStatusText(approver.status)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Thời gian tạo */}
              <div className="border-t pt-3 text-xs text-muted-foreground">
                Tạo lúc: {new Date(viewingRequest.createdAt).toLocaleString("vi-VN")}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
