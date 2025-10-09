// Create Sample Rich Text Thread
const mysql = require('mysql2/promise');

async function createSampleRichThread() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    });

    console.log('Connected to database');

    // Rich HTML content for sample thread
    const richContent = `
<h2>🍵 Panduan Lengkap Menyeduh Matcha untuk Pemula</h2>

<p>Halo teman-teman matcha lovers! Hari ini saya mau share tutorial <strong>super lengkap</strong> cara menyeduh matcha yang benar, dari pemula sampai bisa seperti master tea!</p>

<h3>📋 Bahan-bahan yang Diperlukan:</h3>
<ul>
<li><strong>Matcha Powder (1-2 gram)</strong> - Pilih ceremonial grade untuk hasil terbaik</li>
<li><strong>Air Panas (70-80°C)</strong> - JANGAN pakai air mendidih ya!</li>
<li><strong>Chawan</strong> - Mangkuk khas Jepang</li>
<li><strong>Chasen</strong> - Whisk bambu dengan 100+ gigi</li>
<li><strong>Chashaku</strong> - Sendok bambu (opsional)</li>
</ul>

<h3>🔥 Langkah demi Langkah:</h3>
<ol>
<li><strong>Sift Matcha</strong> - Masukkan matcha ke sifter, haluskan biar ga ada gumpalan</li>
<li><strong>Tambah Air Sedikit</strong> - 50ml dulu, aduk jadi pasta</li>
<li><strong>Whisk Kencang</strong> - Gerakan W atau M, 30-60 detik sampai foam</li>
<li><strong>Tambah Air Lagi</strong> - Tambahkan sisa air (total 100-150ml)</li>
<li><strong>Whisk Lagi</strong> - Sampai foam berbuih lembut</li>
<li><strong>Sajikan</strong> - Nikmati segera selagi hangat!</li>
</ol>

<blockquote>
<p><em>"The secret to perfect matcha is patience and the right water temperature. Never rush the process."</em> - Tea Master Kenji Yamamoto</p>
</blockquote>

<h3>💡 Tips & Tricks:</h3>
<ul>
<li>🌡️ <strong>Suhu Air Penting!</strong> 70-80°C = sempurna, 90°C+ = pahit</li>
<li>🫧 <strong>Foam Quality</strong> Semakin halus foam, semakin bagus quality matcha</li>
<li>⏰ <strong>Timing</strong> Jangan disimpan terlalu lama, max 5 menit setelah dibuat</li>
</ul>

<h3>❌ Kesalahan Umum:</h3>
<ul>
<li>❌ Pakai air mendidih (100°C) - jadi pahit!</li>
<li>❌ Ngga di-sift - ada gumpalan</li>
<li>❌ Whisk terlalu pelan - foam ga bagus</li>
<li>❌ Dibiarkan terlalu lama - oksidasi</li>
</ul>

<h3>🎥 Tutorial Video:</h3>
<p>Buat yang lebih suka liat video, ini tutorial lengkap dari master tea Jepang:</p>
<p><a href="https://www.youtube.com/watch?v=example" target="_blank">🎬 <strong>Klik: Complete Matcha Tutorial</strong></a></p>

<h3>🏆 Challenge untuk Pemula:</h3>
<p>Coba buat matcha latte sendiri di rumah! Share hasilnya di thread ini ya:</p>
<ul>
<li>✅ Pake matcha yang kamu punya</li>
<li>✅ Ikutin step di atas</li>
<li>✅ Foto hasilnya</li>
<li>✅ Share pengalaman kamu</li>
</ul>

<p>Semoga berhasil! Jangan lupa share di comment kalo ada pertanyaan 🍵✨</p>

<hr>

<p><small><em>#MatchaTutorial #TeaLover #PemulaGuide</em></small></p>
    `;

    const threadId = `rich_${Date.now()}`;

    await connection.execute(`
      INSERT INTO forum_threads (
        id, title, content, excerpt, category_id,
        author_id, author_name, author_avatar, author_border,
        is_pinned, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      threadId,
      '🍵 Panduan Lengkap Menyeduh Matcha untuk Pemula [Rich Text]',
      richContent,
      'Tutorial lengkap cara menyeduh matcha yang benar untuk pemula, lengkap dengan tips, video, dan challenge!',
      2, // teknik-seduh
      'user_demo',
      'Matcha Expert',
      '/avatars/demo.jpg',
      'gold',
      true // Pin this rich text thread
    ]);

    console.log('✅ Sample rich text thread created successfully!');
    console.log(`   🆔 Thread ID: ${threadId}`);
    console.log('   🔗 URL: http://localhost:3000/forum/thread/' + threadId);
    console.log('   📝 Content includes: headings, lists, bold text, blockquotes, links, and more!');

  } catch (error) {
    console.error('Create sample thread error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

createSampleRichThread();