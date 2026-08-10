import sharp from "sharp";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

/**
 * Memproses dan mengunggah gambar ke folder public/uploads
 * @param file Objek File dari FormData
 * @returns Nama file yang berhasil disimpan (contoh: 1691234567.webp)
 */
export async function uploadImageWebp(file: File): Promise<string> {
  // 1. Validasi Tipe File (Hanya gambar)
  if (!file.type.startsWith("image/")) {
    throw new Error("File yang diunggah harus berupa gambar (JPG/PNG)");
  }
  
  // 2. Tolak file GIF atau Video
  if (file.type === "image/gif") {
    throw new Error("Gambar berformat GIF tidak diizinkan");
  }

  // 3. Persiapkan direktori public/uploads
  const uploadDir = join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // 4. Ubah File menjadi Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 5. Generate nama file unik dengan ekstensi .webp
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1000)}.webp`;
  const filePath = join(uploadDir, fileName);

  // 6. Proses kompresi dan konversi menggunakan Sharp
  await sharp(buffer)
    .webp({ quality: 80 }) // Kualitas 80% cukup baik untuk mengurangi ukuran drastis
    .toFile(filePath);

  return fileName;
}
