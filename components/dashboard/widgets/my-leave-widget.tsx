"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarClock, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { StatTile } from "./stat-tile"
import { getMyLeaveBalanceForYear, type MyLeaveBalance } from "@/lib/actions/dashboard-actions"

export function MyLeaveWidget({ initial }: { initial: MyLeaveBalance }) {
  const [data, setData] = useState<MyLeaveBalance>(initial)
  const [isPending, startTransition] = useTransition()

  const stepYear = (delta: number) => {
    const nextYear = data.year + delta
    startTransition(async () => setData(await getMyLeaveBalanceForYear(nextYear)))
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="h-4 w-4 text-orange-500" />
            Phép của tôi
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => stepYear(-1)} disabled={isPending}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[3rem] text-center text-sm font-medium">{data.year}</span>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => stepYear(1)} disabled={isPending}>
              <ChevronRight className="h-4 w-4" />
            </Button>
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
          <p className="mb-3 text-xs text-muted-foreground">Số phép năm {data.year}</p>
          <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", isPending && "opacity-60")}>
            <StatTile label="Tổng phép" value={data.total} tone="violet" />
            <StatTile label="Còn lại" value={data.remaining} tone="green" />
            <StatTile label="Đã dùng" value={data.used} tone="amber" />
            <StatTile label="Hết hạn" value={data.expired} tone="red" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
