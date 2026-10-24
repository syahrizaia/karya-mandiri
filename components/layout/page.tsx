"use client";

import Link from "next/link";
import { FiBriefcase, FiHome, FiSettings, FiBell, FiMenu, FiX, FiLogOut, FiMoon, FiSun, FiDownload, FiLogIn } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import Footer from "@/components/footer/page";
import { MdHistory, MdWorkspacesOutline } from "react-icons/md";
import { useState, useEffect, useSyncExternalStore } from "react";
import supabase from "@/lib/db";
import { toast } from "sonner";
import { TbNews } from "react-icons/tb";
import { useTheme } from "next-themes";
import Image from "next/image";

const emptySubscribe = () => () => {};

const PUBLIC_ROUTES = [
  "/", "/general-dashboard", "/news", "/jobs", "/services", "/profile",
  "/login", "/register", "/maintenance", "/help-center", "/terms",
  "/privacy", "/contact", "/how-it-works", "/training", "/security", "/download"
];

const ALL_NAV_LINKS = [
  { href: "/general-dashboard", label: "Dasbor Umum", icon: <FiHome />, roles: ["employer", "worker", "guest"] },
  { href: "/maintenance", label: "Berita", icon: <TbNews />, roles: ["employer", "worker", "guest"] },
  { href: "/employer", label: "Ruang Kerja", icon: <MdWorkspacesOutline />, roles: ["employer"] },
  { href: "/worker", label: "Ruang Kerja", icon: <MdWorkspacesOutline />, roles: ["worker"] },
  { href: "/jobs", label: "Pekerjaan", icon: <FiBriefcase />, roles: ["employer", "worker", "guest"] },
  { href: "/services", label: "Jasa", icon: <FiBriefcase />, roles: ["employer", "worker", "guest"] },
  { href: "/history", label: "Riwayat", icon: <MdHistory />, roles: ["employer", "worker"] },
  { href: "/notification", label: "Notifikasi", icon: <FiBell />, roles: ["employer", "worker"] },
  { href: "/settings", label: "Pengaturan", icon: <FiSettings />, roles: ["employer", "worker"] },
];

