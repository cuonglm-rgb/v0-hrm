"use client"

import { useEffect, useState } from "react"
import { getSaturdayDefaultConfig } from "@/lib/actions/work-schedule-settings-actions"
import { DEFAULT_SATURDAY_CONFIG, type SaturdayDefaultConfig } from "@/lib/utils/saturday-utils"

/**
 * Đọc cấu hình thứ 7 mặc định của công ty từ client component.
 * Trước khi tải xong dùng tạm DEFAULT_SATURDAY_CONFIG để UI không nhảy trắng.
 */
export function useSaturdayConfig(): SaturdayDefaultConfig {
  const [config, setConfig] = useState<SaturdayDefaultConfig>(DEFAULT_SATURDAY_CONFIG)

  useEffect(() => {
    let cancelled = false
    getSaturdayDefaultConfig()
      .then((cfg) => {
        if (!cancelled) setConfig(cfg)
      })
      .catch(() => {
        /* giữ mặc định */
      })
    return () => {
      cancelled = true
    }
  }, [])

  return config
}
