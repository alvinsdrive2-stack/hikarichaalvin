const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function updateTestPassword() {
  try {
    console.log('Updating test user password...');

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    });

    // Update password for test user
    const testPassword = 'password123';
    const hashedPassword = await bcrypt.hash(testPassword, 12);

    await connection.execute(
      'UPDATE user SET password = ? WHERE email = ?',
      [hashedPassword, 'test@demo.com']
    );

    console.log(`✅ Updated password for test@demo.com to "${testPassword}"`);

    // Verify update
    const [users] = await connection.execute(
      'SELECT email, password FROM user WHERE email = ?',
      ['test@demo.com']
    );

    if (users.length > 0) {
      const isValid = await bcrypt.compare(testPassword, users[0].password);
      console.log(`✅ Password verification: ${isValid ? 'SUCCESS' : 'FAILED'}`);
    }

    await connection.end();
    console.log('\n✅ You can now login with:');
    console.log('Email: test@demo.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('❌ Error updating password:', error.message);
  }
}

updateTestPassword();