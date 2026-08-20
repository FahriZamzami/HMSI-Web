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
  },

  /**
   * Import Bulk Proker dari Excel
   */
  async importBulk(payload: any, fileBuffer: Buffer) {
    const { divisiId } = payload;
    if (!divisiId) throw new Error("ID Divisi dibutuhkan untuk import");
    
    if (!fileBuffer) {
      throw new Error("File Excel tidak ditemukan");
    }

    try {
      const xlsx = require("xlsx");
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      if (data.length === 0) {
        throw new Error("File Excel kosong");
      }

      const rowsToInsert = [];
      
      for (let i = 0; i < data.length; i++) {
        const row = data[i] as any;
        const rowNum = i + 2; // +1 for 0-index, +1 for header

        const rawJudul = row["judul"] || row["Judul"] || "";
        const rawDeskripsi = row["deskripsi"] || row["Deskripsi"] || "";

        const judul = String(rawJudul).trim();
        const deskripsi = String(rawDeskripsi).trim();

        if (!judul && !deskripsi) {
          continue; // baris kosong beneran
        }

        if (judul && !deskripsi) {
          throw new Error(`Validasi Gagal pada baris ke-${rowNum}: Memiliki judul tapi deskripsi kosong.`);
        }

        if (deskripsi && !judul) {
          throw new Error(`Validasi Gagal pada baris ke-${rowNum}: Memiliki deskripsi tapi judul kosong.`);
        }

        rowsToInsert.push({
          divisiId: Number(divisiId),
          prokerName: judul,
          deskripsi: deskripsi,
        });
      }

      if (rowsToInsert.length === 0) {
        throw new Error("Tidak ada data valid yang ditemukan untuk di-import");
      }

      const result = await prisma.proker.createMany({
        data: rowsToInsert
      });

      return {
        message: `Berhasil meng-import ${result.count} data program kerja.`,
        data: result
      };
    } catch (error: any) {
      throw new Error(error.message); // lempar langsung agar terbaca di frontend
    }
  }
};

