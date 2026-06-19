# Prompt build web Horizon Cloud (HCloud)

> Dán nguyên file này vào Kiro / OpenCode / Claude Code làm steering rule hoặc prompt khởi tạo dự án.

---

## 1. Bối cảnh dự án

Bạn đang xây dựng **Horizon Cloud (HCloud)** — dịch vụ lưu trữ kỹ thuật số trực thuộc **Horizon Group**, vận hành trong hệ sinh thái **Syreal**, thanh toán bằng đơn vị tiền tệ nội bộ **SD**.

Triết lý thương hiệu: *"Niềm tin trong từng byte dữ liệu"*. Tagline phụ: *"HCloud – Bảo vệ dữ liệu hôm nay, kiến tạo niềm tin cho ngày mai."*

> **Lưu ý quan trọng — phân biệt rõ 2 thứ:**
> - **Hạ tầng kỹ thuật**: HCloud là web độc lập hoàn toàn — codebase, DB, auth, deploy riêng, không dùng chung tài nguyên hay convention với bất kỳ project nào khác.
> - **Nội dung/bối cảnh trong web**: Vẫn giữ nguyên fiction "trực thuộc Horizon Group, vận hành trong Syreal" như mô tả thương hiệu — đây là nội dung hiển thị cho người dùng (landing page, giới thiệu, điều khoản), không phải yêu cầu kỹ thuật liên kết hệ thống thật.

HCloud không phải web lưu trữ thông thường — nó kết hợp 2 lớp:

1. **Lớp hạ tầng lưu trữ thật** (giống Google Drive/OneDrive): upload, quản lý file, folder, chia sẻ.
2. **Lớp dịch vụ giá trị gia tăng mang tính roleplay/economy của Syreal**: gói thuê bao trả bằng SD, xác thực quyền sở hữu tài sản số (HCloud Verified), bảo hiểm dữ liệu, lưu trữ vật phẩm game.

Build đúng cả 2 lớp — đừng chỉ làm web lưu trữ file thuần, vì phần khác biệt (và giá trị roleplay) nằm ở lớp dịch vụ.

---

## 2. Tech stack

- Next.js (App Router) + TypeScript, project độc lập — không phải monorepo, không phụ thuộc codebase nào khác.
- TailwindCSS cho styling.
- Postgres cho metadata (file, folder, user, gói dịch vụ, giao dịch SD).
- Object storage: Cloudflare R2 (ưu tiên, free egress) hoặc S3-compatible khác.
- Upload lớn: implement theo chuẩn **tus** (resumable upload), không tự chế logic chunk.
- Auth: NextAuth hoặc tự xây JWT-based, có role: `user`, `admin`, `support`.
- Background jobs: BullMQ + Redis (hoặc tương đương) cho thumbnail generation, virus scan, tính bồi thường bảo hiểm.

---

## 3. Kiến trúc kỹ thuật cốt lõi (bắt buộc có)

Đây là phần nền tảng giống mọi cloud storage chuẩn — implement đầy đủ trước khi thêm lớp dịch vụ Syreal:

- **Metadata DB**: bảng `files`, `folders` dạng cây (parent_id), `owner_id`, `size`, `checksum_sha256`, `created_at`, `verified_level` (xem mục 5), `trashed_at` (soft delete).
- **Object storage**: file thật lưu ở R2/S3, DB chỉ lưu path/key. Upload/download qua **presigned URL**, không proxy qua server.
- **Dedup**: hash SHA-256 nội dung file, nếu trùng thì chỉ lưu 1 bản vật lý, nhiều file trỏ chung.
- **Checksum**: verify tính toàn vẹn file sau khi upload xong, so khớp hash.
- **Resumable upload**: chuẩn tus, cho phép resume khi mất mạng giữa chừng — quan trọng vì file vật phẩm/game có thể lớn.
- **Preview & thumbnail**: ảnh, video, PDF, Office docs (LibreOffice headless hoặc viewer nhúng).
- **Trash/Recycle bin**: soft-delete, tự xoá vĩnh viễn sau X ngày (cấu hình theo gói).
- **Quota enforcement**: check dung lượng *trước khi* cho phép upload, không phải sau — chặn theo `storage_limit_mb` của gói đang active.
- **Virus/malware scan**: chạy nền (queue) trước khi cho người khác tải file đã share.
- **Activity log**: ai sửa/xoá/share/tải file gì, lúc nào — phục vụ cả audit lẫn xử lý khiếu nại bảo hiểm.
- **Admin dashboard**: quản lý user, gói dịch vụ, duyệt khiếu nại bồi thường, xem log vi phạm.
- **Search**: tìm theo tên file/folder tối thiểu; nâng cao hơn có thể search theo loại file, mức Verified, khoảng thời gian. Thiếu phần này thì với user có nhiều file/rương sẽ rất khó dùng.
- **Sharing & permission**: share link (public/private, có thể đặt password + hạn dùng), share trực tiếp cho user khác trong hệ thống với quyền `view`/`edit`. File đã share ra ngoài hệ thống (qua link công khai) tự động **không còn được bảo hộ bảo hiểm** — khớp với điều khoản ở mục 7, cần enforce rule này rõ ràng trong logic claim.
- **Versioning**: lưu lịch sử thay đổi file, cho phép revert về bản cũ — quan trọng với file đã gắn Verified, vì thay đổi nội dung có thể ảnh hưởng tới giá trị đã định giá (L3+).
- **Responsive/mobile**: giao diện phải dùng tốt trên mobile (không chỉ desktop) — ưu tiên test trên Android/iOS phổ biến, vì phần lớn user Syreal có thể truy cập qua điện thoại.

