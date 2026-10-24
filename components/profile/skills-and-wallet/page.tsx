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
      <div className="glass-panel p-5 sm:p-6 rounded-3xl transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-slate-800 dark:text-white">
            <FiAward className="text-blue-600 dark:text-blue-400" /> Keahlian Terdaftar
          </h2>
          {isOwnProfile && (
            <button
              onClick={() => setShowManageSkills(true)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors cursor-pointer"
            >
              Kelola
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {userData.skills.length > 0 ? (
            userData.skills.map((skill) => (
              <span 
                key={skill} 
                className="glass-capsule px-3 py-1 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-500 italic">
              Belum menambahkan keahlian
            </span>
          )}
        </div>
      </div>

      {/* Box Dompet / Saldo */}
      {isOwnProfile && (
        <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-blue-600/90 via-indigo-700/80 to-slate-900/90 text-white shadow-xl relative overflow-hidden">
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-200 mb-1">Saldo Dompet Escrow</h2>
          <p className="text-2xl sm:text-3xl font-black truncate">
            Rp{userData.balance.toLocaleString("id-ID")}
          </p>
          <button
            onClick={() => setShowSubModal(true)}
            className="w-full mt-4 py-3 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition backdrop-blur-md cursor-pointer active:scale-95 border border-white/20 shadow-md"
          >
            Tarik Tunai Saldo
          </button>
        </div>
      )}

      {/* Dialog Overlay */}
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
      <ManageSkillsDialog open={showManageSkills} onOpenChange={setShowManageSkills} currentSkills={userData.skills} onSuccess={fetchCurrentProfile} />
    </div>
  );
}