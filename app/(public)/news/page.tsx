/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FiSearch, FiGlobe, FiExternalLink, FiCalendar } from "react-icons/fi";

interface INewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

const NewsPage = () => {
  const [articles, setArticles] = useState<INewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("general");
  const [region, setRegion] = useState<string>("id"); // 'id' untuk Nasional, 'us' atau kosong untuk Internasional

  useEffect(() => {
    const fetchAllNews = async () => {
        setLoading(true);
        let combinedArticles: INewsArticle[] = [];

        const newsApiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
        const gnewsApiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY;

        // --- AMBIL DATA DARI NEWSAPI.ORG ---
        if (newsApiKey) {
        try {
            let url = `https://newsapi.org/v2/top-headlines?country=id&category=${category}&apiKey=${newsApiKey}`;
            if (searchQuery) {
            url = `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=publishedAt&apiKey=${newsApiKey}`;
            }

            const res = await fetch(url);
            if (res.ok) {
            const data = await res.json();
            if (data.articles) {
                // Mapping agar sesuai struktur komponen kita
                const mappedNewsApi = data.articles
                .filter((art: any) => art.title && art.urlToImage && art.title !== "[Removed]")
                .map((art: any) => ({
                    title: art.title,
                    description: art.description,
                    url: art.url,
                    urlToImage: art.urlToImage, // Properti bawaan NewsAPI
                    publishedAt: art.publishedAt,
                    source: { name: art.source.name },
                }));
                
                combinedArticles = [...combinedArticles, ...mappedNewsApi];
            }
            }
        } catch (err) {
            console.error("Gagal mengambil data dari NewsAPI:", err);
        }
        }

        // --- AMBIL DATA DARI GNEWS.IO ---
        if (gnewsApiKey) {
        try {
            let url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=id&country=id&apikey=${gnewsApiKey}`;
            if (searchQuery) {
            url = `https://gnews.io/api/v4/search?q=${searchQuery}&lang=id&apikey=${gnewsApiKey}`;
            }

            const res = await fetch(url);
            if (res.ok) {
            const data = await res.json();
            if (data.articles) {
                // Mapping data GNews (Ubah 'image' menjadi 'urlToImage')
                const mappedGNews = data.articles
                .filter((art: any) => art.title && art.image)
                .map((art: any) => ({
                    title: art.title,
                    description: art.description,
                    url: art.url,
                    urlToImage: art.image, // news menggunakan .image, kita ubah ke .urlToImage
                    publishedAt: art.publishedAt,
                    source: { name: art.source.name },
                }));

                combinedArticles = [...combinedArticles, ...mappedGNews];
            }
            }
        } catch (err) {
            console.error("Gagal mengambil data dari GNews:", err);
        }
        }

        // --- INTEGRASI AMAN MULTI-API ---
        try {
        const gnewsUrl = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=id&country=id&apikey=${gnewsApiKey}`;
        const res = await fetch(gnewsUrl);
        
        // JIKA VENDOR EROR (403/429/500), JANGAN CRASH. CUKUP LOG DAN LANJUTKAN.
        if (!res.ok) {
            console.warn(`GNews mengembalikan status ${res.status}. Kuota mungkin habis.`);
        } else {
            const data = await res.json();
            if (data.articles) {
            const mappedGNews = data.articles
                .filter((art: any) => art.title && art.image)
                .map((art: any) => ({
                title: art.title,
                description: art.description,
                url: art.url,
                urlToImage: art.image,
                publishedAt: art.publishedAt,
                source: { name: art.source.name },
                }));

            combinedArticles = [...combinedArticles, ...mappedGNews];
            }
        }
        } catch (err) {
        // Menangkap eror jika server down atau masalah jaringan internet
        console.error("GNews tidak dapat dijangkau:", err);
        }

        // --- SORTING BERDASARKAN TANGGAL TERBARU ---
        // Karena digabung, susunan tanggalnya berantakan. Mari kita urutkan dari yang paling baru.
        combinedArticles.sort((a, b) => {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });

        // Masukkan semua data yang berhasil dikumpulkan ke State UI
        setArticles(combinedArticles);
        setLoading(false);
    };

    // Debounce pencarian agar tidak spamming API setiap ketikan huruf
    const delayDebounce = setTimeout(() => {
      fetchAllNews();
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [category, region, searchQuery]);

  const formatTanggal = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:pt-12">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FiGlobe className="text-blue-600 animate-spin-slow" /> Pusat Berita Akurat
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Informasi terpercaya dari agensi berita nasional dan internasional terverifikasi.
            </p>
          </div>

          {/* Navigasi Regional */}
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => { setRegion("id"); setSearchQuery(""); }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                region === "id" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Berita Nasional
            </button>
            <button
              onClick={() => { setRegion("us"); setSearchQuery(""); }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                region === "us" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Berita Internasional
            </button>
          </div>
        </div>

        {/* Filter Kategori & Pencarian */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-2">
          {/* List Kategori (Hanya aktif jika tidak sedang mencari keyword spesifik) */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {["general", "business", "technology", "sports", "science", "health"].map((cat) => (
              <button
                key={cat}
                disabled={!!searchQuery}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border transition shrink-0 ${
                  category === cat && !searchQuery
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                }`}
              >
                {cat === "general" ? "Utama" : cat === "business" ? "Bisnis" : cat === "technology" ? "Teknologi" : cat}
              </button>
            ))}
          </div>

          {/* Kolom Pencarian */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari topik berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* Main Content / Grid Berita */}
      <main className="max-w-7xl mx-auto">
        {loading ? (
          // Skeleton Loading 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-4 space-y-4 animate-pulse">
                <div className="w-full h-48 bg-slate-200 rounded-2xl" />
                <div className="h-4 w-1/3 bg-slate-200 rounded" />
                <div className="space-y-2">
                  <div className="h-5 w-full bg-slate-300 rounded" />
                  <div className="h-5 w-5/6 bg-slate-300 rounded" />
                </div>
                <div className="h-4 w-full bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <p className="text-slate-400 text-sm">Tidak ada berita yang ditemukan untuk kriteria ini.</p>
          </div>
        ) : (
          // Grid Artikel Berita
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <article 
                key={index} 
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Gambar Berita */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={article.urlToImage}
                    alt={article.title}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    unoptimized
                    onError={(e) => {
                      // Fallback jika gambar rusak
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600";
                    }}
                  />
                  <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {article.source.name}
                  </span>
                </div>

                {/* Info & Teks */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Meta Tanggal */}
                    <div className="flex items-center gap-3 text-slate-400 text-xs">
                      <span className="flex items-center gap-1">
                        <FiCalendar /> {formatTanggal(article.publishedAt)}
                      </span>
                    </div>
                    {/* Judul */}
                    <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition text-base">
                      {article.title}
                    </h3>
                    {/* Deskripsi Singkat */}
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                      {article.description || "Klik lihat selengkapnya untuk membaca detail berita utuh dari sumber resmi terkait."}
                    </p>
                  </div>

                  {/* Tombol Klik Sumber Asli */}
                  <div className="pt-2">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                    >
                      Baca Selengkapnya <FiExternalLink />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NewsPage;