---

## 4. Hệ thống gói dịch vụ (thanh toán bằng SD)

### 4.1 Lưu trữ kỹ thuật số (file thường)

> Gia hạn mỗi 6 tháng, hết hạn phải mua lại.

| Gói | Dung lượng | Xác thực kèm theo | Giá |
|---|---|---|---|
| Basic | 500MB | L1 | 34,000 SD |
| Plus | 1GB | L2 | 59,000 SD |
| Pro | 3GB | L3 + 2 voucher giảm 15% | 79,000 SD |
| Pre. | 5GB | L4 + voucher giảm 15% toàn Horizon (x3) | 149,000 SD |
| Adv. | 10GB | L5 + voucher giảm 20% Horizon (x5) + voucher giảm 5% Horation (x3) | 299,000 SD |

### 4.2 Lưu trữ vật phẩm (Mini World / Minecraft)

Tính năng riêng biệt — không phải file upload thường mà là "rương bảo mật" (secure chest) gắn với vật phẩm trong game.

| Gói | Số rương | Xác thực kèm theo | Giá |
|---|---|---|---|
| Basic | 1 rương | L1 | 29,000 SD |
| Plus | 3 rương | L2 | 44,000 SD |
| Pro | 5 rương | L3 + voucher giảm 15% lần sau | 59,000 SD |
| Pre. | 10 rương | L4 + voucher Pro giảm 20% (x3) | 119,000 SD |
| Adv. | 20 rương | L5 + voucher giảm 15% toàn hệ thống Horizon (x3) | 249,000 SD |

UI cho phần này nên hiển thị dạng "kho rương" trực quan (grid icon rương, mỗi rương = 1 slot lưu vật phẩm), khác hẳn UI file explorer thông thường của phần 4.1.

### 4.3 Logic chung cho cả 2 loại gói

- Mỗi user có thể sở hữu đồng thời cả gói lưu trữ kỹ thuật số *và* gói lưu trữ vật phẩm — độc lập nhau.
- Combo nhiều dịch vụ → áp ưu đãi đặc biệt (cần định nghĩa % cụ thể, hiện tài liệu gốc chỉ ghi chung chung "ưu đãi hấp dẫn" — hỏi lại stakeholder hoặc để admin cấu hình linh hoạt qua dashboard).
- Đếm ngược ngày hết hạn hiển thị rõ trên dashboard user, có cảnh báo trước 7 ngày.

---

## 5. Hệ thống xác thực HCloud Verified (L1–L5)

Đây là core differentiator — không phải cloud storage thường nào cũng có. Mỗi **file** (không phải mỗi account) có thể được gắn 1 mức xác thực riêng.

| Cấp | Tên gọi | Quyền lợi | Giá mua riêng |
|---|---|---|---|
| L1 | Xác nhận cơ bản | Chứng minh quyền sở hữu hợp pháp | 59,000 SD |
| L2 | Bảo hộ sở hữu | Công nhận chính thức + quyền khiếu nại nếu có bản sao trái phép | 79,000 SD |
| L3 | Định giá & Giao dịch | Định giá sơ bộ + cho phép chuyển nhượng | 99,000 SD |
| L4 | Bảo hộ pháp lý | Bảo vệ pháp lý + hỗ trợ khiếu nại | 119,000 SD |
| L5 | Bảo hộ VIP | Đặc quyền cao cấp nhất toàn hệ sinh thái | 129,000 SD |

**Business rule quan trọng — implement validation chặt:**
- Mức Verified của từng file ≤ mức Verified tối đa mà gói đang active của user cho phép.
- User được tự chọn mức thấp hơn cho từng file riêng lẻ, **không được** đặt cao hơn giới hạn gói.
- L3 trở lên là điều kiện bắt buộc để được đền bù bảo hiểm full (xem mục 6).

