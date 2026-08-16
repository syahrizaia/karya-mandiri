/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { 
  FiDollarSign, 
  FiCheckCircle, 
  FiClock, 
  FiStar, 
  FiArrowRight, 
  FiSearch, 
  FiPlus
} from 'react-icons/fi';
import SubscriptionDialog from '../../../components/subscription/page';
import supabase from '@/lib/db';
import { IJobs } from '@/app/types/jobs';
import SaveJobButton from '@/components/ui/save-job-button/page';
import formatRelativeTime from '@/components/ui/format-relative-time/page';
import Link from 'next/link';
import Services from '../../../components/worker/manage-services/page';
import PostServiceDialog from '@/components/services/create-service/page';
import { useRouter } from 'next/navigation';
import SavedJobSkeleton from '@/components/worker/SavedJobSkeleton';

interface IProfile {
  id: string | null;
  name: string;
  level: string;
  rating: number;
  totalEarnings: number;
  completedTasks: number;
}

const WorkerDashboard: React.FC = () => {
  const router = useRouter();
  const [showSubModal, setShowSubModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<IJobs[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [profile, setProfile] = useState<IProfile>({
    id: null,
    name: "Pengguna",
    level: "Beginner",
    rating: 0.0,
    totalEarnings: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    const initDashboardData = async () => {
      try {
        setLoading(true);

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push("/login");
          return;
        }

        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, level, rating, total_earnings, completed_tasks")
          .eq("id", user.id)
          .maybeSingle();

        if (profileData) {
          setProfile({
            id: user.id,
            name: profileData.full_name || "Tanpa Nama",
            level: profileData.level || "Pekerja",
            rating: profileData.rating ? Number(profileData.rating) : 5.0,
            totalEarnings: profileData.total_earnings ? Number(profileData.total_earnings) : 0,
            completedTasks: profileData.completed_tasks ? Number(profileData.completed_tasks) : 0,
          });
        }

        const { data: bookmarkData, error: bookmarkError } = await supabase
          .from('saved_jobs')
          .select(`
            job_id,
            jobs:jobs (
              *
            )
          `)
          .eq('user_id', user.id);

        if (bookmarkError) {
          console.error('Error fetching bookmarked jobs:', bookmarkError);
        } else if (bookmarkData) {
          const extractedJobs = bookmarkData
            .map((item: any) => item.jobs)
            .filter((job) => job !== null)
            .map((job: any) => ({ ...job, is_saved: true }));
            
          setSavedJobs(extractedJobs);
        }

      } catch (err) {
        console.error("Terjadi kesalahan sistem dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    initDashboardData();
  }, [router, refreshKey]);

  const handleRefreshData = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen md:pt-12 lg:pt-4 lg:p-4 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Profil Singkat & Level */}
      <header className="flex flex-col md:flex-row justify-between items-end md:items-end mb-8 gap-4">
        <div className="flex flex-row justify-between gap-4 w-full">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50">Halo, {profile.name}!</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">Level: {profile.level}</p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400 h-fit px-4 py-2 rounded-full shadow-sm">
            <FiStar className="fill-current" />
            <span className="font-bold">{profile.rating.toFixed(1)} Rating Kerja</span>
          </div>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="px-6 py-3.5 bg-white dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 border border-transparent dark:border-slate-700 font-bold rounded-2xl shadow-md transition flex items-center gap-2 shrink-0"
        >
          <FiPlus className="stroke-3" /> Tawarkan Jasaku
        </button>
      </header>

      {/* Ringkasan Pendapatan & Capaian */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-linear-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex justify-between items-center opacity-80 mb-2">
            <p className="text-sm uppercase tracking-wider">Total Pendapatan</p>
            <FiDollarSign />
          </div>
          <h2 className="text-3xl font-bold">Rp{(profile?.totalEarnings ?? 0).toLocaleString("id-ID")}</h2>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center transition-colors">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 uppercase">Tugas Selesai</p>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-50">{profile.completedTasks}</h2>
          </div>
          <FiCheckCircle className="text-blue-500 dark:text-blue-400 text-4xl" />
        </div>
      </div>

      <Services itemsPerPage={5} />

      {/* Cari Tugas Baru */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4 gap-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Tugas Disimpan (Crowdsourcing)</h3>
          <button
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-semibold flex items-center gap-1"
            onClick={() => setShowSubModal(true)}
          >
            Lihat Semua <FiArrowRight />
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <>
              <SavedJobSkeleton />
              <SavedJobSkeleton />
              <SavedJobSkeleton />
            </>
          ) : savedJobs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 italic bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              Belum ada proyek yang disimpan.
            </div>
          ) : (
            savedJobs.map((job) => (
              <div key={job.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex gap-4 items-center">
                  <div className="bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 p-3 rounded-lg hidden sm:block">
                    <FiSearch />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{job.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{job.category}</span>
                      <span className="flex items-center gap-1"><FiClock /> {formatRelativeTime(job.deadline)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start justify-between w-full md:w-auto gap-6">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-slate-400 dark:text-slate-500">Upah</p>
                    <p className="font-bold text-green-600 dark:text-green-400 italic">Rp{job.reward.toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-3 w-full md:w-auto">
                    <Link
                      href={`/jobs/${job.id}`}
                      className={`px-5 py-2 rounded-lg text-center font-bold transition col-span-3 ${
                        job.status === 'pending' 
                          ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 cursor-not-allowed' 
                          : job.status === 'completed'
                            ? 'bg-slate-600 text-white dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                      }`}
                      onClick={(e) => (job.status === 'pending' || job.status === 'completed') && e.preventDefault()}
                    >
                      {job.status === 'pending' 
                        ? 'Pekerjaan Sedang Ditunda' 
                        : job.status === 'completed'
                          ? 'Pekerjaan Telah Selesai' 
                          : 'Lihat Detail Pekerjaan'
                      }
                    </Link>
                    <SaveJobButton
                      is_saved={job.is_saved}
                      id={job.id}
                      status={job.status}
                      title={job.title}
                      employer={job.employer}
                      employer_name={job.employer_name}
                      category={job.category}
                      location={job.location}
                      reward={job.reward}
                      type={job.type}
                      description={job.description}
                      requirements={job.requirements}
                      taken={job.taken}
                      total={job.total}
                      posted_at={job.posted_at}
                      deadline={job.deadline}
                      applied_at={job.applied_at}
                      worker_notes={job.worker_notes}
                      applications={job.applications}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Edukasi Mandiri (Micro-learning) */}
      <div className="bg-indigo-900 dark:bg-indigo-950 rounded-2xl p-6 text-white overflow-hidden relative transition-colors">
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-2">Tingkatkan Skill-mu! 🚀</h3>
          <p className="text-indigo-200 dark:text-indigo-300 text-sm mb-4">Ikuti pelatihan singkat gratis untuk mendapatkan akses ke tugas dengan upah lebih tinggi.</p>
          <Link
            href="/training"
            className="bg-white dark:bg-slate-100 text-indigo-900 dark:text-indigo-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-100/90 transition-colors"
          >
            Mulai Belajar
          </Link>
        </div>
        <FiStar className="absolute -right-4 -bottom-4 text-indigo-800 dark:text-indigo-900 text-9xl opacity-50" />
      </div>
      
      <PostServiceDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSuccess={handleRefreshData} 
      />
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>
  );
};

export default WorkerDashboard;