"use client"

import { useState, useEffect } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface UserItem {
  id: string
  name: string | null
  email: string | null
  role: string
  createdAt: string
  _count: { files: number }
  wallet: { balance: number } | null
}

interface ClaimItem {
  id: string
  description: string
  claimedAmount: number | null
  calculatedPayout: number | null
  status: string
  createdAt: string
  user: { id: string; name: string | null; email: string | null }
  policy: { planName: string }
}

export default function AdminPage() {
  const [tab, setTab] = useState<"overview" | "claims" | "users">("overview")
  const [users, setUsers] = useState<UserItem[]>([])
  const [claims, setClaims] = useState<ClaimItem[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ users: 0, pendingClaims: 0, totalStorage: 0 })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [usersRes, claimsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/claims"),
      ])
      const usersData = await usersRes.json()
      const claimsData = await claimsRes.json()
      setUsers(usersData.users || [])
      setClaims(claimsData.claims || [])
      setStats({
        users: (usersData.users || []).length,
        pendingClaims: (claimsData.claims || []).filter((c: ClaimItem) => c.status === "pending").length,
        totalStorage: 0,
      })
    } catch (err) {
      console.error("Failed to fetch admin data", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleClaimAction(claimId: string, status: "approved" | "rejected") {
    try {
      await fetch("/api/admin/claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimId, status }),
      })
      fetchData()
    } catch (err) {
      console.error("Failed to update claim", err)
    }
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    const labels: Record<string, string> = {
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      rejected: "Từ chối",
    }
    return (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || "bg-gray-100"}`}>
        {labels[status] || status}
      </span>
    )
  }

  if (loading) return <div className="text-center text-muted py-12">Đang tải...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>

      <div className="mt-6 flex gap-2 border-b border-border">
        {(["overview", "claims", "users"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t ? "border-b-2 border-primary text-primary" : "text-muted hover:text-primary"
            }`}
          >
            {t === "overview" ? "Tổng quan" : t === "claims" ? "Claims" : "Users"}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border p-6">
            <h2 className="text-sm text-muted">Tổng người dùng</h2>
            <p className="mt-1 text-3xl font-bold text-primary">{stats.users}</p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <h2 className="text-sm text-muted">Claims chờ duyệt</h2>
            <p className="mt-1 text-3xl font-bold text-accent-dark">{stats.pendingClaims}</p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <h2 className="text-sm text-muted">Tổng claims</h2>
            <p className="mt-1 text-3xl font-bold text-primary">{claims.length}</p>
          </div>
        </div>
      )}

      {tab === "claims" && (
        <div className="mt-8">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 font-medium text-muted">Người dùng</th>
                <th className="px-4 py-3 font-medium text-muted">Gói</th>
                <th className="px-4 py-3 font-medium text-muted">Mô tả</th>
                <th className="px-4 py-3 font-medium text-muted">Yêu cầu</th>
                <th className="px-4 py-3 font-medium text-muted">Bồi thường</th>
                <th className="px-4 py-3 font-medium text-muted">Trạng thái</th>
                <th className="px-4 py-3 font-medium text-muted">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {claims.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary">{c.user.name || "N/A"}</div>
                    <div className="text-xs text-muted">{c.user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted">{c.policy.planName}</td>
                  <td className="px-4 py-3 text-muted max-w-[200px] truncate">{c.description}</td>
                  <td className="px-4 py-3">{c.claimedAmount ? formatCurrency(c.claimedAmount) : "—"}</td>
                  <td className="px-4 py-3 font-medium">{c.calculatedPayout ? formatCurrency(c.calculatedPayout) : "—"}</td>
                  <td className="px-4 py-3">{statusBadge(c.status)}</td>
                  <td className="px-4 py-3">
                    {c.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleClaimAction(c.id, "approved")}
                          className="rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleClaimAction(c.id, "rejected")}
                          className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "users" && (
        <div className="mt-8">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 font-medium text-muted">Tên</th>
                <th className="px-4 py-3 font-medium text-muted">Email</th>
                <th className="px-4 py-3 font-medium text-muted">Role</th>
                <th className="px-4 py-3 font-medium text-muted">Files</th>
                <th className="px-4 py-3 font-medium text-muted">Ví SD</th>
                <th className="px-4 py-3 font-medium text-muted">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-primary">{u.name || "N/A"}</td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3">{u.role === "admin" ? <span className="text-accent-dark font-medium">Admin</span> : "User"}</td>
                  <td className="px-4 py-3 text-muted">{u._count.files}</td>
                  <td className="px-4 py-3">{u.wallet ? formatCurrency(u.wallet.balance) : "0 SD"}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
