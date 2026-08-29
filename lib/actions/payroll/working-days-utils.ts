// =============================================
// WORKING DAYS UTILITIES (non-server)
// =============================================

import {
  DEFAULT_SATURDAY_CONFIG,
  isSaturdayOffByDefault,
  type SaturdayDefaultConfig,
} from "@/lib/utils/saturday-utils"

export type { SaturdayDefaultConfig }
export { DEFAULT_SATURDAY_CONFIG }

/**
 * Kiểm tra thứ 7 có phải ngày nghỉ không theo lịch mặc định của công ty.
 * Truyền `config` lấy từ getSaturdayDefaultConfig(); không truyền thì dùng mặc định.
 */
export function isSaturdayOff(
  date: Date,
  config: SaturdayDefaultConfig = DEFAULT_SATURDAY_CONFIG
): boolean {
  return isSaturdayOffByDefault(date, config)
}
