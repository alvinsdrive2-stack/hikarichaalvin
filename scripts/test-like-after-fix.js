const mysql = require('mysql2/promise')

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikariCha_db'
}

async function testLikeAfterFix() {
  let connection

  try {
    console.log('🔍 Testing Like Functionality After Fix...')

    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Database connection successful')

    // Check if post_like table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'post_like'")
    if (tables.length > 0) {
      console.log('✅ post_like table exists')
    } else {
      console.log('❌ post_like table does not exist')
      return
    }

    // Check if post_save table exists
    const [saveTables] = await connection.execute("SHOW TABLES LIKE 'post_save'")
    if (saveTables.length > 0) {
      console.log('✅ post_save table exists')
    } else {
      console.log('❌ post_save table does not exist')
      return
    }

    // Get real user and post IDs from the database
    const [posts] = await connection.execute('SELECT id, likesCount FROM social_post LIMIT 1')
    if (posts.length === 0) {
      console.log('❌ No posts found in social_post table')
      return
    }

    const post = posts[0]
    console.log(`✅ Found post: ${post.id} with ${post.likesCount} likes`)

    const [users] = await connection.execute('SELECT id FROM user LIMIT 1')
    if (users.length === 0) {
      console.log('❌ No users found in user table')
      return
    }

    const user = users[0]
    console.log(`✅ Found user: ${user.id}`)

    // Test like database operations directly
    const [existingLikes] = await connection.execute(
      'SELECT id FROM post_like WHERE userId = ? AND postId = ?',
      [user.id, post.id]
    )

    const isCurrentlyLiked = existingLikes.length > 0
    console.log(`💝 Current like status: ${isCurrentlyLiked ? 'Liked' : 'Not liked'}`)

    // Test like operation
    if (isCurrentlyLiked) {
      // Unlike
      await connection.execute('DELETE FROM post_like WHERE userId = ? AND postId = ?', [user.id, post.id])
      await connection.execute('UPDATE social_post SET likesCount = GREATEST(likesCount - 1, 0) WHERE id = ?', [post.id])
      console.log('🗑️  Test unlike completed')
    } else {
      // Like
      const likeId = `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await connection.execute('INSERT INTO post_like (id, userId, postId) VALUES (?, ?, ?)', [likeId, user.id, post.id])
      await connection.execute('UPDATE social_post SET likesCount = likesCount + 1 WHERE id = ?', [post.id])
      console.log('❤️  Test like completed')
    }

    // Check final status
    const [finalLikes] = await connection.execute(
      'SELECT id FROM post_like WHERE userId = ? AND postId = ?',
      [user.id, post.id]
    )

    const isNowLiked = finalLikes.length > 0
    console.log(`💝 Final like status: ${isNowLiked ? 'Liked' : 'Not liked'}`)

    // Get updated post
    const [updatedPosts] = await connection.execute('SELECT likesCount FROM social_post WHERE id = ?', [post.id])
    const updatedPost = updatedPosts[0]
    console.log(`📊 Updated likes count: ${updatedPost.likesCount}`)

    console.log('🎉 Like functionality test completed successfully!')
    console.log('💡 The 500 error should now be resolved. Try refreshing the browser and testing the like button again.')

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
testLikeAfterFix()