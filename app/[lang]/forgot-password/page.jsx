"use client";
import React, { useState } from "react";
import styles from "@/styles/login.module.css";
import { toast } from "react-toastify";
import { LuAtSign } from "react-icons/lu";
import { GoLock } from "react-icons/go";
import { useParams } from "next/navigation";
import { authAPI } from '@/lib/api';

export default function ForgotPassword() {
  const params = useParams();
  const lang = params?.lang || 'en';

  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState(null);

  const translations = {
    en: {
      title: "Forgot Password",
      subtitle: "Enter your phone number to receive an OTP to reset your password",
      phonePlaceholder: "0501234567",
      sendOtp: "Send OTP",  
      verifyAndReset: "Verify & Reset Password",
      otpPlaceholder: "Enter OTP",
      passwordPlaceholder: "New password",
      confirmPasswordPlaceholder: "Confirm new password",
      success: "Password reset successfully. You can now login.",
      otpSent: (phone) => `OTP sent to ${phone}`,
    },
    ar: {
      title: "نسيت كلمة المرور",
      subtitle: "أدخل رقم الجوال لتلقي رمز التحقق لإعادة تعيين كلمة المرور",
      phonePlaceholder: "رقم الجوال (مثال: +966501234567)",
      sendOtp: "إرسال الرمز",
      verifyAndReset: "التحقق وإعادة التعيين",
      otpPlaceholder: "أدخل رمز التحقق",
      passwordPlaceholder: "كلمة المرور الجديدة",
      confirmPasswordPlaceholder: "تأكيد كلمة المرور الجديدة",
      success: "تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.",
      otpSent: (phone) => `تم إرسال رمز التحقق إلى ${phone}`,
    }
  };

  const t = translations[lang] || translations.en;

  const handleSendOtp = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    try {
      const data = await authAPI.sendOtp(phone, 'reset');
      setOtpSent(true);
      setDevOtp(data.dev_otp || null);
      toast.success(t.otpSent(phone));
    } catch (err) {
      console.error('sendOtp error', err);
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const data = await authAPI.resetPassword(phone, otpCode, password, passwordConfirmation);
      
      if (!data.success) throw new Error(data.message || 'Reset failed');
      toast.success(t.success);
      // Redirect to login page
      window.location.href = `/${lang}/login`;
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center" style={{ minHeight: "calc(100vh - 88px)" }}>
      <div className="container py-5">
        <div className="d-flex flex-column align-items-center">
          <div className={`px-2 px-sm-4 py-4 d-flex flex-column align-items-center ${styles.formWidth}`} style={{ borderRadius: "25px", border: "1px solid rgba(202, 218, 231, 1)", background: "linear-gradient(180deg, #E2F2FF 0%, rgba(255, 255, 255, 0) 78.01%)" }}>
            <div className="d-flex justify-content-center align-items-center mb-4" style={{ width: "61px", height: "61px", backgroundColor: "white", borderRadius: "12px", boxShadow: "0px 0px 16.15px 0px rgba(0, 0, 0, 0.07)" }}>
              <GoLock style={{ width: "30px", height: "30px" }} />
            </div>

            <div className="fs-4 text-center mb-2" style={{ fontWeight: 600 }}>{t.title}</div>
            <div className="text-secondary text-center mb-4" style={{ fontSize: "14px" }}>{t.subtitle}</div>

            {!otpSent && (
              <form className="w-100" onSubmit={handleSendOtp}>
                <div className="mb-3 position-relative">
                  <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: lang === "en" ? "8px" : "", right: lang === "ar" ? "8px" : "" }}>
                    <LuAtSign style={{ width: "19px", height: "19px", color: "rgba(135, 135, 135, 1)" }} />
                  </div>
                  <input type="tel" className="form-control" style={{ borderRadius: "15px", paddingRight: lang === "ar" ? "35px" : "", paddingLeft: lang === "en" ? "35px" : "", height: "50px" }} placeholder={t.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <button type="submit" className="primaryButton w-100" style={{ borderWidth: 0, borderRadius: "15px", height: "44px" }} disabled={loading}>{loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : t.sendOtp}</button>
              </form>
            )}

            {otpSent && (
              <form className="w-100" onSubmit={handleReset}>
                <div className="mb-3 position-relative">
                  <input type="text" className="form-control" style={{ borderRadius: "15px", height: "50px" }} placeholder={t.otpPlaceholder} value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0,6))} required />
                </div>
                <div className="mb-3 position-relative">
                  <input type="password" className="form-control" style={{ borderRadius: "15px", height: "50px" }} placeholder={t.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>
                <div className="mb-3 position-relative">
                  <input type="password" className="form-control" style={{ borderRadius: "15px", height: "50px" }} placeholder={t.confirmPasswordPlaceholder} value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required minLength={6} />
                </div>

                {devOtp && <div style={{ marginBottom: '10px', padding: '8px', background: '#e7f5e7', color: '#2d7d2d', borderRadius: '6px' }}>Dev OTP: <strong>{devOtp}</strong></div>}

                <button type="submit" className="primaryButton w-100" style={{ borderWidth: 0, borderRadius: "15px", height: "44px" }} disabled={loading}>{loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : t.verifyAndReset}</button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
