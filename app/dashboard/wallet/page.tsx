"use client"

export default function WalletPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">Ví SD</h1>
      <p className="mt-2 text-muted">Số dư và lịch sử giao dịch.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted">Số dư hiện tại</p>
          <p className="mt-1 text-3xl font-bold text-primary">0 SD</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted">Tổng nạp</p>
          <p className="mt-1 text-3xl font-bold text-primary">0 SD</p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted">Tổng chi</p>
          <p className="mt-1 text-3xl font-bold text-primary">0 SD</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-primary">Lịch sử giao dịch</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 font-medium text-muted">Loại</th>
                <th className="px-4 py-3 font-medium text-muted">Số tiền</th>
                <th className="px-4 py-3 font-medium text-muted">Thời gian</th>
                <th className="px-4 py-3 font-medium text-muted">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-3 text-primary" colSpan={4}>
                  Chưa có giao dịch nào
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
