"use client";

import React from 'react';
import { 
  FiActivity, 
  FiTrendingUp, 
  FiUsers, 
  FiLayers, 
  FiArrowUpRight,
  FiZap 
} from 'react-icons/fi';
import { ActivityFeed, GeneralStats } from '../types';

const GeneralDashboard: React.FC = () => {
  // Mock Data untuk Dashboard Umum
  const stats: GeneralStats = {
    activeProjects: 1540,
    totalWorkers: 5240,
    economicImpact: 450000000, // Rp 450jt
    growthRate: 12.5
  };

  const activities: ActivityFeed[] = [
    { id: '1', user: 'Syahriza', action: 'menyelesaikan tugas', target: 'Sortir Logistik UMKM', time: '5 menit lalu', type: 'project' },
    { id: '2', user: 'Koperasi Jaya', action: 'mencairkan dana', target: 'Rp5.000.000.000', time: '20 menit lalu', type: 'payment' },
    { id: '3', user: 'Syahriza', action: 'mendaftar sebagai', target: 'Worker Baru', time: '1 jam lalu', type: 'user' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ringkasan Platform</h1>
          <p className="text-slate-500">Pantau ekosistem inklusi ekonomi KaryaMandiri hari ini.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm text-green-500 text-sm font-medium">
          <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          Sistem Online: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Inklusi" 
          value={`Rp${(stats.economicImpact / 1000000).toFixed(0)}T`} 
          icon={<FiTrendingUp />} 
          trend={`+${stats.growthRate}%`}
          color="blue"
        />
        <SummaryCard 
          title="Pekerja Aktif" 
          value={stats.totalWorkers} 
          icon={<FiUsers />} 
          trend="Januari"
          color="emerald"
        />
        <SummaryCard 
          title="Proyek Crowd" 
          value={stats.activeProjects} 
          icon={<FiLayers />} 
          trend="Live"
          color="purple"
        />
        <SummaryCard 
          title="Kecepatan Serap" 
          value="4.2m" 
          icon={<FiZap />} 
          trend="Per Tugas"
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Aktivitas Terbaru */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FiActivity className="text-blue-600" /> Aktivitas Ekosistem
            </h3>
            <button className="text-xs font-bold text-blue-600 hover:underline">Lihat Semua</button>
          </div>
          <div className="divide-y divide-slate-50">
            {activities.map((item) => (
              <div key={item.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    item.type === 'project' ? 'bg-blue-50 text-blue-600' : 
                    item.type === 'payment' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    {item.type === 'project' ? <FiLayers /> : item.type === 'payment' ? <FiTrendingUp /> : <FiUsers />}
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">
                      <span className="font-bold text-slate-900">{item.user}</span> {item.action} 
                      <span className="font-semibold text-slate-800"> {item.target}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
                <FiArrowUpRight className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Promo/Info Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Model Crowdsourcing</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Membantu sektor informal mendapatkan upah layak melalui pembagian tugas kolektif yang efisien.
              </p>
              <button className="text-xs bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition">
                Pelajari Inklusi
              </button>
            </div>
            <FiLayers className="absolute -right-4 -bottom-4 text-white/10 text-8xl group-hover:scale-110 transition-transform" />
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 text-sm">Target Capaian 2024</h3>
            <div className="space-y-4">
              <ProgressItem label="Distribusi Upah" progress={75} color="bg-blue-500" />
              <ProgressItem label="Verifikasi Pekerja" progress={60} color="bg-emerald-500" />
              <ProgressItem label="Mitra Employer" progress={80} color="bg-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub Komponen ---

const SummaryCard = ({ title, value, icon, trend, color }: any) => {
  const colorClasses: any = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    purple: "text-purple-600 bg-purple-50",
    amber: "text-amber-600 bg-amber-50",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{trend}</span>
      </div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h2 className="text-2xl font-bold text-slate-900">{value}</h2>
    </div>
  );
};

const ProgressItem = ({ label, progress, color }: { label: string, progress: number, color: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
      <span>{label}</span>
      <span>{progress}%</span>
    </div>
    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
      <div className={`${color} h-full transition-all duration-1000`} style={{ width: `${progress}%` }} />
    </div>
  </div>
);

export default GeneralDashboard;