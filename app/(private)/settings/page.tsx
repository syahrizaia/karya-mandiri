/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { 
  FiBell, 
  FiLock, 
  FiGlobe, 
  FiLogOut, 
  FiShield, 
  FiTrash2
} from 'react-icons/fi';
import supabase from '@/lib/db';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ToggleItem from '@/components/settings/ToggleItem';
import LinkItem from '@/components/settings/LinkItem';
import ChangePasswordModal from '@/components/settings/ChangePasswordModal';

const Settings: React.FC = () => {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [settings, setSettings] = useState({
    newJobs: true,
    projectUpdates: true,
    showEarnings: false,
    publicProfile: true,
    language: 'id',
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    setSettings(prev => ({ ...prev, language: selectedLanguage }));
    toast.success(`Bahasa diubah ke: ${selectedLanguage === 'id' ? 'Bahasa Indonesia' : 'English'}`);
  };

  const handleClearCache = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      localStorage.clear();
      sessionStorage.clear();
      toast.success("Seluruh cache lokal aplikasi berhasil dibersihkan!");
    } catch (err) {
      toast.error("Gagal membersihkan cache data.");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success("Berhasil keluar akun.");
      router.push("/");
      router.refresh();
    } else {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-7 pt-4 pb-14 md:pt-10 transition-colors duration-300">
      {/* Header */}
      <header>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Pengaturan
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Kelola preferensi akun, privasi profil, dan notifikasi platform KaryaMandiri Anda.
        </p>
      </header>

      {/* Section: Notifikasi */}
      <section className="glass-panel rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="p-5 sm:p-6 border-b border-white/20 dark:border-white/5 bg-slate-900/5 dark:bg-white/5 backdrop-blur-md">
          <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
              <FiBell size={18} />
            </span>
            Notifikasi Kerja & Proyek
          </h2>
        </div>
        <div className="divide-y divide-slate-200/40 dark:divide-white/5">
          <ToggleItem 
            title="Info Tugas Baru" 
            description="Dapatkan notifikasi segera saat ada tugas crowdsourcing baru yang sesuai keahlian Anda."
            isEnabled={settings.newJobs}
            onToggle={() => handleToggle('newJobs')}
          />
          <ToggleItem 
            title="Update Proyek" 
            description="Notifikasi mengenai status pembayaran dan progres proyek yang Anda ikuti."
            isEnabled={settings.projectUpdates}
            onToggle={() => handleToggle('projectUpdates')}
          />
        </div>
      </section>

      {/* Section: Privasi */}
      <section className="glass-panel rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="p-5 sm:p-6 border-b border-white/20 dark:border-white/5 bg-slate-900/5 dark:bg-white/5 backdrop-blur-md">
          <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <FiLock size={18} />
            </span>
            Privasi & Keamanan Akun
          </h2>
        </div>
        <div className="divide-y divide-slate-200/40 dark:divide-white/5">
          <ToggleItem 
            title="Profil Publik" 
            description="Izinkan pemberi kerja (Employer) melihat portofolio dan rating kerja Anda di direktori talenta."
            isEnabled={settings.publicProfile}
            onToggle={() => handleToggle('publicProfile')}
          />
          <ToggleItem 
            title="Sembunyikan Pendapatan" 
            description="Jangan tampilkan total pendapatan dan dompet saldo Anda di halaman profil publik."
            isEnabled={settings.showEarnings}
            onToggle={() => handleToggle('showEarnings')}
          />
          <LinkItem onClick={() => setShowPasswordModal(true)} icon={<FiShield size={18} />} title="Ubah Kata Sandi Akun" />
        </div>
      </section>

      {/* Section: Preferensi */}
      <section className="glass-panel rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="p-5 sm:p-6 border-b border-white/20 dark:border-white/5 bg-slate-900/5 dark:bg-white/5 backdrop-blur-md">
          <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400">
              <FiGlobe size={18} />
            </span>
            Preferensi Regional & Bahasa
          </h2>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">Bahasa Antarmuka</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pilih bahasa tampilan sistem aplikasi</p>
            </div>
            <select 
              value={settings.language}
              onChange={handleLanguageChange}
              className="glass-input px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
            >
              <option value="id" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Bahasa Indonesia</option>
              <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">English (US)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Danger Zone Glass Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleLogout}
          type="button"
          className="flex-1 flex items-center justify-center gap-2.5 p-4 rounded-2xl font-bold text-sm bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all duration-200 cursor-pointer shadow-sm group"
        >
          <FiLogOut className="group-hover:-translate-x-1 transition-transform" size={18} /> 
          Keluar dari Akun
        </button>
        <button
          onClick={handleClearCache}
          type="button"
          className="glass-capsule flex-1 flex items-center justify-center gap-2.5 p-4 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 cursor-pointer shadow-sm group"
        >
          <FiTrash2 className="text-slate-400 group-hover:scale-110 transition-transform" size={18} /> 
          Bersihkan Data Cache
        </button>
      </div>

      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  );
};

export default Settings;