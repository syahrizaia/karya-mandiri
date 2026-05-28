/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import supabase from "@/lib/db";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { id } from "date-fns/locale/id";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  FiChevronLeft, 
  FiClock, 
  FiLayers, 
  FiSend, 
  FiPhone, 
  FiMail, 
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import ShareServiceButton from "@/components/ui/share-service-button/page";

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
      } catch (err: any) {
        console.error("Error fetching service detail:", err);
        toast.error("Gagal memuat detail jasa.");
        router.push("/services"); // Backup redirect ke katalog utama
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [serviceId, router]);

  const handleContactClick = () => {
    if (!service || !service.profiles) return;

    const rawPhone = service.profiles.phone;

    if (!rawPhone) {
      toast.error(`Gagal menghubungi: ${service.profiles.full_name} belum mengatur nomor telepon di profil.`);
      return;
    }

    // Standardisasi nomor telepon ke format WhatsApp Internasional (62)
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
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!service) return <div className="text-center py-20 font-medium text-slate-500">Penawaran jasa tidak ditemukan.</div>;

  return (
    <div className="min-h-screen pb-12">
      {/* HEADER NAVIGASI */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 py-2">
        <div className="max-w-5xl mx-auto px-6 py-2 flex justify-between items-center">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 pl-4 md:pl-0 text-slate-600 hover:text-blue-600 font-bold transition text-sm"
          >
            <FiChevronLeft /> Kembali ke Katalog
          </button>

          <ShareServiceButton serviceId={service.id} serviceTitle={service.title} />
        </div>
      </div>

      <main className="max-w-5xl mx-auto mt-6 px-4 md:px-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* KOLOM KIRI: DETAIL UTAMA */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs"
            >
              {/* Badge Kategori & Waktu */}
              <div className="flex flex-wrap gap-3 mb-4 items-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 font-bold rounded-lg text-[10px] uppercase tracking-wider">
                  <FiLayers /> {service.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <FiClock /> {formatDistanceToNow(new Date(service.created_at), { addSuffix: true, locale: id })}
                </span>
              </div>

              {/* Judul Utama */}
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-6">
                {service.title}
              </h1>

              {/* Garis Pemisah */}
              <hr className="border-slate-100 my-6" />

              {/* Konten Deskripsi */}
              <div className="prose prose-slate max-w-none">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wide mb-3">Deskripsi Jasa & Layanan</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {service.description}
                </p>
              </div>

              {/* Garis Pemisah */}
              <hr className="border-slate-100 my-6" />

              {/* Benefit / Jaminan Sistem */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                <h4 className="text-xs font-bold text-slate-800 uppercase mb-2 flex items-center gap-1.5">
                  <FiCheckCircle className="text-green-500" /> Transaksi Aman & Terverifikasi
                </h4>
                <p className="text-xs text-slate-500 leading-normal">
                  Gunakan sistem kontrak kerja mandiri atau mintalah invoice digital resmi melalui platform saat kesepakatan proyek telah dicapai dengan penyedia jasa ini.
                </p>
              </div>
            </motion.div>
          </div>

          {/* KOLOM KANAN: WIDGET TARIF & PROFIL */}
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24 space-y-6">
              
              {/* Informasi Harga */}
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Tarif Layanan Awal</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-green-600">
                    Rp{service.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Profil Penyedia Jasa */}
              <div className="space-y-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Profil Penyedia Jasa</p>
                
                <div className="flex items-center gap-3">
                  {service.profiles?.avatar_url ? (
                    <Image
                      src={service.profiles.avatar_url} 
                      alt={service.profiles.full_name || 'Avatar'} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      width={60}
                      height={60}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-base font-bold shrink-0 uppercase">
                      {service.profiles?.full_name ? service.profiles.full_name.charAt(0) : 'W'}
                    </div>
                  )}
                  
                  <div className="overflow-hidden">
                    <Link 
                      href={`/profile/${service.profiles?.id}`} 
                      className="font-black text-blue-400 text-base hover:text-blue-600 block truncate transition-colors"
                    >
                      {service.profiles?.full_name || "Anonymous Worker"}
                    </Link>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-semibold mt-0.5 inline-block">
                      Mitra Mandiri
                    </span>
                  </div>
                </div>

                {/* Detail Kontak Singkat */}
                <div className="space-y-2 pt-2 text-slate-500 text-xs">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-slate-400 shrink-0" />
                    <span className="truncate">{service.profiles?.email || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-slate-400 shrink-0" />
                    <span>{service.profiles?.phone || "Belum mengatur kontak"}</span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button
                onClick={handleContactClick}
                className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition shadow-xs hover:shadow-md active:scale-[0.98]"
              >
                <FiSend size={16} /> Hubungi Lewat WhatsApp
              </button>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default DetailService;