import { PrismaClient } from "@prisma/client";
import { uploadImageWebp } from "../utils/upload";

const prisma = new PrismaClient();

export const PublicModule = {
  /**
   * Mengambil data periode yang sedang 'Active', beserta daftar divisinya.
   * Hanya ada maksimal 1 periode aktif.
   */
  async getActivePeriodeData() {
    try {
      // 1. Cek status Admin (user dengan name 'admin')
      const adminUser = await prisma.user.findFirst({
        where: { name: "admin" }
      });

      // Jika admin dalam mode Maintenance, abaikan periode aktif
      if (adminUser?.status === "Maintenance") {
        return { message: "System is in maintenance", data: null };
      }

      // 2. Ambil data periode aktif
      const activePeriode = await prisma.periode.findFirst({
        where: { status: "Active" },
        include: { divisi: true },
      });

      if (!activePeriode) {
        return { message: "Tidak ada periode aktif ditemukan", data: null };
      }

      const posts = await prisma.post.findMany({
        orderBy: { created: "desc" }
      });

      return {
        message: "Berhasil mengambil data periode aktif",
        data: {
          ...activePeriode,
          posts,
        }
      };
    } catch (error: any) {
      throw new Error(`Gagal mengambil data periode aktif: ${error.message}`);
    }
  },

  /**
   * Mengambil detail divisi beserta pengurus dan program kerjanya
   * Ditujukan untuk halaman publik /divisi/[id]
   */
  async getDivisiDetail(divisiId: number) {
    if (!divisiId) throw new Error("ID Divisi dibutuhkan");

    try {
      const divisi = await prisma.divisi.findUnique({
        where: { divisiId },
        include: {
          periode: true,
          pengurus: {
            orderBy: { created: "asc" }
          },
          proker: {
            orderBy: { created: "asc" },
            include: {
              pengurusProker: {
                include: { pengurus: true }
              }
            }
          }
        }
      });

      if (!divisi) {
        throw new Error("Divisi tidak ditemukan");
      }

      return {
        message: "Berhasil mengambil detail divisi",
        data: divisi
      };
    } catch (error: any) {
      throw new Error(`Gagal mengambil detail divisi: ${error.message}`);
    }
  },

  /**
   * Mengambil semua periode yang berstatus selain 'Active' (untuk halaman Alumni)
   */
  async getAlumniPeriode() {
    try {
      const alumni = await prisma.periode.findMany({
        where: { status: { not: "Active" } },
        orderBy: { created: "desc" },
      });

      return {
        message: "Berhasil mengambil data periode alumni",
        data: alumni,
      };
    } catch (error: any) {
      throw new Error(`Gagal mengambil data periode alumni: ${error.message}`);
    }
  },

  /**
   * Mengambil detail periode alumni beserta divisi-divisinya dan pengurusnya
   */
  async getAlumniPeriodeDetail(periodeId: number) {
    if (!periodeId) throw new Error("ID Periode dibutuhkan");

    try {
      const periode = await prisma.periode.findUnique({
        where: { periodeId },
        include: {
          divisi: {
            orderBy: { created: "asc" },
            include: {
              pengurus: {
                orderBy: { created: "asc" }
              }
            }
          }
        }
      });

      if (!periode) {
        throw new Error("Periode tidak ditemukan");
      }

      return {
        message: "Berhasil mengambil detail periode alumni",
        data: periode
      };
    } catch (error: any) {
      throw new Error(`Gagal mengambil detail periode alumni: ${error.message}`);
    }
  },

  /**
   * Mengirimkan kritik dan saran
   */
  async submitSaran(data: { saran: string; file?: File | null }) {
    if (!data.saran) throw new Error("Saran tidak boleh kosong");

    try {
      let fileName = null;
      if (data.file) {
        fileName = await uploadImageWebp(data.file);
      }

      const saran = await prisma.saran.create({
        data: {
          saran: data.saran,
          gambar: fileName,
        }
      });

      return {
        message: "Saran berhasil dikirim",
        data: saran
      };
    } catch (error: any) {
      throw new Error(`Gagal mengirim saran: ${error.message}`);
    }
  }
};
