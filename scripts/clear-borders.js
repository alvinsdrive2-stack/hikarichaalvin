#!/usr/bin/env node

/**
 * Script to clear all borders from database for testing
 * Run with: node scripts/clear-borders.js
 */

const mysql = require('mysql2/promise')

async function clearBorders() {
  console.log('🗑️ Clearing all borders from database...')

  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    })

    // Clear borderunlock table first (due to foreign key constraint)
    await conn.execute('DELETE FROM borderunlock')
    console.log('✅ Cleared borderunlock table')

    // Clear border table
    const [result] = await conn.execute('DELETE FROM border')
    console.log(`✅ Cleared ${result.affectedRows} borders from database`)

    await conn.end()
    console.log('🎉 Database cleared successfully!')

  } catch (error) {
    console.error('❌ Error clearing database:', error)
  }
}

function main() {
  console.log('🚀 Clear Borders Script')
  console.log('======================')
  console.log('This script will remove ALL borders from the database.')
  console.log('')

  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question('Are you sure you want to continue? This will delete ALL borders. (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      clearBorders().finally(() => {
        rl.close()
        process.exit(0)
      })
    } else {
      console.log('❌ Operation cancelled.')
      rl.close()
      process.exit(0)
    }
  })
}

if (require.main === module) {
  main()
}

module.exports = { clearBorders }