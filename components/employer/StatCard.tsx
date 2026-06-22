import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
    <div className={`${color} p-4 rounded-lg text-white text-2xl`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-slate-50">{value}</p>
    </div>
  </div>
);

export default StatCard;