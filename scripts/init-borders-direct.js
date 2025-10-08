#!/usr/bin/env node

/**
 * Direct border initialization script that doesn't require API calls
 * Run with: node scripts/init-borders-direct.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Function to generate border data with proper timestamps
const createBorderData = (name, description, price, rarity, sortOrder) => {
  return {
    id: `border_${Date.now()}_${name.toLowerCase()}`,
    name,
    description,
    imageUrl: `/borders/${name.toLowerCase()}.svg`,
    price,
    rarity,
    isActive: true,
    sortOrder,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

const defaultBorders = [
  createBorderData('default', 'Border default untuk semua user', null, 'COMMON', 0),
  createBorderData('Bronze', 'Border bronze - achievement: FIRST_FORUM_POST', null, 'COMMON', 10),
  createBorderData('Silver', 'Border silver - achievement: FORUM_REGULAR', null, 'RARE', 20),
  createBorderData('Gold', 'Border gold - achievement: RECIPE_CREATOR', 500, 'EPIC', 30),
  createBorderData('Crystal', 'Border crystal - achievement: SOCIAL_BUTTERFLY', 1000, 'EPIC', 40),
  createBorderData('Diamond', 'Border diamond - achievement: BORDER_COLLECTOR', 2000, 'LEGENDARY', 50)
]

async function initializeBorders() {
  console.log('🎨 Initializing default borders directly in database...')

  try {
    for (const borderData of defaultBorders) {
      try {
        // Always create new borders with unique IDs
        await prisma.border.create({
          data: borderData
        })
        console.log(`✅ Border "${borderData.name}" created with ID: ${borderData.id}`)
      } catch (error) {
        // If border with this name already exists, skip
        if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
          console.log(`⚠️  Border "${borderData.name}" already exists, skipping...`)
        } else {
          console.error(`❌ Error creating border "${borderData.name}":`, error.message)
        }
      }
    }

    console.log('\n✅ All default borders have been initialized successfully!')

    // Verify borders were created
    const totalBorders = await prisma.border.count()
    console.log(`📊 Total borders in database: ${totalBorders}`)

  } catch (error) {
    console.error('❌ Error initializing borders:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the initialization
initializeBorders()