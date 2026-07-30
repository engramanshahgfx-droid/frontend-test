"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";

export default function PromoBanners({ lang, index = 0 }) {
  const router = useRouter();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${API_URL}/banners`);
      const data = await response.json();
      console.log("PromoBanners index:", index, "fetched data:", data);
      if (data.success && data.data && data.data.length > index) {
        setBanner(data.data[index]);
      } else {
        console.warn("No banner found at index:", index);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
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

  if (loading || !banner) return null;

  const sentence = lang === "ar" ? banner.sentence_ar : banner.sentence_en;
  const buttonText = lang === "ar" ? banner.button_text_ar : banner.button_text_en;

  // Format target URL to include language prefix if it's local
  const targetUrl = banner.url.startsWith("/") ? `/${lang}${banner.url}` : banner.url;

  return (
    <section className="promo-banners-section">
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          className="banner-card"
          style={{
            backgroundImage: `url(${getImageUrl(banner.background_image)})`,
            height: "400px",
            minHeight: "400px",
            borderRadius: "12px",
            overflow: "hidden"
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          onClick={() => router.push(targetUrl)}
        >
          <div className="banner-overlay"></div>
          <div className="banner-content">
            <h3 className="banner-sentence">{sentence}</h3>
            {/* <button className="banner-button" onClick={(e) => {
              e.stopPropagation();
              router.push(targetUrl);
            }}>
              {buttonText}
            </button> */}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .promo-banners-section {
          padding: 30px 20px;
          background: #FAF6F0; /* Matching Desert Sand theme background */
        }

        .banner-card {
          position: relative;
          height: 300px !important;
          min-height: 300px !important;
          border-radius: 12px !important;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center; /* Centered content vertically */
          justify-content: center; /* Centered content horizontally */
          padding: 30px;
          box-shadow: 0 8px 25px rgba(28, 0, 82, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0 auto;
          width: 100% !important;
          /* Force border-radius clipping under transformations */
          transform: translateZ(0);
          -webkit-mask-image: -webkit-radial-gradient(white, black);
        }

        .banner-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(28, 0, 82, 0.15);
        }

        .banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(0deg, rgba(28, 0, 82, 0.65) 0%, rgba(28, 0, 82, 0.55) 100%);
          transition: opacity 0.3s ease;
          border-radius: 12px !important;
        }

        .banner-card:hover .banner-overlay {
          background: linear-gradient(0deg, rgba(28, 0, 82, 0.75) 0%, rgba(28, 0, 82, 0.65) 100%);
        }

        .banner-content {
          position: relative;
          z-index: 3;
          width: 100%;
          height: 100%;
          color: white;
          text-align: center;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          padding: 50px;
        }

        .banner-sentence {
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 1.5;
          margin-bottom: 25px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          font-family: 'Tajawal', sans-serif;
        }

        .banner-button {
          background: #E85D1F; /* Desert Sunset Orange */
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(232, 93, 31, 0.2);
          font-family: 'Tajawal', sans-serif;
        }

        .banner-button:hover {
          background: #FFC60B; /* Sand Dune Yellow hover */
          color: #1C0052; /* Deep Heritage Purple text */
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .banner-card {
            height: 280px !important;
            min-height: 280px !important;
            padding: 20px;
          }
          .banner-sentence {
            font-size: 1.3rem;
            margin-bottom: 15px;
          }
          .banner-button {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
}
