-- CreateTable
CREATE TABLE `proker_anggota` (
    `anggota_id` INTEGER NOT NULL,
    `proker_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`anggota_id`, `proker_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `proker_anggota` ADD CONSTRAINT `proker_anggota_anggota_id_fkey` FOREIGN KEY (`anggota_id`) REFERENCES `anggota_divisi`(`anggota_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proker_anggota` ADD CONSTRAINT `proker_anggota_proker_id_fkey` FOREIGN KEY (`proker_id`) REFERENCES `proker`(`proker_id`) ON DELETE CASCADE ON UPDATE CASCADE;
