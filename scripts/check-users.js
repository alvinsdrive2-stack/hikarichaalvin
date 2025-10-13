const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikariCha_db'
};

async function checkUsers() {
  let connection;

  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);

    const [users] = await connection.execute('SELECT id, name, email FROM user LIMIT 5');
    console.log('👥 Existing users:');
    users.forEach(user => {
      console.log(`   - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
    });

    if (users.length > 0) {
      const firstUser = users[0];
      console.log(`\n✅ Using first user for chat testing: ${firstUser.name} (${firstUser.id})`);
      return firstUser.id;
    }

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkUsers();