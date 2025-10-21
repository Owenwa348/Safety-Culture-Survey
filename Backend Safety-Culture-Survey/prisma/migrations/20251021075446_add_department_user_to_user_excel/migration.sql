/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `user_excel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user_excel` DROP COLUMN `updatedAt`,
    ADD COLUMN `department_user` VARCHAR(191) NULL;
