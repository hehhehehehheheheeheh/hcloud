"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"

interface VerifiedLevel {
  level: number
  name: string
  description: string
  priceSd: number
}

interface FileItem {
  id: string
  name: string
  verifiedLevel: number
}

export default function VerifiedPage() {
  const [levels, setLevels] = useState<VerifiedLevel[]>([])
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch("/api/verified")
      const data = await res.json()
      setLevels(data.verifiedLevels || [])
      setFiles(data.files || [])
    } catch (err) {
      console.error("Failed to fetch verified data", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify() {
    if (!selectedFile || !selectedLevel) return

    try {
      const res = await fetch("/api/verified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: selectedFile,
          level: parseInt(selectedLevel),
        }),
      })

      if (res.ok) {
        alert("Xác thực thành công!")
        setSelectedFile("")
        setSelectedLevel("")
        fetchData()
      } else {
        const err = await res.json()
        alert(err.error || "Xác thực thất bại")
      }
    } catch (err) {
      console.error("Failed to verify file", err)
    }
  }

  const unverifiedFiles = files.filter((f) => f.verifiedLevel === 0)

  const levelBadge = (level: number) => {
    if (level === 0) return null
    const colors = ["", "bg-gray-400", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500"]
    const labels = ["", "L1 - Cơ bản", "L2 - Bảo hộ", "L3 - Định giá", "L4 - Pháp lý", "L5 - VIP"]
    return (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-white ${colors[level] || "bg-gray-400"}`}>
        {labels[level] || `L${level}`}
      </span>
    )
  }

  if (loading) return <div className="text-center text-muted py-12">Đang tải...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">HCloud Verified</h1>
      <p className="mt-2 text-muted">Xác thực quyền sở hữu tài sản số L1-L5.</p>

      {unverifiedFiles.length > 0 && (
        <div className="mt-6 rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-primary">Xác thực file mới</h2>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-primary">Chọn file</label>
              <select
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
                className="mt-1 block rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">Chọn file</option>
                {unverifiedFiles.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary">Mức xác thực</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="mt-1 block rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">Chọn mức</option>
                {levels.map((l) => (
                  <option key={l.level} value={l.level}>
                    L{l.level} - {l.name} ({formatCurrency(l.priceSd)})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleVerify}
              disabled={!selectedFile || !selectedLevel}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light disabled:opacity-50"
            >
              Xác thực
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-primary">Bảng mức xác thực</h2>
          <div className="mt-4 space-y-3">
            {levels.map((l) => (
              <div key={l.level} className="flex items-center justify-between rounded-lg bg-surface p-3">
                <div>
                  <span className="font-medium text-primary">{l.name}</span>
                  <p className="text-xs text-muted">{l.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-accent-dark">{formatCurrency(l.priceSd)}</span>
                  <div className="text-xs text-muted">L{l.level}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-primary">File đã xác thực</h2>
          <div className="mt-4 space-y-3">
            {files.filter((f) => f.verifiedLevel > 0).length === 0 ? (
              <p className="text-sm text-muted">Chưa có file nào được xác thực.</p>
            ) : (
              files.filter((f) => f.verifiedLevel > 0).map((f) => (
                <div key={f.id} className="flex items-center justify-between rounded-lg bg-surface p-3">
                  <div className="flex items-center gap-2">
                    <span>📄</span>
                    <span className="text-sm font-medium text-primary">{f.name}</span>
                  </div>
                  {levelBadge(f.verifiedLevel)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