UI gợi ý: badge màu theo cấp (L1 xám → L5 vàng/gold) hiển ngay trên file/item trong danh sách.

---

## 6. Gói bảo hiểm lưu trữ (Shield Insurance)

Đền bù tối đa chỉ áp dụng cho tài sản có xác thực **L3 trở lên**; dưới L3 đền bù bằng 1/2 mức ghi trong bảng.

| Gói | Giá/tháng | Đền bù | Hỗ trợ phục hồi tối đa | Voucher kèm |
|---|---|---|---|---|
| Cơ Bản | 199,000 SD | 35% | — | 30% (giảm nửa nếu <L3) |
| Nâng Cao | 349,000 SD | 45% | 10 triệu SD | — |
| Cao Cấp | 449,000 SD | 60% | 17 triệu SD | 15% Horizon |
| Pre. | 699,000 SD | 75% | 20 triệu SD | 20% Horizon (x3) |
| Adv. | 1,199,000 SD | 100% | 25 triệu SD | 15% toàn Horation (x3) |

**Công thức tính bồi thường khi xử lý claim** (implement thành 1 hàm tính riêng trong backend, dùng cho cả admin tool lẫn hiển thị ước tính cho user):

```
Bồi thường = (a × a¹) + (b × b%¹)

a   = số tiền mua gói bảo hiểm
a¹  = hệ số bồi thường theo gói:
        Cơ Bản    = 1
        Nâng Cao  = 2
        Cao Cấp   = 3
        Pre.      = 3.5
        Adv.      = 4.5
b   = số tiền thẩm định giá trị tài sản bị mất/hư hại
b%¹ = % bồi thường của gói (35/45/60/75/100%, hoặc giảm nửa nếu file <L3)
```

> Lưu ý: công thức gốc trong tài liệu ghi `b+b%¹` — khả năng cao là lỗi đánh máy của `b × b%¹` (số tiền thẩm định nhân với phần trăm bồi thường). Nên xác nhận lại với người ra đề trước khi code cứng vào hệ thống, vì sai công thức này ảnh hưởng trực tiếp tới tiền bồi thường thực tế.

Flow xử lý claim: User báo mất/hỏng file → đính kèm bằng chứng → admin xem activity log + mức Verified → backend tự tính số tiền theo công thức trên → admin duyệt/từ chối → giải ngân SD vào ví user.

---

## 6b. Ví SD (Wallet) — độc lập trên HCloud

Mọi giao dịch trong hệ thống (mua gói, mua Verified, đóng phí bảo hiểm, nhận bồi thường) đều quy về 1 ví SD nội bộ gắn với account, **xử lý hoàn toàn trên hạ tầng HCloud** — không gọi API sang web hệ sinh thái Horizon để xác nhận hay trừ/cộng tiền mỗi lần giao dịch. HCloud tự lưu và tự tính toán số dư của riêng mình.

- **Trang `/dashboard/wallet`**: xem số dư hiện tại, lịch sử giao dịch (nạp, trừ, nhận bồi thường), chi tiết từng giao dịch (loại, thời gian, số tiền, trạng thái).
- **Bảng `wallets`**: `user_id`, `balance`, `updated_at`. Bảng `wallet_transactions`: `id`, `wallet_id`, `type` (nạp/mua gói/mua verified/đóng phí bảo hiểm/nhận bồi thường), `amount`, `balance_after`, `reference_id` (link tới đơn hàng/claim liên quan), `created_at`.
- **Mọi thao tác trừ/cộng SD đều là 1 transaction trong DB của HCloud** — không có bước "gọi sang hệ thống khác để xác nhận số dư". Giao dịch nội bộ, tính toàn vẹn (số dư không âm, không double-spend) xử lý bằng DB transaction/lock ở tầng Postgres.
- **Nạp SD vào ví**: cần 1 cổng nạp riêng cho HCloud (ví dụ: admin duyệt nạp thủ công qua mã giao dịch, hoặc cổng nạp tự động nếu Syreal có chuẩn chung — nhưng dù nạp bằng cách nào, sau khi nạp xong thì số SD đó **thuộc về ví HCloud, độc lập, không đồng bộ ngược lại với số dư ở web khác**).
- **Transaction log bất biến**: mọi thay đổi số dư ghi log append-only, không sửa/xoá được, tránh tranh chấp khi có khiếu nại liên quan tới tiền.
- **Khoá số dư khi có claim đang xử lý**: tránh trường hợp user rút hết SD trước khi claim được duyệt xong (nếu mô hình có rút tiền).

> Tóm lại: SD là *đơn vị tiền tệ chung về mặt khái niệm* trong thế giới Syreal, nhưng **ví và sổ cái giao dịch của HCloud là của riêng HCloud** — mọi mua bán, trừ tiền, hoàn tiền đều chạy gọn trong hệ thống này, không phụ thuộc uptime hay API của web Horizon nào khác.

