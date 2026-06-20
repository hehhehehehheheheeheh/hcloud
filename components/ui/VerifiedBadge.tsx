import { cn } from "@/lib/utils"

interface VerifiedBadgeProps {
  level: 1 | 2 | 3 | 4 | 5
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

const LEVEL_CONFIG = {
  1: {
    label: "L1",
    name: "Cơ Bản",
    bgClass: "bg-[#8E8E93]",
    textClass: "text-white",
    ringClass: "ring-[#8E8E93]/30",
  },
  2: {
    label: "L2",
    name: "Bảo Hộ",
    bgClass: "bg-[#34C759]",
    textClass: "text-white",
    ringClass: "ring-[#34C759]/30",
  },
  3: {
    label: "L3",
    name: "Giao Dịch",
    bgClass: "bg-[#007AFF]",
    textClass: "text-white",
    ringClass: "ring-[#007AFF]/30",
  },
  4: {
    label: "L4",
    name: "Pháp Lý",
    bgClass: "bg-[#C9A04A]",
    textClass: "text-white",
    ringClass: "ring-[#C9A04A]/30",
  },
  5: {
    label: "L5",
    name: "VIP",
    bgClass: "bg-gradient-to-br from-[#C9A04A] to-[#8B6914]",
    textClass: "text-white",
    ringClass: "ring-[#C9A04A]/40",
  },
} as const

const SIZE_CLASS = {
  sm: "px-1.5 py-0.5 text-[10px] gap-1",
  md: "px-2 py-1 text-xs gap-1.5",
  lg: "px-3 py-1.5 text-sm gap-2",
}

export function VerifiedBadge({ level, size = "md", showLabel = false, className }: VerifiedBadgeProps) {
  const config = LEVEL_CONFIG[level]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold ring-2",
        config.bgClass,
        config.textClass,
        config.ringClass,
        SIZE_CLASS[size],
        className,
      )}
      title={`HCloud Verified ${config.label} — ${config.name}`}
    >
      {/* Shield icon */}
      <svg
        viewBox="0 0 12 14"
        fill="currentColor"
        className={size === "sm" ? "h-2.5 w-2.5" : size === "md" ? "h-3 w-3" : "h-3.5 w-3.5"}
        aria-hidden="true"
      >
        <path d="M6 0L1 2.5v4C1 9.55 3.17 12.74 6 14c2.83-1.26 5-4.45 5-7.5v-4L6 0z" />
      </svg>
      <span>{config.label}</span>
      {showLabel && <span className="opacity-80">{config.name}</span>}
    </span>
  )
}
