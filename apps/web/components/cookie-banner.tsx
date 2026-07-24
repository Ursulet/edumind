"use client";

import { useState, useEffect } from "react";
import { Button } from "@educariera/ui";
import Link from "next/link";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined cookies
    const consent = localStorage.getItem("EduMind_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (value: "accepted" | "declined") => {
    localStorage.setItem("EduMind_cookie_consent", value);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="max-w-4xl mx-auto bg-primary-ink text-warm-surface p-6 rounded-2xl shadow-[0_16px_40px_rgba(31,38,34,0.3)] flex flex-col md:flex-row gap-6 items-start md:items-center border border-border/20">
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-lg text-warm-surface tracking-tight">Confidențialitatea ta este importantă</h3>
          <p className="text-sm text-sage-surface/80 leading-relaxed">
            Folosim cookie-uri tehnice pentru a asigura funcționarea platformei și module analitice pentru a-ți oferi cea mai bună experiență. Datele tale sunt protejate conform standardelor instituționale. 
            <Link href="/confidentialitate" className="underline underline-offset-4 ml-1 text-warm-surface hover:text-white">
              Află mai multe
            </Link>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <Button 
            variant="outline" 
            onClick={() => handleConsent("declined")}
            className="border-border/30 text-warm-surface hover:bg-white/10"
          >
            Refuză Opționale
          </Button>
          <Button 
            onClick={() => handleConsent("accepted")}
            className="bg-forest-accent text-warm-surface hover:bg-forest-hover border-none"
          >
            Acceptă Toate
          </Button>
        </div>
      </div>
    </div>
  );
}

