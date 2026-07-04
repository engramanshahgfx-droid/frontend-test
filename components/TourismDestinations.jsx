"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { API_URL } from "../lib/api";

export default function TourismDestinations({ lang, region }) {
  const router = useRouter();
  const currentLang = lang || "en";
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const labels = {
    en: {
      title: "Best Tourism Destinations",
      viewAll: "View All Destinations",
      viewDetails: "View Details",
      from: "From",
      perPerson: "per person",
      showAll: "View All",
    },
    ar: {
      title: "أفضل الوجهات السياحية",
      viewAll: "عرض جميع الوجهات",
      viewDetails: "عرض التفاصيل",
      from: "من",
      perPerson: "للفرد",
      showAll: "عرض الكل",
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
    if (field === "location" && obj.location_en) {
      return lang === "ar" ? obj.location_ar || obj.location_en : obj.location_en;
    }
    if (field === "duration" && obj.duration_en) {
      return lang === "ar" ? obj.duration_ar || obj.duration_en : obj.duration_en;
    }

    const fieldKey = lang === "ar" ? `${field}_ar` : `${field}_en`;
    return obj[fieldKey] || obj[`${field}_en`] || obj[field] || "";
  };

  const getImageUrl = (destination) => {
    if (destination?.image_url) {
      return destination.image_url;
    }
    
    const img = destination?.image;
    if (!img) return "/placeholder.png";
    
    if (/^https?:\/\//.test(img)) return img;
    
    const backendBase = API_URL.replace(/\/api\/?$/, "");
    
    if (img.startsWith("/")) {
      return `${backendBase}${img}`;
    }
    
    return `${backendBase}/storage/tourism/${img}`;
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let apiEndpoint = `${API_URL.replace(/\/$/, '')}/tourism-destinations`;
        if (region) {
          apiEndpoint += `/region/${region}`;
        }
        
        const res = await fetch(apiEndpoint, { 
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        const json = await res.json();
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status} - ${json?.message || 'Unknown error'}`);
        }
        
        if (!json?.success) {
          throw new Error(json?.message || 'Failed to fetch destinations');
        }
        
        const data = Array.isArray(json.data) ? json.data : [];
        
        if (data.length > 0) {
          setDestinations(data);
        }
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('[TourismDestinations] Fetch error:', err.message);
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [region]);

  const handleViewAllDestinations = () => {
    router.push(`/${currentLang}/tourism-destinations`);
  };

  const handleDestinationClick = (destination) => {
    const slug = destination.slug || destination.id || '';
    router.push(`/${currentLang}/destinations/${slug}`);
  };

  if (loading) {
    return (
      <section className="tourism-section">
        <div className="container">
          <div className="row">
            <div className="title text-center">
              <h2>{t.title}</h2>
            </div>
          </div>
          <div className="row text-center" style={{ padding: "60px 0" }}>
            <div className="col-12">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ marginTop: "20px", color: "#666" }}>Loading destinations...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="tourism-section">
        <div className="container">
          <div className="row">
            <div className="title text-center">
              <h2>{t.title}</h2>
            </div>
          </div>
          <div className="row text-center" style={{ padding: "60px 0" }}>
            <div className="col-12">
              <p style={{ color: "#ff6b6b" }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
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
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const displayDestinations = destinations.length > 0 ? destinations : [];
  
  // ✅ SHOW ONLY 4 DESTINATIONS ON HOME PAGE (when no region is selected)
  // When region is selected (on region page), show all
  const visibleDestinations = region ? displayDestinations : displayDestinations.slice(0, 4);

  // Helper function to format price with icon
  const formatPriceWithIcon = (price) => {
    return (
      <span className="price-wrapper">
        <span className="price-amount">{price}</span>
        <Image 
          src="/saudi_riyal.png" 
          alt="SAR" 
          width={14} 
          height={14} 
          className="currency-icon"
        />
        <span className="price-per">{t.perPerson}</span>
      </span>
    );
  };

  return (
    <section className="tourism-section">
      <div className="container">
        <div className="row">
          <div className="title text-center">
            <h2>{region ? getRegionTitle(region, lang) : t.title}</h2>
          </div>
        </div>

        <div className="row">
          {visibleDestinations.map((destination, index) => (
            <motion.div
              key={destination.id || index}
              className="col-md-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
            >
              <div 
                className="destination-card"
                onClick={() => handleDestinationClick(destination)}
              >
                <div className="destination-image">
                  <img
                    src={getImageUrl(destination)}
                    alt={getText(destination, 'title')}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.png';
                    }}
                  />
                  <div className="destination-overlay">
                    <button className="btn-view">
                      {t.viewDetails}
                    </button>
                  </div>
                  {destination.rating && (
                    <div className="destination-rating">
                      <span> {destination.rating}</span>
                    </div>
                  )}
                </div>
                <div className="destination-content">
                  <h3>{getText(destination, 'title')}</h3>
                  <p className="destination-location">
                    📍 {getText(destination, 'location')}
                  </p>
                  <p className="destination-description">
                    {getText(destination, 'description')?.substring(0, 80)}...
                  </p>
                  <div className="destination-footer">
                    <span className="destination-price">
                      {destination.price ? (
                        <>
                          {t.from} 
                          <span className="price-amount">{destination.price}</span>
                          <Image 
                            src="/saudi_riyal.png" 
                            alt="SAR" 
                            width={14} 
                            height={14} 
                            className="currency-icon"
                          />
                          <span className="price-per">{t.perPerson}</span>
                        </>
                      ) : ''}
                    </span>
                    <span className="destination-duration">
                      {getText(destination, 'duration')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ✅ Show "View All" button ONLY on home page (when no region) AND if there are more than 4 destinations */}
        {!region && displayDestinations.length > 4 && (
          <div className="row text-center">
            <div className="col-12 d-flex justify-content-center">
              <motion.button
                className="btn-view-all"
                onClick={handleViewAllDestinations}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#dfa528',
                  color: '#fff',
                  padding: '12px 35px',
                  borderRadius: '30px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  border: 'none',
                  marginTop: '20px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(223, 165, 40, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#c98c1e';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(223, 165, 40, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#dfa528';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(223, 165, 40, 0.3)';
                }}
              >
                <span>{t.viewAll}</span>
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .tourism-section {
          padding: 60px 0;
          background: #f8f9fa;
          direction: ${lang === 'ar' ? 'rtl' : 'ltr'};
        }

        .title h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c2c2c;
          margin-bottom: 40px;
          position: relative;
          text-align: center;
        }

        .title h2:after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: #dfa528;
        }

        .destination-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          margin-bottom: 30px;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .destination-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.12);
        }

        .destination-image {
          position: relative;
          overflow: hidden;
          height: 220px;
          flex-shrink: 0;
        }

        .destination-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .destination-card:hover .destination-image img {
          transform: scale(1.05);
        }

        .destination-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .destination-card:hover .destination-overlay {
          opacity: 1;
        }

        .btn-view {
          background: #dfa528;
          color: #fff;
          border: none;
          padding: 10px 25px;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-view:hover {
          background: #c98c1e;
          transform: scale(1.05);
        }

        .destination-rating {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0, 0, 0, 0.7);
          color: #ffd700;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .destination-content {
          padding: 18px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .destination-content h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c2c2c;
          margin: 0 0 5px;
          line-height: 1.3;
        }

        .destination-location {
          color: #888;
          font-size: 0.85rem;
          margin: 0 0 8px;
        }

        .destination-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0 0 12px;
          flex: 1;
        }

        .destination-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid #eee;
          flex-wrap: wrap;
          gap: 8px;
        }

        .destination-price {
          font-size: 1rem;
          font-weight: 700;
          color: #dfa528;
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }

        .price-amount {
          font-weight: 700;
          color: #dfa528;
        }

        .currency-icon {
          display: inline-block;
          vertical-align: middle;
        }

        .price-per {
          font-size: 0.7rem;
          color: #888;
          font-weight: 400;
        }

        .destination-duration {
          font-size: 0.85rem;
          color: #888;
        }

        .btn-view-all {
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #dfa528;
          color: #fff;
          padding: 12px 35px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          margin-top: 20px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(223, 165, 40, 0.3);
        }

        .btn-view-all:hover {
          background: #c98c1e;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(223, 165, 40, 0.4);
        }

        .btn-view-all svg {
          transition: transform 0.3s ease;
        }

        .btn-view-all:hover svg {
          transform: translateX(5px);
        }

        [dir="rtl"] .btn-view-all:hover svg {
          transform: rotate(180deg) translateX(5px);
        }

        @media (max-width: 768px) {
          .col-md-3 {
            flex: 0 0 50%;
            max-width: 50%;
          }
          .title h2 {
            font-size: 2rem;
          }
          .destination-footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .col-md-3 {
            flex: 0 0 100%;
            max-width: 100%;
          }
          .destination-image {
            height: 180px;
          }
          .btn-view-all {
            padding: 12px 25px;
            font-size: 0.9rem;
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}

function getRegionTitle(region, lang) {
  const titles = {
    en: {
      Europe: 'European Destinations',
      Asia: 'Asian Destinations',
      Africa: 'African Destinations',
      Australia: 'Australia & New Zealand Destinations',
    },
    ar: {
      Europe: 'الوجهات الأوروبية',
      Asia: 'الوجهات الآسيوية',
      Africa: 'الوجهات الأفريقية',
      Australia: 'الوجهات الأسترالية ونيوزيلندا',
    }
  };
  return titles[lang]?.[region] || titles.en[region] || '';
}