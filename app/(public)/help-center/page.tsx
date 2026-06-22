"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiChevronDown, 
  FiUser, 
  FiBriefcase, 
  FiCreditCard, 
  FiShield, 
  FiMessageSquare, 
  FiMail, 
  FiPhone 
} from 'react-icons/fi';

interface IFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface ICategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const categories: ICategory[] = [
    { id: 'all', name: 'Semua Topik', icon: <FiMessageSquare />, description: 'Lihat seluruh pertanyaan umum' },
    { id: 'account', name: 'Akun & Profil', icon: <FiUser />, description: 'Registrasi, verifikasi KTP, dan kelola peran' },
    { id: 'jobs', name: 'Pekerjaan & Jasa', icon: <FiBriefcase />, description: 'Cara melamar, crowdsourcing, dan pasang iklan' },
    { id: 'payment', name: 'Pembayaran & Escrow', icon: <FiCreditCard />, description: 'Sistem pencairan dana, biaya layanan, dan invoice' },
    { id: 'security', name: 'Keamanan & Aturan', icon: <FiShield />, description: 'Perlindungan data, UU ITE, dan penyelesaian sengketa' },
  ];

  const faqData: IFaqItem[] = [
    {
      id: 'faq-1',
      category: 'payment',
      question: 'Bagaimana cara kerja sistem pembayaran Escrow di KaryaMandiri?',
      answer: 'Sistem Escrow (Rekening Bersama) kami mengamankan dana Employer sebelum proyek dimulai. Setelah Pekerja menyelesaikan tugasnya dan diverifikasi oleh Employer atau sistem, dana akan otomatis dicairkan langsung ke saldo dompet Pekerja. Ini menjamin perlindungan 100% dari penipuan.'
    },
    {
      id: 'faq-2',
      category: 'account',
      question: 'Apakah saya bisa mengubah peran dari Worker menjadi Employer atau sebaliknya?',
      answer: 'Untuk menjaga validitas data dan sistem rating, satu akun hanya dapat memiliki satu peran aktif (Worker atau Employer). Jika Anda ingin menggunakan kedua fitur tersebut, Anda disarankan membuat dua akun berbeda menggunakan alamat email yang terpisah.'
    },
    {
      id: 'faq-3',
      category: 'jobs',
      question: 'Apa itu model kerja Crowdsourcing di platform ini?',
      answer: 'Model Crowdsourcing memungkinkan Employer untuk membagi satu proyek besar menjadi tugas-tugas kecil yang bisa diambil oleh banyak Pekerja sekaligus secara paralel. Pekerjaan akan dianggap dimulai secara massal setelah seluruh kuota pekerja yang dibutuhkan terpenuhi.'
    },
    {
      id: 'faq-4',
      category: 'security',
      question: 'Bagaimana jika hasil kerja yang diserahkan tidak sesuai komitmen awal?',
      answer: 'KaryaMandiri menyediakan fitur Mediasi Sengketa. Jika Employer merasa hasil kerja melanggar kesepakatan tertulis, Employer dapat mengajukan komplain sebelum masa verifikasi habis. Tim admin kami akan meninjau bukti digital (kontrak & lampiran tugas) secara adil.'
    },
    {
      id: 'faq-5',
      category: 'account',
      question: 'Mengapa verifikasi profil (KTP) sangat penting bagi Mitra Mandiri?',
      answer: 'Verifikasi KTP diperlukan untuk menciptakan ekosistem kerja sektor informal yang terpercaya, mencegah akun kloning/fraud, serta memastikan kepatuhan terhadap regulasi PDP (Perlindungan Data Pribadi) di Indonesia. Data Anda dienkripsi dengan standar keamanan tinggi.'
    },
    {
      id: 'faq-6',
      category: 'jobs',
      question: 'Bagaimana cara menghubungi penyedia penawaran Jasa?',
      answer: 'Anda dapat membuka halaman detail jasa yang diminati, lalu klik tombol "Hubungi Lewat WhatsApp". Sistem secara otomatis memformat pesan pembuka dan mengarahkan Anda ke WhatsApp resmi mitra terkait tanpa perlu menyimpan nomor terlebih dahulu.'
    }
  ];

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleContactWhatsApp = () => {
    const message = encodeURIComponent("Halo Admin KaryaMandiri, saya membutuhkan bantuan mengenai kendala teknis pada platform.");
    window.open(`https://wa.me/6282114487163?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* HERO SECTION */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8 px-6 text-center transition-colors">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full">
            Customer Support
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Ada yang Bisa Kami Bantu?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Cari jawaban instan seputar pengelolaan akun, sistem pembayaran aman escrow, komisi, dan panduan crowdsourcing.
          </p>
          
          <div className="max-w-xl mx-auto relative mt-4">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg" />
            <input 
              type="text"
              placeholder="Ketik pertanyaan atau kata kunci (misal: Escrow, KTP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
            />
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-2 mb-4">
            Kategori Bantuan
          </h3>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenFaqId(null);
                }}
                className={`flex items-center gap-4 p-4 rounded-2xl text-left font-bold text-sm border transition shrink-0 lg:shrink grow-0 w-[240px] lg:w-full ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/10'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <div className={`p-2 rounded-xl text-base ${activeCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                  {cat.icon}
                </div>
                <div>
                  <p className="block truncate">{cat.name}</p>
                  <span className={`text-[10px] font-medium block truncate mt-0.5 max-w-[160px] lg:max-w-none ${activeCategory === cat.id ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                    {cat.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT: FAQ */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center justify-between">
            <span>Pertanyaan yang Sering Diajukan</span>
            <span className="text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-full">
              {filteredFaqs.length} Artikel
            </span>
          </h2>

          {filteredFaqs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center text-xl">
                <FiSearch />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">Hasil Tidak Ditemukan</h4>
              <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">
                Tidak ada dokumentasi FAQ yang cocok dengan kata kunci &quot;{searchQuery}&quot;. Silakan gunakan opsi kontak langsung di bawah.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-5 text-left flex justify-between items-center gap-4 font-bold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <span className="text-sm md:text-base leading-snug">{faq.question}</span>
                      <FiChevronDown 
                        className={`text-slate-400 transition-transform duration-300 shrink-0 text-lg ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} 
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed whitespace-pre-line bg-slate-50/40 dark:bg-slate-950/40">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {/* ESCALATION CARD */}
          <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-3xl p-6 md:p-8 mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-lg font-black tracking-tight">Masih belum menemukan solusi?</h3>
              <p className="text-slate-400 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
                Tim Operations & Support KaryaMandiri siap membantu Anda secara personal selama jam kerja (08:00 - 17:00 WIB).
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-300 pt-2">
                <span className="flex items-center gap-1.5"><FiMail className="text-blue-400" /> syahrizaalsistani@gmail.com</span>
                <span className="flex items-center gap-1.5"><FiPhone className="text-blue-400" /> +62 821-1448-7163</span>
              </div>
            </div>
            <div className="md:col-span-1">
              <button
                onClick={handleContactWhatsApp}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg shadow-blue-600/10"
              >
                <FiMessageSquare size={16} /> Live Chat WhatsApp
              </button>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
};

export default HelpCenter;