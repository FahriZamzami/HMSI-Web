"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

export default function Home() {
  const bgImages = [
    "/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg", "/5.jpg", "/6.jpg", "/7.jpg",
  ];

  const [currentBg, setCurrentBg] = useState(0);

  // Fungsi untuk ke slide berikutnya
  const nextSlide = useCallback(() => {
    setCurrentBg((prev) => (prev + 1) % bgImages.length);
  }, [bgImages.length]);

  // Fungsi untuk ke slide sebelumnya
  const prevSlide = () => {
    setCurrentBg((prev) => (prev === 0 ? bgImages.length - 1 : prev - 1));
  };

  // Timer otomatis 5 detik
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const navLinks = [
    { name: "PROFIL", href: "#profil" },
    { name: "DIVISI", href: "#divisi" },
    { name: "PROGRAM KERJA", href: "#proker" },
    { name: "KONTAK", href: "#kontak" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col overflow-hidden">
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md">
        <nav className="max-w-[1800px] mx-auto px-8 py-6 flex items-center justify-between font-light uppercase">
          <Link href="/" className="flex items-center gap-4 group">
            <Image
              src="/logo-hmsi.png"
              alt="Logo HMSI"
              width={45}
              height={45}
              className="object-contain"
              priority
            />
            <div className="flex flex-col text-[10px] tracking-[0.3em] leading-tight border-l border-white/20 pl-4">
              <span>Himpunan Mahasiswa</span>
              <span className="font-bold text-orange-400">Sistem Informasi</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-[10px] tracking-[0.4em] text-zinc-400 hover:text-white transition-all duration-300">
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* --- MAIN SLIDER --- */}
      <main className="relative flex-grow h-screen w-full overflow-hidden">
        {/* Container yang bergeser ke samping */}
        <div 
          className="flex h-full w-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentBg * 100}%)` }}
        >
          {bgImages.map((img, index) => (
            <div key={index} className="relative min-w-full h-full">
              <Image
                src={img}
                alt={`Slide ${index}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
            </div>
          ))}
        </div>

        {/* ARROW NAVIGASI (Kiri & Kanan) */}
        <div className="absolute inset-0 z-30 flex items-center justify-between px-6 pointer-events-none">
          <button 
            onClick={prevSlide}
            className="group pointer-events-auto p-4 transition-all hover:bg-white/10 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-white/50 group-hover:text-white transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button 
            onClick={nextSlide}
            className="group pointer-events-auto p-4 transition-all hover:bg-white/10 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-white/50 group-hover:text-white transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* INDIKATOR SLIDE (Garis Bawah) */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          {bgImages.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentBg(index)}
              className="h-[2px] w-12 bg-white/20 relative overflow-hidden"
            >
              <div 
                className={`absolute inset-0 bg-orange-400 transition-transform duration-[5000ms] linear ${
                  index === currentBg ? "translate-x-0" : "-translate-x-full"
                }`}
                style={{ transitionDuration: index === currentBg ? '5000ms' : '0ms' }}
              />
            </button>
          ))}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="fixed bottom-0 left-0 w-full z-40 py-8 px-12 flex justify-between items-end bg-gradient-to-t from-black/80 to-transparent">
        <div className="text-[9px] text-zinc-500 tracking-[0.5em] uppercase">
          &copy; {new Date().getFullYear()} HMSI Unand
        </div>
        <div className="hidden md:flex flex-col items-center gap-4">
          <span className="text-[9px] tracking-[0.3em] text-zinc-400 uppercase vertical-text">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-orange-400 to-transparent"></div>
        </div>
      </footer>

      <style jsx>{`
        .vertical-text { writing-mode: vertical-rl; }
      `}</style>
    </div>
  );
}