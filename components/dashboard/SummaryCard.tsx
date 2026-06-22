/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  color: 'blue' | 'emerald' | 'purple' | 'amber';
  isLoading?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, trend, color, isLoading }) => {
  const colorClasses: any = {
    blue: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
    emerald: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40",
    purple: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/40",
    amber: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40",
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-4 gap-4">
          <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          <div className="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded-md" />
        </div>
        <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded-md mb-2" />
        <div className="h-7 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className={`p-3 rounded-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{trend}</span>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</h2>
    </div>
  );
};

export default SummaryCard;