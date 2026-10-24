/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiMic, FiMicOff, FiCpu } from "react-icons/fi";
import { toast } from "sonner";

interface KamaAssistantProps {
  userId?: string; 
}

export default function KamaAssistant({ userId }: KamaAssistantProps) {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [kamaStatus, setKamaStatus] = useState("Kama siap membantu");
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userIdRef = useRef(userId);
  const processingRef = useRef(false);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const speakBack = async (text: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    try {
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Gagal fetch audio proxy");
      const data = await res.json();

      if (data.audioContent) {
        const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;
        const audio = new Audio(audioSrc);
        audioRef.current = audio;
        audio.playbackRate = 0.95; // Kecepatan ideal untuk asisten formal
        await audio.play();
      } else {
        throw new Error("Konten audio kosong");
      }

    } catch {
      if (!("speechSynthesis" in window)) return;

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const indonesianVoices = voices.filter(v => v.lang.startsWith("id"));

      const maleIndoVoice = indonesianVoices.find(v => 
        v.name.toLowerCase().includes("ardi") || 
        v.name.toLowerCase().includes("male") || 
        v.name.toLowerCase().includes("pria") ||
        v.name.toLowerCase().includes("wira")
      );

      if (maleIndoVoice) {
        utterance.voice = maleIndoVoice;
      } else if (indonesianVoices.length > 0) {
        utterance.voice = indonesianVoices[0];
      }

      utterance.pitch = 0.88; 
      utterance.rate = 0.95;
      utterance.lang = "id-ID";

      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = "id-ID";
      recognition.interimResults = false;

      recognition.onresult = async (event: any) => {
        const currentResultIndex = event.resultIndex;
        const transcript = event.results[currentResultIndex][0].transcript.toLowerCase();

        setKamaStatus(`Mendengar: "${transcript}"`);

        const wakeWords = ["kama", "kamu", "kamar", "karma", "karna", "sama"];
        const isWakeWordDetected = wakeWords.some(word => transcript.includes(word));

        if (isWakeWordDetected && !processingRef.current) {
          processingRef.current = true;
          toast.loading("Kama sedang memproses perintah Anda...", { id: "kama-voice" });
          
          try {
            const res = await fetch("/api/ai/kama", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ command: transcript }),
            });
            
            if (!res.ok) throw new Error("Server bermasalah");
            const data = await res.json();

            let finalTargetRoute = data.target;

            // Proteksi rute profil dinamis
            if (finalTargetRoute && finalTargetRoute.includes("CURRENT_USER")) {
              if (!userIdRef.current) {
                const loginWarning = "Maaf Pak, Anda harus masuk atau login terlebih dahulu untuk mengakses halaman profil.";
                speakBack(loginWarning);
                toast.error(loginWarning, { id: "kama-voice" });
                return;
              }
              finalTargetRoute = finalTargetRoute.replace("CURRENT_USER", userIdRef.current);
            }

            // Jalankan feedback vokal dari Google Translate Proxy
            if (data.message && (!data.target || !data.target.includes("CURRENT_USER") || userIdRef.current)) {
              speakBack(data.message);
            }

            // EKSEKUSI AKSI SISTEM (FIXED)
            if (data.action === "NAVIGATE") {
              router.push(finalTargetRoute);
              toast.success(`Kama: ${data.message}`, { id: "kama-voice" });
              
            } else if (data.action === "OPEN_MODAL") {
              if (data.target === "POST_SERVICE") {
                window.dispatchEvent(new CustomEvent("open-post-service-modal"));
              } else if (data.target === "POST_PROJECT") {
                window.dispatchEvent(new CustomEvent("open-post-project-modal"));
              }
              toast.success(`Kama: ${data.message}`, { id: "kama-voice" });
              
            } else if (data.action === "SPEAK") {
              toast.info(data.message, { id: "kama-voice" });
              
            } else if (data.action === "SEARCH") {
              const finalPath = data.target || "/services";
              router.push(`${finalPath}?search=${encodeURIComponent(data.query)}`);
              window.dispatchEvent(new CustomEvent("kama-trigger-search", { detail: data.query }));
              toast.success(`Kama: ${data.message}`, { id: "kama-voice" });
            }
          } catch {
            toast.error("Kama kesulitan memahami perintah itu.", { id: "kama-voice" });
          } finally {
            processingRef.current = false;
          }
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setKamaStatus("Kama dinonaktifkan");
    } else {
      try {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        if (audioRef.current) audioRef.current.pause();
        
        recognitionRef.current?.start();
        setIsListening(true);
        setKamaStatus("Kama mendengarkan... (Panggil 'Kama [perintahmu]')");
        toast.info("Mikrofon aktif, silakan berbicara.");
      } catch {
        toast.error("Gagal mengaktifkan mikrofon.");
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 font-sans pointer-events-auto">
      {isListening && (
        <div className="glass-capsule text-slate-800 dark:text-white text-xs px-4 py-2 rounded-2xl shadow-xl animate-bounce font-semibold max-w-xs truncate border border-blue-500/30 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <FiCpu className="text-blue-500 dark:text-blue-400 shrink-0" size={14} />
          <span className="truncate">{kamaStatus}</span>
        </div>
      )}
      <button
        onClick={toggleListening}
        aria-label={isListening ? "Matikan Kama" : "Aktifkan Kama"}
        className={`p-4 rounded-2xl shadow-2xl transition-all duration-300 text-white flex items-center justify-center cursor-pointer border ${
          isListening 
            ? "bg-linear-to-r from-rose-600 to-red-600 border-rose-400 scale-110 shadow-rose-500/30 animate-pulse" 
            : "bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 border-white/30 shadow-blue-500/30 hover:scale-105 active:scale-95"
        }`}
        title="Hubungi Kama (Asisten AI Suara)"
      >
        {isListening ? <FiMicOff size={22} /> : <FiMic size={22} />}
      </button>
    </div>
  );
}