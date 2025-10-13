const mysql = require('mysql2/promise');

// Try different MySQL configurations
const dbConfigs = [
  {
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'hikariCha_db'
  },
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hikariCha_db'
  },
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'hikariCha_db'
  }
];

async function setupSocialDatabase() {
  let connection;
  let successfulConfig = null;

  // Try different database configurations
  for (let i = 0; i < dbConfigs.length; i++) {
    const config = dbConfigs[i];
    try {
      console.log(`Trying config ${i + 1} (password: ${config.password || '[empty]'})`);
      connection = await mysql.createConnection(config);
      successfulConfig = config;
      console.log('✅ Database connected successfully!');
      break;
    } catch (error) {
      console.log(`❌ Config ${i + 1} failed:`, error.message);
      continue;
    }
  }

  if (!connection) {
    console.error('❌ Could not connect to database with any configuration');
    return;
  }

  try {
    console.log('Reading SQL script...');
    const fs = require('fs');
    const path = require('path');
    const sqlScript = fs.readFileSync(path.join(__dirname, '../create_social_tables.sql'), 'utf8');

    console.log('Executing SQL script...');
    await connection.execute(sqlScript);

    console.log('✅ Social tables created successfully!');

    // Test query to verify tables exist
    const [tables] = await connection.execute("SHOW TABLES LIKE 'social_%'");
    console.log('Created tables:', tables.map(t => Object.values(t)[0]));

    // Update .env file if we found a working config
    if (successfulConfig.password !== '123456789') {
      console.log('🔧 You may need to update your .env file with the correct password');
    }

  } catch (error) {
    console.error('❌ Error setting up social database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

setupSocialDatabase();