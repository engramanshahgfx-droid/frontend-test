'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import UnifiedBookingEntry from '@/components/BookingFlow/UnifiedBookingEntry';

/**
 * Example Component: Using UnifiedBookingEntry
 * 
 * This demonstrates how to use the unified booking system
 * in any page or component throughout your application.
 */
export default function BookingExample() {
  const params = useParams();
  const lang = params?.lang || 'en';

  // State to control when to show the booking modal
  const [isBookingOpen, setIsBookingOpen] = useState(false);

const translations = {
    en: {
      title: 'Book Your Experience',
      subtitle: 'Choose what you\'d like to book',
      button: 'Open Booking',
      buttonSmall: 'Book Now',
      description: 'Click any "Book Now" button to start the booking process. You\'ll be asked to choose between International Trips or Local Activities.',
    },
    ar: {
      title: 'احجز تجربتك',
      subtitle: 'اختر ما تود حجزه',
      button: 'فتح الحجز',
      buttonSmall: 'احجز الآن',
      description: 'انقر على أي زر "احجز الآن" لبدء عملية الحجز. سيُطلب منك الاختيار بين رحلات دولية أو أنشطة محلية.',
    },
    zh: {
      title: '预订您的体验',
      subtitle: '选择您想预订的项目',
      button: '打开预订',
      buttonSmall: '立即预订',
      description: '点击任意"立即预订"按钮开始预订流程。系统将要求您选择国际旅行或本地活动。',
    },
  };

  const t = translations[lang === 'ar' ? 'ar' : 'en'];
  const isRTL = lang === 'ar';

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: isRTL ? 'right' : 'left' }}>{t.title}</h1>
      <p style={{ color: '#666', textAlign: isRTL ? 'right' : 'left' }}>
        {t.subtitle}
      </p>

      {/* Primary Booking Button */}
      <button
        onClick={() => setIsBookingOpen(true)}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #0b63f6 0%, #0052cc 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          marginBottom: '2rem',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 10px 30px rgba(11, 99, 246, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >
        {t.button}
      </button>

      {/* Information Section */}
      <div
        style={{
          background: '#f0f4ff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '2px solid #0b63f6',
          marginBottom: '2rem',
        }}
      >
        <h3 style={{ color: '#0b63f6', marginTop: 0 }}>
          {lang === 'ar' ? 'كيف تعمل' : 'How It Works'}
        </h3>
        <ol
          style={{
            margin: 0,
            paddingLeft: '1.5rem',
            textAlign: isRTL ? 'right' : 'left',
          }}
        >
          <li>{lang === 'ar' ? 'انقر على "احجز الآن"' : 'Click "Book Now"'}</li>
          <li>
            {lang === 'ar'
              ? 'اختر نوع التجربة (دولية أو محلية)'
              : 'Choose experience type (International or Local)'}
          </li>
          <li>
            {lang === 'ar' ? 'ملء نموذج الحجز' : 'Fill booking form'}
          </li>
          <li>
            {lang === 'ar'
              ? 'اعرض وأكمل الحجز'
              : 'Review and complete booking'}
          </li>
        </ol>
      </div>

      {/* Example Cards Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* International Card */}
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #ddd',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ color: '#0b63f6', marginTop: 0 }}>
            {lang === 'ar' ? '✈️ رحلات دولية' : '✈️ International Trips'}
          </h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            {lang === 'ar'
              ? 'احجز رحلات دولية شاملة مع الفنادق والطيران'
              : 'Book complete international trips with flights and hotels'}
          </p>
          <button
            onClick={() => setIsBookingOpen(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#0b63f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {t.buttonSmall}
          </button>
        </div>

        {/* Local Activities Card */}
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #ddd',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ color: '#27ae60', marginTop: 0 }}>
            {lang === 'ar' ? '🎯 أنشطة محلية' : '🎯 Local Activities'}
          </h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            {lang === 'ar'
              ? 'اكتشف أنشطة محلية مذهلة وترفيه وطعام'
              : 'Discover amazing local activities, entertainment and food'}
          </p>
          <button
            onClick={() => setIsBookingOpen(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {t.buttonSmall}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div
        style={{
          background: '#fff3cd',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #ffc107',
          color: '#856404',
          textAlign: isRTL ? 'right' : 'left',
        }}
      >
        <strong>{lang === 'ar' ? 'ملاحظة:' : 'Note:'}</strong> {t.description}
      </div>

      {/* The Unified Booking Modal */}
      <UnifiedBookingEntry
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        lang={lang}
      />
    </div>
  );
}
