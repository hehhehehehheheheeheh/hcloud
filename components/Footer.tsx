import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-[#D2D2D7]/60 bg-[#1D1D1F] text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="text-[17px] font-semibold tracking-[-0.01em]">HCloud</p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/50">
              Dịch vụ lưu trữ kỹ thuật số trực thuộc Horizon Group. Vận hành trong hệ sinh thái Syreal.
            </p>
          </div>

          {/* Dịch vụ */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-4">Dịch vụ</p>
            <ul className="space-y-2">
              <li><Link href="/pricing" className="text-[13px] text-white/60 hover:text-white transition-colors">Bảng giá</Link></li>
              <li><Link href="/dashboard" className="text-[13px] text-white/60 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/dashboard/items" className="text-[13px] text-white/60 hover:text-white transition-colors">Rương vật phẩm</Link></li>
            </ul>
          </div>

          {/* Pháp lý */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-4">Pháp lý</p>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-[13px] text-white/60 hover:text-white transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link href="/privacy" className="text-[13px] text-white/60 hover:text-white transition-colors">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-4">Liên hệ</p>
            <ul className="space-y-2">
              <li className="text-[13px] text-white/60">support@hcloud.syreal</li>
              <li className="text-[13px] text-white/60">Horizon Group · Syreal Ecosystem</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/30">
            © {new Date().getFullYear()} Horizon Group. All rights reserved.
          </p>
          <p className="text-[12px] text-white/30">
            HCloud Protect · AES-256-GCM · Giám sát 24/7
          </p>
        </div>
      </div>
    </footer>
  )
}
