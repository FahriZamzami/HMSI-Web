import { PrismaClient } from "@prisma/client";
import { uploadImageWebp } from "../utils/upload";

const prisma = new PrismaClient();

export const DivisiModule = {
  /**
   * Mengambil divisi berdasarkan ID beserta info periodenya
   */
  async getById(divisiId: number) {
    if (!divisiId) throw new Error("ID Divisi dibutuhkan");
    try {
      const divisi = await prisma.divisi.findUnique({
        where: { divisiId },
        include: { periode: true }
      });
      if (!divisi) throw new Error("Divisi tidak ditemukan");
      return { data: divisi };
    } catch (error: any) {
      throw new Error(`Gagal mengambil divisi: ${error.message}`);
    }
  },

  /**
   * Mengambil semua divisi berdasarkan ID Periode
   */
  async getByPeriodeId(periodeId: number) {
    if (!periodeId) throw new Error("ID Periode dibutuhkan");

    try {
      const divisiList = await prisma.divisi.findMany({
        where: { periodeId },
        orderBy: { created: "asc" },
      });

      return {
        message: "Berhasil mengambil data divisi",
        data: divisiList,
      };
    } catch (error: any) {
      throw new Error(`Gagal mengambil data divisi: ${error.message}`);
    }
  },

  /**
   * Membuat divisi baru
   */
  async create(payload: any) {
    const { periodeId, divisiName, tentangDivisi, file } = payload;

    if (!periodeId || !divisiName || !tentangDivisi) {
      throw new Error("ID Periode, Nama Divisi, dan Tentang Divisi dibutuhkan");
    }

    try {
      const existingDivisi = await prisma.divisi.findFirst({
        where: {
          periodeId: Number(periodeId),
          divisiName: divisiName,
        },
      });

      if (existingDivisi) {
        throw new Error("Nama divisi sudah ada di periode ini");
      }

      let fileName = "";
      if (file) {
        fileName = await uploadImageWebp(file);
      }

      const newDivisi = await prisma.divisi.create({
        data: {
          periodeId: Number(periodeId),
          divisiName,
          tentangDivisi,
          gambarDivisi: fileName || "",
        },
      });

      return {
        message: "Divisi berhasil ditambahkan",
        data: newDivisi,
      };
    } catch (error: any) {
      throw new Error(`Gagal membuat divisi: ${error.message}`);
    }
  },

  /**
   * Mengubah data divisi (Edit)
   */
  async update(payload: any) {
    const { divisiId, divisiName, tentangDivisi, file } = payload;
    
    if (!divisiId || !divisiName || !tentangDivisi) {
      throw new Error("Data divisi tidak lengkap (termasuk tentang divisi)");
    }

    try {
      const oldData = await prisma.divisi.findUnique({ where: { divisiId: Number(divisiId) } });
      if (!oldData) throw new Error("Divisi tidak ditemukan");

      if (divisiName !== oldData.divisiName) {
        const existingDivisi = await prisma.divisi.findFirst({
          where: {
            periodeId: oldData.periodeId,
            divisiName: divisiName,
          },
        });
        if (existingDivisi) {
          throw new Error("Nama divisi sudah ada di periode ini");
        }
      }

      let fileName = oldData.gambarDivisi;

      if (file) {
        fileName = await uploadImageWebp(file);
        
        // Hapus file lama jika ada dan bukan kosong
        if (oldData.gambarDivisi) {
          const fs = require('fs');
          const path = require('path');
          const oldPath = path.join(process.cwd(), "public", "uploads", oldData.gambarDivisi);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      }

      const updatedDivisi = await prisma.divisi.update({
        where: { divisiId: Number(divisiId) },
        data: {
          divisiName,
          tentangDivisi,
          gambarDivisi: fileName,
        },
      });

      return {
        message: "Divisi berhasil diperbarui",
        data: updatedDivisi,
      };
    } catch (error: any) {
      throw new Error(`Gagal memperbarui divisi: ${error.message}`);
    }
  },

  /**
   * Menghapus data divisi beserta file gambarnya dan gambar anggotanya
   */
  async delete(payload: any) {
    const { divisiId } = payload;
    if (!divisiId) throw new Error("ID Divisi wajib diisi");

    try {
      const oldData = await prisma.divisi.findUnique({ 
        where: { divisiId: Number(divisiId) },
        include: { pengurus: true }
      });
      if (!oldData) throw new Error("Divisi tidak ditemukan");

      // Hapus data dari database (otomatis hapus pengurus dll karena Cascade)
      await prisma.divisi.delete({ where: { divisiId: Number(divisiId) } });

      // Hapus file fisik
      const fs = require('fs');
      const path = require('path');
      
      const deleteFile = (filename: string | null | undefined) => {
        if (filename) {
          const filePath = path.join(process.cwd(), "public", "uploads", filename);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (e) {}
          }
        }
      };

      deleteFile(oldData.gambarDivisi);
      oldData.pengurus.forEach((p) => {
        deleteFile(p.gambarPengurus);
      });

      return {
        message: "Divisi berhasil dihapus",
      };
    } catch (error: any) {
      throw new Error(`Gagal menghapus divisi: ${error.message}`);
    }
  }
};
