import { prisma } from "./prisma"
import { AchievementType, BorderRarity } from "@prisma/client"
import { borderService } from "./border-service"

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
      borderUnlocks: ["Bronze"]
    }
  },
  {
    type: "FORUM_REGULAR",
    title: "Pembicara Aktif",
    description: "Buat 10 postingan forum",
    targetValue: 10,
    rewards: {
      points: 50,
      borderUnlocks: ["Silver"]
    }
  },
  {
    type: "RECIPE_CREATOR",
    title: "Koki Creative",
    description: "Buat 5 resep baru",
    targetValue: 5,
    rewards: {
      points: 30,
      borderUnlocks: ["Gold"]
    }
  },
  {
    type: "SOCIAL_BUTTERFLY",
    title: "Pendengar Baik",
    description: "Buat 20 komentar di forum",
    targetValue: 20,
    rewards: {
      points: 40,
      borderUnlocks: ["Crystal"]
    }
  },
  {
    type: "EARLY_ADOPTER",
    title: "Early Adopter",
    description: "Bergabung dalam minggu pertama",
    targetValue: 1,
    rewards: {
      points: 25,
      borderUnlocks: ["Bronze"]
    }
  },
  {
    type: "PURCHASE_MASTER",
    title: "Pembeli Setia",
    description: "Lakukan 5 pembelian",
    targetValue: 5,
    rewards: {
      points: 75,
      borderUnlocks: ["Gold"]
    }
  },
  {
    type: "BORDER_COLLECTOR",
    title: "Border Collector",
    description: "Kumpulkan semua border",
    targetValue: 6,
    rewards: {
      points: 200,
      borderUnlocks: ["Diamond"]
    }
  },
  {
    type: "POINTS_COLLECTOR",
    title: "Poin Hunter",
    description: "Kumpulkan 1000 poin",
    targetValue: 1000,
    rewards: {
      points: 100,
      borderUnlocks: ["Diamond"]
    }
  },
  {
    type: "DAILY_VISITOR",
    title: "Daily Visitor",
    description: "Login 7 hari berturut-turut",
    targetValue: 7,
    rewards: {
      points: 50,
      borderUnlocks: ["Silver"]
    }
  },
  {
    type: "RECIPE_MASTER",
    title: "Recipe Master",
    description: "Buat 25 resep",
    targetValue: 25,
    rewards: {
      points: 150,
      borderUnlocks: ["Crystal"]
    }
  },
  {
    type: "FORUM_EXPERT",
    title: "Forum Expert",
    description: "Buat 100 postingan forum",
    targetValue: 100,
    rewards: {
      points: 300,
      borderUnlocks: ["Diamond"]
    }
  },
  {
    type: "COMMENTATOR_PRO",
    title: "Commentator Pro",
    description: "Buat 100 komentar",
    targetValue: 100,
    rewards: {
      points: 200,
      borderUnlocks: ["Crystal"]
    }
  },
  {
    type: "ACTIVE_MEMBER",
    title: "Active Member",
    description: "Aktif selama 30 hari",
    targetValue: 30,
    rewards: {
      points: 100,
      borderUnlocks: ["Gold"]
    }
  }
]

export async function initializeAchievementsForUser(userId: string) {
  const achievements = await Promise.all(
    ACHIEVEMENTS_CONFIG.map(async (config) => {
      return await prisma.achievement.upsert({
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

  const achievement = await prisma.achievement.findUnique({
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

  const updatedAchievement = await prisma.achievement.update({
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
    await prisma.activity.create({
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
  // Grant points using border service
  if (config.rewards.points) {
    await borderService.addPoints({
      userId,
      type: 'EARNED',
      amount: config.rewards.points,
      description: `Achievement reward: ${config.title}`,
      metadata: {
        achievementType: config.type,
        achievementTitle: config.title
      }
    })
  }

  // Unlock borders using border service
  if (config.rewards.borderUnlocks) {
    await Promise.all(
      config.rewards.borderUnlocks.map(async (borderName) => {
        // Find the border in database
        const border = await prisma.border.findUnique({
          where: { name: borderName }
        })

        if (border) {
          await borderService.unlockBorderViaAchievement(userId, border.id, config.type)
        }
      })
    )
  }

  // Grant badges (could be implemented later)
  if (config.rewards.badges) {
    // TODO: Implement badge system
  }
}

export async function getUserAchievements(userId: string) {
  return await prisma.achievement.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  })
}

export async function getUserUnlockedBorders(userId: string) {
  // Use border service instead of old ProfileBorder model
  const borders = await borderService.getAllBordersWithUnlockStatus(userId)

  // Return only unlocked borders
  return borders.filter(border => border.unlocked)
}

export async function trackActivity(userId: string, activityType: string, increment: number = 1) {
  // Map activity types to achievement types
  const activityToAchievementMap: { [key: string]: AchievementType } = {
    'FORUM_POST': 'FORUM_REGULAR',
    'FORUM_COMMENT': 'SOCIAL_BUTTERFLY',
    'RECIPE_CREATED': 'RECIPE_CREATOR',
    'PROFILE_UPDATE': 'ACTIVE_MEMBER',
    'PURCHASE': 'PURCHASE_MASTER'
  }

  const achievementType = activityToAchievementMap[activityType]
  if (achievementType) {
    await updateAchievementProgress(userId, achievementType, increment)
  }

  // Track border collector achievement
  if (activityType === 'BADGE_EARNED') {
    const userBorders = await getUserUnlockedBorders(userId)
    await updateAchievementProgress(userId, 'BORDER_COLLECTOR', userBorders.length)
  }

  // Track points collector achievement
  if (activityType === 'EARNED') {
    const userPoints = await borderService.getUserPoints(userId)
    await updateAchievementProgress(userId, 'POINTS_COLLECTOR', userPoints)
  }
}