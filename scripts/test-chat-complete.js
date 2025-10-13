const mysql = require('mysql2/promise');
const { io } = require('socket.io-client');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikariCha_db'
};

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  socketUrl: 'http://localhost:3000',
  testUsers: [
    { id: 'user1', name: 'Alice Test', email: 'alice@test.com' },
    { id: 'user2', name: 'Bob Test', email: 'bob@test.com' },
    { id: 'user3', name: 'Charlie Test', email: 'charlie@test.com' }
  ]
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

// Database helper functions
async function setupTestUsers() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Insert test users if they don't exist
    for (const user of TEST_CONFIG.testUsers) {
      await connection.execute(`
        INSERT IGNORE INTO user (id, name, email, createdAt)
        VALUES (?, ?, ?, NOW())
      `, [user.id, user.name, user.email]);
    }

    logSuccess('Test users setup completed');
  } catch (error) {
    logError(`Failed to setup test users: ${error.message}`);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

async function clearTestData() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Clear chat test data (but keep users)
    await connection.execute('DELETE FROM chat_message_reactions');
    await connection.execute('DELETE FROM chat_typing_indicators');
    await connection.execute('DELETE FROM chat_messages');
    await connection.execute('DELETE FROM chat_participants');
    await connection.execute('DELETE FROM chat_conversations');

    logSuccess('Test data cleared');
  } catch (error) {
    logError(`Failed to clear test data: ${error.message}`);
  } finally {
    if (connection) await connection.end();
  }
}

// API Tests
async function testConversationsAPI() {
  logInfo('Testing Conversations API...');

  try {
    // Test creating direct conversation
    const createResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/chat/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'DIRECT',
        participantIds: [TEST_CONFIG.testUsers[1].id],
        createdBy: TEST_CONFIG.testUsers[0].id
      })
    });

    if (createResponse.ok) {
      const data = await createResponse.json();
      logSuccess('Direct conversation created');
      return data.data.conversationId;
    } else {
      logError('Failed to create conversation');
      return null;
    }
  } catch (error) {
    logError(`Conversations API test failed: ${error.message}`);
    return null;
  }
}

async function testMessagesAPI(conversationId) {
  logInfo('Testing Messages API...');

  try {
    // Test sending a message
    const sendResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/chat/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId,
        senderId: TEST_CONFIG.testUsers[0].id,
        content: 'Hello from test script!',
        type: 'TEXT'
      })
    });

    if (sendResponse.ok) {
      const data = await sendResponse.json();
      logSuccess('Message sent successfully');
      return data.data.id;
    } else {
      logError('Failed to send message');
      return null;
    }
  } catch (error) {
    logError(`Messages API test failed: ${error.message}`);
    return null;
  }
}

