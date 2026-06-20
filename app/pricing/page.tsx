"use client"

import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { VerifiedBadge } from "@/components/ui/VerifiedBadge"
import { useScrollReveal } from "@/hooks/useScrollReveal"

/* ──────────────────────────────────────────────────────
   Plan data
   ────────────────────────────────────────────────────── */
const DIGITAL_PLANS = [
  { name: "Basic",   storage: "500 MB",  verifiedLevel: 1 as const, priceSd: 34000,  extra: null,                           popular: false },
  { name: "Plus",    storage: "1 GB",    verifiedLevel: 2 as const, priceSd: 59000,  extra: null,                           popular: false },
  { name: "Pro",     storage: "3 GB",    verifiedLevel: 3 as const, priceSd: 79000,  extra: "2 voucher giảm 15%",           popular: true  },
  { name: "Premium", storage: "5 GB",    verifiedLevel: 4 as const, priceSd: 149000, extra: "3 voucher giảm 15% HCloud",    popular: false },
  { name: "Adv.",    storage: "10 GB",   verifiedLevel: 5 as const, priceSd: 299000, extra: "5 voucher 20% + 3 voucher 5%", popular: false },
]

const ITEM_PLANS = [
  { name: "Basic",   chests: 1,  verifiedLevel: 1 as const, priceSd: 29000,  extra: null,                        popular: false },
  { name: "Plus",    chests: 3,  verifiedLevel: 2 as const, priceSd: 44000,  extra: null,                        popular: false },
  { name: "Pro",     chests: 5,  verifiedLevel: 3 as const, priceSd: 59000,  extra: "1 voucher giảm 15%",        popular: true  },
  { name: "Premium", chests: 10, verifiedLevel: 4 as const, priceSd: 119000, extra: "3 voucher Pro giảm 20%",    popular: false },
  { name: "Adv.",    chests: 20, verifiedLevel: 5 as const, priceSd: 249000, extra: "3 voucher giảm 15% HCloud", popular: false },
]

const INSURANCE_PLANS = [
  { name: "Cơ Bản",   priceSd: 199000,  compensation: "35%",  coefficient: 1,   recovery: null,            voucher: "1 voucher 30% (giảm nửa nếu <L3)" },
  { name: "Nâng Cao", priceSd: 349000,  compensation: "45%",  coefficient: 2,   recovery: "10 triệu SD",   voucher: null },
  { name: "Cao Cấp",  priceSd: 449000,  compensation: "60%",  coefficient: 3,   recovery: "17 triệu SD",   voucher: "1 voucher 15% HCloud" },
  { name: "Premium",  priceSd: 699000,  compensation: "75%",  coefficient: 3.5, recovery: "20 triệu SD",   voucher: "3 voucher 20% HCloud" },
  { name: "Adv.",     priceSd: 1199000, compensation: "100%", coefficient: 4.5, recovery: "25 triệu SD",   voucher: "3 voucher 15% HCloud" },
]

const VERIFIED_LEVELS = [
  { level: 1 as const, name: "Xác nhận cơ bản",     desc: "Chứng minh quyền sở hữu hợp pháp",                           priceSd: 59000  },
  { level: 2 as const, name: "Bảo hộ sở hữu",       desc: "Công nhận chính thức + quyền khiếu nại bản sao trái phép",   priceSd: 79000  },
  { level: 3 as const, name: "Định giá & Giao dịch", desc: "Định giá sơ bộ + cho phép chuyển nhượng",                    priceSd: 99000  },
  { level: 4 as const, name: "Bảo hộ pháp lý",       desc: "Bảo vệ pháp lý + hỗ trợ khiếu nại",                          priceSd: 119000 },
  { level: 5 as const, name: "Bảo hộ VIP",            desc: "Đặc quyền cao cấp nhất toàn hệ sinh thái",                   priceSd: 129000 },
]

