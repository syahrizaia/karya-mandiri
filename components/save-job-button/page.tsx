"use client";

import { useState, useEffect } from "react";
import { FiBookmark } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import supabase from "@/lib/db";
import { IJobs } from "@/app/types/jobs";

export default function SaveJobButton({ id, is_saved = false }: IJobs) {
  const [isSaved, setIsSaved] = useState(is_saved);
  const [loading, setLoading] = useState(false);

  // 1. Cek status apakah pekerjaan ini sudah pernah disimpan saat halaman dimuat
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!id) return;
      
    //   const { data } = await supabase
    //     .from("jobs")
    //     .select("id")
    //     .eq("id", id)
    //     .single();

    //   if (data) setIsSaved(true);
    };

    checkSavedStatus();
  }, [id]);

  // 2. Fungsi Toggle Simpan / Hapus Simpan
  const handleSaveToggle = async () => {
    setLoading(true);

    if (isSaved) {
      // Jika sudah tersimpan, maka batalkan (Delete)
      const { error } = await supabase
        .from("jobs")
        .update({ is_saved: false }) // Atau bisa juga .delete() jika ingin benar-benar menghapus
        .eq("id", id);

      if (!error) setIsSaved(false);
      else console.error("Gagal menghapus bookmark:", error);
    } else {
      // Jika belum tersimpan, maka simpan (Insert)
      const { error } = await supabase
        .from("jobs")
        .update({ is_saved: true })
        .eq("id", id);

      if (!error) setIsSaved(true);
      else console.error("Gagal menyimpan pekerjaan:", error);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleSaveToggle}
      disabled={loading}
      className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
        isSaved
          ? "bg-blue-50 border-blue-200 text-blue-600"
          : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
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