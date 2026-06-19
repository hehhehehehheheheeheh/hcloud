import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { searchFiles, searchFolders } from "@/lib/storage/search"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q") || undefined
  const fileType = searchParams.get("type") || undefined
  const minLevel = searchParams.get("minLevel") ? parseInt(searchParams.get("minLevel")!) : undefined
  const dateFrom = searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined
  const dateTo = searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined
  const trashed = searchParams.get("trashed") === "true"

  const [files, folders] = await Promise.all([
    searchFiles({ userId, query, fileType: fileType as any, minVerifiedLevel: minLevel, dateFrom, dateTo, trashed }),
    query ? searchFolders(userId, query) : Promise.resolve([]),
  ])

  return NextResponse.json({ files, folders, query })
}
