"use client";

import Link from "next/link";
import { FiBriefcase, FiUser, FiHome, FiSettings, FiBell } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Footer from "@/components/footer/page";
import { MdHistory } from "react-icons/md";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR FIXED */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            KaryaMandiri
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 p-3 rounded-lg ${pathname === '/dashboard' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          >
            <FiHome /> Dashboard
          </Link>
          <Link
            href="/employer"
            className={`flex items-center gap-3 p-3 rounded-lg ${pathname === '/employer' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          >
            <FiUser /> Pemberi Kerja
          </Link>
          <Link
            href="/worker"
            className={`flex items-center gap-3 p-3 rounded-lg ${pathname === '/worker' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          >
            <FiUser /> Pekerja
          </Link>
          <Link
            href="/jobs"
            className={`flex items-center gap-3 p-3 rounded-lg ${pathname === '/jobs' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          >
            <FiBriefcase /> Pekerjaan
          </Link>
          <Link
            href="/history"
            className={`flex items-center gap-3 p-3 rounded-lg ${pathname === '/history' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          >
            <MdHistory /> Riwayat
          </Link>
          <Link
            href="/notification"
            className={`flex items-center gap-3 p-3 rounded-lg ${pathname === '/notification' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          >
            <FiBell /> Notifikasi
          </Link>
          <Link
            href="/profile"
            className={`flex items-center gap-3 p-3 rounded-lg ${pathname === '/profile' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          >
            <FiUser /> Profil
          </Link>
          <Link
            href="/settings"
            className={`flex items-center gap-3 p-3 rounded-lg ${pathname === '/settings' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          >
            <FiSettings /> Pengaturan
          </Link>
        </nav>
      </aside>

      {/* AREA MAIN (Konten Berubah di Sini) */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children} 
        </div>
        <Footer />
      </main>
    </div>
  );
}
