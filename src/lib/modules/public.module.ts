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
  },

  /**
   * Mengambil semua gambar untuk Gallery (Periode, Divisi, Post) dari semua periode
   */
  async getAllGallery() {
    try {
      const gItems: any[] = [];

      // 1. Ambil semua Periode yang punya gambar
      const periodes = await prisma.periode.findMany({
        where: { gambarPeriode: { not: null, notIn: [""] } },
        orderBy: { created: "desc" }
      });
      periodes.forEach(p => {
        if (p.gambarPeriode) {
          gItems.push({
            type: "periode",
            img: `/uploads/${p.gambarPeriode}`,
            title: `Periode ${p.periode}`,
            created: p.created
          });
        }
      });

      // 2. Ambil semua Divisi yang punya gambar
      const divisis = await prisma.divisi.findMany({
        where: { gambarDivisi: { not: null, notIn: [""] } },
        orderBy: { created: "desc" }
      });
      divisis.forEach(d => {
        if (d.gambarDivisi) {
          gItems.push({
            type: "divisi",
            img: `/uploads/${d.gambarDivisi}`,
            title: d.divisiName,
            created: d.created
          });
        }
      });

      // 3. Ambil semua Post yang punya gambar
      const posts = await prisma.post.findMany({
        where: { gambar: { not: "" } },
        orderBy: { created: "desc" }
      });
      posts.forEach(p => {
        if (p.gambar) {
          gItems.push({
            type: "post",
            img: `/uploads/${p.gambar}`,
            title: p.title,
            description: p.description,
            created: p.created
          });
        }
      });

      // Sort kombinasi array berdasarkan tanggal dibuat (terbaru)
      gItems.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

      return {
        message: "Berhasil mengambil data gallery lengkap",
        data: gItems
      };
    } catch (error: any) {
      throw new Error(`Gagal mengambil data gallery: ${error.message}`);
    }
  }
};
