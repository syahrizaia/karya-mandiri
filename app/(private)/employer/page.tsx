/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { 
  FiUsers, 
  FiBriefcase, 
  FiTrendingUp, 
  FiTrash2, 
  FiEdit2, 
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiSearch
} from 'react-icons/fi';
import { EmployerData } from '../types';
import supabase from '@/lib/db';
import { IJobs } from '@/app/types/jobs';
import { useRouter } from 'next/navigation';
import CreateProjectDialog from '../../../components/create-job/page';
import EditProjectDialog from '@/components/edit-job/page';
import DeleteProjectDialog from '@/components/delete-job/page';
import Link from 'next/link';

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

const formatDynamicRupiah = (value: number) => {
  if (value >= 1_000_000_000) {
    return `Rp${(value / 1_000_000_000).toFixed(1).replace('.0', '')} M`; 
  }
  if (value >= 1_000_000) {
    return `Rp${(value / 1_000_000).toFixed(1).replace('.0', '')} Jt`; 
  }
  return `Rp${value.toLocaleString('id-ID')}`; 
};

const EmployerDashboard: React.FC = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<IJobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [employerName, setEmployerName] = useState<string>("User");
  const [selectedJob, setSelectedJob] = useState<{
    job: IJobs;
    action: "edit" | "delete";
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  // State Utama untuk Keperluan Navigasi Halaman Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Batas maksimal baris data per halaman di sini

  // Perhitungan State Statis dari Database Secara Dinamis
  const [stats, setStats] = useState<EmployerData>({
    name: "User",
    company: "KaryaMandiri Corp",
    totalProjects: 0,
    activeWorkers: 0,
    totalInvestment: 0,
  });

  useEffect(() => {
    const fetchEmployerDashboardData = async () => {
      setLoading(true);
      
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (profile?.full_name) {
          setEmployerName(profile.full_name);
        }

        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('user_id', user.id) 
          .order('posted_at', { ascending: false });

        if (jobsError) {
          console.error('Error fetching filtered jobs:', jobsError);
        } else if (jobsData) {
          setJobs(jobsData);

          const totalJobsCreated = jobsData.length;
          const totalWorkersGathered = jobsData.reduce((acc, job) => acc + (job.taken || 0), 0);
          const totalBudgetSpent = jobsData.reduce((acc, job) => acc + ((job.reward || 0) * (job.taken || 0)), 0);

          setStats({
            name: profile?.full_name || "Employer",
            company: "KaryaMandiri Corp",
            totalProjects: totalJobsCreated,
            activeWorkers: totalWorkersGathered,
            totalInvestment: totalBudgetSpent > 0 ? totalBudgetSpent : 0,
          });
        }
      } catch (err) {
        console.error('Terjadi kesalahan data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerDashboardData();
  }, [router]);

  // 🌟 Reset halaman aktif ke 1 setiap kali query pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // 🌟 FILTER DATA BERDASARKAN INPUT PENCARIAN (Judul Proyek)
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // LOGIKA HITUNGAN SLICE DATA PAGINATION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = jobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Callback penanganan pasca-hapus agar halaman tidak bug jika kosong
  const handleDeleteSuccess = (deletedId: string) => {
    const updatedJobs = jobs.filter((item) => item.id !== deletedId);
    setJobs(updatedJobs);
    
    const newTotalPages = Math.ceil(updatedJobs.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const TableLoading = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
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
    <div className="min-h-fit p-0 md:pt-12 lg:p-4">
      {/* Header */}
      <header className="flex justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Employer</h1>
          <p className="text-gray-600">Selamat datang kembali, {stats.name}</p>
        </div>

        <CreateProjectDialog />
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FiBriefcase />} title="Total Proyek" value={stats.totalProjects} color="bg-blue-500" />
        <StatCard icon={<FiUsers />} title="Tenaga Kerja Aktif" value={stats.activeWorkers} color="bg-green-500" />
        <StatCard icon={<FiTrendingUp />} title="Investasi Sosial" value={formatDynamicRupiah(stats.totalInvestment)} color="bg-purple-500" />
      </div>

      {/* Project Table */}
      {loading ? (
        <TableLoading />
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header Tabel & Input Fitur Cari */}
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Status Proyek Crowdsourcing</h2>

            {jobs.length > 0 && (
              <div className="relative w-full sm:w-64">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul proyek..."
                  className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-gray-50/50"
                />
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            {jobs.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
                  <FiAlertCircle size={32} />
                </div>
                <h3 className="text-md font-bold text-slate-700">Belum Ada Proyek</h3>
                <p className="text-sm text-slate-400 max-w-xs">Anda belum mempublikasikan lowongan proyek crowdsourcing apa pun saat ini.</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              /* Kondisi jika ada proyek tapi hasil ketikan search tidak cocok */
              <div className="p-12 text-center text-gray-400 font-medium text-sm">
                Tidak ada proyek yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
              </div>
            ) : (
              <>
                <table className="w-full text-left border-collapse min-w-175"> 
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4 font-medium">Judul Proyek</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Kontributor</th>
                      <th className="px-6 py-4 font-medium">Anggaran per Orang</th>
                      <th className="px-6 py-4 font-medium text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* Loop menggunakan currentJobs hasil filter dan slice */}
                    {currentJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                          <Link 
                            href={`/jobs/${job.id}`} 
                            className="text-blue-600 hover:text-blue-800 hover:underline transition"
                          >
                            {job.title}
                          </Link>
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
                        <td className='px-4 py-2 whitespace-nowrap'>
                          <div className="flex items-center gap-2 justify-center">
                            <button
                              type="button"
                              onClick={() => setSelectedJob({ job, action: "edit" })}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedJob({ job, action: "delete" })}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* BILAH NAVIGASI BAR FOOTER PAGINATION */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center text-sm">
                    <p className="text-xs text-gray-400 font-semibold">
                      Menampilkan <span className="text-gray-700">{indexOfFirstItem + 1}</span> -{" "}
                      <span className="text-gray-700">
                        {Math.min(indexOfLastItem, jobs.length)}
                      </span>{" "}
                      dari <span className="text-gray-700">{jobs.length}</span> proyek
                    </p>

                    <div className="flex items-center gap-1">
                      {/* Tombol Back */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
                      >
                        <FiChevronLeft size={16} />
                      </button>

                      {/* Baris Iterasi Angka Halaman */}
                      {Array.from({ length: totalPages }, (_, idx) => (
                        <button
                          key={idx + 1}
                          onClick={() => handlePageChange(idx + 1)}
                          className={`w-8 h-8 text-xs font-bold rounded-xl transition cursor-pointer ${
                            currentPage === idx + 1
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}

                      {/* Tombol Next */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
                      >
                        <FiChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {selectedJob?.action === "edit" && (
        <EditProjectDialog
          job={selectedJob.job}
          open={selectedJob !== null && selectedJob.action === "edit"}
          onOpenChange={(open) => {
            if (!open) setSelectedJob(null);
          }}
          onSuccess={() => {
            setSelectedJob(null);
          }}
        />
      )}

      {selectedJob?.action === "delete" && (
        <DeleteProjectDialog
          job={selectedJob.job}
          id={selectedJob.job.id}
          title={selectedJob.job.title}
          open={selectedJob !== null && selectedJob.action === "delete"}
          onOpenChange={(open) => {
            if (!open) setSelectedJob(null);
          } }
          onSuccess={() => {
            handleDeleteSuccess(selectedJob.job.id);
            setSelectedJob(null);
          } }
        />
      )}
    </div>
  );
};

export default EmployerDashboard;