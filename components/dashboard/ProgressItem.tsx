import React from 'react';

interface ProgressItemProps {
  label: string;
  progress: number;
  color: string;
}

const ProgressItem: React.FC<ProgressItemProps> = ({ label, progress, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
      <span>{label}</span>
      <span>{progress}%</span>
    </div>
    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
      <div className={`${color} h-full transition-all duration-1000`} style={{ width: `${progress}%` }} />
    </div>
  </div>
);

export default ProgressItem;