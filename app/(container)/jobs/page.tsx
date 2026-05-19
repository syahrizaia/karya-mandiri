/* eslint-disable react-hooks/static-components */
"use client";

import React, { useEffect, useState } from 'react';
import { 
  FiSearch, 
  FiMapPin, 
  FiFilter, 
  FiUsers, 
  FiClock
} from 'react-icons/fi';
import Link from 'next/link';
import { IJobs } from '@/app/types/jobs';
import supabase from '@/lib/db';
import formatRelativeTime from '@/components/ui/format-relative-time/page';
import SubscriptionDialog from '../../../components/subscription/page';
import SaveJobButton from '@/components/ui/save-job-button/page';

// Helper Component for Icon
const FiBriefcase = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);

const Jobs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<IJobs[]>([]);
  const [showSubModal, setShowSubModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const {data, error} = await supabase.from('jobs').select('*').order('posted_at', { ascending: false });
      if(error) {
        console.error('Error fetching jobs:', error);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };

    fetchJobs();
  }, [supabase]);

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
                  <input type="checkbox" className="w-5 h-5 rounded text-blue-600" />
                  <span className="text-slate-600 font-medium">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-2">Upah Minimum</h3>
            <p className="text-2xl font-bold text-green-600 mb-4">Rp25.000.000</p>
            <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
        </aside>

        {/* Job List Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center px-2">
            <p className="text-slate-500 font-medium">{jobs.length} Lowongan Tersedia</p>
            <select className="bg-transparent font-semibold text-blue-600 outline-none">
              <option>Terbaru</option>
              <option>Upah Tertinggi</option>
            </select>
          </div>

          {loading ? (
            <JobCardLoading />
          ) : (
            <>
              {jobs.map((job) => (
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
                          <div className="flex items-center gap-1"><FiBriefcase className="text-blue-500"/> {job.employer}</div>
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
                        <Link
                          href={`/jobs/${job.id}`}
                          className="text-center w-full px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition shadow-md whitespace-nowrap"
                        >
                          Lamar Sekarang
                        </Link>
                        {/* Tombol Simpan Pekerjaan */}
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
              ))}
            </>
          )}
        </div>
      </div>
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>
  );
};

export default Jobs;