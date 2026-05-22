"use client";

import React from 'react';

interface ProfileSkeletonProps {
  isOwnProfile?: boolean; // Properti dinamis untuk membedakan mode pemilik vs guest
}

const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({ isOwnProfile = false }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 md:pt-12 lg:pt-0 animate-pulse">
      
      {/* Header Card Skeleton */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Banner Area */}
        <div className="h-48 w-full bg-slate-200" />
        
        <div className="px-6 pb-6">
          {/* Avatar & Action Button Area */}
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            {/* Avatar Box */}
            <div className="relative w-32 h-32 bg-slate-300 rounded-2xl border-4 border-white shadow-md" />
            
            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {/* Tombol Bagikan (Muncul untuk siapapun) */}
              <div className="h-10 w-24 bg-slate-200 rounded-xl" />
              {/* Tombol Edit Profil (Hanya dirender jika pemilik akun asli) */}
              {isOwnProfile && <div className="h-10 w-28 bg-slate-200 rounded-xl" />}
            </div>
            
            {/* Mobile More Button (Titik tiga di mobile) */}
            <div className="md:hidden h-11 w-11 bg-slate-200 rounded-full" />
          </div>

          {/* Name & Bio Area */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-48 bg-slate-300 rounded-lg" />
              <div className="h-5 w-16 bg-slate-200 rounded-full" />
            </div>
            <div className="space-y-2 max-w-2xl">
              <div className="h-4 bg-slate-200 rounded-md w-full" />
              <div className="h-4 bg-slate-200 rounded-md w-5/6" />
            </div>
          </div>

          {/* Badges Info (Location, Mail, Call, Date) */}
          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-slate-100">
            <div className="h-5 w-32 bg-slate-100 rounded-md" />
            <div className="h-5 w-40 bg-slate-100 rounded-md" />
            <div className="h-5 w-36 bg-slate-100 rounded-md" />
            <div className="h-5 w-44 bg-slate-100 rounded-md" />
          </div>
        </div>
      </div>

      {/* Grid Content Area (Layout berubah tergantung status kepemilikan) */}
      <div className={`grid grid-cols-1 gap-6 ${isOwnProfile ? 'md:grid-cols-3' : 'md:grid-cols-1'}`}>
        
        {/* Sisi Kiri: Skills & Wallet */}
        <div className={isOwnProfile ? 'md:col-span-1 space-y-6' : 'space-y-6'}>
          {/* Skills Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="h-6 w-24 bg-slate-200 rounded-md" />
              <div className="h-7 w-16 bg-slate-100 rounded-xl" />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="h-8 w-20 bg-slate-100 rounded-lg" />
              <div className="h-8 w-24 bg-slate-100 rounded-lg" />
              <div className="h-8 w-16 bg-slate-100 rounded-lg" />
              <div className="h-8 w-28 bg-slate-100 rounded-lg" />
            </div>
          </div>

          {/* Wallet Card - Hanya muncul jika pemilik akun */}
          {isOwnProfile && (
            <div className="bg-slate-200 p-6 rounded-2xl shadow-xs">
              <div className="h-4 w-24 bg-slate-300 rounded-md mb-2" />
              <div className="h-8 w-40 bg-slate-300 rounded-lg mb-4" />
              <div className="h-10 w-full bg-slate-300/50 rounded-xl" />
            </div>
          )}
        </div>

        {/* Sisi Kanan: Privacy & Settings / Alternatif Box Guest */}
        {isOwnProfile ? (
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
              <div className="p-6 space-y-2">
                <div className="h-6 w-44 bg-slate-300 rounded-md" />
                <div className="h-4 w-64 bg-slate-200 rounded-md" />
              </div>
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-6 flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 w-36 bg-slate-200 rounded-md" />
                    <div className="h-3 w-20 bg-slate-100 rounded-md" />
                  </div>
                  <div className="h-6 w-16 bg-slate-100 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Tampilan alternatif box pesan untuk Guest agar layout tetap seimbang saat loading */
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-2">
            <div className="h-4 w-3/4 bg-slate-100 rounded-md" />
            <div className="h-4 w-1/2 bg-slate-100 rounded-md" />
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfileSkeleton;