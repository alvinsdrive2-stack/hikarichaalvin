#!/usr/bin/env node

/**
 * Create Admin User Script
 * Creates an admin user for border management
 * Run with: node scripts/create-admin-user.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const defaultAdminUser = {
  id: `user_${Date.now()}_admin`,
  email: 'admin@hikaricha.com',
  name: 'Admin HikariCha',
  role: 'ADMIN',
  points: 999999, // Lots of points for testing
  selectedBorder: 'default',
  createdAt: new Date(),
  updatedAt: new Date()
}

async function createAdminUser() {
  console.log('👑 Creating admin user...')

  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { email: defaultAdminUser.email }
    })

    if (existingAdmin) {
      console.log(`✅ Admin user already exists: ${existingAdmin.email}`)

      // Update to admin role if not already
      if (existingAdmin.role !== 'ADMIN') {
        await prisma.user.update({
          where: { id: existingAdmin.id },
          data: { role: 'ADMIN', points: 999999 }
        })
        console.log('🔒 Updated user role to ADMIN')
      }

      return existingAdmin
    }

    // Create new admin user
    const adminUser = await prisma.user.create({
      data: defaultAdminUser
    })

    console.log(`✅ Admin user created: ${adminUser.email}`)
    console.log(`📧 Email: ${adminUser.email}`)
    console.log(`👤 Name: ${adminUser.name}`)
    console.log(`🔑 Role: ${adminUser.role}`)
    console.log(`💰 Points: ${adminUser.points}`)

    return adminUser

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Add some test border unlocks for the admin
async function addTestBorderUnlocks(userId) {
  console.log('🎨 Adding test border unlocks...')

  try {
    const borders = await prisma.border.findMany({
      select: { id: true, name: true }
    })

    for (const border of borders) {
      // Unlock all borders for admin (for testing)
      const existingUnlock = await prisma.borderUnlock.findFirst({
        where: {
          userId,
          borderId: border.id
        }
      })

      if (!existingUnlock) {
        await prisma.borderUnlock.create({
          data: {
            userId,
            borderId: border.id,
            unlockType: 'ADMIN',
            pricePaid: 0
          }
        })
        console.log(`✅ Unlocked border: ${border.name}`)
      }
    }

    console.log('✅ All borders unlocked for admin user!')

  } catch (error) {
    console.error('❌ Error adding test border unlocks:', error)
  }
}

async function main() {
  try {
    const adminUser = await createAdminUser()
    await addTestBorderUnlocks(adminUser.id)

    console.log('')
    console.log('🎉 Admin setup complete!')
    console.log('====================================')
    console.log('📝 Login credentials:')
    console.log(`📧 Email: ${adminUser.email}`)
    console.log('🔑 Password: [Set via your auth system]')
    console.log('')
    console.log('💡 This user can now:')
    console.log('   • Access all border management features')
    console.log('   • Initialize borders via API')
    console.log('   • Test border purchasing and selection')
    console.log('   • Manage other users\' borders')

  } catch (error) {
    console.error('❌ Admin setup failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { createAdminUser, addTestBorderUnlocks }