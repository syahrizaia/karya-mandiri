/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from "@/components/ui/dialog";
import { FiPlus, FiLoader } from "react-icons/fi";
import supabase from "@/lib/db";
import { toast } from "sonner";

export default function ManagePortofolio({ userId }: { userId: string }) {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", image_url: "" });

  useEffect(() => {
    if (userId) fetchPortfolios();
  }, [userId]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        const errorMessage = (error as any)?.message || "Terjadi kesalahan saat memuat portofolio.";
        console.error("Supabase Fetch Error:", error);
        toast.error(`Gagal: ${errorMessage}`);
        return;
      }

      setPortfolios(data || []);
    } catch (err) {
      console.error("Unexpected Error:", err);
      toast.error("Terjadi masalah koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Judul proyek harus diisi!");
      return;
    }

    setLoading(true);
    let imageUrl = "";

    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolios")
        .upload(fileName, file);

      if (uploadError) {
        toast.error(`Gagal upload gambar: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from("portfolios").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    const { error: dbError } = await supabase.from("portfolios").insert([
      {
        user_id: userId,
        title: formData.title,
        description: formData.description,
        image_url: imageUrl,
      },
    ]);

    if (dbError) {
      toast.error(`Gagal menyimpan ke database: ${dbError.message}`);
    } else {
      toast.success("Portofolio berhasil ditambahkan!");
      setFormData({ title: "", description: "", image_url: "" });
      setIsOpen(false);
      fetchPortfolios();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-black text-slate-800 dark:text-white">Portofolio Saya</h2>
        <button 
          onClick={() => setIsOpen(true)} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition"
        >
          <FiPlus /> Tambah Item
        </button>
      </div>

      {/* List Portofolio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolios.map((item) => (
          <div key={item.id} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-3xl p-6 bg-white dark:bg-slate-900 border-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Tambah Proyek Baru</DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Anda dapat menambah atau menghapus karya portofolio Anda di sini.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <input 
              required
              placeholder="Judul Proyek" 
              className="w-full p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <textarea 
              placeholder="Deskripsi singkat" 
              rows={3}
              className="w-full p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Upload Gambar Proyek</label>
              <input 
                id="file-upload"
                type="file" 
                accept="image/*"
                className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-slate-800 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-slate-700 text-slate-500 dark:text-slate-400"
              />
            </div>
            <DialogFooter className="pt-2">
              <button 
                type="submit"
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
              >
                {loading ? <FiLoader className="animate-spin" /> : "Simpan Portofolio"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}