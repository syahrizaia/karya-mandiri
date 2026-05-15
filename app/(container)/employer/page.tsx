/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, useEffect, useState } from 'react';
import { FiUsers, FiBriefcase, FiTrendingUp, FiPlus } from 'react-icons/fi';
import { EmployerData } from '../types';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import supabase from '@/lib/db';
import { toast } from 'sonner';
import { IJobs } from '@/app/types/jobs';

// Sub-komponen StatCard
const StatCard = ({ icon, title, value, color }: { icon: any, title: string, value: any, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`${color} p-4 rounded-lg text-white text-2xl`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// Helper function untuk style status
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700';
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    case 'completed': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const EmployerDashboard: React.FC = () => {
  const [createDialog, setCreateDialog] = useState(false);
  const [jobs, setJobs] = useState<IJobs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi fetch data pekerjaan
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Di sini Anda bisa mengganti dengan API call nyata
        const {data, error} = await supabase.from('jobs').select('*').order('posted_at', { ascending: false });
        if(error) {
          console.error('Error fetching jobs:', error);
        } else {
          setJobs(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [supabase]);

  const handlerCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData);

    console.log('Membuat proyek baru:', formData);

    const projectData = {
      id: crypto.randomUUID(),
      ...rawData,
      reward: Number(rawData.reward), // Pastikan menjadi angka
      // Pastikan requirements adalah array, misal dipisahkan koma
      // requirements: typeof rawData.requirements === 'string' 
      //   ? rawData.requirements.split(',').map(item => item.trim()) 
      //   : [],
      requirements: rawData.requirements || "",
      // Tangani tanggal kosong agar tidak menjadi ""
      deadline: rawData.deadline || null, 
      posted_at: new Date().toISOString(),
    };

    // const { data, error } = await supabase.from('jobs').insert([projectData]).select();
  
    // if (error) {
    //   console.error('Error detail:', error.message);
    // } else if (data) {
    //   setJobs((prev) => [...prev, ...data]);
    //   toast("Proyek berhasil dibuat!");
    //   setCreateDialog(false);
    // }

    try {
      const {data, error} = await supabase.from('jobs').insert([projectData]).select();
      if (error) {
        console.error('Error creating project:', error);
      }
      else {
        if (data) {
          setJobs((prev) => [...prev, ...data]);
        }
        toast("Proyek berhasil dibuat!");
        setCreateDialog(false);
      }
    } catch (error) {
      toast("Gagal membuat proyek!");
      console.error('Error creating project:', error);
    } finally {
      setCreateDialog(false);
    }
  };

  // Mock Data (Integrasikan dengan API backend nantinya)
  const stats: EmployerData = {
    name: "Syahriza",
    company: "KaryaMandiri Corp",
    totalProjects: 120,
    activeWorkers: 450,
    totalInvestment: 25000000, // Rp 25.000.000
  };

  const TableLoading = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
        {/* Header Loading */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="h-5 w-48 bg-gray-200 rounded-md"></div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 uppercase text-xs">
            <tr>
              <th className="px-6 py-4"><div className="h-3 w-20 bg-gray-200 rounded"></div></th>
              <th className="px-6 py-4"><div className="h-3 w-16 bg-gray-200 rounded"></div></th>
              <th className="px-6 py-4"><div className="h-3 w-24 bg-gray-200 rounded"></div></th>
              <th className="px-6 py-4"><div className="h-3 w-16 bg-gray-200 rounded"></div></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="h-4 w-40 bg-gray-100 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 w-20 bg-gray-100 rounded-full"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-28 bg-gray-100 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-24 bg-gray-100 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Employer</h1>
          <p className="text-gray-600">Selamat datang kembali, {stats.name}</p>
        </div>
        <Dialog open={createDialog} onOpenChange={setCreateDialog}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
              <FiPlus /> Buat Proyek Baru
            </button>
          </DialogTrigger>
          <DialogContent className='bg-white rounded-2xl'>
            <DialogHeader className='text-slate-700'>
              <DialogTitle>Buat Proyek Baru</DialogTitle>
            </DialogHeader>
            <form action="" onSubmit={handlerCreateProject} className="space-y-4">
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-600 mb-2">Judul Proyek</label>
                <input
                  type="text"
                  id="title"
                  name="title"                 
                  className="w-full px-3 py-2 border rounded text-black"
                  placeholder="Masukkan judul proyek"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-600 mb-2">Deskripsi Proyek</label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full px-3 py-2 border rounded text-black"
                  placeholder="Masukkan deskripsi proyek"
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor="requirements" className="block text-gray-600 mb-2">Persyaratan & Kualifikasi</label>
                <textarea
                  id="requirements"
                  name="requirements"
                  className="w-full px-3 py-2 border rounded text-black"
                  placeholder="Masukkan persyaratan dan kualifikasi"
                  required
                />
              </div>
              <div>
                <label htmlFor="deadline" className="block text-gray-600 mb-2">Deadline Proyek</label>
                <input
                  type="text"
                  id="deadline"
                  name="deadline"
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                />
              </div>
              <div className='mb-4'>
                <label htmlFor="category" className="block text-gray-600 mb-2">Kategori Proyek</label>
                <select id="category" name="category" className="w-full px-3 py-2 border rounded text-black" required>
                  <option value="">Pilih kategori</option>
                  <option value="Produksi">Produksi</option>
                  <option value="Logistik">Logistik</option>
                  <option value="Jasa">Jasa</option>
                  <option value="Konstruksi">Konstruksi</option>
                </select>
              </div>
              <div className='mb-4'>
                <label htmlFor="type" className="block text-gray-600 mb-2">Tipe Proyek</label>
                <select id="type" name="type" className="w-full px-3 py-2 border rounded text-black" required>
                  <option value="">Pilih tipe proyek</option>
                  <option value="Produksi">Crowdsourcing</option>
                  <option value="Logistik">Individu</option>
                </select>
              </div>
              <div className='mb-4'>
                <label htmlFor="location" className="block text-gray-600 mb-2">Lokasi Proyek</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="w-full px-3 py-2 border rounded text-black"
                  placeholder="Masukkan lokasi proyek"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="reward" className="block text-gray-600 mb-2">Budget</label>
                <input
                  type="number"
                  id="reward"
                  name="reward"
                  className="w-full px-3 py-2 border rounded text-black"
                  placeholder="Masukkan budget proyek"
                  required
                />
              </div>
              <input type="datetime-local" name="posted_at" id="posted_at" hidden />
              <DialogFooter>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer">
                  Simpan Proyek
                </button>
                <DialogClose asChild>
                  <button type="button" className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition cursor-pointer">
                    Batal
                  </button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FiBriefcase />} title="Total Proyek" value={stats.totalProjects} color="bg-blue-500" />
        <StatCard icon={<FiUsers />} title="Tenaga Kerja Aktif" value={stats.activeWorkers} color="bg-green-500" />
        <StatCard icon={<FiTrendingUp />} title="Investasi Sosial" value={`Rp${(stats.totalInvestment / 1000000).toFixed(1)}M`} color="bg-purple-500" />
      </div>

      {/* Project Table */}
      {loading ? (
        <TableLoading />
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Status Proyek Crowdsourcing</h2>
          </div>
          
          {/* PEMBUNGKUS SCROLL DISINI */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-150"> 
              {/* min-w-[600px] memastikan tabel tidak terlalu sempit di HP */}
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Judul Proyek</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Kontributor</th>
                  <th className="px-6 py-4 font-medium">Anggaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(job.status ?? 'pending')}`}>
                        { (job.status?.toUpperCase()) ?? "PENDING" }
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {job.taken} dari {job.total} Orang
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700 whitespace-nowrap">
                      Rp{job.reward.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* {loading ? (
        <TableLoading />
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Status Proyek Crowdsourcing</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Judul Proyek</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Kontributor</th>
              <th className="px-6 py-4 font-medium">Anggaran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-800">{job.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(job.status)}`}>
                    {job.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{job.taken} dari {job.total} Orang</td>
                <td className="px-6 py-4 font-semibold text-gray-700">Rp{job.reward.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )} */}
    </div>
  );
};

export default EmployerDashboard;