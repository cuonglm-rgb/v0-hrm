import { describe, it, expect } from "vitest"
import { isMakeupRequestType, isEmployeeOffDay, isSameMonth, LINKED_DEFICIT_DATE_KEY, getMakeupDeficitLinks, findLateEarlyMakeupForDeficitDate } from "../makeup-utils"
import { DEFAULT_SATURDAY_CONFIG, isSaturdayOffByDefault } from "../saturday-utils"

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

  it("Saturday with employee schedules but no match for this date falls back to company default", () => {
    const schedules = [
      { employee_id: "emp1", work_date: "2026-03-07", is_working: true },
    ]
    // 2026-03-14 chưa được phân công -> theo lịch mặc định công ty (mốc 2026-01-10 nghỉ)
    expect(isEmployeeOffDay("2026-03-14", schedules, "emp1")).toBe(isSaturdayOffByDefault("2026-03-14"))
  })

  it("unassigned_saturday_is_off makes unassigned Saturdays off for managed employees", () => {
    const schedules = [
      { employee_id: "emp1", work_date: "2026-03-07", is_working: true },
    ]
    const config = { ...DEFAULT_SATURDAY_CONFIG, unassigned_saturday_is_off: true }
    expect(isEmployeeOffDay("2026-03-14", schedules, "emp1", [], config)).toBe(true)
  })

  it("mode all_working makes every Saturday a working day", () => {
    const config = { ...DEFAULT_SATURDAY_CONFIG, mode: "all_working" as const }
    expect(isEmployeeOffDay("2026-03-14", [], "emp1", [], config)).toBe(false)
    expect(isEmployeeOffDay("2026-03-21", [], "emp1", [], config)).toBe(false)
  })

  it("mode all_off makes every Saturday an off day", () => {
    const config = { ...DEFAULT_SATURDAY_CONFIG, mode: "all_off" as const }
    expect(isEmployeeOffDay("2026-03-14", [], "emp1", [], config)).toBe(true)
    expect(isEmployeeOffDay("2026-03-21", [], "emp1", [], config)).toBe(true)
  })

  it("anchor date drives the alternating pattern", () => {
    const config = {
      ...DEFAULT_SATURDAY_CONFIG,
      anchor_date: "2026-08-29",
      anchor_is_working: true,
    }
    expect(isEmployeeOffDay("2026-08-29", [], "emp1", [], config)).toBe(false)
    expect(isEmployeeOffDay("2026-09-05", [], "emp1", [], config)).toBe(true)
    expect(isEmployeeOffDay("2026-09-12", [], "emp1", [], config)).toBe(false)
    // cả các thứ 7 trước mốc cũng suy ra được
    expect(isEmployeeOffDay("2026-08-22", [], "emp1", [], config)).toBe(true)
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

describe("getMakeupDeficitLinks", () => {
  it("returns empty array for null/undefined custom_data", () => {
    expect(getMakeupDeficitLinks(null)).toEqual([])
    expect(getMakeupDeficitLinks(undefined)).toEqual([])
  })

  it("returns linked_deficit_links when present and non-empty", () => {
    const customData = {
      linked_deficit_links: [
        { deficit_date: "2026-03-06", amount: 0.5 },
        { deficit_date: "2026-03-13", amount: 0.5 },
      ],
    }
    expect(getMakeupDeficitLinks(customData)).toEqual([
      { deficit_date: "2026-03-06", amount: 0.5 },
      { deficit_date: "2026-03-13", amount: 0.5 },
    ])
  })

  it("falls back to linked_deficit_date as single link amount 1 when no links array", () => {
    const customData = { linked_deficit_date: "2026-03-10" }
    expect(getMakeupDeficitLinks(customData)).toEqual([{ deficit_date: "2026-03-10", amount: 1 }])
  })

  it("prefers linked_deficit_links over linked_deficit_date when both present", () => {
    const customData = {
      linked_deficit_date: "2026-03-01",
      linked_deficit_links: [{ deficit_date: "2026-03-06", amount: 0.5 }],
    }
    expect(getMakeupDeficitLinks(customData)).toEqual([{ deficit_date: "2026-03-06", amount: 0.5 }])
  })

  it("falls back to linked_deficit_date when linked_deficit_links is empty array", () => {
    const customData = { linked_deficit_links: [], linked_deficit_date: "2026-03-15" }
    expect(getMakeupDeficitLinks(customData)).toEqual([{ deficit_date: "2026-03-15", amount: 1 }])
  })
})


describe("findLateEarlyMakeupForDeficitDate", () => {
  const EMP = "emp-1"
  // Case thật: phiếu nộp cho ngày đi làm bù 21/08, bù cho ngày thiếu công gốc 20/08
  const makeupOnOtherDay = {
    employee_id: EMP,
    status: "approved",
    request_date: "2026-08-21",
    custom_data: { linked_deficit_date: "2026-08-20" },
    request_type: { code: "late_early_makeup", name: "Làm bù (đi muộn/ về sớm)" },
  }

  it("finds the makeup request by deficit date, not by request_date", () => {
    const found = findLateEarlyMakeupForDeficitDate("2026-08-20", EMP, [makeupOnOtherDay])
    expect(found?.request_type.name).toBe("Làm bù (đi muộn/ về sớm)")
  })

  it("returns null for the day the makeup work was actually done", () => {
    expect(findLateEarlyMakeupForDeficitDate("2026-08-21", EMP, [makeupOnOtherDay])).toBeNull()
  })

  it("returns null for an unrelated date", () => {
    expect(findLateEarlyMakeupForDeficitDate("2026-08-19", EMP, [makeupOnOtherDay])).toBeNull()
  })

  it("ignores requests of another employee", () => {
    expect(findLateEarlyMakeupForDeficitDate("2026-08-20", "emp-2", [makeupOnOtherDay])).toBeNull()
  })

  it("ignores requests that are not approved", () => {
    const pending = { ...makeupOnOtherDay, status: "pending" }
    expect(findLateEarlyMakeupForDeficitDate("2026-08-20", EMP, [pending])).toBeNull()
  })

  it("ignores full_day_makeup requests", () => {
    const fullDay = {
      ...makeupOnOtherDay,
      request_type: { code: "full_day_makeup", name: "Làm bù cả ngày" },
    }
    expect(findLateEarlyMakeupForDeficitDate("2026-08-20", EMP, [fullDay])).toBeNull()
  })

  it("supports multiple deficit links in one request", () => {
    const multi = {
      ...makeupOnOtherDay,
      custom_data: {
        linked_deficit_links: [
          { deficit_date: "2026-08-18", amount: 0.5 },
          { deficit_date: "2026-08-20", amount: 0.5 },
        ],
      },
    }
    expect(findLateEarlyMakeupForDeficitDate("2026-08-18", EMP, [multi])).toBe(multi)
    expect(findLateEarlyMakeupForDeficitDate("2026-08-20", EMP, [multi])).toBe(multi)
    expect(findLateEarlyMakeupForDeficitDate("2026-08-19", EMP, [multi])).toBeNull()
  })

  it("returns null when employeeId is undefined", () => {
    expect(findLateEarlyMakeupForDeficitDate("2026-08-20", undefined, [makeupOnOtherDay])).toBeNull()
  })
})
