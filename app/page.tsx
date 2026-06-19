import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

const services = [
  {
    title: "Lưu trữ kỹ thuật số",
    desc: "Upload, quản lý và chia sẻ file an toàn với mã hoá AES-256-GCM. Hỗ trợ đa định dạng, preview tích hợp.",
    icon: "💾",
  },
  {
    title: "HCloud Verified",
    desc: "Xác thực quyền sở hữu tài sản số L1-L5. Mỗi file được gắn mức xác thực riêng, hiển thị badge tương ứng.",
    icon: "✅",
  },
  {
    title: "Bảo hiểm Shield",
    desc: "Gói bảo hiểm lưu trữ với đền bù lên tới 100% giá trị tài sản. Bảo vệ toàn diện dữ liệu của bạn.",
    icon: "🛡️",
  },
  {
    title: "Lưu trữ vật phẩm",
    desc: "Rương bảo mật gắn với vật phẩm Mini World / Minecraft. Quản lý kho rương trực quan, bảo mật tuyệt đối.",
    icon: "📦",
  },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Niềm tin trong từng byte dữ liệu
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/80">
                HCloud – Bảo vệ dữ liệu hôm nay, kiến tạo niềm tin cho ngày mai. Dịch vụ lưu trữ kỹ thuật số
                bảo mật, xác thực tài sản số và bảo hiểm lưu trữ toàn diện.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="rounded-lg bg-accent px-8 py-3 text-base font-semibold text-primary-dark transition-colors hover:bg-accent-light"
                >
                  Bắt đầu ngay
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-lg border border-white/30 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Xem bảng giá
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-primary">Dịch vụ của HCloud</h2>
              <p className="mt-4 text-lg text-muted">
                Bốn dịch vụ cốt lõi, một hệ sinh thái bảo vệ dữ liệu toàn diện
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="text-4xl">{service.icon}</div>
                  <h3 className="mt-4 text-lg font-semibold text-primary">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface py-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-primary">Sẵn sàng bảo vệ dữ liệu của bạn?</h2>
            <p className="mt-4 text-lg text-muted">
              Tham gia HCloud ngay hôm nay và trải nghiệm lưu trữ đẳng cấp với hệ thống bảo mật đa tầng.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center rounded-lg bg-primary px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-light"
              >
                Tạo tài khoản miễn phí
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
