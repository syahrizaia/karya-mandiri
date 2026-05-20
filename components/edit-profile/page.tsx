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
import { FiLoader, FiUser, FiMapPin, FiEdit3, FiAlignLeft } from "react-icons/fi";
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
  
  // State Form
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  // Sinkronisasi state saat modal dibuka dengan data terbaru
  useEffect(() => {
    if (open && userData) {
      setFullName(userData.full_name || "");
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

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          bio: bio,
          location: location,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profil Anda berhasil diperbarui!");
      onSuccess(); // Panggil fungsi refresh di parent
      onOpenChange(false); // Tutup modal
    } catch (err: any) {
      console.error("Update Error:", err.message);
      toast.error(err.message || "Gagal memperbarui profil.");
    } finally {
      setLoading(false);
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
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
              placeholder="Ceritakan sedikit tentang keahlian atau pengalaman Anda..."
            />
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