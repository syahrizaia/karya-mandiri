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
    "Posting proyek tanpa batas",
    "Akses ke profil pekerja terverifikasi",
    "Statistik performa proyek mendalam",
    "Dukungan prioritas 24/7"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-112.5 bg-white dark:bg-slate-900 rounded-3xl p-0 overflow-hidden border-none shadow-2xl transition-colors">
        {/* Header dengan Aksen Warna */}
        <div className="bg-blue-600 dark:bg-blue-950 p-8 text-white text-center relative transition-colors">
          <div className="absolute top-4 right-4 opacity-20">
            <FiStar size={80} />
          </div>
          <DialogHeader>
            <div className="mx-auto bg-white/20 dark:bg-white/10 p-3 rounded-2xl w-fit mb-4">
              <FiZap className="text-yellow-300 dark:text-yellow-400 text-3xl" />
            </div>
            <DialogTitle className="text-2xl font-black">KaryaMandiri Premium</DialogTitle>
            <DialogDescription className="text-blue-100 dark:text-blue-200 font-medium">
              Tingkatkan efisiensi bisnis Anda sekarang.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Konten Manfaat */}
        <div className="p-8">
          <div className="space-y-4 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <FiCheckCircle className="text-green-500 dark:text-green-400 shrink-0" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Pricing Card */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl mb-8 flex justify-between items-center transition-colors">
            <div>
              <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Mulai Dari</p>
              <p className="text-xl font-black text-slate-900 dark:text-slate-100">
                Rp149.000.000<span className="text-sm font-normal text-slate-500 dark:text-slate-500">/bln</span>
              </p>
            </div>
            <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Hemat 20%
            </span>
          </div>

          {/* Aksi / Footer */}
          <DialogFooter className="flex-col sm:flex-col gap-3">
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-lg shadow-blue-200 dark:shadow-none cursor-pointer">
              Berlangganan Sekarang
            </button>
            <button 
              onClick={() => onOpenChange(false)}
              className="w-full py-2 text-slate-400 dark:text-slate-500 text-xs font-semibold hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
            >
              Mungkin Nanti
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;