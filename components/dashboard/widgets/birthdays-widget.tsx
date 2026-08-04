import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Cake } from "lucide-react"
import { initialsOf, whenLabelVN } from "@/components/dashboard/widgets/utils"
import type { BirthdayItem } from "@/lib/actions/dashboard-actions"

export function BirthdaysWidget({ items }: { items: BirthdayItem[] }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Cake className="h-4 w-4 text-pink-500" />
          Sinh nhật
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Không có sinh nhật trong thời gian này
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 rounded-lg border bg-card p-2.5">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={item.avatar_url || ""} alt={item.full_name} />
                  <AvatarFallback className="bg-pink-100 text-pink-600 text-xs">
                    {initialsOf(item.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.positionName || "—"}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium text-pink-600">{item.date}</p>
                  <p className="text-xs text-muted-foreground">{whenLabelVN(item.daysUntil)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
