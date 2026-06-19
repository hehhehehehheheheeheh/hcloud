import { prisma } from "@/lib/prisma"

export async function getWallet(userId: string) {
  let wallet = await prisma.wallet.findUnique({ where: { userId } })
  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { userId, balance: 0 },
    })
  }
  return wallet
}

export async function addTransaction(
  walletId: string,
  type: "deposit" | "purchase_storage" | "purchase_item_storage" | "purchase_verified" | "insurance_premium" | "insurance_payout" | "admin_adjustment",
  amount: number,
  referenceId?: string,
  description?: string
) {
  const wallet = await prisma.wallet.findUnique({ where: { id: walletId } })
  if (!wallet) throw new Error("Wallet not found")

  if (amount < 0 && wallet.balance + amount < 0) {
    throw new Error("Insufficient balance")
  }

  const newBalance = wallet.balance + amount

  const [updatedWallet] = await prisma.$transaction([
    prisma.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance },
    }),
    prisma.walletTransaction.create({
      data: {
        walletId,
        type,
        amount,
        balanceAfter: newBalance,
        referenceId,
        description,
      },
    }),
  ])

  return updatedWallet
}

export async function getTransactions(walletId: string, limit = 50) {
  return prisma.walletTransaction.findMany({
    where: { walletId },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}
