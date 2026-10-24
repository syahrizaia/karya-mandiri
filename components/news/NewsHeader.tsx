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
    <header className="max-w-7xl mx-auto mb-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="glass-capsule text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-3 py-1 mb-2 inline-flex items-center gap-1.5">
            <FiGlobe /> Informasi Terkini & Kebijakan
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Pusat Berita Akurat
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Informasi terpercaya dari agensi berita nasional dan internasional terverifikasi seputar ketenagakerjaan dan teknologi.
          </p>
        </div>

        {/* Navigasi Regional */}
        <div className="glass-capsule p-1.5 flex gap-1 shadow-md">
          <button
            onClick={() => { setRegion("id"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              region === "id" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-slate-600 dark:text-slate-300 hover:bg-white/10"
            }`}
          >
            Berita Nasional
          </button>
          <button
            onClick={() => { setRegion("us"); setSearchQuery(""); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              region === "us" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-slate-600 dark:text-slate-300 hover:bg-white/10"
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
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition shrink-0 cursor-pointer ${
                category === cat && !searchQuery
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                  : "glass-card text-slate-600 dark:text-slate-300 hover:bg-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="glass-input w-full pl-11 pr-4 py-2.5 rounded-2xl text-slate-900 dark:text-white text-sm outline-none transition font-medium"
          />
        </div>
      </div>
    </header>
  );
};

export default NewsHeader;