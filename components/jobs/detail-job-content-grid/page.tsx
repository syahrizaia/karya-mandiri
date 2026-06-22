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
          <h4 key={index} className="text-md font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide mt-6 mb-2 first:mt-0">
            {trimmedLine}
          </h4>
        );
      }

      if (/^\d+\.\s/.test(trimmedLine)) {
        return (
          <p key={index} className="font-bold text-slate-800 dark:text-slate-200 mt-3 mb-1 pl-1">
            {trimmedLine}
          </p>
        );
      }

      if (trimmedLine.startsWith('-')) {
        return (
          <span key={index} className="block text-slate-600 dark:text-slate-400 pl-4 py-0.5 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500 dark:before:text-blue-400">
            {trimmedLine.substring(1).trim()}
          </span>
        );
      }

      return trimmedLine === "" ? (
        <span key={index} className="block h-2" />
      ) : (
        <p key={index} className="text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
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
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              job.type === 'Crowdsourcing' 
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' 
                : 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400'
            }`}>
              {job.type}
            </span>
            <span className="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {job.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">{job.title}</h1>
          
          <div className="flex flex-wrap gap-6 text-slate-500 dark:text-slate-400 mb-8">
            <Link href={`/profile/${job.user_id}`} className="flex items-center gap-2 text-blue-400 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition">
              {avatarUrl ? (
                <Image
                  src={avatarUrl} 
                  alt={employerName} 
                  className="w-6 h-6 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  width={50}
                  height={50}
                />
              ) : (
                <div className="w-6 h-6 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 uppercase">
                  {employerName.charAt(0)}
                </div>
              )}
              <span>{employerName}</span>
            </Link>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-red-400 dark:text-red-500"/> {job.location}
            </div>
            <div className="flex items-center gap-2">
              <FiClock /> {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true, locale: id })}
            </div>
          </div>

          <div className="prose prose-slate max-w-none dark:prose-invert">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">Deskripsi</h3>
            <div className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{formatDescription(job.description)}</div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">Persyaratan & Kualifikasi</h3>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-2">
              {(typeof job.requirements === 'string' 
                ? (job.requirements as string).split('\n') 
                : job.requirements
              ).map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Kolom Kanan: Widget Aksi */}
      <aside className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800/80 shadow-lg sticky top-24 transition-colors">
          <div className="mb-6">
            <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase mb-1">Upah Tugas</p>
            <div className="flex items-baseline gap-1">
              {typeof job.reward === 'number' ? (
                <span className="text-3xl font-black text-green-600 dark:text-green-400">
                  Rp{job.reward.toLocaleString('id-ID')}
                </span>
              ) : (
                <span className="text-3xl font-black text-slate-400 dark:text-slate-500">Rp0</span>
              )}
            </div>
          </div>

          {job.type === 'Crowdsourcing' && (
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
              <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tight">
                <span className="text-slate-500 dark:text-slate-400">Kuota Terisi</span>
                <span className="text-blue-600 dark:text-blue-400">{job.taken} / {job.total} Pekerja</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 dark:bg-blue-600 h-full transition-all duration-1000" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 italic">
                *Tugas akan dimulai setelah kuota terpenuhi.
              </p>
            </div>
          )}

          <div className="flex flex-row lg:flex-col gap-4">
            {userRole === 'worker' ? (
              <>
                <button
                  disabled={isAppliedByUser || job.status === 'pending' || job.status === 'completed'}
                  className={`w-full p-4 text-sm md:text-lg font-bold rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed ${
                    isAppliedByUser 
                      ? 'bg-slate-400 text-white cursor-not-allowed shadow-none dark:bg-slate-700 dark:text-slate-400'
                      : job.status === 'pending'
                        ? 'bg-orange-100 text-orange-600 cursor-not-allowed shadow-none dark:bg-orange-950/30 dark:text-orange-400'
                        : job.status === 'completed'
                          ? 'bg-slate-600 text-white cursor-not-allowed shadow-none dark:bg-slate-800 dark:text-slate-400'
                          : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-blue-200 dark:shadow-none shadow-lg'
                  }`}
                  onClick={() => setSelectedApplyJob(job)}
                >
                  <FiShield className="lg:text-4xl" />
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
              <div className="w-full p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-center font-semibold text-xs rounded-2xl transition-colors">
                {userId 
                  ? "Aksi lamar & simpan lowongan hanya tersedia untuk akun Pekerja (Worker)." 
                  : "Silakan login terlebih dahulu untuk melamar pekerjaan."
                }
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 text-slate-400 dark:text-slate-500 transition-colors">
            <FiShield className="text-blue-500 dark:text-blue-400 shrink-0" />
            <p className="text-[10px] leading-tight">
              Pembayaran Anda diamankan oleh sistem <strong>Escrow KaryaMandiri</strong>. Dana akan cair otomatis setelah tugas diverifikasi.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default JobContentGrid;