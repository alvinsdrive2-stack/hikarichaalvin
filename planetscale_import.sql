-- HikariCha Database Export
-- Ready for PlanetScale import
-- Generated: 2025-10-16T14:39:10.678Z

-- Table structure for _prisma_migrations
DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

-- Data for table _prisma_migrations
INSERT INTO `_prisma_migrations` VALUES
('2ba1204f-0fbc-43c4-b971-5704da3842b0', '7ce253ed1af9a50c0df840dbce1debe96e637e3dba43823b80542fbba17f77de', '2025-10-07 12:04:27', '20251007171648_add_profile_fields', NULL, NULL, '2025-10-07 12:04:26', 1),
('91a66d79-1346-42c5-b64e-d898f6446842', '3671e4ebac824cd10845857b852e8803dbf739cbabc93aa2d7c05ee6c719a898', '2025-10-07 12:04:26', '20251007160657_init', NULL, NULL, '2025-10-07 12:04:26', 1);

-- Table structure for achievement
DROP TABLE IF EXISTS `achievement`;
CREATE TABLE `achievement` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` enum('FIRST_FORUM_POST','FORUM_REGULAR','RECIPE_CREATOR','SOCIAL_BUTTERFLY','EXPLORER','EARLY_ADOPTER','PURCHASE_MASTER','BORDER_COLLECTOR','POINTS_COLLECTOR','DAILY_VISITOR','RECIPE_MASTER','FORUM_EXPERT','COMMENTATOR_PRO','ACTIVE_MEMBER','FRIEND_COLLECTOR','SOCIAL_INFLUENCER','CHAT_MASTER','POST_CHAMPION','POPULAR_USER','COMMUNITY_LEADER') NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `targetValue` int(11) NOT NULL,
  `currentValue` int(11) NOT NULL DEFAULT 0,
  `isCompleted` tinyint(1) NOT NULL DEFAULT 0,
  `completedAt` datetime(3) DEFAULT NULL,
  `rewards` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`rewards`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Achievement_userId_type_key` (`userId`,`type`),
  KEY `idx_achievement_user_id` (`userId`),
  KEY `idx_achievement_type` (`type`),
  KEY `idx_achievement_created_at` (`createdAt`),
  KEY `idx_achievement_completed` (`isCompleted`),
  KEY `idx_achievement_progress` (`userId`,`type`,`isCompleted`),
  CONSTRAINT `Achievement_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Data for table achievement
INSERT INTO `achievement` VALUES
('ach_cmggz5ihr007z1hus4ww2mocp_FRIEND_CONNECTOR', 'cmggz5ihr007z1hus4ww2mocp', '', 'Konektor Pertemanan', 'Buat 5 koneksi pertemanan', 5, 0, 0, NULL, '{"points":30,"borderUnlocks":["Silver"]}', '2025-10-13 05:26:22', '2025-10-13 05:26:22'),
('ach_test_user_achievement_001_ACTIVE_MEMBER', 'test_user_achievement_001', 'ACTIVE_MEMBER', 'Active Member', 'Aktif selama 30 hari', 30, 0, 0, NULL, '{"points":100,"borderUnlocks":["Gold"]}', '2025-10-10 14:38:48', '2025-10-10 14:38:48'),
('ach_test_user_achievement_001_BORDER_COLLECTOR', 'test_user_achievement_001', 'BORDER_COLLECTOR', 'Border Collector', 'Kumpulkan semua border', 6, 0, 0, NULL, '{"points":200,"borderUnlocks":["Diamond"]}', '2025-10-10 14:38:48', '2025-10-10 14:38:48'),
('ach_test_user_achievement_001_COMMENTATOR_PRO', 'test_user_achievement_001', 'COMMENTATOR_PRO', 'Commentator Pro', 'Buat 100 komentar', 100, 0, 0, NULL, '{"points":200,"borderUnlocks":["Crystal"]}', '2025-10-10 14:38:48', '2025-10-10 14:38:48'),
('ach_test_user_achievement_001_DAILY_VISITOR', 'test_user_achievement_001', 'DAILY_VISITOR', 'Daily Visitor', 'Login 7 hari berturut-turut', 7, 0, 0, NULL, '{"points":50,"borderUnlocks":["Silver"]}', '2025-10-10 14:38:48', '2025-10-10 14:38:48'),
('ach_test_user_achievement_001_EARLY_ADOPTER', 'test_user_achievement_001', 'EARLY_ADOPTER', 'Early Adopter', 'Bergabung dalam minggu pertama', 1, 0, 0, NULL, '{"points":25,"borderUnlocks":["Bronze"]}', '2025-10-10 14:38:48', '2025-10-10 14:38:48'),
('ach_test_user_achievement_001_FIRST_FORUM_POST', 'test_user_achievement_001', 'FIRST_FORUM_POST', 'Poster Pertama', 'Buat postingan forum pertama Anda', 1, 0, 0, NULL, '{"points":10,"borderUnlocks":["Bronze"]}', '2025-10-10 14:38:48', '2025-10-10 14:38:48'),
('ach_test_user_achievement_001_FORUM_EXPERT', 'test_user_achievement_001', 'FORUM_EXPERT', 'Forum Expert', 'Buat 100 postingan forum', 100, 0, 0, NULL, '{"points":300,"borderUnlocks":["Diamond"]}', '2025-10-10 14:38:48', '2025-10-10 14:38:48'),
('ach_test_user_achievement_001_FORUM_REGULAR', 'test_user_achievement_001', 'FORUM_REGULAR', 'Pembicara Aktif', 'Buat 10 postingan forum', 10, 0, 0, NULL, '{"points":50,"borderUnlocks":["Silver"]}', '2025-10-10 14:38:48', '2025-10-10 14:38:48'),
('ach_test_user_achievement_001_FRIEND_CONNECTOR', 'test_user_achievement_001', '', 'Konektor Pertemanan', 'Buat 5 koneksi pertemanan', 5, 0, 0, NULL, '{"points":30,"borderUnlocks":["Silver"]}', '2025-10-10 14:38:48', '2025-10-10 14:38:48'),
('ach_test_user_achievement_001_POINTS_COLLECTOR', 'test_user_achievement_001', 'POINTS_COLLECTOR', 'Poin Hunter', 'Kumpulkan 1000 poin', 1000, 0, 0, NULL, '{"points":100,"borderUnlocks":["Diamond"]}', '2025-10-10 14:38:48', '2025-10-10 14:38:48'),
('ach_test_user_achievement_001_SOCIAL_BUTTERFLY', 'test_user_achievement_001', 'SOCIAL_BUTTERFLY', 'Pendengar Baik', 'Buat 20 komentar di forum', 20, 0, 0, NULL, '{"points":40,"borderUnlocks":["Crystal"]}', '2025-10-10 14:38:48', '2025-10-10 14:38:48'),
('ach_user_1759884167043_vvrak6mmo_ACTIVE_MEMBER', 'user_1759884167043_vvrak6mmo', 'ACTIVE_MEMBER', 'Active Member', 'Aktif selama 30 hari', 30, 0, 0, NULL, '{"points":100,"borderUnlocks":["Gold"]}', '2025-10-07 17:43:13', '2025-10-07 17:43:13'),
('ach_user_1759884167043_vvrak6mmo_BORDER_COLLECTOR', 'user_1759884167043_vvrak6mmo', 'BORDER_COLLECTOR', 'Border Collector', 'Kumpulkan semua border', 6, 0, 0, NULL, '{"points":200,"borderUnlocks":["Diamond"]}', '2025-10-07 17:43:13', '2025-10-07 17:43:13'),
('ach_user_1759884167043_vvrak6mmo_COMMENTATOR_PRO', 'user_1759884167043_vvrak6mmo', 'COMMENTATOR_PRO', 'Commentator Pro', 'Buat 100 komentar', 100, 0, 0, NULL, '{"points":200,"borderUnlocks":["Crystal"]}', '2025-10-07 17:43:13', '2025-10-07 17:43:13'),
('ach_user_1759884167043_vvrak6mmo_DAILY_VISITOR', 'user_1759884167043_vvrak6mmo', 'DAILY_VISITOR', 'Daily Visitor', 'Login 7 hari berturut-turut', 7, 2, 0, NULL, '{"points":50,"borderUnlocks":["Silver"]}', '2025-10-07 17:43:13', '2025-10-09 23:26:22'),
('ach_user_1759884167043_vvrak6mmo_EARLY_ADOPTER', 'user_1759884167043_vvrak6mmo', 'EARLY_ADOPTER', 'Early Adopter', 'Bergabung dalam minggu pertama', 1, 0, 0, NULL, '{"points":25,"borderUnlocks":["Bronze"]}', '2025-10-07 17:43:13', '2025-10-07 17:43:13'),
('ach_user_1759884167043_vvrak6mmo_FIRST_FORUM_POST', 'user_1759884167043_vvrak6mmo', 'FIRST_FORUM_POST', 'Poster Pertama', 'Buat postingan forum pertama Anda', 1, 0, 0, NULL, '{"points":10,"borderUnlocks":["Bronze"]}', '2025-10-07 17:43:13', '2025-10-07 17:43:13'),
('ach_user_1759884167043_vvrak6mmo_FORUM_EXPERT', 'user_1759884167043_vvrak6mmo', 'FORUM_EXPERT', 'Forum Expert', 'Buat 100 postingan forum', 100, 0, 0, NULL, '{"points":300,"borderUnlocks":["Diamond"]}', '2025-10-07 17:43:13', '2025-10-07 17:43:13'),
('ach_user_1759884167043_vvrak6mmo_FORUM_REGULAR', 'user_1759884167043_vvrak6mmo', 'FORUM_REGULAR', 'Pembicara Aktif', 'Buat 10 postingan forum', 10, 2, 0, NULL, '{"points":50,"borderUnlocks":["Silver"]}', '2025-10-07 17:43:13', '2025-10-09 23:36:26'),
('ach_user_1759884167043_vvrak6mmo_FRIEND_CONNECTOR', 'user_1759884167043_vvrak6mmo', '', 'Konektor Pertemanan', 'Buat 5 koneksi pertemanan', 5, 0, 0, NULL, '{"points":30,"borderUnlocks":["Silver"]}', '2025-10-10 14:44:22', '2025-10-10 14:44:22'),
('ach_user_1759884167043_vvrak6mmo_POINTS_COLLECTOR', 'user_1759884167043_vvrak6mmo', 'POINTS_COLLECTOR', 'Poin Hunter', 'Kumpulkan 1000 poin', 1000, 1000, 1, '2025-10-09 16:26:34', '{"points":100,"borderUnlocks":["Diamond"]}', '2025-10-07 17:43:13', '2025-10-07 17:43:13'),
('ach_user_1759884167043_vvrak6mmo_PURCHASE_MASTER', 'user_1759884167043_vvrak6mmo', 'PURCHASE_MASTER', 'Pembeli Setia', 'Lakukan 5 pembelian', 5, 0, 0, NULL, '{"points":75,"borderUnlocks":["Gold"]}', '2025-10-07 17:43:13', '2025-10-07 17:43:13'),
('ach_user_1759884167043_vvrak6mmo_RECIPE_CREATOR', 'user_1759884167043_vvrak6mmo', 'RECIPE_CREATOR', 'Koki Creative', 'Buat 5 resep baru', 5, 0, 0, NULL, '{"points":30,"borderUnlocks":["Gold"]}', '2025-10-07 17:43:13', '2025-10-07 17:43:13'),
('ach_user_1759884167043_vvrak6mmo_RECIPE_MASTER', 'user_1759884167043_vvrak6mmo', 'RECIPE_MASTER', 'Recipe Master', 'Buat 25 resep', 25, 0, 0, NULL, '{"points":150,"borderUnlocks":["Crystal"]}', '2025-10-07 17:43:13', '2025-10-07 17:43:13'),
('ach_user_1759884167043_vvrak6mmo_SOCIAL_BUTTERFLY', 'user_1759884167043_vvrak6mmo', 'SOCIAL_BUTTERFLY', 'Pendengar Baik', 'Buat 20 komentar di forum', 20, 0, 0, NULL, '{"points":40,"borderUnlocks":["Crystal"]}', '2025-10-07 17:43:13', '2025-10-11 01:23:10'),
('ach_user_1759943266360_9a86e2sb8_ACTIVE_MEMBER', 'user_1759943266360_9a86e2sb8', 'ACTIVE_MEMBER', 'Active Member', 'Aktif selama 30 hari', 30, 0, 0, NULL, '{"points":100,"borderUnlocks":["Gold"]}', '2025-10-08 10:08:00', '2025-10-08 10:07:59'),
('ach_user_1759943266360_9a86e2sb8_BORDER_COLLECTOR', 'user_1759943266360_9a86e2sb8', 'BORDER_COLLECTOR', 'Border Collector', 'Kumpulkan semua border', 6, 0, 0, NULL, '{"points":200,"borderUnlocks":["Diamond"]}', '2025-10-08 10:07:59', '2025-10-08 10:07:59'),
('ach_user_1759943266360_9a86e2sb8_COMMENTATOR_PRO', 'user_1759943266360_9a86e2sb8', 'COMMENTATOR_PRO', 'Commentator Pro', 'Buat 100 komentar', 100, 0, 0, NULL, '{"points":200,"borderUnlocks":["Crystal"]}', '2025-10-08 10:08:00', '2025-10-08 10:07:59'),
('ach_user_1759943266360_9a86e2sb8_DAILY_VISITOR', 'user_1759943266360_9a86e2sb8', 'DAILY_VISITOR', 'Daily Visitor', 'Login 7 hari berturut-turut', 7, 0, 0, NULL, '{"points":50,"borderUnlocks":["Silver"]}', '2025-10-08 10:07:59', '2025-10-08 10:07:59'),
('ach_user_1759943266360_9a86e2sb8_EARLY_ADOPTER', 'user_1759943266360_9a86e2sb8', 'EARLY_ADOPTER', 'Early Adopter', 'Bergabung dalam minggu pertama', 1, 0, 0, NULL, '{"points":25,"borderUnlocks":["Bronze"]}', '2025-10-08 10:07:59', '2025-10-08 10:07:59'),
('ach_user_1759943266360_9a86e2sb8_FIRST_FORUM_POST', 'user_1759943266360_9a86e2sb8', 'FIRST_FORUM_POST', 'Poster Pertama', 'Buat postingan forum pertama Anda', 1, 0, 0, NULL, '{"points":10,"borderUnlocks":["Bronze"]}', '2025-10-08 10:07:59', '2025-10-08 10:07:59'),
('ach_user_1759943266360_9a86e2sb8_FORUM_EXPERT', 'user_1759943266360_9a86e2sb8', 'FORUM_EXPERT', 'Forum Expert', 'Buat 100 postingan forum', 100, 0, 0, NULL, '{"points":300,"borderUnlocks":["Diamond"]}', '2025-10-08 10:08:00', '2025-10-08 10:07:59'),
('ach_user_1759943266360_9a86e2sb8_FORUM_REGULAR', 'user_1759943266360_9a86e2sb8', 'FORUM_REGULAR', 'Pembicara Aktif', 'Buat 10 postingan forum', 10, 0, 0, NULL, '{"points":50,"borderUnlocks":["Silver"]}', '2025-10-08 10:07:59', '2025-10-08 10:07:59'),
('ach_user_1759943266360_9a86e2sb8_FRIEND_CONNECTOR', 'user_1759943266360_9a86e2sb8', '', 'Konektor Pertemanan', 'Buat 5 koneksi pertemanan', 5, 0, 0, NULL, '{"points":30,"borderUnlocks":["Silver"]}', '2025-10-13 16:45:23', '2025-10-13 16:45:23'),
('ach_user_1759943266360_9a86e2sb8_POINTS_COLLECTOR', 'user_1759943266360_9a86e2sb8', 'POINTS_COLLECTOR', 'Poin Hunter', 'Kumpulkan 1000 poin', 1000, 0, 0, NULL, '{"points":100,"borderUnlocks":["Diamond"]}', '2025-10-08 10:07:59', '2025-10-08 10:07:59'),
('ach_user_1759943266360_9a86e2sb8_PURCHASE_MASTER', 'user_1759943266360_9a86e2sb8', 'PURCHASE_MASTER', 'Pembeli Setia', 'Lakukan 5 pembelian', 5, 0, 0, NULL, '{"points":75,"borderUnlocks":["Gold"]}', '2025-10-08 10:07:59', '2025-10-08 10:07:59'),
('ach_user_1759943266360_9a86e2sb8_RECIPE_CREATOR', 'user_1759943266360_9a86e2sb8', 'RECIPE_CREATOR', 'Koki Creative', 'Buat 5 resep baru', 5, 0, 0, NULL, '{"points":30,"borderUnlocks":["Gold"]}', '2025-10-08 10:07:59', '2025-10-08 10:07:59'),
('ach_user_1759943266360_9a86e2sb8_RECIPE_MASTER', 'user_1759943266360_9a86e2sb8', 'RECIPE_MASTER', 'Recipe Master', 'Buat 25 resep', 25, 0, 0, NULL, '{"points":150,"borderUnlocks":["Crystal"]}', '2025-10-08 10:08:00', '2025-10-08 10:07:59'),
('ach_user_1759943266360_9a86e2sb8_SOCIAL_BUTTERFLY', 'user_1759943266360_9a86e2sb8', 'SOCIAL_BUTTERFLY', 'Pendengar Baik', 'Buat 20 komentar di forum', 20, 0, 0, NULL, '{"points":40,"borderUnlocks":["Crystal"]}', '2025-10-08 10:07:59', '2025-10-08 10:07:59'),
('ach_user_1759983668131_rmpq22w5m_ACTIVE_MEMBER', 'user_1759983668131_rmpq22w5m', 'ACTIVE_MEMBER', 'Active Member', 'Aktif selama 30 hari', 30, 0, 0, NULL, '{"points":100,"borderUnlocks":["Gold"]}', '2025-10-08 21:23:51', '2025-10-08 21:23:51'),
('ach_user_1759983668131_rmpq22w5m_BORDER_COLLECTOR', 'user_1759983668131_rmpq22w5m', 'BORDER_COLLECTOR', 'Border Collector', 'Kumpulkan semua border', 6, 0, 0, NULL, '{"points":200,"borderUnlocks":["Diamond"]}', '2025-10-08 21:23:51', '2025-10-08 21:23:51'),
('ach_user_1759983668131_rmpq22w5m_COMMENTATOR_PRO', 'user_1759983668131_rmpq22w5m', 'COMMENTATOR_PRO', 'Commentator Pro', 'Buat 100 komentar', 100, 0, 0, NULL, '{"points":200,"borderUnlocks":["Crystal"]}', '2025-10-08 21:23:51', '2025-10-08 21:23:51'),
('ach_user_1759983668131_rmpq22w5m_DAILY_VISITOR', 'user_1759983668131_rmpq22w5m', 'DAILY_VISITOR', 'Daily Visitor', 'Login 7 hari berturut-turut', 7, 4, 0, NULL, '{"points":50,"borderUnlocks":["Silver"]}', '2025-10-08 21:23:51', '2025-10-10 03:09:34'),
('ach_user_1759983668131_rmpq22w5m_EARLY_ADOPTER', 'user_1759983668131_rmpq22w5m', 'EARLY_ADOPTER', 'Early Adopter', 'Bergabung dalam minggu pertama', 1, 0, 0, NULL, '{"points":25,"borderUnlocks":["Bronze"]}', '2025-10-08 21:23:51', '2025-10-08 21:23:51'),
('ach_user_1759983668131_rmpq22w5m_FIRST_FORUM_POST', 'user_1759983668131_rmpq22w5m', 'FIRST_FORUM_POST', 'Poster Pertama', 'Buat postingan forum pertama Anda', 1, 0, 0, NULL, '{"points":10,"borderUnlocks":["Bronze"]}', '2025-10-08 21:23:51', '2025-10-08 21:23:51'),
('ach_user_1759983668131_rmpq22w5m_FORUM_EXPERT', 'user_1759983668131_rmpq22w5m', 'FORUM_EXPERT', 'Forum Expert', 'Buat 100 postingan forum', 100, 0, 0, NULL, '{"points":300,"borderUnlocks":["Diamond"]}', '2025-10-08 21:23:51', '2025-10-08 21:23:51'),
('ach_user_1759983668131_rmpq22w5m_FORUM_REGULAR', 'user_1759983668131_rmpq22w5m', 'FORUM_REGULAR', 'Pembicara Aktif', 'Buat 10 postingan forum', 10, 10, 1, '2025-10-10 02:18:26', '{"points":50,"borderUnlocks":["Silver"]}', '2025-10-08 21:23:51', '2025-10-10 02:18:26'),
('ach_user_1759983668131_rmpq22w5m_FRIEND_CONNECTOR', 'user_1759983668131_rmpq22w5m', '', 'Konektor Pertemanan', 'Buat 5 koneksi pertemanan', 5, 0, 0, NULL, '{"points":30,"borderUnlocks":["Silver"]}', '2025-10-12 16:56:00', '2025-10-12 16:56:00'),
('ach_user_1759983668131_rmpq22w5m_POINTS_COLLECTOR', 'user_1759983668131_rmpq22w5m', 'POINTS_COLLECTOR', 'Poin Hunter', 'Kumpulkan 1000 poin', 1000, 0, 0, NULL, '{"points":100,"borderUnlocks":["Diamond"]}', '2025-10-08 21:23:51', '2025-10-08 21:23:51'),
('ach_user_1759983668131_rmpq22w5m_PURCHASE_MASTER', 'user_1759983668131_rmpq22w5m', 'PURCHASE_MASTER', 'Pembeli Setia', 'Lakukan 5 pembelian', 5, 0, 0, NULL, '{"points":75,"borderUnlocks":["Gold"]}', '2025-10-08 21:23:51', '2025-10-08 21:23:51'),
('ach_user_1759983668131_rmpq22w5m_RECIPE_CREATOR', 'user_1759983668131_rmpq22w5m', 'RECIPE_CREATOR', 'Koki Creative', 'Buat 5 resep baru', 5, 0, 0, NULL, '{"points":30,"borderUnlocks":["Gold"]}', '2025-10-08 21:23:51', '2025-10-08 21:23:51'),
('ach_user_1759983668131_rmpq22w5m_RECIPE_MASTER', 'user_1759983668131_rmpq22w5m', 'RECIPE_MASTER', 'Recipe Master', 'Buat 25 resep', 25, 0, 0, NULL, '{"points":150,"borderUnlocks":["Crystal"]}', '2025-10-08 21:23:51', '2025-10-08 21:23:51'),
('ach_user_1759983668131_rmpq22w5m_SOCIAL_BUTTERFLY', 'user_1759983668131_rmpq22w5m', 'SOCIAL_BUTTERFLY', 'Pendengar Baik', 'Buat 20 komentar di forum', 20, 0, 0, NULL, '{"points":40,"borderUnlocks":["Crystal"]}', '2025-10-08 21:23:51', '2025-10-08 21:23:51'),
('ach_user_1760616211771_rqixrwwi5_ACTIVE_MEMBER', 'user_1760616211771_rqixrwwi5', 'ACTIVE_MEMBER', 'Active Member', 'Aktif selama 30 hari', 30, 0, 0, NULL, '{"points":100,"borderUnlocks":["Gold"]}', '2025-10-16 12:03:55', '2025-10-16 12:03:55'),
('ach_user_1760616211771_rqixrwwi5_BORDER_COLLECTOR', 'user_1760616211771_rqixrwwi5', 'BORDER_COLLECTOR', 'Border Collector', 'Kumpulkan semua border', 6, 0, 0, NULL, '{"points":200,"borderUnlocks":["Diamond"]}', '2025-10-16 12:03:55', '2025-10-16 12:03:55'),
('ach_user_1760616211771_rqixrwwi5_COMMENTATOR_PRO', 'user_1760616211771_rqixrwwi5', 'COMMENTATOR_PRO', 'Commentator Pro', 'Buat 100 komentar', 100, 0, 0, NULL, '{"points":200,"borderUnlocks":["Crystal"]}', '2025-10-16 12:03:55', '2025-10-16 12:03:55'),
('ach_user_1760616211771_rqixrwwi5_DAILY_VISITOR', 'user_1760616211771_rqixrwwi5', 'DAILY_VISITOR', 'Daily Visitor', 'Login 7 hari berturut-turut', 7, 0, 0, NULL, '{"points":50,"borderUnlocks":["Silver"]}', '2025-10-16 12:03:55', '2025-10-16 12:03:55'),
('ach_user_1760616211771_rqixrwwi5_EARLY_ADOPTER', 'user_1760616211771_rqixrwwi5', 'EARLY_ADOPTER', 'Early Adopter', 'Bergabung dalam minggu pertama', 1, 0, 0, NULL, '{"points":25,"borderUnlocks":["Bronze"]}', '2025-10-16 12:03:55', '2025-10-16 12:03:55'),
('ach_user_1760616211771_rqixrwwi5_FIRST_FORUM_POST', 'user_1760616211771_rqixrwwi5', 'FIRST_FORUM_POST', 'Poster Pertama', 'Buat postingan forum pertama Anda', 1, 0, 0, NULL, '{"points":10,"borderUnlocks":["Bronze"]}', '2025-10-16 12:03:55', '2025-10-16 12:03:55'),
('ach_user_1760616211771_rqixrwwi5_FORUM_EXPERT', 'user_1760616211771_rqixrwwi5', 'FORUM_EXPERT', 'Forum Expert', 'Buat 100 postingan forum', 100, 0, 0, NULL, '{"points":300,"borderUnlocks":["Diamond"]}', '2025-10-16 12:03:55', '2025-10-16 12:03:55'),
('ach_user_1760616211771_rqixrwwi5_FORUM_REGULAR', 'user_1760616211771_rqixrwwi5', 'FORUM_REGULAR', 'Pembicara Aktif', 'Buat 10 postingan forum', 10, 0, 0, NULL, '{"points":50,"borderUnlocks":["Silver"]}', '2025-10-16 12:03:55', '2025-10-16 12:03:55'),
('ach_user_1760616211771_rqixrwwi5_FRIEND_CONNECTOR', 'user_1760616211771_rqixrwwi5', '', 'Konektor Pertemanan', 'Buat 5 koneksi pertemanan', 5, 0, 0, NULL, '{"points":30,"borderUnlocks":["Silver"]}', '2025-10-16 12:03:55', '2025-10-16 12:03:55'),
('ach_user_1760616211771_rqixrwwi5_POINTS_COLLECTOR', 'user_1760616211771_rqixrwwi5', 'POINTS_COLLECTOR', 'Poin Hunter', 'Kumpulkan 1000 poin', 1000, 0, 0, NULL, '{"points":100,"borderUnlocks":["Diamond"]}', '2025-10-16 12:03:55', '2025-10-16 12:03:55'),
('ach_user_1760616211771_rqixrwwi5_SOCIAL_BUTTERFLY', 'user_1760616211771_rqixrwwi5', 'SOCIAL_BUTTERFLY', 'Pendengar Baik', 'Buat 20 komentar di forum', 20, 0, 0, NULL, '{"points":40,"borderUnlocks":["Crystal"]}', '2025-10-16 12:03:55', '2025-10-16 12:03:55'),
('cmggypijs00021husasg86tkg', 'cmggylajf00001hussdd4ajlp', 'FIRST_FORUM_POST', 'Poster Pertama', 'Buat postingan forum pertama Anda', 1, 0, 0, NULL, '{"points":10,"borderUnlocks":["Bronze"]}', '2025-10-07 12:38:03', '2025-10-07 12:38:03'),
('cmggypijs00041husofwhp0a5', 'cmggylajf00001hussdd4ajlp', 'ACTIVE_MEMBER', 'Active Member', 'Aktif selama 30 hari', 30, 0, 0, NULL, '{"points":100,"borderUnlocks":["Gold"]}', '2025-10-07 12:38:03', '2025-10-07 12:38:03'),
('cmggypijt00061hussu00rp4x', 'cmggylajf00001hussdd4ajlp', 'FORUM_REGULAR', 'Pembicara Aktif', 'Buat 10 postingan forum', 10, 0, 0, NULL, '{"points":50,"borderUnlocks":["Silver"]}', '2025-10-07 12:38:03', '2025-10-07 12:38:03'),
('cmggypijv00081hus3g9cc6lj', 'cmggylajf00001hussdd4ajlp', 'POINTS_COLLECTOR', 'Poin Hunter', 'Kumpulkan 1000 poin', 1000, 0, 0, NULL, '{"points":100,"borderUnlocks":["Diamond"]}', '2025-10-07 12:38:03', '2025-10-07 12:38:03'),
('cmggypijx000a1husffl5fc6v', 'cmggylajf00001hussdd4ajlp', 'SOCIAL_BUTTERFLY', 'Pendengar Baik', 'Buat 20 komentar di forum', 20, 0, 0, NULL, '{"points":40,"borderUnlocks":["Crystal"]}', '2025-10-07 12:38:03', '2025-10-07 12:38:03'),
('cmggypijx000d1husyjig5kxl', 'cmggylajf00001hussdd4ajlp', 'RECIPE_CREATOR', 'Koki Creative', 'Buat 5 resep baru', 5, 0, 0, NULL, '{"points":30,"borderUnlocks":["Gold"]}', '2025-10-07 12:38:03', '2025-10-07 12:38:03'),
('cmggypijx000e1husd6emcpm4', 'cmggylajf00001hussdd4ajlp', 'PURCHASE_MASTER', 'Pembeli Setia', 'Lakukan 5 pembelian', 5, 0, 0, NULL, '{"points":75,"borderUnlocks":["Gold"]}', '2025-10-07 12:38:03', '2025-10-07 12:38:03'),
('cmggypijy000g1hus7gdkbykv', 'cmggylajf00001hussdd4ajlp', 'FORUM_EXPERT', 'Forum Expert', 'Buat 100 postingan forum', 100, 0, 0, NULL, '{"points":300,"borderUnlocks":["Diamond"]}', '2025-10-07 12:38:03', '2025-10-07 12:38:03'),
('cmggypijy000j1hus5600mg5k', 'cmggylajf00001hussdd4ajlp', 'EARLY_ADOPTER', 'Early Adopter', 'Bergabung dalam minggu pertama', 1, 0, 0, NULL, '{"points":25,"borderUnlocks":["Bronze"]}', '2025-10-07 12:38:03', '2025-10-07 12:38:03'),
('cmggypijy000k1hus41qae1yx', 'cmggylajf00001hussdd4ajlp', 'RECIPE_MASTER', 'Recipe Master', 'Buat 25 resep', 25, 0, 0, NULL, '{"points":150,"borderUnlocks":["Crystal"]}', '2025-10-07 12:38:03', '2025-10-07 12:38:03'),
('cmggypijz000m1husklnef4e6', 'cmggylajf00001hussdd4ajlp', 'BORDER_COLLECTOR', 'Border Collector', 'Kumpulkan semua border', 6, 0, 0, NULL, '{"points":200,"borderUnlocks":["Diamond"]}', '2025-10-07 12:38:03', '2025-10-07 12:38:03'),
('cmggypijz000o1hus8rkq9uop', 'cmggylajf00001hussdd4ajlp', 'DAILY_VISITOR', 'Daily Visitor', 'Login 7 hari berturut-turut', 7, 0, 0, NULL, '{"points":50,"borderUnlocks":["Silver"]}', '2025-10-07 12:38:03', '2025-10-07 12:38:03'),
('cmggypijz000q1husaeepnn9y', 'cmggylajf00001hussdd4ajlp', 'COMMENTATOR_PRO', 'Commentator Pro', 'Buat 100 komentar', 100, 0, 0, NULL, '{"points":200,"borderUnlocks":["Crystal"]}', '2025-10-07 12:38:03', '2025-10-07 12:38:03'),
('cmggz5sac00811husxmnl4b9k', 'cmggz5ihr007z1hus4ww2mocp', 'FIRST_FORUM_POST', 'Poster Pertama', 'Buat postingan forum pertama Anda', 1, 0, 0, NULL, '{"points":10,"borderUnlocks":["Bronze"]}', '2025-10-07 12:50:42', '2025-10-07 12:50:42'),
('cmggz5sad00841hus7jy5a369', 'cmggz5ihr007z1hus4ww2mocp', 'RECIPE_CREATOR', 'Koki Creative', 'Buat 5 resep baru', 5, 0, 0, NULL, '{"points":30,"borderUnlocks":["Gold"]}', '2025-10-07 12:50:42', '2025-10-07 12:50:42'),
('cmggz5sad00851husojgvrd2s', 'cmggz5ihr007z1hus4ww2mocp', 'DAILY_VISITOR', 'Daily Visitor', 'Login 7 hari berturut-turut', 7, 0, 0, NULL, '{"points":50,"borderUnlocks":["Silver"]}', '2025-10-07 12:50:42', '2025-10-07 12:50:42'),
('cmggz5sad00871husavi0p3z3', 'cmggz5ihr007z1hus4ww2mocp', 'FORUM_REGULAR', 'Pembicara Aktif', 'Buat 10 postingan forum', 10, 5, 0, NULL, '{"points":50,"borderUnlocks":["Silver"]}', '2025-10-07 12:50:42', '2025-10-10 02:09:04'),
('cmggz5sae008a1husxyr39tzf', 'cmggz5ihr007z1hus4ww2mocp', 'SOCIAL_BUTTERFLY', 'Pendengar Baik', 'Buat 20 komentar di forum', 20, 0, 0, NULL, '{"points":40,"borderUnlocks":["Crystal"]}', '2025-10-07 12:50:42', '2025-10-07 12:50:42'),
('cmggz5sae008c1hus1zx6iicu', 'cmggz5ihr007z1hus4ww2mocp', 'FORUM_EXPERT', 'Forum Expert', 'Buat 100 postingan forum', 100, 0, 0, NULL, '{"points":300,"borderUnlocks":["Diamond"]}', '2025-10-07 12:50:42', '2025-10-07 12:50:42'),
('cmggz5sae008d1hussz7pfdrb', 'cmggz5ihr007z1hus4ww2mocp', 'RECIPE_MASTER', 'Recipe Master', 'Buat 25 resep', 25, 0, 0, NULL, '{"points":150,"borderUnlocks":["Crystal"]}', '2025-10-07 12:50:42', '2025-10-07 12:50:42'),
('cmggz5sae008f1huspcsm3dhu', 'cmggz5ihr007z1hus4ww2mocp', 'COMMENTATOR_PRO', 'Commentator Pro', 'Buat 100 komentar', 100, 0, 0, NULL, '{"points":200,"borderUnlocks":["Crystal"]}', '2025-10-07 12:50:42', '2025-10-07 12:50:42'),
('cmggz5sae008h1hus8mzwo3i2', 'cmggz5ihr007z1hus4ww2mocp', 'BORDER_COLLECTOR', 'Border Collector', 'Kumpulkan semua border', 6, 0, 0, NULL, '{"points":200,"borderUnlocks":["Diamond"]}', '2025-10-07 12:50:42', '2025-10-07 12:50:42'),
('cmggz5saf008j1huscqqnte1c', 'cmggz5ihr007z1hus4ww2mocp', 'PURCHASE_MASTER', 'Pembeli Setia', 'Lakukan 5 pembelian', 5, 0, 0, NULL, '{"points":75,"borderUnlocks":["Gold"]}', '2025-10-07 12:50:42', '2025-10-07 12:50:42'),
('cmggz5saf008m1husdxrsvr1s', 'cmggz5ihr007z1hus4ww2mocp', 'POINTS_COLLECTOR', 'Poin Hunter', 'Kumpulkan 1000 poin', 1000, 1000, 1, '2025-10-09 19:09:13', '{"points":100,"borderUnlocks":["Diamond"]}', '2025-10-07 12:50:42', '2025-10-07 12:50:42'),
('cmggz5saf008n1husuwn1nvep', 'cmggz5ihr007z1hus4ww2mocp', 'EARLY_ADOPTER', 'Early Adopter', 'Bergabung dalam minggu pertama', 1, 0, 0, NULL, '{"points":25,"borderUnlocks":["Bronze"]}', '2025-10-07 12:50:42', '2025-10-07 12:50:42'),
('cmggz5sah008p1huscaaj55mp', 'cmggz5ihr007z1hus4ww2mocp', 'ACTIVE_MEMBER', 'Active Member', 'Aktif selama 30 hari', 30, 0, 0, NULL, '{"points":100,"borderUnlocks":["Gold"]}', '2025-10-07 12:50:42', '2025-10-07 12:50:42');

-- Table structure for activity
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` enum('FORUM_POST','FORUM_COMMENT','RECIPE_CREATED','RECIPE_LIKED','PURCHASE','PROFILE_UPDATE','BADGE_EARNED','FRIEND_REQUEST_SENT','FRIEND_REQUEST_ACCEPTED','FRIEND_ADDED','MESSAGE_SENT','SOCIAL_POST_CREATED','SOCIAL_POST_LIKED','SOCIAL_COMMENT_ADDED','USER_FOLLOWED','USER_UNFOLLOWED') NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `idx_activity_user_id` (`userId`),
  KEY `idx_activity_created_at` (`createdAt`),
  KEY `idx_activity_type` (`type`),
  KEY `idx_user_activity_feed` (`userId`,`createdAt`),
  CONSTRAINT `Activity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Data for table activity
INSERT INTO `activity` VALUES
('act_1760017438224_cxi8pbu9o', 'user_1759943266360_9a86e2sb8', 'FRIEND_REQUEST_SENT', 'Friend Request Sent', 'You sent a friend request to patricias', '{"requestId":"cmgjgxurs00011ho4s5feukf8","receiverId":"user_1759884167043_vvrak6mmo","receiverName":"patricias"}', '2025-10-09 06:43:58'),
('act_1760017438228_489yosgqx', 'user_1759884167043_vvrak6mmo', 'FRIEND_REQUEST_SENT', 'New Friend Request', 'You received a friend request from Toge Anjay', '{"requestId":"cmgjgxurs00011ho4s5feukf8","senderId":"user_1759943266360_9a86e2sb8","senderName":"Toge Anjay"}', '2025-10-09 06:43:58'),
('act_1760017455135_aacyzm6x1', 'user_1759943266360_9a86e2sb8', 'FRIEND_REQUEST_ACCEPTED', 'Friend Request Accepted', 'patricias accepted your friend request', '{"requestId":"cmgjgxurs00011ho4s5feukf8","receiverId":"user_1759884167043_vvrak6mmo","receiverName":"patricias"}', '2025-10-09 06:44:15'),
('act_1760017455137_776rss591', 'user_1759884167043_vvrak6mmo', 'FRIEND_ADDED', 'New Friend Added', 'You are now friends with Toge Anjay', '{"requestId":"cmgjgxurs00011ho4s5feukf8","senderId":"user_1759943266360_9a86e2sb8","senderName":"Toge Anjay"}', '2025-10-09 06:44:15'),
('act_1760052435185_dfuoaym17', 'user_1759983668131_rmpq22w5m', 'FRIEND_REQUEST_SENT', 'Friend Request Sent', 'You sent a friend request to Morgan Dummy', '{"requestId":"cmgk1rylg00011h1w74aa4jx7","receiverId":"user_1759884167043_vvrak6mmo","receiverName":"Morgan Dummy"}', '2025-10-09 16:27:15'),
('act_1760052435190_kg6n9s0y6', 'user_1759884167043_vvrak6mmo', 'FRIEND_REQUEST_SENT', 'New Friend Request', 'You received a friend request from Dwipa keren', '{"requestId":"cmgk1rylg00011h1w74aa4jx7","senderId":"user_1759983668131_rmpq22w5m","senderName":"Dwipa keren"}', '2025-10-09 16:27:15'),
('act_1760052827715_y8fbyxhc0', 'user_1759983668131_rmpq22w5m', 'FRIEND_REQUEST_ACCEPTED', 'Friend Request Accepted', 'Morgan Dummy accepted your friend request', '{"requestId":"cmgk1rylg00011h1w74aa4jx7","receiverId":"user_1759884167043_vvrak6mmo","receiverName":"Morgan Dummy"}', '2025-10-09 16:33:47'),
('act_1760052827719_bv23w0ud1', 'user_1759884167043_vvrak6mmo', 'FRIEND_ADDED', 'New Friend Added', 'You are now friends with Dwipa keren', '{"requestId":"cmgk1rylg00011h1w74aa4jx7","senderId":"user_1759983668131_rmpq22w5m","senderName":"Dwipa keren"}', '2025-10-09 16:33:47'),
('act_1760055154518_uvwuh40du', 'cmggylajf00001hussdd4ajlp', 'FRIEND_REQUEST_ACCEPTED', 'Friend Request Accepted', 'Ananda Alviansyah Putra accepted your friend request', '{"requestId":"fr_test_1760017339110_7jf2wntbs","receiverId":"cmggz5ihr007z1hus4ww2mocp","receiverName":"Ananda Alviansyah Putra"}', '2025-10-09 17:12:34'),
('act_1760055154521_qxsva8wxs', 'cmggz5ihr007z1hus4ww2mocp', 'FRIEND_ADDED', 'New Friend Added', 'You are now friends with Ananda Alviansyah', '{"requestId":"fr_test_1760017339110_7jf2wntbs","senderId":"cmggylajf00001hussdd4ajlp","senderName":"Ananda Alviansyah"}', '2025-10-09 17:12:34'),
('act_1760059021126_f1ion276z', 'cmggz5ihr007z1hus4ww2mocp', 'FRIEND_REQUEST_SENT', 'Friend Request Sent', 'You sent a friend request to Morgan Dummy', '{"requestId":"cmgk5p4cd00011h0cyom2w5ys","receiverId":"user_1759884167043_vvrak6mmo","receiverName":"Morgan Dummy"}', '2025-10-09 18:17:01'),
('act_1760059021130_o7ir7dd43', 'user_1759884167043_vvrak6mmo', 'FRIEND_REQUEST_SENT', 'New Friend Request', 'You received a friend request from Ananda Alviansyah Putra', '{"requestId":"cmgk5p4cd00011h0cyom2w5ys","senderId":"cmggz5ihr007z1hus4ww2mocp","senderName":"Ananda Alviansyah Putra"}', '2025-10-09 18:17:01'),
('act_1760062231711_hxdpw0xtk', 'cmggz5ihr007z1hus4ww2mocp', 'FRIEND_REQUEST_ACCEPTED', 'Friend Request Accepted', 'Morgan Dummy accepted your friend request', '{"requestId":"cmgk5p4cd00011h0cyom2w5ys","receiverId":"user_1759884167043_vvrak6mmo","receiverName":"Morgan Dummy"}', '2025-10-09 19:10:31'),
('act_1760062231714_n4q1e6h3i', 'user_1759884167043_vvrak6mmo', 'FRIEND_ADDED', 'New Friend Added', 'You are now friends with Ananda Alviansyah Putras', '{"requestId":"cmgk5p4cd00011h0cyom2w5ys","senderId":"cmggz5ihr007z1hus4ww2mocp","senderName":"Ananda Alviansyah Putras"}', '2025-10-09 19:10:31'),
('act_1760065849870_45fk4tpba', 'user_1759983668131_rmpq22w5m', 'FRIEND_REQUEST_SENT', 'Friend Request Sent', 'You sent a friend request to Ananda Alviansyah', '{"requestId":"cmgk9rhfn00011hkgrp5kafbf","receiverId":"cmggylajf00001hussdd4ajlp","receiverName":"Ananda Alviansyah"}', '2025-10-09 20:10:49'),
('act_1760065849874_rro0gczf4', 'cmggylajf00001hussdd4ajlp', 'FRIEND_REQUEST_SENT', 'New Friend Request', 'You received a friend request from Dwipa keren', '{"requestId":"cmgk9rhfn00011hkgrp5kafbf","senderId":"user_1759983668131_rmpq22w5m","senderName":"Dwipa keren"}', '2025-10-09 20:10:49'),
('act_1760079673330_3heep0tdl', 'user_1759983668131_rmpq22w5m', 'FRIEND_REQUEST_SENT', 'Friend Request Sent', 'You sent a friend request to Morgan Dummy', '{"requestId":"cmgkhzrop00011h04hc7dg1yq","receiverId":"user_1759884167043_vvrak6mmo","receiverName":"Morgan Dummy"}', '2025-10-10 00:01:13'),
('act_1760079673335_omveqpzsl', 'user_1759884167043_vvrak6mmo', 'FRIEND_REQUEST_SENT', 'New Friend Request', 'You received a friend request from Dwipa keren', '{"requestId":"cmgkhzrop00011h04hc7dg1yq","senderId":"user_1759983668131_rmpq22w5m","senderName":"Dwipa keren"}', '2025-10-10 00:01:13'),
('act_1760079686334_itueblsw9', 'user_1759983668131_rmpq22w5m', 'FRIEND_REQUEST_ACCEPTED', 'Friend Request Accepted', 'Morgan Dummy accepted your friend request', '{"requestId":"cmgkhzrop00011h04hc7dg1yq","receiverId":"user_1759884167043_vvrak6mmo","receiverName":"Morgan Dummy"}', '2025-10-10 00:01:26'),
('act_1760079686338_i1o7r6l4d', 'user_1759884167043_vvrak6mmo', 'FRIEND_ADDED', 'New Friend Added', 'You are now friends with Dwipa keren', '{"requestId":"cmgkhzrop00011h04hc7dg1yq","senderId":"user_1759983668131_rmpq22w5m","senderName":"Dwipa keren"}', '2025-10-10 00:01:26'),
('act_1760101955078_puilf04nq', 'user_1759884167043_vvrak6mmo', 'FRIEND_REQUEST_SENT', 'Friend Request Sent', 'You sent a friend request to Toge Anjay', '{"requestId":"cmgkv9ce500011hrclgc0qijs","receiverId":"user_1759943266360_9a86e2sb8","receiverName":"Toge Anjay"}', '2025-10-10 06:12:35'),
('act_1760101955081_e17sm8z8x', 'user_1759943266360_9a86e2sb8', 'FRIEND_REQUEST_SENT', 'New Friend Request', 'You received a friend request from Morgan Dummy', '{"requestId":"cmgkv9ce500011hrclgc0qijs","senderId":"user_1759884167043_vvrak6mmo","senderName":"Morgan Dummy"}', '2025-10-10 06:12:35'),
('act_1760102038845_f2opacnt8', 'user_1759884167043_vvrak6mmo', 'PROFILE_UPDATE', 'Friend Request Cancelled', 'You cancelled a friend request to Toge Anjay', '{"requestId":"cmgkv9ce500011hrclgc0qijs","receiverId":"user_1759943266360_9a86e2sb8","receiverName":"Toge Anjay"}', '2025-10-10 06:13:58'),
('act_1760102042294_5s8p1mb4e', 'user_1759884167043_vvrak6mmo', 'FRIEND_REQUEST_SENT', 'Friend Request Sent', 'You sent a friend request to Toge Anjay', '{"requestId":"cmgkvb7oz00031hrc54spf423","receiverId":"user_1759943266360_9a86e2sb8","receiverName":"Toge Anjay"}', '2025-10-10 06:14:02'),
('act_1760102042297_7pkp139c9', 'user_1759943266360_9a86e2sb8', 'FRIEND_REQUEST_SENT', 'New Friend Request', 'You received a friend request from Morgan Dummy', '{"requestId":"cmgkvb7oz00031hrc54spf423","senderId":"user_1759884167043_vvrak6mmo","senderName":"Morgan Dummy"}', '2025-10-10 06:14:02'),
('act_1760102064143_gla4yjou6', 'user_1759884167043_vvrak6mmo', 'PROFILE_UPDATE', 'Friend Request Cancelled', 'You cancelled a friend request to Toge Anjay', '{"requestId":"cmgkvb7oz00031hrc54spf423","receiverId":"user_1759943266360_9a86e2sb8","receiverName":"Toge Anjay"}', '2025-10-10 06:14:24'),
('act_1760102065843_fnj15ocpv', 'user_1759884167043_vvrak6mmo', 'FRIEND_REQUEST_SENT', 'Friend Request Sent', 'You sent a friend request to Toge Anjay', '{"requestId":"cmgkvbpv300051hrcwd9ytxgr","receiverId":"user_1759943266360_9a86e2sb8","receiverName":"Toge Anjay"}', '2025-10-10 06:14:25'),
('act_1760102065848_suuyp6wod', 'user_1759943266360_9a86e2sb8', 'FRIEND_REQUEST_SENT', 'New Friend Request', 'You received a friend request from Morgan Dummy', '{"requestId":"cmgkvbpv300051hrcwd9ytxgr","senderId":"user_1759884167043_vvrak6mmo","senderName":"Morgan Dummy"}', '2025-10-10 06:14:25'),
('act_1760102077004_kjtqssfi9', 'user_1759884167043_vvrak6mmo', 'FRIEND_REQUEST_ACCEPTED', 'Friend Request Accepted', 'Toge Anjay accepted your friend request', '{"requestId":"cmgkvbpv300051hrcwd9ytxgr","receiverId":"user_1759943266360_9a86e2sb8","receiverName":"Toge Anjay"}', '2025-10-10 06:14:37'),
('act_1760102077008_e50sqsug3', 'user_1759943266360_9a86e2sb8', 'FRIEND_ADDED', 'New Friend Added', 'You are now friends with Morgan Dummy', '{"requestId":"cmgkvbpv300051hrcwd9ytxgr","senderId":"user_1759884167043_vvrak6mmo","senderName":"Morgan Dummy"}', '2025-10-10 06:14:37'),
('act_1760328947125_lhbsm2gfs', 'cmggz5ihr007z1hus4ww2mocp', 'FRIEND_REQUEST_SENT', 'Friend Request Sent', 'You sent a friend request to Dwipa keren', '{"requestId":"cmgomekl200011hawz2ydtu1u","receiverId":"user_1759983668131_rmpq22w5m","receiverName":"Dwipa keren"}', '2025-10-12 21:15:47'),
('act_1760328947128_w88qfagdq', 'user_1759983668131_rmpq22w5m', 'FRIEND_REQUEST_SENT', 'New Friend Request', 'You received a friend request from Ananda Alviansyah Putras', '{"requestId":"cmgomekl200011hawz2ydtu1u","senderId":"cmggz5ihr007z1hus4ww2mocp","senderName":"Ananda Alviansyah Putras"}', '2025-10-12 21:15:47'),
('act_1760329216856_yoq58nzwz', 'cmggz5ihr007z1hus4ww2mocp', 'PROFILE_UPDATE', 'Friend Request Cancelled', 'You cancelled a friend request to Dwipa keren', '{"requestId":"cmgomekl200011hawz2ydtu1u","receiverId":"user_1759983668131_rmpq22w5m","receiverName":"Dwipa keren"}', '2025-10-12 21:20:16'),
('act_1760329220824_vbu36mxop', 'cmggz5ihr007z1hus4ww2mocp', 'FRIEND_REQUEST_SENT', 'Friend Request Sent', 'You sent a friend request to Dwipa keren', '{"requestId":"cmgomkfrt00031haw2r8soxme","receiverId":"user_1759983668131_rmpq22w5m","receiverName":"Dwipa keren"}', '2025-10-12 21:20:20'),
('act_1760329220826_x1zrubc1u', 'user_1759983668131_rmpq22w5m', 'FRIEND_REQUEST_SENT', 'New Friend Request', 'You received a friend request from Ananda Alviansyah Putras', '{"requestId":"cmgomkfrt00031haw2r8soxme","senderId":"cmggz5ihr007z1hus4ww2mocp","senderName":"Ananda Alviansyah Putras"}', '2025-10-12 21:20:20'),
('act_1760329410285_syxvumw4j', 'cmggz5ihr007z1hus4ww2mocp', 'PROFILE_UPDATE', 'Friend Request Cancelled', 'You cancelled a friend request to Dwipa keren', '{"requestId":"cmgomkfrt00031haw2r8soxme","receiverId":"user_1759983668131_rmpq22w5m","receiverName":"Dwipa keren"}', '2025-10-12 21:23:30'),
('act_1760329412107_f6qtl1c1h', 'cmggz5ihr007z1hus4ww2mocp', 'FRIEND_REQUEST_SENT', 'Friend Request Sent', 'You sent a friend request to Dwipa keren', '{"requestId":"cmgomojdb00051hawqxslsjka","receiverId":"user_1759983668131_rmpq22w5m","receiverName":"Dwipa keren"}', '2025-10-12 21:23:32'),
('act_1760329412111_ku136gjuj', 'user_1759983668131_rmpq22w5m', 'FRIEND_REQUEST_SENT', 'New Friend Request', 'You received a friend request from Ananda Alviansyah Putras', '{"requestId":"cmgomojdb00051hawqxslsjka","senderId":"cmggz5ihr007z1hus4ww2mocp","senderName":"Ananda Alviansyah Putras"}', '2025-10-12 21:23:32'),
('act_1760329666796_q8yyr8jk6', 'cmggz5ihr007z1hus4ww2mocp', 'PROFILE_UPDATE', 'Friend Request Cancelled', 'You cancelled a friend request to Dwipa keren', '{"requestId":"cmgomojdb00051hawqxslsjka","receiverId":"user_1759983668131_rmpq22w5m","receiverName":"Dwipa keren"}', '2025-10-12 21:27:46'),
('act_1760329667827_a3rntn44l', 'cmggz5ihr007z1hus4ww2mocp', 'FRIEND_REQUEST_SENT', 'Friend Request Sent', 'You sent a friend request to Dwipa keren', '{"requestId":"cmgomu0ol00011hdo79ap83bo","receiverId":"user_1759983668131_rmpq22w5m","receiverName":"Dwipa keren"}', '2025-10-12 21:27:47'),
('act_1760329667829_vquey8vrk', 'user_1759983668131_rmpq22w5m', 'FRIEND_REQUEST_SENT', 'New Friend Request', 'You received a friend request from Ananda Alviansyah Putras', '{"requestId":"cmgomu0ol00011hdo79ap83bo","senderId":"cmggz5ihr007z1hus4ww2mocp","senderName":"Ananda Alviansyah Putras"}', '2025-10-12 21:27:47'),
('act_1760350634857_94eng3wh0', 'cmggz5ihr007z1hus4ww2mocp', 'FRIEND_REQUEST_ACCEPTED', 'Friend Request Accepted', 'Dwipa keren accepted your friend request', '{"requestId":"cmgomu0ol00011hdo79ap83bo","receiverId":"user_1759983668131_rmpq22w5m","receiverName":"Dwipa keren"}', '2025-10-13 03:17:14'),
('act_1760350634863_tmqi0rhf0', 'user_1759983668131_rmpq22w5m', 'FRIEND_ADDED', 'New Friend Added', 'You are now friends with Ananda Alviansyah Putras', '{"requestId":"cmgomu0ol00011hdo79ap83bo","senderId":"cmggz5ihr007z1hus4ww2mocp","senderName":"Ananda Alviansyah Putras"}', '2025-10-13 03:17:14'),
('act_cmggylajf00001hussdd4ajlp_1759881523998', 'cmggylajf00001hussdd4ajlp', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda memperbarui informasi profil', '{"name":"Ananda Alviansyah","bio":"","location":"Surabaya","selectedBorder":"default"}', '2025-10-07 16:58:43'),
('act_cmggz5ihr007z1hus4ww2mocp_1759879816665', 'cmggz5ihr007z1hus4ww2mocp', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda memperbarui informasi profil', '{"name":"Ananda Alviansyah po","bio":"","location":"Surabaya, Jawa Timur, Indonesias","selectedBorder":"default"}', '2025-10-07 16:30:16'),
('act_cmggz5ihr007z1hus4ww2mocp_1759879820639', 'cmggz5ihr007z1hus4ww2mocp', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda memperbarui informasi profil', '{"name":"Ananda Alviansyah po","bio":"sdasd","location":"Surabaya, Jawa Timur, Indonesias","selectedBorder":"default"}', '2025-10-07 16:30:20'),
('act_cmggz5ihr007z1hus4ww2mocp_1759880066325', 'cmggz5ihr007z1hus4ww2mocp', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda memperbarui informasi profil', '{"name":"Ananda Alviansyah po","bio":"sdasd","location":"Surabaya, Jawa Timur, Indonesias","selectedBorder":"bronze"}', '2025-10-07 16:34:26'),
('cmggz5ihr007z1hus4ww2mocp_PROFILE_UPDATE_1759942514888', 'cmggz5ihr007z1hus4ww2mocp', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-08 16:55:14'),
('cmggz5ihr007z1hus4ww2mocp_PROFILE_UPDATE_1760061913928', 'cmggz5ihr007z1hus4ww2mocp', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-10 02:05:13'),
('user_1759884167043_vvrak6mmo_BORDER_PURCHASE_1759895623607', 'user_1759884167043_vvrak6mmo', '', 'Border Diamond dibeli', 'Anda membeli border seharga 2000 poin', '{"borderId":"diamond","borderName":"Diamond","price":2000}', '2025-10-08 03:53:43'),
('user_1759884167043_vvrak6mmo_BORDER_PURCHASE_1759895820955', 'user_1759884167043_vvrak6mmo', '', 'Border Gold dibeli', 'Anda membeli border seharga 500 poin', '{"borderId":"gold","borderName":"Gold","price":500}', '2025-10-08 03:57:00'),
('user_1759884167043_vvrak6mmo_BORDER_PURCHASE_1759896273561', 'user_1759884167043_vvrak6mmo', '', 'Border Green Tea dibeli', 'Anda membeli border seharga 10000 poin', '{"borderId":"border_10000_green_tea","borderName":"Green Tea","price":10000}', '2025-10-08 04:04:33'),
('user_1759884167043_vvrak6mmo_BORDER_PURCHASE_1759896365516', 'user_1759884167043_vvrak6mmo', '', 'Border Sacred Sakura dibeli', 'Anda membeli border seharga 50000 poin', '{"borderId":"border_50000_sacred_sakura","borderName":"Sacred Sakura","price":50000}', '2025-10-08 04:06:05'),
('user_1759884167043_vvrak6mmo_BORDER_PURCHASE_1759896903159', 'user_1759884167043_vvrak6mmo', '', 'Border Matcha dibeli', 'Anda membeli border seharga 10000 poin', '{"borderId":"border_10000_matcha","borderName":"Matcha","price":10000}', '2025-10-08 04:15:03'),
('user_1759884167043_vvrak6mmo_BORDER_PURCHASE_1759897337678', 'user_1759884167043_vvrak6mmo', '', 'Border Dragon Matcha Pavilion dibeli', 'Anda membeli border seharga 50000 poin', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion","price":50000}', '2025-10-08 04:22:17'),
('user_1759884167043_vvrak6mmo_BORDER_PURCHASE_1759900491929', 'user_1759884167043_vvrak6mmo', '', 'Border Let_s Drink! dibeli', 'Anda membeli border seharga 25000 poin', '{"borderId":"border_25000_lets_drink","borderName":"Let_s Drink!","price":25000}', '2025-10-08 05:14:51'),
('user_1759884167043_vvrak6mmo_BORDER_PURCHASE_1759930805501', 'user_1759884167043_vvrak6mmo', '', 'Border Dessert Time! dibeli', 'Anda membeli border seharga 25000 poin', '{"borderId":"border_25000_dessert_time","borderName":"Dessert Time!","price":25000}', '2025-10-08 13:40:05'),
('user_1759884167043_vvrak6mmo_BORDER_PURCHASE_1759930807679', 'user_1759884167043_vvrak6mmo', '', 'Border Daily Whisk dibeli', 'Anda membeli border seharga 25000 poin', '{"borderId":"border_25000_daily_whisk","borderName":"Daily Whisk","price":25000}', '2025-10-08 13:40:07'),
('user_1759884167043_vvrak6mmo_BORDER_PURCHASE_1759930808823', 'user_1759884167043_vvrak6mmo', '', 'Border Repack Ur Matcha dibeli', 'Anda membeli border seharga 10000 poin', '{"borderId":"border_10000_repack_ur_matcha","borderName":"Repack Ur Matcha","price":10000}', '2025-10-08 13:40:08'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759895706649', 'user_1759884167043_vvrak6mmo', '', 'Border Diamond dipilih', 'Anda mengubah border profil', '{"borderId":"diamond","borderName":"Diamond"}', '2025-10-08 03:55:06'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759895904401', 'user_1759884167043_vvrak6mmo', '', 'Border Gold dipilih', 'Anda mengubah border profil', '{"borderId":"gold","borderName":"Gold"}', '2025-10-08 03:58:24'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759896327258', 'user_1759884167043_vvrak6mmo', '', 'Border Gold dipilih', 'Anda mengubah border profil', '{"borderId":"gold","borderName":"Gold"}', '2025-10-08 04:05:27'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759896369156', 'user_1759884167043_vvrak6mmo', '', 'Border Sacred Sakura dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_sacred_sakura","borderName":"Sacred Sakura"}', '2025-10-08 04:06:09'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759896600525', 'user_1759884167043_vvrak6mmo', '', 'Border Gold dipilih', 'Anda mengubah border profil', '{"borderId":"gold","borderName":"Gold"}', '2025-10-08 04:10:00'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759896608394', 'user_1759884167043_vvrak6mmo', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-08 04:10:08'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759896905636', 'user_1759884167043_vvrak6mmo', '', 'Border Matcha dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_matcha","borderName":"Matcha"}', '2025-10-08 04:15:05'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759896908494', 'user_1759884167043_vvrak6mmo', '', 'Border Matcha dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_matcha","borderName":"Matcha"}', '2025-10-08 04:15:08'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759896924887', 'user_1759884167043_vvrak6mmo', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-08 04:15:24'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759897329766', 'user_1759884167043_vvrak6mmo', '', 'Border Matcha dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_matcha","borderName":"Matcha"}', '2025-10-08 04:22:09'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759897332109', 'user_1759884167043_vvrak6mmo', '', 'Border Default dipilih', 'Anda mengubah border profil', '{"borderId":"default","borderName":"Default"}', '2025-10-08 04:22:12'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759897335302', 'user_1759884167043_vvrak6mmo', '', 'Border Sacred Sakura dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_sacred_sakura","borderName":"Sacred Sakura"}', '2025-10-08 04:22:15'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759897338895', 'user_1759884167043_vvrak6mmo', '', 'Border Dragon Matcha Pavilion dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion"}', '2025-10-08 04:22:18'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759897352871', 'user_1759884167043_vvrak6mmo', '', 'Border Gold dipilih', 'Anda mengubah border profil', '{"borderId":"gold","borderName":"Gold"}', '2025-10-08 04:22:32'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759897901623', 'user_1759884167043_vvrak6mmo', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-08 04:31:41'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759897903512', 'user_1759884167043_vvrak6mmo', '', 'Border Default dipilih', 'Anda mengubah border profil', '{"borderId":"default","borderName":"Default"}', '2025-10-08 04:31:43'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759897907691', 'user_1759884167043_vvrak6mmo', '', 'Border Sacred Sakura dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_sacred_sakura","borderName":"Sacred Sakura"}', '2025-10-08 04:31:47'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759897910689', 'user_1759884167043_vvrak6mmo', '', 'Border Default dipilih', 'Anda mengubah border profil', '{"borderId":"default","borderName":"Default"}', '2025-10-08 04:31:50'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759899174686', 'user_1759884167043_vvrak6mmo', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-08 04:52:54'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759899661134', 'user_1759884167043_vvrak6mmo', '', 'Border Dragon Matcha Pavilion dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion"}', '2025-10-08 05:01:01'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759900493838', 'user_1759884167043_vvrak6mmo', '', 'Border Let_s Drink! dipilih', 'Anda mengubah border profil', '{"borderId":"border_25000_lets_drink","borderName":"Let_s Drink!"}', '2025-10-08 05:14:53'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759928942718', 'user_1759884167043_vvrak6mmo', '', 'Border Dragon Matcha Pavilion dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion"}', '2025-10-08 13:09:02'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759928946013', 'user_1759884167043_vvrak6mmo', '', 'Border Sacred Sakura dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_sacred_sakura","borderName":"Sacred Sakura"}', '2025-10-08 13:09:06'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759930695430', 'user_1759884167043_vvrak6mmo', '', 'Border Dragon Matcha Pavilion dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion"}', '2025-10-08 13:38:15'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759930724492', 'user_1759884167043_vvrak6mmo', '', 'Border Default dipilih', 'Anda mengubah border profil', '{"borderId":"default","borderName":"Default"}', '2025-10-08 13:38:44'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759930810054', 'user_1759884167043_vvrak6mmo', '', 'Border Repack Ur Matcha dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_repack_ur_matcha","borderName":"Repack Ur Matcha"}', '2025-10-08 13:40:10'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759931070714', 'user_1759884167043_vvrak6mmo', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-08 13:44:30'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759933523984', 'user_1759884167043_vvrak6mmo', '', 'Border Gold dipilih', 'Anda mengubah border profil', '{"borderId":"gold","borderName":"Gold"}', '2025-10-08 14:25:23'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759933531743', 'user_1759884167043_vvrak6mmo', '', 'Border Default dipilih', 'Anda mengubah border profil', '{"borderId":"default","borderName":"Default"}', '2025-10-08 14:25:31'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759933533810', 'user_1759884167043_vvrak6mmo', '', 'Border Daily Whisk dipilih', 'Anda mengubah border profil', '{"borderId":"border_25000_daily_whisk","borderName":"Daily Whisk"}', '2025-10-08 14:25:33'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759933621729', 'user_1759884167043_vvrak6mmo', '', 'Border Gold dipilih', 'Anda mengubah border profil', '{"borderId":"gold","borderName":"Gold"}', '2025-10-08 14:27:01'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759936997343', 'user_1759884167043_vvrak6mmo', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-08 15:23:17'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759937000233', 'user_1759884167043_vvrak6mmo', '', 'Border Gold dipilih', 'Anda mengubah border profil', '{"borderId":"gold","borderName":"Gold"}', '2025-10-08 15:23:20'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759937002585', 'user_1759884167043_vvrak6mmo', '', 'Border Daily Whisk dipilih', 'Anda mengubah border profil', '{"borderId":"border_25000_daily_whisk","borderName":"Daily Whisk"}', '2025-10-08 15:23:22'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759937018191', 'user_1759884167043_vvrak6mmo', '', 'Border Dragon Matcha Pavilion dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion"}', '2025-10-08 15:23:38'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759937028105', 'user_1759884167043_vvrak6mmo', '', 'Border Default dipilih', 'Anda mengubah border profil', '{"borderId":"default","borderName":"Default"}', '2025-10-08 15:23:48'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759937037461', 'user_1759884167043_vvrak6mmo', '', 'Border Daily Whisk dipilih', 'Anda mengubah border profil', '{"borderId":"border_25000_daily_whisk","borderName":"Daily Whisk"}', '2025-10-08 15:23:57'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759942852485', 'user_1759884167043_vvrak6mmo', '', 'Border Gold dipilih', 'Anda mengubah border profil', '{"borderId":"gold","borderName":"Gold"}', '2025-10-08 17:00:52'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759942854495', 'user_1759884167043_vvrak6mmo', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-08 17:00:54'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1759942856942', 'user_1759884167043_vvrak6mmo', '', 'Border Sacred Sakura dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_sacred_sakura","borderName":"Sacred Sakura"}', '2025-10-08 17:00:56'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1760098770245', 'user_1759884167043_vvrak6mmo', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-10 12:19:30');

INSERT INTO `activity` VALUES
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1760098778338', 'user_1759884167043_vvrak6mmo', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-10 12:19:38'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1760098780282', 'user_1759884167043_vvrak6mmo', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-10 12:19:40'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1760098781609', 'user_1759884167043_vvrak6mmo', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-10 12:19:41'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1760099324636', 'user_1759884167043_vvrak6mmo', '', 'Border Matcha dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_matcha","borderName":"Matcha"}', '2025-10-10 12:28:44'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1760099376161', 'user_1759884167043_vvrak6mmo', '', 'Border Daily Whisk dipilih', 'Anda mengubah border profil', '{"borderId":"border_25000_daily_whisk","borderName":"Daily Whisk"}', '2025-10-10 12:29:36'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1760104894502', 'user_1759884167043_vvrak6mmo', '', 'Border Sacred Sakura dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_sacred_sakura","borderName":"Sacred Sakura"}', '2025-10-10 14:01:34'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1760104900980', 'user_1759884167043_vvrak6mmo', '', 'Border Dragon Matcha Pavilion dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion"}', '2025-10-10 14:01:40'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1760147818636', 'user_1759884167043_vvrak6mmo', '', 'Border Daily Whisk dipilih', 'Anda mengubah border profil', '{"borderId":"border_25000_daily_whisk","borderName":"Daily Whisk"}', '2025-10-11 01:56:58'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1760147841513', 'user_1759884167043_vvrak6mmo', '', 'Border Repack Ur Matcha dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_repack_ur_matcha","borderName":"Repack Ur Matcha"}', '2025-10-11 01:57:21'),
('user_1759884167043_vvrak6mmo_BORDER_SELECT_1760233630831', 'user_1759884167043_vvrak6mmo', '', 'Border Dessert Time! dipilih', 'Anda mengubah border profil', '{"borderId":"border_25000_dessert_time","borderName":"Dessert Time!"}', '2025-10-12 01:47:10'),
('user_1759884167043_vvrak6mmo_PROFILE_UPDATE_1759895214587', 'user_1759884167043_vvrak6mmo', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-08 03:46:54'),
('user_1759884167043_vvrak6mmo_PROFILE_UPDATE_1759897916476', 'user_1759884167043_vvrak6mmo', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-08 04:31:56'),
('user_1759884167043_vvrak6mmo_PROFILE_UPDATE_1759928955064', 'user_1759884167043_vvrak6mmo', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-08 13:09:15'),
('user_1759884167043_vvrak6mmo_PROFILE_UPDATE_1759942845553', 'user_1759884167043_vvrak6mmo', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-08 17:00:45'),
('user_1759884167043_vvrak6mmo_PROFILE_UPDATE_1760050831662', 'user_1759884167043_vvrak6mmo', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-09 23:00:31'),
('user_1759943266360_9a86e2sb8_BORDER_PURCHASE_1759943462598', 'user_1759943266360_9a86e2sb8', '', 'Border Dragon Matcha Pavilion dibeli', 'Anda membeli border seharga 50000 poin', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion","price":50000}', '2025-10-08 17:11:02'),
('user_1759943266360_9a86e2sb8_BORDER_PURCHASE_1759953060368', 'user_1759943266360_9a86e2sb8', '', 'Border Sacred Sakura dibeli', 'Anda membeli border seharga 50000 poin', '{"borderId":"border_50000_sacred_sakura","borderName":"Sacred Sakura","price":50000}', '2025-10-08 19:51:00'),
('user_1759943266360_9a86e2sb8_BORDER_PURCHASE_1759958692370', 'user_1759943266360_9a86e2sb8', '', 'Border Green Tea dibeli', 'Anda membeli border seharga 10000 poin', '{"borderId":"border_10000_green_tea","borderName":"Green Tea","price":10000}', '2025-10-08 21:24:52'),
('user_1759943266360_9a86e2sb8_BORDER_PURCHASE_1759964239789', 'user_1759943266360_9a86e2sb8', '', 'Border Let_s Drink! dibeli', 'Anda membeli border seharga 25000 poin', '{"borderId":"border_25000_lets_drink","borderName":"Let_s Drink!","price":25000}', '2025-10-08 22:57:19'),
('user_1759943266360_9a86e2sb8_BORDER_PURCHASE_1759970046101', 'user_1759943266360_9a86e2sb8', '', 'Border Daily Whisk dibeli', 'Anda membeli border seharga 25000 poin', '{"borderId":"border_25000_daily_whisk","borderName":"Daily Whisk","price":25000}', '2025-10-09 00:34:06'),
('user_1759943266360_9a86e2sb8_BORDER_PURCHASE_1759990652221', 'user_1759943266360_9a86e2sb8', '', 'Border Matcha dibeli', 'Anda membeli border seharga 10000 poin', '{"borderId":"border_10000_matcha","borderName":"Matcha","price":10000}', '2025-10-09 06:17:32'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759943466177', 'user_1759943266360_9a86e2sb8', '', 'Border Dragon Matcha Pavilion dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion"}', '2025-10-08 17:11:06'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759953060896', 'user_1759943266360_9a86e2sb8', '', 'Border Sacred Sakura dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_sacred_sakura","borderName":"Sacred Sakura"}', '2025-10-08 19:51:00'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759953960468', 'user_1759943266360_9a86e2sb8', '', 'Border Dragon Matcha Pavilion dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion"}', '2025-10-08 20:06:00'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759958694572', 'user_1759943266360_9a86e2sb8', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-08 21:24:54'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759961653156', 'user_1759943266360_9a86e2sb8', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-08 22:14:13'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759961871140', 'user_1759943266360_9a86e2sb8', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-08 22:17:51'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759962611296', 'user_1759943266360_9a86e2sb8', '', 'Border Dragon Matcha Pavilion dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion"}', '2025-10-08 22:30:11'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759962614717', 'user_1759943266360_9a86e2sb8', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-08 22:30:14'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759962617013', 'user_1759943266360_9a86e2sb8', '', 'Border Dragon Matcha Pavilion dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion"}', '2025-10-08 22:30:17'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759963512066', 'user_1759943266360_9a86e2sb8', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-08 22:45:12'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759964241882', 'user_1759943266360_9a86e2sb8', '', 'Border Let_s Drink! dipilih', 'Anda mengubah border profil', '{"borderId":"border_25000_lets_drink","borderName":"Let_s Drink!"}', '2025-10-08 22:57:21'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759964601348', 'user_1759943266360_9a86e2sb8', '', 'Border Dragon Matcha Pavilion dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion"}', '2025-10-08 23:03:21'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759964875009', 'user_1759943266360_9a86e2sb8', '', 'Border Sacred Sakura dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_sacred_sakura","borderName":"Sacred Sakura"}', '2025-10-08 23:07:55'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759970048619', 'user_1759943266360_9a86e2sb8', '', 'Border Daily Whisk dipilih', 'Anda mengubah border profil', '{"borderId":"border_25000_daily_whisk","borderName":"Daily Whisk"}', '2025-10-09 00:34:08'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759983553921', 'user_1759943266360_9a86e2sb8', '', 'Border Green Tea dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_green_tea","borderName":"Green Tea"}', '2025-10-09 04:19:13'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759990654587', 'user_1759943266360_9a86e2sb8', '', 'Border Matcha dipilih', 'Anda mengubah border profil', '{"borderId":"border_10000_matcha","borderName":"Matcha"}', '2025-10-09 06:17:34'),
('user_1759943266360_9a86e2sb8_BORDER_SELECT_1759990660006', 'user_1759943266360_9a86e2sb8', '', 'Border Dragon Matcha Pavilion dipilih', 'Anda mengubah border profil', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion"}', '2025-10-09 06:17:40'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759943656892', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-08 17:14:16'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759953048804', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-08 19:50:48'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759963268669', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-08 22:41:08'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759963275417', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-08 22:41:15'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759963277557', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-08 22:41:17'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759963343299', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-08 22:42:23'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759963435380', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-08 22:43:55'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759963437260', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-08 22:43:57'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759963468110', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-08 22:44:28'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759964101059', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-08 22:55:01'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759964293477', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-08 22:58:13'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759964506159', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-08 23:01:46'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759964616940', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-08 23:03:36'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759964864938', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-08 23:07:44'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759964903622', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-08 23:08:23'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759970335907', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-09 00:38:55'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759970626597', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-09 00:43:46'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759970756155', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-09 00:45:56'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759970830323', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-09 00:47:10'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759970835063', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-09 00:47:15'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759971000494', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-09 00:50:00'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759971002847', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-09 00:50:02'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759971216374', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-09 00:53:36'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759971219266', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-09 00:53:39'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759971329426', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-09 00:55:29'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759971331682', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-09 00:55:31'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759971792832', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-09 01:03:12'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759972070961', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Foto profil diperbarui', 'Anda mengubah foto profil', NULL, '2025-10-09 01:07:50'),
('user_1759943266360_9a86e2sb8_PROFILE_UPDATE_1759972072670', 'user_1759943266360_9a86e2sb8', 'PROFILE_UPDATE', 'Profil diperbarui', 'Anda mengubah informasi profil', NULL, '2025-10-09 01:07:52'),
('user_1759983668131_rmpq22w5m_ACHIEVEMENT_UNLOCKED_1760062706373', 'user_1759983668131_rmpq22w5m', '', '🏆 FORUM REGULAR Completed!', 'You\'ve earned 50 points!', '{"achievementType":"FORUM_REGULAR","points":50}', '2025-10-10 02:18:26');

-- Table structure for border
DROP TABLE IF EXISTS `border`;
CREATE TABLE `border` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `rarity` enum('Default','Common','Uncommon','Rare','Epic','Legendary','Mythic','Bronze','Silver','Gold') NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_border_active` (`isActive`),
  KEY `idx_border_rarity` (`rarity`),
  KEY `idx_border_sort_order` (`sortOrder`),
  KEY `idx_border_price` (`price`)
);

