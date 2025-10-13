-- Chat System Database Schema
-- Created for HikariCha Real-time Chat System
-- Date: October 13, 2025

USE hikariCha_db;

-- Table for storing conversations (both direct and group)
CREATE TABLE IF NOT EXISTS chat_conversations (
  id VARCHAR(255) PRIMARY KEY,
  type ENUM('DIRECT', 'GROUP') NOT NULL DEFAULT 'DIRECT',
  name VARCHAR(255), -- Only for group chats
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP NULL,
  last_message_content TEXT NULL,
  is_active BOOLEAN DEFAULT TRUE,

  INDEX idx_created_by (created_by),
  idx_type (type),
  idx_created_at (created_at),
  idx_updated_at (updated_at),
  idx_last_message_at (last_message_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for conversation participants
CREATE TABLE IF NOT EXISTS chat_participants (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for storing messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id VARCHAR(255) PRIMARY KEY,
  conversation_id VARCHAR(255) NOT NULL,
  sender_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('TEXT', 'IMAGE', 'FILE', 'VOICE', 'SYSTEM') DEFAULT 'TEXT',
  file_url VARCHAR(512) NULL,
  file_name VARCHAR(255) NULL,
  file_size INT NULL,
  file_type VARCHAR(100) NULL,
  reply_to VARCHAR(255) NULL, -- Message ID this is replying to
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES user(id) ON DELETE CASCADE,
  INDEX idx_conversation_id (conversation_id),
  idx_sender_id (sender_id),
  idx_created_at (created_at),
  idx_reply_to (reply_to),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for message reactions (likes, emojis)
CREATE TABLE IF NOT EXISTS chat_message_reactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  reaction VARCHAR(50) NOT NULL, -- Emoji character
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY unique_reaction (message_id, user_id, reaction),
  FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  INDEX idx_message_id (message_id),
  INDEX idx_user_id (user_id),
  INDEX idx_reaction (reaction)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for tracking typing indicators
CREATE TABLE IF NOT EXISTS chat_typing_indicators (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some sample data for testing
INSERT INTO chat_conversations (id, type, created_by) VALUES
('conv_direct_1', 'DIRECT', 'user1'),
('conv_group_1', 'GROUP', 'user1'),
('conv_group_2', 'GROUP', 'user2');

INSERT INTO chat_conversations (id, type, name, created_by) VALUES
('conv_group_1', 'GROUP', 'Team HikariCha', 'user1'),
('conv_group_2', 'GROUP', 'Developers', 'user2');

INSERT INTO chat_participants (conversation_id, user_id, role) VALUES
('conv_direct_1', 'user1', 'MEMBER'),
('conv_direct_1', 'user2', 'MEMBER'),
('conv_group_1', 'user1', 'ADMIN'),
('conv_group_1', 'user2', 'MEMBER'),
('conv_group_2', 'user2', 'ADMIN'),
('conv_group_2', 'user1', 'MEMBER');

-- Insert sample messages
INSERT INTO chat_messages (id, conversation_id, sender_id, content, type, created_at) VALUES
('msg_1', 'conv_direct_1', 'user1', 'Hello! How are you?', 'TEXT', NOW()),
('msg_2', 'conv_direct_1', 'user2', 'I\'m doing great! Thanks for asking.', 'TEXT', NOW()),
('msg_3', 'conv_group_1', 'user1', 'Welcome to the team chat!', 'TEXT', NOW()),
('msg_4', 'conv_group_1', 'user2', 'Excited to be here! 🎉', 'TEXT', NOW());