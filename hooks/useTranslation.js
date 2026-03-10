import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import en from "@/public/locales/en/common.json";
import ar from "@/public/locales/ar/common.json";
import zh from "@/public/locales/zh/common.json";

const LOCALE_MAP = { en, ar, zh };

export function useTranslation() {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState(() => LOCALE_MAP.en || {});

  useEffect(() => {
    // Get language from URL on client side
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const lang = pathname.split("/")[1] || "en";
    
    if (lang !== language) {
      setLanguage(lang);
      setTranslations(LOCALE_MAP[lang] || LOCALE_MAP.en || {});
    }
  }, [language]);

  const t = (key, interpolationObj = {}) => {
    const keys = key.split(".");
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Return key name for debugging when not found
        return key;
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    let result = value;
    for (const [placeholder, replacement] of Object.entries(interpolationObj)) {
      result = result.replace(new RegExp(`{${placeholder}}`, "g"), replacement);
    }

    return result;
  };

  return {
    t,
    language,
    isRTL: language === "ar",
  };
}
