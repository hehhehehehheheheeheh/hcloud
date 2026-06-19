import crypto from "crypto"
import { prisma } from "@/lib/prisma"

export async function verifyChecksum(fileId: string, expectedHash: string): Promise<boolean> {
  const file = await prisma.file.findUnique({ where: { id: fileId } })
  if (!file) throw new Error("File not found")
  return file.checksumSha256 === expectedHash
}

export function computeChecksum(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex")
}
