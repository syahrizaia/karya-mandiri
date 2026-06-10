/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { FiLoader, FiUser, FiMapPin, FiEdit3, FiAlignLeft, FiPhone, FiZap } from "react-icons/fi";
import supabase from "@/lib/db";
import { toast } from "sonner";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: any; // Data user saat ini dari komponen Profile
  onSuccess: () => void; // Callback untuk refresh data profil di parent
}

export default function EditProfileDialog({ open, onOpenChange, userData, onSuccess }: EditProfileDialogProps) {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [brief, setBrief] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Sinkronisasi state saat modal dibuka dengan data terbaru
  useEffect(() => {
    if (open && userData) {
      setFullName(userData.full_name || "");
      setPhone(userData.phone === "Belum mengatur nomor telepon" || userData.phone === "Memuat nomor..." ? "" : userData.phone || "");
      setBio(userData.bio || "");
      setLocation(userData.location || "");
    }
  }, [open, userData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi tidak ditemukan.");

      // FORMAT AUTOMATIC KE E.164 (+62)
      let formattedPhone = phone.trim();
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "62" + formattedPhone.substring(1);
      }
      // Jika user lupa menulis kode negara dan langsung angka 8, tambahkan 62
      if (formattedPhone.startsWith("8")) {
        formattedPhone = "62" + formattedPhone;
      }

      if (formattedPhone !== "") {
        const { error: authError } = await supabase.from("profiles").update({
          phone: formattedPhone // Sekarang formatnya sudah valid (misal: 628123456789)
        }).eq("id", user.id);;

        if (authError) {
          console.warn("Catatan Autentikasi Sistem:", authError.message);
          // Jika tetap gagal karena alasan lain, lempar error agar user tahu
          throw new Error(`Gagal verifikasi nomor: ${authError.message}`);
        }
      }

      const updatePayload: any = {
        full_name: fullName,
        phone: phone,
        bio: bio,
        location: location,
        updated_at: new Date().toISOString(), // Hanya mengubah waktu modifikasi terakhir
        email: user.email,
      };

      if (userData?.created_at) {
        updatePayload.created_at = userData.created_at;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profil Anda berhasil diperbarui!");
      onSuccess(); // Panggil fungsi refresh di parent
      window.location.reload();
      onOpenChange(false); // Tutup modal
    } catch (err: any) {
      console.error("Update Error:", err.message);
      toast.error(err.message || "Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceWithAI = async () => {
    if (!bio.trim()) {
      toast.error("Tulis draf singkat mengenai keahlian atau latar belakang Anda terlebih dahulu!");
      return;
    }

    try {
      setIsEnhancing(true);

      const userSkills = userData?.skills || [];
      
      const response = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: bio,
          type: "profile",
          skills: userSkills,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Terjadi kesalahan");

      // Bersihkan markdown bawaan AI
      const cleanText = data.enhancedText.replace(/[#*`_~]/g, "").trim();
      
      setBio(cleanText); // Memasukkan hasil AI langsung ke state bio
      toast.success("Bio Anda berhasil diperhebat oleh AI KaryaMandiri!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal menggunakan fitur AI.");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 rounded-3xl p-8 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FiEdit3 className="text-blue-600" /> Edit Profil
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Perbarui informasi publik Anda agar lebih mudah dikenali oleh mitra KaryaMandiri.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdateProfile} className="space-y-5 mt-4">
          {/* Input Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <FiUser /> Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="Masukkan nama lengkap Anda"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <FiPhone /> Nomor Telepon
            </label>
            <input
              type="tel"
              required
              pattern="[0-9]*"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} // Hanya mengizinkan ketikan angka saja
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="Contoh: 081234567890"
            />
          </div>

          {/* Input Lokasi */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <FiMapPin /> Lokasi
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              placeholder="Contoh: Jakarta Selatan, Indonesia"
            />
          </div>

          {/* Input Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <FiAlignLeft /> Bio Singkat
            </label>
            <textarea
              placeholder="Tulis draf singkat mengenai keahlian, pengalaman, atau layanan profesional yang Anda tawarkan..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none placeholder:text-slate-400"
            />
            
            {/* TOMBOL PANDUAN AI UNTUK BIO */}
            <button
              type="button"
              onClick={handleEnhanceWithAI}
              disabled={isEnhancing}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 rounded-xl transition-all duration-200 shadow-sm shadow-indigo-100"
            >
              <FiZap className={`${isEnhancing ? "animate-spin" : ""}`} size={14} />
              {isEnhancing ? "Sedang Merangkai Kata..." : "Poles Bio dengan AI"}
            </button>
          </div>

          <DialogFooter className="pt-4 gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
            >
              {loading ? <FiLoader className="animate-spin text-lg" /> : "Simpan Perubahan"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}