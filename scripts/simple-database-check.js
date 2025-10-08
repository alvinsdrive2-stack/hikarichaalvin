#!/usr/bin/env node

/**
 * Simple Database Check
 * Quick verification that database setup worked
 */

async function quickCheck() {
  try {
    const mysql = require('mysql2/promise')

    // Database connection from .env
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    })

    console.log('✅ MySQL connected successfully!')

    // Check if border table exists and has data
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM border')
    console.log(`📊 Border table has ${rows[0].count} rows`)

    // Show some border data
    const [borders] = await connection.execute('SELECT name, rarity, price, imageUrl FROM border LIMIT 5')
    console.log('\n🎨 Sample borders:')
    borders.forEach((border, index) => {
      console.log(`   ${index + 1}. ${border.name} (${border.rarity}) - ${border.price ? border.price + ' points' : 'Free'}`)
      console.log(`      Image: ${border.imageUrl}`)
    })

    // Check users
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM user')
    console.log(`\n👥 User table has ${users[0].count} rows`)

    // Show user data
    const [userRows] = await connection.execute('SELECT email, name, role, points FROM user LIMIT 3')
    console.log('\n👤 Sample users:')
    userRows.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email})`)
      console.log(`      Role: ${user.role}, Points: ${user.points}`)
    })

    await connection.end()

    console.log('\n🎉 Database setup is working!')
    console.log('✅ You can now use the border system in your app')

  } catch (error) {
    console.error('❌ Database check failed:', error.message)

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n🔧 Fix: Check MySQL credentials')
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n🔧 Fix: Create database "hikaricha_db"')
    } else {
      console.log('\n🔧 Check if MySQL is running and accessible')
    }
  }
}

quickCheck()