/* ──────────────────────────────────────────────────────
   Segmented control — iOS-style sliding indicator
   ────────────────────────────────────────────────────── */
type StorageTab = "digital" | "item"

function SegmentedControl({ value, onChange }: { value: StorageTab; onChange: (v: StorageTab) => void }) {
  const tabs: { value: StorageTab; label: string }[] = [
    { value: "digital", label: "Lưu trữ kỹ thuật số" },
    { value: "item",    label: "Lưu trữ vật phẩm"     },
  ]
  return (
    <div
      className="inline-flex rounded-[12px] bg-[#E5E5EA] p-1 relative"
      role="tablist"
      aria-label="Chọn loại lưu trữ"
    >
      {/* Sliding white pill */}
      <span
        aria-hidden
        className="absolute top-1 bottom-1 rounded-[9px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] will-change-transform"
        style={{
          width: "calc(50% - 4px)",
          left: value === "digital" ? "4px" : "calc(50%)",
          transition: "left 250ms cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={[
            "relative z-10 px-5 py-2 text-[14px] font-medium rounded-[9px]",
            "transition-colors duration-150",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A5C8C]",
            value === tab.value ? "text-[#1D1D1F]" : "text-[#6E6E73] hover:text-[#1D1D1F]",
          ].join(" ")}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   Reusable plan card
   ────────────────────────────────────────────────────── */
function PlanCard({
  name, priceSd, period, popular, children,
}: {
  name: string
  priceSd: number
  period?: string
  popular?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={[
        "reveal relative flex flex-col rounded-[18px] p-6 border",
        "transition-all duration-[250ms]",
        popular
          ? "border-[#0A5C8C]/40 ring-2 ring-[#0A5C8C]/20 bg-white"
          : "border-[#D2D2D7]/80 bg-white hover:border-[#0A5C8C]/30",
        "hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(10,92,140,0.08)]",
      ].join(" ")}
      style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0A5C8C] px-3 py-0.5 text-[11px] font-semibold text-white tracking-wide whitespace-nowrap">
          Phổ biến nhất
        </span>
      )}
      <h3 className="text-[16px] font-semibold text-[#1D1D1F]">{name}</h3>
      <p className="tabular-nums mt-2 text-[26px] font-semibold tracking-[-0.02em] text-[#0A5C8C]">
        {priceSd.toLocaleString("vi-VN")}
        <span className="text-[14px] font-normal text-[#6E6E73]"> SD</span>
      </p>
      {period && <p className="text-[12px] text-[#6E6E73] mb-4">{period}</p>}
      <div className="flex-1 mt-3 space-y-2 text-[13px] text-[#6E6E73]">{children}</div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────── */
