"use client";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";

export default function PartnerCarousel({ lang }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch(`${API_URL}/partners`);
      const data = await response.json();
      if (data.success) {
        setPartners(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return "";
    if (/^https?:\/\//.test(img)) return img;
    const backendBase = API_URL.replace(/\/api\/?$/, "");
    if (img.startsWith("/")) return `${backendBase}${img}`;
    return `${backendBase}/storage/${img}`;
  };

  if (loading || partners.length === 0) return null;

  // Duplicate items to ensure smooth infinite scrolling loop
  const carouselItems = [...partners, ...partners, ...partners];

  return (
    <section className="partner-carousel-section" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="section-title">
          <h3>{lang === "ar" ? "شركاء النجاح" : "Our Trusted Partners"}</h3>
        </div>
        
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {carouselItems.map((partner, index) => (
              <div key={index} className="marquee-item">
                <img
                  src={getImageUrl(partner.logo)}
                  alt={partner.name}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .partner-carousel-section {
          padding: 50px 0 60px;
          background: #ffffff; /* Clean white contrast background */
          border-top: 1px solid rgba(28, 0, 82, 0.05);
          overflow: hidden;
        }

        .section-title {
          text-align: center;
          margin-bottom: 35px;
        }

        .section-title h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1C0052; /* Deep Heritage Purple */
          position: relative;
          display: inline-block;
          font-family: 'Tajawal', sans-serif;
          letter-spacing: -0.3px;
        }

        .section-title h3:after {
          content: '';
          display: block;
          width: 40px;
          height: 2px;
          background: #E85D1F; /* Desert Sunset Orange underline */
          margin: 8px auto 0;
        }

        .marquee-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 10px 0;
          display: flex;
        }

        /* Gradient mask for smooth fade edges on desktop */
        .marquee-wrapper::before,
        .marquee-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          width: 150px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .marquee-wrapper::before {
          left: 0;
          background: linear-gradient(to right, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
        }

        .marquee-wrapper::after {
          right: 0;
          background: linear-gradient(to left, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
        }

        .marquee-track {
          display: flex;
          align-items: center;
          gap: 60px;
          width: max-content;
          animation: marquee 25s linear infinite;
        }

        /* Pause animation on hover */
        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }

        .marquee-item {
          flex-shrink: 0;
          width: 150px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .marquee-item img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          opacity: 0.65;
          filter: grayscale(100%);
          transition: all 0.3s ease;
        }

        .marquee-item:hover img {
          opacity: 1;
          filter: grayscale(0%);
          transform: scale(1.05);
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        /* Adjust direction for RTL layouts */
        [dir="rtl"] .marquee-track {
          animation: marquee-rtl 25s linear infinite;
        }

        [dir="rtl"] .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes marquee-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(33.333%);
          }
        }

        @media (max-width: 768px) {
          .partner-carousel-section {
            padding: 40px 0;
          }
          .marquee-item {
            width: 120px;
            height: 50px;
          }
          .marquee-track {
            gap: 40px;
          }
          .marquee-wrapper::before,
          .marquee-wrapper::after {
            width: 50px;
          }
        }
      `}</style>
    </section>
  );
}
