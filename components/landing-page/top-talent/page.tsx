"use client";

import supabase from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { MdVerified } from "react-icons/md";

interface Talent {
  id: string;
  full_name: string;
  role: string;
  location: string;
  skills: string[];
  rating: number;
  job_completed: number;
  is_verified: boolean;
  avatar_url: string;
}

export default function TopTalent() {
    const [topTalents, setTopTalents] = useState<Talent[]>([]);
    const [isLoadingTalents, setIsLoadingTalents] = useState(true);

    useEffect(() => {
        const fetchTopTalents = async () => {
            try {
                setIsLoadingTalents(true);
                
                const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, role, location, skills, rating, job_completed, is_verified, avatar_url')
                // FILTER 1: Hanya user yang sudah terverifikasi
                .eq('is_verified', true) 
                // FILTER 2: Foto profil tidak boleh null atau string kosong
                .not('avatar_url', 'is', null)
                .neq('avatar_url', '')
                // FILTER 3: Kolom keahlian tidak boleh null atau berupa array kosong '{}'
                .not('skills', 'is', null)
                .neq('skills', '{}') 
                // Urutkan berdasarkan rating tertinggi
                .order('rating', { ascending: false }) 
                .limit(3);

                if (error) throw error;
                if (data) setTopTalents(data as Talent[]);
            } catch (err) {
                console.error('Error fetching talents:', err);
            } finally {
                setIsLoadingTalents(false);
            }
        };

        fetchTopTalents();
    }, []);
    
  return (
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-500">Top Performers</h2>
          <p className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">Talenta Terverifikasi</p>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Mereka adalah para profesional handal dengan rekam jejak penyelesaian tugas berakurasi tinggi di platform KaryaMandiri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingTalents ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="glass-card p-6 rounded-3xl h-56 animate-pulse flex flex-col justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                    <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  </div>
                </div>
                <div className="w-full h-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            ))
          ) : topTalents.length === 0 ? (
            <p className="text-slate-500 text-sm col-span-3 text-center py-8">Tidak ada data talenta saat ini.</p>
          ) : (
            topTalents.map((talent, idx) => (
              <div key={idx} className="glass-card p-6 rounded-3xl flex flex-col justify-between group">
                <div className="space-y-4">
                  <Link href={`/profile/${talent.id}`} className="flex items-center gap-4">
                    <div className="relative w-14 h-14 shrink-0">
                      <Image
                        src={talent.avatar_url}
                        alt={talent.full_name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover rounded-2xl border border-white/40 dark:border-white/10 shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow">
                        <MdVerified size={13} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{talent.full_name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{talent.role}</p>
                    </div>
                  </Link>

                  <div className="flex flex-wrap gap-1.5">
                    {talent.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-3 py-1 bg-white/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 rounded-full font-medium border border-white/20 dark:border-white/10">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-slate-200/50 dark:border-white/10 text-center">
                  <div className="bg-white/40 dark:bg-slate-900/40 p-2.5 rounded-2xl border border-white/20 dark:border-white/10">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Selesai</p>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200">{talent.job_completed} Tugas</p>
                  </div>
                  <div className="bg-white/40 dark:bg-slate-900/40 p-2.5 rounded-2xl border border-white/20 dark:border-white/10">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Rating Review</p>
                    <p className="text-sm font-black text-amber-500 flex items-center justify-center gap-1">
                      <FiStar size={12} fill="currentColor" /> {talent.rating?.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
  );
}