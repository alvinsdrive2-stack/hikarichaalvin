-- Create missing tables for social system

-- Create post_like table if not exists
CREATE TABLE IF NOT EXISTS `post_like` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `postId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `post_like_userId_postId_key`(`userId`, `postId`),
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`postId`) REFERENCES `social_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create post_save table if not exists
CREATE TABLE IF NOT EXISTS `post_save` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `postId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `post_save_userId_postId_key`(`userId`, `postId`),
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`postId`) REFERENCES `social_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create social_shares table if not exists
CREATE TABLE IF NOT EXISTS `social_shares` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `postId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`postId`) REFERENCES `social_post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Update social_post table if needed
ALTER TABLE `social_post`
ADD COLUMN IF NOT EXISTS `attachments` TEXT,
ADD COLUMN IF NOT EXISTS `visibility` VARCHAR(50) NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN IF NOT EXISTS `likesCount` INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS `commentsCount` INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS `sharesCount` INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS `authorId` VARCHAR(191) NOT NULL AFTER `id`;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS `idx_social_post_authorId` ON `social_post`(`authorId`);
CREATE INDEX IF NOT EXISTS `idx_social_post_createdAt` ON `social_post`(`createdAt`);
CREATE INDEX IF NOT EXISTS `idx_post_like_userId` ON `post_like`(`userId`);
CREATE INDEX IF NOT EXISTS `idx_post_like_postId` ON `post_like`(`postId`);
CREATE INDEX IF NOT EXISTS `idx_post_save_userId` ON `post_save`(`userId`);
CREATE INDEX IF NOT EXISTS `idx_post_save_postId` ON `post_save`(`postId`);
CREATE INDEX IF NOT EXISTS `idx_social_shares_userId` ON `social_shares`(`userId`);
CREATE INDEX IF NOT EXISTS `idx_social_shares_postId` ON `social_shares`(`postId`);

-- Update user table with social counts
ALTER TABLE `user`
ADD COLUMN IF NOT EXISTS `followerCount` INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS `followingCount` INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS `postCount` INT NOT NULL DEFAULT 0;

-- Add indexes for friendship table
CREATE INDEX IF NOT EXISTS `idx_friendship_user1Id` ON `friendship`(`user1Id`);
CREATE INDEX IF NOT EXISTS `idx_friendship_user2Id` ON `friendship`(`user2Id`);