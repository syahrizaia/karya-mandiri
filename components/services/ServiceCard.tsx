/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiLayers, FiCalendar, FiSend } from "react-icons/fi";

export interface IServiceFeed {
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

interface ServiceCardProps {
  service: IServiceFeed;
  onHireClick: (service: IServiceFeed) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onHireClick }) => {
  return (
    <div className="glass-card rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden relative group">
      <Link href={`/services/${service.id}`} className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="glass-capsule inline-flex items-center gap-1.5 px-3 py-1 text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider">
            <FiLayers /> {service.category}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <FiCalendar /> {new Date(service.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
          </span>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            {service.title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed">
            {service.description}
          </p>
        </div>
      </Link>

      <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/10 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <Link href={`/profile/${service.profiles?.id}`} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-bold transition">
            {(service.profiles as any)?.avatar_url ? (
              <Image
                src={(service.profiles as any).avatar_url} 
                alt={service.profiles?.full_name || 'Avatar'} 
                className="w-6 h-6 rounded-xl object-cover border border-white/20 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                width={50}
                height={50}
              />
            ) : (
              <div className="w-6 h-6 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold shrink-0 uppercase">
                {service.profiles?.full_name ? service.profiles.full_name.charAt(0) : 'W'}
              </div>
            )}
            <span className="truncate max-w-[120px] text-xs">
              {service.profiles?.full_name || "Mitra Mandiri"}
            </span>
          </Link>

          <div className="text-right">
            <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Tarif Mulai</p>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
              Rp{service.price.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/services/${service.id}`}
            className="py-2.5 glass-capsule hover:bg-blue-500/10 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition text-center cursor-pointer"
          >
            Lihat Detail
          </Link>
          
          <button
            onClick={() => onHireClick(service)}
            className="py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-md shadow-blue-500/20 cursor-pointer active:scale-95"
          >
            <FiSend size={12} /> Hubungi Jasa
          </button>
        </div>
      </div>
    </div>
  );
};