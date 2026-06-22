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
    <div className="flex flex-col md:flex-row justify-between items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm transition-colors">
      {/* Tab Filter */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar transition-colors">
        {(["all", "income", "withdrawal"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 md:flex-initial text-center px-4 py-2 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {tab === "all" ? "Semua" : tab === "income" ? "Pendapatan" : "Penarikan"}
          </button>
        ))}
      </div>

      {/* Input Pencarian */}
      <div className="relative w-full md:w-64">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Cari transaksi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-colors"
        />
      </div>
    </div>
  );
};