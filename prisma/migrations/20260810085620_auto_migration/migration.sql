/*
  Warnings:

  - You are about to drop the column `created_at` on the `divisi` table. All the data in the column will be lost.
  - You are about to drop the column `division_role` on the `divisi` table. All the data in the column will be lost.
  - You are about to drop the column `nama_divisi` on the `divisi` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `divisi` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `divisi` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `periode` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `periode` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `periode` table. All the data in the column will be lost.
  - You are about to drop the column `caption` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `divisi_id` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `proker` table. All the data in the column will be lost.
  - You are about to drop the column `judul` on the `proker` table. All the data in the column will be lost.
  - You are about to drop the column `keterangan` on the `proker` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `proker` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `anggota_divisi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `divisi_gambar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gambar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_gambar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proker_anggota` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `divisi_name` to the `divisi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gambar_divisi` to the `divisi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gambar_periode` to the `periode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gambar` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deskripsi` to the `proker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proker_name` to the `proker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `anggota_divisi` DROP FOREIGN KEY `anggota_divisi_divisi_id_fkey`;

-- DropForeignKey
ALTER TABLE `divisi` DROP FOREIGN KEY `divisi_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `divisi_gambar` DROP FOREIGN KEY `divisi_gambar_divisi_id_fkey`;

-- DropForeignKey
ALTER TABLE `divisi_gambar` DROP FOREIGN KEY `divisi_gambar_gambar_id_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `post_divisi_id_fkey`;

-- DropForeignKey
ALTER TABLE `post_gambar` DROP FOREIGN KEY `post_gambar_gambar_id_fkey`;

-- DropForeignKey
ALTER TABLE `post_gambar` DROP FOREIGN KEY `post_gambar_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `proker_anggota` DROP FOREIGN KEY `proker_anggota_anggota_id_fkey`;

-- DropForeignKey
ALTER TABLE `proker_anggota` DROP FOREIGN KEY `proker_anggota_proker_id_fkey`;

-- DropIndex
DROP INDEX `divisi_user_id_fkey` ON `divisi`;

-- DropIndex
DROP INDEX `post_divisi_id_fkey` ON `post`;

-- DropIndex
DROP INDEX `user_username_key` ON `user`;

-- AlterTable
ALTER TABLE `divisi` DROP COLUMN `created_at`,
    DROP COLUMN `division_role`,
    DROP COLUMN `nama_divisi`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `user_id`,
    ADD COLUMN `divisi_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `gambar_divisi` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `periode` DROP COLUMN `created_at`,
    DROP COLUMN `status`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `gambar_periode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `caption`,
    DROP COLUMN `created_at`,
    DROP COLUMN `divisi_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `gambar` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `proker` DROP COLUMN `created_at`,
    DROP COLUMN `judul`,
    DROP COLUMN `keterangan`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `deskripsi` TEXT NOT NULL,
    ADD COLUMN `proker_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `created_at`,
    DROP COLUMN `role`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `username`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `anggota_divisi`;

-- DropTable
DROP TABLE `divisi_gambar`;

-- DropTable
DROP TABLE `gambar`;

-- DropTable
DROP TABLE `post_gambar`;

-- DropTable
DROP TABLE `proker_anggota`;

-- CreateTable
CREATE TABLE `role` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengurus` (
    `id_pengurus` INTEGER NOT NULL AUTO_INCREMENT,
    `divisi_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,
    `pengurus_name` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `nomor_anggota` VARCHAR(191) NOT NULL,
    `gambar_pengurus` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_pengurus`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pengurus` ADD CONSTRAINT `pengurus_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `divisi`(`divisi_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengurus` ADD CONSTRAINT `pengurus_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;
