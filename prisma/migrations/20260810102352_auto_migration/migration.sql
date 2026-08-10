/*
  Warnings:

  - You are about to drop the column `role_id` on the `pengurus` table. All the data in the column will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `pengurus` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pengurus` DROP FOREIGN KEY `pengurus_role_id_fkey`;

-- DropIndex
DROP INDEX `pengurus_role_id_fkey` ON `pengurus`;

-- AlterTable
ALTER TABLE `divisi` MODIFY `gambar_divisi` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pengurus` DROP COLUMN `role_id`,
    ADD COLUMN `role` ENUM('Ketua Himpunan', 'Sekretaris Umum', 'Bendahara Umum', 'Kepala Divisi', 'Sekretaris Divisi', 'Bendahara Divisi', 'Sekretaris Bendahara Divisi', 'Staf Divisi') NOT NULL;

-- AlterTable
ALTER TABLE `periode` ADD COLUMN `status` ENUM('Active', 'Non Active') NOT NULL DEFAULT 'Active',
    MODIFY `gambar_periode` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `role`;
