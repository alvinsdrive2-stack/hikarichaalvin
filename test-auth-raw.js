const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function testAuthDirectly() {
  try {
    console.log('Testing authentication directly...');

    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    });

    console.log('✅ Database connected successfully!');

    // Get existing users
    const [users] = await connection.execute(
      'SELECT id, email, name, password FROM user LIMIT 3'
    );

    console.log(`\n✅ Found ${users.length} users:`);
    for (const user of users) {
      console.log(`  - ${user.name} (${user.email}) - Has Password: ${!!user.password}`);

      if (user.password) {
        // Test password verification
        const testPasswords = ['password', '123456', 'test'];
        for (const testPass of testPasswords) {
          try {
            const isValid = await bcrypt.compare(testPass, user.password);
            if (isValid) {
              console.log(`    ✅ Password "${testPass}" is VALID!`);
              break;
            }
          } catch (error) {
            // Skip invalid hash
          }
        }
      }
    }

    // Test creating a simple password hash for testing
    const testPassword = 'password123';
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    console.log(`\n✅ Sample password hash for "${testPassword}":`, hashedPassword);

    await connection.end();
    console.log('\n✅ Auth test completed!');

  } catch (error) {
    console.error('❌ Auth test error:', error.message);
  }
}

testAuthDirectly();