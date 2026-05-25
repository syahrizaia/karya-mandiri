"use client";

import { IJobs } from "@/app/types/jobs";
import supabase from "@/lib/db";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { id } from "date-fns/locale/id";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiCalendar, FiChevronLeft, FiClock, FiMail, FiMapPin, FiShield, FiUser } from "react-icons/fi";
import SubscriptionDialog from "../../../../components/subscription/page";
import SaveJobButton from "@/components/ui/save-job-button/page";
import ApplyJobDialog from "@/components/apply-job/page";
import ShareJobButton from "@/components/ui/share-job-button/page";
import Image from "next/image";
import Link from "next/link";

interface IApplicant {
  id: string;
  worker_id: string;
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
  const [roleLoading, setRoleLoading] = useState(true);
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

            const { data: application, error } = await supabase
              .from('applications')
              .select('id')
              .eq('job_id', jobId)      // Ambil dari params id pekerjaan saat ini
              .eq('worker_id', user.id) // Filter berdasarkan ID user aktif
              .maybeSingle();

            if (application) {
              setIsAppliedByUser(true); // User terbukti sudah melamar proyek ini
            }
          }

          const { data, error } = await supabase.from('jobs').select('*').eq('id', params.id).single();
          if (error) throw error;
          setJob(data);

          // Fallback sekunder jika skema simpan Anda langsung menggunakan kolom 'worker_id' di tabel 'jobs'
          if (user && data && data.is_saved && data.worker_id === user.id) {
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
  }, [params?.id]);

  useEffect(() => {
    if (!jobId) return;

    const fetchJobAndApplicants = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // router.push('/login');
          return;
        }

        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (jobError || !jobData) {
          console.error('Error fetching job details:', jobError);
          router.push('/dashboard'); // Kembalikan ke dashboard jika lowongan tidak ketemu
          return;
        }
        setJob(jobData);

        // Menggunakan teknik Inner Join Supabase untuk menarik profile pelamar secara instan
        const { data: applicantsData, error: applicantsError } = await supabase
          .from('applications')
          .select(`
            id,
            worker_id,
            status,
            applied_at,
            notes,
            profiles:worker_id (
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

        if (applicantsError) {
          console.error('Error fetching applicants:', applicantsError);
        } else {
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

  // Fungsi untuk memperbarui status lamaran worker (Terima / Tolak)
  const handleUpdateStatus = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      // Update state lokal agar UI langsung sinkron tanpa reload
      setApplicants((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
      );
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

  const progressPercentage = (job.taken / job.total) * 100;

  const jobDetail = {
    id: job.id,
    title: job.title,
    company: job.employer,
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom Kiri: Detail Utama */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  job.type === 'Crowdsourcing' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {job.type}
                </span>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {job.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-4">{job.title}</h1>
              
              <div className="flex flex-wrap gap-6 text-slate-500 mb-8">
                <div className="flex items-center gap-2"><FiUser className="text-blue-600"/> {job.employer}</div>
                <div className="flex items-center gap-2"><FiMapPin className="text-red-400"/> {job.location}</div>
                <div className="flex items-center gap-2">
                  <FiClock /> {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true, locale: id })}
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-bold text-slate-900">Deskripsi Tugas</h3>
                <p className="text-slate-600 leading-relaxed">{job.description}</p>
                
                <h3 className="text-lg font-bold text-slate-900 mt-6">Persyaratan & Kualifikasi</h3>
                <ul className="list-disc pl-5 text-slate-600 space-y-2">
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
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-slate-400 font-bold uppercase mb-1">Upah Tugas</p>
                <div className="flex items-baseline gap-1">
                  {job && typeof job.reward === 'number' ? (
                    <span className="text-3xl font-black text-green-600">
                      Rp{job.reward.toLocaleString('id-ID')}
                    </span>
                    ) : (
                    <span className="text-3xl font-black text-slate-400">Rp0</span>
                  )}
                </div>
              </div>

              {job.type === 'Crowdsourcing' && (
                <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tight">
                    <span className="text-slate-500">Kuota Terisi</span>
                    <span className="text-blue-600">{job.taken} / {job.total} Pekerja</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-1000" 
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 italic">
                    *Tugas akan dimulai setelah kuota terpenuhi.
                  </p>
                </div>
              )}

              {/* CONTAINER TOMBOL AKSI */}
              <div className="flex flex-row lg:flex-col gap-4">
                {/* PROSES VALIDASI ROLE: Hanya Worker yang Bisa Melamar & Menyimpan */}
                {userRole === 'worker' ? (
                  <>
                    <button
                      disabled={isAppliedByUser || job.status === 'pending' || job.status === 'completed'}
                      className={`w-full p-4 text-sm md:text-lg font-bold rounded-2xl transition flex items-center justify-center gap-2 ${
                        isAppliedByUser 
                          ? 'bg-slate-400 text-white cursor-not-allowed shadow-none'
                          : job.status === 'pending'
                            ? 'bg-orange-100 text-orange-600 cursor-not-allowed shadow-none'
                            : job.status === 'completed'
                              ? 'bg-slate-600 text-white cursor-not-allowed shadow-none'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-lg'
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
                      is_saved={isSavedByUser} // Sinkronisasi dinamis sesuai user login
                      id={job.id}
                      status={job.status}
                      title={job.title}
                      employer={job.employer}
                      employer_name={job.employer_name}
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
                  /* Tampilan Fallback jika dibuka oleh Employer atau User tanpa Sesi Login */
                  <div className="w-full p-4 bg-slate-50 border border-slate-200 text-slate-500 text-center font-semibold text-xs rounded-2xl">
                    {userId 
                      ? "Aksi lamar & simpan lowongan hanya tersedia untuk akun Pekerja (Worker)." 
                      : "Silakan login terlebih dahulu untuk melamar pekerjaan."
                    }
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 flex items-center gap-3 text-slate-400">
                <FiShield className="text-blue-500 shrink-0" />
                <p className="text-[10px] leading-tight">
                  Pembayaran Anda diamankan oleh sistem <strong>Escrow KaryaMandiri</strong>. Dana akan cair otomatis setelah tugas diverifikasi.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {userRole !== 'employer' || job.user_id !== userId ? (
          /* Tampilan jika Worker atau user lain mencoba mengakses halaman ini */
          // <div className="p-12 bg-white rounded-2xl border border-red-100 text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
          //   <div className="p-4 bg-red-50 text-red-500 rounded-full">
          //     <FiAlertCircle size={36} />
          //   </div>
          //   <h3 className="text-lg font-bold text-gray-800">Akses Ditolak</h3>
          //   <p className="text-sm text-gray-500 max-w-sm">
          //     Halaman detail pelamar ini hanya dapat diakses oleh akun dengan peran <span className="font-semibold text-red-600">Employer</span>.
          //   </p>
          //   <button
          //     onClick={() => router.push('/dashboard')}
          //     className="mt-2 px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition"
          //   >
          //     Kembali ke Dashboard
          //   </button>
          // </div>
          <></>
        ) : (
          /* TAMPILAN KHUSUS EMPLOYER (Kode Asli Anda) */
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Ringkasan Informasi Job */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
              <div className="flex flex-col justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-md">
                    Detail Proyek
                  </span>
                  {/* <h1 className="text-2xl font-bold text-gray-800 mt-2">{job.title}</h1> */}
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
                      
                      {/* Profil Worker */}
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex gap-2">
                          <Link href={`/profile/${applicant.worker_id}`} className="bg-blue-100 text-blue-600 p-1 rounded-2xl w-fit h-fit">
                            {/* <FiUser size={20} /> */}
                            <Image
                              src={applicant.profiles?.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=Worker'}
                              alt="Avatar"
                              width={60}
                              height={60}
                              className="rounded-xl object-cover w-10 h-10 sm:w-12 sm:h-12"
                            />
                          </Link>
                          <div className="space-y-1">
                            <Link href={`/profile/${applicant.worker_id}`} className="font-semibold text-gray-800 text-base">{applicant.profiles?.full_name || 'Worker Anonim'}</Link>
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

                      {/* Status & Tombol Aksi */}
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
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            applicant.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {applicant.status === 'accepted' ? 'Diterima' : 'Ditolak'}
                          </span>
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
            // Opsi A: Jika Anda menggunakan state lokal untuk array lowongan:
            setJobs((prevJobs) =>
              prevJobs.map((item) =>
                item.id === selectedApplyJob.id
                  ? { ...item, taken: (item.taken ?? 0) + 1 } // Langsung manipulasi UI lokal (+1)
                  : item
              )
            );

            // Opsi B: Paksa Next.js Router untuk menyinkronkan ulang komponen server
            router.refresh(); 
          }}
        />
      )}
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>
  );
};

export default DetailJob;