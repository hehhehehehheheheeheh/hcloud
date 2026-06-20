"use client"

import { useState, useEffect, useCallback } from "react"
import { formatBytes, formatDate } from "@/lib/utils"
import { VerifiedBadge } from "@/components/ui/VerifiedBadge"

interface FileItem {
  id: string
  name: string
  mimeType: string
  size: number
  fileType: string
  verifiedLevel: number
  createdAt: string
  trashedAt: string | null
}

interface FolderItem {
  id: string
  name: string
  parentId: string | null
}

/* Inline SVG file icon based on mime */
function FileIcon({ mimeType }: { mimeType: string }) {
  const isImage = mimeType.startsWith("image/")
  const isVideo = mimeType.startsWith("video/")
  const isPdf = mimeType === "application/pdf"
  const color = isImage ? "#34C759" : isVideo ? "#FF9500" : isPdf ? "#FF3B30" : "#0A5C8C"

  return (
    <svg viewBox="0 0 20 24" fill="none" className="h-5 w-4 shrink-0" aria-hidden>
      <path d="M2 2a2 2 0 012-2h8l6 6v16a2 2 0 01-2 2H4a2 2 0 01-2-2V2z" fill={color} fillOpacity="0.1" stroke={color} strokeOpacity="0.4" strokeWidth="1.2" />
      <path d="M12 0v6h6" stroke={color} strokeOpacity="0.4" strokeWidth="1.2" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 20 18" fill="none" className="h-4 w-5 shrink-0" aria-hidden>
      <path d="M1 4a2 2 0 012-2h4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V4z" fill="#F5A623" fillOpacity="0.15" stroke="#F5A623" strokeOpacity="0.6" strokeWidth="1.2" />
    </svg>
  )
}

export default function DashboardPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const fetchFiles = useCallback(async (folderId: string | null) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (folderId) params.set("folderId", folderId)
      const res = await fetch(`/api/files?${params}`)
      const data = await res.json()
      setFiles(data.files || [])
      setFolders(data.folders || [])
    } catch {
      // silently fail — no data to show
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchFiles(currentFolderId) }, [currentFolderId, fetchFiles])

  async function handleCreateFolder() {
    const name = prompt("Nhập tên thư mục:")
    if (!name) return
    await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, parentId: currentFolderId }),
    })
    fetchFiles(currentFolderId)
  }

  async function handleDelete(fileId: string) {
    if (!confirm("Chuyển file vào thùng rác?")) return
    await fetch("/api/files/trash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "trash", fileId }),
    })
    fetchFiles(currentFolderId)
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) { fetchFiles(currentFolderId); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/files/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      setFiles(data.files || [])
      setFolders(data.folders || [])
    } finally {
      setLoading(false)
    }
  }

  const isEmpty = !loading && files.length === 0 && folders.length === 0

  return (
    <div className="flex flex-col h-full">

      {/* Toolbar — Finder-style */}
      <div className="flex items-center gap-3 border-b border-[#D2D2D7]/70 px-6 py-3 bg-white sticky top-0 z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[13px] text-[#6E6E73] min-w-0">
          <button
            onClick={() => setCurrentFolderId(null)}
            className="hover:text-[#1D1D1F] transition-colors shrink-0"
          >
            Files
          </button>
          {currentFolderId && (
            <>
              <span>/</span>
              <span className="text-[#1D1D1F] truncate">{currentFolderId.slice(0, 8)}…</span>
            </>
          )}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <svg viewBox="0 0 16 16" fill="none" className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6E6E73]" aria-hidden>
              <path d="M6.5 11a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM14 14l-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm file..."
              className="w-44 rounded-[8px] border border-[#D2D2D7] bg-[#F5F5F7] pl-8 pr-3 py-1.5 text-[13px] text-[#1D1D1F] placeholder:text-[#6E6E73] outline-none focus:border-[#0A5C8C] focus:ring-2 focus:ring-[#0A5C8C]/20 transition-colors"
            />
          </div>
        </form>

        {/* Actions */}
        <button
          onClick={handleCreateFolder}
          className="flex items-center gap-1.5 rounded-[8px] border border-[#D2D2D7] px-3 py-1.5 text-[13px] text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A5C8C]"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
            <path d="M8 2a1 1 0 011 1v4h4a1 1 0 110 2H9v4a1 1 0 11-2 0V9H3a1 1 0 110-2h4V3a1 1 0 011-1z" />
          </svg>
          Thư mục
        </button>
      </div>

      {/* File list */}
      <div className="flex-1 px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-[14px] text-[#6E6E73]">
            Đang tải…
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12 text-[#D2D2D7]" aria-hidden>
              <rect x="6" y="10" width="36" height="30" rx="4" stroke="currentColor" strokeWidth="2" />
              <path d="M6 18h36" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
            </svg>
            <p className="text-[14px] text-[#6E6E73]">Chưa có file nào. Upload để bắt đầu.</p>
          </div>
        ) : (
          <div className="rounded-[12px] border border-[#D2D2D7]/60 overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-[2fr_1fr_1fr_auto_auto] gap-4 px-4 py-2 bg-[#F5F5F7] border-b border-[#D2D2D7]/60">
              {["Tên", "Kích thước", "Loại", "Verified", ""].map((h) => (
                <span key={h} className="text-[11px] font-medium text-[#6E6E73] uppercase tracking-wide">{h}</span>
              ))}
            </div>

            {/* Folders */}
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolderId(folder.id)}
                className="grid grid-cols-[2fr_1fr_1fr_auto_auto] gap-4 items-center w-full px-4 py-2.5 border-b border-[#D2D2D7]/40 last:border-0 hover:bg-[#F5F5F7] transition-colors text-left group"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <FolderIcon />
                  <span className="text-[13px] font-medium text-[#1D1D1F] truncate group-hover:text-[#0A5C8C] transition-colors">{folder.name}</span>
                </span>
                <span className="text-[13px] text-[#6E6E73]">—</span>
                <span className="text-[13px] text-[#6E6E73]">Thư mục</span>
                <span />
                <span />
              </button>
            ))}

            {/* Files */}
            {files.map((file) => (
              <div
                key={file.id}
                className="grid grid-cols-[2fr_1fr_1fr_auto_auto] gap-4 items-center px-4 py-2.5 border-b border-[#D2D2D7]/40 last:border-0 hover:bg-[#F5F5F7] transition-colors group"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <FileIcon mimeType={file.mimeType} />
                  <span className="text-[13px] font-medium text-[#1D1D1F] truncate">{file.name}</span>
                </span>
                <span className="tabular-nums text-[13px] text-[#6E6E73]">{formatBytes(file.size)}</span>
                <span className="text-[13px] text-[#6E6E73] capitalize">{file.fileType}</span>
                <span>
                  {file.verifiedLevel >= 1 && file.verifiedLevel <= 5
                    ? <VerifiedBadge level={file.verifiedLevel as 1|2|3|4|5} size="sm" />
                    : <span className="text-[#D2D2D7] text-[12px]">—</span>
                  }
                </span>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="text-[12px] text-[#6E6E73] hover:text-[#FF3B30] transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B30]"
                  aria-label={`Xoá ${file.name}`}
                >
                  Xoá
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
