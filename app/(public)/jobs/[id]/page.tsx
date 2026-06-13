"use client";

import { IJobs } from "@/app/types/jobs";
import supabase from "@/lib/db";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiCalendar, FiChevronLeft, FiMail } from "react-icons/fi";
import SubscriptionDialog from "../../../../components/subscription/page";
import ApplyJobDialog from "@/components/apply-job/page";
import ShareJobButton from "@/components/ui/share-job-button/page";
import Image from "next/image";
import Link from "next/link";
import DetailJobContentGrid from "@/components/detail-job-content-grid/page";

interface IApplicant {
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

const DetailJob: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;
  const [job, setJob] = useState<IJobs | null>(null);
  const [, setJobs] = useState<IJobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<IApplicant[]>([]);
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedApplyJob, setSelectedApplyJob] = useState<IJobs | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [, setRoleLoading] = useState(true);
  const [isSavedByUser, setIsSavedByUser] = useState<boolean>(false);
  const [isAppliedByUser, setIsAppliedByUser] = useState<boolean>(false);

  useEffect(() => {
    if(params?.id) {
      const fetchJobAndUser = async () => {
        try {
          setLoading(true);
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            setUserId(user.id);
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .maybeSingle();
              
            if (profile) {
              setUserRole(profile.role?.toLowerCase());
            }

            const { data: savedData } = await supabase
              .from('saved_jobs')
              .select('*')
              .eq('user_id', user.id)
              .eq('job_id', params.id)
              .maybeSingle();

            if (savedData) {
              setIsSavedByUser(true);
            }

            const { data: application } = await supabase
              .from('applications')
              .select('id')
              .eq('job_id', jobId)
              .eq('user_id', user.id)
              .maybeSingle();

            if (application) {
              setIsAppliedByUser(true);
            }
          }

          const { data, error } = await supabase
            .from('jobs')
            .select(`
              *,
              profiles:user_id (
                full_name,
                avatar_url
              )
            `)
            .eq('id', params.id)
            .single();
          
          if (error) throw error;
          setJob(data);

          await supabase.from('interaction_logs').insert([
            { item_id: jobId, item_type: 'job', interaction_type: 'view' }
          ]);

          if (user && data && data.is_saved && data.user_id === user.id) {
            setIsSavedByUser(true);
          }

        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchJobAndUser();
    }
  }, [params?.id, jobId]);

  useEffect(() => {
    if (!jobId) return;

    const fetchJobAndApplicants = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select(`
            *,
            profiles:user_id (
              full_name,
              avatar_url
            )
          `)
          .eq('id', jobId)
          .single();

        if (jobError || !jobData) {
          router.push('/dashboard');
          return;
        }
        setJob(jobData);

        const { data: applicantsData, error: applicantsError } = await supabase
          .from('applications')
          .select(`
            id,
            job_id,
            user_id:user_id,
            status,
            applied_at,
            notes,
            profiles!user_id (
              full_name,
              email,
              avatar_url
            )
          `)
          .eq('job_id', jobId)
          .order('applied_at', { ascending: false });

        const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single();
        if (profile) { setUserRole(profile.role); }
        setRoleLoading(false);

        if (!applicantsError) {
          setApplicants(applicantsData as unknown as IApplicant[]);
        }
      } catch (err) {
        console.error('Terjadi kesalahan sistem:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplicants();
  }, [jobId, router]);

  const handleUpdateStatus = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const targetApplicant = applicants.find(app => app.id === applicationId);
      const previousStatus = targetApplicant ? targetApplicant.status : 'pending';

      const { error: appError } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (appError) throw appError;

      let newTaken = job?.taken ?? 0;
      let shouldUpdateJob = false;

      if (newStatus === 'accepted' && previousStatus !== 'accepted') {
        newTaken = Math.min(job?.total ?? 0, newTaken + 1);
        shouldUpdateJob = true;
      } else if (newStatus === 'rejected' && previousStatus === 'accepted') {
        newTaken = Math.max(0, newTaken - 1);
        shouldUpdateJob = true;
      }

      if (shouldUpdateJob && job?.id) {
        const { error: jobUpdateError } = await supabase
          .from('jobs')
          .update({ taken: newTaken })
          .eq('id', job.id);

        if (jobUpdateError) throw jobUpdateError;
      }

      setApplicants((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
      );

      setJob((prevJob) => {
        if (!prevJob) return null;
        return { ...prevJob, taken: newTaken };
      });

      router.refresh();
    } catch (err) {
      alert('Gagal memperbarui status pelamar');
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!job) return <div className="text-center py-20">Pekerjaan tidak ditemukan.</div>;

  const jobDetail = { id: job.id, title: job.title };

  return (
    <div className="min-h-screen pb-10">
      {/* Header Navigasi */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 py-2">
        <div className="max-w-5xl mx-auto px-6 py-2 flex justify-between items-center">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 pl-6 md:pl-8 lg:pl-0 text-slate-600 hover:text-blue-600 font-medium transition"
          >
            <FiChevronLeft /> Kembali
          </button>
          <ShareJobButton jobId={jobDetail.id} jobTitle={jobDetail.title} />
        </div>
      </div>

      <main className="max-w-5xl mx-auto mt-4 flex flex-col gap-4">
        
        <DetailJobContentGrid
          job={job}
          userId={userId}
          userRole={userRole}
          isSavedByUser={isSavedByUser}
          isAppliedByUser={isAppliedByUser}
          setSelectedApplyJob={setSelectedApplyJob}
        />

        {/* TAMPILAN KHUSUS MANAGEMENT PANEL UNTUK EMPLOYER */}
        {userRole === 'employer' && job.user_id === userId && (
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Ringkasan Informasi Job */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
              <div className="flex flex-col justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-md">
                    Detail Proyek
                  </span>
                  <p className="text-gray-500 text-sm mt-1 pt-2">
                    Anggaran: <span className="font-semibold text-gray-700">Rp{job.reward.toLocaleString()} / orang</span>
                  </p>
                </div>
                <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm text-gray-600 space-y-1">
                  <p>Total Kuota: <span className="font-bold text-gray-800">{job.total} Orang</span></p>
                  <p>Telah Diambil: <span className="font-bold text-green-600">{job.taken || 0} Orang</span></p>
                </div>
              </div>
            </div>

            {/* Daftar Pelamar / Workers */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Daftar Pelamar ({applicants.length})</h2>
                <p className="text-sm text-gray-500">Kelola para kontributor crowdsourcing yang mengajukan diri pada proyek ini.</p>
              </div>

              {applicants.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="p-4 bg-gray-50 text-gray-400 rounded-full">
                    <FiAlertCircle size={32} />
                  </div>
                  <h3 className="text-md font-bold text-slate-700">Belum Ada Pelamar</h3>
                  <p className="text-sm text-slate-400 max-w-xs">Proyek ini baru dipublikasikan atau belum mendapatkan pelamar dari Pekerja saat ini.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {applicants.map((applicant) => (
                    <div key={applicant.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex gap-2">
                          <Link href={`/profile/${applicant.user_id}`} className="bg-blue-100 text-blue-600 p-1 rounded-2xl w-fit h-fit">
                            <Image
                              src={applicant.profiles?.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=Worker'}
                              alt="Avatar"
                              width={60}
                              height={60}
                              className="rounded-xl object-cover w-10 h-10 sm:w-12 sm:h-12"
                            />
                          </Link>
                          <div className="space-y-1">
                            <Link href={`/profile/${applicant.user_id}`} className="font-semibold text-gray-800 text-base">{applicant.profiles?.full_name || 'Worker Anonim'}</Link>
                            <div className="flex flex-col items-start gap-y-1 text-sm text-gray-500">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <span className="flex items-center gap-1">
                                  <FiMail className="shrink-0" /> {applicant.profiles?.email || '-'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiCalendar className="shrink-0" /> {new Date(applicant.applied_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {applicant.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600 italic">
                            <span className="block text-xs font-semibold text-gray-400 uppercase not-italic mb-1">Catatan Pelamar:</span>
                            &quot;{applicant.notes}&quot;
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        {applicant.status === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateStatus(applicant.id, 'rejected')}
                              className="px-4 py-2 border border-red-200 text-red-600 font-medium text-sm rounded-xl hover:bg-red-50 active:scale-95 transition"
                            >
                              Tolak
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(applicant.id, 'accepted')}
                              className="px-4 py-2 bg-green-600 text-white font-medium text-sm rounded-xl hover:bg-green-700 active:scale-95 shadow-sm shadow-green-600/10 transition"
                            >
                              Terima
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                              applicant.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {applicant.status === 'accepted' ? 'Diterima' : 'Ditolak'}
                            </span>
                            {applicant.status === 'accepted' && (
                              <button
                                onClick={() => handleUpdateStatus(applicant.id, 'rejected')}
                                className="text-xs text-red-500 hover:underline font-medium"
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
        )}
      </main>
      
      {selectedApplyJob && (
        <ApplyJobDialog
          job={selectedApplyJob}
          open={selectedApplyJob !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedApplyJob(null);
          }}
          onSuccess={() => {
            setJobs((prevJobs) =>
              prevJobs.map((item) =>
                item.id === selectedApplyJob.id
                  ? { ...item, taken: (item.taken ?? 0) + 1 }
                  : item
              )
            );
            router.refresh(); 
          }}
        />
      )}
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>
  );
};

export default DetailJob;