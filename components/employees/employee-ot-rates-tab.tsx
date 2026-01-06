"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Timer, Plus, Trash2, Info } from "lucide-react"
import { toast } from "sonner"
import {
  listOTSettings,
  listEmployeeOTRates,
  createEmployeeOTRate,
  deleteEmployeeOTRate,
} from "@/lib/actions/overtime-actions"
import type { OTSetting, EmployeeOTRateWithRelations } from "@/lib/types/database"

interface EmployeeOTRatesTabProps {
  employeeId: string
  isHROrAdmin: boolean
}

export function EmployeeOTRatesTab({ employeeId, isHROrAdmin }: EmployeeOTRatesTabProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [otSettings, setOTSettings] = useState<OTSetting[]>([])
  const [employeeRates, setEmployeeRates] = useState<EmployeeOTRateWithRelations[]>([])
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState<EmployeeOTRateWithRelations | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    ot_setting_id: "",
    multiplier: "",
    effective_date: new Date().toISOString().split("T")[0],
    end_date: "",
    note: "",
  })

  useEffect(() => {
    loadData()
  }, [employeeId])

  const loadData = async () => {
    setLoading(true)
    const [settings, rates] = await Promise.all([
      listOTSettings(),
      listEmployeeOTRates(employeeId),
    ])
    setOTSettings(settings)
    setEmployeeRates(rates)
    setLoading(false)
  }

  const handleOpenCreate = () => {
    setFormData({
      ot_setting_id: otSettings[0]?.id || "",
      multiplier: "",
      effective_date: new Date().toISOString().split("T")[0],
      end_date: "",
      note: "",
    })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!formData.ot_setting_id) {
      toast.error("Vui lòng chọn loại OT")
      return
    }
    if (!formData.multiplier || parseFloat(formData.multiplier) <= 0) {
      toast.error("Hệ số phải lớn hơn 0")
      return
    }

    setSaving(true)
    try {
      const result = await createEmployeeOTRate({
        employee_id: employeeId,
        ot_setting_id: formData.ot_setting_id,
        multiplier: parseFloat(formData.multiplier),
        effective_date: formData.effective_date,
        end_date: formData.end_date || undefined,
        note: formData.note || undefined,
      })

      if (result.success) {
        toast.success("Đã thêm hệ số OT riêng")
        setOpen(false)
        loadData()
      } else {
        toast.error(result.error)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    const result = await deleteEmployeeOTRate(deleting.id)
    if (result.success) {
      toast.success("Đã xóa")
      loadData()
    } else {
      toast.error(result.error)
    }
    setDeleting(null)
  }

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 3) return "bg-red-100 text-red-700"
    if (multiplier >= 2) return "bg-orange-100 text-orange-700"
    return "bg-green-100 text-green-700"
  }

  const selectedSetting = otSettings.find((s) => s.id === formData.ot_setting_id)

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Đang tải...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Hệ số tăng ca riêng
          </CardTitle>
          <CardDescription>
            Override hệ số OT mặc định cho nhân viên này
          </CardDescription>
        </div>
        {isHROrAdmin && (
          <Button size="sm" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-1" />
            Thêm
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {/* Hiển thị hệ số mặc định */}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium flex items-center gap-1 mb-2">
            <Info className="h-4 w-4" />
            Hệ số mặc định (áp dụng nếu không có hệ số riêng):
          </p>
          <div className="flex flex-wrap gap-2">
            {otSettings.map((setting) => (
              <Badge key={setting.id} variant="outline" className="text-xs">
                {setting.name}: <span className="font-bold ml-1">x{setting.multiplier}</span>
              </Badge>
            ))}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loại OT</TableHead>
              <TableHead className="text-center">Hệ số riêng</TableHead>
              <TableHead>Hiệu lực từ</TableHead>
              <TableHead>Đến ngày</TableHead>
              <TableHead>Ghi chú</TableHead>
              {isHROrAdmin && <TableHead className="text-right">Thao tác</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeeRates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isHROrAdmin ? 6 : 5} className="text-center py-6 text-muted-foreground">
                  Chưa có hệ số riêng. Sẽ sử dụng hệ số mặc định.
                </TableCell>
              </TableRow>
            ) : (
              employeeRates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-medium">
                    {rate.ot_setting?.name || "N/A"}
                    <span className="text-xs text-muted-foreground ml-1">
                      (mặc định: x{rate.ot_setting?.multiplier})
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getMultiplierColor(rate.multiplier)}>
                      x{rate.multiplier}
                    </Badge>
                  </TableCell>
                  <TableCell>{rate.effective_date}</TableCell>
                  <TableCell>{rate.end_date || "Không giới hạn"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {rate.note || "-"}
                  </TableCell>
                  {isHROrAdmin && (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleting(rate)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog thêm */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm hệ số OT riêng</DialogTitle>
            <DialogDescription>
              Hệ số này sẽ override hệ số mặc định khi tính lương OT
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Loại OT *</Label>
              <Select
                value={formData.ot_setting_id}
                onValueChange={(v) => {
                  const setting = otSettings.find((s) => s.id === v)
                  setFormData({
                    ...formData,
                    ot_setting_id: v,
                    multiplier: setting?.multiplier.toString() || "",
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại OT" />
                </SelectTrigger>
                <SelectContent>
                  {otSettings.map((setting) => (
                    <SelectItem key={setting.id} value={setting.id}>
                      {setting.name} (mặc định: x{setting.multiplier})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="multiplier">Hệ số riêng *</Label>
              <Input
                id="multiplier"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.multiplier}
                onChange={(e) => setFormData({ ...formData, multiplier: e.target.value })}
                placeholder={selectedSetting ? `Mặc định: ${selectedSetting.multiplier}` : "VD: 1.5"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effective_date">Hiệu lực từ *</Label>
                <Input
                  id="effective_date"
                  type="date"
                  value={formData.effective_date}
                  onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Đến ngày</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Input
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="VD: Theo hợp đồng đặc biệt"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa hệ số OT riêng này? Nhân viên sẽ sử dụng hệ số mặc định.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
