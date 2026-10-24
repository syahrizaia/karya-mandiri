import React from 'react';
import { FiBellOff } from 'react-icons/fi';

// Skeleton Loader Component
export const NotificationSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card p-5 rounded-3xl flex gap-4 animate-pulse">
          <div className="w-12 h-12 bg-slate-200/50 dark:bg-white/5 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 bg-slate-200/50 dark:bg-white/5 rounded-lg w-1/3" />
            <div className="h-3 bg-slate-200/50 dark:bg-white/5 rounded-lg w-3/4" />
            <div className="h-2.5 bg-slate-200/50 dark:bg-white/5 rounded-lg w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Empty State Component
export const NotificationEmpty: React.FC = () => {
  return (
    <div className="text-center py-20 glass-card rounded-3xl border border-white/20 dark:border-white/10 px-6">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-500/10 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500">
        <FiBellOff size={28} />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
        Kotak Notifikasi Bersih
      </h3>
      <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 font-medium max-w-xs mx-auto mt-1">
        Saat ada aktivitas baru terkait pekerjaan atau penawaran jasa Anda, notifikasi akan langsung muncul di sini.
      </p>
    </div>
  );
};