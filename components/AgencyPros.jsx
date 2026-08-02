"use client";
import { motion } from "framer-motion";
import { Compass, ShieldCheck, HeartHandshake } from "lucide-react";

export default function AgencyPros({ lang }) {
  const content = {
    en: {
      title: "Why Travel With Tilal Rimal",
      subtitle: "Discover the premium advantages that make your journeys with us truly exceptional.",
      pros: [
        {
          index: "",
          icon: <Compass size={28} className="pro-icon" />,
          title: "Expert Travel Designers",
          description: "Fully tailor-made tours planned by local experts to match your personal interests and travel style.",
        },
        {
          index: "",
          icon: <ShieldCheck size={28} className="pro-icon" />,
          title: "Authentic Local Access",
          description: "Exclusive entry to Saudi Arabia's hidden gems, heritage sites, and authentic cultural experiences.",
        },
        {
          index: "",
          icon: <HeartHandshake size={28} className="pro-icon" />,
          title: "Seamless VIP Care",
          description: "Dedicated 24/7 assistance, logistics management, and premium support throughout your entire journey.",
        },
      ]
    },
    ar: {
      title: "لماذا تسافر مع تلال ورمال؟",
      subtitle: "اكتشف المزايا الاستثنائية التي تجعل رحلتك معنا تجربة لا تُنسى.",
      pros: [
        {
          index: "٠١",
          icon: <Compass size={28} className="pro-icon" />,
          title: "تصميم رحلات خبير",
          description: "رحلات سياحية مخصصة بالكامل تم التخطيط لها بواسطة خبراء محليين لتناسب اهتماماتك الخاصة.",
        },
        {
          index: "٠٢",
          icon: <ShieldCheck size={28} className="pro-icon" />,
          title: "وصول محلي أصيل",
          description: "دخول حصري لأبرز معالم وجواهر المملكة المخفية، وتجارب ثقافية وتراثية حقيقية.",
        },
        {
          index: "٠٣",
          icon: <HeartHandshake size={28} className="pro-icon" />,
          title: "رعاية راقية متكاملة",
          description: "متابعة مستمرة على مدار الساعة، وإدارة لوجستية متكاملة لضمان راحتك وأمانك طوال الرحلة.",
        },
      ]
    }
  };

  const t = content[lang] || content.en;

  return (
    <section className="agency-pros-section" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* <div className="section-header">
          <span className="accent-tag">{lang === "ar" ? "مميزاتنا" : "OUR VALUES"}</span>
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div> */}

        <div className="pros-grid">
          {t.pros.map((pro, index) => (
            <motion.div
              key={index}
              className="pro-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="card-bg-glow"></div>
              <div className="card-top-row">
                <div className="pro-icon-wrapper">
                  {pro.icon}
                </div>
                <span className="pro-number">{pro.index}</span>
              </div>
              <h3 className="pro-title">{pro.title}</h3>
              <p className="pro-desc">{pro.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .agency-pros-section {
          padding: 100px 20px;
          background: #FAF6F0; /* Soft Desert Sand background */
          position: relative;
          overflow: hidden;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .accent-tag {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: #E85D1F; /* Desert Sunset Orange tag */
          display: inline-block;
          margin-bottom: 12px;
          font-family: 'Tajawal', sans-serif;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1C0052; /* Deep Heritage Purple */
          margin-bottom: 20px;
          font-family: 'Tajawal', sans-serif;
          letter-spacing: -0.5px;
        }

        .section-header p {
          font-size: 1.15rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
          font-family: 'Tajawal', sans-serif;
        }

        .pros-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .pro-card {
          position: relative;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 40px 35px;
          border: 1px solid rgba(28, 0, 82, 0.05);
          box-shadow: 0 10px 30px rgba(28, 0, 82, 0.02);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: start;
        }

        .card-bg-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(800px circle at var(--x, 0px) var(--y, 0px), rgba(232, 93, 31, 0.06), transparent 40%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 0;
        }

        .pro-card:hover {
          transform: translateY(-8px);
          border-color: rgba(232, 93, 31, 0.2);
          background: #ffffff;
          box-shadow: 0 30px 60px rgba(28, 0, 82, 0.08);
        }

        .pro-card:hover .card-bg-glow {
          opacity: 1;
        }

        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 30px;
          z-index: 1;
        }

        .pro-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: rgba(232, 93, 31, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E85D1F;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pro-card:hover .pro-icon-wrapper {
          background: #1C0052;
          color: #ffffff;
          transform: rotate(5deg) scale(1.05);
        }

        .pro-number {
          font-size: 2.2rem;
          font-weight: 900;
          color: rgba(28, 0, 82, 0.06);
          transition: color 0.4s ease;
          line-height: 1;
          user-select: none;
        }

        .pro-card:hover .pro-number {
          color: rgba(232, 93, 31, 0.12);
        }

        .pro-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #1C0052;
          margin-bottom: 12px;
          font-family: 'Tajawal', sans-serif;
          z-index: 1;
          letter-spacing: -0.3px;
        }

        .pro-desc {
          font-size: 0.95rem;
          color: #555;
          line-height: 1.7;
          margin: 0;
          font-family: 'Tajawal', sans-serif;
          z-index: 1;
        }

        @media (max-width: 991px) {
          .pros-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .pro-card {
            padding: 35px 30px;
          }
          .section-header h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
}
