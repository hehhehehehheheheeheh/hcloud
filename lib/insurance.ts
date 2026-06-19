import { prisma } from "@/lib/prisma"
import { getWallet, addTransaction } from "@/lib/wallet"
import { calculateCompensation, type InsuranceInput } from "./compensation"

export type { InsuranceInput, InsuranceResult } from "./compensation"
export { calculateCompensation } from "./compensation"

export async function purchaseInsurancePolicy(userId: string, planName: string) {
  const insurancePlans: Record<string, Omit<InsuranceInput, "assetValue" | "isVerifiedL3Plus"> & { maxRecovery: number | null; voucherDesc: string | null; voucherCount: number | null }> = {
    "Cơ Bản": { planPrice: 199000, coefficient: 1, compensationPct: 35, maxRecovery: null, voucherDesc: "30%", voucherCount: 1 },
    "Nâng Cao": { planPrice: 349000, coefficient: 2, compensationPct: 45, maxRecovery: 10000000, voucherDesc: null, voucherCount: null },
    "Cao Cấp": { planPrice: 449000, coefficient: 3, compensationPct: 60, maxRecovery: 17000000, voucherDesc: "15% Horizon", voucherCount: 1 },
    "Premium": { planPrice: 699000, coefficient: 3.5, compensationPct: 75, maxRecovery: 20000000, voucherDesc: "20% Horizon (x3)", voucherCount: 3 },
    "Adv.": { planPrice: 1199000, coefficient: 4.5, compensationPct: 100, maxRecovery: 25000000, voucherDesc: "15% toàn Horation (x3)", voucherCount: 3 },
  }

  const plan = insurancePlans[planName]
  if (!plan) throw new Error("Invalid insurance plan")

  const existing = await prisma.insurancePolicy.findFirst({
    where: { userId, planName, isActive: true, endDate: { gte: new Date() } },
  })
  if (existing) throw new Error("Policy already active")

  const wallet = await getWallet(userId)
  await addTransaction(wallet.id, "insurance_premium", -plan.planPrice, undefined, `Mua bảo hiểm ${planName}`)

  const policy = await prisma.insurancePolicy.create({
    data: {
      userId,
      planName,
      pricePerMonth: plan.planPrice,
      compensationPct: plan.compensationPct,
      coefficient: plan.coefficient,
      maxRecovery: plan.maxRecovery,
      voucherDesc: plan.voucherDesc,
      voucherCount: plan.voucherCount,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  })

  return policy
}

export async function fileClaim(
  userId: string,
  policyId: string,
  fileId: string | undefined,
  description: string,
  evidenceUrl: string | undefined,
  claimedAmount: number | undefined
) {
  const policy = await prisma.insurancePolicy.findFirst({
    where: { id: policyId, userId, isActive: true },
  })
  if (!policy) throw new Error("Active policy not found")

  const file = fileId ? await prisma.file.findFirst({ where: { id: fileId, ownerId: userId } }) : null

  let calculatedPayout: number | null = null

  if (claimedAmount) {
    const isVerifiedL3Plus = file ? file.verifiedLevel >= 3 : false
    const result = calculateCompensation({
      planPrice: policy.pricePerMonth,
      coefficient: policy.coefficient,
      assetValue: claimedAmount,
      compensationPct: policy.compensationPct,
      isVerifiedL3Plus,
    })

    if (policy.maxRecovery) {
      calculatedPayout = Math.min(result.totalPayout, policy.maxRecovery)
    } else {
      calculatedPayout = result.totalPayout
    }
  }

  const claim = await prisma.claim.create({
    data: {
      policyId,
      userId,
      fileId,
      description,
      evidenceUrl,
      claimedAmount,
      calculatedPayout,
      status: "pending",
    },
  })

  return claim
}
