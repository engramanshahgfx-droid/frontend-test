"use client";

import { useTranslation } from "@/hooks/useTranslation";
import {
  formatDate,
  formatTime,
  formatCurrency,
  formatNumber,
  formatPhone,
  getTextDirection,
} from "@/lib/localization";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./TrilingualExample.module.css";

/**
 * Example component showing how to use:
 * - Custom useTranslation hook
 * - Localization utilities
 * - LanguageSwitcher
 * - RTL support
 * - Form handling with translations
 */
export default function TrilingualExample({ lang }) {
  const { t, language, isRTL, isLoading } = useTranslation();

  if (isLoading) {
    return <div className={styles.loading}>{t("general.loading")}</div>;
  }

  return (
    <div
      className={styles.container}
      dir={getTextDirection(language)}
      lang={language}
    >
      {/* Header with Language Switcher */}
      <header className={styles.header}>
        <h1>{t("nav.home")}</h1>
        <LanguageSwitcher lang={language} />
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* 1. Navigation Example */}
        <section className={styles.section}>
          <h2>{t("general.language")}: {t(`general.${language}`)}</h2>
          <nav className={styles.nav}>
            <a href={`/${language}/about`}>{t("nav.about")}</a>
            <a href={`/${language}/contact`}>{t("nav.contact")}</a>
            <a href={`/${language}/products`}>{t("nav.products")}</a>
            <a href={`/${language}/bookings`}>{t("nav.bookings")}</a>
          </nav>
        </section>

        {/* 2. Form Example */}
        <section className={styles.section}>
          <h2>{t("booking.bookingDetails")}</h2>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label>{t("forms.fullName")}</label>
              <input
                type="text"
                placeholder={t("forms.fullName")}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("forms.email")}</label>
              <input
                type="email"
                placeholder={t("forms.email")}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("forms.phoneNumber")}</label>
              <input
                type="tel"
                placeholder={t("forms.phoneNumber")}
              />
              <small>
                {t("general.example")}: {formatPhone("966551234567", language)}
              </small>
            </div>

            <div className={styles.formGroup}>
              <label>{t("booking.travelDate")}</label>
              <input type="date" required />
              {language && (
                <small>
                  {t("general.example")}: {formatDate(new Date(), language)}
                </small>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>{t("booking.guests")}</label>
              <input type="number" min="1" max="10" defaultValue="1" />
            </div>

            <button type="submit" className={styles.primaryBtn}>
              {t("buttons.bookNow")}
            </button>
            <button type="reset" className={styles.secondaryBtn}>
              {t("buttons.reset")}
            </button>
          </form>
        </section>

        {/* 3. Pricing Example with Currency Formatting */}
        <section className={styles.section}>
          <h2>{t("booking.estimatedPrice")}</h2>
          <div className={styles.priceGrid}>
            <div className={styles.priceCard}>
              <h3>{t("general.sar")}</h3>
              <p className={styles.price}>
                {formatCurrency(5000, "SAR", language)}
              </p>
              <p className={styles.description}>{t("general.currency")}</p>
            </div>

            <div className={styles.priceCard}>
              <h3>{t("general.usd")}</h3>
              <p className={styles.price}>
                {formatCurrency(1333, "USD", language)}
              </p>
            </div>

            <div className={styles.priceCard}>
              <h3>{t("general.cny")}</h3>
              <p className={styles.price}>
                {formatCurrency(9500, "CNY", language)}
              </p>
            </div>
          </div>
        </section>

        {/* 4. Date/Time Formatting */}
        <section className={styles.section}>
          <h2>{t("dates.today")}</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3>{t("general.loading")} Format</h3>
              <p>{formatDate(new Date(), language)}</p>
            </div>

            <div className={styles.infoCard}>
              <h3>{t("general.loading")} Time</h3>
              <p>{formatTime(new Date(), language)}</p>
            </div>

            <div className={styles.infoCard}>
              <h3>Sample Date</h3>
              <p>{formatDate("2024-06-15", language)}</p>
            </div>
          </div>
        </section>

        {/* 5. Number Formatting */}
        <section className={styles.section}>
          <h2>Number Format Examples</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <p>1,000: {formatNumber(1000, language)}</p>
              <p>12,345: {formatNumber(12345, language)}</p>
              <p>1,234,567: {formatNumber(1234567, language)}</p>
            </div>
          </div>
        </section>

        {/* 6. Messages Example */}
        <section className={styles.section}>
          <h2>{t("success.submitted")}</h2>
          <div className={styles.alertSuccess}>
            <strong>✓ {t("success.bookingConfirmed")}</strong>
            <p>{t("general.welcome")}</p>
          </div>

          <h2>{t("errors.error")}</h2>
          <div className={styles.alertError}>
            <strong>✗ {t("validation.required")}</strong>
            <p className={styles.hint}>
              {t("validation.minLength", { count: 8 })}
            </p>
          </div>
        </section>

        {/* 7. Validation & Help Text */}
        <section className={styles.section}>
          <h2>{t("general.helpCenter")}</h2>
          <div className={styles.helpText}>
            <p>• {t("validation.invalidEmail")}</p>
            <p>• {t("validation.invalidPhone")}</p>
            <p>• {t("validation.passwordMismatch")}</p>
            <p>• {t("validation.passwordTooShort")}</p>
          </div>
        </section>

        {/* 8. Status Indicators */}
        <section className={styles.section}>
          <h2>{t("booking.bookingStatus")}</h2>
          <div className={styles.statusGrid}>
            <div className={`${styles.statusBadge} ${styles.confirmed}`}>
              {t("booking.confirmed")}
            </div>
            <div className={`${styles.statusBadge} ${styles.pending}`}>
              {t("general.pending")}
            </div>
            <div className={`${styles.statusBadge} ${styles.cancelled}`}>
              {t("general.cancel")}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div>
            <h3>{t("nav.about")}</h3>
            <ul>
              <li><a href="#">{t("nav.aboutSaudi")}</a></li>
              <li><a href="#">{t("nav.services")}</a></li>
              <li><a href="#">{t("nav.faq")}</a></li>
            </ul>
          </div>

          <div>
            <h3>{t("general.helpCenter")}</h3>
            <ul>
              <li><a href="#">{t("nav.contact")}</a></li>
              <li><a href="#">{t("general.privacy")}</a></li>
              <li><a href="#">{t("general.terms")}</a></li>
            </ul>
          </div>

          <div>
            <h3>{t("general.followUs")}</h3>
            <ul>
              <li><a href="#">{t("social.facebook")}</a></li>
              <li><a href="#">{t("social.instagram")}</a></li>
              <li><a href="#">{t("social.whatsapp")}</a></li>
            </ul>
          </div>
        </div>

        <p className={styles.copyright}>
          {t("general.copyright")}
        </p>
      </footer>

      {/* Debug Info (Optional) */}
      <div className={styles.debugInfo}>
        <p><strong>Current Language:</strong> {language}</p>
        <p><strong>Direction:</strong> {getTextDirection(language)}</p>
        <p><strong>Is RTL:</strong> {isRTL ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}
