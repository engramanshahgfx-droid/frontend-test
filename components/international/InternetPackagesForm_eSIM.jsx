// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Globe,
//   Phone,
//   Wifi,
//   Send,
//   CheckCircle,
//   Clock,
//   Headphones,
//   Zap,
//   DollarSign,
//   Shield,
//   TrendingUp,
//   Award,
//   Sparkles,
//   ChevronRight,
// } from "lucide-react";
// import { API_URL } from "@/lib/api";

// const translations = {
//   en: {
//     title: "Global Internet Packages",
//     subtitle: "Stay connected in over 200 countries with lightning-fast internet",
//     formTitle: "Get Connected Instantly",
//     country: "Destination Country",
//     countryPlaceholder: "Select or enter your destination",
//     mobileNumber: "Mobile Number",
//     mobilePlaceholder: "+966 5X XXX XXXX",
//     package: "Choose Your Package",
//     selectPackage: "Select data package",
//     submit: "Activate Package",
//     submitting: "Processing...",
//     submitSuccess: "Package activated successfully!",
//     submitError: "Failed to activate package. Please try again.",
//     popular: "Most Popular",
//     bestValue: "Best Value",
//     features: {
//       title: "Premium Features",
//       global: "Global Coverage",
//       globalDesc: "Seamless connectivity in 200+ countries",
//       fast: "Lightning Fast",
//       fastDesc: "5G speed available in major cities",
//       affordable: "Best Price",
//       affordableDesc: "Save up to 70% on roaming charges",
//       support: "Priority Support",
//       supportDesc: "24/7 dedicated assistance",
//     },
//     trustIndicators: {
//       title: "Trusted Worldwide",
//       customers: "Happy Travelers",
//       coverage: "Countries",
//       uptime: "Network Reliability",
//     },
//     contactInfo: "Need Assistance?",
//     workingHours: "Support Available",
//     workingHoursDetail: "24/7 - Global Support Team",
//     callUs: "Call Center",
//     emailUs: "Email Support",
//     instantActivation: "Instant Activation",
//     noHiddenFees: "No Hidden Fees",
//     easyTopup: "Easy Top-up",
//   },
//   ar: {
//     title: "باقات الإنترنت العالمية",
//     subtitle: "ابقَ متصلاً في أكثر من 200 دولة مع إنترنت فائق السرعة",
//     formTitle: "احصل على الاتصال فوراً",
//     country: "الدولة المقصودة",
//     countryPlaceholder: "اختر أو أدخل وجهتك",
//     mobileNumber: "رقم الجوال",
//     mobilePlaceholder: "+966 5X XXX XXXX",
//     package: "اختر باقتك",
//     selectPackage: "اختر باقة البيانات",
//     submit: "تفعيل الباقة",
//     submitting: "جاري المعالجة...",
//     submitSuccess: "تم تفعيل الباقة بنجاح!",
//     submitError: "فشل تفعيل الباقة. يرجى المحاولة مرة أخرى.",
//     popular: "الأكثر طلباً",
//     bestValue: "أفضل قيمة",
//     features: {
//       title: "ميزات متميزة",
//       global: "تغطية عالمية",
//       globalDesc: "اتصال سلس في أكثر من 200 دولة",
//       fast: "سرعة البرق",
//       fastDesc: "سرعة 5G متوفرة في المدن الكبرى",
//       affordable: "أفضل سعر",
//       affordableDesc: "وفر حتى 70% من رسوم التجوال",
//       support: "دعم مميز",
//       supportDesc: "مساعدة مخصصة على مدار الساعة",
//     },
//     trustIndicators: {
//       title: "موثوق عالمياً",
//       customers: "مسافرون سعداء",
//       coverage: "دولة",
//       uptime: "موثوقية الشبكة",
//     },
//     contactInfo: "بحاجة إلى مساعدة؟",
//     workingHours: "الدعم متاح",
//     workingHoursDetail: "24/7 - فريق دعم عالمي",
//     callUs: "مركز الاتصال",
//     emailUs: "الدعم عبر البريد",
//     instantActivation: "تفعيل فوري",
//     noHiddenFees: "بدون رسوم خفية",
//     easyTopup: "شحن سهل",
//   },
// };

// export default function InternetPackagesForm({ lang = "en" }) {
//   const currentLang = lang || "en";
//   const t = translations[currentLang];
//   const isRTL = currentLang === "ar";

//   const [formData, setFormData] = useState({
//     country: "",
//     mobile_number: "",
//     package: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);
//   const [selectedCountryFlag, setSelectedCountryFlag] = useState("🌍");

