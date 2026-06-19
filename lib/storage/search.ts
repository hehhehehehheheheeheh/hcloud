import { prisma } from "@/lib/prisma"
import type { FileType } from "@/app/generated/prisma/client"

interface SearchParams {
  userId: string
  query?: string
  fileType?: FileType
  minVerifiedLevel?: number
  dateFrom?: Date
  dateTo?: Date
  trashed?: boolean
}

export async function searchFiles(params: SearchParams) {
  const { userId, query, fileType, minVerifiedLevel, dateFrom, dateTo, trashed } = params

  const where: any = {
    ownerId: userId,
  }

  if (trashed) {
    where.trashedAt = { not: null }
  } else {
    where.trashedAt = null
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { originalName: { contains: query, mode: "insensitive" } },
    ]
  }

  if (fileType) {
    where.fileType = fileType
  }

  if (minVerifiedLevel && minVerifiedLevel > 0) {
    where.verifiedLevel = { gte: minVerifiedLevel }
  }

  if (dateFrom || dateTo) {
    where.createdAt = {}
    if (dateFrom) where.createdAt.gte = dateFrom
    if (dateTo) where.createdAt.lte = dateTo
  }

  return prisma.file.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      folder: { select: { id: true, name: true } },
    },
  })
}

export async function searchFolders(userId: string, query: string) {
  return prisma.folder.findMany({
    where: {
      ownerId: userId,
      name: { contains: query, mode: "insensitive" },
    },
    orderBy: { name: "asc" },
  })
}
