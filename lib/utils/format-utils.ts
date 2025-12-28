/**
 * Format số tiền theo định dạng VND
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "0 ₫"
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format số với dấu phân cách hàng nghìn
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "0"
  return new Intl.NumberFormat("vi-VN").format(num)
}

/**
 * Parse số từ string có dấu phân cách
 */
export function parseNumber(str: string): number {
  return Number(str.replace(/[^\d.-]/g, "")) || 0
}
