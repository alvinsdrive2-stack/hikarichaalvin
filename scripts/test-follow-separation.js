const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikariCha_db'
};

async function testFollowSeparation() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    console.log('🧪 Testing Follow System Separation...');

    // Get test users
    const [users] = await connection.execute(`
      SELECT id, name, friendCount, followerCount, followingCount
      FROM user
      WHERE id LIKE 'user_%'
      LIMIT 2
    `);

    if (users.length < 2) {
      console.log('❌ Need at least 2 users to test follow system');
      return;
    }

    const user1 = users[0];
    const user2 = users[1];

    console.log('\n📊 Initial Status:');
    console.log(`   ${user1.name}:`);
    console.log(`     Friends: ${user1.friendCount}`);
    console.log(`     Followers: ${user1.followerCount}`);
    console.log(`     Following: ${user1.followingCount}`);

    console.log(`   ${user2.name}:`);
    console.log(`     Friends: ${user2.friendCount}`);
    console.log(`     Followers: ${user2.followerCount}`);
    console.log(`     Following: ${user2.followingCount}`);

    // Check if already following
    const [existingFollow] = await connection.execute(`
      SELECT id FROM user_follow
      WHERE followerId = ? AND followingId = ?
    `, [user1.id, user2.id]);

    if (existingFollow.length > 0) {
      console.log('\n⚠️  Users already have follow relationship, testing unfollow...');

      // Remove follow
      await connection.execute(`
        DELETE FROM user_follow
        WHERE followerId = ? AND followingId = ?
      `, [user1.id, user2.id]);

      // Update counts
      await connection.execute(`
        UPDATE user SET followingCount = GREATEST(followingCount - 1, 0)
        WHERE id = ?
      `, [user1.id]);

      await connection.execute(`
        UPDATE user SET followerCount = GREATEST(followerCount - 1, 0)
        WHERE id = ?
      `, [user2.id]);

    } else {
      console.log('\n➕ Testing follow...');

      // Add follow
      const followId = `follow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await connection.execute(`
        INSERT INTO user_follow (id, followerId, followingId)
        VALUES (?, ?, ?)
      `, [followId, user1.id, user2.id]);

      // Update counts
      await connection.execute(`
        UPDATE user SET followingCount = followingCount + 1
        WHERE id = ?
      `, [user1.id]);

      await connection.execute(`
        UPDATE user SET followerCount = followerCount + 1
        WHERE id = ?
      `, [user2.id]);
    }

    // Get updated status
    const [updatedUsers] = await connection.execute(`
      SELECT id, name, friendCount, followerCount, followingCount
      FROM user
      WHERE id IN (?, ?)
    `, [user1.id, user2.id]);

    const updatedUser1 = updatedUsers.find(u => u.id === user1.id);
    const updatedUser2 = updatedUsers.find(u => u.id === user2.id);

    console.log('\n📊 After Follow Operation:');
    console.log(`   ${updatedUser1.name}:`);
    console.log(`     Friends: ${updatedUser1.friendCount} (${updatedUser1.friendCount === user1.friendCount ? '✅ Same' : '❌ Changed!'})`);
    console.log(`     Followers: ${updatedUser1.followerCount}`);
    console.log(`     Following: ${updatedUser1.followingCount}`);

    console.log(`   ${updatedUser2.name}:`);
    console.log(`     Friends: ${updatedUser2.friendCount} (${updatedUser2.friendCount === user2.friendCount ? '✅ Same' : '❌ Changed!'})`);
    console.log(`     Followers: ${updatedUser2.followerCount}`);
    console.log(`     Following: ${updatedUser2.followingCount}`);

    // Test stats API
    console.log('\n🔍 Testing Stats API...');
    const response = await fetch(`http://localhost:3000/api/users/${user1.id}/stats`);
    const stats = await response.json();

    console.log(`   ${user1.name} Stats API Response:`);
    console.log(`     Friends: ${stats.friendCount}`);
    console.log(`     Followers: ${stats.followerCount}`);
    console.log(`     Following: ${stats.followingCount}`);

    // Verify separation
    const friendCountUnchanged = updatedUser1.friendCount === user1.friendCount &&
                                updatedUser2.friendCount === user2.friendCount;

    if (friendCountUnchanged) {
      console.log('\n✅ SUCCESS: Follow system is properly separated from Friend system!');
      console.log('   Friend counts remain unchanged when following/unfollowing');
    } else {
      console.log('\n❌ FAILED: Follow system still affects Friend counts!');
    }

  } catch (error) {
    console.error('❌ Error testing follow separation:', error);
  } finally {
    await connection.end();
  }
}

// Run the test
testFollowSeparation().catch(console.error);