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
  MapPin,
  Signal,
  AlertCircle,
} from "lucide-react";
import { API_URL } from "@/lib/api";

const translations = {
  en: {
    title: "Global Internet Packages",
    subtitle: "Stay connected with eSIM technology",
    selectRegion: "Select Your Region",
    startingPrice: "Starting Price",
    selectYourPlan: "Select Your Plan",
    limitedData: "Limited Data",
    unlimitedData: "Unlimited Data",
    days: "Days",
    networks: "Networks",
    checkAvailableNetworks: "Check Available Networks",
    supportedCountries: "Supported Countries",
    hotspotTethering: "Hotspot/Tethering",
    rechargeability: "Rechargeability",
    allowed: "Allowed",
    notAllowed: "Not Allowed",
    available: "Available",
    notAvailable: "Not Available",
    selectPackage: "Select Package",
    mobileNumber: "Mobile Number",
    mobilePlaceholder: "+966 5X XXX XXXX",
    submit: "Activate Package",
    submitting: "Processing...",
    submitSuccess: "Package activated successfully!",
    submitError: "Failed to activate package. Please try again.",
    noPackagesAvailable: "No packages available for this region",
    loading: "Loading packages...",
  },
  ar: {
    title: "باقات الإنترنت العالمية",
    subtitle: "ابق متصلاً مع تقنية eSIM",
    selectRegion: "اختر منطقتك",
    startingPrice: "السعر البدء",
    selectYourPlan: "اختر خطتك",
    limitedData: "بيانات محدودة",
    unlimitedData: "بيانات غير محدودة",
    days: "أيام",
    networks: "الشبكات",
    checkAvailableNetworks: "تحقق من الشبكات المتاحة",
    supportedCountries: "الدول المدعومة",
    hotspotTethering: "المشاركة الفورية",
    rechargeability: "إعادة الشحن",
    allowed: "مسموح",
    notAllowed: "غير مسموح",
    available: "متاح",
    notAvailable: "غير متاح",
    selectPackage: "اختر الباقة",
    mobileNumber: "رقم الجوال",
    mobilePlaceholder: "+966 5X XXX XXXX",
    submit: "تفعيل الباقة",
    submitting: "جاري المعالجة...",
    submitSuccess: "تم تفعيل الباقة بنجاح!",
    submitError: "فشل تفعيل الباقة. يرجى المحاولة مرة أخرى.",
    noPackagesAvailable: "لا توجد باقات متاحة لهذه المنطقة",
    loading: "جاري تحميل الباقات...",
  },
  zh: {
    title: "全球互联网套餐",
    subtitle: "使用 eSIM 技术保持连接",
    selectRegion: "选择您的区域",
    startingPrice: "起始价格",
    selectYourPlan: "选择计划",
    limitedData: "有限数据",
    unlimitedData: "无限数据",
    days: "天",
    networks: "网络",
    checkAvailableNetworks: "检查可用网络",
    supportedCountries: "支持的国家",
    hotspotTethering: "热点共享",
    rechargeability: "充值",
    allowed: "允许",
    notAllowed: "不允许",
    available: "可用",
    notAvailable: "不可用",
    selectPackage: "选择套餐",
    mobileNumber: "手机号码",
    mobilePlaceholder: "+966 5X XXX XXXX",
    submit: "激活套餐",
    submitting: "处理中...",
    submitSuccess: "套餐激活成功！",
    submitError: "激活套餐失败，请重试。",
    noPackagesAvailable: "该区域没有可用的套餐",
    loading: "正在加载套餐...",
  },
};

