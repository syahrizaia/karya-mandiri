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
  FiMoreVertical
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
import ProfileSkeleton from '@/components/ui/skeleton-profile/page';

// Sub-komponen untuk baris pengaturan
const SettingsItem = ({ label, value, status, onClick }: { label: string, value: string, status: string, onClick?: () => void }) => (
  <div className="p-6 flex justify-between items-center hover:bg-slate-50 transition cursor-pointer" onClick={onClick}>
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{value}</p>
    </div>
    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
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

  // State mandiri untuk menampung data user login asli
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
    avatarUrl: "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff", // Default avatar fallback
    bannerUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200", // Default banner fallback
    joinedDate: "Memuat tanggal...",
  });

  const fetchCurrentProfile = async () => {
    try {
      setLoading(true);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .maybeSingle();

      // Abaikan error "Row not found" (PGRST116) karena user baru mungkin belum punya row di tabel profiles
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Database Error:", profileError);
      }

      if (profileError) {
        console.error("Database Error:", profileError);
        toast.error("Gagal memuat profil.");
        return;
      }

      if (!profile) {
        toast.error("Profil tidak ditemukan.");
        return;
      }

      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;

      const ownsProfile = !!(currentUser && currentUser.id === profileId);
      setIsOwnProfile(ownsProfile);

      // Siapkan variabel nama untuk generator avatar
      const fallbackName = currentUser?.user_metadata?.full_name || "Pengguna KaryaMandiri";
      const generatedAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=0D8ABC&color=fff&size=256`;

      const displayPhone = ownsProfile 
        ? (profile?.phone || currentUser?.user_metadata?.phone || "Nomor telepon tidak tersedia") 
        : "Nomor telepon disembunyikan";

      const displayEmail = profile?.email || currentUser?.email || "Email tidak tersedia";

      const rawJoinedDate = profile?.created_at;

      // Jika profile belum terbentuk di DB, gunakan data fallback metadata auth
      setUserData({
        full_name: profile?.full_name || currentUser?.user_metadata?.full_name || fallbackName,
        email: displayEmail,
        phone: displayPhone,
        role: profile?.role || currentUser?.user_metadata?.role || "worker",
        bio: (profile as any)?.bio || "Belum ada bio profil. Ceritakan sedikit tentang diri Anda.",
        location: (profile as any)?.location || "Belum mengatur lokasi.",
        skills: (profile as any)?.skills || [],
        isVerified: (profile as any)?.is_verified || false,
        balance: (profile as any)?.balance || 0,
        avatarUrl: (profile as any)?.avatar_url || generatedAvatar,
        bannerUrl: (profile as any)?.banner_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200",
        joinedDate: rawJoinedDate 
          ? new Date(rawJoinedDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
          : "Baru Saja",
      });

    } catch (err: any) {
      console.error("Error mengambil data profil:", err.message);
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
     return <ProfileSkeleton isOwnProfile={isOwnProfile} />;
   }

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:pt-12 lg:pt-0">
      {/* BANNER PERINGATAN VERIFIKASI AKUN (Hanya muncul jika profil milik sendiri & belum verifikasi) */}
      {isOwnProfile && !userData.isVerified && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-2xl shrink-0 mt-0.5 sm:mt-0">
              <FiShield size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Akun Anda Belum Terverifikasi</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Segera lakukan verifikasi akun untuk membuka akses penuh fitur lamar kerja crowdsourcing, jaminan sistem escrow aman, dan penarikan saldo dompet tanpa kendala.
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Lengkapi data Nama Lengkap, Nomor Telepon, dan Email untuk proses verifikasi yang cepat dan mudah.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSubModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Verifikasi Sekarang
          </button>
        </div>
      )}

      {/* Profil Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="relative h-48 w-full">
          <Image
              src={userData.bannerUrl}
              alt={userData.full_name}
              fill
              className="object-cover"
              priority
            />
            {isOwnProfile && (
              <button
                className="flex items-center gap-2 p-2 absolute bottom-2 right-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
                onClick={() => setShowMediaBanner(true)}
              >
                <FiCamera size={18} />
              </button>
            )}
        </div>
        <div className="px-6 pb-6">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative w-32 h-32">
              <Image
                src={userData.avatarUrl} 
                alt={userData.full_name} 
                fill
                className="rounded-2xl border-4 border-white bg-white shadow-md object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {isOwnProfile && (
                <button
                  className="flex items-center gap-2 p-2 absolute -top-2 -right-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
                  onClick={() => setShowMediaProfile(true)}
                >
                  <FiCamera size={18} />
                </button>
              )}
              {(userData.isVerified || (userData as any).is_verified) && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white z-10 shadow-sm animate-in zoom-in-50 duration-200">
                  <MdVerified size={16} />
                </div>
              )}
            </div>

            {/* Flex container untuk tombol aksi (Desktop & Mobile) */}
            <div className="relative flex items-center gap-2">
              <div className="hidden md:grid md:grid-cols-2 items-center gap-2">
                <ShareProfileButton 
                  profileId={profileId} 
                  fullName={userData.full_name} 
                />
                {isOwnProfile && (
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
                    onClick={() => setShowEditProfile(true)}
                  >
                    <FiEdit2 size={18} /> Edit Profil
                  </button>
                )}
              </div>

              <div className="md:hidden relative">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition focus:outline-hidden"
                  aria-label="Menu Opsi"
                >
                  <FiMoreVertical size={20} />
                </button>

                {/* Dropdown Menu Popup */}
                {showMobileMenu && (
                  <>
                    {/* Backdrop transparan untuk menutup menu saat area luar diklik */}
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setShowMobileMenu(false)} 
                    />
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                      
                      {/* Opsi Bagian 1: Share Profile (Selalu Muncul untuk Semua Pengunjung) */}
                      <div className="px-2 pb-1 border-b border-slate-100">
                        <ShareProfileButton 
                          profileId={profileId} 
                          fullName={userData.full_name} 
                        />
                      </div>

                      {/* Opsi Bagian 2: Edit Profil (Hanya Muncul Jika Pemilik Akun) */}
                      {isOwnProfile && (
                        <div className="px-2 pt-1">
                          <button
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 font-semibold rounded-xl transition"
                            onClick={() => {
                              setShowEditProfile(true);
                              setShowMobileMenu(false); // Tutup menu setelah diklik
                            }}
                          >
                            <FiEdit2 size={16} className="text-slate-500" /> 
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

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-900">{userData.full_name}</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                {userData.role}
              </span>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">{userData.bio}</p>
          </div>

          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-slate-100 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <FiMapPin className="text-blue-500" /> {userData.location}
            </div>
            <div className="flex items-center gap-2">
              <FiMail className="text-blue-500" /> {userData.email}
            </div>
            <div className="flex items-center gap-2">
              <FiPhone className="text-blue-500" /> {userData.phone}
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-blue-500" /> Bergabung {userData.joinedDate}
            </div>
          </div>
        </div>
      </div>

      <div className={'grid grid-cols-1 gap-6 ' + (isOwnProfile ? 'md:grid-cols-3' : 'md:grid-cols-1')}>
        {/* Sisi Kiri: Skills & Trust */}
        <div className={isOwnProfile ? 'md:col-span-1 space-y-6' : 'space-y-6'}>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FiShield className="text-blue-600" /> Keahlian
              </h2>
              {/* Tombol Tambah / Edit Keahlian */}
              {isOwnProfile && (
                <button
                  onClick={() => setShowManageSkills(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                >
                  <FiEdit2 size={12} /> Kelola
                </button>
              )}
            </div>

            {/* Daftar Tag Keahlian */}
            <div className="flex flex-wrap gap-2">
              {userData.skills.length > 0 ? (
                userData.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">Belum mengisi keahlian</span>
              )}
            </div>
          </div>

          {isOwnProfile && (
            <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
              <h2 className="text-sm font-semibold opacity-80 mb-1 flex items-center gap-2">
                Saldo Dompet
              </h2>
              <p className="text-3xl font-bold">Rp{userData.balance.toLocaleString("id-ID")}</p>
              <button
                className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition backdrop-blur-sm"
                onClick={() => setShowSubModal(true)}
              >
                Tarik Tunai
              </button>
            </div>
          )}
        </div>

        {/* Sisi Kanan: Pengaturan & Keamanan */}
        <div className={isOwnProfile ? 'md:col-span-2' : ''}>
          {isOwnProfile ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-900">Keamanan & Privasi</h2>
                <p className="text-sm text-slate-500">Kelola informasi akun dan kata sandi Anda.</p>
              </div>
              <SettingsItem 
                label="Verifikasi Identitas (KTP)" 
                value={userData.isVerified ? "Terverifikasi" : "Belum Verifikasi"} 
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
                label="Metode Pembayaran" 
                value="Bank Central Asia (BCA)" 
                status="success"
                onClick={() => setShowSubModal(true)}
              />
            </div>
          ) : (
            /* Opsional: Tampilan alternatif jika pengunjung adalah orang lain/guest */
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center text-slate-500 italic">
              Terima kasih telah mengunjungi profil saya. Jika ada keperluan bisnis atau kerja sama, silakan hubungi saya melalui kontak di atas.
            </div>
          )}
        </div>
      </div>
      
      <EditProfilePhotoDialog 
        open={showMediaProfile} 
        onOpenChange={setShowMediaProfile} 
        currentAvatar={userData.avatarUrl} 
        onSuccess={fetchCurrentProfile}
      />
      <EditProfileBannerDialog 
        open={showMediaBanner} 
        onOpenChange={setShowMediaBanner} 
        currentBanner={userData.bannerUrl} 
        onSuccess={fetchCurrentProfile}
      />
      <EditProfileDialog open={showEditProfile} onOpenChange={setShowEditProfile} userData={userData} onSuccess={() => {}} />
      <ManageSkillsDialog open={showManageSkills} onOpenChange={setShowManageSkills} currentSkills={userData.skills} onSuccess={() => {}} />
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>
  );
};

export default Profile;