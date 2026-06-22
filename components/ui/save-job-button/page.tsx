/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { FiBookmark } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import supabase from "@/lib/db";
import { IJobs } from "@/app/types/jobs";
import { toast } from "sonner";

export default function SaveJobButton({ id }: IJobs) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Cek status apakah pekerjaan ini sudah pernah disimpan saat halaman dimuat
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!id) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setUserId(null);
          setIsSaved(false);
          return;
        }

        setUserId(user.id);

        // Cari tahu apakah user ini sudah pernah menyimpan lowongan ini
        const { data, error } = await supabase
          .from("saved_jobs") // Menggunakan tabel relasi/pivot saved_jobs
          .select("id")
          .eq("user_id", user.id)
          .eq("job_id", id)
          .maybeSingle();

        if (error) throw error;
        
        setIsSaved(!!data); // Jika data ditemukan, set true. Jika null, set false.
      } catch (error) {
        console.error("Gagal memuat status simpanan lowongan:", error);
      } finally {
        setLoading(false);
      }      
    };

    checkSavedStatus();
  }, [id]);

  // Fungsi Toggle Simpan / Hapus Simpan
  const handleSaveToggle = async () => {
    if (!userId) {
      toast.error("Silakan login terlebih dahulu untuk menyimpan pekerjaan.");
      return;
    }
    
    setLoading(true);

    try {
      if (isSaved) {
        // Jika sudah tersimpan, maka batalkan (Hapus row dari saved_jobs)
        const { error } = await supabase
          .from("saved_jobs")
          .delete()
          .eq("user_id", userId)
          .eq("job_id", id);

        if (error) throw error;
        
        setIsSaved(false);
        toast.success("Pekerjaan dihapus dari simpanan.");
      } else {
        // Jika belum tersimpan, buat baris baru (Insert row ke saved_jobs)
        const { error } = await supabase
          .from("saved_jobs")
          .insert([
            { user_id: userId, job_id: id }
          ]);

        if (error) throw error;

        setIsSaved(true);
        toast.success("Pekerjaan berhasil disimpan.");
      }
    } catch (error: any) {
      console.error("Gagal memproses aksi bookmark:", error.message);
      toast.error("Terjadi kesalahan, silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSaveToggle}
      disabled={loading}
      className={`p-3 rounded-xl border transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed ${
        isSaved
          ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-400"
          : "bg-white border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
      title={isSaved ? "Hapus dari simpanan" : "Simpan pekerjaan"}
    >
      {isSaved ? (
        <FaBookmark className="text-xl scale-110 transition-transform" />
      ) : (
        <FiBookmark className="text-xl" />
      )}
    </button>
  );
}