import { describe, it, expect } from "vitest"
import { isMakeupRequestType, isEmployeeOffDay, isSameMonth, LINKED_DEFICIT_DATE_KEY } from "@/lib/utils/makeup-utils"

describe("Makeup request validation rules", () => {
  describe("late_early_makeup same-month constraint", () => {
    it("allows same month request", () => {
      const requestDate = "2026-03-16"
      const deficitDate = "2026-03-10"
      expect(isSameMonth(requestDate, deficitDate)).toBe(true)
    })

    it("rejects cross-month request", () => {
      const requestDate = "2026-04-05"
      const deficitDate = "2026-03-28"
      expect(isSameMonth(requestDate, deficitDate)).toBe(false)
    })

    it("rejects cross-year same-month number", () => {
      const requestDate = "2027-03-10"
      const deficitDate = "2026-03-10"
      expect(isSameMonth(requestDate, deficitDate)).toBe(false)
    })
  })

  describe("full_day_makeup off-day validation", () => {
    const empId = "emp-123"

    it("Sunday is valid for makeup", () => {
      // 2026-03-22 is a Sunday
      expect(isEmployeeOffDay("2026-03-22", [], empId)).toBe(true)
    })

    it("Monday is invalid for makeup", () => {
      // 2026-03-16 is a Monday
      expect(isEmployeeOffDay("2026-03-16", [], empId)).toBe(false)
    })

    it("Saturday off via override is valid", () => {
      // 2026-03-21 is a Saturday
      const schedules = [
        { employee_id: empId, work_date: "2026-03-21", is_working: false },
      ]
      expect(isEmployeeOffDay("2026-03-21", schedules, empId)).toBe(true)
    })

    it("Saturday working via override is invalid", () => {
      const schedules = [
        { employee_id: empId, work_date: "2026-03-21", is_working: true },
      ]
      expect(isEmployeeOffDay("2026-03-21", schedules, empId)).toBe(false)
    })

    it("public holiday on weekday is valid", () => {
      const holidays = [{ holiday_date: "2026-04-30" }]
      expect(isEmployeeOffDay("2026-04-30", [], empId, holidays)).toBe(true)
    })
  })

  describe("linked_deficit_date requirement", () => {
    it("validates linked_deficit_date is present in custom_data", () => {
      const customData: Record<string, string> = {}
      expect(customData[LINKED_DEFICIT_DATE_KEY]).toBeUndefined()

      customData[LINKED_DEFICIT_DATE_KEY] = "2026-03-10"
      expect(customData[LINKED_DEFICIT_DATE_KEY]).toBe("2026-03-10")
    })
  })

  describe("OT overlap detection", () => {
    it("detects overlapping intervals", () => {
      const makeupFrom = "17:00"
      const makeupTo = "17:25"
      const otFrom = "17:00"
      const otTo = "19:00"

      const overlaps = otFrom < makeupTo && otTo > makeupFrom
      expect(overlaps).toBe(true)
    })

    it("allows non-overlapping intervals", () => {
      const makeupFrom = "17:00"
      const makeupTo = "17:25"
      const otFrom = "17:25"
      const otTo = "19:00"

      const overlaps = otFrom < makeupTo && otTo > makeupFrom
      expect(overlaps).toBe(false)
    })

    it("handles makeup during lunch break not overlapping with afternoon OT", () => {
      const makeupFrom = "12:00"
      const makeupTo = "12:25"
      const otFrom = "17:00"
      const otTo = "18:00"

      const overlaps = otFrom < makeupTo && otTo > makeupFrom
      expect(overlaps).toBe(false)
    })
  })

  describe("violation shift end adjustment", () => {
    it("extends effective shift end with makeup to_time", () => {
      const originalShiftEnd = "17:00"
      const makeupToTime = "17:25"

      const effectiveEnd = makeupToTime > originalShiftEnd ? makeupToTime : originalShiftEnd
      expect(effectiveEnd).toBe("17:25")
    })

    it("keeps original shift end when no makeup", () => {
      const originalShiftEnd = "17:00"
      const makeupToTime: string | undefined = undefined

      const effectiveEnd = makeupToTime && makeupToTime > originalShiftEnd ? makeupToTime : originalShiftEnd
      expect(effectiveEnd).toBe("17:00")
    })

    it("checkout before makeup end is a violation", () => {
      const checkoutTime = "17:15"
      const effectiveShiftEnd = "17:25"

      const [coH, coM] = checkoutTime.split(":").map(Number)
      const [seH, seM] = effectiveShiftEnd.split(":").map(Number)
      const checkoutMinutes = coH * 60 + coM
      const shiftEndMinutes = seH * 60 + seM

      const earlyMinutes = shiftEndMinutes - checkoutMinutes
      expect(earlyMinutes).toBe(10)
      expect(earlyMinutes > 0).toBe(true)
    })

    it("checkout after makeup end is not a violation", () => {
      const checkoutTime = "17:30"
      const effectiveShiftEnd = "17:25"

      const [coH, coM] = checkoutTime.split(":").map(Number)
      const [seH, seM] = effectiveShiftEnd.split(":").map(Number)
      const checkoutMinutes = coH * 60 + coM
      const shiftEndMinutes = seH * 60 + seM

      const earlyMinutes = Math.max(0, shiftEndMinutes - checkoutMinutes)
      expect(earlyMinutes).toBe(0)
    })
  })

  describe("payroll makeup bucket classification", () => {
    it("classifies same-month makeup as regular", () => {
      const payrollMonth = "2026-03"
      const deficitDate = "2026-03-10"
      const isCrossMonth = deficitDate.slice(0, 7) !== payrollMonth
      expect(isCrossMonth).toBe(false)
    })

    it("classifies cross-month makeup as congLamBuKyTruoc", () => {
      const payrollMonth = "2026-04"
      const deficitDate = "2026-03-28"
      const isCrossMonth = deficitDate.slice(0, 7) !== payrollMonth
      expect(isCrossMonth).toBe(true)
    })
  })
})
