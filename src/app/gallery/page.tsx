"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaTimes } from "react-icons/fa";

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/public", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_all_gallery" })
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setGalleryItems(data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data gallery", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col pt-24 pb-12 px-6 md:px-12 selection:bg-orange-400/20">
      {/* Background Ornament */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col">
        {/* Header and Back button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition-colors mb-4 group">
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-mono text-sm uppercase tracking-widest">Back to Home</span>
            </Link>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Full Gallery
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-px w-16 bg-white/20 hidden md:block"></div>
            <span className="text-orange-400 font-mono text-xs md:text-sm tracking-[0.3em] uppercase drop-shadow-md">
              {galleryItems.length} MOMENTS
            </span>
            <div className="h-px w-16 bg-white/20 hidden md:block"></div>
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-white/10 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : galleryItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                className="group relative aspect-square md:aspect-[4/3] bg-[#0a0a0a] overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.2)] transition-all duration-300 border border-white/10 hover:border-orange-400/50"
                onClick={() => setSelectedGalleryIndex(idx)}
              >
                <Image 
                  src={item.img} 
                  alt={item.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  unoptimized 
                />

                <div className="absolute inset-x-0 bottom-0 bg-black/90 backdrop-blur-md p-3 translate-y-0 border-t border-white/10 group-hover:border-orange-400/50 transition-colors duration-300">
                  <h3 className="text-white group-hover:text-orange-400 transition-colors font-bold text-[10px] md:text-xs tracking-wide truncate uppercase">
                    {item.title}
                  </h3>
                  {item.created && (
                    <p className="text-[9px] text-zinc-500 mt-1 font-mono">
                      {new Date(item.created).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-white">
            <span className="text-3xl font-bold uppercase tracking-widest opacity-20 text-zinc-500">No Pictures Yet</span>
          </div>
        )}
      </div>

      {/* GALLERY MODAL (Instagram Style) */}
      {selectedGalleryIndex !== null && galleryItems[selectedGalleryIndex] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 backdrop-blur-sm" onClick={() => setSelectedGalleryIndex(null)}>
          <button
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors z-[110] p-2"
            onClick={(e) => { e.stopPropagation(); setSelectedGalleryIndex(null); }}
          >
            <FaTimes size={32} />
          </button>

          {/* Navigasi Kiri */}
          {galleryItems.length > 1 && (
            <button
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-orange-400 transition-colors z-[110] p-2 md:p-4 hover:scale-110 active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGalleryIndex(prev => prev !== null ? (prev === 0 ? galleryItems.length - 1 : prev - 1) : null);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 md:w-12 md:h-12 drop-shadow-lg"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
          )}

          {/* Navigasi Kanan */}
          {galleryItems.length > 1 && (
            <button
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-orange-400 transition-colors z-[110] p-2 md:p-4 hover:scale-110 active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedGalleryIndex(prev => prev !== null ? (prev + 1) % galleryItems.length : null);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 md:w-12 md:h-12 drop-shadow-lg"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          )}

          <div
            className="relative w-full max-w-6xl max-h-[90vh] bg-[#1e1e1e] rounded-md overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sisi Kiri: Gambar */}
            <div className={`relative bg-black flex items-center justify-center ${galleryItems[selectedGalleryIndex].type === 'post' ? 'md:w-[65%]' : 'w-full'} h-[40vh] md:h-[85vh]`}>
              <Image
                src={galleryItems[selectedGalleryIndex].img}
                alt={galleryItems[selectedGalleryIndex].title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Sisi Kanan: Deskripsi (Hanya untuk Post) */}
            {galleryItems[selectedGalleryIndex].type === 'post' && (
              <div className="w-full md:w-[35%] flex flex-col h-[40vh] md:h-[85vh] border-t md:border-t-0 md:border-l border-white/10 bg-[#0a0a0a]">
                {/* Header Kanan */}
                <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#111]">
                  <div className="w-8 h-8 rounded-full bg-black overflow-hidden relative border border-white/10 shrink-0">
                    <Image src="/logo-hmsi.png" alt="HMSI" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain p-1" />
                  </div>
                  <span className="font-bold text-sm text-white uppercase tracking-wider">Postingan HMSI</span>
                </div>
                {/* Scrollable Content */}
                <div className="p-4 overflow-y-auto flex-1 no-scrollbar text-sm text-neutral-300">
                  <div className="mb-4">
                    <span className="font-bold text-white block uppercase text-sm mb-1">{galleryItems[selectedGalleryIndex].title}</span>
                    <span className="whitespace-pre-wrap leading-relaxed block text-zinc-400 mt-2">{galleryItems[selectedGalleryIndex].description}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
