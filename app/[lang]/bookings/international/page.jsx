'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../../../providers/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function InternationalBookingSuccess({ params }) {
  const resolvedParams = React.use(params);
  const lang = resolvedParams?.lang || 'en';
  const isRTL = lang === 'ar';
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard with reservations tab
    if (!loading && isAuthenticated) {
      router.replace(`/${lang}/dashboard?tab=reservations`);
    }
  }, [isAuthenticated, loading, router, lang]);

  // For guest users (not authenticated), show confirmation message
  return (
    <div style={{ padding: 40, paddingTop: 90, textAlign: isRTL ? 'right' : 'left', minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#e6e6e6' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <h1 style={{ color: '#dfa528', marginBottom: '20px', textAlign: isRTL ? 'right' : 'center' }}>
          {isRTL ? 'تم استلام طلب الحجز الدولي' : 'International Booking Reservation Received'}
        </h1>
        <p style={{ fontSize: '1rem', color: '#cfcfcf', marginTop: '20px', textAlign: isRTL ? 'right' : 'center' }}>
          {isRTL ? 'شكراً! تم استلام طلب الحجز الخاص بك. سيقوم فريقنا بمراجعته والتواصل معك خلال 24 ساعة.' : 'Thank you! Your reservation request has been submitted. Our team will review it and contact you within 24 hours.'}
        </p>
        <div style={{ marginTop: '30px', padding: '24px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', color: '#e6e6e6' }}>
          <h3 style={{ marginTop: 0, color: '#f1f1f1' }}>{isRTL ? 'الخطوات التالية:' : 'What happens next:'}</h3>
          <ul style={{ marginTop: '15px', marginLeft: isRTL ? 0 : '20px', marginRight: isRTL ? '20px' : 0, color: '#d6d6d6' }}>
            <li>{isRTL ? 'مراجعة طلب الحجز من قبل فريقنا' : 'Our team will review your reservation request'}</li>
            <li>{isRTL ? 'إرسال تأكيد التفاصيل والأسعار النهائية' : 'Final confirmation with pricing details will be sent'}</li>
            <li>{isRTL ? 'بعد الدفع، سيتم تحويل الحجز إلى حجز نهائي' : 'After payment is confirmed, your reservation becomes a confirmed booking'}</li>
          </ul>
        </div>
        
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '4px solid rgba(0,153,204,0.9)', color: '#e6e6e6' }}>
          <h4 style={{ color: '#7fd3ea', marginTop: 0 }}>
            {isRTL ? '📝 ملاحظة مهمة' : '📝 Important Note'}
          </h4>
          <p style={{ color: '#d6d6d6', marginBottom: 0 }}>
            {isRTL 
              ? 'إذا كان لديك حساب معنا، قم بتسجيل الدخول لتتمكن من متابعة طلب الحجز الخاص بك في لوحة التحكم.' 
              : 'If you have an account with us, please login to track your reservation in your dashboard.'}
          </p>
        </div>

        <div style={{ marginTop: '30px', textAlign: isRTL ? 'right' : 'left' }}>
          <Link href={`/${lang}`} style={{ color: '#dfa528', textDecoration: 'none', fontWeight: 'bold', marginRight: '20px' }}>
            {isRTL ? '← العودة إلى الصفحة الرئيسية' : '← Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}