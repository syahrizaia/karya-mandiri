"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiAlertCircle, FiCalendar, FiMail } from "react-icons/fi";
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
    <div className="flex flex-col lg:flex-row gap-4 w-full transition-colors">
      {/* Ringkasan Informasi Job */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800/80 h-fit lg:w-1/3 w-full">
        <div className="flex flex-col justify-between items-start gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md">
              Detail Proyek
            </span>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 pt-2">
              Anggaran: <span className="font-semibold text-gray-700 dark:text-slate-300">Rp{job.reward.toLocaleString()} / orang</span>
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800/40 px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800/60 text-sm text-gray-600 dark:text-slate-300 space-y-1 w-full">
            <p>Total Kuota: <span className="font-bold text-gray-800 dark:text-slate-200">{job.total} Orang</span></p>
            <p>Telah Diambil: <span className="font-bold text-green-600 dark:text-green-400">{job.taken || 0} Orang</span></p>
          </div>
        </div>
      </div>

      {/* Daftar Pelamar / Workers */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800/80 overflow-hidden w-full lg:w-2/3">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Daftar Pelamar ({applicants.length})</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">Kelola para kontributor crowdsourcing yang mengajukan diri pada proyek ini.</p>
        </div>

        {applicants.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 rounded-full">
              <FiAlertCircle size={32} />
            </div>
            <h3 className="text-md font-bold text-slate-700 dark:text-slate-300">Belum Ada Pelamar</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">Proyek ini baru dipublikasikan atau belum mendapatkan pelamar dari Pekerja saat ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {applicants.map((applicant) => (
              <div key={applicant.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition">
                <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                  <div className="flex gap-2">
                    <Link href={`/profile/${applicant.user_id}`} className="bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 p-1 rounded-2xl w-fit h-fit shrink-0">
                      <Image
                        src={applicant.profiles?.avatar_url || "https://api.dicebear.com/7.x/initials/svg?seed=Worker"}
                        alt="Avatar"
                        width={60}
                        height={60}
                        className="rounded-xl object-cover w-10 h-10 sm:w-12 sm:h-12"
                      />
                    </Link>
                    <div className="space-y-1">
                      <Link href={`/profile/${applicant.user_id}`} className="font-semibold text-gray-800 dark:text-slate-100 text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {applicant.profiles?.full_name || "Worker Anonim"}
                      </Link>
                      <div className="flex flex-col items-start gap-y-1 text-sm text-gray-500 dark:text-slate-400">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3+">
                          <span className="flex items-center gap-1">
                            <FiMail className="shrink-0" /> {applicant.profiles?.email || "-"}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar className="shrink-0" /> {new Date(applicant.applied_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {applicant.notes && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-800 text-sm text-gray-600 dark:text-slate-300 italic w-full">
                      <span className="block text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase not-italic mb-1">Catatan Pelamar:</span>
                      &quot;{applicant.notes}&quot;
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {applicant.status === "pending" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(applicant.id, "rejected")}
                        className="px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium text-sm rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-95 transition cursor-pointer"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(applicant.id, "accepted")}
                        className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white font-medium text-sm rounded-xl hover:bg-green-700 dark:hover:bg-green-600 active:scale-95 shadow-sm shadow-green-600/10 transition cursor-pointer"
                      >
                        Terima
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        applicant.status === "accepted" 
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" 
                          : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                      }`}>
                        {applicant.status === "accepted" ? "Diterima" : "Ditolak"}
                      </span>
                      {applicant.status === "accepted" && (
                        <button
                          onClick={() => handleUpdateStatus(applicant.id, "rejected")}
                          className="text-xs text-red-500 dark:text-red-400 hover:underline font-medium cursor-pointer"
                        >
                          Batalkan & Tolak
                        </button>
                      )}
                    </div>
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