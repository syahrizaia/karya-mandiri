/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { FiDownload, FiMonitor, FiCheckCircle, FiArrowLeft, FiSmartphone } from "react-icons/fi";
import { SiGoogleplay, SiApple } from "react-icons/si";
import { useRouter } from "next/navigation";

export default function DownloadPage() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Menangkap event install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    
    // Memicu prompt install native browser
    deferredPrompt.prompt();
    
    // Menunggu pilihan user
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 flex flex-col items-center">
      
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
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
          Dapatkan akses penuh ke fitur aplikasi dengan menginstal PWA atau melalui toko aplikasi resmi.
        </p>

        {/* --- TAMPILAN MOBILE --- */}
        <div className="flex flex-col gap-3 md:hidden">
          
          {/* Tombol Instal PWA (Hanya muncul jika browser mendukung) */}
          {deferredPrompt && (
            <button 
              onClick={handleInstallPWA}
              className="flex items-center justify-center gap-3 w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
            >
              <FiSmartphone size={20} /> Instal Aplikasi (PWA)
            </button>
          )}

          <a href="#" className="flex items-center justify-center gap-3 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold hover:opacity-90 transition">
            <SiGoogleplay size={20} /> Play Store
          </a>
          <a href="#" className="flex items-center justify-center gap-3 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold hover:opacity-90 transition">
            <SiApple size={20} /> App Store
          </a>
        </div>

        {/* --- TAMPILAN DESKTOP --- */}
        <div className="hidden md:flex flex-col items-center gap-4 p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold text-sm">
            <FiMonitor /> Scan via Ponsel
          </div>
          <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 text-xs">
            [QR Code]
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pindai untuk instalasi cepat.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-left border-t border-slate-100 dark:border-slate-800 pt-6">
          <FeatureItem label="Instalasi Instan" />
          <FeatureItem label="Hemat Kuota" />
          <FeatureItem label="Mode Offline" />
          <FeatureItem label="Sinkronisasi Aman" />
        </div>
      </div>
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