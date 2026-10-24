/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FiLoader, FiCheckCircle, FiFileText } from "react-icons/fi";
import supabase from "@/lib/db";
import { IJobs } from "@/app/types/jobs";
import { toast } from "sonner";

interface ApplyJobDialogProps {
  job: IJobs;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function ApplyJobDialog({ job, open, onOpenChange, onSuccess }: ApplyJobDialogProps) {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const employerName = (job as any).profiles?.full_name || job.employer_name || "Pengguna KaryaMandiri";

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (job.type === "Crowdsourcing" && (job.taken ?? 0) >= (job.total ?? 0)) {
        toast.error("Maaf, kuota pekerja untuk tugas ini sudah penuh!");
        onOpenChange(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Anda harus login terlebih dahulu.");
        return;
      }

      const { data: updatedJob, error: updateError } = await supabase
        .from("applications")
        .insert([
          {
            job_id: job.id,
            user_id: user.id,
            status: job.type === "Crowdsourcing" ? "approved" : "pending",
            notes: notes || "Tanpa catatan tambahan",
          }
        ])
        .select()
        .single();

      if (updateError) {
        if (updateError.code === '23505') {
          throw new Error("Anda sudah melamar pekerjaan ini sebelumnya.");
        }
        throw updateError;
      }

      if (job.type === "Crowdsourcing") {
        const currentTaken = Number(job.taken) || 0;
        const { error: jobError } = await supabase
          .from('jobs')
          .update({ 
            taken: currentTaken + 1
          })
          .eq('id', job.id);

        if (jobError) throw jobError;
      }

      toast.success(
        job.type === "Crowdsourcing"
          ? "Tugas berhasil diambil!"
          : "Lamaran berhasil dikirim! Menunggu tinjauan."
      );

      if (onSuccess && updatedJob) {
        onSuccess();
      }
      
      onOpenChange(false);
      setNotes("");

    } catch (err: any) {
      console.error("DETAIL ERROR:", JSON.stringify(err, null, 2));
      toast.error(err?.message || "Gagal memproses permohonan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 glass-panel rounded-3xl p-6 sm:p-7 border border-white/20 dark:border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
              <FiCheckCircle size={20} />
            </span>
            {job.type === "Crowdsourcing" ? "Ambil Tugas Ini?" : "Lamar Pekerjaan"}
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 pt-1 text-xs sm:text-sm">
            {job.type === "Crowdsourcing"
              ? "Anda akan langsung terdaftar sebagai pekerja untuk tugas crowdsourcing ini."
              : "Kirimkan profil dan catatan singkat Anda kepada pemberi kerja untuk ditinjau."}
          </DialogDescription>
        </DialogHeader>

        {/* Ringkasan Singkat Pekerjaan Glass Card */}
        <div className="glass-card p-4.5 rounded-2xl my-2 space-y-2 text-sm border border-white/20 dark:border-white/10">
          <div className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">{job.title}</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">{employerName}</div>
          <div className="flex justify-between items-center pt-2.5 border-t border-white/20 dark:border-white/5 font-semibold text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400">Estimasi Imbalan:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black text-base">
              Rp{(job.reward ?? 0).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Form Input Catatan Tambahan */}
        <form onSubmit={handleApply} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
              <FiFileText size={14} /> Pesan / Catatan Pengantar (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                job.type === "Crowdsourcing"
                  ? "Contoh: Saya siap menyelesaikan tugas ini tepat waktu dan sesuai instruksi..."
                  : "Tuliskan ringkasan keahlian relevan atau portofolio untuk pemberi kerja..."
              }
              rows={3}
              className="glass-input w-full px-4 py-3 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>

          <DialogFooter className="flex sm:justify-end gap-2.5 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => onOpenChange(false)}
              className="px-5 py-3 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/10 rounded-2xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 text-xs sm:text-sm font-bold text-white rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                job.type === "Crowdsourcing" 
                  ? "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20" 
                  : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20"
              }`}
            >
              {loading ? (
                <FiLoader className="animate-spin text-lg" />
              ) : job.type === "Crowdsourcing" ? (
                "Konfirmasi Ambil Tugas"
              ) : (
                "Kirim Lamaran"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}