"use client"

export default function VerifiedPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">HCloud Verified</h1>
      <p className="mt-2 text-muted">Quản lý mức xác thực cho từng file.</p>
      <div className="mt-8 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3 font-medium text-muted">File</th>
              <th className="px-4 py-3 font-medium text-muted">Mức Verified</th>
              <th className="px-4 py-3 font-medium text-muted">Trạng thái</th>
              <th className="px-4 py-3 font-medium text-muted">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-3 text-primary" colSpan={4}>
                Chưa có file nào được xác thực
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
