import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id

  const [policies, claims] = await Promise.all([
    prisma.insurancePolicy.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.claim.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { policy: { select: { planName: true } } },
    }),
  ])

  return NextResponse.json({ policies, claims })
}
