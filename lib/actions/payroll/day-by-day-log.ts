import { toDateStringVN } from "@/lib/utils/date-utils"

export interface AllowanceAudit {
  typeName: string
  typeCode: string
  dailyAmount: number
  eligibleDates: string[]
  exemptDates: Array<{ date: string; codes: string[]; names: string[] }>
  gracedDates: string[]
  violationDates: Array<{ date: string; reasons: string[] }>
}

export interface PenaltyExempt {
  date: string
  typeName: string
  note: string
}

export interface RequestEntry {
  code: string
  typeName: string
  // Optional short hint to display (e.g. "07:00-12:00", "bù cho 2026-05-10")
  hint?: string
}

interface DayLogParams {
  startDate: string
  effectiveEndDate: string
  attendanceLogs: Array<{ check_in: string | null; check_out: string | null }>
  violations: Array<{
    date: string
    lateMinutes: number
    earlyMinutes: number
    isHalfDay: boolean
    isAbsent: boolean
    forgotCheckIn: boolean
    forgotCheckOut: boolean
    hasCheckIn: boolean
    hasCheckOut: boolean
  }>
  holidayMap: Map<string, string>
  companyHolidayMap: Map<string, string>
  leaveInfoByDate: Map<string, { typeName: string; code: string; fraction: number }>
  makeupDates: Set<string>
  // Chi tiết công bù đã cộng cho từng ngày làm bù (full_day_makeup có chấm công)
  makeupConsumeByDate: Map<string, { amount: number; deficitDates: string[] }>
  overtimeDates: Set<string>
  overtimeWithinShift: Set<string>
  otDetailsByDate: Map<string, Array<{ otType: string; hours: number; multiplier: number; amount: number }>>
  adjustmentDetails: Array<{
    category: string
    final_amount: number
    reason: string
    adjustment_type_id?: string
  }>
  attendanceDayFractions: Map<string, number>
  isEmployeeWorkingSaturday: (dateStr: string) => boolean
  countedDates: Set<string>
  requestsByDate: Map<string, RequestEntry[]>
  allowanceAudit: AllowanceAudit[]
  penaltyExempts: PenaltyExempt[]
  saturdayScheduleMap: Map<string, boolean>
}

const WEEKDAY_LABEL = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

function fmtTime(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  return d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  })
}

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

/**
 * Build per-day section of payroll log.
 * Iterates over each scheduled working day in [startDate, effectiveEndDate],
 * plus any extra days with attendance outside the schedule (Sat off / Sun).
 */
