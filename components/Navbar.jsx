"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../providers/AuthProvider";
import { useUI } from "../providers/UIProvider";
import {
  FaWhatsapp,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

export default function Navbar({ lang }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { openBookingOrAuth } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'services' or 'basic' or 'international'
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const servicesRef = useRef(null);
  const basicRef = useRef(null);
  const internationalRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    // Close menus when clicking outside
    const handleClickOutside = (event) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      if (basicRef.current && !basicRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      if (internationalRef.current && !internationalRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".navbar-toggler")
      ) {
        setMobileMenuOpen(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setUserMenuOpen(false);
  }, [pathname]);

  const isActive = (href) => {
    if (href === "/") return pathname === `/${lang}` || pathname === "/";
    return pathname === `/${lang}${href}`;
  };

  const menuItems = [
    { href: "/", label: lang === "ar" ? "الرئيسية" : "Home" },
    {
      href: "/about-us",
      label: lang === "ar" ? "من نحن" : "About Us",
    },
    {
      href: "/international",
      label: lang === "ar" ? " العروض الدولية" : "International offers",
      dropdown: false,
      type: "international",
    },
    { href: "/offers", label: lang === "ar" ? "العروض المحلية" : "Domestic offers" },
    {
      href: "/trips-archive",
      label: lang === "ar" ? "أرشيف الرحلات" : "Trips Archive",
    },
    {
      href: "/basic",
      label: lang === "ar" ? " متطلبات السفر" : "Travel Requirements",
      dropdown: true,
      type: "basic",
    },
  ];

  const internationalData = [
    {
      title: { en: "Flights Booking", ar: "حجز الطيران" },
      description: { en: "International flights", ar: "رحلات طيران دولية" },
      icon: "✈️",
      href: "/international/flights",
    },
    {
      title: { en: "Hotel Reservations", ar: "حجز الفنادق" },
      description: { en: "Worldwide hotels", ar: "فنادق حول العالم" },
      icon: "🏨",
      href: "/international/hotels",
    },
    {
      title: { en: " Offers & Packages", ar: "عروض خاصة" },
      description: { en: " Best Offers All Over the World", ar: "باقات حصرية" },
      icon: "🎁",
      href: "/international/offers",
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
      title: { en: "Visa Requirements ", ar: "   متطلبات التأشيرة" },
      description: {
        en: "  requirements and documents",
        ar: "  متطلبات الدخول والمستندات",
      },
      icon: "🏛️",
      href: "/visa",
    },
    {
      title: { en: "Travel Guide", ar: "دليل المسافر" },
      description: {
        en: "Transportation  ",
        ar: "  المواصلات",
      },
      icon: "📋",
      href: "/transportation",
    },

  ];

  // Hide the global Navbar on admin and dashboard pages
  if (!pathname || pathname?.startsWith(`/${lang}/admin`) || pathname?.startsWith(`/${lang}/dashboard`)) return null;

  const whatsappNumber = "+966547305060";

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdownToggle = (type, e) => {
    // Avoid calling preventDefault/stopPropagation here to keep touch behavior stable on mobile devices.
    // Just toggle state using a functional update to avoid stale closures.
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  const handleNonDropdownLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const getDropdownData = (type) => {
    switch (type) {
      case "basic":
        return basicData;
      case "international":
        return internationalData;
      default:
        return [];
    }
  };

  const getDropdownTitle = (type) => {
    switch (type) {
      case "basic":
        return {
          title: lang === "ar" ? "أساسيات السفر" : "Travel basic",
          subtitle: lang === "ar" ? "استعد لرحلتك" : "Prepare for your journey",
        };
      case "international":
        return {
          title: lang === "ar" ? " العروض الدولية" : "International offers",
          subtitle:
            lang === "ar" ? "خدمات السفر العالمية" : "Global travel services",
        };
      default:
        return { title: "", subtitle: "" };
    }
  };

  const handleBookCTA = () => {
    // alert("clicked"); // uncomment for manual click test
    openBookingOrAuth({ title: lang === "ar" ? "حجز رحلة" : "Book a Trip", amount: 0 });
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push(`/${lang}`);
  };

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg fixed-top ${
          scrolled ? "scrolled" : ""
        }`}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="container">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="navbar-brand"
            onClick={handleNonDropdownLinkClick}
          >
            <img
              src="/logo.png"
              alt="التلال والرمال - Tilal R"
              className="navbar-logo"
            />
          </Link>

          <div className="d-lg-none d-flex align-items-center gap-3">
            <LanguageSwitcher
              lang={lang}
              displayText={lang === "ar" ? "EN" : "ع"}
            />

            {/* Mobile Toggler */}
            <button
              className="navbar-toggler"
              type="button"
              onClick={handleMobileMenuToggle}
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? (
                <FaTimes />
              ) : (
                <span className="navbar-toggler-icon"></span>
              )}
            </button>
          </div>

          {/* Desktop Navbar Links */}
          <div className="d-none d-lg-flex align-items-center">
            <ul className="navbar-nav mx-auto align-items-center">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className={`nav-item mx-2 ${item.dropdown ? "dropdown" : ""}`}
                  ref={
                    item.dropdown
                      ? item.type === "basic"
                        ? basicRef
                        : item.type === "international"
                        ? internationalRef
                        : null
                      : null
                  }
                >
                  {item.dropdown ? (
                    <div className="dropdown-container">
                      <button
                        type="button"
                        className={`nav-link dropdown-toggle ${
                          isActive(item.href) ? "active" : ""
                        }`}
                        onClick={(e) => handleDropdownToggle(item.type, e)}
                      >
                        {item.label}
                        {lang === "ar" ? (
                          <FaChevronUp size={12} className="ms-1" />
                        ) : (
                          <FaChevronDown size={12} className="ms-1" />
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdown === item.type && (
                        <div className="dropdown-menu show">
                          <div className="dropdown-content">
                            <div className="dropdown-header">
                              <h6>{getDropdownTitle(item.type).title}</h6>
                              <p>{getDropdownTitle(item.type).subtitle}</p>
                            </div>
                            <div className="dropdown-grid">
                              {getDropdownData(item.type).map(
                                (data, dataIndex) => (
                                  <Link
                                    key={dataIndex}
                                    href={`/${lang}${data.href}`}
                                    className="dropdown-item"
                                    data-testid={`dropdown-link-${dataIndex}`}
                                  >
                                    <div className="service-icon">
                                      {data.icon}
                                    </div>
                                    <div className="service-content">
                                      <h6>{data.title[lang]}</h6>
                                      <p>{data.description[lang]}</p>
                                    </div>
                                  </Link>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={`/${lang}${item.href === "/" ? "" : item.href}`}
                      className={`nav-link ${
                        isActive(item.href) ? "active" : ""
                      }`}
                      onClick={handleNonDropdownLinkClick}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Desktop Language & Buttons */}
            <div className="d-flex align-items-center ms-4 gap-3">
              <LanguageSwitcher
                lang={lang}
                displayText={lang === "ar" ? "EN" : "ع"}
              />
              {/* <button
                className="btn btn-book d-flex align-items-center gap-2"
                onClick={handleBookCTA}
              >
                <FaWhatsapp /> {lang === "ar" ? "احجز رحلتك" : "Book Now"}
              </button> */}

              {isAuthenticated ? (
                <div className="user-menu" ref={userMenuRef}>
                  <button
                    className="user-trigger"
                    onClick={() => setUserMenuOpen((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={userMenuOpen}
                  >
                    <FaUserCircle size={20} />
                    <span className="user-name">{user?.name || (lang === "ar" ? "حسابي" : "Account")}</span>
                    {userMenuOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                  </button>
                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <Link href={`/${lang}/dashboard`} className="user-link" onClick={() => setUserMenuOpen(false)}>
                        <FaUser size={14} /> {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
                      </Link>
                      <Link href={`/${lang}/dashboard?tab=bookings`} className="user-link" onClick={() => setUserMenuOpen(false)}>
                        <FaWhatsapp size={14} /> {lang === "ar" ? "حجوزاتي" : "My Bookings"}
                      </Link>
                      <button className="user-link logout" onClick={handleLogout}>
                        <FaSignOutAlt size={14} /> {lang === "ar" ? "تسجيل الخروج" : "Logout"}
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        ref={mobileMenuRef}
        className={`mobile-sidebar ${isMobileMenuOpen ? "show" : ""}`}
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
              className="navbar-logo"
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
                    onClick={(e) => handleDropdownToggle(item.type, e)}
                    onTouchStart={(e) => handleDropdownToggle(item.type, e)}
                  >
                    <span>{item.label}</span>
                    {openDropdown === item.type ? (
                      <FaChevronUp size={12} />
                    ) : (
                      <FaChevronDown size={12} />
                    )}
                  </button>
                  {openDropdown === item.type && (
                    <div className="mobile-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                      {getDropdownData(item.type).map((data, dataIndex) => (
                        <Link
                          key={dataIndex}
                          href={`/${lang || 'ar'}${data.href}`}
                          className="mobile-dropdown-item"
                          prefetch={false}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMobileMenuOpen(false);
                            setOpenDropdown(null);
                          }}
                        >
                          <span className="service-icon-mobile">
                            {data.icon}
                          </span>
                          <div>
                            <div className="service-title">
                              {data.title[lang]}
                            </div>
                            <div className="service-desc">
                              {data.description[lang]}
                            </div>
                          </div>
                        </Link>
                      ))}
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

          {/* Mobile Buttons */}
          <div className="mobile-buttons">
            {/* <button
              className="btn btn-whatsapp d-flex align-items-center gap-2 w-100 justify-content-center mb-3"
              onClick={handleBookCTA}
            >
              <FaWhatsapp /> {lang === "ar" ? "احجز رحلتك" : "Book Now"}
            </button> */}

            {isAuthenticated ? (
              <div className="mobile-user-actions">
                <Link href={`/${lang}/dashboard`} className="mobile-user-link" onClick={() => setMobileMenuOpen(false)}>
                  <FaUser size={14} /> {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
                </Link>
                <Link href={`/${lang}/dashboard?tab=bookings`} className="mobile-user-link" onClick={() => setMobileMenuOpen(false)}>
                  <FaWhatsapp size={14} /> {lang === "ar" ? "حجوزاتي" : "My Bookings"}
                </Link>
                <button className="mobile-user-link logout" onClick={handleLogout}>
                  <FaSignOutAlt size={14} /> {lang === "ar" ? "تسجيل الخروج" : "Logout"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        :root {
          --primary-color: #8a7779;
          --secondary-color: #efc8ae;
          --dark-color: #1e1e1e;
          --light-color: #ffffff;
          --accent-color: #dfa528;
          --whatsapp-green: #25d366;
        }

        .navbar {
          padding: 0.7rem 0; /* reduced so items have more room by default */
          z-index: 1030;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0) !important;
          border-bottom: 1px solid rgba(138, 119, 121, 0.1);
        }

        /* Keep the header compact and prevent wrapping of menu items */
        .navbar .container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .navbar-nav {
          display: flex;
          gap: 0.5rem;
          flex-wrap: nowrap; /* prevent wrapping */
          white-space: nowrap;
          align-items: center;
        }

        .navbar-nav .nav-item {
          flex: 0 0 auto;
        }

        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important;
        }
        .navbar.scrolled {
          background: linear-gradient(135deg, #000000ff, #2c3e50) !important;

          padding: 0.7rem 0;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }

        .navbar-logo {
          height: 45px; /* slightly smaller to avoid wrapping before scroll */
          width: auto;
          transition: all 0.3s ease;
        }

        .navbar.scrolled .navbar-logo {
          height: 40px;
        }

        .navbar-toggler {
          border: none;
          background: transparent;
          color: white;
          font-size: 1.2rem;
          padding: 0.5rem;
        }

        .navbar.scrolled .navbar-toggler {
          color: white;
        }

        .navbar-nav .nav-link {
          font-weight: 600;
          color: white !important;
          transition: all 0.3s ease;
          padding: 0.35rem 0.7rem; /* tighter padding */
          border-radius: 6px;
          font-size: 0.93rem;
          border: none;
          background: none;
          cursor: pointer;
          white-space: nowrap;
        }

        .navbar-nav .nav-link:hover,
        .navbar-nav .nav-link.active {
          color: var(--light-color) !important;
          background-color: rgba(255, 255, 255, 0.2);
        }

        .navbar.scrolled .navbar-nav .nav-link {
          color: var(--light-color) !important;
        }

        .navbar.scrolled .navbar-nav .nav-link:hover,
        .navbar.scrolled .navbar-nav .nav-link.active {
          color: var(--light-color) !important;
          background-color: rgba(66, 64, 64, 1);
        }

        /* Dropdown Styles */
        .dropdown-container {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          background: var(--light-color);
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(138, 119, 121, 0.1);
          padding: 0;
          margin-top: 10px;
          z-index: 1000;
        }

        [dir="rtl"] .dropdown-menu {
          left: auto;
          right: 50%;
          transform: translateX(50%);
        }

        .dropdown-content {
          padding: 1.5rem;
        }

        .dropdown-header {
          text-align: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--secondary-color);
        }

        .dropdown-header h6 {
          color: var(--primary-color);
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .dropdown-header p {
          color: var(--dark-color);
          opacity: 0.8;
          margin: 0;
          font-size: 0.9rem;
        }

        .dropdown-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .dropdown-item {
          display: flex;
          align-items: flex-start;
          padding: 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          text-decoration: none;
          border: 1px solid transparent;
        }

        .dropdown-item:hover {
          background: rgba(138, 119, 121, 0.05);
          border-color: var(--secondary-color);
          transform: translateY(-2px);
        }

        .service-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
          margin-top: 0.25rem;
        }

        [dir="rtl"] .service-icon {
          margin-right: 0;
          margin-left: 1rem;
        }

        .service-content h6 {
          color: var(--dark-color);
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .service-content p {
          color: var(--dark-color);
          opacity: 0.7;
          font-size: 0.85rem;
          margin: 0;
        }

        /* WhatsApp / Mobile Book Button */
        .btn-whatsapp {
          background: #EFC8AE;
          color: #000 !important;
          border: none;
          padding: 0.45rem 1rem; /* slightly smaller */
          border-radius: 22px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 3px 10px rgba(223, 165, 40, 0.25);
        }

        .btn-whatsapp:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 14px rgba(223, 165, 40, 0.32);
          color: #000 !important;
        }

        .btn-book {
          background: #EFC8AE;
          color: #000 !important;
          border: none;
          padding: 0.45rem 1rem; /* reduced size */
          min-width: 120px; /* slightly smaller minimum width */
          border-radius: 22px;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.18s ease;
          box-shadow: 0 4px 12px rgba(223, 165, 40, 0.22);
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          justify-content: center;
          flex: 0 0 auto; /* prevent shrinking */
        }

        .btn-book:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(223, 165, 40, 0.28);
          color: #000 !important;
        }

        /* Override warning buttons used in booking flows */
        .btn-warning {
          background: #EFC8AE !important;
          color: #000 !important;
          border: none !important;
          box-shadow: 0 6px 22px rgba(223, 165, 40, 0.28) !important;
        }

        .btn-warning:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(223, 165, 40, 0.35) !important;
          color: #000 !important;
        }

        .user-menu {
          position: relative;
        }

        .user-trigger {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          padding: 0.55rem 0.85rem;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 200px;
          background: linear-gradient(180deg, rgba(16,16,24,0.95), rgba(28,28,36,0.95));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.45);
          padding: 0.4rem;
          z-index: 1100;
          color: var(--light-color);
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
          padding: 0.65rem 0.75rem;
          color: var(--light-color) !important;
          border-radius: 10px;
          border: none;
          background: transparent;
          text-decoration: none;
          cursor: pointer;
        }

        .user-link:hover {
          background: rgba(255,255,255,0.04);
        }

        .user-link.logout {
          color: #ff7675 !important; /* lighter red on dark background */
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
          border-radius: 10px;
          border: 1px solid #eef1f4;
          background: #f7f8fa;
          color: #111 !important;
          text-decoration: none;
        }

        .mobile-user-link.logout {
          color: #b91c1c !important;
        }

        /* Mobile Menu Styles */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(30, 30, 30, 0.7);
          z-index: 1040;
        }

        .mobile-sidebar {
          position: fixed;
          top: 0;
          right: -100%;
          width: 320px;
          height: 100vh;
          background: var(--light-color) !important;
          box-shadow: -2px 0 20px rgba(0, 0, 0, 0.1);
          transition: right 0.3s ease;
          z-index: 1050;
          overflow-y: auto;
        }

        [dir="rtl"] .mobile-sidebar {
          right: auto;
          left: -100%;
        }

        .mobile-sidebar.show {
          right: 0;
        }

        [dir="rtl"] .mobile-sidebar.show {
          left: 0;
          right: auto;
        }

        .mobile-sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 2px solid var(--secondary-color);
          background: var(--light-color);
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.3rem;
          color: var(--primary-color) !important;
          padding: 0.5rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .close-btn:hover {
          color: var(--accent-color) !important;
        }

        .mobile-sidebar-content {
          padding: 1.5rem;
        }

        .mobile-menu-item {
          border-bottom: 1px solid rgba(239, 200, 174, 0.3);
        }

        .mobile-menu-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          color: var(--dark-color) !important;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 1rem;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        [dir="rtl"] .mobile-menu-link {
          text-align: right;
        }

        .mobile-menu-link:hover {
          color: var(--primary-color) !important;
        }

        /* Mobile Dropdown */
        .mobile-dropdown-menu {
          padding: 0.5rem 0 0.5rem 1rem;
          background: rgba(138, 119, 121, 0.05);
          border-radius: 8px;
          margin: 0.5rem 0;
          position: relative;
          z-index: 5;
        }

        [dir="rtl"] .mobile-dropdown-menu {
          padding: 0.5rem 1rem 0.5rem 0;
        }

        .mobile-dropdown-item {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          z-index: 10;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
        }

        .mobile-dropdown-item:hover,
        .mobile-dropdown-item:active {
          background: rgba(138, 119, 121, 0.1);
        }

        .service-icon-mobile {
          font-size: 1.25rem;
          margin-right: 0.75rem;
        }

        [dir="rtl"] .service-icon-mobile {
          margin-right: 0;
          margin-left: 0.75rem;
        }

        .service-title {
          font-weight: 600;
          color: var(--dark-color);
          font-size: 0.9rem;
        }

        .service-desc {
          color: var(--dark-color);
          opacity: 0.7;
          font-size: 0.8rem;
        }

        .mobile-buttons {
          padding: 1.5rem 0;
          border-top: 2px solid var(--secondary-color);
          margin-top: 1rem;
        }

        /* Language Switcher */
        .language-switcher-btn {
          background: transparent;
          border: 2px solid var(--dark-color);
          color: var(--dark-color);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 60px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
        }

        .language-switcher-btn:hover {
          background: var(--dark-color);
          color: var(--light-color) !important;
          text-decoration: none;
          transform: translateY(-2px);
        }

        /* Arabic variant (switches TO Arabic) */
        .language-switcher-btn.language--arabic {
          background: var(--accent-color);
          border-color: var(--accent-color);
          color: var(--light-color) !important;
        }

        .language-switcher-btn.language--arabic:hover {
          filter: brightness(0.95);
          transform: translateY(-2px);
        }

        /* Default / English-target variant */
        .language-switcher-btn.language--default {
          background: transparent;
          border-color: var(--dark-color);
          color: var(--dark-color);
        }

        .navbar.scrolled .language-switcher-btn.language--default {
          border-color: var(--light-color);
          color: var(#fffff) !important;
          background: var(--light-color);
          box-shadow: 0 6px 16px rgba(0,0,0,0.12);
        }

        .navbar.scrolled .language-switcher-btn.language--default:hover {
          filter: brightness(0.98);
          color: var(--dark-color) !important;
          transform: translateY(-2px);
        }

        /* RTL Support */
        [dir="rtl"] .ms-4 {
          margin-left: 0 !important;
          margin-right: 1.5rem !important;
        }

        [dir="rtl"] .ms-1 {
          margin-left: 0 !important;
          margin-right: 0.25rem !important;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .dropdown-menu {
            width: 90vw;
            left: 5vw;
            transform: none;
          }

          [dir="rtl"] .dropdown-menu {
            right: 5vw;
            left: auto;
            transform: none;
          }

          .dropdown-grid {
            grid-template-columns: 1fr;
          }

          /* Make the book CTA easier to tap on mobile */
          .btn-book {
            padding: 0.6rem 1rem;
            min-width: 140px;
            font-size: 1rem;
          }
        }

        @media (max-width: 575px) {
          .mobile-sidebar {
            width: 320px; /* make slightly wider for better tap targets */
          }

          .navbar-logo {
            height: 45px;
          }

          .navbar.scrolled .navbar-logo {
            height: 40px;
          }
        }
      `}</style>
    </>
  );
}