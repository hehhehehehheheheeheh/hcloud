"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

/* Config-driven — add items here without touching layout */
const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/pricing", label: "Pricing" },
] as const

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-all",
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-[#D2D2D7]/60 shadow-sm"
          : "bg-transparent",
      ].join(" ")}
      style={{ transitionDuration: "250ms", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
    >
      <nav
        className="mx-auto flex h-[58px] max-w-[1200px] items-center justify-between px-6"
        aria-label="Điều hướng chính"
      >
        {/* Left — wordmark */}
        <Link
          href="/"
          className="text-[17px] font-semibold tracking-[-0.01em] text-[#1D1D1F] select-none"
        >
          HCloud
        </Link>

        {/* Centre — nav links (desktop) */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label }) => {
            const current = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={current ? "page" : undefined}
                  className={[
                    "nav-link-underline relative pb-0.5 text-[14px] font-medium transition-colors",
                    "duration-150",
                    current ? "text-[#1D1D1F]" : "text-[#6E6E73] hover:text-[#1D1D1F]",
                  ].join(" ")}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Right — CTA button */}
        <div className="hidden md:flex items-center">
          <Link
            href="/register"
            className={[
              "inline-flex items-center rounded-[980px] px-5 py-[9px]",
              "bg-[#0A5C8C] text-white text-[14px] font-medium",
              "transition-all duration-150",
              "hover:bg-[#1470A8] hover:scale-[1.02]",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A5C8C]",
            ].join(" ")}
          >
            Bắt đầu
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A5C8C]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            {menuOpen ? (
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#D2D2D7]/60 bg-white/95 backdrop-blur-xl px-6 pt-4 pb-5 space-y-3">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block text-[15px] font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors py-1"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
            className="mt-3 block w-full rounded-[980px] bg-[#0A5C8C] px-5 py-2.5 text-center text-[14px] font-medium text-white hover:bg-[#1470A8] transition-colors"
          >
            Bắt đầu
          </Link>
        </div>
      )}
    </header>
  )
}
