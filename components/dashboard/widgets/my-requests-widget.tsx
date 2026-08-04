"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDateVN, getLastDayOfMonthVN } from "@/lib/utils/date-utils"
import { StatTile } from "./stat-tile"
import { MonthYearPicker } from "./month-year-picker"

export interface RequestLite {
  status: string
  applyDate: string | null
}

type Mode = "month" | "range"

export function MyRequestsWidget({
  requests,
  initialYear,
  initialMonth,
}: {
  requests: RequestLite[]
  initialYear: number
  initialMonth: number
}) {
  const [mode, setMode] = useState<Mode>("month")
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [from, setFrom] = useState(`${initialYear}-${String(initialMonth).padStart(2, "0")}-01`)
  const [to, setTo] = useState(getLastDayOfMonthVN(initialYear, initialMonth))

  const { fromDate, toDate, label } = useMemo(() => {
    if (mode === "month") {
      const f = `${year}-${String(month).padStart(2, "0")}-01`
      const t = getLastDayOfMonthVN(year, month)
      return { fromDate: f, toDate: t, label: `Tháng ${String(month).padStart(2, "0")}/${year}` }
    }
    return { fromDate: from, toDate: to, label: `${formatDateVN(from)} - ${formatDateVN(to)}` }
  }, [mode, year, month, from, to])

  const counts = useMemo(() => {
    const inRange = requests.filter((r) => r.applyDate && r.applyDate >= fromDate && r.applyDate <= toDate)
    return {
      total: inRange.length,
      approved: inRange.filter((r) => r.status === "approved").length,
      pending: inRange.filter((r) => r.status === "pending").length,
      cancelled: inRange.filter((r) => r.status === "cancelled").length,
    }
  }, [requests, fromDate, toDate])

  const selectMonth = (y: number, m: number) => {
    setMode("month")
    setYear(y)
    setMonth(m)
    setFrom(`${y}-${String(m).padStart(2, "0")}-01`)
    setTo(getLastDayOfMonthVN(y, m))
  }

  const stepMonth = (delta: number) => {
    let m = month + delta
    let y = year
    if (m < 1) {
      m = 12
      y -= 1
    } else if (m > 12) {
      m = 1
      y += 1
    }
    selectMonth(y, m)
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-orange-500" />
            Đơn từ của tôi
          </CardTitle>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => stepMonth(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <MonthYearPicker
              year={year}
              month={month}
              onChange={(y, m) => selectMonth(y, m)}
              className={cn(mode === "month" && "border-orange-300")}
            />
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => stepMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value)
                setMode("range")
              }}
              className={cn("h-7 w-[9.5rem]", mode === "range" && "border-orange-300")}
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value)
                setMode("range")
              }}
              className={cn("h-7 w-[9.5rem]", mode === "range" && "border-orange-300")}
            />
            <Link
              href="/dashboard/leave"
              className="ml-1 flex items-center text-xs text-muted-foreground hover:text-foreground"
            >
              Chi tiết <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="mt-auto">
          <p className="my-3 text-xs text-muted-foreground">Thống kê đơn theo ngày áp dụng · {label}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Tổng đơn" value={counts.total} tone="violet" />
            <StatTile label="Đã duyệt" value={counts.approved} tone="green" />
            <StatTile label="Cần duyệt" value={counts.pending} tone="amber" />
            <StatTile label="Đã hủy" value={counts.cancelled} tone="red" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
