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
      <DialogContent className="sm:max-w-110 rounded-3xl p-6 bg-white dark:bg-slate-900 border-none transition-colors">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-2">
            <FiTrash2 size={24} />
          </div>
          <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">
            Hapus Penawaran Jasa?
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 pt-1 text-sm leading-relaxed">
            Apakah Anda yakin ingin menghapus jasa{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">{serviceTitle}</span>? 
            Tindakan ini permanen dan tidak bisa dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-3 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="w-full py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition cursor-pointer"
          >
            Kembali
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
          >
            {loading ? <FiLoader className="animate-spin text-lg" /> : "Ya, Hapus Jasa"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}