-- Data for table border
INSERT INTO `border` VALUES
('border_10000_green_tea', 'Green Tea', 'Border Green Tea - shop item', '/borders/GreenTea.png', 10000, 'Uncommon', 1, 10, '2025-10-08 04:04:21', '2025-10-08 05:16:03'),
('border_10000_matcha', 'Matcha', 'Border Matcha - shop item', '/borders/Matcha.png', 10000, 'Uncommon', 1, 11, '2025-10-08 04:04:21', '2025-10-08 05:16:03'),
('border_10000_repack_ur_matcha', 'Repack Ur Matcha', 'Border Repack Ur Matcha - shop item', '/borders/RepackUrMatcha.png', 10000, 'Uncommon', 1, 12, '2025-10-08 04:04:21', '2025-10-08 05:16:03'),
('border_25000_daily_whisk', 'Daily Whisk', 'Border Daily Whisk - shop item', '/borders/DailyWhisk.png', 25000, 'Epic', 1, 20, '2025-10-08 04:04:21', '2025-10-08 05:16:03'),
('border_25000_dessert_time', 'Dessert Time!', 'Border Dessert Time! - shop item', '/borders/DessertTime!.png', 25000, 'Epic', 1, 21, '2025-10-08 04:04:21', '2025-10-08 05:16:03'),
('border_25000_lets_drink', 'Let_s Drink!', 'Border Let_s Drink! - shop item', '/borders/Let_sDrink!.png', 25000, 'Epic', 1, 22, '2025-10-08 04:04:21', '2025-10-08 05:16:03'),
('border_50000_dragon_matcha_pavilion', 'Dragon Matcha Pavilion', 'Border Dragon Matcha Pavilion - shop item', '/borders/DragonMatchaPavilion.png', 50000, 'Legendary', 1, 30, '2025-10-08 04:04:21', '2025-10-08 05:16:03'),
('border_50000_sacred_sakura', 'Sacred Sakura', 'Border Sacred Sakura - shop item', '/borders/SacredSakura.png', 50000, 'Legendary', 1, 31, '2025-10-08 04:04:21', '2025-10-08 05:16:03'),
('bronze', 'Bronze', 'Border bronze untuk achievement pertama', '/borders/BronzeBorderProfile.png', NULL, 'Bronze', 1, 1, '2025-10-08 03:43:14', '2025-10-08 03:43:36'),
('default', 'Default', 'Border default untuk semua user', '/borders/default.svg', NULL, 'Default', 1, 1, '2025-10-08 03:43:14', '2025-10-08 03:43:36'),
('gold', 'Gold', 'Border gold untuk user premium', '/borders/GoldBorderProfile.png', NULL, 'Gold', 1, 1, '2025-10-08 03:43:14', '2025-10-08 03:43:36'),
('silver', 'Silver', 'Border silver untuk user aktif', '/borders/SilverBorderProfile.png', NULL, 'Silver', 1, 1, '2025-10-08 03:43:14', '2025-10-08 03:43:36');

