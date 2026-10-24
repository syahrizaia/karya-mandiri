import React from "react";
import { FiDownload } from "react-icons/fi";

interface HistoryHeaderProps {
  loading: boolean;
  onDownload: () => void;
}

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({ loading, onDownload }) => {
  return (
    <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Riwayat Aktivitas
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pantau seluruh jejak transaksi keuangan dan pengerjaan tugas Anda secara real-time.
        </p>
      </div>
      <button
        onClick={onDownload}
        disabled={loading}
        className="glass-capsule flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-2xl font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-40 transition-all text-sm shadow-sm cursor-pointer disabled:cursor-not-allowed group"
      >
        <FiDownload className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" /> 
        Unduh Laporan CSV
      </button>
    </section>
  );
};