export default function PricingPage() {
  const [storageTab, setStorageTab] = useState<StorageTab>("digital")
  useScrollReveal()

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 bg-white">

        {/* Hero */}
        <section className="bg-[#F5F5F7] px-6 pt-24 pb-16 text-center">
          <div className="mx-auto max-w-[1200px] animate-hero">
            <h1 className="text-[48px] font-semibold tracking-[-0.025em] text-[#1D1D1F]">
              Bảng giá dịch vụ
            </h1>
            <p className="mt-4 text-[17px] text-[#6E6E73] max-w-lg mx-auto">
              Tất cả thanh toán bằng{" "}
              <span className="font-medium text-[#1D1D1F]">SD</span> — đơn vị tiền tệ nội bộ hệ sinh thái Syreal
            </p>
          </div>
        </section>

        {/* Storage plans */}
        <section className="px-6 py-[80px]">
          <div className="mx-auto max-w-[1200px]">
            <div className="reveal flex flex-col items-center gap-5 mb-12">
              <SegmentedControl value={storageTab} onChange={setStorageTab} />
              <p className="text-[14px] text-[#6E6E73] text-center max-w-md">
                {storageTab === "digital"
                  ? "Upload, quản lý và chia sẻ file. Gia hạn mỗi 6 tháng."
                  : "Rương bảo mật gắn vật phẩm Mini World / Minecraft."}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {storageTab === "digital"
                ? DIGITAL_PLANS.map((plan) => (
                    <PlanCard key={plan.name} name={plan.name} priceSd={plan.priceSd} period="mỗi 6 tháng" popular={plan.popular}>
                      <p>💾 {plan.storage}</p>
                      <p className="flex items-center gap-1.5">
                        <VerifiedBadge level={plan.verifiedLevel} size="sm" /> bao gồm
                      </p>
                      {plan.extra && <p>🎟 {plan.extra}</p>}
                    </PlanCard>
                  ))
                : ITEM_PLANS.map((plan) => (
                    <PlanCard key={plan.name} name={plan.name} priceSd={plan.priceSd} period="mỗi 6 tháng" popular={plan.popular}>
                      <p>📦 {plan.chests} rương</p>
                      <p className="flex items-center gap-1.5">
                        <VerifiedBadge level={plan.verifiedLevel} size="sm" /> bao gồm
                      </p>
                      {plan.extra && <p>🎟 {plan.extra}</p>}
                    </PlanCard>
                  ))}
            </div>
          </div>
        </section>

        {/* Insurance */}
        <section className="bg-[#F5F5F7] px-6 py-[80px]">
          <div className="mx-auto max-w-[1200px]">
            <div className="reveal mb-12 text-center">
              <h2 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                Bảo hiểm Shield Insurance
              </h2>
              <p className="mt-3 text-[15px] text-[#6E6E73]">
                Đền bù tối đa cho tài sản{" "}
                <span className="font-medium text-[#1D1D1F]">L3 trở lên</span>. Dưới L3 đền bù 50% mức quy định.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {INSURANCE_PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className="reveal rounded-[18px] bg-white p-6 border border-[#D2D2D7]/80 hover:border-[#0A5C8C]/30 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(10,92,140,0.08)] transition-all duration-[250ms]"
                  style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                >
                  <h3 className="text-[16px] font-semibold text-[#1D1D1F]">{plan.name}</h3>
                  <p className="tabular-nums mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[#0A5C8C]">
                    {plan.priceSd.toLocaleString("vi-VN")}
                    <span className="text-[12px] font-normal text-[#6E6E73]"> SD/tháng</span>
                  </p>
                  <div className="mt-4 space-y-1.5 text-[13px] text-[#6E6E73]">
                    <p>🛡 Bồi thường <span className="font-semibold text-[#1D1D1F]">{plan.compensation}</span></p>
                    <p>✕{plan.coefficient} hệ số</p>
                    {plan.recovery && <p>🏥 Tối đa {plan.recovery}</p>}
                    {plan.voucher && <p>🎟 {plan.voucher}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verified levels */}
        <section className="px-6 py-[80px] bg-white">
          <div className="mx-auto max-w-[1200px]">
            <div className="reveal mb-12 text-center">
              <h2 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                HCloud Verified
              </h2>
              <p className="mt-3 text-[15px] text-[#6E6E73]">
                Mua riêng theo từng file, hoặc nhận kèm khi mua gói lưu trữ.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {VERIFIED_LEVELS.map(({ level, name, desc, priceSd }) => (
                <div
                  key={level}
                  className="reveal rounded-[18px] bg-[#F5F5F7] p-6 border border-[#D2D2D7]/60 hover:-translate-y-0.5 transition-transform duration-[250ms]"
                  style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                >
                  <VerifiedBadge level={level} size="lg" showLabel />
                  <p className="mt-4 text-[13px] font-semibold text-[#1D1D1F]">{name}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#6E6E73]">{desc}</p>
                  <p className="tabular-nums mt-4 text-[20px] font-semibold text-[#0A5C8C]">
                    {priceSd.toLocaleString("vi-VN")} SD
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