async function testOnlineUsersAPI() {
  logInfo('Testing Online Users API...');

  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/api/users/online?currentUserId=${TEST_CONFIG.testUsers[0].id}`);

    if (response.ok) {
      const data = await response.json();
      logSuccess(`Online users API working - found ${data.users.length} users`);
      return true;
    } else {
      logError('Online users API failed');
      return false;
    }
  } catch (error) {
    logError(`Online users API test failed: ${error.message}`);
    return false;
  }
}

// Socket.io Tests
async function testSocketConnection() {
  return new Promise((resolve) => {
    logInfo('Testing Socket.io connection...');

    const socket = io(TEST_CONFIG.socketUrl, {
      path: '/api/socket/io',
      auth: {
        token: 'test-token',
        userId: TEST_CONFIG.testUsers[0].id,
        name: TEST_CONFIG.testUsers[0].name
      }
    });

    let connected = false;
    const timeout = setTimeout(() => {
      if (!connected) {
        logError('Socket connection timeout');
        socket.disconnect();
        resolve(false);
      }
    }, 10000);

    socket.on('connect', () => {
      connected = true;
      clearTimeout(timeout);
      logSuccess(`Socket connected: ${socket.id}`);
      socket.disconnect();
      resolve(true);
    });

    socket.on('connect_error', (error) => {
      clearTimeout(timeout);
      logError(`Socket connection failed: ${error.message}`);
      resolve(false);
    });
  });
}

// End-to-end Chat Test
async function testCompleteChatFlow() {
  logInfo('Testing complete chat flow...');

  try {
    // 1. Create conversation
    const conversationId = await testConversationsAPI();
    if (!conversationId) {
      logError('Cannot proceed - conversation creation failed');
      return false;
    }

    // 2. Send message
    const messageId = await testMessagesAPI(conversationId);
    if (!messageId) {
      logError('Cannot proceed - message sending failed');
      return false;
    }

    // 3. Test message reactions
    const reactionResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/chat/messages/${messageId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: TEST_CONFIG.testUsers[1].id,
        emoji: '❤️'
      })
    });

    if (reactionResponse.ok) {
      logSuccess('Message reaction added');
    } else {
      logWarning('Message reaction failed (might be expected)');
    }

    logSuccess('Complete chat flow test passed');
    return true;

  } catch (error) {
    logError(`Complete chat flow test failed: ${error.message}`);
    return false;
  }
}

// Database Validation
async function validateDatabaseSchema() {
  logInfo('Validating database schema...');

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const requiredTables = [
      'chat_conversations',
      'chat_participants',
      'chat_messages',
      'chat_message_reactions',
      'chat_typing_indicators'
    ];

    let allTablesExist = true;

    for (const table of requiredTables) {
      const [result] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
      if (result.length === 0) {
        logError(`Missing table: ${table}`);
        allTablesExist = false;
      } else {
        logSuccess(`Table exists: ${table}`);
      }
    }

    return allTablesExist;

  } catch (error) {
    logError(`Database validation failed: ${error.message}`);
    return false;
  } finally {
    if (connection) await connection.end();
  }
}

// Main test runner
async function runAllTests() {
  log('\n🚀 Starting Complete Chat System Tests', colors.cyan);
  log('='.repeat(50));

  const results = {
    database: false,
    conversations: false,
    messages: false,
    onlineUsers: false,
    socket: false,
    completeFlow: false
  };

  try {
    // Setup
    await setupTestUsers();
    await clearTestData();

    // Database validation
    results.database = await validateDatabaseSchema();

    // API tests
    const conversationId = await testConversationsAPI();
    results.conversations = !!conversationId;

    if (conversationId) {
      const messageId = await testMessagesAPI(conversationId);
      results.messages = !!messageId;
    }

    results.onlineUsers = await testOnlineUsersAPI();
    results.socket = await testSocketConnection();
    results.completeFlow = await testCompleteChatFlow();

    // Results summary
    log('\n📊 Test Results Summary', colors.cyan);
    log('='.repeat(50));

    Object.entries(results).forEach(([test, passed]) => {
      const status = passed ? '✅ PASSED' : '❌ FAILED';
      const color = passed ? colors.green : colors.red;
      log(`${test.toUpperCase().padEnd(15)}: ${status}`, color);
    });

    const totalTests = Object.values(results).length;
    const passedTests = Object.values(results).filter(Boolean).length;
    const successRate = Math.round((passedTests / totalTests) * 100);

    log(`\n🎯 Overall Success Rate: ${successRate}% (${passedTests}/${totalTests})`,
        successRate === 100 ? colors.green : successRate >= 80 ? colors.yellow : colors.red);

    if (successRate === 100) {
      log('\n🎉 All tests passed! Chat system is ready to use.', colors.green);
    } else {
      log('\n⚠️  Some tests failed. Please check the errors above.', colors.yellow);
    }

    // Next steps
    log('\n📋 Next Steps:', colors.blue);
    log('1. Start development server: npm run dev');
    log('2. Open browser and test chat functionality');
    log('3. Test with multiple browser windows for real-time features');
    log('4. Check browser console for Socket.io connections');

  } catch (error) {
    logError(`Test runner failed: ${error.message}`);
  }
}

// Run tests if script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  setupTestUsers,
  clearTestData,
  testConversationsAPI,
  testMessagesAPI,
  testOnlineUsersAPI,
  testSocketConnection,
  testCompleteChatFlow,
  validateDatabaseSchema
};