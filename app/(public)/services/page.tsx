/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import supabase from "@/lib/db";
import { toast } from "sonner";
import { 
  FiSearch, 
  FiLoader, 
  FiLayers, 
  FiSend, 
  FiCalendar,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { useSearchParams } from "next/navigation";

interface IServiceFeed {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
  profiles: {
    id: string;
    full_name: string;
    phone: string | null;
    avatar_url?: string | null;
  } | null;
}

export default function Services() {
  const [services, setServices] = useState<IServiceFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const initialSearch = searchParams?.get("search") || "";
  
  // State Filter & Search
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");

  // State Utama untuk Keperluan Navigasi Halaman Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Batas maksimal data per halaman sesuai instruksi

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
              id,
              full_name,
              phone,
              avatar_url
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

  // Reset halaman aktif kembali ke 1 jika filter pencarian/kategori diubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Filter Logik di Sisi Klien
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua Kategori" || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const handleKamaSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      const voiceKeyword = customEvent.detail;
      
      setSearchQuery(voiceKeyword); // Mengisi kolom input secara otomatis
      setSelectedCategory("Semua Kategori"); // Reset kategori ke semua agar jangkauan pencarian suara luas
    };

    window.addEventListener("kama-trigger-search", handleKamaSearch);
    return () => window.removeEventListener("kama-trigger-search", handleKamaSearch);
  }, []);

  // LOGIKA UTAMA SPLICING DATA PAGINATION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Auto-scroll kembali ke bagian atas katalog saat pindah halaman demi UX yang baik
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  const handleHireClick = async (service: IServiceFeed) => {
    const supabase = createClient();

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error("Anda harus login terlebih dahulu untuk menghubungi penyedia jasa!");
        return;
      }

      const workerId = service.profiles?.id; 
      if (!workerId) {
        toast.error("Data penyedia jasa tidak valid.");
        return;
      }

      if (user.id === workerId) {
        toast.error("Anda tidak bisa menyewa atau menghubungi jasa Anda sendiri.");
        return;
      }

      const rawPhone = service.profiles?.phone;
      if (!rawPhone) {
        toast.error(`Gagal menghubungi: ${service.profiles?.full_name || "Penyedia Jasa"} belum mengatur nomor telepon di profil mereka.`);
        return;
      }

      let cleanPhone = rawPhone.replace(/\D/g, "");
      if (cleanPhone.startsWith("0")) {
        cleanPhone = "62" + cleanPhone.slice(1);
      }

      const { error: insertError } = await supabase
        .from('service_clicks')
        .insert([
          {
            pencari_jasa_id: user.id,
            worker_id: workerId
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      const message = encodeURIComponent(
        `Halo, saya tertarik dengan jasa Anda di KaryaMandiri: "${service.title}". Bisa berdiskusi lebih lanjut?`
      );
      
      toast.info(`Membuka komunikasi dengan ${service.profiles?.full_name || "Penyedia Jasa"}`);
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");

    } catch (error: any) {
      // Jangan membungkus objek di dalam kurung kurawal baru agar properti aslinya terlihat
      console.error("Ditemukan Error Supabase:", error); 
      
      // Atau paksa konversi ke string
      console.log("Stringified Error:", JSON.stringify(error, null, 2));

      toast.error(`Gagal mencatat lead: ${error?.message || "Kesalahan sistem"}`);
    }
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
        <>
          {/* Loop diarahkan ke data page aktif (currentServices) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentServices.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden p-6 relative group hover:border-blue-300"
              >
                <Link href={`/services/${service.id}`} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-[10px] uppercase tracking-wider">
                      <FiLayers /> {service.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <FiCalendar /> {new Date(service.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 text-sm mt-2 line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </Link>

                <div className="mt-2 pt-4 border-t border-slate-300 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <Link href={`/profile/${service.profiles?.id}`} className="flex items-center gap-2 text-blue-400 hover:text-blue-600 transition font-semibold">
                      {(service.profiles as any)?.avatar_url ? (
                        <Image
                          src={(service.profiles as any).avatar_url} 
                          alt={service.profiles?.full_name || 'Avatar'} 
                          className="w-6 h-6 rounded-xl object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                          width={50}
                          height={50}
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 uppercase">
                          {service.profiles?.full_name ? service.profiles.full_name.charAt(0) : 'W'}
                        </div>
                      )}
                      <span className="truncate max-w-30">
                        {service.profiles?.full_name || "Anonymous Worker"}
                      </span>
                    </Link>

                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tarif Mulai</p>
                      <p className="text-base font-black text-green-600">
                        Rp{service.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href={`/services/${service.id}`}
                      className="py-3 bg-white border border-slate-200 hover:border-blue-600 hover:bg-blue-100 text-slate-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition text-center"
                    >
                      Lihat Detail
                    </Link>
                    
                    <button
                      onClick={() => handleHireClick(service)}
                      className="py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition group-hover:shadow-sm"
                    >
                      <FiSend size={13} /> Hubungi Jasa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* NAVIGASI PAGINATION FOOTER */}
          {totalPages > 1 && (
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-between items-center text-center sm:text-left text-sm">
              <p className="text-xs text-slate-400 font-semibold w-full sm:w-auto">
                Menampilkan <span className="text-slate-700">{indexOfFirstItem + 1}</span> -{" "}
                <span className="text-slate-700">
                  {Math.min(indexOfLastItem, filteredServices.length)}
                </span>{" "}
                dari <span className="text-slate-700">{filteredServices.length}</span> penawaran jasa
              </p>

              {/* Tetap di tengah pada device mobile berkat utilitas `mx-auto sm:mx-0` */}
              <div className="flex items-center justify-center gap-1 mx-auto sm:mx-0">
                {/* Tombol Back */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
                >
                  <FiChevronLeft size={16} />
                </button>

                {/* Iterasi Angka Halaman */}
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`w-9 h-9 text-xs font-bold rounded-xl transition cursor-pointer ${
                      currentPage === idx + 1
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                {/* Tombol Next */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}