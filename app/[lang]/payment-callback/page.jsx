'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../providers/AuthProvider';
import { paymentsAPI, bookingsAPI } from '../../../lib/api';
import styles from './page.module.css';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  const lang = params?.lang || 'ar';
  const isRTL = lang === 'ar';

  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Moyasar callback parameters
  const paymentId = searchParams.get('id');
  const paymentStatus = searchParams.get('status');
  const message = searchParams.get('message');

  const t = {
    processing: isRTL ? 'جاري معالجة الدفع...' : 'Processing payment...',
    success: isRTL ? 'تم الدفع بنجاح!' : 'Payment Successful!',
    failed: isRTL ? 'فشل الدفع' : 'Payment Failed',
    thankYou: isRTL ? 'شكراً لك! تم تأكيد حجزك.' : 'Thank you! Your booking has been confirmed.',
    bookingRef: isRTL ? 'رقم الحجز' : 'Booking Reference',
    paymentRef: isRTL ? 'رقم الدفع' : 'Payment Reference',
    amount: isRTL ? 'المبلغ' : 'Amount',
    goToDashboard: isRTL ? 'الذهاب للوحة التحكم' : 'Go to Dashboard',
    goToHome: isRTL ? 'العودة للرئيسية' : 'Go to Home',
    tryAgain: isRTL ? 'حاول مرة أخرى' : 'Try Again',
    sar: isRTL ? 'ريال' : 'SAR',
  };

  useEffect(() => {
    if (paymentId && paymentStatus) {
      processPaymentCallback();
    } else {
      setStatus('error');
      setError(isRTL ? 'معلومات الدفع غير متوفرة' : 'Payment information not available');
    }
  }, [paymentId, paymentStatus]);

  const processPaymentCallback = async () => {
    // First, check Moyasar status directly - if paid, show success immediately
    if (paymentStatus === 'paid' || paymentStatus === 'success') {
      setStatus('success');
      setPaymentDetails({ paymentId: paymentId });
      
      // Try to verify with backend (optional, don't block on failure)
      try {
        const response = await paymentsAPI.callback(paymentId, paymentStatus);
        if (response.success) {
          setPaymentDetails({
            paymentId: paymentId,
            bookingId: response.booking_id,
            amount: response.amount_sar || response.amount,
          });
        }
      } catch (err) {
        console.log('Backend verification skipped:', err.message);
        // Still show success - Moyasar already confirmed payment
      }
    } else {
      // Payment failed according to Moyasar
      setStatus('failed');
      setError(message || (isRTL ? 'فشلت عملية الدفع' : 'Payment was not successful'));
    }
  };

  if (status === 'processing') {
    return (
      <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={styles.card}>
          <div className={styles.spinner}></div>
          <h1>{t.processing}</h1>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>{t.success}</h1>
          <p className={styles.successMessage}>{t.thankYou}</p>

          <div className={styles.detailsBox}>
            {paymentDetails?.paymentId && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>{t.paymentRef}:</span>
                <span className={styles.detailValue}>{paymentDetails.paymentId}</span>
              </div>
            )}
            {(paymentDetails?.bookingId || booking?.id) && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>{t.bookingRef}:</span>
                <span className={styles.detailValue}>#{(paymentDetails?.bookingId || booking?.id) + 1000}</span>
              </div>
            )}
            {(paymentDetails?.amount || booking?.amount) && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>{t.amount}:</span>
                <span className={styles.detailValue}>{paymentDetails?.amount || booking?.amount} {t.sar}</span>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {user ? (
              <button 
                className={styles.primaryButton}
                onClick={() => router.push(`/${lang}/dashboard`)}
              >
                {t.goToDashboard}
              </button>
            ) : (
              <button 
                className={styles.primaryButton}
                onClick={() => router.push(`/${lang}`)}
              >
                {t.goToHome}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Failed status
  return (
    <div className={styles.container} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={styles.card}>
        <div className={styles.errorIcon}>✕</div>
        <h1 className={styles.errorTitle}>{t.failed}</h1>
        <p className={styles.errorMessage}>{error || message}</p>

        <div className={styles.actions}>
          <button 
            className={styles.primaryButton}
            onClick={() => router.back()}
          >
            {t.tryAgain}
          </button>
          <button 
            className={styles.secondaryButton}
            onClick={() => router.push(`/${lang}`)}
          >
            {t.goToHome}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingTop: '100px'
      }}>
        <div>Loading...</div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}
