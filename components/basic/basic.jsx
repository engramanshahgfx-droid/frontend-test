"use client";

import React from "react";
import { FaStar, FaClock, FaMapMarkerAlt, FaWhatsapp, FaUsers, FaPlane, FaHotel, FaWifi, FaGlassCheers, FaRing, FaUmbrellaBeach } from "react-icons/fa";

export default function JanuaryOffers({ lang }) {
  const content = {
    en: {
      heroTitle: "January Exclusive Offers",
      heroSubtitle: "Special honeymoon and New Year packages with amazing discounts. Don't miss these limited-time offers!",
      discountText: "January Special Offers",
      featuredOffers: "January Featured Packages",
      contactUs: "Contact Us",
      days: "Days",
      nights: "Nights",
      persons: "Persons",
      included: "Package Includes",
      limitedSpots: "Limited Spots",
      mostPopular: "Most Popular",
      honeymoonSpecial: "Honeymoon Special",
      newYearOffer: "New Year Special",
      
      offers: [
        {
          id: 1,
          title: "Honeymoon in Malaysia",
          category: "January Offers • Honeymoon",
          description: "Experience the perfect honeymoon in Malaysia with visits to Selangor, Langkawi, and Kuala Lumpur. Enjoy romantic settings with included breakfast, guided tours, and special services.",
          image: "/offers/malaysia.png",
          discount: "20%",
          duration: "8 Days 7 Nights",
          location: "Malaysia",
          groupSize: "2 Persons",
          badge: "Honeymoon Special",
          itinerary: ["2 Selangor", "3 Langkawi", "3 Kuala Lumpur"],
          features: [
            "Hotels with breakfast",
            "Pre-arranged tours & transfers",
            "Professional tour guide",
            "Service & taxes included",
            "Airport reception with flowers",
            "Free SIM card with internet",
            "Honeymoon room decoration"
          ],
          highlights: ["Romantic Beaches", "Langkawi Island", "City Tour", "Couple Activities"]
        },
        {
          id: 2,
          title: "Honeymoon in Indonesia",
          category: "New Year Offers • Honeymoon",
          description: "Celebrate your honeymoon in beautiful Indonesia with visits to Jakarta and Bali. Enjoy 5 nights in the paradise island of Bali with all inclusive services.",
          image: "/offers/Indonesia.png",
          discount: "25%",
          duration: "7 Days 6 Nights",
          location: "Indonesia",
          groupSize: "2 Persons",
          badge: "New Year Special",
          itinerary: ["1 Jakarta", "5 Bali Island", "1 Jakarta"],
          features: [
            "Hotels or resorts",
            "All tours included",
            "Domestic flights",
            "Professional guide",
            "Free airport reception with flowers",
            "Free internet SIM card",
            "Honeymoon room decoration"
          ],
          highlights: ["Bali Beaches", "Cultural Tours", "Romantic Dinners", "Island Hopping"]
        },
        {
          id: 3,
          title: "Singapore Honeymoon",
          category: "New Year Offers • Honeymoon",
          description: "4 nights in Singapore with hotel stays and train tours. Perfect for couples looking for a modern city experience with luxury accommodations.",
          image: "/offers/Singapore.png",
          discount: "15%",
          duration: "5 Days 4 Nights",
          location: "Singapore",
          groupSize: "2 Persons",
          badge: "Limited Spots",
          itinerary: ["Singapore City Tour"],
          features: [
            "Hotels & train tours",
            "All sightseeing included",
            "Tour guide services",
            "Taxes included",
            "Free airport reception with flowers",
            "Free internet SIM card"
          ],
          highlights: ["City Lights", "Gardens by the Bay", "Sentosa Island", "Shopping"]
        },
        {
          id: 4,
          title: "Sri Lanka Adventure",
          category: "New Year Offers • Honeymoon",
          description: "7 nights in Sri Lanka exploring Negombo, Kandy, Bentota, and Colombo. Experience rich culture and beautiful beaches.",
          image: "/offers/SriLanka.png",
          discount: "18%",
          duration: "8 Days 7 Nights",
          location: "Sri Lanka",
          groupSize: "2 Persons",
          badge: "Most Popular",
          itinerary: ["1 Negombo", "2 Kandy", "2 Bentota", "2 Colombo"],
          features: [
            "Driver & tours included",
            "Tour guide services",
            "Service & taxes included",
            "Breakfast included",
            "Free airport reception with flowers",
            "Free internet SIM card"
          ],
          highlights: ["Cultural Sites", "Beach Resorts", "Wildlife Safari", "Tea Plantations"]
        },
        {
          id: 5,
          title: "Thailand Couple Package",
          category: "New Year Offers • 2 Persons",
          description: "9 nights in Thailand exploring Bangkok and the beautiful island of Phuket. Perfect for couples seeking adventure and relaxation.",
          image: "/offers/Thailand.png",
          discount: "22%",
          duration: "10 Days 9 Nights",
          location: "Thailand",
          groupSize: "2 Persons",
          badge: "Best Value",
          itinerary: ["2 Bangkok", "5 Phuket Island", "2 Bangkok"],
          features: [
            "Hotel accommodations",
            "Driver & sightseeing",
            "Domestic flights",
            "Tour guide services",
            "Free airport reception with flowers",
            "Free internet SIM card"
          ],
          highlights: ["Phuket Beaches", "Bangkok City", "Island Tours", "Night Markets"]
        },
        {
          id: 6,
          title: "Luxury Maldives Escape",
          category: "January Special • Honeymoon",
          description: "Ultimate luxury honeymoon in Maldives with overwater bungalows, private beach access, and romantic dinners.",
          image: "/offers/Maldives.png",
          discount: "30%",
          duration: "6 Days 5 Nights",
          location: "Maldives",
          groupSize: "2 Persons",
          badge: "Luxury",
          itinerary: ["Private Island Resort"],
          features: [
            "Overwater bungalow",
            "All meals included",
            "Private transfers",
            "Spa credits",
            "Romantic dinner on beach",
            "Free internet access",
            "Water sports equipment"
          ],
          highlights: ["Private Beach", "Snorkeling", "Spa Treatments", "Sunset Cruises"]
        }
      ],
      
      categories: {
        all: "All Offers",
        honeymoon: "Honeymoon",
        newyear: "New Year",
        luxury: "Luxury",
        popular: "Popular"
      },
      
      additionalInfo: [
        {
          icon: "✈️",
          title: "All Domestic Flights",
          desc: "Included in package"
        },
        {
          icon: "🏨",
          title: "5-Star Hotels",
          desc: "Luxury accommodations"
        },
        {
          icon: "📱",
          title: "Free SIM Card",
          desc: "With internet package"
        },
        {
          icon: "💐",
          title: "Flower Reception",
          desc: "At airport arrival"
        }
      ]
    },

    ar: {
      heroTitle: "عروض يناير الحصرية",
      heroSubtitle: "باقات شهر العسل وعروض رأس السنة مع خصومات مذهلة. لا تفوت هذه العروض المحدودة!",
      discountText: "عروض يناير الخاصة",
      featuredOffers: "باقات يناير المميزة",
      contactUs: "تواصل معنا",
      days: "أيام",
      nights: "ليالي",
      persons: "أشخاص",
      included: "يشمل الباقة",
      limitedSpots: "أماكن محدودة",
      mostPopular: "الأكثر شيوعاً",
      honeymoonSpecial: "عرض شهر العسل",
      newYearOffer: "عرض رأس السنة",
      
      offers: [
        {
          id: 1,
          title: "شهر العسل في ماليزيا",
          category: "عروض يناير • شهر العسل",
          description: "استمتع بشهر العسل المثالي في ماليزيا مع زيارات إلى سيلانجور ولنكاوي وكوالالمبور. استمتع بإقامة رومانسية تتضمن الإفطار والجولات والخدمات الخاصة.",
          image: "/offers/Malaysia.png",
          discount: "20%",
          duration: "٨ أيام ٧ ليالي",
          location: "ماليزيا",
          groupSize: "شخصين",
          badge: "عرض شهر العسل",
          itinerary: ["٢ سيلانجور", "٣ لنكاوي", "٣ كوالالمبور"],
          features: [
            "فنادق مع إفطار",
            "جولات ونقل مسبق",
            "مرشد سياحي محترف",
            "خدمة وضريبة مشمولة",
            "استقبال بالمطار مع ورد",
            "شرائح نت مجانية",
            "تزيين غرفة شهر العسل"
          ],
          highlights: ["شواطئ رومانسية", "جزيرة لنكاوي", "جولة المدينة", "أنشطة للزوجين"]
        },
        {
          id: 2,
          title: "شهر العسل في اندونيسيا",
          category: "عروض رأس السنة • شهر العسل",
          description: "احتفل بشهر العسل في اندونيسيا الجميلة مع زيارات إلى جاكرتا وجزيرة بالي. استمتع بـ٥ ليالي في جزيرة بالي مع خدمات شاملة.",
          image: "/offers/Indonesia.png",
          discount: "25%",
          duration: "٧ أيام ٦ ليالي",
          location: "اندونيسيا",
          groupSize: "شخصين",
          badge: "عرض رأس السنة",
          itinerary: ["١ جاكرتا", "٥ جزيرة بالي", "١ جاكرتا"],
          features: [
            "فنادق أو منتجعات",
            "جميع الجولات مشمولة",
            "طيران داخلي",
            "مرشد سياحي",
            "استقبال مجاني مع ورد",
            "شرائح نت مجانية",
            "تزيين غرفة شهر العسل"
          ],
          highlights: ["شواطئ بالي", "جولات ثقافية", "عشاء رومانسي", "جولات الجزيرة"]
        },
        {
          id: 3,
          title: "شهر العسل في سنغافورة",
          category: "عروض رأس السنة • شهر العسل",
          description: "٤ ليالي في سنغافورة مع إقامة فندقية وجولات بالقطار. مثالي للأزواج الباحثين عن تجربة مدينة حديثة.",
          image: "/offers/Singapore.png",
          discount: "15%",
          duration: "٥ أيام ٤ ليالي",
          location: "سنغافورة",
          groupSize: "شخصين",
          badge: "أماكن محدودة",
          itinerary: ["جولة مدينة سنغافورة"],
          features: [
            "فنادق وجولات قطار",
            "جميع الجولات مشمولة",
            "خدمات مرشد سياحي",
            "الضرائب مشمولة",
            "استقبال مجاني مع ورد",
            "شرائح نت مجانية"
          ],
          highlights: ["أضواء المدينة", "جاردنز باي ذا باي", "جزيرة سنتوسا", "تسوق"]
        },
        {
          id: 4,
          title: "مغامرة سريلانكا",
          category: "عروض رأس السنة • شهر العسل",
          description: "٧ ليالي في سريلانكا تستكشف نقمبو وكاندي وبنتوتة وكولومبو. استمتع بالثقافة الغنية والشواطئ الجميلة.",
          image: "/offers/Srilanka.png",
          discount: "18%",
          duration: "٨ أيام ٧ ليالي",
          location: "سريلانكا",
          groupSize: "شخصين",
          badge: "الأكثر شيوعاً",
          itinerary: ["١ نقمبو", "٢ كاندي", "٢ بنتوتة", "٢ كولومبو"],
          features: [
            "سائق وجولات مشمولة",
            "خدمات مرشد سياحي",
            "خدمة وضريبة مشمولة",
            "إفطار مشمول",
            "استقبال مجاني مع ورد",
            "شرائح نت مجانية"
          ],
          highlights: ["مواقع ثقافية", "منتجعات شاطئية", "سفاري", "مزارع الشاي"]
        },
        {
          id: 5,
          title: "باقة تايلاند للزوجين",
          category: "عروض رأس السنة • شخصين",
          description: "٩ ليالي في تايلاند تستكشف بانكوك وجزيرة بوكيت الجميلة. مثالي للأزواج الباحثين عن المغامرة والاسترخاء.",
          image: "/offers/Thailand.png",
          discount: "22%",
          duration: "١٠ أيام ٩ ليالي",
          location: "تايلاند",
          groupSize: "شخصين",
          badge: "أفضل قيمة",
          itinerary: ["٢ بانكوك", "٥ جزيرة بوكيت", "٢ بانكوك"],
          features: [
            "إقامة فندقية",
            "سائق وجولات",
            "طيران داخلي",
            "خدمات مرشد سياحي",
            "استقبال مجاني مع ورد",
            "شرائح نت مجانية"
          ],
          highlights: ["شواطئ بوكيت", "مدينة بانكوك", "جولات الجزيرة", "أسواق ليلية"]
        },
        {
          id: 6,
          title: "هروب فاخر إلى المالديف",
          category: "عرض يناير الخاص • شهر العسل",
          description: "شهر العسل الفاخر في المالديف مع أكواخ فوق الماء ووصول خاص للشاطئ وعشاء رومانسي.",
          image: "/offers/Maldives.png",
          discount: "30%",
          duration: "٦ أيام ٥ ليالي",
          location: "المالديف",
          groupSize: "شخصين",
          badge: "فاخر",
          itinerary: ["منتجع جزيرة خاص"],
          features: [
            "أكواخ فوق الماء",
            "جميع الوجبات مشمولة",
            "نقل خاص",
            "رصيد سبا",
            "عشاء رومانسي على الشاطئ",
            "إنترنت مجاني",
            "معدات رياضات مائية"
          ],
          highlights: ["شاطئ خاص", "الغطس", "علاجات سبا", "رحلات غروب الشمس"]
        }
      ],
      
      categories: {
        all: "جميع العروض",
        honeymoon: "شهر العسل",
        newyear: "رأس السنة",
        luxury: "فاخر",
        popular: "الأكثر شيوعاً"
      },
      
      additionalInfo: [
        {
          icon: "✈️",
          title: "جميع الرحلات الداخلية",
          desc: "مشمولة في الباقة"
        },
        {
          icon: "🏨",
          title: "فنادق ٥ نجوم",
          desc: "إقامة فاخرة"
        },
        {
          icon: "📱",
          title: "شرائح نت مجانية",
          desc: "مع باقة إنترنت"
        },
        {
          icon: "💐",
          title: "استقبال بالورد",
          desc: "عند الوصول للمطار"
        }
      ]
    }
  };

  const t = content[lang] || content.ar;
  const isRTL = lang === "ar";

  // Category icons mapping
  const categoryIcons = {
    "Honeymoon Special": <FaRing />,
    "New Year Special": <FaGlassCheers />,
    "Limited Spots": <FaUsers />,
    "Most Popular": <FaStar />,
    "Best Value": <FaStar />,
    "Luxury": <FaHotel />,
    "عرض شهر العسل": <FaRing />,
    "عرض رأس السنة": <FaGlassCheers />,
    "أماكن محدودة": <FaUsers />,
    "الأكثر شيوعاً": <FaStar />,
    "أفضل قيمة": <FaStar />,
    "فاخر": <FaHotel />
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="offers-page">
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
            <source src="/january-bg.mp4" type="video/mp4" />
            <source src="/desert.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>
        </div>
        
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-10 mx-auto text-center text-white">
              <div className="hero-content">
                {/* <div className="badge-container mb-4">
                  <span className="month-badge">JANUARY</span>
                </div> */}
                <h1 className="display-4 fw-bold mb-4">{t.heroTitle}</h1>
                <p className="lead mb-5">{t.heroSubtitle}</p>
                {/* <div className="discount-badge">
                  <span className="discount-text">{t.discountText}</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="info-section py-5">
        <div className="container">
          <div className="row g-4">
            {t.additionalInfo.map((info, index) => (
              <div key={index} className="col-md-3 col-sm-6">
                <div className="info-card">
                  <div className="info-icon">{info.icon}</div>
                  <h5>{info.title}</h5>
                  <p>{info.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Grid Section */}
      <section className="offers-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title mb-3">{t.featuredOffers}</h2>
            <div className="section-divider"></div>
            <p className="text-muted mt-3">Choose from our exclusive January packages</p>
          </div>

          <div className="row g-4 justify-content-center">
            {t.offers.map((offer) => (
              <div key={offer.id} className="col-lg-4 col-md-6">
                <div className="offer-card">
                  {/* Offer Category */}
                  <div className="offer-category">
                    <span>{offer.category}</span>
                  </div>

                  {/* Offer Badge with Icon */}
                  {offer.badge && (
                    <div className={`offer-badge ${offer.badge.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                      <span className="badge-icon">
                        {categoryIcons[offer.badge] || <FaStar />}
                      </span>
                      {offer.badge}
                    </div>
                  )}

                  {/* Discount Ribbon */}
                  <div className={`discount-ribbon ${isRTL ? 'rtl' : 'ltr'}`}>
                    {offer.discount} {isRTL ? "خصم" : "OFF"}
                  </div>

                  {/* Offer Image */}
                  <div className="offer-image">
                    <img 
                      src={offer.image} 
                      alt={offer.title}
                      className="img-fluid"
                      onError={(e) => {
                        e.target.src = `/offers/default-${offer.id}.jpg`;
                      }}
                    />
                    <div className="image-overlay"></div>
                  </div>

                  <div className="offer-content">
                    <h3 className="offer-title">{offer.title}</h3>
                    <p className="offer-description">{offer.description}</p>

                    {/* Itinerary */}
                    <div className="itinerary-section">
                      <h6 className="itinerary-title">
                        <FaPlane className="me-2" />
                        {isRTL ? "المسار الزمني" : "Itinerary"}
                      </h6>
                      <div className="itinerary-list">
                        {offer.itinerary.map((item, index) => (
                          <div key={index} className="itinerary-item">
                            <FaClock className="me-2" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Offer Highlights */}
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
                      <h6><FaStar className="me-2" />{t.included}:</h6>
                      <div className="features-grid">
                        {offer.features.slice(0, 4).map((feature, index) => (
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
                              ? `أرغب في الحصول على معلومات عن: ${offer.title} - ${offer.duration}`
                              : `I'm interested in: ${offer.title} - ${offer.duration}`
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

          {/* Special Note */}
          <div className="special-note mt-5">
            <div className="alert alert-warning">
              <div className="d-flex align-items-center">
                <FaStar className="me-3" />
                <div>
                  <strong>{isRTL ? "ملاحظة:" : "Note:"}</strong> 
                  {isRTL 
                    ? " جميع العروض تشمل الاستقبال في المطار مع الورد وشرائح الإنترنت المجانية. الأسعار قابلة للتغيير حسب التوافر."
                    : " All offers include airport reception with flowers and free internet SIM cards. Prices subject to availability."
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-wrapper text-center">
            <h3 className="cta-title mb-4">
              {isRTL ? "احجز عرضك الآن" : "Book Your Package Now"}
            </h3>
            <p className="cta-text mb-4">
              {isRTL 
                ? "تواصل معنا للحصول على أفضل الأسعار والمزايا الحصرية لشهر يناير"
                : "Contact us for best prices and exclusive January benefits"
              }
            </p>
            <a
              href="https://wa.me/+966547305060"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-lg"
            >
              <FaWhatsapp className={isRTL ? "ms-2" : "me-2"} />
              {isRTL ? "تواصل عبر الواتساب" : "Chat on WhatsApp"}
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .offers-page {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          font-family: 'Tajawal', sans-serif;
        }

        .offers-hero {
          position: relative;
          padding: 120px 0 80px;
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
            rgba(138, 119, 121, 0.6) 0%, 
            rgba(239, 200, 174, 0.9) 100%
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

        .badge-container {
          position: relative;
          display: inline-block;
        }

        .month-badge {
          background: linear-gradient(45deg, #e74c3c, #c0392b);
          color: white;
          padding: 12px 30px;
          border-radius: 25px;
          font-weight: 700;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .hero-content h1 {
          font-weight: 800;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          line-height: 1.3;
          font-family: 'Tajawal', sans-serif;
          color: white;
        }

        .hero-content .lead {
          font-size: 1.3rem;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.95);
        }

        .discount-badge {
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          color: #000;
          padding: 18px 35px;
          border-radius: 50px;
          display: inline-block;
          font-weight: bold;
          font-size: 1.3rem;
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
          border: 3px solid rgba(255,255,255,0.3);
          margin-top: 20px;
        }

        .info-section {
          background: white;
          padding: 60px 0;
        }

        .info-card {
          text-align: center;
          padding: 30px 20px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.08);
          transition: transform 0.3s ease;
          height: 100%;
          border: 1px solid #f0f0f0;
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
        }

        .info-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .info-card h5 {
          color: #2c3e50;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .info-card p {
          color: #7f8c8d;
          font-size: 0.9rem;
          margin: 0;
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
          margin-bottom: 30px;
        }

        .offer-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .offer-category {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(255, 255, 255, 0.95);
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #8a7779;
          z-index: 2;
          backdrop-filter: blur(5px);
        }

        .offer-badge {
          position: absolute;
          top: 15px;
          ${isRTL ? 'right: 15px;' : 'left: 15px;'}
          padding: 10px 18px;
          border-radius: 25px;
          font-size: 0.85rem;
          font-weight: 700;
          z-index: 2;
          text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 8px;
          backdrop-filter: blur(5px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .offer-badge .badge-icon {
          font-size: 0.9rem;
        }

        .offer-badge.عرض-شهر-العسل,
        .offer-badge.honeymoon-special {
          color: #e84393;
        }

        .offer-badge.عرض-رأس-السنة,
        .offer-badge.new-year-special {
          color: #e74c3c;
        }

        .offer-badge.الأكثر-شيوعاً,
        .offer-badge.most-popular {
          color: #f39c12;
        }

        .offer-badge.أفضل-قيمة,
        .offer-badge.best-value {
          color: #27ae60;
        }

        .offer-badge.فاخر,
        .offer-badge.luxury {
          color: #9b59b6;
        }

        .discount-ribbon {
          position: absolute;
          top: 20px;
          ${isRTL ? 'left: -35px;' : 'right: -35px;'}
          background: linear-gradient(45deg, #e74c3c, #c0392b);
          color: white;
          padding: 10px 45px;
          font-weight: bold;
          font-size: 0.9rem;
          z-index: 2;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          transform: ${isRTL ? 'rotate(-45deg)' : 'rotate(45deg)'};
        }

        .offer-image {
          height: 220px;
          overflow: hidden;
          position: relative;
        }

        .offer-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%);
        }

        .offer-card:hover .offer-image img {
          transform: scale(1.1);
        }

        .offer-content {
          padding: 25px;
        }

        .offer-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #2c3e50;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .offer-description {
          color: #5d6d7e;
          margin-bottom: 15px;
          line-height: 1.6;
          font-size: 0.95rem;
          min-height: 70px;
        }

        .itinerary-section {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 15px;
          border-left: 4px solid #8a7779;
        }

        .itinerary-title {
          color: #2c3e50;
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }

        .itinerary-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .itinerary-item {
          font-size: 0.85rem;
          color: #5d6d7e;
          display: flex;
          align-items: center;
        }

        .offer-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
        }

        .highlight-tag {
          background: linear-gradient(45deg, #8a7779, #a89294);
          color: white;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 600;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .offer-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          padding: 15px 0;
          border-top: 1px solid #ecf0f1;
          border-bottom: 1px solid #ecf0f1;
          flex-wrap: wrap;
          gap: 10px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #7f8c8d;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .detail-icon {
          color: #8a7779;
          font-size: 1rem;
        }

        .features-list h6 {
          color: #2c3e50;
          margin-bottom: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          margin-bottom: 20px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #5d6d7e;
          font-weight: 500;
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
          padding-top: 20px;
          border-top: 1px solid #ecf0f1;
        }

        .cta-buttons {
          display: flex;
          gap: 10px;
          width: 100%;
        }

        .btn-book {
          background: #EFC8AE;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 700;
          color: #000;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          box-shadow: 0 4px 15px rgba(223, 165, 40, 0.3);
          flex: 1;
        }

        .btn-book:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(223, 165, 40, 0.5);
          color: #000;
        }

        .section-title {
          color: #5a4606ff;
          font-weight: 800;
          font-size: 2.2rem;
          position: relative;
          margin-bottom: 1rem;
        }

        .section-divider {
          width: 80px;
          height: 4px;
          background: linear-gradient(45deg, #8a7779, #efc8ae);
          margin: 0 auto;
          border-radius: 2px;
        }

        .special-note .alert {
          background: linear-gradient(45deg, #fff9e6, #fff3cd);
          border: 1px solid #ffeaa7;
          color: #856404;
          border-radius: 15px;
          padding: 20px;
        }

        .cta-section {
          background: linear-gradient(135deg, #8a7779, #a89294);
          padding: 60px 0;
          color: white;
        }

        .cta-wrapper {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .cta-text {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 30px;
        }

        .btn-success {
          background: #EFC8AE;
          border: none;
          color: #000 !important;
          padding: 15px 35px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: 0 8px 25px rgba(223, 165, 40, 0.4);
          transition: all 0.3s ease;
        }

        .btn-success:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(223, 165, 40, 0.6);
          color: #000 !important;
        }

        @media (max-width: 992px) {
          .offers-hero {
            padding: 100px 0 60px;
            min-height: 60vh;
          }

          .hero-content h1 {
            font-size: 2rem;
          }

          .hero-content .lead {
            font-size: 1.1rem;
          }

          .info-section {
            padding: 40px 0;
          }
        }

        @media (max-width: 768px) {
          .offer-card {
            margin-bottom: 20px;
          }

          .info-card {
            padding: 20px 15px;
          }

          .month-badge {
            padding: 10px 20px;
            font-size: 1rem;
          }

          .cta-title {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 576px) {
          .offers-hero {
            padding: 80px 0 40px;
          }

          .hero-content h1 {
            font-size: 1.8rem;
          }

          .discount-badge {
            padding: 12px 25px;
            font-size: 1rem;
          }

          .offer-content {
            padding: 20px 15px;
          }

          .section-title {
            font-size: 1.8rem;
          }

          .cta-section {
            padding: 40px 20px;
          }

          .btn-success {
            padding: 12px 25px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}