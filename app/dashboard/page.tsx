"use client"

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">File Explorer</h1>
      <p className="mt-2 text-muted">Quản lý file và thư mục của bạn.</p>
      <div className="mt-8 rounded-xl border-2 border-dashed border-border p-12 text-center">
        <p className="text-muted">Kéo và thả file vào đây để upload</p>
        <p className="mt-2 text-sm text-muted">hoặc nhấn vào nút bên dưới để chọn file</p>
      </div>
    </div>
  )
}
