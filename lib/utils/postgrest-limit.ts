/**
 * PostgREST (Supabase) cắt kết quả ở 1000 dòng và KHÔNG báo lỗi gì cả -
 * chỉ trả về đúng 1000 dòng như thể đó là toàn bộ dữ liệu.
 *
 * Đây là loại lỗi rất khó phát hiện: màn hình vẫn có dữ liệu, chỉ thiếu bớt.
 * Đã dính một lần ở trang Duyệt phiếu phép (1293 phiếu -> mất 293 phiếu cũ nhất).
 *
 * Gọi hàm này sau mỗi truy vấn danh sách trên bảng có thể vượt 1000 dòng.
 */
export const POSTGREST_MAX_ROWS = 1000

export function warnIfTruncated(label: string, rows: unknown[] | null | undefined): void {
  if (rows && rows.length === POSTGREST_MAX_ROWS) {
    console.warn(
      `[${label}] trả về đúng ${POSTGREST_MAX_ROWS} dòng - gần như chắc chắn đã bị ` +
        `PostgREST cắt cụt và đang thiếu dữ liệu. Cần thêm bộ lọc hoặc phân trang.`
    )
  }
}
