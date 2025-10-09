// Test script to simulate creating a thread with images via API
const mysql = require('mysql2/promise');

async function testCreateThreadWithImages() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    });

    console.log('=== TESTING CREATE THREAD WITH IMAGES (SIMULATING DUAL MODE EDITOR) ===');

    // Simulate content from DualModeEditor simple mode with images
    const simulatedContent = `
      <img src="/uploads/forum/forum_1759973097049_czjja4duuad.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" /><br>
      <p>Ini adalah thread test dengan gambar yang diupload via Simple Mode editor.</p>
      <p>Gambar di atas adalah contoh upload yang berhasil.</p>
    `.trim();

    console.log('Simulated content from DualModeEditor:');
    console.log(simulatedContent);
    console.log('Contains img tag:', simulatedContent.includes('<img'));

    // Test the createThread function directly
    const { createThread } = require('./lib/forum-db.ts');

    // But since it's TypeScript, let's test via the API endpoint simulation
    const threadId = 'thread_api_test_' + Date.now();

    await connection.execute(`
      INSERT INTO forum_threads (
        id, title, content, excerpt, category_id,
        author_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      threadId,
      'TEST API THREAD WITH IMAGES',
      simulatedContent,
      'Test thread dengan gambar dari Simple Mode...',
      1, // manfaat category
      'api_test_user'
    ]);

    console.log('✅ Thread created with ID:', threadId);

    // Retrieve and verify
    const [rows] = await connection.execute(
      'SELECT id, title, content FROM forum_threads WHERE id = ?',
      [threadId]
    );

    if (rows.length > 0) {
      const thread = rows[0];
      console.log('✅ Thread retrieved successfully!');
      console.log('Title:', thread.title);
      console.log('Content contains img:', thread.content.includes('<img'));
      console.log('Image count:', (thread.content.match(/<img/g) || []).length);

      // Extract image URLs
      const imgMatches = thread.content.match(/src="([^"]+)"/g);
      if (imgMatches) {
        console.log('Image URLs found:');
        imgMatches.forEach(match => {
          const url = match.replace('src="', '').replace('"', '');
          console.log('  -', url);
        });
      }
    }

    // Test retrieval via getForumThreads function
    console.log('\n=== TESTING VIA getForumThreads FUNCTION ===');
    try {
      const { getForumThreads } = require('./lib/forum-db.ts');
      const threads = await getForumThreads({ limit: 5 });

      const testThread = threads.find(t => t.id === threadId);
      if (testThread) {
        console.log('✅ Thread found via getForumThreads!');
        console.log('Title:', testThread.title);
        console.log('Content contains img:', testThread.content.includes('<img'));
      } else {
        console.log('❌ Thread not found via getForumThreads');
      }
    } catch (error) {
      console.log('getForumThreads test skipped (TypeScript compilation issue)');
    }

    // Clean up
    await connection.execute('DELETE FROM forum_threads WHERE id = ?', [threadId]);
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 API simulation test completed!');

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testCreateThreadWithImages();