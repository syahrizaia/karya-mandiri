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

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Cek apakah kuota pekerjaan masih tersedia (khusus Crowdsourcing)
      if (job.type === "Crowdsourcing" && (job.taken ?? 0) >= (job.total ?? 0)) {
        toast.error("Maaf, kuota pekerja untuk tugas ini sudah penuh!");
        onOpenChange(false);
        return;
      }

      const newApplication = {
        applied_at: new Date().toISOString(),
        status: job.type === "Crowdsourcing" ? "approved" : "pending",
        worker_notes: notes || "Tanpa catatan tambahan",
      };

      // Ambil riwayat aplikasi lama (jika belum ada, buat array kosong)
      // Catatan: Pastikan interface IJobs kamu sudah mengenali properti 'applications'
      const existingApplications = (job as any).applications || [];
      const updatedApplications = [...existingApplications, newApplication];

      // 2. Simulasi/Simpan data lamaran ke tabel database (misal: 'applications' atau 'job_applications')
      // Catatan: Sesuaikan nama tabel dan kolom dengan skema database Supabase-mu
      const { data: updatedJob, error: updateError } = await supabase
        .from("jobs")
        .update({
          taken: job.type === "Crowdsourcing" ? (job.taken ?? 0) + 1 : job.taken, 
          applications: updatedApplications // Menyimpan riwayat lamaran dalam bentuk JSON Array
        })
        .eq("id", job.id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast.success(
        job.type === "Crowdsourcing"
          ? "Tugas berhasil diambil!"
          : "Lamaran berhasil dikirim! Menunggu tinjauan."
      );

      // Pemicu reaktivitas halaman agar jumlah kuota (taken) langsung berubah di UI dashboard utama
      if (onSuccess && updatedJob) onSuccess();
      onOpenChange(false);
      setNotes(""); // Reset form input

      // // 3. Jika tipenya Crowdsourcing, update jumlah 'taken' di tabel 'jobs'
      // if (job.type === "Crowdsourcing") {
      //   const { data: updatedJob, error: updateError } = await supabase
      //     .from("jobs")
      //     .update({ taken: (job.taken ?? 0) + 1 })
      //     .eq("id", job.id)
      //     .select() // Ambil baris data yang baru saja diperbarui
      //     .single();

      //   if (updateError) throw updateError;

      //   // Berikan info feedback data terbaru ke komponen induk jika fungsi onSuccess tersedia
      //   if (onSuccess && updatedJob) {
      //     onSuccess(); 
      //   }
      // }

      // toast.success(
      //   job.type === "Crowdsourcing"
      //     ? "Tugas berhasil diambil! Silakan cek halaman Riwayat."
      //     : "Lamaran berhasil dikirim! Menunggu tinjauan pemberi kerja."
      // );

      // if (onSuccess) onSuccess();
      // onOpenChange(false);
    } catch (err: any) {
      console.error("🔴 DETAIL ERROR 1 TABEL:", JSON.stringify(err, null, 2));
      console.error("💬 PESAN ERROR:", err?.message || err);
      toast.error(err?.message || "Gagal memproses permohonan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FiCheckCircle className="text-blue-600" /> 
            {job.type === "Crowdsourcing" ? "Ambil Tugas Ini?" : "Lamar Pekerjaan"}
          </DialogTitle>
          <DialogDescription className="text-slate-500 pt-1">
            {job.type === "Crowdsourcing"
              ? "Kamu akan langsung terdaftar sebagai pekerja untuk tugas crowdsourcing ini."
              : "Kirimkan profil dan catatan singkatmu kepada pemberi kerja untuk ditinjau."}
          </DialogDescription>
        </DialogHeader>

        {/* Ringkasan Singkat Pekerjaan */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 my-2 space-y-2 text-sm text-slate-700">
          <div className="font-bold text-base text-slate-800 line-clamp-1">{job.title}</div>
          <div className="flex items-center gap-1 text-slate-500 font-medium">{job.employer_name || "KaryaMandiri Partner"}</div>
          <div className="flex justify-between pt-2 border-t border-slate-200/60 font-semibold">
            <span className="text-slate-500">Estimasi Upah:</span>
            <span className="text-green-600">Rp{(job.reward ?? 0).toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Form Input Catatan Tambahan */}
        <form onSubmit={handleApply} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <FiFileText /> Pesan / Catatan Tambahan (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                job.type === "Crowdsourcing"
                  ? "Contoh: Saya siap menyelesaikan tugas ini tepat waktu..."
                  : "Tuliskan keahlian singkat atau sapaan untuk pemberi kerja..."
              }
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none transition-colors"
            />
          </div>

          <DialogFooter className="flex sm:justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => onOpenChange(false)}
              className="px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 text-sm font-bold text-white rounded-2xl flex items-center justify-center gap-2 transition ${
                job.type === "Crowdsourcing" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
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