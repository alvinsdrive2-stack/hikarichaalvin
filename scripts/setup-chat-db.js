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
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);

    console.log('📄 Reading chat tables SQL file...');
    const sqlFilePath = path.join(__dirname, '..', 'create-chat-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('🚀 Creating chat tables...');

    // Create tables manually to ensure proper execution
    const tableStatements = [
      `CREATE TABLE IF NOT EXISTS chat_conversations (
        id VARCHAR(255) PRIMARY KEY,
        type ENUM('DIRECT', 'GROUP') NOT NULL DEFAULT 'DIRECT',
        name VARCHAR(255),
        created_by VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_message_at TIMESTAMP NULL,
        last_message_content TEXT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        INDEX idx_created_by (created_by),
        INDEX idx_type (type),
        INDEX idx_created_at (created_at),
        INDEX idx_updated_at (updated_at),
        INDEX idx_last_message_at (last_message_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS chat_participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        role ENUM('MEMBER', 'ADMIN') DEFAULT 'MEMBER',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_read_at TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE,
        is_muted BOOLEAN DEFAULT FALSE,
        UNIQUE KEY unique_participant (conversation_id, user_id),
        FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        INDEX idx_conversation_id (conversation_id),
        INDEX idx_user_id (user_id),
        INDEX idx_joined_at (joined_at),
        INDEX idx_last_read_at (last_read_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS chat_messages (
        id VARCHAR(255) PRIMARY KEY,
        conversation_id VARCHAR(255) NOT NULL,
        sender_id VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type ENUM('TEXT', 'IMAGE', 'FILE', 'VOICE', 'SYSTEM') DEFAULT 'TEXT',
        file_url VARCHAR(512) NULL,
        file_name VARCHAR(255) NULL,
        file_size INT NULL,
        file_type VARCHAR(100) NULL,
        reply_to VARCHAR(255) NULL,
        is_edited BOOLEAN DEFAULT FALSE,
        edited_at TIMESTAMP NULL,
        is_deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES user(id) ON DELETE CASCADE,
        INDEX idx_conversation_id (conversation_id),
        INDEX idx_sender_id (sender_id),
        INDEX idx_created_at (created_at),
        INDEX idx_reply_to (reply_to),
        INDEX idx_type (type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS chat_message_reactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        message_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        reaction VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_reaction (message_id, user_id, reaction),
        FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        INDEX idx_message_id (message_id),
        INDEX idx_user_id (user_id),
        INDEX idx_reaction (reaction)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS chat_typing_indicators (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        is_typing BOOLEAN DEFAULT TRUE,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_typing (conversation_id, user_id),
        FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        INDEX idx_conversation_id (conversation_id),
        INDEX idx_user_id (user_id),
        INDEX idx_updated_at (updated_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    ];

    for (const statement of tableStatements) {
      console.log(`📝 Creating table: ${statement.match(/CREATE TABLE.*?(\w+)/)[1]}...`);
      await connection.execute(statement);
    }

    console.log('✅ Chat tables created successfully!');

    // Get real user IDs for sample data
    const [realUsers] = await connection.execute('SELECT id FROM user LIMIT 2');
    if (realUsers.length < 2) {
      throw new Error('Need at least 2 users in database to create sample chat data');
    }

    const user1 = realUsers[0].id;
    const user2 = realUsers[1].id;
    console.log(`👥 Using users: ${user1} and ${user2} for sample data`);

    // Add sample data
    console.log('📝 Adding sample data...');

    await connection.execute(`
      INSERT INTO chat_conversations (id, type, created_by) VALUES
      ('conv_direct_1', 'DIRECT', ?),
      ('conv_group_1', 'GROUP', ?),
      ('conv_group_2', 'GROUP', ?)
      ON DUPLICATE KEY UPDATE id=id
    `, [user1, user1, user2]);

    await connection.execute(`
      INSERT INTO chat_conversations (id, type, name, created_by) VALUES
      ('conv_group_1', 'GROUP', 'Team HikariCha', ?),
      ('conv_group_2', 'GROUP', 'Developers', ?)
      ON DUPLICATE KEY UPDATE name=name
    `, [user1, user2]);

    await connection.execute(`
      INSERT INTO chat_participants (conversation_id, user_id, role) VALUES
      ('conv_direct_1', ?, 'MEMBER'),
      ('conv_direct_1', ?, 'MEMBER'),
      ('conv_group_1', ?, 'ADMIN'),
      ('conv_group_1', ?, 'MEMBER'),
      ('conv_group_2', ?, 'ADMIN'),
      ('conv_group_2', ?, 'MEMBER')
      ON DUPLICATE KEY UPDATE role=role
    `, [user1, user2, user1, user2, user2, user1]);

    await connection.execute(`
      INSERT INTO chat_messages (id, conversation_id, sender_id, content, type, created_at) VALUES
      ('msg_1', 'conv_direct_1', ?, 'Hello! How are you?', 'TEXT', NOW()),
      ('msg_2', 'conv_direct_1', ?, 'I\\'m doing great! Thanks for asking.', 'TEXT', NOW()),
      ('msg_3', 'conv_group_1', ?, 'Welcome to the team chat!', 'TEXT', NOW()),
      ('msg_4', 'conv_group_1', ?, 'Excited to be here! 🎉', 'TEXT', NOW())
      ON DUPLICATE KEY UPDATE content=content
    `, [user1, user2, user1, user2]);

    // Verify tables were created
    const [tables] = await connection.execute("SHOW TABLES LIKE 'chat_%'");
    console.log(`📊 Found ${tables.length} chat tables:`);
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });

    // Test sample data
    const [conversations] = await connection.execute('SELECT COUNT(*) as count FROM chat_conversations');
    console.log(`💬 Sample conversations: ${conversations[0].count}`);

    const [messages] = await connection.execute('SELECT COUNT(*) as count FROM chat_messages');
    console.log(`📨 Sample messages: ${messages[0].count}`);

  } catch (error) {
    console.error('❌ Error setting up chat database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed.');
    }
  }
}

setupChatDatabase();