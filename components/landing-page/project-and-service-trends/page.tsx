import supabase from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEye, FiLayers, FiPlusCircle, FiSearch, FiTrendingUp } from "react-icons/fi";

interface Job {
  id: string;
  title: string;
  category: string;
  reward: number;
  total: string;
  employer: string;
  user_id: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  owner_name: string;
  owner_avatar: string;
}

export default function ProjectAndServiceTrends() {
    const [activeJobTab, setActiveJobTab] = useState<'interested' | 'searched' | 'posted'>('interested');
    const [activeServiceTab, setActiveServiceTab] = useState<'interested' | 'searched' | 'posted'>('interested');
    
    const [trendingJobs, setTrendingJobs] = useState<Job[]>([]);
    const [trendingServices, setTrendingServices] = useState<Service[]>([]);

    const [isLoadingJobs, setIsLoadingJobs] = useState(true);
    const [isLoadingServices, setIsLoadingServices] = useState(true);

    // Fetching Data Berdasarkan Tab Tren Proyek
    useEffect(() => {
        const fetchTrendingJobs = async () => {
        setIsLoadingJobs(true);
        let viewName = 'view_trending_jobs_interested';
        if (activeJobTab === 'searched') viewName = 'view_trending_jobs_searched';
        if (activeJobTab === 'posted') viewName = 'view_trending_jobs_posted';

        try {
            const { data, error } = await supabase.from(viewName).select('*').limit(3);
            if (error) throw error;
            setTrendingJobs((data as Job[]) || []);
        } catch (err) {
            console.error('Error fetching trending jobs:', err);
        } finally {
            setIsLoadingJobs(false);
        }
        };
        fetchTrendingJobs();
    }, [activeJobTab]);

    // Fetching Data Berdasarkan Tab Tren Jasa
    useEffect(() => {
        const fetchTrendingServices = async () => {
        setIsLoadingServices(true);
        let viewName = 'view_trending_services_interested';
        if (activeServiceTab === 'searched') viewName = 'view_trending_services_searched';
        if (activeServiceTab === 'posted') viewName = 'view_trending_services_posted';

        try {
            const { data, error } = await supabase.from(viewName).select('*').limit(3);
            if (error) throw error;
            setTrendingServices((data as Service[]) || []);
        } catch (err) {
            console.error('Error fetching trending services:', err);
        } finally {
            setIsLoadingServices(false);
        }
        };
        fetchTrendingServices();
    }, [activeServiceTab]);

    // Handler Log Interaksi untuk Tracking Data Akurat secara Real-time
    const handleInteractionLog = async (itemId: string, type: 'job' | 'service') => {
        await supabase.from('interaction_logs').insert([
        { item_id: itemId, item_type: type, interaction_type: 'interest' }
        ]);
    };

    return (
        <>
            {/* SECTION TREN PROYEK/TUGAS (3 KATEGORI TREN) */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div className="space-y-2">
            <h2 className="text-xs uppercase font-bold tracking-widest text-blue-500 flex items-center gap-1.5"><FiTrendingUp /> Live Intelligence</h2>
            <p className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Tren Proyek & Tugas Mikro</p>
          </div>
          
          {/* Navigasi Filter Tab Tren */}
          <div className="flex flex-wrap p-1.5 glass-capsule gap-1">
            <button onClick={() => setActiveJobTab('interested')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${activeJobTab === 'interested' ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}><FiEye size={14}/> Paling Diminati</button>
            <button onClick={() => setActiveJobTab('searched')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${activeJobTab === 'searched' ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}><FiSearch size={14}/> Banyak Dicari</button>
            <button onClick={() => setActiveJobTab('posted')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${activeJobTab === 'posted' ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}><FiPlusCircle size={14}/> Gencar Diposting</button>
          </div>
        </div>

        {/* List Tampilan Hasil Tren Tugas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingJobs ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="p-6 glass-card rounded-3xl h-52 animate-pulse flex flex-col justify-between"/>
            ))
          ) : trendingJobs.length === 0 ? (
            <p className="text-slate-500 text-sm col-span-3 text-center py-8">Tidak ada data tren pada klaster ini.</p>
          ) : (
            trendingJobs.map((job) => (
              <div key={job.id} className="p-6 glass-card rounded-3xl flex flex-col justify-between group relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold gap-2">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full">{job.category}</span>
                    <span className="text-slate-600 dark:text-slate-400 bg-white/40 dark:bg-slate-800/40 px-3 py-1 rounded-full max-w-[130px] truncate border border-white/20 dark:border-white/10">{job.employer || 'Anonim Corporation'}</span>
                  </div>
                  <Link href={`/jobs/${job.id}`} onClick={() => handleInteractionLog(job.id, 'job')} className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition block">{job.title}</Link>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Upah Bersih</p>
                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">Rp {job.reward?.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Sisa Kuota</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{job.total} Slot</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* SECTION TREN JASA/SERVICES (3 KATEGORI TREN) */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div className="space-y-2">
            <h2 className="text-xs uppercase font-bold tracking-widest text-purple-500 flex items-center gap-1.5"><FiLayers /> Freelance Economy</h2>
            <p className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Katalog Jasa Paling Menanjak</p>
          </div>
          
          {/* Navigasi Filter Tab Tren Jasa */}
          <div className="flex flex-wrap p-1.5 glass-capsule gap-1">
            <button onClick={() => setActiveServiceTab('interested')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${activeServiceTab === 'interested' ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}><FiEye size={14}/> Paling Diminati</button>
            <button onClick={() => setActiveServiceTab('searched')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${activeServiceTab === 'searched' ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}><FiSearch size={14}/> Banyak Dicari</button>
            <button onClick={() => setActiveServiceTab('posted')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${activeServiceTab === 'posted' ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}><FiPlusCircle size={14}/> Gencar Ditawarkan</button>
          </div>
        </div>

        {/* List Tampilan Hasil Tren Jasa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingServices ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="p-6 glass-card rounded-3xl h-52 animate-pulse flex flex-col justify-between"/>
            ))
          ) : trendingServices.length === 0 ? (
            <p className="text-slate-500 text-sm col-span-3 text-center py-8">Tidak ada penawaran jasa pada klaster ini.</p>
          ) : (
            trendingServices.map((service) => (
              <div key={service.id} className="p-6 glass-card rounded-3xl flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Image
                      width={32}
                      height={32}
                      src={service.owner_avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256"} 
                      alt={service.owner_name} 
                      className="w-8 h-8 rounded-full object-cover border border-white/40 dark:border-white/10"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{service.owner_name}</p>
                      <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">{service.category}</p>
                    </div>
                  </div>
                  <Link href={`/services/${service.id}`} onClick={() => handleInteractionLog(service.id, 'service')} className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition block truncate">{service.title}</Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{service.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Mulai Dari</p>
                    <p className="text-sm font-black text-purple-600 dark:text-purple-400">Rp {service.price?.toLocaleString('id-ID')}</p>
                  </div>
                  <Link href={`/services/${service.id}`} className="text-xs font-bold bg-white/60 dark:bg-white/10 group-hover:bg-purple-600 group-hover:text-white transition-all px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-200 border border-white/30 dark:border-white/10">Detail</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
        </>
    )
}