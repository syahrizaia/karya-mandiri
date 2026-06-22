"use client";

import React from 'react';

interface ToggleItemProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ title, description, isEnabled, onToggle }) => (
  <div className="p-6 flex justify-between items-start gap-4">
    <div className="flex-1">
      <p className="font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
        {description}
      </p>
    </div>
    <button
      onClick={onToggle}
      type="button"
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${
        isEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          isEnabled ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export default ToggleItem;