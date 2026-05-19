"use client";

import React, { useState } from 'react';
import { 
  FiBell, 
  FiLock, 
  FiGlobe, 
  FiMoon, 
  FiLogOut, 
  FiChevronRight,
  FiShield,
  FiTrash
} from 'react-icons/fi';
import SubscriptionDialog from '../../../components/subscription/page';
import supabase from '@/lib/db';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// --- Sub Komponen ---
const ToggleItem = ({ title, description, isEnabled, onToggle }: { title: string, description: string, isEnabled: boolean, onToggle: () => void }) => (
  <div className="p-6 flex justify-between items-start gap-4">
    <div className="flex-1">
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
    </div>
    <button 
      onClick={onToggle}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${isEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  </div>
);

const LinkItem = ({ icon, title, onClick }: { icon: React.ReactNode, title: string, onClick?: () => void }) => (
  <button onClick={onClick} className="w-full p-6 flex justify-between items-center hover:bg-slate-50 transition">
    <div className="flex items-center gap-3 font-semibold text-slate-700">
      <span className="text-slate-400">{icon}</span>
      {title}
    </div>
    <FiChevronRight className="text-slate-300" />
  </button>
);

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    newJobs: true,
    projectUpdates: true,
    showEarnings: false,
    publicProfile: true,
    language: 'id',
    theme: 'light'
  });
  const [showSubModal, setShowSubModal] = useState(false);
  const router = useRouter();

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success("Berhasil keluar akun.");
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:pt-12 lg:pt-4 lg:py-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola akun dan preferensi aplikasi KaryaMandiri Anda.</p>
      </header>

      {/* Section: Notifikasi */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <FiBell className="text-blue-600" /> Notifikasi Kerja
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          <ToggleItem 
            title="Info Tugas Baru" 
            description="Dapatkan notifikasi segera saat ada tugas crowdsourcing baru yang sesuai keahlian Anda."
            isEnabled={settings.newJobs}
            onToggle={() => toggleSetting('newJobs')}
          />
          <ToggleItem 
            title="Update Proyek" 
            description="Notifikasi mengenai status pembayaran dan progres proyek yang Anda ikuti."
            isEnabled={settings.projectUpdates}
            onToggle={() => toggleSetting('projectUpdates')}
          />
        </div>
      </section>

      {/* Section: Privasi & Keamanan */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <FiLock className="text-blue-600" /> Privasi
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          <ToggleItem 
            title="Profil Publik" 
            description="Izinkan Employer melihat portofolio dan rating kerja Anda."
            isEnabled={settings.publicProfile}
            onToggle={() => toggleSetting('publicProfile')}
          />
          <ToggleItem 
            title="Sembunyikan Pendapatan" 
            description="Jangan tampilkan total pendapatan Anda di halaman profil publik."
            isEnabled={settings.showEarnings}
            onToggle={() => toggleSetting('showEarnings')}
          />
          <LinkItem onClick={() => setShowSubModal(true)} icon={<FiShield />} title="Ubah Kata Sandi" />
        </div>
      </section>

      {/* Section: Preferensi Aplikasi */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <FiGlobe className="text-blue-600" /> Preferensi
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-800">Bahasa</p>
              <p className="text-xs text-slate-500 italic">Pilih bahasa antarmuka aplikasi</p>
            </div>
            <select className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold outline-none border-none">
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-800 flex items-center gap-2">
                <FiMoon /> Mode Gelap
              </p>
              <p className="text-xs text-slate-500 italic">Gunakan tampilan gelap untuk menghemat baterai</p>
            </div>
            <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-not-allowed opacity-50">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <div className="pt-4 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleLogout}
          className="flex-1 flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition shadow-sm"
        >
          <FiLogOut /> Keluar dari Akun
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 p-4 border border-slate-300 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition shadow-sm"
          onClick={() => setShowSubModal(true)}
        >
          <FiTrash /> Hapus Data Cache
        </button>
      </div>
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>
  );
};

export default Settings;