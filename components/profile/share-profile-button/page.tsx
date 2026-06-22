"use client";

import React, { useState } from 'react';
import { FiShare2, FiCheck } from 'react-icons/fi';
import { toast } from 'sonner';

interface ShareProfileButtonProps {
  profileId: string;
  fullName: string;
}

const ShareProfileButton: React.FC<ShareProfileButtonProps> = ({ profileId, fullName }) => {
  const [copied, setCopied] = useState(false);

  // Ambil domain dasar secara dinamis berdasarkan window location
  const getProfileUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/profile/${profileId}`;
    }
    return '';
  };

  const handleShare = async () => {
    const profileUrl = getProfileUrl();

    // Coba gunakan Web Share API jika didukung oleh browser (terutama di HP/Mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Profil ${fullName} - KaryaMandiri`,
          text: `Halo! Lihat profil profesional ${fullName} di KaryaMandiri.`,
          url: profileUrl,
        });
        toast.success("Profil berhasil dibagikan!");
      } catch (err) {
        // Abaikan jika user membatalkan (AbortError)
        if ((err as Error).name !== 'AbortError') {
          console.error("Gagal membagikan:", err);
        }
      }
    } else {
      // Fallback: Salin ke Clipboard jika di desktop atau browser tidak mendukung Web Share
      try {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        toast.success("Tautan profil berhasil disalin ke papan klip!");
        
        // Kembalikan ikon ke semula setelah 2 detik
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Gagal menyalin tautan:", err);
        toast.error("Gagal menyalin tautan.");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full flex items-center gap-3 px-4 py-2.5 md:px-4 md:py-2 bg-transparent md:bg-blue-50 dark:md:bg-blue-950/40 text-slate-700 dark:text-slate-300 md:text-blue-600 dark:md:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 md:hover:bg-blue-100 dark:md:hover:bg-blue-900/50 rounded-xl font-semibold text-sm md:text-base transition-all text-left cursor-pointer"
      title="Bagikan Profil"
    >
      {copied ? (
        <>
          <FiCheck className="text-green-600 dark:text-green-400 animate-bounce" size={18} />
          <span className="text-green-600 dark:text-green-400">Tersalin!</span>
        </>
      ) : (
        <>
          <FiShare2 size={18} />
          <span>Bagikan</span>
        </>
      )}
    </button>
  );
};

export default ShareProfileButton;