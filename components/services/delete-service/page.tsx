/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { FiLoader, FiTrash2 } from "react-icons/fi";
import supabase from "@/lib/db";
import { toast } from "sonner";

interface DeleteServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: string | null;
  serviceTitle: string | "";
  onSuccess: (id: string) => void;
}

export default function DeleteServiceDialog({ 
  open, 
  onOpenChange, 
  serviceId, 
  serviceTitle, 
  onSuccess 
}: DeleteServiceDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!serviceId) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", serviceId);

      if (error) throw error;

      toast.success("Tawaran jasa berhasil dihapus.");
      onSuccess(serviceId);
      window.location.reload();
      onOpenChange(false);
    } catch (err: any) {
      toast.error("Gagal menghapus jasa: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-110 rounded-3xl p-6 sm:p-7 glass-panel border border-white/20 dark:border-white/10 shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center mb-3">
            <FiTrash2 size={26} />
          </div>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Hapus Penawaran Jasa?
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 pt-1 text-xs sm:text-sm leading-relaxed">
            Apakah Anda yakin ingin menghapus jasa{" "}
            <span className="font-bold text-slate-900 dark:text-white">&quot;{serviceTitle}&quot;</span>? 
            Tindakan ini permanen dan tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-3 pt-4 mt-2 border-t border-white/20 dark:border-white/5">
          <button
            type="button"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="w-full py-3 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/10 rounded-2xl transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="w-full py-3 bg-linear-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-500/20 cursor-pointer"
          >
            {loading ? <FiLoader className="animate-spin text-base" /> : "Ya, Hapus Jasa"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}