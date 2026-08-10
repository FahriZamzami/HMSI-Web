/*
  Warnings:

  - Added the required column `edited` to the `divisi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `edited` to the `pengurus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `edited` to the `periode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `edited` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `edited` to the `proker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `edited` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `edited` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `divisi` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `edited` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `pengurus` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `edited` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `periode` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `edited` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `edited` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `proker` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `edited` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `role` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `edited` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `edited` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `saran` (
    `saran_id` INTEGER NOT NULL AUTO_INCREMENT,
    `saran` TEXT NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `edited` DATETIME(3) NOT NULL,

    PRIMARY KEY (`saran_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
