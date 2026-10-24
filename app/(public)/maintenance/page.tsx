"use client";

import React, { useState } from "react";
import { Wrench, RefreshCw, ArrowLeft } from "lucide-react";

export default function MaintenancePage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCheckStatus = () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Kontainer Utama */}
      <div className="max-w-md w-full space-y-6 glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-2xl">
        
        {/* Lingkaran Ikon Amber Glass */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse w-24 h-24" />
            <div className="relative glass-capsule bg-amber-500/20 border-amber-500/40 p-5 rounded-3xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
              <Wrench className="w-10 h-10 text-amber-500 animate-bounce [animation-duration:3s]" />
            </div>
          </div>
        </div>

        {/* Teks Informasi */}
        <div className="space-y-3">
          <span className="glass-capsule text-xs font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase px-3 py-1 bg-amber-500/10 border-amber-500/30">
            Sistem Pemeliharaan
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Laman Sedang <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Optimalisasi</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Kami sedang memperbarui sistem dan meningkatkan kestabilan server agar pengalaman penggunaan platform KaryaMandiri semakin cepat dan responsif.
          </p>
        </div>

        {/* Garis Pembatas */}
        <hr className="border-slate-200/50 dark:border-white/10" />

        {/* Baris Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          
          <button
            onClick={handleCheckStatus}
            disabled={isRefreshing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Memeriksa..." : "Coba Muat Ulang"}
          </button>

          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 glass-card hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition duration-200 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>

      </div>

      <p className="mt-8 text-[11px] text-slate-400 dark:text-slate-500 tracking-wider uppercase font-semibold" suppressHydrationWarning>
        {`© ${new Date().getFullYear()} • Tim Teknis & Arsitektur KaryaMandiri`}
      </p>
    </div>
  );
}