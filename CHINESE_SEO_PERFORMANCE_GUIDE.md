# Chinese Localization: SEO, Performance & Best Practices

## Overview
Complete guide for optimizing your trilingual website (EN, AR, ZH) for search engines, performance, and the Chinese market.

---

## 1. SEO BEST PRACTICES

### 1.1 URL Structure

**Recommended Pattern:**
```
/en/product-details
/ar/product-details  
/zh/product-details
```

**Update your layout.jsx:**
```jsx
export default function Layout({ params }) {
  const lang = params.lang || 'en';
  
  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        {/* Language declaration */}
        <meta name="language" content={lang} />
        <link rel="canonical" href={`https://yourdomain.com/${lang}${pathname}`} />
        {/* hreflang tags */}
        <link rel="alternate" hrefLang="en" href="https://yourdomain.com/en/..." />
        <link rel="alternate" hrefLang="ar" href="https://yourdomain.com/ar/..." />
        <link rel="alternate" hrefLang="zh" href="https://yourdomain.com/zh/..." />
        <link rel="alternate" hrefLang="x-default" href="https://yourdomain.com/en/..." />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 1.2 hreflang Implementation

**Complete Example:**
```jsx
// lib/hreflang.js
export function getHreflangTags(pathname) {
  const baseUrl = 'https://yourdomain.com';
  const pathWithoutLang = pathname.replace(/^\/(en|ar|zh)/, '');
  
  return [
    { rel: 'alternate', hrefLang: 'en', href: `${baseUrl}/en${pathWithoutLang}` },
    { rel: 'alternate', hrefLang: 'ar', href: `${baseUrl}/ar${pathWithoutLang}` },
    { rel: 'alternate', hrefLang: 'zh', href: `${baseUrl}/zh${pathWithoutLang}` },
    { rel: 'alternate', hrefLang: 'x-default', href: `${baseUrl}/en${pathWithoutLang}` },
  ];
}
```

## 2. META TAGS & OPEN GRAPH

### 2.1 Dynamic Meta Tags

```jsx
// app/[lang]/[page]/page.jsx
export async function generateMetadata({ params }) {
  const translations = {
    en: { title: "Product Title", description: "Product description" },
    ar: { title: "عنوان المنتج", description: "وصف المنتج" },
    zh: { title: "产品标题", description: "产品描述" },
  };

  const { lang } = params;
  const metadata = translations[lang] || translations.en;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: `https://yourdomain.com/${lang}/product`,
      languages: {
        en: `https://yourdomain.com/en/product`,
        ar: `https://yourdomain.com/ar/product`,
        zh: `https://yourdomain.com/zh/product`,
        'x-default': `https://yourdomain.com/en/product`,
      },
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: `https://yourdomain.com/${lang}/product`,
      type: 'website',
      locale: lang === 'ar' ? 'ar_SA' : lang === 'zh' ? 'zh_CN' : 'en_US',
      siteName: 'Your Travel Site',
      images: [
        {
          url: 'https://yourdomain.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
  };
}
```

### 2.2 Chinese Social Media Meta Tags

```jsx
// lib/metaTags.js
export function getChineseMetaTags(translations) {
  return {
    // WeChat sharing
    'og:title': translations.zh.title,
    'og:description': translations.zh.description,
    'og:image': 'https://yourdomain.com/og-image-zh.jpg',
    
    // Baidu SEO
    'baidu-site-verification': 'your-verification-code',
    
    // China-specific
    'apple-mobile-web-app-title': translations.zh.title,
  };
}
```

---

## 3. SITEMAP AND ROBOTS.TXT

### 3.1 Sitemap with All Languages

```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <url>
    <loc>https://yourdomain.com/en/home</loc>
    <lastmod>2024-02-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    
    <!-- Alternate language versions -->
    <xhtml:link rel="alternate" hrefLang="en" href="https://yourdomain.com/en/home" />
    <xhtml:link rel="alternate" hrefLang="ar" href="https://yourdomain.com/ar/home" />
    <xhtml:link rel="alternate" hrefLang="zh" href="https://yourdomain.com/zh/home" />
    <xhtml:link rel="alternate" hrefLang="x-default" href="https://yourdomain.com/en/home" />
  </url>

  <url>
    <loc>https://yourdomain.com/en/products</loc>
    <lastmod>2024-02-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    
    <xhtml:link rel="alternate" hrefLang="en" href="https://yourdomain.com/en/products" />
    <xhtml:link rel="alternate" hrefLang="ar" href="https://yourdomain.com/ar/products" />
    <xhtml:link rel="alternate" hrefLang="zh" href="https://yourdomain.com/zh/products" />
  </url>
  
  <!-- Add more URLs here -->

