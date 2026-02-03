"use client"

import * as React from "react"
import { X, Users, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { EmployeeWithRelations } from "@/lib/types/database"

interface EmployeeOption {
  id: string
  full_name: string
  employee_code: string | null
  department?: { name: string } | null
  position?: { name: string } | null
}

interface EmployeeMultiSelectProps {
  employees: EmployeeOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  loading?: boolean
  placeholder?: string
  disabled?: boolean
  maxHeight?: string
}

export function EmployeeMultiSelect({
  employees,
  selected,
  onChange,
  loading = false,
  placeholder = "Tìm nhân viên...",
  disabled = false,
  maxHeight = "200px",
}: EmployeeMultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedEmployees = employees.filter((e) => selected.includes(e.id))

  // Filter by search
  const filteredEmployees = employees.filter((e) => {
    const search = inputValue.toLowerCase()
    return (
      e.full_name.toLowerCase().includes(search) ||
      (e.employee_code?.toLowerCase().includes(search) ?? false) ||
      (e.department?.name?.toLowerCase().includes(search) ?? false) ||
      (e.position?.name?.toLowerCase().includes(search) ?? false)
    )
  })

  const handleToggle = (employeeId: string) => {
    if (selected.includes(employeeId)) {
      onChange(selected.filter((id) => id !== employeeId))
    } else {
      onChange([...selected, employeeId])
    }
  }

  const handleRemove = (employeeId: string) => {
    onChange(selected.filter((id) => id !== employeeId))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && inputValue === "" && selected.length > 0) {
      onChange(selected.slice(0, -1))
    }
  }

  const handleSelectAll = () => {
    const allIds = filteredEmployees.map(e => e.id)
    const newSelected = [...new Set([...selected, ...allIds])]
    onChange(newSelected)
  }

  const handleClearAll = () => {
    onChange([])
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "flex min-h-10 w-full flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.focus()
            setOpen(true)
          }
        }}
      >
        {selectedEmployees.length > 0 && selectedEmployees.length <= 3 ? (
          selectedEmployees.map((employee) => (
            <Badge key={employee.id} variant="secondary" className="gap-1 pr-1">
              <span className="max-w-[120px] truncate">{employee.full_name}</span>
              <button
                type="button"
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(employee.id)
                }}
                disabled={disabled}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))
        ) : selectedEmployees.length > 3 ? (
          <Badge variant="secondary" className="gap-1">
            <Users className="h-3 w-3" />
            <span>{selectedEmployees.length} nhân viên được chọn</span>
            <button
              type="button"
              className="ml-1 rounded-full outline-none"
              onClick={(e) => {
                e.stopPropagation()
                handleClearAll()
              }}
              disabled={disabled}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ) : null}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
          disabled={disabled}
        />
      </div>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Đang tải...
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {inputValue ? "Không tìm thấy nhân viên" : "Không có nhân viên nào"}
            </div>
          ) : (
            <>
              {/* Quick actions */}
              <div className="flex items-center justify-between border-b px-2 py-1.5">
                <span className="text-xs text-muted-foreground">
                  {selected.length}/{employees.length} đã chọn
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={handleSelectAll}
                  >
                    Chọn tất cả
                  </button>
                  {selected.length > 0 && (
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:underline"
                      onClick={handleClearAll}
                    >
                      Bỏ chọn
                    </button>
                  )}
                </div>
              </div>
              <div className="overflow-y-auto p-1" style={{ maxHeight }}>
                {filteredEmployees.map((employee) => {
                  const isSelected = selected.includes(employee.id)
                  return (
                    <div
                      key={employee.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-sm px-2 py-2 hover:bg-accent",
                        isSelected && "bg-accent/50"
                      )}
                      onClick={() => handleToggle(employee.id)}
                    >
                      <div className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border",
                        isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                      )}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {employee.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {employee.full_name}
                          {employee.employee_code && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({employee.employee_code})
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {[employee.position?.name, employee.department?.name].filter(Boolean).join(" • ")}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
