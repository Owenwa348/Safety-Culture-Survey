-- AlterTable
ALTER TABLE `category` ADD COLUMN `companyId` INTEGER NULL;

-- AlterTable
ALTER TABLE `department` ADD COLUMN `companyId` INTEGER NULL;

-- AlterTable
ALTER TABLE `experience` ADD COLUMN `companyId` INTEGER NULL;

-- AlterTable
ALTER TABLE `position` ADD COLUMN `companyId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `registration_status` VARCHAR(191) NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `work_group` ADD COLUMN `companyId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `department` ADD CONSTRAINT `department_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experience` ADD CONSTRAINT `experience_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `position` ADD CONSTRAINT `position_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `work_group` ADD CONSTRAINT `work_group_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
