"use client";

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { FiCheckCircle, FiStar, FiZap } from "react-icons/fi";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubscriptionDialog: React.FC<SubscriptionDialogProps> = ({ open, onOpenChange }) => {
  const benefits = [
    "Posting proyek dan tugas tanpa batas kuota bulanan",
    "Akses prioritas ke direktori profil pekerja terverifikasi",
    "Analitik statistik performa pengerjaan proyek mendalam",
    "Dukungan teknis dan mediasi sengketa prioritas 24/7"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-115 glass-panel rounded-3xl p-0 overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl">
        {/* Header dengan Ambient Glow Liquid */}
        <div className="relative p-8 text-white overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-4 right-4 opacity-20 text-white">
            <FiStar size={72} />
          </div>
          <DialogHeader className="relative z-10 text-center">
            <div className="mx-auto p-3.5 rounded-2xl w-fit mb-4 bg-white/20 border border-white/30 backdrop-blur-md shadow-lg">
              <FiZap className="text-yellow-300 text-3xl" />
            </div>
            <DialogTitle className="text-2xl font-black text-white tracking-tight">KaryaMandiri Premium</DialogTitle>
            <DialogDescription className="text-blue-100 font-medium text-xs sm:text-sm mt-1">
              Akselerasi skalabilitas bisnis dan crowdsourcing Anda dengan fasilitas eksklusif.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Konten Manfaat */}
        <div className="p-7 sm:p-8 space-y-6">
          <div className="space-y-3.5">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-500 mt-0.5 shrink-0">
                  <FiCheckCircle size={16} />
                </div>
                <span className="text-xs sm:text-sm font-semibold leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Pricing Glass Card */}
          <div className="glass-card p-4.5 rounded-2xl flex justify-between items-center border border-white/20 dark:border-white/10">
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Biaya Investasi</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                Rp149.000<span className="text-xs font-semibold text-slate-400 dark:text-slate-500"> / bulan</span>
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
              Hemat 20%
            </span>
          </div>

          {/* Aksi Liquid Glass */}
          <DialogFooter className="flex-col sm:flex-col gap-2.5 pt-1">
            <button className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25 cursor-pointer text-sm">
              Mulai Berlangganan Sekarang
            </button>
            <button 
              onClick={() => onOpenChange(false)}
              className="w-full py-2 text-slate-400 dark:text-slate-500 text-xs font-semibold hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer"
            >
              Nanti Saja
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;