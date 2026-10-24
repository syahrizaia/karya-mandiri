/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { use, useEffect, useState } from "react";
import supabase from "@/lib/db";
import Image from "next/image";
import { FiFolder, FiShield, FiStar } from "react-icons/fi";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import ManagePortofolio from "../manage-portofolio/page";
import SubscriptionDialog from "../../subscription/page";

const SettingsItem = ({ label, value, status, onClick }: { label: string; value: string; status: string; onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className="p-4 sm:p-5 flex justify-between items-center hover:bg-white/10 transition cursor-pointer" 
  >
    <div className="min-w-0 flex-1 pr-2">
      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{label}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{value}</p>
    </div>
    <div className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shrink-0 ${
      status === 'success' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 
      status === 'warning' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' : 
      'glass-capsule text-slate-500 dark:text-slate-400'
    }`}>
      {status === 'success' ? 'Aktif' : status === 'warning' ? 'Perlu Tindakan' : 'Atur'}
    </div>
  </div>
);

interface ProfileProps {
  params: Promise<{ id: string }>;
}

export default function TabPanel({ params }: ProfileProps) {
  const { id: profileId } = use(params);
  const [, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showManagePortfolio, setShowManagePortfolio] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'settings'>('portfolio');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [userData, setUserData] = useState<{
    isVerified: boolean;
  }>({
    isVerified: false,
  });

  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchCurrentProfile = async () => {
    try {
      setLoading(true);

      const [profileRes, portfolioRes, reviewsRes] = await Promise.all([
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

      setUserData({
        isVerified: profile?.is_verified || false,
      });

      setPortfolios(portfolioRes.data || []);
      setReviews(reviewsRes.data || []);

    } catch (err: any) {
      console.error("Error global saat memuat profil:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Mohon berikan komentar ulasan.");
      return;
    }

    try {
      setIsSubmittingReview(true);
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;

      if (!currentUser) {
        toast.error("Anda harus masuk terlebih dahulu untuk memberi ulasan.");
        return;
      }

      if (currentUser.id === profileId) {
        toast.error("Anda tidak dapat memberi ulasan pada profil sendiri.");
        return;
      }

      const clientName = 
        currentUser.user_metadata?.full_name || 
        currentUser.email?.split('@')[0] ||     
        "Pengguna KaryaMandiri";

      const { error } = await supabase.from("reviews").insert([
        {
          profile_id: profileId,
          client_name: clientName,
          rating: newRating,
          comment: newComment.trim(),
        }
      ]);

      if (error) throw error;

      toast.success("Ulasan Anda berhasil dikirim!");
      setShowReviewModal(false);
      setNewComment("");
      setNewRating(5);
      
      fetchCurrentProfile();
    } catch (err: any) {
      console.error("Error submit review:", err.message);
      toast.error("Gagal mengirimkan ulasan.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchCurrentProfile();
    }
  }, [profileId]);

  return (
    <div className="md:col-span-2 space-y-4 w-full min-w-0 text-slate-900 dark:text-slate-100 transition-colors">
      {/* TABS HEADER */}
      <div className="glass-panel px-3 pt-3 rounded-2xl flex overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'portfolio' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <FiFolder /> Portofolio ({portfolios.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'reviews' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <FiStar /> Ulasan ({reviews.length})
        </button>
        {isOwnProfile && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'settings' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
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
                className="flex items-center gap-2 px-4 py-2 glass-capsule text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer hover:bg-blue-500/10"
              >
                <FiFolder /> Kelola Portofolio
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolios.length > 0 ? (
              portfolios.map((item) => (
                <div key={item.id} className="glass-card rounded-2xl overflow-hidden group transition-all duration-300 w-full">
                  <div className="relative h-36 bg-slate-900/20 w-full">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <FiFolder size={32}/>
                      </div>
                    )}
                  </div>
                  <div className="p-4 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 line-clamp-1 break-words">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 break-words">{item.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full glass-panel rounded-2xl p-8 text-center text-xs text-slate-400 italic">
                Belum ada portofolio karya yang diunggah.
              </div>
            )}
          </div>
        </div>
      )}

      {/* PANEL 2: ULASAN */}
      {activeTab === 'reviews' && (
        <div className="space-y-3 w-full">
          {!isOwnProfile && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowReviewModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <FiStar /> Beri Ulasan Jasa
              </button>
            </div>
          )}

          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="glass-card p-4 sm:p-5 rounded-2xl space-y-2 w-full min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{rev.client_name || "Klien Anonim"}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {rev.created_at ? new Date(rev.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Baru saja"}
                    </p>
                  </div>
                  <div className="flex text-amber-400 gap-0.5 shrink-0">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <FiStar key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic break-words">&ldquo;{rev.comment}&rdquo;</p>
              </div>
            ))
          ) : (
            <div className="glass-panel rounded-2xl p-8 text-center text-xs text-slate-400 italic">
              Belum memiliki riwayat ulasan dari klien.
            </div>
          )}
        </div>
      )}

      {/* PANEL 3: PENGATURAN PRIVASI */}
      {activeTab === 'settings' && isOwnProfile && (
        <div className="glass-panel rounded-2xl divide-y divide-slate-200/50 dark:divide-white/10 overflow-hidden w-full">
          <SettingsItem 
            label="Verifikasi Akun" 
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

      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />

      {/* Dialog Kelola Portofolio */}
      <Dialog open={showManagePortfolio} onOpenChange={setShowManagePortfolio}>
        <DialogContent className="max-w-2xl rounded-3xl glass-panel text-slate-900 dark:text-slate-100 border-none">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-100">Kelola Portofolio</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ManagePortofolio userId={profileId} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Beri Ulasan */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-md rounded-3xl p-6 glass-panel text-slate-900 dark:text-slate-100 border-none">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">Berikan Ulasan Jasa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
            {/* Input Rating Bintang */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rating Kepuasan</label>
              <div className="flex gap-1 text-2xl pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <FiStar
                      className={star <= newRating ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}
                      fill={star <= newRating ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Input Teks Komentar */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Komentar / Feedback</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tuliskan ulasan pengalaman kerja sama Anda dengan freelancer ini..."
                rows={4}
                maxLength={300}
                className="glass-input w-full text-xs p-3.5 rounded-xl outline-none transition resize-none leading-relaxed"
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-2 pt-2 justify-end">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-white/10 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-500/20 cursor-pointer disabled:cursor-not-allowed active:scale-95"
              >
                {isSubmittingReview ? "Mengirim..." : "Kirim Ulasan"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}