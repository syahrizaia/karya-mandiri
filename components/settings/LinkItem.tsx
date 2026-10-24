"use client";

import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

interface LinkItemProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

const LinkItem: React.FC<LinkItemProps> = ({ icon, title, onClick }) => (
  <button 
    onClick={onClick}
    type="button"
    className="w-full flex items-center justify-between p-5 sm:p-6 hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-200 text-slate-800 dark:text-slate-200 cursor-pointer group"
  >
    <div className="flex items-center gap-3.5">
      <span className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
        {icon}
      </span>
      <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </span>
    </div>
    <FiChevronRight className="text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" size={18} />
  </button>
);

export default LinkItem;