const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikariCha_db'
};

async function setupFollowSystem() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    console.log('🚀 Setting up follow system...');

    // Create user_follow table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_follow (
        id VARCHAR(255) PRIMARY KEY,
        followerId VARCHAR(255) NOT NULL,
        followingId VARCHAR(255) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (followerId) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (followingId) REFERENCES user(id) ON DELETE CASCADE,

        UNIQUE KEY unique_follow (followerId, followingId),

        CHECK (followerId != followingId)
      )
    `);
    console.log('✅ Created user_follow table');

    // Create indexes
    await connection.execute(`
      CREATE INDEX IF NOT EXISTS idx_user_follow_follower ON user_follow(followerId)
    `);
    await connection.execute(`
      CREATE INDEX IF NOT EXISTS idx_user_follow_following ON user_follow(followingId)
    `);
    await connection.execute(`
      CREATE INDEX IF NOT EXISTS idx_user_follow_createdAt ON user_follow(createdAt)
    `);
    console.log('✅ Created indexes');

    // Add followerCount and followingCount columns to user table
    await connection.execute(`
      ALTER TABLE user
      ADD COLUMN IF NOT EXISTS followerCount INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS followingCount INT DEFAULT 0
    `);
    console.log('✅ Added follower/following count columns');

    // Check if we need to migrate existing data
    const [existingFollows] = await connection.execute('SELECT COUNT(*) as count FROM user_follow');
    const followCount = existingFollows[0].count;

    if (followCount === 0) {
      console.log('📦 Migrating existing friendships to follows...');

      // Migrate existing friendships to follows (one-way relationship)
      const [friendships] = await connection.execute(`
        SELECT user1Id, user2Id, createdAt
        FROM friendship
        WHERE user1Id != user2Id
      `);

      for (const friendship of friendships) {
        const followId = `follow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await connection.execute(`
          INSERT IGNORE INTO user_follow (id, followerId, followingId, createdAt)
          VALUES (?, ?, ?, ?)
        `, [followId, friendship.user1Id, friendship.user2Id, friendship.createdAt]);
      }

      console.log(`✅ Migrated ${friendships.length} friendships to follows`);
    } else {
      console.log(`ℹ️  Found ${followCount} existing follows, skipping migration`);
    }

    // Update follower/following counts
    console.log('🔢 Updating follower and following counts...');

    await connection.execute(`
      UPDATE user u
      SET followerCount = (
        SELECT COUNT(*)
        FROM user_follow uf
        WHERE uf.followingId = u.id
      )
    `);

    await connection.execute(`
      UPDATE user u
      SET followingCount = (
        SELECT COUNT(*)
        FROM user_follow uf
        WHERE uf.followerId = u.id
      )
    `);
    console.log('✅ Updated follower/following counts');

    // Show stats
    const [stats] = await connection.execute(`
      SELECT
        (SELECT COUNT(*) FROM user_follow) as total_follows,
        (SELECT COUNT(*) FROM user WHERE followerCount > 0) as users_with_followers,
        (SELECT COUNT(*) FROM user WHERE followingCount > 0) as users_with_following
    `);

    console.log('\n📊 Follow System Stats:');
    console.log(`   Total follows: ${stats[0].total_follows}`);
    console.log(`   Users with followers: ${stats[0].users_with_followers}`);
    console.log(`   Users with following: ${stats[0].users_with_following}`);

    console.log('\n🎉 Follow system setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up follow system:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the setup
setupFollowSystem().catch(console.error);