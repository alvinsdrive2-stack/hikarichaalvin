-- SQL Script to remove redundant author fields from forum tables
-- Run this script manually in your MySQL database

-- Remove redundant author fields from forum_replies table
ALTER TABLE forum_replies
DROP COLUMN author_name,
DROP COLUMN author_avatar,
DROP COLUMN author_border;

-- Remove redundant author fields from forum_threads table
ALTER TABLE forum_threads
DROP COLUMN author_name,
DROP COLUMN author_avatar,
DROP COLUMN author_border;

-- Show updated table structures
DESCRIBE forum_threads;
DESCRIBE forum_replies;