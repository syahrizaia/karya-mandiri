"use client";

import React from "react";
import { FiSearch, FiGlobe } from "react-icons/fi";

interface NewsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
  region: string;
  setRegion: (region: string) => void;
}

const NewsHeader: React.FC<NewsHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  region,
  setRegion,
}) => {
  return (
    <header className="max-w-7xl mx-auto mb-8 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2 transition-colors">
            <FiGlobe className="text-blue-600 dark:text-blue-400 animate-spin-slow" /> Pusat Berita Akurat
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">
            Informasi terpercaya dari agensi berita nasional dan internasional terverifikasi.
          </p>
        </div>

        {/* Navigasi Regional */}
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <button
            onClick={() => { setRegion("id"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              region === "id" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Berita Nasional
          </button>
          <button
            onClick={() => { setRegion("us"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              region === "us" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Berita Internasional
          </button>
        </div>
      </div>

      {/* Filter Kategori & Pencarian */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-2">
        {/* List Kategori */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {["general", "business", "technology", "sports", "science", "health"].map((cat) => (
            <button
              key={cat}
              disabled={!!searchQuery}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border transition shrink-0 cursor-pointer ${
                category === cat && !searchQuery
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {cat === "general" ? "Utama" : cat === "business" ? "Bisnis" : cat === "technology" ? "Teknologi" : cat}
            </button>
          ))}
        </div>

        {/* Kolom Pencarian */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Cari topik berita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-colors"
          />
        </div>
      </div>
    </header>
  );
};

export default NewsHeader;