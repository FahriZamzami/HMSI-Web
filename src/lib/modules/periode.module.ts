import { PrismaClient } from "@prisma/client";
import { uploadImageWebp } from "../utils/upload";

const prisma = new PrismaClient();

export const PeriodeModule = {
  /**
   * Mengambil semua data periode dari database
   */
  async getAll() {
    try {
      const periodes = await prisma.periode.findMany({
        orderBy: {
          created: "desc", // Urutkan dari yang terbaru
        },
      });
      return {
        message: "Berhasil mengambil data periode",
        data: periodes,
      };
    } catch (error: any) {
      throw new Error(`Gagal mengambil data periode: ${error.message}`);
    }
  },

  /**
   * Mengambil data periode berdasarkan ID
   */
  async getById(periodeId: number) {
    try {
      const periode = await prisma.periode.findUnique({
        where: { periodeId },
      });
      if (!periode) throw new Error("Periode tidak ditemukan");
      return {
        message: "Berhasil mengambil detail periode",
        data: periode,
      };
    } catch (error: any) {
      throw new Error(`Gagal mengambil detail periode: ${error.message}`);
    }
  },

  /**
   * Membuat data periode baru
   * @param payload berisi periode dan file gambar opsional
   */
  async create(payload: any) {
    const { periode, file } = payload;

    if (!periode) {
      throw new Error("Nama periode wajib diisi");
    }

    try {
      const existingPeriode = await prisma.periode.findFirst({
        where: { periode: periode },
      });

      if (existingPeriode) {
        throw new Error("Nama periode sudah ada");
      }

      let fileName: string | null = null;

      // Jika ada file yang diunggah, proses dengan sharp
      if (file) {
        fileName = await uploadImageWebp(file);
      }

      // Buat periode dan sekaligus buat 1 divisi default bernama "Inti" tanpa deskripsi/gambar
      const newPeriode = await prisma.$transaction(async (tx) => {
        const createdPeriode = await tx.periode.create({
          data: {
            periode,
            status: "Non_Active",
            gambarPeriode: fileName || "",
          },
        });

        // Buat divisi default "Inti" untuk periode baru
        await tx.divisi.create({
          data: {
            periodeId: createdPeriode.periodeId,
            divisiName: "Inti",
            tentangDivisi: "",
            gambarDivisi: "",
          },
        });

        return createdPeriode;
      });

      return {
        message: "Periode berhasil ditambahkan (Status: Non Active) dan divisi 'Inti' dibuat",
        data: newPeriode,
      };
    } catch (error: any) {
      throw new Error(`Gagal membuat periode: ${error.message}`);
    }
  },

  /**
   * Mengubah data periode (Edit)
   */
  async update(payload: any) {
    const { periodeId, periode, file, status, replacementPeriodeId } = payload;
    
    if (!periodeId || !periode) {
      throw new Error("ID Periode dan nama periode wajib diisi");
    }

    try {
      // Ambil data lama
      const oldData = await prisma.periode.findUnique({ where: { periodeId: Number(periodeId) } });
      if (!oldData) throw new Error("Periode tidak ditemukan");

      // Cek apakah ada periode lain dengan nama yang sama
      if (periode !== oldData.periode) {
        const existingPeriode = await prisma.periode.findFirst({
          where: { periode: periode },
        });
        if (existingPeriode) {
          throw new Error("Nama periode sudah ada");
        }
      }

      let fileName = oldData.gambarPeriode;

      // Jika ada file baru yang diunggah
      if (file) {
        fileName = await uploadImageWebp(file);
        
        // Hapus file lama jika ada
        if (oldData.gambarPeriode) {
          const fs = require('fs');
          const path = require('path');
          const oldPath = path.join(process.cwd(), "public", "uploads", oldData.gambarPeriode);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      }

      // Mulai transaksi Prisma untuk konsistensi data
      const result = await prisma.$transaction(async (tx) => {
        // Jika status yang dikirimkan adalah Active, nonaktifkan periode lain terlebih dahulu
        if (status === "Active") {
          await tx.periode.updateMany({
            where: { status: "Active" },
            data: { status: "Non_Active" },
          });
        }
        
        // Jika status yang dikirimkan adalah Non_Active dan disertakan replacementPeriodeId
        if (status === "Non_Active" && replacementPeriodeId) {
          await tx.periode.update({
            where: { periodeId: Number(replacementPeriodeId) },
            data: { status: "Active" },
          });
        }

        const updatedPeriode = await tx.periode.update({
          where: { periodeId: Number(periodeId) },
          data: {
            periode,
            gambarPeriode: fileName || "",
            status: status || oldData.status,
          },
        });

        return updatedPeriode;
      });

      return {
        message: "Periode berhasil diperbarui",
        data: result,
      };
    } catch (error: any) {
      throw new Error(`Gagal memperbarui periode: ${error.message}`);
    }
  },

  /**
   * Menghapus data periode
   */
  async delete(payload: any) {
    const { periodeId } = payload;
    if (!periodeId) throw new Error("ID Periode wajib diisi");

    try {
      const oldData = await prisma.periode.findUnique({ 
        where: { periodeId: Number(periodeId) },
        include: {
          divisi: {
            include: {
              pengurus: true
            }
          }
        }
      });
      if (!oldData) throw new Error("Periode tidak ditemukan");

      // Hapus data dari database (otomatis hapus divisi dll karena Cascade)
      await prisma.periode.delete({ where: { periodeId: Number(periodeId) } });

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

      deleteFile(oldData.gambarPeriode);
      oldData.divisi.forEach((div) => {
        deleteFile(div.gambarDivisi);
        div.pengurus.forEach((p) => {
          deleteFile(p.gambarPengurus);
        });
      });

      return {
        message: "Periode berhasil dihapus",
      };
    } catch (error: any) {
      throw new Error(`Gagal menghapus periode: ${error.message}`);
    }
  },

  /**
   * Mengubah data periode lama menjadi Non-Active, dan langsung membuat periode baru sebagai Active.
   */
  async updateAndCreateReplacement(payload: any) {
    const { periodeId, periode, file, newPeriodeName, newPeriodeFile } = payload;
    
    if (!periodeId || !periode || !newPeriodeName) {
      throw new Error("Data periode lama dan nama periode baru wajib diisi");
    }

    try {
      // 1. Ambil data lama
      const oldData = await prisma.periode.findUnique({ where: { periodeId: Number(periodeId) } });
      if (!oldData) throw new Error("Periode lama tidak ditemukan");

      // Cek apakah periode baru sudah ada (newPeriodeName)
      const existingNewPeriode = await prisma.periode.findFirst({
        where: { periode: newPeriodeName },
      });
      if (existingNewPeriode) {
        throw new Error("Nama periode pengganti sudah ada");
      }

      let oldFileName = oldData.gambarPeriode;
      let newFileName: string | null = null;

      // 2. Proses file lama (opsional)
      if (file) {
        oldFileName = await uploadImageWebp(file);
        if (oldData.gambarPeriode) {
          const fs = require('fs');
          const path = require('path');
          const oldPath = path.join(process.cwd(), "public", "uploads", oldData.gambarPeriode);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      }

      // 3. Proses file baru (opsional)
      if (newPeriodeFile) {
        newFileName = await uploadImageWebp(newPeriodeFile);
      }

      // 4. Transaksi Database
      await prisma.$transaction(async (tx) => {
        // Nonaktifkan semua periode aktif (untuk memastikan hanya 1 yang aktif)
        await tx.periode.updateMany({
          where: { status: "Active" },
          data: { status: "Non_Active" },
        });

        // Update periode lama (tetap menjadi Non_Active)
        await tx.periode.update({
          where: { periodeId: Number(periodeId) },
          data: {
            periode,
            gambarPeriode: oldFileName || "",
            status: "Non_Active",
          },
        });

        // Buat periode baru (Active)
        await tx.periode.create({
          data: {
            periode: newPeriodeName,
            status: "Active",
            gambarPeriode: newFileName || "",
          },
        });
      });

      return {
        message: "Berhasil menonaktifkan periode lama dan mengaktifkan periode baru",
      };
    } catch (error: any) {
      throw new Error(`Gagal memproses periode pengganti: ${error.message}`);
    }
  }
};