export default function ClientDashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ full_name: string; avatar_url: string } | null>(null);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const isDarkMode = theme === "dark";

  useEffect(() => {
    const fetchUserSessionAndRole = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setUserId(null);
          setUserRole(null);
          setUserProfile(null);
          const isCurrentRoutePublic = PUBLIC_ROUTES.some(route => 
            pathname === route || pathname.startsWith(`${route}/`)
          );
          if (!isCurrentRoutePublic) {
            router.push("/login");
          }
          return;
        }

        setUserId(user.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name, avatar_url") 
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          setUserRole(profile.role?.toLowerCase() || null);
          setUserProfile({
            full_name: profile.full_name || "User",
            avatar_url: profile.avatar_url || ""
          });
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
    const channel = supabase
      .channel('notifications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, 
      () => fetchUnreadNotifications())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const filteredLinks = ALL_NAV_LINKS.filter(link => {
    const currentRole = userRole || "guest";
    return link.roles.includes(currentRole);
  });

  const currentRouteConfig = ALL_NAV_LINKS.find(link => {
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

  const isAuthOrLandingPage = ["/", "/login", "/register"].includes(pathname);

  if (isAuthOrLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50/60 dark:bg-slate-950/65 relative w-full transition-colors duration-300">
      <div className="lg:hidden fixed top-0 inset-x-0 bg-white/75 dark:bg-slate-900/75 backdrop-blur-2xl border-b border-white/30 dark:border-white/10 h-16 px-4 flex items-center justify-between z-40 shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="p-2 bg-blue-600/90 hover:bg-blue-600 text-white rounded-xl shadow-md backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <div className="font-black text-xl bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent pr-2">
          {userRole === "employer" || userRole === "worker" ? "KaryaMandiri" : <Link href="/">KaryaMandiri</Link>}
        </div>
        <div className="w-9"></div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside id="mobile-navigation" className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white/70 dark:bg-slate-900/65 backdrop-blur-2xl border-r border-white/30 dark:border-white/10 flex flex-col transition-all duration-300 ease-in-out shadow-[4px_0_30px_rgba(0,0,0,0.05)]
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:block lg:pt-0 pt-10
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 hidden lg:block">
          {userRole === "employer" || userRole === "worker" ? (
            <p className="text-2xl font-black bg-linear-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">KaryaMandiri</p>
          ) : (
            <Link href="/" className="text-2xl font-black bg-linear-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">KaryaMandiri</Link>
          )}
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pb-6" aria-label="Navigasi utama">
          {filteredLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 text-sm font-semibold ${
                  isActive 
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_20px_rgba(37,99,235,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] scale-[1.02]' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/5 hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{link.icon}</span> 
                  <span>{link.label}</span>
                </div>
                {link.href === "/notification" && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce shadow-md">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )
          })}

          <div className="mt-4 pt-4 border-t border-white/20 dark:border-white/10">
            <Link
              href="/download"
              className="flex items-center gap-3 p-3 mb-2 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-white/60 dark:hover:bg-white/5 transition-all text-sm font-semibold"
            >
              <FiDownload className="text-lg text-blue-500" />
              <span>Unduh Aplikasi</span>
            </Link>

            <button 
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
              aria-label={mounted && isDarkMode ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
              className="flex w-full items-center justify-between p-3 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-white/60 dark:hover:bg-white/5 transition-all text-sm font-semibold"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg text-amber-500">{mounted && isDarkMode ? <FiSun /> : <FiMoon />}</span>
                <span>{mounted && isDarkMode ? "Mode Terang" : "Mode Gelap"}</span>
              </div>
              <div className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${mounted && isDarkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                <div className={`bg-white w-3 h-3 rounded-full transition-transform ${mounted && isDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

          {/* SISI USER BELUM LOGIN (GUEST) */}
          {!loading && (!userRole || userRole === "guest") && (
            <>
              <Link
                href="/"
                className="flex items-center gap-3 p-3 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-50/70 dark:hover:bg-slate-800/50 transition-all mt-2 border border-blue-200/50 dark:border-blue-900/50 font-bold text-sm"
              >
                <FiHome /> Beranda Utama
              </Link>
              
              {/* TOMBOL LOGIN BARU */}
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 p-3 text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl hover:opacity-95 transition-all mt-2 font-bold text-sm shadow-[0_4px_20px_rgba(37,99,235,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)]"
              >
                <FiLogIn /> Login / Masuk
              </Link>
            </>
          )}

          {/* Profil User Section */}
          {!loading && userId && userProfile && (
            <Link 
              href={`/profile/${userId}`} 
              className="flex items-center gap-3 p-3 mt-4 mb-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all border border-white/40 dark:border-white/10 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold overflow-hidden shadow-inner shrink-0">
                {userProfile.avatar_url ? (
                  <Image src={userProfile.avatar_url} alt={`Foto profil ${userProfile.full_name}`} className="w-full h-full object-cover" width={40} height={40} />
                ) : (
                  userProfile.full_name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex flex-col truncate">
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{userProfile.full_name}</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold capitalize">{userRole}</span>
              </div>
            </Link>
          )}

          {!loading && userId && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 w-full text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-500/10 transition-colors mt-2 text-sm font-semibold"
            >
              <FiLogOut /> Keluar
            </button>
          )}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-4 md:p-6 pt-20 lg:pt-6 flex-1">
          {!isAuthorized && !loading ? (
            <div className="flex-1 flex flex-col items-center justify-center glass-panel rounded-3xl p-8 shadow-xl my-4 max-w-2xl mx-auto text-center h-fit">
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-2">Akses Terbatas</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6 text-sm">
                Silakan login untuk mengakses halaman ini.
              </p>
              <Link href="/login" className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
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