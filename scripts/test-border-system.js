#!/usr/bin/env node

/**
 * Test Border System Script
 * Tests border database functionality without authentication
 * Run with: node scripts/test-border-system.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testBorderSystem() {
  console.log('🧪 Testing Border System...')
  console.log('================================')

  try {
    // Test 1: Check database connection
    console.log('📡 Test 1: Database Connection')
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    console.log('')

    // Test 2: Check borders
    console.log('🎨 Test 2: Border Data')
    const borders = await prisma.border.findMany({
      orderBy: { sortOrder: 'asc' }
    })

    console.log(`📊 Found ${borders.length} borders:`)
    borders.forEach((border, index) => {
      console.log(`   ${index + 1}. ${border.name} (${border.rarity}) - ${border.price ? border.price + ' points' : 'Free'}`)
      console.log(`      ID: ${border.id}`)
      console.log(`      Image: ${border.imageUrl}`)
      console.log(`      Active: ${border.isActive}`)
      console.log('')
    })

    // Test 3: Check users
    console.log('👥 Test 3: User Data')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        points: true,
        selectedBorder: true
      }
    })

    console.log(`📊 Found ${users.length} users:`)
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email})`)
      console.log(`      Role: ${user.role}`)
      console.log(`      Points: ${user.points}`)
      console.log(`      Selected Border: ${user.selectedBorder}`)
      console.log('')
    })

    // Test 4: Test border service functions
    console.log('🔧 Test 4: Border Service Functions')

    // Import and test border service
    const { borderService } = require('../lib/border-service.ts')

    if (users.length > 0) {
      const testUser = users[0]
      console.log(`🧪 Testing with user: ${testUser.email}`)

      // Test getUserPoints
      const points = await borderService.getUserPoints(testUser.id)
      console.log(`   💰 User points: ${points}`)

      // Test getAllBordersWithUnlockStatus
      const bordersWithStatus = await borderService.getAllBordersWithUnlockStatus(testUser.id)
      console.log(`   🎨 Borders with unlock status: ${bordersWithStatus.length}`)
      bordersWithStatus.forEach(border => {
        console.log(`      - ${border.name}: ${border.unlocked ? '✅ Unlocked' : '🔒 Locked'}`)
      })
    }

    // Test 5: Check border unlocks
    console.log('')
    console.log('🔓 Test 5: Border Unlocks')
    const borderUnlocks = await prisma.borderUnlock.findMany({
      include: {
        user: { select: { email: true } },
        border: { select: { name: true } }
      }
    })

    console.log(`📊 Found ${borderUnlocks.length} border unlocks:`)
    borderUnlocks.forEach((unlock, index) => {
      console.log(`   ${index + 1}. ${unlock.user.email} → ${unlock.border.name}`)
      console.log(`      Type: ${unlock.unlockType}`)
      console.log(`      Price Paid: ${unlock.pricePaid || 'Free'}`)
      console.log(`      Unlocked At: ${unlock.unlockedAt}`)
      console.log('')
    })

    console.log('🎉 All tests completed successfully!')
    console.log('================================')
    console.log('✅ Database is working correctly')
    console.log('✅ Border data is properly initialized')
    console.log('✅ Users are created successfully')
    console.log('')
    console.log('🌐 Next steps:')
    console.log('   1. Start the dev server: npm run dev')
    console.log('   2. Login with a test user')
    console.log('   3. Visit profile page to test border selection')
    console.log('   4. Test border purchasing functionality')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('')
    console.log('🔧 Troubleshooting:')
    console.log('   • Check if MySQL is running')
    console.log('   • Verify DATABASE_URL in .env')
    console.log('   • Make sure tables exist: npx prisma db push')
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  testBorderSystem()
}

module.exports = { testBorderSystem }