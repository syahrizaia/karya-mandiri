"use client";

import React, { useState } from 'react';
import { 
  FiLock, 
  FiClock, 
  FiEye, 
  FiDatabase, 
  FiUserCheck,
  FiArrowRight
} from 'react-icons/fi';

interface IPrivacySection {
  id: string;
  title: string;
}

const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState('perolehan-data');

  // Daftar Pasal Kebijakan Privasi
  const sections: IPrivacySection[] = [
    { id: 'perolehan-data', title: '1. Perolehan & Pengumpulan Data' },
    { id: 'penggunaan-data', title: '2. Penggunaan Data Pribadi' },
    { id: 'pengungkapan-data', title: '3. Pengungkapan Data ke Pihak Ketiga' },
    { id: 'keamanan-penyimpanan', title: '4. Keamanan & Tempat Penyimpanan' },
    { id: 'hak-pemilik', title: '5. Hak Anda Sebagai Pemilik Data' },
    { id: 'cookies', title: '6. Cookies & Log Pelacakan Interaksi' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset agar teks tidak tertutup header saat scroll otomatis
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
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* HERO HEADER */}
      <section className="bg-white border-b border-slate-200 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 w-fit px-3 py-1 rounded-full">
              <FiLock /> Privasi Terjamin
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight md:text-4xl">
              Kebijakan Privasi
            </h1>
            <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
              KaryaMandiri berkomitmen penuh melindungi hak privasi Anda sesuai dengan regulasi perlindungan data yang berlaku di Republik Indonesia.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl w-fit shrink-0">
            <FiClock className="text-slate-400 text-lg" />
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pembaruan Terakhir</p>
              <p className="text-xs font-bold text-slate-700">10 Juni 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* TWO COLUMN LAYOUT */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* STICKY SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-24 space-y-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-3">
              Pokok Bahasan
            </h3>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === sec.id
                      ? 'bg-green-50 text-green-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ARTICLES CONTENT */}
        <section className="lg:col-span-3 space-y-12 bg-white border border-slate-200/80 rounded-3xl p-6 md:p-10 shadow-xs">
          
          {/* LAW COMPLIANCE NOTE */}
          <div className="bg-blue-50 border border-blue-200/60 rounded-2xl p-5 flex gap-4 text-blue-900 text-sm leading-relaxed">
            <FiUserCheck className="shrink-0 text-blue-600 text-xl mt-0.5" />
            <div>
              <span className="font-bold">Kepatuhan UU PDP:</span> Seluruh instrumen pemrosesan data pribadi pada platform KaryaMandiri diatur dan diselenggarakan berdasarkan asas kepatuhan terhadap <strong>Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)</strong>.
            </div>
          </div>

          {/* PASAL 1 */}
          <article id="perolehan-data" className="space-y-4 border-b border-slate-100 pb-8">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-600 rounded-full inline-block"></span>
              1. Perolehan & Pengumpulan Data Pribadi
            </h2>
            <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-3">
              <p>KaryaMandiri mengumpulkan data pribadi yang Anda serahkan secara sadar saat menggunakan ekosistem kami, meliputi:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Data Identifikasi Dasar:</strong> Nama lengkap, alamat email, nomor telepon (WhatsApp), foto profil, dan status peran akun (Worker atau Employer).</li>
                <li><strong>Data Verifikasi Hukum (KYC):</strong> Foto Kartu Tanda Penduduk (KTP) yang diwajibkan khusus bagi Mitra Mandiri (Worker) guna memvalidasi keaslian identitas sebelum mengambil proyek.</li>
                <li><strong>Data Finansial:</strong> Informasi nomor rekening bank atau e-wallet yang digunakan secara eksklusif untuk kepentingan pencairan saldo hasil kerja dari sistem Escrow.</li>
              </ul>
            </div>
          </article>

          {/* PASAL 2 */}
          <article id="penggunaan-data" className="space-y-4 border-b border-slate-100 pb-8">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-600 rounded-full inline-block"></span>
              2. Tujuan Penggunaan Data Pribadi
            </h2>
            <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-3">
              <p>Setiap data yang kami kumpulkan dipergunakan secara terbatas demi kepentingan efisiensi platform, yaitu:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Melakukan verifikasi identitas pengguna demi menekan risiko fraud, kloning akun, dan tindak kriminal siber di sektor crowdsourcing informal.</li>
                <li>Menghubungkan komunikasi langsung antara Employer dan Worker melalui API WhatsApp resmi saat kesepakatan penawaran jasa atau lowongan telah diklik.</li>
                <li>Memproses administrasi transaksi pembayaran yang sah, pelacakan invoice digital, dan mediasi sengketa dana di rekening bersama.</li>
              </ol>
            </div>
          </article>

          {/* PASAL 3 */}
          <article id="pengungkapan-data" className="space-y-4 border-b border-slate-100 pb-8">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-600 rounded-full inline-block"></span>
              3. Pengungkapan Data kepada Pihak Ketiga
            </h2>
            <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-3">
              <p>
                KaryaMandiri <strong>tidak akan pernah menjual, menyewakan, atau memperjualbelikan</strong> data pribadi Anda kepada agensi periklanan atau pihak ketiga mana pun di luar ekosistem platform. Data Anda hanya dibagikan dalam kondisi khusus berikut:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Antar Pengguna:</strong> Nama dan kontak WhatsApp Anda akan ditampilkan kepada pengguna lain hanya jika Anda mengklik tombol aksi untuk melakukan interaksi kerja sama proyek secara sadar.</li>
                <li><strong>Penegakan Hukum:</strong> Atas dasar perintah pengadilan atau mandat resmi dari institusi kepolisian terkait investigasi pelanggaran UU ITE atau hukum pidana lainnya.</li>
              </ul>
            </div>
          </article>

          {/* PASAL 4 */}
          <article id="keamanan-penyimpanan" className="space-y-4 border-b border-slate-100 pb-8">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-600 rounded-full inline-block"></span>
              4. Keamanan & Lokasi Penyimpanan Data (Data Localization)
            </h2>
            <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-3">
              <p>
                Seluruh berkas identitas sensitif seperti foto KTP disimpan secara terpisah menggunakan penyimpanan cloud terenkripsi (*encrypted object storage*).
              </p>
              <p>
                Sesuai dengan regulasi Penyelenggaraan Sistem dan Transaksi Elektronik di Indonesia, kami berupaya memprioritaskan penggunaan server pusat data (*data center*) yang berlokasi di dalam negeri untuk menjamin kedaulatan digital dan proses penegakan hukum perlindungan data yang optimal.
              </p>
            </div>
          </article>

          {/* PASAL 5 */}
          <article id="hak-pemilik" className="space-y-4 border-b border-slate-100 pb-8">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-600 rounded-full inline-block"></span>
              5. Hak Anda Sebagai Pemilik Data Pribadi
            </h2>
            <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-3">
              <p>Di bawah payung hukum UU PDP, Anda memegang kendali penuh atas informasi pribadi Anda sendiri, termasuk hak untuk:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Mengakses dan meminta salinan data pribadi Anda yang tersimpan di server kami.</li>
                <li>Memperbarui atau membetulkan kesalahan informasi (misalnya mengubah nomor telepon atau nama toko/profil jasa) kapan saja melalui menu pengaturan profil.</li>
                <li>Meminta penghapusan atau pemusnahan akun beserta seluruh data riwayatnya secara permanen (*Right to be Forgotten*), dengan catatan Anda tidak sedang terikat dalam sengketa proyek aktif atau utang Escrow yang belum selesai.</li>
              </ul>
            </div>
          </article>

          {/* PASAL 6 */}
          <article id="cookies" className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-600 rounded-full inline-block"></span>
              6. Cookies & Log Pelacakan Interaksi
            </h2>
            <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-3">
              <p>
                Platform kami menggunakan cookies dan sistem log interaksi otomatis (*interaction logs*). Saat Anda menjelajahi katalog lowongan kerja atau detail penawaran jasa, sistem kami mencatat aktivitas log berupa interaksi `view` (kunjungan halaman) maupun `interest` (klik kontak).
              </p>
              <p>
                Data log ini dianonimkan dan diolah murni untuk keperluan algoritma rekomendasi AI guna menyajikan tren lowongan &quot;Paling Diminati&quot; serta mengoptimalkan pengalaman navigasi antarmuka Anda agar lebih responsif.
              </p>
            </div>
          </article>

          {/* ESCALATION FOOTER */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 -mx-6 md:-mx-10 -mb-6 md:-mb-10 p-6 md:p-8 rounded-b-3xl">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">Ingin menarik atau menghapus data Anda?</h4>
              <p className="text-slate-500 text-xs">
                Hubungi tim Data Protection Officer (DPO) kami untuk bantuan pembersihan data secara permanen.
              </p>
            </div>
            <a 
              href="/help-center" 
              className="px-4 py-2.5 bg-white border border-slate-200 hover:border-green-600 hover:text-green-600 font-bold text-xs rounded-xl text-slate-700 flex items-center gap-1.5 transition transition-all shrink-0 shadow-xs"
            >
              Hubungi Help Center <FiArrowRight />
            </a>
          </div>

        </section>

      </main>
    </div>
  );
};

export default PrivacyPolicy;