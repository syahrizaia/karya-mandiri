import React from "react";
import { FiSearch } from "react-icons/fi";

interface HistoryFiltersProps {
  activeTab: "all" | "income" | "withdrawal";
  setActiveTab: (tab: "all" | "income" | "withdrawal") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="glass-card p-2.5 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-3">
      {/* Segmented Liquid Glass Tab Controls */}
      <div className="flex p-1.5 bg-slate-900/5 dark:bg-white/5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar border border-white/20 dark:border-white/5 backdrop-blur-md">
        {(["all", "income", "withdrawal"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 md:flex-initial text-center px-5 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeTab === tab
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md shadow-blue-500/5 scale-[1.02]"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab === "all" ? "Semua Transaksi" : tab === "income" ? "Pendapatan" : "Penarikan Saldo"}
          </button>
        ))}
      </div>

      {/* Input Pencarian Glass */}
      <div className="relative w-full md:w-72">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
        <input
          type="text"
          placeholder="Cari transaksi atau mitra..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="glass-input w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs md:text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />
      </div>
    </div>
  );
};