"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const PROBATION_RATE_KEY = "probation_salary_rate"
const DEFAULT_PROBATION_RATE = 0.85

export async function getProbationSalaryRate(): Promise<number> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("payroll_settings")
    .select("value")
    .eq("key", PROBATION_RATE_KEY)
    .maybeSingle()

  if (!data) return DEFAULT_PROBATION_RATE
  const raw = data.value
  const num = typeof raw === "number" ? raw : Number(raw)
  if (!Number.isFinite(num) || num < 0 || num > 1) return DEFAULT_PROBATION_RATE
  return num
}

export async function updateProbationSalaryRate(rate: number): Promise<{ success: boolean; error?: string }> {
  if (!Number.isFinite(rate) || rate < 0 || rate > 1) {
    return { success: false, error: "Tỉ lệ phải nằm trong khoảng 0 đến 1" }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Chưa đăng nhập" }

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role:roles(code)")
    .eq("user_id", user.id)
  const codes = (roles || []).map((r: any) => r.role?.code).filter(Boolean)
  if (!codes.includes("hr") && !codes.includes("admin")) {
    return { success: false, error: "Không có quyền cập nhật cấu hình lương" }
  }

  const { error } = await supabase
    .from("payroll_settings")
    .upsert(
      {
        key: PROBATION_RATE_KEY,
        value: rate,
        description: "Tỉ lệ lương thử việc áp lên base_salary cho những ngày trước official_date (0.85 = 85%)",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    )

  if (error) return { success: false, error: error.message }

  revalidatePath("/dashboard/settings/payroll")
  return { success: true }
}
