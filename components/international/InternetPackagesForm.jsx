"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Phone,
  Wifi,
  Send,
  CheckCircle,
  Clock,
  Headphones,
  Zap,
  DollarSign,
  Shield,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
  Smartphone,
  Hotspot,
  Zap as Battery,
  MapPin,
  Signal,
} from "lucide-react";
import { API_URL } from "@/lib/api";

const translations = {
  en: {
    title: "Global Internet Packages",
    subtitle: "Stay connected in over 200 countries with lightning-fast internet",
    formTitle: "Get Connected Instantly",
    country: "Destination Country",
    countryPlaceholder: "Select or enter your destination",
    mobileNumber: "Mobile Number",
    mobilePlaceholder: "+966 5X XXX XXXX",
    package: "Choose Your Package",
    selectPackage: "Select data package",
    submit: "Activate Package",
    submitting: "Processing...",
    submitSuccess: "Package activated successfully!",
    submitError: "Failed to activate package. Please try again.",
    popular: "Most Popular",
    bestValue: "Best Value",
    features: {
      title: "Premium Features",
      global: "Global Coverage",
      globalDesc: "Seamless connectivity in 200+ countries",
      fast: "Lightning Fast",
      fastDesc: "5G speed available in major cities",
      affordable: "Best Price",
      affordableDesc: "Save up to 70% on roaming charges",
      support: "Priority Support",
      supportDesc: "24/7 dedicated assistance",
    },
    trustIndicators: {
      title: "Trusted Worldwide",
      customers: "Happy Travelers",
      coverage: "Countries",
      uptime: "Network Reliability",
    },
    contactInfo: "Need Assistance?",
    workingHours: "Support Available",
    workingHoursDetail: "24/7 - Global Support Team",
    callUs: "Call Center",
    emailUs: "Email Support",
    instantActivation: "Instant Activation",
    noHiddenFees: "No Hidden Fees",
    easyTopup: "Easy Top-up",
  },
  ar: {
    title: "باقات الإنترنت العالمية",
    subtitle: "ابقَ متصلاً في أكثر من 200 دولة مع إنترنت فائق السرعة",
    formTitle: "احصل على الاتصال فوراً",
    country: "الدولة المقصودة",
    countryPlaceholder: "اختر أو أدخل وجهتك",
    mobileNumber: "رقم الجوال",
    mobilePlaceholder: "+966 5X XXX XXXX",
    package: "اختر باقتك",
    selectPackage: "اختر باقة البيانات",
    submit: "تفعيل الباقة",
    submitting: "جاري المعالجة...",
    submitSuccess: "تم تفعيل الباقة بنجاح!",
    submitError: "فشل تفعيل الباقة. يرجى المحاولة مرة أخرى.",
    popular: "الأكثر طلباً",
    bestValue: "أفضل قيمة",
    features: {
      title: "ميزات متميزة",
      global: "تغطية عالمية",
      globalDesc: "اتصال سلس في أكثر من 200 دولة",
      fast: "سرعة البرق",
      fastDesc: "سرعة 5G متوفرة في المدن الكبرى",
      affordable: "أفضل سعر",
      affordableDesc: "وفر حتى 70% من رسوم التجوال",
      support: "دعم مميز",
      supportDesc: "مساعدة مخصصة على مدار الساعة",
    },
    trustIndicators: {
      title: "موثوق عالمياً",
      customers: "مسافرون سعداء",
      coverage: "دولة",
      uptime: "موثوقية الشبكة",
    },
    contactInfo: "بحاجة إلى مساعدة؟",
    workingHours: "الدعم متاح",
    workingHoursDetail: "24/7 - فريق دعم عالمي",
    callUs: "مركز الاتصال",
    emailUs: "الدعم عبر البريد",
    instantActivation: "تفعيل فوري",
    noHiddenFees: "بدون رسوم خفية",
    easyTopup: "شحن سهل",
  },
  zh: {
    title: "全球互联网套餐",
    subtitle: "在200多个国家保持连接，享受闪电般快速的互联网",
    formTitle: "立即连接",
    country: "目的地国家",
    countryPlaceholder: "选择或输入您的目的地",
    mobileNumber: "手机号码",
    mobilePlaceholder: "+966 5X XXX XXXX",
    package: "选择套餐",
    selectPackage: "选择数据套餐",
    submit: "激活套餐",
    submitting: "处理中...",
    submitSuccess: "套餐激活成功！",
    submitError: "激活套餐失败，请重试。",
    popular: "最受欢迎",
    bestValue: "最佳价值",
    features: {
      title: "高级功能",
      global: "全球覆盖",
      globalDesc: "在200多个国家无缝连接",
      fast: "闪电速度",
      fastDesc: "主要城市提供5G速度",
      affordable: "最优价格",
      affordableDesc: "节省高达70%的漫游费用",
      support: "优先支持",
      supportDesc: "24/7专属协助",
    },
    trustIndicators: {
      title: "全球信赖",
      customers: "满意旅客",
      coverage: "国家覆盖",
      uptime: "网络可靠性",
    },
    contactInfo: "需要帮助？",
    workingHours: "支持可用",
    workingHoursDetail: "24/7 - 全球支持团队",
    callUs: "呼叫中心",
    emailUs: "邮件支持",
    instantActivation: "即时激活",
    noHiddenFees: "无隐藏费用",
    easyTopup: "轻松充值",
  },
};

