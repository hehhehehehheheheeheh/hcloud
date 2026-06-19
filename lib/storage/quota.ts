import { prisma } from "@/lib/prisma"

export async function getUserStorageLimit(userId: string): Promise<{ used: number; limit: number }> {
  const [totalSize, activeSubscriptions] = await Promise.all([
    prisma.file.aggregate({
      where: { ownerId: userId, trashedAt: null },
      _sum: { size: true },
    }),
    prisma.subscription.findMany({
      where: { userId, isActive: true, type: "digital", endDate: { gte: new Date() } },
      include: { package: true },
    }),
  ])

  const used = totalSize._sum.size || 0
  const limit = activeSubscriptions.reduce((max, sub) => Math.max(max, sub.package.sizeMb * 1024 * 1024), 0)

  return { used, limit }
}

export async function checkQuota(userId: string, fileSize: number): Promise<{ allowed: boolean; used: number; limit: number }> {
  const { used, limit } = await getUserStorageLimit(userId)

  if (limit === 0) {
    return { allowed: false, used, limit }
  }

  return { allowed: used + fileSize <= limit, used, limit }
}
