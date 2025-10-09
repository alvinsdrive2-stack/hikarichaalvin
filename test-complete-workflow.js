const mysql = require('mysql2/promise');

async function testCompleteWorkflow() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    });

    console.log('=== TESTING COMPLETE FORUM IMAGE WORKFLOW ===');

    // Create a test thread with image content that mimics ReactQuill output
    const imageContent = `
      <p>Ini adalah thread test dengan gambar yang diupload via Rich Text Editor.</p>
      <p><img src="/uploads/forum/forum_1759973097049_czjja4duuad.png" alt="Uploaded Image" style="max-width: 100%; height: auto;"></p>
      <p>Ini adalah teks setelah gambar. Gambar seharusnya muncul di antara kedua paragraf ini.</p>
      <p>Kita bisa juga menambahkan <strong>formatting</strong> dan <em>styling</em> lainnya.</p>
    `;

    console.log('Creating test thread with image content...');
    console.log('Content contains img tag:', imageContent.includes('<img'));
    console.log('Image URL:', imageContent.match(/src="([^"]+)"/)[1]);

    const threadId = 'thread_test_workflow_' + Date.now();
    console.log('Thread ID:', threadId, 'Length:', threadId.length);

    await connection.execute(`
      INSERT INTO forum_threads (
        id, title, content, excerpt, category_id,
        author_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      threadId,
      'TEST FORUM DENGAN GAMBAR - WORKFLOW TEST',
      imageContent,
      'Test forum dengan gambar uploaded via Rich Text Editor...',
      1, // manfaat category
      'test_user_workflow'
    ]);

    console.log('✅ Test thread created successfully!');

    // Test retrieval
    const [rows] = await connection.execute(
      'SELECT id, title, content FROM forum_threads WHERE id = ?',
      [threadId]
    );

    if (rows.length > 0) {
      const thread = rows[0];
      console.log('✅ Thread retrieved successfully!');
      console.log('ID:', thread.id);
      console.log('Title:', thread.title);
      console.log('Content length:', thread.content.length);
      console.log('Contains img tag:', thread.content.includes('<img'));
      console.log('Image URL found:', thread.content.match(/src="([^"]+)"/)?.[1] || 'Not found');

      // Verify the content is exactly the same
      const contentMatches = thread.content === imageContent;
      console.log('Content matches exactly:', contentMatches);

      if (!contentMatches) {
        console.log('Content differences:');
        console.log('Original length:', imageContent.length);
        console.log('Stored length:', thread.content.length);
        console.log('Original snippet:', imageContent.substring(0, 100) + '...');
        console.log('Stored snippet:', thread.content.substring(0, 100) + '...');
      }
    } else {
      console.log('❌ Thread retrieval failed');
    }

    // Clean up
    await connection.execute('DELETE FROM forum_threads WHERE id = ?', [threadId]);
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 Complete workflow test finished!');

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testCompleteWorkflow();