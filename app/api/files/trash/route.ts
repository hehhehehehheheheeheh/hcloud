import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { trashFile, restoreFile, listTrashed, emptyTrash } from "@/lib/storage/trash"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const files = await listTrashed(userId)
  return NextResponse.json({ files })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const userId = (session.user as any).id
  const { action, fileId } = await req.json()

  try {
    if (action === "trash" && fileId) {
      const result = await trashFile(fileId, userId)
      return NextResponse.json({ file: result })
    }
    if (action === "restore" && fileId) {
      const result = await restoreFile(fileId, userId)
      return NextResponse.json({ file: result })
    }
    if (action === "empty") {
      const result = await emptyTrash(userId)
      return NextResponse.json(result)
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
