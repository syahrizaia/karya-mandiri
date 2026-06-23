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
  const [downloadCount, setDownloadCount] = useState<number>(0); // State baru untuk angka unduhan riil
  const [userId, setUserId] = useState<string | null>(null); // Sesi user untuk pelacakan & ulasan
  const [loading, setLoading] = useState(true);

  // Fungsi Fetching Data Gabungan (Reviews & Real Download Count)
  const fetchPageData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Ambil Sesi User yang sedang login
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      // 2. Ambil Data Ulasan dari tabel download_reviews
      const { data: reviewData, error: reviewError } = await supabase
        .from("download_reviews")
        .select("id, rating, comment, created_at, file_size, iarc_rating, profiles(full_name, avatar_url)")
        .order("created_at", { ascending: false });

      if (reviewError) throw reviewError;
      setReviews(reviewData || []);

      // 3. Hitung Jumlah Riil Unduhan langsung dari total baris tabel app_downloads
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

  // Fungsi untuk mencatat aktivitas klik unduh ke Supabase
  const trackDownload = async (platform: string) => {
    try {
      await supabase.from("app_downloads").insert({
        user_id: userId || null, // Tetap tercatat sebagai anonim jika belum login
        platform: platform
      });
      
      // Optimistic update: langsung tambahkan angka di UI agar instan terlihat oleh user
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
      await trackDownload("pwa"); // Catat jika PWA berhasil dipasang
      setDeferredPrompt(null);
    }
  };

  // --- KALKULASI & METADATA AGREGASI ---
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  const fileSize = reviews[0]?.file_size || "2.0 MB";
  const iarcRating = reviews[0]?.iarc_rating || "12+";

  // Format tampilan angka unduhan agar rapi (Contoh: jika mencapai ribuan menjadi 1.2K)
  const formatDownloadCount = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
    return num.toString();
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 py-4 flex flex-col items-center">
      
      <button 
        onClick={() => router.back()}
        className="self-start flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 mb-8 transition-colors"
      >
        <FiArrowLeft /> Kembali
      </button>

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 text-center">
        
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
          <FiDownload size={40} />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Unduh KaryaMandiri</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Dapatkan akses penuh ke fitur aplikasi dengan menginstal PWA atau melalui toko aplikasi resmi.
        </p>

        {/* --- METADATA BAR (KINI DINAMIS & RIIL) --- */}
        <div className="grid grid-cols-4 gap-1 py-4 my-2 border-y border-slate-100 dark:border-slate-800 text-center mb-8">
          {/* Rata-rata Rating & Total Ulasan */}
          <div className="flex flex-col items-center justify-center border-r border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-0.5">
              {loading ? "..." : averageRating} <FiStar className="text-amber-500 fill-amber-500 shrink-0" size={12} />
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
              {loading ? "..." : `${totalReviews} ulasan`}
            </span>
          </div>

          {/* Rating Konten IARC */}
          <div className="flex flex-col items-center justify-center border-r border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black text-slate-900 dark:text-white border-2 border-slate-900 dark:border-white px-1 py-0.5 rounded-md leading-none select-none">
              {loading ? "..." : iarcRating}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">Rating {iarcRating}</span>
          </div>

          {/* Ukuran File */}
          <div className="flex flex-col items-center justify-center border-r border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {loading ? "..." : fileSize}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">Ukuran file</span>
          </div>

          {/* BAGIAN JUMLAH TOTAL DOWNLOAD RIIL */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {loading ? "..." : formatDownloadCount(downloadCount)}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">Unduhan</span>
          </div>
        </div>

        {/* --- TAMPILAN MOBILE --- */}
        <div className="flex flex-col gap-3 md:hidden">
          {deferredPrompt && (
            <button 
              onClick={handleInstallPWA}
              className="flex items-center justify-center gap-3 w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
            >
              <FiSmartphone size={20} /> Instal Aplikasi (PWA)
            </button>
          )}

          <a 
            href="https://play.google.com" 
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackDownload("play_store")}
            className="flex items-center justify-center gap-3 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold hover:opacity-90 transition"
          >
            <SiGoogleplay size={20} /> Play Store
          </a>
          
          <a 
            href="https://apps.apple.com" 
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackDownload("app_store")}
            className="flex items-center justify-center gap-3 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold hover:opacity-90 transition"
          >
            <SiApple size={20} /> App Store
          </a>
        </div>

        {/* --- TAMPILAN DESKTOP --- */}
        <div className="hidden md:flex flex-col items-center gap-4 p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold text-sm">
            <FiMonitor /> Scan via Ponsel
          </div>
          <div className="p-3 bg-white rounded-xl">
             <QRCode
                size={120}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={currentUrl}
                viewBox={`0 0 256 256`}
                fgColor="#000000"
             />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Arahkan kamera ponsel Anda ke kode ini.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-left border-t border-slate-100 dark:border-slate-800 pt-6">
          <FeatureItem label="Instalasi Instan" />
          <FeatureItem label="Hemat Kuota" />
          <FeatureItem label="Mode Offline" />
          <FeatureItem label="Sinkronisasi Aman" />
        </div>
      </div>

      {/* Kirim data ulasan, status loading, userId yang valid, dan trigger sinkronisasi balik */}
      <ReviewSection reviews={reviews} loading={loading} userId={userId} onRefresh={fetchPageData} />
    </div>
  );
}

function FeatureItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <FiCheckCircle className="text-blue-500 shrink-0" size={14} /> {label}
    </div>
  );
}