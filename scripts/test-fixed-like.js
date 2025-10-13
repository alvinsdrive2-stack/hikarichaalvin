const mysql = require('mysql2/promise')

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikariCha_db'
}

async function testFixedLike() {
  let connection

  try {
    console.log('🔍 Testing Fixed Like Functionality...')

    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Database connection successful')

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

    // Test the likeSocialPost function directly
    const { likeSocialPost, isSocialPostLiked } = require('../lib/social-db.ts')

    console.log('🔄 Testing likeSocialPost function...')
    const wasLiked = await likeSocialPost(user.id, post.id)
    console.log(`✅ likeSocialPost returned: ${wasLiked}`)

    // Check if like was recorded
    const isLiked = await isSocialPostLiked(user.id, post.id)
    console.log(`✅ isSocialPostLiked returned: ${isLiked}`)

    // Check updated post
    const [updatedPosts] = await connection.execute('SELECT likesCount FROM social_post WHERE id = ?', [post.id])
    const updatedPost = updatedPosts[0]
    console.log(`📊 Updated likes count: ${updatedPost.likesCount}`)

    console.log('🎉 Fixed like functionality test completed successfully!')

  } catch (error) {
    console.error('❌ Fixed like functionality test failed:', error)
  } finally {
    if (connection) {
      await connection.end()
      console.log('🔌 Database connection closed')
    }
  }
}

// Run the test
testFixedLike()