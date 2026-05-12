"use client";

import React, { useState } from 'react';
import { 
  FiSearch, 
  FiMapPin, 
  FiFilter, 
  FiUsers, 
  FiClock
} from 'react-icons/fi';
import { Job } from '../types';

const Jobs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock Data Pekerjaan
  const allJobs: Job[] = [
    {
      id: 'JOB-01',
      title: 'Pengepakan Paket Sembako Bulk',
      employer: 'Koperasi Makmur',
      category: 'Produksi',
      location: 'Jakarta Timur',
      reward: 45000000,
      type: 'Crowdsourcing',
      slots: { taken: 12, total: 50 },
      postedAt: '2 jam lalu'
    },
    {
      id: 'JOB-02',
      title: 'Kurir Pengantaran Sayur Organik',
      employer: 'TaniHub Local',
      category: 'Logistik',
      location: 'Depok',
      reward: 30000000,
      type: 'Individu',
      slots: { taken: 1, total: 5 },
      postedAt: '5 jam lalu'
    },
    {
      id: 'JOB-03',
      title: 'Tenaga Harian Sortir Sampah Plastik',
      employer: 'GreenEarthy',
      category: 'Jasa',
      location: 'Bekasi',
      reward: 60000000,
      type: 'Crowdsourcing',
      slots: { taken: 8, total: 20 },
      postedAt: '1 hari lalu'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Search & Hero Section */}
      <section className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Temukan Peluang Kerja</h1>
          <p className="text-blue-100 mb-6">Pilih tugas yang sesuai dengan keahlian dan lokasi Anda.</p>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative text-slate-800">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari posisi atau perusahaan..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-blue-300 text-white border outline-none transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-8 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2">
              <FiFilter /> Filter
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
           <FiUsers size={300} />
        </div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filter (Desktop) */}
        <aside className="hidden lg:block space-y-6">
          <div>
            <h3 className="font-bold text-slate-800 mb-4">Kategori Sektor</h3>
            <div className="space-y-2">
              {['Produksi', 'Logistik', 'Jasa', 'Konstruksi'].map((cat) => (
                <label key={cat} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white cursor-pointer transition">
                  <input type="checkbox" className="w-5 h-5 rounded text-blue-600" />
                  <span className="text-slate-600 font-medium">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-2">Upah Minimum</h3>
            <p className="text-2xl font-bold text-green-600 mb-4">Rp25.000.000</p>
            <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
        </aside>

        {/* Job List Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center px-2">
            <p className="text-slate-500 font-medium">{allJobs.length} Lowongan Tersedia</p>
            <select className="bg-transparent font-semibold text-blue-600 outline-none">
              <option>Terbaru</option>
              <option>Upah Tertinggi</option>
            </select>
          </div>

          {allJobs.map((job) => (
            <div key={job.id} className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      job.type === 'Crowdsourcing' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {job.type}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <FiClock /> {job.postedAt}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition">{job.title}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-1"><FiBriefcase className="text-blue-500"/> {job.employer}</div>
                    <div className="flex items-center gap-1"><FiMapPin className="text-red-400"/> {job.location}</div>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end gap-4 min-w-[150px]">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Upah Tugas</p>
                    <p className="text-2xl font-bold text-green-600">Rp{job.reward.toLocaleString()}</p>
                  </div>
                  <button className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition shadow-md">
                    Lamar Sekarang
                  </button>
                </div>
              </div>

              {/* Crowdsourcing Progress Bar */}
              {job.type === 'Crowdsourcing' && (
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500 uppercase">Kuota Crowdsourcing</span>
                    <span className="text-blue-600">{job.slots.taken} / {job.slots.total} Pekerja</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-500" 
                      style={{ width: `${(job.slots.taken / job.slots.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// Helper Component for Icon
const FiBriefcase = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);

export default Jobs;