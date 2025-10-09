const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function runSqlScript() {
  const prisma = new PrismaClient();

  try {
    console.log('Reading SQL script...');
    const sqlScript = fs.readFileSync(path.join(__dirname, 'create-friend-tables.sql'), 'utf8');

    console.log('Executing SQL script...');
    await prisma.$executeRawUnsafe(sqlScript);

    console.log('✅ SQL script executed successfully!');
    console.log('All missing tables should now be created.');
  } catch (error) {
    console.error('❌ Error executing SQL script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runSqlScript();