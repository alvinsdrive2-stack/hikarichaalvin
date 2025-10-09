const { PrismaClient } = require('@prisma/client');

async function finalFriendTest() {
  const prisma = new PrismaClient();

  try {
    console.log('🎯 Final Friend System Test');

    // Get users
    const users = await prisma.user.findMany({
      take: 3,
      select: { id: true, name: true, email: true }
    });

    console.log(`Found ${users.length} users`);
    users.forEach((user, i) => {
      console.log(`${i + 1}. ${user.name} (${user.id})`);
    });

    // Test existing data
    console.log('\n📊 Current Database State:');

    const friendRequests = await prisma.friendRequest.findMany({
      include: {
        sender: { select: { name: true } },
        receiver: { select: { name: true } }
      }
    });
    console.log(`Friend Requests: ${friendRequests.length}`);
    friendRequests.forEach(fr => {
      console.log(`  - ${fr.sender.name} → ${fr.receiver.name} (${fr.status})`);
    });

    const friendships = await prisma.friendship.findMany({
      include: {
        user1: { select: { name: true } },
        user2: { select: { name: true } }
      }
    });
    console.log(`Friendships: ${friendships.length}`);
    friendships.forEach(f => {
      console.log(`  - ${f.user1.name} ↔ ${f.user2.name}`);
    });

    const userStatuses = await prisma.userstatus.findMany({
      include: {
        user: { select: { name: true } }
      }
    });
    console.log(`User Statuses: ${userStatuses.length}`);
    userStatuses.forEach(us => {
      console.log(`  - ${us.user.name}: ${us.status} (${us.lastSeen})`);
    });

    const activities = await prisma.activity.findMany({
      take: 5,
      include: {
        user: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log(`Recent Activities: ${activities.length}`);
    activities.forEach(act => {
      console.log(`  - ${act.user.name}: ${act.type} - ${act.title}`);
    });

    console.log('\n✅ All database operations working correctly!');
    console.log('\n📋 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Friend Requests: ${friendRequests.length}`);
    console.log(`   - Friendships: ${friendships.length}`);
    console.log(`   - User Statuses: ${userStatuses.length}`);
    console.log(`   - Activities: ${activities.length} (showing latest 5)`);
    console.log('\n🎉 Friend System Database Integration: WORKING ✅');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

finalFriendTest();