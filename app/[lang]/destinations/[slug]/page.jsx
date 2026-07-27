"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";
import BookingModal from "@/components/BookingModal";
import Image from "next/image";
import {
  Luggage,
  Laptop,
  Clock,
  Globe,
  Calendar,
  Users,
  User,
  Headphones,
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  CreditCard,
  Copy,
  CheckCircle,
  Home,
} from "lucide-react";

export default function DestinationDetails() {
  const params = useParams();
  const router = useRouter();
  const lang = params?.lang || "en";
  const slug = params?.slug;
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isRTL = lang === "ar";

  const labels = {
    en: {
      description: "Description",
      packageIncludes: "Package Includes",
      packageNotIncludes: "Package Not Includes",
      importantNotes: "Important Notes",
      packageProgram: "Package Program",
      basicInfo: "Basic Information",
      contactInfo: "Contact Information",
      paymentMethods: "Payment Methods",
      tripCode: "Trip Code",
      daysNum: "Days Num",
      destinationName: "Destination Name",
      availableTo: "Available To",
      doubleRoom: "Double Room",
      singleRoom: "Single Room",
      perPerson: "per person",
      bookNow: "Book Now",
      loading: "Loading destination details...",
      destinationNotFound: "Destination not found",
      dayLabel: "Day",
      na: "N/A",
      viewAll: "View All Destinations",
      home: "Home",
      electronicPayment: "Electronic payment",
      electronicPaymentDesc:
        "We provide you with a secure electronic payment gateway by sending the payment link for the required amount",
      bankTransfer: "Bank Transfer",
      completeReservation: "Complete Reservation",
    },
    ar: {
      description: "الوصف",
      packageIncludes: "تشمل الباقة",
      packageNotIncludes: "لا تشمل الباقة",
      importantNotes: "ملاحظات مهمة",
      packageProgram: "برنامج الباقة",
      basicInfo: "معلومات أساسية",
      contactInfo: "معلومات الاتصال",
      paymentMethods: "طرق الدفع",
      tripCode: "رمز الرحلة",
      daysNum: "عدد الأيام",
      destinationName: "اسم الوجهة",
      availableTo: "متاح حتى",
      doubleRoom: "غرفة مزدوجة",
      singleRoom: "غرفة فردية",
      perPerson: "للفرد",
      bookNow: "احجز الآن",
      loading: "جاري تحميل تفاصيل الوجهة...",
      destinationNotFound: "الوجهة غير موجودة",
      dayLabel: "اليوم",
      na: "غير متوفر",
      viewAll: "عرض جميع الوجهات",
      home: "الرئيسية",
      electronicPayment: "الدفع الإلكتروني",
      electronicPaymentDesc:
        "نوفر لك بوابة دفع إلكترونية آمنة عن طريق إرسال رابط الدفع للمبلغ المطلوب",
      bankTransfer: "تحويل بنكي",
      completeReservation: "إكمال الحجز",
    },
  };

  const t = labels[lang] || labels.en;

  const getLocalizedField = (obj, field) => {
    if (!obj) return "";

    const primaryKey = isRTL ? `${field}_ar` : `${field}_en`;
    const secondaryKey = isRTL ? `${field}_en` : `${field}_ar`;

    if (obj[primaryKey]) return obj[primaryKey];
    if (obj[field]) return obj[field];
    if (obj[secondaryKey]) return obj[secondaryKey];

    return "";
  };

  const getArrayField = (obj, field) => {
    if (!obj) return [];

    const primaryKey = isRTL ? `${field}_ar` : `${field}_en`;
    const secondaryKey = isRTL ? `${field}_en` : `${field}_ar`;

    if (Array.isArray(obj[primaryKey])) return obj[primaryKey];
    if (Array.isArray(obj[field])) return obj[field];
    if (Array.isArray(obj[secondaryKey])) return obj[secondaryKey];

    return [];
  };

  const getLocalizedItemText = (item, field) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    return (
      item[isRTL ? `${field}_ar` : `${field}_en`] ||
      item[field] ||
      item[`${field}_en`] ||
      item[`${field}_ar`] ||
      ""
    );
  };

  const getText = (obj, field) => {
    if (!obj) return "";

    const normalize = (value) => {
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          return parsed;
        } catch {
          return value;
        }
      }
      return value;
    };

    switch (field) {
      case "title":
      case "description":
      case "long_description":
      case "location":
      case "duration":
        return normalize(getLocalizedField(obj, field));
      case "features":
      case "includes":
      case "not_includes":
      case "itinerary":
        return getArrayField(obj, field);
      default:
        return normalize(getLocalizedField(obj, field));
    }
  };

  const parseJsonField = (field, fallback) => {
    if (!field) return fallback;
    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field);
        return parsed;
      } catch {
        return fallback;
      }
    }
    return field;
  };

  const getImageUrl = (imageData) => {
    if (!imageData) return "/placeholder.png";
    if (/^https?:\/\//.test(imageData)) return imageData;
    if (imageData.startsWith("/")) {
      const backendBase = API_URL.replace(/\/api\/?$/, "");
      return `${backendBase}${imageData}`;
    }
    const backendBase = API_URL.replace(/\/api\/?$/, "");
    return `${backendBase}/storage/tourism/${imageData}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Text copied to clipboard: " + text);
      })
      .catch((err) => {
        console.error("Unable to copy text to clipboard", err);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiEndpoint = `${API_URL.replace(/\/$/, "")}/tourism-destinations/${slug}`;
        console.log("[DestinationDetails] Fetching from:", apiEndpoint);

        const res = await fetch(apiEndpoint, {
          signal: controller.signal,
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();
        console.log("[DestinationDetails] Response:", json);

        if (!res.ok) {
          throw new Error(
            `API error: ${res.status} - ${json?.message || "Unknown error"}`,
          );
        }

        if (!json?.success) {
          throw new Error(json?.message || "Failed to fetch destination");
        }

        setDestination(json.data);
        setLoading(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("[DestinationDetails] Fetch error:", err.message);
          setError(err.message);
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchData();
    }
    return () => controller.abort();
  }, [slug]);

  const handleBookNow = () => {
    console.log("Book Now clicked!");
    setShowBookingModal(true);
  };

  const handleViewAll = () => {
    router.push(`/${lang}/tourism-destinations`);
  };

  if (loading) {
    return (
      <div className="details-section">
        <div className="container">
          <div className="row text-center" style={{ padding: "60px 0" }}>
            <div className="col-12">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ marginTop: "20px", color: "#666" }}>
                {t.loading}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="details-section">
        <div className="container">
          <div className="row text-center" style={{ padding: "60px 0" }}>
            <div className="col-12">
              <p style={{ color: "#ff6b6b" }}>
                {error || t.destinationNotFound}
              </p>
              <button
                onClick={handleViewAll}
                className="btn btn-main"
                style={{
                  marginTop: "20px",
                  padding: "10px 30px",
                  background: "#dfa528",
                  color: "#fff",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                }}
              >
                {t.viewAll}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Parse JSON fields with proper language support
  const features = getText(destination, "features");
  const notIncludes = getText(destination, "not_includes");
  const itinerary = getText(destination, "itinerary");
  
  // Parse basic_info, contact_info, payment_methods
  const basicInfo = parseJsonField(destination.basic_info, {});
  const contactInfo = parseJsonField(destination.contact_info, {});
  const paymentMethods = parseJsonField(destination.payment_methods, []);

  const localizedContactInfo = {
    address: getLocalizedItemText(contactInfo, "address") || contactInfo.address || contactInfo.address_en || contactInfo.address_ar || "",
    phone: contactInfo.phone || "",
    whatsapp: contactInfo.whatsapp || "",
    email: contactInfo.email || "",
  };

  const localizedPaymentMethods = paymentMethods.map((method) => ({
    ...method,
    name: getLocalizedItemText(method, "name") || method.name || method.name_en || method.name_ar || "",
    account_no: method.account_no || method.accountNo || "",
    iban: method.iban || "",
  }));

  const defaultPaymentMethods = [
 
  ];

  const displayPaymentMethods =
    localizedPaymentMethods.length > 0 ? localizedPaymentMethods : defaultPaymentMethods;

  const doubleRoomRate =
    destination?.double_room_price ??
    basicInfo.double_room ??
    basicInfo.doubleRoom ??
    destination?.price ??
    null;
  const singleRoomRate =
    destination?.single_room_price ??
    basicInfo.single_room ??
    basicInfo.singleRoom ??
    destination?.price ??
    null;
  const tripCode = basicInfo.trip_code ?? destination?.trip_code ?? t.na;
  const daysNum = basicInfo.days_num ?? basicInfo.days ?? t.na;
  const destinationName =
    (isRTL ? basicInfo.destination_name_ar : basicInfo.destination_name_en) ||
    basicInfo.destination_name ||
    getText(destination, "title") ||
    t.na;
  const availableTo = basicInfo.available_to ?? destination?.available_to ?? t.na;

  return (
    <div className="details-section" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <a href={`/${lang}`}>
            <Home size={14} style={{ display: "inline", marginRight: "4px" }} />
            {t.home}
          </a>
          <span> / </span>
          <a href={`/${lang}/tourism-destinations`}>{t.viewAll}</a>
          <span> / </span>
          <span className="current">{getText(destination, "title")}</span>
        </nav>

        {/* Main Content with Sidebar - 70/30 Layout */}
        <div className="content-wrapper">
          {/* Left Column - 70% */}
          <div className="main-content">
            <h1 className="page-title">{getText(destination, "title")}</h1>

            <div className="description-section">
              <h2>{t.description}</h2>
              <p>
                {getText(destination, "long_description") ||
                  getText(destination, "description")}
              </p>
              {destination.image && (
                <img
                  src={getImageUrl(destination.image_url || destination.image)}
                  alt={getText(destination, "title")}
                  className="main-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png";
                  }}
                />
              )}
            </div>

            {features && features.length > 0 && (
              <div className="includes-section">
                <h2>{t.packageIncludes}</h2>
                <ul>
                  {features.map((item, index) => (
                    <li key={index}>
                      <CheckCircle size={16} color="#28a745" style={{ display: "inline", marginRight: "8px" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {notIncludes && notIncludes.length > 0 && (
              <div className="not-includes-section">
                <h2>{t.packageNotIncludes}</h2>
                <ul>
                  {notIncludes.map((item, index) => (
                    <li key={index}>
                      <span style={{ color: "#dc3545", marginRight: "8px" }}>✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {getText(destination, "description") && (
              <div className="notes-section">
                <h2>{t.importantNotes}</h2>
                <p>{getText(destination, "description")}</p>
              </div>
            )}

            {itinerary && itinerary.length > 0 && (
              <div className="itinerary-section">
                <h2>{t.packageProgram}</h2>
                {itinerary.map((day, index) => (
                  <motion.div
                    key={index}
                    className="day-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h4>
                      {`${t.dayLabel} ${day.day}`} : {getLocalizedItemText(day, 'title')}
                    </h4>
                    <p>{getLocalizedItemText(day, 'description')}</p>
                    {day.image && (
                      <img
                        src={getImageUrl(day.image_url || day.image)}
                        alt={`${isRTL ? 'اليوم' : 'Day'} ${day.day}`}
                        className="day-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.png";
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            <div className="text-center">
              <button className="btn-book-now" onClick={handleBookNow}>
                {t.bookNow}
              </button>
            </div>
          </div>

          {/* Right Column - 30% Sidebar */}
          <div className="sidebar-content">
            {/* Basic Information Panel */}
            <div className="sidebar-panel">
              <div className="panel-header">
                <Luggage size={18} color="#fff" />
                <h4>{t.basicInfo}</h4>
              </div>
              <div className="panel-body">
                <ul className="info-list">
                  <li>
                    <Laptop size={16} color="#dfa528" />
                    <span className="label">{t.tripCode} :</span>
                    <span className="value">
                      {tripCode}
                    </span>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <Clock size={16} color="#dfa528" />
                    <span className="label">{t.daysNum} :</span>
                    <span className="value">{daysNum}</span>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <Globe size={16} color="#dfa528" />
                    <span className="label">{t.destinationName} :</span>
                    <span className="value">{destinationName}</span>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <Calendar size={16} color="#dfa528" />
                    <span className="label">{t.availableTo} :</span>
                    <span className="value">{availableTo}</span>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <Users size={16} color="#dfa528" />
                    <span className="label">{t.doubleRoom} :</span>
                    <span className="value highlight">
                      {doubleRoomRate ?? t.na}
                      <Image
                        src="/saudi_riyal.png"
                        alt="SAR"
                        width={14}
                        height={14}
                        className="currency-icon"
                      />
                      {/* {` ${t.perPerson}`} */}
                    </span>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <User size={16} color="#dfa528" />
                    <span className="label">{t.singleRoom} :</span>
                    <span className="value highlight">
                      {singleRoomRate ?? t.na}
                      <Image
                        src="/saudi_riyal.png"
                        alt="SAR"
                        width={14}
                        height={14}
                        className="currency-icon"
                      />
                      {/* {` ${t.perPerson}`} */}
                    </span>
                  </li>
                </ul>
                <button
                  className="complete-reservation-btn"
                  onClick={handleBookNow}
                >
                  <CheckCircle size={18} style={{ marginRight: "8px" }} />
                  {t.completeReservation}
                </button>
              </div>
            </div>

            {/* Contact Information Panel */}
            <div className="sidebar-panel">
              <div className="panel-header">
                <Headphones size={18} color="#fff" />
                <h4>{t.contactInfo}</h4>
              </div>
              <div className="panel-body">
                <ul className="contact-list">
                  <li>
                    <MapPin size={16} color="#dfa528" />
                    <span>
                      {localizedContactInfo.address || "al Rabwa Jeddah"}
                    </span>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <Phone size={16} color="#dfa528" />
                    <a href={`tel:${localizedContactInfo.phone || "0114562097"}`}>
                      {localizedContactInfo.phone || "0547305060"}
                    </a>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <MessageSquare size={16} color="#dfa528" />
                    <a
                      href={`https://wa.me/${(
                        localizedContactInfo.whatsapp || "966547305060"
                      ).replace(/\s/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {localizedContactInfo.whatsapp || "966547305060"}
                    </a>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <Mail size={16} color="#dfa528" />
                    <a
                      href={`mailto:${
                        localizedContactInfo.email || "info@tilalr.com"
                      }`}
                    >
                      {localizedContactInfo.email || "info@tilalr.com"}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Payment Methods Panel */}
            <div className="sidebar-panel">
              <div className="panel-header">
                <CreditCard size={18} color="#fff" />
                <h4>{t.paymentMethods}</h4>
              </div>
              <div className="panel-body">
                <h5 className="payment-title">1. {t.bankTransfer}</h5>
                {displayPaymentMethods.map((method, index) => (
                  <div key={index} className="bank-item">
                    {method.logo && (
                      <img
                        className="bank-logo"
                        src={`https://travelerclub.sa.com/images/banks-logos/${method.logo}`}
                        alt={method.name}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div className="bank-details">
                      <div className="bank-row">
                        <span className="bank-label">{isRTL ? 'الاسم' : 'Name'} :</span>
                        <span className="bank-number">{method.name || method.name_en || method.name_ar || ""}</span>
                      </div>
                      <div className="bank-row">
                        <span className="bank-label">Account No. :</span>
                        <span className="bank-number">
                          {method.account_no || "N/A"}
                        </span>
                        <button
                          className="copy-btn"
                          onClick={() =>
                            copyToClipboard(method.account_no || "")
                          }
                          title="Copy Account"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      <div className="bank-row">
                        <span className="bank-label">IBAN :</span>
                        <span className="bank-number">
                          {method.iban || "N/A"}
                        </span>
                        <button
                          className="copy-btn"
                          onClick={() => copyToClipboard(method.iban || "")}
                          title="Copy IBAN"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    {index < displayPaymentMethods.length - 1 && (
                      <div className="divider"></div>
                    )}
                  </div>
                ))}
                <div className="divider"></div>
                <h5 className="payment-title">2. {t.electronicPayment}</h5>
                <p className="electronic-text">{t.electronicPaymentDesc}</p>
                <img
                  className="payment-logos"
                  src="https://travelerclub.sa.com/images/verified.webp"
                  alt="Payment Methods"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        packageData={destination}
        lang={lang}
      />

      <style jsx>{`
        .details-section {
          padding: 40px 0 60px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .breadcrumb {
          padding: 10px 0 20px;
          font-size: 0.95rem;
          color: #666;
        }

        .breadcrumb a {
          color: #dfa528;
          text-decoration: none;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
        }

        .breadcrumb .current {
          color: #333;
        }

        .content-wrapper {
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }

        .main-content {
          flex: 0 0 70%;
          max-width: 70%;
        }

        .sidebar-content {
          flex: 0 0 30%;
          max-width: 30%;
          position: sticky;
          top: 100px;
          align-self: flex-start;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c2c2c;
          margin-bottom: 20px;
        }

        .description-section {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.06);
        }

        .description-section h2 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 15px;
        }

        .description-section p {
          font-size: 1rem;
          line-height: 1.8;
          color: #555;
          margin-bottom: 15px;
        }

        .main-image {
          width: 100%;
          max-height: 350px;
          object-fit: cover;
          border-radius: 8px;
        }

        .includes-section,
        .not-includes-section {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.06);
        }

        .includes-section h2,
        .not-includes-section h2 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 15px;
        }

        .includes-section ul,
        .not-includes-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .includes-section ul li,
        .not-includes-section ul li {
          padding: 8px 0;
          color: #555;
          font-size: 0.95rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .includes-section ul li:last-child,
        .not-includes-section ul li:last-child {
          border-bottom: none;
        }

        .notes-section {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.06);
        }

        .notes-section h2 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 15px;
        }

        .notes-section p {
          font-size: 1rem;
          line-height: 1.8;
          color: #555;
        }

        .itinerary-section {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.06);
        }

        .itinerary-section h2 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 20px;
        }

        .day-card {
          padding: 18px;
          margin-bottom: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #dfa528;
        }

        .day-card h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 10px;
        }

        .day-card p {
          font-size: 0.95rem;
          line-height: 1.8;
          color: #555;
          margin-bottom: 10px;
        }

        .day-image {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          border-radius: 8px;
        }

        .btn-book-now {
          background: #dfa528;
          color: #fff;
          border: none;
          padding: 14px 45px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(223, 165, 40, 0.3);
          margin-top: 10px;
        }

        .btn-book-now:hover {
          background: #c98c1e;
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(223, 165, 40, 0.4);
        }

        .sidebar-panel {
          background: #fff;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 20px;
          background: #1a9eaa;
          border-bottom: 1px solid #158a95;
        }

        .panel-header h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .panel-body {
          padding: 18px 20px;
        }

        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          font-size: 0.9rem;
          color: #555;
        }

        .info-list li .label {
          color: #888;
          font-weight: 500;
          min-width: 120px;
        }

        .info-list li .value {
          color: #2c2c2c;
          font-weight: 600;
          text-align: right;
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .currency-icon {
          display: inline-block;
          vertical-align: middle;
        }

        .info-list li .value.highlight {
          color: #dfa528;
        }

        .divider {
          height: 1px;
          background: #f0f0f0;
          margin: 2px 0;
          width: 100%;
        }

        .complete-reservation-btn {
          width: 100%;
          padding: 12px;
          margin-top: 15px;
          background: #28a745;
          color: #fff;
          border: none;
          border-radius: 15px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .complete-reservation-btn:hover {
          background: #218838;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        }

        .contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .contact-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          font-size: 0.9rem;
          color: #555;
        }

        .contact-list li a {
          color: #555;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .contact-list li a:hover {
          color: #dfa528;
        }

        .payment-title {
          font-size: 1rem;
          font-weight: 600;
          color: #2c2c2c;
          margin: 10px 0 15px;
        }

        .bank-item {
          margin-bottom: 15px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .bank-item:last-child {
          margin-bottom: 0;
        }

        .bank-logo {
          max-height: 35px;
          margin-bottom: 8px;
          display: block;
        }

        .bank-details {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .bank-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .bank-label {
          font-size: 0.85rem;
          color: #888;
          font-weight: 500;
          min-width: 90px;
        }

        .bank-number {
          font-size: 0.85rem;
          color: #2c2c2c;
          font-weight: 600;
          word-break: break-all;
        }

        .copy-btn {
          background: transparent;
          border: none;
          color: #dfa528;
          cursor: pointer;
          padding: 2px 5px;
          transition: color 0.3s ease;
        }

        .copy-btn:hover {
          color: #c98c1e;
        }

        .electronic-text {
          font-size: 0.85rem;
          color: #555;
          line-height: 1.6;
          margin: 10px 0;
        }

        .payment-logos {
          max-height: 40px;
          margin-top: 10px;
        }

        @media (max-width: 992px) {
          .content-wrapper {
            flex-direction: column;
          }
          .main-content {
            flex: 0 0 100%;
            max-width: 100%;
          }
          .sidebar-content {
            flex: 0 0 100%;
            max-width: 100%;
            position: static;
          }
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 1.5rem;
          }
          .description-section,
          .includes-section,
          .not-includes-section,
          .notes-section,
          .itinerary-section {
            padding: 18px;
          }
          .sidebar-panel {
            margin-bottom: 15px;
          }
          .panel-body {
            padding: 15px;
          }
          .info-list li .label {
            min-width: 80px;
            font-size: 0.8rem;
          }
          .bank-row {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}