/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import supabase from "@/lib/db";
import { toast } from "sonner";
import { 
  FiSearch, 
  FiLoader, 
  FiLayers, 
  FiUser, 
  FiSend, 
  FiCalendar 
} from "react-icons/fi";

interface IServiceFeed {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
  // Relasi join untuk mengambil data nama pembuat jasa dari tabel profiles
  profiles: {
    full_name: string;
  } | null;
}

export default function Services() {
  const [services, setServices] = useState<IServiceFeed[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");

  const categories = [
    "Semua Kategori",
    "Web Development",
    "Photography",
    "Videography & Editing",
    "Desain Grafis",
    "Logistik & UMKM"
  ];

  // Fetch semua data jasa yang ada di platform
  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        setLoading(true);
        
        // Mengambil data jasa sekalian melakukan JOIN ke tabel profiles untuk tahu siapa yang memposting
        const { data, error } = await supabase
          .from("services")
          .select(`
            id,
            title,
            description,
            price,
            category,
            created_at,
            profiles (
              full_name
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setServices((data as any) || []);
      } catch (err: any) {
        toast.error("Gagal memuat postingan jasa: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllServices();
  }, []);

  // Filter Logik di Sisi Klien
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua Kategori" || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleHireClick = (service: IServiceFeed) => {
    // Aksi ketika tombol hubungi diklik
    const message = encodeURIComponent(`Halo, saya tertarik dengan jasa Anda di KaryaMandiri: "${service.title}". Bisa berdiskusi lebih lanjut?`);
    toast.info(`Membuka komunikasi dengan ${service.profiles?.full_name || "Penyedia Jasa"}`);
    // Contoh direct ke tautan eksternal tiruan
    window.open(`https://wa.me/6282114487163?text=${message}`, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:pt-12 lg:pt-4 lg:p-4">
      {/* HEADER UTAMA */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-lg">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Katalog Jasa & Keahlian</h1>
        <p className="text-blue-100 mt-2 max-w-2xl text-sm md:text-base">
          Temukan tenaga kerja mandiri, profesional multimedia, desainer, hingga spesialis logistik lokal yang siap membantu operasional bisnis Anda.
        </p>
      </div>

      {/* BILAH PENCARIAN & FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Input Cari */}
        <div className="relative md:col-span-2">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari keahlian atau jasa (misal: React, Video, Logistik)..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 shadow-sm transition"
          />
        </div>

        {/* Dropdown Kategori */}
        <div className="w-full">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 shadow-sm font-medium text-slate-700 transition"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FEED DATA KARTU JASA */}
      {loading ? (
        <div className="p-24 text-center text-slate-500 font-medium text-sm flex flex-col justify-center items-center gap-3 animate-pulse">
          <FiLoader className="animate-spin text-blue-600 text-3xl" />
          <span>Menyinkronkan etalase jasa KaryaMandiri...</span>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400 font-medium">
          Tidak ada penawaran jasa yang cocok dengan kriteria pencarian Anda saat ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden p-6 relative group hover:border-blue-300"
            >
              <div className="space-y-4">
                {/* Kategori Badge */}
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-[10px] uppercase tracking-wider">
                    <FiLayers /> {service.category}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <FiCalendar /> {new Date(service.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </span>
                </div>

                {/* Judul & Deskripsi */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-4 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Bagian Bawah: Profil Pembuat, Tarif & Tombol Aksi */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  {/* Nama Pekerja */}
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                      <FiUser size={14} />
                    </div>
                    <span className="truncate max-w-30">
                      {service.profiles?.full_name || "Anonymous Worker"}
                    </span>
                  </div>

                  {/* Tarif Jasa */}
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tarif Mulai</p>
                    <p className="text-base font-black text-green-600">
                      Rp{service.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Tombol Hubungi */}
                <button
                  onClick={() => handleHireClick(service)}
                  className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition group-hover:shadow-sm"
                >
                  <FiSend size={14} /> Hubungi Penyedia Jasa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}