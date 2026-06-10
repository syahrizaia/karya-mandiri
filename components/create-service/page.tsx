/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { FiLoader, FiPlusCircle, FiFileText, FiLayers, FiDollarSign, FiZap } from "react-icons/fi";
import supabase from "@/lib/db";
import { toast } from "sonner";

interface PostServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; // Callback untuk me-refresh data di halaman utama setelah sukses
}

export default function PostServiceDialog({ open, onOpenChange, onSuccess }: PostServiceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  // State Form Input
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Web Development");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Dapatkan info user aktif dari session
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (!user) {
        toast.error("Anda harus login terlebih dahulu untuk menawarkan jasa!");
        onOpenChange(false);
        return;
      }

      // Insert data ke tabel 'services'
      const { error: insertError } = await supabase
        .from("services")
        .insert([
          {
            title,
            description,
            price: Number(price),
            category,
            user_id: user.id, // Mengikat ke ID pekerja yang login
          },
        ]);

      if (insertError) throw insertError;

      toast.success("Penawaran jasa Anda berhasil dipublikasikan!");
      
      // Reset form & pemicu refresh data eksternal jika ada
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("Web Development");
      
      if (onSuccess) onSuccess();
      window.location.reload();
      onOpenChange(false); // Tutup dialog modal
    } catch (err: any) {
      console.error("Error posting service:", err);
      toast.error(err.message || "Gagal memposting jasa. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceWithAI = async () => {
    if (!description.trim()) {
      toast.error("Tulis draf singkat mengenai deskripsi jasa Anda terlebih dahulu!");
      return;
    }

    try {
      setIsEnhancing(true);
      
      const response = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: description,
          type: "service",      // Menandakan jenis prompt untuk halaman penawaran jasa
          title: title,         // Konteks judul (biar AI paham detail pekerjaannya)
          category: category,   // Konteks kategori (biar AI menyesuaikan gaya bahasanya)
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Terjadi kesalahan");

      // Menghapus sintaks markdown tebal/miring dari output AI
      const cleanText = data.enhancedText.replace(/[#*`_~]/g, "").trim();
      
      setDescription(cleanText);
      toast.success("Deskripsi jasa berhasil diperhebat oleh AI KaryaMandiri!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal menggunakan fitur AI.");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-137.5 rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FiPlusCircle className="text-blue-600" /> 
            Tawarkan Jasa Baru
          </DialogTitle>
          <DialogDescription className="text-slate-500 pt-1">
            Isi detail keahlian dan tarif untuk menarik perhatian calon klien di KaryaMandiri.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Input Judul */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Judul Penawaran Jasa</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Jasa Foto Produk Umkm & Editing Kilat"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Input Kategori */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <FiLayers /> Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-blue-500 font-medium text-slate-700 transition-colors"
              >
                <option value="Web Development">Web Development</option>
                <option value="Photography">Photography</option>
                <option value="Videography & Editing">Videography & Editing</option>
                <option value="Desain Grafis">Desain Grafis</option>
                <option value="Logistik & UMKM">Logistik & UMKM</option>
              </select>
            </div>

            {/* Input Harga */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <FiDollarSign /> Tarif Mulai Dari (Rp)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Harga dalam angka (ex: 250000)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Input Deskripsi */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <FiFileText /> Deskripsi Keahlian & Ketentuan Kerja
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan secara rinci apa saja yang akan didapatkan klien, spesifikasi perangkat yang dipakai, benefit, hingga batas jumlah revisi..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none transition-colors"
            />

            {/* TOMBOL PANDUAN AI UNTUK DESKRIPSI JASA */}
            <button
              type="button"
              onClick={handleEnhanceWithAI}
              disabled={isEnhancing || loading}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 rounded-xl transition-all duration-200 shadow-sm"
            >
              <FiZap className={`${isEnhancing ? "animate-spin" : ""}`} size={14} />
              {isEnhancing ? "Sedang Merancang Deskripsi..." : "Poles Deskripsi Jasa"}
            </button>
          </div>

          {/* Tombol Aksi */}
          <DialogFooter className="flex sm:justify-end gap-2 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              disabled={loading || isEnhancing}
              onClick={() => onOpenChange(false)}
              className="px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || isEnhancing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition shadow-md"
            >
              {loading ? (
                <FiLoader className="animate-spin text-lg" />
              ) : (
                "Buka Penawaran Jasa"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}