import { PrismaClient } from "@prisma/client";
import { uploadImageWebp } from "../utils/upload";

const prisma = new PrismaClient();

export const PengurusModule = {
  /**
   * Mengambil semua pengurus berdasarkan ID Divisi
   */
  async getByDivisiId(divisiId: number) {
    if (!divisiId) throw new Error("ID Divisi dibutuhkan");

    try {
      const pengurusList = await prisma.pengurus.findMany({
        where: { divisiId },
        orderBy: { created: "asc" },
      });

      return {
        message: "Berhasil mengambil data pengurus",
        data: pengurusList.map(p => ({
          ...p,
          role: p.role.replace(/_/g, " ")
        })),
      };
    } catch (error: any) {
      throw new Error(`Gagal mengambil data pengurus: ${error.message}`);
    }
  },

  /**
   * Mengambil role global yang sudah terisi di suatu periode
   */
  async getTakenGlobalRoles(periodeId: number) {
    if (!periodeId) throw new Error("ID Periode dibutuhkan");
    try {
      const taken = await prisma.pengurus.findMany({
        where: {
          divisi: { periodeId: Number(periodeId) },
          role: { in: ["Ketua_Himpunan", "Wakil_Ketua_Himpunan", "Sekretaris_Umum", "Bendahara_Umum"] }
        },
        select: { role: true }
      });
      return { data: taken.map(t => t.role.replace(/_/g, " ")) };
    } catch (error: any) {
      throw new Error(`Gagal mengambil data role: ${error.message}`);
    }
  },

  /**
   * Helper untuk membuat Title Case
   */
  toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  },

  /**
   * Membuat pengurus baru
   */
  async create(payload: any) {
    const { divisiId, role, pengurusName, nomorAnggota, file } = payload;

    if (!divisiId || !role || !pengurusName || !nomorAnggota) {
      throw new Error("Semua data teks pengurus wajib diisi");
    }

    try {
      let fileName = "";
      if (file) {
        fileName = await uploadImageWebp(file);
      }

      const prismaRole = role.replace(/ /g, "_");

      const newPengurus = await prisma.pengurus.create({
        data: {
          divisiId: Number(divisiId),
          role: prismaRole as any,
          pengurusName: this.toTitleCase(pengurusName),
          nomorAnggota,
          gambarPengurus: fileName,
        },
      });

      return {
        message: "Pengurus berhasil ditambahkan",
        data: newPengurus,
      };
    } catch (error: any) {
      throw new Error(`Gagal membuat pengurus: ${error.message}`);
    }
  },

  /**
   * Mengubah data pengurus (Edit)
   */
  async update(payload: any) {
    const { pengurusId, role, pengurusName, nomorAnggota, file } = payload;
    
    if (!pengurusId || !role || !pengurusName || !nomorAnggota) {
      throw new Error("Data pengurus tidak lengkap");
    }

    try {
      const oldData = await prisma.pengurus.findUnique({ where: { pengurusId: Number(pengurusId) } });
      if (!oldData) throw new Error("Pengurus tidak ditemukan");

      let fileName = oldData.gambarPengurus;

      if (file) {
        fileName = await uploadImageWebp(file);
        
        // Hapus file lama jika ada
        if (oldData.gambarPengurus) {
          const fs = require('fs');
          const path = require('path');
          const oldPath = path.join(process.cwd(), "public", "uploads", oldData.gambarPengurus);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      }

      const prismaRole = role.replace(/ /g, "_");

      const updatedPengurus = await prisma.pengurus.update({
        where: { pengurusId: Number(pengurusId) },
        data: {
          role: prismaRole as any,
          pengurusName: this.toTitleCase(pengurusName),
          nomorAnggota,
          gambarPengurus: fileName,
        },
      });

      return {
        message: "Pengurus berhasil diperbarui",
        data: updatedPengurus,
      };
    } catch (error: any) {
      throw new Error(`Gagal memperbarui pengurus: ${error.message}`);
    }
  },

  /**
   * Menghapus pengurus
   */
  async delete(payload: any) {
    const { pengurusId } = payload;
    
    if (!pengurusId) {
      throw new Error("ID Pengurus dibutuhkan");
    }

    try {
      const oldData = await prisma.pengurus.findUnique({ where: { pengurusId: Number(pengurusId) } });
      if (!oldData) throw new Error("Pengurus tidak ditemukan");

      // Hapus file gambar
      if (oldData.gambarPengurus) {
        const fs = require('fs');
        const path = require('path');
        const oldPath = path.join(process.cwd(), "public", "uploads", oldData.gambarPengurus);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      await prisma.pengurus.delete({
        where: { pengurusId: Number(pengurusId) },
      });

      return {
        message: "Pengurus berhasil dihapus",
      };
    } catch (error: any) {
      throw new Error(`Gagal menghapus pengurus: ${error.message}`);
    }
  }
};
