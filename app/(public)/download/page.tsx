/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FiDownload, FiMonitor, FiCheckCircle, FiArrowLeft, FiSmartphone, FiStar } from "react-icons/fi";
import { SiGoogleplay, SiApple } from "react-icons/si";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import supabase from "@/lib/db";
import ReviewSection from "@/components/download/ReviewSection";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  file_size: string | null;
  iarc_rating: string | null;
  profiles: {
    full_name: string;
    avatar_url: string;
  }[] | null;
}

export default function DownloadPage() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  
  // State manajemen data terpusat
  const [reviews, setReviews] = useState<Review[]>([]);
  const [downloadCount, setDownloadCount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fungsi Fetching Data Gabungan
  const fetchPageData = useCallback(async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      const { data: reviewData, error: reviewError } = await supabase
        .from("download_reviews")
        .select("id, rating, comment, created_at, file_size, iarc_rating, profiles(full_name, avatar_url)")
        .order("created_at", { ascending: false });

      if (reviewError) throw reviewError;
      setReviews(reviewData || []);

      const { count, error: countError } = await supabase
        .from("app_downloads")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;
      setDownloadCount(count || 0);

    } catch (err: any) {
      console.error("Gagal memuat data halaman unduhan:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setCurrentUrl(window.location.href);
    fetchPageData();
    
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [fetchPageData]);

  const trackDownload = async (platform: string) => {
    try {
      await supabase.from("app_downloads").insert({
        user_id: userId || null,
        platform: platform
      });
      setDownloadCount((prev) => prev + 1);
    } catch (err) {
      console.error("Gagal mencatat statistik unduhan:", err);
    }
  };

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem("pwa_installed", "true");
      await trackDownload("pwa");
      setDeferredPrompt(null);
    }
  };

  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  const fileSize = reviews[0]?.file_size || "2.0 MB";
  const iarcRating = reviews[0]?.iarc_rating || "12+";

  const formatDownloadCount = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
    return num.toString();
  };

  return (
    <div className="py-8 px-4 flex flex-col items-center max-w-4xl mx-auto text-slate-900 dark:text-slate-100">
      
      <button 
        onClick={() => router.back()}
        className="self-start glass-capsule px-4 py-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition font-bold text-xs cursor-pointer"
      >
        <FiArrowLeft /> Kembali
      </button>

      <div className="w-full max-w-lg glass-panel p-8 sm:p-10 rounded-3xl text-center shadow-2xl relative overflow-hidden">
        
        <div className="w-20 h-20 glass-capsule bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <FiDownload size={36} />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Unduh KaryaMandiri</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
          Dapatkan akses penuh ke fitur aplikasi dengan memasang Progressive Web App (PWA) instan atau melalui toko aplikasi resmi.
        </p>

        {/* METADATA BAR DOCK */}
        <div className="grid grid-cols-4 gap-1 py-4 my-2 glass-card rounded-2xl text-center mb-8">
          {/* Rata-rata Rating & Total Ulasan */}
          <div className="flex flex-col items-center justify-center border-r border-slate-200/50 dark:border-white/10">
            <span className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-0.5">
              {loading ? "..." : averageRating} <FiStar className="text-amber-500 fill-amber-500 shrink-0" size={12} />
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">
              {loading ? "..." : `${totalReviews} ulasan`}
            </span>
          </div>

          {/* Rating Konten IARC */}
          <div className="flex flex-col items-center justify-center border-r border-slate-200/50 dark:border-white/10">
            <span className="text-[10px] font-black text-slate-900 dark:text-white border-2 border-slate-900 dark:border-white px-1 py-0.5 rounded-md leading-none select-none">
              {loading ? "..." : iarcRating}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">IARC {iarcRating}</span>
          </div>

          {/* Ukuran File */}
          <div className="flex flex-col items-center justify-center border-r border-slate-200/50 dark:border-white/10">
            <span className="text-sm font-black text-slate-900 dark:text-white">
              {loading ? "..." : fileSize}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">Ukuran Ringan</span>
          </div>

          {/* BAGIAN JUMLAH TOTAL DOWNLOAD RIIL */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-sm font-black text-blue-600 dark:text-blue-400">
              {loading ? "..." : formatDownloadCount(downloadCount)}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">Total Pasang</span>
          </div>
        </div>

        {/* TAMPILAN MOBILE */}
        <div className="flex flex-col gap-3 md:hidden">
          {deferredPrompt && (
            <button 
              onClick={handleInstallPWA}
              className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold hover:from-blue-500 hover:to-indigo-500 transition shadow-lg shadow-blue-500/25 active:scale-95 cursor-pointer"
            >
              <FiSmartphone size={18} /> Pasang Aplikasi (PWA)
            </button>
          )}

          <a 
            href="https://play.google.com" 
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackDownload("play_store")}
            className="flex items-center justify-center gap-3 w-full glass-card hover:bg-blue-500/10 text-slate-900 dark:text-white py-4 rounded-2xl font-bold transition cursor-pointer"
          >
            <SiGoogleplay size={18} /> Google Play
          </a>
          
          <a 
            href="https://apps.apple.com" 
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackDownload("app_store")}
            className="flex items-center justify-center gap-3 w-full glass-card hover:bg-blue-500/10 text-slate-900 dark:text-white py-4 rounded-2xl font-bold transition cursor-pointer"
          >
            <SiApple size={18} /> Apple App Store
          </a>
        </div>

        {/* TAMPILAN DESKTOP */}
        <div className="hidden md:flex flex-col items-center gap-4 p-6 glass-card rounded-3xl">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-xs">
            <FiMonitor /> Scan via Ponsel Pintar
          </div>
          <div className="p-3 bg-white rounded-2xl shadow-md border border-white/20">
             <QRCode
                size={120}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={currentUrl}
                viewBox={`0 0 256 256`}
                fgColor="#000000"
             />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Arahkan kamera ponsel Anda ke barcode untuk langsung membuka aplikasi.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-left border-t border-slate-200/50 dark:border-white/10 pt-6">
          <FeatureItem label="Instalasi Instan" />
          <FeatureItem label="Hemat Kuota Data" />
          <FeatureItem label="Akses Cepat Offline" />
          <FeatureItem label="Sinkronisasi Cloud Aman" />
        </div>
      </div>

      <ReviewSection reviews={reviews} loading={loading} userId={userId} onRefresh={fetchPageData} />
    </div>
  );
}

function FeatureItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
      <FiCheckCircle className="text-emerald-500 shrink-0" size={14} /> {label}
    </div>
  );
}