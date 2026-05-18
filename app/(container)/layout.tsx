/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { FiBriefcase, FiUser, FiHome, FiSettings, FiBell, FiMenu, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Footer from "@/components/footer/page";
import { MdHistory } from "react-icons/md";
import { useState, useEffect } from "react";
import supabase from "@/lib/db";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
            
          if (profile) {
            setUserRole(profile.role);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Tutup sidebar otomatis saat berpindah halaman (khusus mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const allNavLinks = [
    { href: "/general-dashboard", label: "Dashboard Umum", icon: <FiHome />, roles: ["employer", "worker"] },
    { href: "/employer", label: "Pemberi Kerja", icon: <FiUser />, roles: ["employer"] },
    { href: "/worker", label: "Pekerja", icon: <FiUser />, roles: ["worker"] },
    { href: "/jobs", label: "Pekerjaan", icon: <FiBriefcase />, roles: ["employer", "worker"] },
    { href: "/history", label: "Riwayat", icon: <MdHistory />, roles: ["worker"] },
    { href: "/notification", label: "Notifikasi", icon: <FiBell />, roles: ["employer", "worker"] },
    { href: "/profile", label: "Profil", icon: <FiUser />, roles: ["employer", "worker"] },
    { href: "/settings", label: "Pengaturan", icon: <FiSettings />, roles: ["employer", "worker"] },
  ];

  // Filter menu: Hanya tampilkan menu yang mencakup role si user
  const filteredLinks = allNavLinks.filter(link => 
    userRole ? link.roles.includes(userRole) : link.roles.includes("worker") // Default fallback jika belum terunduh
  );

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Tombol Hamburger (Hanya muncul di HP) */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-blue-600 text-white rounded-lg shadow-lg focus:outline-none"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* OVERLAY (Muncul saat sidebar buka di HP) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:block lg:pt-0 pt-10
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            KaryaMandiri
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-6">
          {/* Skeleton loading opsional jika data sedang di-fetch */}
          {loading ? (
            <div className="p-3 text-sm text-slate-400 animate-pulse">Memuat menu...</div>
          ) : (
            filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  pathname === link.href 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                {link.icon} {link.label}
              </Link>
            ))
          )}
        </nav>
      </aside>

      {/* AREA MAIN */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-4 md:p-8 pt-16 lg:pt-8 flex-1">
          {children} 
        </div>
        <Footer />
      </main>
    </div>
  );
}
