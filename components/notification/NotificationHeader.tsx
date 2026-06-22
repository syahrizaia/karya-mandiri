import React from 'react';

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
    <header className="flex justify-between items-center mb-6 gap-2 transition-colors">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Notifikasi
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
          Info terbaru tentang pekerjaan dan akun Anda.
        </p>
      </div>
      <button
        onClick={onMarkAllAsRead}
        disabled={loading || !hasUnread}
        className="text-xs md:text-sm font-bold px-3 py-2 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50 disabled:opacity-40 disabled:hover:bg-transparent transition shrink-0 cursor-pointer disabled:cursor-not-allowed"
      >
        Tandai Semua Dibaca
      </button>
    </header>
  );
};