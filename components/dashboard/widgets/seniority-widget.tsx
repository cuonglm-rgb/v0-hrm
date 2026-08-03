import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Award } from "lucide-react"
import { initialsOf, whenLabelVN } from "@/components/dashboard/widgets/utils"
import type { SeniorityData } from "@/lib/actions/dashboard-actions"

export function SeniorityWidget({ data }: { data: SeniorityData }) {
  const { mode, items } = data
  const isRanking = mode === "ranking"

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="h-4 w-4 text-amber-500" />
            Thâm niên
          </CardTitle>
          {items.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {isRanking ? "Thâm niên cao nhất" : "Kỷ niệm sắp tới"}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Không có kỷ niệm thâm niên trong thời gian này
          </div>
        ) : (
          <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <li key={item.id} className="flex items-center gap-3 rounded-lg border bg-card p-2.5">
                {isRanking && (
                  <span className="w-5 shrink-0 text-center text-sm font-semibold text-amber-600">{idx + 1}</span>
                )}
                <Avatar className="h-9 w-9">
                  <AvatarImage src={item.avatar_url || ""} alt={item.full_name} />
                  <AvatarFallback className="bg-amber-100 text-amber-600 text-xs">
                    {initialsOf(item.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.departmentName || "—"}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-amber-600">{item.years} năm</p>
                  <p className="text-xs text-muted-foreground">
                    {isRanking ? `Từ ${item.date}` : `${item.date} · ${whenLabelVN(item.daysUntil)}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
