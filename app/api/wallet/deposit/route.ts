import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getWallet, addTransaction } from "@/lib/wallet"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { amount, referenceCode } = await req.json()

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
  }

  if ((session.user as any).role !== "admin" && !referenceCode) {
    return NextResponse.json({ error: "Reference code required for manual deposit. Contact admin." }, { status: 400 })
  }

  try {
    const wallet = await getWallet(userId)
    const updated = await addTransaction(
      wallet.id,
      "deposit",
      amount,
      referenceCode || `manual_${Date.now()}`,
      `Nạp SD: +${amount.toLocaleString("vi-VN")} SD`
    )
    return NextResponse.json({ wallet: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
