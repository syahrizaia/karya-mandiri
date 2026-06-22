"use client";

import React from "react";
import Image from "next/image";
import { FiExternalLink, FiCalendar } from "react-icons/fi";
import { INewsArticle } from "@/app/(public)/news/page";

interface NewsCardProps {
  article: INewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const formatTanggal = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <article className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
      {/* Gambar Berita */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <Image
          src={article.urlToImage}
          alt={article.title}
          fill
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          unoptimized
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600";
          }}
        />
        <span className="absolute top-4 left-4 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-sm text-white dark:text-slate-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          {article.source.name}
        </span>
      </div>

      {/* Info & Teks */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Meta Tanggal */}
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-xs">
            <span className="flex items-center gap-1">
              <FiCalendar /> {formatTanggal(article.publishedAt)}
            </span>
          </div>
          {/* Judul */}
          <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition text-base">
            {article.title}
          </h3>
          {/* Deskripsi Singkat */}
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-3">
            {article.description || "Klik lihat selengkapnya untuk membaca detail berita utuh dari sumber resmi terkait."}
          </p>
        </div>

        {/* Tombol Tautan Sumber Asli */}
        <div className="pt-2">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
          >
            Baca Selengkapnya <FiExternalLink />
          </a>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;