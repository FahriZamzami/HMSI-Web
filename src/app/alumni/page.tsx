"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/footer/footer";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await fetch("/api/public", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_alumni_periode" }),
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setAlumni(data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data alumni", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-400/30 overflow-x-hidden flex flex-col">
      
      <Link href="/" className="fixed top-6 left-6 z-50 p-3 bg-black/50 border border-white/10 rounded-full hover:bg-orange-400 hover:text-black transition-colors backdrop-blur-md hidden md:flex items-center justify-center">
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
          <div className="text-center space-y-4 mb-16">
            <span className="text-orange-400 font-mono text-[10px] md:text-xs tracking-[0.5em] block uppercase">
               ARCHIVE // LEGACY
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase text-white drop-shadow-2xl leading-[0.9]">
               ALUMNI
            </h1>
            <p className="text-zinc-400 max-w-xl mx-auto mt-4 text-sm md:text-base leading-relaxed">
              Jejak langkah dan kontribusi kepengurusan periode-periode sebelumnya yang telah menjadi bagian dari sejarah HMSI.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : alumni.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {alumni.map((periode, idx) => (
                <Link key={periode.periodeId} href={`/alumni/${periode.periodeId}`}>
                  <div className="group relative aspect-square bg-[#0a0a0a] overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(251,146,60,0.15)] transition-all duration-500 border border-white/10 hover:border-orange-400/50 flex flex-col">
                    
                    {/* Gambar Latar */}
                    <div className="absolute inset-0">
                      {periode.gambarPeriode ? (
                        <Image 
                          src={`/uploads/${periode.gambarPeriode}`} 
                          alt={`Periode ${periode.periode}`} 
                          fill 
                          className="object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-700 grayscale group-hover:grayscale-0" 
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#111]">
                          <span className="text-white/10 font-black text-6xl italic">HMSI</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    </div>

                    {/* Konten */}
                    <div className="relative z-10 flex-1 flex flex-col justify-end p-6 md:p-8">
                      <span className="text-orange-400 font-mono text-[10px] tracking-[0.3em] block mb-2 uppercase">
                        PERIODE_{String(idx + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-white group-hover:text-orange-400 transition-colors drop-shadow-md">
                        {periode.periode}
                      </h2>
                      <div className="w-0 h-1 bg-orange-400 mt-4 group-hover:w-16 transition-all duration-500"></div>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-500 font-mono tracking-widest text-sm uppercase">
              Belum ada data alumni
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
