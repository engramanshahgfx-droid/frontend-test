"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";
import BookingModal from "@/components/BookingModal";
import TravelReservationModal from "@/components/TravelReservationModal";
import Image from "next/image";
import {
  Sparkles,
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
  Star,
  ArrowRight,
} from "lucide-react";

export default function DestinationDetails() {
  const params = useParams();
  const router = useRouter();
  const lang = params?.lang || "en";
  const slug = params?.slug;
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showTravelReservationModal, setShowTravelReservationModal] = useState(false);

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countryTours, setCountryTours] = useState(null);
  const [selectedPersons, setSelectedPersons] = useState(1);

  useEffect(() => {
    if (destination?.person_prices && Array.isArray(destination.person_prices) && destination.person_prices.length > 0) {
      setSelectedPersons(Number(destination.person_prices[0].persons) || 1);
    }
  }, [destination]);

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
      doubleRoom: "Package Price",
      singleRoom: "Single Supplement",
      perPerson: "Total",
      bookNow: "Book Now",
      loading: "Loading destination details...",
      destinationNotFound: "Destination not found",
      dayLabel: "Day",
      na: "N/A",
      viewAll: "All Destinations",
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
      doubleRoom: "سعر الباقة (شخصين)",
      singleRoom: "اضافة شخص واحد",
      perPerson: "إجمالي",
      bookNow: "احجز الآن",
      loading: "جاري تحميل تفاصيل الوجهة...",
      destinationNotFound: "الوجهة غير موجودة",
      dayLabel: "اليوم",
      na: "غير متوفر",
      viewAll: "جميع الوجهات",
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
    const backendBase = API_URL.replace(/\/api\/?$/, "");
    if (imageData.startsWith("/")) {
      return `${backendBase}${imageData}`;
    }
    if (imageData.startsWith("tourism/")) {
      return `${backendBase}/storage/${imageData}`;
    }
    return `${backendBase}/storage/tourism/${imageData}`;
  };

  const slugify = (text) => {
    return text
      ?.toString()
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s+/g, "-")
      ?.replace(/[^\w\-]+/g, "")
      ?.replace(/\-\-+/g, "-");
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
      setCountryTours(null);
      setDestination(null);

      const defaultMockDestination = {
        id: 1,
        slug: slug,
        title_en: "Britain & Ireland Tour",
        title_ar: "جولة بريطانيا وأيرلندا",
        destination_name_en: "Britain & Ireland Tour",
        destination_name_ar: "جولة بريطانيا وأيرلندا",
        trip_code: "TR-202",
        days_num: 7,
        price: 4500,
        location_en: "Britain & Ireland",
        location_ar: "بريطانيا وأيرلندا",
        description_en: "Explore the beauty and culture of Britain and Ireland",
        description_ar: "استكشف جمال وثقافة بريطانيا وأيرلندا باحترافية كاملة",
      };

      // 1. Try to fetch specific tour details by slug
      try {
        const apiEndpoint = `${API_URL.replace(/\/$/, "")}/tourism-destinations/${slug}`;
        console.log("[DestinationDetails] Fetching specific tour from:", apiEndpoint);

        const res = await fetch(apiEndpoint, {
          signal: controller.signal,
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();
        console.log("[DestinationDetails] Specific tour response:", json);

        if (res.ok && json?.success && json?.data) {
          setDestination(json.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.log("[DestinationDetails] Tour not found by slug directly, checking country fallback...");
      }

      // 2. Fallback: Fetch all tours and filter by slugified country (location_en) name
      try {
        const allApiEndpoint = `${API_URL.replace(/\/$/, "")}/tourism-destinations`;
        console.log("[DestinationDetails] Fetching all tours from:", allApiEndpoint);

        const allRes = await fetch(allApiEndpoint, {
          signal: controller.signal,
        });

        const allJson = await allRes.json();
        if (allRes.ok && allJson?.success && allJson?.data) {
          const tours = allJson.data;

          const slugify = (text) => {
            return text
              ?.toString()
              ?.toLowerCase()
              ?.trim()
              ?.replace(/\s+/g, "-")
              ?.replace(/[^\w\-]+/g, "")
              ?.replace(/\-\-+/g, "-");
          };

          const matchedTours = tours.filter((tour) => {
            const countrySlug = slugify(tour.location_en);
            return countrySlug === slug;
          });

          if (matchedTours.length > 0) {
            setCountryTours(matchedTours);
            setLoading(false);
            return;
          }
        }

        // 3. Ultimate Fallback: Default mock destination object if API is down or not found
        setDestination(defaultMockDestination);
        setLoading(false);
      } catch (fallbackErr) {
        if (fallbackErr.name !== "AbortError") {
          console.error("[DestinationDetails] Fallback error:", fallbackErr.message);
          setDestination(defaultMockDestination);
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
    router.push(`/${lang}/destinations`);
  };
  if (loading) {
    return (
      <div className="details-section" style={{ minHeight: "100vh", background: "#FAF6F0", padding: "150px 40px 150px 150px" }}>
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
  if (countryTours) {
    const countryName = getText(countryTours[0], "location");
    return (
      <div className="details-section" style={{ minHeight: "100vh", background: "#FAF6F0", padding: "150px 0px 150px 0px" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          {/* Breadcrumb */}
          <nav className="breadcrumb" style={{ padding: "0 0 20px" }}>
            <a href={`/${lang}`}>
              <Home size={14} style={{ display: "inline", marginRight: "4px" }} />
              {t.home}
            </a>
            <span> / </span>
            <a href={`/${lang}/destinations`}>{t.viewAll}</a>
            <span> / </span>
            <span className="current">{countryName}</span>
          </nav>

          <div className="mb-5 d-flex flex-column align-items-start gap-3">
            {/* <button
              onClick={() => router.push(`/${lang}/destinations`)}
              className="btn px-4 py-2"
              style={{
                background: "#FFFFFF",
                color: "#1C0052",
                border: "1px solid rgba(28, 0, 82, 0.2)",
                borderRadius: "10px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#1C0052";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(28, 0, 82, 0.2)";
              }}
            >
              {lang === "ar" ? "← العودة للوجهات" : "← Back to Destinations"}
            </button> */}
            <h1 className="fw-bold m-0" style={{ fontSize: "2rem", color: "#1C0052" }}>
              {lang === "ar" ? `الرحلات السياحية في ${countryName}` : `Tourism Trips in ${countryName}`}
            </h1>
          </div>
          <div className="d-flex flex-column gap-4">
            {countryTours.map((tour) => {
              const tourTitle = getText(tour, "title");
              const tourDesc = getText(tour, "description");
              const tourDuration = getText(tour, "duration");
              const getImageUrl = (img) => {
                if (!img) return "/placeholder.png";
                if (/^https?:\/\//.test(img)) return img;
                const backendBase = API_URL.replace(/\/api\/?$/, "");
                if (img.startsWith("/")) return `${backendBase}${img}`;
                if (img.startsWith("tourism/")) {
                  return `${backendBase}/storage/${img}`;
                }
                return `${backendBase}/storage/tourism/${img}`;
              };

              return (
                <div
                  key={tour.id}
                  className="card border-0 shadow-sm p-4 transition-all hover-shadow"
                  style={{
                    transition: "all 0.2s",
                    background: "#FFFFFF",
                    borderRadius: "10px",
                    border: "1px solid rgba(28, 0, 82, 0.06)"
                  }}
                >
                  <div className="row g-4 align-items-center">
                    <div className="col-12 col-md-4">
                      <img
                        src={getImageUrl(tour.image_url || tour.image)}
                        alt={tourTitle}
                        className="w-100 object-fit-cover shadow-sm"
                        style={{ height: "180px", objectFit: "cover", borderRadius: "10px" }}
                      />
                    </div>
                    <div className="col-12 col-md-5">
                      <h3 className="fw-bold mb-3" style={{ fontSize: "1.3rem", color: "#1C0052" }}>
                        {tourTitle}
                      </h3>
                      <p className="text-muted mb-3" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                        {tourDesc}
                      </p>
                      <div className="d-flex flex-wrap gap-4 align-items-center text-secondary" style={{ fontSize: "0.85rem" }}>
                        <span className="d-flex align-items-center gap-2">
                          <Clock size={16} style={{ color: "#E85D1F" }} /> {tourDuration}
                        </span>
                        {tour.rating && (
                          <span className="d-flex align-items-center gap-2">
                            <Star size={16} style={{ fill: "#FFC60B", color: "#FFC60B" }} /> {tour.rating}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-3 text-md-end d-flex flex-row flex-md-column justify-content-between align-items-center justify-content-md-center gap-3">
                      <div>
                        <div className="text-secondary small">{lang === "ar" ? "تبدأ من" : "From"}</div>
                        <div className="fw-bold" style={{ fontSize: "1.5rem", color: "#E85D1F" }}>
                          {tour.price} SAR
                        </div>
                      </div>
                      <button
                        onClick={() => router.push(`/${lang}/destinations/${tour.slug}`)}
                        className="btn px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm"
                        style={{
                          background: "#E85D1F",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 15px rgba(232, 93, 31, 0.25)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#1C0052";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 8px 25px rgba(28, 0, 82, 0.45)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#E85D1F";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 15px rgba(232, 93, 31, 0.25)";
                        }}
                      >
                        {lang === "ar" ? "عرض التفاصيل" : "View Trip Details"} <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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

  const staticPaymentMethods = [
    {
      name_en: "Alinma Bank",
      name_ar: "بنك الإنماء",
      account_no: "68205990876000",
      iban: "SA3705000068205990876000",
    },
    {
      name_en: "Al Rajhi Bank",
      name_ar: "مصرف الراجحي",
      account_no: "SA6780000189608010004821",
      iban: "SA6780000189608010004821",
    },
  ];

  const displayPaymentMethods = staticPaymentMethods.map((method) => ({
    ...method,
    name: isRTL ? method.name_ar : method.name_en,
  }));

  const doubleRoomRate = destination?.price ?? null;
  const singleRoomRate = destination?.single_room_price ?? doubleRoomRate;
  const tripCode = basicInfo.trip_code ?? destination?.trip_code ?? t.na;
  const daysNum = basicInfo.days_num ?? basicInfo.days ?? getText(destination, "duration") ?? t.na;
  const destinationName =
    (isRTL ? basicInfo.destination_name_ar : basicInfo.destination_name_en) ||
    basicInfo.destination_name ||
    getText(destination, "title") ||
    t.na;
  const formatDate = (dateStr) => {
    if (!dateStr) return t.na;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };
  const rawAvailableTo = basicInfo.available_to ?? destination?.available_to;
  const availableTo = rawAvailableTo ? formatDate(rawAvailableTo) : t.na;

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
          <a href={`/${lang}/destinations`}>{t.viewAll}</a>
          {destination && getText(destination, "location") && (
            <>
              <span> / </span>
              <a href={`/${lang}/destinations/${slugify(getText(destination, "location"))}`}>
                {getText(destination, "location")}
              </a>
            </>
          )}
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
                    <Laptop size={16} color="#E85D1F" />
                    <span className="label">{t.tripCode} :</span>
                    <span className="value">
                      {tripCode}
                    </span>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <Clock size={16} color="#E85D1F" />
                    <span className="label">{t.daysNum} :</span>
                    <span className="value">{daysNum}</span>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <Globe size={16} color="#E85D1F" />
                    <span className="label">{t.destinationName} :</span>
                    <span className="value">{destinationName}</span>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <Calendar size={16} color="#E85D1F" />
                    <span className="label">{t.availableTo} :</span>
                    <span className="value">{availableTo}</span>
                  </li>
                  <li className="divider"></li>
                  {destination?.person_prices && Array.isArray(destination.person_prices) && destination.person_prices.length > 0 ? (
                    <>
                      <li>
                        <Users size={16} color="#E85D1F" />
                        <span className="label">
                          {lang === "ar" ? "العروض المتاحة :" : "Available Offers :"}
                        </span>
                      </li>
                      <li style={{ marginTop: "6px", marginBottom: "12px" }}>
                        <select
                          value={selectedPersons}
                          onChange={(e) => {
                            if (e.target.value === "custom") {
                              setShowTravelReservationModal(true);
                            } else {
                              setSelectedPersons(Number(e.target.value));
                            }
                          }}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            border: "2px solid #E85D1F",
                            backgroundColor: "#fff",
                            color: "#1C0052",
                            fontWeight: "600",
                            fontSize: "0.95rem",
                            cursor: "pointer",
                            outline: "none",
                            boxShadow: "0 2px 8px rgba(232, 93, 31, 0.15)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {destination.person_prices.map((offer, idx) => (
                            <option key={idx} value={offer.persons}>
                              {lang === "ar"
                                ? `عرض ${offer.persons} ${Number(offer.persons) === 1 ? "فرد" : "أفراد"} - (${offer.price} ر.س)`
                                : `${offer.persons} ${Number(offer.persons) > 1 ? "Persons" : "Person"} Offer - (${offer.price} SAR)`}
                            </option>
                          ))}
                          <option value="custom" style={{ fontWeight: "700", color: "#E85D1F" }}>
                            {lang === "ar" ? " طلب عرض خاص (عدد أفراد مخصص)" : " Request Custom Offer (Custom Persons)"}
                          </option>
                        </select>


                      </li>
                      <li>
                        <span className="label">
                          {lang === "ar" ? "سعر العرض المحدد :" : "Selected Offer Price :"}
                        </span>
                        <span className="value highlight" style={{ fontSize: "1.15rem", fontWeight: "700" }}>
                          {(() => {
                            const matched = destination.person_prices.find(p => Number(p.persons) === selectedPersons);
                            return matched ? matched.price : destination.price;
                          })()}
                          <Image
                            src="/saudi_riyal.png"
                            alt="SAR"
                            width={14}
                            height={14}
                            className="currency-icon"
                          />
                        </span>
                      </li>
                      <li className="divider"></li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Users size={16} color="#E85D1F" />
                        <span className="label">{lang === "ar" ? "السعر :" : "Price :"}</span>
                        <span className="value highlight">
                          {destination?.price ?? t.na}
                          <Image
                            src="/saudi_riyal.png"
                            alt="SAR"
                            width={14}
                            height={14}
                            className="currency-icon"
                          />
                          {` ${t.perPerson}`}
                        </span>
                      </li>
                      <li className="divider"></li>
                    </>
                  )}
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
                    <MapPin size={16} color="#E85D1F" />
                    <a href="https://maps.app.goo.gl/WakCAhdZsZERp1M97" target="_blank" rel="noopener noreferrer">
                      <span>
                        {localizedContactInfo.address || "Al Rabwa District, Jeddah"}
                      </span>
                    </a>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <Phone size={16} color="#E85D1F" />
                    <a href={`tel:${localizedContactInfo.phone || "0114562097"}`}>
                      {localizedContactInfo.phone || "+966547305060"}
                    </a>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <MessageSquare size={16} color="#25D366" />
                    <a
                      href={`https://wa.me/${(
                        localizedContactInfo.whatsapp || "+966547305060"
                      ).replace(/\s/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {localizedContactInfo.whatsapp || "+966547305060"}
                    </a>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <Mail size={16} color="#E85D1F" />
                    <a
                      href={`mailto:${localizedContactInfo.email || "info@tilalr.com"
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
                        <span className="bank-label">{isRTL ? "الاسم" : "Name"} :</span>
                        <span className="bank-number">{method.name || method.name_en || method.name_ar || ""}</span>
                      </div>
                      <div className="bank-row">
                        <span className="bank-label">{isRTL ? "رقم الحساب" : "Account No."} :</span>
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
                        <span className="bank-label">{isRTL ? "رقم الآيبان" : "IBAN"} :</span>
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
        initialGuests={selectedPersons}
        onOpenCustomModal={() => setShowTravelReservationModal(true)}
      />

      {/* Travel Reservation Modal (Custom Offer Request) */}
      <TravelReservationModal
        isOpen={showTravelReservationModal}
        onClose={() => setShowTravelReservationModal(false)}
        packageData={destination}
        lang={lang}
      />

      <style jsx>{`
        .details-section {
          padding: 150px 0 120px; /* Clears floating navbar and footer wave */
          background: #FAF6F0; /* Soft Desert Sand theme variant */
          min-height: 100vh;
        }

        .breadcrumb {
          padding: 10px 0 20px;
          font-size: 0.95rem;
          color: #666;
            max-width: 1200px;
          margin: 0 auto;
        }

        .breadcrumb a {
          color: #1C0052; /* Deep Heritage Purple */
          text-decoration: none;
          font-weight: 500;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
        }

        .breadcrumb .current {
          color: #666;
        }

        .content-wrapper {
          display: flex;
          gap: 40px;
          align-items: flex-start;
          max-width: 1200px;
          margin: 0 auto;
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
          color: #1C0052; /* Deep Heritage Purple */
          margin-bottom: 20px;
        }

        .description-section {
          background: #fff;
          padding: 25px;
          border-radius: 10px; /* 10px rounded corners */
          margin-bottom: 20px;
          border: 1px solid rgba(28, 0, 82, 0.06);
          box-shadow: 0 4px 15px rgba(28, 0, 82, 0.04);
        }

        .description-section h2 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1C0052;
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
          border-radius: 10px;
        }

        .includes-section,
        .not-includes-section {
          background: #fff;
          padding: 25px;
          border-radius: 10px;
          margin-bottom: 20px;
          border: 1px solid rgba(28, 0, 82, 0.06);
          box-shadow: 0 4px 15px rgba(28, 0, 82, 0.04);
        }

        .includes-section h2,
        .not-includes-section h2 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1C0052;
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
          border-radius: 10px;
          margin-bottom: 20px;
          border: 1px solid rgba(28, 0, 82, 0.06);
          box-shadow: 0 4px 15px rgba(28, 0, 82, 0.04);
        }

        .notes-section h2 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1C0052;
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
          border-radius: 10px;
          margin-bottom: 20px;
          border: 1px solid rgba(28, 0, 82, 0.06);
          box-shadow: 0 4px 15px rgba(28, 0, 82, 0.04);
        }

        .itinerary-section h2 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1C0052;
          margin-bottom: 20px;
        }

        .day-card {
          padding: 18px;
          margin-bottom: 15px;
          background: #f8f9fa;
          border-radius: 10px;
          border-left: 4px solid #E85D1F; /* Sunset Orange accent */
        }

        .day-card h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1C0052;
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
          border-radius: 10px;
        }

        .btn-book-now {
          background: #E85D1F;
          color: #fff;
          border: none;
          padding: 14px 45px;
          border-radius: 10px; /* 10px border radius */
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(232, 93, 31, 0.25);
          margin-top: 15px;
          margin-bottom: 35px;
        }

        .btn-book-now:hover {
          background: #1C0052;
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(28, 0, 82, 0.45);
        }

        .sidebar-panel {
          background: #fff;
          border-radius: 10px;
          margin-bottom: 20px;
          border: 1px solid rgba(28, 0, 82, 0.06);
          box-shadow: 0 4px 15px rgba(28, 0, 82, 0.04);
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 20px;
          background: #E85D1F; /* Deep Heritage Purple header */
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
          color: #E85D1F; /* Sunset Orange */
        }

        .divider {
          height: 1px !important;
          background: #f0f0f0;
          margin: 2px 0;
          padding: 0 !important;
          width: 100%;
        }

        .complete-reservation-btn {
          width: 100%;
          padding: 12px;
          margin-top: 15px;
          background: #E85D1F;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(232, 93, 31, 0.2);
        }

        .complete-reservation-btn:hover {
          background: #1C0052;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(28, 0, 82, 0.45);
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
          color: #E85D1F;
        }

        .payment-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1C0052;
          margin: 10px 0 15px;
        }

        .bank-item {
          margin-bottom: 15px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 10px;
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
          color: #E85D1F;
          cursor: pointer;
          padding: 2px 5px;
          transition: color 0.3s ease;
        }

        .copy-btn:hover {
          color: #FFC60B;
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