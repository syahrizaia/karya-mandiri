/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Suspense } from "react";
import supabase from "@/lib/db";
import { toast } from "sonner";
import { FiSearch, FiLoader } from "react-icons/fi";
import { createClient } from "@/lib/supabase-browser";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";
import { IServiceFeed, ServiceCard } from "@/components/services/ServiceCard";

function ServicesContent() {
  const [services, setServices] = useState<IServiceFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const initialSearch = searchParams?.get("search") || "";
  
  // State Filter & Search
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");

  // State Utama Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const categories = [
    "Semua Kategori",
    "Web Development",
    "Photography",
    "Videography & Editing",
    "Desain Grafis",
    "Logistik & UMKM"
  ];

  // Fetch data jasa dari platform
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

  // Reset pagination ke halaman 1 jika query pencarian atau kategori berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Logika Filter Sisi Klien
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua Kategori" || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Integrasi Fitur Pencarian Suara Kustom
  useEffect(() => {
    const handleKamaSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      const voiceKeyword = customEvent.detail;
      
      setSearchQuery(voiceKeyword);
      setSelectedCategory("Semua Kategori");
    };

    window.addEventListener("kama-trigger-search", handleKamaSearch);
    return () => window.removeEventListener("kama-trigger-search", handleKamaSearch);
  }, []);

  // Splicing Data Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  const handleHireClick = async (service: IServiceFeed) => {
    const supabaseBrowser = createClient();

    try {
      const { data: { user }, error: authError } = await supabaseBrowser.auth.getUser();

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

      const { error: insertError } = await supabaseBrowser
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
      console.error("Ditemukan Error Supabase:", error);
      toast.error(`Gagal mencatat lead: ${error?.message || "Kesalahan sistem"}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:pt-12 lg:pt-4 lg:p-4 text-slate-900 dark:text-slate-100 transition-colors">
      {/* HEADER UTAMA */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-3xl p-8 md:p-12 text-white shadow-lg transition-colors">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Katalog Jasa & Keahlian</h1>
        <p className="text-blue-100 dark:text-blue-200 mt-2 max-w-2xl text-sm md:text-base">
          Temukan tenaga kerja mandiri, profesional multimedia, desainer, hingga spesialis logistik lokal yang siap membantu operasional bisnis Anda.
        </p>
      </div>

      {/* BILAH PENCARIAN & FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Input Pencarian */}
        <div className="relative md:col-span-2">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari keahlian atau jasa (misal: React, Video, Logistik)..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 shadow-sm transition"
          />
        </div>

        {/* Dropdown Kategori */}
        <div className="w-full">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 shadow-sm font-medium text-slate-700 dark:text-slate-300 transition cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FEED DATA KARTU JASA */}
      {loading ? (
        <div className="p-24 text-center text-slate-500 dark:text-slate-400 font-medium text-sm flex flex-col justify-center items-center gap-3 animate-pulse">
          <FiLoader className="animate-spin text-blue-600 dark:text-blue-400 text-3xl" />
          <span>Menyinkronkan etalase jasa KaryaMandiri...</span>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-16 text-center text-slate-400 dark:text-slate-500 font-medium transition-colors">
          Tidak ada penawaran jasa yang cocok dengan kriteria pencarian Anda saat ini.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onHireClick={handleHireClick} 
              />
            ))}
          </div>

          {/* NAVIGASI PAGINATION FOOTER */}
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              filteredCount={filteredServices.length}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="animate-pulse">Memuat Katalog Jasa KaryaMandiri...</p>
      </div>
    }>
      <ServicesContent />
    </Suspense>
  );
}