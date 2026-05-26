/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
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
import { FiLoader, FiPlus, FiX, FiShield, FiCheck } from "react-icons/fi";
import supabase from "@/lib/db";
import { toast } from "sonner";

interface ManageSkillsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSkills: string[];
  onSuccess: () => void;
}

export default function ManageSkillsDialog({ open, onOpenChange, currentSkills, onSuccess }: ManageSkillsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Sinkronisasi data saat modal dibuka
  useEffect(() => {
    if (open) {
      setSkills(currentSkills || []);
    }
  }, [open, currentSkills]);

  const addSkill = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !skills.includes(trimmedValue)) {
      setSkills([...skills, trimmedValue]);
      setInputValue("");
    } else if (skills.includes(trimmedValue)) {
      toast.error("Keahlian sudah ada di daftar.");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi tidak ditemukan.");

      const { error } = await supabase
        .from("profiles")
        .update({ skills: skills }) // Mengirimkan array string
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Daftar keahlian berhasil diperbarui!");
      onSuccess();
      window.location.reload();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan keahlian.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-112.5 rounded-3xl p-8 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FiShield className="text-blue-600" /> Kelola Keahlian
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Tambahkan spesialisasi Anda agar pemberi kerja dapat menemukan profil Anda dengan mudah.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Input Area */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              placeholder="Contoh: Logistik, UI Design..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
            <button
              type="button"
              onClick={addSkill}
              className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <FiPlus size={20} />
            </button>
          </div>

          {/* Tags Display Area */}
          <div className="flex flex-wrap gap-2 min-h-25 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold shadow-sm"
                >
                  {skill}
                  <button 
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 m-auto italic">Belum ada keahlian ditambahkan.</p>
            )}
          </div>
        </div>

        <DialogFooter className="pt-6 gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSave}
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            {loading ? <FiLoader className="animate-spin text-lg" /> : <><FiCheck /> Simpan</>}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}