/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from 'react';
import { IJobs } from '@/app/types/jobs';
import supabase from '@/lib/db';
import SubscriptionDialog from '../../../components/subscription/page';
import JobList from '@/components/jobs/job-list/page';
import { FiFilter, FiSearch, FiUsers } from 'react-icons/fi';
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
      <section className="bg-blue-600 dark:bg-blue-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden transition-colors">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Temukan Peluang Kerja</h1>
          <p className="text-blue-100 dark:text-blue-200 mb-6 transition-colors">Pilih tugas yang sesuai dengan keahlian dan lokasi Anda.</p>
          
          <div className="flex flex-row gap-3">
            <div className="flex-1 relative text-slate-800 dark:text-slate-100">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input 
                type="text" 
                placeholder="Cari posisi atau perusahaan..."
                className="w-full pl-10 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900/50 text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 outline-none transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilterDrawer(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-8 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiFilter /> Filter
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 select-none pointer-events-none">
           <FiUsers size={300} />
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