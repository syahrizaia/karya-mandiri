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
} from 'react-icons/fi';
import Link from 'next/link';
import TopTalent from '@/components/top-talent/page';
import ProjectAndServiceTrends from '@/components/project-and-service-trends/page';
import TaskExploration from '@/components/task-exploration/page';
import LiveImpactStatistics from '@/components/live-impact-statistics/page';

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
      staggerChildren: 0.15
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
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden relative font-sans">
      
      {/* Ornamen Background Futuristik (Neon Glow) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-125 h-125 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="fixed top-4 inset-x-0 z-50 bg-slate-950/35 backdrop-blur-2xl border border-white/10 border-t-white/25 border-l-white/20 px-6 py-3.5 w-fit max-w-5xl mx-auto rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.15)] transition-all duration-500 hover:bg-slate-950/45">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="text-lg md:text-xl font-black tracking-wider bg-linear-to-r from-blue-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2 drop-shadow-[0_2px_10px_rgba(56,189,248,0.3)] pr-6 md:pr-10">
            <FiZap className="text-blue-400 fill-blue-400/20 animate-pulse" /> KARYAMANDIRI
          </Link>

          {/* Menu Navigasi Tengah (Desktop) */}
          <div className="hidden md:flex items-center gap-1 text-xs lg:text-sm font-semibold text-slate-400">
            <Link href="/general-dashboard" className="hover:text-white hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300">Ringkasan Platform</Link>
            <Link href="/jobs" className="hover:text-white hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300">Cari Lowongan</Link>
            <Link href="/services" className="hover:text-white hover:bg-white/5 px-4 py-2 rounded-full transition-all duration-300">Cari Jasa</Link>
          </div>

          {/* Tombol Login & Register (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-300 hover:text-white px-4 py-2 rounded-full hover:bg-white/5 transition-all duration-300">
              Masuk
            </Link>
            <Link href="/register" className="text-xs font-bold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95">
              Daftar Sekarang
            </Link>
          </div>

          {/* Tombol Menu (Mobile Toggle) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/5 transition focus:outline-none"
          >
            {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Menu Navigasi Gantung (Mobile) - LIQUIDGLASS DROPDOWN */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="md:hidden absolute top-full left-0 w-full mt-4 bg-slate-950/80 backdrop-blur-3xl border border-white/10 border-t-white/20 p-6 space-y-4 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-3xl"
          >
            <Link href="/general-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-200 hover:text-white font-semibold text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition-all">Ringkasan Platform</Link>
            <Link href="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-200 hover:text-white font-semibold text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition-all">Cari Lowongan</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-200 hover:text-white font-semibold text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition-all">Cari Jasa</Link>
            <div className="h-px bg-white/10 my-1" />
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center font-bold text-slate-200 py-2.5 rounded-xl hover:bg-white/5 border border-white/5 transition-all text-sm">
              Masuk
            </Link>
            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center font-bold bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl shadow-lg text-sm active:scale-98 transition-transform">
              Daftar Sekarang
            </Link>
          </motion.div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-16 overflow-hidden border-b border-slate-900">
        <div className="max-w-5xl mx-auto text-center z-10 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-semibold uppercase tracking-wider"
          >
            <FiZap className="animate-pulse" /> Revolusi Crowdsourcing Indonesia
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-slate-200 to-slate-500 leading-tight"
          >
            Selesaikan Tugas Mikro <br />
            <span className="bg-linear-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text">
              Dengan Kecerdasan Massa
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-sm md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            KaryaMandiri menghubungkan bisnis dengan ribuan talenta digital lokal untuk menyelesaikan verifikasi data, pelabelan AI, riset pasar, hingga tugas lapangan secara instan, aman, dan transparan.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link 
              href="/jobs" 
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition shadow-[0_0_30px_rgba(37,99,235,0.3)] flex items-center gap-2 w-full sm:w-auto justify-center text-sm"
            >
              Mulai Cari Uang <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-2xl transition w-full sm:w-auto justify-center text-center text-sm"
            >
              Rekrut Massa (Employer)
            </Link>
          </motion.div>
        </div>

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-40" />
      </section>

      <LiveImpactStatistics />

      <ProjectAndServiceTrends />

      <TaskExploration />

      <TopTalent />

      {/* FITUR UTAMA */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-b border-slate-900">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-blue-500">Kenapa Memilih Kami</h2>
          <p className="text-3xl md:text-5xl font-extrabold tracking-tight">Arsitektur Kerja Masa Depan</p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-all group hover:shadow-[0_0_30px_rgba(37,99,235,0.1)]">
            <div className="p-4 bg-blue-600/10 rounded-2xl w-fit text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <FiCpu size={26} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Distribusi Tugas Cerdas</h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Sistem mikro memecah proyek kompleks korporasi menjadi pecahan sub-tugas independen otomatis yang langsung terdistribusi ke dasbor pekerja dalam hitungan detik.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/50 transition-all group hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            <div className="p-4 bg-purple-600/10 rounded-2xl w-fit text-purple-500 mb-6 group-hover:scale-110 transition-transform">
              <FiCheckCircle size={26} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sistem Validasi Berlapis</h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Menerapkan metode <span className='italic'>Peer-Review</span> silang yang ketat di database Supabase. Setiap hasil dikonfirmasi acak oleh sesama pekerja ahli sebelum dana dilepaskan.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 transition-all group hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="p-4 bg-emerald-600/10 rounded-2xl w-fit text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
              <FiShield size={26} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Escrow Dana Real-time</h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Jaminan mutlak bagi <span className='italic'>Employer</span> maupun <span className='italic'>Worker</span>. Dana proyek ditahan aman di sistem escrow digital dan otomatis dikreditkan ke saldo akun pengguna saat tugas tervalidasi.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* SEKTOR PEKERJAAN */}
      <section className="py-24 bg-slate-900/20 border-b border-slate-900 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold tracking-widest text-purple-500 uppercase">Fleksibilitas Klaster Ekonomi</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">Apapun Keahlian Anda, Selalu Ada Tugas</h2>
            <p className="text-slate-400 leading-relaxed text-xs md:text-sm">
              Ekosistem crowdsourcing kami distrukturisasi ke dalam sektor strategis nasional untuk mempermudah pengerjaan tugas mikro serta meningkatkan akurasi analisis data bisnis Anda.
            </p>
            <div className="space-y-3">
              {[
                { title: 'Sektor Production', desc: 'Pembuatan esai, transkripsi audio, penerjemahan, dan jurnalisme mikro.' },
                { title: 'Sektor Jasa', desc: 'Riset pasar terdistribusi, pengisian kuesioner produk, dan audit lapangan.' },
                { title: 'Sektor Logistik', desc: 'Entri data masal, anotasi objek AI, serta kurasi visual e-commerce.' },
                { title: 'Sektor Construction', desc: 'Uji fungsionalitas UI, pelaporan bug aplikasi, dan QA perangkat lunak.' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-xs md:text-sm font-semibold text-slate-300">
                  <FiCheckCircle className="text-blue-500 shrink-0 mt-0.5" /> 
                  <div>
                    <span className="text-white font-bold">{item.title}</span> — <span className="text-slate-400 font-normal">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Ilustrasi Kotak Abstrak Futuristik */}
          <div className="relative w-full h-80 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute w-64 h-64 border-2 border-dashed border-blue-500/20 rounded-full" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute w-48 h-48 border border-purple-500/30 rounded-3xl" />

            <div className="relative flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-36 h-36 bg-blue-500 rounded-3xl blur-2xl mix-blend-screen"
              />
              <motion.div 
                animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-32 h-32 bg-indigo-500 rounded-3xl blur-md mix-blend-screen"
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 40px 10px rgba(37,99,235,0.5), 0 0 80px 20px rgba(99,102,241,0.3)",
                    "0 0 70px 25px rgba(37,99,235,0.8), 0 0 110px 35px rgba(99,102,241,0.5)",
                    "0 0 40px 10px rgba(37,99,235,0.5), 0 0 80px 20px rgba(99,102,241,0.3)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-36 h-36 bg-linear-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl border border-blue-400/40 flex items-center justify-center p-6 text-center text-xs font-black text-white tracking-wider uppercase z-10"
              >
                <span className="filter drop-shadow-sm">
                  Karya Mandiri Node
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="py-24 px-6 max-w-4xl mx-auto border-b border-slate-900">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-400 flex items-center justify-center gap-1">
            <FiHelpCircle /> Pusat Informasi
          </h2>
          <p className="text-2xl md:text-4xl font-extrabold tracking-tight">Sering Ditanyakan</p>
        </div>

        <div className="space-y-4">
          {[
            { q: "Bagaimana cara mencairkan saldo komisi di KaryaMandiri?", a: "Pekerja dapat mencairkan dana langsung dari halaman privasi akun setelah nominal tugas tervalidasi oleh sistem. Kami mendukung penarikan ke berbagai rekening bank utama Indonesia (seperti BCA) serta integrasi dompet digital." },
            { q: "Bagaimana platform ini menjamin keaslian data yang diserahkan pekerja?", a: "Kami menggunakan mekanisme validasi berlapis dan peer-review terdistribusi. Setiap data micro-task akan diperiksa secara silang oleh algoritmik sistem dan dikonfirmasi kebenarannya oleh kontributor terverifikasi lain sebelum status tugas dinyatakan sukses." },
            { q: "Apakah ada biaya pendaftaran untuk mulai bekerja?", a: "Sama sekali tidak ada. Menjadi Worker di KaryaMandiri 100% gratis. Anda hanya perlu mendaftar, melengkapi berkas profil keahlian Anda, dan langsung bisa mengklaim tugas mikro yang tersedia." }
          ].map((faq, idx) => (
            <div key={idx} className="bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden transition-colors">
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-5 sm:p-6 flex justify-between items-center font-bold text-slate-200 hover:text-white text-xs sm:text-sm focus:outline-none"
              >
                <span>{faq.q}</span>
                <FiChevronDown size={16} className={`text-slate-500 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-400 leading-relaxed animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-24 px-6 max-w-5xl mx-auto relative text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-indigo-600/10 rounded-3xl blur-xl -z-10" />
        <div className="bg-slate-900/40 border border-slate-800 p-8 md:p-16 rounded-3xl space-y-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl" />
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Ready to Leverage the Crowd?</h2>
          <p className="text-slate-400 text-xs md:text-base max-w-xl mx-auto leading-relaxed">
            Bergabunglah dengan ekosistem digital inklusif terbesar di Indonesia sekarang. Ambil kendali penuh atas proyek data Anda atau raih penghasilan tambahan secara fleksibel.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-lg">
              Mulai Daftar Akun
            </Link>
            <Link href="/general-dashboard" className="px-8 py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs sm:text-sm rounded-xl transition">
              Eksplor Dasbor Umum
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-900 text-center text-xs text-slate-600 px-6">
        <p className="mb-2 font-semibold text-slate-500">© 2026 <span className='text-blue-600'>KaryaMandiri Syahriza</span>. Hak Cipta Dilindungi.</p>
        <p>Built with 
          <Link href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600"> Next.js</Link>,
          <Link href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600"> Tailwind CSS</Link>, and 
          <Link href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600"> Supabase Server Architecture</Link>.
        </p>
      </footer>
    </div>
  );
}