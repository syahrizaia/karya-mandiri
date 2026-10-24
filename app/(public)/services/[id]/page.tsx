/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/lib/db";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { id } from "date-fns/locale/id";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { FiClock, FiLayers, FiCheckCircle } from "react-icons/fi";
import { toast } from "sonner";
import { ServiceDetailHeader } from "@/components/services/ServiceDetailHeader";
import { ServiceDetailSidebar } from "@/components/services/ServiceDetailSidebar";

interface IServiceDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
  user_id: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    avatar_url?: string | null;
  } | null;
}

const DetailService: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;
  
  const [service, setService] = useState<IServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) return;

    const fetchServiceDetail = async () => {
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
            user_id,
            profiles (
              id,
              full_name,
              email,
              phone,
              avatar_url
            )
          `)
          .eq("id", serviceId)
          .single();

        if (error) throw error;
        setService(data as any);

        await supabase.from('interaction_logs').insert([
          { item_id: serviceId, item_type: 'service', interaction_type: 'view' }
        ]);

      } catch (err: any) {
        console.error("Error fetching service detail:", err);
        toast.error("Gagal memuat detail jasa.");
        router.push("/services");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [serviceId, router]);

  const handleContactClick = async () => {
    if (!service || !service.profiles) return;

    const rawPhone = service.profiles.phone;

    if (!rawPhone) {
      toast.error(`Gagal menghubungi: ${service.profiles.full_name} belum mengatur nomor telepon di profil.`);
      return;
    }

    try {
      await supabase.from('interaction_logs').insert([
        { item_id: serviceId, item_type: 'service', interaction_type: 'interest' }
      ]);
    } catch (err) {
      console.error("Gagal mencatat log minat:", err);
    }

    let cleanPhone = rawPhone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }

    const message = encodeURIComponent(
      `Halo, saya melihat penawaran Anda di KaryaMandiri: "${service.title}". Apakah jasa tersebut saat ini tersedia untuk didiskusikan lebih lanjut?`
    );

    toast.info(`Membuka WhatsApp dengan ${service.profiles.full_name}`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
    </div>
  );

  if (!service) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="glass-panel p-8 text-center rounded-3xl max-w-md">
        <p className="text-slate-600 dark:text-slate-300 font-bold mb-4">Penawaran jasa tidak ditemukan.</p>
        <button 
          onClick={() => router.push('/services')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Kembali ke Katalog
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-16 text-slate-900 dark:text-slate-100 transition-colors">
      {/* HEADER NAVIGASI */}
      <ServiceDetailHeader 
        serviceId={service.id} 
        serviceTitle={service.title} 
        onBack={() => router.back()} 
      />

      <main className="max-w-5xl mx-auto px-4 mt-4 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* KOLOM KIRI: DETAIL UTAMA */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-3xl p-6 sm:p-8"
            >
              {/* Badge Kategori & Waktu */}
              <div className="flex flex-wrap gap-3 mb-4 items-center">
                <span className="glass-capsule text-blue-600 dark:text-blue-400 font-bold px-3 py-1 text-[10px] uppercase tracking-wider">
                  <FiLayers className="inline mr-1" /> {service.category}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <FiClock /> {formatDistanceToNow(new Date(service.created_at), { addSuffix: true, locale: id })}
                </span>
              </div>

              {/* Judul Utama */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                {service.title}
              </h1>

              {/* Garis Pemisah */}
              <hr className="border-slate-200/50 dark:border-white/10 my-6" />

              {/* Konten Deskripsi */}
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Deskripsi Jasa & Layanan
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {service.description}
                </p>
              </div>

              {/* Garis Pemisah */}
              <hr className="border-slate-200/50 dark:border-white/10 my-6" />

              {/* Benefit / Jaminan Sistem */}
              <div className="glass-card p-4 sm:p-5 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase mb-2 flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-500 text-sm" /> Transaksi Aman & Terverifikasi
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Gunakan kesepakatan tertulis dan mintalah invoice digital resmi melalui platform saat pesanan proyek disetujui bersama mitra terkait.
                </p>
              </div>
            </motion.div>
          </div>

          {/* KOLOM KANAN: WIDGET TARIF & PROFIL */}
          <ServiceDetailSidebar 
            price={service.price} 
            profiles={service.profiles} 
            onContactClick={handleContactClick} 
          />

        </div>
      </main>
    </div>
  );
};

export default DetailService;