//   const packages = [
//     { value: "1GB", label: "1 GB", price: "$10", validity: "7 days", speed: "4G/LTE", popular: false, bestValue: false },
//     { value: "3GB", label: "3 GB", price: "$25", validity: "15 days", speed: "4G/LTE", popular: true, bestValue: false },
//     { value: "5GB", label: "5 GB", price: "$40", validity: "30 days", speed: "5G Ready", popular: false, bestValue: true },
//     { value: "10GB", label: "10 GB", price: "$70", validity: "30 days", speed: "5G Ready", popular: false, bestValue: false },
//     { value: "20GB", label: "20 GB", price: "$130", validity: "60 days", speed: "5G Ultra", popular: false, bestValue: false },
//     { value: "50GB", label: "50 GB", price: "$300", validity: "90 days", speed: "5G Ultra", popular: false, bestValue: false },
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (name === "country" && value) {
//       const countryFlags = {
//         saudi: "🇸🇦",
//         uae: "🇦🇪",
//         egypt: "🇪🇬",
//         usa: "🇺🇸",
//         uk: "🇬🇧",
//         france: "🇫🇷",
//         germany: "🇩🇪",
//         italy: "🇮🇹",
//         spain: "🇪🇸",
//         turkey: "🇹🇷",
//         japan: "🇯🇵",
//         china: "🇨🇳",
//       };
//       const countryLower = value.toLowerCase();
//       for (const [key, flag] of Object.entries(countryFlags)) {
//         if (countryLower.includes(key)) {
//           setSelectedCountryFlag(flag);
//           return;
//         }
//       }
//       setSelectedCountryFlag("🌍");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus(null);

//     try {
//       const response = await fetch(`${API_URL}/internet-packages`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         console.error("Internet package API error:", responseData);
//         setSubmitStatus("error");
//         return;
//       }

//       setSubmitStatus("success");
//       setFormData({ country: "", mobile_number: "", package: "" });
//       setSelectedCountryFlag("🌍");
//       setTimeout(() => setSubmitStatus(null), 5000);
//     } catch (error) {
//       console.error("Error submitting internet package request:", error);
//       setSubmitStatus("error");
//       setTimeout(() => setSubmitStatus(null), 5000);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const selectedPackage = packages.find((p) => p.value === formData.package);

//   return (
//     <div
//       className="w-full min-h-screen bg-[#8A7779] py-3 px-3 xs:py-4 sm:py-6 sm:px-4 md:py-10 md:px-6 lg:py-14 lg:px-8"
//       dir={isRTL ? "rtl" : "ltr"}
//     >
//       <div className="max-w-7xl mx-auto">
//         {/* ===== HEADER ===== */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
//         >
//           <div className="flex justify-center">
//             <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-3 md:mb-4 shadow-lg">
//               <Wifi className="w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10 text-white" />
//             </div>
//           </div>
//           <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 md:mb-2">
//             {t.title}
//           </h1>
//           <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/80 max-w-2xl mx-auto px-2">
//             {t.subtitle}
//           </p>

//           {/* Stats Pills */}
//           <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3 mt-3 sm:mt-4 md:mt-6">
//             <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/20 backdrop-blur px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-white text-[10px] sm:text-xs md:text-sm shadow-sm border border-white/20">
//               <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-yellow-400" />
//               {t.instantActivation}
//             </span>
//             <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/20 backdrop-blur px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-white text-[10px] sm:text-xs md:text-sm shadow-sm border border-white/20">
//               <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-green-400" />
//               {t.noHiddenFees}
//             </span>
//             <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/20 backdrop-blur px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-white text-[10px] sm:text-xs md:text-sm shadow-sm border border-white/20">
//               <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-blue-300" />
//               {t.easyTopup}
//             </span>
//           </div>
//         </motion.div>

//         {/* ===== GRID LAYOUT ===== */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
//           {/* ===== LEFT COLUMN: FORM ===== */}
//           <div className="lg:col-span-2">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-4 sm:p-5 md:p-6 lg:p-8 border border-white/20"
//             >
//               {/* Form Header */}
//               <div className="border-b border-white/20 pb-3 sm:pb-4 md:pb-6 mb-4 sm:mb-5 md:mb-6">
//                 <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center">
//                   {t.formTitle}
//                 </h2>
//                 <p className="text-xs sm:text-sm text-white/70 text-center mt-1">
//                   Fill out the details and get connected in minutes
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit}>
//                 {/* Status Messages */}
//                 <AnimatePresence>
//                   {submitStatus === "success" && (
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.95 }}
//                       className="flex items-center justify-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 bg-green-500/20 border border-green-400/30 rounded-xl mb-4 sm:mb-5 md:mb-6 text-center"
//                     >
//                       <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
//                       <span className="text-green-300 font-medium text-xs sm:text-sm md:text-base">
//                         {t.submitSuccess}
//                       </span>
//                     </motion.div>
//                   )}
//                   {submitStatus === "error" && (
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.95 }}
//                       className="flex items-center justify-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 bg-red-500/20 border border-red-400/30 rounded-xl mb-4 sm:mb-5 md:mb-6 text-center"
//                     >
//                       <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] sm:text-[10px] font-bold flex-shrink-0">
//                         !
//                       </div>
//                       <span className="text-red-300 font-medium text-xs sm:text-sm md:text-base">
//                         {t.submitError}
//                       </span>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 {/* Form Fields - 2 columns on sm+ */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-5 md:mb-6">
//                   <div>
//                     <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-white/90 mb-1.5 sm:mb-2">
//                       <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
//                       {t.country}
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         name="country"
//                         value={formData.country}
//                         onChange={handleChange}
//                         required
//                         placeholder={t.countryPlaceholder}
//                         className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 border-white/20 bg-white/10 rounded-xl focus:outline-none focus:border-blue-400 text-sm sm:text-base text-white placeholder-white/50"
//                       />
//                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg sm:text-xl md:text-2xl">
//                         {selectedCountryFlag}
//                       </span>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-white/90 mb-1.5 sm:mb-2">
//                       <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
//                       {t.mobileNumber}
//                     </label>
//                     <input
//                       type="tel"
//                       name="mobile_number"
//                       value={formData.mobile_number}
//                       onChange={handleChange}
//                       required
//                       placeholder={t.mobilePlaceholder}
//                       className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 border-white/20 bg-white/10 rounded-xl focus:outline-none focus:border-blue-400 text-sm sm:text-base text-white placeholder-white/50"
//                     />
//                   </div>
//                 </div>

//                 {/* Package Selection */}
//                 <div className="mb-4 sm:mb-5 md:mb-6">
//                   <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-white/90 mb-2 sm:mb-3">
//                     <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
//                     {t.package}
//                   </label>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 md:gap-3">
//                     {packages.map((pkg) => (
//                       <motion.button
//                         key={pkg.value}
//                         type="button"
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             package: pkg.value,
//                           }))
//                         }
//                         className={`relative p-2 sm:p-3 md:p-4 rounded-xl border-2 transition-all text-left ${
//                           formData.package === pkg.value
//                             ? "border-blue-400 bg-blue-500/20 shadow-md"
//                             : "border-white/20 bg-white/5 hover:border-white/40"
//                         }`}
//                       >
//                         {pkg.popular && (
//                           <span className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[7px] sm:text-[9px] md:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
//                             {t.popular}
//                           </span>
//                         )}
//                         {pkg.bestValue && (
//                           <span className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[7px] sm:text-[9px] md:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
//                             {t.bestValue}
//                           </span>
//                         )}
//                         <div className="flex justify-between items-center mb-0.5 sm:mb-1">
//                           <span className="font-bold text-xs sm:text-sm md:text-base text-white">
//                             {pkg.label}
//                           </span>
//                           <span className="text-blue-400 font-bold text-xs sm:text-sm md:text-base">
//                             {pkg.price}
//                           </span>
//                         </div>
//                         <div className="text-white/60 text-[8px] sm:text-[10px] md:text-xs">
//                           <div className="flex items-center gap-0.5 sm:gap-1 mb-0.5">
//                             <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                             {pkg.validity}
//                           </div>
//                           <div className="hidden xs:block">{pkg.speed}</div>
//                         </div>
//                       </motion.button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Selected Package Preview */}
//                 <AnimatePresence>
//                   {selectedPackage && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl p-3 sm:p-4 md:p-5 border border-blue-400/30 mb-4 sm:mb-5 md:mb-6"
//                     >
//                       <div className="flex flex-col xs:flex-row items-center justify-between gap-2 xs:gap-3">
//                         <div className="flex items-center gap-2 xs:gap-3 w-full xs:w-auto">
//                           <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
//                             <Wifi className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="font-bold text-white text-xs sm:text-sm md:text-base truncate">
//                               {selectedPackage.label}
//                             </p>
//                             <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 text-[8px] xs:text-[10px] sm:text-xs md:text-sm text-white/70">
//                               <span className="flex items-center gap-0.5 xs:gap-1">
//                                 <Clock className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
//                                 {selectedPackage.validity}
//                               </span>
//                               <span className="hidden xs:inline">
//                                 {selectedPackage.speed}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-center xs:text-right w-full xs:w-auto">
//                           <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-blue-400">
//                             {selectedPackage.price}
//                           </p>
//                           <p className="text-[6px] xs:text-[8px] sm:text-[10px] md:text-xs text-white/50">
//                             One-time payment
//                           </p>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 {/* Submit Button */}
//                 <motion.button
//                   whileHover={{ scale: 1.01 }}
//                   whileTap={{ scale: 0.99 }}
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-spin flex-shrink-0" />
//                       <span className="text-xs sm:text-sm">{t.submitting}</span>
//                     </>
//                   ) : (
//                     <>
//                       <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
//                       <span className="text-xs sm:text-sm sm:text-base">
//                         {t.submit}
//                       </span>
//                       <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
//                     </>
//                   )}
//                 </motion.button>
//               </form>
//             </motion.div>
//           </div>

//           {/* ===== RIGHT COLUMN: FEATURES ===== */}
//           <div className="space-y-3 sm:space-y-4 md:space-y-6">
//             {/* Features Card */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border border-white/20"
//             >
//               <h3 className="flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg font-bold text-white mb-3 sm:mb-4">
//                 <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
//                 {t.features.title}
//               </h3>
//               <div className="space-y-2 sm:space-y-3 md:space-y-4">
//                 {[
//                   { icon: Globe, title: t.features.global, desc: t.features.globalDesc },
//                   { icon: Zap, title: t.features.fast, desc: t.features.fastDesc },
//                   { icon: DollarSign, title: t.features.affordable, desc: t.features.affordableDesc },
//                   { icon: Headphones, title: t.features.support, desc: t.features.supportDesc },
//                 ].map((feature, idx) => (
//                   <div
//                     key={idx}
//                     className="flex flex-col items-center text-center p-2 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
//                   >
//                     <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-xl flex items-center justify-center mb-1.5 sm:mb-2 flex-shrink-0">
//                       <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-white text-xs sm:text-sm md:text-base">
//                         {feature.title}
//                       </h4>
//                       <p className="text-[10px] sm:text-xs md:text-sm text-white/70">
//                         {feature.desc}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>

//             {/* Trust Indicators */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border border-white/20 text-center"
//             >
//               <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-3 sm:mb-4">
//                 {t.trustIndicators.title}
//               </h3>
//               <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-4">
//                 <div>
//                   <div className="text-base sm:text-xl md:text-2xl font-bold text-blue-400">
//                     100K+
//                   </div>
//                   <div className="text-[8px] sm:text-[10px] md:text-xs text-white/60">
//                     {t.trustIndicators.customers}
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-base sm:text-xl md:text-2xl font-bold text-green-400">
//                     200+
//                   </div>
//                   <div className="text-[8px] sm:text-[10px] md:text-xs text-white/60">
//                     {t.trustIndicators.coverage}
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-base sm:text-xl md:text-2xl font-bold text-purple-400">
//                     99.9%
//                   </div>
//                   <div className="text-[8px] sm:text-[10px] md:text-xs text-white/60">
//                     {t.trustIndicators.uptime}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Contact Info */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-4 sm:p-5 md:p-6 text-white text-center"
//             >
//               <h3 className="flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4">
//                 <Headphones className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
//                 {t.contactInfo}
//               </h3>
//               <div className="space-y-2 sm:space-y-3">
//                 <div className="flex items-center justify-center gap-2 sm:gap-3">
//                   <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
//                   <div className="text-left">
//                     <p className="font-semibold text-xs sm:text-sm md:text-base">
//                       {t.workingHours}
//                     </p>
//                     <p className="text-[10px] sm:text-xs md:text-sm text-blue-100">
//                       {t.workingHoursDetail}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-center gap-2 sm:gap-3">
//                   <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
//                   <div className="text-left">
//                     <p className="font-semibold text-xs sm:text-sm md:text-base">
//                       {t.callUs}
//                     </p>
//                     <p className="text-[10px] sm:text-xs md:text-sm text-blue-100">
//                       +966 54 730 5060
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-center gap-2 sm:gap-3">
//                   <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
//                   <div className="text-left">
//                     <p className="font-semibold text-xs sm:text-sm md:text-base">
//                       {t.emailUs}
//                     </p>
//                     <p className="text-[10px] sm:text-xs md:text-sm text-blue-100">
//                       support@tilalrimal.com
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }