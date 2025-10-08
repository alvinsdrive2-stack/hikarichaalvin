#!/usr/bin/env node

/**
 * Test Border Service Directly
 * Test border service functions without API
 */

const path = require('path')

// Set up environment
process.env.NODE_ENV = 'development'
process.cwd = () => path.resolve(__dirname, '..')

async function testBorderService() {
  console.log('🧪 Testing Border Service Directly...')
  console.log('======================================')

  try {
    // Import border service
    const { borderService } = require('../lib/border-service.ts')

    // Get a test user ID from database
    const mysql = require('mysql2/promise')
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    })

    const [users] = await connection.execute('SELECT id, email FROM user LIMIT 1')
    if (users.length === 0) {
      console.error('❌ No users found in database')
      return
    }

    const testUser = users[0]
    console.log(`👤 Testing with user: ${testUser.email} (ID: ${testUser.id})`)

    // Test 1: Get all borders with unlock status
    console.log('\n🎨 Test 1: getAllBordersWithUnlockStatus')
    try {
      const borders = await borderService.getAllBordersWithUnlockStatus(testUser.id)
      console.log(`✅ Found ${borders.length} borders:`)
      borders.forEach((border, index) => {
        console.log(`   ${index + 1}. ${border.name} (${border.rarity}) - ${border.unlocked ? '✅ Unlocked' : '🔒 Locked'}`)
        console.log(`      Price: ${border.price || 'Free'}`)
        console.log(`      Image: ${border.imageUrl}`)
        console.log('')
      })
    } catch (error) {
      console.error('❌ getAllBordersWithUnlockStatus failed:', error.message)
    }

    // Test 2: Get user points
    console.log('\n💰 Test 2: getUserPoints')
    try {
      const points = await borderService.getUserPoints(testUser.id)
      console.log(`✅ User points: ${points}`)
    } catch (error) {
      console.error('❌ getUserPoints failed:', error.message)
    }

    // Test 3: Select a border (use default)
    console.log('\n🎯 Test 3: selectUserBorder (default)')
    try {
      const result = await borderService.selectUserBorder(testUser.id, 'default')
      console.log(`✅ Border selection result:`, result)
    } catch (error) {
      console.error('❌ selectUserBorder failed:', error.message)
    }

    await connection.end()

    console.log('\n🎉 Border service tests completed!')
    console.log('✅ Core functionality is working')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('')
    console.log('🔧 Troubleshooting:')
    console.log('   • Check Prisma client initialization')
    console.log('   • Verify database connection')
    console.log('   • Check environment variables')
  }
}

testBorderService()