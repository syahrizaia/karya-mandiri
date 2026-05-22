/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { FiUsers, FiBriefcase, FiTrendingUp, FiTrash2, FiEdit2, FiAlertCircle } from 'react-icons/fi';
import { EmployerData } from '../types';
import supabase from '@/lib/db';
import { IJobs } from '@/app/types/jobs';
import { useRouter } from 'next/navigation';
import CreateProjectDialog from '../../../components/create-job/page';
import EditProjectDialog from '@/components/edit-job/page';
import DeleteProjectDialog from '@/components/delete-job/page';

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
  const [jobs, setJobs] = useState<IJobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [employerName, setEmployerName] = useState<string>("User");
  const [selectedJob, setSelectedJob] = useState<{
    job: IJobs;
    action: "edit" | "delete";
  } | null>(null);

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

        // Ambil Nama Lengkap dari profil untuk menyapa user di header
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (profile?.full_name) {
          setEmployerName(profile.full_name);
        }

        // Ambil data pekerjaan yang dibuat KHUSUS oleh user ini saja
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('user_id', user.id) 
          .order('posted_at', { ascending: false });

        if (jobsError) {
          console.error('Error fetching filtered jobs:', jobsError);
        } else if (jobsData) {
          setJobs(jobsData);

          // Hitung akumulasi statistik riil berdasarkan data pekerjaan di database
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

          <div className="overflow-x-auto">
            {jobs.length === 0 ? (
              /* Tampilan State Jika Employer Belum Membuat Lowongan Apapun */
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
                  <FiAlertCircle size={32} />
                </div>
                <h3 className="text-md font-bold text-slate-700">Belum Ada Proyek</h3>
                <p className="text-sm text-slate-400 max-w-xs">Anda belum mempublikasikan lowongan proyek crowdsourcing apa pun saat ini.</p>
              </div>
            ) : (
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
            setJobs((prev) => prev.filter((item) => item.id !== selectedJob.job.id));
            setSelectedJob(null);
          } }
        />
      )}
    </div>
  );
};

export default EmployerDashboard;