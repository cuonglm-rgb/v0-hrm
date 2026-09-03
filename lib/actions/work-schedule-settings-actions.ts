"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import {
  DEFAULT_SATURDAY_CONFIG,
  isSaturday,
  normalizeSaturdayConfig,
  type SaturdayDefaultConfig,
} from "@/lib/utils/saturday-utils"

const SATURDAY_CONFIG_KEY = "saturday_default_schedule"

/**
 * Cấu hình thứ 7 mặc định của công ty (lưu trong payroll_settings dạng jsonb).
 * Luôn trả về config hợp lệ — hỏng/thiếu thì rơi về mặc định.
 */
export async function getSaturdayDefaultConfig(): Promise<SaturdayDefaultConfig> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("payroll_settings")
      .select("value")
      .eq("key", SATURDAY_CONFIG_KEY)
      .maybeSingle()

    return normalizeSaturdayConfig(data?.value)
  } catch {
    return DEFAULT_SATURDAY_CONFIG
  }
}

export async function updateSaturdayDefaultConfig(
  input: SaturdayDefaultConfig
): Promise<{ success: boolean; error?: string }> {
  const config = normalizeSaturdayConfig(input)

  if (config.mode === "alternating") {
    if (input.anchor_date !== config.anchor_date) {
      return { success: false, error: "Ngày mốc không hợp lệ" }
    }
    if (!isSaturday(config.anchor_date)) {
      return { success: false, error: "Ngày mốc phải là một ngày thứ 7" }
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Chưa đăng nhập" }

  const { data: roles } = await supabase.from("user_roles").select("role:roles(code)").eq("user_id", user.id)
  const codes = (roles || []).map((r: any) => r.role?.code).filter(Boolean)
  if (!codes.includes("hr") && !codes.includes("admin")) {
    return { success: false, error: "Không có quyền cập nhật lịch làm việc" }
  }

  const { error } = await supabase.from("payroll_settings").upsert(
    {
      key: SATURDAY_CONFIG_KEY,
      value: config,
      description: "Lịch thứ 7 mặc định của công ty (xen kẽ / làm tất cả / nghỉ tất cả)",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  )

  if (error) return { success: false, error: error.message }

  revalidatePath("/dashboard/settings/work-schedule")
  revalidatePath("/dashboard/attendance")
  revalidatePath("/dashboard/attendance-management")
  return { success: true }
}
