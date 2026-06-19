import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { verifyChecksum } from "@/lib/storage/verify"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id
  const { fileId, checksumSha256 } = await req.json()

  if (!fileId || !checksumSha256) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const file = await prisma.file.findFirst({
    where: { id: fileId, ownerId: userId },
  })
  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  const isValid = await verifyChecksum(fileId, checksumSha256)

  if (isValid) {
    await prisma.file.update({
      where: { id: fileId },
      data: { checksumSha256 },
    })
  }

  return NextResponse.json({ verified: isValid, stored: file.checksumSha256, provided: checksumSha256 })
}
