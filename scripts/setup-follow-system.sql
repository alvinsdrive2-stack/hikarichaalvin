-- Setup Follow System Database Script
-- This script creates the proper follow system separate from friendship system

-- Create user_follow table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_follow (
    id VARCHAR(255) PRIMARY KEY,
    followerId VARCHAR(255) NOT NULL,
    followingId VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraints
    FOREIGN KEY (followerId) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (followingId) REFERENCES user(id) ON DELETE CASCADE,

    -- Ensure a user can only follow another user once
    UNIQUE KEY unique_follow (followerId, followingId),

    -- Prevent self-follow
    CHECK (followerId != followingId)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_follow_follower ON user_follow(followerId);
CREATE INDEX IF NOT EXISTS idx_user_follow_following ON user_follow(followingId);
CREATE INDEX IF NOT EXISTS idx_user_follow_createdAt ON user_follow(createdAt);

-- Add followerCount and followingCount columns to user table if they don't exist
ALTER TABLE user
ADD COLUMN IF NOT EXISTS followerCount INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS followingCount INT DEFAULT 0;

-- Create triggers to automatically update follower/following counts
DELIMITER //

-- Trigger to increment followingCount when user follows someone
DROP TRIGGER IF EXISTS increment_following_count//
CREATE TRIGGER increment_following_count
AFTER INSERT ON user_follow
FOR EACH ROW
BEGIN
    UPDATE user
    SET followingCount = followingCount + 1
    WHERE id = NEW.followerId;

    UPDATE user
    SET followerCount = followerCount + 1
    WHERE id = NEW.followingId;
END//

-- Trigger to decrement followingCount when user unfollows someone
DROP TRIGGER IF EXISTS decrement_following_count//
CREATE TRIGGER decrement_following_count
AFTER DELETE ON user_follow
FOR EACH ROW
BEGIN
    UPDATE user
    SET followingCount = GREATEST(followingCount - 1, 0)
    WHERE id = OLD.followerId;

    UPDATE user
    SET followerCount = GREATEST(followerCount - 1, 0)
    WHERE id = OLD.followingId;
END//

DELIMITER ;

-- Migrate existing friendship data to user_follow if needed
-- This will convert existing friendships to follows (one-way relationship)
INSERT IGNORE INTO user_follow (id, followerId, followingId, createdAt)
SELECT
    CONCAT('follow_', UNIX_TIMESTAMP(), '_', user1Id, '_', user2Id) as id,
    user1Id as followerId,
    user2Id as followingId,
    createdAt
FROM friendship
WHERE user1Id != user2Id;

-- Update follower/following counts based on existing follows
UPDATE user u
SET followerCount = (
    SELECT COUNT(*)
    FROM user_follow uf
    WHERE uf.followingId = u.id
);

UPDATE user u
SET followingCount = (
    SELECT COUNT(*)
    FROM user_follow uf
    WHERE uf.followerId = u.id
);

-- Verify setup
SELECT 'Follow system setup completed!' as message;

-- Show current stats
SELECT
    'user_follow table count' as table_name,
    COUNT(*) as record_count
FROM user_follow

UNION ALL

SELECT
    'Users with followers' as description,
    COUNT(*) as count
FROM user
WHERE followerCount > 0

UNION ALL

SELECT
    'Users with following' as description,
    COUNT(*) as count
FROM user
WHERE followingCount > 0;