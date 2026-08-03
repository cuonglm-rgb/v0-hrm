"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getNowVN } from "@/lib/utils/date-utils"
import type { CompanyNews, CompanyNewsWithRelations } from "@/lib/types/database"

// Tin đã publish, hiển thị trên widget trang chủ
export async function listPublishedNews(limit = 5): Promise<CompanyNewsWithRelations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("company_news")
    .select(`
      *,
      author:employees!author_id(id, full_name, avatar_url)
    `)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error listing published news:", error)
    return []
  }

  return (data || []) as CompanyNewsWithRelations[]
}

// Toàn bộ tin (cho trang quản trị HR)
export async function listAllNews(): Promise<CompanyNewsWithRelations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("company_news")
    .select(`
      *,
      author:employees!author_id(id, full_name, avatar_url)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error listing all news:", error)
    return []
  }

  return (data || []) as CompanyNewsWithRelations[]
}

export async function createNews(input: {
  title: string
  content?: string
  image_url?: string
  is_published?: boolean
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Chưa đăng nhập" }

  // Lấy employee_id của người tạo (để lưu author)
  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!input.title?.trim()) {
    return { success: false, error: "Vui lòng nhập tiêu đề" }
  }

  const isPublished = input.is_published ?? true

  const { error } = await supabase.from("company_news").insert({
    title: input.title.trim(),
    content: input.content?.trim() || null,
    image_url: input.image_url?.trim() || null,
    is_published: isPublished,
    published_at: isPublished ? getNowVN() : null,
    author_id: employee?.id || null,
  })

  if (error) {
    console.error("Error creating news:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/settings/news")
  return { success: true }
}

export async function updateNews(
  id: string,
  input: Partial<Pick<CompanyNews, "title" | "content" | "image_url" | "is_published">>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const patch: Record<string, unknown> = { ...input }

  // Khi chuyển sang publish mà chưa có published_at thì set thời điểm publish
  if (input.is_published === true) {
    const { data: existing } = await supabase
      .from("company_news")
      .select("published_at")
      .eq("id", id)
      .single()
    if (!existing?.published_at) {
      patch.published_at = getNowVN()
    }
  }

  const { error } = await supabase.from("company_news").update(patch).eq("id", id)

  if (error) {
    console.error("Error updating news:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/settings/news")
  return { success: true }
}

export async function deleteNews(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from("company_news").delete().eq("id", id)

  if (error) {
    console.error("Error deleting news:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/settings/news")
  return { success: true }
}
