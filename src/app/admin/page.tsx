import Link from "next/link";
import { FaCalendarAlt, FaNewspaper, FaUserAlt, FaUserShield, FaCommentDots } from "react-icons/fa";

export default function AdminDashboard() {
  const adminName = "Admin"; // Nantinya bisa diambil dari session/DB

  const shortcutCards = [
    {
      title: "Kelola Periode",
      description: "Atur periode kepengurusan dan divisi",
      icon: <FaCalendarAlt size={32} className="text-orange-500" />,
      path: "/admin/periode",
      color: "from-orange-600/10 to-orange-900/10 border-orange-500/20 hover:border-orange-500/50",
    },
    {
      title: "Kelola Post",
      description: "Buat dan publikasikan artikel atau kegiatan",
      icon: <FaNewspaper size={32} className="text-neutral-300" />,
      path: "/admin/post",
      color: "from-neutral-600/10 to-neutral-900/10 border-neutral-500/20 hover:border-neutral-500/50",
    },
    {
      title: "Profile Pengurus",
      description: "Atur data dan identitas profil anggota",
      icon: <FaUserAlt size={32} className="text-orange-400" />,
      path: "/admin/profile",
      color: "from-orange-500/10 to-orange-800/10 border-orange-400/20 hover:border-orange-400/50",
    },
    {
      title: "Kelola Saran",
      description: "Lihat kritik dan saran dari mahasiswa",
      icon: <FaCommentDots size={32} className="text-blue-400" />,
      path: "/admin/saran",
      color: "from-blue-600/10 to-blue-900/10 border-blue-500/20 hover:border-blue-500/50",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="bg-black border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Welcome back, <span className="text-orange-500">{adminName}</span>! 👋
        </h2>
        <p className="text-neutral-400 text-sm md:text-base">
          Gunakan dashboard ini untuk mengelola seluruh konten dan data pada sistem Himpunan Mahasiswa Sistem Informasi.
        </p>
      </div>

      {/* Shortcut Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {shortcutCards.map((card, index) => (
          <Link href={card.path} key={index}>
            <div
              className={`p-5 md:p-6 rounded-3xl border bg-gradient-to-br ${card.color} hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-lg backdrop-blur-sm h-full flex flex-col justify-between group`}
            >
              <div className="mb-4 bg-black w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border border-neutral-800 group-hover:border-neutral-600 transition-colors">
                {card.icon}
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
                  {card.title}
                </h3>
                <p className="text-neutral-400 text-xs md:text-sm">
                  {card.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
