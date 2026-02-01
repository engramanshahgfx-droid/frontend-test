"use client";
import styles from "@/styles/login.module.css";
import React, { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/providers/AuthProvider";
import { FiLogIn } from "react-icons/fi";
import { GoLock } from "react-icons/go";
import { FiPhone } from "react-icons/fi";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import Loading from "@/components/Loading";

export default function LoginPage({ params }) {
  const { lang } = use(params);
  const { user, loading: authLoading, login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState({
    phone: "",
    password: "",
  });

  const translations = {
    en: {
      title: "Log in to your account",
      subtitle: "Welcome back! Please enter your details",
      phone: "Phone (e.g., +966501234567)",
      password: "Password",
      forgotPassword: "Forgot password?",
      login: "Login",
      newHere: "New here?",
      createAccount: "Create Account",
    },
    ar: {
      title: "تسجيل الدخول إلى حسابك",
      subtitle: "مرحبًا بعودتك! الرجاء إدخال بياناتك",
      phone: "رقم الجوال (مثال: +966501234567)",
      password: "كلمة المرور",
      forgotPassword: "هل نسيت كلمة المرور؟",
      login: "تسجيل الدخول",
      newHere: "جديد هنا؟",
      createAccount: "إنشاء حساب",
    },
  };

  const t = translations[lang] || translations.en;

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await login({
        phone: userData.phone,
        password: userData.password,
      });

      if (result.success) {
        toast.success('Login successful!');
        // Redirect to dashboard
        router.push(`/${lang}/dashboard`);
      } else {
        toast.error(result.error?.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only redirect if user is logged in AND we've finished loading
    if (user && !authLoading) {
      // Give a brief delay to prevent race conditions
      const timer = setTimeout(() => {
        router.push(`/${lang}/dashboard`);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, lang, router]);

  // Show loading while checking auth
  if (authLoading) {
    return <Loading />;
  }

  // If user is logged in, show loading while redirecting
  if (user) {
    return <Loading />;
  }

  // Otherwise show login form
  return (
    <div
      className="d-flex align-items-center"
      style={{ minHeight: "calc(100vh - 88px)" }}
    >
      <div className="container py-5">
        <div className="d-flex flex-column align-items-center">
          <div
            className={`px-2 px-sm-4 py-4 d-flex flex-column align-items-center ${styles.formWidth}`}
            style={{
              borderRadius: "25px",
              border: "1px solid rgba(202, 218, 231, 1)",
              background:
                "linear-gradient(180deg, #E2F2FF 0%, rgba(255, 255, 255, 0) 78.01%)",
            }}
          >
            <div
              className="d-flex justify-content-center align-items-center mb-4"
              style={{
                width: "61px",
                height: "61px",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: " 0px 0px 16.15px 0px rgba(0, 0, 0, 0.07)",
              }}
            >
              <FiLogIn style={{ width: "30px", height: "30px" }} />
            </div>
            <div
              className="fs-4 text-center mb-2"
              style={{ fontWeight: "600" }}
            >
              {t.title}
            </div>
            <div
              className="text-secondary text-center mb-4"
              style={{ fontSize: "14px" }}
            >
              {t.subtitle}
            </div>
            <form className="w-100" onSubmit={handleLogin}>
              <div className="mb-3 position-relative">
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: lang === "en" ? "8px" : "",
                    right: lang === "ar" ? "8px" : "",
                  }}
                >
                  <FiPhone
                    style={{
                      width: "19px",
                      height: "19px",
                      color: "rgba(135, 135, 135, 1)",
                    }}
                  />
                </div>
                <input
                  type="tel"
                  className="form-control"
                  style={{
                    borderRadius: "15px",
                    paddingLeft: lang === "en" ? "35px" : "",
                    paddingRight: lang === "ar" ? "35px" : "",
                    height: "50px",
                  }}
                  placeholder={t.phone}
                  id="userPhone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleDataChange}
                  required
                />
              </div>

              <div className="mb-2 position-relative">
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: lang === "en" ? "8px" : "",
                    right: lang === "ar" ? "8px" : "",
                  }}
                >
                  <GoLock
                    style={{
                      width: "20px",
                      height: "20px",
                      color: "rgba(135, 135, 135, 1)",
                    }}
                  />
                </div>
                <input
                  type={visible ? "text" : "password"}
                  className="form-control"
                  placeholder={t.password}
                  style={{
                    borderRadius: "15px",
                    paddingLeft: lang === "en" ? "35px" : "",
                    paddingRight: lang === "ar" ? "35px" : "",
                    height: "50px",
                  }}
                  id="userPassword"
                  name="password"
                  value={userData.password}
                  onChange={handleDataChange}
                  required
                />
                {visible ? (
                  <VisibilityIcon
                    style={{
                      position: "absolute",
                      top: "50%",
                      transform: "translateY(-50%)",
                      right: lang === "en" ? 10 : "",
                      left: lang === "ar" ? 10 : "",
                      color: "rgba(134, 141, 151, 1)",
                      cursor: "pointer",
                    }}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <VisibilityOffIcon
                    style={{
                      position: "absolute",
                      top: "50%",
                      transform: "translateY(-50%)",
                      right: lang === "en" ? 10 : "",
                      left: lang === "ar" ? 10 : "",
                      color: "rgba(134, 141, 151, 1)",
                      cursor: "pointer",
                    }}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>

              <div className="mb-3 d-flex justify-content-end">
                <Link
                  href={`/${lang}/forgot-password`}
                  className="text-decoration-none text-dark"
                  style={{ fontSize: "14px", fontWeight: "600" }}
                >
                  {t.forgotPassword}
                </Link>
              </div>

              <button
                type="submit"
                className="primaryButton w-100"
                style={{ borderWidth: 0, borderRadius: "15px", height: "44px" }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </>
                ) : (
                  <>{t.login}</>
                )}
              </button>

              <div className="text-center mt-3" style={{ fontSize: "14px" }}>
                {t.newHere}{" "}
                <Link href={`/${lang}/register`} style={{ color: "#0d6efd", fontWeight: "500" }}>
                  {t.createAccount}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
