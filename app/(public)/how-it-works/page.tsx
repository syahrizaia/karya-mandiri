"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiBriefcase, 
  FiLayers, 
  FiCheckCircle, 
  FiTrendingUp, 
  FiShield, 
  FiCpu, 
  FiArrowRight, 
  FiZap 
} from 'react-icons/fi';
import Link from 'next/link';

interface IStep {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const CaraKerjaCrowd: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'worker' | 'employer'>('worker');

  const workerSteps: IStep[] = [
    {
      number: "01",
      title: "Pilih Tugas Mikro (Micro-tasks)",
      description: "Cari dan pilih tugas-tugas kecil di katalog yang sesuai dengan minat atau keahlian Anda—mulai dari input data, kurasi foto, anotasi AI, hingga pengumpulan informasi lapangan.",
      icon: <FiLayers />
    },
    {
      number: "02",
      title: "Pahami Instruksi & Kerjakan",
      description: "Baca lembar spesifikasi proyek (RFS) dengan cermat. Selesaikan tugas langsung melalui ponsel atau komputer Anda sesuai tenggat waktu yang ditentukan sistem.",
      icon: <FiZap />
    },
    {
      number: "03",
      title: "Kirim Bukti Hasil Kerja",
      description: "Unggah hasil akhir berupa file dokumen, screenshot, atau tautan digital ke platform sebagai bukti valid bahwa Anda telah merampungkan tugas dengan benar.",
      icon: <FiCheckCircle />
    },
    {
      number: "04",
      title: "Pencairan Dana Otomatis",
      description: "Setelah hasil kerja diverifikasi oleh sistem atau Employer, dana upah dari Rekening Bersama (Escrow) akan langsung mencair ke saldo dompet akun Anda tanpa potongan tersembunyi.",
      icon: <FiShield />
    }
  ];

  const employerSteps: IStep[] = [
    {
      number: "01",
      title: "Pecah Proyek Menjadi Skala Mikro",
      description: "Unggah proyek besar Anda (misal: survei 1000 data, pengetikan massal, atau moderasi konten) dan pecah menjadi ratusan tugas kecil dengan panduan yang jelas.",
      icon: <FiCpu />
    },
    {
      number: "02",
      title: "Alokasikan Dana ke Rekening Escrow",
      description: "Lakukan deposit anggaran total proyek ke sistem pembayaran Escrow KaryaMandiri. Dana Anda aman terkunci untuk menjamin transparansi bagi para pekerja crowd.",
      icon: <FiShield />
    },
    {
      number: "03",
      title: "Crowd Bekerja Secara Paralel",
      description: "Ratusan Mitra Mandiri terverifikasi di seluruh Indonesia akan mengambil dan menyelesaikan tugas-tugas mikro tersebut secara bersamaan, membuat proyek selesai 10x lebih cepat.",
      icon: <FiTrendingUp />
    },
    {
      number: "04",
      title: "Validasi Massal & Terima Hasil",
      description: "Pantau progres lewat dasbor analitik. Setujui hasil kerja yang sesuai spek, dan biarkan sistem mendistribusikan pembayaran upah secara otomatis kepada pekerja crowd.",
      icon: <FiBriefcase />
    }
  ];

  return (
    <div className="min-h-screen pb-24 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* HERO SECTION */}
      <section className="py-12 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="glass-capsule text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 px-3.5 py-1.5 inline-flex items-center gap-2">
            <FiCpu className="text-sm" /> Model Bisnis Crowdsourcing Modern
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Bagaimana Cara Kerja <br className="hidden md:block"/> Skema <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">Crowdsourcing</span>?
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            KaryaMandiri membagi proyek besar menjadi ribuan tugas mikro digital terdistribusi. Memberdayakan sektor informal sekaligus memberikan efisiensi biaya dan kecepatan bagi pemberi kerja.
          </p>

          {/* INTERACTIVE TAB SWITCHER TOGGLE */}
          <div className="glass-capsule p-1.5 w-full max-w-md mx-auto flex gap-1 mt-6 shadow-lg">
            <button
              onClick={() => setActiveTab('worker')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'worker'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
              }`}
            >
              <FiUser /> Sebagai Mitra (Crowd)
            </button>
            <button
              onClick={() => setActiveTab('employer')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'employer'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
              }`}
            >
              <FiBriefcase /> Sebagai Pemberi Kerja
            </button>
          </div>
        </div>
      </section>

