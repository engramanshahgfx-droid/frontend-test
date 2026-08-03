'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, CalendarCheck, ShieldCheck, Copy, Check } from 'lucide-react';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const isRTL = lang === 'ar';

  const bookingId = searchParams?.get('booking_id') || searchParams?.get('bookingId');
  const paymentId = searchParams?.get('id');

  const [copied, setCopied] = React.useState(false);

  const handleCopyId = () => {
    if (bookingId) {
      navigator.clipboard.writeText(bookingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const t = {
    en: {
      title: "Payment Successful!",
      subtitle: "Your booking has been confirmed. Thank you for choosing Tilal Rimal.",
      bookingId: "Booking ID",
      paymentRef: "Payment Reference",
      status: "Payment Status",
      paid: "Paid & Verified",
      backHome: "Back to Home",
      viewDashboard: "View My Bookings",
      sar: "SAR",
      copied: "Copied!",
      copy: "Copy ID"
    },
    ar: {
      title: "تم الدفع بنجاح!",
      subtitle: "تم تأكيد حجزك بنجاح. شكراً لاختيارك التلال والرمال لتنظيم الرحلات.",
      bookingId: "رقم الحجز",
      paymentRef: "الرقم المرجعي للدفع",
      status: "حالة الدفع",
      paid: "مكتمل ومعتمد",
      backHome: "العودة للرئيسية",
      viewDashboard: "عرض حجوزاتي",
      sar: "ر.س",
      copied: "تم النسخ!",
      copy: "نسخ الرقم"
    },
    zh: {
      title: "支付成功！",
      subtitle: "您的预订已确认。感谢您选择 Tilal Rimal。",
      bookingId: "预订 ID",
      paymentRef: "支付参考号",
      status: "支付状态",
      paid: "已支付并确认",
      backHome: "返回首页",
      viewDashboard: "查看我的预订",
      sar: "SAR",
      copied: "已复制！",
      copy: "复制 ID"
    }
  };

  const labels = t[lang as keyof typeof t] || t.en;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        minHeight: "100vh",
        background: "#FAF6F0",
        padding: "160px 20px 100px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "540px",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "40px 32px",
          boxShadow: "0 20px 50px rgba(28, 0, 82, 0.08), 0 4px 15px rgba(0, 0, 0, 0.02)",
          border: "1px solid rgba(28, 0, 82, 0.06)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top Decorative Accent Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #10B981 0%, #059669 100%)",
          }}
        />

        {/* Animated Checkmark Icon Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          style={{
            width: "88px",
            height: "88px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px auto",
            boxShadow: "0 12px 30px rgba(16, 185, 129, 0.35)",
            position: "relative",
          }}
        >
          <CheckCircle2 size={48} strokeWidth={2.2} />
        </motion.div>

        {/* Title & Subtitle */}
        <h1
          style={{
            fontSize: "1.85rem",
            fontWeight: "800",
            color: "#1C0052",
            marginBottom: "10px",
            lineHeight: 1.2,
          }}
        >
          {labels.title}
        </h1>
        <p
          style={{
            fontSize: "0.98rem",
            color: "#64748b",
            marginBottom: "32px",
            lineHeight: 1.5,
          }}
        >
          {labels.subtitle}
        </p>

        {/* Details Container */}
        <div
          style={{
            background: "#F8FAFC",
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "32px",
            border: "1px solid #E2E8F0",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {bookingId && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "14px",
                borderBottom: "1px solid #E2E8F0",
                marginBottom: "14px",
              }}
            >
              <span style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "600" }}>
                {labels.bookingId}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.1rem", color: "#1C0052", fontWeight: "800" }}>
                  #{bookingId}
                </span>
                <button
                  onClick={handleCopyId}
                  title={labels.copy}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: copied ? "#10B981" : "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    padding: "2px",
                    transition: "color 0.2s ease",
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          )}



          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "600" }}>
              {labels.status}
            </span>
            <span
              style={{
                fontSize: "0.85rem",
                color: "#047857",
                fontWeight: "700",
                background: "#D1FAE5",
                padding: "4px 12px",
                borderRadius: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ShieldCheck size={14} /> {labels.paid}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            href={`/${lang}`}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #E85D1F 0%, #D34C12 100%)",
              color: "#ffffff",
              padding: "14px 24px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "1rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 6px 20px rgba(232, 93, 31, 0.3)",
              transition: "all 0.25s ease",
            }}
          >
            <Home size={18} />
            <span>{labels.backHome}</span>
          </Link>


        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#FAF6F0",
            padding: "160px 20px 100px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}