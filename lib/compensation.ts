export interface InsuranceInput {
  planPrice: number
  coefficient: number
  assetValue: number
  compensationPct: number
  isVerifiedL3Plus: boolean
}

export interface InsuranceResult {
  baseCompensation: number
  assetCompensation: number
  totalPayout: number
}

/**
 * Formula (per original document): Bồi thường = (a × a¹) + (b + b%¹)
 *
 *   a    = planPrice       — số tiền mua gói bảo hiểm
 *   a¹   = coefficient     — hệ số bồi thường theo gói
 *   b    = assetValue      — số tiền thẩm định giá trị tài sản bị mất/hư hại
 *   b%¹  = b × (pct / 100) — phần trăm bồi thường áp lên b
 *
 * Meaning: assetCompensation = b + (b × effectivePct/100)
 * Files below L3 have their pct halved before the formula runs.
 */
export function calculateCompensation(input: InsuranceInput): InsuranceResult {
  const { planPrice, coefficient, assetValue, compensationPct, isVerifiedL3Plus } = input
  const effectivePct = isVerifiedL3Plus ? compensationPct : compensationPct / 2
  const baseCompensation = Math.round(planPrice * coefficient)
  const assetCompensation = Math.round(assetValue + assetValue * (effectivePct / 100))
  const totalPayout = baseCompensation + assetCompensation
  return { baseCompensation, assetCompensation, totalPayout }
}
