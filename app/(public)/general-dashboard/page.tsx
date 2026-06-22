/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { 
  FiActivity, 
  FiTrendingUp, 
  FiUsers, 
  FiLayers, 
  FiArrowUpRight,
  FiZap,
  FiCheckCircle,
  FiPieChart
} from 'react-icons/fi';
import supabase from '@/lib/db';
import formatRelativeTime from '@/components/ui/format-relative-time/page';
import SubscriptionDialog from '../../../components/subscription/page';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';
import Image from 'next/image';
import SummaryCard from '@/components/dashboard/SummaryCard';
import EcosystemLoading from '@/components/dashboard/EcosystemLoading';
import ProgressItem from '@/components/dashboard/ProgressItem';

export interface IEcosystemActivities {
  id: any;
  time: string;
  action: string;
  target: string;
  type: string;
  user_id: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
    role: string;
  };
  user?: string; 
}

const GeneralDashboard: React.FC = () => {
  const [ecosystemActivities, setEcosystemActivities] = useState<IEcosystemActivities[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);

  // State statistik dinamis
  const [dynamicStats, setDynamicStats] = useState({
    economicImpact: 0,
    totalWorkers: 0,
    activeProjects: 0,
    completedTasks: 0,
    growthRate: 0,
  });

  const [jasaAllocation, setJasaAllocation] = useState({
    webIT: 0,
    fotografi: 0,
    videoFilm: 0,
  });

  const [targetProgress, setTargetProgress] = useState({
    distribusiUpah: 0,
    verifikasiKYC: 0,
    retensiEmployer: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const { data: activitiesData, error: activitiesError } = await supabase
          .from('ecosystem_activities')
          .select(`
            id,
            time,
            action,
            target,
            type,
            user_id,
            profiles:user_id (
              full_name,
              avatar_url,
              role
            )
          `)
          .order('time', { ascending: false });

        if (activitiesError) throw activitiesError;

        setEcosystemActivities(
          (activitiesData || []).map((activity: any) => ({
            ...activity,
            profiles: Array.isArray(activity.profiles) ? activity.profiles[0] : activity.profiles
          }))
        );

        const { count: projectCount } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active'); 

        const { data: transactionData } = await supabase
          .from('transactions')
          .select('amount')
          .eq('status', 'success');

        const { count: completedCount } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed');

        const totalImpact = transactionData?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

        // Kalkulasi growth rate dinamis
        const sekarang = new Date();
        const awalBulanIni = new Date();
        awalBulanIni.setDate(sekarang.getDate() - 30);

        const awalBulanLaju = new Date();
        awalBulanLaju.setDate(sekarang.getDate() - 60);

        const { count: countBulanIni } = await supabase
          .from('ecosystem_activities')
          .select('*', { count: 'exact', head: true })
          .gte('time', awalBulanIni.toISOString());

        const { count: countBulanLaju } = await supabase
          .from('ecosystem_activities')
          .select('*', { count: 'exact', head: true })
          .gte('time', awalBulanLaju.toISOString())
          .lt('time', awalBulanIni.toISOString());

        let kalkulasiGrowth = 0;
        const ini = countBulanIni || 0;
        const lalu = countBulanLaju || 0;

        if (lalu > 0) {
          kalkulasiGrowth = ((ini - lalu) / lalu) * 100;
        } else if (lalu === 0 && ini > 0) {
          kalkulasiGrowth = 100;
        }

        const { data: categoryData, error: categoryError } = await supabase
          .from('jobs')
          .select('category');

        if (!categoryError && categoryData) {
          const totalJobs = categoryData.length;

          if (totalJobs > 0) {
            const countWebIT = categoryData.filter(j => j.category === 'Web & IT').length;
            const countFotografi = categoryData.filter(j => j.category === 'Fotografi & Kreatif').length;
            const countVideoFilm = categoryData.filter(j => j.category === 'Produksi Video & Film').length;

            setJasaAllocation({
              webIT: Math.round((countWebIT / totalJobs) * 100),
              fotografi: Math.round((countFotografi / totalJobs) * 100),
              videoFilm: Math.round((countVideoFilm / totalJobs) * 100),
            });
          }
        }

        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('id, is_verified, role, full_name, email, phone');

        const totalUsersCount = allProfiles ? allProfiles.length : 0;

        const verifiedUsersCount = allProfiles 
          ? allProfiles.filter(p => (p as any).is_verified === true).length
          : 0;

        const verifikasiKYCProgress = totalUsersCount 
          ? Math.round((verifiedUsersCount / totalUsersCount) * 100) 
          : 0;

        const { data: allJobs } = await supabase
          .from('jobs')
          .select('id, user_id');

        const totalTasksCount = allJobs ? allJobs.length : 0;

        const totalEmployers = allProfiles 
          ? allProfiles.filter(p => p.role === 'employer').length 
          : 0;

        const uniqueActiveEmployers = allJobs
          ? new Set(allJobs.map(j => j.user_id).filter(Boolean)).size
          : 0;

        const kalkulasiRetensi = totalEmployers > 0
          ? Math.round((uniqueActiveEmployers / totalEmployers) * 100)
          : 0;

        setTargetProgress({
          distribusiUpah: totalTasksCount ? Math.round(((completedCount ?? 0) / totalTasksCount) * 100) : 0,
          verifikasiKYC: verifikasiKYCProgress,
          retensiEmployer: kalkulasiRetensi,
        });

        setDynamicStats({
          economicImpact: totalImpact || 0,
          totalWorkers: verifiedUsersCount,
          activeProjects: projectCount || 0,
          completedTasks: completedCount || 0,
          growthRate: parseFloat(kalkulasiGrowth.toFixed(1)),
        });

      } catch (err) {
        console.error("Gagal memuat seluruh metrik dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const activityChannel = supabase
      .channel('realtime_ecosystem_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ecosystem_activities'
        },
        async (payload) => {
          const newActivity = payload.new as any;

          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, role')
            .eq('id', newActivity.user_id)
            .single();

          const completeActivity: IEcosystemActivities = {
            ...newActivity,
            profiles: profileData || { full_name: 'Pengguna Baru', avatar_url: '', role: 'Pekerja Mandiri' }
          };

          setEcosystemActivities((prevActivities) => [completeActivity, ...prevActivities]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(activityChannel);
    };
  }, []);

  const formatImpactValue = (value: number) => {
    if (value >= 1000000000000) {
      return `Rp${(value / 1000000000000).toFixed(1)}T`;
    } else if (value >= 100000000) {
      return `Rp${(value / 1000000000).toFixed(1)}M`;
    }
    return `Rp${value.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 md:pt-12 lg:pt-4 lg:p-4 text-slate-900 dark:text-slate-100">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Ringkasan Platform</h1>
          <p className="text-slate-500 dark:text-slate-400">Pantau ekosistem inklusi ekonomi KaryaMandiri hari ini.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm text-green-500 dark:text-green-400 text-sm font-medium">
          <span className="flex h-3 w-3 rounded-full bg-green-500 animate-caret-blink" />
          Sistem Online: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Inklusi Upah" 
          value={formatImpactValue(dynamicStats.economicImpact)} 
          icon={<FiTrendingUp />} 
          trend={`${dynamicStats.growthRate >= 0 ? '+' : ''}${dynamicStats.growthRate}%`}
          color="blue"
          isLoading={loading}
        />
        <SummaryCard 
          title="Pengguna Terverifikasi" 
          value={dynamicStats.totalWorkers.toLocaleString('id-ID')} 
          icon={<FiUsers />} 
          trend="Data Lengkap"
          color="emerald"
          isLoading={loading}
        />
        <SummaryCard 
          title="Proyek Crowd Live" 
          value={dynamicStats.activeProjects.toLocaleString('id-ID')} 
          icon={<FiLayers />} 
          trend="Siklus Berjalan"
          color="purple"
          isLoading={loading}
        />
        <SummaryCard 
          title="Tugas Terselesaikan" 
          value={dynamicStats.completedTasks.toLocaleString('id-ID')} 
          icon={<FiCheckCircle />} 
          trend="Total Berhasil"
          color="amber"
          isLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {loading ? (
          <EcosystemLoading />
        ) : (
          /* Aktivitas Utama Ekosistem */
          <>
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <FiActivity className="text-blue-600 dark:text-blue-400" /> Aktivitas Ekosistem Realtime
                </h3>
                <button
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => setShowAllActivities(true)}
                >
                  Lihat Semua
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {ecosystemActivities.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-400 dark:text-slate-500">Belum ada aktivitas baru hari ini.</div>
                ) : (
                  ecosystemActivities.slice(0, 5).map((ecosystemActivity: IEcosystemActivities) => ( 
                    <div key={ecosystemActivity.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <div className="flex items-center gap-4">
                        {ecosystemActivity.type === 'project' ? (
                          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 shrink-0">
                            <FiLayers />
                          </div>
                        ) : ecosystemActivity.type === 'payment' ? (
                          <div className="p-3 rounded-xl bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400 shrink-0">
                            <FiTrendingUp />
                          </div>
                        ) : (
                          <div className="shrink-0 relative w-10 h-10">
                            {(ecosystemActivity.profiles as any)?.avatar_url ? (
                              <Image
                                src={(ecosystemActivity.profiles as any).avatar_url} 
                                alt={ecosystemActivity.profiles?.full_name || 'Avatar'} 
                                className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-slate-800"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                                width={50}
                                height={50}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center text-xs font-bold uppercase tracking-wider border border-purple-100 dark:border-purple-900">
                                {ecosystemActivity.profiles?.full_name 
                                  ? ecosystemActivity.profiles.full_name.charAt(0) 
                                  : ecosystemActivity.user 
                                    ? ecosystemActivity.user.charAt(0) 
                                    : 'U'}
                              </div>
                            )}
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            <Link href={`/profile/${ecosystemActivity.user_id}`} className="font-bold text-slate-900 dark:text-slate-50">
                              {ecosystemActivity.profiles?.full_name}
                            </Link> {ecosystemActivity.action} 
                            <span className="font-semibold text-slate-800 dark:text-slate-200"> {ecosystemActivity.target}</span>
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{formatRelativeTime(ecosystemActivity.time)}</p>
                        </div>
                      </div>
                      <FiArrowUpRight className="text-slate-300 dark:text-slate-600" />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Dialog: Semua Aktivitas */}
            <Dialog open={showAllActivities} onOpenChange={setShowAllActivities}>
              <DialogContent className="sm:max-w-xl rounded-3xl p-8 border-none bg-white dark:bg-slate-900 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-slate-900 dark:text-slate-50 flex items-center gap-2">
                    <FiActivity className="text-blue-600 dark:text-blue-400" /> Semua Aktivitas Ekosistem
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 dark:text-slate-400">
                    Daftar lengkap seluruh rekam jejak aktivitas realtime yang terjadi di platform KaryaMandiri.
                  </DialogDescription>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4 divide-y divide-slate-100 dark:divide-slate-800 min-h-[200px]">
                  {ecosystemActivities.length === 0 ? (
                    <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">Tidak ada data aktivitas yang tercatat.</div>
                  ) : (
                    ecosystemActivities.map((ecosystemActivity: IEcosystemActivities) => (
                      <div key={`modal-${ecosystemActivity.id}`} className="py-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl">
                        <div className="flex items-center gap-4">
                          {ecosystemActivity.type === 'project' ? (
                            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 shrink-0">
                              <FiLayers />
                            </div>
                          ) : ecosystemActivity.type === 'payment' ? (
                            <div className="p-3 rounded-xl bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400 shrink-0">
                              <FiTrendingUp />
                            </div>
                          ) : (
                            <div className="shrink-0 relative w-10 h-10">
                              {(ecosystemActivity.profiles as any)?.avatar_url ? (
                                <Image
                                  src={(ecosystemActivity.profiles as any).avatar_url} 
                                  alt={ecosystemActivity.profiles?.full_name || 'Avatar'} 
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-slate-800"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                  width={50}
                                  height={50}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center text-xs font-bold uppercase tracking-wider border border-purple-100 dark:border-purple-900">
                                  {ecosystemActivity.profiles?.full_name 
                                    ? ecosystemActivity.profiles.full_name.charAt(0) 
                                    : ecosystemActivity.user 
                                      ? ecosystemActivity.user.charAt(0) 
                                      : 'U'}
                                </div>
                              )}
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              <Link href={`/profile/${ecosystemActivity.user_id}`} className="font-bold text-slate-900 dark:text-slate-50">
                                {ecosystemActivity.profiles?.full_name || ecosystemActivity.user || "Pengguna"}
                              </Link> {ecosystemActivity.action} 
                              <span className="font-semibold text-slate-800 dark:text-slate-200"> {ecosystemActivity.target}</span>
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{formatRelativeTime(ecosystemActivity.time)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAllActivities(false)}
                    className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors text-center"
                  >
                    Tutup Halaman
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* Panel Info Tambahan & Statistik */}
        <div className="space-y-4">
          {/* Target Capaian Strategis */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-sm flex items-center gap-2">
              <FiZap className="text-amber-500" /> Target Capaian Strategis
            </h3>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <ProgressItem label="Distribusi Upah Sektor Informal" progress={targetProgress.distribusiUpah} color="bg-blue-500" />
                <ProgressItem label="Verifikasi Akurasi KYC Pekerja" progress={targetProgress.verifikasiKYC} color="bg-emerald-500" />
                <ProgressItem label="Retensi Kemitraan Employer" progress={targetProgress.retensiEmployer} color="bg-purple-500" />
              </div>
            )}
          </div>

          {/* Alokasi Sektor Jasa Live */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-sm flex items-center gap-2">
              <FiPieChart className="text-purple-600 dark:text-purple-400" /> Alokasi Sektor Jasa Live
            </h3>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-3 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-8 bg-slate-100 dark:bg-slate-800 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Pengembangan Web & IT
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {jasaAllocation.webIT}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Fotografi & Kreatif
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {jasaAllocation.fotografi}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Produksi Video & Film
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {jasaAllocation.videoFilm}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card Informasi Edukasi Inklusi */}
          <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-6 text-white border border-transparent dark:border-slate-800 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Model Crowdsourcing</h3>
              <p className="text-slate-400 dark:text-slate-400 text-xs leading-relaxed mb-4">
                Membantu sektor informal mendapatkan upah layak melalui pembagian tugas kolektif yang efisien, transparan, dan terlindungi regulasi data.
              </p>
              <button
                className="text-xs bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition"
                onClick={() => setShowSubModal(true)}
              >
                Pelajari Inklusi Jasa
              </button>
            </div>
            <FiLayers className="absolute -right-4 -bottom-4 text-white/10 text-8xl group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>
  );
};

export default GeneralDashboard;