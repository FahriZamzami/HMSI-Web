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
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isCheckingPeriode, setIsCheckingPeriode] = useState(true);
  const [hasPeriodeImage, setHasPeriodeImage] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [activePeriode, setActivePeriode] = useState<any>(null);

  const [fetchedDivisions, setFetchedDivisions] = useState<any[]>([]);
  const [dynamicBgImages, setDynamicBgImages] = useState<string[]>(bgImages);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const selectedGalleryItem = selectedGalleryIndex !== null ? galleryItems[selectedGalleryIndex] : null;

  const [saranText, setSaranText] = useState("");
  const [saranFile, setSaranFile] = useState<File | null>(null);
  const [isSubmittingSaran, setIsSubmittingSaran] = useState(false);
  const [saranSuccess, setSaranSuccess] = useState("");

  const initialDivisions = [
    { name: "INTI", img: "/2.jpg", id: "" },
    { name: "EXTERNAL", img: "/5.jpg", id: "" },
    { name: "INTERNAL", img: "/7.jpg", id: "" },
    { name: "PSSDM", img: "/4.jpg", id: "" },
    { name: "RTK", img: "/3.jpg", id: "" },
    { name: "MBD", img: "/6.jpg", id: "" },
  ];

  const baseDivisions = fetchedDivisions.length > 0
    ? fetchedDivisions.map(d => ({ id: d.divisiId, name: d.divisiName, img: d.gambarDivisi ? `/uploads/${d.gambarDivisi}` : null }))
    : initialDivisions;

  const divisions = [
    ...baseDivisions, ...baseDivisions, ...baseDivisions, ...baseDivisions, ...baseDivisions,
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
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

    // Fetch Active Periode Divisi
    const fetchActivePeriode = async () => {
      try {
        const res = await fetch("/api/public", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_active_periode_data" })
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setActivePeriode(data.data);
          if (data.data.divisi) {
            setFetchedDivisions(data.data.divisi);
          }

          const bgs: string[] = [];
          if (data.data.gambarPeriode) {
            setHasPeriodeImage(true);
            bgs.push(`/uploads/${data.data.gambarPeriode}`);
          } else {
            setHasPeriodeImage(false);
          }
          if (data.data.divisi) {
            data.data.divisi.forEach((d: any) => {
              if (d.gambarDivisi) {
                bgs.push(`/uploads/${d.gambarDivisi}`);
              }
            });
          }

          if (bgs.length > 0) {
            setDynamicBgImages(bgs);
          } else {
            setDynamicBgImages([]);
          }

        } else if (res.ok && data.data === null) {
          setIsMaintenance(true);
        }
      } catch (error) {
        console.error("Gagal mengecek periode aktif", error);
      } finally {
        setIsCheckingPeriode(false);
      }
    };

    const fetchAllGallery = async () => {
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
      }
    };

    fetchActivePeriode();
    fetchAllGallery();
  }, []);

  useEffect(() => {
    const updateMobileState = () => setIsMobileDevice(typeof window !== "undefined" && window.innerWidth < 768);
    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  const handleSubmitSaran = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saranText) return;
    setIsSubmittingSaran(true);
    setSaranSuccess("");

    try {
      const formData = new FormData();
      formData.append("action", "submit_saran");
      formData.append("saran", saranText);
      if (saranFile) {
        formData.append("file", saranFile);
      }

      const res = await fetch("/api/public", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");

      setSaranSuccess("Terima kasih, saran Anda telah terkirim!");
      setSaranText("");
      setSaranFile(null);
      setTimeout(() => setSaranSuccess(""), 5000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmittingSaran(false);
    }
  };

  useEffect(() => {
    if (mounted && scrollRef.current && baseDivisions.length > 0) {
      setTimeout(() => {
        const el = scrollRef.current;
        if (!el) return;
        const middleStartIndex = baseDivisions.length * 2;
        const targetChild = el.children[middleStartIndex] as HTMLElement;
        if (targetChild) {
          // Scroll targetChild into center of el
          const scrollPos = targetChild.offsetLeft - el.clientWidth / 2 + targetChild.clientWidth / 2;
          el.scrollLeft = scrollPos;
        }
      }, 100);
    }
  }, [mounted, fetchedDivisions, baseDivisions.length]);

  const nextSlide = useCallback(() => {
    setCurrentBg((prev) => (prev + 1) % dynamicBgImages.length);
  }, [dynamicBgImages.length]);

  const prevSlide = () => {
    setCurrentBg((prev) => (prev === 0 ? dynamicBgImages.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleInfiniteScroll = () => {
    const el = scrollRef.current as HTMLElement | null;
    if (!el || isTeleporting.current) return;
    const N = baseDivisions.length;
    if (N === 0 || el.children.length <= N * 2) return;

    // Width of one full set of cards (N cards)
    const firstChild = el.children[0] as HTMLElement;
    const nthChild = el.children[N] as HTMLElement;
    const oneSetWidth = nthChild.offsetLeft - firstChild.offsetLeft;

    const { scrollLeft, offsetWidth } = el;

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

  const scrollCarousel = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      const move = direction === "left" ? -350 : 350;
      el.style.scrollBehavior = "smooth";
      el.scrollBy({ left: move });
    }
  };

  const navLinks = [
    { name: "HOME", href: "#home" },
    { name: "PROFILE", href: "#profile" },
    { name: "DIVISI", href: "#divisi" },
    { name: "PROKER", href: "#proker" },
    { name: "KONTAK", href: "#kontak" },
  ];

  if (!mounted) return <div className="bg-black min-h-screen" />;

  if (isCheckingPeriode) {
    return <div className="h-screen bg-black flex items-center justify-center text-white font-mono text-sm tracking-widest uppercase">Initializing System...</div>;
  }

  if (isMaintenance) {
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6 text-center space-y-6 selection:bg-orange-400/30 relative overflow-hidden">
        {/* Watermark Background */}
        <div className="absolute inset-y-0 flex items-center justify-center text-white/[0.02] text-[10rem] md:text-[15rem] font-black italic select-none pointer-events-none z-0 tracking-tighter uppercase whitespace-nowrap">
          MAINTENANCE
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl">
          <div className="text-orange-500 font-mono text-xs md:text-sm tracking-[0.5em] uppercase border border-orange-500/30 px-6 py-2 rounded-full bg-orange-500/10 mb-6 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            System in Maintenance
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase drop-shadow-2xl mb-6 leading-none">
            We'll Be <br className="md:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Right Back</span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-light px-4">
            Himpunan Mahasiswa Sistem Informasi sedang dalam masa peralihan periode atau pembaharuan sistem. Silakan kembali lagi nanti untuk melihat kepengurusan yang baru.
          </p>
          <div className="flex items-center gap-4 mt-12 w-full justify-center opacity-50">
            <div className="h-px bg-gradient-to-r from-transparent to-orange-500/50 w-24"></div>
            <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-orange-400/80">STANDBY_MODE</span>
            <div className="h-px bg-gradient-to-l from-transparent to-orange-500/50 w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black text-white font-sans selection:bg-orange-400/30 no-scrollbar scroll-smooth">

      {/* --- HEADER --- */}
      <Header />

      {/* --- SECTION 1: HERO --- */}
      <section id="home" className="relative h-screen w-full snap-start overflow-hidden bg-black flex flex-col">

        {/* BACKGROUND IMAGES */}
        <div className="absolute inset-0 z-0">
          {hasPeriodeImage && dynamicBgImages.length > 0 && !isMobileDevice ? (
            <div
              className="flex h-full w-full transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(-${isMobileDevice ? 0 : currentBg * 100}%)`
              }}
            >
              {dynamicBgImages.map((img, index) => (
                <div
                  key={index}
                  className={`relative min-w-full h-full ${index !== 0 ? "hidden md:block" : "block"}`}
                >
                  <Image
                    src={img}
                    alt={`Slide ${index}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover opacity-70"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 bg-[#050505]" />
          )}
          {(!hasPeriodeImage || isMobileDevice) && (
            <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          )}
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
            <Image src="/logo-hmsi.png" alt="HMSI Logo" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain" />
          </div>

          <div className="text-center lg:text-left pointer-events-none">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter leading-[0.8] text-white uppercase drop-shadow-2xl">
              HMSI <br /> <span className="text-orange-400">UNAND</span>
            </h1>
            <p className="text-zinc-400 font-mono text-[10px] md:text-xs tracking-[0.4em] mt-6 uppercase">
              Universitas Andalas // {activePeriode?.periode || 'PERIODE'}
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
        {/* Grid background for Profile/About section */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">

          {/* LOGO BOX DESKTOP */}
          <div className="hidden lg:flex relative group justify-center items-center w-full h-[500px]">
            {/* Glassmorphism card back */}
            <div className="absolute inset-4 bg-white/5 backdrop-blur-md rounded-[50px] border border-white/10 transition-all duration-700 shadow-[0_0_40px_rgba(0,0,0,0.5)]" />
            
            {/* Logo */}
            <div className="relative w-[380px] h-[380px] drop-shadow-2xl transition-transform duration-1000 group-hover:scale-110 group-hover:-translate-y-4">
              <Image
                src="/logo-hmsi.png"
                alt="HMSI"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
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

            {/* LOGO BOX MOBILE */}
            <div className="relative group flex justify-center lg:hidden py-8">
              {/* Glassmorphism card back */}
              <div className="absolute inset-4 bg-white/5 backdrop-blur-md rounded-[30px] border border-white/10" />

              <div className="relative w-48 h-48 drop-shadow-2xl">
                <Image
                  src="/logo-hmsi.png"
                  alt="HMSI"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-white/[0.02] font-black text-6xl italic select-none pointer-events-none -z-10">
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
              <Link href="/tentang" className="inline-flex items-center gap-4 text-[10px] md:text-[11px] tracking-[0.4em] font-bold uppercase hover:text-orange-400 transition-all group mx-auto lg:mx-0">
                Selengkapnya
                <div className="w-10 md:w-16 h-px bg-white/20 group-hover:bg-orange-400 transition-all"></div>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION 3: DIVISI --- */}
      <section id="divisi" className="relative h-screen w-full bg-zinc-950 flex flex-col justify-center snap-start flex-shrink-0 overflow-hidden">
        {/* Grid background for Division carousel area */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
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

                {/* PEMBUNGKUS LINK: Diarahkan dinamis berdasarkan ID atau nama divisi */}
                <Link href={item.id ? `/divisi/${item.id}` : `/divisi/${item.name.toLowerCase()}`} className="block cursor-pointer">

                  <div className="relative aspect-square w-full bg-[#111] border border-white/5 overflow-hidden card-focus-effect transition-transform duration-500 hover:scale-105 group-hover:border-orange-400/30">

                    <div className="absolute inset-4 md:inset-8 border border-white/5 bg-[#0a0a0a]">
                      {item.img ? (
                        <Image
                          src={item.img}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain p-4 transition-all duration-700"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-700 transition-all duration-700">
                          <span className="text-sm font-bold uppercase tracking-[0.3em]">No Image</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>

                    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
                      <span className="text-orange-400 font-mono text-[8px] md:text-[9px] tracking-[0.3em] block mb-1 md:mb-2 opacity-60 uppercase">
                        Unit_Dept // 0{(idx % baseDivisions.length) + 1}
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

      {/* --- SECTION 4: GALLERY --- */}
      <section id="gallery" className="relative w-full h-screen bg-[#050505] flex flex-col items-center justify-center snap-start border-t border-white/5 selection:bg-orange-400/20 px-4 md:px-12 overflow-hidden pt-16 md:pt-20 pb-4">
        {/* Ornamen Background mirip Arknights (Dark Version) */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="flex flex-col w-full h-full max-w-[1200px] justify-center relative z-10">
          
          {/* Header */}
          <div className="text-center space-y-1 mb-4 md:mb-6">
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Gallery
            </h2>
            <div className="flex justify-center items-center gap-2 md:gap-4">
              <div className="h-px w-12 md:w-16 bg-white/20"></div>
              <span className="text-orange-400 font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase drop-shadow-md">MOMENTS</span>
              <div className="h-px w-12 md:w-16 bg-white/20"></div>
            </div>
          </div>

          {/* Grid Gallery */}
          {galleryItems.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 w-full">
              {galleryItems.slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-video bg-[#0a0a0a] overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.2)] transition-all duration-300 border border-white/10 hover:border-orange-400/50"
                  onClick={() => setSelectedGalleryIndex(idx)}
                >
                  <Image src={item.img} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />

                  {/* Title banner at bottom */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/90 backdrop-blur-md p-2 translate-y-0 border-t border-white/10 group-hover:border-orange-400/50 transition-colors duration-300">
                    <h3 className="text-white group-hover:text-orange-400 transition-colors font-bold text-[8px] md:text-xs tracking-wide truncate uppercase">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-white">
              <span className="text-2xl md:text-3xl font-bold uppercase tracking-widest opacity-20 text-zinc-500">No Pictures Yet</span>
            </div>
          )}

          {/* See More Button */}
          {galleryItems.length > 0 && (
            <div className="mt-4 md:mt-6 flex justify-center">
              <Link href="/gallery" className="px-6 py-2 md:px-8 md:py-3 border border-orange-400 text-orange-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] hover:bg-orange-400 hover:text-black transition-colors duration-300">
                See More
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* GALLERY MODAL (Instagram Style) */}
      {selectedGalleryItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 backdrop-blur-sm" onClick={() => setSelectedGalleryIndex(null)}>
          <button
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors z-[110] p-2"
            onClick={(e) => { e.stopPropagation(); setSelectedGalleryIndex(null); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
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
            <div className={`relative bg-black flex items-center justify-center ${selectedGalleryItem.type === 'post' ? 'md:w-[65%]' : 'w-full'} h-[40vh] md:h-[85vh]`}>
              <Image
                src={selectedGalleryItem.img}
                alt={selectedGalleryItem.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Sisi Kanan: Deskripsi (Hanya untuk Post) */}
            {selectedGalleryItem.type === 'post' && (
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
                    <span className="font-bold text-white block uppercase text-sm mb-1">{selectedGalleryItem.title}</span>
                    <span className="whitespace-pre-wrap leading-relaxed block text-zinc-400 mt-2">{selectedGalleryItem.description}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SECTION 5: KRITIK & SARAN --- */}
      <section id="saran" className="relative min-h-screen w-full bg-[#030303] flex flex-col items-center justify-center py-16 px-6 md:px-12 border-t border-white/5 snap-start selection:bg-orange-400/20">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-400/5 rounded-full blur-[100px] mix-blend-screen -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] mix-blend-screen translate-y-1/3 -translate-x-1/2"></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="relative z-10 w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Kiri: Judul & Deskripsi */}
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-orange-400 font-mono text-[10px] md:text-xs tracking-[0.5em] block uppercase">VOICE_OF_ASPIRATION</span>
              <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white drop-shadow-md leading-[0.9]">
                Kritik<br />&amp; Saran
              </h2>
            </div>
            <div className="h-px w-16 bg-orange-400/50"></div>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm">
              Berikan masukan, kritik, atau saran Anda secara <strong className="text-white">anonim</strong> untuk membangun HMSI yang lebih baik. Identitas Anda sepenuhnya terlindungi.
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-600 font-mono">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              ANONYMOUS // SECURE
            </div>
          </div>

          {/* Kanan: Form */}
          <div className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 shadow-2xl space-y-5">
            {saranSuccess && (
              <div className="p-3 bg-orange-400/10 border border-orange-400/50 text-orange-400 text-sm text-center">
                {saranSuccess}
              </div>
            )}

            <form onSubmit={handleSubmitSaran} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Pesan Anda</label>
                <textarea
                  rows={4}
                  required
                  value={saranText}
                  onChange={(e) => setSaranText(e.target.value)}
                  placeholder="Tuliskan kritik dan saran Anda di sini..."
                  className="w-full bg-[#111] border border-white/10 p-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-orange-400/50 transition-colors resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Lampiran Gambar (Opsional)</label>
                {!saranFile ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setSaranFile(e.target.files[0]);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full bg-[#111] border border-white/10 text-white/30 border-dashed p-4 flex flex-col items-center justify-center transition-colors hover:border-orange-400/50 hover:text-orange-400">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <span className="text-[10px] md:text-xs font-mono tracking-wider truncate">
                        Klik atau seret gambar ke sini
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full max-h-[200px] rounded-md overflow-hidden border border-white/10 group bg-black">
                    <img 
                      src={URL.createObjectURL(saranFile)} 
                      alt="Preview" 
                      className="w-full h-full max-h-[200px] object-contain"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={() => setSaranFile(null)}
                        className="bg-red-500/80 hover:bg-red-500 text-white p-3 rounded-full transition-all hover:scale-110 flex items-center justify-center"
                        title="Hapus Lampiran"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {/* Nama File */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-2 pointer-events-none">
                      <p className="text-[10px] font-mono text-white/70 truncate text-center">{saranFile.name}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingSaran}
                  className="w-full bg-white text-black font-bold uppercase tracking-[0.2em] py-3 hover:bg-orange-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden text-sm"
                >
                  <span className="relative z-10">{isSubmittingSaran ? "MENGIRIM..." : "KIRIM SARAN"}</span>
                  <div className="absolute inset-0 bg-orange-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </div>
            </form>
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
          50% { scale: 1.1; md:scale: 1.15; border-color: rgba(251, 146, 60, 0.4); }
        }
        .card-focus-effect {
          scale: 0.9;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}