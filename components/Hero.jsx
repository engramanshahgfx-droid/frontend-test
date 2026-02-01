"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaTemperatureHigh, FaCompass, FaUmbrellaBeach, FaMountain, FaCity, FaTree, FaWater } from "react-icons/fa";

export default function SaudiCitiesShowcase({ lang }) {
  const [selectedCity, setSelectedCity] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const scrollContainerRef = useRef(null);
  const autoPlayRef = useRef(null);
  const videoRef = useRef(null);

  const saudiCities = [
    {
      id: 1,
      name: { en: "AlUla", ar: "العلا" },
      temperature: "26°C",
      season: { en: "Perfect Season", ar: "الموسم المثالي" },
      description: {
        en: "ANCIENT WONDERS & DESERT ADVENTURE",
        ar: "عجائب قديمة ومغامرات صحراوية"
      },
      image: "/alula.jpg",
      video: "/videos/makka.mp4",
      mapPosition: { top: "32%", left: "42%" },
      highlights: [
        { en: "Hegra UNESCO Site", ar: "موقع الحجر UNESCO" },
        { en: "Maraya Concert Hall", ar: "قاعة مرايا" },
        { en: "Desert Oasis", ar: "واحة صحراوية" },
        { en: "Ancient Tombs", ar: "مقابر قديمة" }
      ],
      icon: FaCompass,
      gradient: "from-amber-500 to-orange-600"
    },
    {
      id: 2,
      name: { en: "Riyadh", ar: "الرياض" },
      temperature: "33°C",
      season: { en: "Year-round Destination", ar: "وجهة على مدار العام" },
      description: {
        en: "MODERN METROPOLIS & CULTURAL HUB",
        ar: "عاصمة عصرية ومركز ثقافي"
      },
      image: "/riyadh.png",
      video: "/videos/makka.mp4",
      mapPosition: { top: "38%", left: "50%" },
      highlights: [
        { en: "Kingdom Centre", ar: "برج المملكة" },
        { en: "Historic Diriyah", ar: "الدرعية التاريخية" },
        { en: "Business District", ar: "المنطقة التجارية" },
        { en: "Cultural Events", ar: "الفعاليات الثقافية" }
      ],
      icon: FaCity,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: 3,
      name: { en: "Jeddah", ar: "جدة" },
      temperature: "31°C",
      season: { en: "Coastal Paradise", ar: "جنة ساحلية" },
      description: {
        en: "RED SEA GEM & HISTORIC PORT",
        ar: "جوهرة البحر الأحمر وميناء تاريخي"
      },
      image: "jeddah.webp",
      video: "/videos/makka.mp4",
      mapPosition: { top: "52%", left: "40%" },
      highlights: [
        { en: "Al-Balad District", ar: "حي البلد" },
        { en: "Red Sea Beaches", ar: "شواطئ البحر الأحمر" },
        { en: "Coral Reefs", ar: "الشعاب المرجانية" },
        { en: "Shopping Destinations", ar: "وجهات التسوق" }
      ],
      icon: FaWater,
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      id: 4,
      name: { en: "Abha", ar: "أبها" },
      temperature: "19°C",
      season: { en: "Mountain Escape", ar: "ملاذ جبلي" },
      description: {
        en: "GREEN MOUNTAINS & COOL CLIMATE",
        ar: "جبال خضراء وطقس معتدل"
      },
      image: "/abha.png",
      video: "/videos/makka.mp4",
      mapPosition: { top: "62%", left: "46%" },
      highlights: [
        { en: "Al-Soudah Park", ar: "منتزه السودة" },
        { en: "Mountain Peaks", ar: "قمم جبلية" },
        { en: "Traditional Villages", ar: "قرى تقليدية" },
        { en: "Cable Car Rides", ar: "رحلات التلفريك" }
      ],
      icon: FaMountain,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      id: 5,
      name: { en: "Dammam", ar: "الدمام" },
      temperature: "30°C",
      season: { en: "Gulf Coast Beauty", ar: "جمال ساحل الخليج" },
      description: {
        en: "ARABIAN GULF & MODERN DEVELOPMENT",
        ar: "الخليج العربي والتطور العمراني"
      },
      image: "/dammam.png",
      video: "/videos/makka.mp4",
      mapPosition: { top: "42%", left: "63%" },
      highlights: [
        { en: "Half Moon Bay", ar: "شاطئ نصف القمر" },
        { en: "King Fahd Park", ar: "حديقة الملك فهد" },
        { en: "Corniche Area", ar: "الكورنيش" },
        { en: "Economic Zone", ar: "المنطقة الاقتصادية" }
      ],
      icon: FaUmbrellaBeach,
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      id: 6,
      name: { en: "Taif", ar: "الطائف" },
      temperature: "23°C",
      season: { en: "Rose Season", ar: "موسم الورد" },
      description: {
        en: "MOUNTAIN RESORT & ROSE GARDENS",
        ar: "منتجع جبلي وحدائق الورد"
      },
      image: "/placeholder.png",
      video: "/videos/makka.mp4",
      mapPosition: { top: "48%", left: "45%" },
      highlights: [
        { en: "Rose Festival", ar: "مهرجان الورد" },
        { en: "Al Hada Mountain", ar: "جبل الهدا" },
        { en: "Fruit Farms", ar: "مزارع الفواكه" },
        { en: "Cool Summer Climate", ar: "طقس صيفي معتدل" }
      ],
      icon: FaTree,
      gradient: "from-pink-500 to-rose-600"
    },
    {
      id: 7,
      name: { en: "Makkah", ar: "مكة المكرمة" },
      temperature: "35°C",
      season: { en: "Spiritual Journey", ar: "رحلة روحانية" },
      description: {
        en: "HOLY CITY & ISLAMIC HERITAGE",
        ar: "مدينة مقدسة وتراث إسلامي"
      },
      image: "/placeholder.png",
      video: "/videos/makka.mp4",
      mapPosition: { top: "45%", left: "43%" },
      highlights: [
        { en: "Holy Mosque", ar: "المسجد الحرام" },
        { en: "Religious Sites", ar: "مواقع دينية" },
        { en: "Historical Landmarks", ar: "معالم تاريخية" },
        { en: "Pilgrimage Destination", ar: "وجهة الحجاج" }
      ],
      icon: FaCompass,
      gradient: "from-gold-500 to-yellow-600"
    },
    {
      id: 8,
      name: { en: "Medina", ar: "المدينة المنورة" },
      temperature: "34°C",
      season: { en: "Historical Visit", ar: "زيارة تاريخية" },
      description: {
        en: "PROPHET'S CITY & ISLAMIC HISTORY",
        ar: "مدينة النبي والتاريخ الإسلامي"
      },
      image: "/placeholder.png",
      video: "/videos/makka.mp4",
      mapPosition: { top: "40%", left: "41%" },
      highlights: [
        { en: "Prophet's Mosque", ar: "المسجد النبوي" },
        { en: "Historical Museums", ar: "متاحف تاريخية" },
        { en: "Date Palms", ar: "بساتين النخيل" },
        { en: "Islamic Heritage", ar: "التراث الإسلامي" }
      ],
      icon: FaCity,
      gradient: "from-green-400 to-emerald-500"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setSelectedCity((prev) => (prev + 1) % saudiCities.length);
      }, 6000);
    } else {
      clearInterval(autoPlayRef.current);
    }

    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying, saudiCities.length]);

  const handleCitySelect = (index) => {
    setSelectedCity(index);
    setIsAutoPlaying(false);
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const currentCity = saudiCities[selectedCity];
  const IconComponent = currentCity.icon;

  return (
    <section className="saudi-cities-showcase" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Video Background */}
      <div className="video-background">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          className="background-video"
        >
          <source src="/videos/makka.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
        {!isVideoLoaded && (
          <div className="video-loading">
            <div className="loading-spinner"></div>
            <span>{lang === "ar" ? "جاري التحميل..." : "Loading..."}</span>
          </div>
        )}
      </div>

      <div className="content-container">
        {/* Header Section */}
        <div className="section-header">
          <div className="header-content">
            <h1 className="section-title">
              {lang === "ar" ? "روائع المملكة" : "Saudi Wonders"}
            </h1>
            <p className="section-subtitle">
              {lang === "ar" 
                ? "اكتشف التنوع الاستثنائي والتراث الثري للمملكة العربية السعودية"
                : "Discover the extraordinary diversity and rich heritage of Saudi Arabia"
              }
            </p>
            <div className="header-badges">
              <span className="badge">🏜️ {lang === "ar" ? "صحراء" : "Desert"}</span>
              <span className="badge">🏔️ {lang === "ar" ? "جبال" : "Mountains"}</span>
              <span className="badge">🏖️ {lang === "ar" ? "سواحل" : "Coasts"}</span>
              <span className="badge">🏙️ {lang === "ar" ? "مدن" : "Cities"}</span>
            </div>
          </div>
        </div>

        <div className="showcase-grid">
          {/* Left Side - City Details */}
          <div className="city-details">
            <div className="city-header">
              <div className="city-meta">
                <div className="season-badge">
                  <span>{currentCity.season[lang]}</span>
                </div>
                <div className="temperature-display">
                  <FaTemperatureHigh className="temp-icon" />
                  <span className="temp-value">{currentCity.temperature}</span>
                </div>
              </div>
              
              <div className="city-title-section">
                <span className="city-description">{currentCity.description[lang]}</span>
                <h2 className="city-name">{currentCity.name[lang]}</h2>
              </div>
            </div>
            
            <div className="highlights-section">
              <div className="highlights-header">
                <IconComponent className="section-icon" />
                <h3>{lang === "ar" ? "أبرز المعالم" : "Key Highlights"}</h3>
              </div>
              <div className="highlights-grid">
                {currentCity.highlights.map((highlight, index) => (
                  <div key={index} className="highlight-item">
                    <div className="highlight-dot"></div>
                    <span className="highlight-text">{highlight[lang]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="city-info-section">
              <p className="city-info">
                {lang === "ar" 
                  ? "استعد لاكتشاف مدينة استثنائية تجمع بين الأصالة والحداثة. استمتع بتجارب فريدة تتنوع بين المغامرات الصحراوية والجولات الثقافية والاسترخاء في أحضان الطبيعة."
                  : "Prepare to discover an extraordinary city that blends authenticity with modernity. Enjoy unique experiences ranging from desert adventures and cultural tours to relaxation amidst nature."
                }
              </p>
              
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">{lang === "ar" ? "جولة" : "Tours"}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">{lang === "ar" ? "دعم" : "Support"}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">{lang === "ar" ? "تقييمات" : "Ratings"}</span>
                </div>
              </div>
            </div>

            <div className="action-section">
              <button className="btn btn-primary">
                <span>{lang === "ar" ? "اكتشف الرحلات" : "Discover Tours"}</span>
                <div className="btn-glow"></div>
              </button>
              <button className="btn btn-secondary">
                {lang === "ar" ? "خطط رحلتك" : "Plan Your Trip"}
              </button>
              <button className="btn btn-outline">
                {lang === "ar" ? "شاهد الفيديو" : "Watch Video"}
              </button>
            </div>
          </div>

          {/* Right Side - Interactive Visualization */}
          <div className="visual-section">
            <div className="map-container">
              <div className="saudi-map-card">
                <div className="map-header">
                  <h3>{lang === "ar" ? "خريطة المملكة" : "Kingdom Map"}</h3>
                  <span className="map-subtitle">{lang === "ar" ? "انقر على المدن لاكتشافها" : "Click cities to explore"}</span>
                </div>
                
                <div className="map-visual">
                  <img 
                    src="/saudi-map.png" 
                    alt="Saudi Arabia Map" 
                    className="map-image"
                  />
                  
                  {/* Interactive City Markers */}
                  {saudiCities.map((city, index) => (
                    <button
                      key={city.id}
                      className={`city-marker ${selectedCity === index ? 'active' : ''}`}
                      style={city.mapPosition}
                      onClick={() => handleCitySelect(index)}
                      aria-label={`Select ${city.name[lang]}`}
                    >
                      <div className="marker-core">
                        <FaMapMarkerAlt className="marker-icon" />
                      </div>
                      <div className="marker-pulse"></div>
                      <div className="marker-tooltip">
                        <span className="tooltip-name">{city.name[lang]}</span>
                        <span className="tooltip-temp">{city.temperature}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured City Visual */}
            <div className="featured-city">
              <div className="city-visual-card">
                <img 
                  src={currentCity.image} 
                  alt={currentCity.name[lang]}
                  className="city-visual-image"
                />
                <div className={`city-gradient ${currentCity.gradient}`}></div>
                <div className="city-visual-content">
                  <div className="visual-badge">
                    <span>{currentCity.season[lang]}</span>
                  </div>
                  <h3 className="visual-title">{currentCity.name[lang]}</h3>
                  <p className="visual-description">{currentCity.description[lang]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cities Navigation Carousel */}
        <div className="cities-carousel-section">
          <div className="carousel-header">
            <h3 className="carousel-title">
              {lang === "ar" ? "استكشف جميع المدن" : "Explore All Cities"}
            </h3>
            <div className="carousel-controls">
              <span className="carousel-counter">
                {selectedCity + 1} / {saudiCities.length}
              </span>
              <div className="control-buttons">
                <button className="control-btn prev-btn" onClick={scrollLeft}>
                  <FaChevronLeft />
                </button>
                <button className="control-btn next-btn" onClick={scrollRight}>
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
          
          <div className="cities-carousel" ref={scrollContainerRef}>
            {saudiCities.map((city, index) => {
              const CityIcon = city.icon;
              return (
                <div
                  key={city.id}
                  className={`city-card ${selectedCity === index ? 'active' : ''}`}
                  onClick={() => handleCitySelect(index)}
                >
                  <div className="card-image-container">
                    <img src={city.image} alt={city.name[lang]} />
                    <div className={`card-gradient ${city.gradient}`}></div>
                    <div className="card-badge">
                      <CityIcon className="card-icon" />
                    </div>
                    <div className="card-temperature">
                      {city.temperature}
                    </div>
                  </div>
                  <div className="card-content">
                    <h4 className="card-title">{city.name[lang]}</h4>
                    <p className="card-description">{city.description[lang]}</p>
                    <div className="card-highlights">
                      {city.highlights.slice(0, 2).map((highlight, idx) => (
                        <span key={idx} className="card-highlight">
                          {highlight[lang]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="active-indicator"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .saudi-cities-showcase {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        /* Video Background */
        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .background-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.4);
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.7) 100%
          );
        }

        .video-loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Content Container */
        .content-container {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          width: 100%;
        }

        /* Header Section */
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .header-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .section-subtitle {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .header-badges {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .badge {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1.5rem;
          border-radius: 25px;
          color: white;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Main Grid Layout */
        .showcase-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
          margin-bottom: 4rem;
        }

        /* City Details */
        .city-details {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .city-header {
          margin-bottom: 2.5rem;
        }

        .city-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .season-badge {
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .temperature-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(99, 102, 241, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 15px;
          color: #6366f1;
          font-weight: 600;
        }

        .city-title-section {
          margin-bottom: 1rem;
        }

        .city-description {
          display: block;
          font-size: 0.9rem;
          font-weight: 700;
          color: #8b5cf6;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
        }

        .city-name {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
          line-height: 1.1;
        }

        /* Highlights Section */
        .highlights-section {
          margin-bottom: 2.5rem;
        }

        .highlights-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .section-icon {
          color: #8b5cf6;
          font-size: 1.25rem;
        }

        .highlights-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(99, 102, 241, 0.05);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .highlight-item:hover {
          background: rgba(99, 102, 241, 0.1);
          transform: translateX(5px);
        }

        .highlight-dot {
          width: 8px;
          height: 8px;
          background: #8b5cf6;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .highlight-text {
          font-weight: 600;
          color: #475569;
          font-size: 0.9rem;
        }

        /* City Info Section */
        .city-info-section {
          margin-bottom: 2.5rem;
        }

        .city-info {
          color: #64748b;
          line-height: 1.7;
          font-size: 1rem;
          margin-bottom: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: rgba(99, 102, 241, 0.05);
          border-radius: 12px;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: #8b5cf6;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Action Section */
        .action-section {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn {
          position: relative;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .btn-primary {
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: white;
        }

        .btn-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s;
        }

        .btn-primary:hover .btn-glow {
          left: 100%;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
        }

        .btn-secondary {
          background: #1e293b;
          color: white;
        }

        .btn-secondary:hover {
          background: #374151;
          transform: translateY(-2px);
        }

        .btn-outline {
          background: transparent;
          color: #1e293b;
          border: 2px solid #e2e8f0;
        }

        .btn-outline:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
          transform: translateY(-2px);
        }

        /* Visual Section */
        .visual-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .map-container {
          flex: 1;
        }

        .saudi-map-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          height: 300px;
        }

        .map-header {
          margin-bottom: 1.5rem;
        }

        .map-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }

        .map-subtitle {
          font-size: 0.9rem;
          color: #64748b;
        }

        .map-visual {
          position: relative;
          width: 100%;
          height: 200px;
        }

        .map-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .city-marker {
          position: absolute;
          border: none;
          background: none;
          cursor: pointer;
          transform: translate(-50%, -50%);
          z-index: 2;
        }

        .marker-core {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.8rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.3);
          animation: pulse 2s infinite;
          opacity: 0;
        }

        .city-marker.active .marker-pulse {
          opacity: 1;
        }

        .city-marker:hover .marker-core,
        .city-marker.active .marker-core {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        .marker-tooltip {
          position: absolute;
          top: -70px;
          left: 50%;
          transform: translateX(-50%);
          background: #1e293b;
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.8rem;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .city-marker:hover .marker-tooltip {
          opacity: 1;
          visibility: visible;
          top: -80px;
        }

        .tooltip-name {
          display: block;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .tooltip-temp {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        /* Featured City */
        .featured-city {
          flex: 1;
        }

        .city-visual-card {
          position: relative;
          height: 300px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        }

        .city-visual-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .city-visual-card:hover .city-visual-image {
          transform: scale(1.05);
        }

        .city-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.6;
        }

        .city-visual-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
          color: white;
          z-index: 2;
        }

        .visual-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: inline-block;
        }

        .visual-title {
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
        }

        .visual-description {
          font-size: 0.9rem;
          opacity: 0.9;
          margin: 0;
        }

        /* Cities Carousel */
        .cities-carousel-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .carousel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .carousel-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .carousel-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .carousel-counter {
          font-weight: 600;
          color: #64748b;
          font-size: 0.9rem;
        }

        .control-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .control-btn {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          color: #475569;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .control-btn:hover {
          background: #8b5cf6;
          border-color: #8b5cf6;
          color: white;
        }

        .cities-carousel {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0.5rem;
        }

        .cities-carousel::-webkit-scrollbar {
          display: none;
        }

        .city-card {
          position: relative;
          min-width: 280px;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s ease;
          border: 2px solid transparent;
          flex-shrink: 0;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        }

        .city-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .city-card.active {
          border-color: #8b5cf6;
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(139, 92, 246, 0.2);
        }

        .card-image-container {
          position: relative;
          height: 160px;
          overflow: hidden;
        }

        .card-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .city-card:hover .card-image-container img {
          transform: scale(1.1);
        }

        .card-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.4;
        }

        .card-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(255, 255, 255, 0.9);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b5cf6;
          font-size: 1rem;
        }

        .card-temperature {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .card-content {
          padding: 1.5rem;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .card-description {
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.4;
          margin-bottom: 1rem;
        }

        .card-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .card-highlight {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .active-indicator {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 12px;
          height: 12px;
          background: #10b981;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        .city-card.active .active-indicator {
          opacity: 1;
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          70% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .showcase-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .visual-section {
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .content-container {
            padding: 1rem;
          }

          .section-title {
            font-size: 2.5rem;
          }

          .city-details {
            padding: 2rem;
          }

          .city-name {
            font-size: 2rem;
          }

          .highlights-grid {
            grid-template-columns: 1fr;
          }

          .action-section {
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .cities-carousel-section {
            padding: 1.5rem;
          }

          .carousel-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .city-card {
            min-width: 250px;
          }
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 2rem;
          }

          .city-details {
            padding: 1.5rem;
          }

          .city-name {
            font-size: 1.75rem;
          }

          .city-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-badges {
            justify-content: flex-start;
          }

          .badge {
            padding: 0.4rem 1rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </section>
  );
}