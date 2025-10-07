import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserAchievements, initializeAchievementsForUser } from "@/lib/achievements"
import { db } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Initialize achievements if they don't exist
    await initializeAchievementsForUser(session.user.id)

    const achievements = await getUserAchievements(session.user.id)
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { points: true }
    })

    return NextResponse.json({
      achievements,
      userPoints: user?.points || 0
    })
  } catch (error) {
    console.error("Error fetching achievements:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}