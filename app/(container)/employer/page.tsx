/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, SubmitEvent, useEffect, useState } from 'react';
import { FiUsers, FiBriefcase, FiTrendingUp, FiPlus, FiLoader } from 'react-icons/fi';
import { EmployerData } from '../types';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import supabase from '@/lib/db';
import { toast } from 'sonner';
import { IJobs } from '@/app/types/jobs';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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

  // const handlerCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const rawData = Object.fromEntries(formData);

  //   console.log('Membuat proyek baru:', formData);

  //   const projectData = {
  //     id: crypto.randomUUID(),
  //     ...rawData,
  //     reward: Number(rawData.reward), // Pastikan menjadi angka
  //     // Pastikan requirements adalah array, misal dipisahkan koma
  //     // requirements: typeof rawData.requirements === 'string' 
  //     //   ? rawData.requirements.split(',').map(item => item.trim()) 
  //     //   : [],
  //     requirements: rawData.requirements || "",
  //     // Tangani tanggal kosong agar tidak menjadi ""
  //     deadline: rawData.deadline || null, 
  //     posted_at: new Date().toISOString(),
  //   };

  //   // const { data, error } = await supabase.from('jobs').insert([projectData]).select();
  
  //   // if (error) {
  //   //   console.error('Error detail:', error.message);
  //   // } else if (data) {
  //   //   setJobs((prev) => [...prev, ...data]);
  //   //   toast("Proyek berhasil dibuat!");
  //   //   setCreateDialog(false);
  //   // }

  //   try {
  //     const {data, error} = await supabase.from('jobs').insert([projectData]).select();
  //     if (error) {
  //       console.error('Error creating project:', error);
  //     }
  //     else {
  //       if (data) {
  //         setJobs((prev) => [...prev, ...data]);
  //       }
  //       toast("Proyek berhasil dibuat!");
  //       setCreateDialog(false);
  //     }
  //   } catch (error) {
  //     toast("Gagal membuat proyek!");
  //     console.error('Error creating project:', error);
  //   } finally {
  //     setCreateDialog(false);
  //   }
  // };

  const CreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    const projectData = {
      id: crypto.randomUUID(),
      title: rawData.title,
      employer: "Anonymous", // Hidden data
      description: rawData.description,
      requirements: rawData.requirements, // Disimpan sebagai string murni
      deadline: rawData.deadline || null,
      category: rawData.category,
      type: rawData.type,
      location: rawData.location,
      reward: Number(rawData.reward),
      taken: 0, // Hidden data awal
      total: Number(rawData.total),
      posted_at: rawData.posted_at ? new Date(rawData.posted_at as string).toISOString() : new Date().toISOString(), // Hidden data
      status: "active", // Hidden data default
    };

    try {
      const { data, error } = await supabase.from("jobs").insert([projectData]).select();

      // if (error) throw error;

      // setJobs((prev) => [...prev, ...data]);
      // alert("Proyek berhasil dipublikasikan!");
      // setIsCreateDialogOpen(false);
      // router.refresh(); // Refresh data di dashboard

      if (error) {
        throw error;
      }
      else {
        if (data) {
          setJobs((prev) => [...prev, ...data]);
        }
        toast("Proyek berhasil dibuat!");
        setIsCreateDialogOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error inserting project:", error);
      alert("Gagal membuat proyek. Periksa koneksi atau database.");
    } finally {
      setLoading(false);
    }
  }

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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              <FiPlus /> Buat Proyek Baru
            </button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto rounded-3xl p-8 bg-white border-none shadow-2xl">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-black text-slate-900">Buat Proyek Baru</DialogTitle>
              <p className="text-slate-500 text-sm italic">Employer: Anonymous</p>
            </DialogHeader>

            <form onSubmit={CreateProject} className="space-y-6">
              {/* Baris 1: Judul */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Judul Proyek</label>
                <input
                  type='text'
                  name="title"
                  required
                  placeholder="Contoh: Pengumpulan Data Foto UMKM"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* Baris 2: Deskripsi */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Deskripsi Tugas</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition"
                ></textarea>
              </div>

              {/* Baris 3: Requirements */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Persyaratan (Gunakan baris baru untuk poin-poin)</label>
                <textarea
                  name="requirements"
                  placeholder="1. Memiliki HP Android&#10;2. Domisili Bekasi"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition"
                ></textarea>
              </div>

              {/* Baris 4: Lokasi & Kategori (Grid 2 Kolom) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Kategori</label>
                  <select name="category" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white">
                    <option value="Survey">Survey</option>
                    <option value="Data Entry">Data Entry</option>
                    <option value="Creative">Creative</option>
                    <option value="Teknis">Teknis</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Lokasi</label>
                  <input type="text" name="location" required placeholder="Contoh: Remote / Jakarta" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                </div>
              </div>

              {/* Baris 5: Type & Reward */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Tipe Proyek</label>
                  <select name="type" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white">
                    <option value="Crowdsourcing">Crowdsourcing</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Upah (Rp)</label>
                  <input name="reward" type="number" required placeholder="Contoh: 50000" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                </div>
              </div>

              {/* Baris 6: Total Kuota & Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Total Kuota Pekerja</label>
                  <input name="total" type="number" required placeholder="Jumlah orang" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    name="posted_at" 
                    type="datetime-local"
                    // defaultValue={new Date().toISOString().slice(0, 16)} // Set default ke waktu sekarang
                    hidden
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Batas Akhir (Deadline)</label>
                    <input 
                      name="deadline" 
                      type="datetime-local"
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white text-slate-700" 
                    />
                  </div>
                </div>
                {/* <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Deadline</label>
                  <input name="deadline" type="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                </div> */}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-blue-300"
                >
                  {loading ? <FiLoader className="animate-spin" /> : "Buat Proyek"}
                </button>
              </div>
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