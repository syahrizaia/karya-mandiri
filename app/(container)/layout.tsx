/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { FiBriefcase, FiUser, FiHome, FiSettings, FiBell, FiMenu, FiX, FiLogOut, FiAlertTriangle } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import Footer from "@/components/footer/page";
import { MdHistory } from "react-icons/md";
import { useState, useEffect } from "react";
import supabase from "@/lib/db";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getActiveUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getActiveUser();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoading(true); // Pastikan lock loading aktif di awal

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          console.error("Auth Error atau User tidak ditemukan di session:", authError);
          router.push("/login");
          return;
        }

        // Ambil data profile dari tabel public.profiles
        // PERIKSA: Apakah nama kolomnya benar 'role'? Ataukah 'roles', 'user_type', dll?
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role") 
          .eq("id", user.id)
          .maybeSingle(); // Menggunakan maybeSingle() lebih aman daripada .single() jika data kosong

        if (profileError) {
          console.error("Query Supabase Profiles Error:", profileError.message);
        }

        if (profile && profile.role) {
          setUserRole(profile.role);
        } else {
          console.warn(`Baris profil ditemukan untuk ID ${user.id}, tetapi kolom 'role' bernilai kosong/null.`);
          setUserRole(null);
        }

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
            
          if (profile) {
            setUserRole(profile.role);
          } else {
            // Jika tidak ada user di session, tendang ke login
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Gagal mengambil role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [router]);

  // Tutup sidebar otomatis saat berpindah halaman (khusus mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const allNavLinks = [
    { href: "/general-dashboard", label: "Dashboard Umum", icon: <FiHome />, roles: ["employer", "worker"] },
    { href: "/employer", label: "Ruang Kerja", icon: <FiUser />, roles: ["employer"] },
    { href: "/worker", label: "Ruang Kerja", icon: <FiUser />, roles: ["worker"] },
    { href: "/jobs", label: "Pekerjaan", icon: <FiBriefcase />, roles: ["employer", "worker"] },
    { href: "/services", label: "Jasa", icon: <FiBriefcase />, roles: ["employer", "worker"] },
    { href: "/history", label: "Riwayat", icon: <MdHistory />, roles: ["employer", "worker"] },
    { href: "/notification", label: "Notifikasi", icon: <FiBell />, roles: ["employer", "worker"] },
    { href: "/profile/[id]", label: "Profil", icon: <FiUser />, roles: ["employer", "worker"] },
    { href: "/settings", label: "Pengaturan", icon: <FiSettings />, roles: ["employer", "worker"] },
  ];

  // Filter menu: Hanya tampilkan menu yang mencakup role si user
  const filteredLinks = allNavLinks.filter(link => 
    userRole ? link.roles.includes(userRole.toLowerCase()) : false // Default fallback jika belum terunduh
  );

  // LOGIKA PROTEKSI AREA MAIN
  // Cari tahu konfigurasi hak akses rute yang sedang aktif saat ini
  const currentRouteConfig = allNavLinks.find(link => {
    if (link.href === "/general-dashboard") {
      return pathname === "/general-dashboard";
    }
    return pathname.startsWith(link.href);
  });
  
  let isAuthorized = true;

  // Jika data sudah selesai dimuat (loading === false) dan rute ini terdaftar di allNavLinks
  if (!loading && currentRouteConfig) {
    if (!userRole) {
      // Jika loading selesai tapi role kosong, kunci aksesnya
      isAuthorized = false;
    } else {
      // Cocokkan role user dengan daftar role yang diizinkan di rute tersebut
      isAuthorized = currentRouteConfig.roles.includes(userRole.toLowerCase());
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success("Berhasil keluar akun.");
      router.push("/");
      router.refresh();
    }
  };

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
          <h1 className="text-2xl font-bold text-blue-600">
            KaryaMandiri
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-6">
          {/* Skeleton loading opsional jika data sedang di-fetch */}
          {loading ? (
            <div className="p-3 text-sm text-slate-400 animate-pulse">Memuat menu...</div>
          ) : (
            <>
              {filteredLinks.map((link) => {
                const targetHref = link.href.includes('[id]') 
                  ? (userId ? `/profile/${userId}` : '#') // Fallback ke '#' jika user belum termuat
                  : link.href;
                
                return (
                  <Link
                    key={link.href}
                    href={targetHref}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      pathname === link.href 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    {link.icon} {link.label}
                  </Link>
                )
              })}

              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-3 p-3 w-full text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FiLogOut /> Keluar dari Akun
              </button>
            </>
          )}
        </nav>
      </aside>

      {/* AREA MAIN */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-4 md:p-4 pt-16 lg:pt-4 flex-1">
          {loading ? (
            /* Tampilan saat loading validasi akun */
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium text-sm animate-pulse">Memverifikasi hak akses...</p>
            </div>
          ) : !isAuthorized ? (
            /* Tampilan proteksi jika role TIDAK diizinkan */
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl p-8 border border-slate-200 shadow-sm my-4 max-w-2xl mx-auto text-center h-fit">
              <div className="p-4 bg-red-50 rounded-2xl text-red-600 mb-4">
                <FiAlertTriangle size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Akses Ditolak!</h2>
              <p className="text-slate-500 max-w-sm mb-6 text-sm leading-relaxed">
                Maaf, Anda tidak memiliki kredensial atau hak akses yang sah untuk membuka halaman <span className="font-semibold text-slate-800">{pathname}</span>.
              </p>
              <Link 
                href="/general-dashboard"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-600/20"
              >
                Kembali ke Dashboard Utama
              </Link>
            </div>
          ) : (
            /* Tampilan normal jika role aman dan sesuai */
            children
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
}
