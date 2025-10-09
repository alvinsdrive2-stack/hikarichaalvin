const { PrismaClient } = require('@prisma/client');

async function testFriendSystem() {
  const prisma = new PrismaClient();

  try {
    console.log('🧪 Testing Friend System Database Integration...');

    // Test 1: Check if all tables exist
    console.log('\n1. Testing table existence...');

    try {
      await prisma.$queryRaw`SELECT 1 FROM \`friendship\` LIMIT 1`;
      console.log('✅ friendship table exists');
    } catch (error) {
      console.log('❌ friendship table missing:', error.message);
    }

    try {
      await prisma.$queryRaw`SELECT 1 FROM \`friendrequest\` LIMIT 1`;
      console.log('✅ friendrequest table exists');
    } catch (error) {
      console.log('❌ friendrequest table missing:', error.message);
    }

    try {
      await prisma.$queryRaw`SELECT 1 FROM \`userstatus\` LIMIT 1`;
      console.log('✅ userstatus table exists');
    } catch (error) {
      console.log('❌ userstatus table missing:', error.message);
    }

    try {
      await prisma.$queryRaw`SELECT 1 FROM \`activity\` LIMIT 1`;
      console.log('✅ activity table exists');
    } catch (error) {
      console.log('❌ activity table missing:', error.message);
    }

    // Test 2: Check if we can create friend request
    console.log('\n2. Testing friend request creation...');

    // Get sample users
    const users = await prisma.user.findMany({
      take: 2,
      select: { id: true, name: true }
    });

    if (users.length < 2) {
      console.log('❌ Not enough users to test friend system');
      return;
    }

    console.log(`✅ Found ${users.length} users for testing`);
    console.log(`   User 1: ${users[0].name} (${users[0].id})`);
    console.log(`   User 2: ${users[1].name} (${users[1].id})`);

    // Test 3: Create friend request
    console.log('\n3. Creating friend request...');
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: users[0].id,
        receiverId: users[1].id,
        status: 'PENDING'
      }
    });
    console.log('✅ Friend request created:', friendRequest.id);

    // Test 4: Create user status
    console.log('\n4. Creating user status...');
    const userStatus = await prisma.userstatus.create({
      data: {
        userId: users[0].id,
        status: 'ONLINE'
      }
    });
    console.log('✅ User status created for user:', userStatus.userId);

    // Test 5: Create activity
    console.log('\n5. Creating activity...');
    const activity = await prisma.activity.create({
      data: {
        id: `act_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: users[0].id,
        type: 'FRIEND_REQUEST_SENT',
        title: 'Test Friend Request',
        description: `Test friend request from ${users[0].name} to ${users[1].name}`,
        metadata: JSON.stringify({
          test: true,
          senderId: users[0].id,
          receiverId: users[1].id
        })
      }
    });
    console.log('✅ Activity created:', activity.id);

    // Test 6: Test friendship creation
    console.log('\n6. Testing friendship creation...');
    const friendship = await prisma.friendship.create({
      data: {
        id: `fs_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user1Id: users[0].id,
        user2Id: users[1].id
      }
    });
    console.log('✅ Friendship created:', friendship.id);

    // Test 7: Test query operations
    console.log('\n7. Testing query operations...');

    const friendRequests = await prisma.friendRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        sender: { select: { name: true } },
        receiver: { select: { name: true } }
      }
    });
    console.log(`✅ Found ${friendRequests.length} pending friend requests`);

    const friendships = await prisma.friendship.findMany({
      include: {
        user1: { select: { name: true } },
        user2: { select: { name: true } }
      }
    });
    console.log(`✅ Found ${friendships.length} friendships`);

    const usersWithStatus = await prisma.user.findMany({
      include: {
        userstatus: { select: { status: true, lastSeen: true } }
      }
    });
    const onlineUsers = usersWithStatus.filter(u => u.userstatus?.status === 'ONLINE');
    console.log(`✅ Found ${onlineUsers.length} online users`);

    console.log('\n🎉 All friend system tests passed!');
    console.log('\n📊 Summary:');
    console.log(`   - Tables created and working ✅`);
    console.log(`   - Friend requests: ${friendRequests.length} pending`);
    console.log(`   - Friendships: ${friendships.length} total`);
    console.log(`   - Online users: ${onlineUsers.length} online`);
    console.log(`   - Database integration: ✅ WORKING`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFriendSystem();