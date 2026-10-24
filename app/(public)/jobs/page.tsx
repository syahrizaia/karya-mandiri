/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from 'react';
import { IJobs } from '@/app/types/jobs';
import supabase from '@/lib/db';
import SubscriptionDialog from '../../../components/subscription/page';
import JobList from '@/components/jobs/job-list/page';
import { FiFilter, FiSearch, FiCompass, FiBriefcase } from 'react-icons/fi';
import { JobFilters } from '@/components/jobs/JobFilters';

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
    <div className="space-y-8 md:pt-12 lg:pt-4 lg:p-4 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Search & Hero Section */}
      <section className="glass-panel p-6 sm:p-10 rounded-3xl relative overflow-hidden bg-gradient-to-br from-blue-600/90 via-indigo-700/80 to-slate-900/90 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="glass-capsule text-xs font-bold uppercase tracking-widest text-sky-300 px-3.5 py-1.5 mb-4 inline-flex items-center gap-2">
            <FiCompass className="text-sm" /> Eksplorasi Peluang Kerja
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-2">
            Temukan Peluang Kerja & Tugas Mikro
          </h1>
          <p className="text-sky-100/90 text-sm sm:text-base mb-6 leading-relaxed">
            Pilih tugas crowdsourcing dan proyek mandiri yang sesuai dengan keahlian, waktu fleksibel, dan lokasi Anda.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input 
                type="text" 
                placeholder="Cari judul pekerjaan, perusahaan, atau kota..."
                className="w-full pl-11 pr-4 py-4 rounded-2xl text-slate-900 dark:text-white bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg focus:ring-4 focus:ring-blue-400/30 outline-none transition placeholder-slate-400 text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilterDrawer(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-amber-400/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <FiFilter /> Filter Pencarian
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 select-none pointer-events-none">
          <FiBriefcase size={360} />
        </div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Render extracted Sidebar & Drawer Filter */}
        <JobFilters 
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
          minReward={minReward}
          setMinReward={setMinReward}
          maxPriceLimit={maxPriceLimit}
          showFilterDrawer={showFilterDrawer}
          setShowFilterDrawer={setShowFilterDrawer}
          filteredJobsCount={filteredJobs.length}
          handleResetAllFilters={handleResetAllFilters}
        />

        {/* List Lowongan Kerja */}
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