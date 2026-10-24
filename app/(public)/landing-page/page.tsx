"use client";

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiCpu, 
  FiShield, 
  FiZap, 
  FiX,
  FiMenu,
  FiHelpCircle,
  FiChevronDown,
  FiLayers,
  FiUsers,
  FiAward
} from 'react-icons/fi';
import Link from 'next/link';
import TopTalent from '@/components/landing-page/top-talent/page';
import ProjectAndServiceTrends from '@/components/landing-page/project-and-service-trends/page';
import TaskExploration from '@/components/landing-page/task-exploration/page';
import LiveImpactStatistics from '@/components/landing-page/live-impact-statistics/page';
import MobilePWAInstaller from '@/components/pwa/MobilePWAInstaller';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 overflow-x-hidden relative font-sans">
      
      {/* FLOATING CAPSULE NAVBAR */}
      <nav className="fixed top-4 inset-x-0 z-50 glass-capsule px-6 py-3 w-fit max-w-5xl mx-auto shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
        <div className="flex items-center justify-between w-full gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="text-base md:text-lg font-black tracking-wider bg-linear-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2 drop-shadow-sm">
            <FiZap className="text-blue-500 animate-pulse" /> KARYAMANDIRI
          </Link>

          {/* Menu Navigasi Tengah (Desktop) */}
          <div className="hidden md:flex items-center gap-1 text-xs lg:text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Link href="/general-dashboard" className="hover:text-blue-600 dark:hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/40 dark:hover:bg-white/5 transition-all">Ringkasan Platform</Link>
            <Link href="/jobs" className="hover:text-blue-600 dark:hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/40 dark:hover:bg-white/5 transition-all">Cari Lowongan</Link>
            <Link href="/services" className="hover:text-blue-600 dark:hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/40 dark:hover:bg-white/5 transition-all">Cari Jasa</Link>
          </div>

          {/* Tombol Login & Register (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-1.5 rounded-full transition-all">
              Masuk
            </Link>
            <Link href="/register" className="text-xs font-bold bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full transition-all shadow-[0_4px_20px_rgba(37,99,235,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95">
              Daftar Sekarang
            </Link>
          </div>

          {/* Tombol Menu (Mobile Toggle) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Tutup navigasi" : "Buka navigasi"}
            className="md:hidden text-slate-700 dark:text-slate-300 hover:text-slate-900 p-1.5 rounded-full transition focus:outline-none"
          >
            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Menu Navigasi Gantung (Mobile) */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="md:hidden absolute top-full left-0 w-full mt-3 glass-panel p-6 space-y-3 flex flex-col shadow-2xl rounded-3xl"
          >
            <Link href="/general-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 dark:text-slate-200 hover:text-blue-600 font-semibold text-sm px-3 py-2 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-all">Ringkasan Platform</Link>
            <Link href="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 dark:text-slate-200 hover:text-blue-600 font-semibold text-sm px-3 py-2 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-all">Cari Lowongan</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 dark:text-slate-200 hover:text-blue-600 font-semibold text-sm px-3 py-2 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-all">Cari Jasa</Link>
            <div className="h-px bg-slate-200/50 dark:bg-white/10 my-1" />
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center font-bold text-slate-800 dark:text-slate-200 py-2.5 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 border border-white/20 transition-all text-sm">
              Masuk
            </Link>
            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center font-bold bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl shadow-lg text-sm active:scale-98 transition-transform">
              Daftar Sekarang
            </Link>
          </motion.div>
        )}
      </nav>

      {/* HERO SECTION - REVEALING HIGH-POLY 3D BACKGROUND */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-6 pt-36 pb-20 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center z-10 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-capsule text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <FiZap className="animate-pulse" /> Revolusi Crowdsourcing Nusantara
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white"
          >
            Selesaikan Tugas Mikro <br />
            <span className="bg-linear-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
              Dengan Kecerdasan Massa
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            KaryaMandiri menghubungkan bisnis dengan ribuan talenta digital lokal untuk menyelesaikan verifikasi data, anotasi AI, riset pasar terdistribusi, hingga pekerjaan lapangan secara instan, aman, dan transparan.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
          >
            <Link 
              href="/jobs" 
              className="group px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-2xl transition-all shadow-[0_4px_25px_rgba(37,99,235,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center gap-2 w-full sm:w-auto justify-center text-sm hover:scale-105 active:scale-95"
            >
              Mulai Cari Uang <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-4 glass-card text-slate-800 dark:text-slate-200 font-bold rounded-2xl transition-all w-full sm:w-auto justify-center text-center text-sm hover:scale-105 active:scale-95"
            >
              Rekrut Massa (Employer)
            </Link>
          </motion.div>
        </div>
      </section>

      {/* DYNAMIC LIVE IMPACT DOCK */}
      <LiveImpactStatistics />

      {/* TRENDING PROJECTS & SERVICES */}
      <ProjectAndServiceTrends />

      {/* TASK EXPLORATION WORKSPACE */}
      <TaskExploration />

      {/* TOP VERIFIED PERFORMERS */}
      <TopTalent />

      {/* FITUR UTAMA BENTO GRID */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-blue-500">Kenapa Memilih Kami</h2>
          <p className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">Arsitektur Kerja Masa Depan</p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={fadeInUp} className="p-8 rounded-3xl glass-card flex flex-col justify-between group">
            <div>
              <div className="p-4 bg-blue-600/10 rounded-2xl w-fit text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <FiCpu size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Distribusi Tugas Cerdas</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                Sistem mikro memecah proyek kompleks korporasi menjadi pecahan sub-tugas independen otomatis yang langsung terdistribusi ke dasbor pekerja dalam hitungan detik.
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="p-8 rounded-3xl glass-card flex flex-col justify-between group">
            <div>
              <div className="p-4 bg-purple-600/10 rounded-2xl w-fit text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <FiCheckCircle size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Sistem Validasi Berlapis</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                Menerapkan metode <span className='italic font-medium'>Peer-Review</span> silang yang ketat di database Supabase. Setiap hasil dikonfirmasi acak oleh sesama pekerja ahli sebelum dana dilepaskan.
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="p-8 rounded-3xl glass-card flex flex-col justify-between group">
            <div>
              <div className="p-4 bg-emerald-600/10 rounded-2xl w-fit text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <FiShield size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Escrow Dana Real-time</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                Jaminan mutlak bagi <span className='italic font-medium'>Employer</span> maupun <span className='italic font-medium'>Worker</span>. Dana proyek ditahan aman di sistem escrow digital dan otomatis dikreditkan ke saldo akun pengguna saat tugas tervalidasi.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* SEKTOR PEKERJAAN */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="glass-panel p-8 md:p-14 rounded-3xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase">Fleksibilitas Klaster Ekonomi</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Apapun Keahlian Anda, Selalu Ada Tugas</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs md:text-sm">
                Ekosistem crowdsourcing kami distrukturisasi ke dalam sektor strategis nasional untuk mempermudah pengerjaan tugas mikro serta meningkatkan akurasi analisis data bisnis Anda.
              </p>
              <div className="space-y-3.5">
                {[
                  { title: 'Sektor Produksi Kreatif', desc: 'Pembuatan esai, transkripsi audio, penerjemahan, dan jurnalisme mikro.' },
                  { title: 'Sektor Jasa & Riset', desc: 'Riset pasar terdistribusi, pengisian kuesioner produk, dan audit lapangan.' },
                  { title: 'Sektor Logistik & Data', desc: 'Entri data masal, anotasi objek AI, serta kurasi visual e-commerce.' },
                  { title: 'Sektor Teknologi & QA', desc: 'Uji fungsionalitas UI, pelaporan bug aplikasi, dan QA perangkat lunak.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <FiCheckCircle className="text-blue-500 shrink-0 mt-0.5" /> 
                    <div>
                      <span className="font-bold">{item.title}</span> — <span className="text-slate-500 dark:text-slate-400 font-normal">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Liquid Node Showcase Frame */}
            <div className="relative w-full h-80 flex items-center justify-center">
              <div className="relative flex items-center justify-center w-full">
                <div className="w-56 h-56 rounded-full bg-blue-500/20 blur-3xl absolute animate-pulse pointer-events-none" />
                <div className="relative w-48 h-48 glass-panel rounded-3xl flex flex-col items-center justify-center p-6 text-center shadow-xl border border-white/40 dark:border-white/10">
                  <div className="w-12 h-12 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-3 shadow-md">
                    <FiLayers size={24} />
                  </div>
                  <span className="font-black text-slate-900 dark:text-white text-sm tracking-wide">
                    Karya Mandiri
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider mt-1">
                    Decentralized Hub
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
            <FiHelpCircle /> Pusat Informasi
          </h2>
          <p className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Sering Ditanyakan</p>
        </div>

        <div className="space-y-4">
          {[
            { q: "Bagaimana cara mencairkan saldo komisi di KaryaMandiri?", a: "Pekerja dapat mencairkan dana langsung dari halaman privasi akun setelah nominal tugas tervalidasi oleh sistem. Kami mendukung penarikan ke berbagai rekening bank utama Indonesia (seperti BCA) serta integrasi dompet digital." },
            { q: "Bagaimana platform ini menjamin keaslian data yang diserahkan pekerja?", a: "Kami menggunakan mekanisme validasi berlapis dan peer-review terdistribusi. Setiap data micro-task akan diperiksa secara silang oleh algoritmik sistem dan dikonfirmasi kebenarannya oleh kontributor terverifikasi lain sebelum status tugas dinyatakan sukses." },
            { q: "Apakah ada biaya pendaftaran untuk mulai bekerja?", a: "Sama sekali tidak ada. Menjadi Worker di KaryaMandiri 100% gratis. Anda hanya perlu mendaftar, melengkapi berkas profil keahlian Anda, dan langsung bisa mengklaim tugas mikro yang tersedia." }
          ].map((faq, idx) => (
            <div key={idx} className="glass-card rounded-2xl overflow-hidden">
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-5 sm:p-6 flex justify-between items-center font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white text-xs sm:text-sm focus:outline-none"
              >
                <span>{faq.q}</span>
                <FiChevronDown size={16} className={`text-slate-500 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/40 dark:border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="glass-panel p-8 md:p-16 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Siap Memaksimalkan Potensi Anda?</h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs md:text-base max-w-xl mx-auto leading-relaxed">
            Bergabunglah dengan ekosistem digital inklusif terbesar di Indonesia sekarang. Ambil kendali penuh atas proyek data Anda atau raih penghasilan tambahan secara fleksibel.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="px-8 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-[0_4px_20px_rgba(37,99,235,0.35)] hover:scale-105 active:scale-95">
              Mulai Daftar Akun
            </Link>
            <Link href="/general-dashboard" className="px-8 py-3.5 glass-card text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm rounded-xl transition hover:scale-105 active:scale-95">
              Eksplor Dasbor Umum
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 glass-panel border-x-0 border-b-0 text-center text-xs text-slate-500 dark:text-slate-400 px-6">
        <p className="mb-2 font-semibold">Hak Cipta 2026 <span className='text-blue-600 dark:text-blue-400'>KaryaMandiri Syahriza</span>. Seluruh Hak Dilindungi.</p>
        <p>Built with 
          <Link href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 font-medium"> Next.js</Link>,
          <Link href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 font-medium"> Tailwind CSS</Link>, and 
          <Link href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 font-medium"> Supabase Server Architecture</Link>.
        </p>
      </footer>

      <MobilePWAInstaller />
    </div>
  );
}