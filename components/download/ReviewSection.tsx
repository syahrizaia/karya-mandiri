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
    <div className="w-full max-w-lg bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 mt-6 text-left">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">Rating & Ulasan</h3>
        
        {/* KONDISIONAL FORM ULASAN / INSTRUKSI LOGIN */}
        {userId ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FiMessageSquare /> Tulis Ulasan
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-xl transition-all"
          >
            <FiMessageSquare /> Login untuk memberikan ulasan
          </Link>
        )}
      </div>

      {/* Ringkasan Perhitungan Bar Rating */}
      <div className="flex items-center gap-6 mb-8">
        <div className="text-center">
          <h2 className="text-5xl font-black text-slate-900 dark:text-white">{averageRating}</h2>
          <div className="flex justify-center text-amber-500 my-1">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < Math.round(parseFloat(averageRating)) ? "fill-amber-500" : "text-slate-200 dark:text-slate-800"} size={14} />
            ))}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">{totalReviews} total</p>
        </div>

        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3 text-xs">
              <span className="text-slate-500 dark:text-slate-400 w-2 font-medium">{stars}</span>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                  style={{ width: getBreakdownPercentage(stars) }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daftar Komentar Ulasan */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-4">Memuat ulasan...</p>
        ) : reviews.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">Belum ada ulasan untuk aplikasi ini.</p>
        ) : (
          reviews.map((review) => {
            const profile = Array.isArray(review.profiles) ? review.profiles[0] : review.profiles;
            const fallbackLetter = profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "?";
            
            return (
              <div key={review.id} className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {/* CONTAINER FOTO PROFIL / AVATAR */}
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
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
                      <div className="flex text-amber-500 gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={i < review.rating ? "fill-amber-500" : "text-slate-200 dark:text-slate-800"} 
                            size={10} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {new Date(review.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* --- MODAL FORM INPUT ULASAN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <FiX size={18} />
            </button>

            <h3 className="text-base font-black text-slate-900 dark:text-white mb-4">Berikan Ulasan Anda</h3>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-2 font-medium">Rating Bintang</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="text-amber-500 focus:outline-none transition transform hover:scale-110"
                    >
                      <FiStar className={star <= newRating ? "fill-amber-500" : "text-slate-300 dark:text-slate-700"} size={24} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">Ulasan Anda</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda menggunakan aplikasi ini..."
                  rows={4}
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50"
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