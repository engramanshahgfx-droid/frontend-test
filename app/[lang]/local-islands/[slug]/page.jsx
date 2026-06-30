"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { API_URL } from "../../../lib/api";

export default function DestinationDetails() {
  const params = useParams();
  const router = useRouter();
  const lang = params?.lang || "en";
  const slug = params?.slug;
  
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      perPerson: "SAR per person",
      bookNow: "Book Now",
      viewAll: "View All Destinations",
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
      perPerson: "ريال سعودي للفرد",
      bookNow: "احجز الآن",
      viewAll: "عرض جميع الوجهات",
    }
  };

  const t = labels[lang] || labels.en;

  const getText = (obj, field) => {
    if (!obj) return "";
    if (field === "title" && obj.title_en) {
      return lang === "ar" ? obj.title_ar || obj.title_en : obj.title_en;
    }
    if (field === "description" && obj.description_en) {
      return lang === "ar" ? obj.description_ar || obj.description_en : obj.description_en;
    }
    const fieldKey = lang === "ar" ? `${field}_ar` : `${field}_en`;
    return obj[fieldKey] || obj[`${field}_en`] || obj[field] || "";
  };

  const getImageUrl = (img) => {
    if (!img) return "/placeholder.png";
    if (/^https?:\/\//.test(img)) return img;
    const backendBase = API_URL.replace(/\/api\/?$/, "");
    if (img.startsWith("/")) return `${backendBase}${img}`;
    return `${backendBase}/storage/tourism/${img}`;
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiEndpoint = `${API_URL.replace(/\/$/, '')}/tourism-destinations/${slug}`;
        console.log('[DestinationDetails] Fetching from:', apiEndpoint);
        
        const res = await fetch(apiEndpoint, { 
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        const json = await res.json();
        console.log('[DestinationDetails] Response:', json);
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status} - ${json?.message || 'Unknown error'}`);
        }
        
        if (!json?.success) {
          throw new Error(json?.message || 'Failed to fetch destination');
        }
        
        setDestination(json.data);
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('[DestinationDetails] Fetch error:', err.message);
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
    // Implement booking logic
    alert('Booking functionality coming soon!');
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
              <p style={{ marginTop: "20px", color: "#666" }}>Loading destination details...</p>
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
              <p style={{ color: "#ff6b6b" }}>{error || 'Destination not found'}</p>
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

  const features = getText(destination, 'features') || [];
  const includes = getText(destination, 'includes') || [];
  const notIncludes = getText(destination, 'not_includes') || [];
  const itinerary = getText(destination, 'itinerary') || [];
  const basicInfo = destination.basic_info || {};
  const contactInfo = destination.contact_info || {};
  const paymentMethods = destination.payment_methods || [];

  return (
    <div className="details-section" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <a href={`/${lang}`}>Home</a>
          <span> / </span>
          <a href={`/${lang}/tourism-destinations`}>{t.viewAll}</a>
          <span> / </span>
          <span className="current">{getText(destination, 'title')}</span>
        </nav>

        {/* Title */}
        <h1 className="page-title">{getText(destination, 'title')}</h1>

        {/* Description */}
        <div className="description-section">
          <h2>{t.description}</h2>
          <p>{getText(destination, 'long_description') || getText(destination, 'description')}</p>
          {destination.image && (
            <img 
              src={getImageUrl(destination.image)} 
              alt={getText(destination, 'title')}
              className="main-image"
            />
          )}
        </div>

        {/* Package Includes & Not Includes */}
        <div className="row package-info">
          <div className="col-md-6">
            <div className="info-card">
              <h3>{t.packageIncludes}</h3>
              <ul>
                {features.map((item, index) => (
                  <li key={index}>✓ {item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="info-card">
              <h3>{t.packageNotIncludes}</h3>
              <ul>
                {notIncludes.map((item, index) => (
                  <li key={index}>✗ {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        {destination.description_en && (
          <div className="notes-section">
            <h2>{t.importantNotes}</h2>
            <p>{getText(destination, 'description')}</p>
          </div>
        )}

        {/* Package Program */}
        {itinerary.length > 0 && (
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
                <h4>Day {day.day} : {day.title}</h4>
                <p>{day.description}</p>
                {day.image && (
                  <img 
                    src={getImageUrl(day.image)} 
                    alt={`Day ${day.day}`}
                    className="day-image"
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Basic Information */}
        {Object.keys(basicInfo).length > 0 && (
          <div className="info-section">
            <h2>{t.basicInfo}</h2>
            <div className="info-grid">
              {basicInfo.trip_code && (
                <div className="info-item">
                  <strong>{t.tripCode}:</strong> {basicInfo.trip_code}
                </div>
              )}
              {basicInfo.days_num && (
                <div className="info-item">
                  <strong>{t.daysNum}:</strong> {basicInfo.days_num}
                </div>
              )}
              {basicInfo.destination_name && (
                <div className="info-item">
                  <strong>{t.destinationName}:</strong> {basicInfo.destination_name}
                </div>
              )}
              {basicInfo.available_to && (
                <div className="info-item">
                  <strong>{t.availableTo}:</strong> {basicInfo.available_to}
                </div>
              )}
              {basicInfo.double_room && (
                <div className="info-item">
                  <strong>{t.doubleRoom}:</strong> {basicInfo.double_room} {t.perPerson}
                </div>
              )}
              {basicInfo.single_room && (
                <div className="info-item">
                  <strong>{t.singleRoom}:</strong> {basicInfo.single_room} {t.perPerson}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {Object.keys(contactInfo).length > 0 && (
          <div className="contact-section">
            <h2>{t.contactInfo}</h2>
            <div className="contact-grid">
              {contactInfo.address && (
                <div className="contact-item">
                  <span className="icon">📍</span>
                  <span>{contactInfo.address}</span>
                </div>
              )}
              {contactInfo.phone && (
                <div className="contact-item">
                  <span className="icon">📞</span>
                  <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                </div>
              )}
              {contactInfo.whatsapp && (
                <div className="contact-item">
                  <span className="icon">💬</span>
                  <a href={`https://wa.me/${contactInfo.whatsapp.replace(/\s/g, '')}`}>
                    {contactInfo.whatsapp}
                  </a>
                </div>
              )}
              {contactInfo.email && (
                <div className="contact-item">
                  <span className="icon">✉️</span>
                  <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {paymentMethods.length > 0 && (
          <div className="payment-section">
            <h2>{t.paymentMethods}</h2>
            <div className="payment-grid">
              {paymentMethods.map((method, index) => (
                <div key={index} className="payment-card">
                  {method.logo && (
                    <img 
                      src={`/images/banks-logos/${method.logo}`} 
                      alt={method.name}
                      className="bank-logo"
                    />
                  )}
                  <h5>{method.name}</h5>
                  <p><strong>Account No:</strong> {method.account_no}</p>
                  <p><strong>IBAN:</strong> {method.iban}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Now Button */}
        <div className="text-center">
          <button className="btn-book-now" onClick={handleBookNow}>
            {t.bookNow}
          </button>
          <button className="btn-view-all" onClick={handleViewAll}>
            {t.viewAll}
          </button>
        </div>
      </div>

      <style jsx>{`
        .details-section {
          padding: 40px 0 60px;
          background: #f8f9fa;
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

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c2c2c;
          margin-bottom: 30px;
        }

        .description-section {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
        }

        .description-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 15px;
        }

        .description-section p {
          font-size: 1rem;
          line-height: 1.8;
          color: #555;
          margin-bottom: 20px;
        }

        .main-image {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          border-radius: 8px;
        }

        .info-card {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
        }

        .info-card h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 15px;
        }

        .info-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-card ul li {
          padding: 8px 0;
          color: #555;
          font-size: 0.95rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .info-card ul li:last-child {
          border-bottom: none;
        }

        .notes-section {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
        }

        .notes-section h2 {
          font-size: 1.5rem;
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
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
        }

        .itinerary-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 20px;
        }

        .day-card {
          padding: 20px;
          margin-bottom: 20px;
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

        .day-image {
          width: 100%;
          max-height: 250px;
          object-fit: cover;
          border-radius: 8px;
        }

        .info-section {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
        }

        .info-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .info-item {
          padding: 12px 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .info-item strong {
          color: #2c2c2c;
        }

        .contact-section {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
        }

        .contact-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 20px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .contact-item .icon {
          font-size: 1.2rem;
        }

        .contact-item a {
          color: #dfa528;
          text-decoration: none;
        }

        .contact-item a:hover {
          text-decoration: underline;
        }

        .payment-section {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
        }

        .payment-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 20px;
        }

        .payment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .payment-card {
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          text-align: center;
        }

        .payment-card .bank-logo {
          max-height: 50px;
          margin-bottom: 10px;
        }

        .payment-card h5 {
          font-size: 1rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 10px;
        }

        .payment-card p {
          font-size: 0.9rem;
          color: #555;
          margin: 5px 0;
          word-break: break-all;
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
          margin: 10px;
          box-shadow: 0 4px 20px rgba(223, 165, 40, 0.3);
        }

        .btn-book-now:hover {
          background: #c98c1e;
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(223, 165, 40, 0.4);
        }

        .btn-view-all {
          background: transparent;
          color: #dfa528;
          border: 2px solid #dfa528;
          padding: 12px 35px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 10px;
        }

        .btn-view-all:hover {
          background: #dfa528;
          color: #fff;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(223, 165, 40, 0.3);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }

          .info-grid,
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .payment-grid {
            grid-template-columns: 1fr;
          }

          .btn-book-now,
          .btn-view-all {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}