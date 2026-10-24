import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <div className="glass-panel p-6 rounded-3xl flex items-center gap-4 transition-all duration-300">
    <div className="p-4 glass-capsule text-blue-600 dark:text-blue-400 text-2xl shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">{title}</p>
      <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate mt-0.5">{value}</p>
    </div>
  </div>
);

export default StatCard;