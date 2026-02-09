/**
 * Localization utilities for formatting dates, numbers, and currency
 * Supports: English (en), Arabic (ar), Chinese (zh)
 */

export const LOCALES = {
  EN: "en-US",
  AR: "ar-SA",
  ZH: "zh-CN",
};

export const LOCALE_MAP = {
  en: LOCALES.EN,
  ar: LOCALES.AR,
  zh: LOCALES.ZH,
};

/**
 * Format date based on language
 * @param {Date | string} date - Date to format
 * @param {string} lang - Language code (en, ar, zh)
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date
 */
export function formatDate(date, lang = "en", options = {}) {
  const locale = LOCALE_MAP[lang] || LOCALES.EN;
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  if (typeof date === "string") {
    date = new Date(date);
  }

  return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
}

/**
 * Format time based on language
 * @param {Date | string} date - Date/time to format
 * @param {string} lang - Language code (en, ar, zh)
 * @returns {string} - Formatted time
 */
export function formatTime(date, lang = "en") {
  const locale = LOCALE_MAP[lang] || LOCALES.EN;

  if (typeof date === "string") {
    date = new Date(date);
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: lang !== "zh",
  }).format(date);
}

/**
 * Format currency based on language
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (SAR, USD, CNY, etc.)
 * @param {string} lang - Language code (en, ar, zh)
 * @returns {string} - Formatted currency
 */
export function formatCurrency(amount, currency = "SAR", lang = "en") {
  const locale = LOCALE_MAP[lang] || LOCALES.EN;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number based on language
 * @param {number} number - Number to format
 * @param {string} lang - Language code (en, ar, zh)
 * @param {object} options - Intl.NumberFormat options
 * @returns {string} - Formatted number
 */
export function formatNumber(number, lang = "en", options = {}) {
  const locale = LOCALE_MAP[lang] || LOCALES.EN;
  const defaultOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  };

  return new Intl.NumberFormat(locale, defaultOptions).format(number);
}

/**
 * Format phone number (basic formatting)
 * @param {string} phone - Phone number to format
 * @param {string} lang - Language code (en, ar, zh)
 * @returns {string} - Formatted phone number
 */
export function formatPhone(phone, lang = "en") {
  if (!phone) return "";

  // Remove non-digits
  const digits = phone.replace(/\D/g, "");

  if (lang === "ar") {
    // Saudi Arabia format: +966 XX XXX XXXX
    if (digits.startsWith("966")) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    }
  }

  // Default format for en and zh
  if (digits.length >= 10) {
    return `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }

  return phone;
}

/**
 * Get text direction based on language
 * @param {string} lang - Language code (en, ar, zh)
 * @returns {string} - 'rtl' or 'ltr'
 */
export function getTextDirection(lang) {
  return lang === "ar" ? "rtl" : "ltr";
}

/**
 * Get language native name
 * @param {string} lang - Language code (en, ar, zh)
 * @returns {string} - Native language name
 */
export function getLanguageName(lang) {
  const names = {
    en: "English",
    ar: "العربية",
    zh: "中文",
  };

  return names[lang] || lang;
}

/**
 * Get language flag emoji
 * @param {string} lang - Language code (en, ar, zh)
 * @returns {string} - Flag emoji
 */
export function getLanguageFlag(lang) {
  const flags = {
    en: "🇺🇸",
    ar: "🇸🇦",
    zh: "🇨🇳",
  };

  return flags[lang] || "🌐";
}

/**
 * Parse date string in different formats based on language
 * @param {string} dateStr - Date string to parse
 * @param {string} lang - Language code (en, ar, zh)
 * @returns {Date} - Parsed date
 */
export function parseLocalizedDate(dateStr, lang = "en") {
  // For now, just parse as ISO or standard date
  // In production, you might need more sophisticated parsing
  return new Date(dateStr);
}
