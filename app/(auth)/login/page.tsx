/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiArrowLeft, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Proses login menggunakan Email dan Password ke Supabase
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

      toast.success("Selamat Datang Kembali!");
      router.push("/general-dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition mb-6 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl"
        >
          <FiArrowLeft size={14} /> Kembali
        </button>

        <h2 className="text-2xl font-black text-slate-900 text-center mb-2">Masuk ke KaryaMandiri</h2>
        <p className="text-sm text-slate-500 text-center mb-8">Gunakan akun terdaftarmu untuk mengakses layanan</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"} // Mengubah tipe secara dinamis
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-12 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
              {/* Tombol Toggle Mata */}
              <button
                type="button" // Batalkan tipe default submit agar tidak memicu form submission
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition focus:outline-none"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 mt-2 shadow-md"
          >
            {loading ? <FiLoader className="animate-spin text-lg" /> : "Masuk"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}