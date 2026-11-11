"use client";

import React, { useState } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  lang?: "en" | "bn";
  title?: string;
  className?: string;
}

export default function VoiceInputButton({
  onTranscript,
  lang = "bn",
  title = "Voice Input / মুখে বলুন",
  className = "",
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);

  const startListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Browser SpeechRecognition Support Check
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is supported in Google Chrome, Microsoft Edge, and modern browsers.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === "bn" ? "bn-BD" : "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
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
      title={isListening ? "Listening... বলুন..." : title}
      className={`p-1.5 rounded-md transition-all flex items-center justify-center cursor-pointer ${
        isListening
          ? "bg-red-500 text-white animate-pulse ring-2 ring-red-400"
          : "text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      } ${className}`}
    >
      {isListening ? (
        <Mic className="w-3.5 h-3.5 animate-bounce" />
      ) : (
        <Mic className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
