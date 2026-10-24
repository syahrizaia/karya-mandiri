import { FiLoader } from "react-icons/fi";

export default function Loading() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="glass-capsule px-8 py-5 rounded-3xl shadow-2xl shadow-blue-500/10 flex items-center gap-4 border border-white/20 dark:border-white/10">
        <FiLoader className="animate-spin text-blue-600 dark:text-blue-400 text-2xl" />
        <div>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
            KaryaMandiri
          </p>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Menyiapkan antarmuka data...
          </p>
        </div>
      </div>
    </main>
  );
}

