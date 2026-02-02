"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { AttendancePanel } from "@/components/attendance/attendance-panel"
import type { AttendanceLog, WorkShift, EmployeeRequestWithRelations, Employee } from "@/lib/types/database"
import type { Holiday } from "@/lib/actions/attendance-actions"
import type { SpecialWorkDay } from "@/lib/types/database"
import type { SaturdaySchedule } from "@/lib/actions/saturday-schedule-actions"
import { Users, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmployeeWithShift extends Employee {
  shift?: WorkShift | null
}

interface AttendanceManagementViewProps {
  employees: EmployeeWithShift[]
  attendanceLogs: AttendanceLog[]
  leaveRequests: EmployeeRequestWithRelations[]
  holidays: Holiday[]
  specialDays: SpecialWorkDay[]
  saturdaySchedules: SaturdaySchedule[]
}

export function AttendanceManagementView({
  employees,
  attendanceLogs,
  leaveRequests,
  holidays,
  specialDays,
  saturdaySchedules,
}: AttendanceManagementViewProps) {
  const [open, setOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    employees[0]?.id || ""
  )

  // Lọc dữ liệu theo nhân viên được chọn
  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmployeeId)
  }, [employees, selectedEmployeeId])

  const filteredAttendanceLogs = useMemo(() => {
    return attendanceLogs.filter((log) => log.employee_id === selectedEmployeeId)
  }, [attendanceLogs, selectedEmployeeId])

  const filteredLeaveRequests = useMemo(() => {
    return leaveRequests.filter((req) => req.employee_id === selectedEmployeeId)
  }, [leaveRequests, selectedEmployeeId])

  const filteredSaturdaySchedules = useMemo(() => {
    return saturdaySchedules.filter((sch) => sch.employee_id === selectedEmployeeId)
  }, [saturdaySchedules, selectedEmployeeId])

  return (
    <div className="space-y-6">
      {/* Employee Selector with Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Chọn nhân viên
          </CardTitle>
          <CardDescription>Xem lịch sử chấm công của nhân viên</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedEmployee ? (
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {selectedEmployee.employee_code}
                    </span>
                    <span>-</span>
                    <span>{selectedEmployee.full_name}</span>
                  </span>
                ) : (
                  "Chọn nhân viên..."
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[600px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Tìm theo mã NV, tên, email..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy nhân viên</CommandEmpty>
                  <CommandGroup>
                    {employees.map((emp) => (
                      <CommandItem
                        key={emp.id}
                        value={`${emp.employee_code} ${emp.full_name} ${emp.email || ""}`}
                        onSelect={() => {
                          setSelectedEmployeeId(emp.id)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedEmployeeId === emp.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            {emp.employee_code}
                          </span>
                          <span>-</span>
                          <span>{emp.full_name}</span>
                          {emp.email && (
                            <span className="text-xs text-muted-foreground">
                              ({emp.email})
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

          {/* Selected Employee Info */}
          {selectedEmployee && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Mã NV:</span>
                  <span className="ml-2 font-medium">{selectedEmployee.employee_code}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Họ tên:</span>
                  <span className="ml-2 font-medium">{selectedEmployee.full_name}</span>
                </div>
                {selectedEmployee.shift && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Ca làm:</span>
                    <span className="ml-2 font-medium">
                      {selectedEmployee.shift.name} (Ca {selectedEmployee.shift.start_time?.slice(0, 5)} - {selectedEmployee.shift.end_time?.slice(0, 5)}
                      {selectedEmployee.shift.break_start && selectedEmployee.shift.break_end && (
                        <>; Nghỉ: {selectedEmployee.shift.break_start.slice(0, 5)} - {selectedEmployee.shift.break_end.slice(0, 5)}</>
                      )})
                    </span>
                  </div>
                )}
                {selectedEmployee.email && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="ml-2 font-medium">{selectedEmployee.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Panel - giống hệt /dashboard/attendance */}
      {selectedEmployee && (
        <AttendancePanel
          attendanceLogs={filteredAttendanceLogs}
          shift={selectedEmployee.shift}
          leaveRequests={filteredLeaveRequests}
          officialDate={selectedEmployee.official_date}
          holidays={holidays}
          specialDays={specialDays}
          saturdaySchedules={filteredSaturdaySchedules}
        />
      )}
    </div>
  )
}
