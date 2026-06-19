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

export function calculateCompensation(input: InsuranceInput): InsuranceResult {
  const { planPrice, coefficient, assetValue, compensationPct, isVerifiedL3Plus } = input
  const effectivePct = isVerifiedL3Plus ? compensationPct : compensationPct / 2
  const baseCompensation = planPrice * coefficient
  const assetCompensation = Math.round(assetValue * (effectivePct / 100))
  const totalPayout = baseCompensation + assetCompensation
  return { baseCompensation, assetCompensation, totalPayout }
}
