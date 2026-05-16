"use client";

import Image from "next/image";
import { useState } from "react";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

// --- DATA POLOS KHUSUS PSSDM ---
const PSSDM_INFO = {
    name: "PSSDM",
    fullName: "Pengembangan Skill dan Sumber Daya Manusia",
    heroImg: "/4.jpg", 
};

const MEMBERS_DATA = [
    { 
        id: 1, 
        name: "Revin Pahlevi", 
        role: "Kepala Divisi", 
        img: "/divisi/pssdm/revin.jpg", 
    },
    { 
        id: 2, 
        name: "Naila Muthia Danisha", 
        role: "Sekretaris Bendahara", 
        img: "/divisi/pssdm/naila.jpg", 
    },
    { 
        id: 3, 
        name: "Rahil Akram Hammad", 
        role: "Staff PSSDM", 
        img: "/divisi/pssdm/rahil.jpg", 
    },
    { 
        id: 4, 
        name: "Fahri Zamzami", 
        role: "Staff PSSDM", 
        img: "/divisi/pssdm/fahri.jpg", 
    },
    { 
        id: 5, 
        name: "Farrah Aulia", 
        role: "Staff PSSDM", 
        img: "/divisi/pssdm/aul.jpg", 
    },
    { 
        id: 6, 
        name: "Febiola Ramli", 
        role: "Staff PSSDM", 
        img: "/divisi/pssdm/febi.jpg", 
    },
    { 
        id: 7, 
        name: "Ahmad Iqbal Ramadhan", 
        role: "Staff PSSDM", 
        img: "/divisi/pssdm/iqbal.jpg", 
    },
    { 
        id: 8, 
        name: "Ikhsan Pratama", 
        role: "Staff PSSDM", 
        img: "/divisi/pssdm/ikhsan.jpg", 
    },
];

const PROKER_DATA = [
    { 
        id: "PRK-PSD-01", 
        title: "UPGRADING FUNCTIONARY", 
        desc: "Pelatihan intensif hardskill dan softskill yang dirancang khusus untuk meningkatkan kapabilitas teknis maupun manajerial seluruh pengurus aktif HMSI.",
        pj: "Fahri Zamzami"
    },
    { 
        id: "PRK-PSD-02", 
        title: "LKMM-TD (Latihan Kepemimpinan)", 
        desc: "Wadah pelatihan manajemen dan kepemimpinan tingkat dasar bagi mahasiswa Sistem Informasi sebagai gerbang awal regenerasi kepengurusan.",
        pj: "BUdi"
    },
    { 
        id: "PRK-PSD-03", 
        title: "HMSI SHARING & BONDING", 
        desc: "Agenda kasual berkala yang memfasilitasi evaluasi sehat, sharing session antar-divisi, serta fun games guna mempererat rasa kekeluargaan.",
        pj: "BUdi"
    },
    { 
        id: "PRK-PSD-04", 
        title: "HMSI SHARING & BONDING", 
        desc: "Agenda kasual berkala yang memfasilitasi evaluasi sehat, sharing session antar-divisi, serta fun games guna mempererat rasa kekeluargaan.",
        pj: "BUdi"
    },
    { 
        id: "PRK-PSD-05", 
        title: "HMSI SHARING & BONDING", 
        desc: "Agenda kasual berkala yang memfasilitasi evaluasi sehat, sharing session antar-divisi, serta fun games guna mempererat rasa kekeluargaan.",
        pj: "BUdi"
    },
    { 
        id: "PRK-PSD-06", 
        title: "HMSI SHARING & BONDING", 
        desc: "Agenda kasual berkala yang memfasilitasi evaluasi sehat, sharing session antar-divisi, serta fun games guna mempererat rasa kekeluargaan.",
        pj: "BUdi"
    },
    { 
        id: "PRK-PSD-07", 
        title: "HMSI SHARING & BONDING", 
        desc: "Agenda kasual berkala yang memfasilitasi evaluasi sehat, sharing session antar-divisi, serta fun games guna mempererat rasa kekeluargaan.",
        pj: "BUdi"
    },
    { 
        id: "PRK-PSD-08", 
        title: "HMSI SHARING & BONDING", 
        desc: "Agenda kasual berkala yang memfasilitasi evaluasi sehat, sharing session antar-divisi, serta fun games guna mempererat rasa kekeluargaan.",
        pj: "BUdi"
    }
];

