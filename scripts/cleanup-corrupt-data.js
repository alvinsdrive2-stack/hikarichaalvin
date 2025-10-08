#!/usr/bin/env node

/**
 * Clean up corrupt datetime data in database
 * This will fix invalid datetime values that cause Prisma errors
 */

const mysql = require('mysql2/promise')

async function cleanupCorruptData() {
  console.log('🧹 Cleaning up corrupt database data...')

  let connection
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    })

    console.log('✅ Connected to database')

    // Check for corrupt data in border table
    console.log('\n🔍 Checking border table...')
    const [borderRows] = await connection.execute(`
      SELECT id, name, createdAt, updatedAt
      FROM border
      WHERE createdAt = '0000-00-00 00:00:00' OR updatedAt = '0000-00-00 00:00:00'
    `)

    if (borderRows.length > 0) {
      console.log(`❌ Found ${borderRows.length} borders with corrupt timestamps`)

      for (const row of borderRows) {
        console.log(`   - Fixing border: ${row.name} (ID: ${row.id})`)

        await connection.execute(`
          UPDATE border
          SET createdAt = NOW(), updatedAt = NOW()
          WHERE id = ?
        `, [row.id])
      }

      console.log('✅ Fixed border timestamps')
    } else {
      console.log('✅ No corrupt border timestamps found')
    }

    // Check for corrupt data in user table
    console.log('\n🔍 Checking user table...')
    const [userRows] = await connection.execute(`
      SELECT id, name, createdAt, updatedAt
      FROM user
      WHERE createdAt = '0000-00-00 00:00:00' OR updatedAt = '0000-00-00 00:00:00'
    `)

    if (userRows.length > 0) {
      console.log(`❌ Found ${userRows.length} users with corrupt timestamps`)

      for (const row of userRows) {
        console.log(`   - Fixing user: ${row.name} (ID: ${row.id})`)

        await connection.execute(`
          UPDATE user
          SET createdAt = NOW(), updatedAt = NOW()
          WHERE id = ?
        `, [row.id])
      }

      console.log('✅ Fixed user timestamps')
    } else {
      console.log('✅ No corrupt user timestamps found')
    }

    // Check for corrupt data in borderunlock table
    console.log('\n🔍 Checking borderunlock table...')
    const [unlockRows] = await connection.execute(`
      SELECT id, unlockedAt
      FROM borderunlock
      WHERE unlockedAt = '0000-00-00 00:00:00'
    `)

    if (unlockRows.length > 0) {
      console.log(`❌ Found ${unlockRows.length} border unlocks with corrupt timestamps`)

      for (const row of unlockRows) {
        console.log(`   - Fixing border unlock: ${row.id}`)

        await connection.execute(`
          UPDATE borderunlock
          SET unlockedAt = NOW()
          WHERE id = ?
        `, [row.id])
      }

      console.log('✅ Fixed border unlock timestamps')
    } else {
      console.log('✅ No corrupt border unlock timestamps found')
    }

    console.log('\n🎉 Database cleanup completed!')
    console.log('✅ All corrupt datetime values have been fixed')

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

cleanupCorruptData()