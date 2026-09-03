import { describe, it, expect } from "vitest"
import {
  DEFAULT_SATURDAY_CONFIG,
  isSaturdayOffByDefault,
  isSaturdayOffForEmployee,
} from "../saturday-utils"

// Mốc: 29/08/2026 là thứ 7 LÀM VIỆC theo lịch mặc định công ty
// → 05/09 nghỉ, 12/09 làm, 19/09 nghỉ, 26/09 làm
const CONFIG_OFF_UNASSIGNED = {
  ...DEFAULT_SATURDAY_CONFIG,
  anchor_date: "2026-08-29",
  anchor_is_working: true,
  unassigned_saturday_is_off: true,
}

describe("isSaturdayOffForEmployee", () => {
  it("phân công đúng ngày luôn được ưu tiên cao nhất", () => {
    const schedules = [{ work_date: "2026-09-05", is_working: true }]
    expect(isSaturdayOffForEmployee("2026-09-05", schedules, CONFIG_OFF_UNASSIGNED)).toBe(false)

    const off = [{ work_date: "2026-09-12", is_working: false }]
    expect(isSaturdayOffForEmployee("2026-09-12", off, CONFIG_OFF_UNASSIGNED)).toBe(true)
  })

  it("phân công tháng 9 KHÔNG làm thứ 7 tháng 8 thành ngày nghỉ", () => {
    // 29/08 là ngày làm mặc định; nhân viên chỉ được phân công 05/09
    const schedules = [{ work_date: "2026-09-05", is_working: true }]
    expect(isSaturdayOffByDefault("2026-08-29", CONFIG_OFF_UNASSIGNED)).toBe(false)
    expect(isSaturdayOffForEmployee("2026-08-29", schedules, CONFIG_OFF_UNASSIGNED)).toBe(false)
  })

  it("unassigned_saturday_is_off chỉ áp dụng trong tháng có phân công", () => {
    const schedules = [{ work_date: "2026-09-05", is_working: true }]
    // 12/09 cùng tháng, chưa phân công → nghỉ (dù mặc định là ngày làm)
    expect(isSaturdayOffByDefault("2026-09-12", CONFIG_OFF_UNASSIGNED)).toBe(false)
    expect(isSaturdayOffForEmployee("2026-09-12", schedules, CONFIG_OFF_UNASSIGNED)).toBe(true)
  })

  it("không có phân công nào thì theo lịch mặc định công ty", () => {
    for (const d of ["2026-08-29", "2026-09-05", "2026-09-12", "2026-09-19"]) {
      expect(isSaturdayOffForEmployee(d, [], CONFIG_OFF_UNASSIGNED)).toBe(
        isSaturdayOffByDefault(d, CONFIG_OFF_UNASSIGNED)
      )
    }
  })

  it("tắt unassigned_saturday_is_off thì ngày chưa phân công luôn theo lịch mặc định", () => {
    const config = { ...CONFIG_OFF_UNASSIGNED, unassigned_saturday_is_off: false }
    const schedules = [{ work_date: "2026-09-05", is_working: true }]
    expect(isSaturdayOffForEmployee("2026-09-12", schedules, config)).toBe(false)
    expect(isSaturdayOffForEmployee("2026-09-19", schedules, config)).toBe(true)
  })
})
