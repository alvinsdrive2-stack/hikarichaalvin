const mysql = require('mysql2/promise')

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikariCha_db'
}

async function testLikePersistence() {
  let connection

  try {
    console.log('🔍 Testing Like Persistence...')

    // Test connection
    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Database connection successful')

    // Get a sample post and user
    const [posts] = await connection.execute('SELECT id, likesCount FROM social_post LIMIT 1')
    if (posts.length === 0) {
      console.log('❌ No posts found')
      return
    }

    const post = posts[0]
    console.log(`📋 Found post: ${post.id} with ${post.likesCount} likes`)

    const [users] = await connection.execute('SELECT id FROM user LIMIT 1')
    if (users.length === 0) {
      console.log('❌ No users found')
      return
    }

    const user = users[0]
    console.log(`👤 Found user: ${user.id}`)

    // Check current like status
    const [existingLikes] = await connection.execute(
      'SELECT id FROM post_like WHERE userId = ? AND postId = ?',
      [user.id, post.id]
    )

    const isCurrentlyLiked = existingLikes.length > 0
    console.log(`💝 Current like status: ${isCurrentlyLiked ? 'Liked' : 'Not liked'}`)

    // Test like/unlike cycle
    if (isCurrentlyLiked) {
      // Unlike
      await connection.execute('DELETE FROM post_like WHERE userId = ? AND postId = ?', [user.id, post.id])
      await connection.execute('UPDATE social_post SET likesCount = likesCount - 1 WHERE id = ?', [post.id])
      console.log('🗑️  Removed like')
    } else {
      // Like
      const likeId = `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await connection.execute('INSERT INTO post_like (id, userId, postId) VALUES (?, ?, ?)', [likeId, user.id, post.id])
      await connection.execute('UPDATE social_post SET likesCount = likesCount + 1 WHERE id = ?', [post.id])
      console.log('❤️  Added like')
    }

    // Check new status
    const [newLikes] = await connection.execute(
      'SELECT id FROM post_like WHERE userId = ? AND postId = ?',
      [user.id, post.id]
    )

    const isNowLiked = newLikes.length > 0
    console.log(`💝 New like status: ${isNowLiked ? 'Liked' : 'Not liked'}`)

    // Get updated post
    const [updatedPosts] = await connection.execute('SELECT likesCount FROM social_post WHERE id = ?', [post.id])
    const updatedPost = updatedPosts[0]
    console.log(`📊 Updated likes count: ${updatedPost.likesCount}`)

    console.log('🎉 Like persistence test completed successfully!')

  } catch (error) {
    console.error('❌ Like persistence test failed:', error)
  } finally {
    if (connection) {
      await connection.end()
      console.log('🔌 Database connection closed')
    }
  }
}

// Run the test
testLikePersistence()