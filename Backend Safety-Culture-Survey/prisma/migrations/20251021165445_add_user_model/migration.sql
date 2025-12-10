-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title_user` VARCHAR(191) NULL,
    `name_user` VARCHAR(191) NOT NULL,
    `email_user` VARCHAR(191) NOT NULL,
    `company_user` VARCHAR(191) NOT NULL,
    `phone_user` VARCHAR(191) NULL,
    `password_user` VARCHAR(191) NULL,
    `position_user` VARCHAR(191) NULL,
    `job_field_user` VARCHAR(191) NULL,
    `work_group_user` VARCHAR(191) NULL,
    `years_of_service` VARCHAR(191) NULL,
    `section_user` VARCHAR(191) NULL,
    `role_user` VARCHAR(191) NOT NULL DEFAULT 'user',
    `status` VARCHAR(191) NOT NULL DEFAULT 'registered',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_user_key`(`email_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
