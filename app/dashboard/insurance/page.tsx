"use client"

export default function InsurancePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">Bảo hiểm Shield</h1>
      <p className="mt-2 text-muted">Gói bảo hiểm đang active và lịch sử claim.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-primary">Gói đang active</h2>
          <p className="mt-2 text-sm text-muted">Bạn chưa đăng ký gói bảo hiểm nào.</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-primary">Lịch sử Claim</h2>
          <p className="mt-2 text-sm text-muted">Chưa có khiếu nại nào.</p>
        </div>
      </div>
    </div>
  )
}
