"use client";

import { useEffect } from "react";
import supabase from "@/lib/db";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PWALoader() {
  const dapatkanIzinNotifikasi = async (registration: ServiceWorkerRegistration) => {
    try {
      // 1. Pastikan User sudah login terlebih dahulu
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; 

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicKey) return;

        // 2. Dapatkan objek subscription dari Push Server internal HP
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

        // 3. SIMPAN / UPDATE KE SUPABASE
        const { error } = await supabase
          .from("user_push_tokens")
          .upsert(
            { 
              user_id: user.id, 
              subscription: subscription,
              updated_at: new Date().toISOString()
            },
            { onConflict: "user_id, subscription" }
          );

        if (error) throw error;
      }
    } catch {
      // Gagal sinkronisasi token push. Tidak perlu mengganggu UX.
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => dapatkanIzinNotifikasi(registration))
        .catch(() => {});
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}