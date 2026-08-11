"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaImage, FaTimes } from "react-icons/fa";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch("/api/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_by_id", payload: { postId: params.id } }),
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setTitle(data.data.title);
          setDescription(data.data.description);
          setExistingImage(data.data.gambar);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchPost();
  }, [params.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type === "image/gif" || selected.type.startsWith("video/")) {
      setError("GIF dan video tidak diizinkan. Gunakan gambar statis (JPG, PNG, WEBP).");
      return;
    }
    if (!selected.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Judul tidak boleh kosong."); return; }
    if (!description.trim()) { setError("Deskripsi tidak boleh kosong."); return; }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("action", "update");
      formData.append("postId", String(params.id));
      formData.append("title", title);
      formData.append("description", description);
      if (file) formData.append("file", file);

      const res = await fetch("/api/post", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");
      router.push("/admin/post");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const displayImage = preview || (existingImage ? `/uploads/${existingImage}` : null);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/post"
          className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors text-neutral-400 hover:text-white"
        >
          <FaArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white">Edit Post</h2>
          <p className="text-neutral-400 text-sm mt-0.5">Perbarui konten artikel atau kegiatan</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Gambar */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">
            Gambar Post {!existingImage && <span className="text-orange-400">*</span>}
            {existingImage && <span className="text-neutral-500 text-xs ml-2">(Kosongkan untuk mempertahankan gambar saat ini)</span>}
          </label>
          {displayImage ? (
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-neutral-700">
              <Image src={displayImage} alt="Preview" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" unoptimized />
              {preview && (
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="absolute top-3 right-3 p-2 bg-black/70 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <FaTimes size={14} />
                </button>
              )}
              <div className="absolute bottom-3 left-3 bg-black/70 text-xs text-neutral-300 px-3 py-1 rounded-full font-mono">
                {preview ? `${file?.name} · ${file ? (file.size / 1024).toFixed(0) : 0} KB` : "Gambar saat ini"}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 right-3 text-xs bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded-full font-medium transition-colors"
              >
                Ganti Gambar
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video bg-neutral-900 border-2 border-dashed border-neutral-700 hover:border-orange-500 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors group"
            >
              <div className="p-4 bg-neutral-800 group-hover:bg-orange-600/20 rounded-2xl transition-colors">
                <FaImage size={28} className="text-neutral-500 group-hover:text-orange-400 transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-neutral-400 text-sm font-medium">Klik untuk memilih gambar</p>
                <p className="text-neutral-600 text-xs mt-1">JPG, PNG, WEBP · Bukan GIF/Video</p>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/bmp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Judul */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">
            Judul <span className="text-orange-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Masukkan judul post..."
            className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Deskripsi */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">
            Deskripsi <span className="text-orange-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={6}
            placeholder="Tulis deskripsi atau isi konten..."
            className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
          ></textarea>
          <p className="text-neutral-600 text-xs text-right">{description.length} karakter</p>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/admin/post"
            className="flex-1 text-center py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-sm transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
