# Chinese Language Support Implementation Guide

## Overview
This guide provides complete instructions for implementing trilingual support (English, Arabic, Chinese) in your Next.js travel website.

---

## 1. PROJECT SETUP

### Already Completed ✅
- Updated `next-i18next.config.js` to include Chinese locale (`zh`)
- Created translation JSON files for all three languages:
  - `/public/locales/en/common.json` - English
  - `/public/locales/ar/common.json` - Arabic
  - `/public/locales/zh/common.json` - Chinese
- Enhanced `LanguageSwitcher` component with dropdown UI
- Created CSS module with responsive design and RTL support
- Added custom `useTranslation` hook
- Added localization utilities for formatting

---

## 2. USING TRANSLATIONS IN COMPONENTS

### Option 1: Using the Custom Hook (Recommended)

```jsx
// app/[lang]/page.jsx
"use client";
import { useTranslation } from "@/hooks/useTranslation";

export default function HomePage() {
  const { t, language, isRTL } = useTranslation();

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <h1>{t("nav.home")}</h1>
      <button>{t("buttons.bookNow")}</button>
      <p>{t("general.welcome")}</p>
    </div>
  );
}
```

### Option 2: Static Translations (Server Components)

For server components where you know the language:

```jsx
// app/[lang]/layout.jsx
import en from "@/public/locales/en/common.json";
import ar from "@/public/locales/ar/common.json";
import zh from "@/public/locales/zh/common.json";

export default function Layout({ children, params }) {
  const translations = {
    en: en,
    ar: ar,
    zh: zh,
  };

  const t = translations[params.lang] || en;

  return (
    <html dir={params.lang === "ar" ? "rtl" : "ltr"}>
      <body>
        <nav>
          <h1>{t.nav.home}</h1>
        </nav>
        {children}
      </body>
    </html>
  );
}
```

---

## 3. TRANSLATION KEY STRUCTURE

All translations are organized in namespaces:

```
common.nav.*           // Navigation items
common.buttons.*       // Button labels
common.forms.*         // Form field labels
common.validation.*    // Validation messages
common.success.*       // Success messages
common.errors.*        // Error messages
common.general.*       // General UI strings
common.booking.*       // Booking-related strings
common.payment.*       // Payment-related strings
common.dates.*         // Date/time related strings
common.social.*        // Social media platform names
```

### Example Usage

```jsx
// Navigation
{t('nav.home')}
{t('nav.about')}
{t('nav.contact')}

// Forms
<label>{t('forms.fullName')}</label>
<label>{t('forms.email')}</label>

// Buttons
<button>{t('buttons.submit')}</button>
<button>{t('buttons.bookNow')}</button>

// Messages
{t('success.bookingConfirmed')}
{t('errors.invalidEmail')}

// With interpolation
{t('validation.minLength', { count: 8 })}
```

---

## 4. USING LOCALIZATION UTILITIES

### Date Formatting

```jsx
import { formatDate, formatTime } from "@/lib/localization";

// Format date based on language
<div>
  {formatDate(new Date(), "zh")} // Chinese format
  {formatDate(new Date(), "ar")} // Arabic format
  {formatDate(new Date(), "en")} // English format
</div>

// Format time
<div>
  {formatTime(new Date(), "zh")}
</div>
```

### Currency Formatting

```jsx
import { formatCurrency } from "@/lib/localization";

// Format amount in different currencies
<div>
  {formatCurrency(1000, "SAR", "zh")}  // 1,000.00 ر.س (Chinese format)
  {formatCurrency(1000, "USD", "en")}  // $1,000.00
  {formatCurrency(1000, "CNY", "zh")}  // ¥1,000.00
</div>
```

### Number Formatting

```jsx
import { formatNumber } from "@/lib/localization";

{formatNumber(1234567, "zh")}  // 1,234,567 (Chinese format)
{formatNumber(1234567, "ar")}  // 1,234,567 (Arabic-Indic numerals)
```

### Phone Formatting

```jsx
import { formatPhone } from "@/lib/localization";

{formatPhone("966551234567", "ar")}  // +966 55 123 4567
```

### Text Direction

```jsx
import { getTextDirection } from "@/lib/localization";

const dir = getTextDirection(language);
// dir === "rtl" for Arabic
// dir === "ltr" for English and Chinese
```

---

## 5. LANGUAGE SWITCHER IMPLEMENTATION

### In Your Navbar/Layout

```jsx
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar({ lang }) {
  return (
    <nav>
      <h1>My Travel Site</h1>
      <LanguageSwitcher lang={lang} />
    </nav>
  );
}
```

### Features
- ✅ Dropdown with all available languages
- ✅ Flag emoji indicators
- ✅ Native language names displayed
- ✅ Smooth animations
- ✅ Mobile responsive (touch-friendly)
- ✅ RTL support for Arabic
- ✅ Keyboard navigation accessible
- ✅ Auto-close on language selection

---

## 6. CHINESE LANGUAGE SPECIFIC CONSIDERATIONS

### Font Support
For better Chinese character rendering, update your `app/layout.jsx`:

```jsx
import { Noto_Sans_SC } from 'next/font/google';

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin', 'chinese_simplified'],
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={notoSansSC.className}>
        {children}
      </body>
    </html>
  );
}
```

### Currency Formatting
- **SAR (Saudi Riyal)**: Formatted as "1,000.00 ر.س" in Arabic, "1000.00 ر.ع." in Chinese
- **CNY (Chinese Yuan)**: Formatted as "¥1,000.00"
- **USD (US Dollar)**: Formatted as "$1,000.00"

### Date/Number Formatting
Chinese uses different number formatting than Western languages:
- **English**: 1,234,567.89 (comma as thousands separator, dot as decimal)
- **Chinese**: 1,234,567.89 (same as English)
- **Arabic**: ١٬٢٣٤٬٥٦٧٫٨٩ (Arabic-Indic numerals)

