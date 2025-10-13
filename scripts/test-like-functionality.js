const mysql = require('mysql2/promise')

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikariCha_db'
}

async function testLikeFunctionality() {
  let connection

  try {
    console.log('🔍 Testing Like Functionality...')

    // Test connection
    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Database connection successful')

    // Test if post_like table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'post_like'")
    if (tables.length > 0) {
      console.log('✅ post_like table exists')
    } else {
      console.log('❌ post_like table does not exist')
      return
    }

    // Check table structure
    const [columns] = await connection.execute("DESCRIBE post_like")
    console.log('📋 post_like table structure:')
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type}`)
    })

    // Get real user and post IDs from the database
    const [posts] = await connection.execute('SELECT id FROM social_post LIMIT 1')
    if (posts.length === 0) {
      console.log('❌ No posts found in social_post table. Cannot test like functionality without existing posts.')
      return
    }
    var realPostId = posts[0].id
    console.log(`✅ Found existing post: ${realPostId}`)

    const [users] = await connection.execute('SELECT id FROM user LIMIT 1')
    if (users.length === 0) {
      console.log('❌ No users found in user table. Cannot test like functionality without existing users.')
      return
    }
    const testUserId = users[0].id
    console.log(`✅ Found existing user: ${testUserId}`)

    // Clean up any existing test data
    await connection.execute('DELETE FROM post_like WHERE userId = ? AND postId = ?', [testUserId, realPostId])

    // Test inserting a like
    await connection.execute('INSERT INTO post_like (userId, postId) VALUES (?, ?)', [testUserId, realPostId])
    console.log('✅ Successfully inserted test like')

    // Test checking if like exists
    const [likes] = await connection.execute('SELECT id FROM post_like WHERE userId = ? AND postId = ?', [testUserId, realPostId])
    if (likes.length > 0) {
      console.log('✅ Like exists in database')
    } else {
      console.log('❌ Like not found in database')
    }

    // Test removing a like
    await connection.execute('DELETE FROM post_like WHERE userId = ? AND postId = ?', [testUserId, realPostId])
    console.log('✅ Successfully removed test like')

    // Verify like was removed
    const [likesAfterDelete] = await connection.execute('SELECT id FROM post_like WHERE userId = ? AND postId = ?', [testUserId, realPostId])
    if (likesAfterDelete.length === 0) {
      console.log('✅ Like successfully removed from database')
    } else {
      console.log('❌ Like still exists in database after delete')
    }

    
    console.log('🎉 All like functionality tests passed!')

  } catch (error) {
    console.error('❌ Like functionality test failed:', error)
  } finally {
    if (connection) {
      await connection.end()
      console.log('🔌 Database connection closed')
    }
  }
}

// Run the test
testLikeFunctionality()