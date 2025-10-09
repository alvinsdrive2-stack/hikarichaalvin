-- Create missing tables for friend system

-- Create friendship table if not exists
CREATE TABLE IF NOT EXISTS `friendship` (
  `id` VARCHAR(191) NOT NULL,
  `user1Id` VARCHAR(191) NOT NULL,
  `user2Id` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `friendship_user1Id_user2Id_key`(`user1Id`, `user2Id`),
  FOREIGN KEY (`user1Id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`user2Id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create friendrequest table if not exists
CREATE TABLE IF NOT EXISTS `friendrequest` (
  `id` VARCHAR(191) NOT NULL,
  `senderId` VARCHAR(191) NOT NULL,
  `receiverId` VARCHAR(191) NOT NULL,
  `status` ENUM('PENDING', 'ACCEPTED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE INDEX `friendrequest_senderId_receiverId_key`(`senderId`, `receiverId`),
  FOREIGN KEY (`senderId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`receiverId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create userstatus table if not exists
CREATE TABLE IF NOT EXISTS `userstatus` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `status` ENUM('ONLINE', 'AWAY', 'BUSY', 'OFFLINE') NOT NULL DEFAULT 'OFFLINE',
  `lastSeen` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `userstatus_userId_key`(`userId`),
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create activity table if not exists
CREATE TABLE IF NOT EXISTS `activity` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `metadata` TEXT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create other missing tables if needed
CREATE TABLE IF NOT EXISTS `userprofile` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `bio` TEXT,
  `location` VARCHAR(191),
  `website` VARCHAR(191),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `userprofile_userId_key`(`userId`),
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pointtransaction` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `amount` INT NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `border` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT,
  `imageUrl` VARCHAR(191),
  `rarity` VARCHAR(191) NOT NULL,
  `cost` INT NOT NULL,
  `isAnimated` BOOLEAN NOT NULL DEFAULT false,
  `cssClass` VARCHAR(191),
  `cssStyle` TEXT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `borderunlock` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `borderId` VARCHAR(191) NOT NULL,
  `unlockedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `borderunlock_userId_borderId_key`(`userId`, `borderId`),
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`borderId`) REFERENCES `border`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add missing columns to user table if they don't exist
ALTER TABLE `user`
ADD COLUMN IF NOT EXISTS `bio` TEXT,
ADD COLUMN IF NOT EXISTS `customStatus` VARCHAR(191),
ADD COLUMN IF NOT EXISTS `location` VARCHAR(191),
ADD COLUMN IF NOT EXISTS `points` INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS `friendCount` INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS `followerCount` INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS `followingCount` INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS `postCount` INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS `selectedBorder` VARCHAR(191),
ADD COLUMN IF NOT EXISTS `privacySettings` TEXT,
ADD COLUMN IF NOT EXISTS `notificationSettings` TEXT;