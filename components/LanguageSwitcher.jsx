"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./LanguageSwitcher.module.css";

const LANGUAGES = [
  { code: "en", name: "English", flagSrc: "/flags/us.svg", nativeName: "English" },
  { code: "ar", name: "العربية", flagSrc: "/flags/sa.svg", nativeName: "العربية" },
  { code: "zh", name: "中文", flagSrc: "/flags/cn.svg", nativeName: "中文" },
];

export default function LanguageSwitcher({ lang, className = "", displayText = null, showFlagOnly = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const switchLanguage = (newLang) => {
    // Normalize pathname: remove any leading language segments (en/ar/zh)
    // This guards against cases where pathname might be '/en' or '/en/zh/en'
    const supported = ['en', 'ar', 'zh'];
    let path = pathname || '';

    // Remove leading /lang segments repeatedly if present
    // e.g. '/en/zh/en' -> ''
    while (path.match(new RegExp(`^/(${supported.join('|')})(?=/|$)`))) {
      path = path.replace(new RegExp(`^/(${supported.join('|')})(?=/|$)`), '');
    }

    // Ensure path starts with slash if not empty
    if (path && !path.startsWith('/')) path = '/' + path;

    // Build the new path with the desired language
    const newPath = path === '' ? `/${newLang}` : `/${newLang}${path}`;

    console.log('Language switch:', { currentLang: lang, newLang, originalPathname: pathname, cleanedPath: path, newPath });
    // Use replace: true to avoid adding to browser history for smoother UX
    router.push(newPath, { scroll: false });
    setIsOpen(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const otherLanguages = LANGUAGES.filter((l) => l.code !== lang);

  return (
    <div className={`${styles.languageSwitcher} ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.switcherButton}
        aria-label={`Switch language. Current: ${currentLang.name}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={styles.flag}>
          <img src={currentLang.flagSrc} alt={`${currentLang.code} flag`} className={styles.flagImg} />
        </span>
        {showFlagOnly ? (
          <span className={styles.langCodeButton} aria-hidden="true">{currentLang.code.toUpperCase()}</span>
        ) : (
          <span className={styles.languageName}>{displayText || currentLang.nativeName}</span>
        )}
        <svg
          className={`${styles.chevron} ${isOpen ? styles.open : ""}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className={styles.backdrop}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className={styles.dropdown} role="menu">
            {otherLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={styles.dropdownItem}
                role="menuitem"
                aria-label={`Switch to ${lang.name}`}
              >
                <span className={styles.flag}>
                  <img src={lang.flagSrc} alt={`${lang.code} flag`} className={styles.flagImg} />
                </span>
                <span className={styles.langCode}>{lang.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