---

## 7. Trang pháp lý (lấy gần như nguyên văn từ tài liệu gốc, chỉ format lại)

Tạo 2 trang tĩnh bắt buộc, đặt link ở footer:

**`/terms`** — Điều khoản sử dụng dịch vụ:
- Phạm vi dịch vụ
- Bảo vệ toàn diện (điều kiện được bồi thường)
- Hàng hoá/dữ liệu bị từ chối lưu trữ (vi phạm pháp luật, hack/cheat, vi phạm bản quyền, vũ khí/cháy nổ, nội dung đồi truỵ/bạo lực/phân biệt đối xử)
- An ninh & quyền truy cập
- Sao lưu định kỳ hàng tuần + khuyến cáo người dùng tự bảo quản, cảnh báo lừa đảo qua link/mail
- Trách nhiệm khi chia sẻ dữ liệu ra ngoài hệ thống (không được bảo hộ)

**`/privacy`** — Chính sách bảo mật:
- Thu thập thông tin gì (họ tên, liên hệ, tài khoản, file metadata, log truy cập)
- Cam kết không bán/cho thuê/chia sẻ dữ liệu cho bên thứ 3 trừ yêu cầu pháp lý
- Mã hoá **AES-256-GCM** + hệ thống bảo mật đa tầng "HCloud Protect", giám sát máy chủ 24/7
- Chính sách cookie
- Quyền của khách hàng (xem/sửa/xoá thông tin, ngừng xử lý dữ liệu, khiếu nại)

Nội dung đầy đủ đã có sẵn trong tài liệu gốc — copy gần như nguyên văn, chỉ chỉnh format Markdown/HTML cho đẹp, không cần viết lại từ đầu.

---

## 8. Sitemap đề xuất

```
/                       → Landing page (giới thiệu HCloud, 4 dịch vụ chính, CTA)
/login, /register       → Đăng nhập / đăng ký, xác thực email hoặc liên kết account Syreal
/pricing                → Bảng giá đầy đủ (digital storage + item storage + verified + insurance)
/dashboard              → File explorer chính (sau khi login)
/dashboard/items        → Kho rương vật phẩm (Mini World/Minecraft)
/dashboard/verified     → Quản lý mức xác thực từng file
/dashboard/insurance    → Gói bảo hiểm đang active + lịch sử claim + nộp claim mới
/dashboard/wallet       → Số dư SD, lịch sử giao dịch, nạp/gia hạn
/admin                  → Dashboard quản trị (duyệt claim, quản lý user, log vi phạm)
/terms
/privacy
```

---

## 9. Design direction

- Tông màu nên nghiêng về **trust + security**: xanh dương/navy đậm làm chủ đạo (gợi cảm giác "bảo vệ dữ liệu"), điểm nhấn vàng/gold cho các badge Verified cấp cao (L4-L5) và VIP.
- Vì là web độc lập, tự do định nghĩa design system riêng (typography, màu sắc, component library) — không cần đồng bộ với bất kỳ brand nào khác.
- Badge cấp Verified và icon rương bảo mật nên thiết kế riêng, dễ nhận diện ở cái nhìn đầu — đây là yếu tố khác biệt chính so với Drive/OneDrive thông thường.

---

## 10. Việc cần làm trước khi code (checklist cho dev)

- [ ] Xác nhận lại công thức bồi thường bảo hiểm (mục 6) với người viết tài liệu gốc — nghi có lỗi đánh máy.
- [ ] Định nghĩa rõ % ưu đãi combo nhiều dịch vụ (hiện tài liệu chỉ nói chung chung).
- [ ] Xác định nhà cung cấp SD payment gateway — SD là tiền nội bộ Syreal, cần API/flow nạp-rút riêng, không phải Stripe/VNPay thông thường.
- [ ] **Quyết định về voucher liên hệ sinh thái** ("giảm giá toàn Horizon", "Horation"): vì HCloud giờ là web độc lập về hạ tầng, các voucher này có còn áp dụng được không, hay cần đổi thành ưu đãi nội bộ HCloud thuần tuý?
- [ ] Quyết định cơ chế nạp SD vào ví HCloud (mục 6b): admin duyệt thủ công qua mã giao dịch, hay có cổng nạp tự động? Ví và sổ cái giao dịch đã chốt là độc lập trên HCloud, không đồng bộ ngược sang web hệ sinh thái khác.
- [ ] Notification (email/push khi sắp hết hạn gói, khi claim được duyệt, khi có người share file) — chưa có trong scope ban đầu, nên xác định mức độ ưu tiên cho bản đầu.
