#!/usr/bin/env node

/**
 * Script to initialize default borders in the database
 * Run with: node scripts/init-borders.js
 */

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function initializeBorders() {
  console.log('🎨 Initializing default borders in database...')

  try {
    const response = await fetch('http://localhost:3000/api/init/borders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Success:', data.message)
    } else {
      const error = await response.json()
      console.error('❌ Error:', error.error)
    }
  } catch (error) {
    console.error('❌ Network error:', error.message)
    console.log('\n💡 Make sure the development server is running on http://localhost:3000')
  }
}

function main() {
  console.log('🚀 Border Initialization Script')
  console.log('==================================')
  console.log('This script will initialize default borders in the database.')
  console.log('Make sure your development server is running.')
  console.log('')

  rl.question('Do you want to continue? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      initializeBorders().finally(() => {
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

module.exports = { initializeBorders }