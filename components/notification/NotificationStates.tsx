import React from 'react';
import { FiBell } from 'react-icons/fi';

// Skeleton Loader Component
export const NotificationSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex gap-4 animate-pulse transition-colors">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Empty State Component
export const NotificationEmpty: React.FC = () => {
  return (
    <div className="text-center py-16 md:py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 px-4 transition-colors">
      <FiBell className="mx-auto text-slate-300 dark:text-slate-700 mb-3 md:mb-4" size={40} />
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Belum ada notifikasi baru.</p>
    </div>
  );
};