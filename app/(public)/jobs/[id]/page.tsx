"use client";

import { IJobs } from "@/app/types/jobs";
import supabase from "@/lib/db";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import SubscriptionDialog from "../../../../components/subscription/page";
import ApplyJobDialog from "@/components/apply-job/page";
import ShareJobButton from "@/components/jobs/share-job-button/page";
import DetailJobContentGrid from "@/components/jobs/detail-job-content-grid/page";
import EmployerManagementPanel, { IApplicant } from "@/components/jobs/EmployerManagementPanel";

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
    if (params?.id) {
      const fetchJobAndUser = async () => {
        try {
          setLoading(true);
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            setUserId(user.id);
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", user.id)
              .maybeSingle();
              
            if (profile) {
              setUserRole(profile.role?.toLowerCase());
            }

            const { data: savedData } = await supabase
              .from("saved_jobs")
              .select("*")
              .eq("user_id", user.id)
              .eq("job_id", params.id)
              .maybeSingle();

            if (savedData) {
              setIsSavedByUser(true);
            }

            const { data: application } = await supabase
              .from("applications")
              .select("id")
              .eq("job_id", jobId)
              .eq("user_id", user.id)
              .maybeSingle();

            if (application) {
              setIsAppliedByUser(true);
            }
          }

          const { data, error } = await supabase
            .from("jobs")
            .select(`
              *,
              profiles:user_id (
                full_name,
                avatar_url
              )
            `)
            .eq("id", params.id)
            .single();
          
          if (error) throw error;
          setJob(data);

          await supabase.from("interaction_logs").insert([
            { item_id: jobId, item_type: "job", interaction_type: "view" }
          ]);

          if (user && data && data.is_saved && data.user_id === user.id) {
            setIsSavedByUser(true);
          }

        } catch (error) {
          console.error("Error fetching data:", error);
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
          .from("jobs")
          .select(`
            *,
            profiles:user_id (
              full_name,
              avatar_url
            )
          `)
          .eq("id", jobId)
          .single();

        if (jobError || !jobData) {
          router.push("/dashboard");
          return;
        }
        setJob(jobData);

        const { data: applicantsData, error: applicantsError } = await supabase
          .from("applications")
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
          .eq("job_id", jobId)
          .order("applied_at", { ascending: false });

        const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();
        if (profile) { setUserRole(profile.role); }
        setRoleLoading(false);

        if (!applicantsError) {
          setApplicants(applicantsData as unknown as IApplicant[]);
        }
      } catch (err) {
        console.error("Terjadi kesalahan sistem:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplicants();
  }, [jobId, router]);

  const handleUpdateStatus = async (applicationId: string, newStatus: "accepted" | "rejected") => {
    try {
      const targetApplicant = applicants.find(app => app.id === applicationId);
      const previousStatus = targetApplicant ? targetApplicant.status : "pending";

      const { error: appError } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", applicationId);

      if (appError) throw appError;

      let newTaken = job?.taken ?? 0;
      let shouldUpdateJob = false;

      if (newStatus === "accepted" && previousStatus !== "accepted") {
        newTaken = Math.min(job?.total ?? 0, newTaken + 1);
        shouldUpdateJob = true;
      } else if (newStatus === "rejected" && previousStatus === "accepted") {
        newTaken = Math.max(0, newTaken - 1);
        shouldUpdateJob = true;
      }

      if (shouldUpdateJob && job?.id) {
        const { error: jobUpdateError } = await supabase
          .from("jobs")
          .update({ taken: newTaken })
          .eq("id", job.id);

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
      alert("Gagal memperbarui status pelamar");
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950 transition-colors">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
    </div>
  );

  if (!job) return <div className="text-center py-20 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-955 transition-colors">Pekerjaan tidak ditemukan.</div>;

  const jobDetail = { id: job.id, title: job.title };

  return (
    <div className="min-h-screen pb-10 bg-slate-50/30 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header Navigasi */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 py-2 transition-colors">
        <div className="max-w-5xl mx-auto px-6 py-2 flex justify-between items-center">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 pl-6 md:pl-8 lg:pl-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition cursor-pointer"
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
        {userRole === "employer" && job.user_id === userId && (
          <EmployerManagementPanel
            job={job}
            applicants={applicants}
            handleUpdateStatus={handleUpdateStatus}
          />
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