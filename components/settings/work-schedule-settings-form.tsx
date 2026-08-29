"use client"

import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateSaturdayDefaultConfig } from "@/lib/actions/work-schedule-settings-actions"
import {
  getUpcomingSaturdays,
  isSaturday,
  isSaturdayOffByDefault,
  type SaturdayDefaultConfig,
  type SaturdayMode,
} from "@/lib/utils/saturday-utils"

interface Props {
  initialConfig: SaturdayDefaultConfig
  /** Ngày hôm nay (YYYY-MM-DD) tính ở server để preview không lệch timezone */
  today: string
}

const PREVIEW_COUNT = 10

function formatSaturday(dateStr: string): string {
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

export function WorkScheduleSettingsForm({ initialConfig, today }: Props) {
  const [config, setConfig] = useState<SaturdayDefaultConfig>(initialConfig)
  const [pending, startTransition] = useTransition()

  const anchorIsSaturday = isSaturday(config.anchor_date)

  const preview = useMemo(
    () =>
      getUpcomingSaturdays(today, PREVIEW_COUNT).map((dateStr) => ({
        dateStr,
        isOff: isSaturdayOffByDefault(dateStr, config),
      })),
    [today, config]
  )

  /** Bấm vào 1 thứ 7 trong preview để lấy chính ngày đó làm mốc và đảo trạng thái */
  const toggleSaturday = (dateStr: string, currentlyOff: boolean) => {
    if (config.mode !== "alternating") return
    setConfig((c) => ({ ...c, anchor_date: dateStr, anchor_is_working: currentlyOff }))
  }

  const handleSave = () => {
    if (config.mode === "alternating" && !anchorIsSaturday) {
      toast.error("Ngày mốc phải là một ngày thứ 7")
      return
    }
    startTransition(async () => {
      const result = await updateSaturdayDefaultConfig(config)
      if (result.success) {
        toast.success("Đã lưu lịch thứ 7 mặc định")
      } else {
        toast.error(result.error || "Lưu thất bại")
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lịch thứ 7 mặc định</CardTitle>
          <CardDescription>
            Áp dụng cho toàn công ty khi nhân viên không có lịch thứ 7 riêng. Dùng để tính công chuẩn,
            bảng lương, và để chặn phiếu nghỉ phép / làm bù rơi vào ngày nghỉ. Chủ nhật luôn là ngày nghỉ.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Chế độ</Label>
            <Select
              value={config.mode}
              onValueChange={(v) => setConfig((c) => ({ ...c, mode: v as SaturdayMode }))}
              disabled={pending}
            >
              <SelectTrigger className="max-w-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alternating">Xen kẽ — 1 tuần làm, 1 tuần nghỉ</SelectItem>
                <SelectItem value="all_working">Làm tất cả các thứ 7</SelectItem>
                <SelectItem value="all_off">Nghỉ tất cả các thứ 7</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {config.mode === "alternating" && (
            <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="anchor-date">Ngày thứ 7 làm mốc</Label>
                <Input
                  id="anchor-date"
                  type="date"
                  value={config.anchor_date}
                  onChange={(e) => setConfig((c) => ({ ...c, anchor_date: e.target.value }))}
                  disabled={pending}
                />
                {!anchorIsSaturday && (
                  <p className="text-xs text-red-600">Ngày này không phải thứ 7. Vui lòng chọn một ngày thứ 7.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Thứ 7 mốc đó công ty</Label>
                <Select
                  value={config.anchor_is_working ? "working" : "off"}
                  onValueChange={(v) => setConfig((c) => ({ ...c, anchor_is_working: v === "working" }))}
                  disabled={pending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="working">Đi làm</SelectItem>
                    <SelectItem value="off">Được nghỉ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-xs text-muted-foreground sm:col-span-2">
                Chọn một ngày thứ 7 bất kỳ và cho biết hôm đó công ty đi làm hay nghỉ. Các thứ 7 còn lại
                được suy ra xen kẽ từ mốc này (bao gồm cả các thứ 7 trước đó).
              </p>
            </div>
          )}

          <div className="flex items-start justify-between gap-4 rounded-lg border p-4 max-w-2xl">
            <div className="space-y-1">
              <Label htmlFor="unassigned-off">Nhân viên có lịch thứ 7 riêng</Label>
              <p className="text-xs text-muted-foreground">
                Bật: các thứ 7 chưa được phân công cho nhân viên đó sẽ tính là NGHỈ (chỉ đi làm đúng những
                thứ 7 được phân công). Tắt: những thứ 7 chưa phân công vẫn theo lịch mặc định ở trên.
              </p>
            </div>
            <Switch
              id="unassigned-off"
              checked={config.unassigned_saturday_is_off}
              onCheckedChange={(checked) => setConfig((c) => ({ ...c, unassigned_saturday_is_off: checked }))}
              disabled={pending}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={pending}>
              {pending ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Xem trước {PREVIEW_COUNT} thứ 7 tới</CardTitle>
          <CardDescription>
            {config.mode === "alternating"
              ? "Bấm vào một ngày để đổi trạng thái — ngày đó sẽ trở thành mốc mới."
              : "Theo chế độ đang chọn."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {preview.map(({ dateStr, isOff }) => (
              <li key={dateStr} className="flex items-center justify-between py-2">
                <span className="text-sm">
                  T7 {formatSaturday(dateStr)}
                  {dateStr === config.anchor_date && config.mode === "alternating" && (
                    <span className="ml-2 text-xs text-muted-foreground">(mốc)</span>
                  )}
                </span>
                {config.mode === "alternating" ? (
                  <button
                    type="button"
                    onClick={() => toggleSaturday(dateStr, isOff)}
                    disabled={pending}
                    className="cursor-pointer"
                  >
                    <Badge className={isOff ? "bg-slate-100 text-slate-700" : "bg-green-100 text-green-700"}>
                      {isOff ? "Nghỉ" : "Đi làm"}
                    </Badge>
                  </button>
                ) : (
                  <Badge className={isOff ? "bg-slate-100 text-slate-700" : "bg-green-100 text-green-700"}>
                    {isOff ? "Nghỉ" : "Đi làm"}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