</urlset>
```

### 3.2 Dynamic Sitemap Generator

```javascript
// app/api/sitemap/route.js
export async function GET() {
  const baseUrl = 'https://yourdomain.com';
  const languages = ['en', 'ar', 'zh'];
  const pages = [
    '/',
    '/about',
    '/contact',
    '/products',
    '/bookings',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}/en${page}</loc>
    ${languages
      .map(
        (lang) =>
          `<xhtml:link rel="alternate" hrefLang="${lang}" href="${baseUrl}/${lang}${page}" />`
      )
      .join('\n    ')}
  </url>
    `
    )
    .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

### 3.3 Robots.txt

```txt
# public/robots.txt
User-agent: *
Allow: /

# Allow specific crawlers for Chinese market
User-agent: Baiduspider
Allow: /

User-agent: Sogou-Spider
Allow: /

User-agent: 360Spider
Allow: /

# Disallow sensitive pages
Disallow: /admin/
Disallow: /api/
Disallow: /private/

# Sitemaps
Sitemap: https://yourdomain.com/sitemap.xml
Sitemap: https://yourdomain.com/sitemap-products.xml
Sitemap: https://yourdomain.com/sitemap-blog.xml
```

---

## 4. PERFORMANCE OPTIMIZATION

### 4.1 Font Optimization

```jsx
// app/layout.jsx
import { Noto_Sans_SC, Inter, Tajawal } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const tajawal = Tajawal({ 
  subsets: ['latin', 'arabic'],
  weight: ['400', '600', '700'],
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin', 'chinese_simplified'],
  weight: ['400', '500', '600', '700'],
  display: 'swap', // Improve font loading
});

export default function RootLayout({ params }) {
  const fontClass = {
    en: inter.className,
    ar: tajawal.className,
    zh: notoSansSC.className,
  }[params.lang] || inter.className;

  return (
    <html className={fontClass}>
      <body>{children}</body>
    </html>
  );
}
```

### 4.2 Lazy Load Translations

```javascript
// lib/translationLoader.js
const translationCache = {};

export async function getTranslations(lang) {
  if (translationCache[lang]) {
    return translationCache[lang];
  }

  try {
    const translations = await import(`@/public/locales/${lang}/common.json`);
    translationCache[lang] = translations.default;
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for ${lang}`);
    return {};
  }
}
```

### 4.3 Bundle Splitting by Language

```javascript
// next.config.mjs
export default {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        translations: {
          test: /[\\/]public[\\/]locales[\\/]/,
          name: 'translations',
          priority: 20,
        },
      };
    }
    return config;
  },
};
```

### 4.4 Image Optimization for Different Markets

```jsx
// components/LocalizedImage.jsx
import Image from 'next/image';

export default function LocalizedImage({ lang, src, alt, ...props }) {
  // Use region-specific image CDNs
  const getCDNUrl = (imageSrc) => {
    if (lang === 'zh') {
      // Alibaba CDN for China
      return imageSrc.replace('yourdomain.com/images', 'cdn-china.yourdomain.com/images');
    }
    if (lang === 'ar') {
      // Cloudflare for Middle East
      return imageSrc.replace('yourdomain.com/images', 'cdn-me.yourdomain.com/images');
    }
    return imageSrc;
  };

  return (
    <Image
      src={getCDNUrl(src)}
      alt={alt}
      {...props}
    />
  );
}
```

---

## 5. CHINA-SPECIFIC CONSIDERATIONS

### 5.1 Chinese Search Engines

**Register with major Chinese search engines:**

| Search Engine | Registration | Market Share |
|---|---|---|
| Baidu | https://zhanzhang.baidu.com | ~71% |
| Sogou | https://www.sogou.com/site | ~6% |
| 360 Search | http://zhanzhang.360.cn | ~5% |
| Qihoo | https://fengchao.qihoo.com | ~3% |

**Baidu Sitemap Submission:**
```javascript
// app/api/baidu-sitemap/route.js
export async function GET() {
  const sitemap = generateSitemap(); // Your sitemap generation logic
  
  // Also submit to Baidu API
  const baiduUrl = 'https://zhanzhang.baidu.com/api/linksubmit/';
  
  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

### 5.2 Chinese Social Media Sharing

```jsx
// lib/wechatShare.js
/**
 * WeChat sharing data for Chinese users
 */
export function getWechatShareConfig(metadata) {
  return {
    title: metadata.title,
    description: metadata.description,
    imgUrl: metadata.image,
    link: metadata.url,
    // Additional WeChat-specific data
    type: 'link',
    dataUrl: '',
  };
}

// In your component
export function WeChatShare({ lang, metadata }) {
  const shareConfig = getWechatShareConfig(metadata);
  
  useEffect(() => {
    if (lang === 'zh' && window.wx) {
      window.wx.config({
        // WeChat config
        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'],
      });
      
      window.wx.ready(() => {
        window.wx.onMenuShareAppMessage(shareConfig);
        window.wx.onMenuShareTimeline(shareConfig);
      });
    }
  }, [lang, shareConfig]);

  return null;
}
```

### 5.3 Payment Methods for China

```javascript
// lib/paymentMethods.js
export const paymentMethods = {
  en: [
    { id: 'card', name: 'Credit Card', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '🌐' },
  ],
  ar: [
    { id: 'card', name: 'بطاقة ائتمان', icon: '💳' },
    { id: 'bank', name: 'تحويل بنكي', icon: '🏦' },
  ],
  zh: [
    { id: 'alipay', name: '支付宝', icon: '🔵' },
    { id: 'wechat', name: '微信支付', icon: '💚' },
    { id: 'unionpay', name: '银联', icon: '🔴' },
    { id: 'card', name: '信用卡', icon: '💳' },
  ],
};
```

---

## 6. ANALYTICS FOR MULTILINGUAL SITES

### 6.1 Google Analytics 4 Setup

```jsx
// app/layout.jsx
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ params }) {
  return (
    <>
      <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
      
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('config', 'GA_MEASUREMENT_ID', {
              'language': '${params.lang}',
              'page_lang': '${params.lang === 'ar' ? 'ar' : params.lang === 'zh' ? 'zh' : 'en'}',
              'content_language': '${params.lang}',
            });
          `,
        }}
      />
    </>
  );
}
```

### 6.2 Track Language Switches

```javascript
// lib/analytics.js
export function trackLanguageSwitch(fromLang, toLang) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'language_switch', {
      from_language: fromLang,
      to_language: toLang,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## 7. TESTING CHECKLIST

### SEO Testing
- [ ] hreflang tags are correct for all pages
- [ ] Canonical URLs point to correct language version
- [ ] Sitemap includes all language versions
- [ ] Robots.txt allows all language versions
- [ ] XML sitemap validates at https://www.xml-sitemaps.com/
- [ ] Google Search Console shows all language versions indexed
- [ ] Baidu Search Console is set up (for Chinese)

### Chinese Market Testing
- [ ] Website works in mainland China (test with VPN)
- [ ] Chinese fonts render correctly
- [ ] Payment methods show Alipay/WeChat in Chinese version
- [ ] Phone numbers format correctly for Chinese users
- [ ] Currency shows CNY as primary in Chinese version
- [ ] Date formatting uses Chinese calendar

### Performance Testing
- [ ] Page Load Time < 3s (Lighthouse score > 90)
- [ ] First Contentful Paint (FCP) < 2.5s
- [ ] Language switching doesn't cause layout shift
- [ ] Translation files are properly gzipped
- [ ] Images are optimized for each language version

---

## 8. DEPLOYMENT CHECKLIST

- [ ] All translation JSON files are valid
- [ ] Font files are deployed and accessible
- [ ] Next.js is configured with correct locales
- [ ] Environment variables for analytics are set
- [ ] sitemap.xml is accessible
- [ ] robots.txt is accessible
- [ ] hreflang tags are in HTML head
- [ ] SSR is enabled for SEO
- [ ] Next.js ISR is configured for frequent updates

---

## 9. MONITORING & MAINTENANCE

### Monitor These Metrics:

```javascript
// lib/metrics.js
export const metricsToMonitor = {
  seo: [
    'Organic search impressions by language',
    'Click-through rate by language',
    'Average position by language',
    'Indexed pages by language',
  ],
  performance: [
    'Page load time by language',
    'Time to interactive by language',
    'Core Web Vitals by language',
  ],
  user: [
    'Language selection frequency',
    'Bounce rate by language',
    'Conversion rate by language',
    'Session duration by language',
  ],
};
```

---

## 10. COMMON ISSUES & SOLUTIONS

| Issue | Cause | Solution |
|-------|-------|----------|
| Chinese pages not indexing | No Baidu crawling | Submit sitemap to Baidu Search Console |
| hreflang warnings | Incorrect language codes | Use standard ISO 639-1 codes (en, ar, zh) |
| Font not loading in China | CDN blocked | Use Alibaba CDN or local font hosting |
| Chinese characters broken | Missing UTF-8 encoding | Add `<meta charset="utf-8">` to head |
| WeChat sharing shows wrong image | OG:image not accessible | Use absolute URLs for images |

---

## 11. RESOURCES

### Tools
- **Google Search Console**: https://search.google.com/search-console
- **Baidu Search Console**: https://zhanzhang.baidu.com/
- **Lighthouse**: Built into Chrome DevTools
- **GTmetrix**: https://gtmetrix.com/

### Documentation
- **Next.js i18n**: https://nextjs.org/docs/pages/building-your-application/routing/internationalization-routing
- **hreflang Guide**: https://support.google.com/webmasters/answer/189077
- **Chinese SEO Guide**: https://moz.com/blog/chinese-seo

---

## Next Steps

1. **Submit to Search Engines**: Register sitemap with Baidu, Google, and other engines
2. **Monitor Rankings**: Track keyword rankings in each language/market
3. **Gather User Data**: Use analytics to understand user behavior by language
4. **Optimize Content**: Update based on search intent in each language/market
5. **Build Backlinks**: Create language-specific link building strategy
