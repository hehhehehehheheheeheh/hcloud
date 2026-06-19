import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

const digitalPlans = [
  { name: "Basic", storage: "500MB", verified: "L1", price: "34,000 SD", popular: false },
  { name: "Plus", storage: "1GB", verified: "L2", price: "59,000 SD", popular: false },
  { name: "Pro", storage: "3GB", verified: "L3 + 2 voucher 15%", price: "79,000 SD", popular: true },
  { name: "Premium", storage: "5GB", verified: "L4 + 3 voucher 15%", price: "149,000 SD", popular: false },
  { name: "Adv.", storage: "10GB", verified: "L5 + voucher", price: "299,000 SD", popular: false },
]

const itemPlans = [
  { name: "Basic", chests: "1 rương", verified: "L1", price: "29,000 SD" },
  { name: "Plus", chests: "3 rương", verified: "L2", price: "44,000 SD" },
  { name: "Pro", chests: "5 rương", verified: "L3 + voucher 15%", price: "59,000 SD" },
  { name: "Premium", chests: "10 rương", verified: "L4 + voucher 20% x3", price: "119,000 SD" },
  { name: "Adv.", chests: "20 rương", verified: "L5 + voucher 15% x3", price: "249,000 SD" },
]

const insurancePlans = [
  { name: "Cơ Bản", price: "199,000 SD/tháng", compensation: "35%", recovery: "—" },
  { name: "Nâng Cao", price: "349,000 SD/tháng", compensation: "45%", recovery: "10 triệu SD" },
  { name: "Cao Cấp", price: "449,000 SD/tháng", compensation: "60%", recovery: "17 triệu SD" },
  { name: "Premium", price: "699,000 SD/tháng", compensation: "75%", recovery: "20 triệu SD" },
  { name: "Adv.", price: "1,199,000 SD/tháng", compensation: "100%", recovery: "25 triệu SD" },
]

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary-dark to-primary py-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Bảng giá dịch vụ</h1>
            <p className="mt-4 text-lg text-white/80">
              Tất cả thanh toán bằng SD — đơn vị tiền tệ nội bộ trong hệ sinh thái Syreal
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-primary">Lưu trữ kỹ thuật số</h2>
            <p className="mt-1 text-sm text-muted">Gia hạn mỗi 6 tháng</p>
            <div className="mt-8 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
              {digitalPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-xl border p-6 transition-shadow hover:shadow-lg ${
                    plan.popular ? "border-accent ring-2 ring-accent" : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <span className="mb-2 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary-dark">
                      Phổ biến
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-primary">{plan.name}</h3>
                  <p className="mt-1 text-3xl font-bold text-accent-dark">{plan.price}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted">
                    <li>{plan.storage} dung lượng</li>
                    <li>Xác thực {plan.verified}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-primary">Lưu trữ vật phẩm</h2>
            <p className="mt-1 text-sm text-muted">Rương bảo mật cho Mini World / Minecraft</p>
            <div className="mt-8 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
              {itemPlans.map((plan) => (
                <div key={plan.name} className="rounded-xl border border-border p-6 transition-shadow hover:shadow-lg">
                  <h3 className="text-lg font-bold text-primary">{plan.name}</h3>
                  <p className="mt-1 text-3xl font-bold text-accent-dark">{plan.price}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted">
                    <li>{plan.chests}</li>
                    <li>Xác thực {plan.verified}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-primary">Bảo hiểm Shield</h2>
            <p className="mt-1 text-sm text-muted">Đền bù tối đa cho tài sản L3+</p>
            <div className="mt-8 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
              {insurancePlans.map((plan) => (
                <div key={plan.name} className="rounded-xl border border-border p-6 transition-shadow hover:shadow-lg">
                  <h3 className="text-lg font-bold text-primary">{plan.name}</h3>
                  <p className="mt-1 text-3xl font-bold text-accent-dark">{plan.price}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted">
                    <li>Bồi thường {plan.compensation}</li>
                    <li>Hỗ trợ phục hồi: {plan.recovery}</li>
                  </ul>
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
