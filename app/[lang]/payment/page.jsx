"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { API_URL } from '@/lib/api';

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  
  const lang = params?.lang || 'en';
  const isRTL = lang === 'ar';
  
  const bookingNumber = searchParams.get('booking');
  const status = searchParams.get('status');
  const errorType = searchParams.get('error');
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  const t = {
    title: isRTL ? 'حالة الدفع' : 'Payment Status',
    success: isRTL ? 'تم الدفع بنجاح! 🎉' : 'Payment Successful! 🎉',
    failed: isRTL ? 'فشل الدفع' : 'Payment Failed',
    pending: isRTL ? 'جاري المعالجة...' : 'Processing...',
    bookingNumber: isRTL ? 'رقم الحجز' : 'Booking Number',
    amount: isRTL ? 'المبلغ' : 'Amount',
    status: isRTL ? 'الحالة' : 'Status',
    confirmed: isRTL ? 'تم التأكيد' : 'Confirmed',
    pendingStatus: isRTL ? 'قيد الانتظار' : 'Pending',
    goHome: isRTL ? 'الذهاب للرئيسية' : 'Go Home',
    viewBookings: isRTL ? 'عرض الحجوزات' : 'View My Bookings',
    tryAgain: isRTL ? 'حاول مرة أخرى' : 'Try Again',
    backToBooking: isRTL ? 'العودة للحجز' : 'Back to Booking',
    sar: isRTL ? 'ريال' : 'SAR',
    loadingText: isRTL ? 'جاري التحميل...' : 'Loading...',
  };

  useEffect(() => {
    if (bookingNumber) {
      fetchBooking();
    } else if (errorType) {
      setLoading(false);
      setPaymentStatus('failed');
    } else {
      setLoading(false);
    }
  }, [bookingNumber, errorType]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingNumber}/status`);
      const data = await response.json();
      if (data.success) {
        setBooking(data.data);
        setPaymentStatus(data.data.payment_status || data.data.status || 'pending');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle payment status from callback
  useEffect(() => {
    if (status === 'success' || status === 'paid') {
      setPaymentStatus('paid');
    } else if (status === 'failed' || status === 'error') {
      setPaymentStatus('failed');
    }
  }, [status]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spinner}></div>
          <h2>{t.loadingText}</h2>
          <p style={styles.subText}>{t.pending}</p>
        </div>
      </div>
    );
  }

  // Success state
  if (paymentStatus === 'paid' || paymentStatus === 'confirmed') {
    return (
      <div style={styles.container}>
        <div style={{...styles.card, borderTop: `4px solid #28a745`}}>
          <div style={styles.successIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={styles.successTitle}>{t.success}</h2>
          <p style={styles.message}>{isRTL ? 'تم تأكيد حجزك بنجاح.' : 'Your booking has been confirmed successfully.'}</p>
          
          {booking && (
            <div style={styles.bookingDetails}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>{t.bookingNumber}:</span>
                <span style={styles.detailValue}>{booking.booking_number}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>{t.amount}:</span>
                <span style={{...styles.detailValue, color: '#28a745', fontWeight: 'bold'}}>
                  {booking.price} {t.sar}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>{t.status}:</span>
                <span style={{...styles.detailValue, color: '#28a745'}}>{t.confirmed}</span>
              </div>
            </div>
          )}

          <div style={styles.buttonGroup}>
            <button 
              onClick={() => router.push(`/${lang}`)}
              style={{...styles.button, background: '#dfa528'}}
            >
              {t.goHome}
            </button>
            <button 
              onClick={() => router.push(`/${lang}/bookings`)}
              style={{...styles.button, background: '#28a745'}}
            >
              {t.viewBookings}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Failed state
  if (paymentStatus === 'failed') {
    return (
      <div style={styles.container}>
        <div style={{...styles.card, borderTop: `4px solid #dc3545`}}>
          <div style={styles.errorIcon}>✕</div>
          <h2 style={styles.errorTitle}>{t.failed}</h2>
          <p style={styles.message}>
            {errorType === 'missing_payment_id' 
              ? (isRTL ? 'معرف الدفع مفقود. يرجى المحاولة مرة أخرى.' : 'Payment ID missing. Please try again.')
              : errorType === 'booking_not_found'
              ? (isRTL ? 'لم يتم العثور على الحجز.' : 'Booking not found.')
              : (isRTL ? 'حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.' : 'There was an issue processing your payment. Please try again or contact support.')
            }
          </p>
          <div style={styles.buttonGroup}>
            <button 
              onClick={() => router.push(`/${lang}`)}
              style={{...styles.button, background: '#dfa528'}}
            >
              {t.goHome}
            </button>
            <button 
              onClick={() => router.back()}
              style={{...styles.button, background: '#6c757d'}}
            >
              {t.tryAgain}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pending state (waiting for payment)
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.pendingIcon}>⏳</div>
        <h2>{t.pending}</h2>
        <p style={styles.message}>
          {isRTL ? 'جاري معالجة دفعتك. يرجى الانتظار...' : 'Your payment is being processed. Please wait...'}
        </p>
        <div style={styles.buttonGroup}>
          <button 
            onClick={() => router.push(`/${lang}`)}
            style={{...styles.button, background: '#dfa528'}}
          >
            {t.goHome}
          </button>
          <button 
            onClick={() => router.push(`/${lang}/destinations`)}
            style={{...styles.button, background: '#17a2b8'}}
          >
            {isRTL ? 'العودة للوجهات' : 'Back to Destinations'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    borderTop: '4px solid #dfa528',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #dfa528',
    borderRadius: '50%',
    margin: '0 auto 20px',
    animation: 'spin 1s linear infinite',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#d4edda',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  errorIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#f8d7da',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    fontSize: '40px',
    color: '#dc3545',
  },
  pendingIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  successTitle: {
    color: '#28a745',
    margin: '0 0 10px',
    fontSize: '28px',
  },
  errorTitle: {
    color: '#dc3545',
    margin: '0 0 10px',
    fontSize: '28px',
  },
  message: {
    color: '#666',
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  subText: {
    color: '#999',
    fontSize: '14px',
  },
  bookingDetails: {
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #e9ecef',
  },
  detailLabel: {
    color: '#666',
    fontSize: '14px',
  },
  detailValue: {
    color: '#333',
    fontSize: '14px',
    fontWeight: '500',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  button: {
    flex: '1',
    minWidth: '120px',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

// Add animation styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f5f7fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #dfa528',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite',
          }}></div>
          <p>Loading payment...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}