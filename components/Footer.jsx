"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTiktok,
  FaSnapchat,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import en from "@/public/locales/en/common.json";
import ar from "@/public/locales/ar/common.json";
import zh from "@/public/locales/zh/common.json";

export default function Footer({ lang }) {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const arabicText = {
    companyName: "التلال والرمال",
    description:
      "لتنظيم الرحلات السياحية - نقدم رحلات فريدة تجمع بين المتعة والمغامرة والقيمة المفيدة في ربوع المملكة.",
    companyTitle: "الشركة",
    contactTitle: "اتصل بنا",
    legalTitle: "القانونية",
    links: {
      home: "الرئيسية",
      about: "من نحن",
      international: "العروض الدولية",
      offers: "العروض المحلية",
      archive: "أرشيف الرحلات",
      basics: "متطلبات السفر",
    },
    legal: {
      terms: "الشروط والأحكام",
      privacy: " ",
      contact: " ",
    },
    rightsReserved: "جميع الحقوق محفوظة.",
    address: "جده, المملكة العربية السعودية",
    phone: "966547305060",
    email: "Info@tilalr.com",
    website: "tilalr.com",
    googleMapsUrl: "https://maps.app.goo.gl/di5qeND1dsmGQp7YA",
  };

  const englishText = {
    companyName: "Tilal R",
    description:
      "For Tourism Trips Organization - We offer unique trips that combine fun, adventure, and meaningful value throughout the Kingdom.",
    companyTitle: "Company",
    contactTitle: "Contact Us",
    legalTitle: "Legal",
    links: {
      home: "Home",
      about: "About Us",
      international: "International offers",
      offers: "Domestic offers",
      archive: "Trips Archive",
      basics: "Travel Requirements",
    },
    legal: {
      terms: "Terms & Conditions",
    },
    rightsReserved: "All Rights Reserved.",
    address: "Jeddah, Saudi Arabia",
    phone: "966547305060",
    email: "Info@tilalr.com",
    website: "tilalr.com",
    googleMapsUrl: "https://maps.app.goo.gl/di5qeND1dsmGQp7YA",
  };

  const chineseText = {
    companyName: "Tilal R",
    description:
      "旅游行程组织 - 我们提供结合乐趣、冒险和有意义价值的独特旅行，遍及整个王国。",
    companyTitle: "公司",
    contactTitle: "联系我们",
    legalTitle: "法律条款",
    links: {
      home: "首页",
      about: "关于我们",
      international: "国际优惠",
      offers: "国内优惠",
      archive: "行程存档",
      basics: "旅行要求",
    },
    legal: {
      terms: "条款与条件",
    },
    rightsReserved: "保留所有权利。",
    address: "吉达，沙特阿拉伯",
    phone: "966547305060",
    email: "Info@tilalr.com",
    website: "tilalr.com",
    googleMapsUrl: "https://maps.app.goo.gl/di5qeND1dsmGQp7YA",
  };

  // Get the appropriate text based on language
  let localeText;
  switch(lang) {
    case "ar":
      localeText = arabicText;
      break;
    case "zh":
      localeText = chineseText;
      break;
    default:
      localeText = englishText;
  }

  const isRTL = lang === "ar";

  // Translation helper for localized strings (from JSON files)
  const translations = { en, ar, zh };
  const tr = (key) => {
    const keys = key.split('.');
    let v = translations[lang] || translations.en;
    for (const k of keys) {
      if (v && typeof v === 'object' && k in v) v = v[k];
      else return key;
    }
    return typeof v === 'string' ? v : key;
  };
  
  return (
    <footer
      className="footer lh-lg"
      style={{
        backgroundColor: "#8A7779",
        background: "linear-gradient(135deg, #8A7779 0%, #8A7779 100%)",
        borderTop: "3px solid #dfa528",
        position: "relative",
        zIndex: 1000,
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div className="container">
        <div className="row pt-3">
          {/* Company Info */}
          <div
            className={`col-lg-4 col-md-6 mb-3 text-center ${
              isRTL ? "text-md-end" : "text-md-start"
            }`}
          >
            <Link href={`/${lang}`}>
              <img
                src="/logo.png"
                alt={`${localeText.companyName} logo`}
                style={{
                  width: "140px",
                  height: "auto",
                  marginBottom: "0.5rem",
                }}
              />
            </Link>
            <p
              className="mt-1"
              style={{ fontSize: "14px", color: "#e0e0e0", lineHeight: "1.4" }}
            >
              <span className="fw-bold" style={{ color: "#dfa528" }}>
                {localeText.companyName}
              </span>{" "}
              — {localeText.description}
            </p>
            <div className="mt-2">
              <div
                className={`d-flex align-items-center mb-1 ${
                  isRTL ? "flex-row-reverse justify-content-start" : ""
                }`}
              >
                {isRTL ? (
                  <>
                    <a
                      href={localeText.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none ms-1"
                      style={{
                        fontSize: "12px",
                        color: "#e0e0e0",
                        textAlign: "right",
                        flex: 1,
                      }}
                    >
                      {localeText.address}
                    </a>
                    <FaMapMarkerAlt
                      size={12}
                      style={{ color: "#dfa528", flexShrink: 0 }}
                    />
                  </>
                ) : (
                  <>
                    <FaMapMarkerAlt
                      className="me-1"
                      size={12}
                      style={{ color: "#dfa528", flexShrink: 0 }}
                    />
                    <a
                      href={localeText.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                      style={{ fontSize: "12px", color: "#e0e0e0" }}
                    >
                      {localeText.address}
                    </a>
                  </>
                )}
              </div>

              <div
                className={`d-flex align-items-center mb-1 ${
                  isRTL ? "flex-row-reverse justify-content-start" : ""
                }`}
              >
                {isRTL ? (
                  <>
                    <a
                      href={`tel:${localeText.phone}`}
                      className="text-decoration-none ms-1"
                      style={{
                        fontSize: "12px",
                        color: "#e0e0e0",
                        textAlign: "right",
                        flex: 1,
                      }}
                    >
                      {localeText.phone}
                    </a>
                    <FaPhone
                      size={12}
                      style={{ color: "#dfa528", flexShrink: 0 }}
                    />
                  </>
                ) : (
                  <>
                    <FaPhone
                      className="me-1"
                      size={12}
                      style={{ color: "#dfa528", flexShrink: 0 }}
                    />
                    <a
                      href={`tel:${localeText.phone}`}
                      className="text-decoration-none"
                      style={{ fontSize: "12px", color: "#e0e0e0" }}
                    >
                      {localeText.phone}
                    </a>
                  </>
                )}
              </div>

              <div
                className={`d-flex align-items-center mb-1 ${
                  isRTL ? "flex-row-reverse justify-content-start" : ""
                }`}
              >
                {isRTL ? (
                  <>
                    <a
                      href={`mailto:${localeText.email}`}
                      className="text-decoration-none ms-1"
                      style={{
                        fontSize: "12px",
                        color: "#e0e0e0",
                        textAlign: "right",
                        flex: 1,
                      }}
                    >
                      {localeText.email}
                    </a>
                    <FaEnvelope
                      size={12}
                      style={{ color: "#dfa528", flexShrink: 0 }}
                    />
                  </>
                ) : (
                  <>
                    <FaEnvelope
                      className="me-1"
                      size={12}
                      style={{ color: "#dfa528", flexShrink: 0 }}
                    />
                    <a
                      href={`mailto:${localeText.email}`}
                      className="text-decoration-none"
                      style={{ fontSize: "12px", color: "#e0e0e0" }}
                    >
                      {localeText.email}
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Social Media Icons */}
            <div
              className={`d-flex gap-1 mt-2 ${
                isRTL ? "justify-content-md-end" : "justify-content-md-start"
              } justify-content-center`}
            >
              <a
                href="https://www.tiktok.com/@tilalr2030"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="TikTok"
              >
                <FaTiktok size={16} />
              </a>
              <a
                href="https://www.snapchat.com/@tilalr2030"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Snapchat"
              >
                <FaSnapchat size={16} />
              </a>
              <a
                href="https://www.instagram.com/tilalr2030/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://x.com/tilalr2030"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Twitter"
              >
                <FaTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="col-lg-3 col-md-6 mb-3">
            <h6
              className="mb-1"
              style={{
                fontWeight: "600",
                color: "#dfa528",
                fontSize: "0.95rem",
              }}
            >
              {localeText.companyTitle}
            </h6>
            <div className="d-flex flex-column">
              <div className="mb-1">
                <Link
                  href={`/${lang}`}
                  className="text-decoration-none footer-link"
                >
                  {localeText.links.home}
                </Link>
              </div>
              <div className="mb-1">
                <Link
                  href={`/${lang}/about-us`}
                  className="text-decoration-none footer-link"
                >
                  {localeText.links.about}
                </Link>
              </div>
              <div className="mb-1">
                <Link
                  href={`/${lang}/international`}
                  className="text-decoration-none footer-link"
                >
                  {localeText.links.international}
                </Link>
              </div>
              <div className="mb-1">
                <Link
                  href={`/${lang}/offers`}
                  className="text-decoration-none footer-link"
                >
                  {localeText.links.offers}
                </Link>
              </div>
              <div className="mb-1">
                <Link
                  href={`/${lang}/trips-archive`}
                  className="text-decoration-none footer-link"
                >
                  {localeText.links.archive}
                </Link>
              </div>
              <div>
                <Link
                  href={`/${lang}/about-saudi`}
                  className="text-decoration-none footer-link"
                >
                  {localeText.links.basics}
                </Link>
              </div>
            </div>
          </div>

          {/* Legal & Contact */}
          <div className="col-lg-5 col-md-6 mb-3">
            <div className="row">
              {/* Legal Links */}
              <div className="col-sm-6 mb-3">
                <h6
                  className="mb-1"
                  style={{
                    fontWeight: "600",
                    color: "#dfa528",
                    fontSize: "0.95rem",
                  }}
                >
                  {localeText.legalTitle}
                </h6>
                <div className="d-flex flex-column">
                  <div className="mb-1">
                    <Link
                      href={`/${lang}/terms`}
                      className="text-decoration-none footer-link"
                    >
                      {localeText.legal.terms}
                    </Link>
                  </div>
                  <div className="mb-1">
                    <Link
                      href={`/${lang}/privacy`}
                      className="text-decoration-none footer-link"
                    >
                      {localeText.legal.privacy}
                    </Link>
                  </div>
                  <div>
                    <Link
                      href={`/${lang}/contact-us`}
                      className="text-decoration-none footer-link"
                    >
                      {localeText.contactTitle}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="col-sm-6">
                <h6
                  className="mb-1"
                  style={{
                    fontWeight: "600",
                    color: "#dfa528",
                    fontSize: "0.95rem",
                  }}
                >
                  {localeText.contactTitle}
                </h6>
                <div className="d-flex flex-column">
                  <div className="mb-1">
                    <a
                      href="tel:966547305060"
                      className="text-decoration-none footer-link"
                    >
                      {localeText.phone}
                    </a>
                  </div>
                  <div className="mb-1">
                    <a
                      href="https://wa.me/966547305060"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none footer-link"
                    >
                      {tr('footer.bookViaWhatsApp')}
                    </a>
                  </div>
                  <div>
                    <a
                      href="mailto:Info@tilalr.com"
                      className="text-decoration-none footer-link"
                    >
                      {tr('footer.emailUs')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr
          style={{ borderColor: "#dfa528", opacity: 0.3, margin: "0.5rem 0" }}
        />

        {/* Footer Bottom */}
        <div className="row text-center py-1">
          <div className="col" style={{ color: "#e0e0e0" }}>
            <div className="d-flex flex-column justify-content-center align-items-center gap-1">
              {/* License Line */}
              <div style={{ fontSize: "12px" }}>
                <span style={{ color: "#dfa528", fontWeight: "600" }}>
                  {tr('footer.license')}
                </span>
              </div>

              {/* Copyright and Rights Line */}
              <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-1">
                <span style={{ fontSize: "12px" }}>
                  &copy; 2025{" "}
                  <span style={{ color: "#dfa528" }}>{localeText.companyName}</span>
                </span>
                <span
                  className="d-none d-md-inline"
                  style={{ color: "#e0e0e0", fontSize: "12px" }}
                >
                  {" "}
                  |{" "}
                </span>
                <span style={{ color: "#e0e0e0", fontSize: "12px" }}>
                  {localeText.rightsReserved}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-link {
          color: #e0e0e0;
          transition: color 0.3s, transform 0.3s;
          font-size: 0.85rem;
          line-height: 1.2;
          display: block;
          padding: 0.1rem 0;
        }

        .footer-link:hover {
          color: #ffffff !important;
          background: none !important;
          border: none !important;
          transform: none !important;
          text-decoration: none !important;
        }

        .social-icon {
          transition: all 0.3s ease;
          background: rgba(223, 165, 40, 0.1);
          padding: 4px;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dfa528;
        }

        .social-icon:hover {
          color: #ffffff !important;
          background: rgba(223, 165, 40, 0.3);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .social-icon {
            width: 26px;
            height: 26px;
            padding: 3px;
          }
        }

        @media (max-width: 576px) {
          .container {
            padding-left: 12px;
            padding-right: 12px;
          }

          .footer-link {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </footer>
  );
}
