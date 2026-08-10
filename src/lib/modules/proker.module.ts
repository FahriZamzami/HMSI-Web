import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ProkerModule = {
  /**
   * Mengambil semua proker berdasarkan ID Divisi
   */
  async getByDivisiId(divisiId: number) {
    if (!divisiId) throw new Error("ID Divisi dibutuhkan");

    try {
      const prokerList = await prisma.proker.findMany({
        where: { divisiId },
        orderBy: { created: "asc" },
        include: {
          pengurusProker: {
            include: {
              pengurus: true
            }
          }
        }
      });

      return {
        message: "Berhasil mengambil data program kerja",
        data: prokerList,
      };
    } catch (error: any) {
      throw new Error(`Gagal mengambil data program kerja: ${error.message}`);
    }
  },

  /**
   * Membuat proker baru
   */
  async create(payload: any) {
    const { divisiId, prokerName, deskripsi, picIds } = payload;

    if (!divisiId || !prokerName || !deskripsi) {
      throw new Error("ID Divisi, Nama Program Kerja, dan Deskripsi wajib diisi");
    }

    try {
      const newProker = await prisma.proker.create({
        data: {
          divisiId: Number(divisiId),
          prokerName,
          deskripsi,
          pengurusProker: picIds && picIds.length > 0 ? {
            create: picIds.map((id: number) => ({
              pengurusId: Number(id)
            }))
          } : undefined
        },
        include: {
          pengurusProker: {
            include: { pengurus: true }
          }
        }
      });

      return {
        message: "Program kerja berhasil ditambahkan",
        data: newProker,
      };
    } catch (error: any) {
      throw new Error(`Gagal membuat program kerja: ${error.message}`);
    }
  },

  /**
   * Mengubah data proker (Edit)
   */
  async update(payload: any) {
    const { prokerId, prokerName, deskripsi, picIds } = payload;
    
    if (!prokerId || !prokerName || !deskripsi) {
      throw new Error("Data program kerja tidak lengkap");
    }

    try {
      // Menghapus PIC lama terlebih dahulu
      await prisma.pengurusProker.deleteMany({
        where: { prokerId: Number(prokerId) }
      });

      const updatedProker = await prisma.proker.update({
        where: { prokerId: Number(prokerId) },
        data: {
          prokerName,
          deskripsi,
          pengurusProker: picIds && picIds.length > 0 ? {
            create: picIds.map((id: number) => ({
              pengurusId: Number(id)
            }))
          } : undefined
        },
        include: {
          pengurusProker: {
            include: { pengurus: true }
          }
        }
      });

      return {
        message: "Program kerja berhasil diperbarui",
        data: updatedProker,
      };
    } catch (error: any) {
      throw new Error(`Gagal memperbarui program kerja: ${error.message}`);
    }
  },

  /**
   * Menghapus proker
   */
  async delete(payload: any) {
    const { prokerId } = payload;
    
    if (!prokerId) {
      throw new Error("ID Program Kerja dibutuhkan");
    }

    try {
      await prisma.proker.delete({
        where: { prokerId: Number(prokerId) },
      });

      return {
        message: "Program kerja berhasil dihapus",
      };
    } catch (error: any) {
      throw new Error(`Gagal menghapus program kerja: ${error.message}`);
    }
  }
};
