"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { FiCheckCircle, FiStar, FiZap } from "react-icons/fi";

const SubscriptionDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const benefits = [
    "Posting proyek tanpa batas",
    "Akses ke profil pekerja terverifikasi",
    "Statistik performa proyek mendalam",
    "Dukungan prioritas 24/7"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-white rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        {/* Header dengan Aksen Warna */}
        <div className="bg-blue-600 p-8 text-white text-center relative">
          <div className="absolute top-4 right-4 opacity-20">
            <FiStar size={80} />
          </div>
          <DialogHeader>
            <div className="mx-auto bg-white/20 p-3 rounded-2xl w-fit mb-4">
              <FiZap className="text-yellow-300 text-3xl" />
            </div>
            <DialogTitle className="text-2xl font-black">KaryaMandiri Premium</DialogTitle>
            <DialogDescription className="text-blue-100 font-medium">
              Tingkatkan efisiensi bisnis Anda sekarang.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8">
          <div className="space-y-4 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-slate-600">
                <FiCheckCircle className="text-green-500 shrink-0" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl mb-8 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Mulai Dari</p>
              <p className="text-xl font-black text-slate-900">Rp149.000.000<span className="text-sm font-normal text-slate-500">/bln</span></p>
            </div>
            <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Hemat 20%</span>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-3">
            <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              Berlangganan Sekarang
            </button>
            <button 
              onClick={() => onOpenChange(false)}
              className="w-full py-2 text-slate-400 text-xs font-semibold hover:text-slate-600 transition"
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