export default function PssdmPage() {
    const [selectedMember, setSelectedMember] = useState(MEMBERS_DATA[0]);
    const [activeProker, setActiveProker] = useState(PROKER_DATA[0]);

    return (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black text-white font-sans selection:bg-orange-400/30 no-scrollbar scroll-smooth">
        
        {/* 2. GUNAKAN KOMPONEN HEADER DI AWAL KONTEN */}
        <Header />

        {/* --- SECTION 1: HERO PSSDM --- */}
        <section id="hero-pssdm" className="relative h-screen w-full snap-start overflow-hidden bg-black flex flex-col">
            {/* Background Image Statis */}
            <div className="absolute inset-0 z-0">
            <Image 
                src={PSSDM_INFO.heroImg} 
                alt={PSSDM_INFO.name} 
                fill 
                className="object-cover" 
                priority 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70"></div>
            </div>

            {/* Konten Teks Utama */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center lg:items-start lg:justify-end px-6 lg:px-12 lg:pl-24 lg:pb-24">
            <div className="text-center lg:text-left max-w-4xl">
                <span className="text-orange-400 font-mono text-[10px] md:text-xs tracking-[0.5em] block mb-4">
                DIVISION_PROFILE // {PSSDM_INFO.name}
                </span>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter leading-[0.8] text-white uppercase drop-shadow-2xl">
                {PSSDM_INFO.name} <br /> 
                <span className="text-orange-400 text-3xl md:text-5xl lg:text-6xl not-italic font-light tracking-wide block mt-4">
                    {PSSDM_INFO.fullName}
                </span>
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
        </section>

        {/* --- SECTION 2: ANGGOTA DIVISI (Immersive Character Focus UI) --- */}
        <section id="anggota" className="relative h-screen w-full snap-start bg-[#050505] flex items-center justify-center py-6 md:py-12 overflow-hidden border-t border-white/5 selection:bg-orange-400/20">
            
            {/* WATERMARK BACKGROUND */}
            <div className="absolute inset-y-0 left-12 flex items-center text-white/[0.01] text-[15rem] font-black italic select-none pointer-events-none z-0 tracking-tighter">
                PSSDM
            </div>

            <div className="max-w-[1650px] mx-auto w-full h-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative z-10">
                
                {/* ================= SISI KIRI (3 Kolom): Informasi & Detail Teks ================= */}
                <div className="lg:col-span-3 flex flex-col justify-center text-center lg:text-left space-y-4 order-2 lg:order-1 self-center">
                    
                    <div className="flex items-center justify-center lg:justify-start gap-3 pt-1">
                        <div className="w-3 h-3 border border-orange-400/50 rotate-45 flex items-center justify-center">
                            <div className="w-1 h-1 bg-orange-400"></div>
                        </div>
                        <div className="h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent flex-1 hidden lg:block"></div>
                    </div>

                    <div className="space-y-2">
                        {/* Nama Besar Utama */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase italic leading-[1.1] drop-shadow-md break-words max-w-xs">
                            {selectedMember.name}
                        </h2>

                        {/* Jabatan / Role */}
                        <p className="text-orange-400 font-mono text-xs md:text-sm tracking-[0.2em] uppercase font-bold pt-1">
                            {selectedMember.role}
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
                <div className="lg:col-span-5 flex items-center justify-center h-full relative order-1 lg:order-2 py-4 lg:py-0 self-center">
                    
                    {/* KONTANER UTAMA */}
                    <div className="relative w-72 h-[420px] md:w-88 md:h-[540px] lg:w-[410px] lg:h-[610px] filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)] group/artwork">
                        
                        {/* BINGKAI DINAMIS */}
                        <div className="absolute -inset-4 border-2 border-white/10 opacity-70 pointer-events-none z-0 transition-colors duration-500 group-hover/artwork:border-orange-400/30">
                            {/* Siku Ornamen Pojok Taktis */}
                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-orange-400"></div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-orange-400"></div>
                        </div>

                        {/* Elemen Frame Image Utama */}
                        <div className="relative w-full h-full overflow-hidden z-10 border border-white/5 bg-zinc-900">
                            <Image 
                                src={selectedMember.img} 
                                alt={selectedMember.name}
                                fill
                                // PERBAIKAN 1: Menurunkan opacity ke 75% (atau gunakan opacity-80) agar menyatu dengan background gelap
                                className="object-cover object-top opacity-80 transition-all duration-700 ease-out scale-[1.01] group-hover/artwork:scale-[1.03]"
                                priority
                            />
                            {/* PERBAIKAN 2: Mempertebal lapisan gradasi gelap di bagian bawah gambar (dari opacity-40 ke opacity-80) */}
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
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Anggota PSSDM</h4>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-600">
                                {String(selectedMember.id).padStart(2, '0')} / {String(MEMBERS_DATA.length).padStart(2, '0')}
                            </span>
                        </div>

                        {/* Grid List Thumbnails - Diperbesar dengan gap-3 dan max-h dinaikkan agar ruang atas bawah seimbang */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-2 gap-3 overflow-y-auto max-h-[220px] lg:max-h-[560px] pr-1 no-scrollbar justify-center">
                            {MEMBERS_DATA.map((member) => {
                                const isActive = selectedMember.id === member.id;
                                return (
                                    <button
                                        key={member.id}
                                        onClick={() => setSelectedMember(member)}
                                        className={`relative w-full aspect-square border transition-all duration-300 group overflow-hidden rounded-sm bg-zinc-900 ${
                                            isActive 
                                                ? "border-orange-400 bg-orange-400/5 ring-1 ring-orange-400/20 scale-[0.96]" 
                                                : "border-white/5 bg-zinc-950/90 hover:border-white/20"
                                        }`}
                                    >
                                        {/* Gambar Mini List */}
                                        <div className="absolute inset-0 w-full h-full">
                                            <Image  
                                                src={member.img}  
                                                alt={member.name}  
                                                fill  
                                                sizes="(max-width: 150px) 100vw"
                                                className={`object-cover object-top transition-all duration-500 group-hover:scale-105 ${
                                                    isActive ? "grayscale-0 opacity-100" : "grayscale opacity-45 group-hover:opacity-90 group-hover:grayscale-0"
                                                }`}
                                            />
                                        </div>

                                        {/* Garis Aktif */}
                                        {isActive && (
                                            <div className="absolute left-0 top-0 w-1 h-full bg-orange-400 z-20"></div>
                                        )}

                                        {/* 
                                        PERBAIKAN SHADOW OVERLAY:
                                        Menggunakan multi-stop gradient (transparent -> black/40 -> black/80 -> black) 
                                        untuk menciptakan efek pemudaran warna gelap yang jauh lebih smooth di bagian bawah gambar.
                                        */}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-12 pb-3 px-2.5 text-left z-10 pointer-events-none flex flex-col justify-end min-h-[60%]">
                                            
                                            {/* PERBAIKAN NAMA: Menampilkan nama lengkap, teks membungkus rapi, tanpa split */}
                                            <p className="text-[10px] lg:text-[11px] font-bold text-white uppercase tracking-tight leading-tight break-words line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                                {member.name}
                                            </p>
                                            
                                            {/* PERBAIKAN JABATAN: Menampilkan jabatan lengkap, tanpa split */}
                                            <p className="text-[7.5px] lg:text-[8px] font-mono text-zinc-400 uppercase tracking-tighter mt-1 leading-tight break-words drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                                                {member.role}
                                            </p>
                                            
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>

            </div>
        </section>

        {/* --- SECTION 3: PROGRAM KERJA (Arknights Inspired Split UI) --- */}
        <section id="proker" className="relative h-screen w-full snap-start bg-[#050505] flex items-center justify-center py-12 overflow-hidden border-t border-white/5 selection:bg-orange-400/20">
            
            {/* WATERMARK BACKGROUND */}
            <div className="absolute inset-y-0 right-12 flex items-center text-white/[0.01] text-[12rem] font-black italic select-none pointer-events-none z-0 tracking-tighter uppercase">
                PROJECTS
            </div>

            <div className="max-w-[1650px] mx-auto w-full h-full px-6 md:px-12 flex flex-col justify-center space-y-8 relative z-10">
                
                {/* Section Header */}
                <div className="text-center lg:text-left space-y-1">
                    <span className="text-orange-400 font-mono text-[9px] md:text-xs tracking-[0.5em] block">
                        PSSDM // PROJECT_LIST
                    </span>
                    <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                        Program Kerja
                    </h3>
                </div>

                {/* MAIN LAYOUT SPLIT BOX */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full items-stretch">
                    
                    {/* ================= SISI KIRI (7 Kolom): Display Deskripsi & Detail Proker Aktif ================= */}
                    <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/10 p-6 md:p-10 flex flex-col justify-between relative overflow-hidden group min-h-[350px] lg:min-h-[500px]">
                        
                        {/* Ornamen Garis Pojok Khas Arknights */}
                        <div className="absolute top-0 left-0 w-2 h-full bg-orange-400"></div>
                        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-20">
                            <div className="w-1 h-4 bg-white"></div>
                            <div className="w-2 h-2 bg-white"></div>
                        </div>

                        {/* Konten Utama Detail */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                {/* ID & Kategori Proker */}
                                <div className="flex items-center gap-3">
                                    <span className="text-orange-400 font-mono text-sm tracking-widest font-bold">
                                        {activeProker.id}
                                    </span>
                                </div>

                                {/* Judul Besar Proker */}
                                <h4 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase italic leading-tight transition-all duration-300">
                                    {activeProker.title}
                                </h4>
                            </div>

                            {/* Deskripsi Panjang */}
                            <div className="space-y-1">
                                <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-600 block uppercase">Description_</span>
                                <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light max-w-2xl">
                                    {activeProker.desc}
                                </p>
                            </div>
                        </div>

                        {/* Bagian Bawah: Penanggung Jawab (PJ) */}
                        <div className="border-t border-white/10 pt-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-mono tracking-[0.2em] text-orange-400/60 block uppercase">Person_In_Charge</span>
                                <p className="text-white font-medium tracking-wide text-sm uppercase">
                                    {activeProker.pj}
                                </p>
                            </div>

                            {/* Ornamen Geometris Samping Kiri */}
                            <div className="hidden sm:flex items-center gap-1 opacity-30">
                                <div className="w-6 h-1 bg-white"></div>
                                <div className="w-2 h-1 bg-white"></div>
                            </div>
                        </div>
                    </div>

                    {/* ================= SISI KANAN (5 Kolom): List Selector Judul Proker ================= */}
                    <div className="lg:col-span-5 flex flex-col space-y-3 justify-start max-h-[350px] lg:max-h-[500px] overflow-y-auto pr-1 no-scrollbar relative">
                        
                        {/* PERBAIKAN HEADER: 
                        Menambahkan class 'sticky top-0 z-20' agar tetap diam di tempat saat di-scroll,
                        serta 'bg-[#050505]' atau 'bg-[#111]' untuk menutupi daftar proker yang tergulung ke bawahnya.
                        */}
                        <div className="sticky top-0 z-20 bg-[#111] border-b-2 border-orange-400 p-3 flex justify-between items-center shrink-0 mb-1">
                            <span className="text-[10px] font-mono tracking-[0.2em] text-orange-400 font-bold uppercase">▼ SELECT_PROJECT</span>
                            <span className="text-[10px] font-mono text-zinc-500">
                                {String(PROKER_DATA.length).padStart(2, '0')} TOTAL
                            </span>
                        </div>

                        {/* Looping List Item Button */}
                        {PROKER_DATA.map((proker) => {
                            const isSelected = activeProker.id === proker.id;
                            return (
                                <button
                                    key={proker.id}
                                    onClick={() => setActiveProker(proker)}
                                    className={`w-full text-left p-4 flex items-center justify-between border transition-all duration-300 relative group/btn shrink-0 ${
                                        isSelected
                                            ? "bg-orange-400 text-black border-orange-400 font-bold"
                                            : "bg-zinc-950/80 text-white border-white/5 hover:border-white/20 hover:bg-zinc-900"
                                    }`}
                                >
                                    <div className="flex flex-col gap-0.5 flex-1 pr-4">
                                        {/* Sub-info ID kecil */}
                                        <span className={`font-mono text-[9px] tracking-wider ${isSelected ? 'text-black/60' : 'text-zinc-500'}`}>
                                            {proker.id}
                                        </span>
                                        {/* Judul Proker di List */}
                                        <span className="text-xs md:text-sm tracking-wide uppercase font-black italic truncate max-w-xs">
                                            {proker.title}
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
                                                isSelected ? 'translate-x-0 text-black' : '-translate-x-2 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 text-orange-400'
                                            }`}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5M4.5 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>

        {/* 3. GUNAKAN KOMPONEN FOOTER DI AKHIR KONTEN */}
        <Footer />

        {/* --- STYLE INJECTION (Menghilangkan Scrollbar Lobby Style) --- */}
        <style jsx>{`
            ::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        </div>
    );
}