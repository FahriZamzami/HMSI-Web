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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daftar Saran (Kiri) */}
          <div className="lg:col-span-1 space-y-3">
            {saranList.map((s) => (
              <div
                key={s.saranId}
                onClick={() => setSelectedSaran(s)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedSaran?.saranId === s.saranId
                    ? "bg-orange-500/10 border-orange-500/50"
                    : "bg-neutral-900 border-neutral-800 hover:border-neutral-600"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-neutral-300 min-w-0">
                    {s.gambar ? (
                      <FaImage className="text-orange-400 shrink-0" size={12} />
                    ) : (
                      <FaEnvelopeOpenText className="text-neutral-500 shrink-0" size={12} />
                    )}
                    <p className="text-sm truncate">{s.saran}</p>
                  </div>
                  {/* delete removed to prevent removal of suggestions */}
                </div>
                <p className="text-[10px] text-neutral-600 mt-2 font-mono">
                  {new Date(s.created).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>

          {/* Detail Saran (Kanan) */}
          <div className="lg:col-span-2">
            {selectedSaran ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-orange-400 font-mono text-[10px] tracking-[0.3em] uppercase">
                      ANONYMOUS // {new Date(selectedSaran.created).toLocaleString("id-ID")}
                    </span>
                  </div>
                  {/* delete action removed — suggestions are not deletable */}
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
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-neutral-900 border border-neutral-800 rounded-3xl py-20 text-neutral-600 font-mono text-sm">
                Pilih saran untuk melihat detail
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
