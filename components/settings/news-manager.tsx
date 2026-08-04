"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Newspaper } from "lucide-react"
import { toast } from "sonner"
import { formatDateVN } from "@/lib/utils/date-utils"
import { createNews, updateNews, deleteNews } from "@/lib/actions/company-news-actions"
import type { CompanyNewsWithRelations } from "@/lib/types/database"

interface FormState {
  id?: string
  title: string
  content: string
  image_url: string
  is_published: boolean
}

const emptyForm: FormState = { title: "", content: "", image_url: "", is_published: true }

export function NewsManager({ news }: { news: CompanyNewsWithRelations[] }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const openCreate = () => {
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (item: CompanyNewsWithRelations) => {
    setForm({
      id: item.id,
      title: item.title,
      content: item.content || "",
      image_url: item.image_url || "",
      is_published: item.is_published,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề")
      return
    }
    startTransition(async () => {
      const payload = {
        title: form.title,
        content: form.content,
        image_url: form.image_url,
        is_published: form.is_published,
      }
      const res = form.id ? await updateNews(form.id, payload) : await createNews(payload)
      if (res.success) {
        toast.success(form.id ? "Đã cập nhật tin tức" : "Đã tạo tin tức")
        setDialogOpen(false)
      } else {
        toast.error(res.error || "Có lỗi xảy ra")
      }
    })
  }

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const res = await deleteNews(deleteId)
      if (res.success) {
        toast.success("Đã xóa tin tức")
      } else {
        toast.error(res.error || "Không thể xóa")
      }
      setDeleteId(null)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tin tức công ty</h1>
          <p className="text-muted-foreground">Quản lý các tin tức hiển thị trên trang chủ</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Thêm tin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Danh sách tin ({news.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {news.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              Chưa có tin tức nào
            </div>
          ) : (
            <ul className="divide-y">
              {news.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.title} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                      <Newspaper className="h-5 w-5 text-orange-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{item.title}</p>
                      {item.is_published ? (
                        <Badge className="bg-green-100 text-green-700">Hiển thị</Badge>
                      ) : (
                        <Badge variant="outline">Nháp</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDateVN(item.published_at || item.created_at)}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose-600"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>{form.id ? "Sửa tin tức" : "Thêm tin tức"}</DialogTitle>
          </DialogHeader>
          <div className="-mx-6 min-h-0 flex-1 space-y-4 overflow-y-auto px-6">
            <div className="space-y-1.5">
              <Label htmlFor="news-title">Tiêu đề *</Label>
              <Input
                id="news-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Nhập tiêu đề tin"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="news-content">Nội dung</Label>
              <Textarea
                id="news-content"
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Nội dung tin tức"
                rows={12}
                className="max-h-[45vh]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="news-image">Ảnh (URL)</Label>
              <Input
                id="news-image"
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="news-published"
                checked={form.is_published}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_published: v }))}
              />
              <Label htmlFor="news-published">Hiển thị trên trang chủ</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isPending}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa tin tức?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tin tức sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-rose-600 hover:bg-rose-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
