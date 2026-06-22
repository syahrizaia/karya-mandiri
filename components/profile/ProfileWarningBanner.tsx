import React from 'react';
import { FiShield as FiShieldIcon } from 'react-icons/fi';

interface ProfileWarningBannerProps {
  isOwnProfile: boolean;
  isVerified: boolean;
}

export const ProfileWarningBanner: React.FC<ProfileWarningBannerProps> = ({
  isOwnProfile,
  isVerified,
}) => {
  if (!isOwnProfile || isVerified) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs animate-in fade-in slide-in-from-top-4 duration-300 transition-colors">
      <div className="flex gap-3 items-start min-w-0">
        <div className="p-2 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-2xl shrink-0 mt-0.5">
          <FiShieldIcon size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-800 dark:text-amber-100">
            Akun Anda Belum Terverifikasi
          </h3>
          <p className="text-xs text-slate-600 dark:text-amber-200/80 mt-1 leading-relaxed">
            Segera lakukan verifikasi identitas untuk mendapatkan lencana verifikasi dan membuka akses penuh seluruh fitur crowdsourcing KaryaMandiri. Klik tombol <strong>Edit Profil</strong> untuk melengkapi data Nama Lengkap dan Nomor Telepon. Sistem akan otomatis memproses verifikasi Anda.
          </p>
        </div>
      </div>
    </div>
  );
};