import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getWallet, getTransactions, addTransaction } from "@/lib/wallet"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const wallet = await getWallet(userId)
  const transactions = await getTransactions(wallet.id)
  return NextResponse.json({ wallet, transactions })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { amount, type, referenceId, description } = await req.json()

  if (!amount || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  if ((session.user as any).role !== "admin" && type === "admin_adjustment") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const wallet = await getWallet(userId)
    const updated = await addTransaction(wallet.id, type, amount, referenceId, description)
    return NextResponse.json({ wallet: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
