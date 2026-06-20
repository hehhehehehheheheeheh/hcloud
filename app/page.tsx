"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useScrollReveal } from "@/hooks/useScrollReveal"

/* ──────────────────────────────────────────────────────
   Data — 4 core services
   ────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: "storage",
    title: "Lưu trữ kỹ thuật số",
    desc: "Mã hoá AES-256-GCM, presigned URL, dedup SHA-256, resume upload không giới hạn kích thước file.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8" aria-hidden>
        <rect x="4" y="6" width="24" height="20" rx="3" stroke="#0A5C8C" strokeWidth="1.6" />
        <path d="M4 12h24" stroke="#0A5C8C" strokeWidth="1.2" strokeDasharray="3 2" />
        <circle cx="10" cy="9" r="1.2" fill="#0A5C8C" />
        <circle cx="14" cy="9" r="1.2" fill="#0A5C8C" />
        <path d="M10 18h12M10 22h8" stroke="#0A5C8C" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "verified",
    title: "HCloud Verified",
    desc: "Hệ thống xác thực quyền sở hữu tài sản số L1–L5. Mỗi file được gắn mức xác thực riêng, badge hiển thị trực quan.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8" aria-hidden>
        <path d="M16 3L5 7.5v6C5 19.55 9.67 25.48 16 28c6.33-2.52 11-8.45 11-14.5v-6L16 3z" stroke="#0A5C8C" strokeWidth="1.6" />
        <path d="M11 16l3 3 7-7" stroke="#0A5C8C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "insurance",
    title: "Bảo hiểm Shield",
    desc: "Đền bù tới 100% giá trị tài sản L3+ theo công thức minh bạch. Claim online, giải ngân SD tự động.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8" aria-hidden>
        <path d="M16 3L5 7.5v6C5 19.55 9.67 25.48 16 28c6.33-2.52 11-8.45 11-14.5v-6L16 3z" stroke="#0A5C8C" strokeWidth="1.6" />
        <path d="M16 11v5M16 19h.01" stroke="#0A5C8C" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "items",
    title: "Rương vật phẩm",
    desc: "Rương bảo mật gắn vật phẩm Mini World / Minecraft. Quản lý kho trực quan, mỗi rương là 1 slot bảo vệ riêng.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8" aria-hidden>
        <rect x="4" y="16" width="24" height="13" rx="2.5" stroke="#0A5C8C" strokeWidth="1.6" />
        <path d="M4 19.5C4 18.12 5.12 17 6.5 17H25.5C26.88 17 28 18.12 28 19.5V20H4V19.5Z" stroke="#0A5C8C" strokeWidth="1.2" />
        <path d="M13 16V13.5C13 12.12 14.34 11 16 11C17.66 11 19 12.12 19 13.5V16" stroke="#0A5C8C" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="14" y="22" width="4" height="4" rx="1" stroke="#0A5C8C" strokeWidth="1.2" />
        <circle cx="16" cy="24" r="0.8" fill="#0A5C8C" />
      </svg>
    ),
  },
]

/* ──────────────────────────────────────────────────────
   Visual Signature — abstract "locked data block"
   ────────────────────────────────────────────────────── */
