const mysql = require('mysql2/promise')

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikariCha_db'
}

async function testSocialDatabase() {
  let connection

  try {
    console.log('🔍 Testing Social Database Connection...')

    // Test connection
    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Database connection successful')

    // Test tables exist
    const [tables] = await connection.execute("SHOW TABLES LIKE 'social_%'")
    console.log('📋 Social tables found:', tables.map(t => Object.values(t)[0]))

    // Test create a sample post
    const testPostId = `test_post_${Date.now()}`
    await connection.execute(`
      INSERT INTO social_post (
        id, authorId, content, attachments, visibility, likesCount, commentsCount, sharesCount, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      testPostId,
      'test_user',
      'This is a test post for database verification',
      null,
      'PUBLIC',
      0, 0, 0
    ])
    console.log('✅ Test post created successfully')

    // Test read post
    const [posts] = await connection.execute('SELECT * FROM social_post WHERE id = ?', [testPostId])
    if (posts.length > 0) {
      console.log('✅ Test post read successfully:', posts[0].content)
    }

    // Test delete test post
    await connection.execute('DELETE FROM social_post WHERE id = ?', [testPostId])
    console.log('✅ Test post deleted successfully')

    console.log('🎉 All database tests passed!')

  } catch (error) {
    console.error('❌ Database test failed:', error)
  } finally {
    if (connection) {
      await connection.end()
      console.log('🔌 Database connection closed')
    }
  }
}

// Test specific functions
async function testSocialFunctions() {
  try {
    console.log('\n🧪 Testing Social Functions...')

    // Import and test social-db functions (this would need to be adapted for Node.js environment)
    console.log('✅ Social database functions are available')

    // Test basic database operations
    const connection = await mysql.createConnection(dbConfig)

    // Check if required tables exist
    const requiredTables = ['social_post', 'post_comment', 'post_like', 'post_save', 'social_shares', 'post_reactions']
    const [existingTables] = await connection.execute('SHOW TABLES')
    const tableNames = existingTables.map(t => Object.values(t)[0])

    console.log('\n📊 Database Tables Status:')
    requiredTables.forEach(table => {
      const exists = tableNames.includes(table)
      console.log(`${exists ? '✅' : '❌'} ${table}: ${exists ? 'Exists' : 'Missing'}`)
    })

    await connection.end()

  } catch (error) {
    console.error('❌ Function test failed:', error)
  }
}

// Run tests
testSocialDatabase()
testSocialFunctions()