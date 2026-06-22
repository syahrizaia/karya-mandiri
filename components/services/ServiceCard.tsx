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
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden p-6 relative group hover:border-blue-300 dark:hover:border-blue-500">
      <Link href={`/services/${service.id}`} className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-lg text-[10px] uppercase tracking-wider transition-colors">
            <FiLayers /> {service.category}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <FiCalendar /> {new Date(service.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            {service.title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 line-clamp-3 leading-relaxed">
            {service.description}
          </p>
        </div>
      </Link>

      <div className="mt-2 pt-4 border-t border-slate-300 dark:border-slate-800 space-y-4 transition-colors">
        <div className="flex justify-between items-center text-sm">
          <Link href={`/profile/${service.profiles?.id}`} className="flex items-center gap-2 text-blue-400 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold">
            {(service.profiles as any)?.avatar_url ? (
              <Image
                src={(service.profiles as any).avatar_url} 
                alt={service.profiles?.full_name || 'Avatar'} 
                className="w-6 h-6 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                width={50}
                height={50}
              />
            ) : (
              <div className="w-6 h-6 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0 uppercase">
                {service.profiles?.full_name ? service.profiles.full_name.charAt(0) : 'W'}
              </div>
            )}
            <span className="truncate max-w-30">
              {service.profiles?.full_name || "Anonymous Worker"}
            </span>
          </Link>

          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Tarif Mulai</p>
            <p className="text-base font-black text-green-600 dark:text-green-400">
              Rp{service.price.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href={`/services/${service.id}`}
            className="py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/30 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition text-center cursor-pointer"
          >
            Lihat Detail
          </Link>
          
          <button
            onClick={() => onHireClick(service)}
            className="py-3 bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition group-hover:shadow-sm cursor-pointer"
          >
            <FiSend size={13} /> Hubungi Jasa
          </button>
        </div>
      </div>
    </div>
  );
};