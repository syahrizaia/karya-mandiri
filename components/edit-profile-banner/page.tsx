/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FiLoader, FiCamera, FiImage, FiCheck, FiMaximize2 } from "react-icons/fi";
import Cropper from "react-easy-crop"; 
import getCroppedImg, { Area } from "@/lib/crop-image"; 
import supabase from "@/lib/db";
import { toast } from "sonner";
import Image from "next/image";

interface EditMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBanner: string;
  onSuccess: () => void;
}

export default function EditProfileBannerDialog({ open, onOpenChange, currentBanner, onSuccess }: EditMediaDialogProps) {
  const [loading, setLoading] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // State Gambar Asli & Hasil Preview Setelah Crop
  const [bannerSrc, setBannerSrc] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>(currentBanner);

  // State Kustomisasi Posisi & Ukuran Banner (Rasio 16:9 atau Kompatibel)
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Tangkap file gambar banner dari komputer user
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageDataUrl = URL.createObjectURL(file);
      setBannerSrc(imageDataUrl); // Aktifkan mode editor kustomisasi banner
    }
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Ekstrak hasil potongan dan upload ke Supabase Storage
  const handleSaveBanner = async () => {
    if (!croppedAreaPixels || !bannerSrc) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi tidak ditemukan.");

      // Potong gambar berdasarkan koordinat UI canvas lokal
      const croppedBlob = await getCroppedImg(bannerSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Gagal memproses kustomisasi posisi banner.");

      const croppedFile = new File([croppedBlob], `banner-${Date.now()}.jpg`, { type: "image/jpeg" });

      // Upload ke bucket 'banners' di Supabase Storage
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("banners")
        .upload(fileName, croppedFile, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      // Ambil URL Publik
      const { data } = supabase.storage.from("banners").getPublicUrl(fileName);
      const newBannerUrl = data.publicUrl;

      // Sinkronisasikan ke tabel profiles di database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ banner_url: newBannerUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setBannerPreview(newBannerUrl);
      setBannerSrc(null); // Keluar dari mode editor cropper
      toast.success("Banner profil berhasil disesuaikan dan disimpan!");
      onSuccess();
    } catch (err: any) {
      console.error("Banner Upload Error:", err.message);
      toast.error(err.message || "Gagal memperbarui banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 rounded-3xl p-8 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FiImage className="text-blue-600" /> Sesuaikan Banner Profil
          </DialogTitle>
          <DialogDescription>
            Geser gambar secara vertikal/horizontal untuk menentukan posisi terbaik, lalu atur skala pembesaran di bawah.
          </DialogDescription>
        </DialogHeader>

        <input type="file" ref={bannerInputRef} onChange={handleBannerFileChange} accept="image/*" className="hidden" />

        {/* JIKA USER BELUM MEMILIH GAMBAR BANNER BARU */}
        {!bannerSrc ? (
          <div className="space-y-4 py-4">
            <div className="relative h-40 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
              <Image src={bannerPreview} alt="Banner Preview" fill className="object-cover" />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md"
              >
                <FiCamera /> Pilih Gambar Banner
              </button>
            </div>
          </div>
        ) : (
          /* MODE EDITOR PEMOTONG DAN PERGESERAN BANNER */
          <div className="space-y-6 mt-4">
            {/* Kontainer Cropper dengan Rasio Lanskap (16:9 atau bisa diganti 3:1) */}
            <div className="relative w-full h-48 bg-slate-950 rounded-2xl overflow-hidden">
              <Cropper
                image={bannerSrc}
                crop={crop}
                zoom={zoom}
                aspect={16 / 4} // Aspek rasio lanskap tipis ideal untuk banner profile
                cropShape="rect"
                showGrid={true}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Slider Pengatur Ukuran Zoom */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <FiMaximize2 /> Perbesar Gambar (Zoom)
              </label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-label="Zoom Banner"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        )}

        <DialogFooter className="pt-4 gap-3">
          <button
            type="button"
            onClick={() => bannerSrc ? setBannerSrc(null) : onOpenChange(false)}
            className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-colors"
          >
            {bannerSrc ? "Kembali" : "Batal"}
          </button>
          <button
            type="button"
            disabled={loading || !bannerSrc}
            onClick={handleSaveBanner}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            {loading ? <FiLoader className="animate-spin text-lg" /> : <><FiCheck /> Simpan Banner</>}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}