"use client";

import React from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

interface JobFiltersProps {
  selectedCategories: string[];
  handleCategoryChange: (category: string) => void;
  minReward: number;
  setMinReward: (reward: number) => void;
  maxPriceLimit: number;
  showFilterDrawer: boolean;
  setShowFilterDrawer: (show: boolean) => void;
  filteredJobsCount: number;
  handleResetAllFilters: () => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  selectedCategories,
  handleCategoryChange,
  minReward,
  setMinReward,
  maxPriceLimit,
  showFilterDrawer,
  setShowFilterDrawer,
  filteredJobsCount,
  handleResetAllFilters,
}) => {
  const categories = ['Produksi', 'Logistik', 'Jasa', 'Konstruksi'];

  return (
    <>
      {/* Sidebar Filter (Desktop) */}
      <aside className="hidden lg:block space-y-6">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 transition-colors">
            Kategori Sektor
          </h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label 
                key={cat} 
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-900/50 cursor-pointer transition-colors"
              >
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded text-blue-600 accent-blue-600 cursor-pointer dark:bg-slate-800 dark:border-slate-700"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                <span className="text-slate-600 dark:text-slate-400 font-medium transition-colors">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors">
            Upah Minimum
          </h3>
          <p className="text-xl font-bold text-green-600 dark:text-green-400 mb-4 transition-colors">
            Rp{minReward.toLocaleString('id-ID')}
          </p>
          <input 
            type="range" 
            min="0"
            max={maxPriceLimit}
            step="10000"
            value={minReward}
            onChange={(e) => setMinReward(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500" 
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-2 transition-colors">
            <span>Rp0</span>
            <span>Max: Rp{maxPriceLimit.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </aside>

      {/* DRAWER MODAL FILTER UNTUK DEVICE MOBILE & TABLET */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs" 
            onClick={() => setShowFilterDrawer(false)}
          />
          
          <div className="relative w-80 max-w-full bg-white dark:bg-slate-900 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-slide-left z-10 transition-colors">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 transition-colors">
                  <FiFilter className="text-blue-600 dark:text-blue-400"/> Filter Lowongan
                </h2>
                <button 
                  onClick={() => setShowFilterDrawer(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-sm uppercase tracking-wide transition-colors">
                  Kategori Sektor
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <label 
                      key={cat} 
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded text-blue-600 accent-blue-600 cursor-pointer dark:bg-slate-800 dark:border-slate-700"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                      />
                      <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold transition-colors">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 transition-colors">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1 text-sm uppercase tracking-wide transition-colors">
                  Upah Minimum
                </h3>
                <p className="text-lg font-black text-green-600 dark:text-green-400 mb-3 transition-colors">
                  Rp{minReward.toLocaleString('id-ID')}
                </p>
                <input 
                  type="range" 
                  min="0"
                  max={maxPriceLimit}
                  step="10000"
                  value={minReward}
                  onChange={(e) => setMinReward(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500" 
                />
                <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-2 transition-colors">
                  <span>Rp0</span>
                  <span>Max: Rp{maxPriceLimit.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="w-full py-3.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm cursor-pointer"
              >
                Terapkan Filter ({filteredJobsCount})
              </button>
              <button
                onClick={handleResetAllFilters}
                className="w-full py-2.5 text-slate-500 dark:text-slate-400 font-bold text-xs hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
              >
                Reset Pilihan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};