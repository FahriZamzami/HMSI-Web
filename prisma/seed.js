import { PrismaClient, UserRole, DivisionRole, MemberRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
    console.log('🔄 Memulai proses seeding data baru...');
    // Menggunakan Raw Query MySQL untuk membersihkan data tanpa merusak Foreign Key Constraint
    try {
        await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
        const tables = ['anggota_divisi', 'divisi_gambar', 'post_gambar', 'post', 'proker', 'divisi', 'gambar', 'periode', 'user'];
        for (const table of tables) {
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${table}\`;`);
        }
        await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
        console.log('🧹 Database berhasil dikosongkan dengan aman.');
    }
    catch (error) {
        console.log('⚠️ Melewati pembersihan database jika tabel belum siap.');
        await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
    }
    const saltRounds = 10;
    const hashedSuperadminPassword = await bcrypt.hash('superhmsi2026', saltRounds);
    // Jalankan transaksi utama
    await prisma.$transaction(async (tx) => {
        const superadmin = await tx.user.create({
            data: {
                username: 'superadmin_hmsi',
                password: hashedSuperadminPassword,
                role: UserRole.SUPERADMIN,
            },
        });
        console.log(`✅ Superadmin awal berhasil dibuat.`);
        const periodeBaru = await tx.periode.create({
            data: {
                periode: '2025/2026',
                status: true,
            },
        });
        console.log(`✅ Periode ${periodeBaru.periode} berhasil dibuat (Aktif).`);
        const divisiIntiOtomatis = await tx.divisi.create({
            data: {
                periodeId: periodeBaru.periodeId,
                userId: superadmin.userId,
                namaDivisi: 'Badan Pengurus Harian (BPH)',
                divisionRole: DivisionRole.INTI,
            },
        });
        console.log(`🚀 Otomatisasi Berhasil: Divisi BPH (${divisiIntiOtomatis.divisionRole}) berhasil dibuat.`);
        await tx.anggotaDivisi.create({
            data: {
                divisiId: divisiIntiOtomatis.divisiId,
                name: 'Ketua Himpunan Msi',
                role: MemberRole.KAHIM,
            },
        });
        await tx.proker.create({
            data: {
                divisiId: divisiIntiOtomatis.divisiId,
                judul: 'Upgrading Pengurus HMSI',
                keterangan: 'Meningkatkan kapabilitas, komunikasi, dan rasa solidaritas antar seluruh anggota kepengurusan baru.',
            },
        });
        console.log(`✅ Contoh Proker awal berhasil ditambahkan untuk divisi BPH.`);
    });
    console.log('🏁 Proses seeding selesai dengan sukses!');
}
main()
    .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
