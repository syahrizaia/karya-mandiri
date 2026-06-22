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
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Riwayat Aktivitas
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pantau semua transaksi dan pengerjaan tugas Anda.
        </p>
      </div>
      <button
        onClick={onDownload}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition text-sm shadow-sm cursor-pointer disabled:cursor-not-allowed"
      >
        <FiDownload /> Unduh Laporan
      </button>
    </section>
  );
};