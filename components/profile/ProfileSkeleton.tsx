import React from 'react';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 px-4 py-4 md:py-12 lg:pt-4 animate-pulse">
      <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="h-36 sm:h-48 w-full bg-slate-200 dark:bg-slate-800" />
        <div className="px-4 sm:px-6 pb-6">
          <div className="relative flex justify-between items-end -mt-14 md:-mt-20 mb-4 sm:mb-6">
            <div className="w-28 h-28 md:w-40 md:h-40 rounded-3xl border-4 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-700 shrink-0" />
            <div className="w-24 h-8 bg-slate-200 dark:bg-slate-800 rounded-xl mb-2 md:mb-4" />
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded-md w-1/3" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3" />
          </div>
          <div className="flex flex-wrap gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/60">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-32" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-28" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 sm:h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800/40" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="md:col-span-2 h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
};