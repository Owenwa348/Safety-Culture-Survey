-- ===================================================
-- Migration: Merge user_excel table into user table
-- ===================================================

-- Step 1: Add new columns to user table
ALTER TABLE `user` 
ADD COLUMN `registration_status` VARCHAR(191) NOT NULL DEFAULT 'completed';

-- Step 2: Make name_user nullable to support uploaded users
ALTER TABLE `user` MODIFY `name_user` VARCHAR(191);

-- Step 3: Migrate data from user_excel to user
-- Insert all user_excel records that don't already exist in user
INSERT INTO `user` (
  email_user,
  company_id,
  section_user,
  registration_status,
  role_user,
  status,
  survey_status,
  createdAt,
  updatedAt
)
SELECT 
  ue.email_user,
  ue.company_id,
  ue.division_user,
  'pending',
  'user',
  'not_registered',
  'not_started',
  ue.createdAt,
  ue.updatedAt
FROM `user_excel` ue
WHERE NOT EXISTS (
  SELECT 1 FROM `user` u WHERE u.email_user = ue.email_user
)
ON DUPLICATE KEY UPDATE `updatedAt` = NOW();

-- Step 4: Drop user_excel table
DROP TABLE `user_excel`;
