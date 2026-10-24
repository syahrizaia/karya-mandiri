import React from 'react';

const EcosystemLoading: React.FC = () => (
  <div className="lg:col-span-2 glass-panel rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5 animate-pulse">
    <div className="p-6 border-b border-white/20 dark:border-white/5 bg-slate-900/5 dark:bg-white/5 flex justify-between items-center">
      <div className="h-5 w-40 bg-slate-200/50 dark:bg-white/10 rounded-lg"></div>
      <div className="h-4 w-16 bg-slate-200/40 dark:bg-white/5 rounded-lg"></div>
    </div>
    <div className="divide-y divide-slate-200/40 dark:divide-white/5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-slate-200/50 dark:bg-white/5 rounded-2xl shrink-0" />
            <div className="space-y-2">
              <div className="h-4 w-56 sm:w-64 bg-slate-200/50 dark:bg-white/10 rounded-md" />
              <div className="h-3 w-24 bg-slate-200/40 dark:bg-white/5 rounded-md" />
            </div>
          </div>
          <div className="w-4 h-4 bg-slate-200/40 dark:bg-white/5 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export default EcosystemLoading;