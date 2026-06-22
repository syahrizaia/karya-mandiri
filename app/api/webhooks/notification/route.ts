/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

// Menggunakan Service Role Supabase agar bypass RLS saat mencari token user
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Pastikan taruh Service Role Key di env demi keamanan backend
);

webpush.setVapidDetails(
  "mailto:syahriza@karyamandiri.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Membaca record data baru hasil kiriman Webhook Supabase
    const { record } = payload; 
    if (!record || !record.user_id) {
      return NextResponse.json({ error: "Data payload tidak valid" }, { status: 400 });
    }

    // 1. Ambil semua token HP terdaftar milik user tersebut (bisa lebih dari 1 perangkat)
    const { data: tokens, error } = await supabaseAdmin
      .from("user_push_tokens")
      .select("subscription")
      .eq("user_id", record.user_id);

    if (error || !tokens || tokens.length === 0) {
      return NextResponse.json({ message: "User tidak memiliki perangkat PWA aktif" });
    }

    // 2. Bungkus payload push notification yang akan tampil di HP
    const pushPayload = JSON.stringify({
      title: record.title || "KaryaMandiri",
      body: record.message || "Ada pemberitahuan baru.",
      url: "/notifications", // Mengarah langsung ke halaman notifikasi pas di-klik
    });

    // 3. Tembak push secara parallel ke seluruh HP user yang terdaftar
    const pushPromises = tokens.map((t: any) => 
      webpush.sendNotification(t.subscription, pushPayload).catch((err) => {
        // Jika token kedaluwarsa (app diuninstall), hapus otomatis dari database
        if (err.statusCode === 410 || err.statusCode === 404) {
          return supabaseAdmin
            .from("user_push_tokens")
            .delete()
            .eq("subscription", JSON.stringify(t.subscription));
        }
      })
    );

    await Promise.all(pushPromises);

    return NextResponse.json({ success: true, fired_to: tokens.length });
  } catch (error: any) {
    console.error("Gagal memproses webhook push:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}