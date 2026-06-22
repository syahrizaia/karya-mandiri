/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { use, useEffect, useState } from "react";
import supabase from "@/lib/db";
import { FiAward } from "react-icons/fi";
import { toast } from "sonner";
import ManageSkillsDialog from "../manage-skills/page";
import SubscriptionDialog from "../../subscription/page";

interface ProfileProps {
  params: Promise<{ id: string }>;
}

export default function SkillsAndWallet({ params }: ProfileProps) {
  const { id: profileId } = use(params);
  const [, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showManageSkills, setShowManageSkills] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);

  const [userData, setUserData] = useState<{
    skills: string[];
    balance: number;
  }>({
    skills: [],
    balance: 0,
  });

  const fetchCurrentProfile = async () => {
    try {
      setLoading(true);

      const [profileRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', profileId).maybeSingle(),
      ]);

      if (profileRes.error && profileRes.error.code !== 'PGRST116') {
        console.error("Profile Fetch Error:", profileRes.error);
        toast.error("Gagal memuat profil.");
        return;
      }

      const profile = profileRes.data;
      if (!profile) {
        toast.error("Profil tidak ditemukan.");
        return;
      }

      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;
      const ownsProfile = !!(currentUser && currentUser.id === profileId);
      setIsOwnProfile(ownsProfile);

      setUserData({
        skills: profile?.skills || [],
        balance: profile?.balance || 0,
      });
    } catch (err: any) {
      console.error("Error global saat memuat profil:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchCurrentProfile();
    }
  }, [profileId]);

  return (
    <div className="space-y-6 w-full min-w-0 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Box Keahlian */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <FiAward className="text-blue-600 dark:text-blue-400" /> Keahlian
          </h2>
          {isOwnProfile && (
            <button
              onClick={() => setShowManageSkills(true)}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
            >
              Kelola
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {userData.skills.length > 0 ? (
            userData.skills.map((skill) => (
              <span 
                key={skill} 
                className="px-2.5 py-1 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 break-words max-w-full transition-colors"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-500 italic">
              Belum mengisi keahlian
            </span>
          )}
        </div>
      </div>

      {/* Box Dompet / Saldo */}
      {isOwnProfile && (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 sm:p-6 rounded-2xl shadow-md text-white">
          <h2 className="text-xs font-semibold opacity-80 mb-1">Saldo Dompet</h2>
          <p className="text-2xl sm:text-3xl font-black truncate">
            Rp{userData.balance.toLocaleString("id-ID")}
          </p>
          <button
            onClick={() => setShowSubModal(true)}
            className="w-full mt-4 py-2.5 bg-white/20 hover:bg-white/30 text-xs font-bold rounded-xl transition backdrop-blur-xs cursor-pointer"
          >
            Tarik Tunai Dana
          </button>
        </div>
      )}

      {/* Dialog Overlay */}
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
      <ManageSkillsDialog open={showManageSkills} onOpenChange={setShowManageSkills} currentSkills={userData.skills} onSuccess={fetchCurrentProfile} />
    </div>
  );
}