"use client";

import React from "react";
import Link from 'next/link';
import { FaStar, FaClock, FaMapMarkerAlt, FaWhatsapp, FaUsers } from "react-icons/fa";

export default function OffersPage({ lang }) {
  const content = {
    en: {
      heroTitle: "Exclusive Offers Not to Be Missed",
      heroSubtitle: "Take advantage of the best tourism opportunities we offer, and enjoy unique experiences at attractive prices!",
      featuredOffers: "Featured Offers",
      contactUs: "Contact Us",
      days: "Days",
      nights: "Nights",
      persons: "Persons",
      included: "What's Included",
      mostPopular: "Most Popular",
      viewDetails: "View Details",
      loading: "Loading offers...",
      noOffers: "No offers available at the moment.",
    },
    ar: {
      heroTitle: "عروض حصرية لا تُفوَّت",
      heroSubtitle: "استفيدوا من أفضل الفرص السياحية التي نقدمها، وستمتعوا بتجارب مميزة بأسعار مغرية!",
      featuredOffers: "العروض المميزة",
      contactUs: "تواصل معنا",
      days: "أيام",
      nights: "ليالي",
      persons: "أشخاص",
      included: "ما المضمن",
      mostPopular: "الأكثر شيوعاً",
      viewDetails: "عرض التفاصيل",
      loading: "جاري تحميل العروض...",
      noOffers: "لا توجد عروض متاحة حالياً.",
    }
  };

  const [offers, setOffers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState(null);
  const t = content[lang] || content.ar;
  const isRTL = lang === "ar";
  
  // API base URL
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

  // Return a short preview (first paragraph or up to max chars)
  const getSummary = (text, maxChars = 220) => {
    if (!text) return "";
    const normalized = String(text).replace(/\r\n/g, "\n").trim();
    const parts = normalized.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    const first = parts.length > 0 ? parts[0] : normalized;
    const oneLine = first.replace(/\s+/g, " ").trim();
    return oneLine.length > maxChars ? oneLine.slice(0, maxChars).trim() + "..." : oneLine;
  };

  const fetchOffers = React.useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    
    const normalizeArray = (v) => {
      if (Array.isArray(v)) return v;
      if (!v) return [];
      if (typeof v === 'string') {
        try {
          const parsed = JSON.parse(v);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          // ignore
        }
        return v.split('|').map((s) => s.trim()).filter(Boolean);
      }
      return [];
    };

    try {
      const apiUrl = `${apiBase}/offers`;
      console.log('[OffersPage] Fetching from API:', apiUrl);
      
      const res = await fetch(apiUrl);
      console.log('[OffersPage] Response status:', res.status);
      const data = await res.json();
      console.log('[OffersPage] API Response data:', data);
      
      if (res.ok) {
        let items = [];
        if (Array.isArray(data)) items = data;
        else if (data && Array.isArray(data.data)) items = data.data;
        else if (data && Array.isArray(data.offers)) items = data.offers;

        if (items.length > 0) {
          const parsed = items.map((o) => ({
            id: o.id,
            title: isRTL ? o.title_ar || o.title_en : o.title_en || o.title_ar,
            description: isRTL ? o.description_ar || o.description_en : o.description_en || o.description_ar,
            image: o.image || '/offers/corporate-trips.jpg',
            duration: isRTL ? (o.duration_ar || o.duration_en || o.duration) : (o.duration_en || o.duration_ar || o.duration),
            location: isRTL ? o.location_ar || o.location_en : o.location_en || o.location_ar,
            groupSize: isRTL ? (o.group_size_ar || o.group_size_en || o.group_size) : (o.group_size_en || o.group_size_ar || o.group_size),
            badge: isRTL ? (o.badge_ar || o.badge_en || o.badge) : (o.badge_en || o.badge_ar || o.badge),
            features: normalizeArray(isRTL ? (o.features_ar || o.features_en || o.features) : (o.features_en || o.features_ar || o.features)),
            highlights: normalizeArray(isRTL ? (o.highlights_ar || o.highlights_en || o.highlights) : (o.highlights_en || o.highlights_ar || o.highlights)),
          }));

          setOffers(parsed);
          setLoading(false);
          return;
        }
      }
      
      // No data from API
      setOffers([]);
      setLoading(false);
    } catch (err) {
      console.error('API fetch failed:', err.message);
      setFetchError(err.message);
      setOffers([]);
      setLoading(false);
    }
  }, [lang, isRTL, apiBase]);

  React.useEffect(() => {
    fetchOffers();
  }, [lang, fetchOffers]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`offers-page ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section with Video Background */}
      <section className="offers-hero">
        <div className="video-background">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="background-video"
          >
            <source src="/desert.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>
        </div>
        
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-8 mx-auto text-center text-white">
              <div className="hero-content">
                <h1 className="display-4 fw-bold mb-4">{t.heroTitle}</h1>
                <p className="lead mb-5">{t.heroSubtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Grid Section */}
      <section className="offers-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title mb-3">{t.featuredOffers}</h2>
            <div className="section-divider"></div>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Loading state */}
            {loading && (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">{t.loading}</p>
              </div>
            )}

            {/* Error state */}
            {!loading && fetchError && (
              <div className="alert alert-danger text-center mb-3">{fetchError}</div>
            )}

            {/* Empty state */}
            {!loading && !fetchError && offers.length === 0 && (
              <div className="alert alert-info text-center mb-3">
                {t.noOffers}
              </div>
            )}

            {/* Offers list */}
            {!loading && offers.length > 0 && offers.map((offer) => (
              <div key={offer.id} className="col-lg-6">
                <div className="offer-card">
                  <div className="offer-image">
                    <img 
                      src={offer.image} 
                      alt={offer.title}
                      className="img-fluid"
                      width="820"
                      height="1120"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = '/offers/jeddah-sea.png';
                      }}
                    />
                  </div>

                  <div className="offer-content">
                    <h3 className="offer-title">{offer.title}</h3>
                    <p className="offer-description">{getSummary(offer.description)}</p>

                    <div className="offer-highlights">
                      {offer.highlights.map((highlight, index) => (
                        <span key={index} className="highlight-tag">
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Offer Details */}
                    <div className="offer-details">
                      <div className="detail-item">
                        <FaClock className="detail-icon" />
                        <span>{offer.duration}</span>
                      </div>
                      <div className="detail-item">
                        <FaMapMarkerAlt className="detail-icon" />
                        <span>{offer.location}</span>
                      </div>
                      <div className="detail-item">
                        <FaUsers className="detail-icon" />
                        <span>{offer.groupSize}</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="features-list">
                      <h6>{t.included}:</h6>
                      <div className="features-grid">
                        {offer.features.map((feature, index) => (
                          <div key={index} className="feature-item">
                            <FaStar className="feature-icon" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="offer-footer">
                      <div className="cta-buttons">
                        <a
                          href={`https://wa.me/+966547305060?text=${encodeURIComponent(
                            isRTL 
                              ? `أرغب في الحصول على معلومات عن: ${offer.title}`
                              : `I'm interested in: ${offer.title}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-book"
                        >
                          <FaWhatsapp className={isRTL ? "ms-2" : "me-2"} />
                          {t.contactUs}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .offers-page {
          background: #f8f9fa;
          font-family: 'Tajawal', sans-serif;
        }

        .offers-hero {
          position: relative;
          padding: 140px 0 100px;
          min-height: 70vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .background-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg, 
            rgba(138, 119, 121, 0.4) 0%, 
            rgba(239, 200, 174, 0.85) 100%
          );
          z-index: 2;
        }

        .offers-hero .container {
          position: relative;
          z-index: 3;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-content h1 {
          font-weight: 800;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          line-height: 1.3;
          font-family: 'Tajawal', sans-serif;
        }

        .hero-content .lead {
          font-size: 1.3rem;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
          line-height: 1.6;
          font-family: 'Tajawal', sans-serif;
        }

        .offer-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          height: 100%;
          border: 1px solid #e9ecef;
          font-family: 'Tajawal', sans-serif;
        }

        .offer-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .offer-image {
          width: 100%;
          aspect-ratio: 820 / 1120;
          overflow: hidden;
          position: relative;
        }

        .offer-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.3s ease;
        }

        .rtl .offer-title,
        .rtl .offer-description {
          text-align: right;
          direction: rtl;
        }

        .ltr .offer-title,
        .ltr .offer-description {
          text-align: left;
          direction: ltr;
        }

        .offer-description {
          white-space: pre-wrap;
        }

        .offer-content {
          padding: 30px;
          font-family: 'Tajawal', sans-serif;
        }

        .offer-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #2c3e50;
          margin-bottom: 15px;
          line-height: 1.3;
          font-family: 'Tajawal', sans-serif;
        }

        .offer-description {
          color: #5d6d7e;
          margin-bottom: 20px;
          line-height: 1.7;
          font-size: 1.05rem;
          font-family: 'Tajawal', sans-serif;
        }

        .offer-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .highlight-tag {
          background: linear-gradient(45deg, #8a7779, #a89294);
          color: white;
          padding: 6px 15px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          font-family: 'Tajawal', sans-serif;
        }

        .offer-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 25px;
          padding: 20px 0;
          border-top: 2px solid #ecf0f1;
          border-bottom: 2px solid #ecf0f1;
          flex-wrap: wrap;
          gap: 15px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #7f8c8d;
          font-size: 0.95rem;
          font-weight: 500;
          font-family: 'Tajawal', sans-serif;
        }

        .detail-icon {
          color: #8a7779;
          font-size: 1.1rem;
        }

        .features-list h6 {
          color: #2c3e50;
          margin-bottom: 15px;
          font-weight: 700;
          font-size: 1.1rem;
          font-family: 'Tajawal', sans-serif;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 25px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: #5d6d7e;
          font-weight: 500;
          font-family: 'Tajawal', sans-serif;
        }

        .feature-icon {
          color: #f39c12;
          font-size: 0.8rem;
          flex-shrink: 0;
        }

        .offer-footer {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 25px;
          border-top: 2px solid #ecf0f1;
        }

        .cta-buttons {
          display: flex;
          gap: 12px;
        }

        .btn-book {
          background: linear-gradient(45deg, #25d366, #128c7e);
          border: none;
          padding: 12px 25px;
          border-radius: 25px;
          font-weight: 700;
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
          font-family: 'Tajawal', sans-serif;
        }

        .btn-book:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.5);
          color: white;
        }

        .section-title {
          color: #5a4606ff;
          font-weight: 800;
          font-size: 2.5rem;
          position: relative;
          margin-bottom: 1rem;
          font-family: 'Tajawal', sans-serif;
        }

        .section-divider {
          width: 100px;
          height: 5px;
          background: linear-gradient(45deg, #8a7779, #efc8ae);
          margin: 0 auto;
          border-radius: 3px;
        }

        @media (max-width: 768px) {
          .offers-hero {
            padding: 120px 0 80px;
            min-height: 60vh;
          }

          .hero-content h1 {
            font-size: 2.2rem;
          }

          .hero-content .lead {
            font-size: 1.1rem;
          }

          .offer-footer {
            flex-direction: column;
            text-align: center;
          }

          .cta-buttons {
            width: 100%;
            justify-content: center;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .offer-details {
            flex-direction: column;
            align-items: center;
          }

          .section-title {
            font-size: 2rem;
          }
        }

        @media (max-width: 576px) {
          .offer-content {
            padding: 20px;
          }

          .offer-title {
            font-size: 1.4rem;
          }

          .btn-book {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