-- Table structure for borderunlock
DROP TABLE IF EXISTS `borderunlock`;
CREATE TABLE `borderunlock` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `borderId` varchar(191) NOT NULL,
  `unlockType` enum('ACHIEVEMENT','PURCHASE','ADMIN') NOT NULL,
  `unlockedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `pricePaid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `BorderUnlock_userId_borderId_key` (`userId`,`borderId`),
  KEY `idx_borderunlock_user_id` (`userId`),
  KEY `idx_borderunlock_border_id` (`borderId`),
  KEY `idx_borderunlock_user_border` (`userId`,`borderId`),
  KEY `idx_border_purchase` (`userId`,`borderId`,`unlockedAt`),
  CONSTRAINT `BorderUnlock_borderId_fkey` FOREIGN KEY (`borderId`) REFERENCES `border` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `BorderUnlock_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Data for table borderunlock
INSERT INTO `borderunlock` VALUES
('user_1759884167043_vvrak6mmo_border_10000_green_tea_1759896273381', 'user_1759884167043_vvrak6mmo', 'border_10000_green_tea', 'PURCHASE', '2025-10-08 04:04:33', 10000),
('user_1759884167043_vvrak6mmo_border_10000_matcha_1759896902890', 'user_1759884167043_vvrak6mmo', 'border_10000_matcha', 'PURCHASE', '2025-10-08 04:15:02', 10000),
('user_1759884167043_vvrak6mmo_border_10000_repack_ur_matcha_1759930808647', 'user_1759884167043_vvrak6mmo', 'border_10000_repack_ur_matcha', 'PURCHASE', '2025-10-08 13:40:08', 10000),
('user_1759884167043_vvrak6mmo_border_25000_daily_whisk_1759930807509', 'user_1759884167043_vvrak6mmo', 'border_25000_daily_whisk', 'PURCHASE', '2025-10-08 13:40:07', 25000),
('user_1759884167043_vvrak6mmo_border_25000_dessert_time_1759930805222', 'user_1759884167043_vvrak6mmo', 'border_25000_dessert_time', 'PURCHASE', '2025-10-08 13:40:05', 25000),
('user_1759884167043_vvrak6mmo_border_25000_lets_drink_1759900491691', 'user_1759884167043_vvrak6mmo', 'border_25000_lets_drink', 'PURCHASE', '2025-10-08 05:14:51', 25000),
('user_1759884167043_vvrak6mmo_border_50000_dragon_matcha_pavilion_1759897337350', 'user_1759884167043_vvrak6mmo', 'border_50000_dragon_matcha_pavilion', 'PURCHASE', '2025-10-08 04:22:17', 50000),
('user_1759884167043_vvrak6mmo_border_50000_sacred_sakura_1759896365332', 'user_1759884167043_vvrak6mmo', 'border_50000_sacred_sakura', 'PURCHASE', '2025-10-08 04:06:05', 50000),
('user_1759884167043_vvrak6mmo_gold_1759895820858', 'user_1759884167043_vvrak6mmo', 'gold', 'PURCHASE', '2025-10-08 03:57:00', 500),
('user_1759943266360_9a86e2sb8_border_10000_green_tea_1759958691921', 'user_1759943266360_9a86e2sb8', 'border_10000_green_tea', 'PURCHASE', '2025-10-08 21:24:51', 10000),
('user_1759943266360_9a86e2sb8_border_10000_matcha_1759990651911', 'user_1759943266360_9a86e2sb8', 'border_10000_matcha', 'PURCHASE', '2025-10-09 06:17:31', 10000),
('user_1759943266360_9a86e2sb8_border_25000_daily_whisk_1759970045698', 'user_1759943266360_9a86e2sb8', 'border_25000_daily_whisk', 'PURCHASE', '2025-10-09 00:34:05', 25000),
('user_1759943266360_9a86e2sb8_border_25000_lets_drink_1759964239259', 'user_1759943266360_9a86e2sb8', 'border_25000_lets_drink', 'PURCHASE', '2025-10-08 22:57:19', 25000),
('user_1759943266360_9a86e2sb8_border_50000_dragon_matcha_pavilion_1759943461853', 'user_1759943266360_9a86e2sb8', 'border_50000_dragon_matcha_pavilion', 'PURCHASE', '2025-10-08 17:11:01', 50000),
('user_1759943266360_9a86e2sb8_border_50000_sacred_sakura_1759953057813', 'user_1759943266360_9a86e2sb8', 'border_50000_sacred_sakura', 'PURCHASE', '2025-10-08 19:50:57', 50000);

-- Table structure for chat_conversations
DROP TABLE IF EXISTS `chat_conversations`;
CREATE TABLE `chat_conversations` (
  `id` varchar(255) NOT NULL,
  `type` enum('DIRECT','GROUP') NOT NULL DEFAULT 'DIRECT',
  `name` varchar(255) DEFAULT NULL,
  `created_by` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_message_at` timestamp NULL DEFAULT NULL,
  `last_message_content` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_created_by` (`created_by`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_updated_at` (`updated_at`),
  KEY `idx_last_message_at` (`last_message_at`)
);

