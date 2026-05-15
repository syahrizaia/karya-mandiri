"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiPlus, FiLoader } from "react-icons/fi";
import supabase from "@/lib/db";
import { useRouter } from "next/navigation";

export default function CreateProject() {
  const [employerName, setEmployerName] = useState<string>("");

  useEffect(() => {
    const fetchEmployerName = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        setEmployerName(data.user.email);
      }
    };
    fetchEmployerName();
  }, []);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    const projectData = {
      id: crypto.randomUUID(),
      title: rawData.title,
      employer: employerName, // Hidden data
      description: rawData.description,
      requirements: rawData.requirements, // Disimpan sebagai string murni
      deadline: rawData.deadline || null,
      category: rawData.category,
      type: rawData.type,
      location: rawData.location,
      reward: Number(rawData.reward),
      taken: 0, // Hidden data awal
      total: Number(rawData.total),
      posted_at: new Date().toISOString(), // Hidden data
      status: "active", // Hidden data default
    };

    try {
      const { error } = await supabase.from("jobs").insert([projectData]);

      if (error) throw error;

      alert("Proyek berhasil dipublikasikan!");
      setOpen(false);
      router.refresh(); // Refresh data di dashboard
    } catch (error) {
      console.error("Error inserting project:", error);
      alert("Gagal membuat proyek. Periksa koneksi atau database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          <FiPlus /> Buat Proyek Baru
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl p-8 bg-white border-none shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-black text-slate-900">Publikasi Proyek Baru</DialogTitle>
          <p className="text-slate-500 text-sm italic">Employer: {employerName}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Baris 1: Judul */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400">Judul Proyek</label>
            <input
              name="title"
              required
              placeholder="Contoh: Pengumpulan Data Foto UMKM"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Baris 2: Deskripsi */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400">Deskripsi Tugas</label>
            <textarea
              name="description"
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition"
            ></textarea>
          </div>

          {/* Baris 3: Requirements */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400">Persyaratan (Gunakan baris baru untuk poin-poin)</label>
            <textarea
              name="requirements"
              placeholder="1. Memiliki HP Android&#10;2. Domisili Bekasi"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition"
            ></textarea>
          </div>

          {/* Baris 4: Lokasi & Kategori (Grid 2 Kolom) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Kategori</label>
              <select name="category" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white">
                <option value="Survey">Survey</option>
                <option value="Data Entry">Data Entry</option>
                <option value="Creative">Creative</option>
                <option value="Teknis">Teknis</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Lokasi</label>
              <input name="location" required placeholder="Contoh: Remote / Jakarta" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
            </div>
          </div>

          {/* Baris 5: Type & Reward */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Tipe Proyek</label>
              <select name="type" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white">
                <option value="Crowdsourcing">Crowdsourcing</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Upah (Rp)</label>
              <input name="reward" type="number" required placeholder="Contoh: 50000" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
            </div>
          </div>

          {/* Baris 6: Total Kuota & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Total Kuota Pekerja</label>
              <input name="total" type="number" required placeholder="Jumlah orang" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Deadline</label>
              <input name="deadline" type="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-blue-300"
            >
              {loading ? <FiLoader className="animate-spin" /> : "Publikasikan Proyek"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}