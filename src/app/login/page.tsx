"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          payload: { name, password },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal melakukan login");
      }

      // Jika sukses, arahkan ke halaman admin
      router.push("/admin");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-neutral-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/1.jpg"
          alt="HMSI Background"
          fill
          className="object-cover opacity-30 blur-sm scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/80"></div>
      </div>

      {/* Login Card (Glassmorphism) */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 mx-4 bg-white/10 dark:bg-black/30 backdrop-blur-lg border border-white/20 rounded-[2rem] shadow-2xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-4 hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto border border-white/30 shadow-inner">
              <span className="text-xl font-bold text-white">HMSI</span>
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Admin Portal</h1>
          <p className="text-gray-300 text-sm">Masuk untuk mengelola konten website</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-200 ml-1">Username / Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/80 focus:border-transparent transition-all backdrop-blur-sm"
              placeholder="Masukkan username"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-200 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/80 focus:border-transparent transition-all backdrop-blur-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-orange-600/30 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            ) : (
              "Masuk ke Dashboard"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400 font-medium tracking-wide">
          &copy; {new Date().getFullYear()} HMSI. All rights reserved.
        </div>
      </div>
    </div>
  );
}
