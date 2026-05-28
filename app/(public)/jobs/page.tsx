/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/static-components */
"use client";

import React, { useEffect, useState } from 'react';
import { 
  FiSearch, 
  FiMapPin, 
  FiFilter, 
  FiUsers, 
  FiClock,
  FiX,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import Link from 'next/link';
import { IJobs } from '@/app/types/jobs';
import supabase from '@/lib/db';
import formatRelativeTime from '@/components/ui/format-relative-time/page';
import SubscriptionDialog from '../../../components/subscription/page';
import SaveJobButton from '@/components/ui/save-job-button/page';
import Image from 'next/image';

const Jobs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<IJobs[]>([]);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minReward, setMinReward] = useState<number>(0);
  const [maxPriceLimit, setMaxPriceLimit] = useState<number>(5000000); 
  const [sortBy, setSortBy] = useState<string>('Terbaru');
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]); 
  
  // State Utama untuk Keperluan Navigasi Halaman Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Batas maksimal data per halaman adalah 15

  useEffect(() => {
    const checkUserAndFetchJobs = async () => {
      try {
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
            
          if (profile) {
            setUserRole(profile.role?.toLowerCase());
          }

          const { data: savedData } = await supabase
            .from('saved_jobs') 
            .select('job_id')
            .eq('user_id', user.id);
            
          if (savedData) {
            setSavedJobIds(savedData.map(item => item.job_id));
          }
        }

        const { data: jobsData, error } = await supabase
          .from('jobs')
          .select(`
            *,
            profiles:user_id (
              avatar_url
            )
          `)
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

  // Reset halaman aktif kembali ke 1 jika filter pencarian/kategori diubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, minReward, sortBy]);

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch = 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.employer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategories.length === 0 || 
        selectedCategories.some(cat => job.category?.toLowerCase() === cat.toLowerCase());

      const matchesReward = (job.reward ?? 0) >= minReward;

      return matchesSearch && matchesCategory && matchesReward;
    })
    .sort((a, b) => {
      if (sortBy === 'Upah Tertinggi') {
        return (b.reward ?? 0) - (a.reward ?? 0);
      }
      return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime();
    });

  // LOGIKA UTAMA SPLICING DATA PAGINATION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Auto-scroll kembali ke bagian atas list pekerjaan saat pindah halaman demi UX yang baik
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const JobCardLoading = () => {
    return (
      <div className="flex flex-col gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 animate-pulse">
            <div className="md:grid md:grid-cols-3 flex flex-col gap-6">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-24 bg-slate-200 rounded-full" />
                  <div className="h-4 w-32 bg-slate-100 rounded" />
                </div>
                <div className="h-7 w-3/4 bg-slate-200 rounded-xl" />
                <div className="flex gap-4 pt-1">
                  <div className="h-4 w-28 bg-slate-100 rounded" />
                  <div className="h-4 w-24 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="flex flex-col justify-between items-end gap-4 min-w-37.5">
                <div className="text-right w-full space-y-1">
                  <div className="h-3 w-20 bg-slate-100 rounded ml-auto" />
                  <div className="h-8 w-36 bg-slate-200 rounded-xl ml-auto" />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="h-12 w-full md:w-36 bg-slate-200 rounded-2xl" />
                  <div className="h-12 w-12 bg-slate-200 rounded-2xl shrink-0" />
                </div>
              </div>
            </div>
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
              onClick={() => setShowFilterDrawer(true)}
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

        {/* DRAWER MODAL FILTER UNTUK DEVICE MOBILE & TABLET */}
        {showFilterDrawer && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end animate-fade-in">
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-xs" 
              onClick={() => setShowFilterDrawer(false)}
            />
            
            <div className="relative w-80 max-w-full bg-white h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-slide-left z-10">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <FiFilter className="text-blue-600"/> Filter Lowongan
                  </h2>
                  <button 
                    onClick={() => setShowFilterDrawer(false)}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Kategori Sektor</h3>
                  <div className="space-y-1">
                    {['Produksi', 'Logistik', 'Jasa', 'Konstruksi'].map((cat) => (
                      <label key={cat} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded text-blue-600 accent-blue-600 cursor-pointer"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => handleCategoryChange(cat)}
                        />
                        <span className="text-slate-600 text-sm font-semibold">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60">
                  <h3 className="font-bold text-slate-800 mb-1 text-sm uppercase tracking-wide">Upah Minimum</h3>
                  <p className="text-lg font-black text-green-600 mb-3">Rp{minReward.toLocaleString('id-ID')}</p>
                  <input 
                    type="range" 
                    min="0"
                    max={maxPriceLimit}
                    step="10000"
                    value={minReward}
                    onChange={(e) => setMinReward(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-2">
                    <span>Rp0</span>
                    <span>Max: Rp{maxPriceLimit.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm"
                >
                  Terapkan Filter ({filteredJobs.length})
                </button>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setMinReward(0);
                  }}
                  className="w-full py-2.5 text-slate-500 font-bold text-xs hover:text-red-500 transition"
                >
                  Reset Pilihan
                </button>
              </div>
            </div>
          </div>
        )}

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
                /* Loop dialihkan menggunakan currentJobs hasil slicing pagination */
                currentJobs.map((job) => {
                  const isJobSavedByUser = savedJobIds.includes(job.id) || (job.is_saved && job.worker_id === userId);

                  return (
                    <div key={job.id} className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                      <div className='md:grid md:grid-cols-3 flex flex-col'>
                        <div className="flex flex-col md:flex-row md:col-span-2 justify-between gap-6">
                          <div className="space-y-3 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-3 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                job.type === 'Crowdsourcing' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                              }`}>
                                {job.type}
                              </span>
                              <span className="text-slate-400 text-xs flex items-center gap-1">
                                <FiClock /> {formatRelativeTime(job.posted_at)}
                              </span>
                            </div>
                            <Link href={`/jobs/${job.id}`} className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition">{job.title}</Link>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                              <Link href={`profile/${job.user_id}`} className="flex items-center gap-1 z-10 text-blue-400 hover:text-blue-600 transition">
                                {(job as any).profiles?.avatar_url ? (
                                  <Image
                                    src={(job as any).profiles.avatar_url} 
                                    alt={job.employer || 'Avatar'} 
                                    className="w-5 h-5 rounded-xl object-cover border border-slate-200 shrink-0"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                    width={50}
                                    height={50}
                                  />
                                ) : (
                                  <div className="w-5 h-5 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 uppercase">
                                    {job.employer ? job.employer.charAt(0) : 'U'}
                                  </div>
                                )}
                                <span>{job.employer}</span>
                              </Link>
                              <div className="flex items-center gap-1"><FiMapPin className="text-red-400"/> {job.location}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between items-end gap-4 min-w-37.5">
                          <div className="text-right w-full">
                            <p className="text-xs text-slate-400 font-semibold uppercase">Upah Tugas</p>
                            <p className="text-2xl font-bold text-green-600">Rp{(job.reward ?? 0).toLocaleString('id-ID') || "0"}</p>
                          </div>
                          
                          <div className="flex items-center gap-3 w-full md:w-auto">
                            {userRole === 'worker' ? (
                              <>
                                <Link
                                  href={`/jobs/${job.id}`}
                                  className="text-center w-full px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition shadow-md whitespace-nowrap"
                                >
                                  Lihat Detail Pekerjaan
                                </Link>
                                <SaveJobButton
                                  is_saved={isJobSavedByUser} 
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
                              <Link
                                href={`/jobs/${job.id}`}
                                className="text-center w-full px-6 py-3 bg-slate-100 text-slate-600 font-bold text-xs rounded-2xl hover:bg-slate-200 transition whitespace-nowrap"
                              >
                                Lihat Detail Pekerjaan
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>

                      {job.type === 'Crowdsourcing' && (
                        <div className="mt-2 pt-4 border-t border-slate-50">
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

              {/* BARIS UTAMA KOMPONEN INTERAKSI PAGINATION FOOTER */}
              {totalPages > 1 && (
                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-between items-center text-center sm:text-left text-sm">
                  <p className="text-xs text-slate-400 font-semibold w-full sm:w-auto">
                    Menampilkan <span className="text-slate-700">{indexOfFirstItem + 1}</span> -{" "}
                    <span className="text-slate-700">
                      {Math.min(indexOfLastItem, filteredJobs.length)}
                    </span>{" "}
                    dari <span className="text-slate-700">{filteredJobs.length}</span> lowongan
                  </p>

                  {/* Tetap di tengah jika di mobile berkat `mx-auto sm:mx-0` */}
                  <div className="flex items-center justify-center gap-1 mx-auto sm:mx-0">
                    {/* Tombol Halaman Sebelumnya */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft size={16} />
                    </button>

                    {/* Baris Iterasi Angka Urutan Halaman */}
                    {Array.from({ length: totalPages }, (_, idx) => (
                      <button
                        key={idx + 1}
                        onClick={() => handlePageChange(idx + 1)}
                        className={`w-9 h-9 text-xs font-bold rounded-xl transition cursor-pointer ${
                          currentPage === idx + 1
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}

                    {/* Tombol Halaman Berikutnya */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
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
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>
  );
};

export default Jobs;