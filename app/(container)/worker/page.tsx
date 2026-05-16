"use client";

import React, { useEffect, useState } from 'react';
import { 
  FiDollarSign, 
  FiCheckCircle, 
  FiClock, 
  FiStar, 
  FiArrowRight, 
  FiSearch 
} from 'react-icons/fi';
import { WorkerStats } from '../types';
import SubscriptionDialog from '../subscription/page';
import supabase from '@/lib/db';
import { IJobs } from '@/app/types/jobs';
import SaveJobButton from '@/components/save-job-button/page';

const WorkerDashboard: React.FC = () => {
  const [showSubModal, setShowSubModal] = useState(false);
  const [, setLoading] = useState(true);
  const [jobs, setJobs] = useState<IJobs[]>([]);

  useEffect(() => {
    // Simulasi fetch data pekerjaan
    const fetchJobs = async () => {
      setLoading(true);
      // Di sini Anda bisa mengganti dengan API call nyata
      const {data, error} = await supabase.from('jobs').select('*').order('posted_at', { ascending: false });
      if(error) {
        console.error('Error fetching jobs:', error);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };

    fetchJobs();
  }, [supabase]);

  // Mock Data
  const profile: WorkerStats = {
    name: "Syahriza",
    totalEarnings: 4250000000,
    completedTasks: 240,
    rating: 4.9,
    level: "Pejuang Terampil",
  };

  // const availableTasks: Task[] = [
  //   { id: '1', title: 'Sortir Bahan Baku Tekstil', category: 'Produksi', reward: 50000000, deadline: '2 jam lagi', status: 'available' },
  //   { id: '2', title: 'Pengantaran Paket Sembako', category: 'Logistik', reward: 25000000, deadline: 'Hari ini', status: 'available' },
  //   { id: '3', title: 'Pengepakan Barang UMKM', category: 'Jasa', reward: 35000000, deadline: 'Besok', status: 'in_progress' },
  // ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Profil Singkat & Level */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Halo, {profile.name}! 👋</h1>
          <p className="text-slate-500 font-medium italic">Level: {profile.level}</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full shadow-sm">
          <FiStar className="fill-current" />
          <span className="font-bold">{profile.rating} Rating Kerja</span>
        </div>
      </header>

      {/* Ringkasan Pendapatan & Capaian */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-linear-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex justify-between items-center opacity-80 mb-2">
            <p className="text-sm uppercase tracking-wider">Total Pendapatan</p>
            <FiDollarSign />
          </div>
          <h2 className="text-3xl font-bold">Rp{profile.totalEarnings.toLocaleString()}</h2>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500 uppercase">Tugas Selesai</p>
            <h2 className="text-3xl font-bold text-slate-800">{profile.completedTasks}</h2>
          </div>
          <FiCheckCircle className="text-blue-500 text-4xl" />
        </div>
      </div>

      {/* Cari Tugas Baru */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Tugas Disimpan (Crowdsourcing)</h3>
          <button
            className="text-blue-600 text-sm font-semibold flex items-center gap-1"
            onClick={() => setShowSubModal(true)}
          >
            Lihat Semua <FiArrowRight />
          </button>
        </div>

        <div className="space-y-4">
          {jobs.filter(job => job.is_saved).map((job) => (
            <div key={job.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 transition-all shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex gap-4 items-center">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600 hidden sm:block">
                  <FiSearch />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{job.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">{job.category}</span>
                    <span className="flex items-center gap-1"><FiClock /> {job.deadline}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full md:w-auto gap-6">
                <div className="text-left md:text-right">
                  <p className="text-xs text-slate-400">Upah</p>
                  <p className="font-bold text-green-600 italic">Rp{job.reward.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setShowSubModal(true)}
                  className={`px-5 py-2 rounded-lg font-bold transition ${
                  job.status === 'active' 
                  ? 'bg-orange-100 text-orange-600 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  {job.status === 'active' ? 'Sedang Dikerjakan' : 'Ambil Tugas'}
                </button>
                <SaveJobButton is_saved={true} id={job.id} status={'active'} title={job.title} employer={job.employer} employer_name={job.employer_name} category={job.category} location={job.location} reward={job.reward} type={job.type} description={job.description} requirements={job.requirements} taken={job.taken} total={job.total} posted_at={job.posted_at} deadline={job.deadline} />
              </div>
            </div>
          ))}
        </div>

        {/* <div className="space-y-4">
          {availableTasks.map((task) => (
            <div key={task.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 transition-all shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex gap-4 items-center">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600 hidden sm:block">
                  <FiSearch />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{task.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">{task.category}</span>
                    <span className="flex items-center gap-1"><FiClock /> {task.deadline}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full md:w-auto gap-6">
                <div className="text-left md:text-right">
                  <p className="text-xs text-slate-400">Upah</p>
                  <p className="font-bold text-green-600 italic">Rp{task.reward.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setShowSubModal(true)}
                  className={`px-5 py-2 rounded-lg font-bold transition ${
                  task.status === 'in_progress' 
                  ? 'bg-orange-100 text-orange-600 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  {task.status === 'in_progress' ? 'Sedang Dikerjakan' : 'Ambil Tugas'}
                </button>
              </div>
            </div>
          ))}
        </div> */}
      </section>

      {/* Edukasi Mandiri (Micro-learning) */}
      <div className="bg-indigo-900 rounded-2xl p-6 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-2">Tingkatkan Skill-mu! 🚀</h3>
          <p className="text-indigo-200 text-sm mb-4 max-w-md">Ikuti pelatihan singkat gratis untuk mendapatkan akses ke tugas dengan upah lebih tinggi.</p>
          <button
            onClick={() => setShowSubModal(true)}
            className="bg-white text-indigo-900 px-4 py-2 rounded-lg font-bold text-sm"
          >
            Mulai Belajar
          </button>
        </div>
        <FiStar className="absolute -right-4 -bottom-4 text-indigo-800 text-9xl opacity-50" />
      </div>
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>
  );
};

export default WorkerDashboard;
