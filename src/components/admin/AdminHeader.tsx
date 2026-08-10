"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaBars } from "react-icons/fa";

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format Date: DD/MM/YYYY
  const formattedDate = currentTime
    ? `${String(currentTime.getDate()).padStart(2, "0")}/${String(
        currentTime.getMonth() + 1
      ).padStart(2, "0")}/${currentTime.getFullYear()}`
    : "Memuat...";

  // Format Time: HH.MM.SS
  const formattedTime = currentTime
    ? `${String(currentTime.getHours()).padStart(2, "0")}.${String(
        currentTime.getMinutes()
      ).padStart(2, "0")}.${String(currentTime.getSeconds()).padStart(2, "0")}`
    : "--.--.--";

  // Mendapatkan nama halaman aktif dari pathname
  const getPageName = () => {
    if (pathname === "/admin") return "Dashboard";
    const pathParts = pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    
    // Jika bagian terakhir adalah angka (ID), tampilkan nama halaman induk + Detail
    if (!isNaN(Number(lastPart))) {
      const parent = pathParts[pathParts.length - 2];
      return `Detail ${parent.charAt(0).toUpperCase() + parent.slice(1)}`;
    }

    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };

  return (
    <header className="h-20 bg-black border-b border-neutral-800 flex items-center justify-between px-4 md:px-8 shrink-0">
      {/* Kiri: Tombol Menu (Mobile), Logo & Nama Halaman */}
      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={onMenuClick}
          className="text-neutral-400 hover:text-white p-2 -ml-2 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <FaBars size={24} />
        </button>
        
        <div className="hidden sm:flex items-center justify-center">
          <Image 
            src="/logo-hmsi.png" 
            alt="Logo HMSI" 
            width={48} 
            height={48} 
            className="object-contain"
          />
        </div>
        <div className="hidden sm:block h-8 w-px bg-neutral-700"></div>
        <h1 className="text-lg md:text-xl font-semibold text-white tracking-wide">
          {getPageName()}
        </h1>
      </div>

      {/* Kanan: Jam Real-time */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end text-neutral-400 bg-neutral-900/50 px-3 md:px-4 py-1 md:py-2 rounded-xl border border-neutral-800">
          <span className="text-xs md:text-sm font-medium tracking-wider">{formattedDate}</span>
          <span className="text-base md:text-lg font-mono font-bold text-orange-400">
            {formattedTime}
          </span>
        </div>
      </div>
    </header>
  );
}
