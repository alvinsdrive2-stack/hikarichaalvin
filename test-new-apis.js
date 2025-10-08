const mysql = require('mysql2/promise');

async function testDatabaseService() {
  try {
    console.log('Testing Database Service...');

    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    });

    console.log('✅ Database connected successfully!');

    // Test getting all borders with unlock status for user
    const userId = 'your-test-user-id'; // Replace with actual user ID
    console.log('Testing border access...');

    const [borders] = await connection.execute(
      'SELECT * FROM border WHERE isActive = true ORDER BY sortOrder ASC'
    );

    console.log(`✅ Found ${borders.length} active borders:`);
    borders.forEach((border, index) => {
      console.log(`  ${index + 1}. ${border.name} (${border.rarity}) - Price: ${border.price || 'Free'}`);
    });

    // Test user data
    const [users] = await connection.execute(
      'SELECT id, name, email, points, selectedBorder FROM user LIMIT 2'
    );

    console.log(`\n✅ Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email}) - Points: ${user.points} - Border: ${user.selectedBorder}`);
    });

    // Test if border unlock table exists
    const [unlockTable] = await connection.execute(
      'SHOW TABLES LIKE "borderunlock"'
    );

    if (unlockTable.length > 0) {
      console.log('\n✅ Border unlock table exists');

      const [unlocks] = await connection.execute(
        'SELECT * FROM borderunlock LIMIT 3'
      );

      console.log(`✅ Found ${unlocks.length} border unlocks:`);
      unlocks.forEach((unlock, index) => {
        console.log(`  ${index + 1}. User: ${unlock.userId} - Border: ${unlock.borderId} - Type: ${unlock.unlockType}`);
      });
    } else {
      console.log('\n❌ Border unlock table does not exist');
    }

    await connection.end();
    console.log('\n✅ Database service test completed successfully!');

  } catch (error) {
    console.error('❌ Database service test error:', error.message);
  }
}

testDatabaseService();