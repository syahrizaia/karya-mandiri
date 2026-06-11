/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from "@/lib/db";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { FiFolder, FiShield, FiStar } from "react-icons/fi";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ManagePortofolio from "../manage-portofolio/page";
import SubscriptionDialog from "../subscription/page";

const SettingsItem = ({ label, value, status, onClick }: { label: string, value: string, status: string, onClick?: () => void }) => (
  <div className="p-4 sm:p-6 flex justify-between items-center hover:bg-slate-50 transition cursor-pointer" onClick={onClick}>
    <div className="min-w-0 flex-1 pr-2">
      <p className="text-sm font-semibold text-slate-700 truncate">{label}</p>
      <p className="text-xs text-slate-500 mt-0.5 truncate">{value}</p>
    </div>
    <div className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shrink-0 ${
      status === 'success' ? 'bg-green-100 text-green-700' : 
      status === 'warning' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
    }`}>
      {status === 'success' ? 'Aktif' : status === 'warning' ? 'Perlu Tindakan' : 'Atur'}
    </div>
  </div>
);

interface ProfileProps {
  params: Promise<{ id: string }>;
}

export default function TabPanel({ params }: ProfileProps) {
    const { id: profileId } = use(params);
    const [, setLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [showSubModal, setShowSubModal] = useState(false);
    const [showManagePortfolio, setShowManagePortfolio] = useState(false);
    const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'settings'>('portfolio');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const [userData, setUserData] = useState<{
        isVerified: boolean;
    }>({
        isVerified: false,
    });

    const [portfolios, setPortfolios] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);

    const fetchCurrentProfile = async () => {
        try {
        setLoading(true);

        const [profileRes, portfoliosRes, reviewsRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', profileId).maybeSingle(),
            supabase.from('portfolios').select('*').eq('user_id', profileId).order('created_at', { ascending: false }),
            supabase.from('reviews').select('*').eq('profile_id', profileId).order('created_at', { ascending: false })
        ]);

        if (profileRes.error && profileRes.error.code !== 'PGRST116') {
            console.error("Profile Fetch Error:", profileRes.error);
            toast.error("Gagal memuat profil.");
            return;
        }

        const profile = profileRes.data;
        if (!profile) {
            toast.error("Profil tidak ditemukan.");
            return;
        }

        const { data: authData } = await supabase.auth.getUser();
        const currentUser = authData?.user;
        const ownsProfile = !!(currentUser && currentUser.id === profileId);
        setIsOwnProfile(ownsProfile);

        setUserData({
            isVerified: profile?.is_verified || false,
        });

        const fetchedPortfolios = portfoliosRes.data || [];
        const fetchedReviews = reviewsRes.data || [];
        setPortfolios(fetchedPortfolios);
        setReviews(fetchedReviews);

        } catch (err: any) {
        console.error("Error global saat memuat profil:", err.message);
        } finally {
        setLoading(false);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) {
            toast.error("Silakan tulis komentar ulasan Anda terlebih dahulu.");
            return;
        }

        setIsSubmittingReview(true);
        try {
            const { data: authData } = await supabase.auth.getUser();
            const currentUser = authData?.user;

            if (!currentUser) {
                toast.error("Anda harus login terlebih dahulu untuk memberikan ulasan.");
                return;
            }

            // Ambil data profil pengulas untuk dijadikan nama klien pengirim
            const { data: reviewerProfile } = await supabase
                .from("profiles")
                .select("full_name, name")
                .eq("id", currentUser.id)
                .maybeSingle();

            const clientName = 
                reviewerProfile?.full_name || 
                reviewerProfile?.name || 
                currentUser.user_metadata?.full_name || // Ambil dari metadata login Google/Provider
                currentUser.user_metadata?.name ||      // Alternatif metadata
                currentUser.email?.split('@')[0] ||     // Jika bener-bener kosong, pakai nama depan Email-nya (misal: syahrizaia)
                "Pengguna KaryaMandiri";

            const { error } = await supabase.from("reviews").insert([
                {
                    profile_id: profileId,
                    client_name: clientName,
                    rating: newRating,
                    comment: newComment.trim(),
                }
            ]);

            if (error) throw error;

            toast.success("Ulasan Anda berhasil dikirim!");
            setShowReviewModal(false);
            setNewComment("");
            setNewRating(5);
            
            // Refresh daftar ulasan agar langsung muncul data barunya
            fetchCurrentProfile();
        } catch (err: any) {
            console.error("Error submit review:", err.message);
            toast.error("Gagal mengirimkan ulasan.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    useEffect(() => {
        if (profileId) {
        fetchCurrentProfile();
        }
    }, [profileId]);

    return (
        <div className="md:col-span-2 space-y-4 w-full min-w-0">
            <div className="flex overflow-x-auto whitespace-nowrap border-b border-slate-200 bg-white px-2 pt-4 rounded-t-2xl border border-b-0 border-slate-200 scrollbar-none">
            <button
                onClick={() => setActiveTab('portfolio')}
                className={`pb-3 px-3 sm:px-4 text-xs font-bold tracking-wide uppercase border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'portfolio' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
            >
                <FiFolder /> Portofolio ({portfolios.length})
            </button>
            <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 px-3 sm:px-4 text-xs font-bold tracking-wide uppercase border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
            >
                <FiStar /> Ulasan ({reviews.length})
            </button>
            {isOwnProfile && (
                <button
                onClick={() => setActiveTab('settings')}
                className={`pb-3 px-3 sm:px-4 text-xs font-bold tracking-wide uppercase border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                    activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
                >
                <FiShield /> Privasi
                </button>
            )}
            </div>

            {/* PANEL 1: PORTOFOLIO */}
            {activeTab === 'portfolio' && (
            <div className="space-y-4 w-full">
                {isOwnProfile && (
                <div className="flex justify-end">
                    <button
                    onClick={() => setShowManagePortfolio(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                    >
                    <FiFolder /> Kelola Portofolio
                    </button>
                </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                {portfolios.length > 0 ? (
                    portfolios.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-blue-300 transition-all shadow-2xs w-full">
                        <div className="relative h-36 bg-slate-100 w-full">
                        {item.image_url ? (
                            <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-105 transition duration-300" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300"><FiFolder size={32}/></div>
                        )}
                        </div>
                        <div className="p-4 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 mt-2 line-clamp-1 break-words">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 break-words">{item.description}</p>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400 italic">
                    Belum ada portofolio karya yang diunggah.
                    </div>
                )}
                </div>
            </div>
            )}

            {/* PANEL 2: ULASAN */}
            {activeTab === 'reviews' && (
            <div className="space-y-3 animate-in fade-in duration-200 w-full">
                {!isOwnProfile && (
                <div className="flex justify-end">
                    <button
                    onClick={() => setShowReviewModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                    >
                    <FiStar /> Beri Ulasan Jasa
                    </button>
                </div>
                )}

                {reviews.length > 0 ? (
                reviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-4 sm:p-5 border border-slate-200 rounded-2xl shadow-2xs space-y-2 w-full min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{rev.client_name || "Klien Anonim"}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">
                            {rev.created_at ? new Date(rev.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Baru saja"}
                        </p>
                        </div>
                        <div className="flex text-yellow-400 gap-0.5 shrink-0">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <FiStar key={i} size={12} fill="currentColor" />
                        ))}
                        </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic break-words">&quot;{rev.comment}&quot;</p>
                    </div>
                ))
                ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400 italic">
                    Belum memiliki riwayat ulasan dari klien.
                </div>
                )}
            </div>
            )}

            {/* PANEL 3: PENGATURAN PRIVASI */}
            {activeTab === 'settings' && isOwnProfile && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden animate-in fade-in duration-200 w-full">
                <SettingsItem 
                label="Verifikasi Akun" 
                value={userData.isVerified ? "Terverifikasi Resmi" : "Belum Verifikasi"} 
                status={userData.isVerified ? "success" : "warning"}
                onClick={() => setShowSubModal(true)}
                />
                <SettingsItem 
                label="Autentikasi Dua Faktor" 
                value="Non-aktif" 
                status="default"
                onClick={() => setShowSubModal(true)}
                />
                <SettingsItem
                label="Metode Rekening Utama" 
                value="Bank Central Asia (BCA)" 
                status="success"
                onClick={() => setShowSubModal(true)}
                />
            </div>
            )}

            <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />

            <Dialog open={showManagePortfolio} onOpenChange={setShowManagePortfolio}>
                <DialogContent className="max-w-2xl rounded-3xl">
                <DialogHeader>
                    <DialogTitle>Kelola Portofolio</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <ManagePortofolio userId={profileId} />
                </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
                <DialogContent className="max-w-md rounded-3xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-slate-800">Berikan Ulasan Jasa</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
                    {/* Input Rating Bintang */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Rating Kepuasan</label>
                        <div className="flex gap-1 text-2xl pt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewRating(star)}
                                    className="transition-transform hover:scale-110 active:scale-95"
                                >
                                    <FiStar
                                        className={star <= newRating ? "text-yellow-400" : "text-slate-200"}
                                        fill={star <= newRating ? "currentColor" : "none"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Teks Komentar */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Komentar / Feedback</label>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Tuliskan ulasan pengalaman kerja sama Anda dengan freelancer ini..."
                            rows={4}
                            maxLength={300}
                            className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 focus:bg-white transition resize-none leading-relaxed text-slate-700"
                        />
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex gap-2 pt-2 justify-end">
                        <button
                            type="button"
                            onClick={() => setShowReviewModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmittingReview}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold rounded-xl transition shadow-sm"
                        >
                            {isSubmittingReview ? "Mengirim..." : "Kirim Ulasan"}
                        </button>
                    </div>
                </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}