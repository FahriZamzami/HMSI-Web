"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

export default function AdminPostPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_all" }),
      });
      const data = await res.json();
      if (res.ok) setPosts(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: number, title: string) => {
    if (!confirm(`Hapus post "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", payload: { postId } }),
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.postId !== postId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Kelola Post</h2>
          <p className="text-neutral-400 text-sm mt-1">Buat dan kelola artikel atau kegiatan HMSI</p>
        </div>
        <Link
          href="/admin/post/create"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm"
        >
          <FaPlus size={14} />
          Buat Post Baru
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul post..."
          className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-3xl">
          <FaSearch size={32} className="mx-auto text-neutral-600 mb-4" />
          <p className="text-neutral-500 font-mono text-sm">
            {search ? `Tidak ada post yang cocok dengan "${search}"` : "Belum ada post. Buat yang pertama!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((post) => (
            <div
              key={post.postId}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-colors group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-black overflow-hidden">
                <Image
                  src={`/uploads/${post.gambar}`}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-white font-bold text-base line-clamp-1">{post.title}</h3>
                  <p className="text-neutral-500 text-xs mt-1">
                    {new Date(post.created).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </p>
                </div>
                <p className="text-neutral-400 text-sm line-clamp-2">{post.description}</p>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/admin/post/${post.postId}`}
                    className="flex-1 flex items-center justify-center gap-2 text-xs bg-neutral-800 hover:bg-orange-600 text-neutral-300 hover:text-white px-3 py-2 rounded-lg transition-colors font-medium"
                  >
                    <FaEdit size={12} /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.postId, post.title)}
                    className="flex items-center justify-center gap-2 text-xs bg-neutral-800 hover:bg-red-600/20 text-neutral-300 hover:text-red-400 px-3 py-2 rounded-lg transition-colors font-medium"
                  >
                    <FaTrash size={12} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
