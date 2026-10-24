'use client';

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
import CreateProjectDialog from '../../../components/employer/create-job/page';
import EditProjectDialog from '@/components/employer/edit-job/page';
import DeleteProjectDialog from '@/components/employer/delete-job/page';
import Link from 'next/link';
import StatCard from '@/components/employer/StatCard';
import TableLoading from '@/components/employer/TableLoading';

// Helper function untuk style status dengan dukungan Liquid Glass
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'active': 
      return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
    case 'pending': 
      return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30';
    case 'completed': 
      return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30';
    default: 
      return 'glass-capsule text-slate-600 dark:text-slate-400';
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
  const [selectedJob, setSelectedJob] = useState<{
    job: IJobs;
    action: "edit" | "delete";
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  // State pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State statistik dinamis dari DB
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
          setStats((prev) => ({ ...prev, name: profile.full_name }));
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

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = jobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteSuccess = (deletedId: string) => {
    const updatedJobs = jobs.filter((item) => item.id !== deletedId);
    setJobs(updatedJobs);
    
    const newTotalPages = Math.ceil(updatedJobs.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  return (
    <div className="min-h-fit p-0 md:pt-12 lg:p-4 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="glass-capsule text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-3 py-1 mb-2 inline-flex items-center gap-1.5">
            <FiBriefcase /> Portal Manajemen Proyek
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Dashboard Employer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
            Selamat datang kembali, <span className="font-bold text-slate-800 dark:text-slate-200">{stats.name}</span>
          </p>
        </div>

        <CreateProjectDialog />
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FiBriefcase />} title="Total Proyek Diterbitkan" value={stats.totalProjects} color="bg-blue-500" />
        <StatCard icon={<FiUsers />} title="Tenaga Kerja Terlibat" value={stats.activeWorkers} color="bg-emerald-500" />
        <StatCard icon={<FiTrendingUp />} title="Alokasi Anggaran Proyek" value={formatDynamicRupiah(stats.totalInvestment)} color="bg-purple-500" />
      </div>

      {/* Project Table Container */}
      {loading ? (
        <TableLoading />
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden shadow-xl">
          {/* Header Tabel & Input Fitur Cari */}
          <div className="p-6 border-b border-slate-200/50 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Daftar Proyek Crowdsourcing</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Pantau alokasi kuota, pelamar, dan status pengerjaan proyek aktif.</p>
            </div>

            {jobs.length > 0 && (
              <div className="relative w-full sm:w-64">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Cari judul proyek..."
                  className="glass-input w-full pl-9 pr-4 py-2 text-xs rounded-xl outline-none font-medium"
                />
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            {jobs.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="p-4 glass-capsule text-slate-400 rounded-2xl">
                  <FiAlertCircle size={32} />
                </div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum Ada Proyek</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">Anda belum mempublikasikan lowongan proyek crowdsourcing apa pun saat ini.</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500 font-medium text-xs">
                Tidak ada proyek yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
              </div>
            ) : (
              <>
                <table className="w-full text-left border-collapse min-w-[700px]"> 
                  <thead className="bg-slate-100/50 dark:bg-white/5 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Judul Proyek</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Kontributor Terisi</th>
                      <th className="px-6 py-4">Anggaran per Orang</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/40 dark:divide-white/5 text-xs">
                    {currentJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition duration-200">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          <Link 
                            href={`/jobs/${job.id}`} 
                            className="text-blue-600 dark:text-blue-400 hover:underline transition"
                          >
                            {job.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(job.status ?? 'pending')}`}>
                            { (job.status?.toUpperCase()) ?? "PENDING" }
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap font-medium">
                          <span className="font-bold text-blue-600 dark:text-blue-400">{job.taken}</span> / {job.total} Orang
                        </td>
                        <td className="px-6 py-4 font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          Rp{job.reward.toLocaleString('id-ID')}
                        </td>
                        <td className='px-4 py-3 whitespace-nowrap'>
                          <div className="flex items-center gap-2 justify-center">
                            <button
                              type="button"
                              onClick={() => setSelectedJob({ job, action: "edit" })}
                              className="p-2 glass-capsule text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 rounded-xl transition cursor-pointer"
                              title="Edit Proyek"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedJob({ job, action: "delete" })}
                              className="p-2 glass-capsule text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 rounded-xl transition cursor-pointer"
                              title="Hapus Proyek"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* BILAH NAVIGASI BAR FOOTER PAGINATION */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-slate-200/50 dark:border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
                    <p className="text-slate-400 dark:text-slate-500 font-medium">
                      Menampilkan <span className="font-bold text-slate-700 dark:text-slate-200">{indexOfFirstItem + 1}</span> -{" "}
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {Math.min(indexOfLastItem, jobs.length)}
                      </span>{" "}
                      dari <span className="font-bold text-slate-700 dark:text-slate-200">{jobs.length}</span> proyek
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 glass-card text-slate-600 dark:text-slate-300 rounded-xl disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
                      >
                        <FiChevronLeft size={16} />
                      </button>

                      {Array.from({ length: totalPages }, (_, idx) => (
                        <button
                          key={idx + 1}
                          onClick={() => handlePageChange(idx + 1)}
                          className={`w-8 h-8 text-xs font-bold rounded-xl transition cursor-pointer ${
                            currentPage === idx + 1
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                              : "glass-card text-slate-600 dark:text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 glass-card text-slate-600 dark:text-slate-300 rounded-xl disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
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

      {/* Dialog penanganan Aksi */}
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