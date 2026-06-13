/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiUsers, 
  FiX
} from 'react-icons/fi';
import { IJobs } from '@/app/types/jobs';
import supabase from '@/lib/db';
import SubscriptionDialog from '../../../components/subscription/page';
import JobList from '@/components/job-list/page';

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
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

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
              full_name,
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
      const employerName = (job as any).profiles?.full_name || 'Pengguna KaryaMandiri';
      
      const matchesSearch = 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleResetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setMinReward(0);
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
                  onClick={handleResetAllFilters}
                  className="w-full py-2.5 text-slate-500 font-bold text-xs hover:text-red-500 transition"
                >
                  Reset Pilihan
                </button>
              </div>
            </div>
          </div>
        )}

        <JobList
          filteredJobs={filteredJobs}
          currentJobs={currentJobs}
          loading={loading}
          sortBy={sortBy}
          setSortBy={setSortBy}
          userId={userId}
          userRole={userRole}
          savedJobIds={savedJobIds}
          currentPage={currentPage}
          totalPages={totalPages}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          handlePageChange={handlePageChange}
          onResetFilters={handleResetAllFilters}
        />

      </div>
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>
  );
};

export default Jobs;