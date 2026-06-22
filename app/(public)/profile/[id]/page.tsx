/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, use } from "react";
import supabase from "@/lib/db";
import { toast } from "sonner";

import SubscriptionDialog from "../../../../components/subscription/page";
import EditProfileDialog from "@/components/profile/edit-profile/page";
import EditProfilePhotoDialog from "@/components/profile/edit-profile-photo/page";
import EditProfileBannerDialog from "@/components/profile/edit-profile-banner/page";
import PerfomanceStatistic from "@/components/profile/perfomance-statistic/page";
import SkillsAndWallet from "@/components/profile/skills-and-wallet/page";
import TabPanel from "@/components/profile/tab-panel/page";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { ProfileWarningBanner } from "@/components/profile/ProfileWarningBanner";
import { ProfileHeaderCard } from "@/components/profile/ProfileHeaderCard";

interface ProfileProps {
  params: Promise<{ id: string }>;
}

const Profile: React.FC<ProfileProps> = ({ params }) => {
  const { id: profileId } = use(params);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showMediaProfile, setShowMediaProfile] = useState(false);
  const [showMediaBanner, setShowMediaBanner] = useState(false);

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

  const fetchCurrentProfile = async () => {
    try {
      setLoading(true);

      const [profileRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", profileId).maybeSingle(),
        supabase.from("portfolios").select("*").eq("user_id", profileId).order("created_at", { ascending: false }),
        supabase.from("reviews").select("*").eq("profile_id", profileId).order("created_at", { ascending: false })
      ]);

      if (profileRes.error && profileRes.error.code !== "PGRST116") {
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
        avatarUrl: profile?.avatar_url || "", 
        bannerUrl: profile?.banner_url || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200",
        joinedDate: rawJoinedDate 
          ? new Date(rawJoinedDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
          : "Baru Saja",
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
    return <ProfileSkeleton />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 md:py-12 lg:pt-4 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Banner Notifikasi Verifikasi */}
      <ProfileWarningBanner isOwnProfile={isOwnProfile} isVerified={userData.isVerified} />

      {/* Komponen Utama Profil Header Card */}
      <ProfileHeaderCard 
        profileId={profileId}
        isOwnProfile={isOwnProfile}
        userData={userData}
        onEditProfile={() => setShowEditProfile(true)}
        onEditAvatar={() => setShowMediaProfile(true)}
        onEditBanner={() => setShowMediaBanner(true)}
      />

      {/* Statistik Performa */}
      <PerfomanceStatistic params={params} />

      {/* Grid Bagian Bawah */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkillsAndWallet params={params} />
        <TabPanel params={params} />
      </div>
      
      {/* Kumpulan Dialog Overlay */}
      <EditProfilePhotoDialog open={showMediaProfile} onOpenChange={setShowMediaProfile} currentAvatar={userData.avatarUrl} onSuccess={fetchCurrentProfile} />
      <EditProfileBannerDialog open={showMediaBanner} onOpenChange={setShowMediaBanner} currentBanner={userData.bannerUrl} onSuccess={fetchCurrentProfile} />
      <EditProfileDialog open={showEditProfile} onOpenChange={setShowEditProfile} userData={userData} onSuccess={fetchCurrentProfile} />
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>
  );
};

export default Profile;