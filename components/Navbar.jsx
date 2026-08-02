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
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Globe,
  Menu,
  X,
  Phone,
  Plane,
  Wifi,
  FileCheck,
  Landmark,
  Compass,
  ShieldCheck,
} from "lucide-react";
import { API_URL } from "@/lib/api";

import {
  FaWhatsapp,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaSignOutAlt,
  FaUser,
  FaTiktok,
  FaSnapchat,
  FaInstagram,
} from "react-icons/fa";
import { SiX } from "react-icons/si";

// Region translations with lowercase keys matching API response
const REGION_LABELS = {
  en: {
    europe: "Europe",
    asia: "Asia",
    africa: "Africa",
    australia: "Australia & New Zealand",
    america: "America",
  },
  ar: {
    europe: "أوروبا",
    asia: "آسيا",
    africa: "أفريقيا",
    australia: "أستراليا ونيوزيلندا",
    america: "أمريكا",
  },
};

export default function Navbar({ lang }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState(null);
  const [openSubDropdown, setOpenSubDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [tourismDestinations, setTourismDestinations] = useState(null);
  const [dropdownError, setDropdownError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const userMenuRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  const navRef = useRef(null);
  const dropdownRefs = useRef({});
  const isHoveringDropdown = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href) => {
    if (href === "#") return false;
    if (href === "/" && pathname === `/${lang}`) return true;
    return pathname === `/${lang}${href}` || pathname?.startsWith(`/${lang}${href}/`);
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/tourism-destinations/navbar`);

        // Check if response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check content type
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.warn("API did not return JSON, using fallback data");
          setTourismDestinations(getFallbackDestinations());
          return;
        }

        const data = await response.json();

        if (data.success && Object.keys(data.data).length > 0) {
          setTourismDestinations(data.data);
        } else {
          console.warn("API returned empty data, using fallback");
          setTourismDestinations(getFallbackDestinations());
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
        // Use fallback data on error
        setTourismDestinations(getFallbackDestinations());
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const getFallbackDestinations = () => ({
    europe: {
      icon: "🌍",
      countries: [
        { en: "Poland", ar: "بولندا", slug: "poland-discovery" },
        { en: "France", ar: "فرنسا", slug: "france-discovery" },
        { en: "Italy", ar: "إيطاليا", slug: "italy-discovery" },
      ],
    },
    asia: {
      icon: "🌏",
      countries: [
        { en: "Thailand", ar: "تايلاند", slug: "thailand-getaway" },
        { en: "Japan", ar: "اليابان", slug: "japan-discovery" },
        { en: "UAE", ar: "الإمارات", slug: "uae-discovery" },
      ],
    },
    africa: {
      icon: "🌍",
      countries: [
        { en: "Morocco", ar: "المغرب", slug: "morocco-discovery" },
        { en: "Egypt", ar: "مصر", slug: "egypt-discovery" },
      ],
    },
    australia: {
      icon: "🌏",
      countries: [
        { en: "Australia", ar: "أستراليا", slug: "australia-adventure" },
        { en: "New Zealand", ar: "نيوزيلندا", slug: "new-zealand-discovery" },
      ],
    },
    america: {
      icon: "🌎",
      countries: [
        { en: "USA", ar: "الولايات المتحدة", slug: "usa-east-coast" },
        { en: "Canada", ar: "كندا", slug: "canada-discovery" },
      ],
    },
  });

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      // Close desktop dropdown when clicking outside
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDesktopDropdown(null);
        setOpenSubDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenMobileDropdown(null);
    setOpenDesktopDropdown(null);
    setUserMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

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

  const localize = (obj) => obj?.[lang] || obj?.en || "";

  const displayDestinations = tourismDestinations || getFallbackDestinations();

  const getRegionLabel = (regionKey) => {
    const labels = REGION_LABELS[lang] || REGION_LABELS.en;
    if (labels[regionKey]) return labels[regionKey];
    const lowerKey = regionKey?.toLowerCase();
    if (labels[lowerKey]) return labels[lowerKey];
    return regionKey;
  };

  const menuItems = [
    {
      href: "#",
      label: lang === "ar" ? "الرحلات الدولية" : "International Trips",
      dropdown: true,
      type: "packages",
    },
    {
      href: "/tousimoffers",
      label:
        lang === "ar" ? (
          <>
            اكتشف <span style={{ color: "#006C35", fontWeight: "700" }}>السعودية</span>
          </>
        ) : (
          <>
            Discover <span style={{ color: "#006C35", fontWeight: "700" }}>Saudi</span>
          </>
        ),
    },
    {
      href: "/jamoulaoffers",
      label:
        lang === "ar" ? (
          <>
            عروض <span style={{ color: "#FF0000", fontWeight: "700" }}>جمولة</span>
          </>
        ) : (
          <>
            <span style={{ color: "#FF0000", fontWeight: "700" }}>Jamoula</span> Offers
          </>
        ),
    },
    {
      href: "#",
      label: lang === "ar" ? "الخدمات الخاصة" : "Special Services",
      dropdown: true,
      type: "services",
    },
    { href: "/about-us", label: t("nav.about") },
    {
      href: "#",
      label: lang === "ar" ? "متطلبات السفر" : "Travel Requirements",
      dropdown: true,
      type: "basic",
    },
  ];

  const visaData = [
    {
      title: { en: "Schengen Visa", ar: "تأشيرة الشنغن" },
      description: { en: "Application & requirements", ar: "التقديم والمتطلبات" },
      icon: <ShieldCheck size={18} />,
      href: "/visa",
    },
  ];

  const basicData = [
    {
      title: { en: "About Saudi Arabia", ar: "عن المملكة العربية السعودية" },
      description: { en: "Culture and heritage", ar: "الثقافة والتراث" },
      icon: <Landmark size={18} />,
      href: "/about-saudi",
    },
    {
      title: { en: "Travel Guide", ar: "دليل المسافر" },
      description: { en: "Transportation & tips", ar: "المواصلات والنصائح" },
      icon: <Compass size={18} />,
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
      icon: <Plane size={18} />,
      href: "/international/private-jet",
    },
    {
      title: { en: "Internet Packages", ar: "باقات الإنترنت" },
      description: {
        en: "Global internet solutions",
        ar: "حلول الإنترنت العالمية",
      },
      icon: <Wifi size={18} />,
      href: "/international/internet-packages",
    },
    {
      title: { en: "Visa Services", ar: "خدمات التأشيرات" },
      description: {
        en: "Apply for tourist and Schengen visas",
        ar: "التقديم على التأشيرات السياحية والشنغن",
      },
      icon: <FileCheck size={18} />,
      href: "/visa",
    },
  ];

  const handleDropdownMouseEnter = (type) => {
    if (window.innerWidth > 1210) {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
        dropdownTimeoutRef.current = null;
      }
      isHoveringDropdown.current = true;
      setOpenDesktopDropdown(type);
    }
  };

  const handleDropdownMouseLeave = (e) => {
    if (window.innerWidth > 1210) {
      const relatedTarget = e.relatedTarget;
      const isChildElement =
        relatedTarget &&
        (relatedTarget.closest(".dropdown-menu-wrapper") ||
          relatedTarget.closest(".sub-menu") ||
          relatedTarget.closest(".region-group"));

      const isNavItem =
        relatedTarget &&
        (relatedTarget.closest(".nav-item-wrapper") ||
          relatedTarget.classList.contains("nav-link"));

      const isDropdownMenu =
        relatedTarget && relatedTarget.closest(".dropdown-menu-wrapper");

      // Only close if leaving to outside the dropdown/menu area
      if (!isChildElement && !isDropdownMenu && !isNavItem) {
        dropdownTimeoutRef.current = setTimeout(() => {
          if (!isHoveringDropdown.current) {
            setOpenDesktopDropdown(null);
            setOpenSubDropdown(null);
          }
        }, 100);
      }
    }
  };

  const handleDropdownMouseEnterContainer = () => {
    isHoveringDropdown.current = true;
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeaveContainer = () => {
    isHoveringDropdown.current = false;
    dropdownTimeoutRef.current = setTimeout(() => {
      if (!isHoveringDropdown.current) {
        setOpenDesktopDropdown(null);
        setOpenSubDropdown(null);
      }
    }, 100);
  };

  const toggleMobileDropdown = (type, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMobileDropdown(openMobileDropdown === type ? null : type);
    setOpenSubDropdown(null);
  };

  const toggleSubDropdown = (region, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSubDropdown(openSubDropdown === region ? null : region);
  };

  const getDropdownData = (type) => {
    if (type === "basic") return basicData;
    if (type === "services") return servicesData;
    if (type === "visa") return visaData;
    return [];
  };

  if (!pathname || pathname?.startsWith(`/${lang}/admin`)) return null;

  const isRTL = lang === "ar";

  return (
    <>
      {/* Top Bar */}
      <div className={`top-bar ${isScrolled ? "scrolled" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="top-bar-container">
          <div className="top-bar-left">
            <Phone className="top-bar-icon" />
            <a
              href="tel:+966547305060"
              className="top-bar-phone"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              +966547305060
            </a>
          </div>
          <div className="top-bar-right">
            <div className="social-icons">
              <a
                href="https://www.tiktok.com/@tilalr2030"
                className="social-icon"
              >
                <FaTiktok size={14} />
              </a>
              <a
                href="https://www.snapchat.com/@tilalr2030"
                className="social-icon"
              >
                <FaSnapchat size={14} />
              </a>
              <a
                href="https://www.instagram.com/tilall2030?igsh=c2wyaThvcmZpb3pz/"
                className="social-icon"
              >
                <FaInstagram size={14} />
              </a>
              <a href="https://twitter.com/tilalr2030" className="social-icon">
                <SiX size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <header className={`main-header ${isScrolled ? "scrolled" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="header-container" ref={navRef}>
          <Link href={`/${lang}`} className="logo-wrapper">
            <img src="/logo.png" alt="Logo" className="logo-image" />
            <div className="logo-text">
              <span className="logo-title">
                {lang === "ar" ? "التلال والرمال" : "Tilal Rimal"}
              </span>
              <span className="logo-subtitle">
                {lang === "ar"
                  ? "لتنظيم الرحلات السياحية"
                  : "Tourism Organization"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                className="nav-item-wrapper"
                onMouseEnter={() =>
                  item.dropdown && handleDropdownMouseEnter(item.type)
                }
                onMouseLeave={(e) =>
                  item.dropdown && handleDropdownMouseLeave(e)
                }
              >
                {item.dropdown ? (
                  <Link
                    href={item.type === "packages" ? `/${lang}/destinations` : `/${lang}${item.href}`}
                    className={`nav-link ${isActive(item.href) ? "active" : ""} ${openDesktopDropdown === item.type ? "dropdown-open" : ""}`}
                    onClick={(e) => {
                      if (window.innerWidth <= 1210) {
                        e.preventDefault();
                        toggleMobileDropdown(item.type, e);
                      }
                    }}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={14}
                      className={`nav-dropdown-arrow ${openDesktopDropdown === item.type ? "rotate-arrow" : ""}`}
                    />
                  </Link>
                ) : (
                  <Link
                    href={`/${lang}${item.href}`}
                    className={`nav-link ${isActive(item.href) ? "active" : ""}`}
                  >
                    {item.label}
                  </Link>
                )}

                {item.dropdown && (
                  <AnimatePresence>
                    {openDesktopDropdown === item.type && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className={`dropdown-menu-wrapper ${isRTL ? "dropdown-rtl" : "dropdown-ltr"}`}
                        onMouseEnter={handleDropdownMouseEnterContainer}
                        onMouseLeave={handleDropdownMouseLeaveContainer}
                        style={{ zIndex: 1000 }}
                      >
                        {item.type === "packages" ? (
                          <div className="dropdown-packages">
                            {Object.entries(displayDestinations).map(
                              ([regionKey, data]) => (
                                <Link
                                  key={regionKey}
                                  href={`/${lang}/destinations?region=${regionKey}`}
                                  className="region-group text-decoration-none d-block"
                                >
                                  <div className="region-trigger">
                                    <span className="region-icon-wrapper">
                                      {data.icon || "🌍"}
                                    </span>
                                    <span>{getRegionLabel(regionKey)}</span>
                                  </div>
                                </Link>
                              ),
                            )}
                          </div>
                        ) : (
                          <div className="dropdown-list">
                            {getDropdownData(item.type).map((d, i) => (
                              <Link
                                key={i}
                                href={`/${lang}${d.href}`}
                                className="dropdown-item"
                              >
                                <div className="dropdown-item-icon">
                                  {d.icon || "✨"}
                                </div>
                                <div className="dropdown-item-content">
                                  <div className="dropdown-item-title">
                                    {localize(d.title)}
                                  </div>
                                  <div className="dropdown-item-desc">
                                    {localize(d.description)}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          <div className="header-actions">
            <LanguageSwitcher lang={lang} showFlagOnly />
            {isAuthenticated && (
              <div className="user-menu" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="user-trigger"
                >
                  <FaUserCircle size={20} />
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown" style={{ zIndex: 1001 }}>
                    <Link href={`/${lang}/dashboard`} className="user-link">
                      <FaUser /> Dashboard
                    </Link>
                    <button onClick={logout} className="user-link logout">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-overlay"
            />
            <motion.div
              initial={{ x: lang === "ar" ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: lang === "ar" ? "-100%" : "100%" }}
              className="mobile-sidebar"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="mobile-sidebar-header">
                <img src="/logo.png" alt="logo" className="mobile-logo" />
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="mobile-sidebar-content">
                {menuItems.map((item, i) => (
                  <div key={i} className="mobile-nav-item">
                    {item.dropdown ? (
                      <>
                        <button
                          className="mobile-link-toggle"
                          onClick={(e) => toggleMobileDropdown(item.type, e)}
                        >
                          {item.label}
                          {openMobileDropdown === item.type ? (
                            <FaChevronUp size={12} className="mobile-arrow" />
                          ) : (
                            <FaChevronDown size={12} className="mobile-arrow" />
                          )}
                        </button>
                        {openMobileDropdown === item.type && (
                          <div className="mobile-nested-menu">
                            {item.type === "packages"
                              ? Object.entries(displayDestinations).map(
                                ([regionKey, data]) => (
                                  <div
                                    key={regionKey}
                                    className="mobile-region-section"
                                  >
                                    <Link
                                      href={`/${lang}/destinations?region=${regionKey}`}
                                      className="mobile-region-btn text-decoration-none"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      {data.icon} {getRegionLabel(regionKey)}
                                    </Link>
                                  </div>
                                ),
                              )
                              : getDropdownData(item.type).map((d, idx) => (
                                <Link
                                  key={idx}
                                  href={`/${lang}${d.href}`}
                                  className="mobile-dropdown-link"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <span className="mobile-link-icon">
                                    {d.icon}
                                  </span>
                                  {localize(d.title)}
                                </Link>
                              ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={`/${lang}${item.href}`}
                        className="mobile-link-toggle"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
