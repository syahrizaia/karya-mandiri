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

  // Alur Kerja untuk Sisi Worker (Mitra Mandiri)
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

  // Alur Kerja untuk Sisi Employer (Pemberi Kerja)
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
    <div className="min-h-screen pb-20">
      
      {/* HERO SECTION */}
      <section className="bg-white border-b border-slate-200 py-12 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <FiCpu /> Model Bisnis Crowdsourcing
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Bagaimana Cara Kerja <br className="hidden md:block"/> Skema Crowdsourcing?
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            KaryaMandiri membagi proyek besar menjadi ribuan tugas mikro digital. Pendekatan ini memberikan fleksibilitas kerja bagi sektor informal sekaligus efisiensi biaya yang luar biasa bagi pemberi kerja.
          </p>

          {/* INTERACTIVE TAB SWITCHER TOGGLE */}
          <div className="p-1.5 bg-slate-100 border border-slate-200 rounded-2xl w-full max-w-md mx-auto flex gap-1 mt-6">
            <button
              onClick={() => setActiveTab('worker')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                activeTab === 'worker'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FiUser /> Sebagai Pekerja (Crowd)
            </button>
            <button
              onClick={() => setActiveTab('employer')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                activeTab === 'employer'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FiBriefcase /> Sebagai Employer
            </button>
          </div>
        </div>
      </section>

      {/* TIMELINE / STEP BY STEP PROCESS SECTION */}
      <main className="max-w-5xl mx-auto mt-8">
        
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
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between h-[280px] hover:border-blue-500 hover:shadow-md transition duration-300 group"
              >
                <div>
                  {/* Step Badge Number & Icon */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-blue-600 text-lg group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                      {step.icon}
                    </div>
                    <span className="text-3xl font-black text-slate-100 tracking-wider group-hover:text-blue-50/60 transition duration-300">
                      {step.number}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-black text-slate-900 text-base mb-2 group-hover:text-blue-600 transition duration-200">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-4">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CORE FEATURES INFOGRAPHIC CARD */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 mt-12 shadow-xs">
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8 text-center md:text-left">
            Tiga Pilar Utama Ekosistem KaryaMandiri
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pilar 1 */}
            <div className="space-y-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 font-bold text-sm rounded-xl flex items-center justify-center border border-emerald-100">
                01
              </div>
              <h4 className="font-bold text-slate-800 text-sm md:text-base">Sistem Escrow Terjamin</h4>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                Uang jaminan dari Employer dikunci aman sebelum tugas didistribusikan. Tidak ada lagi risiko kerjaan fiktif bagi pekerja informal maupun risiko hilangnya dana bagi pemberi kerja.
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="space-y-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 font-bold text-sm rounded-xl flex items-center justify-center border border-blue-100">
                02
              </div>
              <h4 className="font-bold text-slate-800 text-sm md:text-base">Distribusi Massal Instan</h4>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                Didukung ribuan crowd workers bersertifikasi KYC di seluruh nusantara. Tugas bervolume raksasa dapat dipecah secara merata dan selesai hanya dalam hitungan jam.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="space-y-3">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 font-bold text-sm rounded-xl flex items-center justify-center border border-purple-100">
                03
              </div>
              <h4 className="font-bold text-slate-800 text-sm md:text-base">Inklusi Finansial Adil</h4>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                Kami berkomitmen memberdayakan pekerja lepas sektor informal dengan model bagi hasil yang transparan, bebas komisi eksploitatif, serta mendukung penarikan e-wallet lokal.
              </p>
            </div>
          </div>
        </section>

        {/* DYNAMIC CALL TO ACTION (CTA) */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 mt-12 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-black tracking-tight">
              {activeTab === 'worker' 
                ? 'Siap Menghasilkan Pendapatan Mandiri?' 
                : 'Mulai Skalakan Operasional Bisnis Anda'
              }
            </h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              {activeTab === 'worker'
                ? 'Daftar sekarang sebagai Mitra Mandiri terverifikasi, selesaikan tugas mikro digital dari rumah, dan bangun portofolio performa kerja Anda secara transparan.'
                : 'Gabung bersama ratusan korporasi yang mempercayakan validasi data, input massal, dan crowdsourcing operasionalnya ke jaringan terpercaya KaryaMandiri.'
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            {activeTab === 'worker' ? (
              <>
                <Link
                  href="/jobs"
                  className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl text-center flex items-center justify-center gap-2 transition"
                >
                  Jelajahi Lowongan Kerja <FiArrowRight />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/employer"
                  className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-xl text-center flex items-center justify-center gap-2 transition"
                >
                  Mulai Pasang Lowongan <FiArrowRight />
                </Link>
              </>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default CaraKerjaCrowd;