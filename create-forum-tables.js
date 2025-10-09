const mysql = require('mysql2/promise');

async function createForumTables() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    });

    console.log('Connected to database');

    // Create forum_categories table
    console.log('Creating forum_categories table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS forum_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        color VARCHAR(20) DEFAULT 'gray',
        icon VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ forum_categories table created');

    // Create forum_threads table
    console.log('Creating forum_threads table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS forum_threads (
        id VARCHAR(20) PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        excerpt VARCHAR(500),
        category_id INT NOT NULL,
        author_id VARCHAR(50) NOT NULL,
        author_name VARCHAR(100) NOT NULL,
        author_avatar VARCHAR(255),
        author_border VARCHAR(50),
        views INT DEFAULT 0,
        likes INT DEFAULT 0,
        replies INT DEFAULT 0,
        is_pinned BOOLEAN DEFAULT FALSE,
        is_locked BOOLEAN DEFAULT FALSE,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_reply_at TIMESTAMP NULL,
        last_reply_by VARCHAR(50) NULL,
        FOREIGN KEY (category_id) REFERENCES forum_categories(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ forum_threads table created');

    // Create forum_replies table
    console.log('Creating forum_replies table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS forum_replies (
        id VARCHAR(20) PRIMARY KEY,
        thread_id VARCHAR(20) NOT NULL,
        parent_id VARCHAR(20) NULL,
        content TEXT NOT NULL,
        author_id VARCHAR(50) NOT NULL,
        author_name VARCHAR(100) NOT NULL,
        author_avatar VARCHAR(255),
        author_border VARCHAR(50),
        likes INT DEFAULT 0,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (thread_id) REFERENCES forum_threads(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES forum_replies(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ forum_replies table created');

    // Create forum_likes table
    console.log('Creating forum_likes table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS forum_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        target_id VARCHAR(20) NOT NULL,
        target_type ENUM('thread', 'reply') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (user_id, target_id, target_type),
        INDEX idx_target (target_id, target_type),
        INDEX idx_user (user_id)
      )
    `);
    console.log('✅ forum_likes table created');

    // Create forum_views table
    console.log('Creating forum_views table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS forum_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50) NULL,
        thread_id VARCHAR(20) NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        user_agent TEXT,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_thread_user (thread_id, user_id),
        INDEX idx_thread_ip (thread_id, ip_address),
        FOREIGN KEY (thread_id) REFERENCES forum_threads(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ forum_views table created');

    // Insert default categories
    console.log('Inserting default categories...');
    const categories = [
      { slug: 'manfaat', name: 'Manfaat Kesehatan', description: 'Diskusi tentang manfaat matcha untuk kesehatan', color: 'green', icon: 'heart' },
      { slug: 'teknik-seduh', name: 'Teknik Seduh', description: 'Berbagi teknik dan cara menyeduh matcha', color: 'blue', icon: 'coffee' },
      { slug: 'ulasan-produk', name: 'Ulasan Produk', description: 'Review dan ulasan produk matcha', color: 'purple', icon: 'star' },
      { slug: 'resep', name: 'Resep', description: 'Berbagi resep matcha dan kreasi minuman', color: 'orange', icon: 'book' }
    ];

    for (const category of categories) {
      await connection.execute(`
        INSERT IGNORE INTO forum_categories (slug, name, description, color, icon)
        VALUES (?, ?, ?, ?, ?)
      `, [category.slug, category.name, category.description, category.color, category.icon]);
    }
    console.log('✅ Default categories inserted');

    // Insert sample threads
    console.log('Inserting sample threads...');
    const sampleThreads = [
      {
        id: 't1',
        title: 'Ceremonial vs Culinary: apa bedanya?',
        content: 'Saya sering bingung saat memilih matcha. Apa sih perbedaan utama antara matcha ceremonial grade dan culinary grade? Apakah harga yang jauh lebih mahal sepadan dengan kualitasnya?',
        excerpt: 'Saya sering bingung saat memilih matcha. Apa sih perbedaan utama antara matcha ceremonial grade dan culinary grade?',
        category_id: 3, // ulasan-produk
        author_id: 'user1',
        author_name: 'Natsumi Tanaka',
        author_avatar: '/avatars/natsumi.jpg',
        author_border: 'gold',
        is_pinned: true
      },
      {
        id: 't2',
        title: 'Cara bikin latte matcha yang creamy',
        content: 'Setelah mencoba berbagai resep, akhirnya saya menemukan teknik yang pas untuk latte matcha yang creamy dan tidak pahit. Berbagi tips di sini...',
        excerpt: 'Setelah mencoba berbagai resep, akhirnya saya menemukan teknik yang pas untuk latte matcha yang creamy dan tidak pahit.',
        category_id: 4, // resep
        author_id: 'user2',
        author_name: 'Bima Santoso',
        author_avatar: '/avatars/bima.jpg',
        author_border: 'silver'
      },
      {
        id: 't3',
        title: 'Manfaat L-theanine untuk fokus',
        content: 'Ternyata L-theanine dalam matcha memiliki banyak manfaat untuk kesehatan otak. Saya merasakan peningkatan fokus yang signifikan setelah rutin minum matcha...',
        excerpt: 'Ternyata L-theanine dalam matcha memiliki banyak manfaat untuk kesehatan otak.',
        category_id: 1, // manfaat
        author_id: 'user3',
        author_name: 'Ayu Wijaya',
        author_avatar: '/avatars/ayu.jpg',
        author_border: 'bronze'
      }
    ];

    for (const thread of sampleThreads) {
      await connection.execute(`
        INSERT IGNORE INTO forum_threads
        (id, title, content, excerpt, category_id, author_id, author_name, author_avatar, author_border, is_pinned)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        thread.id, thread.title, thread.content, thread.excerpt, thread.category_id,
        thread.author_id, thread.author_name, thread.author_avatar, thread.author_border, thread.is_pinned || false
      ]);
    }
    console.log('✅ Sample threads inserted');

    console.log('\n🎉 Forum database setup completed successfully!');

  } catch (error) {
    console.error('Database setup error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

createForumTables();