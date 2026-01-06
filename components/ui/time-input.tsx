"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

interface TimeInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
  name?: string
  required?: boolean
  minuteStep?: number // 1, 5, 10, 15, 30
}

function TimeInput({
  value,
  onChange,
  placeholder = "HH:mm",
  disabled = false,
  className,
  id,
  name,
  required,
  minuteStep = 5,
}: TimeInputProps) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(value || "")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const hourScrollRef = React.useRef<HTMLDivElement>(null)
  const minuteScrollRef = React.useRef<HTMLDivElement>(null)

  // Handle wheel scroll manually
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollTop += e.deltaY
    }
  }

  // Sync internal value with prop
  React.useEffect(() => {
    setInternalValue(value || "")
  }, [value])

  // Generate hours (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, "0")
  )

  // Generate minutes 00-59
  const minutes = Array.from(
    { length: 60 }, 
    (_, i) => i.toString().padStart(2, "0")
  )

  const [selectedHour, selectedMinute] = React.useMemo(() => {
    if (internalValue) {
      const parts = internalValue.split(":")
      return [parts[0] || "00", parts[1] || "00"]
    }
    return ["", ""]
  }, [internalValue])

  const handleHourSelect = (hour: string) => {
    const newValue = `${hour}:${selectedMinute || "00"}`
    setInternalValue(newValue)
    onChange?.(newValue)
  }

  const handleMinuteSelect = (minute: string) => {
    const newValue = `${selectedHour || "00"}:${minute}`
    setInternalValue(newValue)
    onChange?.(newValue)
  }

  // Handle direct input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    
    // Auto-format: add colon after 2 digits
    if (val.length === 2 && !val.includes(":")) {
      val = val + ":"
    }
    
    // Only allow valid time characters
    if (/^[0-9:]*$/.test(val) && val.length <= 5) {
      setInternalValue(val)
      
      // Validate and emit if complete
      if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val)) {
        // Normalize format (e.g., 9:00 -> 09:00)
        const [h, m] = val.split(":")
        const normalized = `${h.padStart(2, "0")}:${m}`
        setInternalValue(normalized)
        onChange?.(normalized)
      }
    }
  }

  const handleInputBlur = () => {
    // On blur, try to normalize partial input
    if (internalValue && !internalValue.includes(":")) {
      const num = parseInt(internalValue, 10)
      if (!isNaN(num) && num >= 0 && num <= 23) {
        const normalized = `${num.toString().padStart(2, "0")}:00`
        setInternalValue(normalized)
        onChange?.(normalized)
      }
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur()
      setOpen(false)
    }
  }

  return (
    <>
      {/* Hidden input for form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={internalValue}
          required={required}
        />
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !internalValue && "text-muted-foreground",
              className
            )}
          >
            <Clock className="mr-2 h-4 w-4" />
            {internalValue || placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          {/* Direct input field */}
          <div className="p-3 border-b">
            <Input
              ref={inputRef}
              value={internalValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              placeholder="HH:mm"
              className="text-center text-lg font-mono"
              autoFocus
            />
          </div>
          
          <div className="grid grid-cols-2">
            {/* Hour selector */}
            <div className="border-r">
              <div className="text-xs font-medium text-muted-foreground py-2 px-3 text-center border-b bg-muted/30">
                Giờ
              </div>
              <div 
                ref={hourScrollRef}
                className="h-[200px] overflow-y-auto p-1"
                onWheel={(e) => handleWheel(e, hourScrollRef)}
              >
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    variant={selectedHour === hour ? "default" : "ghost"}
                    size="sm"
                    className="w-full h-9 text-sm font-mono justify-center"
                    onClick={() => handleHourSelect(hour)}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Minute selector */}
            <div>
              <div className="text-xs font-medium text-muted-foreground py-2 px-3 text-center border-b bg-muted/30">
                Phút
              </div>
              <div 
                ref={minuteScrollRef}
                className="h-[200px] overflow-y-auto p-1"
                onWheel={(e) => handleWheel(e, minuteScrollRef)}
              >
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    variant={selectedMinute === minute ? "default" : "ghost"}
                    size="sm"
                    className="w-full h-9 text-sm font-mono justify-center"
                    onClick={() => handleMinuteSelect(minute)}
                  >
                    {minute}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="border-t p-2 flex justify-end">
            <Button size="sm" onClick={() => setOpen(false)}>
              Xong
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}

export { TimeInput }
