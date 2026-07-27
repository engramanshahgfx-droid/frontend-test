"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, MapPin, Clock } from "lucide-react";
import { API_URL } from "@/lib/api";
import Image from "next/image";

export default function TourismOffersPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params?.lang || "en";
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const labels = {
    en: {
      title: "Saudi Offers",
      subtitle: "Discover amazing deals and unforgettable experiences",
      viewDetails: "More",
      from: "From",
      perPerson: "per person",
      noOffers: "No offers available",
      backToHome: "Back to Home",
      loading: "Loading offers...",
      popular: "Popular",
      off: "OFF",
    },
    ar: {
      title: "عروض السعوديه",
      subtitle: "اكتشف الصفقات المذهلة والتجارب التي لا تنسى",
      viewDetails: " المزيد",
      from: "من",
      perPerson: "للفرد",
      noOffers: "لا توجد عروض متاحة",
      backToHome: "العودة للرئيسية",
      loading: "جارٍ تحميل العروض...",
      popular: "الأكثر شهرة",
      off: "خصم",
    }
  };

  const t = labels[lang] || labels.en;

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${API_URL}/tourism-offers`);
      const data = await response.json();
      if (data.success) {
        setOffers(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      setError("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

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
    return `${backendBase}/storage/${img}`;
  };

  const handleViewDetails = (offer) => {
    router.push(`/${lang}/tousimoffers/${offer.id}`);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < fullStars ? "#FFC60B" : "none"}
        color={i < fullStars ? "#FFC60B" : "#ddd"}
        style={{ display: "inline" }}
      />
    ));
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "150px 0", textAlign: "center" }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "20px", color: "#666" }}>{t.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: "150px 0", textAlign: "center" }}>
        <p style={{ color: "#ff6b6b" }}>{error}</p>
        <button
          onClick={() => router.push(`/${lang}`)}
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
          {t.backToHome}
        </button>
      </div>
    );
  }

  return (
    <div className="offers-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        <div className="page-header">
          <h1 style={{ padding: "50px 0 0 0" }}>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {offers.length === 0 ? (
          <div className="text-center" style={{ padding: "60px 0" }}>
            <p>{t.noOffers}</p>
            <button
              onClick={() => router.push(`/${lang}`)}
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
              {t.backToHome}
            </button>
          </div>
        ) : (
          <div className="offers-grid">
            {offers.map((offer) => (
              <motion.div
                key={offer.id}
                className="offer-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                onClick={() => handleViewDetails(offer)}
              >
                <div className="offer-image">
                  <img
                    src={getImageUrl(offer.image)}
                    alt={getText(offer, "title")}
                    onError={(e) => { e.target.src = "/placeholder.png"; }}
                  />
                  {offer.discount && (
                    <span className="discount-badge">{offer.discount}% {t.off}</span>
                  )}
                  {offer.popular && (
                    <span className="popular-badge">{t.popular}</span>
                  )}
                </div>
                <div className="offer-content">
                  {getText(offer, "location") && (
                    <div className="offer-location">
                      <MapPin size={12} style={{ display: "inline", verticalAlign: "middle" }} />
                      <span>{getText(offer, "location")}</span>
                    </div>
                  )}

                  <h3 className="offer-title">{getText(offer, "title")}</h3>

                  <div className="rating-row">
                    <div className="rating">
                      {renderStars(offer.rating)}
                      <span className="rating-value">{offer.rating || 0}</span>
                    </div>
                    {getText(offer, "duration") && (
                      <span className="duration-tag">
                        <Clock size={12} style={{ display: "inline", verticalAlign: "middle" }} />
                        <span>{getText(offer, "duration")}</span>
                      </span>
                    )}
                  </div>

                  <p className="offer-desc">{getText(offer, "description")}</p>

                  <div className="offer-footer">
                    <div className="price">
                      <span className="price-label">{t.from}</span>
                      <div className="price-amount">
                        <span>{offer.price}</span>
                        <Image
                          src="/saudi_riyal.png"
                          alt="ريال"
                          width={14}
                          height={14}
                          className="currency-icon"
                        />
                      </div>
                      <span className="price-per">{t.perPerson}</span>
                    </div>
                    <button className="btn-book" onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(offer);
                    }}>
                      {t.viewDetails}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .offers-page {
          padding: 150px 0 60px; /* Clear floating navbar */
          background: #FAF6F0; /* Soft Desert Sand theme variant */
          min-height: 100vh;
        }

        .page-header{
          text-align: center;
          margin-bottom: 40px;
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1C0052; /* Deep Heritage Purple */
          margin-bottom: 10px;
          padding: 0px !important;
        }

        .page-header h1:after {
          content: '';
          display: block;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #E85D1F 0%, #FFC60B 100%); /* Brand Sunset gradient */
          margin: 15px auto 0;
        }

        .page-header p {
          color: #666;
          font-size: 1.1rem;
          margin-top: 15px;
        }

        .offers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
        }

        .offer-card {
          background: #FFFFFF;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(28, 0, 82, 0.05);
          box-shadow: 0 10px 30px rgba(28, 0, 82, 0.03);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .offer-card:hover {
          transform: translateY(-8px);
          border-color: rgba(232, 93, 31, 0.2);
          box-shadow: 0 20px 40px rgba(28, 0, 82, 0.08);
        }

        .offer-image {
          position: relative;
          height: 220px;
          overflow: hidden;
          padding: 0px !important;
        }

        .offer-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
          border-radius: 10px;
        }

        .offer-card:hover .offer-image img {
          transform: scale(1.08);
        }

        .discount-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #E85D1F;
          color: white;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .popular-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: #1C0052;
          color: white;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .offer-content {
          padding: 10px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .offer-location {
          color: #E85D1F;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .offer-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1C0052;
          margin: 0 0 12px;
          line-height: 1.4;
          transition: color 0.3s ease;
        }

        .offer-card:hover .offer-title {
          color: #E85D1F;
        }

        .rating-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .rating-value {
          color: #666;
          font-size: 0.85rem;
          font-weight: 600;
          margin-left: 4px;
        }

        .duration-tag {
          color: #555;
          font-size: 0.8rem;
          font-weight: 600;
          background: rgba(28, 0, 82, 0.04);
          padding: 3px 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .offer-desc {
          color: #555;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0 0 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 65px;
          flex-grow: 1;
        }

        .offer-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 18px;
          border-top: 1px solid rgba(28, 0, 82, 0.06);
          margin-top: auto;
        }

        .price {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .price-label {
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .price-amount {
          font-size: 1.4rem;
          font-weight: 800;
          color: #E85D1F;
          display: flex;
          align-items: center;
          gap: 4px;
          line-height: 1;
        }

        .price-per {
          font-size: 0.7rem;
          color: #888;
        }

        .btn-book {
          background: linear-gradient(135deg, #E85D1F 0%, #FFC60B 100%);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(232, 93, 31, 0.2);
        }

        .btn-book:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(232, 93, 31, 0.35);
        }

        @media (max-width: 768px) {
          .offers-grid {
            grid-template-columns: 1fr 1fr;
          }
          .page-header h1 {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .offers-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}