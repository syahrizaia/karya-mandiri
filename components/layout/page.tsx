/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { FiBriefcase, FiHome, FiSettings, FiBell, FiMenu, FiX, FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import Footer from "@/components/footer/page";
import { MdHistory, MdWorkspacesOutline } from "react-icons/md";
import { useState, useEffect } from "react";
import supabase from "@/lib/db";
import { toast } from "sonner";
import { TbNews } from "react-icons/tb";
import { useTheme } from "next-themes";
import Image from "next/image";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = theme === "dark";

  const publicRoutes = [
    "/", "/general-dashboard", "/news", "/jobs", "/services", "/profile", 
    "/login", "/register", "/maintenance", "/help-center", "/terms", 
    "/privacy", "/contact", "/how-it-works", "/training", "/security", "/download"
  ];

  useEffect(() => {
    const fetchUserSessionAndRole = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setUserId(null);
          setUserRole(null);
          const isCurrentRoutePublic = publicRoutes.some(route => 
            pathname === route || pathname.startsWith(`${route}/`)
          );
          if (!isCurrentRoutePublic && pathname !== "/general-dashboard") {
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

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const allNavLinks = [
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

  const filteredLinks = allNavLinks.filter(link => {
    const currentRole = userRole || "guest";
    return link.roles.includes(currentRole);
  });

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

  const isAuthOrLandingPage = ["/", "/login", "/register"].includes(pathname);

  if (isAuthOrLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-950 relative w-full transition-colors duration-300">
      <div className="lg:hidden fixed top-0 inset-x-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 h-16 px-4 flex items-center justify-between z-40 shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-blue-600 text-white rounded-lg shadow-md focus:outline-none"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <div className="font-bold text-xl text-blue-600 pr-2">
          {userRole === "employer" || userRole === "worker" ? "KaryaMandiri" : <Link href="/">KaryaMandiri</Link>}
        </div>
        <div className="w-9"></div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:block lg:pt-0 pt-10
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 hidden lg:block">
          {userRole === "employer" || userRole === "worker" ? (
            <h1 className="text-2xl font-bold text-blue-600">KaryaMandiri</h1>
          ) : (
            <Link href="/" className="text-2xl font-bold text-blue-600">KaryaMandiri</Link>
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
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {link.icon} {link.label}
                </div>
                {link.href === "/notification" && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )
          })}

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
              className="flex w-full items-center justify-between p-3 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? <FiSun /> : <FiMoon />} 
                <span>{isDarkMode ? "Mode Terang" : "Mode Gelap"}</span>
              </div>
              <div className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${mounted && isDarkMode ? 'bg-blue-600' : 'bg-slate-300'}`}>
                <div className={`bg-white w-3 h-3 rounded-full transition-transform ${mounted && isDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

          {!loading && (!userRole || userRole === "guest") && (
            <Link
              href="/"
              className="flex items-center gap-3 p-3 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors mt-2 border border-dashed border-blue-200 dark:border-blue-900/50 font-semibold text-sm"
            >
              <FiHome /> Beranda Utama
            </Link>
          )}

          {/* Profil User Section */}
          {!loading && userId && userProfile && (
            <Link 
              href={`/profile/${userId}`} 
              className="flex items-center gap-3 p-3 mt-4 mb-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-800"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold overflow-hidden border border-blue-100 dark:border-blue-800">
                {userProfile.avatar_url ? (
                  <Image src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" width={40} height={40} />
                ) : (
                  userProfile.full_name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex flex-col truncate">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{userProfile.full_name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{userRole}</span>
              </div>
            </Link>
          )}

          {!loading && userId && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 w-full text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors mt-2"
            >
              <FiLogOut /> Keluar
            </button>
          )}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-4 md:p-4 pt-20 lg:pt-4 flex-1">
          {!isAuthorized && !loading ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm my-4 max-w-2xl mx-auto text-center h-fit">
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-2">Akses Terbatas</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6 text-sm">
                Silakan login untuk mengakses halaman ini.
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