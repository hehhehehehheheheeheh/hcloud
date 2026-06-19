"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  { href: "/dashboard", label: "File Explorer", icon: "📁" },
  { href: "/dashboard/items", label: "Kho rương", icon: "📦" },
  { href: "/dashboard/verified", label: "Xác thực", icon: "✅" },
  { href: "/dashboard/insurance", label: "Bảo hiểm", icon: "🛡️" },
  { href: "/dashboard/wallet", label: "Ví SD", icon: "💰" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r border-border bg-surface md:block">
        <div className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-white">H</span>
            </div>
            <span className="text-lg font-bold text-primary">HCloud</span>
          </Link>
        </div>
        <nav className="mt-4 px-3">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-primary/10 hover:text-primary"
              )}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 w-64 border-t border-border p-4">
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-primary"
          >
            &larr; Về trang chủ
          </Link>
        </div>
      </aside>
      <main className="flex-1 bg-white p-6">{children}</main>
    </div>
  )
}
