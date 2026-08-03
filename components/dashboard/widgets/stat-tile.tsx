import { cn } from "@/lib/utils"

export type StatTone = "violet" | "green" | "amber" | "red" | "blue" | "slate"

const toneStyles: Record<StatTone, { box: string; value: string; label: string }> = {
  violet: { box: "bg-violet-50 border-violet-100", value: "text-violet-600", label: "text-violet-700/70" },
  green: { box: "bg-emerald-50 border-emerald-100", value: "text-emerald-600", label: "text-emerald-700/70" },
  amber: { box: "bg-amber-50 border-amber-100", value: "text-amber-600", label: "text-amber-700/70" },
  red: { box: "bg-rose-50 border-rose-100", value: "text-rose-600", label: "text-rose-700/70" },
  blue: { box: "bg-sky-50 border-sky-100", value: "text-sky-600", label: "text-sky-700/70" },
  slate: { box: "bg-slate-50 border-slate-100", value: "text-slate-600", label: "text-slate-500" },
}

export function StatTile({
  label,
  value,
  tone = "slate",
  className,
}: {
  label: string
  value: string | number
  tone?: StatTone
  className?: string
}) {
  const s = toneStyles[tone]
  return (
    <div className={cn("rounded-xl border px-3 py-3", s.box, className)}>
      <p className={cn("text-xs font-medium", s.label)}>{label}</p>
      <p className={cn("mt-1 text-2xl font-bold", s.value)}>{value}</p>
    </div>
  )
}
