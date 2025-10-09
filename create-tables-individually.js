const { PrismaClient } = require('@prisma/client');

async function createTablesIndividually() {
  const prisma = new PrismaClient();

  try {
    console.log('Creating friendship table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS \`friendship\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`user1Id\` VARCHAR(191) NOT NULL,
        \`user2Id\` VARCHAR(191) NOT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`friendship_user1Id_user2Id_key\`(\`user1Id\`, \`user2Id\`),
        FOREIGN KEY (\`user1Id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (\`user2Id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `;
    console.log('✅ friendship table created');

    console.log('Creating friendrequest table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS \`friendrequest\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`senderId\` VARCHAR(191) NOT NULL,
        \`receiverId\` VARCHAR(191) NOT NULL,
        \`status\` ENUM('PENDING', 'ACCEPTED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`friendrequest_senderId_receiverId_key\`(\`senderId\`, \`receiverId\`),
        FOREIGN KEY (\`senderId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (\`receiverId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `;
    console.log('✅ friendrequest table created');

    console.log('Creating userstatus table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS \`userstatus\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`userId\` VARCHAR(191) NOT NULL,
        \`status\` ENUM('ONLINE', 'AWAY', 'BUSY', 'OFFLINE') NOT NULL DEFAULT 'OFFLINE',
        \`lastSeen\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`userstatus_userId_key\`(\`userId\`),
        FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `;
    console.log('✅ userstatus table created');

    console.log('Creating activity table...');
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS \`activity\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`userId\` VARCHAR(191) NOT NULL,
        \`type\` VARCHAR(191) NOT NULL,
        \`title\` VARCHAR(191) NOT NULL,
        \`description\` TEXT NOT NULL,
        \`metadata\` TEXT,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `;
    console.log('✅ activity table created');

    console.log('All critical friend system tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTablesIndividually();