/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { FiStar, FiMessageSquare, FiX } from "react-icons/fi";
import supabase from "@/lib/db";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link"; // Tambahkan import Link dari Next.js

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  }[] | null;
}

interface ReviewSectionProps {
  reviews: Review[];
  loading: boolean;
  userId: string | null;
  onRefresh: () => void;
}

export default function ReviewSection({ reviews, loading, userId, onRefresh }: ReviewSectionProps) {
  // State untuk Manajemen Modal Form Ulasan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Kalkulasi Breakdown Rating Komponen
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  const getBreakdownPercentage = (stars: number) => {
    if (!totalReviews) return "0%";
    const count = reviews.filter((r) => r.rating === stars).length;
    return `${((count / totalReviews) * 100).toFixed(0)}%`;
  };

  // Handler Kirim Ulasan
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return toast.error("Silakan login terlebih dahulu.");
    if (newComment.trim().length < 5) return toast.error("Ulasan minimal berisi 5 karakter.");

    try {
      setSubmitting(true);
      const { error } = await supabase.from("download_reviews").insert({
        user_id: userId,
        rating: newRating,
        comment: newComment.trim(),
      });

      if (error) {
        if (error.code === "23505") {
          throw new Error("Anda sudah pernah memberikan ulasan sebelumnya.");
        }
        throw error;
      }

      toast.success("Ulasan Anda berhasil dikirim!");
      setNewComment("");
      setIsModalOpen(false);
      onRefresh(); // Memperbarui data komponen induk secara real-time
    } catch (err: any) {
      toast.error(err.message || "Gagal mengirim ulasan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg glass-panel p-7 sm:p-8 rounded-3xl shadow-xl shadow-slate-900/5 border border-white/20 dark:border-white/10 mt-6 text-left">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Rating & Ulasan</h3>
        
        {/* KONDISIONAL FORM ULASAN / INSTRUKSI LOGIN */}
        {userId ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="glass-capsule flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <FiMessageSquare size={14} /> Tulis Ulasan
          </button>
        ) : (
          <Link
            href="/login"
            className="glass-capsule flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 px-3.5 py-1.5 rounded-xl transition-all hover:scale-105"
          >
            <FiMessageSquare size={14} /> Masuk untuk Mengulas
          </Link>
        )}
      </div>

      {/* Ringkasan Perhitungan Bar Rating */}
      <div className="flex items-center gap-6 mb-8 p-4 rounded-2xl bg-slate-900/5 dark:bg-white/5 border border-white/20 dark:border-white/5">
        <div className="text-center">
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{averageRating}</h2>
          <div className="flex justify-center text-amber-400 my-1">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < Math.round(parseFloat(averageRating)) ? "fill-amber-400" : "text-slate-300 dark:text-slate-700"} size={14} />
            ))}
          </div>
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">{totalReviews} ulasan</p>
        </div>

        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3 text-xs">
              <span className="text-slate-500 dark:text-slate-400 w-2 font-bold">{stars}</span>
              <div className="flex-1 h-2 bg-slate-200/50 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500" 
                  style={{ width: getBreakdownPercentage(stars) }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daftar Komentar Ulasan */}
      <div className="space-y-5">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-6 animate-pulse">Memuat data ulasan pengguna...</p>
        ) : reviews.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6 font-medium">Belum ada ulasan untuk aplikasi ini. Jadilah yang pertama memberikan review!</p>
        ) : (
          reviews.map((review) => {
            const profile = Array.isArray(review.profiles) ? review.profiles[0] : review.profiles;
            const fallbackLetter = profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "?";
            
            return (
              <div key={review.id} className="border-t border-white/20 dark:border-white/5 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {/* CONTAINER FOTO PROFIL / AVATAR */}
                    <div className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold overflow-hidden shrink-0 border border-white/20">
                      {profile?.avatar_url ? (
                        <Image 
                          src={profile.avatar_url} 
                          alt={profile.full_name || "Avatar"} 
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        fallbackLetter
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {profile?.full_name || "Pengguna KaryaMandiri"}
                      </h4>
                      <div className="flex text-amber-400 gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={i < review.rating ? "fill-amber-400" : "text-slate-300 dark:text-slate-700"} 
                            size={10} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {new Date(review.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-11">
                  {review.comment}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* --- MODAL FORM INPUT ULASAN LIQUID GLASS --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md p-6 sm:p-7 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <FiX size={18} />
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 tracking-tight">Berikan Ulasan Anda</h3>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block mb-2 uppercase tracking-wider">Rating Bintang</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="text-amber-400 focus:outline-none transition transform hover:scale-110 cursor-pointer"
                    >
                      <FiStar className={star <= newRating ? "fill-amber-400" : "text-slate-300 dark:text-slate-700"} size={26} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block mb-1.5 uppercase tracking-wider">Ulasan Anda</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda menggunakan aplikasi KaryaMandiri..."
                  rows={4}
                  className="glass-input w-full text-xs sm:text-sm p-3.5 rounded-2xl text-slate-900 dark:text-white focus:outline-none resize-none leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs sm:text-sm font-bold transition shadow-lg shadow-blue-500/25 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Mengirim..." : "Kirim Ulasan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}