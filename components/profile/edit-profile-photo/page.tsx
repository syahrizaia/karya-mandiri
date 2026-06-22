/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { FiLoader, FiCamera, FiImage, FiCheck, FiMaximize2 } from "react-icons/fi";
import Image from "next/image";
import supabase from "@/lib/db";
import { toast } from "sonner";
import getCroppedImg, { Area } from "@/lib/crop-image";
import Cropper from "react-easy-crop";

interface EditMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar: string;
  onSuccess: () => void;
}

export default function EditProfilePhotoDialog({ 
  open, 
  onOpenChange, 
  currentAvatar, 
  onSuccess 
}: EditMediaDialogProps) {
  const [loading, setLoading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  const [avatarPreview, setAvatarPreview] = useState<string>(currentAvatar);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageDataUrl = URL.createObjectURL(file);
      setImageSrc(imageDataUrl);
    }
  };

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveMedia = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi tidak ditemukan.");

      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Gagal memproses potongan gambar.");

      const croppedFile = new File([croppedBlob], `avatar-${Date.now()}.jpg`, { type: "image/jpeg" });

      const fileName = `${user.id}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, croppedFile, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      const newAvatarUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: newAvatarUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarPreview(newAvatarUrl);
      setImageSrc(null);
      toast.success("Foto profil berhasil dikustomisasi dan disimpan!");
      onSuccess();
      window.location.reload();
    } catch (err: any) {
      console.error("Upload Error:", err.message);
      toast.error(err.message || "Gagal mengunggah gambar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-137.5 rounded-3xl p-8 border-none shadow-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FiImage className="text-blue-600 dark:text-blue-400" /> Sesuaikan Foto Profil
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Geser untuk menyesuaikan posisi dan gunakan slider di bawah untuk mengatur ukuran zoom.
          </DialogDescription>
        </DialogHeader>

        <input type="file" ref={avatarInputRef} onChange={onFileChange} accept="image/*" className="hidden" />

        {!imageSrc ? (
          <div className="flex flex-col items-center py-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-inner group">
              <Image src={avatarPreview} alt="Avatar" fill className="object-cover" />
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <FiCamera /> Pilih Foto Baru
            </button>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            <div className="relative w-full h-64 bg-slate-950 rounded-2xl overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                <FiMaximize2 /> Ukuran Gambar (Zoom)
              </label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        )}

        <DialogFooter className="pt-4 gap-3">
          <button
            type="button"
            onClick={() => imageSrc ? setImageSrc(null) : onOpenChange(false)}
            className="px-6 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer"
          >
            {imageSrc ? "Kembali" : "Batal"}
          </button>
          <button
            type="button"
            disabled={loading || !imageSrc}
            onClick={handleSaveMedia}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            {loading ? <FiLoader className="animate-spin text-lg" /> : <><FiCheck /> Simpan Potongan</>}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}