export default function InternetPackagesForm_eSIM({ lang = "en", packageId = null }) {
  const currentLang = lang || "en";
  const t = translations[currentLang];
  const isRTL = currentLang === "ar";

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(packageId || null);
  const [selectedPlanType, setSelectedPlanType] = useState("limited_data");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${API_URL}/international-packages`);
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setPackages(data.data);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Get unique regions
  const regions = [...new Set(packages.map((p) => p.package_code?.split("-")[0]).filter(Boolean))];

  // Filter packages by selected region
  const regionPackages = selectedRegion
    ? packages.filter((p) => p.package_code?.startsWith(selectedRegion))
    : packages;

  // Group packages by plan type
  const groupedByPlanType = regionPackages.reduce((acc, pkg) => {
    const planType = pkg.plan_type || "limited_data";
    if (!acc[planType]) acc[planType] = [];
    acc[planType].push(pkg);
    return acc;
  }, {});

  // Get packages for selected plan type
  const planTypePackages = groupedByPlanType[selectedPlanType] || [];

  // Group by duration
  const groupedByDuration = planTypePackages.reduce((acc, pkg) => {
    const duration = pkg.duration_en || "30 days";
    if (!acc[duration]) acc[duration] = [];
    acc[duration].push(pkg);
    return acc;
  }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage || !mobileNumber) {
      setSubmitStatus({ type: "error", message: t.submitError });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/international-packages/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package_id: selectedPackage.id,
          mobile_number: mobileNumber,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitStatus({ type: "success", message: t.submitSuccess });
        setMobileNumber("");
        setSelectedPackage(null);
      } else {
        setSubmitStatus({ type: "error", message: data.message || t.submitError });
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: t.submitError });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{t.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              {/* Region Selection */}
              {regions.length > 0 && (
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    {t.selectRegion}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {regions.map((region) => (
                      <button
                        key={region}
                        onClick={() => {
                          setSelectedRegion(region);
                          setSelectedPackage(null);
                        }}
                        className={`p-3 rounded-lg transition-all ${
                          selectedRegion === region
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Plan Type Tabs */}
              {Object.keys(groupedByPlanType).length > 1 && (
                <div className="mb-8">
                  <div className="flex gap-4 border-b-2 border-gray-200">
                    {Object.keys(groupedByPlanType).map((planType) => (
                      <button
                        key={planType}
                        onClick={() => {
                          setSelectedPlanType(planType);
                          setSelectedPackage(null);
                        }}
                        className={`pb-4 px-4 font-semibold transition-all ${
                          selectedPlanType === planType
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {planType === "limited_data" ? t.limitedData : t.unlimitedData}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Packages by Duration */}
              {loading ? (
                <div className="text-center py-12">
                  <Wifi className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">{t.loading}</p>
                </div>
              ) : planTypePackages.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{t.noPackagesAvailable}</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedByDuration).map(([duration, pkgs]) => (
                    <div key={duration}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {duration}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pkgs.map((pkg) => (
                          <motion.div
                            key={pkg.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedPackage(pkg)}
                            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedPackage?.id === pkg.id
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-blue-400"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-bold text-lg text-gray-900">
                                  {pkg.data_amount || pkg.title_en}
                                </h4>
                                <p className="text-sm text-gray-600">{duration}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-blue-600">
                                  {pkg.price ? `$${pkg.price}` : pkg.starting_price}
                                </p>
                              </div>
                            </div>

                            {/* Quick Features */}
                            <div className="space-y-2 text-sm">
                              {pkg.supported_countries_count && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Globe className="w-4 h-4" />
                                  <span>{pkg.supported_countries_count} {t.supportedCountries}</span>
                                </div>
                              )}
                              {pkg.hotspot_tethering && (
                                <div className="flex items-center gap-2 text-green-600">
                                  <Hotspot className="w-4 h-4" />
                                  <span>{t.hotspotTethering} - {t.allowed}</span>
                                </div>
                              )}
                            </div>

                            {selectedPackage?.id === pkg.id && (
                              <div className="mt-4 pt-4 border-t-2 border-blue-200">
                                <CheckCircle className="w-5 h-5 text-green-600 inline-block" />
                                <span className="ml-2 text-green-600 font-semibold">{t.selectPackage}</span>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile Number Input */}
              {selectedPackage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-8 border-t-2 border-gray-200"
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.mobileNumber}
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder={t.mobilePlaceholder}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </motion.div>
              )}

              {/* Submit Button */}
              {selectedPackage && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting || !mobileNumber}
                  className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Wifi className="w-5 h-5 animate-spin" />
                      {t.submitting}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t.submit}
                    </>
                  )}
                </motion.button>
              )}

              {/* Status Message */}
              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-lg ${
                    submitStatus.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {submitStatus.message}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Package Details Sidebar */}
          {selectedPackage && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-lg p-8 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">{t.selectYourPlan}</h3>

                {/* Package Image */}
                {selectedPackage.image && (
                  <img
                    src={selectedPackage.image}
                    alt={selectedPackage.title_en}
                    className="w-full rounded-lg mb-6 object-cover h-40"
                  />
                )}

                {/* Package Details */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">{t.selectYourPlan}</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {selectedPackage.price ? `$${selectedPackage.price}` : selectedPackage.starting_price}
                    </p>
                  </div>

                  {/* Networks */}
                  {selectedPackage.networks && selectedPackage.networks.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                        <Signal className="w-4 h-4" />
                        {t.networks}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPackage.networks.map((network, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {network}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Supported Countries */}
                  {selectedPackage.supported_countries_count && (
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4" />
                        {t.supportedCountries}
                      </h4>
                      <p className="text-lg font-bold text-blue-600">
                        {selectedPackage.supported_countries_count} {t.supportedCountries}
                      </p>
                    </div>
                  )}

                  {/* Features */}
                  <div className="space-y-2 pt-4 border-t-2 border-gray-200">
                    <div className="flex items-center gap-3">
                      <Hotspot className={`w-5 h-5 ${selectedPackage.hotspot_tethering ? "text-green-600" : "text-gray-400"}`} />
                      <span className="text-gray-700">
                        {t.hotspotTethering}: {selectedPackage.hotspot_tethering ? t.allowed : t.notAllowed}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className={`w-5 h-5 ${selectedPackage.rechargeability ? "text-green-600" : "text-gray-400"}`} />
                      <span className="text-gray-700">
                        {t.rechargeability}: {selectedPackage.rechargeability ? t.available : t.notAvailable}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedPackage.description_en && (
                    <p className="text-sm text-gray-600 pt-4 border-t-2 border-gray-200">
                      {selectedPackage.description_en}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
