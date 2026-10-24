/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
          type: "service",
          title,
          category,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Terjadi kesalahan");

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
      <DialogContent className="sm:max-w-135 rounded-3xl p-6 sm:p-7 glass-panel border border-white/20 dark:border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
              <FiEdit size={18} />
            </span>
            Edit Penawaran Jasa
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 pt-1 text-xs sm:text-sm">
            Perbarui informasi tarif, deskripsi, atau kategori layanan keahlian Anda.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Nama / Judul Jasa
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1">
                <FiLayers size={13} /> Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none font-semibold cursor-pointer"
              >
                <option value="Web Development" className="bg-white dark:bg-slate-900">Web Development</option>
                <option value="Photography" className="bg-white dark:bg-slate-900">Photography</option>
                <option value="Videography & Editing" className="bg-white dark:bg-slate-900">Videography & Editing</option>
                <option value="Desain Grafis" className="bg-white dark:bg-slate-900">Desain Grafis</option>
                <option value="Logistik & UMKM" className="bg-white dark:bg-slate-900">Logistik & UMKM</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1">
                <FiDollarSign size={13} /> Tarif Jasa (Rp)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1">
              <FiFileText size={13} /> Deskripsi & Ruang Lingkup
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="glass-input w-full px-4 py-3 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none resize-none leading-relaxed"
            />

            <button
              type="button"
              onClick={handleEnhanceWithAI}
              disabled={isEnhancing || loading}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-violet-500/20 cursor-pointer"
            >
              <FiZap className={`${isEnhancing ? "animate-spin" : ""}`} size={14} />
              {isEnhancing ? "Menyempurnakan dengan AI..." : "Poles Deskripsi dengan AI"}
            </button>
          </div>

          <DialogFooter className="flex sm:justify-end gap-2.5 pt-4 border-t border-white/20 dark:border-white/5 mt-4">
            <button
              type="button"
              disabled={loading || isEnhancing}
              onClick={() => onOpenChange(false)}
              className="px-5 py-3 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/10 rounded-2xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || isEnhancing}
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              {loading ? <FiLoader className="animate-spin text-base" /> : "Simpan Perubahan"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}