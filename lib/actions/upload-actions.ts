"use server"

import { createClient } from "@/lib/supabase/server"

export async function uploadRequestAttachment(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const file = formData.get("file") as File
  if (!file) {
    return { success: false, error: "No file provided" }
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "File không được vượt quá 5MB" }
  }

  // Validate file type
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ]
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "Chỉ chấp nhận file PDF, DOC, DOCX, JPG, PNG" }
  }

  // Generate unique filename
  const ext = file.name.split(".").pop()
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const fileName = `${user.id}/${timestamp}-${randomStr}.${ext}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("request-attachments")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (error) {
    console.error("Upload error:", error)
    return { success: false, error: "Không thể upload file: " + error.message }
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("request-attachments")
    .getPublicUrl(data.path)

  return { 
    success: true, 
    url: urlData.publicUrl,
    path: data.path 
  }
}

export async function deleteRequestAttachment(path: string) {
  const supabase = await createClient()

  const { error } = await supabase.storage
    .from("request-attachments")
    .remove([path])

  if (error) {
    console.error("Delete error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
