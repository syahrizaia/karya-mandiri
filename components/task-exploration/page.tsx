import supabase from "@/lib/db";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";

interface Job {
  id: string;
  title: string;
  category: string;
  reward: number;
  total: string;
  employer: string;
  user_id: string;
}

export default function TaskExploration() {
    const [recentJobs, setRecentJobs] = useState<Job[]>([]);
    const [isLoadingJobs, setIsLoadingJobs] = useState(true);

    useEffect(() => {
        const fetchRecentJobs = async () => {
        try {
            setIsLoadingJobs(true);
            const { data, error } = await supabase
            .from('jobs') 
            .select('id, title, category, reward, total, employer, user_id')
            .order('posted_at', { ascending: false }) 
            .limit(3);

            if (error) throw error;
            if (data) setRecentJobs(data as Job[]);
        } catch (err) {
            console.error('Error fetching jobs:', err);
        } finally {
            setIsLoadingJobs(false);
        }
        };

        fetchRecentJobs();
    }, []);
    
    return (
        <section className="py-24 px-6 max-w-6xl mx-auto border-b border-slate-900">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-xs uppercase font-bold tracking-widest text-blue-500">Live Workspace</h2>
            <p className="text-2xl md:text-4xl font-extrabold">Eksplorasi Tugas Terbuka</p>
          </div>
          <Link href="/jobs" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group">
            Lihat Semua Lowongan Tugas <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingJobs ? (
            // Skeleton Loading State untuk Jobs
            [...Array(3)].map((_, i) => (
              <div key={i} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl h-48 animate-pulse flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-1/3 h-4 bg-slate-800 rounded" />
                  <div className="w-full h-6 bg-slate-800 rounded" />
                </div>
                <div className="w-1/2 h-4 bg-slate-800 rounded" />
              </div>
            ))
          ) : recentJobs.length === 0 ? (
            <p className="text-slate-500 text-sm col-span-3 text-center py-8">Tidak ada lowongan tugas terbaru saat ini.</p>
          ) : (
            recentJobs.map((job, idx) => (
              <div key={idx} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition group">
                <div className="space-y-4">
                  {/* UPDATE: Conditional styling difficulty diubah menjadi Badge Employer yang rapi */}
                  <div className="flex justify-between items-center text-[10px] font-bold gap-2">
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md shrink-0">{job.category}</span>
                    <Link href={`/profile/${job.user_id}`} className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md truncate max-w-[140px]" title={job.employer}>
                      {job.employer || 'No Employer'}
                    </Link>
                  </div>
                  <Link href={`/jobs/${job.id}`} className="font-bold text-white text-base leading-snug group-hover:text-blue-400 transition">{job.title}</Link>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Upah / Valid</p>
                    <p className="text-sm font-black text-emerald-400">Rp {job.reward?.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Kuota</p>
                    <p className="text-xs font-semibold text-slate-300">{job.total}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    )
}