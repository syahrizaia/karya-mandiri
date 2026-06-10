/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { FiLoader, FiEdit, FiFileText, FiLayers, FiDollarSign, FiZap } from "react-icons/fi";
import supabase from "@/lib/db";
import { toast } from "sonner";

interface IService {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
}

interface EditServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: IService | null;
  onSuccess: () => void;
}

export default function EditServiceDialog({ open, onOpenChange, service, onSuccess }: EditServiceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Web Development");

  // Sinkronisasi data form ketika modal dibuka membawa data service terpilih
  useEffect(() => {
    if (service) {
      setTitle(service.title);
      setDescription(service.description);
      setPrice(service.price.toString());
      setCategory(service.category);
    }
  }, [service, open]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("services")
        .update({
          title,
          description,
          price: Number(price),
          category,
          created_at: service.created_at,
        })
        .eq("id", service.id);

      if (error) throw error;

      toast.success("Jasa berhasil diperbarui!");
      onSuccess();
      window.location.reload();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui data jasa.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceWithAI = async () => {
    if (!description.trim()) {
      toast.error("Tulis draf deskripsi jasamu terlebih dahulu sebelum ditingkatkan!");
      return;
    }

    try {
      setIsEnhancing(true);
      
      const response = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: description,
          type: "service",      // Menggunakan prompt khusus penawaran jasa
          title: title,         // Mengirim konteks judul saat ini
          category: category,   // Mengirim konteks kategori saat ini
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Terjadi kesalahan");

      // Menghapus sintaks markdown bawaan AI agar teks bersih
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
            <FiEdit className="text-blue-600" /> Edit Penawaran Jasa
          </DialogTitle>
          <DialogDescription className="text-slate-500 pt-1">
            Ubah informasi tarif, deskripsi, atau kategori layanan jasamu.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4 mt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Nama / Judul Jasa</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <FiDollarSign /> Tarif (Rp)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <FiFileText /> Deskripsi & Ruang Lingkup
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none transition-colors"
            />

            {/* TOMBOL PANDUAN AI UNTUK EDIT DESKRIPSI JASA */}
            <button
              type="button"
              onClick={handleEnhanceWithAI}
              disabled={isEnhancing || loading}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 rounded-xl transition-all duration-200 shadow-sm"
            >
              <FiZap className={`${isEnhancing ? "animate-spin" : ""}`} size={14} />
              {isEnhancing ? "Sedang Menyusun Ulang..." : "Poles Deskripsi Jasa"}
            </button>
          </div>

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
              {loading ? <FiLoader className="animate-spin text-lg" /> : "Simpan Perubahan"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}