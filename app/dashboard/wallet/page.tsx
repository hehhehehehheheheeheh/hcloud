"use client"

import { useState, useEffect } from "react"

interface WalletData {
  id: string
  balance: number
  lockedAmount: number
}

interface Transaction {
  id: string
  type: string
  amount: number
  balanceAfter: number
  description: string | null
  createdAt: string
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWallet()
  }, [])

  async function fetchWallet() {
    try {
      const res = await fetch("/api/wallet")
      const data = await res.json()
      setWallet(data.wallet)
      setTransactions(data.transactions || [])
    } catch (err) {
      console.error("Failed to fetch wallet", err)
    } finally {
      setLoading(false)
    }
  }

  const typeLabels: Record<string, string> = {
    deposit: "Nạp tiền",
    purchase_storage: "Mua gói lưu trữ",
    purchase_item_storage: "Mua gói lưu trữ vật phẩm",
    purchase_verified: "Mua xác thực",
    insurance_premium: "Đóng phí bảo hiểm",
    insurance_payout: "Nhận bồi thường",
    admin_adjustment: "Điều chỉnh từ admin",
  }

  if (loading) {
    return <div className="text-center text-muted py-12">Đang tải...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">Ví SD</h1>
      <p className="mt-2 text-muted">Số dư và lịch sử giao dịch.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted">Số dư hiện tại</p>
          <p className={`mt-1 text-3xl font-bold ${wallet && wallet.balance > 0 ? "text-primary" : "text-muted"}`}>
            {wallet ? `${wallet.balance.toLocaleString("vi-VN")} SD` : "0 SD"}
          </p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted">Đã khoá</p>
          <p className="mt-1 text-3xl font-bold text-muted">
            {wallet ? `${wallet.lockedAmount.toLocaleString("vi-VN")} SD` : "0 SD"}
          </p>
        </div>
        <div className="rounded-xl border border-border p-6">
          <p className="text-sm text-muted">Tổng giao dịch</p>
          <p className="mt-1 text-3xl font-bold text-accent-dark">{transactions.length}</p>
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
                <th className="px-4 py-3 font-medium text-muted">Số dư sau</th>
                <th className="px-4 py-3 font-medium text-muted">Mô tả</th>
                <th className="px-4 py-3 font-medium text-muted">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {typeLabels[tx.type] || tx.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-medium ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("vi-VN")} SD
                  </td>
                  <td className="px-4 py-3 text-muted">{tx.balanceAfter.toLocaleString("vi-VN")} SD</td>
                  <td className="px-4 py-3 text-muted">{tx.description || "—"}</td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(tx.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-muted" colSpan={5}>
                    Chưa có giao dịch nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
