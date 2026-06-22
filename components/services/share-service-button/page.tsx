/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  FiShare2, 
  FiCopy, 
  FiCheck, 
  FiLinkedin 
} from "react-icons/fi";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link";

interface ShareServiceButtonProps {
  serviceId: string;
  serviceTitle: string;
}

export default function ShareServiceButton({ serviceId, serviceTitle }: ShareServiceButtonProps) {
  const [copied, setCopied] = useState(false);

  // Mengenerate URL detail jasa (sesuaikan dengan routing project Next.js kamu)
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}/services/${serviceId}`;

  // Logika Salin Tautan (Copy to Clipboard)
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Tautan jasa berhasil disalin!");
      
      // Kembalikan icon semula setelah 2 detik
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Gagal menyalin tautan.");
    }
  };

  // Setup template pesan share
  const shareText = encodeURIComponent(`Halo! Cek jasa menarik ini di KaryaMandiri: "${serviceTitle}". Lihat detail selengkapnya di sini: `);

  return (
    <Popover>
      {/* Tombol Pemicu Popover */}
      <PopoverTrigger asChild>
        <button 
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
          title="Bagikan jasa"
        >
          <FiShare2 className="text-base" /> Bagikan
        </button>
      </PopoverTrigger>

      {/* Menu Dropdown Popover */}
      <PopoverContent 
        className="w-56 rounded-2xl p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 transition-colors" 
        side="top" 
        align="end"
      >
        <div className="flex flex-col space-y-1">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1.5">
            Bagikan ke
          </p>
          
          {/* Opsi 1: WhatsApp */}
          <Link
            href={`https://wa.me/?text=${shareText}${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-950/30 hover:text-green-700 dark:hover:text-green-400 rounded-xl transition-colors"
          >
            <FaWhatsapp className="text-lg text-green-500 shrink-0" />
            WhatsApp
          </Link>

          {/* Opsi 2: Telegram */}
          <Link
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors"
          >
            <FaTelegram className="text-lg text-blue-400 shrink-0" />
            Telegram
          </Link>

          {/* Opsi 3: LinkedIn */}
          <Link
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-400 rounded-xl transition-colors"
          >
            <FiLinkedin className="text-lg text-indigo-500 shrink-0" />
            LinkedIn
          </Link>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

          {/* Opsi 4: Salin Tautan */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-3 w-full px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left cursor-pointer"
          >
            {copied ? (
              <FiCheck className="text-lg text-green-600 dark:text-green-400 shrink-0" />
            ) : (
              <FiCopy className="text-lg text-slate-500 dark:text-slate-400 shrink-0" />
            )}
            {copied ? "Tersalin!" : "Salin Tautan"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}