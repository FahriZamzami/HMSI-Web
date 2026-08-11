"use client";

import Footer from "@/components/footer/footer";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function TentangKami() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-400/30 overflow-x-hidden flex flex-col">
      
      {/* Tombol Kembali */}
      <Link href="/#about" className="fixed top-6 left-6 md:top-8 md:left-8 z-50 inline-flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition-colors group">
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-mono text-sm uppercase tracking-widest hidden md:inline-block">Back</span>
      </Link>

      <main className="w-full relative pt-16 pb-20 flex-1">
        {/* Background Accents */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-400/5 rounded-full blur-[120px] mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] mix-blend-screen -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
          
          {/* Header Section */}
          <div className="text-center md:text-left mb-16 md:mb-24 space-y-4">
             <span className="text-orange-400 font-mono text-[10px] md:text-xs tracking-[0.5em] block uppercase">
               INFORMATION // ABOUT_US
             </span>
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase text-white drop-shadow-2xl leading-[0.9]">
               TENTANG HMSI
             </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Kiri: Tentang HMSI (Teks) */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Seksi 1: Apa itu HMSI */}
              <div className="space-y-4 border-l-2 border-orange-400 pl-6 relative">
                <div className="absolute -left-[5px] top-0 w-2 h-2 bg-orange-400 rotate-45"></div>
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-4">Profil Organisasi</h2>
                <div className="text-zinc-400 space-y-4 text-sm md:text-base leading-relaxed text-justify">
                  <p>
                    <strong className="text-white">HMSI</strong> adalah organisasi mahasiswa jurusan Sistem Informasi. 
                    Organisasi ini dibentuk sebagai wadah untuk menampung aspirasi, ide, dan kreativitas mahasiswa. 
                    HMSI juga berfungsi sebagai media komunikasi dan informasi. Organisasi ini menjadi tempat pembelajaran organisasi serta pengembangan diri anggotanya.
                  </p>
                  <p>
                    Secara sejarah, HMSI terbentuk dari keinginan bersama mahasiswa Sistem Informasi untuk menyatukan tujuan dan semangat organisasi. 
                    Perjalanan pembentukannya dimulai dari masuknya mahasiswa Sistem Informasi ke Fakultas Teknik, lalu dilanjutkan dengan pemilihan pengurus, pembahasan AD/ART, hingga pengesahan kepengurusan melalui MUBES I.
                  </p>
                </div>
              </div>

              {/* Seksi 2: Visi & Misi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#111] border border-white/10 p-6 md:p-8 hover:border-orange-400/50 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-orange-400/5 rounded-bl-full translate-x-1/2 -translate-y-1/2 group-hover:scale-[2] transition-transform duration-500"></div>
                  <span className="text-orange-400 font-mono text-[10px] tracking-[0.3em] uppercase block mb-3 relative z-10">GOAL_01</span>
                  <h3 className="text-xl font-bold uppercase tracking-widest mb-4 relative z-10">Visi</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed text-justify relative z-10">
                    Meningkatkan mutu dan kualitas anggota, mempererat persaudaraan, dan membantu pelaksanaan tridharma perguruan tinggi.
                  </p>
                </div>
                <div className="bg-[#111] border border-white/10 p-6 md:p-8 hover:border-orange-400/50 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-orange-400/5 rounded-bl-full translate-x-1/2 -translate-y-1/2 group-hover:scale-[2] transition-transform duration-500"></div>
                  <span className="text-orange-400 font-mono text-[10px] tracking-[0.3em] uppercase block mb-3 relative z-10">GOAL_02</span>
                  <h3 className="text-xl font-bold uppercase tracking-widest mb-4 relative z-10">Misi</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed text-justify relative z-10">
                    Mengakomodasi aspirasi mahasiswa, serta meningkatkan kualitas SDM baik secara intelektual maupun profesional.
                  </p>
                </div>
              </div>

            </div>

            {/* Kanan: Arti Lambang */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-32 space-y-8 bg-[#050505]/80 backdrop-blur-xl border border-white/10 p-6 md:p-10 z-10 shadow-2xl">
                
                {/* Visual Lambang */}
                <div className="relative w-full aspect-square bg-[#0a0a0a] border border-white/5 flex items-center justify-center p-8 mb-8 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/5 to-transparent"></div>
                  <Image 
                    src="/logo-hmsi.png" 
                    alt="Lambang HMSI" 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-8 drop-shadow-[0_0_30px_rgba(251,146,60,0.3)] transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold uppercase tracking-widest border-b border-white/10 pb-4">Arti Lambang</h2>
                  
                  <ul className="space-y-4 text-sm text-zinc-400 leading-relaxed">
                    <li className="flex gap-4">
                      <span className="text-orange-400 shrink-0 mt-1">✦</span>
                      <p><strong className="text-white">Lambang HMSI</strong> dipakai sebagai simbol identitas organisasi.</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-[#3b82f6] shrink-0 mt-1">■</span>
                      <p><strong className="text-white">Warna biru</strong> melambangkan kebijakan, kepercayaan, loyalitas, dan kenyamanan.</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-orange-400 shrink-0 mt-1">■</span>
                      <p><strong className="text-white">Warna orange</strong> melambangkan keberanian, kehangatan, keramahan, keakraban, dan kesuksesan.</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-white/50 shrink-0 mt-1">✦</span>
                      <p><strong className="text-white">Lengkungan biru dan orange</strong> melambangkan semangat kerja sama dan kekuatan dalam menjelajahi dunia.</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-white/50 shrink-0 mt-1">✦</span>
                      <p><strong className="text-white">Globe orange</strong> melambangkan kebersamaan yang hangat dan luasnya dunia yang harus dijelajahi bersama.</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-white/50 shrink-0 mt-1">✦</span>
                      <p><strong className="text-white">Tulisan "Himpunan Mahasiswa"</strong> melambangkan kekompakan, kerjasama, dan persatuan.</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-white/50 shrink-0 mt-1">✦</span>
                      <p><strong className="text-white">Tulisan "Sistem Informasi dan Universitas Andalas"</strong> melambangkan identitas jurusan IT dan keterkaitannya dengan Universitas Andalas.</p>
                    </li>
                  </ul>
                  
                  <div className="mt-8 p-4 bg-orange-400/10 border-l-2 border-orange-400 text-orange-400/90 text-xs leading-relaxed italic">
                    "Secara keseluruhan, lambang HMSI mencerminkan semangat kerja sama, loyalitas, keberanian, dan perkembangan bersama."
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
