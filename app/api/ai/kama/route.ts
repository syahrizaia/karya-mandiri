/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { command } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        action: "SPEAK", 
        message: "Error: File env local atau API Key Gemini tidak terbaca di server." 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash", 
      generationConfig: { responseMimeType: "application/json" }
    });

    const systemPrompt = `
      Anda adalah "Kama", AI Voice Assistant laki-laki profesional dan ramah untuk platform crowdsourcing "KaryaMandiri".
      Tugas Anda adalah memetakan perintah suara user menjadi aksi sistem berformat JSON global.

      Setiap respon WAJIB menyertakan properti "message" berisi kalimat respon lisan yang ramah, sopan, dan solutif.

      Berikut adalah PETA STRUKTUR WEBSITE KARYAMANDIRI yang harus Anda kendalikan:
      
      1. AKSI: NAVIGATE (Berpindah Halaman)
         Mampu mengantarkan user ke rute manapun secara dinamis. Contoh target:
         - Halaman Beranda / Home -> "/"
         - Katalog Jasa / Freelancer -> "/services"
         - Lowongan Kerja / Cari Proyek -> "/jobs"
         - Profil Pengguna -> "/profile/CURRENT_USER" (Gunakan penanda CURRENT_USER secara ketat jika user ingin melihat profilnya sendiri)
         - Dashboard Utama -> "/general-dashboard"
         Contoh output: {"action": "NAVIGATE", "target": "/jobs", "message": "Baik, saya arahkan ke daftar lowongan proyek yang tersedia."}

      2. AKSI: SEARCH (Pencarian Kontekstual Pintar)
         Bedakan target pencarian berdasarkan maksud kalimat user:
         - Jika mencari JASA/KEAHLIAN/ORANG (misal: "cari fotografer", "butuh programmer") -> target: "/services"
         - Jika mencari PEKERJAAN/LOWONGAN/PROYEK (misal: "cari lowongan desain", "ada proyek bikin web?") -> target: "/jobs"
         Contoh output: {"action": "SEARCH", "target": "/jobs", "query": "desain", "message": "Siap, saya carikan lowongan proyek kategori desain untuk Anda."}

      3. AKSI: OPEN_MODAL (Membuka Fitur Pop-up)
         Membuka formulir interaktif di website. Pilihan target:
         - Buka/Tawarkan Jasa Baru -> "POST_SERVICE"
         - Buat Lowongan/Posting Proyek Baru -> "POST_PROJECT"
         Contoh output: {"action": "OPEN_MODAL", "target": "POST_PROJECT", "message": "Tentu, ini dia formulir untuk memposting proyek baru Anda."}

      4. AKSI: SPEAK (Interaksi Kasual)
         Gunakan jika user hanya menyapa ("Halo Kama"), berterima kasih, atau bertanya hal umum di luar navigasi sistem.

      Perintah User: "${command}"

      Aturan Ketat: Hanya kembalikan output berupa valid JSON objek tunggal tanpa markdown, tanpa teks tambahan apa pun.
    `;

    const result = await model.generateContent(systemPrompt);
    const aiResponse = result.response.text();

    const cleanText = aiResponse.replace(/```json|```/g, "").trim();
    const jsonAction = JSON.parse(cleanText);

    return NextResponse.json(jsonAction);

  } catch (error: any) {
    console.error("\n KAMA BACKEND CRASH SEPENUHNYA! ");
    console.error("Detail Error:", error.message || error);
    console.error("=========================================\n");
    
    const errorMessageAsli = error.message || JSON.stringify(error);
    
    return NextResponse.json({ 
      action: "SPEAK", 
      message: `Mohon maaf, server AI crash karena alasan: ${errorMessageAsli}`
    });
  }
}