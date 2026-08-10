import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { SignJWT } from "jose";

// Inisialisasi prisma client
// (Sebaiknya diletakkan di global lib untuk di-reuse, tapi untuk contoh modul kita definisikan di sini)
const prisma = new PrismaClient();

export const UserModule = {
  /**
   * Menangani proses login user
   * @param payload berisi name dan password
   */
  async login(payload: any) {
    const { name, password } = payload;

    if (!name || !password) {
      throw new Error("Username dan password harus diisi");
    }

    // Cari user di database
    const user = await prisma.user.findFirst({
      where: { name },
    });

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Password salah");
    }

    // Hindari mengembalikan password ke frontend
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT Token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key");
    const token = await new SignJWT({ userId: user.userId, name: user.name })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // Token berlaku 24 jam
      .sign(secret);

    return {
      message: "Login berhasil",
      user: userWithoutPassword,
      token, // Return token ke route handler
    };
  },

  /**
   * Menangani proses ubah password
   * @param payload berisi userId, oldPassword, newPassword
   */
  async changePassword(payload: any) {
    const { userId, oldPassword, newPassword } = payload;

    if (!userId || !oldPassword || !newPassword) {
      throw new Error("Data tidak lengkap (userId, oldPassword, newPassword dibutuhkan)");
    }

    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      throw new Error("Password lama salah");
    }

    // Hash password baru (sesuai permintaan sebelumnya yaitu 13 putaran)
    const saltRounds = 13;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await prisma.user.update({
      where: { userId },
      data: { password: hashedNewPassword },
    });

    return {
      message: "Password berhasil diubah",
    };
  },

  /**
   * Mengambil profil user berdasarkan userId
   */
  async getProfile(userId: number) {
    if (!userId) throw new Error("User ID dibutuhkan");
    
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        name: true,
        status: true,
        created: true,
        edited: true,
      }
    });

    if (!user) throw new Error("User tidak ditemukan");

    return {
      message: "Berhasil mengambil profil",
      data: user,
    };
  },

  /**
   * Mengubah status maintenance/active user
   */
  async updateStatus(userId: number, status: string) {
    if (!userId || !status) throw new Error("Data tidak lengkap");
    if (status !== "Active" && status !== "Maintenance") {
      throw new Error("Status tidak valid");
    }

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { status: status as any },
      select: {
        userId: true,
        name: true,
        status: true,
      }
    });

    return {
      message: "Status berhasil diubah",
      data: updatedUser,
    };
  }
};
