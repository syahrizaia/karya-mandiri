import React from 'react';
import Link from 'next/link';
import { 
  FiFacebook, 
  FiInstagram, 
  FiTwitter, 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiExternalLink,
  FiLinkedin
} from 'react-icons/fi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Mission */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                K
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">KaryaMandiri</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Platform inklusi ekonomi pertama di Indonesia yang memberdayakan sektor informal melalui model bisnis crowdsourcing yang transparan dan adil.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<FiLinkedin />} href="https://www.linkedin.com/in/syahriza-ikhsan-alsistani" target="_blank" />
              <SocialIcon icon={<FiFacebook />} href="#" />
              <SocialIcon icon={<FiInstagram />} href="https://www.instagram.com/syahreza_ia" target="_blank" />
              <SocialIcon icon={<FiTwitter />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6">Platform</h3>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><FooterLink href="/jobs">Cari Pekerjaan</FooterLink></li>
              <li><FooterLink href="/employer">Menjadi Employer</FooterLink></li>
              <li><FooterLink href="#">Cara Kerja Crowd</FooterLink></li>
              <li><FooterLink href="#">Pusat Pelatihan</FooterLink></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6">Dukungan</h3>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><FooterLink href="#">Pusat Bantuan</FooterLink></li>
              <li><FooterLink href="#">Syarat & Ketentuan</FooterLink></li>
              <li><FooterLink href="#">Kebijakan Privasi</FooterLink></li>
              <li><FooterLink href="#">Kontak Kami</FooterLink></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6">Hubungi Kami</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-1 text-blue-600 shrink-0" />
                <span>Jakarta Selatan, DKI Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-blue-600 shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-blue-600 shrink-0" />
                <span>halo@karyamandiri.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            © {currentYear} KaryaMandiri Syahriza. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> 
              Sistem Terverifikasi
            </span>
            <Link href="#" className="hover:text-blue-600 flex items-center gap-1">
              Keamanan Data <FiExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Helper Components ---

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 inline-block">
    {children}
  </Link>
);

const SocialIcon = ({ icon, href, target }: { icon: React.ReactNode; href: string; target?: string }) => (
  <a 
    href={href} 
    target={target} // Masukkan variabel target ke sini
    className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);

export default Footer;