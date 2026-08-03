export function initialsOf(name: string | null | undefined): string {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  )
}

export function whenLabelVN(days: number): string {
  if (days === 0) return "Hôm nay"
  if (days === 1) return "Ngày mai"
  return `${days} ngày nữa`
}
