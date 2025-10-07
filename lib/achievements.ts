import { db } from "./prisma"
import { AchievementType } from "@prisma/client"

export interface AchievementConfig {
  type: AchievementType
  title: string
  description: string
  targetValue: number
  rewards: {
    points?: number
    borderUnlocks?: string[]
    badges?: string[]
  }
}

export const ACHIEVEMENTS_CONFIG: AchievementConfig[] = [
  {
    type: "FIRST_FORUM_POST",
    title: "Poster Pertama",
    description: "Buat postingan forum pertama Anda",
    targetValue: 1,
    rewards: {
      points: 10,
      borderUnlocks: ["bronze"]
    }
  },
  {
    type: "FORUM_REGULAR",
    title: "Pembicara Aktif",
    description: "Buat 10 postingan forum",
    targetValue: 10,
    rewards: {
      points: 50,
      borderUnlocks: ["silver"]
    }
  },
  {
    type: "RECIPE_CREATOR",
    title: "Koki Creative",
    description: "Buat 5 resep baru",
    targetValue: 5,
    rewards: {
      points: 30,
      borderUnlocks: ["silver"]
    }
  },
  {
    type: "SOCIAL_BUTTERFLY",
    title: "Pendengar Baik",
    description: "Buat 20 komentar di forum",
    targetValue: 20,
    rewards: {
      points: 40,
      borderUnlocks: ["silver"]
    }
  },
  {
    type: "EARLY_ADOPTER",
    title: "Early Adopter",
    description: "Bergabung dalam minggu pertama",
    targetValue: 1,
    rewards: {
      points: 25,
      borderUnlocks: ["bronze"]
    }
  },
  {
    type: "PURCHASE_MASTER",
    title: "Pembeli Setia",
    description: "Lakukan 5 pembelian",
    targetValue: 5,
    rewards: {
      points: 75,
      borderUnlocks: ["gold"]
    }
  },
  {
    type: "POINTS_COLLECTOR",
    title: "Poin Hunter",
    description: "Kumpulkan 1000 poin",
    targetValue: 1000,
    rewards: {
      points: 100,
      borderUnlocks: ["diamond"]
    }
  }
]

export async function initializeAchievementsForUser(userId: string) {
  const achievements = await Promise.all(
    ACHIEVEMENTS_CONFIG.map(async (config) => {
      return await db.achievement.upsert({
        where: {
          userId_type: {
            userId,
            type: config.type
          }
        },
        update: {},
        create: {
          userId,
          type: config.type,
          title: config.title,
          description: config.description,
          targetValue: config.targetValue,
          currentValue: 0,
          isCompleted: false,
          rewards: config.rewards
        }
      })
    })
  )

  return achievements
}

export async function updateAchievementProgress(
  userId: string,
  type: AchievementType,
  increment: number = 1
) {
  const config = ACHIEVEMENTS_CONFIG.find(a => a.type === type)
  if (!config) return null

  const achievement = await db.achievement.findUnique({
    where: {
      userId_type: {
        userId,
        type
      }
    }
  })

  if (!achievement) {
    // Initialize achievement if it doesn't exist
    await initializeAchievementsForUser(userId)
    return updateAchievementProgress(userId, type, increment)
  }

  if (achievement.isCompleted) return achievement

  const newCurrentValue = Math.min(achievement.currentValue + increment, config.targetValue)
  const isCompleted = newCurrentValue >= config.targetValue

  const updatedAchievement = await db.achievement.update({
    where: {
      userId_type: {
        userId,
        type
      }
    },
    data: {
      currentValue: newCurrentValue,
      isCompleted,
      completedAt: isCompleted ? new Date() : null
    }
  })

  // If achievement is completed, give rewards
  if (isCompleted && !achievement.isCompleted) {
    await grantAchievementRewards(userId, config)

    // Log activity
    await db.activity.create({
      data: {
        userId,
        type: "BADGE_EARNED",
        title: `Achievement Unlocked: ${config.title}`,
        description: config.description
      }
    })
  }

  return updatedAchievement
}

export async function grantAchievementRewards(userId: string, config: AchievementConfig) {
  // Grant points
  if (config.rewards.points) {
    await db.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: config.rewards.points
        }
      }
    })
  }

  // Unlock borders
  if (config.rewards.borderUnlocks) {
    await Promise.all(
      config.rewards.borderUnlocks.map(borderName =>
        db.profileBorder.upsert({
          where: {
            userId_borderName: {
              userId,
              borderName
            }
          },
          update: {
            isUnlocked: true,
            unlockedAt: new Date()
          },
          create: {
            userId,
            borderName,
            imageUrl: `/borders/${borderName}.svg`,
            isUnlocked: true,
            unlockedAt: new Date()
          }
        })
      )
    )
  }

  // Grant badges (could be implemented later)
  if (config.rewards.badges) {
    // TODO: Implement badge system
  }
}

export async function getUserAchievements(userId: string) {
  return await db.achievement.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  })
}

export async function getUserUnlockedBorders(userId: string) {
  const unlockedBorders = await db.profileBorder.findMany({
    where: {
      userId,
      isUnlocked: true
    },
    orderBy: { unlockedAt: 'asc' }
  })

  // Always include default border
  const hasDefault = unlockedBorders.some(b => b.borderName === "default")
  if (!hasDefault) {
    await db.profileBorder.upsert({
      where: {
        userId_borderName: {
          userId,
          borderName: "default"
        }
      },
      update: {},
      create: {
        userId,
        borderName: "default",
        imageUrl: "/borders/default.svg",
        isUnlocked: true,
        unlockedAt: new Date()
      }
    })
  }

  return unlockedBorders
}