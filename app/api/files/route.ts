import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { deleteFilePermanently } from "@/lib/storage/trash"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { searchParams } = new URL(req.url)
  const folderId = searchParams.get("folderId")

  const where: any = { ownerId: userId, trashedAt: null }
  if (folderId) {
    where.folderId = folderId
  } else {
    where.folderId = null
  }

  const [files, folders] = await Promise.all([
    prisma.file.findMany({ where, orderBy: { createdAt: "desc" } }),
    folderId
      ? prisma.folder.findMany({ where: { parentId: folderId, ownerId: userId }, orderBy: { name: "asc" } })
      : prisma.folder.findMany({ where: { parentId: null, ownerId: userId }, orderBy: { name: "asc" } }),
  ])

  return NextResponse.json({ files, folders })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { fileId, permanent } = await req.json()

  try {
    if (permanent) {
      const result = await deleteFilePermanently(fileId, userId)
      return NextResponse.json(result)
    }
    const { trashFile } = await import("@/lib/storage/trash")
    const result = await trashFile(fileId, userId)
    return NextResponse.json({ file: result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
