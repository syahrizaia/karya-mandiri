"use client";

import React, { useState } from "react";
import { Wrench, RefreshCw, ArrowLeft } from "lucide-react";

export default function MaintenancePage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCheckStatus = () => {
    setIsRefreshing(true);
    
    // Simulasi pengecekan status ke server/API selama 1.5 detik
    setTimeout(() => {
      setIsRefreshing(false);
      // Anda bisa menyisipkan fungsi fetchNews() atau window.location.reload() di sini
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center selection:bg-amber-500 selection:text-slate-900">
      
      {/* Kontainer Utama */}
      <div className="max-w-md w-full space-y-8 bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden">
        
        {/* Efek Cahaya Latar Belakang Mendatar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_20px_rgba(245,158,11,0.5)]" />

        {/* Lingkaran Ikon dengan Animasi Denyut */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse w-24 h-24" />
            <div className="relative bg-gradient-to-b from-amber-400 to-amber-600 p-6 rounded-2xl shadow-lg border border-amber-300/30 flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
              <Wrench className="w-10 h-10 text-slate-900 animate-bounce [animation-duration:3s]" />
            </div>
          </div>
        </div>

        {/* Teks Informasi */}
        <div className="space-y-3">
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-amber-500 uppercase bg-amber-500/20 border border-amber-500/40 rounded-full">
            Sistem Maintenance
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Laman Sedang <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Perbaikan</span>
          </h1>
          <p className="text-base text-slate-800 leading-relaxed">
            Kami sedang memperbarui sistem dan meningkatkan performa API server agar aplikasi menjadi lebih stabil dan cepat. Kami akan segera kembali!
          </p>
        </div>

        {/* Garis Pembatas */}
        <hr className="border-slate-700/60" />

        {/* Baris Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          
          {/* Tombol Cek Status Baru */}
          <button
            onClick={handleCheckStatus}
            disabled={isRefreshing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-semibold rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Memeriksa..." : "Coba Muat Ulang"}
          </button>

          {/* Tombol Kembali (Opsional) */}
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl border border-slate-700 transition-all duration-200 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>

      </div>

      {/* Catatan Kaki Kecil */}
      <p className="mt-8 text-xs text-slate-500 tracking-wide uppercase">
        © {new Date().getFullYear()} • Tim Pengembang Aplikasi
      </p>
    </div>
  );
}