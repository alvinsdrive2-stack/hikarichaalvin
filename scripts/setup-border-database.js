#!/usr/bin/env node

/**
 * Complete Border Database Setup Script
 * This will safely reset and initialize the border system
 * Run with: node scripts/setup-border-database.js
 */

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

async function main() {
  console.log('🚨 BORDER DATABASE SETUP SCRIPT 🚨')
  console.log('=====================================')
  console.log('⚠️  WARNING: This will RESET ALL DATA in your border tables!')
  console.log('⚠️  This is intended for DEVELOPMENT DATABASE ONLY!')
  console.log('')

  const confirm = await askQuestion('❓ Are you sure you want to continue? (type "RESET DATABASE" to confirm): ')

  if (confirm !== 'RESET DATABASE') {
    console.log('❌ Operation cancelled.')
    rl.close()
    process.exit(0)
  }

  console.log('\n🔄 Starting border database setup...\n')

  try {
    // Step 1: Reset database schema
    console.log('📋 Step 1: Resetting database schema...')
    const { execSync } = require('child_process')

    console.log('   Running: npx prisma db push --force-reset')
    execSync('npx prisma db push --force-reset', { stdio: 'inherit', cwd: process.cwd() })

    console.log('✅ Database schema reset successfully!')
    console.log('')

    // Step 2: Generate Prisma client
    console.log('📦 Step 2: Generating Prisma client...')
    execSync('npx prisma generate', { stdio: 'inherit', cwd: process.cwd() })
    console.log('✅ Prisma client generated!')
    console.log('')

    // Step 3: Initialize border data
    console.log('🎨 Step 3: Initializing border data...')
    execSync('node scripts/init-borders-direct.js', { stdio: 'inherit', cwd: process.cwd() })
    console.log('✅ Border data initialized!')
    console.log('')

    // Step 4: Create admin user
    console.log('👑 Step 4: Creating admin user...')
    execSync('node scripts/create-admin-user.js', { stdio: 'inherit', cwd: process.cwd() })
    console.log('✅ Admin user created!')
    console.log('')

    console.log('🎉 BORDER DATABASE SETUP COMPLETE!')
    console.log('====================================')
    console.log('✅ Database is ready for border management')
    console.log('✅ Default borders have been initialized')
    console.log('✅ Admin user has been created')
    console.log('')
    console.log('📝 Next steps:')
    console.log('   1. Start your development server: npm run dev')
    console.log('   2. Login with admin credentials')
    console.log('   3. Access border management via API')
    console.log('   4. Add/edit borders through database or API')
    console.log('')
    console.log('🔗 Useful endpoints:')
    console.log('   - GET  /api/borders           - List all borders')
    console.log('   - POST /api/borders/purchase  - Purchase border')
    console.log('   - POST /api/borders/select    - Select border')
    console.log('   - GET  /api/points            - Get user points')
    console.log('   - POST /api/init/borders      - Initialize borders (admin)')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.log('')
    console.log('🔧 Troubleshooting:')
    console.log('   • Make sure MySQL is running')
    console.log('   • Check your DATABASE_URL in .env')
    console.log('   • Ensure database exists and is accessible')
  }

  rl.close()
}

if (require.main === module) {
  main()
}

module.exports = { main }