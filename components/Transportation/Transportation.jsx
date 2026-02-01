"use client";

import React from "react";
import { FaPlane, FaTrain, FaCar, FaSubway, FaMapMarkerAlt, FaClock, FaUsers, FaStar } from "react-icons/fa";

export default function Transportation({ lang }) {
  const content = {
    ar: {
      heroTitle: "سحر الطبيعة كما لم تره من قبل",
      pageTitle: "دليل المواصلات في السعودية",
      pageSubtitle: "دليلك الشامل لسيارات الأجرة، المترو، الرحلات الجوية والمزيد",
      
      introTitle: "كيف تتنقل في السعودية",
      introDescription: "توفّر المملكة منظومة نقل متكاملة تضمن لك سهولة الوصول والتنقّل بين مدنها ومعالمها. سواء كنت تودّ استكشاف مدينة أو التنقل لمسافات أطول، ستجد وسيلة تناسب احتياجاتك — من السيارات الخاصة والمترو، إلى القطارات السريعة والحافلات الحديثة والرحلات الجوية.",

      flightsTitle: "الرحلات الجوية في السعودية",
      flightsDescription: "يمكنك التنقّل بكل راحة وسرعة داخل المملكة وخارجها عبر شبكة طيران حديثة تربط 18 مطارًا محليًا بـ10 مطارات دولية، لتمنحك خيارات واسعة للوصول إلى مختلف المدن والوجهات السياحية.",
      flightsSubtitle: "استكشف الرحلات الداخلية والدولية في السعودية",

      airlines: [
        {
          name: "الخطوط السعودية",
          description: "الناقل الوطني الأول في السعودية، حيث يتميّز بشبكة واسعة من الرحلات الداخلية والدولية التي تربط السعودية بجميع قارات العالم.",
          image: "/saudi-airlane.jpg",
          features: ["رحلات داخلية", "رحلات دولية", "شبكة عالمية", "خدمة فاخرة"]
        },
        {
          name: "طيران ناس",
          description: "طيران سعودي يشغّل رحلات داخلية ودولية على مدار اليوم، مع تقديم رحلات مباشرة إلى أبرز الوجهات السياحية حول العالم.",
          image: "/flynas.jpg",
          features: ["رحلات ميسورة", "وجهات متعددة", "رحلات مباشرة", "خدمة سريعة"]
        },
        {
          name: "طيران أديل",
          description: "يقدم رحلات يومية إلى أهم المدن والوجهات السياحية في السعودية، كما تتوفر لديه رحلات دولية.",
          image: "/Adele.jpg",
          features: ["رحلات يومية", "وجهات محلية", "أسعار تنافسية", "خدمة متميزة"]
        }
      ],

      carsTitle: "استئجار السيارات والقيادة في السعودية",
      carsDescription: "إذا كنت تفضل حرية التنقل واستكشاف السعودية على طريقتك، فالسيارة خيار مثالي. توفر المملكة طرقاً حديثة ولوحات إرشادية باللغتين، إضافةً إلى شركات تأجير محلية وعالمية منتشرة في المطارات والمدن.",
      carFeatures: [
        "طرق سريعة حديثة",
        "لوحات إرشادية بالعربية والإنجليزية",
        "شركات تأجير عالمية",
        "تطبيقات حجز سيارات"
      ],

      trainsTitle: "القطارات والمترو",
      trainsDescription: "توفر السعودية شبكات قطارات حديثة تتيح لك التنقل بين المدن بسرعة وراحة، بالإضافة إلى أنظمة مترو متطورة تسهّل الحركة داخل المدن الكبرى مثل الرياض.",

      trainServices: [
        {
          name: "الخطوط الحديدية السعودية (سار)",
          description: "شبكة قطارات توفر نقل آمن ومريح. عبر مسار الشمال من الرياض إلى القريات ومسار الشرق من الرياض إلى الدمام.",
          image: "/sar.jpg",
          routes: ["الرياض → القريات", "الرياض → الدمام"],
          features: ["مكيف", "مقاعد مريحة", "خدمة الوجبات", "واي فاي"]
        },
        {
          name: "قطار الحرمين السريع",
          description: "يُعتبر من أسرع قطارات الشرق الأوسط، يربط بين المدن المقدسة مرورًا بمحطات رئيسية مثل جدة ومدينة الملك عبد الله الاقتصادية.",
          image: "/Haramain.jpg",
          routes: ["مكة → المدينة", "جدة → المدينة"],
          features: ["سرعة عالية", "تذاكر إلكترونية", "خدمة فاخرة", "مواعيد منتظمة"]
        },
        {
          name: "قطار الرياض",
          description: "صُمم لتحويل طرق تنقل المواطنين وزوار مدينة الرياض. يتكون من ستة خطوط و ٨٥ محطة تربط بين المناطق الرئيسية، بما في ذلك المناطق التجارية، المعالم الثقافية المختلفة والأحياء السكنية.",
          image: "/riyadh-metro.png",
          routes: ["6 خطوط رئيسية", "85 محطة"],
          features: ["تغطية شاملة", "تذاكر رقمية", "مواعيد متكررة", "وصول سهل"]
        }
      ],

      contactTitle: "هل تحتاج مساعدة في التخطيط لرحلتك؟",
      contactDescription: "فريقنا متاح لمساعدتك في ترتيب جميع تفاصيل تنقلك خلال زيارتك للمملكة",
      contactButton: "تواصل معنا للاستشارة"
    },
    en: {
      heroTitle: "The Magic of Nature As You've Never Seen Before",
      pageTitle: "Transportation Guide in Saudi Arabia",
      pageSubtitle: "Your comprehensive guide to taxis, metro, flights and more",
      
      introTitle: "How to Get Around in Saudi Arabia",
      introDescription: "The Kingdom provides an integrated transportation system that ensures easy access and mobility between its cities and landmarks. Whether you want to explore a city or travel longer distances, you'll find a means that suits your needs — from private cars and metro, to high-speed trains, modern buses, and flights.",

      flightsTitle: "Flights in Saudi Arabia",
      flightsDescription: "You can travel with complete comfort and speed within the Kingdom and abroad through a modern aviation network connecting 18 domestic airports with 10 international airports, giving you wide options to reach various cities and tourist destinations.",
      flightsSubtitle: "Explore Domestic and International Flights in Saudi Arabia",

      airlines: [
        {
          name: "Saudi Arabian Airlines",
          description: "The first national carrier in Saudi Arabia, featuring a wide network of domestic and international flights connecting Saudi Arabia with all continents of the world.",
          image: "/saudi-airlane.jpg",
          features: ["Domestic Flights", "International Flights", "Global Network", "Luxury Service"]
        },
        {
          name: "Flynas",
          description: "A Saudi airline operating domestic and international flights around the clock, offering direct flights to major tourist destinations around the world.",
          image: "/flynas.jpg",
          features: ["Affordable Flights", "Multiple Destinations", "Direct Flights", "Fast Service"]
        },
        {
          name: "Adele Airlines",
          description: "Offers daily flights to the most important cities and tourist destinations in Saudi Arabia, with international flights also available.",
          image: "/Adele.jpg",
          features: ["Daily Flights", "Local Destinations", "Competitive Prices", "Premium Service"]
        }
      ],

      carsTitle: "Car Rental and Driving in Saudi Arabia",
      carsDescription: "If you prefer the freedom of movement and exploring Saudi Arabia your way, a car is an ideal choice. The Kingdom provides modern roads and bilingual signs, in addition to local and international rental companies spread across airports and cities.",
      carFeatures: [
        "Modern highways",
        "Bilingual signs in Arabic and English",
        "International rental companies",
        "Car booking applications"
      ],

      trainsTitle: "Trains and Metro",
      trainsDescription: "Saudi Arabia provides modern train networks that allow you to travel between cities quickly and comfortably, in addition to advanced metro systems that facilitate movement within major cities like Riyadh.",

      trainServices: [
        {
          name: "Saudi Arabian Railways (SAR)",
          description: "A train network that provides safe and comfortable transportation. Through the northern route from Riyadh to Qurayyat and the eastern route from Riyadh to Dammam.",
          image: "/sar.jpg",
          routes: ["Riyadh → Qurayyat", "Riyadh → Dammam"],
          features: ["Air Conditioned", "Comfortable Seats", "Meal Service", "WiFi"]
        },
        {
          name: "Haramain High-Speed Railway",
          description: "Considered one of the fastest trains in the Middle East, connecting the holy cities through main stations like Jeddah and King Abdullah Economic City.",
          image: "/Haramain.jpg",
          routes: ["Mecca → Medina", "Jeddah → Medina"],
          features: ["High Speed", "E-Tickets", "Luxury Service", "Regular Schedules"]
        },
        {
          name: "Riyadh Metro",
          description: "Designed to transform the transportation methods of citizens and visitors to Riyadh city. It consists of six lines and 85 stations connecting main areas, including commercial districts, various cultural landmarks and residential neighborhoods.",
          image: "/riyadh-metro.png",
          routes: ["6 Main Lines", "85 Stations"],
          features: ["Comprehensive Coverage", "Digital Tickets", "Frequent Schedules", "Easy Access"]
        }
      ],

      contactTitle: "Need Help Planning Your Trip?",
      contactDescription: "Our team is available to help you arrange all your transportation details during your visit to the Kingdom",
      contactButton: "Contact Us for Consultation"
    }
  };

  const t = content[lang] || content.ar;
  const isRTL = lang === "ar";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="transportation-page">
      {/* Hero Section with Video Background */}
      <section className="transportation-hero">
        <div className="video-background">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="background-video"
          >
            <source src="/desert3.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>
        </div>
        
        <div className="container">
          <div className="row align-items-center min-vh-80">
            <div className="col-lg-8 mx-auto text-center text-white">
              <div className="hero-content">
                <h1 className="display-4 fw-bold mb-4">{t.heroTitle}</h1>
                <h2 className="display-5 fw-bold mb-3">{t.pageTitle}</h2>
                <p className="lead mb-5">{t.pageSubtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src="/bg12.jpg" 
                alt={t.introTitle}
                className="img-fluid rounded-3 shadow-lg"
                onError={(e) => {
                  e.target.src = '/placeholder.png';
                }}
              />
            </div>
            <div className="col-lg-6">
              <div className="intro-content">
                <h2 className="display-5 fw-bold mb-4">{t.introTitle}</h2>
                <p className="lead intro-description">{t.introDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flights Section */}
      <section className="flights-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title mb-3">{t.flightsTitle}</h2>
            <p className="section-description mb-4">{t.flightsDescription}</p>
            <h4 className="flights-subtitle">{t.flightsSubtitle}</h4>
          </div>

          <div className="row g-4">
            {t.airlines.map((airline, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="airline-card">
                  <div className="airline-image">
                    <img 
                      src={airline.image} 
                      alt={airline.name}
                      className="img-fluid"
                      onError={(e) => {
                        e.target.src = '/placeholder.png';
                      }}
                    />
                  </div>
                  <div className="airline-content">
                    <h4 className="airline-name">{airline.name}</h4>
                    <p className="airline-description">{airline.description}</p>
                    <div className="airline-features">
                      {airline.features.map((feature, idx) => (
                        <span key={idx} className="feature-tag">
                          <FaStar className="feature-icon" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Car Rental Section */}
      <section className="cars-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 order-2 order-lg-1">
              <div className="cars-content">
                <h2 className="display-5 fw-bold mb-4">{t.carsTitle}</h2>
                <p className="lead cars-description mb-4">{t.carsDescription}</p>
                <div className="car-features-grid">
                  {t.carFeatures.map((feature, index) => (
                    <div key={index} className="car-feature-item">
                      <FaCar className="feature-icon" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 mb-4 mb-lg-0">
              <img 
                src="/saudi-rent.webp" 
                alt={t.carsTitle}
                className="img-fluid rounded-3 shadow-lg"
                onError={(e) => {
                  e.target.src = '/placeholder.png';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trains Section */}
      <section className="trains-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title mb-3">{t.trainsTitle}</h2>
            <p className="section-description">{t.trainsDescription}</p>
          </div>

          <div className="row g-4">
            {t.trainServices.map((train, index) => (
              <div key={index} className="col-lg-4">
                <div className="train-card">
                  <div className="train-image">
                    <img 
                      src={train.image} 
                      alt={train.name}
                      className="img-fluid"
                      onError={(e) => {
                        e.target.src = '/placeholder.png';
                      }}
                    />
                  </div>
                  <div className="train-content">
                    <h4 className="train-name">{train.name}</h4>
                    <p className="train-description">{train.description}</p>
                    
                    <div className="train-routes">
                      <h6>{isRTL ? "المسارات:" : "Routes:"}</h6>
                      {train.routes.map((route, idx) => (
                        <div key={idx} className="route-item">
                          <FaMapMarkerAlt className="route-icon" />
                          <span>{route}</span>
                        </div>
                      ))}
                    </div>

                    <div className="train-features">
                      <h6>{isRTL ? "المميزات:" : "Features:"}</h6>
                      <div className="features-grid">
                        {train.features.map((feature, idx) => (
                          <span key={idx} className="train-feature-tag">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="contact-section py-5">
        <div className="container">
          <div className="contact-cta text-center">
            <h3 className="mb-3">{t.contactTitle}</h3>
            <p className="mb-4">{t.contactDescription}</p>
            <a
              href={`https://wa.me/+966547305060`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              {t.contactButton}
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .transportation-page {
          background: #f8f9fa;
          font-family: 'Tajawal', sans-serif;
        }

        .transportation-hero {
          position: relative;
          padding: 120px 0 80px;
          min-height: 60vh;
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
          background: linear-gradient(135deg, 
            rgba(138, 119, 121, 0.95) 0%, 
            rgba(239, 200, 174, 0.85) 100%);
          z-index: 2;
        }

        .transportation-hero .container {
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

        .hero-content h2 {
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          color: rgba(255,255,255,0.95);
          font-family: 'Tajawal', sans-serif;
        }

        .hero-content .lead {
          font-size: 1.3rem;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
          color: rgba(255,255,255,0.9);
          font-family: 'Tajawal', sans-serif;
        }

        .intro-section, .flights-section, .cars-section, .trains-section, .contact-section {
          padding: 80px 0;
        }

        .section-title {
          color: #2c3e50;
          font-weight: 800;
          font-size: 2.5rem;
          position: relative;
          margin-bottom: 1rem;
          font-family: 'Tajawal', sans-serif;
        }

        .section-description {
          color: #5d6d7e;
          font-size: 1.1rem;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
          font-family: 'Tajawal', sans-serif;
        }

        .flights-subtitle {
          color: #8a7779;
          font-weight: 600;
          margin-top: 1rem;
          font-family: 'Tajawal', sans-serif;
        }

        .intro-content h2, .cars-content h2 {
          color: #2c3e50;
          background: linear-gradient(135deg, #8a7779, #2c3e50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: 'Tajawal', sans-serif;
        }

        .intro-description, .cars-description {
          color: #5d6d7e;
          line-height: 1.8;
          font-size: 1.1rem;
          font-family: 'Tajawal', sans-serif;
        }

        .airline-card, .train-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 100%;
          border: 1px solid #e9ecef;
          font-family: 'Tajawal', sans-serif;
        }

        .airline-card:hover, .train-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .airline-image, .train-image {
          height: 200px;
          overflow: hidden;
        }

        .airline-image img, .train-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .airline-card:hover .airline-image img,
        .train-card:hover .train-image img {
          transform: scale(1.1);
        }

        .airline-content, .train-content {
          padding: 25px;
          font-family: 'Tajawal', sans-serif;
        }

        .airline-name, .train-name {
          color: #2c3e50;
          font-weight: 700;
          margin-bottom: 15px;
          font-size: 1.3rem;
          font-family: 'Tajawal', sans-serif;
        }

        .airline-description, .train-description {
          color: #5d6d7e;
          margin-bottom: 20px;
          line-height: 1.6;
          font-family: 'Tajawal', sans-serif;
        }

        .airline-features {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feature-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #8a7779;
          font-size: 0.9rem;
          font-weight: 500;
          font-family: 'Tajawal', sans-serif;
        }

        .feature-icon {
          color: #f39c12;
          font-size: 0.8rem;
        }

        .car-features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
        }

        .car-feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #5d6d7e;
          font-weight: 500;
          font-family: 'Tajawal', sans-serif;
        }

        .car-feature-item .feature-icon {
          color: #8a7779;
          font-size: 1.1rem;
        }

        .train-routes, .train-features {
          margin-bottom: 20px;
        }

        .train-routes h6, .train-features h6 {
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 10px;
          font-family: 'Tajawal', sans-serif;
        }

        .route-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #5d6d7e;
          font-size: 0.9rem;
          margin-bottom: 5px;
          font-family: 'Tajawal', sans-serif;
        }

        .route-icon {
          color: #8a7779;
          font-size: 0.8rem;
        }

        .features-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .train-feature-tag {
          background: rgba(138, 119, 121, 0.1);
          color: #8a7779;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 500;
          font-family: 'Tajawal', sans-serif;
        }

        .contact-cta {
          background: white;
          padding: 50px;
          border-radius: 25px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border: 2px solid #ecf0f1;
          font-family: 'Tajawal', sans-serif;
        }

        .contact-cta h3 {
          color: #2c3e50;
          font-weight: 700;
          font-size: 1.8rem;
          font-family: 'Tajawal', sans-serif;
        }

        .contact-cta p {
          color: #5d6d7e;
          font-size: 1.1rem;
          line-height: 1.6;
          font-family: 'Tajawal', sans-serif;
        }

        .btn-primary {
          background: linear-gradient(45deg, #8a7779, #a89294);
          border: none;
          padding: 15px 35px;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 1.1rem;
          box-shadow: 0 4px 15px rgba(138, 119, 121, 0.3);
          font-family: 'Tajawal', sans-serif;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(138, 119, 121, 0.4);
        }

        @media (max-width: 768px) {
          .transportation-hero {
            padding: 100px 0 60px;
            min-height: 50vh;
          }

          .hero-content h1 {
            font-size: 2.2rem;
          }

          .hero-content h2 {
            font-size: 1.8rem;
          }

          .intro-section, .flights-section, .cars-section, .trains-section, .contact-section {
            padding: 60px 0;
          }

          .section-title {
            font-size: 2rem;
          }

          .contact-cta {
            padding: 30px 20px;
          }
        }

        @media (max-width: 576px) {
          .hero-content h1 {
            font-size: 1.8rem;
          }

          .hero-content h2 {
            font-size: 1.5rem;
          }

          .airline-content, .train-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}