export default function InternetPackagesForm({ lang = "en" }) {
  const currentLang = lang || "en";
  const t = translations[currentLang];
  const isRTL = currentLang === "ar";

  const [formData, setFormData] = useState({
    country: "",
    mobile_number: "",
    package: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState("🌍");

  const packages = [
    { value: "1GB", label: "1 GB", price: "$10", validity: "7 days", speed: "4G/LTE", popular: false, bestValue: false },
    { value: "3GB", label: "3 GB", price: "$25", validity: "15 days", speed: "4G/LTE", popular: true, bestValue: false },
    { value: "5GB", label: "5 GB", price: "$40", validity: "30 days", speed: "5G Ready", popular: false, bestValue: true },
    { value: "10GB", label: "10 GB", price: "$70", validity: "30 days", speed: "5G Ready", popular: false, bestValue: false },
    { value: "20GB", label: "20 GB", price: "$130", validity: "60 days", speed: "5G Ultra", popular: false, bestValue: false },
    { value: "50GB", label: "50 GB", price: "$300", validity: "90 days", speed: "5G Ultra", popular: false, bestValue: false },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "country" && value) {
      const countryFlags = {
        "saudi": "🇸🇦", "uae": "🇦🇪", "egypt": "🇪🇬", "usa": "🇺🇸", 
        "uk": "🇬🇧", "france": "🇫🇷", "germany": "🇩🇪", "italy": "🇮🇹",
        "spain": "🇪🇸", "turkey": "🇹🇷", "japan": "🇯🇵", "china": "🇨🇳",
      };
      const countryLower = value.toLowerCase();
      for (const [key, flag] of Object.entries(countryFlags)) {
        if (countryLower.includes(key)) {
          setSelectedCountryFlag(flag);
          return;
        }
      }
      setSelectedCountryFlag("🌍");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${API_URL}/internet-packages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Internet package API error:", responseData);
        setSubmitStatus("error");
        return;
      }

      setSubmitStatus("success");
      setFormData({ country: "", mobile_number: "", package: "" });
      setSelectedCountryFlag("🌍");
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error("Error submitting internet package request:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPackage = packages.find(p => p.value === formData.package);

  return (
    <div style={{ direction: isRTL ? "rtl" : "ltr" }}>
      {/* Full width black header - 60px height */}
      <div style={{ height: "60px", backgroundColor: "#000000", width: "100%", position: "relative", zIndex: 10 }} />
      
      {/* Main Content with Gradient Background */}
      <div style={{ 
        minHeight: "calc(100vh - 60px)",
        background: "#8A7779",
        padding: "48px 32px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "48px" }}
          >
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                borderRadius: "16px",
                marginBottom: "24px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
            >
              <Wifi size={40} color="white" />
            </motion.div>
            
            <h1 style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: "bold",
              marginBottom: "16px",
              background: "linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              {t.title}
            </h1>
            
            <p style={{ fontSize: "1.25rem", color: "#9ca3af", maxWidth: "768px", margin: "0 auto" }}>
              {t.subtitle}
            </p>
            
            {/* Quick Stats Pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "32px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)", padding: "8px 16px", borderRadius: "9999px" }}>
                <Zap size={16} color="#facc15" />
                <span style={{ color: "white", fontSize: "0.875rem" }}>{t.instantActivation}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)", padding: "8px 16px", borderRadius: "9999px" }}>
                <Shield size={16} color="#4ade80" />
                <span style={{ color: "white", fontSize: "0.875rem" }}>{t.noHiddenFees}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)", padding: "8px 16px", borderRadius: "9999px" }}>
                <TrendingUp size={16} color="#60a5fa" />
                <span style={{ color: "white", fontSize: "0.875rem" }}>{t.easyTopup}</span>
              </div>
            </div>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {/* Form Section - takes 2 columns */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ gridColumn: "span 2" }}
            >
              <div style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
                borderRadius: "24px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.2)"
              }}>
                <div style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", padding: "24px 32px" }}>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>{t.formTitle}</h2>
                  <p style={{ color: "#bfdbfe", fontSize: "0.875rem", marginTop: "4px" }}>Fill out the details and get connected in minutes</p>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: "32px" }}>
                  {/* Status Messages */}
                  <AnimatePresence>
                    {submitStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.5)", borderRadius: "12px", marginBottom: "24px" }}
                      >
                        <CheckCircle size={20} color="#4ade80" />
                        <span style={{ color: "#bbf7d0", fontWeight: "500" }}>{t.submitSuccess}</span>
                      </motion.div>
                    )}
                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.5)", borderRadius: "12px", marginBottom: "24px" }}
                      >
                        <div style={{ width: "20px", height: "20px", background: "#ef4444", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: "white", fontSize: "10px" }}>!</span>
                        </div>
                        <span style={{ color: "#fecaca", fontWeight: "500" }}>{t.submitError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form Fields */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px", marginBottom: "24px" }}>
                    <div>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", fontWeight: "600", color: "#e5e7eb", marginBottom: "8px" }}>
                        <Globe size={16} color="#60a5fa" /> {t.country}
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          placeholder={t.countryPlaceholder}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "12px",
                            color: "white",
                            outline: "none"
                          }}
                        />
                        <div style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "24px" }}>
                          {selectedCountryFlag}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", fontWeight: "600", color: "#e5e7eb", marginBottom: "8px" }}>
                        <Phone size={16} color="#60a5fa" /> {t.mobileNumber}
                      </label>
                      <input
                        type="tel"
                        name="mobile_number"
                        value={formData.mobile_number}
                        onChange={handleChange}
                        required
                        placeholder={t.mobilePlaceholder}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: "12px",
                          color: "white",
                          outline: "none"
                        }}
                      />
                    </div>
                  </div>

                  {/* Package Selection */}
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", fontWeight: "600", color: "#e5e7eb", marginBottom: "12px" }}>
                      <Wifi size={16} color="#60a5fa" /> {t.package}
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                      {packages.map((pkg) => (
                        <motion.button
                          key={pkg.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData(prev => ({ ...prev, package: pkg.value }))}
                          style={{
                            position: "relative",
                            padding: "16px",
                            borderRadius: "12px",
                            border: formData.package === pkg.value ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.2)",
                            background: formData.package === pkg.value ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.1)",
                            textAlign: "left",
                            cursor: "pointer"
                          }}
                        >
                          {pkg.popular && (
                            <div style={{ position: "absolute", top: "-8px", right: "-8px", background: "linear-gradient(135deg, #eab308, #f97316)", color: "white", fontSize: "10px", fontWeight: "bold", padding: "2px 8px", borderRadius: "9999px" }}>
                              {t.popular}
                            </div>
                          )}
                          {pkg.bestValue && (
                            <div style={{ position: "absolute", top: "-8px", right: "-8px", background: "linear-gradient(135deg, #22c55e, #059669)", color: "white", fontSize: "10px", fontWeight: "bold", padding: "2px 8px", borderRadius: "9999px" }}>
                              {t.bestValue}
                            </div>
                          )}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <span style={{ color: "white", fontWeight: "bold", fontSize: "1.125rem" }}>{pkg.label}</span>
                            <span style={{ color: "#60a5fa", fontWeight: "bold" }}>{pkg.price}</span>
                          </div>
                          <div style={{ color: "#9ca3af", fontSize: "11px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
                              <Clock size={12} /> {pkg.validity}
                            </div>
                            <div>{pkg.speed}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Package Preview */}
                  <AnimatePresence>
                    {selectedPackage && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                          background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))",
                          borderRadius: "12px",
                          padding: "16px",
                          border: "1px solid rgba(59,130,246,0.3)",
                          marginBottom: "24px"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Wifi size={24} color="white" />
                            </div>
                            <div>
                              <p style={{ fontWeight: "bold", color: "white", fontSize: "1.125rem" }}>{selectedPackage.label}</p>
                              <div style={{ display: "flex", gap: "12px", fontSize: "0.875rem", color: "#d1d5db" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock size={12} /> {selectedPackage.validity}</span>
                                <span>{selectedPackage.speed}</span>
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#60a5fa" }}>{selectedPackage.price}</p>
                            <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>One-time payment</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      padding: "16px 24px",
                      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                      border: "none",
                      borderRadius: "12px",
                      color: "white",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      opacity: isSubmitting ? 0.5 : 1
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Clock size={20} className="animate-spin" />
                        {t.submitting}
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        {t.submit}
                        <ChevronRight size={20} />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Features Section - takes 1 column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Features Card */}
              <div style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
                border: "1px solid rgba(255,255,255,0.2)"
              }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "white", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Award size={20} color="#facc15" /> {t.features.title}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { icon: Globe, color: "linear-gradient(135deg, #3b82f6, #06b6d4)", title: t.features.global, desc: t.features.globalDesc },
                    { icon: Zap, color: "linear-gradient(135deg, #eab308, #f97316)", title: t.features.fast, desc: t.features.fastDesc },
                    { icon: DollarSign, color: "linear-gradient(135deg, #22c55e, #10b981)", title: t.features.affordable, desc: t.features.affordableDesc },
                    { icon: Headphones, color: "linear-gradient(135deg, #8b5cf6, #ec4899)", title: t.features.support, desc: t.features.supportDesc },
                  ].map((feature, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "16px", padding: "12px", borderRadius: "12px" }}>
                      <div style={{ width: "40px", height: "40px", background: feature.color, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <feature.icon size={20} color="white" />
                      </div>
                      <div>
                        <h4 style={{ fontWeight: "600", color: "white", marginBottom: "4px" }}>{feature.title}</h4>
                        <p style={{ fontSize: "0.875rem", color: "#d1d5db" }}>{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Indicators */}
              <div style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
                border: "1px solid rgba(255,255,255,0.2)"
              }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "white", marginBottom: "16px" }}>{t.trustIndicators.title}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", textAlign: "center" }}>
                  <div><div style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#60a5fa" }}>100K+</div><div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{t.trustIndicators.customers}</div></div>
                  <div><div style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#4ade80" }}>200+</div><div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{t.trustIndicators.coverage}</div></div>
                  <div><div style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#a78bfa" }}>99.9%</div><div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{t.trustIndicators.uptime}</div></div>
                </div>
              </div>

              {/* Contact Info Card */}
              <div style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                borderRadius: "16px",
                padding: "24px",
                color: "white"
              }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Headphones size={20} /> {t.contactInfo}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", borderRadius: "8px" }}>
                    <Clock size={20} />
                    <div><p style={{ fontWeight: "600" }}>{t.workingHours}</p><p style={{ fontSize: "0.875rem", opacity: 0.9 }}>{t.workingHoursDetail}</p></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", borderRadius: "8px" }}>
                    <Phone size={20} />
                    <div><p style={{ fontWeight: "600" }}>{t.callUs}</p><p style={{ fontSize: "0.875rem", opacity: 0.9 }}>+966 54 730 5060</p></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", borderRadius: "8px" }}>
                    <Globe size={20} />
                    <div><p style={{ fontWeight: "600" }}>{t.emailUs}</p><p style={{ fontSize: "0.875rem", opacity: 0.9 }}>support@tilalrimal.com</p></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}