const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createMissingTables() {
  try {
    console.log('Creating missing tables...');

    // Create borderunlock table using raw SQL
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS borderunlock (
        id VARCHAR(191) NOT NULL,
        userId VARCHAR(191) NOT NULL,
        borderId VARCHAR(191) NOT NULL,
        unlockType ENUM('ACHIEVEMENT', 'PURCHASE', 'ADMIN') NOT NULL,
        unlockedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        pricePaid INT,
        PRIMARY KEY (id),
        UNIQUE INDEX BorderUnlock_userId_borderId_key (userId, borderId),
        INDEX BorderUnlock_borderId_fkey (borderId)
      )
    `;

    // Create pointtransaction table using raw SQL
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS pointtransaction (
        id VARCHAR(191) NOT NULL,
        userId VARCHAR(191) NOT NULL,
        type ENUM('EARNED', 'SPENT', 'ADMIN_GIVEN', 'REFUND') NOT NULL,
        amount INT NOT NULL,
        description TEXT,
        metadata TEXT,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id),
        INDEX PointTransaction_userId_fkey (userId)
      )
    `;

    console.log('✅ Missing tables created successfully!');

    // Test the new tables
    console.log('Testing new tables...');

    const borderUnlockTest = await prisma.borderUnlock.findMany({ take: 1 });
    console.log('✅ borderUnlock table accessible, records:', borderUnlockTest.length);

    const pointTransactionTest = await prisma.pointTransaction.findMany({ take: 1 });
    console.log('✅ pointTransaction table accessible, records:', pointTransactionTest.length);

  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMissingTables();