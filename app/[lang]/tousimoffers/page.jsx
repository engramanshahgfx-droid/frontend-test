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
      title: "Tourism Offers",
      subtitle: "Discover amazing deals and unforgettable experiences",
      viewDetails: "View Details",
      from: "From",
      perPerson: "per person",
      noOffers: "No offers available",
      backToHome: "Back to Home",
    },
    ar: {
      title: "عروض السياحة",
      subtitle: "اكتشف الصفقات المذهلة والتجارب التي لا تنسى",
      viewDetails: "عرض التفاصيل",
      from: "من",
      perPerson: "للفرد",
      noOffers: "لا توجد عروض متاحة",
      backToHome: "العودة للرئيسية",
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
        fill={i < fullStars ? "#dfa528" : "none"}
        color={i < fullStars ? "#dfa528" : "#ddd"}
        style={{ display: "inline" }}
      />
    ));
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "20px", color: "#666" }}>Loading offers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
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
      <div className="container">
        <div className="page-header">
          <h1>{t.title}</h1>
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
                    <span className="discount-badge">{offer.discount}% OFF</span>
                  )}
                  {offer.popular && (
                    <span className="popular-badge">Popular</span>
                  )}
                </div>
                <div className="offer-content">
                  <div className="offer-header">
                    <h3>{getText(offer, "title")}</h3>
                    <div className="rating">
                      {renderStars(offer.rating)}
                      <span className="rating-value">{offer.rating || 0}</span>
                    </div>
                  </div>
                  <p>{getText(offer, "description")}</p>
                  <div className="offer-meta">
                    {offer.location && (
                      <span><MapPin size={14} /> {offer.location}</span>
                    )}
                    {offer.duration && (
                      <span><Clock size={14} /> {offer.duration}</span>
                    )}
                  </div>
                  <div className="offer-footer">
                    <div className="price">
                      <span className="price-label">{t.from}</span>
                      <span className="price-amount">
                        {offer.price}
                        <Image 
                          src="/saudi_riyal.png" 
                          alt="SAR" 
                          width={14} 
                          height={14} 
                          className="currency-icon"
                        />
                      </span>
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
          padding: 100px 0 60px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .page-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c2c2c;
          margin-bottom: 10px;
        }

        .page-header h1:after {
          content: '';
          display: block;
          width: 60px;
          height: 3px;
          background: #dfa528;
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
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 25px rgba(0,0,0,0.08);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .offer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.12);
        }

        .offer-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .offer-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .discount-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ff6b6b;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .popular-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #dfa528;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .offer-content {
          padding: 20px;
        }

        .offer-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .offer-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c2c2c;
          margin: 0;
          flex: 1;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .rating-value {
          color: #666;
          font-size: 0.8rem;
          margin-left: 4px;
        }

        .offer-content p {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 15px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .offer-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .offer-meta span {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          color: #888;
        }

        .offer-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }

        .price {
          display: flex;
          align-items: baseline;
          gap: 5px;
        }

        .price-label {
          font-size: 0.8rem;
          color: #888;
        }

        .price-amount {
          font-size: 1.2rem;
          font-weight: 700;
          color: #dfa528;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .currency-icon {
          display: inline-block;
          vertical-align: middle;
        }

        .price-per {
          font-size: 0.7rem;
          color: #888;
        }

        .btn-book {
          background: #dfa528;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .btn-book:hover {
          background: #c98c1e;
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