"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaEnvelopeOpenText, FaImage } from "react-icons/fa";

export default function AdminSaranPage() {
  const [saranList, setSaranList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSaran, setSelectedSaran] = useState<any | null>(null);

  const fetchSaran = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/saran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_all" }),
      });
      const data = await res.json();
      if (res.ok) setSaranList(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Deletion of suggestions is disabled per policy — keep data immutable here.

  useEffect(() => {
    fetchSaran();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-black border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white">Kotak Saran</h2>
        <p className="text-neutral-400 text-sm mt-1">
          Masukan dan kritik yang dikirimkan secara anonim oleh mahasiswa.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : saranList.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 font-mono tracking-widest text-sm">
          BELUM ADA SARAN MASUK
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {saranList.map((s) => (
            <div
              key={s.saranId}
              onClick={() => setSelectedSaran(s)}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 hover:bg-neutral-800/50 cursor-pointer transition-all flex flex-col h-full"
            >
              <div className="flex items-center gap-2 text-neutral-300 mb-3">
                {s.gambar ? (
                  <FaImage className="text-orange-400 shrink-0" size={14} />
                ) : (
                  <FaEnvelopeOpenText className="text-neutral-500 shrink-0" size={14} />
                )}
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">Anonymous</span>
              </div>
              <p className="text-sm text-white line-clamp-3 flex-1 leading-relaxed">
                {s.saran}
              </p>
              <p className="text-[10px] text-neutral-600 mt-4 font-mono">
                {new Date(s.created).toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail Saran */}
      {selectedSaran && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 md:p-8 backdrop-blur-sm" onClick={() => setSelectedSaran(null)}>
          
          {/* Navigasi Kiri */}
          {saranList.length > 1 && (
            <button
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-orange-400 transition-colors z-[110] p-2 md:p-4 hover:scale-110 active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = saranList.findIndex(s => s.saranId === selectedSaran.saranId);
                const prevIndex = currentIndex === 0 ? saranList.length - 1 : currentIndex - 1;
                setSelectedSaran(saranList[prevIndex]);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 md:w-12 md:h-12 drop-shadow-lg"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
          )}

          {/* Navigasi Kanan */}
          {saranList.length > 1 && (
            <button
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-orange-400 transition-colors z-[110] p-2 md:p-4 hover:scale-110 active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = saranList.findIndex(s => s.saranId === selectedSaran.saranId);
                const nextIndex = (currentIndex + 1) % saranList.length;
                setSelectedSaran(saranList[nextIndex]);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 md:w-12 md:h-12 drop-shadow-lg"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          )}

          <div 
            className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] z-50 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
              <span className="text-orange-400 font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase">
                Detail Aspirasi
              </span>
              <button onClick={() => setSelectedSaran(null)} className="text-neutral-500 hover:text-white transition-colors bg-black p-2 rounded-full border border-neutral-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="bg-black border border-neutral-800 rounded-2xl p-5">
              <p className="text-white text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {selectedSaran.saran}
              </p>
            </div>

            {selectedSaran.gambar && (
              <div>
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-3">
                  Lampiran Gambar
                </p>
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-neutral-800">
                  <Image
                    src={`/uploads/${selectedSaran.gambar}`}
                    alt="Lampiran Saran"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}
            
            <p className="text-[10px] text-neutral-600 font-mono text-right">
              {new Date(selectedSaran.created).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
