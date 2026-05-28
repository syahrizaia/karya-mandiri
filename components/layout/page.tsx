/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { FiBriefcase, FiUser, FiHome, FiSettings, FiBell, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import Footer from "@/components/footer/page";
import { MdHistory, MdWorkspacesOutline } from "react-icons/md";
import { useState, useEffect } from "react";
import supabase from "@/lib/db";
import { toast } from "sonner";
import { TbNews } from "react-icons/tb";

export default function ClientDashboardWrapper({
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
  const [unreadCount, setUnreadCount] = useState(0);

  // Daftar rute yang benar-benar publik dan bisa diakses tanpa login/tanpa role khusus
  const publicRoutes = ["/", "/general-dashboard", "/news", "/jobs", "/services", "/profile", "/login", "/register", "/maintenance"];

  useEffect(() => {
    const fetchUserSessionAndRole = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setUserId(null);
          setUserRole(null);
          
          // Jika rute saat ini tidak termasuk rute publik, baru tendang ke login
          const isCurrentRoutePublic = publicRoutes.some(route => 
            pathname === route || pathname.startsWith(`${route}/`)
          );
          
          if (!isCurrentRoutePublic && pathname !== "/general-dashboard") {
            router.push("/login");
          }
          return;
        }

        setUserId(user.id);

        // Ambil data profile dari tabel public.profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("role") 
          .eq("id", user.id)
          .maybeSingle();

        if (profile && profile.role) {
          setUserRole(profile.role.toLowerCase());
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSessionAndRole();
  }, [pathname, router]);

  useEffect(() => {
    if (!userId) return;

    const fetchUnreadNotifications = async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (!error) setUnreadCount(count || 0);
    };

    fetchUnreadNotifications();

    // Opsional: Tambahkan realtime subscription agar angka update otomatis
    const channel = supabase
      .channel('notifications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, 
      () => fetchUnreadNotifications())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  // Tutup sidebar otomatis saat berpindah halaman (khusus mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const allNavLinks = [
    { href: "/general-dashboard", label: "Dashboard Umum", icon: <FiHome />, roles: ["employer", "worker", "guest"] },
    { href: "/maintenance", label: "Berita", icon: <TbNews />, roles: ["employer", "worker", "guest"] },
    { href: "/employer", label: "Ruang Kerja", icon: <MdWorkspacesOutline />, roles: ["employer"] },
    { href: "/worker", label: "Ruang Kerja", icon: <MdWorkspacesOutline />, roles: ["worker"] },
    { href: "/jobs", label: "Pekerjaan", icon: <FiBriefcase />, roles: ["employer", "worker", "guest"] },
    { href: "/services", label: "Jasa", icon: <FiBriefcase />, roles: ["employer", "worker", "guest"] },
    { href: "/history", label: "Riwayat", icon: <MdHistory />, roles: ["employer", "worker"] },
    { href: "/notification", label: "Notifikasi", icon: <FiBell />, roles: ["employer", "worker"] },
    { href: "/profile", label: "Profil", icon: <FiUser />, roles: ["employer", "worker", "guest"] },
    { href: "/settings", label: "Pengaturan", icon: <FiSettings />, roles: ["employer", "worker"] },
  ];

  // Filter menu sidebar berdasarkan status login dan role
  const filteredLinks = allNavLinks.filter(link => {
    const currentRole = userRole || "guest";
    // Untuk halaman profil dinamis, cek kecocokan rute induknya
    if (link.href === "/profile") {
      return link.roles.includes(currentRole);
    }
    return link.roles.includes(currentRole);
  });

  // Tentukan apakah halaman saat ini dikunci hak aksesnya
  const currentRouteConfig = allNavLinks.find(link => {
    if (link.href === "/general-dashboard") return pathname === "/general-dashboard";
    return pathname.startsWith(link.href);
  });
  
  let isAuthorized = true;
  if (!loading && currentRouteConfig) {
    const currentRole = userRole || "guest";
    isAuthorized = currentRouteConfig.roles.includes(currentRole);
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success("Berhasil keluar akun.");
      router.push("/");
      router.refresh();
    }
  };

  // Cek jika halaman saat ini adalah landing page utama (/), auth (/login, /register), maka bypass layout sidebar
  const isAuthOrLandingPage = ["/", "/login", "/register"].includes(pathname);

  if (isAuthOrLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 relative w-full">
      {/* HEADER UNTUK MOBILE (Hanya muncul di hp < 1024px) */}
      <div className="lg:hidden fixed top-0 inset-x-0 bg-white border-b border-gray-200 h-16 px-4 flex items-center justify-between z-40 shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-blue-600 text-white rounded-lg shadow-md focus:outline-none"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        
        {/* Render Judul Dinamis KaryaMandiri di Tengah Atas Navbar Mobile */}
        <div className="font-bold text-xl text-blue-600 pr-2">
          {userRole === "employer" || userRole === "worker" ? (
            "KaryaMandiri"
          ) : (
            <Link href="/">KaryaMandiri</Link>
          )}
        </div>
        <div className="w-9"></div> {/* Spacer penyeimbang tombol hamburger agar judul tetap center */}
      </div>

      {/* OVERLAY Mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:block lg:pt-0 pt-10
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 hidden lg:block">
            {userRole === "employer" || userRole === "worker" ? (
                <h1 className="text-2xl font-bold text-blue-600">
                    KaryaMandiri
                </h1>
            ) : (
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    KaryaMandiri
                </Link>
            )}
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-6">
          {filteredLinks.map((link) => {
            const targetHref = link.href === "/profile" 
              ? (userId ? `/profile/${userId}` : '/login') 
              : link.href;
            
            const isActive = pathname.startsWith(link.href);
            
            return (
              <Link
                key={link.href}
                href={targetHref}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {link.icon} {link.label}
                </div>
                
                {/* Indikator Notifikasi */}
                {link.href === "/notification" && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )
          })}

          {!loading && (!userRole || userRole === "guest") && (
            <Link
              href="/"
              className="flex items-center gap-3 p-3 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors mt-4 border border-dashed border-blue-200 font-semibold text-sm"
            >
              <FiHome /> Kembali ke Beranda Utama
            </Link>
          )}

          {/* Tombol keluar hanya muncul jika id user sudah terverifikasi ada */}
          {!loading && userId && (
            <button
              onClick={handleLogout}
              className="flex flex-center justify-center items-center gap-3 p-3 w-full text-red-600 rounded-lg hover:bg-red-100 transition-colors text-center mt-2"
            >
              <FiLogOut className="mt-1" /> Keluar dari Akun
            </button>
          )}
        </nav>
      </aside>

      {/* AREA MAIN */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-4 md:p-4 pt-20 lg:pt-4 flex-1">
          {!isAuthorized && !loading ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl p-8 border border-slate-200 shadow-sm my-4 max-w-2xl mx-auto text-center h-fit">
              <h2 className="text-2xl font-black text-slate-900 mb-2">Akses Terbatas</h2>
              <p className="text-slate-500 max-w-sm mb-6 text-sm">
                Silakan login menggunakan akun yang sesuai untuk accessing halaman <span className="font-semibold text-slate-800">{pathname}</span>.
              </p>
              <Link href="/login" className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md">
                Login Sekarang
              </Link>
            </div>
          ) : (
            children
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
}