      {/* TIMELINE / STEP BY STEP PROCESS SECTION */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-4">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {(activeTab === 'worker' ? workerSteps : employerSteps).map((step, index) => (
              <div 
                key={index} 
                className="glass-card rounded-3xl p-6 flex flex-col justify-between h-[300px] group transition duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 glass-capsule text-blue-600 dark:text-blue-400 text-lg group-hover:scale-110 transition duration-300">
                      {step.icon}
                    </div>
                    <span className="text-3xl font-black text-slate-200 dark:text-white/10 tracking-wider">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 dark:text-white text-base mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-200">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-4">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CORE FEATURES INFOGRAPHIC CARD */}
        <section className="glass-panel rounded-3xl p-6 md:p-10 mt-12 shadow-lg">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-center md:text-left">
            Tiga Pilar Utama Ekosistem KaryaMandiri
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 glass-capsule bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-black text-sm rounded-xl flex items-center justify-center">
                01
              </div>
              <h4 className="font-black text-slate-900 dark:text-white text-base">Sistem Escrow Terjamin</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Uang jaminan dari Employer dikunci aman sebelum tugas didistribusikan. Tidak ada lagi risiko kerjaan fiktif bagi pekerja informal maupun risiko hilangnya dana bagi pemberi kerja.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 glass-capsule bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 font-black text-sm rounded-xl flex items-center justify-center">
                02
              </div>
              <h4 className="font-black text-slate-900 dark:text-white text-base">Distribusi Massal Instan</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Didukung ribuan mitra crowdsourcing bersertifikasi KYC di seluruh nusantara. Tugas bervolume raksasa dapat dipecah secara merata dan selesai dalam hitungan jam.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 glass-capsule bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 font-black text-sm rounded-xl flex items-center justify-center">
                03
              </div>
              <h4 className="font-black text-slate-900 dark:text-white text-base">Inklusi Finansial Adil</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Kami berkomitmen memberdayakan pekerja lepas sektor informal dengan model bagi hasil yang transparan, bebas komisi eksploitatif, serta mendukung penarikan e-wallet lokal.
              </p>
            </div>
          </div>
        </section>

        {/* DYNAMIC CALL TO ACTION (CTA) */}
        <section className="glass-panel p-8 md:p-12 mt-12 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-slate-900/60 shadow-2xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-xl md:text-3xl font-black text-white tracking-tight">
              {activeTab === 'worker' 
                ? 'Siap Menghasilkan Pendapatan Mandiri?' 
                : 'Mulai Skalakan Operasional Bisnis Anda'
              }
            </h3>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              {activeTab === 'worker'
                ? 'Daftar sekarang sebagai Mitra Mandiri terverifikasi, selesaikan tugas mikro digital dari rumah, dan bangun reputasi kerja Anda secara transparan.'
                : 'Bergabung bersama ratusan perusahaan yang mempercayakan validasi data, input massal, dan crowdsourcing operasionalnya ke jaringan terpercaya KaryaMandiri.'
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            {activeTab === 'worker' ? (
              <Link
                href="/jobs"
                className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-950 font-black text-sm rounded-2xl text-center flex items-center justify-center gap-2 transition active:scale-95 shadow-lg cursor-pointer"
              >
                Jelajahi Lowongan Kerja <FiArrowRight />
              </Link>
            ) : (
              <Link
                href="/employer"
                className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-950 font-black text-sm rounded-2xl text-center flex items-center justify-center gap-2 transition active:scale-95 shadow-lg cursor-pointer"
              >
                Mulai Pasang Lowongan <FiArrowRight />
              </Link>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default CaraKerjaCrowd;