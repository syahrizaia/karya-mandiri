"use client";

import { IJobs } from "@/app/types/jobs";
import supabase from "@/lib/db";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { id } from "date-fns/locale/id";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiBriefcase, FiChevronLeft, FiClock, FiMapPin, FiShare2, FiShield } from "react-icons/fi";
import SubscriptionDialog from "../../../../components/subscription/page";
import SaveJobButton from "@/components/ui/save-job-button/page";
import ApplyJobDialog from "@/components/apply-project/page";

const DetailJob: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<IJobs | null>(null);
  const [, setJobs] = useState<IJobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedApplyJob, setSelectedApplyJob] = useState<IJobs | null>(null);

  useEffect(() => {
    if(params?.id) {
      const fetchJob = async () => {
        try {
          const {data, error} = await supabase.from('jobs').select('*').eq('id', params.id).single();
          if (error) throw error;
          setJob(data);
        } catch (error) {
          console.error('Error fetching job:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchJob();
    }
  }, [params?.id]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!job) return <div className="text-center py-20">Pekerjaan tidak ditemukan.</div>;

  const progressPercentage = (job.taken / job.total) * 100;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Navigasi */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-2 flex justify-between items-center">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition"
          >
            <FiChevronLeft /> Kembali
          </button>
          <button
            className="p-4 text-lg hover:bg-slate-200 rounded-full transition"
            onClick={() => setShowSubModal(true)}
          >
            <FiShare2 className="text-slate-600" />
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
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
                <div className="flex items-center gap-2"><FiBriefcase className="text-blue-600"/> {job.employer}</div>
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

              <div className="flex flex-row lg:flex-col gap-4">
                <button
                  className="w-full p-4 bg-blue-600 text-white text-sm md:text-lg font-bold rounded-2xl hover:bg-blue-700 transition shadow-blue-200 shadow-lg flex items-center justify-center gap-2"
                  onClick={() => setSelectedApplyJob(job)}
                >
                  <FiShield className="text-white lg:text-4xl" />
                  Ambil Pekerjaan Sekarang
                </button>
                <SaveJobButton
                  is_saved={true}
                  id={job.id}
                  status={'active'}
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
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-3 text-slate-400">
                <FiShield className="text-blue-500 shrink-0" />
                <p className="text-[10px] leading-tight">
                  Pembayaran Anda diamankan oleh sistem <strong>Escrow KaryaMandiri</strong>. Dana akan cair otomatis setelah tugas diverifikasi.
                </p>
              </div>
            </div>
          </aside>
        </div>
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