import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <span className="text-sm font-bold text-primary-dark">H</span>
              </div>
              <span className="text-lg font-bold">HCloud</span>
            </div>
            <p className="mt-2 text-sm text-white/60">
              Dịch vụ lưu trữ kỹ thuật số của Horizon Group. Vận hành trong hệ sinh thái Syreal.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Dịch vụ</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/pricing" className="text-sm text-white/60 transition-colors hover:text-white">Bảng giá</Link></li>
              <li><Link href="/dashboard" className="text-sm text-white/60 transition-colors hover:text-white">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Pháp lý</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/terms" className="text-sm text-white/60 transition-colors hover:text-white">Điều khoản sử dụng</Link></li>
              <li><Link href="/privacy" className="text-sm text-white/60 transition-colors hover:text-white">Chính sách bảo mật</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Liên hệ</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-white/60">support@hcloud.syreal</li>
              <li className="text-sm text-white/60">Horizon Group - Syreal Ecosystem</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} Horizon Group. All rights reserved. Bảo vệ dữ liệu hôm nay, kiến tạo niềm tin cho ngày mai.
        </div>
      </div>
    </footer>
  )
}
