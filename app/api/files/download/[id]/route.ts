import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getDownloadPresignedUrl } from "@/lib/storage/s3"
import { prisma } from "@/lib/prisma"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id
  const { id } = await params

  const file = await prisma.file.findFirst({
    where: { id, ownerId: userId },
  })
  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  const presignedUrl = await getDownloadPresignedUrl(file.storageKey)

  await prisma.activity.create({
    data: {
      userId,
      action: "download",
      details: { fileId: file.id, fileName: file.name },
      fileId: file.id,
    },
  })

  return NextResponse.json({ presignedUrl, fileName: file.originalName, mimeType: file.mimeType })
}
