"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiShield, 
  FiLock, 
  FiServer, 
  FiKey, 
  FiActivity, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiArrowRight 
} from 'react-icons/fi';
import Link from 'next/link';

interface ISecurityPillar {
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

const DataSecurity: React.FC = () => {
  // Pilar Keamanan Utama di KaryaMandiri
  const securityPillars: ISecurityPillar[] = [
    {
      title: "Enkripsi Data Tingkat Tinggi",
      description: "Melindungi informasi sensitif dari intersepsi ilegal menggunakan standar kriptografi global terpercaya.",
      icon: <FiLock />,
      details: [
        "Enkripsi basis data menggunakan algoritma AES-256 untuk berkas KTP dan data finansial.",
        "Protokol komunikasi aman HTTPS dengan enkripsi TLS 1.3 selama transit data.",
        "Hashing password menggunakan algoritma Bcrypt yang aman dari metode brute-force."
      ]
    },
    {
      title: "Kedaulatan & Lokasi Server",
      description: "Menjamin ketersediaan infrastruktur platform di pusat data lokal untuk mematuhi regulasi kedaulatan digital.",
      icon: <FiServer />,
      details: [
        "Server utama berlokasi di Data Center Tier-3 terpercaya di dalam negeri (Indonesia).",
        "Kepatuhan penuh pada PP PSTE dan aturan tata kelola data digital UU PDP.",
        "Sistem cadangan data otomatis (automated backup) berkala yang terisolasi aman."
      ]
    },
    {
      title: "Isolasi Rekening Bersama (Escrow)",
      description: "Memisahkan dana operasional perusahaan dengan dana transaksi proyek demi keamanan mutlak.",
      icon: <FiKey />,
      details: [
        "Arsitektur rekening bersama diintegrasikan lewat API Payment Gateway resmi berlisensi Bank Indonesia.",
        "Dana dikunci otomatis oleh sistem ledger digital dan hanya cair via token otentikasi valid.",
        "Audit berkala pada mutasi kas escrow untuk mencegah anomali atau manipulasi finansial."
      ]
    },
    {
      title: "Pemantauan Ancaman Aktif",
      description: "Sistem mitigasi proaktif yang bekerja 24/7 untuk menghalau serangan siber sebelum berdampak pada pengguna.",
      icon: <FiActivity />,
      details: [
        "Integrasi Web Application Firewall (WAF) untuk memblokir injeksi SQL dan serangan XSS.",
        "Perlindungan berlapis terhadap serangan DDoS massal untuk menjaga stabilitas uptime.",
        "Sistem pencatatan log interaksi internal (Audit Logs) untuk mendeteksi anomali akses akun."
      ]
    }
  ];

  return (
    <div className="min-h-screen pb-24 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* HERO SECTION */}
      <section className="py-12 px-6 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="glass-capsule text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 px-3.5 py-1.5 inline-flex items-center gap-2">
            <FiShield className="text-sm" /> Infrastruktur Keamanan Terpercaya
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Komitmen Keamanan & <br /><span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">Perlindungan Siber</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Kami membangun sistem dengan standar arsitektur bank-grade untuk memastikan seluruh data pribadi, dokumen KYC, dan saldo transaksi di platform Anda terlindungi secara menyeluruh.
          </p>
        </div>
      </section>

      {/* CORE INFRASTRUCTURE PILLARS */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityPillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Icon Header */}
                <div className="w-12 h-12 glass-capsule text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition duration-300">
                  {pillar.icon}
                </div>
                
                {/* Title & Desc */}
                <div className="space-y-1">
                  <h3 className="font-black text-slate-900 dark:text-white text-base md:text-lg">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <hr className="border-slate-200/50 dark:border-white/10" />

                {/* Technical Bullet Points */}
                <ul className="space-y-2.5 pt-1">
                  {pillar.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-normal">
                      <FiCheckCircle className="text-emerald-500 text-base shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </section>

        {/* SECURITY RESPONSIBILITY ADVISORY CARD */}
        <section className="glass-card bg-amber-500/10 border-amber-500/30 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-2 flex justify-center md:justify-start">
            <div className="w-14 h-14 glass-capsule bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center text-2xl">
              <FiAlertTriangle />
            </div>
          </div>
          
          <div className="md:col-span-10 text-center md:text-left space-y-1">
            <h4 className="font-black text-amber-700 dark:text-amber-300 text-base">
              Penting: Tanggung Jawab Keamanan Akun Anda
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              Meskipun platform KaryaMandiri memproteksi server secara maksimal, keamanan akun juga sangat bergantung pada kedisiplinan Anda. Jangan pernah membagikan password, kode OTP, atau token akses kepada pihak lain. Tim kami tidak pernah meminta kredensial rahasia Anda.
            </p>
          </div>
        </section>

        {/* INCIDENT REPORT CALL TO ACTION */}
        <section className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden bg-gradient-to-r from-indigo-900/60 to-slate-900/60 shadow-2xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Menemukan Celah Keamanan (Vulnerability)?
            </h3>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Kami sangat mengapresiasi kontribusi para periset keamanan siber secara etis (responsible disclosure). Jika Anda mendeteksi potensi celah pada sistem API atau otentikasi kami, segera laporkan ke tim tanggap insiden.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0">
            <Link
              href="/contact"
              className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm rounded-2xl text-center flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30 active:scale-95 cursor-pointer"
            >
              Laporkan Bug Sistem <FiArrowRight />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
};

export default DataSecurity;