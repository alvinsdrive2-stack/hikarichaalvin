const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPrisma() {
  try {
    console.log('Testing Prisma connection...');

    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Check available models
    console.log('Available models:', {
      border: !!prisma.border,
      borderUnlock: !!prisma.borderUnlock,
      user: !!prisma.user,
      pointTransaction: !!prisma.pointTransaction,
      activity: !!prisma.activity,
      achievement: !!prisma.achievement
    });

    // Test border query
    console.log('Testing border.findMany()...');
    const borders = await prisma.border.findMany({
      take: 3
    });
    console.log('✅ Border query successful, found', borders.length, 'borders');

    console.log('Sample border:', borders[0]);

  } catch (error) {
    console.error('❌ Prisma error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();