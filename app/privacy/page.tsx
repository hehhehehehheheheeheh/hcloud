import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary">Chính sách bảo mật</h1>
        <p className="mt-2 text-sm text-muted">Cập nhật lần cuối: Tháng 6, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="text-lg font-semibold text-primary">1. Thông tin chúng tôi thu thập</h2>
            <p className="mt-2">
              Khi bạn sử dụng HCloud, chúng tôi có thể thu thập các thông tin sau:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Họ tên, địa chỉ email, thông tin tài khoản.</li>
              <li>Metadata file (tên file, kích thước, loại file, thời gian tạo/chỉnh sửa).</li>
              <li>Log truy cập (IP, thời gian truy cập, hành động thực hiện).</li>
              <li>Thông tin thanh toán (lịch sử giao dịch SD, không lưu thông tin thẻ tín dụng).</li>
              <li>Thông tin thiết bị và trình duyệt để tối ưu trải nghiệm.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary">2. Cam kết bảo vệ thông tin</h2>
            <p className="mt-2">
              HCloud cam kết <strong>không bán, cho thuê, hoặc chia sẻ dữ liệu cá nhân</strong> của người dùng
              cho bên thứ ba, trừ các trường hợp:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Có yêu cầu pháp lý từ cơ quan nhà nước có thẩm quyền.</li>
              <li>Bảo vệ quyền và lợi ích hợp pháp của HCloud hoặc người dùng khác.</li>
              <li>Phòng chống gian lận, lạm dụng dịch vụ.</li>
              <li>Tuân thủ nghĩa vụ pháp lý theo quy định của pháp luật.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary">3. Mã hoá & Bảo mật</h2>
            <p className="mt-2">
              HCloud áp dụng tiêu chuẩn bảo mật cao nhất để bảo vệ dữ liệu của bạn:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>
                <strong>Mã hoá AES-256-GCM</strong> cho toàn bộ dữ liệu lưu trữ, cả khi truyền tải (TLS 1.3)
                và khi lưu trữ (at-rest encryption).
              </li>
              <li>
                <strong>Hệ thống bảo mật đa tầng HCloud Protect</strong> bao gồm tường lửa ứng dụng (WAF),
                phát hiện xâm nhập (IDS/IPS), và kiểm soát truy cập dựa trên vai trò (RBAC).
              </li>
              <li>
                <strong>Giám sát máy chủ 24/7</strong> bởi đội ngũ kỹ thuật của Horizon Group, phát hiện và
                ứng phó sự cố kịp thời.
              </li>
              <li>
                <strong>Sao lưu định kỳ</strong> hàng tuần với dữ liệu được mã hoá và lưu trữ ở nhiều vị trí địa lý.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary">4. Chính sách Cookie</h2>
            <p className="mt-2">
              HCloud sử dụng cookie để cải thiện trải nghiệm người dùng, bao gồm:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Cookie phiên làm việc (session cookie) để duy trì đăng nhập.</li>
              <li>Cookie chức năng để ghi nhớ tuỳ chọn hiển thị.</li>
              <li>Cookie phân tích (anonymized) để hiểu cách người dùng tương tác với dịch vụ.</li>
            </ul>
            <p className="mt-2">
              Bạn có thể tuỳ chỉnh cài đặt cookie trong trình duyệt bất cứ lúc nào. Tắt cookie có thể ảnh hưởng
              đến một số chức năng của dịch vụ.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary">5. Quyền của khách hàng</h2>
            <p className="mt-2">Bạn có quyền:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li><strong>Xem</strong> thông tin cá nhân mà HCloud đang lưu trữ.</li>
              <li><strong>Sửa</strong> thông tin cá nhân khi có sai sót.</li>
              <li><strong>Xoá</strong> tài khoản và dữ liệu cá nhân (yêu cầu bằng văn bản).</li>
              <li><strong>Ngừng xử lý</strong> dữ liệu cá nhân cho mục đích tiếp thị.</li>
              <li><strong>Khiếu nại</strong> tới Horizon Group nếu cho rằng dữ liệu bị xử lý trái phép.</li>
              <li><strong>Xuất dữ liệu</strong> cá nhân của bạn ở định dạng có đọc được bằng máy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary">6. Liên hệ</h2>
            <p className="mt-2">
              Mọi thắc mắc liên quan đến chính sách bảo mật, vui lòng liên hệ:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Email: support@hcloud.syreal</li>
              <li>Horizon Group - Syreal Ecosystem</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
