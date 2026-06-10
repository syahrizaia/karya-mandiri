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
      <section className="py-24 px-6 max-w-6xl mx-auto border-b border-slate-900">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div className="space-y-2">
            <h2 className="text-xs uppercase font-bold tracking-widest text-blue-500 flex items-center gap-1.5"><FiTrendingUp /> Live Intelligence</h2>
            <p className="text-2xl md:text-4xl font-extrabold">Tren Proyek & Tugas Mikro</p>
          </div>
          
          {/* Navigasi Filter Tab Tren */}
          <div className="flex flex-wrap p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl gap-1">
            <button onClick={() => setActiveJobTab('interested')} className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeJobTab === 'interested' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}><FiEye size={14}/> Paling Diminati</button>
            <button onClick={() => setActiveJobTab('searched')} className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeJobTab === 'searched' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}><FiSearch size={14}/> Banyak Dicari</button>
            <button onClick={() => setActiveJobTab('posted')} className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeJobTab === 'posted' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}><FiPlusCircle size={14}/> Gencar Diposting</button>
          </div>
        </div>

        {/* List Tampilan Hasil Tren Tugas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingJobs ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl h-48 animate-pulse flex flex-col justify-between"/>
            ))
          ) : trendingJobs.length === 0 ? (
            <p className="text-slate-500 text-sm col-span-3 text-center py-8">Tidak ada data tren pada klaster ini.</p>
          ) : (
            trendingJobs.map((job) => (
              <div key={job.id} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition group relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold gap-2">
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md">{job.category}</span>
                    <span className="text-blue-400 border border-blue-500/20 bg-blue-500/5 px-2.5 py-1 rounded-md max-w-[130px] truncate">{job.employer || 'Anonim Corporation'}</span>
                  </div>
                  <Link href={`/jobs/${job.id}`} onClick={() => handleInteractionLog(job.id, 'job')} className="font-bold text-white text-base leading-snug group-hover:text-blue-400 transition block">{job.title}</Link>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Upah Bersih</p>
                    <p className="text-sm font-black text-emerald-400">Rp {job.reward?.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Sisa Kuota</p>
                    <p className="text-xs font-semibold text-slate-300">{job.total} Slot</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* SECTION TREN JASA/SERVICES (3 KATEGORI TREN) */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-b border-slate-900">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div className="space-y-2">
            <h2 className="text-xs uppercase font-bold tracking-widest text-purple-400 flex items-center gap-1.5"><FiLayers /> Freelance Economy</h2>
            <p className="text-2xl md:text-4xl font-extrabold">Katalog Jasa Paling Menanjak</p>
          </div>
          
          {/* Navigasi Filter Tab Tren Jasa */}
          <div className="flex flex-wrap p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl gap-1">
            <button onClick={() => setActiveServiceTab('interested')} className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeServiceTab === 'interested' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}><FiEye size={14}/> Paling Diminati</button>
            <button onClick={() => setActiveServiceTab('searched')} className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeServiceTab === 'searched' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}><FiSearch size={14}/> Banyak Dicari</button>
            <button onClick={() => setActiveServiceTab('posted')} className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeServiceTab === 'posted' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}><FiPlusCircle size={14}/> Gencar Ditawarkan</button>
          </div>
        </div>

        {/* List Tampilan Hasil Tren Jasa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingServices ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl h-48 animate-pulse flex flex-col justify-between"/>
            ))
          ) : trendingServices.length === 0 ? (
            <p className="text-slate-500 text-sm col-span-3 text-center py-8">Tidak ada penawaran jasa pada klaster ini.</p>
          ) : (
            trendingServices.map((service) => (
              <div key={service.id} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-purple-500/40 transition group">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Image
                      width={32}
                      height={32}
                      src={service.owner_avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256"} 
                      alt={service.owner_name} 
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 truncate">{service.owner_name}</p>
                      <p className="text-[10px] text-purple-400 font-medium">{service.category}</p>
                    </div>
                  </div>
                  <Link href={`/services/${service.id}`} onClick={() => handleInteractionLog(service.id, 'service')} className="font-bold text-white text-base leading-snug group-hover:text-purple-400 transition block truncate">{service.title}</Link>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{service.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Mulai Dari</p>
                    <p className="text-sm font-black text-purple-400">Rp {service.price?.toLocaleString('id-ID')}</p>
                  </div>
                  <Link href={`/services/${service.id}`} className="text-xs font-bold bg-slate-800 group-hover:bg-purple-600 group-hover:text-white transition px-3 py-1.5 rounded-lg text-slate-300">Detail</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
        </>
    )
}