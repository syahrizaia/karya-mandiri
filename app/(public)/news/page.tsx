/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import NewsCard from "@/components/news/NewsCard";
import NewsHeader from "@/components/news/NewsHeader";
import NewsSkeleton from "@/components/news/NewsSkeleton";
import React, { useState, useEffect } from "react";

export interface INewsArticle {
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
  const [region, setRegion] = useState<string>("id");

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
              const mappedNewsApi = data.articles
                .filter((art: any) => art.title && art.urlToImage && art.title !== "[Removed]")
                .map((art: any) => ({
                  title: art.title,
                  description: art.description,
                  url: art.url,
                  urlToImage: art.urlToImage,
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
          console.error("Gagal mengambil data dari GNews:", err);
        }
      }

      // --- INTEGRASI AMAN MULTI-API ---
      try {
        const gnewsUrl = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=id&country=id&apikey=${gnewsApiKey}`;
        const res = await fetch(gnewsUrl);
        
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
        console.error("GNews tidak dapat dijangkau:", err);
      }

      // --- SORTING BERDASARKAN TANGGAL TERBARU ---
      combinedArticles.sort((a, b) => {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });

      setArticles(combinedArticles);
      setLoading(false);
    };

    const delayDebounce = setTimeout(() => {
      fetchAllNews();
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [category, region, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 lg:pt-12 transition-colors">
      {/* Bagian Header, Navigasi Regional, Kategori, & Pencarian */}
      <NewsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        category={category}
        setCategory={setCategory}
        region={region}
        setRegion={setRegion}
      />

      {/* Konten Utama */}
      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <NewsSkeleton key={i} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 transition-colors">
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              Tidak ada berita yang ditemukan untuk kriteria ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NewsPage;