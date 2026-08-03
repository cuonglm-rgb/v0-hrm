"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDateVN } from "@/lib/utils/date-utils"
import { StatTile } from "./stat-tile"
import {
  getWorkScheduleSummary,
  getWorkScheduleRange,
  type WorkScheduleSummary,
} from "@/lib/actions/dashboard-actions"

function Section({ title, names, hasData }: { title: string; names: string[]; hasData: boolean }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      {!hasData ? (
        <p className="mt-1 text-sm text-muted-foreground">Chưa có dữ liệu</p>
      ) : names.length === 0 ? (
        <p className="mt-1 text-sm text-muted-foreground">Không có</p>
      ) : (
        <p className="mt-1 text-sm text-foreground">{names.join(", ")}</p>
      )}
    </div>
  )
}

type PresetKey = "today" | "tomorrow" | "week" | "custom"

export function WorkScheduleWidget({
  initialSummary,
  today,
  tomorrow,
  weekStart,
  weekEnd,
}: {
  initialSummary: WorkScheduleSummary
  today: string
  tomorrow: string
  weekStart: string
  weekEnd: string
}) {
  const [summary, setSummary] = useState<WorkScheduleSummary>(initialSummary)
  const [active, setActive] = useState<PresetKey>("today")
  const [label, setLabel] = useState(`Hôm nay · ${formatDateVN(today)}`)
  const [from, setFrom] = useState(today)
  const [to, setTo] = useState(today)
  const [isPending, startTransition] = useTransition()

  const run = (key: PresetKey, lbl: string, fetcher: () => Promise<WorkScheduleSummary>) => {
    setActive(key)
    setLabel(lbl)
    startTransition(async () => setSummary(await fetcher()))
  }

  const presets: { key: PresetKey; label: string; onClick: () => void }[] = [
    { key: "today", label: "Hôm nay", onClick: () => run("today", `Hôm nay · ${formatDateVN(today)}`, () => getWorkScheduleSummary(today)) },
    { key: "tomorrow", label: "Ngày mai", onClick: () => run("tomorrow", `Ngày mai · ${formatDateVN(tomorrow)}`, () => getWorkScheduleSummary(tomorrow)) },
    { key: "week", label: "Tuần này", onClick: () => run("week", `Tuần này · ${formatDateVN(weekStart)} - ${formatDateVN(weekEnd)}`, () => getWorkScheduleRange(weekStart, weekEnd)) },
  ]

  const applyRange = () => {
    if (!from || !to || from > to) return
    if (from === to) {
      run("custom", `${formatDateVN(from)}`, () => getWorkScheduleSummary(from))
    } else {
      run("custom", `${formatDateVN(from)} - ${formatDateVN(to)}`, () => getWorkScheduleRange(from, to))
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarCheck className="h-4 w-4 text-orange-500" />
          Lịch làm việc
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {presets.map((p) => (
              <Button
                key={p.key}
                size="sm"
                variant={active === p.key ? "default" : "outline"}
                className="h-7"
                onClick={p.onClick}
                disabled={isPending}
              >
                {p.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex items-center gap-1.5">
              <Input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-8 w-[9.5rem]"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-8 w-[9.5rem]"
              />
            </div>
            <Button
              size="sm"
              variant={active === "custom" ? "default" : "outline"}
              className="h-8"
              onClick={applyRange}
              disabled={isPending}
            >
              Xem
            </Button>
          </div>
        </div>

        <div className={cn("mt-4 space-y-4", isPending && "opacity-60")}>
          <p className="text-xs text-muted-foreground">{label}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Có mặt" value={summary.present} tone="green" />
            <StatTile label="Đi trễ" value={summary.late} tone="amber" />
            <StatTile label="Vắng mặt" value={summary.absent} tone="red" />
            <StatTile label="Nghỉ phép" value={summary.onLeave} tone="blue" />
          </div>
          <div className="space-y-3">
            <Section title="Đi trễ" names={summary.lateNames} hasData={summary.hasAttendanceData} />
            <Section title="Nghỉ phép" names={summary.leaveNames} hasData={true} />
            <Section title="Có mặt" names={summary.presentNames} hasData={summary.hasAttendanceData} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
