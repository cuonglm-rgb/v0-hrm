"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { MonthYearPicker } from "./month-year-picker"
import { cn } from "@/lib/utils"
import { getLastDayOfMonthVN, getTodayVN } from "@/lib/utils/date-utils"
import { getCalendarEvents, type CalendarEvent, type CalendarEventType } from "@/lib/actions/dashboard-actions"

const TYPE_DOT: Record<CalendarEventType, string> = {
  onboard: "bg-emerald-500",
  offboard: "bg-rose-500",
  leave: "bg-sky-500",
  wfh: "bg-violet-500",
  overtime: "bg-amber-500",
}

const LEGEND: { type: CalendarEventType; label: string }[] = [
  { type: "onboard", label: "Onboard" },
  { type: "offboard", label: "Offboard" },
  { type: "leave", label: "Nghỉ phép" },
  { type: "wfh", label: "Làm việc tại nhà" },
  { type: "overtime", label: "Tăng ca" },
]

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

function monthRange(year: number, month: number) {
  const from = `${year}-${String(month).padStart(2, "0")}-01`
  const to = getLastDayOfMonthVN(year, month)
  return { from, to }
}

// Ô lưới cho tháng, tuần bắt đầu từ Thứ 2
function buildGrid(year: number, month: number): (number | null)[] {
  const firstDow = new Date(Date.UTC(year, month - 1, 1)).getUTCDay() // 0=CN
  const lead = (firstDow + 6) % 7 // số ô trống trước ngày 1 (T2=0)
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < lead; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function EventsCalendarWidget({
  initialYear,
  initialMonth,
  initialEvents,
}: {
  initialYear: number
  initialMonth: number
  initialEvents: CalendarEvent[]
}) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [isPending, startTransition] = useTransition()

  const today = getTodayVN()

  const load = (y: number, m: number) => {
    setYear(y)
    setMonth(m)
    const { from, to } = monthRange(y, m)
    startTransition(async () => {
      const data = await getCalendarEvents(from, to)
      setEvents(data)
    })
  }

  const goPrev = () => {
    const m = month === 1 ? 12 : month - 1
    const y = month === 1 ? year - 1 : year
    load(y, m)
  }
  const goNext = () => {
    const m = month === 12 ? 1 : month + 1
    const y = month === 12 ? year + 1 : year
    load(y, m)
  }
  const goToday = () => {
    const [ty, tm] = today.split("-").map(Number)
    load(ty, tm)
  }

  const eventsByDay = new Map<number, CalendarEvent[]>()
  for (const ev of events) {
    const day = Number(ev.date.split("-")[2])
    const arr = eventsByDay.get(day) || []
    arr.push(ev)
    eventsByDay.set(day, arr)
  }

  const cells = buildGrid(year, month)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4 text-orange-500" />
            Sự kiện
          </CardTitle>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {LEGEND.map((l) => (
              <span key={l.type} className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className={cn("h-2 w-2 rounded-full", TYPE_DOT[l.type])} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={goPrev} disabled={isPending}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={goNext} disabled={isPending}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-7" onClick={goToday} disabled={isPending}>
              Hôm nay
            </Button>
          </div>
          <MonthYearPicker year={year} month={month} onChange={(y, m) => load(y, m)} disabled={isPending} />
        </div>

        <div className="grid grid-cols-7 border-l border-t text-sm">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="border-b border-r bg-muted/40 px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
            >
              {w}
            </div>
          ))}
          {cells.map((day, idx) => {
            const dateStr =
              day != null ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null
            const isToday = dateStr === today
            const dayEvents = day != null ? eventsByDay.get(day) || [] : []
            return (
              <div
                key={idx}
                className={cn(
                  "min-h-[64px] border-b border-r p-1.5 align-top",
                  day == null && "bg-muted/20",
                  isToday && "bg-orange-50"
                )}
              >
                {day != null && (
                  <>
                    <div
                      className={cn(
                        "text-right text-xs",
                        isToday ? "font-bold text-orange-600" : "text-muted-foreground"
                      )}
                    >
                      {day}
                    </div>
                    <div className="mt-1 flex flex-col gap-0.5">
                      {dayEvents.slice(0, 3).map((ev, i) => (
                        <span
                          key={i}
                          title={`${ev.label}: ${ev.employeeName}`}
                          className="flex items-center gap-1 truncate text-[10px] text-foreground"
                        >
                          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", TYPE_DOT[ev.type])} />
                          <span className="truncate">{ev.employeeName}</span>
                        </span>
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
