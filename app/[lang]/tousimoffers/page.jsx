"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Eye, Heart } from "lucide-react";
import { API_URL } from "@/lib/api";
import Image from "next/image";
import BookingModal from "@/components/BookingModal";
import HeaderBanners from "@/components/HeaderBanners";

export default function TourismOffersPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params?.lang || "en";
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const labels = {
    en: {
      title: "Saudi Offers",
      subtitle: "Discover amazing deals and unforgettable experiences",
      viewDetails: "View Details",
      bookNow: "Book Now",
      from: "From",
      perPerson: "per person",
      noOffers: "No offers available",
      backToHome: "Back to Home",
      loading: "Loading offers...",
      popular: "Popular",
      limited: "Limited Offer",
      off: "OFF",
    },
    ar: {
      title: "عروض السعوديه",
      subtitle: "اكتشف الصفقات المذهلة والتجارب التي لا تنسى",
      viewDetails: "عرض التفاصيل",
      bookNow: "احجز الآن",
      from: "من",
      perPerson: "للفرد",
      noOffers: "لا توجد عروض متاحة",
      backToHome: "العودة للرئيسية",
      loading: "جارٍ تحميل العروض...",
      popular: "الأكثر شهرة",
      limited: "عرض محدود",
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

  const handleBookNow = (offer) => {
    setSelectedOffer(offer);
    setShowBookingModal(true);
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
          <HeaderBanners lang={lang} page="offers" index={1} />
          <div className="page-header" style={{ marginTop: "20px" }}>
            <h1 style={{ padding: "0" }}>
              {lang === "ar" ? (
                <><span className="highlight-orange">اكتشف</span> <span className="highlight-green">السعودية</span></>
              ) : (
                <><span className="highlight-orange">Discover</span> <span className="highlight-green">Saudi Arabia</span></>
              )}
            </h1>
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
              {offers.map((offer, index) => (
                <motion.div
                  key={offer.id || index}
                  className="offer-card"
                  style={{ backgroundColor: "#ffffff", borderRadius: "10px" }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => handleViewDetails(offer)}
                >
                  <div className="offer-image">
                    <img
                      src={getImageUrl(offer.image)}
                      alt={getText(offer, "title")}
                      onError={(e) => { e.target.src = "/placeholder.png"; }}
                    />
                    <div className="badges-container">
                      {offer.discount && (
                        <span className="discount-badge">{offer.discount}% {t.off}</span>
                      )}
                      {offer.popular && <span className="popular-badge">{t.popular}</span>}
                      {offer.limited && <span className="limited-badge">{t.limited || "Limited"}</span>}
                    </div>
                    <div className="offer-overlay">
                      <button className="btn-quick-view" onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(offer);
                      }}>
                        <Eye size={20} />
                      </button>
                      <button className="btn-favorite" onClick={(e) => {
                        e.stopPropagation();
                      }}>
                        <Heart size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="offer-content">
                    <div className="offer-header">
                      <h3>{getText(offer, "title")}</h3>
                      <div className="rating">
                        {renderStars(offer.rating)}
                        <span className="rating-value">{offer.rating || 0}</span>
                      </div>
                    </div>

                    <p className="offer-description">
                      {getText(offer, "description")}
                    </p>

                    <div className="offer-meta">
                      {getText(offer, "location") && (
                        <span><MapPin size={14} /> {getText(offer, "location")}</span>
                      )}
                      {getText(offer, "duration") && (
                        <span><Clock size={14} /> {getText(offer, "duration")}</span>
                      )}
                    </div>

                    <div className="offer-footer">
                      <div className="offer-price">
                        {offer.original_price && (
                          <span className="price-original">
                            {offer.original_price}
                            <Image
                              src="/saudi_riyal.png"
                              alt="SAR"
                              width={12}
                              height={12}
                              className="currency-icon-small"
                            />
                          </span>
                        )}
                        <div className="price-amount-wrapper">
                          <span className="price-amount">{offer.price}</span>
                          <Image
                            src="/saudi_riyal.png"
                            alt="SAR"
                            width={16}
                            height={16}
                            className="currency-icon"
                          />
                        </div>
                        <span className="price-per">{t.perPerson}</span>
                      </div>
                      <button
                        className="btn-book"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookNow(offer);
                        }}
                      >
                        {t.bookNow}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedOffer(null);
          }}
          packageData={selectedOffer}
          lang={lang}
          bookingType="tourism_offer"
        />

        <style jsx>{`
        .offers-page {
          padding: 150px 0 150px; /* Clear floating navbar */
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
        
        .highlight-green {
          color: #006C35; /* Premium Saudi Flag Green */
        }

        .highlight-orange {
          color: #E85D1F; /* Desert Sunset Orange */
        }

        .page-header h1:after {
          content: '';
          display: block;
          width: 60px;
          height: 3px;
          background: #E85D1F;
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
          border-radius: 5px !important;
          border-color: red;
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
          padding: 10px !important;
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

        .badges-container {
          position: absolute;
          top: 15px;
          inset-inline-end: 15px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 2;
        }

        .discount-badge {
          background: #ee5a24;
          color: #fff;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          animation: pulse 2s infinite;
          text-align: center;
          width: fit-content;
          align-self: flex-start;
        }
          
        .popular-badge {
          width: fit-content;
          background: #E85D1F; /* Brand sunset orange to yellow */
          color: #fff;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-align: center;
          align-self: flex-start;
        }
            
        .limited-badge {
          background: #1C0052;
          color: #fff;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-align: center;
          align-self: flex-start;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .offer-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(28, 0, 82, 0.4);
          opacity: 0;
          transition: opacity 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          backdrop-filter: blur(4px);
        }

        .offer-card:hover .offer-overlay {
          opacity: 1;
        }

        .btn-quick-view,
        .btn-favorite {
          background: #fff;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1C0052;
          transition: all 0.3s ease;
          cursor: pointer;
          transform: translateY(20px) scale(0.8);
          opacity: 0;
        }

        .offer-card:hover .btn-quick-view,
        .offer-card:hover .btn-favorite {
          transform: translateY(0) scale(1);
          opacity: 1;
        }

        .btn-quick-view:hover {
          background: #E85D1F; /* Sunset Orange */
          color: #fff;
          transform: scale(1.1);
        }

        .btn-favorite:hover {
          background: #ff6b6b;
          color: #fff;
          transform: scale(1.1);
        }

        .offer-content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .offer-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
          gap: 10px;
        }
        .offer-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #E85D1F; /* Desert Sunset Orange */
          margin: 0;
          flex: 1;
        }
        .rating {
          display: flex;
          align-items: center;
          gap: 2px;
          flex-shrink: 0;
        }

        .rating-value {
          color: #666;
          font-size: 0.85rem;
          margin-left: 4px;
          font-weight: 500;
        }

        .offer-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 10px 0 15px;
          flex: 1;
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
          color: #1C0052;
        }

        .offer-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 15px;
          border-top: 1px solid #eee;
          margin-top: auto;
          gap: 10px;
        }

        .offer-price {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .price-original {
          font-size: 0.8rem;
          color: #999;
          text-decoration: line-through;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .price-amount-wrapper {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .price-amount {
          font-size: 1.3rem;
          font-weight: 700;
          color: #E85D1F; /* Desert Sunset Orange */
        }

        .currency-icon {
          display: inline-block;
          vertical-align: middle;
        }

        .currency-icon-small {
          display: inline-block;
          vertical-align: middle;
        }

        .btn-book {
          background: #1C0052;
          color: #fff;
          border: none;
          padding: 10px 24px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(0, 45, 104, 0.25);
        }

        .btn-book:hover {
          box-shadow: 0 8px 25px rgba(31, 118, 232, 0.45);
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
          .offer-image {
            height: 180px;
          }
          .offer-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .btn-book {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
      </div>
    );
}