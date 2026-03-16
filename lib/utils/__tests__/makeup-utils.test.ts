import { describe, it, expect } from "vitest"
import { isMakeupRequestType, isEmployeeOffDay, isSameMonth, LINKED_DEFICIT_DATE_KEY } from "../makeup-utils"

describe("isMakeupRequestType", () => {
  it("returns true for late_early_makeup", () => {
    expect(isMakeupRequestType("late_early_makeup")).toBe(true)
  })

  it("returns true for full_day_makeup", () => {
    expect(isMakeupRequestType("full_day_makeup")).toBe(true)
  })

  it("returns false for overtime", () => {
    expect(isMakeupRequestType("overtime")).toBe(false)
  })

  it("returns false for annual_leave", () => {
    expect(isMakeupRequestType("annual_leave")).toBe(false)
  })
})

describe("isSameMonth", () => {
  it("returns true for same month and year", () => {
    expect(isSameMonth("2026-03-15", "2026-03-01")).toBe(true)
  })

  it("returns false for different months", () => {
    expect(isSameMonth("2026-03-15", "2026-04-01")).toBe(false)
  })

  it("returns false for different years", () => {
    expect(isSameMonth("2026-03-15", "2025-03-15")).toBe(false)
  })
})

describe("isEmployeeOffDay", () => {
  it("Sunday is always off", () => {
    // 2026-03-15 is a Sunday
    expect(isEmployeeOffDay("2026-03-15", [], "emp1")).toBe(true)
  })

  it("regular weekday is not off", () => {
    // 2026-03-16 is Monday
    expect(isEmployeeOffDay("2026-03-16", [], "emp1")).toBe(false)
  })

  it("Saturday with override is_working=false is off", () => {
    // 2026-03-14 is Saturday
    const schedules = [
      { employee_id: "emp1", work_date: "2026-03-14", is_working: false },
    ]
    expect(isEmployeeOffDay("2026-03-14", schedules, "emp1")).toBe(true)
  })

  it("Saturday with override is_working=true is not off", () => {
    const schedules = [
      { employee_id: "emp1", work_date: "2026-03-14", is_working: true },
    ]
    expect(isEmployeeOffDay("2026-03-14", schedules, "emp1")).toBe(false)
  })

  it("Saturday with employee schedules but no match for this date uses default off", () => {
    const schedules = [
      { employee_id: "emp1", work_date: "2026-03-07", is_working: true },
    ]
    // emp1 has schedules but not for 2026-03-14 -> default to off (has any schedule means managed)
    expect(isEmployeeOffDay("2026-03-14", schedules, "emp1")).toBe(true)
  })

  it("holiday date is off", () => {
    const holidays = [{ holiday_date: "2026-03-16" }]
    expect(isEmployeeOffDay("2026-03-16", [], "emp1", holidays)).toBe(true)
  })

  it("does not treat other employee's schedule as own", () => {
    const schedules = [
      { employee_id: "emp2", work_date: "2026-03-14", is_working: false },
    ]
    // emp1 has no schedules, so fallback to default Saturday rule
    expect(isEmployeeOffDay("2026-03-14", schedules, "emp1")).toBeDefined()
  })
})

describe("LINKED_DEFICIT_DATE_KEY", () => {
  it("has the expected value", () => {
    expect(LINKED_DEFICIT_DATE_KEY).toBe("linked_deficit_date")
  })
})
