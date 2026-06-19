import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { searchParams } = new URL(req.url)
  const parentId = searchParams.get("parentId") || null

  const folders = await prisma.folder.findMany({
    where: { ownerId: userId, parentId },
    orderBy: { name: "asc" },
  })

  return NextResponse.json({ folders })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { name, parentId } = await req.json()

  if (!name) {
    return NextResponse.json({ error: "Folder name is required" }, { status: 400 })
  }

  const folder = await prisma.folder.create({
    data: { name, parentId: parentId || null, ownerId: userId },
  })

  await prisma.activity.create({
    data: {
      userId,
      action: "create_folder",
      details: { folderId: folder.id, folderName: name },
    },
  })

  return NextResponse.json({ folder }, { status: 201 })
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { folderId, name } = await req.json()

  const folder = await prisma.folder.findFirst({
    where: { id: folderId, ownerId: userId },
  })
  if (!folder) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 })
  }

  const updated = await prisma.folder.update({
    where: { id: folderId },
    data: { name },
  })

  return NextResponse.json({ folder: updated })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { folderId } = await req.json()

  const folder = await prisma.folder.findFirst({
    where: { id: folderId, ownerId: userId },
  })
  if (!folder) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 })
  }

  await prisma.folder.delete({ where: { id: folderId } })

  return NextResponse.json({ deleted: true })
}
