import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getWallet, addTransaction } from "@/lib/wallet"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id

  const [subscriptions, packages] = await Promise.all([
    prisma.subscription.findMany({
      where: { userId, isActive: true },
      include: { package: true },
      orderBy: { endDate: "asc" },
    }),
    prisma.storagePackage.findMany({ where: { isActive: true } }),
  ])

  return NextResponse.json({ subscriptions, packages })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { packageId } = await req.json()

  if (!packageId) {
    return NextResponse.json({ error: "Missing packageId" }, { status: 400 })
  }

  const pkg = await prisma.storagePackage.findUnique({ where: { id: packageId } })
  if (!pkg || !pkg.isActive) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 })
  }

  const activeSub = await prisma.subscription.findFirst({
    where: { userId, packageId, isActive: true, endDate: { gte: new Date() } },
  })
  if (activeSub) {
    return NextResponse.json({ error: "Package already active" }, { status: 409 })
  }

  const wallet = await getWallet(userId)

  try {
    await addTransaction(wallet.id, "purchase_storage", -pkg.priceSd, packageId, `Mua gói ${pkg.name} (${pkg.type})`)

    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 6)

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        packageId: pkg.id,
        type: pkg.type,
        startDate: new Date(),
        endDate,
        isActive: true,
      },
    })

    return NextResponse.json({ subscription, package: pkg }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
