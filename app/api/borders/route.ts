import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserUnlockedBorders } from "@/lib/achievements"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const unlockedBorders = await getUserUnlockedBorders(session.user.id)

    return NextResponse.json({
      borders: unlockedBorders
    })
  } catch (error) {
    console.error("Error fetching borders:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}