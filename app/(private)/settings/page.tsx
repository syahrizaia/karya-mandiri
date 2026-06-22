/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState } from 'react';
import { 
  FiBell, 
  FiLock, 
  FiGlobe, 
  FiLogOut, 
  FiShield, 
  FiTrash
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
    <div className="max-w-4xl mx-auto space-y-6 md:pt-12 lg:pt-4 lg:py-4 transition-colors duration-300">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Pengaturan</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Kelola akun dan preferensi aplikasi KaryaMandiri Anda.
        </p>
      </header>

      {/* Section: Notifikasi */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <h2 className="font-bold text-slate-800 dark:text-slate-50 flex items-center gap-2">
            <FiBell className="text-blue-600 dark:text-blue-400" /> Notifikasi Kerja
          </h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
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
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <h2 className="font-bold text-slate-800 dark:text-slate-50 flex items-center gap-2">
            <FiLock className="text-blue-600 dark:text-blue-400" /> Privasi
          </h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <ToggleItem 
            title="Profil Publik" 
            description="Izinkan Employer melihat portofolio dan rating kerja Anda."
            isEnabled={settings.publicProfile}
            onToggle={() => handleToggle('publicProfile')}
          />
          <ToggleItem 
            title="Sembunyikan Pendapatan" 
            description="Jangan tampilkan total pendapatan Anda di halaman profil publik."
            isEnabled={settings.showEarnings}
            onToggle={() => handleToggle('showEarnings')}
          />
          <LinkItem onClick={() => setShowPasswordModal(true)} icon={<FiShield />} title="Ubah Kata Sandi Akun" />
        </div>
      </section>

      {/* Section: Preferensi */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <h2 className="font-bold text-slate-800 dark:text-slate-50 flex items-center gap-2">
            <FiGlobe className="text-blue-600 dark:text-blue-400" /> Preferensi
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">Bahasa</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">Pilih bahasa antarmuka aplikasi</p>
            </div>
            <select 
              value={settings.language}
              onChange={handleLanguageChange}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl text-sm font-bold outline-none border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <option value="id" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Bahasa Indonesia</option>
              <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">English</option>
            </select>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <div className="pt-4 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleLogout}
          type="button"
          className="flex-1 flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold rounded-2xl hover:bg-red-100 dark:hover:bg-red-950/50 transition shadow-sm focus:outline-none"
        >
          <FiLogOut /> Keluar dari Akun
        </button>
        <button
          onClick={handleClearCache}
          type="button"
          className="flex-1 flex items-center justify-center gap-2 p-4 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition shadow-sm focus:outline-none"
        >
          <FiTrash /> Hapus Data Cache
        </button>
      </div>

      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  );
};

export default Settings;