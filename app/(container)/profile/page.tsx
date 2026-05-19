/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { 
  FiEdit2, 
  FiMapPin, 
  FiCalendar, 
  FiMail, 
  FiShield
} from 'react-icons/fi';
import Image from 'next/image';
import SubscriptionDialog from '../../../components/subscription/page';
import { MdVerified } from 'react-icons/md';
import supabase from '@/lib/db';
import { toast } from 'sonner';

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
  const [loading, setLoading] = useState(true);
  const [showSubModal, setShowSubModal] = useState(false);

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
    bio: "Belum ada bio profil.",
    location: "Belum mengatur lokasi.",
    skills: [],
    isVerified: false,
    balance: 0,
    avatarUrl: "https://media.licdn.com/dms/image/v2/D5603AQGID0jlmIPgyg/profile-displayphoto-crop_800_800/B56ZmjLubTHUAI-/0/1759379385486?e=1780531200&v=beta&t=dxbq1ZVhNoNGAQlWE1VAcVx_LIxpZKgw0qCkNhDs1vA", // Default avatar fallback
    bannerUrl: "https://media.licdn.com/dms/image/v2/D5616AQGoFFgrFJCclQ/profile-displaybackgroundimage-shrink_350_1400/B56Z4dmIAcKoAY-/0/1778612994803?e=1780531200&v=beta&t=3IDAvwyJeX3PI4DOFkpBG4P9m8zw8CGS0tAEhBCsRq0", // Default banner fallback
    joinedDate: "Memuat tanggal...",
  });

  // const [profile] = useState<UserProfile>({
  //   id: 'USR-99',
  //   name: 'Syahriza',
  //   email: 'syahriza@karyamandiri.id',
  //   role: 'worker',
  //   bannerUrl: 'https://media.licdn.com/dms/image/v2/D5616AQGoFFgrFJCclQ/profile-displaybackgroundimage-shrink_350_1400/B56Z4dmIAcKoAY-/0/1778612994803?e=1779926400&v=beta&t=0kV7FytFs-IsxgP5w2SktTqiE2r_T2_dG6uquJWe5Z8',
  //   avatarUrl: 'https://media.licdn.com/dms/image/v2/D5603AQGID0jlmIPgyg/profile-displayphoto-crop_800_800/B56ZmjLubTHUAI-/0/1759379385486?e=1779926400&v=beta&t=1JotKWYF2YSH6ZwsnKyhOXdLrGWztSOJZJVItErjQ1w',
  //   bio: 'Pekerja sektor informal yang berfokus pada jasa logistik dan pengepakan barang UMKM. Berkomitmen pada ketepatan waktu.',
  //   location: 'Jakarta Selatan, Indonesia',
  //   skills: ['Logistik', 'Pengepakan', 'Manajemen Stok'],
  //   isVerified: true,
  //   joinedDate: 'Maret 2026',
  //   balance: 7500000000,
  // });

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        // 1. Ambil info akun dari session Supabase Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        if (!user) {
          toast.error("Sesi habis, silakan login kembali.");
          return;
        }

        // 2. Ambil data spesifik role & pelengkap dari tabel public.profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Jika profile belum terbentuk di DB, gunakan data fallback metadata auth
        setUserData({
          full_name: profile?.full_name || user.user_metadata?.full_name || "Pengguna KaryaMandiri",
          email: user.email || "pengguna@karyamandiri.id",
          role: profile?.role || user.user_metadata?.role || "worker",
          bio: (profile as any)?.bio || "Pemberi kerja di platform KaryaMandiri. Pekerja sektor informal yang berfokus pada jasa logistik dan pengepakan barang UMKM. Berkomitmen pada ketepatan waktu.",
          location: (profile as any)?.location || "Jakarta Selatan, Indonesia",
          skills: (profile as any)?.skills || ["KaryaMandiri", "Generalist", 'Logistik', 'Pengepakan', 'Manajemen Stok'],
          isVerified: (profile as any)?.is_verified || true,
          balance: (profile as any)?.balance || 7500000000,
          avatarUrl: (profile as any)?.avatar_url || "https://media.licdn.com/dms/image/v2/D5603AQGID0jlmIPgyg/profile-displayphoto-crop_800_800/B56ZmjLubTHUAI-/0/1759379385486?e=1780531200&v=beta&t=dxbq1ZVhNoNGAQlWE1VAcVx_LIxpZKgw0qCkNhDs1vA",
          bannerUrl: (profile as any)?.banner_url || "https://media.licdn.com/dms/image/v2/D5616AQGoFFgrFJCclQ/profile-displaybackgroundimage-shrink_350_1400/B56Z4dmIAcKoAY-/0/1778612994803?e=1780531200&v=beta&t=3IDAvwyJeX3PI4DOFkpBG4P9m8zw8CGS0tAEhBCsRq0",
          joinedDate: user.created_at 
            ? new Date(user.created_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
            : "Baru Saja",
        });

      } catch (err: any) {
        console.error("🔴 Error mengambil data profil:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-slate-500 font-medium animate-pulse">
        Menghubungkan ke server, memuat data profil...
      </div>
    );
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
              {userData.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white z-10">
                  <MdVerified size={16} />
                </div>
              )}
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
              onClick={() => setShowSubModal(true)}
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
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FiShield className="text-blue-600" /> Keahlian
            </h2>
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
            />
          </div>
        </div>
      </div>
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>

    // <div className="max-w-4xl mx-auto space-y-6">
    //   {/* Profil Header Card */}
    //   <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
    //     <Image
    //         src={profile.bannerUrl}
    //         alt={profile.name}
    //         width={1200}
    //         height={300}
    //         className="w-full h-48 object-cover"
    //       />
    //     <div className="px-8 pb-8">
    //       <div className="relative flex justify-between items-end -mt-12 mb-6">
    //         <div className="relative">
    //           <Image
    //             src={profile.avatarUrl} 
    //             alt={profile.name} 
    //             width={128}
    //             height={128}
    //             className="w-32 h-32 rounded-2xl border-4 border-white bg-white shadow-md object-cover"
    //           />
    //           {profile.isVerified && (
    //             <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white">
    //               <MdVerified size={16} />
    //             </div>
    //           )}
    //         </div>
    //         <button
    //           className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
    //           onClick={() => setShowSubModal(true)}
    //         >
    //           <FiEdit2 size={18} /> Edit Profil
    //         </button>
    //       </div>

    //       <div className="space-y-1">
    //         <div className="flex items-center gap-2">
    //           <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
    //           <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
    //             {profile.role}
    //           </span>
    //         </div>
    //         <p className="text-slate-500 max-w-2xl leading-relaxed">{profile.bio}</p>
    //       </div>

    //       <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-slate-100 text-sm text-slate-600">
    //         <div className="flex items-center gap-2">
    //           <FiMapPin className="text-blue-500" /> {profile.location}
    //         </div>
    //         <div className="flex items-center gap-2">
    //           <FiMail className="text-blue-500" /> {profile.email}
    //         </div>
    //         <div className="flex items-center gap-2">
    //           <FiCalendar className="text-blue-500" /> Bergabung {profile.joinedDate}
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //     {/* Sisi Kiri: Skills & Trust */}
    //     <div className="md:col-span-1 space-y-6">
    //       <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    //         <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
    //           <FiShield className="text-blue-600" /> Keahlian
    //         </h2>
    //         <div className="flex flex-wrap gap-2">
    //           {profile.skills.map((skill) => (
    //             <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
    //               {skill}
    //             </span>
    //           ))}
    //         </div>
    //       </div>

    //       <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
    //         <h2 className="text-sm font-semibold opacity-80 mb-1 flex items-center gap-2">
    //           Saldo Dompet
    //         </h2>
    //         <p className="text-3xl font-bold">Rp{profile.balance.toLocaleString()}</p>
    //         <button
    //           className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition backdrop-blur-sm"
    //           onClick={() => setShowSubModal(true)}
    //         >
    //           Tarik Tunai
    //         </button>
    //       </div>
    //     </div>

    //     {/* Sisi Kanan: Pengaturan & Keamanan */}
    //     <div className="md:col-span-2">
    //       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
    //         <div className="p-6">
    //           <h2 className="text-lg font-bold text-slate-900">Keamanan & Privasi</h2>
    //           <p className="text-sm text-slate-500">Kelola informasi akun dan kata sandi Anda.</p>
    //         </div>
    //         <SettingsItem 
    //           label="Verifikasi Identitas (KTP)" 
    //           value={profile.isVerified ? "Terverifikasi" : "Belum Verifikasi"} 
    //           status={profile.isVerified ? "success" : "warning"}
    //         />
    //         <SettingsItem 
    //           label="Autentikasi Dua Faktor" 
    //           value="Non-aktif" 
    //           status="default"
    //           onClick={() => setShowSubModal(true)}
    //         />
    //         <SettingsItem 
    //           label="Metode Pembayaran" 
    //           value="Bank Central Asia (BCA)" 
    //           status="success"
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    // </div>
  );
};

export default Profile;