import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import en from "@/public/locales/en/common.json";
import ar from "@/public/locales/ar/common.json";
import zh from "@/public/locales/zh/common.json";

const LOCALE_MAP = { en, ar, zh };

export function useTranslation() {
  const router = useRouter();
  const [translations, setTranslations] = useState({});
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = () => {
      try {
        setIsLoading(true);
        // Get language from URL
        const pathname = window.location.pathname;
        const lang = pathname.split("/")[1] || "en";
        setLanguage(lang);

        // Use static imports to avoid dynamic import issues in production
        const loaded = LOCALE_MAP[lang] || LOCALE_MAP.en;
        setTranslations(loaded || {});
      } catch (error) {
        console.error("Failed to load translations:", error);
        setTranslations({});
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [router]);

  const t = (key, interpolationObj = {}) => {
    const keys = key.split(".");
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
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
    isLoading,
    isRTL: language === "ar",
  };
}
