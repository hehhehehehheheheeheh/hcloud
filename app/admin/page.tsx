"use client"

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
      <p className="mt-2 text-muted">Quản lý người dùng, duyệt claim và xem log vi phạm.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-primary">Users</h2>
          <p className="mt-2 text-3xl font-bold text-accent-dark">0</p>
          <p className="text-sm text-muted">tổng số người dùng</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-primary">Claims</h2>
          <p className="mt-2 text-3xl font-bold text-accent-dark">0</p>
          <p className="text-sm text-muted">chờ duyệt</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-primary">Storage</h2>
          <p className="mt-2 text-3xl font-bold text-accent-dark">0 B</p>
          <p className="text-sm text-muted">tổng dung lượng sử dụng</p>
        </div>
      </div>
    </div>
  )
}