function DataLockVisual() {
  return (
    <div className="animate-hero pointer-events-none select-none" style={{ animationDelay: "100ms" }}>
      <svg
        viewBox="0 0 320 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-xs mx-auto opacity-90"
        aria-hidden
      >
        {/* Back plane */}
        <rect x="50" y="60" width="180" height="150" rx="16" fill="#F5F5F7" stroke="#D2D2D7" strokeWidth="1.5" />
        {/* Mid plane */}
        <rect x="35" y="75" width="180" height="150" rx="16" fill="#EEF2F7" stroke="#D2D2D7" strokeWidth="1.5" />
        {/* Front plane */}
        <rect x="20" y="90" width="180" height="150" rx="16" fill="white" stroke="#D2D2D7" strokeWidth="1.5" />

        {/* Data lines on front */}
        <rect x="36" y="112" width="100" height="8" rx="4" fill="#0A5C8C" fillOpacity="0.12" />
        <rect x="36" y="128" width="80" height="6" rx="3" fill="#0A5C8C" fillOpacity="0.08" />
        <rect x="36" y="142" width="120" height="6" rx="3" fill="#0A5C8C" fillOpacity="0.08" />
        <rect x="36" y="156" width="60" height="6" rx="3" fill="#0A5C8C" fillOpacity="0.06" />
        <rect x="36" y="170" width="90" height="6" rx="3" fill="#0A5C8C" fillOpacity="0.06" />

        {/* Lock / shield on front */}
        <g transform="translate(148, 100)">
          <path
            d="M18 0L2 6v8C2 20.9 8.93 27.64 18 30c9.07-2.36 16-9.1 16-16V6L18 0z"
            fill="#0A5C8C"
            fillOpacity="0.1"
            stroke="#0A5C8C"
            strokeWidth="1.5"
          />
          <path d="M13 17l3 3.5 7-8" stroke="#0A5C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Verified badge dot */}
        <circle cx="204" cy="93" r="12" fill="#C9A04A" />
        <path d="M198 93l3 3.5 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Connecting lines (depth) */}
        <line x1="200" y1="90" x2="215" y2="75" stroke="#D2D2D7" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="200" y1="240" x2="215" y2="225" stroke="#D2D2D7" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="20" y1="90" x2="35" y2="75" stroke="#D2D2D7" strokeWidth="1" strokeDasharray="3 2" />
      </svg>
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────── */
export default function Home() {
  // Trigger scroll-reveal after mount
  useScrollReveal()

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-white px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          {/* Subtle gradient wash */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(10,92,140,0.07) 0%, transparent 70%)",
            }}
            aria-hidden
          />

          <div className="relative mx-auto max-w-[1200px]">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Text — animates as a single unit */}
              <div className="animate-hero">
                <p className="text-[13px] font-medium tracking-widest text-[#0A5C8C] uppercase mb-4">
                  Horizon Cloud · Hệ sinh thái Syreal
                </p>
                <h1 className="text-[52px] leading-[1.06] font-semibold tracking-[-0.025em] text-[#1D1D1F] md:text-[64px]">
                  Niềm tin trong&nbsp;
                  <br className="hidden md:block" />
                  từng byte
                  <br />
                  dữ&nbsp;liệu.
                </h1>
                <p className="mt-6 text-[17px] leading-[1.55] text-[#6E6E73] max-w-md">
                  Lưu trữ bảo mật, xác thực tài sản số HCloud Verified và bảo hiểm lưu trữ Shield — tất cả trong một hệ thống thanh toán SD.
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center rounded-[980px] bg-[#0A5C8C] px-6 py-3 text-[15px] font-medium text-white hover:bg-[#1470A8] hover:scale-[1.02] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A5C8C]"
                  >
                    Bắt đầu miễn phí
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center rounded-[980px] border border-[#D2D2D7] px-6 py-3 text-[15px] font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A5C8C]"
                  >
                    Xem bảng giá
                  </Link>
                </div>
              </div>

              {/* Visual */}
              <DataLockVisual />
            </div>
          </div>
        </section>

        {/* ── Services ── */}
        <section className="bg-[#F5F5F7] px-6 py-[96px]">
          <div className="mx-auto max-w-[1200px]">
            <div className="text-center reveal">
              <h2 className="text-[36px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                Bốn dịch vụ cốt lõi
              </h2>
              <p className="mt-4 text-[17px] text-[#6E6E73]">
                Một hệ sinh thái bảo vệ dữ liệu toàn diện, thanh toán bằng SD.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((service) => (
                <div
                  key={service.id}
                  className={[
                    "reveal group rounded-[18px] bg-white p-7",
                    "border border-[#D2D2D7]/60",
                    "transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(10,92,140,0.10)]",
                  ].join(" ")}
                >
                  <div className="mb-5">{service.icon}</div>
                  <h3 className="text-[16px] font-semibold text-[#1D1D1F] tracking-[-0.01em]">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-[1.55] text-[#6E6E73]">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust bar ── */}
        <section className="bg-white px-6 py-[96px]">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { stat: "AES-256-GCM", label: "Mã hoá dữ liệu lưu trữ & truyền tải" },
                { stat: "L1 – L5", label: "Cấp độ xác thực quyền sở hữu tài sản số" },
                { stat: "100%", label: "Đền bù tối đa gói Adv. cho file Verified L3+" },
              ].map(({ stat, label }) => (
                <div key={stat} className="reveal text-center">
                  <p className="tabular-nums text-[40px] font-semibold tracking-[-0.025em] text-[#0A5C8C]">
                    {stat}
                  </p>
                  <p className="mt-2 text-[14px] text-[#6E6E73] leading-relaxed">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-[#0A5C8C] px-6 py-[96px]">
          <div className="mx-auto max-w-[1200px] text-center reveal">
            <h2 className="text-[36px] font-semibold tracking-[-0.02em] text-white">
              Sẵn sàng bảo vệ dữ liệu?
            </h2>
            <p className="mt-4 text-[17px] text-white/70">
              Tạo tài khoản và bắt đầu với gói Basic ngay hôm nay.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center rounded-[980px] bg-white px-8 py-3.5 text-[15px] font-medium text-[#0A5C8C] hover:bg-[#F5F5F7] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Tạo tài khoản miễn phí
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
