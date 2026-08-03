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

  const stepMonth = (delta: number) => {
    setMode("month")
    let m = month + delta
    let y = year
    if (m < 1) {
      m = 12
      y -= 1
    } else if (m > 12) {
      m = 1
      y += 1
    }
    setMonth(m)
    setYear(y)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-orange-500" />
            Đơn từ của tôi
          </CardTitle>
          <Link
            href="/dashboard/leave"
            className="flex items-center text-xs text-muted-foreground hover:text-foreground"
          >
            Chi tiết <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => stepMonth(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <MonthYearPicker
              year={year}
              month={month}
              onChange={(y, m) => {
                setMode("month")
                setYear(y)
                setMonth(m)
              }}
              className={cn(mode === "month" && "border-orange-300")}
            />
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => stepMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
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
          </div>
        </div>

        <p className="my-3 text-xs text-muted-foreground">Thống kê đơn theo ngày áp dụng · {label}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Tổng đơn" value={counts.total} tone="violet" />
          <StatTile label="Đã duyệt" value={counts.approved} tone="green" />
          <StatTile label="Cần duyệt" value={counts.pending} tone="amber" />
          <StatTile label="Đã hủy" value={counts.cancelled} tone="red" />
        </div>
      </CardContent>
    </Card>
  )
}
