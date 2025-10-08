#!/usr/bin/env node

/**
 * Unlock borders for demo user
 * Run with: node scripts/unlock-demo-borders.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function unlockDemoBorders() {
  console.log('🎨 Unlocking borders for demo user...')

  try {
    // Get demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@test.com' }
    })

    if (!demoUser) {
      console.log('❌ Demo user not found')
      return
    }

    console.log(`👤 Found demo user: ${demoUser.email} (ID: ${demoUser.id})`)

    // Get all borders
    const borders = await prisma.border.findMany({
      where: { isActive: true }
    })

    console.log(`🎨 Found ${borders.length} borders`)

    // Unlock default borders for demo user
    const bordersToUnlock = ['default', 'Bronze', 'Silver'] // Free borders

    for (const border of borders) {
      if (bordersToUnlock.includes(border.name)) {
        try {
          await prisma.borderUnlock.create({
            data: {
              userId: demoUser.id,
              borderId: border.id,
              unlockType: 'ADMIN',
              pricePaid: 0,
              unlockedAt: new Date()
            }
          })
          console.log(`✅ Unlocked border: ${border.name}`)
        } catch (error) {
          if (error.code === 'P2002') {
            console.log(`⚠️  Border "${border.name}" already unlocked`)
          } else {
            console.error(`❌ Error unlocking ${border.name}:`, error.message)
          }
        }
      }
    }

    // Give demo user some points to test purchases
    await prisma.user.update({
      where: { id: demoUser.id },
      data: { points: 1500 }
    })

    console.log('💰 Added 1500 points to demo user account')

    // Verify unlocks
    const unlockedBorders = await prisma.borderUnlock.findMany({
      where: { userId: demoUser.id },
      include: { border: true }
    })

    console.log(`📊 Demo user has unlocked ${unlockedBorders.length} borders:`)
    unlockedBorders.forEach(unlock => {
      console.log(`   • ${unlock.border.name} (${unlock.unlockType})`)
    })

    console.log('\n✅ Demo user setup complete!')

  } catch (error) {
    console.error('❌ Error setting up demo borders:', error)
  } finally {
    await prisma.$disconnect()
  }
}

unlockDemoBorders()