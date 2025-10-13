const mysql = require('mysql2/promise')

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikariCha_db'
}

async function createPostSaveTable() {
  let connection

  try {
    console.log('🔧 Creating post_save table...')

    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Database connection successful')

    // Create post_save table (without foreign keys first)
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS post_save (
        id VARCHAR(191) PRIMARY KEY,
        userId VARCHAR(191) NOT NULL,
        postId VARCHAR(191) NOT NULL,
        createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
        UNIQUE KEY unique_user_post (userId, postId),
        INDEX idx_userId (userId),
        INDEX idx_postId (postId)
      )
    `

    await connection.execute(createTableSQL)
    console.log('✅ post_save table created successfully')

    // Verify table was created
    const [tables] = await connection.execute("SHOW TABLES LIKE 'post_save'")
    if (tables.length > 0) {
      console.log('✅ post_save table exists and is ready')
    } else {
      console.log('❌ post_save table was not created')
    }

  } catch (error) {
    console.error('❌ Error creating post_save table:', error)
  } finally {
    if (connection) {
      await connection.end()
      console.log('🔌 Database connection closed')
    }
  }
}

// Run the function
createPostSaveTable()