"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function Header() {
    const pathname = usePathname();

    const navLinks = [
        { name: "HOME", href: "/#home" }, 
        { name: "PROFILE", href: "/#profile" },
        { name: "DIVISI", href: "/#divisi" },
        { name: "GALLERY", href: "/#gallery" },
        { name: "KRITIK & SARAN", href: "/#saran" },
        { name: "ALUMNI", href: "/alumni" },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        // Tutup menu mobile jika diklik
        setIsMobileMenuOpen(false);

        // Jika user berada di halaman utama ('/') dan menekan menu, kita bantu scroll manual
        if (pathname === "/") {
            const targetId = href.replace("/#", "");
            const element = document.getElementById(targetId);
            if (element) {
                e.preventDefault();
                element.scrollIntoView({ behavior: "smooth" });
                
                // Opsional: Perbarui URL di browser tanpa reload agar history tetap rapi
                window.history.pushState(null, "", href);
            }
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-[100] bg-black/40 backdrop-blur-md border-b border-white/5">
            <nav className="max-w-[1800px] mx-auto px-4 md:px-8 py-2 md:py-3 flex items-center justify-between font-light uppercase relative">
                <Link href="/" className="flex items-center gap-3 md:gap-4 group">
                    <Image src="/logo-hmsi.png" alt="Logo" width={35} height={35} className="object-contain md:w-[45px] md:h-[45px]" priority />
                    <div className="flex flex-col text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] leading-tight border-l border-white/20 pl-3 md:pl-4">
                        <span>Himpunan Mahasiswa</span>
                        <span className="font-bold text-orange-400 uppercase">Sistem Informasi</span>
                    </div>
                </Link>
                
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.href} 
                            onClick={(e) => handleClick(e, link.href)}
                            className="text-[10px] tracking-[0.4em] text-zinc-400 hover:text-white transition-all duration-300"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
                
                {/* Mobile Menu Icon */}
                <div 
                    className="md:hidden text-orange-400 cursor-pointer z-[110] p-2" 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                    <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                    <div className={`w-4 h-0.5 bg-current ml-auto transition-all duration-300 ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : ''}`}></div>
                </div>

                {/* Mobile Menu Dropdown */}
                <div className={`absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 flex flex-col items-center py-6 gap-6 transition-all duration-300 md:hidden overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 py-0 border-transparent'}`}>
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.href} 
                            onClick={(e) => handleClick(e, link.href)}
                            className="text-[10px] tracking-[0.4em] text-zinc-400 hover:text-white transition-all duration-300 w-full text-center py-2"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    );
}