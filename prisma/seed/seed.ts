import { PrismaClient } from "../../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12)
  const userPassword = await bcrypt.hash("user123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@hcloud.syreal" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@hcloud.syreal",
      passwordHash: adminPassword,
      role: "admin",
    },
  })

  await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id, balance: 1000000 },
  })

  const storagePackages = [
    { name: "Basic", type: "digital", sizeMb: 500, priceSd: 34000, verifiedLevel: 1 },
    { name: "Plus", type: "digital", sizeMb: 1024, priceSd: 59000, verifiedLevel: 2 },
    { name: "Pro", type: "digital", sizeMb: 3072, priceSd: 79000, verifiedLevel: 3 },
    { name: "Premium", type: "digital", sizeMb: 5120, priceSd: 149000, verifiedLevel: 4 },
    { name: "Adv.", type: "digital", sizeMb: 10240, priceSd: 299000, verifiedLevel: 5 },
    { name: "Item Basic", type: "item", sizeMb: 0, priceSd: 29000, verifiedLevel: 1, itemChests: 1 },
    { name: "Item Plus", type: "item", sizeMb: 0, priceSd: 44000, verifiedLevel: 2, itemChests: 3 },
    { name: "Item Pro", type: "item", sizeMb: 0, priceSd: 59000, verifiedLevel: 3, itemChests: 5 },
    { name: "Item Premium", type: "item", sizeMb: 0, priceSd: 119000, verifiedLevel: 4, itemChests: 10 },
    { name: "Item Adv.", type: "item", sizeMb: 0, priceSd: 249000, verifiedLevel: 5, itemChests: 20 },
  ]

  for (const pkg of storagePackages) {
    await prisma.storagePackage.upsert({
      where: { id: pkg.name.toLowerCase().replace(/\s+/g, "_") },
      update: {},
      create: {
        id: pkg.name.toLowerCase().replace(/\s+/g, "_"),
        name: pkg.name,
        type: pkg.type,
        sizeMb: pkg.sizeMb,
        priceSd: pkg.priceSd,
        verifiedLevel: pkg.verifiedLevel,
        itemChests: pkg.itemChests || 0,
      },
    })
  }

  const verifiedLevels = [
    { level: 1, name: "Xác nhận cơ bản", description: "Chứng minh quyền sở hữu hợp pháp", priceSd: 59000 },
    { level: 2, name: "Bảo hộ sở hữu", description: "Công nhận chính thức + quyền khiếu nại nếu có bản sao trái phép", priceSd: 79000 },
    { level: 3, name: "Định giá & Giao dịch", description: "Định giá sơ bộ + cho phép chuyển nhượng", priceSd: 99000 },
    { level: 4, name: "Bảo hộ pháp lý", description: "Bảo vệ pháp lý + hỗ trợ khiếu nại", priceSd: 119000 },
    { level: 5, name: "Bảo hộ VIP", description: "Đặc quyền cao cấp nhất toàn hệ sinh thái", priceSd: 129000 },
  ]

  for (const vl of verifiedLevels) {
    await prisma.verifiedLevel.upsert({
      where: { level: vl.level },
      update: {},
      create: vl,
    })
  }

  const insurancePlans = [
    { planName: "Cơ Bản", pricePerMonth: 199000, compensationPct: 35, coefficient: 1, maxRecovery: null, voucherDesc: "30%", voucherCount: 1 },
    { planName: "Nâng Cao", pricePerMonth: 349000, compensationPct: 45, coefficient: 2, maxRecovery: 10000000, voucherDesc: null, voucherCount: null },
    { planName: "Cao Cấp", pricePerMonth: 449000, compensationPct: 60, coefficient: 3, maxRecovery: 17000000, voucherDesc: "15% Horizon", voucherCount: 1 },
    { planName: "Premium", pricePerMonth: 699000, compensationPct: 75, coefficient: 3.5, maxRecovery: 20000000, voucherDesc: "20% Horizon (x3)", voucherCount: 3 },
    { planName: "Adv.", pricePerMonth: 1199000, compensationPct: 100, coefficient: 4.5, maxRecovery: 25000000, voucherDesc: "15% toàn Horation (x3)", voucherCount: 3 },
  ]

  for (const plan of insurancePlans) {
    const existing = await prisma.insurancePolicy.findFirst({
      where: { planName: plan.planName, userId: admin.id },
    })
    if (!existing) {
      await prisma.insurancePolicy.create({
        data: {
          userId: admin.id,
          ...plan,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
    }
  }

  console.log("Seed completed successfully!")
  console.log(`Admin: admin@hcloud.syreal / admin123`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
