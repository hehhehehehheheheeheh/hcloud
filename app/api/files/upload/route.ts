import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateStorageKey, getUploadPresignedUrl } from "@/lib/storage/s3"
import { checkQuota } from "@/lib/storage/quota"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id

  try {
    const { name, originalName, mimeType, size, checksumSha256, folderId } = await req.json()

    if (!name || !originalName || !mimeType || !size || !checksumSha256) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { allowed, used, limit } = await checkQuota(userId, size)
    if (!allowed) {
      return NextResponse.json({
        error: "Storage quota exceeded",
        details: { used, limit },
      }, { status: 413 })
    }

    const existing = await prisma.file.findFirst({
      where: { checksumSha256, ownerId: userId, trashedAt: null },
    })

    let storageKey: string
    let dedupRef: string | null = null

    if (existing) {
      dedupRef = existing.storageKey
      storageKey = existing.storageKey
    } else {
      storageKey = generateStorageKey(userId, checksumSha256, originalName)
    }

    const presignedUrl = dedupRef ? null : await getUploadPresignedUrl(storageKey, mimeType)

    const file = await prisma.file.create({
      data: {
        name,
        originalName,
        mimeType,
        size,
        storageKey,
        checksumSha256,
        dedupRef,
        ownerId: userId,
        folderId: folderId || null,
      },
    })

    await prisma.activity.create({
      data: {
        userId,
        action: dedupRef ? "upload_dedup" : "upload",
        details: { fileId: file.id, fileName: name, size, dedup: !!dedupRef },
        fileId: file.id,
      },
    })

    return NextResponse.json({
      file: {
        id: file.id,
        name: file.name,
        size: file.size,
        checksumSha256: file.checksumSha256,
        deduplicated: !!dedupRef,
      },
      presignedUrl,
      storageKey,
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
