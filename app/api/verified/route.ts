import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getWallet, addTransaction } from "@/lib/wallet"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [verifiedLevels, files] = await Promise.all([
    prisma.verifiedLevel.findMany({ orderBy: { level: "asc" } }),
    prisma.file.findMany({
      where: { ownerId: (session.user as any).id, trashedAt: null },
      select: { id: true, name: true, verifiedLevel: true },
    }),
  ])

  return NextResponse.json({ verifiedLevels, files })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { fileId, level } = await req.json()

  if (!fileId || !level) {
    return NextResponse.json({ error: "Missing fileId or level" }, { status: 400 })
  }

  const userMaxLevel = await getUserMaxVerifiedLevel(userId)
  if (level > userMaxLevel) {
    return NextResponse.json({
      error: `Cannot set verified level L${level}. Your package max is L${userMaxLevel}.`,
    }, { status: 403 })
  }

  const vl = await prisma.verifiedLevel.findUnique({ where: { level } })
  if (!vl) {
    return NextResponse.json({ error: "Invalid verified level" }, { status: 400 })
  }

  const file = await prisma.file.findFirst({ where: { id: fileId, ownerId: userId } })
  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  const wallet = await getWallet(userId)
  try {
    await addTransaction(wallet.id, "purchase_verified", -vl.priceSd, fileId, `Mua xác thực L${level} cho file: ${file.name}`)

    await prisma.file.update({
      where: { id: fileId },
      data: { verifiedLevel: level },
    })

    return NextResponse.json({
      success: true,
      fileId,
      verifiedLevel: level,
      message: `File đã được xác thực L${level} - ${vl.name}`,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

async function getUserMaxVerifiedLevel(userId: string): Promise<number> {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId, isActive: true, endDate: { gte: new Date() } },
    include: { package: true },
  })

  return Math.max(0, ...subscriptions.map((s) => s.package.verifiedLevel))
}
