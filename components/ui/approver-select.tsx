"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk"
import { cn } from "@/lib/utils"
import type { EligibleApprover } from "@/lib/types/database"

interface ApproverSelectProps {
  approvers: EligibleApprover[]
  selected: string[]
  onChange: (selected: string[]) => void
  loading?: boolean
  placeholder?: string
  disabled?: boolean
}

export function ApproverSelect({
  approvers,
  selected,
  onChange,
  loading = false,
  placeholder = "Tìm người duyệt...",
  disabled = false,
}: ApproverSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [dropdownPos, setDropdownPos] = React.useState<{
    left: number
    top: number
    width: number
    maxHeight: number
    placement: "bottom" | "top"
  } | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const selectedApprovers = approvers.filter((a) => selected.includes(a.id))
  const availableApprovers = approvers.filter((a) => !selected.includes(a.id))

  // Filter by search
  const filteredApprovers = availableApprovers.filter((a) => {
    const search = inputValue.toLowerCase()
    return (
      a.full_name.toLowerCase().includes(search) ||
      (a.employee_code?.toLowerCase().includes(search) ?? false) ||
      (a.position_name?.toLowerCase().includes(search) ?? false) ||
      (a.department_name?.toLowerCase().includes(search) ?? false)
    )
  })

  const handleSelect = (approverId: string) => {
    onChange([...selected, approverId])
    setInputValue("")
  }

  const handleRemove = (approverId: string) => {
    onChange(selected.filter((id) => id !== approverId))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && inputValue === "" && selected.length > 0) {
      onChange(selected.slice(0, -1))
    }
  }

  // Compute dropdown position (fixed, via portal) so it is never clipped by
  // the modal's scroll container. Flips above the field when space is tight.
  const updatePosition = React.useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const margin = 8
    const spaceBelow = window.innerHeight - rect.bottom - margin
    const spaceAbove = rect.top - margin
    const placement = spaceBelow < 220 && spaceAbove > spaceBelow ? "top" : "bottom"
    const maxHeight = Math.max(160, Math.min(280, placement === "bottom" ? spaceBelow : spaceAbove))
    setDropdownPos({
      left: rect.left,
      top: placement === "bottom" ? rect.bottom + 4 : rect.top - 4,
      width: rect.width,
      maxHeight,
      placement,
    })
  }, [])

  React.useLayoutEffect(() => {
    if (!open) return
    updatePosition()
    window.addEventListener("resize", updatePosition)
    // Reposition on scroll of any ancestor (e.g. the modal body)
    window.addEventListener("scroll", updatePosition, true)
    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [open, updatePosition])

  // Reposition when the selected badges reflow the field height
  React.useLayoutEffect(() => {
    if (open) updatePosition()
  }, [open, selected.length, updatePosition])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !(dropdownRef.current && dropdownRef.current.contains(target))
      ) {
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
        {selectedApprovers.map((approver) => (
          <Badge key={approver.id} variant="secondary" className="gap-1 pr-1">
            <span className="max-w-[150px] truncate">{approver.full_name}</span>
            {approver.position_name && (
              <span className="text-xs text-muted-foreground">({approver.position_name})</span>
            )}
            <button
              type="button"
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={(e) => {
                e.stopPropagation()
                handleRemove(approver.id)
              }}
              disabled={disabled}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
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

      {open && !disabled && dropdownPos && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            left: dropdownPos.left,
            top: dropdownPos.placement === "bottom" ? dropdownPos.top : undefined,
            bottom:
              dropdownPos.placement === "top"
                ? window.innerHeight - dropdownPos.top
                : undefined,
            width: dropdownPos.width,
          }}
          className="z-[100] rounded-md border bg-popover shadow-md"
        >
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Đang tải...
            </div>
          ) : filteredApprovers.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {inputValue ? "Không tìm thấy người duyệt" : "Không có người duyệt khả dụng"}
            </div>
          ) : (
            <div className="overflow-y-auto p-1" style={{ maxHeight: dropdownPos.maxHeight }}>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Gợi ý
              </div>
              {filteredApprovers.map((approver) => (
                <div
                  key={approver.id}
                  className="flex cursor-pointer items-center gap-3 rounded-sm px-2 py-2 hover:bg-accent"
                  onClick={() => handleSelect(approver.id)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {approver.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{approver.full_name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {[approver.position_name, approver.department_name].filter(Boolean).join(" • ")}
                    </div>
                  </div>
                  {approver.position_level > 0 && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      Lv.{approver.position_level}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}
