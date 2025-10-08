#!/usr/bin/env node

/**
 * Create Demo User Script
 * Creates the demo user for testing
 * Run with: node scripts/create-demo-user.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const demoUser = {
  email: 'demo@test.com',
  name: 'Demo User',
  role: 'USER',
  points: 1000, // Some points for testing
  selectedBorder: 'default'
}

async function createDemoUser() {
  console.log('👤 Creating demo user (demo@test.com / 123123)...')

  try {
    // Check if demo user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: demoUser.email }
    })

    if (existingUser) {
      console.log(`✅ Demo user already exists: ${existingUser.email}`)
      return existingUser
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('123123', 12)

    // Create new demo user
    const newUser = await prisma.user.create({
      data: {
        ...demoUser,
        password: hashedPassword,
        id: `user_${Date.now()}_demo`,
        updatedAt: new Date()
      }
    })

    console.log(`✅ Demo user created: ${newUser.email}`)
    console.log(`📧 Email: ${newUser.email}`)
    console.log(`👤 Name: ${newUser.name}`)
    console.log(`🔑 Role: ${newUser.role}`)
    console.log(`💰 Points: ${newUser.points}`)
    console.log(`🔐 Password: 123123`)

    return newUser

  } catch (error) {
    console.error('❌ Error creating demo user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function main() {
  try {
    const user = await createDemoUser()
    console.log('')
    console.log('🎉 Demo user setup complete!')
    console.log('====================================')
    console.log('📝 Login credentials:')
    console.log(`📧 Email: ${user.email}`)
    console.log('🔑 Password: 123123')
    console.log('')
    console.log('💡 You can now use these credentials to test the login.')

  } catch (error) {
    console.error('❌ Demo user creation failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { createDemoUser }