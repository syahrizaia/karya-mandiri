"use client";

import React from 'react';

interface LinkItemProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

const LinkItem: React.FC<LinkItemProps> = ({ icon, title, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-800 dark:text-slate-300"
  >
    <span className="text-blue-600 dark:text-blue-400">{icon}</span>
    <span className="font-semibold dark:text-slate-100 dark:group-hover:text-white">
      {title}
    </span>
  </button>
);

export default LinkItem;