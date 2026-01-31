// =============================================
// PAYROLL TYPES & INTERFACES
// =============================================

export interface AttendanceViolation {
  date: string
  lateMinutes: number
  earlyMinutes: number
  isHalfDay: boolean
  isAbsent: boolean
  hasApprovedRequest: boolean
  approvedRequestTypes: string[]
  forgotCheckOut: boolean
  hasCheckIn: boolean
  hasCheckOut: boolean
}

export interface ShiftInfo {
  startTime: string
  endTime: string
  breakStart: string | null
  breakEnd: string | null
}

export interface ApprovedRequest {
  date: string
  types: string[]
}

export interface PayrollExportData {
  stt: number
  hoTen: string
  mcc: string
  ngayCongChuan: number
  mucLuongThang: number
  mucPhuCapNgay: number
  congTinhLuong: number
  tangCaThuong: number
  tangCaNgayNghi: number
  tangCaNgayLe: number
  phep: number
  truPhuCap: number
  luongThucTe: number
  phuCapThucTe: number
  bhxh: number
  congKhac: number
  truKhac: number
  thucNhan: number
  quy: number
  ck: number
  email: string
}
