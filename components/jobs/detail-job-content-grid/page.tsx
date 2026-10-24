/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiClock, FiShield } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { id } from "date-fns/locale/id";
import { IJobs } from "@/app/types/jobs";
import SaveJobButton from "@/components/ui/save-job-button/page";

interface JobContentGridProps {
  job: IJobs;
  userId: string | null;
  userRole: string | null;
  isSavedByUser: boolean;
  isAppliedByUser: boolean;
  setSelectedApplyJob: (job: IJobs | null) => void;
}

const JobContentGrid: React.FC<JobContentGridProps> = ({
  job,
  userId,
  userRole,
  isSavedByUser,
  isAppliedByUser,
  setSelectedApplyJob,
}) => {
  const progressPercentage = (job.taken / job.total) * 100;

  // Ambil data profile relasi langsung ke variabel helper
  const profileData = (job as any).profiles;
  const employerName = profileData?.full_name || 'Pengguna KaryaMandiri';
  const avatarUrl = profileData?.avatar_url;

  const formatDescription = (text: string) => {
    if (!text) return null;

    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();

      if (/^[A-Z\s()\-–]{5,}$/.test(trimmedLine)) {
        return (
          <h4 key={index} className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider mt-6 mb-2 first:mt-0">
            {trimmedLine}
          </h4>
        );
      }

      if (/^\d+\.\s/.test(trimmedLine)) {
        return (
          <p key={index} className="font-bold text-slate-800 dark:text-slate-200 mt-3 mb-1 pl-1 text-sm">
            {trimmedLine}
          </p>
        );
      }

      if (trimmedLine.startsWith('-')) {
        return (
          <span key={index} className="block text-slate-600 dark:text-slate-300 pl-4 py-0.5 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500 dark:before:text-blue-400 text-sm">
            {trimmedLine.substring(1).trim()}
          </span>
        );
      }

      return trimmedLine === "" ? (
        <span key={index} className="block h-2" />
      ) : (
        <p key={index} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-2 text-sm">
          {trimmedLine}
        </p>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Kolom Kiri: Detail Utama */}
      <div className="lg:col-span-2 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 sm:p-8"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
              job.type === 'Crowdsourcing' 
                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' 
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
            }`}>
              {job.type}
            </span>
            <span className="glass-capsule text-blue-600 dark:text-blue-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              {job.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
            {job.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 sm:gap-6 text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-8 pb-6 border-b border-slate-200/50 dark:border-white/10">
            <Link href={`/profile/${job.user_id}`} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-bold transition">
              {avatarUrl ? (
                <Image
                  src={avatarUrl} 
                  alt={employerName} 
                  className="w-7 h-7 rounded-xl object-cover border border-white/20 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  width={50}
                  height={50}
                />
              ) : (
                <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center text-xs font-bold shrink-0 uppercase">
                  {employerName.charAt(0)}
                </div>
              )}
              <span>{employerName}</span>
            </Link>
            <div className="flex items-center gap-1.5">
              <FiMapPin className="text-red-500"/> {job.location}
            </div>
            <div className="flex items-center gap-1.5">
              <FiClock /> {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true, locale: id })}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-3">Deskripsi Pekerjaan</h3>
              <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{formatDescription(job.description)}</div>
            </div>
            
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-3">Persyaratan & Kualifikasi</h3>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-2 text-sm">
                {(typeof job.requirements === 'string' 
                  ? (job.requirements as string).split('\n') 
                  : job.requirements
                ).map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Kolom Kanan: Widget Aksi Liquid Glass */}
      <aside className="space-y-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-7 sticky top-20">
          <div className="mb-6">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Upah Tugas</p>
            <div className="flex items-baseline gap-1">
              {typeof job.reward === 'number' ? (
                <span className="text-3xl sm:text-4xl font-black text-green-600 dark:text-green-400">
                  Rp{job.reward.toLocaleString('id-ID')}
                </span>
              ) : (
                <span className="text-3xl font-black text-slate-400">Rp0</span>
              )}
            </div>
          </div>

          {job.type === 'Crowdsourcing' && (
            <div className="mb-6 p-4 glass-card rounded-2xl">
              <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tight">
                <span className="text-slate-500 dark:text-slate-400">Kuota Terisi</span>
                <span className="text-blue-600 dark:text-blue-400">{job.taken} / {job.total} Pekerja</span>
              </div>
              <div className="w-full bg-slate-200/50 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-1000 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 italic">
                *Tugas akan dimulai serentak setelah kuota terpenuhi.
              </p>
            </div>
          )}

          <div className="flex flex-row lg:flex-col gap-3">
            {userRole === 'worker' ? (
              <>
                <button
                  disabled={isAppliedByUser || job.status === 'pending' || job.status === 'completed'}
                  className={`w-full p-4 text-sm font-black rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed ${
                    isAppliedByUser 
                      ? 'glass-card text-slate-500 cursor-not-allowed'
                      : job.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 cursor-not-allowed'
                        : job.status === 'completed'
                          ? 'glass-card text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 active:scale-98'
                  }`}
                  onClick={() => setSelectedApplyJob(job)}
                >
                  <FiShield className="text-lg" />
                  {isAppliedByUser 
                    ? 'Pekerjaan Sudah Dilamar' 
                    : job.status === 'pending' 
                      ? 'Pekerjaan Sedang Ditunda' 
                      : job.status === 'completed'
                        ? 'Pekerjaan Telah Selesai'
                        : 'Ambil Pekerjaan Sekarang'
                  }
                </button>
                
                <SaveJobButton
                  is_saved={isSavedByUser}
                  id={job.id}
                  status={job.status}
                  title={job.title}
                  employer={employerName}
                  employer_name={employerName}
                  category={job.category}
                  location={job.location}
                  reward={job.reward}
                  type={job.type}
                  description={job.description}
                  requirements={job.requirements}
                  taken={job.taken}
                  total={job.total}
                  posted_at={job.posted_at}
                  deadline={job.deadline}
                  applied_at={job.applied_at}
                  worker_notes={job.worker_notes}
                  applications={job.applications}
                />
              </>
            ) : (
              <div className="w-full p-4 glass-card text-slate-600 dark:text-slate-300 text-center font-semibold text-xs rounded-2xl">
                {userId 
                  ? "Aksi lamar & simpan lowongan hanya tersedia untuk akun Pekerja (Worker)." 
                  : "Silakan login terlebih dahulu untuk melamar pekerjaan."
                }
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200/50 dark:border-white/10 flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <FiShield className="text-blue-500 dark:text-blue-400 shrink-0 text-xl" />
            <p className="text-[11px] leading-tight">
              Pembayaran Anda diamankan oleh sistem <strong>Escrow KaryaMandiri</strong>. Dana akan cair otomatis setelah tugas diverifikasi.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default JobContentGrid;