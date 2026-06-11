/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import supabase from "@/lib/db";
import { use, useEffect, useState } from "react";
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
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl flex items-center gap-3 shadow-xs min-w-0">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl hidden sm:block shrink-0"><FiBriefcase size={18}/></div>
            <div className="min-w-0">
            <p className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Selesai</p>
            <p className="text-base sm:text-2xl font-black text-slate-800 truncate">{stats.jobCompleted}</p>
            </div>
        </div>
        <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl flex items-center gap-3 shadow-xs min-w-0">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl hidden sm:block shrink-0"><FiCheckCircle size={18}/></div>
            <div className="min-w-0">
            <p className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Sukses</p>
            <p className="text-base sm:text-2xl font-black text-green-600 truncate">{stats.successRate}%</p>
            </div>
        </div>
        <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl flex items-center gap-3 shadow-xs min-w-0">
            <div className="p-3 bg-yellow-50 text-yellow-500 rounded-xl hidden sm:block shrink-0"><FiStar size={18}/></div>
            <div className="min-w-0">
            <p className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Rating</p>
            <p className="text-base sm:text-2xl font-black text-slate-800 flex items-center gap-1 truncate">
                {stats.rating > 0 ? stats.rating : "-"} 
                <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">/5.0</span>
            </p>
            </div>
        </div>
        </div>
    )
}