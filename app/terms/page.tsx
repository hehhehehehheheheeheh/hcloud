import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary">Điều khoản sử dụng dịch vụ</h1>
        <p className="mt-2 text-sm text-muted">Cập nhật lần cuối: Tháng 6, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="text-lg font-semibold text-primary">1. Phạm vi dịch vụ</h2>
            <p className="mt-2">
              HCloud là dịch vụ lưu trữ kỹ thuật số trực thuộc Horizon Group, vận hành trong hệ sinh thái Syreal.
              Chúng tôi cung cấp các dịch vụ lưu trữ file, xác thực tài sản số (HCloud Verified), bảo hiểm lưu trữ
              (Shield Insurance) và lưu trữ vật phẩm game (Mini World / Minecraft).
            </p>
            <p className="mt-2">
              Bằng việc sử dụng dịch vụ HCloud, bạn đồng ý tuân thủ các điều khoản dưới đây. Nếu không đồng ý,
              vui lòng không sử dụng dịch vụ.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary">2. Bảo vệ toàn diện</h2>
            <p className="mt-2">
              HCloud cam kết bảo vệ dữ liệu của người dùng bằng hệ thống bảo mật đa tầng HCloud Protect,
              bao gồm mã hoá AES-256-GCM, giám sát máy chủ 24/7, và sao lưu định kỳ hàng tuần.
            </p>
            <p className="mt-2">
              Điều kiện được bồi thường theo gói bảo hiểm Shield:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>File phải được xác thực HCloud Verified từ L3 trở lên để được đền bù 100% theo công thức bồi thường.</li>
              <li>File dưới L3 chỉ được đền bù bằng 1/2 mức quy định trong gói.</li>
              <li>File đã được chia sẻ ra ngoài hệ thống qua link công khai không còn được bảo hộ bảo hiểm.</li>
              <li>Yêu cầu bồi thường phải được gửi trong vòng 30 ngày kể từ khi phát hiện mất/hỏng dữ liệu.</li>
              <li>Người dùng phải cung cấp bằng chứng hợp lệ (activity log, checksum, mô tả chi tiết).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary">3. Hàng hoá / Dữ liệu bị từ chối lưu trữ</h2>
            <p className="mt-2">
              HCloud có quyền từ chối lưu trữ và xoá bỏ ngay lập tức các loại dữ liệu sau đây mà không cần báo trước:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Vi phạm pháp luật Việt Nam và quốc tế.</li>
              <li>Công cụ hack, cheat, phần mềm độc hại, mã khai thác lỗ hổng.</li>
              <li>Nội dung vi phạm bản quyền, sở hữu trí tuệ.</li>
              <li>Vũ khí, cháy nổ, chất cấm, hướng dẫn chế tạo vũ khí.</li>
              <li>Nội dung đồi truỵ, khiêu dâm, bạo lực, phân biệt chủng tộc, phân biệt đối xử dưới mọi hình thức.</li>
              <li>Thông tin cá nhân của bên thứ ba được thu thập trái phép.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary">4. An ninh & Quyền truy cập</h2>
            <p className="mt-2">
              Người dùng có trách nhiệm bảo vệ tài khoản và mật khẩu của mình. HCloud không chịu trách nhiệm
              cho các thiệt hại phát sinh từ việc tài khoản bị truy cập trái phép do người dùng để lộ thông tin đăng nhập.
            </p>
            <p className="mt-2">
              HCloud có quyền tạm khoá hoặc chấm dứt tài khoản nếu phát hiện hành vi lạm dụng dịch vụ,
              sử dụng tài nguyên trái phép, hoặc vi phạm điều khoản sử dụng.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary">5. Sao lưu định kỳ</h2>
            <p className="mt-2">
              HCloud thực hiện sao lưu dữ liệu định kỳ hàng tuần. Tuy nhiên, chúng tôi khuyến cáo người dùng
              tự bảo quản bản sao lưu dữ liệu quan trọng của mình ở nơi an toàn. HCloud không chịu trách nhiệm
              đối với việc mất dữ liệu do thiên tai, chiến tranh, khủng bố, hoặc các sự kiện bất khả kháng khác.
            </p>
            <p className="mt-2">
              <strong>Cảnh báo lừa đảo:</strong> HCloud không bao giờ yêu cầu mật khẩu hoặc thông tin nhạy cảm
              qua email hoặc tin nhắn. Cảnh giác với các link giả mạo và email lừa đảo (phishing).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary">6. Trách nhiệm khi chia sẻ dữ liệu</h2>
            <p className="mt-2">
              Khi người dùng chia sẻ dữ liệu ra ngoài hệ thống HCloud qua link công khai, dữ liệu đó
              <strong> không còn được bảo hộ bảo hiểm</strong>. Người dùng chịu hoàn toàn trách nhiệm về
              việc chia sẻ và phát tán dữ liệu của mình.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
