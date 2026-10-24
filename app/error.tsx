"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-6 py-16 relative">
      <div className="glass-panel max-w-lg w-full text-center p-8 sm:p-12 rounded-3xl shadow-2xl shadow-rose-500/10 border border-white/20 dark:border-white/10 relative overflow-hidden">
        {/* Ambient Rose Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
          <FiAlertTriangle size={30} />
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Terjadi Kendala Sistem
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          Terjadi kesalahan tak terduga saat memproses halaman ini. Data sesi Anda tetap aman.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer group"
          >
            <FiRefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            Coba Muat Ulang
          </button>
          <Link
            href="/"
            className="glass-capsule inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-2xl transition-all"
          >
            <FiHome size={16} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}

