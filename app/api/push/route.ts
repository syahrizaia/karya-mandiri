import { NextResponse } from "next/server";
import webpush from "web-push";

// Konfigurasi Kunci VAPID Keamanan
webpush.setVapidDetails(
  "mailto:syahriza@karyamandiri.com", // Email dev Abang
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  try {
    const { subscription, title, body, url } = await request.json();

    if (!subscription) {
      return NextResponse.json({ error: "Subscription data diperlukan" }, { status: 400 });
    }

    // Payload data yang akan dikirim ke HP
    const payload = JSON.stringify({
      title: title || "KaryaMandiri",
      body: body || "Ada pesan baru untuk Anda.",
      url: url || "/",
    });

    // Tembak langsung ke Google/Apple Push Server
    await webpush.sendNotification(subscription, payload);

    return NextResponse.json({ success: true, message: "Notifikasi terkirim ke HP!" });
  } catch (error) {
    console.error("Gagal mengirim web push:", error);
    return NextResponse.json({ error: "Gagal memproses notifikasi" }, { status: 500 });
  }
}