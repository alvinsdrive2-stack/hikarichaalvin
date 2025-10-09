-- SQL Script to fix ID length issue in forum tables
-- Run this script manually in your MySQL database

-- Increase ID column length in forum_threads
ALTER TABLE forum_threads
MODIFY COLUMN id VARCHAR(50) NOT NULL;

-- Increase ID column length in forum_replies
ALTER TABLE forum_replies
MODIFY COLUMN id VARCHAR(50) NOT NULL;

-- Increase foreign key columns that reference thread/reply IDs
ALTER TABLE forum_replies
MODIFY COLUMN thread_id VARCHAR(50) NOT NULL;

ALTER TABLE forum_replies
MODIFY COLUMN parent_id VARCHAR(50) NULL;

ALTER TABLE forum_likes
MODIFY COLUMN target_id VARCHAR(50) NOT NULL;

ALTER TABLE forum_views
MODIFY COLUMN thread_id VARCHAR(20) NOT NULL;

-- Show updated table structures
DESCRIBE forum_threads;
DESCRIBE forum_replies;
DESCRIBE forum_likes;
DESCRIBE forum_views;