"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClock, 
  FiSend, 
  FiMessageSquare, 
  FiCheckCircle,
  FiCompass,
  FiShield
} from 'react-icons/fi';
import { toast } from 'sonner';

interface IFormData {
  name: string;
  email: string;
  role: string;
  subject: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<IFormData>({
    name: '',
    email: '',
    role: 'worker',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Mohon lengkapi seluruh kolom formulir!");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const roleLabels: Record<string, string> = {
        worker: "Mitra Mandiri (Sektor Informal)",
        employer: "Pemberi Kerja (Penyedia Proyek)",
        partner: "Instansi / Calon Partner Strategis",
        other: "Lainnya"
      };

      const readableRole = roleLabels[formData.role] || formData.role;

      const waMessage = `Halo Tim Operations KaryaMandiri,

Saya ingin mengirimkan pesan melalui Formulir Kontak Website:

*[Nama Lengkap]:* ${formData.name}
*[Alamat Email]:* ${formData.email}
*[Status Peran]:* ${readableRole}
*[Subjek / Topik]:* ${formData.subject}

*[Detail Pesan]:*
${formData.message}`;

      const encodedText = encodeURIComponent(waMessage);
      const phoneNumber = "6282114487163";

      window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, "_blank");
      
      toast.success("Mengarahkan pesan Anda ke Live Chat WhatsApp Support...");
      
      setFormData({
        name: '',
        email: '',
        role: 'worker',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Gagal mengarahkan ke WhatsApp. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const message = encodeURIComponent("Halo Operations Team KaryaMandiri, saya ingin mendiskusikan peluang kemitraan atau kendala layanan.");
    window.open(`https://wa.me/6282114487163?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen pb-24 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* HERO HEADER */}
      <section className="relative py-12 px-6 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="glass-capsule text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 px-3.5 py-1.5 inline-flex items-center gap-2">
            <FiCompass className="text-sm" /> Layanan Bantuan & Hubungan Mitra
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Mari Terhubung dengan <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">KaryaMandiri</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Punya pertanyaan mengenai sistem crowdsourcing, kendala verifikasi akun, atau ingin menawarkan kolaborasi strategis? Tim kami siap melayani Anda.
          </p>
        </div>
      </section>

      {/* TWO COLUMN CONTENT LAYOUT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: FORMULIR KONTAK */}
        <section className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 md:p-8 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Kirim Pesan Digital</h2>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 glass-capsule px-2.5 py-1">
                Fast Response
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mb-6">
              Isi formulir di bawah ini dan dapatkan respons resmi dari tim operasional internal.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Nama Lengkap
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama Anda"
                    className="glass-input w-full px-4 py-3 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium outline-none transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Alamat Email
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="nama@email.com"
                    className="glass-input w-full px-4 py-3 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Status Peran Akun
                </label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="glass-input w-full px-4 py-3 rounded-2xl text-sm text-slate-700 dark:text-slate-200 font-medium outline-none transition"
                >
                  <option value="worker" className="dark:bg-slate-900">Mitra Mandiri (Sektor Informal)</option>
                  <option value="employer" className="dark:bg-slate-900">Pemberi Kerja (Penyedia Proyek)</option>
                  <option value="partner" className="dark:bg-slate-900">Instansi / Calon Partner Strategis</option>
                  <option value="other" className="dark:bg-slate-900">Lainnya</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Subjek / Topik Utama
                </label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Contoh: Kendala Tarik Saldo Escrow / Proposal Kerjasama"
                  className="glass-input w-full px-4 py-3 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Isi Detail Pesan
                </label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Tuliskan pesan, kronologi kendala, atau poin proposal Anda di sini..."
                  className="glass-input w-full px-4 py-3 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium outline-none transition resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition duration-300 shadow-lg shadow-blue-500/25 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FiSend size={15} /> Kirim Formulir Kontak
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </section>

        {/* KOLOM KANAN: INFORMASI KANAL DIREK */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 md:p-8 rounded-3xl space-y-6">
            <h3 className="font-black text-slate-900 dark:text-white text-base">Saluran Hubungan Langsung</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 glass-capsule text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Kantor Operasional</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 leading-snug">
                    Bekasi, Jawa Barat, Indonesia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 glass-capsule text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
                  <FiMail size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Korespondensi Email</p>
                  <a href="mailto:syahrizaalsistani@gmail.com" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline transition block mt-0.5">
                    syahrizaalsistani@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 glass-capsule text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
                  <FiPhone size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hotline Telepon</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    +62 821-1448-7163
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 glass-capsule text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
                  <FiClock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Waktu Kerja Layanan</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
                    Senin - Jumat: 08:00 - 17:00 WIB <br />
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">(Sabtu, Minggu & Hari Libur Nasional Tutup)</span>
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-slate-200/50 dark:border-white/10" />

            {/* Tombol Akselerasi WhatsApp */}
            <div className="glass-card bg-emerald-500/10 dark:bg-emerald-500/10 border-emerald-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <FiCheckCircle className="text-emerald-500 text-sm" /> Butuh Solusi Lebih Cepat?
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                Gunakan fitur bantuan obrolan langsung via WhatsApp jika Anda memerlukan respons interaktif di luar sistem tiket formulir.
              </p>
              <button
                onClick={handleWhatsAppDirect}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20 active:scale-[0.98] cursor-pointer"
              >
                <FiMessageSquare size={14} /> Hubungi Lewat Live Chat WA
              </button>
            </div>
          </div>

          {/* Secure Escrow Notice */}
          <div className="glass-card p-5 rounded-3xl flex items-center gap-3">
            <FiShield className="text-blue-600 dark:text-blue-400 text-2xl shrink-0" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Seluruh transaksi finansial dan informasi KYC akun dilindungi protokol enkripsi bank-grade dan sistem rekening bersama (Escrow).
            </p>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default ContactUs;