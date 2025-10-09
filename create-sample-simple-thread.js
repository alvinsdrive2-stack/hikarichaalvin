// Create Sample Simple Mode Thread (WhatsApp-style)
const mysql = require('mysql2/promise');

async function createSampleSimpleThread() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    });

    console.log('Connected to database');

    // Simple WhatsApp-style content
    const simpleContent = `
<p>🍵 <strong>Tips Cepat Matcha Latte untuk Pemula!</strong></p>
<p> Halo teman-teman! Mau share cara cepat bikin matcha latte enak banget 🥰</p>
<p>📋 <em>Bahan-bahan:</em><br>
• 1 sendok teh matcha<br>
• 200ml susu cair<br>
• 2 sdt gula (sesuai selera)<br>
• Es batu kalo mau dingin</p>
<p>🔥 <u>Cara buat:</u></p>
<p>1. Sift matcha ke chawan<br>
2. Tambah 50ml air panas (70°C)<br>
3. Whisk 30 detik sampai smooth<br>
4. Tuang susu dan gula<br>
5. Aduk rata, tambah es kalo dingin<br>
6. Selesai! ✨</p>
<p><s>Warning:</s> Jangan pakai air mendidih ya! Nanti pahit 😅</p>
<p><code>Pro tips:</code> Pake susu full biar lebih creamy!</p>
<p>Kemarin aku coba bikin, hasilnya lumayan bagus! Foamy banget 🫧</p>
<p>Kalo ada yang mau coba, share hasilnya ya! 👇</p>
<p><small>#MatchaLatte #TipsPemula #SimpleRecipe</small></p>
    `;

    const threadId = `simple_${Date.now()}`;

    await connection.execute(`
      INSERT INTO forum_threads (
        id, title, content, excerpt, category_id,
        author_id, author_name, author_avatar, author_border,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      threadId,
      '🍵 Tips Cepat Matcha Latte (Simple Mode)',
      simpleContent,
      'Cara gampang bikin matcha latte enak untuk pemula - WhatsApp style!',
      4, // resep
      'user_simple',
      'Matcha Lover',
      '/avatars/simple.jpg',
      'silver'
    ]);

    console.log('✅ Sample simple mode thread created successfully!');
    console.log(`   🆔 Thread ID: ${threadId}`);
    console.log('   🔗 URL: http://localhost:3000/forum/thread/' + threadId);
    console.log('   📱 WhatsApp-style formatting: ✅');
    console.log('   📝 Features: Bold, italic, strikethrough, code, lists, emojis');

  } catch (error) {
    console.error('Create sample simple thread error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

createSampleSimpleThread();