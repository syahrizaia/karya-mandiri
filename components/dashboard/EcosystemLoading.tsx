import React from 'react';

const EcosystemLoading: React.FC = () => (
  <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-pulse">
    <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
      <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
    </div>
    <div className="divide-y divide-slate-50 dark:divide-slate-800">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded-md" />
              <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded-md" />
            </div>
          </div>
          <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export default EcosystemLoading;