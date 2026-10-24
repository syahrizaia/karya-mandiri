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
    <div className="w-full glass-panel rounded-3xl overflow-hidden transition-colors">
      {/* Banner Area */}
      <div className="relative h-36 sm:h-52 w-full">
        <Image
          src={userData.bannerUrl}
          alt={userData.full_name}
          fill
          className="object-cover"
          priority
        />
        
        {/* Tombol Ubah Banner */}
        {isOwnProfile && (
          <button
            onClick={onEditBanner}
            className="flex items-center gap-2 p-2.5 absolute bottom-3 right-3 glass-capsule text-white rounded-xl font-semibold transition-all shadow-lg cursor-pointer hover:bg-white/20"
            title="Ubah gambar banner"
          >
            <FiCamera size={16} />
          </button>
        )}
      </div>

      <div className="px-5 sm:px-8 pb-6">
        {/* Avatar & Action Row */}
        <div className="relative flex justify-between items-end -mt-14 md:-mt-20 mb-4 sm:mb-6">            
          <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0">
            {userData.avatarUrl ? (
              <Image
                src={userData.avatarUrl} 
                alt={userData.full_name} 
                fill
                className="rounded-3xl border-4 border-white/80 dark:border-slate-900/80 shadow-xl object-cover backdrop-blur-md"
                sizes="(max-width: 768px) 112px, 144px"
                priority
              />
            ) : (
              <div className="w-full h-full rounded-3xl border-4 border-white/80 dark:border-slate-900/80 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl flex items-center justify-center text-white text-3xl md:text-5xl font-black tracking-wide select-none">
                {getInitials(userData.full_name)}
              </div>
            )}
            
            {isOwnProfile && (
              <button
                onClick={onEditAvatar}
                className="flex items-center gap-2 p-2 absolute -top-1 -right-1 glass-capsule text-slate-800 dark:text-white rounded-xl shadow-md transition-all z-10 cursor-pointer hover:bg-blue-500/20"
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
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer active:scale-95"
                >
                  <FiEdit2 size={13} /> Edit Profil
                </button>
              )}
            </div>

            {/* Mobile Actions Menu */}
            <div className="md:hidden relative">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2.5 glass-capsule text-slate-700 dark:text-slate-300 rounded-full transition cursor-pointer"
                aria-label="Menu Opsi"
              >
                <FiMoreVertical size={18} />
              </button>
              {showMobileMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowMobileMenu(false)} />
                  <div className="absolute right-0 mt-2 w-44 glass-panel rounded-2xl shadow-2xl py-2 z-30">
                    <div className="px-2 pb-1 border-b border-slate-200/50 dark:border-white/10">
                      <ShareProfileButton profileId={profileId} fullName={userData.full_name} />
                    </div>
                    {isOwnProfile && (
                      <div className="px-2 pt-1">
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-500/10 font-bold rounded-xl transition cursor-pointer"
                          onClick={() => {
                            onEditProfile();
                            setShowMobileMenu(false);
                          }}
                        >
                          <FiEdit2 size={14} className="text-slate-400" /> 
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
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white break-words max-w-full">
              {userData.full_name}
            </h1>
            <span className="glass-capsule text-blue-600 dark:text-blue-400 px-2.5 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider shrink-0">
              {userData.role}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed break-words whitespace-pre-wrap mt-2">
            {userData.bio}
          </p>
        </div>

        {/* Footer Meta Data */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 pt-5 border-t border-slate-200/50 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-medium overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0 max-w-full">
            <FiMapPin className="text-slate-400 shrink-0" /> 
            <span className="truncate">{userData.location}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 max-w-full">
            <FiMail className="text-slate-400 shrink-0" /> 
            <span className="truncate">{userData.email}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 max-w-full">
            <FiPhone className="text-slate-400 shrink-0" /> 
            <span className="truncate">{userData.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 max-w-full">
            <FiCalendar className="text-slate-400 shrink-0" /> 
            <span className="whitespace-nowrap">Bergabung {userData.joinedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};