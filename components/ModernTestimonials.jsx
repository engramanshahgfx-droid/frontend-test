"use client";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function ModernTestimonials({ lang }) {
  const testimonials = {
    en: [
      {
        name: "Sarah Jenkins",
        role: "Adventure Enthusiast",
        text: "The AlUla tour was breathtaking. Everything from transport to local guides was perfectly planned by Tilal Rimal.",
        rating: 5,
        avatar: "SJ"
      },
      {
        name: "Fahad Al-Harbi",
        role: "Corporate Trip Organizer",
        text: "Organized our company team-building trip to Tabuk. Outstanding coordination and very professional staff.",
        rating: 5,
        avatar: "FH"
      },
      {
        name: "Elena Rostova",
        role: "Cultural Travel Blogger",
        text: "Highly recommend their private guides! We discovered ancient heritage sites that typical tourists never get to see.",
        rating: 5,
        avatar: "ER"
      },
      {
        name: "Khalid Al-Dossary",
        role: "Family Traveler",
        text: "Perfect family vacation in the Maldives. They handled all bookings, flights, and transfers seamlessly.",
        rating: 5,
        avatar: "KD"
      },
      {
        name: "James Miller",
        role: "Solo Backpacker",
        text: "Outstanding customer service. They helped me secure my Saudi tourist e-visa in less than 24 hours!",
        rating: 5,
        avatar: "JM"
      },
      {
        name: "Laila bin Omar",
        role: "Local Explorer",
        text: "The domestic trips packages are fantastic. Great hotels and amazing food experiences throughout Saudi Arabia.",
        rating: 5,
        avatar: "LO"
      },
      {
        name: "Robert Chen",
        role: "Photography Enthusiast",
        text: "Our desert safari trip was unforgettable. Beautiful dunes, traditional dinners, and perfect photography spots.",
        rating: 5,
        avatar: "RC"
      },
      {
        name: "Aisha Al-Mutairi",
        role: "Frequent Client",
        text: "I always book my vacations through Tilal Rimal. Their customized packages are unmatched in quality and price.",
        rating: 5,
        avatar: "AM"
      },
      {
        name: "David Vane",
        role: "VIP Traveler",
        text: "The private jet booking service was flawless. Exemplary attention to detail and luxury at every step.",
        rating: 5,
        avatar: "DV"
      },
      {
        name: "Mona Al-Qahtani",
        role: "Heritage Researcher",
        text: "An incredibly rich cultural experience. The guides are deeply knowledgeable and very welcoming.",
        rating: 5,
        avatar: "MQ"
      }
    ],
    ar: [
      {
        name: "سارة جينكينز",
        role: "مُحبة للمغامرات",
        text: "رحلتنا إلى العلا كانت مذهلة. كل شيء من المواصلات إلى المرشدين المحليين تم التخطيط له بإتقان من تلال ورمال.",
        rating: 5,
        avatar: "سج"
      },
      {
        name: "فهد الحربي",
        role: "منظم رحلات شركات",
        text: "نظمنا رحلة بناء الفريق لشركتنا إلى تبوك. تنسيق متميز للغاية وطاقم عمل محترف.",
        rating: 5,
        avatar: "فح"
      },
      {
        name: "إيلينا روستوفا",
        role: "مدونة رحلات ثقافية",
        text: "أوصي بشدة بالمرشدين الخاصين لديهم! اكتشفنا مواقع تراثية قديمة لا يراها السياح العاديون عادةً.",
        rating: 5,
        avatar: "أر"
      },
      {
        name: "خالد الدوسري",
        role: "مسافر عائلي",
        text: "عطلة عائلية مثالية في جزر المالديف. لقد تعاملوا مع جميع الحجوزات والطيران والانتقالات بسلاسة تامة.",
        rating: 5,
        avatar: "خد"
      },
      {
        name: "جيمس ميلر",
        role: "رحالة منفرد",
        text: "خدمة عملاء استثنائية. لقد ساعدوني في الحصول على التأشيرة السياحية السعودية في أقل من 24 ساعة!",
        rating: 5,
        avatar: "جم"
      },
      {
        name: "ليلى بن عمر",
        role: "مستكشفة محلية",
        text: "باقات الرحلات المحلية رائعة. فنادق ممتازة وتجارب طعام مذهلة في جميع أنحاء المملكة العربية السعودية.",
        rating: 5,
        avatar: "لم"
      },
      {
        name: "روبرت تشين",
        role: "هاوي تصوير",
        text: "كانت رحلة السفاري الصحراوية لا تُنسى. كثبان رملية جميلة، وعشاء تقليدي، ونقاط تصوير مثالية.",
        rating: 5,
        avatar: "رت"
      },
      {
        name: "عائشة المطيري",
        role: "عميل دائم",
        text: "أحجز عطلاتي دائمًا من خلال تلال ورمال. باقاتهم المخصصة لا مثيل لها في الجودة والسعر.",
        rating: 5,
        avatar: "عم"
      },
      {
        name: "ديفيد فان",
        role: "مسافر VIP",
        text: "كانت خدمة حجز الطائرات الخاصة خالية من العيوب. اهتمام نموذجي بالتفاصيل والفخامة في كل خطوة.",
        rating: 5,
        avatar: "دف"
      },
      {
        name: "منى القحطاني",
        role: "باحثة تراثية",
        text: "تجربة ثقافية غنية بشكل لا يصدق. المرشدون لديهم معرفة عميقة ويرحبون بالجميع بلطف.",
        rating: 5,
        avatar: "مق"
      }
    ]
  };

  const list = testimonials[lang] || testimonials.en;

  // Duplicate list to achieve continuous marquee scrolling effect
  const marqueeItems = [...list, ...list];

  return (
    <section className="modern-testimonials-section" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="section-header">
          <span className="accent-tag">{lang === "ar" ? "آراء عملائنا" : "TESTIMONIALS"}</span>
          <h2>{lang === "ar" ? "قصص وتجارب حقيقية" : "Stories From Our Travelers"}</h2>
        </div>
      </div>

      <div className="testimonials-marquee">
        <div className="marquee-track">
          {marqueeItems.map((item, index) => (
            <div key={index} className="testimonial-card">
              <div className="card-top">
                <div className="user-avatar">{item.avatar}</div>
                <div className="user-meta">
                  <h4>{item.name}</h4>
                  <span>{item.role}</span>
                </div>
              </div>
              <div className="stars-row">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={15} fill="#E85D1F" stroke="#E85D1F" />
                ))}
              </div>
              <p className="testimonial-text">“{item.text}”</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .modern-testimonials-section {
          padding: 100px 0;
          background: #FAF6F0; /* Soft Desert Sand */
          overflow: hidden;
          position: relative;
        }

        .section-header {
          text-align: center;
          margin-bottom: 50px;
          padding: 0 20px;
        }

        .accent-tag {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: #E85D1F;
          display: inline-block;
          margin-bottom: 12px;
          font-family: 'Tajawal', sans-serif;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1C0052; /* Deep Heritage Purple */
          margin: 0;
          font-family: 'Tajawal', sans-serif;
        }

        .testimonials-marquee {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 20px 0;
          display: flex;
        }

        /* Fading side gradients */
        .testimonials-marquee::before,
        .testimonials-marquee::after {
          content: '';
          position: absolute;
          top: 0;
          width: 200px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .testimonials-marquee::before {
          left: 0;
          background: linear-gradient(to right, #FAF6F0 0%, rgba(250, 246, 240, 0) 100%);
        }

        .testimonials-marquee::after {
          right: 0;
          background: linear-gradient(to left, #FAF6F0 0%, rgba(250, 246, 240, 0) 100%);
        }

        .marquee-track {
          display: flex;
          gap: 30px;
          width: max-content;
          animation: marquee-scroll 45s linear infinite;
        }

        .testimonials-marquee:hover .marquee-track {
          animation-play-state: paused;
        }

        .testimonial-card {
          flex-shrink: 0;
          width: 320px;
          background: #ffffff;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(28, 0, 82, 0.03);
          border: 1px solid rgba(28, 0, 82, 0.05);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(28, 0, 82, 0.08);
          border-color: rgba(232, 93, 31, 0.15);
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(28, 0, 82, 0.06);
          color: #1C0052;
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
          border: 1px solid rgba(28, 0, 82, 0.08);
        }

        .testimonial-card:hover .user-avatar {
          background: #1C0052;
          color: #ffffff;
        }

        .user-meta h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #1C0052;
          margin: 0 0 3px 0;
          font-family: 'Tajawal', sans-serif;
        }

        .user-meta span {
          font-size: 0.8rem;
          color: #888;
          display: block;
          font-family: 'Tajawal', sans-serif;
        }

        .stars-row {
          display: flex;
          gap: 4px;
          margin-bottom: 15px;
        }

        .testimonial-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #555;
          margin: 0;
          font-family: 'Tajawal', sans-serif;
          font-style: italic;
        }

        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Adjust direction for RTL layouts */
        [dir="rtl"] .marquee-track {
          animation: marquee-scroll-rtl 45s linear infinite;
        }

        @keyframes marquee-scroll-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(50%);
          }
        }

        @media (max-width: 768px) {
          .section-header h2 {
            font-size: 2rem;
          }
          .testimonial-card {
            width: 280px;
            padding: 20px;
          }
          .testimonials-marquee::before,
          .testimonials-marquee::after {
            width: 80px;
          }
        }
      `}</style>
    </section>
  );
}
