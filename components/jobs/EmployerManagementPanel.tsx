"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiAlertCircle, FiCalendar, FiMail, FiCheck, FiX } from "react-icons/fi";
import { IJobs } from "@/app/types/jobs";

export interface IApplicant {
  id: string;
  user_id: string;
  status: string;
  applied_at: string;
  notes?: string;
  profiles: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

interface EmployerManagementPanelProps {
  job: IJobs;
  applicants: IApplicant[];
  handleUpdateStatus: (applicationId: string, newStatus: "accepted" | "rejected") => Promise<void>;
}

const EmployerManagementPanel: React.FC<EmployerManagementPanelProps> = ({
  job,
  applicants,
  handleUpdateStatus,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full transition-colors">
      {/* Ringkasan Informasi Job */}
      <div className="glass-panel p-6 rounded-3xl h-fit lg:w-1/3 w-full space-y-4">
        <div>
          <span className="glass-capsule text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase px-3 py-1">
            Manajemen Proyek
          </span>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-3">
            Anggaran Alokasi: <span className="font-bold text-slate-800 dark:text-white">Rp{job.reward.toLocaleString('id-ID')} / orang</span>
          </p>
        </div>
        <div className="glass-card p-4 rounded-2xl text-xs text-slate-600 dark:text-slate-300 space-y-2">
          <div className="flex justify-between">
            <span>Total Kuota Dibutuhkan:</span>
            <span className="font-black text-slate-900 dark:text-white">{job.total} Orang</span>
          </div>
          <div className="flex justify-between">
            <span>Telah Diterima:</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400">{job.taken || 0} Orang</span>
          </div>
        </div>
      </div>

      {/* Daftar Pelamar / Workers */}
      <div className="glass-panel rounded-3xl overflow-hidden w-full lg:w-2/3">
        <div className="p-6 border-b border-slate-200/50 dark:border-white/10">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Daftar Pelamar ({applicants.length})</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Kelola para kontributor crowdsourcing yang mengajukan diri pada proyek ini.</p>
        </div>

        {applicants.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-4 glass-capsule text-slate-400 rounded-2xl">
              <FiAlertCircle size={28} />
            </div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum Ada Pelamar</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">Proyek ini baru dipublikasikan atau belum mendapatkan pelamar dari Mitra Mandiri.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/40 dark:divide-white/5">
            {applicants.map((applicant) => (
              <div key={applicant.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/40 dark:hover:bg-white/5 transition duration-200">
                <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                  <div className="flex gap-3 items-center">
                    <Link href={`/profile/${applicant.user_id}`} className="glass-capsule p-1 rounded-2xl shrink-0">
                      <Image
                        src={applicant.profiles?.avatar_url || "https://api.dicebear.com/7.x/initials/svg?seed=Worker"}
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="rounded-xl object-cover w-11 h-11"
                      />
                    </Link>
                    <div className="space-y-0.5">
                      <Link href={`/profile/${applicant.user_id}`} className="font-bold text-slate-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {applicant.profiles?.full_name || "Mitra Anonim"}
                      </Link>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <FiMail className="shrink-0" /> {applicant.profiles?.email || "-"}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiCalendar className="shrink-0" /> {new Date(applicant.applied_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {applicant.notes && (
                    <div className="mt-2 p-3 glass-card rounded-xl text-xs text-slate-600 dark:text-slate-300 italic w-full">
                      &ldquo;{applicant.notes}&rdquo;
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {applicant.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(applicant.id, "accepted")}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
                      >
                        <FiCheck /> Terima
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(applicant.id, "rejected")}
                        className="px-3.5 py-2 bg-rose-600/80 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        <FiX /> Tolak
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${
                      applicant.status === "accepted" 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                    }`}>
                      {applicant.status === "accepted" ? "Diterima" : "Ditolak"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerManagementPanel;