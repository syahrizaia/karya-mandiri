/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, use } from 'react';
import { 
  FiEdit2, 
  FiMapPin, 
  FiCalendar, 
  FiMail, 
  FiShield,
  FiCamera,
  FiPhone,
  FiMoreVertical,
  FiBriefcase,
  FiStar,
  FiFolder,
  FiCheckCircle,
  FiAward
} from 'react-icons/fi';
import Image from 'next/image';
import SubscriptionDialog from '../../../../components/subscription/page';
import { MdVerified } from 'react-icons/md';
import supabase from '@/lib/db';
import { toast } from 'sonner';
import EditProfileDialog from '@/components/edit-profile/page';
import ManageSkillsDialog from '@/components/manage-skills/page';
import EditProfilePhotoDialog from '@/components/edit-profile-photo/page';
import EditProfileBannerDialog from '@/components/edit-profile-banner/page';
import ShareProfileButton from '@/components/ui/share-profile-button/page';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ManagePortofolio from '@/components/manage-portofolio/page';

const SettingsItem = ({ label, value, status, onClick }: { label: string, value: string, status: string, onClick?: () => void }) => (
  <div className="p-4 sm:p-6 flex justify-between items-center hover:bg-slate-50 transition cursor-pointer" onClick={onClick}>
    <div className="min-w-0 flex-1 pr-2">
      <p className="text-sm font-semibold text-slate-700 truncate">{label}</p>
      <p className="text-xs text-slate-500 mt-0.5 truncate">{value}</p>
    </div>
    <div className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shrink-0 ${
      status === 'success' ? 'bg-green-100 text-green-700' : 
      status === 'warning' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
    }`}>
      {status === 'success' ? 'Aktif' : status === 'warning' ? 'Perlu Tindakan' : 'Atur'}
    </div>
  </div>
);

interface ProfileProps {
  params: Promise<{ id: string }>;
}

const Profile: React.FC<ProfileProps> = ({ params }) => {
  const { id: profileId } = use(params);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showManageSkills, setShowManageSkills] = useState(false);
  const [showMediaProfile, setShowMediaProfile] = useState(false);
  const [showMediaBanner, setShowMediaBanner] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showManagePortfolio, setShowManagePortfolio] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'settings'>('portfolio');

  // State Utama User Profil
  const [userData, setUserData] = useState<{
    full_name: string;
    email: string;
    phone: string;
    role: string;
    bio: string;
    location: string;
    skills: string[];
    isVerified: boolean;
    balance: number;
    avatarUrl: string;
    bannerUrl: string;
    joinedDate: string;
  }>({
    full_name: "Memuat nama...",
    email: "nama@email.com",
    phone: "Memuat nomor...",
    role: "worker",
    bio: "Memuat bio...",
    location: "Memuat lokasi...",
    skills: [],
    isVerified: false,
    balance: 0,
    avatarUrl: "",
    bannerUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200",
    joinedDate: "Memuat tanggal...",
  });

  const [stats, setStats] = useState({ jobCompleted: 0, successRate: 100, rating: 0.0 });
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // Fungsi Helper untuk membuat inisial dari Nama Lengkap
  const getInitials = (name: string) => {
    if (!name) return "KM";
    const cleanName = name.trim();
    const parts = cleanName.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return cleanName.substring(0, 2).toUpperCase();
  };

  const fetchCurrentProfile = async () => {
    try {
      setLoading(true);

      const [profileRes, portfoliosRes, reviewsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', profileId).maybeSingle(),
        supabase.from('portfolios').select('*').eq('user_id', profileId).order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').eq('profile_id', profileId).order('created_at', { ascending: false })
      ]);

      if (profileRes.error && profileRes.error.code !== 'PGRST116') {
        console.error("Profile Fetch Error:", profileRes.error);
        toast.error("Gagal memuat profil.");
        return;
      }

      const profile = profileRes.data;
      if (!profile) {
        toast.error("Profil tidak ditemukan.");
        return;
      }

      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;
      const ownsProfile = !!(currentUser && currentUser.id === profileId);
      setIsOwnProfile(ownsProfile);

      const fallbackName = currentUser?.user_metadata?.full_name || "Pengguna KaryaMandiri";
      const displayPhone = ownsProfile 
        ? (profile?.phone || currentUser?.user_metadata?.phone || "Nomor tidak tersedia") 
        : "Nomor disembunyikan";
      const displayEmail = profile?.email || currentUser?.email || "Email tidak tersedia";
      const rawJoinedDate = profile?.created_at;

      setUserData({
        full_name: profile?.full_name || currentUser?.user_metadata?.full_name || fallbackName,
        email: displayEmail,
        phone: displayPhone,
        role: profile?.role || currentUser?.user_metadata?.role || "worker",
        bio: profile?.bio || "Belum ada bio profil. Ceritakan sedikit tentang diri Anda.",
        location: profile?.location || "Belum mengatur lokasi.",
        skills: profile?.skills || [],
        isVerified: profile?.is_verified || false,
        balance: profile?.balance || 0,
        avatarUrl: profile?.avatar_url || "", // Dikosongkan jika null agar merender inisial teks
        bannerUrl: profile?.banner_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200",
        joinedDate: rawJoinedDate 
          ? new Date(rawJoinedDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
          : "Baru Saja",
      });

      const fetchedPortfolios = portfoliosRes.data || [];
      const fetchedReviews = reviewsRes.data || [];
      setPortfolios(fetchedPortfolios);
      setReviews(fetchedReviews);

      const completedCount = profile?.job_completed || fetchedReviews.length || 0;
      const successRatePercent = profile?.success_rate || 100;
      
      const averageRating = fetchedReviews.length > 0 
        ? parseFloat((fetchedReviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / fetchedReviews.length).toFixed(1))
        : parseFloat((profile?.rating || 0.0).toFixed(1));

      setStats({
        jobCompleted: completedCount,
        successRate: successRatePercent,
        rating: averageRating
      });

    } catch (err: any) {
      console.error("Error global saat memuat profil:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchCurrentProfile();
    }
  }, [profileId]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 px-4 py-4 md:py-12 lg:pt-4 animate-pulse">
        <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-36 sm:h-48 w-full bg-slate-200" />
          <div className="px-4 sm:px-6 pb-6">
            <div className="relative flex justify-between items-end -mt-14 md:-mt-20 mb-4 sm:mb-6">
              {/* Menyesuaikan ukuran skeleton avatar agar tepat sama dengan w-28 h-28 / w-40 h-40 */}
              <div className="w-28 h-28 md:w-40 md:h-40 rounded-3xl border-4 border-white bg-slate-300 shrink-0" />
              <div className="w-24 h-8 bg-slate-200 rounded-xl mb-2 md:mb-4" />
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-slate-300 rounded-md w-1/3" />
              <div className="h-4 bg-slate-200 rounded-md w-2/3" />
            </div>
            <div className="flex flex-wrap gap-4 mt-6 pt-5 border-t border-slate-100">
              <div className="h-4 bg-slate-200 rounded-md w-24" />
              <div className="h-4 bg-slate-200 rounded-md w-32" />
              <div className="h-4 bg-slate-200 rounded-md w-28" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 sm:h-20 bg-slate-200 rounded-2xl border border-slate-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="md:col-span-2 h-44 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 md:py-12 lg:pt-4">
      
      {/* BANNER PERINGATAN VERIFIKASI AKUN */}
      {isOwnProfile && !userData.isVerified && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex gap-3 items-start min-w-0">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-2xl shrink-0 mt-0.5">
              <FiShield size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-800">Akun Anda Belum Terverifikasi</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Segera lakukan verifikasi identitas untuk mendapatkan lencana verifikasi dan membuka akses penuh seluruh fitur crowdsourcing KaryaMandiri. Klik tombol <strong>Edit Profil</strong> untuk  melengkapi data Nama Lengkap dan Nomor Telepon. Sistem akan otomatis memproses verifikasi Anda.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profil Header Card */}
      <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="relative h-36 sm:h-48 w-full">
          <Image
            src={userData.bannerUrl}
            alt={userData.full_name}
            fill
            className="object-cover"
            priority
          />
          {isOwnProfile && (
            <button
              className="flex items-center gap-2 p-2 absolute bottom-3 right-3 bg-white/80 hover:bg-white backdrop-blur-md text-slate-700 rounded-xl font-semibold transition shadow-xs"
              onClick={() => setShowMediaBanner(true)}
            >
              <FiCamera size={16} />
            </button>
          )}
        </div>

        <div className="px-4 sm:px-6 pb-6">
          {/* Baris Foto Profil Besar dan Tombol Aksi */}
          <div className="relative flex justify-between items-end -mt-14 md:-mt-20 mb-4 sm:mb-6">            
            <div className="relative w-28 h-28 md:w-40 md:h-40 shrink-0">
              {/* LOGIK KONDISIONAL FOTO PROFIL / INISIAL TEKS */}
              {userData.avatarUrl ? (
                <Image
                  src={userData.avatarUrl} 
                  alt={userData.full_name} 
                  fill
                  className="rounded-3xl border-4 border-white bg-white shadow-md object-cover"
                  sizes="(max-width: 768px) 112px, 160px"
                  priority
                />
              ) : (
                <div className="w-full h-full rounded-3xl border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md flex items-center justify-center text-white text-3xl md:text-5xl font-black tracking-wide select-none">
                  {getInitials(userData.full_name)}
                </div>
              )}
              
              {isOwnProfile && (
                <button
                  className="flex items-center gap-2 p-2 absolute -top-1 -right-1 bg-white text-slate-700 rounded-xl border border-slate-200 shadow-xs hover:bg-slate-50 transition-all z-10"
                  onClick={() => setShowMediaProfile(true)}
                >
                  <FiCamera size={14} />
                </button>
              )}
              {userData.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white z-10 shadow-sm">
                  <MdVerified size={16} />
                </div>
              )}
            </div>

            {/* Tombol Menu / Aksi Kanan */}
            <div className="relative flex items-center gap-2 mb-2 md:mb-4">
              <div className="hidden md:flex items-center gap-2">
                <ShareProfileButton profileId={profileId} fullName={userData.full_name} />
                {isOwnProfile && (
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition shadow-xs"
                    onClick={() => setShowEditProfile(true)}
                  >
                    <FiEdit2 size={14} /> Edit Profil
                  </button>
                )}
              </div>

              <div className="md:hidden relative">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2.5 sm:p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition focus:outline-hidden"
                  aria-label="Menu Opsi"
                >
                  <FiMoreVertical size={18} />
                </button>
                {showMobileMenu && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowMobileMenu(false)} />
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-2 pb-1 border-b border-slate-100">
                        <ShareProfileButton profileId={profileId} fullName={userData.full_name} />
                      </div>
                      {isOwnProfile && (
                        <div className="px-2 pt-1">
                          <button
                            className="w-full flex items-center gap-3 px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 font-bold rounded-xl transition"
                            onClick={() => {
                              setShowEditProfile(true);
                              setShowMobileMenu(false);
                            }}
                          >
                            <FiEdit2 size={14} className="text-slate-500" /> 
                            <span>Edit Profil</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 break-words max-w-full">{userData.full_name}</h1>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 text-[9px] font-bold rounded-sm uppercase tracking-wider shrink-0">
                {userData.role}
              </span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed break-words whitespace-pre-wrap mt-2 text-justify">{userData.bio}</p>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-5 pt-5 border-t border-slate-100 text-[11px] sm:text-xs text-slate-500 font-medium overflow-hidden">
            <div className="flex items-center gap-1.5 min-w-0 max-w-full"><FiMapPin className="text-slate-400 shrink-0" /> <span className="truncate">{userData.location}</span></div>
            <div className="flex items-center gap-1.5 min-w-0 max-w-full"><FiMail className="text-slate-400 shrink-0" /> <span className="truncate">{userData.email}</span></div>
            <div className="flex items-center gap-1.5 min-w-0 max-w-full"><FiPhone className="text-slate-400 shrink-0" /> <span className="truncate">{userData.phone}</span></div>
            <div className="flex items-center gap-1.5 min-w-0 max-w-full"><FiCalendar className="text-slate-400 shrink-0" /> <span className="whitespace-nowrap">Bergabung {userData.joinedDate}</span></div>
          </div>
        </div>
      </div>

      {/* KARTU STRATEGIS STATISTIK PERFORMA */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl flex items-center gap-3 shadow-xs min-w-0">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl hidden sm:block shrink-0"><FiBriefcase size={18}/></div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Selesai</p>
            <p className="text-base sm:text-2xl font-black text-slate-800 truncate">{stats.jobCompleted}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl flex items-center gap-3 shadow-xs min-w-0">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl hidden sm:block shrink-0"><FiCheckCircle size={18}/></div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Sukses</p>
            <p className="text-base sm:text-2xl font-black text-green-600 truncate">{stats.successRate}%</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl flex items-center gap-3 shadow-xs min-w-0">
          <div className="p-3 bg-yellow-50 text-yellow-500 rounded-xl hidden sm:block shrink-0"><FiStar size={18}/></div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Rating</p>
            <p className="text-base sm:text-2xl font-black text-slate-800 flex items-center gap-1 truncate">
              {stats.rating > 0 ? stats.rating : "-"} 
              <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">/5.0</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sisi Kiri: Skills & Wallet */}
        <div className="space-y-6 w-full min-w-0">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FiAward className="text-blue-600" /> Keahlian
              </h2>
              {isOwnProfile && (
                <button
                  onClick={() => setShowManageSkills(true)}
                  className="text-[11px] font-bold text-blue-600 hover:underline transition-colors flex items-center gap-1"
                >
                  Kelola
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {userData.skills.length > 0 ? (
                userData.skills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200 break-words max-w-full">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">Belum mengisi keahlian</span>
              )}
            </div>
          </div>

          {isOwnProfile && (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 sm:p-6 rounded-2xl shadow-md text-white">
              <h2 className="text-xs font-semibold opacity-80 mb-1">Saldo Dompet</h2>
              <p className="text-2xl sm:text-3xl font-black truncate">Rp{userData.balance.toLocaleString("id-ID")}</p>
              <button
                className="w-full mt-4 py-2.5 bg-white/20 hover:bg-white/30 text-xs font-bold rounded-xl transition backdrop-blur-xs"
                onClick={() => setShowSubModal(true)}
              >
                Tarik Tunai Dana
              </button>
            </div>
          )}
        </div>

        {/* Sisi Kanan: SISTEM TAB PANEL */}
        <div className="md:col-span-2 space-y-4 w-full min-w-0">
          <div className="flex overflow-x-auto whitespace-nowrap border-b border-slate-200 bg-white px-2 pt-4 rounded-t-2xl border border-b-0 border-slate-200 scrollbar-none">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`pb-3 px-3 sm:px-4 text-xs font-bold tracking-wide uppercase border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'portfolio' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <FiFolder /> Portofolio ({portfolios.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-3 sm:px-4 text-xs font-bold tracking-wide uppercase border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <FiStar /> Ulasan ({reviews.length})
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-3 px-3 sm:px-4 text-xs font-bold tracking-wide uppercase border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <FiShield /> Privasi
              </button>
            )}
          </div>

          {/* PANEL 1: PORTOFOLIO */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4 w-full">
              {isOwnProfile && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowManagePortfolio(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                  >
                    <FiFolder /> Kelola Portofolio
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                {portfolios.length > 0 ? (
                  portfolios.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-blue-300 transition-all shadow-2xs w-full">
                      <div className="relative h-36 bg-slate-100 w-full">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-105 transition duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300"><FiFolder size={32}/></div>
                        )}
                      </div>
                      <div className="p-4 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 mt-2 line-clamp-1 break-words">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 break-words">{item.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400 italic">
                    Belum ada portofolio karya yang diunggah.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PANEL 2: ULASAN */}
          {activeTab === 'reviews' && (
            <div className="space-y-3 animate-in fade-in duration-200 w-full">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-4 sm:p-5 border border-slate-200 rounded-2xl shadow-2xs space-y-2 w-full min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{rev.client_name || "Klien Anonim"}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {rev.created_at ? new Date(rev.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Baru saja"}
                        </p>
                      </div>
                      <div className="flex text-yellow-400 gap-0.5 shrink-0">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                          <FiStar key={i} size={12} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic break-words">&quot;{rev.comment}&quot;</p>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400 italic">
                  Belum memiliki riwayat ulasan dari klien.
                </div>
              )}
            </div>
          )}

          {/* PANEL 3: PENGATURAN PRIVASI */}
          {activeTab === 'settings' && isOwnProfile && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden animate-in fade-in duration-200 w-full">
              <SettingsItem 
                label="Verifikasi Identitas (KTP)" 
                value={userData.isVerified ? "Terverifikasi Resmi" : "Belum Verifikasi"} 
                status={userData.isVerified ? "success" : "warning"}
                onClick={() => setShowSubModal(true)}
              />
              <SettingsItem 
                label="Autentikasi Dua Faktor" 
                value="Non-aktif" 
                status="default"
                onClick={() => setShowSubModal(true)}
              />
              <SettingsItem 
                label="Metode Rekening Utama" 
                value="Bank Central Asia (BCA)" 
                status="success"
                onClick={() => setShowSubModal(true)}
              />
            </div>
          )}
        </div>
      </div>
      
      <EditProfilePhotoDialog open={showMediaProfile} onOpenChange={setShowMediaProfile} currentAvatar={userData.avatarUrl} onSuccess={fetchCurrentProfile} />
      <EditProfileBannerDialog open={showMediaBanner} onOpenChange={setShowMediaBanner} currentBanner={userData.bannerUrl} onSuccess={fetchCurrentProfile} />
      <EditProfileDialog open={showEditProfile} onOpenChange={setShowEditProfile} userData={userData} onSuccess={fetchCurrentProfile} />
      <ManageSkillsDialog open={showManageSkills} onOpenChange={setShowManageSkills} currentSkills={userData.skills} onSuccess={fetchCurrentProfile} />
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
      <Dialog open={showManagePortfolio} onOpenChange={setShowManagePortfolio}>
      <DialogContent className="max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>Kelola Portofolio</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ManagePortofolio userId={profileId} />
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default Profile;