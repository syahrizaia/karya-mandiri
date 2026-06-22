import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMail, FiPhone, FiSend } from "react-icons/fi";

interface ServiceDetailSidebarProps {
  price: number;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    avatar_url?: string | null;
  } | null;
  onContactClick: () => void;
}

export const ServiceDetailSidebar: React.FC<ServiceDetailSidebarProps> = ({
  price,
  profiles,
  onContactClick,
}) => {
  return (
    <aside className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800/80 shadow-sm sticky top-24 space-y-6 transition-colors">
        
        {/* Informasi Harga */}
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">
            Tarif Layanan Awal
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-green-600 dark:text-green-400">
              Rp{price.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Profil Penyedia Jasa */}
        <div className="space-y-4">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            Profil Penyedia Jasa
          </p>
          
          <div className="flex items-center gap-3">
            {profiles?.avatar_url ? (
              <Image
                src={profiles.avatar_url} 
                alt={profiles.full_name || 'Avatar'} 
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                width={60}
                height={60}
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base font-bold shrink-0 uppercase">
                {profiles?.full_name ? profiles.full_name.charAt(0) : 'W'}
              </div>
            )}
            
            <div className="overflow-hidden">
              <Link 
                href={`/profile/${profiles?.id}`} 
                className="font-black text-blue-400 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 block truncate transition-colors"
              >
                {profiles?.full_name || "Anonymous Worker"}
              </Link>
              <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold mt-0.5 inline-block transition-colors">
                Mitra Mandiri
              </span>
            </div>
          </div>

          {/* Detail Kontak Singkat */}
          <div className="space-y-2 pt-2 text-slate-500 dark:text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <FiMail className="text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate">{profiles?.email || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiPhone className="text-slate-400 dark:text-slate-500 shrink-0" />
              <span>{profiles?.phone || "Belum mengatur kontak"}</span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={onContactClick}
          className="w-full py-4 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition shadow-xs hover:shadow-md active:scale-[0.98] cursor-pointer"
        >
          <FiSend size={16} /> Hubungi Lewat WhatsApp
        </button>
      </div>
    </aside>
  );
};