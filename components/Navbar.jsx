"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../providers/AuthProvider";
import { useUI } from "../providers/UIProvider";
import en from "@/public/locales/en/common.json";
import ar from "@/public/locales/ar/common.json";
import { ChevronDown, ChevronRight, Globe, Menu, X, Phone } from "lucide-react";
import { API_URL } from "@/lib/api";

import {
  FaWhatsapp,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaSignOutAlt,
  FaUser,
  FaPhone,
  FaTiktok,
  FaSnapchat,
  FaInstagram,
} from "react-icons/fa";
import { SiX } from "react-icons/si";

export default function Navbar({ lang }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { openBookingOrAuth } = useUI();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState(null);
  const [openSubDropdown, setOpenSubDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  // State for dynamic destinations from API
  const [tourismDestinations, setTourismDestinations] = useState(null);
  const [loadingDestinations, setLoadingDestinations] = useState(true);

  const mobileMenuRef = useRef(null);
  const desktopPackagesRef = useRef(null);
  const desktopServicesRef = useRef(null);
  const desktopBasicRef = useRef(null);
  const userMenuRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  // Fetch tourism destinations from backend API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${API_URL}/tourism-destinations/navbar`);
        const data = await response.json();
        if (data.success && Object.keys(data.data).length > 0) {
          setTourismDestinations(data.data);
        } else {
          // If API returns empty, use static fallback
          setTourismDestinations(getFallbackDestinations());
        }
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        // If API fails, use static fallback
        setTourismDestinations(getFallbackDestinations());
      } finally {
        setLoadingDestinations(false);
      }
    };

    fetchDestinations();
  }, []);

  // Fallback static data (used when API fails or is empty)
  const getFallbackDestinations = () => {
    return {
      Europe: {
        icon: "🌍",
        ar: "أوروبا",
        countries: [
          {
            en: "Britain & Ireland",
            ar: "بريطانيا وأيرلندا",
            slug: "britain-ireland-tour",
          },
          { en: "Poland", ar: "بولندا", slug: "poland-discovery" },
        ],
      },
      Asia: {
        icon: "🌏",
        ar: "آسيا",
        countries: [
          { en: "Thailand", ar: "تايلاند", slug: "thailand-getaway" },
        ],
      },
    };
  };

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event) => {
      if (
        desktopPackagesRef.current &&
        !desktopPackagesRef.current.contains(event.target)
      ) {
        setOpenDesktopDropdown((prev) => (prev === "packages" ? null : prev));
      }
      if (
        desktopServicesRef.current &&
        !desktopServicesRef.current.contains(event.target)
      ) {
        setOpenDesktopDropdown((prev) => (prev === "services" ? null : prev));
      }
      if (
        desktopBasicRef.current &&
        !desktopBasicRef.current.contains(event.target)
      ) {
        setOpenDesktopDropdown((prev) => (prev === "basic" ? null : prev));
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenMobileDropdown(null);
    setOpenDesktopDropdown(null);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const isActive = (href) => {
    if (href === "/") return pathname === `/${lang}` || pathname === "/";
    return pathname === `/${lang}${href}`;
  };

  const translations = { en, ar };
  const t = (key) => {
    const keys = key.split(".");
    let v = translations[lang] || translations.en;
    for (const k of keys) {
      if (v && typeof v === "object" && k in v) v = v[k];
      else return key;
    }
    return typeof v === "string" ? v : key;
  };

  const localize = (obj) => {
    if (!obj) return "";
    return obj[lang] || obj.en || obj.ar || Object.values(obj)[0] || "";
  };

  // Use dynamic data or fallback
  const displayDestinations = tourismDestinations || getFallbackDestinations();

  // Get localized region name
  const getRegionName = (region, data) => {
    if (lang === "ar") {
      return data.ar;
    }
    return (
      data.display_name || region.charAt(0).toUpperCase() + region.slice(1)
    );
  };

  // Get localized country name
  const getCountryName = (country) => {
    return lang === "ar" ? country.ar : country.en;
  };

  const menuItems = [
    {
      href: "#",
      label: lang === "ar" ? "الوجهات السياحية" : "Tourism Destinations",
      dropdown: true,
      type: "packages",
    },
    {
      href: "/tousimoffers",
      label: lang === "ar" ? "العروض السياحية" : "Tourism Offers",
    },
    {
      href: "#",
      label: lang === "ar" ? "الخدمات الخاصة" : "Special Services",
      dropdown: true,
      type: "services",
    },
    { href: "/trips-archive", label: t("nav.ourTrips") },
    {
      href: "/visa",
      label: lang === "ar" ? "التأشيرات" : "Visa Services",
      dropdown: true,
      type: "visa",
    },
    {
      href: "/basic",
      label: lang === "ar" ? "متطلبات السفر" : "Travel Requirements",
      dropdown: true,
      type: "basic",
    },
  ];

  const visaData = [
    {
      title: { en: "Schengen visa", ar: "تأشيرة الشنغن" },
      description: {
        en: "Requirements and documents",
        ar: "متطلبات الدخول والمستندات",
      },
      icon: "🏛️",
      href: "/visa",
    },
  ];

  const basicData = [
    {
      title: { en: "About Saudi Arabia", ar: "عن المملكة العربية السعودية" },
      description: {
        en: "Culture, heritage and landmarks",
        ar: "الثقافة والتراث والمعالم",
      },
      icon: "🏛️",
      href: "/about-saudi",
    },
    {
      title: { en: "Travel Guide", ar: "دليل المسافر" },
      description: { en: "Transportation", ar: "المواصلات" },
      icon: "📋",
      href: "/transportation",
    },
  ];

  const servicesData = [
    {
      title: { en: "Private Jet Booking", ar: "طلب استئجار طائرة خاصة" },
      description: {
        en: "Request private jet services",
        ar: "طلب خدمات الطيران الخاص",
      },
      icon: "✈️",
      href: "/international/private-jet",
    },
    {
      title: { en: "Internet Packages", ar: "باقات الإنترنت" },
      description: {
        en: "Global internet solutions",
        ar: "حلول الإنترنت العالمية",
      },
      icon: "🌐",
      href: "/international/internet-packages",
    },
  ];

  if (!pathname || pathname?.startsWith(`/${lang}/admin`)) return null;

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setOpenMobileDropdown(null);
    }
  };

  const handleMobileDropdownToggle = (type, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMobileDropdown((prev) => (prev === type ? null : type));
  };

  const handleDesktopDropdownToggle = (type, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDesktopDropdown((prev) => (prev === type ? null : type));
  };

  const handleDropdownMouseEnter = (type) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setOpenDesktopDropdown(type);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDesktopDropdown(null);
    }, 200);
  };

  const handleNonDropdownLinkClick = () => {
    setMobileMenuOpen(false);
    setOpenMobileDropdown(null);
  };

  const handlePackageDestinationClick = (country) => {
    setOpenDesktopDropdown(null);
    setMobileMenuOpen(false);
    setOpenMobileDropdown(null);
    const slug = country.slug;
    router.push(`/${lang}/destinations/${slug}`);
  };

  const getDropdownData = (type) => {
    switch (type) {
      case "basic":
        return basicData;
      case "services":
        return servicesData;
      case "visa":
        return visaData;
      case "packages":
        return displayDestinations;
      default:
        return [];
    }
  };

  const getDropdownTitle = (type) => {
    switch (type) {
      case "basic":
        return {
          title: lang === "ar" ? "متطلبات السفر" : "Travel Requirements",
          subtitle:
            lang === "ar"
              ? "معلومات أساسية للمسافرين"
              : "Essential information for travelers",
        };
      case "services":
        return {
          title: lang === "ar" ? "الخدمات الخاصة" : "Special Services",
          subtitle:
            lang === "ar"
              ? "الباقات الدولية والخدمات الإضافية"
              : "International tours and premium services",
        };
      case "visa":
        return {
          title: lang === "ar" ? "خدمات التأشيرات" : "Visa Services",
          subtitle:
            lang === "ar"
              ? "بوابتك للسفر الدولي"
              : "Your gateway to international travel",
        };
      case "packages":
        return {
          title: lang === "ar" ? "الوجهات السياحية" : "Tourism Destinations",
          subtitle:
            lang === "ar"
              ? "اختر وجهتك المثالية"
              : "Choose your perfect destination",
        };
      default:
        return { title: "", subtitle: "" };
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push(`/${lang}`);
  };

  const handleSubDropdownToggle = (region) => {
    setOpenSubDropdown(openSubDropdown === region ? null : region);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-bar-left">
            <Phone className="top-bar-icon" />
            <span className="top-bar-phone">+966547305060</span>
          </div>
          <div className="top-bar-right">
            <div className="social-icons">
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
                href="https://www.instagram.com/tilall2030?igsh=c2wyaThvcmZpb3pz/"
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
                aria-label="X"
              >
                <SiX size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="header-container">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="logo-wrapper"
            onClick={handleNonDropdownLinkClick}
          >
            <img
              src="/logo.png"
              alt="التلال والرمال - Tilal R"
              className="logo-image"
            />
            <div className="logo-text">
              <div className="logo-title">
                {lang === "ar" ? "التلال والرمال" : "Tilal Rimal"}
              </div>
              <div className="logo-subtitle">
                {lang === "ar" ? "للسياحة والسفر" : "Tourism"}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`nav-item-wrapper ${item.dropdown ? "dropdown-wrapper" : ""}`}
                ref={item.dropdown ? desktopPackagesRef : null}
                onMouseEnter={
                  item.dropdown
                    ? () => handleDropdownMouseEnter(item.type)
                    : undefined
                }
                onMouseLeave={
                  item.dropdown ? handleDropdownMouseLeave : undefined
                }
              >
                {item.dropdown ? (
                  <div className="dropdown-container">
                    <button
                      type="button"
                      className={`nav-link ${isActive(item.href) ? "active" : ""}`}
                      onClick={(e) => {
                        if (window.innerWidth < 768) {
                          handleDesktopDropdownToggle(item.type, e);
                        }
                      }}
                    >
                      {item.label}
                      {openDesktopDropdown === item.type ? (
                        <FaChevronUp size={12} className="nav-icon" />
                      ) : (
                        <FaChevronDown size={12} className="nav-icon" />
                      )}
                    </button>

                    <AnimatePresence>
                      {openDesktopDropdown === item.type && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="dropdown-menu-wrapper"
                        >
                          <div className="dropdown-content">
                            {item.type === "packages" ? (
                              <div className="dropdown-packages">
                                {Object.entries(displayDestinations).map(
                                  ([region, data]) => (
                                    <div
                                      key={region}
                                      className="dropdown-region-wrapper"
                                      onMouseEnter={() =>
                                        handleSubDropdownToggle(region)
                                      }
                                      onMouseLeave={() =>
                                        setOpenSubDropdown(null)
                                      }
                                    >
                                      <div className="dropdown-region-header">
                                        <span className="service-icon">
                                          {data.icon}
                                        </span>
                                        <span className="region-name">
                                          {getRegionName(region, data)}
                                        </span>
                                        <ChevronRight
                                          size={14}
                                          className="region-arrow"
                                        />
                                      </div>
                                      <AnimatePresence>
                                        {openSubDropdown === region && (
                                          <motion.ul
                                            className="dropdown-sub-menu"
                                            initial={{
                                              opacity: 0,
                                              x: lang === "ar" ? 10 : -10,
                                            }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{
                                              opacity: 0,
                                              x: lang === "ar" ? 10 : -10,
                                            }}
                                            transition={{ duration: 0.2 }}
                                          >
                                            {data.countries.map((country) => (
                                              <li
                                                key={country.slug || country.en}
                                                className="dropdown-sub-item"
                                                onClick={() =>
                                                  handlePackageDestinationClick(
                                                    country,
                                                  )
                                                }
                                              >
                                                {getCountryName(country)}
                                              </li>
                                            ))}
                                          </motion.ul>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  ),
                                )}
                              </div>
                            ) : (
                              <div className="dropdown-list">
                                {getDropdownData(item.type).map(
                                  (data, dataIndex) => (
                                    <Link
                                      key={dataIndex}
                                      href={`/${lang}${data.href}`}
                                      className="dropdown-item"
                                      onClick={() =>
                                        setOpenDesktopDropdown(null)
                                      }
                                    >
                                      <span className="service-icon">
                                        {data.icon}
                                      </span>
                                      <div className="service-content">
                                        <h6>{localize(data.title)}</h6>
                                        <p>{localize(data.description)}</p>
                                      </div>
                                    </Link>
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={`/${lang}${item.href === "/" ? "" : item.href}`}
                    className={`nav-link ${isActive(item.href) ? "active" : ""}`}
                    onClick={handleNonDropdownLinkClick}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="header-actions">
            <LanguageSwitcher lang={lang} showFlagOnly />

            {isAuthenticated ? (
              <div className="user-menu" ref={userMenuRef}>
                <button
                  className="user-trigger"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  <FaUserCircle size={20} />
                  <span className="user-name">
                    {user?.name || t("general.account")}
                  </span>
                  {userMenuOpen ? (
                    <FaChevronUp size={12} />
                  ) : (
                    <FaChevronDown size={12} />
                  )}
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <Link
                      href={`/${lang}/dashboard`}
                      className="user-link"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FaUser size={14} /> {t("nav.dashboard") || "Dashboard"}
                    </Link>
                    <Link
                      href={`/${lang}/dashboard?tab=bookings`}
                      className="user-link"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FaWhatsapp size={14} />{" "}
                      {t("nav.bookings") || "My Bookings"}
                    </Link>
                    <button className="user-link logout" onClick={handleLogout}>
                      <FaSignOutAlt size={14} />{" "}
                      {t("buttons.logout") || "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-toggle"
              onClick={handleMobileMenuToggle}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="toggle-icon" />
              ) : (
                <Menu className="toggle-icon" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ x: lang === "ar" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: lang === "ar" ? "-100%" : "100%" }}
            transition={{ duration: 0.3 }}
            className="mobile-sidebar"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <div className="mobile-sidebar-header">
              <Link
                href={`/${lang}`}
                className="navbar-brand"
                onClick={handleNonDropdownLinkClick}
              >
                <img
                  src="/logo.png"
                  alt="التلال والرمال - Tilal R"
                  className="mobile-logo"
                />
              </Link>
              <button
                className="close-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="mobile-sidebar-content">
              {menuItems.map((item, index) => (
                <div key={index} className="mobile-menu-item">
                  {item.dropdown ? (
                    <div className="mobile-dropdown">
                      <button
                        type="button"
                        className="mobile-menu-link dropdown-toggle"
                        onClick={(e) =>
                          handleMobileDropdownToggle(item.type, e)
                        }
                      >
                        <span>{item.label}</span>
                        {openMobileDropdown === item.type ? (
                          <FaChevronUp size={12} />
                        ) : (
                          <FaChevronDown size={12} />
                        )}
                      </button>
                      {openMobileDropdown === item.type && (
                        <div className="mobile-dropdown-menu">
                          {item.type === "packages"
                            ? Object.entries(displayDestinations).map(
                                ([region, data]) => (
                                  <div
                                    key={region}
                                    className="mobile-destination-region"
                                  >
                                    <div className="mobile-destination-region-header">
                                      <span className="service-icon-mobile">
                                        {data.icon}
                                      </span>
                                      <div className="mobile-destination-region-title">
                                        {getRegionName(region, data)}
                                      </div>
                                    </div>
                                    <div className="mobile-destination-countries">
                                      {data.countries.map((country) => (
                                        <Link
                                          key={country.en}
                                          href={`/${lang}/destinations/${country.slug}`}
                                          className="mobile-dropdown-item"
                                          onClick={handleNonDropdownLinkClick}
                                        >
                                          {getCountryName(country)}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ),
                              )
                            : getDropdownData(item.type).map(
                                (data, dataIndex) => (
                                  <Link
                                    key={dataIndex}
                                    href={`/${lang}${data.href}`}
                                    className="mobile-dropdown-item"
                                    onClick={handleNonDropdownLinkClick}
                                  >
                                    <span className="service-icon-mobile">
                                      {data.icon}
                                    </span>
                                    <div>
                                      <div className="service-title">
                                        {localize(data.title)}
                                      </div>
                                      <div className="service-desc">
                                        {localize(data.description)}
                                      </div>
                                    </div>
                                  </Link>
                                ),
                              )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={`/${lang}${item.href === "/" ? "" : item.href}`}
                      className="mobile-menu-link"
                      onClick={handleNonDropdownLinkClick}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              <div className="mobile-buttons">
                {isAuthenticated ? (
                  <div className="mobile-user-actions">
                    <Link
                      href={`/${lang}/dashboard`}
                      className="mobile-user-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaUser size={14} />{" "}
                      {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
                    </Link>
                    <Link
                      href={`/${lang}/dashboard?tab=bookings`}
                      className="mobile-user-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaWhatsapp size={14} />{" "}
                      {lang === "ar" ? "حجوزاتي" : "My Bookings"}
                    </Link>
                    <button
                      className="mobile-user-link logout"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt size={14} />{" "}
                      {lang === "ar" ? "تسجيل الخروج" : "Logout"}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* ===== CSS Variables ===== */
        :root {
          --gold: #dfa528;
          --gold-hover: #c48d1a;
          --navy: #1a1a2e;
          --white: #ffffff;
          --off-white: #f8f6f2;
          --border: #e8e6e1;
          --text-primary: #1a1a2e;
          --text-secondary: #4a4a5a;
          --shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          --radius: 12px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ===== Top Bar ===== */
        .top-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #1a1a2e;
          color: white;
          padding: 0.5rem 0;
          font-size: 0.75rem;
          border-bottom: 1px solid rgba(223, 165, 40, 0.2);
          z-index: 1031;
        }

        .top-bar-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .top-bar-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .top-bar-icon {
          width: 0.875rem;
          height: 0.875rem;
          color: var(--gold);
        }

        .top-bar-phone {
          color: var(--gold);
          font-weight: 600;
        }

        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .social-icons {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.6);
          transition: var(--transition);
          text-decoration: none;
          padding: 2px;
        }

        .social-icon:hover {
          color: var(--gold);
          transform: translateY(-1px);
        }

        /* ===== Main Header ===== */
        .main-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1030;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          margin-top: 34px;
        }

        .header-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 68px;
        }

        /* ===== Logo ===== */
        .logo-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          flex-shrink: 0;
        }

        .logo-image {
          height: 44px;
          width: auto;
          border-radius: 10px;
          background: rgba(26, 26, 46, 0.05);
          padding: 4px;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .logo-title {
          font-weight: 700;
          color: var(--navy);
          font-size: 1.05rem;
          letter-spacing: -0.02em;
        }

        .logo-subtitle {
          font-size: 0.6rem;
          color: var(--gold);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        [dir="rtl"] .logo-text {
          text-align: right;
        }

        /* ===== Desktop Navigation ===== */
        .desktop-nav {
          display: none;
          align-items: center;
          gap: 0.25rem;
        }

        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
          }
        }

        .nav-item-wrapper {
          position: relative;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.875rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          transition: var(--transition);
          white-space: nowrap;
        }

        .nav-link:hover {
          color: var(--gold);
          background: rgba(223, 165, 40, 0.06);
        }

        .nav-link.active {
          color: var(--gold);
          background: rgba(223, 165, 40, 0.08);
          border-bottom: 2px solid var(--gold);
        }

        .nav-icon {
          opacity: 0.6;
        }

        /* ===== Dropdown - Tourism Destinations Style ===== */
        .dropdown-container {
          position: relative;
        }

        .dropdown-menu-wrapper {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: auto;
          min-width: 280px;
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          border: 1px solid var(--border);
          padding: 0.5rem;
          z-index: 1000;
        }

        [dir="rtl"] .dropdown-menu-wrapper {
          left: auto;
          right: 0;
        }

        .dropdown-content {
          padding: 0;
        }

        .dropdown-packages {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .dropdown-region-wrapper {
          position: relative;
          border-radius: 8px;
          transition: var(--transition);
        }

        .dropdown-region-wrapper:hover {
          background: rgba(223, 165, 40, 0.06);
        }

        .dropdown-region-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.75rem;
          cursor: pointer;
          border-radius: 8px;
          transition: var(--transition);
        }

        .dropdown-region-header:hover .region-name {
          color: var(--gold);
        }

        .region-name {
          flex: 1;
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--text-primary);
          transition: var(--transition);
        }

        .region-arrow {
          color: var(--text-secondary);
          opacity: 0.5;
          transition: var(--transition);
        }

        .dropdown-region-wrapper:hover .region-arrow {
          opacity: 1;
          color: var(--gold);
          transform: ${lang === "ar" ? "translateX(-3px)" : "translateX(3px)"};
        }

        .service-icon {
          font-size: 1.1rem;
          flex-shrink: 0;
          width: 24px;
          text-align: center;
        }

        /* Sub Menu - Appears on Hover */
        .dropdown-sub-menu {
          position: absolute;
          top: 0;
          ${lang === "ar"
            ? "right: calc(100% + 4px);"
            : "left: calc(100% + 4px);"}
          min-width: 220px;
          max-height: 400px;
          overflow-y: auto;
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          border: 1px solid var(--border);
          padding: 0.4rem;
          list-style: none;
          z-index: 1001;
        }

        .dropdown-sub-item {
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
          text-align: ${lang === "ar" ? "right" : "left"};
        }

        .dropdown-sub-item:hover {
          color: var(--gold);
          background: rgba(223, 165, 40, 0.08);
        }

        /* ===== Other Dropdown Items ===== */
        .dropdown-list {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          padding: 0.25rem;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.875rem;
          border-radius: 6px;
          text-decoration: none;
          transition: var(--transition);
          cursor: pointer;
          border: none;
          background: transparent;
        }

        .dropdown-item:hover {
          background: rgba(223, 165, 40, 0.06);
        }

        .dropdown-item:hover .service-content h6 {
          color: var(--gold);
        }

        .service-content {
          flex: 1;
          min-width: 0;
        }

        .service-content h6 {
          color: var(--navy);
          font-weight: 500;
          font-size: 0.85rem;
          margin-bottom: 0.05rem;
          transition: var(--transition);
        }

        .service-content p {
          color: var(--text-secondary);
          font-size: 0.7rem;
          margin: 0;
          opacity: 0.6;
        }

        /* ===== Header Actions ===== */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* ===== User Menu ===== */
        .user-menu {
          position: relative;
        }

        .user-trigger {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.75rem;
          background: rgba(26, 26, 46, 0.05);
          border: 1px solid var(--border);
          border-radius: 50px;
          color: var(--navy);
          font-weight: 500;
          font-size: 0.8rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .user-trigger:hover {
          background: rgba(223, 165, 40, 0.08);
          border-color: var(--gold);
        }

        .user-name {
          max-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 200px;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 0.4rem;
          z-index: 1100;
        }

        [dir="rtl"] .user-dropdown {
          right: auto;
          left: 0;
        }

        .user-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.6rem 0.75rem;
          color: var(--text-primary);
          border-radius: 8px;
          border: none;
          background: transparent;
          text-decoration: none;
          cursor: pointer;
          font-size: 0.85rem;
          transition: var(--transition);
        }

        .user-link:hover {
          background: rgba(223, 165, 40, 0.06);
        }

        .user-link.logout {
          color: #dc2626;
        }

        .user-link.logout:hover {
          background: rgba(220, 38, 38, 0.06);
        }

        /* ===== Mobile Toggle ===== */
        .mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: var(--navy);
          transition: var(--transition);
        }

        .mobile-toggle:hover {
          background: rgba(26, 26, 46, 0.05);
        }

        .toggle-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        @media (min-width: 768px) {
          .mobile-toggle {
            display: none;
          }
        }

        /* ===== Mobile Overlay ===== */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 1040;
          backdrop-filter: blur(4px);
        }

        /* ===== Mobile Sidebar ===== */
        .mobile-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 85%;
          max-width: 360px;
          height: 100vh;
          background: var(--white);
          box-shadow: -4px 0 40px rgba(0, 0, 0, 0.1);
          z-index: 1050;
          overflow-y: auto;
        }

        [dir="rtl"] .mobile-sidebar {
          right: auto;
          left: 0;
        }

        .mobile-sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border);
          background: var(--white);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .mobile-logo {
          height: 40px;
          width: auto;
          border-radius: 8px;
          background: rgba(26, 26, 46, 0.05);
          padding: 4px;
        }

        .close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          background: transparent;
          border: none;
          font-size: 1.2rem;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 8px;
          transition: var(--transition);
        }

        .close-btn:hover {
          background: rgba(26, 26, 46, 0.05);
        }

        .mobile-sidebar-content {
          padding: 1rem 1.25rem 2rem;
        }

        .mobile-menu-item {
          border-bottom: 1px solid rgba(26, 26, 46, 0.05);
        }

        .mobile-menu-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.875rem 0;
          color: var(--text-primary);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          border: none;
          background: none;
          width: 100%;
          text-align: ${lang === "ar" ? "right" : "left"};
          cursor: pointer;
          transition: var(--transition);
        }

        .mobile-menu-link:hover {
          color: var(--gold);
        }

        .mobile-dropdown-menu {
          padding: ${lang === "ar"
            ? "0.25rem 1rem 0.5rem 0"
            : "0.25rem 0 0.5rem 1rem"};
          background: rgba(26, 26, 46, 0.02);
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .mobile-dropdown-item {
          display: flex;
          align-items: center;
          padding: 0.65rem 0.75rem;
          text-decoration: none;
          border-radius: 8px;
          transition: var(--transition);
          cursor: pointer;
        }

        .mobile-dropdown-item:active {
          background: rgba(223, 165, 40, 0.06);
        }

        .service-icon-mobile {
          font-size: 1.2rem;
          ${lang === "ar" ? "margin-left: 0.75rem;" : "margin-right: 0.75rem;"}
          flex-shrink: 0;
        }

        .service-title {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.85rem;
        }

        .service-desc {
          color: var(--text-secondary);
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .mobile-destination-region {
          margin-bottom: 0.5rem;
        }

        .mobile-destination-region-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-weight: 600;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border);
        }

        .mobile-destination-region-title {
          font-size: 0.9rem;
        }

        .mobile-destination-countries {
          padding: 0.25rem 0;
        }

        .mobile-buttons {
          padding: 1.5rem 0;
          border-top: 1px solid var(--border);
          margin-top: 1rem;
        }

        .mobile-user-actions {
          display: grid;
          gap: 0.5rem;
        }

        .mobile-user-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--off-white);
          color: var(--text-primary);
          text-decoration: none;
          font-size: 0.9rem;
          transition: var(--transition);
        }

        .mobile-user-link:hover {
          border-color: var(--gold);
        }

        .mobile-user-link.logout {
          color: #dc2626;
          border-color: rgba(220, 38, 38, 0.2);
        }

        /* ===== Responsive ===== */
        @media (max-width: 768px) {
          .dropdown-menu-wrapper {
            min-width: auto;
            width: 90vw;
            left: 5vw;
            transform: none;
            max-width: 90vw;
          }
          [dir="rtl"] .dropdown-menu-wrapper {
            right: 5vw;
            left: auto;
            transform: none;
          }
          .logo-title {
            font-size: 0.9rem;
          }
          .logo-subtitle {
            font-size: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .social-icons {
            gap: 0.5rem;
          }
          .social-icon svg {
            width: 14px;
            height: 14px;
          }
          .logo-image {
            height: 36px;
          }
          .logo-title {
            font-size: 0.8rem;
          }
          .header-container {
            height: 60px;
            padding: 0 1rem;
          }
        }
      `}</style>
    </>
  );
}
