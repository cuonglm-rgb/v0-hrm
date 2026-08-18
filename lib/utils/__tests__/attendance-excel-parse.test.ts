import { describe, it, expect } from "vitest"
import { parseAttendanceSheet, parseDateValue, parseTimeValue } from "@/lib/utils/attendance-excel-parse"

const HEADER = ["Mã N.Viên", "Tên nhân viên", "Phòng ban", "Chức vụ", "Ngày", "Thứ", "Vào", "Ra"]

function sheet(...dataRows: unknown[][]): unknown[][] {
  return [
    ["CHI TIẾT CHẤM CÔNG"],
    ["Từ ngày 01/01/2026 đến ngày 31/01/2026"],
    HEADER,
    ...dataRows,
  ]
}

describe("parseAttendanceSheet", () => {
  it("gộp nhiều dòng cùng nhân viên + ngày: giờ vào sớm nhất, giờ ra muộn nhất", () => {
    const result = parseAttendanceSheet(
      sheet(
        ["2", "Nguyễn Văn A", "VP", "NV", "02/01/2026", "Sáu", "8:10", "12:00"],
        ["2", "Nguyễn Văn A", "VP", "NV", "02/01/2026", "Sáu", "7:53", "17:25"],
      )
    )

    expect(result.success).toBe(true)
    expect(result.total).toBe(2)
    expect(result.groups).toHaveLength(1)
    expect(result.groups[0]).toMatchObject({
      code: "2",
      codeRaw: "2",
      date: "2026-01-02",
      checkIn: "07:53",
      checkOut: "17:25",
      checkInCount: 2,
    })
  })

  it("tách group theo từng nhân viên và từng ngày", () => {
    const result = parseAttendanceSheet(
      sheet(
        ["2", "A", "VP", "NV", "02/01/2026", "Sáu", "7:53", "17:25"],
        ["2", "A", "VP", "NV", "03/01/2026", "Bảy", "8:00", "17:30"],
        ["3", "B", "KT", "NV", "02/01/2026", "Sáu", "8:15", "17:45"],
      )
    )

    expect(result.groups).toHaveLength(3)
  })

  it("giữ checkInCount = 1 khi chỉ có đúng một lần chấm công ở cột Vào", () => {
    const result = parseAttendanceSheet(
      sheet(["2", "A", "VP", "NV", "02/01/2026", "Sáu", "17:40", ""])
    )

    expect(result.groups[0]).toMatchObject({
      checkIn: "17:40",
      checkOut: null,
      checkInCount: 1,
    })
  })

  it("bỏ qua dòng rỗng, dòng không có mã NV và dòng không có cả giờ vào lẫn giờ ra", () => {
    const result = parseAttendanceSheet(
      sheet(
        [],
        ["", "", "", "", "02/01/2026", "Sáu", "8:00", "17:00"],
        ["2", "A", "VP", "NV", "02/01/2026", "Sáu", "", ""],
        ["2", "A", "VP", "NV", "02/01/2026", "Sáu", "8:00", "17:00"],
      )
    )

    expect(result.skipped).toBe(3)
    expect(result.groups).toHaveLength(1)
  })

  it("báo lỗi khi ngày không hợp lệ", () => {
    const result = parseAttendanceSheet(
      sheet(["2", "A", "VP", "NV", "khong-phai-ngay", "Sáu", "8:00", "17:00"])
    )

    expect(result.groups).toHaveLength(0)
    expect(result.skipped).toBe(1)
    expect(result.errors[0]).toContain("Ngày không hợp lệ")
  })

  it("báo lỗi khi không tìm thấy header", () => {
    const result = parseAttendanceSheet([["A"], ["B"], ["C"], ["D"]])

    expect(result.success).toBe(false)
    expect(result.errors[0]).toContain("Mã N.Viên")
  })
})

describe("parseDateValue", () => {
  it("parse dd/mm/yyyy", () => {
    expect(parseDateValue("02/01/2026")).toBe("2026-01-02")
    expect(parseDateValue("2/1/2026")).toBe("2026-01-02")
  })

  it("parse Excel date serial number", () => {
    // 45000 = 2023-03-15
    expect(parseDateValue(45000)).toBe("2023-03-15")
  })

  it("trả về null với giá trị không hợp lệ", () => {
    expect(parseDateValue("")).toBeNull()
    expect(parseDateValue(null)).toBeNull()
    expect(parseDateValue("31/02/2026")).toBeNull()
  })
})

describe("parseTimeValue", () => {
  it("parse HH:mm và H:mm", () => {
    expect(parseTimeValue("8:05")).toBe("08:05")
    expect(parseTimeValue("17:25:30")).toBe("17:25")
  })

  it("parse Excel time fraction", () => {
    expect(parseTimeValue(0.5)).toBe("12:00")
  })

  it("trả về null với giá trị không hợp lệ", () => {
    expect(parseTimeValue("")).toBeNull()
    expect(parseTimeValue("25:00")).toBeNull()
  })
})
