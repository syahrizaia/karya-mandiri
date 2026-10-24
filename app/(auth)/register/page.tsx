/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/db";
import { toast } from "sonner";
import { FiArrowLeft, FiEye, FiEyeOff, FiLoader, FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("worker");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            role: role,
            location: '',
            avatar_url: '',
          },
        },
      });

      if (error) throw error;

      toast.success("Registrasi berhasil! Silakan cek kotak masuk email Anda untuk verifikasi.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Gagal melakukan registrasi akun.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition mb-6 glass-capsule px-3.5 py-2 cursor-pointer"
        >
          <FiArrowLeft size={14} /> Kembali
        </button>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white text-center mb-2 tracking-tight">
          Gabung <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">KaryaMandiri</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center mb-8">
          Mulai mencari peluang kerja atau rekrut tenaga kerja mikro sekarang
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FiUser /> Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition font-medium"
              placeholder="Syahriza Ikhsan"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FiMail /> Alamat Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition font-medium"
              placeholder="nama@email.com"
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FiPhone /> Nomor Telepon / WhatsApp
            </label>
            <input
              type="tel"
              required
              pattern="[0-9]*"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="glass-input w-full px-4 py-3 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition font-medium"
              placeholder="081234567890"
            />
          </div>

          {/* Role Select */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Daftar Sebagai
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-2xl text-sm text-slate-700 dark:text-slate-200 outline-none transition font-medium cursor-pointer"
            >
              <option value="worker" className="dark:bg-slate-900">Mitra Mandiri (Mencari Tugas & Proyek)</option>
              <option value="employer" className="dark:bg-slate-900">Pemberi Kerja (Membuat Lowongan & Proyek)</option>
            </select>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FiLock /> Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pr-12 px-4 py-3 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition font-medium"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus:outline-none cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition duration-300 shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? <FiLoader className="animate-spin text-lg" /> : "Daftar Akun Baru"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-8">
          Sudah memiliki akun?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition">
            Masuk di Sini
          </Link>
        </p>
      </div>
    </div>
  );
}