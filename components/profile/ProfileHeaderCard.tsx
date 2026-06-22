import React, { useState } from 'react';
import Image from 'next/image';
import { 
  FiCamera, 
  FiMoreVertical, 
  FiEdit2, 
  FiMapPin, 
  FiMail, 
  FiPhone, 
  FiCalendar 
} from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import ShareProfileButton from '@/components/profile/share-profile-button/page';

interface ProfileHeaderCardProps {
  profileId: string;
  isOwnProfile: boolean;
  userData: {
    full_name: string;
    email: string;
    phone: string;
    role: string;
    bio: string;
    location: string;
    isVerified: boolean;
    avatarUrl: string;
    bannerUrl: string;
    joinedDate: string;
  };
  onEditProfile: () => void;
  onEditAvatar: () => void;
  onEditBanner: () => void;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  profileId,
  isOwnProfile,
  userData,
  onEditProfile,
  onEditAvatar,
  onEditBanner,
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "KM";
    const cleanName = name.trim();
    const parts = cleanName.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return cleanName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      {/* Banner Area */}
      <div className="relative h-36 sm:h-48 w-full">
        <Image
          src={userData.bannerUrl}
          alt={userData.full_name}
          fill
          className="object-cover"
          priority
        />
        
        {/* Tombol Ubah Banner (Hanya muncul jika isOwnProfile = true) */}
        {isOwnProfile && (
          <button
            onClick={onEditBanner}
            className="flex items-center gap-2 p-2 absolute bottom-3 right-3 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-all shadow-xs cursor-pointer"
            title="Ubah gambar banner"
          >
            <FiCamera size={16} />
          </button>
        )}
      </div>

      <div className="px-4 sm:px-6 pb-6">
        {/* Avatar & Action Row */}
        <div className="relative flex justify-between items-end -mt-14 md:-mt-20 mb-4 sm:mb-6">            
          <div className="relative w-28 h-28 md:w-40 md:h-40 shrink-0">
            {userData.avatarUrl ? (
              <Image
                src={userData.avatarUrl} 
                alt={userData.full_name} 
                fill
                className="rounded-3xl border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-900 shadow-md object-cover"
                sizes="(max-width: 768px) 112px, 160px"
                priority
              />
            ) : (
              <div className="w-full h-full rounded-3xl border-4 border-white dark:border-slate-900 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md flex items-center justify-center text-white text-3xl md:text-5xl font-black tracking-wide select-none">
                {getInitials(userData.full_name)}
              </div>
            )}
            
            {isOwnProfile && (
              <button
                onClick={onEditAvatar}
                className="flex items-center gap-2 p-2 absolute -top-1 -right-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all z-10 cursor-pointer"
              >
                <FiCamera size={14} />
              </button>
            )}
            {userData.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white dark:border-slate-900 z-10 shadow-sm">
                <MdVerified size={16} />
              </div>
            )}
          </div>

          {/* Desktop/Mobile Action Buttons */}
          <div className="relative flex items-center gap-2 mb-2 md:mb-4">
            <div className="hidden md:flex items-center gap-2">
              <ShareProfileButton profileId={profileId} fullName={userData.full_name} />
              {isOwnProfile && (
                <button
                  onClick={onEditProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-blue-600 dark:bg-slate-100 dark:hover:bg-blue-500 text-white dark:text-slate-900 dark:hover:text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <FiEdit2 size={14} /> Edit Profil
                </button>
              )}
            </div>

            {/* Mobile Actions Menu */}
            <div className="md:hidden relative">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2.5 sm:p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full transition-colors focus:outline-hidden cursor-pointer"
                aria-label="Menu Opsi"
              >
                <FiMoreVertical size={18} />
              </button>
              {showMobileMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowMobileMenu(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-2 pb-1 border-b border-slate-100 dark:border-slate-800/80">
                      <ShareProfileButton profileId={profileId} fullName={userData.full_name} />
                    </div>
                    {isOwnProfile && (
                      <div className="px-2 pt-1">
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
                          onClick={() => {
                            onEditProfile();
                            setShowMobileMenu(false);
                          }}
                        >
                          <FiEdit2 size={14} className="text-slate-500 dark:text-slate-400" /> 
                          <span>Edit Profil</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info Bio */}
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 break-words max-w-full">
              {userData.full_name}
            </h1>
            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 text-[9px] font-bold rounded-sm uppercase tracking-wider shrink-0 transition-colors">
              {userData.role}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed break-words whitespace-pre-wrap mt-2 text-justify">
            {userData.bio}
          </p>
        </div>

        {/* Footer Meta Data */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium overflow-hidden transition-colors">
          <div className="flex items-center gap-1.5 min-w-0 max-w-full">
            <FiMapPin className="text-slate-400 dark:text-slate-500 shrink-0" /> 
            <span className="truncate">{userData.location}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 max-w-full">
            <FiMail className="text-slate-400 dark:text-slate-500 shrink-0" /> 
            <span className="truncate">{userData.email}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 max-w-full">
            <FiPhone className="text-slate-400 dark:text-slate-500 shrink-0" /> 
            <span className="truncate">{userData.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 max-w-full">
            <FiCalendar className="text-slate-400 dark:text-slate-500 shrink-0" /> 
            <span className="whitespace-nowrap">Bergabung {userData.joinedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};