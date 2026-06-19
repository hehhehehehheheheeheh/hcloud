import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { fileClaim } from "@/lib/insurance"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { policyId, fileId, description, evidenceUrl, claimedAmount } = await req.json()

  if (!policyId || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const claim = await fileClaim(userId, policyId, fileId, description, evidenceUrl, claimedAmount)
    return NextResponse.json({ claim }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
