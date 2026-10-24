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
    <article className="glass-card rounded-3xl overflow-hidden flex flex-col group transition-all duration-300">
      {/* Gambar Berita */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900/30">
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
        <span className="absolute top-4 left-4 glass-capsule px-3 py-1 text-white text-[10px] font-bold uppercase tracking-wider">
          {article.source.name}
        </span>
      </div>

      {/* Info & Teks */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Meta Tanggal */}
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs">
            <FiCalendar /> {formatTanggal(article.publishedAt)}
          </div>
          {/* Judul */}
          <h3 className="font-black text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base leading-snug">
            {article.title}
          </h3>
          {/* Deskripsi Singkat */}
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-3">
            {article.description || "Klik lihat selengkapnya untuk membaca detail liputan utuh dari sumber resmi terkait."}
          </p>
        </div>

        {/* Tombol Tautan Sumber Asli */}
        <div className="pt-2 border-t border-slate-200/50 dark:border-white/10">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline transition"
          >
            Baca Selengkapnya <FiExternalLink size={13} />
          </a>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;