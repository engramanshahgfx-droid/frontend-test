"use client";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher({ lang, className = "", displayText = null }) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLangPath = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    return pathname.replace(`/${lang}`, `/${newLang}`);
  };

  const handleClick = () => {
    router.push(switchLangPath());
  };

  const label = displayText ?? (lang === "ar" ? "English" : "العربية");
  // Detect Arabic label reliably. Navbar may pass short form "ع", so also consider lang or short label.
  const isArabicLabel = lang === 'en' || label === "العربية" || label === "ع";

  const variantClass = isArabicLabel ? 'language--arabic' : 'language--default';

  return (
    <button
      onClick={handleClick}
      className={`language-switcher-btn ${variantClass} ${className}`}
      aria-label={`Switch language to ${lang === 'ar' ? 'English' : 'Arabic'}`}
    >
      {label}
    </button>
  );
}
