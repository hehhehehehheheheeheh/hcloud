import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "HCloud — Horizon Cloud Storage",
  description:
    "Niềm tin trong từng byte dữ liệu. Lưu trữ kỹ thuật số bảo mật, xác thực tài sản số HCloud Verified và bảo hiểm lưu trữ Shield Insurance — trực thuộc Horizon Group.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {/* Skip to main content — keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[8px] focus:bg-[#0A5C8C] focus:px-4 focus:py-2 focus:text-[14px] focus:font-medium focus:text-white focus:outline-none"
        >
          Chuyển đến nội dung chính
        </a>
        {children}
      </body>
    </html>
  )
}
