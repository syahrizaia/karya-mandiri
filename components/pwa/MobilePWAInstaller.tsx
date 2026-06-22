/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from 'react';
import { FiDownload, FiX, FiZap } from 'react-icons/fi';
import Link from 'next/link';

export default function MobilePWAInstaller() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Tampilkan hanya jika di perangkat mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 inset-x-4 z-50 md:hidden animate-in slide-in-from-bottom duration-500">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 border-t-blue-500/30 p-4 rounded-3xl flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(37,99,235,0.15)]">
        
        {/* Sisi Kiri: Informasi */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/20 shrink-0">
            <FiZap className="animate-pulse" size={18} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-black text-white tracking-wide truncate">Unduh Aplikasi</h4>
            <p className="text-[10px] text-slate-400 truncate">Pengalaman terbaik di ponsel Anda</p>
          </div>
        </div>
        
        {/* Sisi Kanan: Tombol Aksi */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <Link
            href="/download"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.3)] active:scale-95"
          >
            <FiDownload size={13} /> Instal
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-slate-500 hover:text-slate-300 rounded-xl hover:bg-white/5 transition"
            aria-label="Tutup banner"
          >
            <FiX size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}