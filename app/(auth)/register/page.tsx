/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/db";
import { toast } from "sonner";
import { FiArrowLeft, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
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
      // Mendaftarkan user baru ke Supabase Auth
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          // Menyimpan data tambahan (Metadata) seperti nama lengkap ke tabel auth
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

      toast.success("Registrasi sukses! Silakan cek email untuk verifikasi.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Gagal melakukan registrasi.");
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

        <h2 className="text-2xl font-black text-slate-900 text-center mb-2">Gabung KaryaMandiri</h2>
        <p className="text-sm text-slate-500 text-center mb-8">Mulai cari kerja atau rekrut tenaga kerja sekarang</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Nama Lengkap</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              placeholder="Syahriza Ikhsan"
            />
          </div>

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
            <label className="text-xs font-bold text-slate-400 uppercase">Nomor Telepon</label>
            <input
              type="tel"
              required
              pattern="[0-9]*"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} // Hanya mengizinkan input angka
              className="w-full mt-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              placeholder="081234567890"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Daftar Sebagai</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-500 font-medium text-slate-700"
            >
              <option value="worker">Pekerja (Mencari Tugas/Project)</option>
              <option value="employer">Pemberi Kerja (Membuat Lowongan)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"} // Berubah dinamis tergantung state
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-12 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
              {/* Tombol Toggle Mata */}
              <button
                type="button" // Sangat penting agar tidak memicu submit form secara tidak sengaja
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
            {loading ? <FiLoader className="animate-spin text-lg" /> : "Daftar Akun"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Masuk di Sini
          </Link>
        </p>
      </div>
    </div>
  );
}