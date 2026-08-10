"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/footer/footer";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function AlumniDetailPage() {
  const params = useParams();
  const [periode, setPeriode] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch("/api/public", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            action: "get_alumni_periode_detail", 
            payload: { periodeId: params.id } 
          }),
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setPeriode(data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil detail alumni", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) {
      fetchDetail();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!periode) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center text-white font-mono">
        DATA TIDAK DITEMUKAN
      </div>
    );
  }

  const divisiUtama = periode.divisi && periode.divisi.length > 0 ? periode.divisi[0] : null;
  const divisiLainnya = periode.divisi && periode.divisi.length > 1 ? periode.divisi.slice(1) : [];

  // Hierarki jabatan untuk mengurutkan pengurus. Nama field jabatan bisa berbeda
  // (jabatan, posisi, role, title, pengurusRole, pengurusJabatan) — helper akan
  // memeriksa beberapa kemungkinan dan mengurutkan berdasarkan array di bawah.
  const roleOrder = [
    "ketua himpunan",
    "wakil ketua himpunan",
    "sekretaris umum",
    "bendahara umum",
    "kepala divisi",
    "sekretaris divisi",
    "bendahara divisi",
    "sekretaris bendahara divisi",
    "staf divisi",
  ];

  const getRoleString = (p: any) => {
    return (
      (p?.jabatan || p?.posisi || p?.role || p?.title || p?.pengurusRole || p?.pengurusJabatan || "")
        .toString()
        .toLowerCase()
    );
  };

  const sortPengurus = (list: any[]) => {
    if (!list) return [];
    return [...list].sort((a, b) => {
      const ra = getRoleString(a);
      const rb = getRoleString(b);
      const ia = roleOrder.indexOf(ra);
      const ib = roleOrder.indexOf(rb);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-400/30 overflow-x-hidden flex flex-col">
      
      <Link href="/alumni" className="fixed top-6 left-6 z-50 p-3 bg-black/50 border border-white/10 rounded-full hover:bg-orange-400 hover:text-black transition-colors backdrop-blur-md hidden md:flex items-center justify-center">
        <FaArrowLeft />
      </Link>

      <main className="w-full relative pt-16 pb-20 flex-1">
        {/* Background Accents */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-400/5 rounded-full blur-[120px] mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] mix-blend-screen -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
          
          <div className="text-center space-y-4 mb-16 md:mb-24">
            <span className="text-orange-400 font-mono text-[10px] md:text-xs tracking-[0.5em] block uppercase">
               PERIODE
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase text-white drop-shadow-2xl leading-[0.9]">
               {periode.periode}
            </h1>
          </div>

          <div className="flex flex-col items-center gap-10">
            {/* Divisi Pertama (Puncak Tengah) */}
            {divisiUtama && (
              <div className="w-full flex justify-center mb-10">
                <div className="w-full max-w-[400px]">
                  <div className="group relative bg-black overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(251,146,60,0.2)] transition-all duration-500 border border-orange-400 hover:border-orange-400 flex flex-col">
                    <div className="relative z-10 flex-1 flex flex-col justify-start p-6 md:p-8 text-center">
                      <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic text-white transition-colors duration-300 group-hover:text-orange-400 leading-none">
                        {divisiUtama.divisiName}
                      </h3>
                      {divisiUtama.pengurus && divisiUtama.pengurus.length > 0 && (
                        <div className="text-white/70 text-xs md:text-sm font-medium mt-3 tracking-wide space-y-1">
                          {sortPengurus(divisiUtama.pengurus).map((p, idx) => (
                            <p key={idx}>{p.pengurusName}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Divisi Lainnya (Di bawah, grid max 3 kolom, center aligned) */}
            {divisiLainnya.length > 0 && (
                <div className="w-full flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
                  {divisiLainnya.map((div, idx) => (
                    <div key={div.divisiId} className="w-full h-full">
                      <div className="group relative bg-black overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.15)] transition-all duration-500 border border-orange-400 hover:border-orange-400 flex flex-col h-full">
                        <div className="relative z-10 flex-1 flex flex-col justify-start p-4 md:p-6 text-center">
                          <h3 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic text-white transition-colors duration-300 group-hover:text-orange-400 leading-none">
                            {div.divisiName}
                          </h3>
                          {div.pengurus && div.pengurus.length > 0 && (
                            <div className="text-white/70 text-xs md:text-sm font-medium mt-2 tracking-wide space-y-1">
                              {sortPengurus(div.pengurus).map((p, pidx) => (
                                <p key={pidx}>{p.pengurusName}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {(!divisiUtama && divisiLainnya.length === 0) && (
              <div className="text-zinc-500 font-mono tracking-widest text-sm uppercase mt-10">
                Belum ada divisi yang tercatat pada periode ini
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
