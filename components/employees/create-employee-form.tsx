"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Save, UserPlus, Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react"
import { createEmployee } from "@/lib/actions/employee-actions"
import { importEmployees } from "@/lib/actions/employee-import-actions"
import type { Department, Position } from "@/lib/types/database"
import * as XLSX from "xlsx"

interface CreateEmployeeFormProps {
  departments: Department[]
  positions: Position[]
}

// Column mapping from Vietnamese headers to internal keys
const COLUMN_MAPPING: Record<string, string> = {
  "MÃ NHÂN VIÊN": "employee_code",
  "HỌ TÊN": "full_name",
  "EMAIL": "email",
  "SỐ ĐIỆN THOẠI": "phone",
  "PHÒNG BAN": "department_name",
  "CHỨC VỤ PHÒNG BAN": "position_name",
  "NGÀY VÀO LÀM": "join_date",
  "NGÀY CHÍNH THỨC VÀO LÀM": "official_date",
  "MỨC LƯƠNG THÁNG": "base_salary",
  "CA LÀM VIỆC": "shift_name",
}

export function CreateEmployeeForm({ departments, positions }: CreateEmployeeFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: boolean
    total: number
    imported: number
    skipped: number
    errors: string[]
    salaryCreated?: number
    salaryUpdated?: number
  } | null>(null)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department_id: "",
    position_id: "",
    join_date: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.full_name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required")
      return
    }

    setSaving(true)
    try {
      const result = await createEmployee({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        department_id: formData.department_id || null,
        position_id: formData.position_id || null,
        join_date: formData.join_date || null,
      })

      if (result.success) {
        toast.success("Employee created successfully")
        router.push("/dashboard/employees")
      } else {
        toast.error(result.error || "Failed to create employee")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv"
    ]
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error("Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV")
      return
    }

    setImporting(true)
    setImportResult(null)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: "" })

      if (jsonData.length === 0) {
        toast.error("File không có dữ liệu")
        setImporting(false)
        return
      }

      // Map columns
      const mappedRows = jsonData.map(row => {
        const mapped: Record<string, any> = {}
        for (const [key, value] of Object.entries(row)) {
          const normalizedKey = key.trim().toUpperCase()
          const internalKey = COLUMN_MAPPING[normalizedKey]
          if (internalKey) {
            mapped[internalKey] = value
          }
        }
        return mapped
      })

      // Filter rows that have at least email and full_name
      const validRows = mappedRows.filter(row => row.email && row.full_name) as {
        employee_code?: string
        full_name: string
        email: string
        phone?: string
        department_name?: string
        position_name?: string
        join_date?: string | number
        official_date?: string | number
        base_salary?: number | string
        shift_name?: string
      }[]

      if (validRows.length === 0) {
        toast.error("Không tìm thấy dữ liệu hợp lệ. Vui lòng kiểm tra cột EMAIL và HỌ TÊN")
        setImporting(false)
        return
      }

      // Import
      const result = await importEmployees(validRows)
      setImportResult(result)

      if (result.imported > 0) {
        toast.success(`Đã import ${result.imported}/${result.total} nhân viên`)
      } else {
        toast.error("Không import được nhân viên nào")
      }
    } catch (error) {
      console.error("Import error:", error)
      toast.error("Lỗi khi đọc file")
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/employees">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Thêm nhân viên mới</h1>
          <p className="text-muted-foreground">Tạo nhân viên thủ công hoặc import từ file Excel</p>
        </div>
      </div>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import từ Excel
          </CardTitle>
          <CardDescription>
            Upload file Excel (.xlsx) hoặc CSV để import nhiều nhân viên cùng lúc.
            Khi nhân viên đăng nhập bằng email đã import, hệ thống sẽ tự động liên kết tài khoản.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
              id="import-file"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? "Đang import..." : "Chọn file"}
            </Button>
            <span className="text-sm text-muted-foreground">
              Hỗ trợ: .xlsx, .xls, .csv
            </span>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <p className="font-medium mb-2">Các cột được hỗ trợ:</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <span>• MÃ NHÂN VIÊN (tùy chọn)</span>
              <span>• HỌ TÊN (bắt buộc)</span>
              <span>• EMAIL (bắt buộc)</span>
              <span>• SỐ ĐIỆN THOẠI</span>
              <span>• PHÒNG BAN</span>
              <span>• CHỨC VỤ PHÒNG BAN</span>
              <span>• NGÀY VÀO LÀM (DD/MM/YYYY)</span>
              <span>• NGÀY CHÍNH THỨC VÀO LÀM</span>
              <span>• MỨC LƯƠNG THÁNG</span>
              <span>• CA LÀM VIỆC</span>
            </div>
          </div>

          {importResult && (
            <div className={`p-4 rounded-md ${importResult.success ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"}`}>
              <div className="flex items-center gap-2 mb-2">
                {importResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">
                  Kết quả: {importResult.imported}/{importResult.total} nhân viên đã import
                </span>
              </div>
              {(importResult.salaryCreated || importResult.salaryUpdated) && (
                <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                  <p>
                    Lương: {importResult.salaryCreated || 0} tạo mới, {importResult.salaryUpdated || 0} cập nhật
                  </p>
                </div>
              )}
              {importResult.errors.length > 0 && (
                <div className="mt-2 text-sm">
                  <p className="font-medium text-red-600 mb-1">Lỗi ({importResult.errors.length}):</p>
                  <ul className="list-disc list-inside space-y-1 max-h-32 overflow-y-auto">
                    {importResult.errors.slice(0, 10).map((err, i) => (
                      <li key={i} className="text-red-600">{err}</li>
                    ))}
                    {importResult.errors.length > 10 && (
                      <li className="text-muted-foreground">...và {importResult.errors.length - 10} lỗi khác</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Thêm thủ công
          </CardTitle>
          <CardDescription>Điền thông tin nhân viên. Mã nhân viên sẽ được tự động tạo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">
                  Họ tên <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Nhập họ tên"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Nhập địa chỉ email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="join_date">Ngày vào làm</Label>
                <Input
                  id="join_date"
                  type="date"
                  value={formData.join_date}
                  onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Phòng ban</Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Chức vụ</Label>
                <Select
                  value={formData.position_id}
                  onValueChange={(value) => setFormData({ ...formData, position_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chức vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos.id} value={pos.id}>
                        {pos.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/employees">Hủy</Link>
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Đang tạo..." : "Tạo nhân viên"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