---

## 7. COMMON PATTERNS

### Form Components

```jsx
function ContactForm() {
  const { t, isRTL } = useTranslation();

  return (
    <form dir={isRTL ? "rtl" : "ltr"}>
      <div className="form-group">
        <label>{t('forms.fullName')}</label>
        <input type="text" placeholder={t('forms.fullName')} />
      </div>

      <div className="form-group">
        <label>{t('forms.email')}</label>
        <input type="email" placeholder={t('forms.email')} />
      </div>

      <div className="form-group">
        <label>{t('forms.message')}</label>
        <textarea placeholder={t('forms.message')}></textarea>
      </div>

      <button type="submit">
        {t('buttons.send')}
      </button>
    </form>
  );
}
```

### Error Handling

```jsx
function BookingForm() {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setErrors(prev => ({
        ...prev,
        email: t('validation.invalidEmail')
      }));
    }
  };

  return (
    <div>
      {errors.email && (
        <p className="error">{errors.email}</p>
      )}
    </div>
  );
}
```

### Success Messages

```jsx
function SubmitButton() {
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      await submitForm();
      setSuccess(true);
      // Show success message
      toast.success(t('success.submitted'));
    } catch (error) {
      toast.error(t('errors.serverError'));
    }
  };

  return <button onClick={handleSubmit}>{t('buttons.submit')}</button>;
}
```

---

## 8. STYLED COMPONENTS & CSS

### RTL-Safe CSS Pattern

```css
/* Good - works in both LTR and RTL */
.container {
  margin-inline-start: 1rem;  /* margin-left in LTR, margin-right in RTL */
  margin-inline-end: 1rem;    /* margin-right in LTR, margin-left in RTL */
  padding-inline-start: 1rem;
  padding-inline-end: 1rem;
  text-align: start;          /* left-aligned in LTR, right-aligned in RTL */
}

/* Avoid - LTR only */
.container {
  margin-left: 1rem;
  text-align: left;
}
```

### Responsive Design Considerations

```css
/* Mobile first approach for Chinese */
@media (max-width: 768px) {
  body {
    font-size: 16px;  /* Larger for better readability */
  }

  .text-container {
    word-break: break-word;  /* Important for Chinese text */
    overflow-wrap: break-word;
  }
}
```

---

## 9. TESTING CHECKLIST

- [ ] Language switcher works for all 3 languages
- [ ] URLs update correctly (e.g., /en/home → /zh/home)
- [ ] All translations display without placeholders
- [ ] Chinese characters render properly
- [ ] RTL layout works for Arabic
- [ ] Date formatting is correct for each language
- [ ] Currency shows correct symbols and formatting
- [ ] Form validation messages are translated
- [ ] Success/error messages are translated
- [ ] Images load correctly in all languages
- [ ] Mobile layout is responsive for all languages
- [ ] Touch interactions work on mobile
- [ ] Keyboard navigation works (for accessibility)

---

## 10. DEPLOYMENT NOTES

### Environment Variables
No additional environment variables needed. Chinese language uses the same i18next setup.

### CDN Considerations
Chinese users may benefit from:
1. CDN nodes in China (e.g., Alibaba CDN, Cloudflare China)
2. Preload Chinese font files
3. Optimize image sizes for Chinese market

### Performance
- Translation files are lightweight (~50KB each)
- Lazy load translations per language
- Cache translations on client side

---

## 11. COMMON ISSUES & SOLUTIONS

### Issue: Chinese characters display incorrectly
**Solution**: Ensure Google Fonts Chinese support is imported:
```jsx
import { Noto_Sans_SC } from 'next/font/google';
```

### Issue: Language doesn't switch
**Solution**: Check that URL structure is `/[lang]/page`

### Issue: RTL layout breaks with inline styles
**Solution**: Use CSS logical properties (margin-inline-start, etc.)

### Issue: Form validation messages are in English
**Solution**: Use the translation key from `validation.*` namespace

---

## 12. EXTENDING TRANSLATIONS

### Adding New Translation Strings

1. Add to all three JSON files:

```json
{
  "newSection": {
    "newKey": "English text",
    "anotherKey": "Another text"
  }
}
```

2. Use in component:

```jsx
{t('newSection.newKey')}
{t('newSection.anotherKey')}
```

### Adding New Languages

1. Create new locale file: `/public/locales/[lang-code]/common.json`
2. Update `next-i18next.config.js`:

```javascript
locales: ["en", "ar", "zh", "new-lang"]
```

3. Update `LanguageSwitcher.jsx` LANGUAGES array

---

## 13. RESOURCES & REFERENCES

- **i18next Documentation**: https://www.i18next.com/
- **Next.js i18n**: https://nextjs.org/docs/pages/building-your-application/routing/internationalization-routing
- **Intl API**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
- **RTL Styling**: https://rtlstyling.com/

---

## Quick Reference

### File Locations
```
public/
  locales/
    en/common.json
    ar/common.json
    zh/common.json

hooks/
  useTranslation.js

lib/
  localization.js

components/
  LanguageSwitcher.jsx
  LanguageSwitcher.module.css
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `t(key)` | Get translated string |
| `formatDate(date, lang)` | Format date by language |
| `formatCurrency(amount, currency, lang)` | Format currency |
| `formatNumber(number, lang)` | Format numbers |
| `formatPhone(phone, lang)` | Format phone numbers |
| `getTextDirection(lang)` | Get RTL/LTR direction |

---

## Support

For issues or questions:
1. Check the testing checklist
2. Review the Common Issues section
3. Verify translation JSON syntax
4. Check browser console for errors
