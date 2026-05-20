/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { 
  FiEdit2, 
  FiMapPin, 
  FiCalendar, 
  FiMail, 
  FiShield,
  FiCamera
} from 'react-icons/fi';
import Image from 'next/image';
import SubscriptionDialog from '../../../components/subscription/page';
import { MdVerified } from 'react-icons/md';
import supabase from '@/lib/db';
import { toast } from 'sonner';
import EditProfileDialog from '@/components/edit-profile/page';
import ManageSkillsDialog from '@/components/manage-skills/page';
import EditProfilePhotoDialog from '@/components/edit-profile-photo/page';
import EditProfileBannerDialog from '@/components/edit-profile-banner/page';

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

const Profile: React.FC = () => {
  const [, setLoading] = useState(true);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showManageSkills, setShowManageSkills] = useState(false);
  const [showMediaProfile, setShowMediaProfile] = useState(false);
  const [showMediaBanner, setShowMediaBanner] = useState(false);

  // State mandiri untuk menampung data user login asli
  const [userData, setUserData] = useState<{
    full_name: string;
    email: string;
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
    email: "",
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

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        // Ambil info akun dari session Supabase Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        if (!user) {
          toast.error("Sesi habis, silakan login kembali.");
          return;
        }

        // Ambil data spesifik role & pelengkap dari tabel public.profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Abaikan error "Row not found" (PGRST116) karena user baru mungkin belum punya row di tabel profiles
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Database Error:", profileError);
        }

        // Siapkan variabel nama untuk generator avatar
        const fallbackName = user.user_metadata?.full_name || "Pengguna KaryaMandiri";
        const generatedAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=0D8ABC&color=fff&size=256`;

        // Jika profile belum terbentuk di DB, gunakan data fallback metadata auth
        setUserData({
          full_name: profile?.full_name || user.user_metadata?.full_name || fallbackName,
          email: user.email || "",
          role: profile?.role || user.user_metadata?.role || "worker",
          bio: (profile as any)?.bio || "Belum ada bio profil. Ceritakan sedikit tentang diri Anda.",
          location: (profile as any)?.location || "Belum mengatur lokasi.",
          skills: (profile as any)?.skills || [],
          isVerified: (profile as any)?.is_verified || false,
          balance: (profile as any)?.balance || 0,
          avatarUrl: (profile as any)?.avatar_url || generatedAvatar,
          bannerUrl: (profile as any)?.banner_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200",
          joinedDate: user.created_at 
            ? new Date(user.created_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
            : "Baru Saja",
        });

      } catch (err: any) {
        console.error("Error mengambil data profil:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProfile();
  }, []);

  function fetchCurrentProfile() {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:pt-12 lg:pt-0">
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
            <button
              className="flex items-center gap-2 p-2 absolute bottom-2 right-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
              onClick={() => setShowMediaBanner(true)}
            >
              <FiCamera size={18} />
            </button>
        </div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative w-32 h-32">
              <Image
                src={userData.avatarUrl} 
                alt={userData.full_name} 
                fill
                className="rounded-2xl border-4 border-white bg-white shadow-md object-cover"
              />
              <button
                className="flex items-center gap-2 p-2 absolute -top-2 -right-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
                onClick={() => setShowMediaProfile(true)}
              >
                <FiCamera size={18} />
              </button>
              {userData.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white z-10">
                  <MdVerified size={16} />
                </div>
              )}
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
              onClick={() => setShowEditProfile(true)}
            >
              <FiEdit2 size={18} /> Edit Profil
            </button>
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
              <FiCalendar className="text-blue-500" /> Bergabung {userData.joinedDate}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sisi Kiri: Skills & Trust */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FiShield className="text-blue-600" /> Keahlian
              </h2>
              {/* Tombol Tambah / Edit Keahlian */}
              <button
                onClick={() => setShowManageSkills(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
              >
                <FiEdit2 size={12} /> Kelola
              </button>
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
        </div>

        {/* Sisi Kanan: Pengaturan & Keamanan */}
        <div className="md:col-span-2">
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