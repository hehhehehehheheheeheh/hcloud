import { cn } from "@/lib/utils"

interface SecureChestIconProps {
  size?: number
  locked?: boolean
  className?: string
}

export function SecureChestIcon({ size = 40, locked = true, className }: SecureChestIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-label="Rương bảo mật"
    >
      {/* Chest body */}
      <rect x="4" y="18" width="32" height="18" rx="3" fill="#1D1D1F" fillOpacity="0.08" />
      <rect x="4" y="18" width="32" height="18" rx="3" stroke="#1D1D1F" strokeOpacity="0.2" strokeWidth="1.5" />

      {/* Chest lid */}
      <path
        d="M4 21C4 19.34 5.34 18 7 18H33C34.66 18 36 19.34 36 21V22H4V21Z"
        fill="#0A5C8C"
        fillOpacity="0.12"
        stroke="#0A5C8C"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />

      {/* Lid hinge / rim line */}
      <line x1="4" y1="22" x2="36" y2="22" stroke="#1D1D1F" strokeOpacity="0.15" strokeWidth="1" />

      {/* Lock plate */}
      <rect x="16" y="24" width="8" height="7" rx="1.5" fill="#0A5C8C" fillOpacity="0.15" stroke="#0A5C8C" strokeOpacity="0.5" strokeWidth="1.2" />

      {/* Lock shackle */}
      {locked ? (
        <path
          d="M17.5 24V22C17.5 20.62 18.62 19.5 20 19.5C21.38 19.5 22.5 20.62 22.5 22V24"
          stroke="#0A5C8C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M17.5 24V22C17.5 20.62 18.62 19.5 20 19.5C21.38 19.5 22.5 20.62 22.5 22"
          stroke="#0A5C8C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}

      {/* Keyhole */}
      <circle cx="20" cy="27" r="1.2" fill="#0A5C8C" fillOpacity="0.6" />
      <rect x="19.35" y="27.8" width="1.3" height="1.8" rx="0.5" fill="#0A5C8C" fillOpacity="0.6" />

      {/* Corner rivets */}
      <circle cx="8" cy="26" r="1" fill="#1D1D1F" fillOpacity="0.12" />
      <circle cx="32" cy="26" r="1" fill="#1D1D1F" fillOpacity="0.12" />
      <circle cx="8" cy="32" r="1" fill="#1D1D1F" fillOpacity="0.12" />
      <circle cx="32" cy="32" r="1" fill="#1D1D1F" fillOpacity="0.12" />
    </svg>
  )
}