-- Data for table chat_conversations
INSERT INTO `chat_conversations` VALUES
('conv_direct_1760351384991_1u3b5gypz', 'DIRECT', NULL, 'user1', '2025-10-13 10:29:44', '2025-10-13 10:29:45', '2025-10-13 10:29:45', 'Hello from test script!', 1),
('conv_direct_1760354009100_r6ct12a3q', 'DIRECT', NULL, 'user_1759983668131_rmpq22w5m', '2025-10-13 11:13:29', '2025-10-13 13:12:04', '2025-10-13 13:12:04', 'test message from API', 1),
('conv_direct_1760362109901_6d2dd4kkn', 'DIRECT', NULL, 'user_1759943266360_9a86e2sb8', '2025-10-13 13:28:29', '2025-10-13 14:16:30', '2025-10-13 13:44:39', 's', 1),
('conv_direct_1760365056865_l51kf1ajx', 'DIRECT', NULL, 'user_1759943266360_9a86e2sb8', '2025-10-13 14:17:36', '2025-10-13 14:17:42', '2025-10-13 14:17:42', 'p', 1),
('conv_direct_1760622727288_75o8qy5o5', 'DIRECT', NULL, 'user_1760616211771_rqixrwwi5', '2025-10-16 13:52:07', '2025-10-16 13:52:09', NULL, NULL, 1);

