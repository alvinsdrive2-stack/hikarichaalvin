const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikariCha_db'
};

async function setupChatDatabase() {
  let connection;

  try {
    console.log('🔧 Setting up chat database...');

    connection = await mysql.createConnection(dbConfig);

    // Read and execute the SQL schema
    const schemaPath = path.join(__dirname, '../create-chat-tables.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split SQL file into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }

    console.log('✅ Chat database setup completed successfully!');

    // Verify tables were created
    const [tables] = await connection.execute("SHOW TABLES LIKE 'chat_%'");
    console.log(`📊 Created ${tables.length} chat tables:`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });

  } catch (error) {
    console.error('❌ Error setting up chat database:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function verifyChatSetup() {
  let connection;

  try {
    console.log('\n🔍 Verifying chat setup...');

    connection = await mysql.createConnection(dbConfig);

    // Check if all required tables exist
    const requiredTables = [
      'chat_conversations',
      'chat_participants',
      'chat_messages',
      'chat_message_reactions',
      'chat_typing_indicators'
    ];

    for (const table of requiredTables) {
      const [result] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
      const count = result[0].count;
      console.log(`   ✅ ${table}: ${count} records`);
    }

    // Test a simple query
    const [conversations] = await connection.execute(`
      SELECT
        c.id,
        c.type,
        c.name,
        COUNT(cp.user_id) as participant_count
      FROM chat_conversations c
      LEFT JOIN chat_participants cp ON c.id = cp.conversation_id
      WHERE c.is_active = true
      GROUP BY c.id, c.type, c.name
      ORDER BY c.created_at DESC
      LIMIT 5
    `);

    console.log(`\n📈 Sample conversations found: ${conversations.length}`);
    conversations.forEach(conv => {
      console.log(`   - ${conv.type}: ${conv.name || 'Direct Chat'} (${conv.participant_count} participants)`);
    });

    console.log('\n✅ Chat setup verification completed!');

  } catch (error) {
    console.error('❌ Error verifying chat setup:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function testChatAPI() {
  try {
    console.log('\n🌐 Testing chat API endpoints...');

    // Test conversations API
    const baseUrl = 'http://localhost:3000';

    // This would require the server to be running
    console.log('   📡 API endpoints to test:');
    console.log(`      - GET ${baseUrl}/api/chat/conversations`);
    console.log(`      - POST ${baseUrl}/api/chat/conversations`);
    console.log(`      - GET ${baseUrl}/api/chat/messages`);
    console.log(`      - POST ${baseUrl}/api/chat/messages`);
    console.log(`      - POST ${baseUrl}/api/chat/typing`);
    console.log(`      - GET ${baseUrl}/api/users/online`);

    console.log('\n💡 Note: Start the development server to test API endpoints');
    console.log('   Run: npm run dev');

  } check (error) {
    console.error('❌ Error testing chat API:', error);
  }
}

// Main execution
async function main() {
  try {
    await setupChatDatabase();
    await verifyChatSetup();
    await testChatAPI();

    console.log('\n🎉 Chat system setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the development server: npm run dev');
    console.log('   2. Test the chat functionality in the browser');
    console.log('   3. Open multiple browser windows to test real-time features');
    console.log('   4. Check the Socket.io connection in browser console');

  } catch (error) {
    console.error('\n💥 Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = {
  setupChatDatabase,
  verifyChatSetup,
  testChatAPI
};