#!/usr/bin/env node

/**
 * Script to check and update user roles
 * Run with: node scripts/check-user-role.js
 */

const readline = require('readline')
const mysql = require('mysql2/promise')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function checkAndUpdateUserRole() {
  console.log('🔍 Checking user roles in database...')

  try {
    // Connect to database using the same credentials as .env
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    })

    console.log('✅ Connected to database')

    // Get all users
    const [users] = await connection.execute('SELECT id, email, name, role FROM user')

    if (users.length === 0) {
      console.log('❌ No users found in database')
      return
    }

    console.log('\n📋 Current users:')
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'No name'} (${user.email}) - Role: ${user.role}`)
    })

    // Ask which user to update
    rl.question('\nEnter the number of the user to make admin (or press Enter to skip): ', async (answer) => {
      if (answer && !isNaN(answer)) {
        const userIndex = parseInt(answer) - 1
        if (userIndex >= 0 && userIndex < users.length) {
          const userToUpdate = users[userIndex]

          await connection.execute(
            'UPDATE user SET role = ? WHERE id = ?',
            ['ADMIN', userToUpdate.id]
          )

          console.log(`✅ Updated ${userToUpdate.email} to ADMIN role`)
        } else {
          console.log('❌ Invalid user number')
        }
      } else {
        console.log('⏭️  Skipping role update')
      }

      await connection.end()
      rl.close()
      process.exit(0)
    })

  } catch (error) {
    console.error('❌ Database error:', error.message)
    rl.close()
    process.exit(1)
  }
}

function main() {
  console.log('👤 User Role Check Script')
  console.log('==========================')
  console.log('This script will check user roles and can update a user to admin.')
  console.log('')

  checkAndUpdateUserRole()
}

if (require.main === module) {
  main()
}