"use client";

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiCpu, 
  FiShield, 
  FiZap, 
  FiTrendingUp, 
  FiUsers, 
  FiBriefcase, 
  FiX,
  FiMenu
} from 'react-icons/fi';
import Link from 'next/link';

// Varian Animasi untuk Efek Fade-up sekuensial (Staggered)
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden relative">
      
      {/* Ornamen Background Futuristik (Neon Glow) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-125 h-125 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

      <nav className="fixed top-4 inset-x-0 z-50 bg-slate-450/70 backdrop-blur-xl border border-slate-400 px-6 py-4 w-fit mx-auto rounded-full shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between lg:gap-32 w-fit">
          {/* Logo */}
          <Link href="/" className="text-xl font-black tracking-wider bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2 mr-6 lg:mr-0">
            <FiZap className="text-blue-500 fill-blue-500/20" /> KARYAMANDIRI
          </Link>

          {/* Menu Navigasi Tengah (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link href="/general-dashboard" className="hover:text-white transition">Ringkasan Platform</Link>
            <Link href="/jobs" className="hover:text-white transition">Cari Lowongan</Link>
            <Link href="/services" className="hover:text-white transition">Cari Jasa</Link>
          </div>

          {/* Tombol Login & Register (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-bold text-slate-300 hover:text-white px-4 py-2 transition"
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition shadow-[0_0_20px_rgba(37,99,235,0.2)]"
            >
              Daftar Sekarang
            </Link>
          </div>

          {/* Tombol Menu (Mobile Toggle) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Menu Navigasi Gantung (Mobile) */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-slate-950 border-b border-slate-900 px-6 py-6 space-y-4 flex flex-col shadow-2xl"
          >
            <Link href="/general-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white font-medium">Ringkasan Platform</Link>
            <Link href="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white font-medium">Cari Lowongan</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white font-medium">Cari Jasa</Link>
            <div className="h-px bg-slate-900 my-2" />
            <Link 
              href="/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center font-bold text-slate-300 py-2 rounded-xl hover:bg-slate-900 transition"
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center font-bold bg-blue-600 text-white py-3 rounded-xl shadow-lg"
            >
              Daftar Sekarang
            </Link>
          </motion.div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-24 pb-12 overflow-hidden border-b border-slate-900">
        <div className="max-w-5xl mx-auto text-center z-10 space-y-8">
          
          {/* Badge Beranimasi */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-semibold uppercase tracking-wider"
          >
            <FiZap className="animate-pulse" /> Revolusi Crowdsourcing Indonesia
          </motion.div>

          {/* Judul Utama */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-slate-200 to-slate-500"
          >
            Selesaikan Tugas Mikro <br />
            <span className="bg-linear-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text">
              Dengan Kecerdasan Massa
            </span>
          </motion.h1>

          {/* Deskripsi */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-base md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            KaryaMandiri menghubungkan bisnis dengan ribuan talenta digital lokal untuk menyelesaikan verifikasi data, pelabelan AI, riset pasar, hingga tugas lapangan secara instan dan transparan.
          </motion.p>

          {/* Tombol Aksi (CTA) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link 
              href="/jobs" 
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition shadow-[0_0_30px_rgba(37,99,235,0.3)] flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Mulai Cari Uang <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-2xl transition w-full sm:w-auto justify-center text-center"
            >
              Rekrut Massa (Employer)
            </Link>
          </motion.div>
        </div>

        {/* Garis Grid Transparan ala Sci-Fi */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-60" />
      </section>

      {/* STATISTIK LIVE IMPACT */}
      <section className="py-12 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { icon: <FiUsers className="text-blue-500 mx-auto" size={24} />, value: "50,000+", label: "Worker Aktif" },
              { icon: <FiBriefcase className="text-purple-500 mx-auto" size={24} />, value: "1.2 Juta+", label: "Tugas Selesai" },
              { icon: <FiZap className="text-yellow-500 mx-auto" size={24} />, value: "Rp4.5 Miliar+", label: "Total Terbayar" },
              { icon: <FiTrendingUp className="text-emerald-500 mx-auto" size={24} />, value: "99.4%", label: "Akurasi Data (QA)" }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="space-y-2">
                {stat.icon}
                <h3 className="text-2xl md:text-4xl font-extrabold text-white">{stat.value}</h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FITUR UTAMA FUTURISTIK */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-blue-500">Kenapa Memilih Kami</h2>
          <p className="text-3xl md:text-5xl font-bold">Arsitektur Kerja Masa Depan</p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-all group hover:shadow-[0_0_30px_rgba(37,99,235,0.1)]">
            <div className="p-4 bg-blue-600/10 rounded-2xl w-fit text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <FiCpu size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Distribusi Tugas Cerdas</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Algoritma AI kami memecah proyek besar menjadi ribuan micro-tasks otomatis dan mendistribusikannya ke pekerja yang tepat dalam hitungan detik.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/50 transition-all group hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            <div className="p-4 bg-purple-600/10 rounded-2xl w-fit text-purple-500 mb-6 group-hover:scale-110 transition-transform">
              <FiCheckCircle size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Sistem Validasi Berlapis</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Setiap hasil divalidasi silang oleh sesama pekerja (Peer-Review) sebelum disetujui, menjamin tingkat akurasi hingga di atas 99%.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 transition-all group hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="p-4 bg-emerald-600/10 rounded-2xl w-fit text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
              <FiShield size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Pembayaran Instan & Aman</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Didukung integrasi dompet digital dan sistem escrow Supabase yang andal. Selesaikan tugas Anda, raih validasi, dan cairkan saldo secara instan.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* SEKTOR PEKERJAAN */}
      <section className="py-20 bg-slate-900/30 border-t border-b border-slate-900 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold tracking-widest text-purple-500 uppercase">Fleksibilitas Tanpa Batas</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Apapun Keahlian Anda, Selalu Ada Tugas Menanti</h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Kami membagi ekosistem ke dalam sektor-sektor strategis nasional untuk mempermudah pengerjaan dan efisiensi pelaporan industri.
            </p>
            <div className="space-y-3">
              {['Sektor Produksi (Karya Tulis & Konten)', 'Sektor Jasa (Riset Pasar & Survei)', 'Sektor Logistik (Entri Data Terdistribusi)', 'Sektor Konstruksi (Uji Coba Aplikasi/QA)'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                  <FiCheckCircle className="text-blue-500 shrink-0" /> {item}
                </div>
              ))}
            </div>
          </div>
          
          {/* Ilustrasi Kotak Abstrak Futuristik Bermutasi/Animasi */}
          <div className="relative w-full h-80 flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-64 h-64 border-2 border-dashed border-blue-500/20 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-48 h-48 border border-purple-500/30 rounded-3xl"
            />
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-36 h-36 bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.4)] flex items-center justify-center p-6 text-center text-xs font-bold text-white tracking-wider uppercase"
            >
              Karya Mandiri Node
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-900 text-center text-xs text-slate-600 px-6">
        <p className="mb-2 font-semibold text-slate-500">© 2026 KaryaMandiri Syahriza. Hak Cipta Dilindungi.</p>
        <p>Built with Next.js, Tailwind CSS and Supabase Server Architecture.</p>
      </footer>
    </div>
  );
}