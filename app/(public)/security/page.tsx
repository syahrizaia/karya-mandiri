"use client";

import React, { useState } from 'react';
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
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* HERO SECTION */}
      <section className="bg-white border-b border-slate-200 py-16 px-6 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <FiShield /> Infrastruktur Aman
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Komitmen Keamanan & <br />Perlindungan Siber KaryaMandiri
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Kami membangun sistem dengan standar arsitektur bank-grade untuk memastikan seluruh data pribadi, dokumen KYC, dan dana transaksi di platform Anda terlindungi secara menyeluruh.
          </p>
        </div>
        
        {/* Dekonstruksi Aksen Latar Belakang Geometris */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-indigo-400 blur-3xl"></div>
          <div className="absolute bottom-5 right-10 w-80 h-80 rounded-full bg-blue-400 blur-3xl"></div>
        </div>
      </section>

      {/* CORE INFRASTRUCTURE PILLARS */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 mt-16 space-y-16">
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {securityPillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col justify-between hover:border-indigo-500/50 transition duration-300"
            >
              <div className="space-y-4">
                {/* Icon Header */}
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 flex items-center justify-center text-xl">
                  {pillar.icon}
                </div>
                
                {/* Title & Desc */}
                <div className="space-y-1">
                  <h3 className="font-black text-slate-900 text-base md:text-lg">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <hr className="border-slate-100" />

                {/* Technical Bullet Points */}
                <ul className="space-y-2.5 pt-1">
                  {pillar.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-normal">
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
        <section className="bg-amber-50 border border-amber-200/70 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-2 flex justify-center md:justify-start">
            <div className="w-14 h-14 bg-amber-100 border border-amber-200 text-amber-700 rounded-2xl flex items-center justify-center text-2xl shadow-xs">
              <FiAlertTriangle />
            </div>
          </div>
          
          <div className="md:col-span-10 text-center md:text-left space-y-2">
            <h4 className="font-black text-amber-900 text-base">
              Bagian Penting: Tanggung Jawab Keamanan Akun Anda
            </h4>
            <p className="text-amber-800 text-xs md:text-sm leading-relaxed">
              Meskipun platform KaryaMandiri memproteksi server secara maksimal, keamanan akun juga sangat bergantung pada kedisiplinan Anda. Jangan pernah membagikan password, kode OTP, atau token akses kepada pihak lain yang mengaku sebagai tim internal kami. Kami tidak pernah meminta kredensial rahasia Anda demi alasan apa pun.
            </p>
          </div>
        </section>

        {/* INCIDENT REPORT CALL TO ACTION */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-black tracking-tight">
              Menemukan Celah Keamanan (Bug Vulnerability)?
            </h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Kami sangat mengapresiasi kontribusi para peneliti keamanan siber secara etis (*ethical hacking*). Jika Anda mendeteksi adanya celah keamanan pada sistem API, otentikasi, atau basis data kami, segera laporkan ke tim tanggap insiden digital.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0">
            <Link
              href="/contact"
              className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl text-center flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/10 active:scale-[0.98]"
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