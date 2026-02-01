"use client";
import React from 'react';
import Slider from 'react-slick';

export default function CoverBanner({ lang, data }) {
  // Fallback data in case props are undefined
  const safeData = data || {
    title: "The Magic of Nature As You've Never Seen Before",
    subtitle: "Discover the Kingdom from a New Perspective",
    description: "Let us plan.. and you enjoy the journey",
    featuredTrips: [
      {
        title: "Egyptian Night",
        description: "Enjoy evening activities in natural surroundings",
        badge: "Featured",
        image: "/trips/egyptian-night.jpg"
      },
      {
        title: "Jeddah Winter",
        description: "Enjoy evening activities in natural surroundings", 
        badge: "Featured",
        image: "/trips/jeddah-winter.jpg"
      },
      {
        title: "Foundation Day",
        description: "Experience different atmospheres",
        badge: "Featured", 
        image: "/trips/foundation-day.jpg"
      }
    ]
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false
  };

  return (
    <section className="cover-banner">
      <Slider {...settings}>
        {/* Main Hero Slide */}
        <div className="hero-slide">
          <div className="slide-background" 
            style={{ 
              backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/banners/hero-1.jpg')" 
            }}>
            <div className="container">
              <div className="row align-items-center min-vh-100">
                <div className="col-lg-8 text-white">
                  <h1 className="display-3 fw-bold mb-4">{safeData.title}</h1>
                  <h2 className="display-6 mb-4">{safeData.subtitle}</h2>
                  <p className="lead mb-5">{safeData.description}</p>
                  <div className="d-flex gap-3">
                    <button className="btn btn-primary btn-lg">
                      {lang === 'ar' ? 'استكشف الرحلات' : lang === 'zh' ? '探索旅行' : 'Explore Trips'}
                    </button>
                    <button className="btn btn-outline-light btn-lg">
                      {lang === 'ar' ? 'عرض المزيد' : lang === 'zh' ? '查看更多' : 'View More'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Trips Slides */}
        {safeData.featuredTrips && safeData.featuredTrips.map((trip, index) => (
          <div key={index} className="trip-slide">
            <div className="slide-background" 
              style={{ 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${trip.image || '/banners/default-trip.jpg'}')` 
              }}>
              <div className="container">
                <div className="row align-items-center min-vh-100">
                  <div className="col-lg-6 text-white">
                    <span className="badge bg-warning text-dark mb-3">{trip.badge || 'Featured'}</span>
                    <h2 className="display-4 fw-bold mb-4">{trip.title || 'Featured Trip'}</h2>
                    <p className="lead mb-5">{trip.description || 'Experience amazing adventures'}</p>
                    <button className="btn btn-primary btn-lg">
                      {lang === 'ar' ? 'عرض التفاصيل' : lang === 'zh' ? '查看详情' : 'View Details'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <style jsx>{`
        .cover-banner {
          position: relative;
        }
        .hero-slide, .trip-slide {
          position: relative;
        }
        .slide-background {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
        .min-vh-100 {
          min-height: 100vh;
        }
        
        @media (max-width: 768px) {
          .display-3 {
            font-size: 2.5rem;
          }
          .display-4 {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
}