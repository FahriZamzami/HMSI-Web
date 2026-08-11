"use client";

import Image from "next/image";
import { useState, useEffect, use } from "react";
import Footer from "@/components/footer/footer";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function PublicDivisiPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [isLoading, setIsLoading] = useState(true);
    const [divisiData, setDivisiData] = useState<any>(null);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [activeProker, setActiveProker] = useState<any>(null);

    // Hierarki jabatan untuk pengurutan (dari tertinggi ke terendah)
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
        const raw = (p?.jabatan || p?.posisi || p?.role || p?.title || p?.pengurusRole || p?.pengurusJabatan || "").toString().toLowerCase();
        const clean = raw.replace(/[._\-]/g, " ").replace(/\s+/g, " ").trim();

        const map: { [k: string]: string } = {
            ketua: "ketua himpunan",
            "ketua himpunan": "ketua himpunan",
            chair: "ketua himpunan",
            wakil: "wakil ketua himpunan",
            "wakil ketua": "wakil ketua himpunan",
            "wakil ketua himpunan": "wakil ketua himpunan",
            sekum: "sekretaris umum",
            "sekretaris umum": "sekretaris umum",
            sekretaris: "sekretaris umum",
            bendahara: "bendahara umum",
            "bendahara umum": "bendahara umum",
            "kepala divisi": "kepala divisi",
            kepala: "kepala divisi",
            "sekretaris divisi": "sekretaris divisi",
            "bendahara divisi": "bendahara divisi",
            "sekretaris bendahara divisi": "sekretaris bendahara divisi",
            staf: "staf divisi",
            "staf divisi": "staf divisi"
        };

        if (map[clean]) return map[clean];
        for (const k of Object.keys(map)) {
            if (clean.includes(k)) return map[k];
        }
        return clean;
    };

    const sortPengurus = (list: any[] = []) => {
        if (!Array.isArray(list)) return [];
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

    useEffect(() => {
        const fetchDivisi = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("/api/public", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "get_divisi_detail", payload: { divisiId: id } })
                });
                const data = await res.json();
                
                if (res.ok && data.data) {
                    // sort pengurus berdasarkan hirarki sebelum menyimpan
                    const sorted = sortPengurus(data.data.pengurus || []);
                    const payload = { ...data.data, pengurus: sorted };
                    setDivisiData(payload);
                    if (sorted && sorted.length > 0) {
                        setSelectedMember(sorted[0]);
                    }
                    if (data.data.proker && data.data.proker.length > 0) {
                        setActiveProker(data.data.proker[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch divisi detail", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchDivisi();
        }
    }, [id]);

    if (isLoading) {
        return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    }

    if (!divisiData) {
        return (
            <div className="h-screen bg-black flex flex-col items-center justify-center text-white">
                <h1 className="text-3xl font-bold mb-4">Divisi Tidak Ditemukan</h1>
                <Link href="/" className="text-orange-400 hover:underline">Kembali ke Beranda</Link>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black text-white font-sans selection:bg-orange-400/30 no-scrollbar scroll-smooth">

        {/* Tombol Kembali (Opsional, melayang) */}
        <Link href="/#divisi" className="fixed top-10 left-8 z-50 inline-flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition-colors group">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-sm uppercase tracking-widest hidden md:inline-block">Back</span>
        </Link>

        {/* Logo removed from fixed position; will be placed per-section */}

        {/* --- SECTION 1: HERO DIVISI --- */}
        <section id="hero-divisi" className="relative h-screen w-full snap-start overflow-hidden bg-black flex flex-col">
            {/* Background Grid untuk Mobile */}
            <div className="absolute inset-0 pointer-events-none z-0 md:hidden" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Background Image Statis (Desktop Only) */}
            <div className="absolute inset-0 z-0 hidden md:block">
            {divisiData.gambarDivisi ? (
                <Image 
                    src={`/uploads/${divisiData.gambarDivisi}`} 
                    alt={divisiData.divisiName} 
                    fill 
                    className="object-cover" 
                    priority 
                />
            ) : (
                <div className="absolute inset-0 bg-[#050505]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70"></div>
            </div>

            {/* Konten Teks Utama */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center lg:items-start lg:justify-end px-6 lg:px-12 lg:pl-24 lg:pb-24">
            <div className="text-center lg:text-left max-w-4xl">
                <span className="text-orange-400 font-mono text-[10px] md:text-xs tracking-[0.5em] block mb-4">
                DIVISION_PROFILE // {divisiData.periode?.periode}
                </span>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter leading-[0.8] text-white uppercase drop-shadow-2xl">
                {divisiData.divisiName}
                </h1>
            </div>
            </div>

            {/* Garis Aksen Bawah */}
            <div className="relative z-20 w-full pb-12 px-6 lg:px-12 lg:pl-24">
            <div className="flex items-center gap-4 w-full">
                <span className="text-[9px] tracking-[0.5em] text-orange-400/60 uppercase font-bold">
                SCROLl
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-orange-400/20 to-transparent"></div>
            </div>
            </div>

            {/* Section-specific logo (bottom-right) */}
            <div className="absolute bottom-6 right-6 z-20 pointer-events-none opacity-50 hidden md:block mix-blend-screen">
                <Image src="/logo-hmsi.png" alt="HMSI Logo" width={60} height={60} className="object-contain filter grayscale transition-all duration-500" />
            </div>
        </section>

        {/* --- SECTION 1.5: TENTANG DIVISI --- */}
        <section id="tentang" className="relative min-h-[50vh] w-full snap-start bg-[#0a0a0a] flex flex-col items-center justify-center py-24 overflow-hidden border-t border-white/5">
                    {/* Grid background for about section */}
                    <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                    <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10 space-y-8 md:space-y-12">
                <div className="space-y-2">
                    <span className="text-orange-400 font-mono text-[10px] md:text-xs tracking-[0.5em] block uppercase">
                        ABOUT // {divisiData.divisiName}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white">
                        Tentang Divisi
                    </h2>
                </div>
                
                <div className="relative inline-block text-left md:text-center">
                    {/* Ornamen kutipan */}
                    <div className="absolute -top-8 -left-4 md:-top-12 md:-left-8 text-7xl md:text-9xl text-white/5 font-serif leading-none select-none pointer-events-none">"</div>
                    
                    <p className="text-sm md:text-base lg:text-lg text-neutral-300 font-mono leading-relaxed lg:leading-loose max-w-3xl whitespace-pre-wrap relative z-10">
                        {divisiData.tentangDivisi || "Deskripsi divisi belum tersedia."}
                    </p>
                    
                    <div className="absolute -bottom-16 -right-4 md:-bottom-24 md:-right-8 text-7xl md:text-9xl text-white/5 font-serif leading-none select-none pointer-events-none rotate-180">"</div>
                </div>
            </div>

            {/* Section-specific logo (bottom-right) */}
            <div className="absolute bottom-6 right-6 z-20 pointer-events-none opacity-50 hidden md:block mix-blend-screen">
                <Image src="/logo-hmsi.png" alt="HMSI Logo" width={50} height={50} className="object-contain filter grayscale transition-all duration-500" />
            </div>
        </section>

        {/* --- SECTION 2: PENGURUS DIVISI (Immersive Character Focus UI) --- */}
        <section id="anggota" className="relative min-h-[100dvh] lg:h-screen w-full snap-start bg-[#050505] flex items-center justify-center py-16 md:py-12 overflow-hidden border-t border-white/5 selection:bg-orange-400/20">
            
            {/* WATERMARK BACKGROUND */}
            <div className="absolute inset-y-0 left-12 flex items-center text-white/[0.01] text-[15rem] font-black italic select-none pointer-events-none z-0 tracking-tighter uppercase whitespace-nowrap">
                {divisiData.divisiName}
            </div>

            {/* Grid background for Pengurus section */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-[1650px] mx-auto w-full h-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                
                {/* ================= SISI KIRI (3 Kolom): Informasi & Detail Teks ================= */}
                <div className="lg:col-span-3 flex flex-col justify-center text-center lg:text-left space-y-3 lg:space-y-4 order-2 lg:order-1 self-center mt-2 lg:mt-0">
                    
                    <div className="flex items-center justify-center lg:justify-start gap-3 pt-1">
                        <div className="w-3 h-3 border border-orange-400/50 rotate-45 flex items-center justify-center">
                            <div className="w-1 h-1 bg-orange-400"></div>
                        </div>
                        <div className="h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent flex-1 hidden lg:block"></div>
                    </div>

                    <div className="space-y-2">
                        {/* Nama Pengurus Terpilih */}
                        <h2 className={`font-bold text-white leading-none tracking-tight uppercase [text-shadow:0_10px_30px_rgba(0,0,0,0.8)] break-words w-full ${
                            selectedMember?.pengurusName?.length > 25 ? "text-2xl md:text-3xl lg:text-4xl" :
                            selectedMember?.pengurusName?.length > 15 ? "text-3xl md:text-4xl lg:text-5xl" :
                            "text-4xl md:text-5xl lg:text-7xl"
                        }`}>
                            {selectedMember ? selectedMember.pengurusName : "Belum Ada Pengurus"}
                        </h2>

                        {/* Nomor Himpunan */}
                        <p className="text-zinc-400 font-mono text-xs md:text-sm tracking-widest pt-2">
                            {selectedMember ? selectedMember.nomorAnggota : ""}
                        </p>

                        {/* Jabatan / Role */}
                        <p className="text-orange-400 font-mono text-xs md:text-sm tracking-[0.2em] uppercase font-bold pt-1">
                            {selectedMember ? selectedMember.role.replace(/_/g, " ") : "N/A"}
                        </p>
                    </div>

                    {/* Ornamen Pemisah */}
                    <div className="flex items-center justify-center lg:justify-start gap-3 pt-1">
                        <div className="w-3 h-3 border border-orange-400/50 rotate-45 flex items-center justify-center">
                            <div className="w-1 h-1 bg-orange-400"></div>
                        </div>
                        <div className="h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent flex-1 hidden lg:block"></div>
                    </div>
                    
                </div>

                {/* ================= TENGAH (5 Kolom): Artwork / Frame Foto Diperbesar & Bingkai Dinamis ================= */}
                <div className="lg:col-span-5 flex items-center justify-center h-full relative order-1 lg:order-2 py-2 lg:py-0 self-center">
                    
                    {/* KONTANER UTAMA */}
                    <div className="relative w-48 h-[280px] sm:w-64 sm:h-[380px] md:w-88 md:h-[540px] lg:w-[410px] lg:h-[610px] filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)] group/artwork mx-auto">
                        
                        {/* BINGKAI DINAMIS */}
                        <div className="absolute -inset-4 border-2 border-white/10 opacity-70 pointer-events-none z-0 transition-colors duration-500 group-hover/artwork:border-orange-400/30">
                            {/* Siku Ornamen Pojok Taktis */}
                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-orange-400"></div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-orange-400"></div>
                        </div>

                        {/* Elemen Frame Image Utama */}
                        <div className="relative w-full h-full overflow-hidden z-10 border border-white/5 bg-zinc-900">
                            {selectedMember?.gambarPengurus ? (
                                <Image 
                                    src={`/uploads/${selectedMember.gambarPengurus}`} 
                                    alt={selectedMember.pengurusName}
                                    fill
                                    unoptimized
                                    quality={100}
                                    className="object-cover object-top opacity-80 transition-all duration-700 ease-out scale-[1.01] group-hover/artwork:scale-[1.03]"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                                    <span className="text-sm">Tidak ada foto</span>
                                </div>
                            )}
                            {/* Mempertebal lapisan gradasi gelap di bagian bawah gambar */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-80"></div>
                        </div>

                    </div>
                    
                </div>

                {/* ================= SISI KANAN (4 Kolom): Grid Diperbesar (Keseimbangan Ruang Vertikal) ================= */}
                <div className="lg:col-span-4 flex flex-col justify-center order-3 h-full self-center items-center lg:items-end">
                    
                    {/* Melebarkan batas max-w dari 240px ke 320px agar item grid membesar proporsional */}
                    <div className="w-full max-w-[280px] lg:max-w-[320px]">
                        
                        {/* Mini Header Selector */}
                        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
                            <div className="text-left">
                                <span className="text-[9px] font-mono tracking-[0.3em] text-orange-400 block">SELECT_</span>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">PENGURUS {divisiData.divisiName}</h4>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-600">
                                    {selectedMember ? String((divisiData.pengurus.findIndex((p: any) => p.pengurusId === selectedMember.pengurusId) + 1)).padStart(2, '0') : "00"} / {String(divisiData.pengurus?.length || 0).padStart(2, '0')}
                                </span>
                        </div>

                        {/* Grid List Thumbnails - Diperbesar dengan gap-3 dan max-h dinaikkan agar ruang atas bawah seimbang */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-2 gap-2 sm:gap-3 overflow-y-auto max-h-[160px] sm:max-h-[220px] lg:max-h-[560px] pr-1 no-scrollbar justify-center">
                            {divisiData.pengurus?.map((member: any) => {
                                const isActive = selectedMember?.pengurusId === member.pengurusId;
                                return (
                                    <button
                                        key={member.pengurusId}
                                        onClick={() => setSelectedMember(member)}
                                        className={`relative w-full aspect-square border transition-all duration-300 group overflow-hidden rounded-sm bg-zinc-900 ${
                                            isActive 
                                                ? "border-orange-400 bg-orange-400/5 ring-1 ring-orange-400/20 scale-[0.96]" 
                                                : "border-white/5 bg-zinc-950/90 hover:border-white/20"
                                        }`}
                                    >
                                        {/* Gambar Mini List */}
                                        <div className="absolute inset-0 w-full h-full">
                                            {member.gambarPengurus ? (
                                                <Image  
                                                    src={`/uploads/${member.gambarPengurus}`}  
                                                    alt={member.pengurusName}  
                                                    fill  
                                                    sizes="(max-width: 150px) 100vw"
                                                    className={`object-cover object-top transition-all duration-500 group-hover:scale-105 ${
                                                        isActive ? "grayscale-0 opacity-100" : "grayscale opacity-45 group-hover:opacity-90 group-hover:grayscale-0"
                                                    }`}
                                                />
                                            ) : (
                                                <div className={`w-full h-full bg-zinc-800 flex items-center justify-center transition-all ${isActive ? "opacity-100" : "opacity-45 group-hover:opacity-90"}`}>
                                                    <span className="text-[10px] text-zinc-500 font-mono font-bold">NO IMG</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Garis Aktif */}
                                        {isActive && (
                                            <div className="absolute left-0 top-0 w-1 h-full bg-orange-400 z-20"></div>
                                        )}

                                        {/* Menggunakan multi-stop gradient (transparent -> black/40 -> black/80 -> black) */}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-12 pb-3 px-2.5 text-left z-10 pointer-events-none flex flex-col justify-end min-h-[60%]">
                                            
                                            {/* Menampilkan nama lengkap, teks membungkus rapi, tanpa split */}
                                            <p className="text-[10px] lg:text-[11px] font-bold text-white uppercase tracking-tight leading-tight break-words line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                                {member.pengurusName}
                                            </p>
                                            
                                            {/* Menampilkan jabatan lengkap, tanpa split */}
                                            <p className="text-[7.5px] lg:text-[8px] font-mono text-zinc-400 uppercase tracking-tighter mt-1 leading-tight break-words drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                                {member.role.replace(/_/g, " ")}
                                            </p>
                                            
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>

            </div>

            {/* Section-specific logo (bottom-right) */}
            <div className="absolute bottom-6 right-6 z-20 pointer-events-none opacity-50 hidden md:block mix-blend-screen">
                <Image src="/logo-hmsi.png" alt="HMSI Logo" width={50} height={50} className="object-contain filter grayscale transition-all duration-500" />
            </div>
        </section>

        {/* --- SECTION 3: PROGRAM KERJA (Arknights Inspired Split UI) --- */}
        <section id="proker" className="relative min-h-[100dvh] lg:h-screen w-full snap-start bg-[#050505] flex items-center justify-center py-16 md:py-12 overflow-hidden border-t border-white/5 selection:bg-orange-400/20">
            
            {/* WATERMARK BACKGROUND */}
            <div className="absolute inset-y-0 right-12 flex items-center text-white/[0.01] text-[12rem] font-black italic select-none pointer-events-none z-0 tracking-tighter uppercase">
                PROJECTS
            </div>

            {/* Grid background for Proker section */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-[1650px] mx-auto w-full h-full px-6 md:px-12 flex flex-col justify-center space-y-6 lg:space-y-8 relative z-10 mt-4 lg:mt-0">
                
                {/* Section Header */}
                <div className="text-center lg:text-left space-y-1">
                    <span className="text-orange-400 font-mono text-[9px] md:text-xs tracking-[0.5em] block uppercase">
                        {divisiData.divisiName} // PROJECT_LIST
                    </span>
                    <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                        Program Kerja
                    </h3>
                </div>

                {/* MAIN LAYOUT SPLIT BOX */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 w-full items-stretch">
                    
                    {/* ================= SISI KIRI (7 Kolom): Display Deskripsi & Detail Proker Aktif ================= */}
                    <div className="hidden lg:flex lg:col-span-7 bg-[#0a0a0a] border border-white/10 p-5 md:p-10 flex-col justify-between relative overflow-hidden group min-h-[250px] sm:min-h-[300px] lg:min-h-[500px]">
                        
                        {/* Ornamen Garis Pojok Khas Arknights */}
                        <div className="absolute top-0 left-0 w-2 h-full bg-orange-400"></div>
                        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-20">
                            <div className="w-1 h-4 bg-white"></div>
                            <div className="w-2 h-2 bg-white"></div>
                        </div>

                        {/* Konten Utama Detail */}
                        <div className="space-y-4 lg:space-y-6">
                            <div className="space-y-2">
                                {/* ID & Kategori Proker */}
                                <div className="flex items-center gap-3">
                                    <span className="text-orange-400 font-mono text-xs md:text-sm tracking-widest font-bold">
                                        {activeProker ? `PRK-${String(activeProker.prokerId).padStart(3, '0')}` : "PRK-000"}
                                    </span>
                                </div>

                                {/* Judul Besar Proker */}
                                <h4 className={`font-black tracking-tight text-white uppercase italic leading-tight transition-all duration-300 break-words w-full ${
                                    activeProker?.prokerName?.length > 25 ? "text-xl md:text-3xl" :
                                    "text-2xl md:text-4xl"
                                }`}>
                                    {activeProker ? activeProker.prokerName : "Belum Ada Program Kerja"}
                                </h4>
                            </div>

                            {/* Deskripsi Panjang */}
                            <div className="space-y-1">
                                <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-600 block uppercase">Description_</span>
                                <p className="text-zinc-400 text-xs md:text-base leading-relaxed font-light max-w-2xl break-words whitespace-pre-wrap max-h-[100px] md:max-h-none overflow-y-auto no-scrollbar">
                                    {activeProker ? activeProker.deskripsi : "-"}
                                </p>
                            </div>
                        </div>

                        {/* Bagian Bawah: Penanggung Jawab (PJ) */}
                        <div className="border-t border-white/10 pt-4 mt-4 lg:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <span className="text-[9px] font-mono tracking-[0.2em] text-orange-400/60 block uppercase">Person_In_Charge</span>
                                <div className="flex flex-wrap gap-2">
                                    {activeProker && activeProker.pengurusProker && activeProker.pengurusProker.length > 0 ? (
                                        activeProker.pengurusProker.map((pp: any) => (
                                            <span key={pp.pengurusId} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white font-medium text-xs">
                                                {pp.pengurus.pengurusName}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-zinc-500 font-medium text-xs italic">Belum ada PIC</span>
                                    )}
                                </div>
                            </div>

                            {/* Ornamen Geometris Samping Kiri */}
                            <div className="hidden sm:flex items-center gap-1 opacity-30">
                                <div className="w-6 h-1 bg-white"></div>
                                <div className="w-2 h-1 bg-white"></div>
                            </div>
                        </div>
                    </div>

                    {/* ================= SISI KANAN (5 Kolom): List Selector Judul Proker ================= */}
                    <div className="lg:col-span-5 flex flex-col space-y-2 lg:space-y-3 justify-start max-h-[60vh] sm:max-h-[65vh] lg:max-h-[500px] overflow-y-auto pr-1 no-scrollbar relative">
                        
                        {/* Menambahkan class 'sticky top-0 z-20' agar tetap diam di tempat saat di-scroll */}
                        <div className="sticky top-0 z-20 bg-[#111] border-b-2 border-orange-400 p-3 flex justify-between items-center shrink-0 mb-1">
                            <span className="text-[10px] font-mono tracking-[0.2em] text-orange-400 font-bold uppercase">▼ SELECT_PROJECT</span>
                            <span className="text-[10px] font-mono text-zinc-500">
                                {String(divisiData.proker?.length || 0).padStart(2, '0')} TOTAL
                            </span>
                        </div>

                        {/* Looping List Item Button */}
                        {divisiData.proker?.map((proker: any) => {
                            const isSelected = activeProker?.prokerId === proker.prokerId;
                            return (
                                <div key={proker.prokerId} className="flex flex-col w-full shrink-0">
                                    <button
                                        onClick={() => setActiveProker(proker)}
                                        className={`w-full text-left p-3 md:p-4 flex items-center justify-between border transition-all duration-300 relative group/btn ${
                                            isSelected
                                                ? "bg-orange-400 text-black border-orange-400 font-bold"
                                                : "bg-zinc-950/80 text-white border-white/5 hover:border-white/20 hover:bg-zinc-900"
                                        }`}
                                    >
                                        <div className="flex flex-col gap-0.5 flex-1 pr-4 min-w-0">
                                            {/* Sub-info ID kecil */}
                                            <span className={`font-mono text-[9px] tracking-wider ${isSelected ? 'text-black/60' : 'text-zinc-500'}`}>
                                                PRK-{String(proker.prokerId).padStart(3, '0')}
                                            </span>
                                            {/* Judul Proker di List */}
                                            <span className="text-xs md:text-sm tracking-wide uppercase font-black italic break-words line-clamp-2">
                                                {proker.prokerName}
                                            </span>
                                        </div>

                                        {/* Arrow Indicator ala Arknights */}
                                        <div className="shrink-0 flex items-center">
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                strokeWidth={2.5} 
                                                stroke="currentColor" 
                                                className={`w-4 h-4 transition-transform duration-300 ${
                                                    isSelected ? 'rotate-90 lg:rotate-0 text-black' : '-translate-x-2 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 text-orange-400'
                                                }`}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5M4.5 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </div>
                                    </button>
                                    
                                    {/* ACCORDION DETAIL (Mobile Only) */}
                                    <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                                        isSelected ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                        <div className="bg-[#0a0a0a] border-x border-b border-orange-400 p-4 space-y-4">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-600 block uppercase">Description_</span>
                                                <p className="text-zinc-400 text-xs leading-relaxed font-light break-words whitespace-pre-wrap max-h-[200px] overflow-y-auto no-scrollbar">
                                                    {proker.deskripsi || "-"}
                                                </p>
                                            </div>
                                            <div className="space-y-1 border-t border-white/10 pt-3 flex flex-col gap-2">
                                                <span className="text-[9px] font-mono tracking-[0.2em] text-orange-400/60 block uppercase">Person_In_Charge</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {proker.pengurusProker && proker.pengurusProker.length > 0 ? (
                                                        proker.pengurusProker.map((pp: any) => (
                                                            <span key={pp.pengurusId} className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-white font-medium text-[10px]">
                                                                {pp.pengurus.pengurusName}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-zinc-500 font-medium text-[10px] italic">Belum ada PIC</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* Section-specific logo (bottom-right) */}
            <div className="absolute bottom-6 right-6 z-20 pointer-events-none opacity-50 hidden md:block mix-blend-screen">
                <Image src="/logo-hmsi.png" alt="HMSI Logo" width={50} height={50} className="object-contain filter grayscale transition-all duration-500" />
            </div>
        </section>

        {/* 3. GUNAKAN KOMPONEN FOOTER DI AKHIR KONTEN */}
        <Footer />

        {/* --- STYLE INJECTION (Menghilangkan Scrollbar Lobby Style) --- */}
        <style jsx global>{`
            ::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        </div>
    );
}
