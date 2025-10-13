const mysql = require('mysql2/promise')

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikariCha_db'
}

async function checkTableStructures() {
  let connection

  try {
    console.log('🔍 Checking table structures...')

    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Database connection successful')

    // Check user table structure
    console.log('\n📋 user table structure:')
    const [userColumns] = await connection.execute('DESCRIBE user')
    userColumns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Key ? `(${col.Key})` : ''}`)
    })

    // Check social_post table structure
    console.log('\n📋 social_post table structure:')
    const [postColumns] = await connection.execute('DESCRIBE social_post')
    postColumns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Key ? `(${col.Key})` : ''}`)
    })

    // Check post_like table structure as reference
    console.log('\n📋 post_like table structure:')
    try {
      const [likeColumns] = await connection.execute('DESCRIBE post_like')
      likeColumns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Key ? `(${col.Key})` : ''}`)
      })
    } catch (error) {
      console.log('❌ post_like table does not exist')
    }

  } catch (error) {
    console.error('❌ Error checking table structures:', error)
  } finally {
    if (connection) {
      await connection.end()
      console.log('\n🔌 Database connection closed')
    }
  }
}

// Run the function
checkTableStructures()