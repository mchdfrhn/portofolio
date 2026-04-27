import { useEffect } from "react";
import { translations } from "@/lib/translations";

const getLanguage = () => {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem("lang") === "id" ? "id" : "en";
};

const translate = (key: string, lang: "en" | "id") => {
  const t = translations[lang] as Record<string, string>;
  const fallback = translations.en as Record<string, string>;
  return t?.[key] ?? fallback[key] ?? key;
};

const applyLangVisibility = (lang: "en" | "id") => {
  document.querySelectorAll<HTMLElement>("[data-lang]").forEach((el) => {
    el.hidden = el.dataset.lang !== lang;
  });
};

const applyLanguage = (lang: "en" | "id") => {
  document.documentElement.lang = lang;
  window.localStorage.setItem("lang", lang);

  document
    .querySelectorAll<HTMLElement>("[data-i18n-key]")
    .forEach((element) => {
      const translationKey = element.dataset.i18nKey;
      if (!translationKey) return;
      const translation = translate(translationKey, lang);

      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.placeholder = translation;
        return;
      }

      element.textContent = translation;
    });

  applyLangVisibility(lang);
};

export default function LanguageLoader() {
  useEffect(() => {
    const defaultLang = getLanguage();
    applyLanguage(defaultLang);

    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail === "en" || customEvent.detail === "id") {
        applyLanguage(customEvent.detail);
      }
    };

    window.addEventListener(
      "languagechange",
      handleLanguageChange as EventListener,
    );
    return () => {
      window.removeEventListener(
        "languagechange",
        handleLanguageChange as EventListener,
      );
    };
  }, []);

  return null;
}
