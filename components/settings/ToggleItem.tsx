"use client";

import React from 'react';

interface ToggleItemProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ title, description, isEnabled, onToggle }) => (
  <div className="p-5 sm:p-6 flex justify-between items-center gap-5 hover:bg-white/40 dark:hover:bg-white/5 transition-colors duration-200">
    <div className="flex-1 min-w-0">
      <p className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 tracking-tight">
        {title}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
        {description}
      </p>
    </div>
    <button
      onClick={onToggle}
      type="button"
      role="switch"
      aria-checked={isEnabled}
      className={`w-13 h-7.5 flex items-center rounded-full p-1 transition-all duration-300 focus:outline-none cursor-pointer shrink-0 border ${
        isEnabled 
          ? 'bg-blue-600 border-blue-500 shadow-md shadow-blue-500/30' 
          : 'bg-slate-300/70 dark:bg-slate-800 border-slate-300 dark:border-white/10'
      }`}
    >
      <div
        className={`bg-white dark:bg-slate-100 w-5.5 h-5.5 rounded-full shadow-md transform transition-all duration-300 ${
          isEnabled ? 'translate-x-5.5 scale-105' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export default ToggleItem;