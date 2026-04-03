/**
 * Utility for capturing and formatting payroll calculation logs
 */

export class PayrollLogger {
  private logs: string[] = []

  log(message: string) {
    this.logs.push(message)
    console.log(message)
  }

  section(title: string) {
    const separator = "=".repeat(60)
    this.log(`\n${separator}`)
    this.log(title)
    this.log(separator)
  }

  subsection(title: string) {
    this.log(`\n${title}`)
  }

  item(label: string, value: string | number) {
    this.log(`  - ${label}: ${value}`)
  }

  detail(message: string) {
    this.log(`  ${message}`)
  }

  violation(date: string, checkIn: string | null, checkOut: string | null, hasCheckInRequest: boolean, hasCheckOutRequest: boolean, isHalfDay?: boolean) {
    const checkInDisplay = checkIn || "không có"
    const checkOutDisplay = checkOut || "không có"
    const halfDayNote = isHalfDay ? " (chỉ làm ca sáng)" : ""
    
    this.log(`[Violations] Ngày ${date}: check_in=${checkInDisplay}, check_out=${checkOutDisplay}, phiếu_checkin=${hasCheckInRequest}, phiếu_checkout=${hasCheckOutRequest}${halfDayNote}`)
  }

  getLog(): string {
    return this.logs.join("\n")
  }

  clear() {
    this.logs = []
  }
}
