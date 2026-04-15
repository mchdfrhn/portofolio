import React, { useEffect, useState } from "react";

export const LanguageToggle = () => {
  const [lang, setLang] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("lang");
    const current = saved === "id" ? "id" : "en";
    setLang(current);
  }, []);

  const toggleLanguage = () => {
    if (!lang) return;
    const nextLang = lang === "en" ? "id" : "en";
    setLang(nextLang);
    window.localStorage.setItem("lang", nextLang);
    document.documentElement.lang = nextLang;
    window.dispatchEvent(
      new CustomEvent("languagechange", { detail: nextLang }),
    );
  };

  if (!lang) return <div className="w-10 h-10" />;

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label="Toggle language"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-background/80 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary/10"
    >
      <span className="sr-only">Toggle language</span>
      <span className="text-lg">{lang === "en" ? "🇺🇸" : "🇮🇩"}</span>
    </button>
  );
};
