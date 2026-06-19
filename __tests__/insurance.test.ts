import { calculateCompensation, type InsuranceInput } from "../lib/compensation"

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

  it("calculates asset compensation as assetValue × (compensationPct / 100)", () => {
    const result = calculateCompensation(basePlan)
    expect(result.assetCompensation).toBe(350000)
  })

  it("calculates total payout as base + asset compensation", () => {
    const result = calculateCompensation(basePlan)
    expect(result.totalPayout).toBe(549000)
  })

  it("halves compensation percentage when file is below L3", () => {
    const input: InsuranceInput = { ...basePlan, isVerifiedL3Plus: false }
    const result = calculateCompensation(input)
    expect(result.assetCompensation).toBe(175000)
    expect(result.totalPayout).toBe(374000)
  })

  it("applies Nâng Cao coefficients", () => {
    const input: InsuranceInput = {
      planPrice: 349000,
      coefficient: 2,
      assetValue: 5000000,
      compensationPct: 45,
      isVerifiedL3Plus: true,
    }
    const result = calculateCompensation(input)
    expect(result.baseCompensation).toBe(698000)
    expect(result.assetCompensation).toBe(2250000)
    expect(result.totalPayout).toBe(2948000)
  })

  it("applies Adv. coefficients", () => {
    const input: InsuranceInput = {
      planPrice: 1199000,
      coefficient: 4.5,
      assetValue: 10000000,
      compensationPct: 100,
      isVerifiedL3Plus: true,
    }
    const result = calculateCompensation(input)
    expect(result.baseCompensation).toBe(5395500)
    expect(result.assetCompensation).toBe(10000000)
    expect(result.totalPayout).toBe(15395500)
  })

  it("rounds asset compensation to integer", () => {
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
