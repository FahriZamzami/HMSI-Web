import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const SaranModule = {
  /**
   * Mengambil semua saran yang masuk (untuk admin)
   */
  async getAll() {
    try {
      const saranList = await prisma.saran.findMany({
        orderBy: { created: "desc" },
      });
      return { message: "Berhasil mengambil data saran", data: saranList };
    } catch (error: any) {
      throw new Error(`Gagal mengambil saran: ${error.message}`);
    }
  },

  /**
   * Menghapus saran
   */
  async delete(saranId: number) {
    if (!saranId) throw new Error("ID Saran dibutuhkan");
    try {
      await prisma.saran.delete({ where: { saranId } });
      return { message: "Saran berhasil dihapus" };
    } catch (error: any) {
      throw new Error(`Gagal menghapus saran: ${error.message}`);
    }
  },
};
