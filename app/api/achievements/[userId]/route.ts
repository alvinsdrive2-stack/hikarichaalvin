import { NextRequest, NextResponse } from "next/server"
import { getUserAchievements } from "@/lib/achievements"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Get user's achievements
    const achievements = await getUserAchievements(userId)

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        points: true,
        role: true,
        bio: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Map image to avatar for frontend consistency
    const userWithAvatar = {
      ...user,
      avatar: user.image
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