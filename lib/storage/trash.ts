import { prisma } from "@/lib/prisma"

export async function trashFile(fileId: string, userId: string) {
  const file = await prisma.file.findFirst({
    where: { id: fileId, ownerId: userId },
  })
  if (!file) throw new Error("File not found")
  if (file.trashedAt) throw new Error("File already in trash")

  const updated = await prisma.file.update({
    where: { id: fileId },
    data: { trashedAt: new Date() },
  })

  await prisma.activity.create({
    data: {
      userId,
      action: "trash",
      details: { fileId, fileName: file.name },
      fileId,
    },
  })

  return updated
}

export async function restoreFile(fileId: string, userId: string) {
  const file = await prisma.file.findFirst({
    where: { id: fileId, ownerId: userId, trashedAt: { not: null } },
  })
  if (!file) throw new Error("File not found in trash")

  const updated = await prisma.file.update({
    where: { id: fileId },
    data: { trashedAt: null },
  })

  await prisma.activity.create({
    data: {
      userId,
      action: "restore",
      details: { fileId, fileName: file.name },
      fileId,
    },
  })

  return updated
}

export async function deleteFilePermanently(fileId: string, userId: string) {
  const file = await prisma.file.findFirst({
    where: { id: fileId, ownerId: userId },
  })
  if (!file) throw new Error("File not found")

  await prisma.file.delete({ where: { id: fileId } })

  await prisma.activity.create({
    data: {
      userId,
      action: "permanent_delete",
      details: { fileId, fileName: file.name },
    },
  })

  return { deleted: true }
}

export async function listTrashed(userId: string) {
  return prisma.file.findMany({
    where: { ownerId: userId, trashedAt: { not: null } },
    orderBy: { trashedAt: "desc" },
  })
}

export async function emptyTrash(userId: string) {
  const files = await prisma.file.findMany({
    where: { ownerId: userId, trashedAt: { not: null } },
  })

  await prisma.file.deleteMany({
    where: { ownerId: userId, trashedAt: { not: null } },
  })

  await prisma.activity.create({
    data: {
      userId,
      action: "empty_trash",
      details: { count: files.length },
    },
  })

  return { deleted: files.length }
}
