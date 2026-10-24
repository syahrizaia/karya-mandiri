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
  FiPlus,
  FiTrendingUp,
  FiAward
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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4 w-full md:w-auto">
          <div>
            <span className="glass-capsule text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-3 py-1 mb-2 inline-flex items-center gap-1.5">
              <FiAward /> Mitra Mandiri Terverifikasi
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Halo, {profile.name}!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-0.5">
              Tingkat Mitra: <span className="font-bold text-slate-700 dark:text-slate-200">{profile.level}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 glass-capsule bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 px-4 py-2">
            <FiStar className="fill-current text-sm" />
            <span className="font-black text-sm">{profile.rating.toFixed(1)}</span>
            <span className="text-xs font-semibold opacity-80">Rating Kinerja</span>
          </div>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <FiPlus className="stroke-[3]" /> Tawarkan Jasaku
        </button>
      </header>

      {/* Ringkasan Pendapatan & Capaian */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition duration-500"></div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Pendapatan Terverifikasi</p>
            <div className="p-2.5 glass-capsule text-emerald-600 dark:text-emerald-400 rounded-xl">
              <FiDollarSign className="text-lg" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            Rp{(profile?.totalEarnings ?? 0).toLocaleString("id-ID")}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Pencairan otomatis ke rekening melalui sistem Escrow terproteksi.
          </p>
        </div>
        
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition duration-500"></div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tugas Mikro Selesai</p>
            <div className="p-2.5 glass-capsule text-blue-600 dark:text-blue-400 rounded-xl">
              <FiCheckCircle className="text-lg" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {profile.completedTasks}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Tugas tuntas terverifikasi dan mendapat ulasan positif dari pemberi kerja.
          </p>
        </div>
      </div>

      <Services itemsPerPage={5} />

      {/* Cari Tugas Baru */}
      <section className="my-8">
        <div className="flex justify-between items-center mb-4 gap-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Tugas Disimpan (Crowdsourcing)</h3>
          <button
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold flex items-center gap-1 cursor-pointer"
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
            <div className="glass-panel p-10 text-center rounded-3xl">
              <p className="text-slate-400 dark:text-slate-500 text-sm italic">
                Belum ada proyek yang disimpan. Jelajahi katalog pekerjaan untuk menyimpan tugas.
              </p>
            </div>
          ) : (
            savedJobs.map((job) => (
              <div 
                key={job.id} 
                className="glass-card p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
              >
                <div className="flex gap-4 items-center">
                  <div className="glass-capsule p-3 text-blue-600 dark:text-blue-400 rounded-xl hidden sm:block">
                    <FiSearch />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="glass-capsule px-2.5 py-0.5 rounded-lg font-bold uppercase text-[10px]">
                        {job.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock /> {formatRelativeTime(job.deadline)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full md:w-auto gap-4">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Upah</p>
                    <p className="font-black text-green-600 dark:text-green-400 text-base">
                      Rp{job.reward.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-2.5 w-full md:w-auto">
                    <Link
                      href={`/jobs/${job.id}`}
                      className={`px-4 py-2.5 rounded-xl text-center text-xs font-bold transition col-span-3 ${
                        job.status === 'pending' 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 cursor-not-allowed' 
                          : job.status === 'completed'
                            ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                      }`}
                      onClick={(e) => (job.status === 'pending' || job.status === 'completed') && e.preventDefault()}
                    >
                      {job.status === 'pending' 
                        ? 'Pekerjaan Ditunda' 
                        : job.status === 'completed'
                          ? 'Pekerjaan Selesai' 
                          : 'Detail Pekerjaan'
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
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/40 border border-indigo-500/30">
        <div className="relative z-10 max-w-xl">
          <span className="glass-capsule text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2.5 py-1 mb-2 inline-flex items-center gap-1.5">
            <FiTrendingUp /> Akselerasi Karier
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
            Tingkatkan Skill dan Pendapatan Anda
          </h3>
          <p className="text-indigo-200 dark:text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
            Ikuti modul micro-learning tersertifikasi secara gratis untuk membuka akses ke proyek crowdsourcing berskala enterprise dengan upah lebih tinggi.
          </p>
          <Link
            href="/training"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-lg transition active:scale-95"
          >
            Mulai Belajar Sekarang <FiArrowRight />
          </Link>
        </div>
        <FiStar className="absolute -right-4 -bottom-4 text-indigo-500/10 text-9xl pointer-events-none select-none" />
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