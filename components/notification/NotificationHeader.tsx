import React from 'react';
import { FiCheckSquare } from 'react-icons/fi';

interface NotificationHeaderProps {
  hasUnread: boolean;
  loading: boolean;
  onMarkAllAsRead: () => void;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  hasUnread,
  loading,
  onMarkAllAsRead,
}) => {
  return (
    <header className="flex justify-between items-center mb-6 gap-4 transition-colors">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Notifikasi
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Info terbaru tentang aktivitas pekerjaan, tawaran jasa, dan transaksi akun Anda.
        </p>
      </div>
      <button
        onClick={onMarkAllAsRead}
        disabled={loading || !hasUnread}
        className="glass-capsule text-xs md:text-sm font-bold px-4 py-2.5 rounded-2xl text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-xs group"
      >
        <FiCheckSquare className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" size={16} />
        Tandai Semua Dibaca
      </button>
    </header>
  );
};