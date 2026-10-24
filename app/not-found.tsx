import Link from "next/link";
import { FiHome, FiCompass } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center px-6 py-16 relative">
      <div className="glass-panel max-w-lg w-full text-center p-8 sm:p-12 rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/20 dark:border-white/10 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <FiCompass size={32} className="animate-spin" style={{ animationDuration: "12s" }} />
        </div>

        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 tracking-tighter mb-2">
          404
        </h1>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          Halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau alamat URL yang dimasukkan kurang tepat.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all group"
          >
            <FiHome size={16} className="group-hover:-translate-y-0.5 transition-transform" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/jobs"
            className="glass-capsule inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-2xl transition-all"
          >
            Jelajahi Tugas
          </Link>
        </div>
      </div>
    </main>
  );
}

