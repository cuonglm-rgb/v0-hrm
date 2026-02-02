"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon, Plus, Edit, Trash2, Filter, Check, ChevronsUpDown, Users } from "lucide-react"
import { toast } from "sonner"
import type { Employee } from "@/lib/types/database"
import {
  setSaturdaySchedule,
  bulkSetSaturdaySchedule,
  deleteSaturdaySchedule,
  type SaturdayScheduleWithEmployee,
} from "@/lib/actions/saturday-schedule-actions"
import { getSaturdaysInMonth, isSaturdayOffByDefault } from "@/lib/utils/saturday-utils"
import { cn } from "@/lib/utils"

interface EmployeeWithDepartment extends Employee {
  department: {
    id: string
    name: string
  } | null
}

interface SaturdaySchedulePanelProps {
  employees: EmployeeWithDepartment[]
  schedules: SaturdayScheduleWithEmployee[]
  canManageAll: boolean // level > 3
}

export function SaturdaySchedulePanel({
  employees,
  schedules,
  canManageAll,
}: SaturdaySchedulePanelProps) {
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filterMonth, setFilterMonth] = useState<string>(String(new Date().getMonth() + 1))
  const [filterYear, setFilterYear] = useState<string>(String(new Date().getFullYear()))
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [isWorking, setIsWorking] = useState(true)
  const [note, setNote] = useState("")
  const [openEmployeeSelect, setOpenEmployeeSelect] = useState(false)

  // Lấy danh sách thứ 7 trong tháng
  const saturdays = useMemo(() => {
    if (filterMonth === "all" || filterYear === "all") return []
    return getSaturdaysInMonth(parseInt(filterYear), parseInt(filterMonth))
  }, [filterMonth, filterYear])

  // Lọc schedules theo tháng/năm
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      if (filterMonth !== "all" && filterYear !== "all") {
        return s.work_date.startsWith(`${filterYear}-${String(filterMonth).padStart(2, '0')}`)
      }
      if (filterYear !== "all") {
        return s.work_date.startsWith(filterYear)
      }
      return true
    })
  }, [schedules, filterMonth, filterYear])

  // Group schedules by date
  const schedulesByDate = useMemo(() => {
    const map = new Map<string, SaturdayScheduleWithEmployee[]>()
    filteredSchedules.forEach((s) => {
      const list = map.get(s.work_date) || []
      list.push(s)
      map.set(s.work_date, list)
    })
    return map
  }, [filteredSchedules])

  // Lấy danh sách năm
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return [currentYear - 1, currentYear, currentYear + 1]
  }, [])

  const handleOpenDialog = () => {
    setSelectedEmployees([])
    setSelectedDate("")
    setIsWorking(true)
    setNote("")
    setShowDialog(true)
  }

  const handleSave = async () => {
    if (selectedEmployees.length === 0 || !selectedDate) {
      toast.error("Vui lòng chọn nhân viên và ngày")
      return
    }

    setSaving(true)
    try {
      const result = await bulkSetSaturdaySchedule({
        employee_ids: selectedEmployees,
        work_date: selectedDate,
        is_working: isWorking,
        note: note || undefined,
      })

      if (result.success) {
        toast.success(`Đã phân công cho ${result.count} nhân viên`)
        setShowDialog(false)
        router.refresh()
      } else {
        toast.error(result.error || "Có lỗi xảy ra")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa lịch này?")) return

    const result = await deleteSaturdaySchedule(id)
    if (result.success) {
      toast.success("Đã xóa")
      router.refresh()
    } else {
      toast.error(result.error || "Có lỗi xảy ra")
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date)
  }

  // Check if default schedule (xen kẽ)
  const getDefaultSchedule = (dateStr: string): boolean => {
    return isSaturdayOffByDefault(dateStr)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Lịch làm thứ 7
              </CardTitle>
              <CardDescription>
                Phân công lịch làm thứ 7 cho nhân viên (override lịch mặc định)
              </CardDescription>
            </div>
            <Button onClick={handleOpenDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Phân công
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bộ lọc */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Tháng:</span>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      Tháng {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Năm:</span>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hiển thị theo ngày */}
          {saturdays.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chọn tháng/năm để xem lịch thứ 7
            </div>
          ) : (
            <div className="space-y-4">
              {saturdays.map((saturday) => {
                const daySchedules = schedulesByDate.get(saturday) || []
                const defaultIsOff = getDefaultSchedule(saturday)

                return (
                  <Card key={saturday} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{formatDate(saturday)}</CardTitle>
                          <CardDescription className="text-xs">
                            Lịch mặc định: {defaultIsOff ? "Nghỉ" : "Làm việc"}
                          </CardDescription>
                        </div>
                        <Badge variant={daySchedules.length > 0 ? "default" : "secondary"}>
                          {daySchedules.length} nhân viên có lịch riêng
                        </Badge>
                      </div>
                    </CardHeader>
                    {daySchedules.length > 0 && (
                      <CardContent className="pt-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nhân viên</TableHead>
                              <TableHead>Phòng ban</TableHead>
                              <TableHead>Trạng thái</TableHead>
                              <TableHead>Ghi chú</TableHead>
                              <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {daySchedules.map((schedule) => (
                              <TableRow key={schedule.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{schedule.employee?.full_name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {schedule.employee?.employee_code}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {schedule.employee?.department?.name || "-"}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={schedule.is_working ? "default" : "secondary"}
                                    className={schedule.is_working ? "bg-green-100 text-green-800" : ""}
                                  >
                                    {schedule.is_working ? "Làm việc" : "Nghỉ"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {schedule.note || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(schedule.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog phân công */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Phân công lịch làm thứ 7</DialogTitle>
            <DialogDescription>
              Chọn nhân viên và ngày thứ 7 để phân công
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Chọn nhân viên *</Label>
              <Popover open={openEmployeeSelect} onOpenChange={setOpenEmployeeSelect}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedEmployees.length > 0
                      ? `Đã chọn ${selectedEmployees.length} nhân viên`
                      : "Chọn nhân viên..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[600px] p-0">
                  <Command>
                    <CommandInput placeholder="Tìm nhân viên..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy</CommandEmpty>
                      <CommandGroup>
                        {employees.map((emp) => (
                          <CommandItem
                            key={emp.id}
                            value={`${emp.employee_code} ${emp.full_name}`}
                            onSelect={() => {
                              setSelectedEmployees((prev) =>
                                prev.includes(emp.id)
                                  ? prev.filter((id) => id !== emp.id)
                                  : [...prev, emp.id]
                              )
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedEmployees.includes(emp.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">{emp.employee_code}</span>
                              <span>-</span>
                              <span>{emp.full_name}</span>
                              {emp.department && (
                                <span className="text-xs text-muted-foreground">
                                  ({emp.department.name})
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="work_date">Ngày thứ 7 *</Label>
              <Input
                id="work_date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <Label htmlFor="is_working">Trạng thái</Label>
                <p className="text-xs text-muted-foreground">
                  Bật = Làm việc, Tắt = Nghỉ
                </p>
              </div>
              <Switch
                id="is_working"
                checked={isWorking}
                onCheckedChange={setIsWorking}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                placeholder="Lý do phân công..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Đang lưu..." : "Phân công"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
