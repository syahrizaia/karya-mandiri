/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { use, useEffect, useState } from "react";
import supabase from "@/lib/db";
import { FiBriefcase, FiCheckCircle, FiStar } from "react-icons/fi";
import { toast } from "sonner";

interface ProfileProps {
  params: Promise<{ id: string }>;
}

export default function PerfomanceStatistic({ params }: ProfileProps) {
  const { id: profileId } = use(params);
  const [, setLoading] = useState(true);
  const [stats, setStats] = useState({ jobCompleted: 0, successRate: 100, rating: 0.0 });
  const [, setReviews] = useState<any[]>([]);

  const fetchCurrentProfile = async () => {
    try {
      setLoading(true);

      const [profileRes, reviewsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', profileId).maybeSingle(),
        supabase.from('reviews').select('*').eq('profile_id', profileId).order('created_at', { ascending: false })
      ]);

      const profile = profileRes.data;
      if (!profile) {
        toast.error("Profil tidak ditemukan.");
        return;
      }

      const fetchedReviews = reviewsRes.data || [];
      setReviews(fetchedReviews);

      const completedCount = profile?.job_completed || fetchedReviews.length || 0;
      const successRatePercent = profile?.success_rate || 100;
        
      const averageRating = fetchedReviews.length > 0 
        ? parseFloat((fetchedReviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / fetchedReviews.length).toFixed(1))
        : parseFloat((profile?.rating || 0.0).toFixed(1));

      setStats({
        jobCompleted: completedCount,
        successRate: successRatePercent,
        rating: averageRating
      });

    } catch (err: any) {
      console.error("Error global saat memuat profil:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchCurrentProfile();
    }
  }, [profileId]);

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Statistik Selesai */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl flex items-center gap-3 shadow-xs min-w-0 transition-colors">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl hidden sm:block shrink-0">
          <FiBriefcase size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-[9px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
            Selesai
          </p>
          <p className="text-base sm:text-2xl font-black text-slate-800 dark:text-slate-200 truncate">
            {stats.jobCompleted}
          </p>
        </div>
      </div>

      {/* Statistik Sukses */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl flex items-center gap-3 shadow-xs min-w-0 transition-colors">
        <div className="p-3 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-xl hidden sm:block shrink-0">
          <FiCheckCircle size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-[9px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
            Sukses
          </p>
          <p className="text-base sm:text-2xl font-black text-green-600 dark:text-green-400 truncate">
            {stats.successRate}%
          </p>
        </div>
      </div>

      {/* Statistik Rating */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl flex items-center gap-3 shadow-xs min-w-0 transition-colors">
        <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-500 dark:text-yellow-400 rounded-xl hidden sm:block shrink-0">
          <FiStar size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-[9px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
            Rating
          </p>
          <p className="text-base sm:text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-1 truncate">
            {stats.rating > 0 ? stats.rating : "-"} 
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal hidden sm:inline">/5.0</span>
          </p>
        </div>
      </div>
    </div>
  );
}