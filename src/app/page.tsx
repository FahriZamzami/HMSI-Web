"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { 
  FaInstagram, 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaTiktok 
} from "react-icons/fa";

import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

export default function Home() {
  const bgImages = ["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg", "/5.jpg", "/6.jpg", "/7.jpg"];
  const [currentBg, setCurrentBg] = useState(0);
  const [mounted, setMounted] = useState(false);

  const initialDivisions = [
    { name: "INTI", img: "/2.jpg" },
    { name: "EXTERNAL", img: "/5.jpg" },
    { name: "INTERNAL", img: "/7.jpg" },
    { name: "PSSDM", img: "/4.jpg" },
    { name: "RTK", img: "/3.jpg" },
    { name: "MBD", img: "/6.jpg" },
  ];

  const divisions = [
    ...initialDivisions, ...initialDivisions, ...initialDivisions, ...initialDivisions, ...initialDivisions,
  ];
  
  const scrollRef = useRef(null);
  const isTeleporting = useRef(false);

  useEffect(() => {
    setMounted(true);

    // DETEKSI HASH JIKA DATANG DARI HALAMAN LAIR
    if (typeof window !== "undefined" && window.location.hash) {
      // Berikan sedikit delay (100-300ms) agar DOM & CSS Snap selesai me-render layout
      setTimeout(() => {
        const hash = window.location.hash.replace("#", "");
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300); 
    }
  }, []);

  useEffect(() => {
    if (mounted && scrollRef.current) {
      const el = scrollRef.current;
      const oneSetWidth = el.scrollWidth / 5;
      el.scrollLeft = oneSetWidth * 2;
    }
  }, [mounted]);

  const nextSlide = useCallback(() => {
    setCurrentBg((prev) => (prev + 1) % bgImages.length);
  }, [bgImages.length]);

  const prevSlide = () => {
    setCurrentBg((prev) => (prev === 0 ? bgImages.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleInfiniteScroll = () => {
    const el = scrollRef.current;
    if (!el || isTeleporting.current) return;
    const { scrollLeft, scrollWidth, offsetWidth } = el;
    const oneSetWidth = scrollWidth / 5;

    if (scrollLeft < oneSetWidth) {
      isTeleporting.current = true;
      el.style.scrollBehavior = "auto";
      el.scrollLeft = scrollLeft + (oneSetWidth * 2);
      el.style.scrollBehavior = "smooth";
      isTeleporting.current = false;
    } else if (scrollLeft + offsetWidth > oneSetWidth * 4) {
      isTeleporting.current = true;
      el.style.scrollBehavior = "auto";
      el.scrollLeft = scrollLeft - (oneSetWidth * 2);
      el.style.scrollBehavior = "smooth";
      isTeleporting.current = false;
    }
  };

  const scrollCarousel = (direction) => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      const move = direction === "left" ? -350 : 350;
      el.style.scrollBehavior = "smooth";
      el.scrollBy({ left: move });
    }
  };

  const navLinks = [
    { name: "HOME", href: "#hero" },
    { name: "PROFILE", href: "#profile" },
    { name: "DIVISI", href: "#divisi" },
    { name: "PROKER", href: "#proker" },
    { name: "KONTAK", href: "#kontak" },
  ];

  if (!mounted) return <div className="bg-black min-h-screen" />;

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black text-white font-sans selection:bg-orange-400/30 no-scrollbar scroll-smooth">
      
      {/* --- HEADER --- */}
      <Header />

      {/* --- SECTION 1: HERO --- */}
      <section id="hero" className="relative h-screen w-full snap-start overflow-hidden bg-black flex flex-col">
        
        {/* BACKGROUND IMAGES */}
        <div className="absolute inset-0 z-0">
          <div 
            className="flex h-full w-full transition-transform duration-1000 ease-in-out" 
            style={{ 
              // Perbaikan logika: Desktop akan bergeser berdasarkan currentBg * 100
              transform: `translateX(-${typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : currentBg * 100}%)` 
            }}
          >
            {bgImages.map((img, index) => (
              <div 
                key={index} 
                className={`relative min-w-full h-full ${index !== 0 ? "hidden md:block" : "block"}`}
              >
                <Image 
                  src={img} 
                  alt={`Slide ${index}`} 
                  fill 
                  className="object-cover opacity-70" 
                  priority={index === 0} 
                />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP ARROWS (Panah Navigasi) */}
        <div className="absolute inset-y-0 z-30 hidden lg:flex items-center justify-between w-full px-8 pointer-events-none">
          <button 
            onClick={prevSlide} 
            className="pointer-events-auto p-4 rounded-full border border-white/10 bg-black/20 hover:bg-orange-400 hover:text-black transition-all backdrop-blur-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <button 
            onClick={nextSlide} 
            className="pointer-events-auto p-4 rounded-full border border-white/10 bg-black/20 hover:bg-orange-400 hover:text-black transition-all backdrop-blur-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>

        {/* CONTENT (Logo & Text) */}
        {/* Menambahkan lg:pl-24 agar teks bergeser ke kanan dan tidak tertutup arrow kiri */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center lg:items-start lg:justify-end px-6 lg:px-12 lg:pl-24 lg:pb-16">
          
          {/* Logo Mobile diperbesar menjadi w-28 h-28 */}
          <div className="relative w-28 h-28 mb-8 lg:hidden">
              <Image src="/logo-hmsi.png" alt="HMSI Logo" fill className="object-contain" />
          </div>
          
          <div className="text-center lg:text-left pointer-events-none">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter leading-[0.8] text-white uppercase drop-shadow-2xl">
              HMSI <br /> <span className="text-orange-400">UNAND</span>
            </h1>
            <p className="text-zinc-400 font-mono text-[10px] md:text-xs tracking-[0.4em] mt-6 uppercase">
              Universitas Andalas // 2026
            </p>
          </div>
        </div>

        {/* BOTTOM NAVIGATION (Social & Scroll) */}
        {/* Menyesuaikan lg:pl-24 agar sejajar dengan teks di atasnya */}
        <div className="relative z-20 w-full pb-20 lg:pb-12 px-6 lg:px-12 lg:pl-24 space-y-8">
          <div className="flex items-center justify-center gap-6 lg:justify-start">
            {[FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaTiktok].map((Icon, i) => (
              <a key={i} href="#" className="text-white/60 hover:text-orange-400 text-xl transition-all duration-300">
                <Icon />
              </a>
            ))}
          </div>

          <div className="flex flex-col items-center group">
            <div className="flex items-center gap-4 w-full max-w-[280px] lg:max-w-none">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20"></div>
              <span className="text-[9px] tracking-[0.5em] text-white/40 uppercase font-bold group-hover:text-orange-400 transition-colors">SCROLL</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: PROFILE --- */}
      <section id="profile" className="relative min-h-screen w-full snap-start bg-[#050505] flex items-center py-10 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          
          {/* LOGO BOX DESKTOP: Tetap di kiri pada desktop */}
          <div className="hidden lg:flex relative group justify-center items-center">
            <div className="absolute -inset-4 border border-orange-400/10 scale-100 transition-transform duration-700"></div>
            <div className="relative w-[450px] h-[450px]">
              <Image 
                src="/logo-hmsi.png" 
                alt="HMSI" 
                fill 
                className="object-contain transition-transform duration-1000 group-hover:scale-105" 
              />
            </div>
          </div>

          {/* CONTENT COLUMN */}
          <div className="flex flex-col space-y-6 md:space-y-10 text-center lg:text-left">
            
            {/* Header Profile */}
            <div className="space-y-1 md:space-y-2">
              <span className="text-orange-400 font-mono text-[9px] md:text-xs tracking-[0.5em] block">
                PROFILE_DATA // 01
              </span>
              <h3 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                Tentang Kami
              </h3>
            </div>

            {/* LOGO BOX MOBILE: Sekarang berada DI ANTARA Header dan Deskripsi */}
            <div className="relative group flex justify-center lg:hidden py-4">
              <div className="relative w-40 h-40">
                <Image 
                  src="/logo-hmsi.png" 
                  alt="HMSI" 
                  fill 
                  className="object-contain" 
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-white/[0.01] font-black text-6xl italic select-none -z-10">
                ABOUT
              </div>
            </div>

            {/* Deskripsi: Muncul setelah logo pada mobile */}
            <p className="text-zinc-400 leading-relaxed text-sm md:text-lg font-light max-w-2xl mx-auto lg:mx-0">
              HMSI adalah Himpunan Mahasiswa Sistem Informasi yang berada pada jurusan Sistem Informasi yang berfungsi sebagai wadah untuk menyalurkan aspirasi, media komunikasi dan informasi, serta pembelajaran organisasi untuk pengembangan diri bagi anggotanya.
            </p>

            {/* Visi & Misi */}
            <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-10 border-t border-white/5 pt-6 md:pt-8 text-center md:text-left">
              <div className="space-y-2 md:space-y-3">
                <h4 className="text-orange-400 font-bold tracking-[0.2em] text-[10px] md:text-[12px] uppercase">
                  Visi
                </h4>
                <ul className="text-zinc-500 text-[11px] md:text-sm space-y-1">
                  <li>• Mutu Anggota</li>
                  <li>• Persaudaraan</li>
                  <li>• Tridarma Perguruan Tinggi</li>
                </ul>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                <h4 className="text-orange-400 font-bold tracking-[0.2em] text-[10px] md:text-[12px] uppercase">
                  Misi
                </h4>
                <ul className="text-zinc-500 text-[11px] md:text-sm space-y-1">
                  <li>• Aspirasi Mahasiswa</li>
                  <li>• SDM Profesional</li>
                </ul>
              </div>
            </div>

            {/* Tombol Selengkapnya */}
            <div className="pt-2">
              <button className="inline-flex items-center gap-4 text-[10px] md:text-[11px] tracking-[0.4em] font-bold uppercase hover:text-orange-400 transition-all group mx-auto lg:mx-0">
                Selengkapnya 
                <div className="w-10 md:w-16 h-px bg-white/20 group-hover:bg-orange-400 transition-all"></div>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION 3: DIVISI --- */}
      <section id="divisi" className="relative h-screen w-full bg-zinc-950 flex flex-col justify-center snap-start flex-shrink-0 overflow-hidden">
        <div className="absolute top-28 md:top-24 left-6 md:left-12 z-0 pointer-events-none select-none">
          <p className="text-orange-400 tracking-[0.5em] md:tracking-[1em] text-[8px] md:text-xs font-bold mt-2 uppercase">Division</p>
        </div>

        <div className="relative w-full z-10">
          {/* Arrow Carousel (PC Only) */}
          <div className="hidden md:block">
            <button onClick={() => scrollCarousel("left")} className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border border-white/10 bg-black/50 hover:bg-orange-400 hover:text-black transition-all backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <button onClick={() => scrollCarousel("right")} className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border border-white/10 bg-black/50 hover:bg-orange-400 hover:text-black transition-all backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>

          <div ref={scrollRef} onScroll={handleInfiniteScroll} className="flex overflow-x-auto h-[50vh] md:h-[65vh] items-center px-[5vw] md:px-[35vw] gap-4 md:gap-8 no-scrollbar snap-x snap-mandatory">
            {divisions.map((item, idx) => (
              <div key={idx} className="snap-center shrink-0 w-[80vw] sm:w-[350px] md:w-[450px] group transition-all duration-500">
                
                {/* PEMBUNGKUS LINK: Diarahkan dinamis berdasarkan nama divisi (misal: /divisi/pssdm) */}
                <Link href={`/divisi/${item.name.toLowerCase()}`} className="block cursor-pointer">
                  
                  <div className="relative aspect-square w-full bg-[#111] border border-white/5 overflow-hidden card-focus-effect transition-transform duration-500 hover:scale-105 group-hover:border-orange-400/30">
                    
                    <div className="absolute inset-4 md:inset-8 border border-white/5 bg-[#0a0a0a]">
                      <Image 
                        src={item.img} 
                        alt={item.name} 
                        fill 
                        className="object-contain p-4 transition-all duration-700" 
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
                      <span className="text-orange-400 font-mono text-[8px] md:text-[9px] tracking-[0.3em] block mb-1 md:mb-2 opacity-60 uppercase">
                        Unit_Dept // 0{(idx % initialDivisions.length) + 1}
                      </span>
                      <h3 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic text-white transition-colors duration-300 group-hover:text-orange-400 leading-none">
                        {item.name}
                      </h3>
                    </div>

                  </div>

                </Link>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />

      <style jsx>{`
        .vertical-text { writing-mode: vertical-rl; }
        ::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @supports (view-timeline: --v) {
          div[class*="snap-center"] {
            view-timeline-name: --item;
            view-timeline-axis: inline;
          }
          .card-focus-effect {
            animation: focus-card both linear;
            animation-timeline: --item;
            animation-range: entry 25% cover 50% exit 75%;
          }
        }
        @keyframes focus-card {
          50% { scale: 1.1; md:scale: 1.15; filter: grayscale(0); border-color: rgba(251, 146, 60, 0.4); }
        }
        .card-focus-effect {
          scale: 0.9;
          filter: grayscale(1);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}