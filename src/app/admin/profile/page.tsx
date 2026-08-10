"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaLock, FaCheck, FaTimes, FaPowerOff } from "react-icons/fa";

interface UserProfile {
  userId: number;
  name: string;
  status: "Active" | "Maintenance";
  created: string;
  edited: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_current_user" })
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setProfile(data.data);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Password baru dan konfirmasi password tidak cocok", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          payload: { oldPassword, newPassword }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Password berhasil diubah", type: "success" });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ text: data.error || "Gagal mengubah password", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Terjadi kesalahan sistem", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async () => {
    if (!profile) return;
    setStatusLoading(true);
    
    const newStatus = profile.status === "Active" ? "Maintenance" : "Active";
    
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          payload: { status: newStatus }
        })
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setProfile({ ...profile, status: data.data.status });
      } else {
        alert(data.error || "Gagal mengubah status");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem");
    } finally {
      setStatusLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-neutral-400">Loading profile...</div>;
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Profil Admin</h1>
          <p className="text-neutral-400 mt-1">Kelola pengaturan akun dan status pemeliharaan situs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Profil Card & Status */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-black border-4 border-neutral-800 rounded-full flex items-center justify-center p-4 mb-4 relative overflow-hidden">
              <Image 
                src="/logo-hmsi.png" 
                alt="HMSI Logo" 
                fill 
                className="object-contain p-4"
              />
            </div>
            <h2 className="text-2xl font-bold text-white capitalize">{profile.name}</h2>
            <p className="text-orange-500 font-mono text-sm tracking-widest uppercase mt-1">Administrator</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaPowerOff className={profile.status === "Maintenance" ? "text-red-500" : "text-green-500"} />
              Status Situs Publik
            </h3>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              Jika diubah ke Maintenance, seluruh pengunjung akan melihat halaman pemeliharaan sistem terlepas dari status periode aktif.
            </p>
            
            <button
              onClick={toggleStatus}
              disabled={statusLoading}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 ${
                profile.status === "Maintenance"
                  ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50"
                  : "bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/50"
              }`}
            >
              {statusLoading ? (
                "Memproses..."
              ) : profile.status === "Maintenance" ? (
                <>
                  <FaTimes size={18} />
                  MODE MAINTENANCE AKTIF
                </>
              ) : (
                <>
                  <FaCheck size={18} />
                  SITUS PUBLIK AKTIF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Ganti Password */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 lg:p-8">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
              <FaLock className="text-neutral-500" />
              Ganti Password
            </h3>
            <p className="text-neutral-400 text-sm mb-8">Pastikan password baru Anda kuat dan tidak mudah ditebak.</p>

            {message.text && (
              <div className={`p-4 rounded-xl mb-6 text-sm border ${
                message.type === "error" 
                  ? "bg-red-500/10 border-red-500/30 text-red-400" 
                  : "bg-green-500/10 border-green-500/30 text-green-400"
              }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Password Lama</label>
                <input 
                  type="password" 
                  required
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                  placeholder="Masukkan password saat ini"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Password Baru</label>
                  <input 
                    type="password" 
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                    placeholder="Masukkan password baru"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Konfirmasi Password Baru</label>
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                    placeholder="Ulangi password baru"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Password"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
