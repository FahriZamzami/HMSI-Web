"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  FaHome, 
  FaCalendarAlt, 
  FaNewspaper, 
  FaUserAlt, 
  FaSignOutAlt,
  FaUserShield,
  FaTimes,
  FaCommentDots
} from "react-icons/fa";

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Home", path: "/admin", icon: <FaHome size={20} /> },
    { name: "Periode", path: "/admin/periode", icon: <FaCalendarAlt size={20} /> },
    { name: "Post", path: "/admin/post", icon: <FaNewspaper size={20} /> },
    { name: "Saran", path: "/admin/saran", icon: <FaCommentDots size={20} /> },
    // Profile as icon-only placed under Saran
    { name: "Profile", path: "/admin/profile", icon: <FaUserAlt size={20} /> },
  ];

  const bottomItems = [
    { name: "Profile", path: "/admin/profile", icon: <FaUserAlt size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <aside className="w-64 bg-black border-r border-neutral-800 text-white flex flex-col h-screen">
      {/* Sidebar Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-800">
        <h2 className="text-xl font-bold tracking-widest text-orange-500">HMSI ADMIN</h2>
        {/* Close button only visible on mobile (lg:hidden handles layout, this just provides button) */}
        <button 
          onClick={onClose}
          className="lg:hidden text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== "/admin" && pathname.startsWith(item.path));

          // Render profile as icon-only
          if (item.name === "Profile") {
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                aria-label={item.name}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {item.icon}
                {/* Show label so 'Profile' text is visible like other menu items */}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          }

          return (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={onClose}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30" 
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Profile + Logout */}
      <div className="p-4 border-t border-neutral-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <FaSignOutAlt size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
