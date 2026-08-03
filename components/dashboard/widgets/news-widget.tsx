import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper } from "lucide-react"
import { formatDateVN } from "@/lib/utils/date-utils"
import type { CompanyNewsWithRelations } from "@/lib/types/database"

export function NewsWidget({ news }: { news: CompanyNewsWithRelations[] }) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Newspaper className="h-4 w-4 text-orange-500" />
          Tin tức công ty
        </CardTitle>
      </CardHeader>
      <CardContent>
        {news.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Không có tin tức nào
          </div>
        ) : (
          <ul className="divide-y">
            {news.map((item) => (
              <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                    <Newspaper className="h-5 w-5 text-orange-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  {item.content && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.content}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateVN(item.published_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
