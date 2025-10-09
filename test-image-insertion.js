const mysql = require('mysql2/promise');

async function testImageInsertion() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    });

    console.log('=== TESTING IMAGE INSERTION ===');

    // Clean up old test data first
    await connection.execute('DELETE FROM forum_threads WHERE id LIKE ?', [`thread_test_%`]);

    // Simulate content with image that should be stored
    const testContent = `
      <p>Ini adalah test content dengan gambar.</p>
      <p><img src="/uploads/forum/forum_1759973097049_czjja4duuad.png" alt="Test Image" style="max-width: 100%;"></p>
      <p>Ini adalah paragraf setelah gambar.</p>
    `;

    console.log('Test content dengan gambar:');
    console.log(testContent);
    console.log('Contains img tag:', testContent.includes('<img'));

    // Insert test thread
    const threadId = `thread_test_${Date.now()}`;
    await connection.execute(`
      INSERT INTO forum_threads (
        id, title, content, excerpt, category_id,
        author_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      threadId,
      'TEST THREAD DENGAN GAMBAR',
      testContent,
      'Test thread dengan gambar...',
      1, // manfaat category
      'test_user'
    ]);

    console.log('Test thread inserted with ID:', threadId);

    // Retrieve and verify
    console.log('Looking for thread with ID:', threadId);
    const [rows] = await connection.execute(
      'SELECT id, title, content FROM forum_threads WHERE id = ?',
      [threadId]
    );

    console.log('Query returned', rows.length, 'rows');

    if (rows.length > 0) {
      const insertedThread = rows[0];
      console.log('Retrieved thread:');
      console.log('ID:', insertedThread.id);
      console.log('Title:', insertedThread.title);
      console.log('Content has img tag:', insertedThread.content.includes('<img'));
      console.log('Content length:', insertedThread.content.length);
    } else {
      console.log('Thread not found after insert');

      // Check all threads to see what's in there
      const [allThreads] = await connection.execute('SELECT id, title FROM forum_threads ORDER BY created_at DESC LIMIT 5');
      console.log('Available threads:');
      allThreads.forEach(t => console.log('  -', t.id, ':', t.title));
    }

    // Clean up test data
    await connection.execute('DELETE FROM forum_threads WHERE id = ?', [threadId]);
    console.log('Test data cleaned up');

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testImageInsertion();