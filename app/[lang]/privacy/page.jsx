'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage({ params }) {
  const lang = params?.lang || 'en';
  const isRTL = lang === 'ar';
  return (
    <main dir={isRTL ? 'rtl' : 'ltr'} style={{ padding: '3rem' }}>
      <h1>{isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}</h1>
      <p style={{ maxWidth: 800 }}>
        {isRTL
          ? 'نص سياسة الخصوصية الافتراضي. يرجى تحديث هذه الصفحة بمحتوى سياسة الخصوصية على مستوى المشروع.'
          : 'Default privacy policy placeholder. Please replace with your actual privacy policy content.'}
      </p>
      <p>
        <Link href={`/${lang}`}>{isRTL ? 'العودة إلى الصفحة الرئيسية' : 'Back to home'}</Link>
      </p>
    </main>
  );
}
