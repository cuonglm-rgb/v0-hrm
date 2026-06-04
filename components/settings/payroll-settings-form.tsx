"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { updateProbationSalaryRate } from "@/lib/actions/payroll-settings-actions"

interface Props {
  initialProbationRate: number
}

export function PayrollSettingsForm({ initialProbationRate }: Props) {
  const [percent, setPercent] = useState<string>((initialProbationRate * 100).toFixed(2))
  const [pending, startTransition] = useTransition()

  const handleSave = () => {
    const num = Number(percent)
    if (!Number.isFinite(num) || num < 0 || num > 100) {
      toast.error("Tỉ lệ phải nằm trong khoảng 0 - 100")
      return
    }
    startTransition(async () => {
      const result = await updateProbationSalaryRate(num / 100)
      if (result.success) {
        toast.success("Đã lưu cấu hình")
      } else {
        toast.error(result.error || "Lưu thất bại")
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lương thử việc</CardTitle>
        <CardDescription>
          Tỉ lệ lương cơ bản áp dụng cho những ngày trước <code>Ngày chính thức</code> của nhân viên.
          Pro-rate theo ngày làm việc lịch (CN và T7 nghỉ không tính).
          Chỉ áp lên lương theo công, không ảnh hưởng phụ cấp / OT / KPI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="probation-rate">Tỉ lệ lương thử việc (%)</Label>
          <div className="flex items-center gap-2 max-w-xs">
            <Input
              id="probation-rate"
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              disabled={pending}
            />
            <span className="text-muted-foreground">%</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Ví dụ: 85 nghĩa là nhân viên thử việc nhận 85% lương cơ bản cho phần ngày trước Ngày chính thức.
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={pending}>
            {pending ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
