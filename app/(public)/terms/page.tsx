"use client";

import { Scale } from 'lucide-react';
import React, { useState } from 'react';
import { 
  FiClock, 
  FiAlertCircle, 
  FiArrowRight, 
} from 'react-icons/fi';

interface ISection {
  id: string;
  title: string;
}

const TermsAndConditions: React.FC = () => {
  const [activeSection, setActiveSection] = useState('definisi');

  const sections: ISection[] = [
    { id: 'definisi', title: '1. Ketentuan Umum & Definisi' },
    { id: 'akun', title: '2. Pendaftaran Akun & Verifikasi' },
    { id: 'escrow', title: '3. Sistem Escrow & Pembayaran' },
    { id: 'crowdsourcing', title: '4. Mekanisme Kerja & Pembatalan' },
    { id: 'hki', title: '5. Hak Kekayaan Intelektual' },
    { id: 'sengketa', title: '6. Hukum & Penyelesaian Sengketa' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen pb-24 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* HERO HEADER */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="glass-capsule text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 px-3.5 py-1.5 inline-flex items-center gap-2">
              <Scale size={14} /> Legal & Regulasi Resmi
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Syarat & <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Ketentuan</span> Layanan
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl leading-relaxed">
              Selamat datang di KaryaMandiri. Mohon luangkan waktu Anda untuk membaca kontrak kesepakatan penggunaan platform crowdsourcing ini secara seksama.
            </p>
          </div>
          
          <div className="flex items-center gap-3 glass-card p-4 rounded-2xl w-fit shrink-0">
            <FiClock className="text-slate-400 text-lg" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pembaruan Terakhir</p>
              <p className="text-xs font-bold text-slate-800 dark:text-white">10 Juni 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* TWO COLUMN CONTENT LAYOUT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* STICKY SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-24 glass-panel p-4 rounded-3xl space-y-2">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-2">
              Daftar Isi Pasal
            </h3>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSection === sec.id
                      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ARTICLES & LEGAL TEXT CONTENT */}
        <section className="lg:col-span-3 space-y-10 glass-panel p-6 sm:p-10 rounded-3xl">
          
          {/* INTRODUCTORY NOTE */}
          <div className="glass-card bg-amber-500/10 border-amber-500/30 rounded-2xl p-5 flex gap-4 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
            <FiAlertCircle className="shrink-0 text-amber-500 text-xl mt-0.5" />
            <div>
              <span className="font-bold text-amber-600 dark:text-amber-400">Pemberitahuan Penting:</span> Dengan mendaftar, mengakses, atau menggunakan platform KaryaMandiri, Anda secara otomatis menyatakan setuju untuk terikat oleh seluruh aturan yang tercantum di bawah ini.
            </div>
          </div>

          {/* PASAL 1 */}
          <article id="definisi" className="space-y-4 border-b border-slate-200/50 dark:border-white/10 pb-8">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
              1. Ketentuan Umum & Definisi
            </h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
              <p>Dalam Syarat dan Ketentuan ini, istilah-istilah berikut memiliki arti sebagai berikut:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>KaryaMandiri:</strong> Platform crowdsourcing dan manajemen jasa sektor informal yang dikelola di bawah yurisdiksi Republik Indonesia.</li>
                <li><strong>Employer (Pemberi Kerja):</strong> Pengguna perorangan atau badan usaha yang membuka lowongan pekerjaan atau membeli penawaran jasa dari Mitra Mandiri melalui platform.</li>
                <li><strong>Worker (Pekerja / Mitra Mandiri):</strong> Pengguna sektor informal terverifikasi yang melamar pekerjaan mikro (micro-tasks) atau menyediakan jasa keahlian mandiri.</li>
                <li><strong>Sistem Escrow:</strong> Sistem rekening bersama perantara terenkripsi yang berfungsi menampung dana dari Employer secara aman sebelum dilepaskan kepada Worker.</li>
              </ul>
            </div>
          </article>

          {/* PASAL 2 */}
          <article id="akun" className="space-y-4 border-b border-slate-200/50 dark:border-white/10 pb-8">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
              2. Pendaftaran Akun & Perlindungan Data Pribadi
            </h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
              <p>
                Guna mengakses fungsionalitas penuh transaksi digital di platform, seluruh pengguna wajib mematuhi aturan akun berikut:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Pengguna wajib menyerahkan identitas asli yang sah (KTP) untuk keperluan verifikasi Know Your Customer (KYC).</li>
                <li>Sesuai dengan <strong>Undang-Undang Perlindungan Data Pribadi (UU PDP)</strong>, KaryaMandiri berkomitmen melindungi kerahasiaan data KTP, email, dan nomor telepon Anda menggunakan protokol enkripsi.</li>
                <li>Anda bertanggung jawab penuh atas keamanan kredensial akun Anda secara mandiri.</li>
              </ol>
            </div>
          </article>

          {/* PASAL 3 */}
          <article id="escrow" className="space-y-4 border-b border-slate-200/50 dark:border-white/10 pb-8">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
              3. Sistem Keamanan Rekening Bersama (Escrow)
            </h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
              <p>
                Demi memastikan inklusi ekonomi yang adil dan transparan bagi sektor informal, skema finansial diatur sebagai berikut:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Employer diwajibkan melakukan penyetoran dana penuh (100% upfront payment) ke dalam sistem Escrow KaryaMandiri saat menerbitkan kontrak kerja.</li>
                <li>Pencairan dana kepada Worker baru akan dilakukan oleh sistem setelah Employer memberikan konfirmasi peninjauan (approval) dalam waktu maksimal 3x24 jam.</li>
                <li>Jika batas waktu peninjauan habis dan tidak ada respons dari Employer, sistem berhak melepaskan dana otomatis ke akun Worker demi asas keadilan.</li>
              </ul>
            </div>
          </article>

          {/* PASAL 4 */}
          <article id="crowdsourcing" className="space-y-4 border-b border-slate-200/50 dark:border-white/10 pb-8">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
              4. Mekanisme Kerja & Kebijakan Pembatalan Proyek
            </h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
              <p>
                Aturan pengerjaan proyek crowdsourcing demi meminimalisir perselisihan di lapangan:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Proyek crowdsourcing yang membutuhkan kuota massal dianggap aktif pengerjaannya sejak seluruh slot terpenuhi atau disetujui.</li>
                <li>Worker dilarang keras melimpahkan tugas mikro yang didapat kepada pihak ketiga tanpa izin Employer.</li>
                <li>Pembatalan sepihak oleh Employer saat pekerjaan sudah berjalan 50% atau lebih akan dikenakan biaya kompensasi proporsional yang dipotong dari dana Escrow.</li>
              </ol>
            </div>
          </article>

          {/* PASAL 5 */}
          <article id="hki" className="space-y-4 border-b border-slate-200/50 dark:border-white/10 pb-8">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
              5. Hak Kekayaan Intelektual (HKI)
            </h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
              <p>
                Seluruh hasil karya, desain, kode pemrograman, aset fotografi, dokumen teknis, atau video yang dibuat oleh Worker untuk memenuhi pesanan khusus dari Employer akan sepenuhnya menjadi hak milik intelektual Employer setelah dana dari Sistem Escrow sukses dicairkan secara penuh kepada Worker.
              </p>
            </div>
          </article>

          {/* PASAL 6 */}
          <article id="sengketa" className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
              6. Batasan Tanggung Jawab & Hukum yang Berlaku
            </h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
              <p>
                Platform tunduk penuh terhadap hukum digital Indonesia:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Segala bentuk transaksi ilegal di platform akan diproses mengacu pada <strong>Undang-Undang Informasi dan Transaksi Elektronik (UU ITE)</strong>.</li>
                <li>Apabila terjadi sengketa hasil kerja yang tidak dapat diselesaikan melalui musyawarah mandiri, pengguna sepakat menyerahkan penyelesaian masalah lewat tim internal Mediasi KaryaMandiri.</li>
              </ul>
            </div>
          </article>

          {/* ESCALATION BACK TO HELP CENTER */}
          <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Ada poin pasal yang kurang jelas?</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Kunjungi Pusat Bantuan kami untuk membaca skenario tanya jawab praktis seputar implementasi syarat di atas.
              </p>
            </div>
            <a 
              href="/help-center" 
              className="px-4 py-2.5 glass-card hover:bg-blue-500/10 hover:text-blue-500 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer"
            >
              Ke Pusat Bantuan <FiArrowRight />
            </a>
          </div>

        </section>

      </main>
    </div>
  );
};

export default TermsAndConditions;