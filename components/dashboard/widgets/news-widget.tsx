"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Newspaper } from "lucide-react"
import { formatDateVN } from "@/lib/utils/date-utils"
import { RichText, stripRichText } from "@/lib/utils/rich-text"
import type { CompanyNewsWithRelations } from "@/lib/types/database"

export function NewsWidget({ news }: { news: CompanyNewsWithRelations[] }) {
  const [selected, setSelected] = useState<CompanyNewsWithRelations | null>(null)

  return (
    <>
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
                <li key={item.id} className="first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setSelected(item)}
                    className="flex w-full gap-3 py-3 text-left transition-colors hover:bg-muted/50 rounded-lg -mx-2 px-2"
                  >
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
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {stripRichText(item.content)}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">{formatDateVN(item.published_at)}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden flex flex-col">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-6">{selected.title}</DialogTitle>
                <DialogDescription>{formatDateVN(selected.published_at)}</DialogDescription>
              </DialogHeader>
              <div className="-mx-6 min-h-0 flex-1 overflow-y-auto px-6">
                {selected.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selected.image_url}
                    alt={selected.title}
                    className="mb-4 w-full rounded-lg object-cover"
                  />
                )}
                {selected.content && (
                  <RichText
                    text={selected.content}
                    className="text-sm leading-relaxed text-foreground"
                  />
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
