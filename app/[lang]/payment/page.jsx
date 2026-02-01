'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../providers/AuthProvider';
import { paymentsAPI, bookingsAPI } from '../../../lib/api';
import Script from 'next/script';

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, loading } = useAuth();
  const moyasarFormRef = useRef(null);
  
  const lang = params?.lang || 'ar';
  const isRTL = lang === 'ar';

  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  // Force Moyasar gateway — UI will not display other options so Moyasar can present automatic methods
  const [gateway, setGateway] = useState('moyasar');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [moyasarConfig, setMoyasarConfig] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const bookingId = searchParams.get('booking_id');
  const callbackStatus = searchParams.get('status');
  const paymentId = searchParams.get('payment_id');

  const t = {
    title: isRTL ? 'إتمام الدفع' : 'Complete Your Payment',
    bookingSummary: isRTL ? 'ملخص الحجز' : 'Booking Summary',
    bookingId: isRTL ? 'رقم الحجز' : 'Booking ID',
    date: isRTL ? 'التاريخ' : 'Date',
    guests: isRTL ? 'عدد الضيوف' : 'Guests',
    trip: isRTL ? 'الرحلة' : 'Trip',
    total: isRTL ? 'المجموع' : 'Total Amount',
    paymentGateway: isRTL ? 'بوابة الدفع' : 'Payment Gateway',
    testMode: isRTL ? 'وضع الاختبار' : 'Test Mode',
    moyasar: isRTL ? 'ميسر' : 'Moyasar',
    testCards: isRTL ? 'بطاقات الاختبار' : 'Test Cards',
    pay: isRTL ? 'ادفع' : 'Pay',
    processing: isRTL ? 'جاري المعالجة...' : 'Processing...',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
    securePayment: isRTL ? '🔒 دفع آمن' : '🔒 Secure Payment',
    paymentSuccessTitle: isRTL ? 'تم الدفع بنجاح!' : 'Payment Successful!',
    paymentSuccessMsg: isRTL ? 'شكراً لك! تم تأكيد حجزك.' : 'Thank you! Your booking has been confirmed.',
    goToDashboard: isRTL ? 'الذهاب للوحة التحكم' : 'Go to Dashboard',
    paymentFailed: isRTL ? 'فشل الدفع' : 'Payment Failed',
    sar: isRTL ? 'ريال' : 'SAR',
    enterCard: isRTL ? 'أدخل بيانات البطاقة للدفع:' : 'Enter your card details to pay:',
    back: isRTL ? '← رجوع' : '← Back',
  };

  useEffect(() => {
    if (callbackStatus && paymentId) {
      if (callbackStatus === 'success' || callbackStatus === 'paid') {
        setPaymentSuccess(true);
      } else if (callbackStatus === 'failed' || callbackStatus === 'declined') {
        setError(t.paymentFailed);
      }
    }
  }, [callbackStatus, paymentId]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/${lang}`);
    }
  }, [isAuthenticated, loading, router, lang]);

  useEffect(() => {
    if (bookingId && isAuthenticated) {
      loadBooking();
    }
  }, [bookingId, isAuthenticated]);

  const loadBooking = async () => {
    try {
      const response = await bookingsAPI.getById(bookingId);
      setBooking(response.booking);
    } catch (error) {
      console.error('Failed to load booking:', error);
      setError(isRTL ? 'فشل تحميل تفاصيل الحجز' : 'Failed to load booking details');
    }
  };

  const initializeMoyasar = () => {
    console.log('Initializing Moyasar with config:', moyasarConfig);
    if (window.Moyasar && moyasarConfig && moyasarFormRef.current) {
      try {
        moyasarFormRef.current.innerHTML = '';
        console.log('Moyasar library loaded, creating form...');
        
        // Moyasar init expects element as a DOM reference, not selector
        const configToUse = {
          ...moyasarConfig,
          element: moyasarFormRef.current, // Use actual DOM element, not selector
        };
        
        // Remove element from config if it's a string selector
        if (typeof configToUse.element === 'string') {
          delete configToUse.element;
        }
        
        window.Moyasar.init({
          ...configToUse,
          test_mode: true,
          on_completed: function(payment) {
            console.log('Moyasar payment completed:', payment);
            setPaymentSuccess(true);
          },
          on_failure: function(error) {
            console.error('Moyasar payment failed:', error);
            setError(error.message || t.paymentFailed);
            setIsProcessing(false);
          },
        });
        console.log('Moyasar form initialized successfully');
      } catch (err) {
        console.error('Failed to initialize Moyasar:', err);
        setError(err.message);
      }
    } else {
      console.log('Cannot initialize Moyasar:', {
        hasMoyasar: !!window.Moyasar,
        hasMoyasarConfig: !!moyasarConfig,
        hasRef: !!moyasarFormRef.current
      });
    }
  };

  useEffect(() => {
    const checkAndInit = () => {
      if (window.Moyasar && moyasarConfig && moyasarFormRef.current) {
        initializeMoyasar();
      } else if (!window.Moyasar && moyasarConfig) {
        // Script might still be loading, retry after delay
        setTimeout(checkAndInit, 500);
      }
    };
    checkAndInit();
  }, [moyasarConfig]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const amount = booking.details?.amount || 1000;
      
      console.log('Initiating payment with gateway:', gateway);
      const response = await paymentsAPI.initiate({
        booking_id: bookingId,
        amount: amount,
        method: paymentMethod,
        gateway: gateway,
      });

      if (gateway === 'moyasar') {
        console.log('Payment response:', response);
        let config = response.moyasar_config;
        
        if (!config) {
          throw new Error(isRTL ? 'لم يتم استلام إعدادات الدفع' : 'Payment configuration not received from server');
        }
        console.log('Final Moyasar config:', config);
        setMoyasarConfig(config);
        setIsProcessing(false);
      } else if (gateway === 'test') {
        setPaymentSuccess(true);
      } else if (response.payment_url) {
        window.location.href = response.payment_url;
      } else {
        throw new Error(isRTL ? 'لم يتم استلام رابط الدفع' : 'No payment URL received');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setError(error.message || (isRTL ? 'فشل بدء الدفع' : 'Failed to initiate payment'));
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="payment-page" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="payment-container">
          <div className="payment-card success-card">
            <div className="success-icon">✓</div>
            <h1>{t.paymentSuccessTitle}</h1>
            <p>{t.paymentSuccessMsg}</p>
            <button className="btn-dashboard" onClick={() => router.push(`/${lang}/dashboard`)}>
              {t.goToDashboard}
            </button>
          </div>
        </div>
        <style jsx>{`
          .payment-page { min-height: 100vh; background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%); padding-top: 120px; }
          .payment-container { max-width: 500px; margin: 0 auto; padding: 1rem; }
          .success-card { background: white; border-radius: 16px; padding: 3rem; text-align: center; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
          .success-icon { width: 80px; height: 80px; background: linear-gradient(135deg, #28a745, #20c997); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white; margin: 0 auto 1.5rem; }
          h1 { color: #28a745; margin-bottom: 1rem; }
          p { color: #666; margin-bottom: 2rem; }
          .btn-dashboard { background: linear-gradient(135deg, #8a7779, #a89294); color: white; border: none; padding: 1rem 2rem; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; }
        `}</style>
      </div>
    );
  }

  if (loading || !booking) {
    return <div className="loading" style={{ textAlign: 'center', padding: '4rem', paddingTop: '150px' }}>{t.loading}</div>;
  }

  return (
    <div className="payment-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <Script 
        src="https://cdn.moyasar.com/mpf/1.14.0/moyasar.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Moyasar.js script loaded');
          if (moyasarConfig && moyasarFormRef.current) {
            setTimeout(() => initializeMoyasar(), 300);
          }
        }}
      />
      <link rel="stylesheet" href="https://cdn.moyasar.com/mpf/1.14.0/moyasar.css" />

      <div className="payment-container">
        <div className="payment-card">
          <h1>{t.title}</h1>
          
          <div className="booking-summary">
            <h2>{t.bookingSummary}</h2>
            <div className="summary-item"><span>{t.bookingId}:</span><span>#{booking.id + 1000}</span></div>
            <div className="summary-item"><span>{t.date}:</span><span>{new Date(booking.date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</span></div>
            <div className="summary-item"><span>{t.guests}:</span><span>{booking.guests}</span></div>
            {booking.details?.trip_title && <div className="summary-item"><span>{t.trip}:</span><span>{booking.details.trip_title}</span></div>}
            <div className="summary-total"><span>{t.total}:</span><span className="amount">{booking.details?.amount || 1000} {t.sar}</span></div>
          </div>

          {!moyasarConfig && (
            <form onSubmit={handlePayment}>
              {/* Hidden gateway (always Moyasar) */}
              <input type="hidden" name="gateway" value="moyasar" />

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn-pay" disabled={isProcessing}>
                {isProcessing ? t.processing : `${t.pay} ${booking.details?.amount || 1000} ${t.sar}`}
              </button>
            </form>
          )} 

          {moyasarConfig && (
            <div className="moyasar-section">
              <p className="moyasar-info">{t.enterCard}</p>
              <div id="moyasar-form" ref={moyasarFormRef} className="mysr-form" style={{ minHeight: '450px', border: '2px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem', background: '#fafafa' }} />
              <p style={{ color: '#999', textAlign: 'center', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {!window.Moyasar ? 'Loading payment form...' : 'Enter your card details'}
              </p>
              {error && <div className="error-message">{error}</div>}
              <button type="button" className="btn-back" onClick={() => { setMoyasarConfig(null); setError(null); }}>{t.back}</button>
            </div>
          )}

          <div className="secure-badge"><span>{t.securePayment}</span></div>
        </div>
      </div>
      <style jsx>{`
        .payment-page { min-height: 100vh; background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%); padding-top: 100px; padding-bottom: 2rem; }
        .payment-container { max-width: 500px; margin: 0 auto; padding: 1rem; }
        .payment-card { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        h1 { text-align: center; color: #333; margin-bottom: 1.5rem; font-size: 1.5rem; }
        .booking-summary { background: #f8f9fa; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
        .booking-summary h2 { margin: 0 0 1rem; color: #333; font-size: 1.1rem; font-weight: 600; }
        .summary-item { display: flex; justify-content: space-between; padding: 0.5rem 0; color: #666; font-size: 0.95rem; }
        .summary-total { display: flex; justify-content: space-between; padding: 1rem 0 0; margin-top: 0.5rem; border-top: 2px solid #dee2e6; font-weight: 700; font-size: 1.2rem; }
        .amount { color: #28a745; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333; }
        select { width: 100%; padding: 0.875rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; background: white; cursor: pointer; }
        select:focus { outline: none; border-color: #8a7779; }
        .test-info { background: linear-gradient(135deg, #e7f3ff, #f0f7ff); border: 1px solid #b3d9ff; border-radius: 12px; padding: 1rem 1.5rem; margin-bottom: 1.5rem; }
        .test-info h3 { margin: 0 0 0.75rem; color: #0056b3; font-size: 0.95rem; }
        .test-info ul { margin: 0; padding-left: 1.5rem; color: #0056b3; }
        .test-info li { margin: 0.35rem 0; font-size: 0.9rem; font-family: monospace; }
        .moyasar-section { margin-top: 1rem; }
        .moyasar-info { text-align: center; margin-bottom: 1rem; color: #666; }
        .mysr-form { margin-bottom: 1rem; min-height: 400px; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; background: #fff; }
        .btn-back { background: transparent; border: 2px solid #8a7779; color: #8a7779; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600; margin-top: 1rem; width: 100%; }
        .error-message { background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center; }
        .btn-pay { width: 100%; padding: 1rem; background: linear-gradient(135deg, #28a745, #20c997); color: white; border: none; border-radius: 10px; font-size: 1.1rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(40,167,69,0.3); }
        .btn-pay:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(40,167,69,0.4); }
        .btn-pay:disabled { opacity: 0.6; cursor: not-allowed; }
        .secure-badge { text-align: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #eee; }
        .secure-badge span { color: #28a745; font-weight: 600; }
      `}</style>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem', paddingTop: '150px' }}>Loading payment...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
