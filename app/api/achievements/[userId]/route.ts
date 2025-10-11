import { NextRequest, NextResponse } from "next/server"
import { getUserAchievements, initializeAchievementsForUser } from "@/lib/achievements"
import { dbService } from "@/lib/db-raw"

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Initialize achievements if they don't exist
    await initializeAchievementsForUser(userId)

    // Get user's achievements
    const achievements = await getUserAchievements(userId)

    // Get user info using dbService
    const user = await dbService.getUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Map image to avatar for frontend consistency
    const userWithAvatar = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      avatar: user.image,
      selectedBorder: user.selectedBorder,
      role: user.role,
      bio: user.bio,
      createdAt: user.createdAt
    }

    return NextResponse.json({
      user: userWithAvatar,
      achievements
    })
  } catch (error) {
    console.error("Error fetching user achievements:", error)
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    )
  }
}