"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

const MONTHS = Array.from({ length: 12 }, (_, i) => `Th${i + 1}`)

export function MonthYearPicker({
  year,
  month,
  onChange,
  disabled,
  className,
}: {
  year: number
  month: number // 1-12
  onChange: (year: number, month: number) => void
  disabled?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(year)

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (o) setViewYear(year)
        setOpen(o)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn("h-7 min-w-[7.75rem] justify-center gap-1.5 font-medium", className)}
        >
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
          Tháng {month}/{year}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-56 p-3">
        <div className="mb-2 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setViewYear((v) => v - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">{viewYear}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setViewYear((v) => v + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {MONTHS.map((label, i) => {
            const m = i + 1
            const active = viewYear === year && m === month
            return (
              <Button
                key={m}
                variant={active ? "default" : "ghost"}
                size="sm"
                className="h-8"
                onClick={() => {
                  onChange(viewYear, m)
                  setOpen(false)
                }}
              >
                {label}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