-- Table structure for chat_message_reactions
DROP TABLE IF EXISTS `chat_message_reactions`;
CREATE TABLE `chat_message_reactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `reaction` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_reaction` (`message_id`,`user_id`,`reaction`),
  KEY `idx_message_id` (`message_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_reaction` (`reaction`),
  CONSTRAINT `chat_message_reactions_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `chat_messages` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_message_reactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

-- Data for table chat_message_reactions
INSERT INTO `chat_message_reactions` VALUES
(2, 'msg_1760351385375_pn0cv2jkg', 'user2', '❤️', '2025-10-13 10:29:46');

-- Table structure for chat_messages
DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE `chat_messages` (
  `id` varchar(255) NOT NULL,
  `conversation_id` varchar(255) NOT NULL,
  `sender_id` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` enum('TEXT','IMAGE','FILE','VOICE','SYSTEM') DEFAULT 'TEXT',
  `file_url` varchar(512) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `reply_to` varchar(255) DEFAULT NULL,
  `is_edited` tinyint(1) DEFAULT 0,
  `edited_at` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_conversation_id` (`conversation_id`),
  KEY `idx_sender_id` (`sender_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_reply_to` (`reply_to`),
  KEY `idx_type` (`type`),
  CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

-- Data for table chat_messages
INSERT INTO `chat_messages` VALUES
('msg_1760351385193_aye20lgas', 'conv_direct_1760351384991_1u3b5gypz', 'user1', 'Hello from test script!', 'TEXT', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, '2025-10-13 10:29:45', '2025-10-13 10:29:45'),
('msg_1760351385375_pn0cv2jkg', 'conv_direct_1760351384991_1u3b5gypz', 'user1', 'Hello from test script!', 'TEXT', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, '2025-10-13 10:29:45', '2025-10-13 10:29:45'),
('msg_1760354333975_ns9gd71s0', 'conv_direct_1760354009100_r6ct12a3q', 'user_1759983668131_rmpq22w5m', 'oii', 'TEXT', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, '2025-10-13 11:18:53', '2025-10-13 11:18:53'),
('msg_1760354385344_yjt7vwagp', 'conv_direct_1760354009100_r6ct12a3q', 'cmggz5ihr007z1hus4ww2mocp', 'etes', 'TEXT', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, '2025-10-13 11:19:45', '2025-10-13 11:19:45'),
('msg_1760355223230_kzx6ai9pw', 'conv_direct_1760354009100_r6ct12a3q', 'cmggz5ihr007z1hus4ww2mocp', 'ssssssssssssssssssssssssssss', 'TEXT', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, '2025-10-13 11:33:43', '2025-10-13 11:33:43'),
('msg_1760357853058_qadg02u0m', 'conv_direct_1760354009100_r6ct12a3q', 'cmggz5ihr007z1hus4ww2mocp', 'ssda', 'TEXT', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, '2025-10-13 12:17:33', '2025-10-13 12:17:33'),
('msg_1760359459997_2uur78ge2', 'conv_direct_1760354009100_r6ct12a3q', 'cmggz5ihr007z1hus4ww2mocp', 'ss', 'TEXT', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, '2025-10-13 12:44:20', '2025-10-13 12:44:20'),
('msg_1760361124133_hfqfdj6qr', 'conv_direct_1760354009100_r6ct12a3q', 'user_1759983668131_rmpq22w5m', 'test message from API', 'TEXT', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, '2025-10-13 13:12:04', '2025-10-13 13:12:04'),
('msg_1760362112573_6v5dknq44', 'conv_direct_1760362109901_6d2dd4kkn', 'user_1759943266360_9a86e2sb8', 'oi', 'TEXT', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, '2025-10-13 13:28:32', '2025-10-13 13:28:32'),
('msg_1760362463936_kapuc3ama', 'conv_direct_1760362109901_6d2dd4kkn', 'user_1759943266360_9a86e2sb8', 'nah ini bisa nih', 'TEXT', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, '2025-10-13 13:34:23', '2025-10-13 13:34:23'),
('msg_1760363079608_2h1db25ak', 'conv_direct_1760362109901_6d2dd4kkn', 'user_1759943266360_9a86e2sb8', 's', 'TEXT', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, '2025-10-13 13:44:39', '2025-10-13 13:44:39'),
('msg_1760365062547_trgws1ts5', 'conv_direct_1760365056865_l51kf1ajx', 'user_1759943266360_9a86e2sb8', 'p', 'TEXT', NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, '2025-10-13 14:17:42', '2025-10-13 14:17:42');

-- Table structure for chat_participants
DROP TABLE IF EXISTS `chat_participants`;
CREATE TABLE `chat_participants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversation_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `role` enum('MEMBER','ADMIN') DEFAULT 'MEMBER',
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_read_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_muted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_participant` (`conversation_id`,`user_id`),
  KEY `idx_conversation_id` (`conversation_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_joined_at` (`joined_at`),
  KEY `idx_last_read_at` (`last_read_at`),
  CONSTRAINT `chat_participants_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

-- Data for table chat_participants
INSERT INTO `chat_participants` VALUES
(53, 'conv_direct_1760351384991_1u3b5gypz', 'user1', 'ADMIN', '2025-10-13 10:29:45', NULL, 1, 0),
(54, 'conv_direct_1760351384991_1u3b5gypz', 'user2', 'MEMBER', '2025-10-13 10:29:45', NULL, 1, 0),
(55, 'conv_direct_1760354009100_r6ct12a3q', 'user_1759983668131_rmpq22w5m', 'ADMIN', '2025-10-13 11:13:29', '2025-10-13 11:18:51', 1, 0),
(56, 'conv_direct_1760354009100_r6ct12a3q', 'cmggz5ihr007z1hus4ww2mocp', 'MEMBER', '2025-10-13 11:13:29', '2025-10-13 12:44:25', 1, 0),
(57, 'conv_direct_1760362109901_6d2dd4kkn', 'user_1759943266360_9a86e2sb8', 'ADMIN', '2025-10-13 13:28:29', '2025-10-13 14:16:30', 1, 0),
(58, 'conv_direct_1760362109901_6d2dd4kkn', 'user_1759884167043_vvrak6mmo', 'MEMBER', '2025-10-13 13:28:29', NULL, 1, 0),
(59, 'conv_direct_1760365056865_l51kf1ajx', 'user_1759943266360_9a86e2sb8', 'ADMIN', '2025-10-13 14:17:36', '2025-10-13 14:17:40', 1, 0),
(60, 'conv_direct_1760365056865_l51kf1ajx', 'cmggz5ihr007z1hus4ww2mocp', 'MEMBER', '2025-10-13 14:17:36', NULL, 1, 0),
(61, 'conv_direct_1760622727288_75o8qy5o5', 'user_1760616211771_rqixrwwi5', 'ADMIN', '2025-10-16 13:52:07', '2025-10-16 13:52:09', 1, 0),
(62, 'conv_direct_1760622727288_75o8qy5o5', 'user_1759983668131_rmpq22w5m', 'MEMBER', '2025-10-16 13:52:07', NULL, 1, 0);

-- Table structure for chat_typing_indicators
DROP TABLE IF EXISTS `chat_typing_indicators`;
CREATE TABLE `chat_typing_indicators` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversation_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `is_typing` tinyint(1) DEFAULT 1,
  `started_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_typing` (`conversation_id`,`user_id`),
  KEY `idx_conversation_id` (`conversation_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_updated_at` (`updated_at`),
  CONSTRAINT `chat_typing_indicators_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_typing_indicators_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

-- Data for table chat_typing_indicators
INSERT INTO `chat_typing_indicators` VALUES
(76, 'conv_direct_1760354009100_r6ct12a3q', 'user_1759983668131_rmpq22w5m', 1, '2025-10-13 13:12:19', '2025-10-13 13:12:19'),
(92, 'conv_direct_1760354009100_r6ct12a3q', 'cmggz5ihr007z1hus4ww2mocp', 0, '2025-10-13 12:44:19', '2025-10-13 12:44:31'),
(507, 'conv_direct_1760362109901_6d2dd4kkn', 'user_1759943266360_9a86e2sb8', 0, '2025-10-13 13:28:31', '2025-10-13 14:16:21');

-- Table structure for claimed_achievement_rewards
DROP TABLE IF EXISTS `claimed_achievement_rewards`;
CREATE TABLE `claimed_achievement_rewards` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `achievement_type` varchar(191) NOT NULL,
  `achievement_level` int(11) NOT NULL,
  `points_awarded` int(11) NOT NULL,
  `title_reward` varchar(191) NOT NULL,
  `badge_color` varchar(191) NOT NULL,
  `claimed_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `claimed_rewards_user_achievement_level` (`user_id`,`achievement_type`,`achievement_level`),
  CONSTRAINT `claimed_achievement_rewards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table structure for comment_like
DROP TABLE IF EXISTS `comment_like`;
CREATE TABLE `comment_like` (
  `id` varchar(191) NOT NULL,
  `commentId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `comment_like_commentId_userId_key` (`commentId`,`userId`),
  KEY `comment_like_userId_fkey` (`userId`),
  CONSTRAINT `comment_like_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `post_comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comment_like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table structure for conversation
DROP TABLE IF EXISTS `conversation`;
CREATE TABLE `conversation` (
  `id` varchar(191) NOT NULL,
  `type` enum('DIRECT','GROUP') NOT NULL DEFAULT 'DIRECT',
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
);

-- Table structure for conversation_participant
DROP TABLE IF EXISTS `conversation_participant`;
CREATE TABLE `conversation_participant` (
  `id` varchar(191) NOT NULL,
  `conversationId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `joinedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `lastReadAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `role` enum('ADMIN','MEMBER') NOT NULL DEFAULT 'MEMBER',
  PRIMARY KEY (`id`),
  UNIQUE KEY `conversation_participant_conversationId_userId_key` (`conversationId`,`userId`),
  KEY `conversation_participant_conversationId_idx` (`conversationId`),
  KEY `conversation_participant_userId_idx` (`userId`),
  CONSTRAINT `conversation_participant_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `conversation_participant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table structure for forum_categories
DROP TABLE IF EXISTS `forum_categories`;
CREATE TABLE `forum_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `color` varchar(20) DEFAULT 'gray',
  `icon` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
);

-- Data for table forum_categories
INSERT INTO `forum_categories` VALUES
(1, 'manfaat', 'Manfaat Kesehatan', 'Diskusi tentang manfaat matcha untuk kesehatan', 'green', 'heart', '2025-10-08 04:41:58', '2025-10-08 04:41:58'),
(2, 'teknik-seduh', 'Teknik Seduh', 'Berbagi teknik dan cara menyeduh matcha', 'blue', 'coffee', '2025-10-08 04:41:58', '2025-10-08 04:41:58'),
(3, 'ulasan-produk', 'Ulasan Produk', 'Review dan ulasan produk matcha', 'purple', 'star', '2025-10-08 04:41:58', '2025-10-08 04:41:58'),
(4, 'resep', 'Resep', 'Berbagi resep matcha dan kreasi minuman', 'orange', 'book', '2025-10-08 04:41:58', '2025-10-08 04:41:58'),
(5, 'general', 'General', 'General discussion and topics', '#6366f1', 'MessageCircle', '2025-10-10 05:46:48', '2025-10-10 05:46:48'),
(6, 'introduction', 'Introduction', 'Introduce yourself to the community', '#10b981', 'UserPlus', '2025-10-10 05:46:48', '2025-10-10 05:46:48'),
(7, 'help', 'Help & Support', 'Get help with various topics', '#f59e0b', 'HelpCircle', '2025-10-10 05:46:48', '2025-10-10 05:46:48'),
(8, 'feedback', 'Feedback', 'Share your feedback and suggestions', '#ef4444', 'MessageSquare', '2025-10-10 05:46:48', '2025-10-10 05:46:48'),
(9, 'off-topic', 'Off Topic', 'Casual conversations and fun topics', '#8b5cf6', 'Coffee', '2025-10-10 05:46:48', '2025-10-10 05:46:48');

-- Table structure for forum_likes
DROP TABLE IF EXISTS `forum_likes`;
CREATE TABLE `forum_likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `target_id` varchar(20) NOT NULL,
  `target_type` enum('thread','reply') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_like` (`user_id`,`target_id`,`target_type`),
  KEY `idx_target` (`target_id`,`target_type`),
  KEY `idx_user` (`user_id`),
  KEY `idx_forum_likes_user_id` (`user_id`),
  KEY `idx_forum_likes_target` (`target_id`,`target_type`)
);

-- Table structure for forum_replies
DROP TABLE IF EXISTS `forum_replies`;
CREATE TABLE `forum_replies` (
  `id` varchar(20) NOT NULL,
  `thread_id` varchar(20) NOT NULL,
  `parent_id` varchar(20) DEFAULT NULL,
  `content` text NOT NULL,
  `author_id` varchar(50) NOT NULL,
  `author_name` varchar(255) DEFAULT NULL,
  `author_avatar` varchar(500) DEFAULT NULL,
  `author_border` varchar(100) DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_forum_replies_thread_id` (`thread_id`),
  KEY `idx_forum_replies_user_id` (`author_id`),
  KEY `idx_forum_replies_created_at` (`created_at`),
  KEY `idx_forum_reply_thread_id` (`thread_id`),
  KEY `idx_forum_reply_user_id` (`author_id`),
  KEY `idx_forum_reply_created_at` (`created_at`),
  KEY `idx_forum_reply_parent_id` (`parent_id`),
  KEY `idx_forum_reply_is_deleted` (`is_deleted`),
  CONSTRAINT `forum_replies_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `forum_threads` (`id`) ON DELETE CASCADE,
  CONSTRAINT `forum_replies_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `forum_replies` (`id`) ON DELETE CASCADE
);

-- Data for table forum_replies
INSERT INTO `forum_replies` VALUES
('reply_1760084977395_', 'thread_1760084140670', NULL, 'aku capek anjing', 'user_1760083882442_wdec4wjq2', 'Ananda Alviansyah', NULL, 'default', 0, 0, '2025-10-10 08:29:37', '2025-10-10 08:29:37'),
('reply_1760084988186_', 'thread_1760084140670', 'reply_1760084977395_', '@AnandaAlviansyah iya jir cape banget', 'user_1760083882442_wdec4wjq2', 'Ananda Alviansyah', NULL, 'default', 0, 0, '2025-10-10 08:29:48', '2025-10-10 08:29:48'),
('reply_1760086116895_', 'thread_1760084140670', NULL, 'awaowk anjing bisa gini', 'user_1760083882442_wdec4wjq2', 'Ananda Alviansyah', NULL, 'default', 0, 0, '2025-10-10 08:48:36', '2025-10-10 08:48:36'),
('reply_1760145790631', 'thread_1760144735110', NULL, 'Masa iya gitu sih bang', 'user_1759884167043_vvrak6mmo', NULL, NULL, NULL, 0, 0, '2025-10-11 01:23:10', '2025-10-11 01:23:10');

-- Table structure for forum_threads
DROP TABLE IF EXISTS `forum_threads`;
CREATE TABLE `forum_threads` (
  `id` varchar(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `excerpt` varchar(500) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `author_id` varchar(50) NOT NULL,
  `views` int(11) DEFAULT 0,
  `likes` int(11) DEFAULT 0,
  `replies` int(11) DEFAULT 0,
  `is_pinned` tinyint(1) DEFAULT 0,
  `is_locked` tinyint(1) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_reply_at` timestamp NULL DEFAULT NULL,
  `last_reply_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_forum_threads_user_id` (`author_id`),
  KEY `idx_forum_threads_created_at` (`created_at`),
  KEY `idx_forum_threads_category_id` (`category_id`),
  KEY `idx_forum_threads_is_pinned` (`is_pinned`),
  KEY `idx_forum_thread_user_id` (`author_id`),
  KEY `idx_forum_thread_created_at` (`created_at`),
  KEY `idx_forum_thread_category` (`category_id`),
  KEY `idx_forum_thread_is_pinned` (`is_pinned`),
  KEY `idx_forum_thread_is_locked` (`is_locked`),
  KEY `idx_forum_thread_is_deleted` (`is_deleted`),
  CONSTRAINT `forum_threads_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `forum_categories` (`id`) ON DELETE CASCADE
);

-- Data for table forum_threads
INSERT INTO `forum_threads` VALUES
('thread_1760083782214', 'Test Thread dari API', 'Ini adalah konten test thread yang dibuat via API testing.', 'Ini adalah konten test thread yang dibuat via API testing....', 1, 'cmggylajf00001hussdd4ajlp', 3, 0, 0, 0, 0, 0, '2025-10-10 08:09:42', '2025-10-10 09:00:20', NULL, NULL),
('thread_1760083943836', 'Test Thread via API', 'Ini adalah thread test yang dibuat via HTTP request untuk testing forum functionality.', 'Test thread via API', 1, 'cmggylajf00001hussdd4ajlp', 2, 0, 0, 0, 0, 0, '2025-10-10 08:12:23', '2025-10-10 08:53:12', NULL, NULL),
('thread_1760084140670', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '<p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 9, 'user_1760083882442_wdec4wjq2', 110, 0, 3, 0, 0, 0, '2025-10-10 08:15:40', '2025-10-10 11:56:26', '2025-10-10 08:48:36', 'user_1760083882442_wdec4wjq2'),
('thread_1760097413363', 'ssssssssssssssssssaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'sssssssssssssssssssssssssssssssssssssiiiiiiiiiiiiiiii', 'sssssssssssssssssssssssssssssssssssssiiiiiiiiiiiiiiii', 8, 'user_1759884167043_vvrak6mmo', 41, 0, 0, 0, 0, 0, '2025-10-10 11:56:53', '2025-10-10 14:24:52', NULL, NULL),
('thread_1760142395283', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 5, 'user_1759884167043_vvrak6mmo', 0, 0, 0, 0, 0, 0, '2025-10-11 00:26:35', '2025-10-11 00:26:35', NULL, NULL),
('thread_1760142427365', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '<p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 5, 'user_1759884167043_vvrak6mmo', 0, 0, 0, 0, 0, 0, '2025-10-11 00:27:07', '2025-10-11 00:27:07', NULL, NULL),
('thread_1760142429504', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '<p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 5, 'user_1759884167043_vvrak6mmo', 6, 0, 0, 0, 0, 0, '2025-10-11 00:27:09', '2025-10-11 00:47:57', NULL, NULL),
('thread_1760143699867', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '<img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="http://localhost:3000/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="/uploads/forum/forum_1760143691528_edvajy5v58.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><br>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 5, 'user_1759884167043_vvrak6mmo', 5, 0, 0, 0, 0, 0, '2025-10-11 00:48:19', '2025-10-11 01:04:04', NULL, NULL),
('thread_1760144671170', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '<p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 5, 'user_1759884167043_vvrak6mmo', 1, 0, 0, 0, 0, 0, '2025-10-11 01:04:31', '2025-10-11 01:04:31', NULL, NULL),
('thread_1760144706118', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'INI GIMANA YA BANG SOALNYA SUSAH NIHHH', 'INI GIMANA YA BANG SOALNYA SUSAH NIHHH', 7, 'user_1759884167043_vvrak6mmo', 1, 0, 0, 0, 0, 0, '2025-10-11 01:05:06', '2025-10-11 01:05:06', NULL, NULL),
('thread_1760144735110', 'sssssssssssssssssssssssssssssssssssss', '<img src="http://localhost:3000/uploads/forum/forum_1760144721941_ned7fnscr8c.jpg" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><img src="/uploads/forum/forum_1760144721941_ned7fnscr8c.jpg" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><br>INI LOGO BARU A UNTUK KITA SEMUA', 'INI LOGO BARU A UNTUK KITA SEMUA', 7, 'user_1759884167043_vvrak6mmo', 5, 0, 1, 0, 0, 0, '2025-10-11 01:05:35', '2025-10-11 01:23:32', '2025-10-11 01:23:10', 'user_1759884167043_vvrak6mmo'),
('thread_1760145978654', 'asssssssssssssssssssssssssssssss', '<p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 2, 'user_1759884167043_vvrak6mmo', 1, 0, 0, 0, 0, 0, '2025-10-11 01:26:18', '2025-10-11 01:26:20', NULL, NULL),
('thread_1760146247516', 'ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', '<p>ssssssssssssssssssssssssssssss</p>', 'ssssssssssssssssssssssssssssss', 9, 'user_1759884167043_vvrak6mmo', 4, 0, 0, 0, 0, 0, '2025-10-11 01:30:47', '2025-10-12 17:02:34', NULL, NULL),
('thread_1760288595566', 'pertanyaan tentang sesuatu yang sesuatu', '<img src="/uploads/social/social_1760288584170_61c3fn59395.png" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" style="display: block; margin: 8px 0;" /><br>Ini adalah sesuatu yang aku ingin tanyakan kepada teman teman disini', 'Ini adalah sesuatu yang aku ingin tanyakan kepada teman teman disini', 7, 'user_1759983668131_rmpq22w5m', 2, 0, 0, 0, 0, 0, '2025-10-12 17:03:15', '2025-10-13 03:13:42', NULL, NULL);

-- Table structure for forum_views
DROP TABLE IF EXISTS `forum_views`;
CREATE TABLE `forum_views` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) DEFAULT NULL,
  `thread_id` varchar(20) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_thread_user` (`thread_id`,`user_id`),
  KEY `idx_thread_ip` (`thread_id`,`ip_address`),
  CONSTRAINT `forum_views_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `forum_threads` (`id`) ON DELETE CASCADE
);

-- Table structure for friend
DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `friendId` varchar(255) NOT NULL,
  `status` enum('PENDING','ACCEPTED','BLOCKED') DEFAULT 'PENDING',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_friend_user_id` (`userId`),
  KEY `idx_friend_friend_id` (`friendId`),
  KEY `idx_friend_status` (`status`),
  KEY `idx_friend_created_at` (`createdAt`),
  KEY `idx_friend_user_friend` (`userId`,`friendId`)
);

-- Table structure for friendrequest
DROP TABLE IF EXISTS `friendrequest`;
CREATE TABLE `friendrequest` (
  `id` varchar(191) NOT NULL,
  `senderId` varchar(191) NOT NULL,
  `receiverId` varchar(191) NOT NULL,
  `status` enum('PENDING','ACCEPTED','DECLINED','BLOCKED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `FriendRequest_senderId_receiverId_key` (`senderId`,`receiverId`),
  KEY `FriendRequest_senderId_idx` (`senderId`),
  KEY `FriendRequest_receiverId_idx` (`receiverId`),
  KEY `idx_friend_request_sender_id` (`senderId`),
  KEY `idx_friend_request_receiver_id` (`receiverId`),
  KEY `idx_friend_request_status` (`status`),
  KEY `idx_friend_request_created_at` (`createdAt`),
  CONSTRAINT `FriendRequest_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FriendRequest_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Data for table friendrequest
INSERT INTO `friendrequest` VALUES
('cmgkhzrop00011h04hc7dg1yq', 'user_1759983668131_rmpq22w5m', 'user_1759884167043_vvrak6mmo', 'ACCEPTED', '2025-10-10 00:01:13', '2025-10-10 00:01:26'),
('cmgkvbpv300051hrcwd9ytxgr', 'user_1759884167043_vvrak6mmo', 'user_1759943266360_9a86e2sb8', 'ACCEPTED', '2025-10-10 06:14:25', '2025-10-10 06:14:36'),
('cmgomu0ol00011hdo79ap83bo', 'cmggz5ihr007z1hus4ww2mocp', 'user_1759983668131_rmpq22w5m', 'ACCEPTED', '2025-10-12 21:27:47', '2025-10-13 03:17:14');

-- Table structure for friendship
DROP TABLE IF EXISTS `friendship`;
CREATE TABLE `friendship` (
  `id` varchar(191) NOT NULL,
  `user1Id` varchar(191) NOT NULL,
  `user2Id` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `friendship_user1Id_user2Id_key` (`user1Id`,`user2Id`),
  KEY `friendship_user1Id_idx` (`user1Id`),
  KEY `friendship_user2Id_idx` (`user2Id`),
  CONSTRAINT `friendship_user1Id_fkey` FOREIGN KEY (`user1Id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `friendship_user2Id_fkey` FOREIGN KEY (`user2Id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Data for table friendship
INSERT INTO `friendship` VALUES
('cmgkvbygk00071hrclzubw8fw', 'user_1759884167043_vvrak6mmo', 'user_1759943266360_9a86e2sb8', '2025-10-10 06:14:36'),
('cmgozbewt00011hcs2zzsfyic', 'cmggz5ihr007z1hus4ww2mocp', 'user_1759983668131_rmpq22w5m', '2025-10-13 03:17:14'),
('friendship_1760318857622_gtcqttppi', 'user_1759983668131_rmpq22w5m', 'user_1759884167043_vvrak6mmo', '2025-10-13 01:27:37');

-- Table structure for message
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` varchar(191) NOT NULL,
  `conversationId` varchar(191) NOT NULL,
  `senderId` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `type` enum('TEXT','IMAGE','FILE','SYSTEM') NOT NULL DEFAULT 'TEXT',
  `replyToId` varchar(191) DEFAULT NULL,
  `isEdited` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `message_conversationId_createdAt_idx` (`conversationId`,`createdAt`),
  KEY `message_senderId_idx` (`senderId`),
  KEY `message_replyToId_fkey` (`replyToId`),
  CONSTRAINT `message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `message_replyToId_fkey` FOREIGN KEY (`replyToId`) REFERENCES `message` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table structure for message_attachment
DROP TABLE IF EXISTS `message_attachment`;
CREATE TABLE `message_attachment` (
  `id` varchar(191) NOT NULL,
  `messageId` varchar(191) NOT NULL,
  `type` enum('IMAGE','FILE','VIDEO') NOT NULL,
  `url` varchar(500) NOT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `mimeType` varchar(100) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `message_attachment_messageId_idx` (`messageId`),
  CONSTRAINT `message_attachment_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `message` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table structure for pointtransaction
DROP TABLE IF EXISTS `pointtransaction`;
CREATE TABLE `pointtransaction` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` enum('EARNED','SPENT','ADMIN_GIVEN','REFUND') NOT NULL,
  `amount` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `idx_pointtransaction_user_id` (`userId`),
  KEY `idx_pointtransaction_type` (`type`),
  KEY `idx_pointtransaction_created_at` (`createdAt`),
  KEY `idx_points_history` (`userId`,`createdAt`),
  CONSTRAINT `PointTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Data for table pointtransaction
INSERT INTO `pointtransaction` VALUES
('user_1759884167043_vvrak6mmo_border_10000_green_tea_1759896273384_tx', 'user_1759884167043_vvrak6mmo', 'SPENT', -10000, 'Membeli border Green Tea', '{"borderId":"border_10000_green_tea","borderName":"Green Tea","purchaseType":"border"}', '2025-10-08 04:04:33'),
('user_1759884167043_vvrak6mmo_border_10000_matcha_1759896902892_tx', 'user_1759884167043_vvrak6mmo', 'SPENT', -10000, 'Membeli border Matcha', '{"borderId":"border_10000_matcha","borderName":"Matcha","purchaseType":"border"}', '2025-10-08 04:15:02'),
('user_1759884167043_vvrak6mmo_border_10000_repack_ur_matcha_1759930808649_tx', 'user_1759884167043_vvrak6mmo', 'SPENT', -10000, 'Membeli border Repack Ur Matcha', '{"borderId":"border_10000_repack_ur_matcha","borderName":"Repack Ur Matcha","purchaseType":"border"}', '2025-10-08 13:40:08'),
('user_1759884167043_vvrak6mmo_border_25000_daily_whisk_1759930807512_tx', 'user_1759884167043_vvrak6mmo', 'SPENT', -25000, 'Membeli border Daily Whisk', '{"borderId":"border_25000_daily_whisk","borderName":"Daily Whisk","purchaseType":"border"}', '2025-10-08 13:40:07'),
('user_1759884167043_vvrak6mmo_border_25000_dessert_time_1759930805251_tx', 'user_1759884167043_vvrak6mmo', 'SPENT', -25000, 'Membeli border Dessert Time!', '{"borderId":"border_25000_dessert_time","borderName":"Dessert Time!","purchaseType":"border"}', '2025-10-08 13:40:05'),
('user_1759884167043_vvrak6mmo_border_25000_lets_drink_1759900491694_tx', 'user_1759884167043_vvrak6mmo', 'SPENT', -25000, 'Membeli border Let_s Drink!', '{"borderId":"border_25000_lets_drink","borderName":"Let_s Drink!","purchaseType":"border"}', '2025-10-08 05:14:51'),
('user_1759884167043_vvrak6mmo_border_50000_dragon_matcha_pavilion_1759897337352_tx', 'user_1759884167043_vvrak6mmo', 'SPENT', -50000, 'Membeli border Dragon Matcha Pavilion', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion","purchaseType":"border"}', '2025-10-08 04:22:17'),
('user_1759884167043_vvrak6mmo_border_50000_sacred_sakura_1759896365334_tx', 'user_1759884167043_vvrak6mmo', 'SPENT', -50000, 'Membeli border Sacred Sakura', '{"borderId":"border_50000_sacred_sakura","borderName":"Sacred Sakura","purchaseType":"border"}', '2025-10-08 04:06:05'),
('user_1759884167043_vvrak6mmo_diamond_1759895623510_tx', 'user_1759884167043_vvrak6mmo', 'SPENT', -2000, 'Membeli border Diamond', '{"borderId":"diamond","borderName":"Diamond","purchaseType":"border"}', '2025-10-08 03:53:43'),
('user_1759884167043_vvrak6mmo_gold_1759895820860_tx', 'user_1759884167043_vvrak6mmo', 'SPENT', -500, 'Membeli border Gold', '{"borderId":"gold","borderName":"Gold","purchaseType":"border"}', '2025-10-08 03:57:00'),
('user_1759943266360_9a86e2sb8_border_10000_green_tea_1759958691927_tx', 'user_1759943266360_9a86e2sb8', 'SPENT', -10000, 'Membeli border Green Tea', '{"borderId":"border_10000_green_tea","borderName":"Green Tea","purchaseType":"border"}', '2025-10-08 21:24:51'),
('user_1759943266360_9a86e2sb8_border_10000_matcha_1759990651915_tx', 'user_1759943266360_9a86e2sb8', 'SPENT', -10000, 'Membeli border Matcha', '{"borderId":"border_10000_matcha","borderName":"Matcha","purchaseType":"border"}', '2025-10-09 06:17:31'),
('user_1759943266360_9a86e2sb8_border_25000_daily_whisk_1759970045704_tx', 'user_1759943266360_9a86e2sb8', 'SPENT', -25000, 'Membeli border Daily Whisk', '{"borderId":"border_25000_daily_whisk","borderName":"Daily Whisk","purchaseType":"border"}', '2025-10-09 00:34:05'),
('user_1759943266360_9a86e2sb8_border_25000_lets_drink_1759964239262_tx', 'user_1759943266360_9a86e2sb8', 'SPENT', -25000, 'Membeli border Let_s Drink!', '{"borderId":"border_25000_lets_drink","borderName":"Let_s Drink!","purchaseType":"border"}', '2025-10-08 22:57:19'),
('user_1759943266360_9a86e2sb8_border_50000_dragon_matcha_pavilion_1759943461855_tx', 'user_1759943266360_9a86e2sb8', 'SPENT', -50000, 'Membeli border Dragon Matcha Pavilion', '{"borderId":"border_50000_dragon_matcha_pavilion","borderName":"Dragon Matcha Pavilion","purchaseType":"border"}', '2025-10-08 17:11:01'),
('user_1759943266360_9a86e2sb8_border_50000_sacred_sakura_1759953057816_tx', 'user_1759943266360_9a86e2sb8', 'SPENT', -50000, 'Membeli border Sacred Sakura', '{"borderId":"border_50000_sacred_sakura","borderName":"Sacred Sakura","purchaseType":"border"}', '2025-10-08 19:50:57');

-- Table structure for post_comment
DROP TABLE IF EXISTS `post_comment`;
CREATE TABLE `post_comment` (
  `id` varchar(191) NOT NULL,
  `postId` varchar(191) NOT NULL,
  `authorId` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `parentId` varchar(191) DEFAULT NULL,
  `likesCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `post_comment_postId_idx` (`postId`),
  KEY `post_comment_authorId_idx` (`authorId`),
  KEY `post_comment_parentId_idx` (`parentId`),
  KEY `post_comment_createdAt_idx` (`createdAt`),
  CONSTRAINT `post_comment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `post_comment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `post_comment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `post_comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `social_post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Data for table post_comment
INSERT INTO `post_comment` VALUES
('post_comment_1760235264895', 'social_post_1760234072968', 'cmggz5ihr007z1hus4ww2mocp', 'emang iya bang ?', NULL, 0, '2025-10-12 02:14:24', '2025-10-12 02:14:24'),
('post_comment_1760235830474', 'social_post_1760234072968', 'cmggz5ihr007z1hus4ww2mocp', 'iya bang', 'post_comment_1760235264895', 0, '2025-10-12 02:23:50', '2025-10-12 02:23:50'),
('post_comment_1760286959394_s5bemw196', 'social_post_1760270537459_c4j4fytnb', 'user_1759983668131_rmpq22w5m', 'cek bro', NULL, 0, '2025-10-12 16:35:59', '2025-10-12 16:35:59'),
('post_comment_1760318177126_x1ehztuny', 'social_post_1760234072968', 'user_1759983668131_rmpq22w5m', 'keren bang', NULL, 0, '2025-10-13 01:16:17', '2025-10-13 01:16:17');

-- Table structure for post_like
DROP TABLE IF EXISTS `post_like`;
CREATE TABLE `post_like` (
  `id` varchar(191) NOT NULL,
  `postId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_like_postId_userId_key` (`postId`,`userId`),
  KEY `post_like_userId_fkey` (`userId`),
  CONSTRAINT `post_like_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `social_post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `post_like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Data for table post_like
INSERT INTO `post_like` VALUES
('', 'social_post_1760234072968', 'user_1759983668131_rmpq22w5m', '2025-10-12 17:08:49'),
('like_1760290453893_47rws6cl3', 'social_post_1760227465776', 'test_user_achievement_001', '2025-10-12 17:34:13'),
('like_1760290583506_611p62xwo', 'social_post_1760270537459_c4j4fytnb', 'user_1759983668131_rmpq22w5m', '2025-10-12 17:36:23'),
('like_1760319316623_14namco51', 'social_post_1760292449394_wenc211x5', 'user_1759983668131_rmpq22w5m', '2025-10-13 01:35:16'),
('post_like_1760234981532', 'social_post_1760233539225', 'cmggz5ihr007z1hus4ww2mocp', '2025-10-12 02:09:41'),
('post_like_1760234982846', 'social_post_1760234072968', 'cmggz5ihr007z1hus4ww2mocp', '2025-10-12 02:09:42');

-- Table structure for post_save
DROP TABLE IF EXISTS `post_save`;
CREATE TABLE `post_save` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `postId` varchar(191) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_post` (`userId`,`postId`),
  KEY `idx_userId` (`userId`),
  KEY `idx_postId` (`postId`)
);

-- Table structure for session
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `id` varchar(191) NOT NULL,
  `sessionToken` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Session_sessionToken_key` (`sessionToken`),
  KEY `Session_userId_fkey` (`userId`),
  CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table structure for social_link
DROP TABLE IF EXISTS `social_link`;
CREATE TABLE `social_link` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `platform` varchar(50) NOT NULL,
  `url` varchar(500) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `social_link_userId_platform_key` (`userId`,`platform`),
  CONSTRAINT `social_link_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table structure for social_post
DROP TABLE IF EXISTS `social_post`;
CREATE TABLE `social_post` (
  `id` varchar(191) NOT NULL,
  `authorId` varchar(191) NOT NULL,
  `content` text DEFAULT NULL,
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
  `visibility` enum('PUBLIC','FRIENDS_ONLY','PRIVATE') NOT NULL DEFAULT 'PUBLIC',
  `likesCount` int(11) NOT NULL DEFAULT 0,
  `commentsCount` int(11) NOT NULL DEFAULT 0,
  `sharesCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `social_post_authorId_idx` (`authorId`),
  KEY `social_post_createdAt_idx` (`createdAt`),
  KEY `social_post_visibility_idx` (`visibility`),
  CONSTRAINT `social_post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Data for table social_post
INSERT INTO `social_post` VALUES
('social_post_1760227465776', 'user_1759884167043_vvrak6mmo', 'aaaaaaaaaa', NULL, 'PUBLIC', 1, 0, 0, '2025-10-12 00:04:25', '2025-10-12 00:04:25'),
('social_post_1760233539225', 'user_1759884167043_vvrak6mmo', 'JIR GUE LIAT TEMEN GUE MENINGGAL JIR', NULL, 'PUBLIC', 1, 0, 0, '2025-10-12 01:45:39', '2025-10-12 01:45:39'),
('social_post_1760234072968', 'user_1759884167043_vvrak6mmo', 's', NULL, 'PUBLIC', 2, 3, 0, '2025-10-12 01:54:32', '2025-10-12 01:54:32'),
('social_post_1760270537459_c4j4fytnb', 'user_1759983668131_rmpq22w5m', 'asssssssss', '["/uploads/social/social_1760270535142_7ahg73jo04c.png"]', 'PUBLIC', 1, 1, 0, '2025-10-12 12:02:17', '2025-10-12 12:02:17'),
('social_post_1760292156492_kyq9tq7dz', 'user_1759983668131_rmpq22w5m', 'anjayy hashtag nih boss #matchalah', NULL, 'PUBLIC', 0, 0, 0, '2025-10-12 18:02:36', '2025-10-12 18:02:36'),
('social_post_1760292449394_wenc211x5', 'user_1759983668131_rmpq22w5m', 'gue keren #guekeren', NULL, 'PUBLIC', 1, 0, 0, '2025-10-12 18:07:29', '2025-10-12 18:07:29'),
('social_post_1760623808841_q96kmp14o', 'user_1760616211771_rqixrwwi5', 's', NULL, 'PUBLIC', 0, 0, 0, '2025-10-16 14:10:08', '2025-10-16 14:10:08');

-- Table structure for user
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `emailVerified` datetime(3) DEFAULT NULL,
  `password` varchar(191) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `bio` text DEFAULT NULL,
  `location` varchar(191) DEFAULT NULL,
  `points` int(11) NOT NULL DEFAULT 0,
  `selectedBorder` varchar(191) NOT NULL DEFAULT 'default',
  `customStatus` varchar(100) DEFAULT NULL,
  `followerCount` int(11) NOT NULL DEFAULT 0,
  `followingCount` int(11) NOT NULL DEFAULT 0,
  `friendCount` int(11) NOT NULL DEFAULT 0,
  `notificationSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`notificationSettings`)),
  `postCount` int(11) NOT NULL DEFAULT 0,
  `privacySettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`privacySettings`)),
  `follower_count` int(11) NOT NULL DEFAULT 0,
  `following_count` int(11) NOT NULL DEFAULT 0,
  `post_count` int(11) NOT NULL DEFAULT 0,
  `comment_count` int(11) NOT NULL DEFAULT 0,
  `forum_post_count` int(11) NOT NULL DEFAULT 0,
  `forum_comment_count` int(11) NOT NULL DEFAULT 0,
  `recipe_count` int(11) NOT NULL DEFAULT 0,
  `active_days_count` int(11) NOT NULL DEFAULT 0,
  `active_hours_count` int(11) NOT NULL DEFAULT 0,
  `last_active_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  KEY `idx_user_email` (`email`),
  KEY `idx_user_created_at` (`createdAt`),
  KEY `idx_user_points` (`points`),
  KEY `idx_user_borders` (`selectedBorder`)
);

-- Data for table user
INSERT INTO `user` VALUES
('cmggylajf00001hussdd4ajlp', 'Ananda Alviansyah', 'test@demo.com', NULL, '$2b$12$LI0YCjaQ.uNYQ8ZE9o3PH.Oe36gckNZTu8JqZynfFVxNeN6r8ODDe', NULL, '2025-10-07 12:34:46', '2025-10-07 12:34:46', 'USER', '', 'Surabayasada', 9090912, '', NULL, 0, 0, 1, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
('cmggz5ihr007z1hus4ww2mocp', 'Ananda Alviansyah Putras', 'test@demo1.com', NULL, '$2b$12$rBwN/mavpUneMawrGUfaJusvNZJLJOTN5wwDFdaQLJlcFHdi88tty', '/uploads/avatars/test_demo1_com_1759877896415.jpeg', '2025-10-07 12:50:30', '2025-10-07 12:50:30', 'USER', 'sdasd', 'Surabaya, Jawa Timur, Indonesias', 999, 'bronze', NULL, 0, 0, 4, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
('test_user_achievement_001', 'Test Achievement User', 'test@achievement.com', NULL, NULL, NULL, '2025-10-10 14:38:48', '2025-10-10 14:38:48', 'USER', NULL, NULL, 0, 'default', NULL, 0, 0, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
('user_1759875804311_admin', 'Admin HikariCha', 'admin@hikaricha.com', NULL, NULL, NULL, '2025-10-07 15:23:24', '2025-10-07 15:23:24', 'ADMIN', NULL, NULL, 999999, 'default', NULL, 0, 1, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
('user_1759878619393_demo', 'Demo User', 'demo@test.com', NULL, '$2b$12$DYTfifG7v4svQPl90f5hQO6AHwBiVo4opAKS.HtUN0C4a.hBypium', NULL, '2025-10-07 16:10:19', '2025-10-07 16:10:19', 'USER', NULL, NULL, 1500, 'default', NULL, 1, 0, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
('user_1759884167043_vvrak6mmo', 'Morgan Dummy', 'admin@admin.com', NULL, '$2b$12$ewZ55qr/STuzxelvcgsNKeA/yuLUyNQF5H4WtnzURI.K0lGRg0FNG', '/uploads/avatars/admin_admin_com_1759940114102.jpeg', '2025-10-08 00:42:47', '2025-10-08 00:42:47', 'USER', 'SAYA KEREN SAYA SUKssA BERBELANJA', 'Bekasi, Indonesias', 9792499, 'border_25000_dessert_time', NULL, 1, 1, 5, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
('user_1759943266360_9a86e2sb8', 'Toge Anjay', 'admin1@admin.com', NULL, '$2b$12$yhRgz0tT.2vR8MWqjtLmR.1XinBMj/VAC1HLOZ3WjW7IekI/5C/Ue', '/uploads/avatars/admin1_admin_com_1759972070951.jpeg', '2025-10-08 17:07:46', '2025-10-08 17:07:46', 'USER', 'Susu saya besars', 'Surabaya, Jawa Timur, Indonesia', 830000, 'border_50000_dragon_matcha_pavilion', NULL, 1, 0, 3, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
('user_1759983668131_rmpq22w5m', 'Dwipa keren', 'dwipakeren@gmail.com', NULL, '$2b$12$scwL/vRdioD4KPYPbsGQNuL1KydRpjX8EVsTHBwLKSGrfZ3qBSz0K', NULL, '2025-10-09 04:21:08', '2025-10-09 04:21:08', 'USER', NULL, NULL, 50, 'default', NULL, 0, 1, 5, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
('user_1760083882442_wdec4wjq2', 'Ananda Alviansyah', 'alvians.alvians@yahoo.com', NULL, '$2b$12$Z9qSw8LkgRchNNJNe/IwsOo7x93UOuAZVTu7dd1J7RJ.kE0v.cwdW', NULL, '2025-10-10 08:11:22', '2025-10-10 08:11:22', 'USER', NULL, NULL, 0, 'default', NULL, 0, 0, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
('user_1760513382695_3sqm0iy4f', 'Test User', 'test@example.com', NULL, '$2b$12$9vZvsWlWNnXnBM49N9u6.u.EAzFc5uCJEVW.GNLUs3audcPYBaElq', NULL, '2025-10-15 07:29:42', '2025-10-15 07:29:42', 'USER', NULL, NULL, 0, 'default', NULL, 0, 0, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
('user_1760616211771_rqixrwwi5', 'ss', 's@s.ss', NULL, '$2b$12$cK2oMDLYgJSyQgUJ5Twgq.VEKuR3piGVsxhk.eenA5BMHCDB0xvdG', NULL, '2025-10-16 12:03:31', '2025-10-16 12:03:31', 'USER', NULL, NULL, 0, 'default', NULL, 0, 0, 0, NULL, 0, NULL, 0, 0, 1, 0, 0, 0, 0, 0, 0, NULL),
('user_1760623905504_hk7764o5a', 'TESTUSERBARU', 'testuser@gmail.com', NULL, '$2b$12$ewXK5s6F9OdhQzBL/tFbb.Tiykfo4.0XM29sMcHxP4O1ER.fVGvsS', NULL, '2025-10-16 14:11:45', '2025-10-16 14:11:45', 'USER', NULL, NULL, 0, 'default', NULL, 0, 0, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
('user1', 'Alice Test', 'alice@test.com', NULL, NULL, NULL, '2025-10-13 10:25:51', NULL, 'USER', NULL, NULL, 0, 'default', NULL, 0, 0, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
('user2', 'Bob Test', 'bob@test.com', NULL, NULL, NULL, '2025-10-13 10:25:51', NULL, 'USER', NULL, NULL, 0, 'default', NULL, 0, 0, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
('user3', 'Charlie Test', 'charlie@test.com', NULL, NULL, NULL, '2025-10-13 10:25:51', NULL, 'USER', NULL, NULL, 0, 'default', NULL, 0, 0, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL);

-- Table structure for user_achievement_progress
DROP TABLE IF EXISTS `user_achievement_progress`;
CREATE TABLE `user_achievement_progress` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `achievement_type` varchar(191) NOT NULL,
  `current_level` int(11) NOT NULL DEFAULT 0,
  `current_value` int(11) NOT NULL DEFAULT 0,
  `completed_levels` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`completed_levels`)),
  `claimed_levels` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`claimed_levels`)),
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_achievement_progress_user_id_achievement_type_key` (`user_id`,`achievement_type`),
  CONSTRAINT `user_achievement_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table structure for user_block
DROP TABLE IF EXISTS `user_block`;
CREATE TABLE `user_block` (
  `id` varchar(191) NOT NULL,
  `blockerId` varchar(191) NOT NULL,
  `blockedId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_block_blockerId_blockedId_key` (`blockerId`,`blockedId`),
  KEY `user_block_blockedId_fkey` (`blockedId`),
  CONSTRAINT `user_block_blockedId_fkey` FOREIGN KEY (`blockedId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_block_blockerId_fkey` FOREIGN KEY (`blockerId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table structure for user_border
DROP TABLE IF EXISTS `user_border`;
CREATE TABLE `user_border` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `borderId` varchar(191) NOT NULL,
  `unlockedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `selected` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_border_unique` (`user_id`,`borderId`),
  CONSTRAINT `user_border_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table structure for user_follow
DROP TABLE IF EXISTS `user_follow`;
CREATE TABLE `user_follow` (
  `id` varchar(191) NOT NULL,
  `followerId` varchar(191) NOT NULL,
  `followingId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_follow_followerId_followingId_key` (`followerId`,`followingId`),
  KEY `user_follow_followerId_idx` (`followerId`),
  KEY `user_follow_followingId_idx` (`followingId`),
  KEY `idx_user_follow_follower` (`followerId`),
  KEY `idx_user_follow_following` (`followingId`),
  KEY `idx_user_follow_createdAt` (`createdAt`),
  CONSTRAINT `user_follow_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_follow_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Data for table user_follow
INSERT INTO `user_follow` VALUES
('follow_1760332022680_iwrd0l919', 'user_1759884167043_vvrak6mmo', 'user_1759943266360_9a86e2sb8', '2025-10-10 06:14:36'),
('follow_1760332022683_jcb636f8j', 'user_1759983668131_rmpq22w5m', 'user_1759884167043_vvrak6mmo', '2025-10-13 01:27:37'),
('follow_1760341274261_ybv8wor8v', 'user_1759875804311_admin', 'user_1759878619393_demo', '2025-10-13 07:41:14');

-- Table structure for userprofile
DROP TABLE IF EXISTS `userprofile`;
CREATE TABLE `userprofile` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `bio` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `favoriteMatcha` varchar(255) DEFAULT NULL,
  `experienceLevel` enum('BEGINNER','INTERMEDIATE','EXPERT') NOT NULL DEFAULT 'BEGINNER',
  `privacySettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`privacySettings`)),
  `notificationSettings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`notificationSettings`)),
  `lastSeen` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userProfile_userId_key` (`userId`),
  CONSTRAINT `userProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table structure for userstatus
DROP TABLE IF EXISTS `userstatus`;
CREATE TABLE `userstatus` (
  `userId` varchar(191) NOT NULL,
  `status` enum('ONLINE','AWAY','BUSY','OFFLINE') NOT NULL DEFAULT 'OFFLINE',
  `lastSeen` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`userId`),
  CONSTRAINT `userStatus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

