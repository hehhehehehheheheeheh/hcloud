"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/* Config-driven sidebar items */
const SIDEBAR_LINKS = [
  {
    href: "/dashboard",
    label: "Files",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/items",
    label: "Rương vật phẩm",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/dashboard/verified",
    label: "Xác thực",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/dashboard/insurance",
    label: "Bảo hiểm",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/dashboard/wallet",
    label: "Ví SD",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    ),
  },
] as const

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">

      {/* Sidebar — Finder-style */}
      <aside className="hidden md:flex flex-col w-56 border-r border-[#D2D2D7]/70 bg-[#F5F5F7]">
        {/* Wordmark */}
        <div className="px-4 pt-5 pb-4">
          <Link
            href="/"
            className="text-[16px] font-semibold text-[#1D1D1F] tracking-[-0.01em] hover:opacity-75 transition-opacity"
          >
            HCloud
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 space-y-0.5" aria-label="Dashboard">
          {SIDEBAR_LINKS.map(({ href, label, icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex items-center gap-2.5 rounded-[8px] px-2.5 py-1.5",
                  "text-[13px] font-medium transition-colors duration-100",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A5C8C]",
                  active
                    ? "bg-[#0A5C8C] text-white"
                    : "text-[#6E6E73] hover:bg-[#E5E5EA] hover:text-[#1D1D1F]",
                ].join(" ")}
              >
                {icon}
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#D2D2D7]/70 px-4 py-3">
          <Link href="/" className="text-[12px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">
            ← Trang chủ
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-white min-h-screen">{children}</main>
    </div>
  )
}
