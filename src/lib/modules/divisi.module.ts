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
  }
};
