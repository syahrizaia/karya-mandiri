import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMail, FiPhone, FiSend, FiShield } from "react-icons/fi";

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
      <div className="glass-panel rounded-3xl p-6 sm:p-7 sticky top-24 space-y-6">
        
        {/* Informasi Harga */}
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">
            Tarif Layanan Awal
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              Rp{price.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <hr className="border-slate-200/50 dark:border-white/10" />

        {/* Profil Penyedia Jasa */}
        <div className="space-y-4">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            Penyedia Jasa
          </p>
          
          <div className="flex items-center gap-3">
            {profiles?.avatar_url ? (
              <Image
                src={profiles.avatar_url} 
                alt={profiles.full_name || 'Avatar'} 
                className="w-12 h-12 rounded-2xl object-cover border border-white/20 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                width={60}
                height={60}
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center text-base font-black shrink-0 uppercase">
                {profiles?.full_name ? profiles.full_name.charAt(0) : 'W'}
              </div>
            )}
            
            <div className="overflow-hidden">
              <Link 
                href={`/profile/${profiles?.id}`} 
                className="font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 block truncate transition-colors text-sm"
              >
                {profiles?.full_name || "Mitra Mandiri"}
              </Link>
              <span className="glass-capsule text-[10px] text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg font-bold mt-1 inline-block">
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
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/25 active:scale-98 cursor-pointer"
        >
          <FiSend size={15} /> Hubungi Lewat WhatsApp
        </button>

        <div className="pt-2 flex items-center gap-2 text-slate-400 text-[11px] leading-tight">
          <FiShield className="text-blue-500 shrink-0" />
          <span>Komunikasi dan kesepakatan dilindungi ketentuan layanan KaryaMandiri.</span>
        </div>
      </div>
    </aside>
  );
};