import { calculateCompensation, type InsuranceInput } from "../lib/compensation"

/**
 * Formula: Bồi thường = (a × a¹) + (b + b%¹)
 * where assetCompensation = b + b×(pct/100) = b×(1 + pct/100)
 */
describe("calculateCompensation", () => {
  const basePlan: InsuranceInput = {
    planPrice: 199000,
    coefficient: 1,
    assetValue: 1000000,
    compensationPct: 35,
    isVerifiedL3Plus: true,
  }

  it("calculates base compensation as planPrice × coefficient", () => {
    const result = calculateCompensation(basePlan)
    expect(result.baseCompensation).toBe(199000)
  })

  it("calculates asset compensation as assetValue + assetValue×(pct/100)", () => {
    // 1_000_000 + 1_000_000×0.35 = 1_350_000
    const result = calculateCompensation(basePlan)
    expect(result.assetCompensation).toBe(1350000)
  })

  it("calculates total payout as baseCompensation + assetCompensation", () => {
    // 199_000 + 1_350_000 = 1_549_000
    const result = calculateCompensation(basePlan)
    expect(result.totalPayout).toBe(1549000)
  })

  it("halves compensation percentage when file is below L3", () => {
    const input: InsuranceInput = { ...basePlan, isVerifiedL3Plus: false }
    // effectivePct = 35/2 = 17.5
    // assetCompensation = 1_000_000 + 1_000_000×0.175 = 1_175_000
    const result = calculateCompensation(input)
    expect(result.assetCompensation).toBe(1175000)
    expect(result.totalPayout).toBe(1374000)
  })

  it("applies Nâng Cao coefficients", () => {
    const input: InsuranceInput = {
      planPrice: 349000,
      coefficient: 2,
      assetValue: 5000000,
      compensationPct: 45,
      isVerifiedL3Plus: true,
    }
    // base = 349_000×2 = 698_000
    // asset = 5_000_000 + 5_000_000×0.45 = 7_250_000
    // total = 698_000 + 7_250_000 = 7_948_000
    const result = calculateCompensation(input)
    expect(result.baseCompensation).toBe(698000)
    expect(result.assetCompensation).toBe(7250000)
    expect(result.totalPayout).toBe(7948000)
  })

  it("applies Adv. coefficients (100% pct ⇒ assetCompensation = 2×assetValue)", () => {
    const input: InsuranceInput = {
      planPrice: 1199000,
      coefficient: 4.5,
      assetValue: 10000000,
      compensationPct: 100,
      isVerifiedL3Plus: true,
    }
    // base = 1_199_000×4.5 = 5_395_500
    // asset = 10_000_000 + 10_000_000×1.0 = 20_000_000
    // total = 5_395_500 + 20_000_000 = 25_395_500
    const result = calculateCompensation(input)
    expect(result.baseCompensation).toBe(5395500)
    expect(result.assetCompensation).toBe(20000000)
    expect(result.totalPayout).toBe(25395500)
  })

  it("returns integer asset compensation", () => {
    const input: InsuranceInput = {
      planPrice: 199000,
      coefficient: 1,
      assetValue: 33333,
      compensationPct: 35,
      isVerifiedL3Plus: true,
    }
    const result = calculateCompensation(input)
    expect(Number.isInteger(result.assetCompensation)).toBe(true)
  })

  it("works with zero asset value", () => {
    const input: InsuranceInput = { ...basePlan, assetValue: 0 }
    const result = calculateCompensation(input)
    expect(result.baseCompensation).toBe(199000)
    expect(result.assetCompensation).toBe(0)
    expect(result.totalPayout).toBe(199000)
  })
})
