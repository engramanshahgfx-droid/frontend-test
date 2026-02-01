"use client";

import React, { useState } from "react";
import {
  FaSun,
  FaSnowflake,
  FaSeedling,
  FaLeaf,
  FaCreditCard,
  FaHospital,
  FaMapMarkerAlt,
  FaPhone,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";

export default function TravelInfo({ lang }) {
  const [playingVideo, setPlayingVideo] = useState(null);
  const [muted, setMuted] = useState(true);

  const content = {
    ar: {
      heroTitle: "سحر الطبيعة كما لم تره من قبل",
      heroSubtitle: "اكتشف المملكة من منظور جديد",
      heroDescription: "دعنا نخطط.. وأنت استمتع بالرحلة",

      sectionTitle: "معلومات مهمة خلال زيارتك",
      sectionDescription:
        "زيارة السعودية هي فرصة رائعة للتمتع بتراثها الأصيل وكرم الضيافة والمناظر الخلابة، ولمساعدتك على اكتشاف المملكة بكل متعة وسهولة، جمعنا لك بعض المعلومات التي ستفيدك خلال التنقل والتسوق والتواصل مع السكان.",

      seasonsTitle: "فصول السنة في السعودية",
      seasonsSubtitle: "متى تخطط لزيارة المملكة؟",

      seasons: [
        {
          id: 1,
          name: "صيفها",
          icon: <FaSun size={40} />,
          image: "/summer.png",
          video: "/summer-saudi.mp4",
          description:
            "يعتبر فصل الصيف في المملكة الوقت المثالي للاستمتاع بالسباحة واستكشاف العديد من مواقع الغوص الساحرة في أعماق البحار السعودية وتجربة الغطس السطحي والإبحار، وغيرها. وللتمتع بأجواء صيفية باردة يُنصح بزيارة جبال الطائف أو الاستجمام قرب مياه الخليج في الدمام.",
          activities: [
            "السباحة",
            "الغوص",
            "الإبحار",
            "زيارة جبال الطائف",
            "الاستجمام في الخليج",
          ],
        },
        {
          id: 2,
          name: "شتاؤها",
          icon: <FaSnowflake size={40} />,
          image: "/winter1.png",
          video: "/winter-saudi.mp4",
          description:
            "يكون الشتاء في السعودية معتدلاً نهاراً وبارداً ليلاً، وهو مثالي للتخييم أو تسلق الصخور أو استكشاف المدن السعودية النابضة بالحياة، وتعتبر مدينة العُلا من أهم الوجهات الشتوية لما تحتويه من المواقع الأثرية الساحرة مثل المقابر القديمة، كما يمكن الاستمتاع بمنظر الثلوج عند زيارة المناطق الشمالية ومنطقة عسير.",
          activities: [
            "التخييم",
            "تسلق الصخور",
            "استكشاف العلا",
            "مشاهدة الثلوج",
            "الزيارات الأثرية",
          ],
        },
        {
          id: 3,
          name: "ربيعها",
          icon: <FaSeedling size={40} />,
          image: "/spring1.png",
          video: "/spring-saudi.mp4",
          description:
            "تختلف أجواء المملكة في الربيع حسب المنطقة، فيكون الطقس مائلاً للبرودة في الشمال (تنخفض درجة الحرارة إلى 15 درجة ليلاً)، ودافئاً في المناطق الوسطى والجنوبية، وممطراً في مرتفعات جبال عسير، أما في الرياض فيكون الجو معتدلاً ومناسباً للنشاطات الخارجية مثل المشي والقيادة على الكثبان الرملية 'التطعيس'.",
          activities: [
            "المشي",
            "التطعيس",
            "زيارة الشمال",
            "استكشاف عسير",
            "الأنشطة الخارجية",
          ],
        },
        {
          id: 4,
          name: "خريفها",
          icon: <FaLeaf size={40} />,
               image: "/autumn1.png",
          video: "/autumn-saudi.mp4",
          description:
            "يكون الطقس في فصل الخريف بارداً ولطيفاً في شمال المملكة العربية السعودية والمرتفعات الجنوبية الغربية، بينما تظل درجات الحرارة أثناء النهار دافئة ويمكن أن تصل إلى الثلاثينيات في أوائل الخريف، وتكون الأمسيات أكثر اعتدالاً ومناسبة للتنزه أو تناول الطعام في الهواء الطلق أو الاستجمام في ينابيع الأحساء الصحراوية سواء المنعشة أو الدافئة.",
          activities: [
            "التنزه",
            "تناول الطعام بالخارج",
            "ينابيع الأحساء",
            "زيارة الشمال",
            "الاستجمام",
          ],
        },
      ],

      paymentTitle: "طرق الدفع والخدمات المالية",
      currencyTitle: "العُملة السعودية",
      currencyDescription:
        "العُملة الوطنية في المملكة العربية السعودية هي الريال السعودي (SAR)، والذي يتألف من 100 هللة. الريال السعودي مرتبط بالدولار الأمريكي بسعر صرف ثابت.",

      paymentMethods: [
        {
          title: "الدفع النقدي",
          description:
            "الريال السعودي هو العملة الرسمية المقبولة في جميع أنحاء المملكة. يمكنك الصرف في المطارات، البنوك، ومكاتب الصرافة المنتشرة.",
          icon: <FaCreditCard size={30} />,
          image: "/cash.png",
        },
        {
          title: "البطاقات الائتمانية",
          description:
            "تقبل معظم المتاجر والفنادق والمطاعم البطاقات الدولية مثل Visa، Mastercard، American Express. كما تدعم Apple Pay وSamsung Pay.",
          icon: <FaCreditCard size={30} />,
          image: "/payment.png",
        },
        {
          title: "أجهزة الصراف الآلي",
          description:
            "تنتشر أجهزة الصراف الآلي في جميع المدن السعودية. استخدم خرائط جوجل للعثور على أقرب جهاز صراف إليك.",
          icon: <FaMapMarkerAlt size={30} />,
          image: "/atm.png",
        },
        {
          title: "التطبيقات المالية",
          description:
            "تطبيقات مثل STC Pay وMada Pay متاحة للدفع الإلكتروني في العديد من المتاجر والمطاعم.",
          icon: <FaPhone size={30} />,
          image: "/pay.png",
        },
      ],

      healthcareTitle: "معلومات تهمك",
      healthcareSubtitle: "الرعاية الصحية والطبية في المملكة",

      healthcareInfo: [
        {
          question: "ماذا لو احتجت إلى زيارة طبيب في السعودية؟",
          answer:
            "في حال احتجت إلى مساعدة طبية يمكنك زيارة أي مستشفى أو عيادة أو مستوصف، حيث يوجد في الكثير منها موظفين يتحدثون الإنجليزية، كما يمكنك التواصل مع سفارتك للحصول على المساعدة، واحرص على التأكد من أن تأمين السفر الخاص بك يغطي نفقات الرعاية الصحية.",
          icon: <FaHospital size={30} />,
          image: "/doctor.jpg",
        },
        {
          question: "من أين يمكن شراء الأدوية في السعودية؟",
          answer:
            "يمكن شراء الأدوية المتداولة مثل مسكنات الألم وشراب السعال وأدوية الحساسية بدون وصفة طبية في معظم الصيدليات (التي تغطي كافة الأماكن والأحياء في السعودية، لكن قد تتطلب الأدوية الأكثر فعالية وصفة طبية.",
          icon: <FaPhone size={30} />,
          image: "/pharmacy.jpg",
        },
      ],

      contactTitle: "هل لديك استفسارات أخرى؟",
      contactDescription:
        "فريقنا متاح للإجابة على جميع استفساراتك وتقديم النصائح لرحلتك",
      contactButton: "تواصل معنا الآن",
    },
    en: {
      heroTitle: "The Magic of Nature As You've Never Seen Before",
      heroSubtitle: "Discover Saudi Arabia from a New Perspective",
      heroDescription: "Let us plan... while you enjoy the journey",

      sectionTitle: "Important Information During Your Visit",
      sectionDescription:
        "Visiting Saudi Arabia is a wonderful opportunity to enjoy its authentic heritage, generous hospitality, and stunning landscapes. To help you discover the Kingdom with ease and pleasure, we've gathered some information that will be useful during your transportation, shopping, and communication with residents.",

      seasonsTitle: "Seasons in Saudi Arabia",
      seasonsSubtitle: "When to Plan Your Visit to the Kingdom?",

      seasons: [
        {
          id: 1,
          name: "Summer",
          icon: <FaSun size={40} />,
          image: "/summer.png",
          video: "/summer-saudi.mp4",
          description:
            "Summer in the Kingdom is the perfect time to enjoy swimming and explore many charming diving sites in the depths of Saudi seas, and experience snorkeling, sailing, and more. To enjoy cool summer atmospheres, it's recommended to visit Taif mountains or relax near the Gulf waters in Dammam.",
          activities: [
            "Swimming",
            "Diving",
            "Sailing",
            "Visiting Taif Mountains",
            "Relaxing in the Gulf",
          ],
        },
        {
          id: 2,
          name: "Winter",
          icon: <FaSnowflake size={40} />,
          image: "/winter1.png",
          video: "/winter-saudi.mp4",
          description:
            "Winter in Saudi Arabia is moderate during the day and cold at night, making it ideal for camping, rock climbing, or exploring vibrant Saudi cities. AlUla is considered one of the most important winter destinations due to its charming archaeological sites like ancient tombs, and you can enjoy snow views when visiting northern regions and Asir region.",
          activities: [
            "Camping",
            "Rock Climbing",
            "Exploring AlUla",
            "Snow Viewing",
            "Archaeological Visits",
          ],
        },
        {
          id: 3,
          name: "Spring",
          icon: <FaSeedling size={40} />,
          image: "/spring1.png",
          video: "/spring-saud.mp4",
          description:
            "The atmosphere in the Kingdom varies in spring depending on the region. The weather tends to be cool in the north (temperature drops to 15°C at night), warm in central and southern regions, and rainy in the highlands of Asir mountains. In Riyadh, the weather is moderate and suitable for outdoor activities like walking and dune bashing.",
          activities: [
            "Walking",
            "Dune Bashing",
            "Visiting the North",
            "Exploring Asir",
            "Outdoor Activities",
          ],
        },
        {
          id: 4,
          name: "Autumn",
          icon: <FaLeaf size={40} />,
               image: "/autumn1.png",
          video: "/autumn-saudi.mp4",
          description:
            "The weather in autumn is cold and pleasant in northern Saudi Arabia and southwestern highlands, while daytime temperatures remain warm and can reach the 30s in early autumn. Evenings are more moderate and suitable for strolling, outdoor dining, or relaxing in the desert springs of Al-Ahsa, whether refreshing or warm.",
          activities: [
            "Strolling",
            "Outdoor Dining",
            "Al-Ahsa Springs",
            "Visiting the North",
            "Relaxation",
          ],
        },
      ],

      paymentTitle: "Payment Methods & Financial Services",
      currencyTitle: "Saudi Currency",
      currencyDescription:
        "The national currency in the Kingdom of Saudi Arabia is the Saudi Riyal (SAR), which consists of 100 Halalas. The Saudi Riyal is pegged to the US Dollar at a fixed exchange rate.",

      paymentMethods: [
        {
          title: "Cash Payment",
          description:
            "Saudi Riyal is the official currency accepted throughout the Kingdom. You can exchange currency at airports, banks, and widespread exchange offices.",
          icon: <FaCreditCard size={30} />,
          image: "/cash.png",
        },
        {
          title: "Credit Cards",
          description:
            "Most stores, hotels, and restaurants accept international cards like Visa, Mastercard, American Express. Apple Pay and Samsung Pay are also supported.",
          icon: <FaCreditCard size={30} />,
          image: "/payment.png",
        },
        {
          title: "ATM Machines",
          description:
            "ATM machines are spread throughout Saudi cities. Use Google Maps to find the nearest ATM to you.",
          icon: <FaMapMarkerAlt size={30} />,
          image: "/atm.png",
        },
        {
          title: "Mobile Payment Apps",
          description:
            "Apps like STC Pay and Mada Pay are available for electronic payments in many stores and restaurants.",
          icon: <FaPhone size={30} />,
          image: "/pay.png",
        },
      ],

      healthcareTitle: "Information That May Interest You",
      healthcareSubtitle: "Healthcare & Medical Services in the Kingdom",

      healthcareInfo: [
        {
          question: "What if you need to visit a doctor in Saudi Arabia?",
          answer:
            "If you need medical assistance, you can visit any hospital, clinic, or medical center, as many of them have English-speaking staff. You can also contact your embassy for assistance, and make sure your travel insurance covers healthcare expenses.",
          icon: <FaHospital size={30} />,
          image: "/doctor.jpg",
        },
        {
          question: "Where can you buy medicines in Saudi Arabia?",
          answer:
            "Common medicines like pain relievers, cough syrup, and allergy medications can be purchased without a prescription at most pharmacies (which cover all areas and neighborhoods in Saudi Arabia), but more effective medications may require a prescription.",
          icon: <FaPhone size={30} />,
          image: "/pharmacy.jpg",
        },
      ],

      contactTitle: "Do you have other inquiries?",
      contactDescription:
        "Our team is available to answer all your questions and provide advice for your trip",
      contactButton: "Contact Us Now",
    },
  };

  const t = content[lang] || content.ar;
  const isRTL = lang === "ar";

  const toggleVideo = (seasonId) => {
    if (playingVideo === seasonId) {
      setPlayingVideo(null);
    } else {
      setPlayingVideo(seasonId);
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="travel-info-page">
      {/* Hero Section with Background Video */}
      <section className="travel-info-hero">
        <div className="hero-video-container">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="hero-background-video"
            poster="/hero-poster.jpg"
          >
            <source src="/saudi-hero.mp4" type="video/mp4" />
            {/* <source src="/videos/saudi-hero.webm" type="video/webm" /> */}
          </video>
          <div className="hero-overlay"></div>
        </div>

        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-8 mx-auto text-center text-white">
              <div className="hero-content">
                <h1 className="display-3 fw-bold mb-4 animate-fade-in">
                  {t.heroTitle}
                </h1>
                <p className="lead mb-3 animate-fade-in-delay">
                  {t.heroSubtitle}
                </p>
                <p className="hero-description animate-fade-in-delay-2">
                  {t.heroDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title mb-3">{t.sectionTitle}</h2>
            <p className="section-description">{t.sectionDescription}</p>
          </div>
        </div>
      </section>

      {/* Seasons Section with Videos */}
      <section className="seasons-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title mb-3">{t.seasonsTitle}</h2>
            <h4 className="seasons-subtitle">{t.seasonsSubtitle}</h4>
          </div>

          <div className="row g-4">
            {t.seasons.map((season) => (
              <div key={season.id} className="col-lg-6">
                <div className="season-card">
                  <div className="season-header">
                    <div className="season-icon">{season.icon}</div>
                    <h3 className="season-name">{season.name}</h3>
                  </div>

                  <div className="season-media-container">
                    {playingVideo === season.id ? (
                      <div className="video-wrapper">
                        <video
                          controls
                          muted={muted}
                          autoPlay
                          className="season-video"
                          poster={season.image}
                        >
                          <source src={season.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <div className="video-controls">
                          <button
                            className="control-btn"
                            onClick={() => toggleVideo(season.id)}
                          >
                            <FaPause />
                          </button>
                          <button className="control-btn" onClick={toggleMute}>
                            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="image-wrapper">
                        <img
                          src={season.image}
                          alt={season.name}
                          className="season-image"
                          onError={(e) => {
                            e.target.src = "/winter.png";
                          }}
                        />
                        <button
                          className="play-btn"
                          onClick={() => toggleVideo(season.id)}
                        >
                          <FaPlay />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="season-content">
                    <p className="season-description">{season.description}</p>
                    <div className="season-activities">
                      <h6>
                        {isRTL ? "الأنشطة المناسبة:" : "Suitable Activities:"}
                      </h6>
                      <div className="activities-grid">
                        {season.activities.map((activity, index) => (
                          <span key={index} className="activity-tag">
                            {activity}
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

      {/* Payment Section with Cards */}
      <section className="payment-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="payment-content">
                <h2 className="section-title mb-4">{t.paymentTitle}</h2>

                <div className="currency-info mb-5">
                  <h4 className="currency-title mb-3">{t.currencyTitle}</h4>
                  <p className="currency-description">
                    {t.currencyDescription}
                  </p>
                  <div className="exchange-rates">
                    <div className="rate-item">
                      <span className="rate-label">1 USD ≈</span>
                      <span className="rate-value">3.75 SAR</span>
                    </div>
                    <div className="rate-item">
                      <span className="rate-label">1 EUR ≈</span>
                      <span className="rate-value">4.10 SAR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="payment-methods-grid">
                {t.paymentMethods.map((method, index) => (
                  <div key={index} className="payment-method-card">
                    <div className="method-image-container">
                      <img
                        src={method.image}
                        alt={method.title}
                        className="method-image"
                        onError={(e) => {
                          e.target.src = "/payment.jpg";
                        }}
                      />
                      <div className="method-overlay"></div>
                    </div>
                    <div className="method-content">
                      <div className="method-icon">{method.icon}</div>
                      <h5 className="method-title">{method.title}</h5>
                      <p className="method-description">{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare Section */}
      <section className="healthcare-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title mb-3">{t.healthcareTitle}</h2>
            <h4 className="healthcare-subtitle">{t.healthcareSubtitle}</h4>
          </div>

          <div className="row g-4">
            {t.healthcareInfo.map((info, index) => (
              <div key={index} className="col-lg-6">
                <div className="healthcare-card">
                  <div className="healthcare-image-container">
                    <img
                      src={info.image}
                      alt={info.question}
                      className="healthcare-image"
                      onError={(e) => {
                        e.target.src = "/healthcare.jpg";
                      }}
                    />
                    <div className="healthcare-overlay"></div>
                  </div>
                  <div className="healthcare-content">
                    <div className="healthcare-icon">{info.icon}</div>
                    <h4 className="healthcare-question">{info.question}</h4>
                    <p className="healthcare-answer">{info.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
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
        .travel-info-page {
          background: #f8f9fa;
          font-family: 'Tajawal', sans-serif;
        }

        .travel-info-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-video-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-background-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(138, 119, 121, 0.8) 0%,
            rgba(42, 67, 113, 0.6) 100%
          );
          z-index: 2;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-content h1 {
          font-weight: 800;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
          line-height: 1.2;
        }

        .hero-content .lead {
          font-size: 1.5rem;
          text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
          font-weight: 600;
        }

        .hero-description {
          font-size: 1.2rem;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
          color: rgba(255, 255, 255, 0.9);
        }

        /* Animations */
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.5s both;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 1s ease-out 1s both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .intro-section,
        .seasons-section,
        .payment-section,
        .healthcare-section,
        .contact-section {
          padding: 80px 0;
        }

        .section-title {
          color: #2c3e50;
          font-weight: 800;
          font-size: 2.5rem;
          position: relative;
          margin-bottom: 1rem;
        }

        .section-description {
          color: #5d6d7e;
          font-size: 1.1rem;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .seasons-subtitle,
        .healthcare-subtitle {
          color: #8a7779;
          font-weight: 600;
        }

        /* Season Cards with Video */
        .season-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
          height: 100%;
        }

        .season-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .season-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .season-icon {
          color: #8a7779;
          padding: 15px;
          border-radius: 50%;
          background: rgba(138, 119, 121, 0.1);
          transition: all 0.3s ease;
        }

        .season-card:hover .season-icon {
          background: rgba(138, 119, 121, 0.2);
          transform: scale(1.1);
        }

        .season-name {
          color: #2c3e50;
          font-weight: 700;
          font-size: 1.5rem;
          margin: 0;
        }

        .season-media-container {
          position: relative;
          margin-bottom: 20px;
          border-radius: 15px;
          overflow: hidden;
        }

        .image-wrapper,
        .video-wrapper {
          position: relative;
          width: 100%;
          height: 250px;
          border-radius: 15px;
          overflow: hidden;
        }

        .season-image,
        .season-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8a7779;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .play-btn:hover {
          background: white;
          transform: translate(-50%, -50%) scale(1.1);
        }

        .video-controls {
          position: absolute;
          bottom: 15px;
          left: 15px;
          display: flex;
          gap: 10px;
        }

        .control-btn {
          background: rgba(0, 0, 0, 0.7);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .control-btn:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.1);
        }

        .season-description {
          color: #5d6d7e;
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .season-activities h6 {
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .activities-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .activity-tag {
          background: linear-gradient(45deg, #8a7779, #a89294);
          color: white;
          padding: 6px 15px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(138, 119, 121, 0.3);
        }

        /* Payment Section */
        .payment-content h2 {
          color: #2c3e50;
          background: linear-gradient(135deg, #8a7779, #2c3e50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .currency-title {
          color: #2c3e50;
          font-weight: 700;
          margin-bottom: 15px;
          font-size: 1.5rem;
        }

        .currency-description {
          color: #5d6d7e;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .exchange-rates {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .rate-item {
          background: white;
          padding: 15px 20px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #8a7779;
        }

        .rate-label {
          color: #5d6d7e;
          font-weight: 500;
          margin-right: 8px;
        }

        .rate-value {
          color: #2c3e50;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .payment-methods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .payment-method-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
        }

        .payment-method-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .method-image-container {
          position: relative;
          height: 160px;
          overflow: hidden;
        }

        .method-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .method-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(0, 0, 0, 0.1)
          );
        }

        .payment-method-card:hover .method-image {
          transform: scale(1.1);
        }

        .method-content {
          padding: 25px;
        }

        .method-icon {
          color: #8a7779;
          margin-bottom: 15px;
          padding: 12px;
          border-radius: 50%;
          background: rgba(138, 119, 121, 0.1);
          display: inline-block;
        }

        .method-title {
          color: #2c3e50;
          font-weight: 700;
          margin-bottom: 10px;
          font-size: 1.2rem;
        }

        .method-description {
          color: #5d6d7e;
          line-height: 1.6;
          margin: 0;
          font-size: 0.95rem;
        }

        /* Healthcare Cards */
        .healthcare-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 100%;
        }

        .healthcare-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .healthcare-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .healthcare-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .healthcare-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(0, 0, 0, 0.2)
          );
        }

        .healthcare-card:hover .healthcare-image {
          transform: scale(1.05);
        }

        .healthcare-content {
          padding: 30px;
        }

        .healthcare-icon {
          color: #8a7779;
          margin-bottom: 20px;
          padding: 15px;
          border-radius: 50%;
          background: rgba(138, 119, 121, 0.1);
          display: inline-block;
        }

        .healthcare-question {
          color: #2c3e50;
          font-weight: 700;
          margin-bottom: 15px;
          font-size: 1.3rem;
          line-height: 1.4;
        }

        .healthcare-answer {
          color: #5d6d7e;
          line-height: 1.7;
          margin: 0;
        }

        /* Contact Section */
        .contact-cta {
          background: white;
          padding: 60px;
          border-radius: 25px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border: 2px solid #ecf0f1;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        }

        .contact-cta h3 {
          color: #2c3e50;
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .contact-cta p {
          color: #5d6d7e;
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .btn-primary {
          background: linear-gradient(45deg, #8a7779, #a89294);
          border: none;
          padding: 18px 45px;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 1.2rem;
          box-shadow: 0 6px 20px rgba(138, 119, 121, 0.4);
          position: relative;
          overflow: hidden;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(138, 119, 121, 0.5);
        }

        .btn-primary::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s;
        }

        .btn-primary:hover::before {
          left: 100%;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .travel-info-hero {
            min-height: 80vh;
          }

          .hero-content h1 {
            font-size: 2.2rem;
          }

          .hero-content .lead {
            font-size: 1.3rem;
          }

          .intro-section,
          .seasons-section,
          .payment-section,
          .healthcare-section,
          .contact-section {
            padding: 60px 0;
          }

          .section-title {
            font-size: 2rem;
          }

          .season-header {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }

          .payment-methods-grid {
            grid-template-columns: 1fr;
          }

          .contact-cta {
            padding: 40px 25px;
          }

          .exchange-rates {
            flex-direction: column;
            gap: 10px;
          }
        }

        @media (max-width: 576px) {
          .hero-content h1 {
            font-size: 1.8rem;
          }

          .season-card,
          .healthcare-card {
            padding: 20px;
          }

          .method-content,
          .healthcare-content {
            padding: 20px;
          }

          .contact-cta {
            padding: 30px 20px;
          }

          .btn-primary {
            padding: 15px 35px;
            font-size: 1.1rem;
          }
        }

        [dir="rtl"] .section-content {
          text-align: right;
        }

        [dir="rtl"] .hero-stats {
          direction: ltr;
        }

        [dir="rtl"] .back-button {
          flex-direction: row-reverse;
        }
      `}</style>
    </div>
  );
}
