/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiArrowLeft, FiEye, FiEyeOff, FiLoader, FiLock, FiMail } from "react-icons/fi";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User tidak ditemukan");

      const { error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (profileError) throw profileError;

      toast.success("Selamat Datang Kembali di KaryaMandiri!");
      router.push("/general-dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Email atau kata sandi tidak valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Glow Ambient Behind Panel */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition mb-6 glass-capsule px-3.5 py-2 cursor-pointer"
        >
          <FiArrowLeft size={14} /> Kembali
        </button>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white text-center mb-2 tracking-tight">
          Masuk ke <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">KaryaMandiri</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center mb-8">
          Gunakan akun terdaftar Anda untuk mengakses dasbor dan proyek crowdsourcing
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
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

          {/* Password Input */}
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
            {loading ? (
              <FiLoader className="animate-spin text-lg" />
            ) : (
              "Masuk ke Akun"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          Belum memiliki akun?{" "}
          <Link
            href="/register"
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}