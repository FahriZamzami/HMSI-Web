import { PrismaClient, Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Memulai proses seeding data baru...')

    try {
        await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;')
        
        // Hanya menghapus data pada tabel user
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`user\`;`)
        
        await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;')
        console.log('🧹 Tabel user berhasil dikosongkan dengan aman.')
    } catch (error) {
        console.log('⚠️ Melewati pembersihan database jika tabel belum siap.')
        await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;')
    }

    // Hash password sebanyak 13 putaran (saltRounds = 13)
    const saltRounds = 13
    const hashedSuperadminPassword = await bcrypt.hash('admin123', saltRounds)

    // Jalankan transaksi utama
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        
        // 1. Buat User
        const adminUser = await tx.user.create({
            data: {
                name: 'Admin HMSI',
                password: hashedSuperadminPassword,
            },
        })
        console.log(`✅ User admin berhasil dibuat.`)
    })

    console.log('🏁 Proses seeding selesai dengan sukses!')
}

main()
    .catch((e) => {
        console.error('❌ Terjadi kesalahan saat seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })