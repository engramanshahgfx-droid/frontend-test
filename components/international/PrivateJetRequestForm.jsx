"use client";




import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plane,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
} from "lucide-react";
import { API_URL } from "@/lib/api";

const labels = {
  en: {
    title: "Private Jet Charter",
    subtitle: "Experience the pinnacle of luxury travel with our premium private jet services",
    formTitle: "Request a Quote",
    name: "Full Name",
    namePlaceholder: "Enter your full name",
    email: "Email Address",
    emailPlaceholder: "you@example.com",
    phone: "Phone Number",
    phonePlaceholder: "+966 5X XXX XXXX",
    clientType: "Request Type",
    clientTypePlaceholder: "Select request type",
    departure: "Departure City / Airport",
    departurePlaceholder: "e.g., Riyadh Airport, Jeddah, Dubai",
    destination: "Destination City",
    destinationPlaceholder: "e.g., London, Paris, New York",
    date: "Departure Date",
    returnDate: "Return Date (optional)",
    passengers: "Number of Passengers",
    passengersPlaceholder: "Enter number",
    moreThan20: "More than 20 people",
    aircraftType: "Aircraft Preference",
    selectAircraftType: "Select aircraft type",
    aircraftOptions: {
      light: "Light Jet (4-6 pax)",
      midsize: "Midsize Jet (6-8 pax)",
      heavy: "Heavy Jet (8-14 pax)",
      vip: "VIP Airliner (14+ pax)",
      xlarge: "Extra Large Jet (20+ pax)",
    },
    specialRequests: "Special Requests",
    specialRequestsPlaceholder: "Catering, ground transportation, etc...",
    submit: "Submit Request",
    submitting: "Submitting...",
    submitSuccess: "Request Submitted Successfully!",
    submitError: "Error submitting request. Please try again.",
    features: {
      title: "Why Choose Us",
      luxury: "Luxury Experience",
      luxuryDesc: "Premium cabins with personalized service",
      global: "Global Network",
      globalDesc: "Access to 5,000+ private airports worldwide",
      flexibility: "Flexible Scheduling",
      flexibilityDesc: "Fly on your schedule, 24/7 availability",
      safety: "Safety First",
      safetyDesc: "FAA/EASA certified operators",
    },
    contactInfo: "Contact Information",
    workingHours: "Working Hours",
    workingHoursDetail: "24/7 - Available anytime",
    callUs: "Call Us",
    emailUs: "Email Us",
  },
  ar: {
    title: "استئجار طائرة خاصة",
    subtitle: "اختبر قمة السفر الفاخر مع خدمات الطيران الخاص premium لدينا",
    formTitle: "طلب عرض سعر",
    name: "الاسم الكامل",
    namePlaceholder: "أدخل اسمك الكامل",
    email: "البريد الإلكتروني",
    emailPlaceholder: "example@you.com",
    phone: "رقم الهاتف",
    phonePlaceholder: "+966 5X XXX XXXX",
    clientType: "نوع الطلب",
    clientTypePlaceholder: "اختر نوع الطلب",
    departure: "مدينة / مطار المغادرة",
    departurePlaceholder: "مثال: مطار الرياض، جدة، دبي",
    destination: "مدينة الوصول",
    destinationPlaceholder: "مثال: لندن، باريس، نيويورك",
    date: "تاريخ المغادرة",
    returnDate: "تاريخ العودة (اختياري)",
    passengers: "عدد المسافرين",
    passengersPlaceholder: "أدخل العدد",
    moreThan20: "أكثر من 20 شخصاً",
    aircraftType: "نوع الطائرة المفضل",
    selectAircraftType: "اختر نوع الطائرة",
    aircraftOptions: {
      light: "طائرة خفيفة (4-6 أشخاص)",
      midsize: "طائرة متوسطة (6-8 أشخاص)",
      heavy: "طائرة كبيرة (8-14 أشخاص)",
      vip: "طائرة VIP (14+ أشخاص)",
      xlarge: "طائرة أكبر (20+ شخص)",
    },
    specialRequests: "طلبات خاصة",
    specialRequestsPlaceholder: "تجهيزات الطعام، النقل البري، إلخ...",
    submit: "إرسال الطلب",
    submitting: "جاري الإرسال...",
    submitSuccess: "تم إرسال الطلب بنجاح!",
    submitError: "خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.",
    features: {
      title: "لماذا تختارنا",
      luxury: "تجربة فاخرة",
      luxuryDesc: "مقصورات فاخرة مع خدمة شخصية",
      global: "شبكة عالمية",
      globalDesc: "الوصول إلى أكثر من 5000 مطار خاص حول العالم",
      flexibility: "جدولة مرنة",
      flexibilityDesc: "السفر في وقتك المناسب، متوفر 24/7",
      safety: "السلامة أولاً",
      safetyDesc: "مشغلون معتمدون من FAA/EASA",
    },
    contactInfo: "معلومات الاتصال",
    workingHours: "ساعات العمل",
    workingHoursDetail: "24/7 - متاحون في أي وقت",
    callUs: "اتصل بنا",
    emailUs: "راسلنا",
  },
  zh: {
    title: "私人飞机包机",
    subtitle: "通过我们的优质私人飞机服务体验奢华旅行的巅峰",
    formTitle: "请求报价",
    name: "全名",
    namePlaceholder: "请输入您的全名",
    email: "电子邮箱",
    emailPlaceholder: "you@example.com",
    phone: "电话号码",
    phonePlaceholder: "+966 5X XXX XXXX",
    clientType: "请求类型",
    clientTypePlaceholder: "选择请求类型",
    departure: "出发城市 / 机场",
    departurePlaceholder: "例如：利雅得机场、吉达、迪拜",
    destination: "目的地城市",
    destinationPlaceholder: "例如：伦敦、巴黎、纽约",
    date: "出发日期",
    returnDate: "返程日期（可选）",
    passengers: "乘客人数",
    passengersPlaceholder: "请输入人数",
    moreThan20: "20人以上",
    aircraftType: "飞机偏好",
    selectAircraftType: "选择飞机类型",
    aircraftOptions: {
      light: "轻型飞机 (4-6人)",
      midsize: "中型飞机 (6-8人)",
      heavy: "重型飞机 (8-14人)",
      vip: "VIP客机 (14人以上)",
      xlarge: "特大型飞机 (20人以上)",
    },
    specialRequests: "特殊要求",
    specialRequestsPlaceholder: "餐饮、地面交通等...",
    submit: "提交请求",
    submitting: "提交中...",
    submitSuccess: "请求提交成功！",
    submitError: "提交请求出错，请重试。",
    features: {
      title: "为什么选择我们",
      luxury: "奢华体验",
      luxuryDesc: "高级客舱与个性化服务",
      global: "全球网络",
      globalDesc: "通达全球5,000+个私人机场",
      flexibility: "灵活安排",
      flexibilityDesc: "按您的时间飞行，24/7全天候服务",
      safety: "安全第一",
      safetyDesc: "FAA/EASA认证运营商",
    },
    contactInfo: "联系信息",
    workingHours: "工作时间",
    workingHoursDetail: "24/7 - 随时可用",
    callUs: "致电我们",
    emailUs: "发送邮件",
  },
};

export default function PrivateJetRequestForm({ lang }) {
  const currentLang = lang || "en";
  const t = labels[currentLang];
  const isRTL = currentLang === "ar";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    clientType: "",
    departure: "",
    destination: "",
    date: "",
    returnDate: "",
    passengers: "",
    aircraftType: "",
    specialRequests: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const payload = {
      name: formData.name,
      client_type: formData.clientType || "Other",
      mobile_number: formData.phone,
      email: formData.email,
      number_of_people: Number(formData.passengers),
      destination: formData.destination,
      departure_airport: formData.departure,
      departure_date: formData.date,
      return_date: formData.returnDate || null,
      special_requirements: [
        formData.aircraftType ? `Aircraft preference: ${formData.aircraftType}.` : "",
        formData.specialRequests,
      ]
        .filter(Boolean)
        .join(" "),
    };

    try {
      const response = await fetch(`${API_URL}/private-jet-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Private jet API error:", result);
        setSubmitStatus("error");
        return;
      }

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        clientType: "",
        departure: "",
        destination: "",
        date: "",
        returnDate: "",
        passengers: "",
        aircraftType: "",
        specialRequests: "",
      });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error("Error submitting private jet request:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passengerOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  // Critical fix: Remove the inline style that might cause overflow issues
  return (
    <div className="container py-5" style={{ direction: isRTL ? "rtl" : "ltr", overflow: "visible" }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-5"
      >
        <div className="d-inline-flex align-items-center gap-2 bg-warning bg-opacity-10 px-4 py-2 rounded-pill mb-4">
          <Plane size={20} className="text-warning" />
          <span className="text-warning fw-semibold small text-uppercase">
            Premium Service
          </span>
        </div>
        <h1 className="display-4 fw-bold mb-3" style={{ color: "#1a1a2e" }}>
          {t.title}
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: "650px" }}>
          {t.subtitle}
        </p>
      </motion.div>

      <div className="row g-4" style={{ overflow: "visible" }}>
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="col-lg-7"
          style={{ overflow: "visible" }}
        >
          <div className="card border-0 shadow-lg rounded-4 overflow-visible">
            <div className="card-header bg-dark text-white py-4 px-4 border-0">
              <h3 className="h4 mb-0 fw-semibold">{t.formTitle}</h3>
              <p className="text-white-50 small mt-1 mb-0">
                Fill out the form and our team will contact you within 2 hours
              </p>
            </div>
            <div className="card-body p-4 overflow-visible">
              <form onSubmit={handleSubmit} style={{ overflow: "visible" }}>
                <div className="row g-3" style={{ overflow: "visible" }}>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <Users size={16} className="me-1" /> {t.name}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.namePlaceholder}
                      required
                      className="form-control form-control-lg rounded-3"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <Mail size={16} className="me-1" /> {t.email}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.emailPlaceholder}
                      required
                      className="form-control form-control-lg rounded-3"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <Phone size={16} className="me-1" /> {t.phone}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t.phonePlaceholder}
                      required
                      className="form-control form-control-lg rounded-3"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <Plane size={16} className="me-1" /> {t.clientType}
                    </label>
                    <select
                      name="clientType"
                      value={formData.clientType}
                      onChange={handleChange}
                      required
                      className={`form-select form-select-lg rounded-3 pj-select ${isRTL ? 'text-end' : 'text-start'}`}
                      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    >
                      <option value="" disabled>
                        {t.clientTypePlaceholder}
                      </option>
                      <option value="Businessman">Businessman</option>
                      <option value="Hajj">Hajj</option>
                      <option value="Football Team">Football Team</option>
                      <option value="Government Entity">Government Entity</option>
                      <option value="Medical Evacuation">Medical Evacuation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <Calendar size={16} className="me-1" /> {t.date}
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="form-control form-control-lg rounded-3"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <Calendar size={16} className="me-1" /> {t.returnDate}
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                      className="form-control form-control-lg rounded-3"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <MapPin size={16} className="me-1" /> {t.departure}
                    </label>
                    <input
                      type="text"
                      name="departure"
                      value={formData.departure}
                      onChange={handleChange}
                      placeholder={t.departurePlaceholder}
                      required
                      className="form-control form-control-lg rounded-3"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <MapPin size={16} className="me-1" /> {t.destination}
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder={t.destinationPlaceholder}
                      required
                      className="form-control form-control-lg rounded-3"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <Users size={16} className="me-1" /> {t.passengers}
                    </label>
                    <input
                      type="number"
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleChange}
                      placeholder={t.passengersPlaceholder}
                      required
                      min="1"
                      className="form-control form-control-lg rounded-3"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <Plane size={16} className="me-1" /> {t.aircraftType}
                    </label>
                    <select
                      name="aircraftType"
                      value={formData.aircraftType}
                      onChange={handleChange}
                      required
                      className={`form-select form-select-lg rounded-3 pj-select ${isRTL ? 'text-end' : 'text-start'}`}
                      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    >
                      <option value="" disabled hidden>
                        {t.selectAircraftType}
                      </option>
                      <option value="light" style={{ color: '#111' }}>{t.aircraftOptions.light}</option>
                      <option value="midsize" style={{ color: '#111' }}>{t.aircraftOptions.midsize}</option>
                      <option value="heavy" style={{ color: '#111' }}>{t.aircraftOptions.heavy}</option>
                      <option value="vip" style={{ color: '#111' }}>{t.aircraftOptions.vip}</option>
                      <option value="xlarge" style={{ color: '#111' }}>{t.aircraftOptions.xlarge}</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      <MessageCircle size={16} className="me-1" /> {t.specialRequests}
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows="4"
                      placeholder={t.specialRequestsPlaceholder}
                      className="form-control rounded-3"
                    />
                  </div>
                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-warning btn-lg w-100 rounded-3 fw-semibold"
                      style={{
                        background: "linear-gradient(135deg, #f5af19 0%, #f12711 100%)",
                        border: "none",
                        color: "#fff",
                        padding: "14px",
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          {t.submitting}
                        </>
                      ) : (
                        <>
                          <Send size={18} className="me-2" /> {t.submit}
                        </>
                      )}
                    </button>
                  </div>
                  {submitStatus === "success" && (
                    <div className="alert alert-success rounded-3 d-flex align-items-center gap-2">
                      <CheckCircle size={18} />
                      {t.submitSuccess}
                    </div>
                  )}
                  {submitStatus === "error" && (
                    <div className="alert alert-danger rounded-3">{t.submitError}</div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Features & Contact Section - Rest remains the same */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="col-lg-5"
        >
          <div className="card border-0 shadow-lg rounded-4 mb-4 overflow-hidden">
            <div className="card-header bg-dark text-white py-3 px-4 border-0">
              <h4 className="h5 mb-0 fw-semibold">{t.features.title}</h4>
            </div>
            <div className="card-body p-4">
              <div className="d-flex gap-3 mb-4">
                <div className="bg-warning bg-opacity-10 rounded-3 p-3" style={{ width: "50px", height: "50px" }}>
                  <Plane size={24} className="text-warning" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{t.features.luxury}</h6>
                  <p className="text-muted small mb-0">{t.features.luxuryDesc}</p>
                </div>
              </div>
              <div className="d-flex gap-3 mb-4">
                <div className="bg-warning bg-opacity-10 rounded-3 p-3" style={{ width: "50px", height: "50px" }}>
                  <MapPin size={24} className="text-warning" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{t.features.global}</h6>
                  <p className="text-muted small mb-0">{t.features.globalDesc}</p>
                </div>
              </div>
              <div className="d-flex gap-3 mb-4">
                <div className="bg-warning bg-opacity-10 rounded-3 p-3" style={{ width: "50px", height: "50px" }}>
                  <Clock size={24} className="text-warning" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{t.features.flexibility}</h6>
                  <p className="text-muted small mb-0">{t.features.flexibilityDesc}</p>
                </div>
              </div>
              <div className="d-flex gap-3">
                <div className="bg-warning bg-opacity-10 rounded-3 p-3" style={{ width: "50px", height: "50px" }}>
                  <CheckCircle size={24} className="text-warning" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">{t.features.safety}</h6>
                  <p className="text-muted small mb-0">{t.features.safetyDesc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t.contactInfo}</h5>
              <div className="border-bottom pb-3 mb-3">
                <p className="text-muted small mb-1">{t.workingHours}</p>
                <p className="fw-semibold mb-0">{t.workingHoursDetail}</p>
              </div>
              <div className="border-bottom pb-3 mb-3">
                <p className="text-muted small mb-1">{t.callUs}</p>
                <p className="fw-semibold mb-0">966547305060</p>
              </div>
              <div>
                <p className="text-muted small mb-1">{t.emailUs}</p>
                <p className="fw-semibold mb-0">info@tilalr.com</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <style jsx>{`
        .pj-select {
          background-color: #ffffff !important;
          color: #1a1a1a !important;
          border-color: #ced4da !important;
          box-shadow: none !important;
          appearance: menulist !important;
        }

        .pj-select option {
          background-color: #ffffff !important;
          color: #1a1a1a !important;
        }

        .pj-select:focus {
          border-color: #86b7fe !important;
          outline: 0 !important;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25) !important;
        }
      `}</style>
    </div>
  );
}