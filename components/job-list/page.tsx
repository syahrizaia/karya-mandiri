/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiClock, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { IJobs } from '@/app/types/jobs';
import formatRelativeTime from '@/components/ui/format-relative-time/page';
import SaveJobButton from '@/components/ui/save-job-button/page';

interface JobListProps {
  filteredJobs: IJobs[];
  currentJobs: IJobs[];
  loading: boolean;
  sortBy: string;
  setSortBy: (value: string) => void;
  userId: string | null;
  userRole: string | null;
  savedJobIds: string[];
  currentPage: number;
  totalPages: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  handlePageChange: (pageNumber: number) => void;
  onResetFilters: () => void;
}

const JobCardLoading = () => {
  return (
    <div className="flex flex-col gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 animate-pulse">
          <div className="md:grid md:grid-cols-3 flex flex-col gap-6">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-5 w-24 bg-slate-200 rounded-full" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
              </div>
              <div className="h-7 w-3/4 bg-slate-200 rounded-xl" />
              <div className="flex gap-4 pt-1">
                <div className="h-4 w-28 bg-slate-100 rounded" />
                <div className="h-4 w-24 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="flex flex-col justify-between items-end gap-4 min-w-37.5">
              <div className="text-right w-full space-y-1">
                <div className="h-3 w-20 bg-slate-100 rounded ml-auto" />
                <div className="h-8 w-36 bg-slate-200 rounded-xl ml-auto" />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="h-12 w-full md:w-36 bg-slate-200 rounded-2xl" />
                <div className="h-12 w-12 bg-slate-200 rounded-2xl shrink-0" />
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-50 space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-28 bg-slate-100 rounded" />
              <div className="h-3 w-16 bg-slate-100 rounded" />
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

const JobList: React.FC<JobListProps> = ({
  filteredJobs,
  currentJobs,
  loading,
  sortBy,
  setSortBy,
  userId,
  userRole,
  savedJobIds,
  currentPage,
  totalPages,
  indexOfFirstItem,
  indexOfLastItem,
  handlePageChange,
  onResetFilters,
}) => {
  return (
    <div className="lg:col-span-3 space-y-4">
      <div className="flex justify-between items-center px-2">
        <p className="text-slate-500 font-medium">{filteredJobs.length} Lowongan Tersedia</p>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-transparent font-semibold text-blue-600 outline-none cursor-pointer text-sm"
        >
          <option value="Terbaru">Terbaru</option>
          <option value="Upah Tertinggi">Upah Tertinggi</option>
        </select>
      </div>

      {loading ? (
        <JobCardLoading />
      ) : (
        <>
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
              <p className="text-slate-400 font-medium">Tidak ada lowongan kerja yang cocok dengan filter pencarian Anda.</p>
              <button 
                onClick={onResetFilters} 
                className="mt-4 text-sm font-bold text-blue-600 hover:underline"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            currentJobs.map((job) => {
              const isJobSavedByUser = savedJobIds.includes(job.id) || (job.is_saved && job.worker_id === userId);
              const profileData = (job as any).profiles;
              const employerName = profileData?.full_name || 'Pengguna KaryaMandiri';
              const avatarUrl = profileData?.avatar_url;

              return (
                <div key={job.id} className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                  <div className='md:grid md:grid-cols-3 flex flex-col'>
                    <div className="flex flex-col md:flex-row md:col-span-2 justify-between gap-6">
                      <div className="space-y-3 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            job.type === 'Crowdsourcing' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {job.type}
                          </span>
                          <span className="text-slate-400 text-xs flex items-center gap-1">
                            <FiClock /> {formatRelativeTime(job.posted_at)}
                          </span>
                        </div>
                        <Link href={`/jobs/${job.id}`} className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition">{job.title}</Link>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                          <Link href={`profile/${job.user_id}`} className="flex items-center gap-1 z-10 text-blue-400 hover:text-blue-600 transition">
                            {(job as any).profiles?.avatar_url ? (
                              <Image
                                src={avatarUrl} 
                                alt={employerName || 'Avatar'} 
                                className="w-5 h-5 rounded-xl object-cover border border-slate-200 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                                width={50}
                                height={50}
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 uppercase">
                                {employerName.charAt(0)}
                              </div>
                            )}
                            <span>{employerName}</span>
                          </Link>
                          <div className="flex items-center gap-1"><FiMapPin className="text-red-400"/> {job.location}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end gap-4 min-w-37.5">
                      <div className="text-right w-full">
                        <p className="text-xs text-slate-400 font-semibold uppercase">Upah Tugas</p>
                        <p className="text-2xl font-bold text-green-600">Rp{(job.reward ?? 0).toLocaleString('id-ID') || "0"}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        {userRole === 'worker' ? (
                          <>
                            <Link
                              href={`/jobs/${job.id}`}
                              className="text-center w-full px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition shadow-md whitespace-nowrap"
                            >
                              Lihat Detail Pekerjaan
                            </Link>
                            <SaveJobButton
                              is_saved={isJobSavedByUser} 
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
                          <Link
                            href={`/jobs/${job.id}`}
                            className="text-center w-full px-6 py-3 bg-slate-100 text-slate-600 font-bold text-xs rounded-2xl hover:bg-slate-200 transition whitespace-nowrap"
                          >
                            Lihat Detail Pekerjaan
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {job.type === 'Crowdsourcing' && (
                    <div className="mt-2 pt-4 border-t border-slate-50">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-slate-500 uppercase">Kuota Crowdsourcing</span>
                        <span className="text-blue-600">{job.taken} / {job.total} Pekerja</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full transition-all duration-500" 
                          style={{ width: `${(job.taken / job.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}

          {/* INTERAKSI PAGINATION FOOTER */}
          {totalPages > 1 && (
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-between items-center text-center sm:text-left text-sm">
              <p className="text-xs text-slate-400 font-semibold w-full sm:w-auto">
                Menampilkan <span className="text-slate-700">{indexOfFirstItem + 1}</span> -{" "}
                <span className="text-slate-700">
                  {Math.min(indexOfLastItem, filteredJobs.length)}
                </span>{" "}
                dari <span className="text-slate-700">{filteredJobs.length}</span> lowongan
              </p>

              <div className="flex items-center justify-center gap-1 mx-auto sm:mx-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
                >
                  <FiChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`w-9 h-9 text-xs font-bold rounded-xl transition cursor-pointer ${
                      currentPage === idx + 1
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobList;