/*
  Warnings:

  - You are about to drop the column `readAt` on the `Inquiry` table. All the data in the column will be lost.
  - You are about to drop the column `reply` on the `Inquiry` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Inquiry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Inquiry` DROP COLUMN `readAt`,
    DROP COLUMN `reply`,
    DROP COLUMN `status`;
