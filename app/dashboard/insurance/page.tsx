"use client"

import { useState, useEffect } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Policy {
  id: string
  planName: string
  pricePerMonth: number
  compensationPct: number
  maxRecovery: number | null
  isActive: boolean
  startDate: string
  endDate: string
}

interface Claim {
  id: string
  policyId: string
  fileId: string | null
  description: string
  claimedAmount: number | null
  calculatedPayout: number | null
  status: string
  createdAt: string
  policy: { planName: string }
}

export default function InsurancePage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ policyId: "", description: "", claimedAmount: "" })

  useEffect(() => {
    fetchInsurance()
  }, [])

  async function fetchInsurance() {
    try {
      const res = await fetch("/api/insurance")
      const data = await res.json()
      setPolicies(data.policies || [])
      setClaims(data.claims || [])
    } catch (err) {
      console.error("Failed to fetch insurance data", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await fetch("/api/insurance/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyId: formData.policyId,
          description: formData.description,
          claimedAmount: formData.claimedAmount ? parseInt(formData.claimedAmount) : undefined,
        }),
      })
      setShowForm(false)
      setFormData({ policyId: "", description: "", claimedAmount: "" })
      fetchInsurance()
    } catch (err) {
      console.error("Failed to submit claim", err)
    }
  }

  const activePolicies = policies.filter((p) => p.isActive)
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Bảo hiểm Shield</h1>
        {activePolicies.length > 0 && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light"
          >
            {showForm ? "Huỷ" : "Nộp claim mới"}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-primary">Nộp claim mới</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary">Gói bảo hiểm</label>
              <select
                value={formData.policyId}
                onChange={(e) => setFormData({ ...formData, policyId: e.target.value })}
                required
                className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">Chọn gói</option>
                {activePolicies.map((p) => (
                  <option key={p.id} value={p.id}>{p.planName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary">Mô tả thiệt hại</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary">Giá trị yêu cầu (SD)</label>
              <input
                type="number"
                value={formData.claimedAmount}
                onChange={(e) => setFormData({ ...formData, claimedAmount: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light">
              Gửi claim
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-primary">Gói bảo hiểm</h2>
          {activePolicies.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Bạn chưa đăng ký gói bảo hiểm nào.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {activePolicies.map((p) => (
                <div key={p.id} className="rounded-lg bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-primary">{p.planName}</span>
                    <span className="text-sm font-semibold text-accent-dark">{formatCurrency(p.pricePerMonth)}/tháng</span>
                  </div>
                  <div className="mt-2 text-sm text-muted">
                    <span>Bồi thường: {p.compensationPct}%</span>
                    {p.maxRecovery && <span className="ml-4">Tối đa: {formatCurrency(p.maxRecovery)}</span>}
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    {formatDate(p.startDate)} - {formatDate(p.endDate)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-primary">Lịch sử Claim</h2>
          {claims.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Chưa có khiếu nại nào.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {claims.map((c) => (
                <div key={c.id} className="rounded-lg bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-primary">{c.description.slice(0, 50)}</span>
                    {statusBadge(c.status)}
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {c.policy.planName} {c.claimedAmount && `| Yêu cầu: ${formatCurrency(c.claimedAmount)}`}
                    {c.calculatedPayout && ` | Bồi thường: ${formatCurrency(c.calculatedPayout)}`}
                  </div>
                  <div className="text-xs text-muted">{formatDate(c.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
