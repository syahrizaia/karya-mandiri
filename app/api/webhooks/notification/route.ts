/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:syahriza@karyamandiri.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { record } = payload;

    if (!record?.user_id) {
      return NextResponse.json({ error: "Data payload tidak valid" }, { status: 400 });
    }

    // 1. Ambil token user, pastikan mengambil ID untuk mempermudah delete nanti
    const { data: tokens, error } = await supabaseAdmin
      .from("user_push_tokens")
      .select("id, subscription") 
      .eq("user_id", record.user_id);

    if (error) throw error;
    if (!tokens || tokens.length === 0) {
      return NextResponse.json({ message: "Tidak ada perangkat aktif" });
    }

    const pushPayload = JSON.stringify({
      title: record.title || "KaryaMandiri",
      body: record.message || "Ada pemberitahuan baru.",
      url: "/notifications",
    });

    // 2. Kirim notifikasi secara paralel
    const pushPromises = tokens.map(async (t) => {
      try {
        await webpush.sendNotification(t.subscription, pushPayload);
      } catch (err: any) {
        // Error 410 (Gone) atau 404 (Not Found) artinya subscription sudah tidak valid
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.warn(`Menghapus token kedaluwarsa: ${t.id}`);
          await supabaseAdmin.from("user_push_tokens").delete().eq("id", t.id);
        } else {
          console.error("Gagal mengirim ke satu perangkat:", err.message);
        }
      }
    });

    await Promise.all(pushPromises);

    return NextResponse.json({ success: true, count: tokens.length });
  } catch (error: any) {
    console.error("Gagal memproses webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}