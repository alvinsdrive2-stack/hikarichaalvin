// Test reply creation without authentication
const mysql = require('mysql2/promise');

async function testReplyCreation() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    });

    console.log('🔄 Testing reply creation directly...\n');

    // Test 1: Get a valid thread
    console.log('1️⃣ Getting valid thread...');
    const [threads] = await connection.execute('SELECT id FROM forum_threads LIMIT 1');
    if (threads.length === 0) {
      console.log('❌ No threads found');
      return;
    }
    const threadId = threads[0].id;
    console.log(`✅ Using thread: ${threadId}`);

    // Test 2: Try to create reply with NULL parent_id
    console.log('\n2️⃣ Testing reply creation with NULL parent_id...');
    const replyId = `test_reply_${Date.now()}`;

    try {
      const [result] = await connection.execute(`
        INSERT INTO forum_replies (
          id, thread_id, parent_id, content,
          author_id, author_name, author_avatar, author_border,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        replyId,
        threadId,
        null, // Explicit NULL
        'Test reply content',
        'test_user',
        'Test User',
        '',
        null
      ]);

      console.log('✅ Reply created successfully!');
      console.log(`   🆔 Reply ID: ${replyId}`);

      // Clean up test reply
      await connection.execute('DELETE FROM forum_replies WHERE id = ?', [replyId]);
      console.log('🧹 Test reply cleaned up');

    } catch (error) {
      console.log('❌ Reply creation failed:');
      console.log(`   📝 Error: ${error.message}`);
      console.log(`   🔢 Code: ${error.code}`);

      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        console.log('🔍 Foreign key constraint violation detected');
        console.log('   💡 This means either thread_id or parent_id is invalid');

        // Check if thread exists
        const [threadCheck] = await connection.execute('SELECT id FROM forum_threads WHERE id = ?', [threadId]);
        console.log(`   📋 Thread exists: ${threadCheck.length > 0 ? 'YES' : 'NO'}`);
      }
    }

    console.log('\n🎉 Reply creation test completed!');

  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

testReplyCreation();