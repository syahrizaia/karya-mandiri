"use client";

import { IJobs } from "@/app/types/jobs";
import supabase from "@/lib/db";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiLoader, FiTrash2 } from "react-icons/fi";

interface DeleteProjectDialogProps {
  job: IJobs;
  id: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteProjectDialog = ({
  job,
  id,
  title,
  open,
  onOpenChange,
  onSuccess,
}: DeleteProjectDialogProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [, setJobs] = useState<IJobs[]>([]);
  const [, setSelectedJob] = useState<{ job: IJobs; action: "edit" | "delete" } | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .order("posted_at", { ascending: false });
        if (error) {
          console.error("Error fetching jobs:", error);
        } else {
          setJobs(data || []);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchJobs();
  }, []);

  const DeleteProject = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", id);

      if (error) {
        throw error;
      } else {
        toast.success("Proyek berhasil dihapus!");
        setSelectedJob(null);
        onSuccess();
        router.refresh();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Gagal menghapus proyek. Periksa koneksi atau database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 dark:shadow-none"
          onClick={() => setSelectedJob({ job, action: "delete" })}
        >
          <FiTrash2 />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto rounded-3xl p-8 bg-white dark:bg-slate-900 border-none shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-black text-slate-900 dark:text-slate-50">
            Delete Proyek
          </DialogTitle>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">
            Employer: Anonymous
          </p>
          <DialogDescription className="mt-4 text-slate-600 dark:text-slate-400">
            Apakah Anda yakin ingin menghapus proyek <strong>{title}</strong>?
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition"
          >
            Batal
          </button>
          <button
            onClick={() => DeleteProject()}
            disabled={loading}
            className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition flex items-center gap-2 disabled:bg-red-400 dark:disabled:bg-red-900"
          >
            {loading ? <FiLoader className="animate-spin" /> : "Hapus Proyek"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProjectDialog;