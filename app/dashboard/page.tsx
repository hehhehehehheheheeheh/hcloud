"use client"

import { useState, useEffect, useCallback } from "react"
import { formatBytes, formatDate } from "@/lib/utils"

interface FileItem {
  id: string
  name: string
  originalName: string
  mimeType: string
  size: number
  checksumSha256: string
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

export default function DashboardPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [folderPath, setFolderPath] = useState<FolderItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchFiles = useCallback(async (folderId: string | null) => {
    try {
      const params = new URLSearchParams()
      if (folderId) params.set("folderId", folderId)
      const res = await fetch(`/api/files?${params}`)
      const data = await res.json()
      setFiles(data.files || [])
      setFolders(data.folders || [])
    } catch (err) {
      console.error("Failed to fetch files", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFiles(currentFolderId)
  }, [currentFolderId, fetchFiles])

  useEffect(() => {
    if (!currentFolderId) {
      setFolderPath([])
      return
    }
    const buildPath = async () => {
      const path: FolderItem[] = []
      let id: string | null = currentFolderId
      while (id) {
        const res = await fetch(`/api/folders?parentId=${id}`)
        path.unshift({ id, name: "...", parentId: null })
        id = null
      }
      setFolderPath(path)
    }
    buildPath()
  }, [currentFolderId])

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

  function handleFolderClick(folder: FolderItem) {
    setCurrentFolderId(folder.id)
  }

  function handleNavigateUp() {
    setCurrentFolderId(null)
  }

  async function handleDeleteFile(fileId: string) {
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
    if (!searchQuery.trim()) {
      fetchFiles(currentFolderId)
      return
    }
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

  const verifiedBadge = (level: number) => {
    if (level === 0) return null
    const colors = ["", "bg-gray-400", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500"]
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ${colors[level] || "bg-gray-400"}`}>
        L{level}
      </span>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">File Explorer</h1>
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm file..."
              className="rounded-lg border border-border px-3 py-1.5 text-sm outline-none focus:border-primary"
            />
            <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-light">
              Tìm
            </button>
          </form>
          <button
            onClick={handleCreateFolder}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-primary hover:bg-surface"
          >
            + Thư mục
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted">
        <button onClick={handleNavigateUp} className="hover:text-primary">
          Thư mục gốc
        </button>
        {folderPath.map((f) => (
          <span key={f.id}>/ {f.name}</span>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 text-center text-muted">Đang tải...</div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 font-medium text-muted">Tên</th>
                <th className="px-4 py-3 font-medium text-muted">Kích thước</th>
                <th className="px-4 py-3 font-medium text-muted">Loại</th>
                <th className="px-4 py-3 font-medium text-muted">Verified</th>
                <th className="px-4 py-3 font-medium text-muted">Ngày tạo</th>
                <th className="px-4 py-3 font-medium text-muted">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {folders.map((folder) => (
                <tr key={folder.id} className="cursor-pointer hover:bg-surface/50" onClick={() => handleFolderClick(folder)}>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <span>📁</span>
                      <span className="font-medium text-primary">{folder.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">—</td>
                  <td className="px-4 py-3 text-muted">Thư mục</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3 text-muted">—</td>
                  <td className="px-4 py-3">—</td>
                </tr>
              ))}
              {files.map((file) => (
                <tr key={file.id}>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <span>📄</span>
                      <span className="font-medium text-primary">{file.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatBytes(file.size)}</td>
                  <td className="px-4 py-3 text-muted">{file.fileType}</td>
                  <td className="px-4 py-3">{verifiedBadge(file.verifiedLevel)}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(file.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
              {files.length === 0 && folders.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-muted" colSpan={6}>
                    Chưa có file nào. Kéo thả file vào đây hoặc nhấn Upload để bắt đầu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
