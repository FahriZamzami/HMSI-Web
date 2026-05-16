"use client";

import Image from "next/image";
import { 
    FaInstagram, 
    FaFacebookF, 
    FaTwitter, 
    FaLinkedinIn, 
    FaTiktok 
} from "react-icons/fa";

export default function Footer() {
    const socialMedias = [
        { Icon: FaInstagram, href: "#" },
        { Icon: FaFacebookF, href: "#" },
        { Icon: FaTwitter, href: "#" },
        { Icon: FaLinkedinIn, href: "#" },
        { Icon: FaTiktok, href: "#" },
    ];

    return (
        <footer className="relative w-full snap-start bg-[#0a0a0a] border-t border-white/5 py-12 md:py-20 flex flex-col justify-center">
        <div className="max-w-[1800px] mx-auto w-full px-8 md:px-16 flex flex-col md:flex-row justify-between items-center md:items-end gap-12">
            
            {/* SISI KIRI: Logo & Copyright */}
            <div className="flex flex-col items-center md:items-start gap-6">
            <div className="relative w-48 md:w-64 h-12 md:h-16">
                <Image 
                src="/logo-hmsi.png" 
                alt="HMSI Logo" 
                fill 
                className="object-contain object-left grayscale opacity-80" 
                />
            </div>
            <div className="flex flex-col gap-1 text-[8px] md:text-[10px] tracking-[0.3em] text-zinc-600 font-mono uppercase">
                <span className="text-orange-400/50">Himpunan Mahasiswa Sistem Informasi 2026</span>
            </div>
            </div>

            {/* SISI KANAN: Social Media & Links */}
            <div className="flex flex-col items-center md:items-end gap-8">
            <div className="flex items-center gap-6">
                {socialMedias.map(({ Icon, href }, i) => (
                <a 
                    key={i} 
                    href={href} 
                    className="text-zinc-500 hover:text-orange-400 text-sm md:text-base transition-all duration-300"
                >
                    <Icon />
                </a>
                ))}
            </div>
            </div>

        </div>
        </footer>
    );
}