export function buildDayByDayLog(params: DayLogParams): string[] {
  const {
    startDate,
    effectiveEndDate,
    attendanceLogs,
    violations,
    holidayMap,
    companyHolidayMap,
    leaveInfoByDate,
    makeupDates,
    makeupConsumeByDate,
    overtimeDates,
    overtimeWithinShift,
    otDetailsByDate,
    adjustmentDetails,
    attendanceDayFractions,
    isEmployeeWorkingSaturday,
    countedDates,
    requestsByDate,
    allowanceAudit,
    penaltyExempts,
    saturdayScheduleMap,
  } = params

  // Index allowance audit by date for fast lookup
  const allowanceByDate = new Map<string, Array<{
    typeName: string
    status: "eligible" | "exempt" | "graced" | "violation"
    detail?: string
    amount: number
    graceIndex?: number
  }>>()
  for (const a of allowanceAudit) {
    for (const d of a.eligibleDates) {
      if (!allowanceByDate.has(d)) allowanceByDate.set(d, [])
      allowanceByDate.get(d)!.push({ typeName: a.typeName, status: "eligible", amount: a.dailyAmount })
    }
    for (const e of a.exemptDates) {
      if (!allowanceByDate.has(e.date)) allowanceByDate.set(e.date, [])
      allowanceByDate.get(e.date)!.push({
        typeName: a.typeName,
        status: "exempt",
        detail: e.names.length > 0 ? e.names.join(", ") : e.codes.join(", "),
        amount: a.dailyAmount,
      })
    }
    a.gracedDates.forEach((d, idx) => {
      if (!allowanceByDate.has(d)) allowanceByDate.set(d, [])
      allowanceByDate.get(d)!.push({
        typeName: a.typeName,
        status: "graced",
        amount: a.dailyAmount,
        graceIndex: idx + 1,
      })
    })
    for (const v of a.violationDates) {
      if (!allowanceByDate.has(v.date)) allowanceByDate.set(v.date, [])
      allowanceByDate.get(v.date)!.push({
        typeName: a.typeName,
        status: "violation",
        detail: v.reasons.join(", "),
        amount: a.dailyAmount,
      })
    }
  }

  const penaltyExemptByDate = new Map<string, PenaltyExempt[]>()
  for (const p of penaltyExempts) {
    if (!penaltyExemptByDate.has(p.date)) penaltyExemptByDate.set(p.date, [])
    penaltyExemptByDate.get(p.date)!.push(p)
  }

  // Group attendance by date (first entry per date wins for display)
  const attendanceByDate = new Map<string, { check_in: string | null; check_out: string | null }>()
  for (const log of attendanceLogs) {
    const dateStr = log.check_in ? toDateStringVN(log.check_in) : log.check_out ? toDateStringVN(log.check_out) : null
    if (!dateStr) continue
    if (!attendanceByDate.has(dateStr)) {
      attendanceByDate.set(dateStr, { check_in: log.check_in, check_out: log.check_out })
    } else {
      const existing = attendanceByDate.get(dateStr)!
      if (!existing.check_in && log.check_in) existing.check_in = log.check_in
      if (!existing.check_out && log.check_out) existing.check_out = log.check_out
    }
  }

  const violationByDate = new Map(violations.map((v) => [v.date, v]))

  // Parse adjustments that reference a specific date (penalties end with "ngày YYYY-MM-DD")
  const penaltyByDate = new Map<string, Array<{ reason: string; amount: number }>>()
  for (const d of adjustmentDetails) {
    if (d.category !== "penalty") continue
    const m = d.reason.match(/^(.+?)\s+ngày\s+(\d{4}-\d{2}-\d{2})$/)
    if (m) {
      const [, reason, date] = m
      if (!penaltyByDate.has(date)) penaltyByDate.set(date, [])
      penaltyByDate.get(date)!.push({ reason: reason.trim(), amount: d.final_amount })
    }
  }

  // Build set of all dates to emit: scheduled work days + extra attendance days
  const allDates = new Set<string>()
  const periodStart = parseLocalDate(startDate)
  const periodEnd = parseLocalDate(effectiveEndDate)
  const cur = new Date(periodStart)
  while (cur <= periodEnd) {
    const dateStr = `${cur.getUTCFullYear()}-${String(cur.getUTCMonth() + 1).padStart(2, "0")}-${String(cur.getUTCDate()).padStart(2, "0")}`
    const dow = cur.getUTCDay()
    const isSchedWork =
      dow !== 0 && !(dow === 6 && !isEmployeeWorkingSaturday(dateStr))
    if (isSchedWork) allDates.add(dateStr)
    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  for (const dateStr of attendanceByDate.keys()) {
    if (dateStr >= startDate && dateStr <= effectiveEndDate) allDates.add(dateStr)
  }

  const sortedDates = Array.from(allDates).sort()

  const lines: string[] = []
  lines.push("")
  lines.push("------------------------------------------------------------")
  lines.push("CHI TIẾT THEO NGÀY:")
  lines.push("------------------------------------------------------------")

  for (const dateStr of sortedDates) {
    const d = parseLocalDate(dateStr)
    const dow = d.getUTCDay()
    const dowLabel = WEEKDAY_LABEL[dow]
    const isHoliday = holidayMap.has(dateStr)
    const isCompanyHoliday = companyHolidayMap.has(dateStr)
    const isScheduledOff = dow === 0 || (dow === 6 && !isEmployeeWorkingSaturday(dateStr))

    const att = attendanceByDate.get(dateStr)
    const wasCounted = countedDates.has(dateStr)
    const leave = leaveInfoByDate.get(dateStr)
    const isMakeup = makeupDates.has(dateStr)
    const isOTFull = overtimeDates.has(dateStr)
    const isOTShift = overtimeWithinShift.has(dateStr)
    const otDetails = otDetailsByDate.get(dateStr) || []
    const violation = violationByDate.get(dateStr)
    const penalties = penaltyByDate.get(dateStr) || []
    const attFraction = attendanceDayFractions.get(dateStr)

    // Build header line: date + dow + day-type tag + attendance/leave/holiday summary
    const tags: string[] = []
    if (isHoliday) tags.push(`🎉 Lễ: ${holidayMap.get(dateStr)}`)
    if (isCompanyHoliday) tags.push(`🏢 Nghỉ công ty: ${companyHolidayMap.get(dateStr)}`)
    if (isScheduledOff && !isHoliday && !isCompanyHoliday) {
      if (dow === 6) {
        // Saturday: phân biệt override vs default
        if (saturdayScheduleMap.has(dateStr)) {
          tags.push("⚪ T7 nghỉ (theo phân công)")
        } else {
          tags.push("⚪ T7 nghỉ (lịch mặc định — chưa có phân công)")
        }
      } else {
        tags.push("⚪ Ngoài lịch")
      }
    } else if (!isScheduledOff && dow === 6) {
      // Saturday working day — note source
      if (saturdayScheduleMap.has(dateStr)) {
        tags.push("✓ T7 làm (theo phân công)")
      } else {
        tags.push("✓ T7 làm (lịch mặc định)")
      }
    }
    if (isMakeup) tags.push("[Ngày làm bù]")

    let summary = ""
    if (att && (att.check_in || att.check_out)) {
      const ci = fmtTime(att.check_in) || "—"
      const co = fmtTime(att.check_out) || "—"
      summary = `Vào ${ci} | Ra ${co}`
      const makeupConsume = isMakeup ? makeupConsumeByDate.get(dateStr) : undefined
      if (makeupConsume && makeupConsume.amount > 0) {
        // Ngày làm bù: công không cộng trực tiếp mà cộng qua công bù (consumed_days) cho ngày thiếu công gốc
        summary += ` (đã cộng ${makeupConsume.amount} công bù cho ${makeupConsume.deficitDates.join(", ")})`
      } else if (isMakeup) {
        summary += ` (làm bù nhưng chưa cộng công — chưa liên kết ngày thiếu công)`
      } else if (wasCounted && attFraction !== undefined) {
        summary += ` → ${attFraction} công`
      } else if (!wasCounted && isScheduledOff) {
        summary += ` (không tính công)`
      }
    } else if (leave) {
      if (leave.code === "unpaid_leave") {
        summary = `🏥 Nghỉ không lương${leave.typeName ? ` (${leave.typeName})` : ""} → 0 công`
      } else if (leave.code === "work_from_home") {
        summary = `🏠 WFH${leave.typeName ? ` (${leave.typeName})` : ""} → +${leave.fraction} công`
      } else {
        summary = `🏖 ${leave.typeName || "Nghỉ phép có lương"} → +${leave.fraction} công`
      }
    } else if (isHoliday) {
      summary = "→ +1 công lễ"
    } else if (isCompanyHoliday) {
      summary = "→ +1 công nghỉ công ty"
    } else if (!isScheduledOff) {
      summary = "❌ Vắng (không chấm công, không có phiếu)"
    }

    const headerLine = `  ${dateStr} (${dowLabel})${tags.length ? " " + tags.join(" ") : ""}${summary ? " " + summary : ""}`
    lines.push(headerLine)

    const INDENT = "      "

    // Violations (ngày làm bù được miễn vi phạm đi muộn/về sớm → không hiển thị)
    if (violation && !isMakeup) {
      const vparts: string[] = []
      if (violation.lateMinutes > 0) vparts.push(`Đi muộn ${violation.lateMinutes}p`)
      if (violation.earlyMinutes > 0) vparts.push(`Về sớm ${violation.earlyMinutes}p`)
      if (violation.forgotCheckIn) vparts.push("Quên check-in")
      if (violation.forgotCheckOut) vparts.push("Quên check-out")
      if (violation.isHalfDay) vparts.push("Nửa ngày")
      if (vparts.length > 0) lines.push(`${INDENT}⏰ Vi phạm: ${vparts.join(", ")}`)
    }

    // OT detail
    if (otDetails.length > 0) {
      for (const ot of otDetails) {
        lines.push(`${INDENT}➕ OT ${ot.hours}h ×${ot.multiplier} (${ot.otType}) = +${ot.amount.toLocaleString()}đ`)
      }
    } else if (isOTFull) {
      lines.push(`${INDENT}➕ OT full day`)
    } else if (isOTShift) {
      lines.push(`${INDENT}➕ OT trong ca`)
    }

    // All requests/tickets on this day
    const reqs = requestsByDate.get(dateStr) || []
    for (const r of reqs) {
      lines.push(`${INDENT}📄 Phiếu: ${r.typeName}${r.hint ? ` (${r.hint})` : ""}`)
    }

    // Penalty exemptions
    const exempts = penaltyExemptByDate.get(dateStr) || []
    for (const e of exempts) {
      lines.push(`${INDENT}🛡 Miễn "${e.typeName}": ${e.note}`)
    }

    // Penalties applied
    for (const p of penalties) {
      lines.push(`${INDENT}🚫 Phạt "${p.reason}": -${p.amount.toLocaleString()}đ`)
    }

    // Allowance status per day
    const allowances = allowanceByDate.get(dateStr) || []
    for (const a of allowances) {
      if (a.status === "eligible") {
        lines.push(`${INDENT}💰 ${a.typeName}: +${a.amount.toLocaleString()}đ (đủ điều kiện)`)
      } else if (a.status === "exempt") {
        lines.push(`${INDENT}💰 ${a.typeName}: +${a.amount.toLocaleString()}đ (miễn vi phạm — phiếu: ${a.detail})`)
      } else if (a.status === "graced") {
        lines.push(`${INDENT}💰 ${a.typeName}: +${a.amount.toLocaleString()}đ (miễn vi phạm lần ${a.graceIndex})`)
      } else if (a.status === "violation") {
        lines.push(`${INDENT}❌ Mất ${a.typeName} (${a.detail})`)
      }
    }
  }

  // ======================
  // TỔNG HỢP ĐIỀU CHỈNH
  // ======================
  // Bỏ qua các khoản đã hiển thị theo ngày (OT, phạt theo ngày → reason kết thúc bằng "ngày YYYY-MM-DD")
  const isPerDayEntry = (reason: string) => /\bngày\s+\d{4}-\d{2}-\d{2}\s*$/.test(reason)
  const allowanceItems = adjustmentDetails.filter(
    (d) => d.category === "allowance" && d.final_amount !== 0 && !isPerDayEntry(d.reason)
  )
  const deductionItems = adjustmentDetails.filter(
    (d) => d.category === "deduction" && d.final_amount !== 0
  )
  const penaltyItems = adjustmentDetails.filter(
    (d) => d.category === "penalty" && d.final_amount !== 0 && !isPerDayEntry(d.reason)
  )

  if (allowanceItems.length + deductionItems.length + penaltyItems.length > 0) {
    lines.push("")
    lines.push("------------------------------------------------------------")
    lines.push("📋 TỔNG HỢP ĐIỀU CHỈNH:")
    lines.push("------------------------------------------------------------")
    let allowanceTotal = 0
    for (const it of allowanceItems) {
      lines.push(`  💰 ${it.reason}: +${it.final_amount.toLocaleString()}đ`)
      allowanceTotal += it.final_amount
    }
    if (allowanceItems.length > 1) {
      lines.push(`     → Tổng phụ cấp (không theo ngày OT): +${allowanceTotal.toLocaleString()}đ`)
    }
    for (const it of deductionItems) {
      lines.push(`  💸 ${it.reason}: -${it.final_amount.toLocaleString()}đ`)
    }
    for (const it of penaltyItems) {
      lines.push(`  🚫 ${it.reason}: -${it.final_amount.toLocaleString()}đ`)
    }
  }

  return lines
}
