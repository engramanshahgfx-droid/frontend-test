"use client";
import { useState, useEffect } from "react";
import { FaStar, FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function Testimonials({ lang = "en" }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonialsContent = {
    en: [
      {
        name: "righteous",
        quote: "Our trip to the Hail Mountains was a wonderful experience! Everything was excellently organized, and the staff was very helpful.",
        rating: 5,
      },
      {
        name: "pleasant",
        quote: "Tourism in Saudi Arabia with your team is different, like you've never seen it before. Thank you, Hills and Sands team.",
        rating: 5,
      },
      {
        name: "immortal",
        quote: "Special thanks to Omar for his attention to the smallest details of the adventure and to the cooperative team; a truly unique experience.",
        rating: 5,
      },
      {
        name: "satisfied",
        quote: "Amazing service and unforgettable memories. The attention to detail and customer care was exceptional throughout our journey.",
        rating: 5,
      },
      {
        name: "adventurer",
        quote: "The desert safari experience was breathtaking! Professional guides and well-planned itinerary made our trip memorable.",
        rating: 5,
      },
      {
        name: "explorer",
        quote: "From start to finish, everything was perfectly arranged. We felt safe and well taken care of during our entire Saudi adventure.",
        rating: 5,
      },
    ],
    ar: [
      {
        name: "الصالح",
        quote: "رحلتنا إلى جبال حائل كانت تجربة رائعة! كل شيء كان منظمًا بشكل ممتاز، والطاقم كان مفيدًا جدًا.",
        rating: 5,
      },
      {
        name: "الممتع",
        quote: "السياحة في السعودية مع فريقكم مختلفة، مثلما لم ترها من قبل. شكرًا لكم فريق التلال والرمال.",
        rating: 5,
      },
      {
        name: "الخالد",
        quote: "شكر خاص لعمر على اهتمامه بأدق تفاصيل المغامرة وإلى الفريق المتعاون؛ تجربة فريدة حقًا.",
        rating: 5,
      },
      {
        name: "الراضي",
        quote: "خدمة مذهلة وذكريات لا تنسى. الاهتمام بالتفاصيل والرعاية للعملاء كان استثنائيًا طوال رحلتنا.",
        rating: 5,
      },
      {
        name: "المغامر",
        quote: "تجربة سفاري الصحراء كانت رائعة! المرشدون المحترفون والبرنامج المُخطط جيدًا جعلوا رحلتنا لا تُنسى.",
        rating: 5,
      },
      {
        name: "المستكشف",
        quote: "من البداية إلى النهاية، كل شيء كان مُرتبًا بشكل مثالي. شعرنا بالأمان والرعاية الجيدة خلال مغامرتنا في السعودية.",
        rating: 5,
      },
    ],
  };

  const testimonials = testimonialsContent[lang] || testimonialsContent.en;
  const slidesToShow = 4;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (testimonials.length - slidesToShow + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? testimonials.length - slidesToShow : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const visibleTestimonials = testimonials.slice(currentSlide, currentSlide + slidesToShow);

  return (
    <section className="testimonials-section" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="container">
        <div className="testimonials-header text-center mb-5">
          <h2 className="section-title">
            {lang === "ar" ? "آراء عملائنا" : "What Our Customers Say"}
          </h2>
          <p className="section-subtitle">
            {lang === "ar" ? "تجارب حقيقية من مسافرينا السعداء" : "Real experiences from our happy travelers"}
          </p>
        </div>

        <div className="testimonials-slider">
          <div className="testimonials-container">
            {visibleTestimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-item">
                <div className="testimonial-card">
                  <p className="evaluate">{testimonial.quote}</p>
                  
                  <div className="info-content">
                    <div className="client-info">
                      <div className="name-job">
                        <h6 className="name">{testimonial.name}</h6>
                      </div>
                    </div>
                    
                    <div className="ova-rating">
                      <div className="star-rating" title="5/5">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <i key={i} className="star-full">
                            <FaStar />
                          </i>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="slider-nav">
            <button className="nav-btn prev" onClick={prevSlide}>
              <FaAngleLeft />
            </button>
            <button className="nav-btn next" onClick={nextSlide}>
              <FaAngleRight />
            </button>
          </div>

          {/* Dots */}
          <div className="slider-dots">
            {Array.from({ length: testimonials.length - slidesToShow + 1 }).map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              >
                <span></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonials-section {
          padding: 80px 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          font-family: 'Tajawal', sans-serif;
        }

        .section-title {
          color: #2c3e50;
          font-weight: 800;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          color: #5d6d7e;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .testimonials-slider {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .testimonials-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 2rem;
        }

        .testimonial-item {
          min-width: 0;
        }

        .testimonial-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: all 0.3s ease;
          height: 100%;
          border: 1px solid rgba(138, 119, 121, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .evaluate {
          color: #2c3e50;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-style: italic;
          flex-grow: 1;
        }

        .info-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
        }

        .name-job h6 {
          color: #8a7779;
          font-weight: 700;
          font-size: 1rem;
          margin: 0;
          text-transform: capitalize;
        }

        .ova-rating {
          display: flex;
          justify-content: center;
        }

        .star-rating {
          display: flex;
          gap: 2px;
        }

        .star-full {
          color: #ffd700;
          font-size: 1rem;
        }

        /* Navigation */
        .slider-nav {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .nav-btn {
          background: #8a7779;
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .nav-btn:hover {
          background: #a89294;
          transform: scale(1.1);
        }

        /* Dots */
        .slider-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .dot {
          background: #d1d5db;
          border: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          background: #8a7779;
          transform: scale(1.2);
        }

        .dot span {
          display: none;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .testimonials-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 991px) {
          .testimonials-container {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .testimonial-card {
            padding: 1.5rem;
          }
        }

        @media (max-width: 767px) {
          .testimonials-container {
            grid-template-columns: 1fr;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .testimonials-section {
            padding: 60px 0;
          }
          
          .testimonial-card {
            padding: 1.5rem;
          }
        }

        @media (max-width: 575px) {
          .section-title {
            font-size: 1.8rem;
          }
          
          .evaluate {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
}