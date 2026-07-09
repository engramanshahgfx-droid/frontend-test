"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";
import BookingModal from "@/components/BookingModal";
import Image from "next/image";

export default function TourismOfferDetails() {
  const params = useParams();
  const router = useRouter();
  const lang = params?.lang || "en";
  const id = params?.id;
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const labels = {
    en: {
      back: " ← Back to Offers",
      description: "Description",
      details: "Details",
      price: "Price",
      duration: "Duration",
      location: "Location",
      groupSize: "Group Size",
      includes: "Package Includes",
      notIncludes: "Package Not Includes",
      itinerary: "Itinerary",
      bookNow: "Book Now",
      perPerson: "per person",
      from: "From",
      contact: "Contact Information",
      paymentMethods: "Payment Methods",
      features: "Features",
      loading: "Loading offer details...",
      offerNotFound: "Offer not found",
      failedToLoad: "Failed to load offer",
      home: "Home",
      tourismOffers: "Tourism Offers",
      day: "Day",
      tripCode: "Trip Code",
      days: "Days",
      destination: "Destination",
      availableTo: "Available To",
      doubleRoom: "Double Room",
      singleRoom: "Single Room",
      account: "Account",
      iban: "IBAN",
    },
    ar: {
      back: " ← العودة للعروض",
      description: "الوصف",
      details: "التفاصيل",
      price: "السعر",
      duration: "المدة",
      location: "الموقع",
      groupSize: "حجم المجموعة",
      includes: "تشمل الباقة",
      notIncludes: "لا تشمل الباقة",
      itinerary: "البرنامج",
      bookNow: "احجز الآن",
      perPerson: "للفرد",
      from: "من",
      contact: "معلومات الاتصال",
      paymentMethods: "طرق الدفع",
      features: "المميزات",
      loading: "جارٍ تحميل تفاصيل العرض...",
      offerNotFound: "العرض غير موجود",
      failedToLoad: "فشل تحميل العرض",
      home: "الرئيسية",
      tourismOffers: "العروض السياحية",
      day: "اليوم",
      tripCode: "رمز الرحلة",
      days: "الأيام",
      destination: "الوجهة",
      availableTo: "متاح حتى",
      doubleRoom: "غرفة مزدوجة",
      singleRoom: "غرفة مفردة",
      account: "الحساب",
      iban: "رقم الآيبان",
    },
  };

  const t = labels[lang] || labels.en;

  useEffect(() => {
    if (id) {
      fetchOffer();
    }
  }, [id]);

  const fetchOffer = async () => {
    try {
      const response = await fetch(`${API_URL}/tourism-offers/${id}`);
      const data = await response.json();
      if (data.success) {
        setOffer(data.data);
      } else {
        setError("Offer not found");
      }
    } catch (error) {
      console.error("Error fetching offer:", error);
      setError("Failed to load offer");
    } finally {
      setLoading(false);
    }
  };

  // Improved getLocalizedText function that handles more cases
  const getLocalizedText = (value, fallback = "") => {
    if (!value) return fallback;
    if (typeof value === "string") return value;
    if (typeof value !== "object") return fallback;

    // If it's an array, try to get the first item or join
    if (Array.isArray(value)) {
      return value.length > 0 ? value[0] : fallback;
    }

    // Check for Arabic version first if lang is Arabic
    if (lang === "ar") {
      // Try various Arabic field names
      const arValue = 
        value.ar ||
        value.arabic ||
        value.title_ar ||
        value.name_ar ||
        value.feature_ar ||
        value.include_ar ||
        value.not_include_ar ||
        value.description_ar ||
        value.text_ar ||
        value.label_ar ||
        value.address_ar ||
        value.value_ar ||
        value.title ||
        value.name ||
        value.feature ||
        value.include ||
        value.not_include ||
        value.description ||
        value.text ||
        value.label ||
        value.address ||
        value.value;
      
      // If we found an Arabic value, return it
      if (arValue && typeof arValue === "string") return arValue;
      if (arValue && typeof arValue === "object") return JSON.stringify(arValue);
      
      // Fallback to English if no Arabic found
      const enValue = 
        value.en ||
        value.english ||
        value.title_en ||
        value.name_en ||
        value.feature_en ||
        value.include_en ||
        value.not_include_en ||
        value.description_en ||
        value.text_en ||
        value.label_en ||
        value.address_en ||
        value.value_en;
      
      return enValue || fallback;
    } else {
      // English version
      const enValue = 
        value.en ||
        value.english ||
        value.title_en ||
        value.name_en ||
        value.feature_en ||
        value.include_en ||
        value.not_include_en ||
        value.description_en ||
        value.text_en ||
        value.label_en ||
        value.address_en ||
        value.value_en ||
        value.title ||
        value.name ||
        value.feature ||
        value.include ||
        value.not_include ||
        value.description ||
        value.text ||
        value.label ||
        value.address ||
        value.value;
      
      if (enValue && typeof enValue === "string") return enValue;
      if (enValue && typeof enValue === "object") return JSON.stringify(enValue);
      
      // Fallback to Arabic if no English found
      const arValue = 
        value.ar ||
        value.arabic ||
        value.title_ar ||
        value.name_ar ||
        value.feature_ar ||
        value.include_ar ||
        value.not_include_ar ||
        value.description_ar ||
        value.text_ar ||
        value.label_ar ||
        value.address_ar ||
        value.value_ar;
      
      return arValue || fallback;
    }
  };

  const getText = (obj, field) => {
    if (!obj) return "";
    
    // Handle specific fields with priority
    if (field === "title") {
      if (lang === "ar") {
        return obj.title_ar || obj.title_en || obj.title || "";
      }
      return obj.title_en || obj.title_ar || obj.title || "";
    }
    
    if (field === "description") {
      if (lang === "ar") {
        return obj.description_ar || obj.description_en || obj.description || "";
      }
      return obj.description_en || obj.description_ar || obj.description || "";
    }
    
    if (field === "long_description") {
      if (lang === "ar") {
        return obj.long_description_ar || obj.long_description_en || obj.long_description || "";
      }
      return obj.long_description_en || obj.long_description_ar || obj.long_description || "";
    }
    
    if (field === "duration") {
      if (lang === "ar") {
        return obj.duration_ar || obj.duration_en || obj.duration || "";
      }
      return obj.duration_en || obj.duration_ar || obj.duration || "";
    }
    
    if (field === "location") {
      if (lang === "ar") {
        return obj.location_ar || obj.location_en || obj.location || "";
      }
      return obj.location_en || obj.location_ar || obj.location || "";
    }
    
    if (field === "group_size") {
      if (lang === "ar") {
        return obj.group_size_ar || obj.group_size_en || obj.group_size || "";
      }
      return obj.group_size_en || obj.group_size_ar || obj.group_size || "";
    }
    
    // Generic field handling
    const fieldKey = lang === "ar" ? `${field}_ar` : `${field}_en`;
    return obj[fieldKey] || obj[`${field}_en`] || obj[`${field}_ar`] || obj[field] || "";
  };

  // Helper to safely parse JSON fields
  const safeParseArray = (data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    if (data && typeof data === "object") {
      if (Object.values(data).every((v) => typeof v === "object")) {
        return Object.values(data);
      }
      return [];
    }
    return [];
  };

  const getFeatures = (field) => {
    if (!offer) return [];
    const data = lang === "ar" ? offer[`${field}_ar`] : offer[`${field}_en`];
    return safeParseArray(data);
  };

  const getItinerary = () => {
    if (!offer) return [];
    const data = lang === "ar" ? offer.itinerary_ar : offer.itinerary_en;
    return safeParseArray(data);
  };

  const getPaymentMethods = () => {
    if (!offer) return [];
    const data = offer.payment_methods;
    return safeParseArray(data);
  };

  const getContactInfo = () => {
    if (!offer) return {};
    const data = offer.contact_info;
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        return {};
      }
    }
    return data || {};
  };

  const getBasicInfo = () => {
    if (!offer) return {};
    const data = offer.basic_info;
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        return {};
      }
    }
    return data || {};
  };

  const getImageUrl = (img) => {
    if (!img) return "/placeholder.png";
    if (/^https?:\/\//.test(img)) return img;
    const backendBase = API_URL.replace(/\/api\/?$/, "");
    if (img.startsWith("/")) return `${backendBase}${img}`;
    return `${backendBase}/storage/${img}`;
  };

  const handleBookNow = () => {
    console.log("Opening booking modal for offer:", offer);
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div
        className="container"
        style={{ padding: "100px 0", textAlign: "center" }}
      >
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "20px", color: "#666" }}>
          {t.loading}
        </p>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div
        className="container"
        style={{ padding: "100px 0", textAlign: "center" }}
      >
        <p style={{ color: "#ff6b6b" }}>{error || t.offerNotFound}</p>
        <button
          onClick={() => router.push(`/${lang}/tousimoffers`)}
          className="btn-back"
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
          {t.back}
        </button>
      </div>
    );
  }

  const features = getFeatures("features");
  const includes = getFeatures("includes");
  const notIncludes = getFeatures("not_includes");
  const itinerary = getItinerary();
  const contactInfo = getContactInfo();
  const paymentMethods = getPaymentMethods();
  const basicInfo = getBasicInfo();

  return (
    <>
      <div className="offer-details" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <a href={`/${lang}`}>{t.home}</a>
            <span> / </span>
            <a href={`/${lang}/tousimoffers`}>{t.tourismOffers}</a>
            <span> / </span>
            <span className="current">{getText(offer, "title")}</span>
          </nav>

          {/* Back Button */}
          <button
            className="btn-back"
            onClick={() => router.push(`/${lang}/tousimoffers`)}
          >
            {t.back}
          </button>

          {/* Header */}
          <div className="offer-header">
            <h1>{getText(offer, "title")}</h1>
            {offer.rating && (
              <div className="rating">
                <span>⭐</span>
                <span>{offer.rating}</span>
              </div>
            )}
          </div>

          {/* Main Image */}
          <div className="main-image">
            <img
              src={getImageUrl(offer.image)}
              alt={getText(offer, "title")}
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
            />
            {offer.discount && (
              <span className="discount-badge">{offer.discount}% OFF</span>
            )}
          </div>

          {/* Gallery */}
          {offer.gallery &&
            Array.isArray(offer.gallery) &&
            offer.gallery.length > 0 && (
              <div className="gallery">
                {offer.gallery.map((img, index) => (
                  <img
                    key={index}
                    src={getImageUrl(img)}
                    alt={`Gallery ${index + 1}`}
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                ))}
              </div>
            )}

          {/* Description */}
          <div className="section">
            <h2>{t.description}</h2>
            <p>
              {getText(offer, "long_description") ||
                getText(offer, "description")}
            </p>
          </div>

          {/* Quick Info */}
          <div className="quick-info">
            <div className="info-item">
              <span className="label">{t.price}</span>
              <span className="value">
                {offer.original_price && (
                  <span className="original-price">
                    {offer.original_price}{" "}
                    <Image 
                      src="/saudi_riyal.png" 
                      alt="SAR" 
                      width={14} 
                      height={14} 
                      className="currency-icon"
                    />
                  </span>
                )}
                <span className="current-price">
                  {offer.price}{" "}
                  <Image 
                    src="/saudi_riyal.png" 
                    alt="SAR" 
                    width={16} 
                    height={16} 
                    className="currency-icon"
                  />
                </span>
                <span className="per">{t.perPerson}</span>
              </span>
            </div>
            {getText(offer, "duration") && (
              <div className="info-item">
                <span className="label">{t.duration}</span>
                <span className="value">{getText(offer, "duration")}</span>
              </div>
            )}
            {getText(offer, "location") && (
              <div className="info-item">
                <span className="label">{t.location}</span>
                <span className="value">{getText(offer, "location")}</span>
              </div>
            )}
            {getText(offer, "group_size") && (
              <div className="info-item">
                <span className="label">{t.groupSize}</span>
                <span className="value">{getText(offer, "group_size")}</span>
              </div>
            )}
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div className="section">
              <h2>{t.features}</h2>
              <ul className="features-list">
                {features.map((item, index) => (
                  <li key={index}>
                    {getLocalizedText(item, typeof item === "string" ? item : "")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Includes */}
          {includes.length > 0 && (
            <div className="section">
              <h2>{t.includes}</h2>
              <ul className="includes-list">
                {includes.map((item, index) => (
                  <li key={index}>
                    ✓{" "}
                    {getLocalizedText(item, typeof item === "string" ? item : "")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Not Includes */}
          {notIncludes.length > 0 && (
            <div className="section">
              <h2>{t.notIncludes}</h2>
              <ul className="not-includes-list">
                {notIncludes.map((item, index) => (
                  <li key={index}>
                    ✗{" "}
                    {getLocalizedText(item, typeof item === "string" ? item : "")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Itinerary */}
          {itinerary.length > 0 && (
            <div className="section">
              <h2>{t.itinerary}</h2>
              <div className="itinerary">
                {itinerary.map((day, index) => (
                  <motion.div
                    key={index}
                    className="day-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h4>
                      {t.day} {day.day}: {getLocalizedText(day.title, day.title) || getLocalizedText(day, "title") || day.title || "Title"}
                    </h4>
                    <p>{getLocalizedText(day.description, day.description) || getLocalizedText(day, "description") || day.description || "Description"}</p>
                    {day.image && (
                      <img
                        src={getImageUrl(day.image)}
                        alt={`Day ${day.day}`}
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Info */}
          {Object.keys(basicInfo).length > 0 && (
            <div className="section">
              <h2>{t.details}</h2>
              <div className="contact-grid">
                {basicInfo.trip_code && (
                  <div>🆔 {t.tripCode}: {basicInfo.trip_code}</div>
                )}
                {basicInfo.days_num && <div>📅 {t.days}: {basicInfo.days_num}</div>}
                {basicInfo.destination_name && (
                  <div>📍 {t.destination}: {getLocalizedText(basicInfo, "destination_name") || basicInfo.destination_name}</div>
                )}
                {basicInfo.available_to && (
                  <div>📆 {t.availableTo}: {basicInfo.available_to}</div>
                )}
                {basicInfo.double_room && (
                  <div>
                    🛏️ {t.doubleRoom}: {basicInfo.double_room}{" "}
                    <Image 
                      src="/saudi_riyal.png" 
                      alt="SAR" 
                      width={12} 
                      height={12} 
                      className="currency-icon"
                    />
                  </div>
                )}
                {basicInfo.single_room && (
                  <div>
                    🛏️ {t.singleRoom}: {basicInfo.single_room}{" "}
                    <Image 
                      src="/saudi_riyal.png" 
                      alt="SAR" 
                      width={12} 
                      height={12} 
                      className="currency-icon"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Info */}
          {Object.keys(contactInfo).length > 0 && (
            <div className="section">
              <h2>{t.contact}</h2>
              <div className="contact-grid">
                {contactInfo.address && <div>📍 {getLocalizedText(contactInfo, "address") || contactInfo.address}</div>}
                {contactInfo.phone && (
                  <div>
                    📞{" "}
                    <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                  </div>
                )}
                {contactInfo.whatsapp && (
                  <div>
                    💬{" "}
                    <a
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/\s/g, "")}`}
                    >
                      {contactInfo.whatsapp}
                    </a>
                  </div>
                )}
                {contactInfo.email && (
                  <div>
                    ✉️{" "}
                    <a href={`mailto:${contactInfo.email}`}>
                      {contactInfo.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Methods */}
          {paymentMethods.length > 0 && (
            <div className="section">
              <h2>{t.paymentMethods}</h2>
              <div className="payment-grid">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="payment-card">
                    {method.logo && (
                      <img
                        src={method.logo}
                        alt={method.name}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <h5>{getLocalizedText(method, "name") || method.name}</h5>
                    {method.account_no && <p>{t.account}: {method.account_no}</p>}
                    {method.iban && <p>{t.iban}: {method.iban}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Book Now */}
          <div className="book-now-section">
            <button className="btn-book-now" onClick={handleBookNow}>
              {t.bookNow}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal - Pass offer data */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => {
          console.log("Closing modal");
          setShowBookingModal(false);
        }}
        packageData={offer}
        lang={lang}
        bookingType="tourism_offer"
      />

      <style jsx>{`
        .offer-details {
          padding: 80px 0 60px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .breadcrumb {
          padding: 40px 0 20px;
          font-size: 0.95rem;
          color: #666;
        }

        .breadcrumb a {
          color: #dfa528;
          text-decoration: none;
        }

        .breadcrumb .current {
          color: #333;
        }

        .btn-back {
          background: transparent;
          border: none;
          color: #dfa528;
          font-size: 1rem;
          cursor: pointer;
          margin-bottom: 20px;
          padding: 8px 0;
        }

        .btn-back:hover {
          text-decoration: underline;
        }

        .offer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .offer-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c2c2c;
          margin: 0;
        }

        .rating {
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .main-image {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 30px;
        }

        .main-image img {
          width: 100%;
          max-height: 500px;
          object-fit: cover;
        }

        .discount-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #ff6b6b;
          color: white;
          padding: 8px 20px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 1rem;
        }

        .gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .gallery img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
        }

        .section {
          background: white;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
        }

        .section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 15px;
        }

        .section p {
          font-size: 1rem;
          line-height: 1.8;
          color: #555;
        }

        .quick-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          background: white;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
        }

        .info-item {
          text-align: center;
        }

        .info-item .label {
          display: block;
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 5px;
        }

        .info-item .value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c2c2c;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .currency-icon {
          display: inline-block;
          vertical-align: middle;
        }

        .original-price {
          text-decoration: line-through;
          color: #999;
          font-size: 0.9rem;
          margin-right: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .current-price {
          color: #dfa528;
          font-size: 1.3rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .per {
          font-size: 0.8rem;
          color: #888;
          font-weight: 400;
        }

        .features-list,
        .includes-list,
        .not-includes-list {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 10px;
        }

        .features-list li,
        .includes-list li,
        .not-includes-list li {
          padding: 8px 12px;
          background: #f8f9fa;
          border-radius: 6px;
          color: #555;
        }

        .itinerary {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .day-card {
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #dfa528;
        }

        .day-card h4 {
          font-size: 1.1rem;
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

        .day-card img {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          border-radius: 8px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }

        .contact-grid a {
          color: #dfa528;
          text-decoration: none;
        }

        .contact-grid a:hover {
          text-decoration: underline;
        }

        .payment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .payment-card {
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          text-align: center;
        }

        .payment-card img {
          max-height: 40px;
          margin-bottom: 10px;
        }

        .payment-card h5 {
          font-size: 1rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 8px;
        }

        .payment-card p {
          font-size: 0.85rem;
          color: #555;
          margin: 3px 0;
        }

        .book-now-section {
          text-align: center;
          margin-top: 20px;
        }

        .btn-book-now {
          background: #dfa528;
          color: white;
          border: none;
          padding: 14px 50px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(223, 165, 40, 0.3);
        }

        .btn-book-now:hover {
          background: #c98c1e;
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(223, 165, 40, 0.4);
        }

        @media (max-width: 768px) {
          .offer-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .offer-header h1 {
            font-size: 2rem;
          }

          .quick-info {
            grid-template-columns: 1fr;
          }

          .gallery {
            grid-template-columns: repeat(2, 1fr);
          }

          .features-list,
          .includes-list,
          .not-includes-list {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .gallery {
            grid-template-columns: 1fr;
          }

          .section {
            padding: 20px;
          }

          .btn-book-now {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}