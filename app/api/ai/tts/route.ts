/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Teks kosong" }, { status: 400 });
    }

    // PROTEKSI 1: Google Translate TTS akan error jika teks > 200 karakter.
    // Kita potong amannya di 180 karakter saja.
    const safeText = text.substring(0, 180);

    const googleTranslateUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      safeText
    )}&tl=id&client=tw-ob`;

    // PROTEKSI 2: Berikan header "User-Agent" palsu layaknya browser Chrome asli
    // Jika tidak diisi, Google tahu ini di-fetch dari Node.js server dan akan diblokir (403 Forbidden)
    const response = await fetch(googleTranslateUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://translate.google.com/"
      }
    });
    
    if (!response.ok) {
      console.error(`Google Translate menolak request. Status: ${response.status}`);
      return NextResponse.json({ error: `Google API Error: ${response.status}` }, { status: response.status });
    }

    // Ambil data audio mentah
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Kirim balik ke frontend dalam bentuk Base64
    return NextResponse.json({ audioContent: buffer.toString("base64") });

  } catch (error: any) {
    console.error("TTS PROXY BACKEND CRASH:", error.message || error);
    return NextResponse.json({ error: "Gagal memproses suara di server" }, { status: 500 });
  }
}