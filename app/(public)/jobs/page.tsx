/* eslint-disable react-hooks/static-components */
"use client";

import React, { useEffect, useState } from 'react';
import { 
  FiSearch, 
  FiMapPin, 
  FiFilter, 
  FiUsers, 
  FiClock,
  FiUser
} from 'react-icons/fi';
import Link from 'next/link';
import { IJobs } from '@/app/types/jobs';
import supabase from '@/lib/db';
import formatRelativeTime from '@/components/ui/format-relative-time/page';
import SubscriptionDialog from '../../../components/subscription/page';
import SaveJobButton from '@/components/ui/save-job-button/page';

const Jobs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<IJobs[]>([]);
  const [showSubModal, setShowSubModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minReward, setMinReward] = useState<number>(0);
  const [maxPriceLimit, setMaxPriceLimit] = useState<number>(5000000); // Batas atas slider bawaan (Rp5 Juta)
  const [sortBy, setSortBy] = useState<string>('Terbaru');
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]); // Menyimpan list job_id yang dibookmark user ini
  
  useEffect(() => {
    const checkUserAndFetchJobs = async () => {
      try {
        setLoading(true);

        // Dapatkan user session saat ini
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          
          // Ambil role dari tabel profiles (Asumsi kolom bernama 'role' bernilai 'worker' / 'employer')
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
            
          if (profile) {
            setUserRole(profile.role?.toLowerCase());
          }

          // Tarik data pekerjaan yang disimpan oleh user ini jika skema Anda menggunakan tabel perantara 'saved_jobs'
          // Jika skema Anda berbeda (misal kolom 'worker_id' langsung di tabel 'jobs'), Anda bisa menyesuaikannya di bawah.
          const { data: savedData } = await supabase
            .from('saved_jobs') 
            .select('job_id')
            .eq('user_id', user.id);
            
          if (savedData) {
            setSavedJobIds(savedData.map(item => item.job_id));
          }
        }

        // Fetch daftar lowongan pekerjaan
        const { data: jobsData, error } = await supabase
          .from('jobs')
          .select('*')
          .order('posted_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching jobs:', error);
        } else if (jobsData) {
          setJobs(jobsData);
          
          if (jobsData.length > 0) {
            const highestReward = Math.max(...jobsData.map(j => j.reward ?? 0));
            setMaxPriceLimit(highestReward > 0 ? highestReward : 5000000);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchJobs();
  }, []);

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const filteredJobs = jobs
    .filter((job) => {
      // Filter berdasarkan teks pencarian (Judul, Nama Perusahaan, Lokasi)
      const matchesSearch = 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.employer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter berdasarkan kategori checklist (menggunakan kolom job.category)
      const matchesCategory = 
        selectedCategories.length === 0 || 
        selectedCategories.some(cat => job.category?.toLowerCase() === cat.toLowerCase());

      // Filter berdasarkan batas minimum upah tugas
      const matchesReward = (job.reward ?? 0) >= minReward;

      return matchesSearch && matchesCategory && matchesReward;
    })
    .sort((a, b) => {
      // Logika sorting pilihan dropdown pembantu
      if (sortBy === 'Upah Tertinggi') {
        return (b.reward ?? 0) - (a.reward ?? 0);
      }
      // Bawaan: Terbaru berdasarkan waktu postingan
      return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime();
    });

  const JobCardLoading = () => {
    return (
      <div className="flex flex-col gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 animate-pulse">
            <div className="md:grid md:grid-cols-3 flex flex-col gap-6">
              
              {/* Bagian Kiri: Info Utama (col-span-2) */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  {/* Skeleton Tag Type */}
                  <div className="h-5 w-24 bg-slate-200 rounded-full" />
                  {/* Skeleton Waktu */}
                  <div className="h-4 w-32 bg-slate-100 rounded" />
                </div>
                
                {/* Skeleton Judul Proyek */}
                <div className="h-7 w-3/4 bg-slate-200 rounded-xl" />
                
                {/* Skeleton Meta Info (Employer & Lokasi) */}
                <div className="flex gap-4 pt-1">
                  <div className="h-4 w-28 bg-slate-100 rounded" />
                  <div className="h-4 w-24 bg-slate-100 rounded" />
                </div>
              </div>

              {/* Bagian Kanan: Upah & Tombol Aksi */}
              <div className="flex flex-col justify-between items-end gap-4 min-w-37.5">
                {/* Skeleton Upah Tugas */}
                <div className="text-right w-full space-y-1">
                  <div className="h-3 w-20 bg-slate-100 rounded ml-auto" />
                  <div className="h-8 w-36 bg-slate-200 rounded-xl ml-auto" />
                </div>
                
                {/* CONTAINER TOMBOL AKSI SKELETON */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  {/* Skeleton Tombol Lamar Sekarang */}
                  <div className="h-12 w-full md:w-36 bg-slate-200 rounded-2xl" />
                  {/* Skeleton Tombol Simpan Pekerjaan (Kotak Ikon) */}
                  <div className="h-12 w-12 bg-slate-200 rounded-2xl shrink-0" />
                </div>
              </div>

            </div>

            {/* Crowdsourcing Progress Bar Skeleton (Dibuat statis/palsu untuk simulasi) */}
            <div className="mt-6 pt-4 border-t border-slate-50 space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-28 bg-slate-100 rounded" />
                <div className="h-3 w-16 bg-slate-100 rounded" />
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 md:pt-12 lg:pt-4 lg:p-4">
      {/* Search & Hero Section */}
      <section className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Temukan Peluang Kerja</h1>
          <p className="text-blue-100 mb-6">Pilih tugas yang sesuai dengan keahlian dan lokasi Anda.</p>
          
          <div className="flex flex-row gap-3">
            <div className="flex-1 relative text-slate-800">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari posisi atau perusahaan..."
                className="w-full pl-10 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-blue-300 text-white border outline-none transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowSubModal(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-8 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2"
            >
              <FiFilter /> Filter
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
           <FiUsers size={300} />
        </div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filter (Desktop) */}
        <aside className="hidden lg:block space-y-6">
          <div>
            <h3 className="font-bold text-slate-800 mb-4">Kategori Sektor</h3>
            <div className="space-y-2">
              {['Produksi', 'Logistik', 'Jasa', 'Konstruksi'].map((cat) => (
                <label key={cat} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white cursor-pointer transition">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded text-blue-600 accent-blue-600 cursor-pointer"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  <span className="text-slate-600 font-medium">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-2">Upah Minimum</h3>
            <p className="text-xl font-bold text-green-600 mb-4">Rp{minReward.toLocaleString('id-ID')}</p>
            <input 
              type="range" 
              min="0"
              max={maxPriceLimit}
              step="10000"
              value={minReward}
              onChange={(e) => setMinReward(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-2">
              <span>Rp0</span>
              <span>Max: Rp{maxPriceLimit.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </aside>

        {/* Job List Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center px-2">
            <p className="text-slate-500 font-medium">{filteredJobs.length} Lowongan Tersedia</p>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-blue-600 outline-none cursor-pointer text-sm"
            >
              <option value="Terbaru">Terbaru</option>
              <option value="Upah Tertinggi">Upah Tertinggi</option>
            </select>
          </div>

          {loading ? (
            <JobCardLoading />
          ) : (
            <>
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                  <p className="text-slate-400 font-medium">Tidak ada lowongan kerja yang cocok dengan filter pencarian Anda.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategories([]); setMinReward(0); }} 
                    className="mt-4 text-sm font-bold text-blue-600 hover:underline"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const isJobSavedByUser = savedJobIds.includes(job.id) || (job.is_saved && job.worker_id === userId);

                  return (
                    <div key={job.id} className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                      <div className='md:grid md:grid-cols-3 flex flex-col'>
                        <Link href={`/jobs/${job.id}`} className="flex flex-col md:flex-row md:col-span-2 justify-between gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                job.type === 'Crowdsourcing' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                              }`}>
                                {job.type}
                              </span>
                              <span className="text-slate-400 text-xs flex items-center gap-1">
                                <FiClock /> {formatRelativeTime(job.posted_at)}
                              </span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition">{job.title}</h2>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                              <div className="flex items-center gap-1"><FiUser className="text-blue-500"/> {job.employer}</div>
                              <div className="flex items-center gap-1"><FiMapPin className="text-red-400"/> {job.location}</div>
                            </div>
                          </div>
                        </Link>

                        <div className="flex flex-col justify-between items-end gap-4 min-w-37.5">
                          <div className="text-right w-full">
                            <p className="text-xs text-slate-400 font-semibold uppercase">Upah Tugas</p>
                            <p className="text-2xl font-bold text-green-600">Rp{(job.reward ?? 0).toLocaleString('id-ID') || "0"}</p>
                          </div>
                          
                          {/* CONTAINER TOMBOL AKSI */}
                          <div className="flex items-center gap-3 w-full md:w-auto">
                            {userRole === 'worker' ? (
                              <>
                                <Link
                                  href={`/jobs/${job.id}`}
                                  className="text-center w-full px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition shadow-md whitespace-nowrap"
                                >
                                  Lamar Sekarang
                                </Link>
                                <SaveJobButton
                                  is_saved={isJobSavedByUser} // Menggunakan pengecekan dinamis user login
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
                              </>
                            ) : (
                              /* Tampilan fallback opsional jika yang login adalah Employer / Tamu */
                              <Link
                                href={`/jobs/${job.id}`}
                                className="text-center w-full px-6 py-3 bg-slate-100 text-slate-600 font-bold text-xs rounded-2xl hover:bg-slate-200 transition whitespace-nowrap"
                              >
                                Lihat Detail Proyek
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Crowdsourcing Progress Bar */}
                      {job.type === 'Crowdsourcing' && (
                        <div className="mt-6 pt-4 border-t border-slate-50">
                          <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-slate-500 uppercase">Kuota Crowdsourcing</span>
                            <span className="text-blue-600">{job.taken} / {job.total} Pekerja</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-500 h-full transition-all duration-500" 
                              style={{ width: `${(job.taken / job.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </>
          )}
        </div>
      </div>
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>
  );
};

export default Jobs;