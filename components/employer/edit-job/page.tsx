/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IJobs } from "@/app/types/jobs";
import supabase from "@/lib/db";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiEdit2, FiLoader } from "react-icons/fi";
import { Star } from "lucide-react";

interface EditProjectDialogProps {
  job: IJobs;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditProjectDialog = ({ job, open, onOpenChange, onSuccess }: EditProjectDialogProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [, setJobs] = useState<IJobs[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [, setSelectedJob] = useState<{ job: IJobs; action: "edit" | "delete" } | null>(null);
  const [brief, setBrief] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .order("posted_at", { ascending: false });
        if (error) {
          console.error("Error fetching jobs:", error);
        } else {
          setJobs(data || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const getActiveUser = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const name = user.user_metadata?.full_name || user.email || "Pengguna";
          setUserName(name);
        }
      } catch (err) {
        console.error("Gagal memuat info user:", err);
      } finally {
        setLoading(false);
      }
    };
    getActiveUser();
  }, []);

  useEffect(() => {
    if (open && job?.description) {
      setBrief(job.description);
    }
  }, [open, job]);

  const EditProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      return;
    }

    const projectData = {
      id: job.id,
      title: rawData.title,
      employer: user.user_metadata?.full_name || "Pengguna KaryaMandiri",
      description: rawData.description,
      requirements: rawData.requirements,
      deadline: rawData.deadline || null,
      category: rawData.category,
      type: rawData.type,
      location: rawData.location,
      reward: Number(rawData.reward),
      taken: job.taken,
      total: Number(rawData.total),
      posted_at: job.posted_at,
      status: rawData.status,
    };

    try {
      const { error } = await supabase
        .from("jobs")
        .update(projectData)
        .eq("id", job.id);

      if (error) {
        throw error;
      } else {
        setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, ...projectData } as IJobs : j)));
        toast.success("Proyek berhasil diedit!");
        setSelectedJob(null);
        onSuccess();
        router.refresh();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Gagal mengedit proyek. Periksa koneksi atau database.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceWithAI = async () => {
    if (!brief.trim()) {
      toast.error("Tulis draf singkat proyek Anda terlebih dahulu sebelum ditingkatkan!");
      return;
    }

    try {
      setIsEnhancing(true);
      const response = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: brief,
          type: "brief",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Terjadi kesalahan");

      const cleanText = data.enhancedText.replace(/[#*`_~]/g, "").trim();
      setBrief(cleanText);
      toast.success("Deskripsi proyek berhasil diperhebat oleh AI KaryaMandiri!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal menggunakan fitur AI.");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-200 dark:shadow-none"
          onClick={() => setSelectedJob({ job, action: "edit" })}
        >
          <FiEdit2 />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto rounded-3xl p-8 bg-white dark:bg-slate-900 border-none shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-black text-slate-900 dark:text-slate-50">Edit Proyek</DialogTitle>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">
            Employer: {loading ? <FiLoader className="animate-spin inline text-blue-600" /> : userName}
          </p>
          <DialogDescription className="mt-4 text-slate-600 dark:text-slate-400">
            Apakah Anda yakin ingin mengedit proyek <strong>{job.title}</strong>?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={EditProject} className="space-y-6">
          {/* Baris 1: Judul */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Judul Proyek</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: Pengumpulan Data Foto UMKM"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              defaultValue={job.title}
            />
          </div>

          {/* Baris 2: Deskripsi */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Deskripsi Tugas</label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Tuliskan detail pekerjaan yang Anda butuhkan. Anda bisa menulis draf kasarnya, lalu gunakan tombol AI di bawah untuk menyempurnakannya secara instan.
            </p>
            <textarea
              name="description"
              required
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:border-blue-500 outline-none transition"
              placeholder={job.description}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            ></textarea>
          </div>

          <button
            type="button"
            onClick={handleEnhanceWithAI}
            disabled={isEnhancing}
            className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 rounded-xl transition-all duration-200 shadow-sm shadow-indigo-100"
          >
            <Star className={`${isEnhancing ? "animate-spin" : ""}`} size={16} />
            {isEnhancing ? "Sedang Menyempurnakan..." : "Perjelas & Rapikan dengan AI"}
          </button>

          {/* Baris 3: Requirements */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Persyaratan</label>
            <textarea
              name="requirements"
              placeholder="1. Memiliki HP Android&#10;2. Domisili Bekasi"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:border-blue-500 outline-none transition"
              defaultValue={job.requirements}
            ></textarea>
          </div>

          {/* Baris 4: Lokasi & Kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Kategori</label>
              <select
                name="category"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 outline-none"
                defaultValue={job.category}
              >
                <option value="Produksi">Produksi</option>
                <option value="Logistik">Logistik</option>
                <option value="Jasa">Jasa</option>
                <option value="Konstruksi">Konstruksi</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Lokasi</label>
              <input
                type="text"
                name="location"
                required
                placeholder="Contoh: Remote / Jakarta"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 outline-none"
                defaultValue={job.location}
              />
            </div>
          </div>

          {/* Baris 5: Type & Reward */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Tipe Proyek</label>
              <select
                name="type"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 outline-none"
                defaultValue={job.type}
              >
                <option value="Crowdsourcing">Crowdsourcing</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Upah (Rp)</label>
              <input
                name="reward"
                type="number"
                required
                placeholder="Contoh: 50000"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 outline-none"
                defaultValue={job.reward}
              />
            </div>
          </div>

          {/* Baris 6: Total Kuota & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Total Kuota Pekerja</label>
              <input
                name="total"
                type="number"
                required
                placeholder="Jumlah orang"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 outline-none"
                defaultValue={job.total}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Status Pekerjaan</label>
              <select
                name="status"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 outline-none font-medium"
                defaultValue={job.status || "active"}
              >
                <option value="active">ACTIVE (Berjalan)</option>
                <option value="pending">PENDING (Ditunda)</option>
                <option value="completed">COMPLETED (Selesai)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Batas Akhir (Deadline)</label>
              <input
                name="deadline"
                type="datetime-local"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:border-blue-500 outline-none"
                defaultValue={job.deadline}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isEnhancing}
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition flex items-center gap-2 disabled:bg-green-300 dark:disabled:bg-green-900"
            >
              {loading ? <FiLoader className="animate-spin" /> : "Edit Proyek"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;