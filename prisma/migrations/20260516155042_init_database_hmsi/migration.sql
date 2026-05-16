-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPERADMIN', 'ADMIN') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periode` (
    `periode_id` INTEGER NOT NULL AUTO_INCREMENT,
    `periode` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`periode_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `divisi` (
    `divisi_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `periode_id` INTEGER NOT NULL,
    `nama_divisi` VARCHAR(191) NOT NULL,
    `division_role` ENUM('INTI', 'NON_INTI') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`divisi_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anggota_divisi` (
    `anggota_id` INTEGER NOT NULL AUTO_INCREMENT,
    `divisi_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('KADIV', 'STAFF', 'SEKBEN', 'SEKRETARIS', 'BENDAHARA', 'KAHIM') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`anggota_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proker` (
    `proker_id` INTEGER NOT NULL AUTO_INCREMENT,
    `divisi_id` INTEGER NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `keterangan` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`proker_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gambar` (
    `gambar_id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`gambar_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `divisi_gambar` (
    `divisi_id` INTEGER NOT NULL,
    `gambar_id` INTEGER NOT NULL,
    `type` ENUM('MAIN', 'PERSON') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`divisi_id`, `gambar_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `post_id` INTEGER NOT NULL AUTO_INCREMENT,
    `divisi_id` INTEGER NOT NULL,
    `caption` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_gambar` (
    `post_id` INTEGER NOT NULL,
    `gambar_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`post_id`, `gambar_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `divisi` ADD CONSTRAINT `divisi_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `divisi` ADD CONSTRAINT `divisi_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `periode`(`periode_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anggota_divisi` ADD CONSTRAINT `anggota_divisi_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `divisi`(`divisi_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proker` ADD CONSTRAINT `proker_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `divisi`(`divisi_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `divisi_gambar` ADD CONSTRAINT `divisi_gambar_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `divisi`(`divisi_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `divisi_gambar` ADD CONSTRAINT `divisi_gambar_gambar_id_fkey` FOREIGN KEY (`gambar_id`) REFERENCES `gambar`(`gambar_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `divisi`(`divisi_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_gambar` ADD CONSTRAINT `post_gambar_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_gambar` ADD CONSTRAINT `post_gambar_gambar_id_fkey` FOREIGN KEY (`gambar_id`) REFERENCES `gambar`(`gambar_id`) ON DELETE CASCADE ON UPDATE CASCADE;
