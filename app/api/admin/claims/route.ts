import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getWallet, addTransaction } from "@/lib/wallet"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if ((session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const claims = await prisma.claim.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      policy: { select: { planName: true } },
    },
  })

  return NextResponse.json({ claims })
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if ((session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const adminId = (session.user as any).id
  const { claimId, status, reviewNote } = await req.json()

  if (!claimId || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    include: { policy: true },
  })
  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 })
  }
  if (claim.status !== "pending") {
    return NextResponse.json({ error: "Claim already processed" }, { status: 409 })
  }

  const updated = await prisma.claim.update({
    where: { id: claimId },
    data: { status, reviewedBy: adminId, reviewNote },
  })

  if (status === "approved" && claim.calculatedPayout) {
    const wallet = await getWallet(claim.userId)
    await addTransaction(wallet.id, "insurance_payout", claim.calculatedPayout, claimId, `Bồi thường bảo hiểm ${claim.policy.planName}: ${claim.calculatedPayout.toLocaleString("vi-VN")} SD`)
  }

  return NextResponse.json({ claim: updated })
}
