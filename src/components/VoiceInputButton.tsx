"use client";

import React, { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { useGlobalSettings } from "@/context/GlobalSettingsContext";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  lang?: "en" | "bn";
  isNumeric?: boolean;
  title?: string;
  className?: string;
}

// Convert Bangla Unicode digits (০-৯) to standard Arabic digits (0-9)
export function parseBanglaDigits(str: string): string {
  const bnToEn: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  return str.replace(/[০-৯]/g, (d) => bnToEn[d] || d);
}

// Spoken Bangla number words to numeric strings
const BANGLA_WORD_NUMBERS: Record<string, string> = {
  "এক": "1", "দুই": "2", "তিন": "3", "চার": "4", "পাঁচ": "5",
  "ছয়": "6", "ছয়": "6", "সাত": "7", "আট": "8", "নয়": "9", "নয়": "9", "দশ": "10",
  "এগারো": "11", "বারো": "12", "তেরো": "13", "চৌদ্দ": "14", "পনেরো": "15",
  "ষোল": "16", "সতেরো": "17", "আঠারো": "18", "উনিশ": "19", "বিশ": "20",
  "ত্রিশ": "30", "চল্লিশ": "40", "পঞ্চাশ": "50", "ষাট": "60", "সত্তর": "70",
  "আশি": "80", "নব্বই": "90", "একশ": "100", "একশো": "100", "দেড়শ": "150",
  "দুইশ": "200", "তিনশ": "300", "চারশ": "400", "পাঁচশ": "500", "পাঁচশো": "500",
  "হাজার": "1000",
};

export default function VoiceInputButton({
  onTranscript,
  lang,
  isNumeric = false,
  title,
  className = "",
}: VoiceInputButtonProps) {
  const { lang: globalLang } = useGlobalSettings();
  const effectiveLang = lang || globalLang || "bn";
  const defaultTitle = effectiveLang === "bn" ? "মুখে বলুন" : "Voice Input";
  const finalTitle = title || defaultTitle;

  const [isListening, setIsListening] = useState(false);

  const startListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check browser SpeechRecognition API support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        effectiveLang === "bn"
          ? "ভয়েস ইনপুট গুগল ক্রোম, মাইক্রোসফট এজ ও আধুনিক ব্রাউজারে সমর্থিত।"
          : "Voice input is supported in Google Chrome, Microsoft Edge, and modern browsers."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      // bn-BD for Bangla, en-US for English
      recognition.lang = effectiveLang === "bn" ? "bn-BD" : "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let rawTranscript = event.results?.[0]?.[0]?.transcript || "";
        rawTranscript = rawTranscript.trim();

        if (rawTranscript) {
          if (isNumeric) {
            // First normalize any Bangla numerals
            let normalized = parseBanglaDigits(rawTranscript);

            // Check if spoken words match Bangla word dictionary
            if (BANGLA_WORD_NUMBERS[normalized]) {
              normalized = BANGLA_WORD_NUMBERS[normalized];
            } else {
              // Replace words if individual words present
              for (const [word, num] of Object.entries(BANGLA_WORD_NUMBERS)) {
                if (normalized === word) {
                  normalized = num;
                  break;
                }
              }
            }

            // Extract numeric value safely
            const numMatch = normalized.replace(/,/g, "").match(/\d+(\.\d+)?/);
            if (numMatch) {
              onTranscript(numMatch[0]);
            } else {
              onTranscript(normalized.trim());
            }
          } else {
            // Safe bounded text transcript
            onTranscript(rawTranscript.slice(0, 500));
          }
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={startListening}
      title={isListening ? (effectiveLang === "bn" ? "শুনছি... বলুন..." : "Listening... speak now...") : finalTitle}
      className={`p-1 rounded-md transition-all flex items-center justify-center cursor-pointer shrink-0 ${
        isListening
          ? "bg-red-500 text-white animate-pulse ring-2 ring-red-400"
          : "text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      } ${className}`}
    >
      <Mic className={`w-3.5 h-3.5 ${isListening ? "animate-bounce text-white" : ""}`} />
    </button>
  );
}
