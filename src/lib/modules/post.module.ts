import { PrismaClient } from "@prisma/client";
import { uploadImageWebp } from "../utils/upload";

const prisma = new PrismaClient();

export const PostModule = {
  /**
   * Mengambil semua post, diurutkan dari terbaru
   */
  async getAll() {
    try {
      const posts = await prisma.post.findMany({
        orderBy: { created: "desc" },
      });
      return { message: "Berhasil mengambil data post", data: posts };
    } catch (error: any) {
      throw new Error(`Gagal mengambil post: ${error.message}`);
    }
  },

  /**
   * Mengambil satu post berdasarkan ID
   */
  async getById(postId: number) {
    if (!postId) throw new Error("ID Post dibutuhkan");
    try {
      const post = await prisma.post.findUnique({ where: { postId } });
      if (!post) throw new Error("Post tidak ditemukan");
      return { message: "Berhasil mengambil post", data: post };
    } catch (error: any) {
      throw new Error(`Gagal mengambil post: ${error.message}`);
    }
  },

  /**
   * Membuat post baru. Gambar WAJIB ada.
   */
  async create(data: { title: string; description: string; file: File }) {
    if (!data.title) throw new Error("Judul post tidak boleh kosong");
    if (!data.description) throw new Error("Deskripsi post tidak boleh kosong");
    if (!data.file) throw new Error("Gambar post wajib diisi");

    // Validasi: hanya gambar statis (bukan GIF/video)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/bmp", "image/tiff"];
    if (!allowedTypes.includes(data.file.type)) {
      throw new Error("Hanya gambar statis (JPG, PNG, WEBP, dll) yang diizinkan. GIF dan video tidak diperbolehkan.");
    }

    try {
      const fileName = await uploadImageWebp(data.file);
      const post = await prisma.post.create({
        data: {
          title: data.title,
          description: data.description,
          gambar: fileName,
        },
      });
      return { message: "Post berhasil dibuat", data: post };
    } catch (error: any) {
      throw new Error(`Gagal membuat post: ${error.message}`);
    }
  },

  /**
   * Memperbarui post. Gambar baru opsional; jika tidak diisi, gambar lama dipertahankan.
   */
  async update(data: { postId: number; title?: string; description?: string; file?: File | null }) {
    if (!data.postId) throw new Error("ID Post dibutuhkan");

    try {
      let fileName: string | undefined = undefined;

      if (data.file) {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/bmp", "image/tiff"];
        if (!allowedTypes.includes(data.file.type)) {
          throw new Error("Hanya gambar statis yang diizinkan. GIF dan video tidak diperbolehkan.");
        }
        fileName = await uploadImageWebp(data.file);
      }

      const post = await prisma.post.update({
        where: { postId: data.postId },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.description && { description: data.description }),
          ...(fileName && { gambar: fileName }),
        },
      });
      return { message: "Post berhasil diperbarui", data: post };
    } catch (error: any) {
      throw new Error(`Gagal memperbarui post: ${error.message}`);
    }
  },

  /**
   * Menghapus post berdasarkan ID
   */
  async delete(postId: number) {
    if (!postId) throw new Error("ID Post dibutuhkan");
    try {
      await prisma.post.delete({ where: { postId } });
      return { message: "Post berhasil dihapus" };
    } catch (error: any) {
      throw new Error(`Gagal menghapus post: ${error.message}`);
    }
  },
};
