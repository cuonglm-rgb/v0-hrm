"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { checkIn, checkOut } from "@/lib/actions/attendance-actions"
import type { AttendanceLog, WorkShift } from "@/lib/types/database"
import {
  formatDateVN,
  formatTimeVN,
  formatCurrentTimeVN,
  getTodayVN,
  formatSourceVN,
} from "@/lib/utils/date-utils"
import { Clock, LogIn, LogOut, CheckCircle2, XCircle, Timer } from "lucide-react"

interface AttendancePanelProps {
  attendanceLogs: AttendanceLog[]
  shift?: WorkShift | null
}

export function AttendancePanel({ attendanceLogs, shift }: AttendancePanelProps) {
  const [loading, setLoading] = useState<"checkin" | "checkout" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Cập nhật giờ mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const today = getTodayVN()
  const todayLog = attendanceLogs.find((log) => log.check_in?.startsWith(today))

  const hasCheckedIn = !!todayLog
  const hasCheckedOut = !!todayLog?.check_out

  const handleCheckIn = async () => {
    setLoading("checkin")
    setError(null)
    const result = await checkIn()
    if (!result.success) {
      setError(result.error || "Không thể chấm công vào")
    }
    setLoading(null)
  }

  const handleCheckOut = async () => {
    setLoading("checkout")
    setError(null)
    const result = await checkOut()
    if (!result.success) {
      setError(result.error || "Không thể chấm công ra")
    }
    setLoading(null)
  }

  const getStatusDisplay = () => {
    if (!hasCheckedIn) {
      return {
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        text: "Chưa chấm công vào",
        color: "text-red-600",
      }
    }
    if (hasCheckedIn && !hasCheckedOut) {
      return {
        icon: <Timer className="h-5 w-5 text-blue-500" />,
        text: `Đã vào lúc ${formatTimeVN(todayLog?.check_in)}`,
        color: "text-blue-600",
      }
    }
    return {
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      text: `Hoàn thành - Ra lúc ${formatTimeVN(todayLog?.check_out)}`,
      color: "text-green-600",
    }
  }

  const status = getStatusDisplay()

  return (
    <div className="space-y-6">
      {/* Card chấm công hôm nay */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Chấm công hôm nay
          </CardTitle>
          <CardDescription>
            {formatDateVN(new Date().toISOString())}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Giờ hiện tại & Ca làm */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Giờ hiện tại (Việt Nam)</p>
              <p className="text-2xl font-bold">
                {formatCurrentTimeVN(currentTime)}
              </p>
            </div>
            {shift && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Ca làm việc</p>
                <p className="font-medium">{shift.name}</p>
                <p className="text-sm text-muted-foreground">
                  {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
                </p>
              </div>
            )}
          </div>

          {/* Trạng thái */}
          <div className={`flex items-center gap-2 ${status.color}`}>
            {status.icon}
            <span className="font-medium">{status.text}</span>
          </div>

          {/* Nút chấm công */}
          <div className="flex gap-4">
            <Button
              onClick={handleCheckIn}
              disabled={hasCheckedIn || loading === "checkin"}
              className="gap-2"
              size="lg"
            >
              <LogIn className="h-4 w-4" />
              {loading === "checkin" ? "Đang xử lý..." : "Vào làm"}
            </Button>
            <Button
              onClick={handleCheckOut}
              disabled={!hasCheckedIn || hasCheckedOut || loading === "checkout"}
              variant="outline"
              className="gap-2"
              size="lg"
            >
              <LogOut className="h-4 w-4" />
              {loading === "checkout" ? "Đang xử lý..." : "Ra về"}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Tóm tắt hôm nay */}
          {todayLog && (
            <div className="flex gap-6 pt-2 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Giờ vào</p>
                <p className="font-medium">{formatTimeVN(todayLog.check_in)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Giờ ra</p>
                <p className="font-medium">{formatTimeVN(todayLog.check_out)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lịch sử chấm công */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử chấm công</CardTitle>
          <CardDescription>30 ngày gần nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Giờ vào</TableHead>
                <TableHead>Giờ ra</TableHead>
                <TableHead>Nguồn</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Chưa có dữ liệu chấm công
                  </TableCell>
                </TableRow>
              ) : (
                attendanceLogs.slice(0, 30).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{formatDateVN(log.check_in)}</TableCell>
                    <TableCell>{formatTimeVN(log.check_in)}</TableCell>
                    <TableCell>{formatTimeVN(log.check_out)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{formatSourceVN(log.source)}</Badge>
                    </TableCell>
                    <TableCell>
                      {log.check_out ? (
                        <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
                      ) : (
                        <Badge variant="secondary">Chưa ra</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
