/* eslint-disable react-hooks/static-components */
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
import type { IEcosystemActivities } from '@/app/types/ecosystem-activity';
import formatRelativeTime from '@/components/ui/format-relative-time/page';
import SubscriptionDialog from '../../../components/subscription/page';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// --- Sub Komponen ---
const SummaryCard = ({ title, value, icon, trend, color, isLoading }: any) => {
  const colorClasses: any = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    purple: "text-purple-600 bg-purple-50",
    amber: "text-amber-600 bg-amber-50",
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="w-11 h-11 bg-slate-100 rounded-2xl" />
          <div className="h-4 w-12 bg-slate-100 rounded-md" />
        </div>
        <div className="h-4 w-24 bg-slate-100 rounded-md mb-2" />
        <div className="h-7 w-16 bg-slate-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{trend}</span>
      </div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h2 className="text-2xl font-bold text-slate-900">{value}</h2>
    </div>
  );
};

const ProgressItem = ({ label, progress, color }: { label: string, progress: number, color: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
      <span>{label}</span>
      <span>{progress}%</span>
    </div>
    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
      <div className={`${color} h-full transition-all duration-1000`} style={{ width: `${progress}%` }} />
    </div>
  </div>
);

const GeneralDashboard: React.FC = () => {
  const [ecosystemActivities, setEcosystemActivities] = useState<IEcosystemActivities[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);

  // State untuk statistik dinamis dari Supabase
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
    retensiEmployer: 0, // Bisa dibiarkan default atau dihitung dari total mitra aktif
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const { data: activitiesData, error: activitiesError } = await supabase
          .from('ecosystem_activities')
          .select('*')
          .order('time', { ascending: false })

        if (activitiesError) throw activitiesError;
        setEcosystemActivities(activitiesData || []);

        const { count: workerCount, error: workerError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'worker');

        const { count: projectCount, error: projectError } = await supabase
          .from('jobs') // sesuaikan nama tabel jika menggunakan nama lain seperti 'projects'
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active'); 

        const { data: transactionData, error: transError } = await supabase
          .from('transactions') // sesuaikan nama tabel finansial Anda
          .select('amount')
          .eq('status', 'success');

        const { count: completedCount, error: completedError } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed');

        // Kalkulasi total nominal perputaran uang upah
        const totalImpact = transactionData?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

        //  KALKULASI GROWTH RATE DINAMIS
        const sekarang = new Date();

        // Batas waktu awal bulan ini (30 hari terakhir)
        const awalBulanIni = new Date();
        awalBulanIni.setDate(sekarang.getDate() - 30);

        // Batas waktu awal bulan lalu (30 s.d 60 hari yang lalu)
        const awalBulanLaju = new Date();
        awalBulanLaju.setDate(sekarang.getDate() - 60);

        // Hitung total aktivitas Bulan Ini (30 hari terakhir)
        const { count: countBulanIni } = await supabase
          .from('ecosystem_activities')
          .select('*', { count: 'exact', head: true })
          .gte('time', awalBulanIni.toISOString());

        // Hitung total aktivitas Bulan Lalu (rentang hari ke 30 hingga 60 ke belakang)
        const { count: countBulanLaju } = await supabase
          .from('ecosystem_activities')
          .select('*', { count: 'exact', head: true })
          .gte('time', awalBulanLaju.toISOString())
          .lt('time', awalBulanIni.toISOString());

        // Terapkan Rumus Laju Pertumbuhan
        let kalkulasiGrowth = 0;
        const ini = countBulanIni || 0;
        const lalu = countBulanLaju || 0;

        if (lalu > 0) {
          // Jika bulan lalu ada aktivitas, gunakan rumus standar
          kalkulasiGrowth = ((ini - lalu) / lalu) * 100;
        } else if (lalu === 0 && ini > 0) {
          // Jika bulan lalu kosong (misal pengguna baru daftar), pertumbuhan dianggap 100%
          kalkulasiGrowth = 100;
        }

        // Kueri hitung total pekerjaan per kategori untuk Alokasi Jasa
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

        // Ambil total user (Gunakan select standar tanpa opsi head jika memicu eror)
        const { data: allProfiles, error: errTotalUsers } = await supabase
          .from('profiles')
          .select('id, is_verified, role, full_name, email, phone'); // Cukup ambil kolom yang diperlukan saja (efisiensi performa)

        const totalUsersCount = allProfiles ? allProfiles.length : 0;

        // Hitung user terverifikasi langsung dari array lokal untuk menghindari filter URL yang sensitif
        const verifiedUsersCount = allProfiles 
          ? allProfiles.filter(p => (p as any).is_verified === true).length
          : 0;

        // Hitung rasio KYC untuk akurasi persentase Target Capaian (menggunakan definisi baru Anda)
        const verifikasiKYCProgress = totalUsersCount 
          ? Math.round((verifiedUsersCount / totalUsersCount) * 100) 
          : 0;

        // Ambil total tugas keseluruhan dari tabel jobs
        const { data: allJobs, error: errTotalJobs } = await supabase
          .from('jobs')
          .select('id, employer_id');

        const totalTasksCount = allJobs ? allJobs.length : 0;

        // Hitung total semua profile dengan role 'employer'
        const totalEmployers = allProfiles 
          ? allProfiles.filter(p => p.role === 'employer').length 
          : 0;

        // Ambil ID employer unik yang sudah pernah memposting proyek dari data jobs yang sudah ditarik
        const uniqueActiveEmployers = allJobs
          ? new Set(allJobs.map(j => j.employer_id).filter(Boolean)).size
          : 0;

        // Rumus Persentase Retensi Kemitraan
        const kalkulasiRetensi = totalEmployers > 0
          ? Math.round((uniqueActiveEmployers / totalEmployers) * 100)
          : 0;

        setTargetProgress({
          distribusiUpah: totalTasksCount ? Math.round(((completedCount ?? 0) / totalTasksCount) * 100) : 0,
          verifikasiKYC: verifikasiKYCProgress,
          retensiEmployer: kalkulasiRetensi,
        });

        // Setel seluruh state gabungan
        setDynamicStats({
          economicImpact: totalImpact || 0, // Fallback ke mock jika tabel baru kosong
          totalWorkers: verifiedUsersCount,
          activeProjects: projectCount || 0,
          completedTasks: completedCount || 0,
          growthRate: parseFloat(kalkulasiGrowth.toFixed(1)), // Dapat dikalkulasi dinamis berdasarkan komparasi bulan lalu jika diperlukan
        });

      } catch (err) {
        console.error("Gagal memuat seluruh metrik dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const activityChannel = supabase
    .channel('realtime_ecosystem_changes') // Nama bebas untuk channel
    .on(
      'postgres_changes',
      {
        event: 'INSERT', // Kita hanya mendengarkan jika ada data masuk baru
        schema: 'public',
        table: 'ecosystem_activities'
      },
      (payload) => {
        // Begitu ada baris baru masuk, selipkan ke urutan paling atas array state
        setEcosystemActivities((prevActivities) => {
          return [payload.new as IEcosystemActivities, ...prevActivities];
        });
      }
    )
    .subscribe();

    // Bersihkan pemancaran sinyal (cleanup subscription) jika komponen di-unmount/ditutup
    return () => {
      supabase.removeChannel(activityChannel);
    };
  }, []);

  // Format Helper Rupiah Triliun/Miliar agar scannable
  const formatImpactValue = (value: number) => {
    if (value >= 1000000000000) {
      return `Rp${(value / 1000000000000).toFixed(1)}T`;
    } else if (value >= 100000000) {
      return `Rp${(value / 1000000000).toFixed(1)}M`;
    }
    return `Rp${value.toLocaleString('id-ID')}`;
  };

  const EcosystemLoading = () => (
    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <div className="h-5 w-40 bg-slate-200 rounded-lg"></div>
        <div className="h-4 w-16 bg-slate-100 rounded-lg"></div>
      </div>
      <div className="divide-y divide-slate-50">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-slate-100 rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 w-64 bg-slate-200 rounded-md" />
                <div className="h-3 w-24 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="w-4 h-4 bg-slate-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500 md:pt-12 lg:pt-4 lg:p-4">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ringkasan Platform</h1>
          <p className="text-slate-500">Pantau ekosistem inklusi ekonomi KaryaMandiri hari ini.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm text-green-500 text-sm font-medium">
          <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          Sistem Online: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </section>

      {/* Stats Grid - Sekarang Dinamis Terintegrasi Loading Skeleton */}
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
          /* Aktivitas Utama */
          <>
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FiActivity className="text-blue-600" /> Aktivitas Ekosistem Realtime
              </h3>
              <button
                className="text-xs font-bold text-blue-600 hover:underline"
                onClick={() => setShowAllActivities(true)}
              >
                Lihat Semua
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {ecosystemActivities.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">Belum ada aktivitas baru hari ini.</div>
              ) : (
                ecosystemActivities.slice(0, 5).map((ecosystemActivity: IEcosystemActivities) => ( 
                  <div key={ecosystemActivity.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        ecosystemActivity.type === 'project' ? 'bg-blue-50 text-blue-600' : 
                        ecosystemActivity.type === 'payment' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        {ecosystemActivity.type === 'project' ? <FiLayers /> : ecosystemActivity.type === 'payment' ? <FiTrendingUp /> : <FiUsers />}
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">
                          <span className="font-bold text-slate-900">{ecosystemActivity.user}</span> {ecosystemActivity.action} 
                          <span className="font-semibold text-slate-800"> {ecosystemActivity.target}</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{formatRelativeTime(ecosystemActivity.time)}</p>
                      </div>
                    </div>
                    <FiArrowUpRight className="text-slate-300" />
                  </div>
                ))
              )}
            </div>
          </div>

          <Dialog open={showAllActivities} onOpenChange={setShowAllActivities}>
            <DialogContent className="sm:max-w-xl rounded-3xl p-8 border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <FiActivity className="text-blue-600" /> Semua Aktivitas Ekosistem
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Daftar lengkap seluruh rekam jejak aktivitas realtime yang terjadi di platform KaryaMandiri.
                </DialogDescription>
              </DialogHeader>

              {/* Container list yang bisa di-scroll secara independen */}
              <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4 divide-y divide-slate-100 min-h-[200px]">
                {ecosystemActivities.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-400">Tidak ada data aktivitas yang tercatat.</div>
                ) : (
                  ecosystemActivities.map((ecosystemActivity: IEcosystemActivities) => (
                    <div key={`modal-${ecosystemActivity.id}`} className="py-4 flex items-center justify-between hover:bg-slate-50/50 transition px-2 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          ecosystemActivity.type === 'project' ? 'bg-blue-50 text-blue-600' : 
                          ecosystemActivity.type === 'payment' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                          {ecosystemActivity.type === 'project' ? <FiLayers /> : ecosystemActivity.type === 'payment' ? <FiTrendingUp /> : <FiUsers />}
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">
                            <span className="font-bold text-slate-900">{ecosystemActivity.user}</span> {ecosystemActivity.action} 
                            <span className="font-semibold text-slate-800"> {ecosystemActivity.target}</span>
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{formatRelativeTime(ecosystemActivity.time)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <DialogFooter className="pt-4 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAllActivities(false)}
                  className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-colors text-center"
                >
                  Tutup Halaman
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </>
        )}

        {/* Panel Info Tambahan & Statistik Baru */}
        <div className="space-y-4">
          {/* Target Capaian Tahun Berjalan */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
              <FiZap className="text-amber-500" /> Target Capaian Strategis
            </h3>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-32 bg-slate-100 rounded" />
                    <div className="h-2 w-full bg-slate-100 rounded-full" />
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

          {/* STATISTIK BARU: Distribusi Pembagian Tugas Ekosistem */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
              <FiPieChart className="text-purple-600" /> Alokasi Sektor Jasa Live
            </h3>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-3 w-28 bg-slate-100 rounded" />
                    <div className="h-3 w-8 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Pengembangan Web & IT
                  </span>
                  <span className="font-bold text-slate-800">
                    {jasaAllocation.webIT}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Fotografi & Kreatif
                  </span>
                  <span className="font-bold text-slate-800">
                    {jasaAllocation.fotografi}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Produksi Video & Film
                  </span>
                  <span className="font-bold text-slate-800">
                    {jasaAllocation.videoFilm}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Informasi Edukasi Inklusi */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Model Crowdsourcing</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
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