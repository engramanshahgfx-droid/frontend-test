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
  FaTiktok,
  FaSnapchat,
  FaInstagram,
} from "react-icons/fa";
import { SiX } from "react-icons/si";

// ✅ FIXED: Region translations with lowercase keys matching API response
const REGION_LABELS = {
  en: {
    europe: 'Europe',
    asia: 'Asia',
    africa: 'Africa',
    australia: 'Australia & New Zealand',
    america: 'America'
  },
  ar: {
    europe: 'أوروبا',
    asia: 'آسيا',
    africa: 'أفريقيا',
    australia: 'أستراليا ونيوزيلندا',
    america: 'أمريكا'
  }
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

  const userMenuRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${API_URL}/tourism-destinations/navbar`);
        const data = await response.json();
        if (data.success && Object.keys(data.data).length > 0) {
          setTourismDestinations(data.data);
        } else {
          setTourismDestinations(getFallbackDestinations());
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setTourismDestinations(getFallbackDestinations());
      }
    };
    fetchDestinations();
  }, []);

  const getFallbackDestinations = () => ({
    europe: { icon: "🌍", countries: [{ en: "Poland", ar: "بولندا", slug: "poland-discovery" }] },
    asia: { icon: "🌏", countries: [{ en: "Thailand", ar: "تايلاند", slug: "thailand-getaway" }] },
    africa: { icon: "🌍", countries: [{ en: "Morocco", ar: "المغرب", slug: "morocco-discovery" }] },
    australia: { icon: "🌏", countries: [{ en: "Australia", ar: "أستراليا", slug: "australia-adventure" }] },
    america: { icon: "🌎", countries: [{ en: "USA", ar: "الولايات المتحدة", slug: "usa-east-coast" }] },
  });

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
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

  // ✅ Get translated region name - handles both lowercase and capitalized keys
  const getRegionLabel = (regionKey) => {
    const labels = REGION_LABELS[lang] || REGION_LABELS.en;
    // Try exact match first, then try lowercase match
    if (labels[regionKey]) return labels[regionKey];
    // If key is capitalized (e.g., "Europe"), try lowercase
    const lowerKey = regionKey?.toLowerCase();
    if (labels[lowerKey]) return labels[lowerKey];
    return regionKey; // Fallback to the key itself
  };

  const menuItems = [
    { href: "#", label: lang === "ar" ? "الوجهات السياحية" : "Tourism Destinations", dropdown: true, type: "packages" },
    { href: "/tousimoffers", label: lang === "ar" ? "العروض السياحية" : "Tourism Offers" },
    { href: "#", label: lang === "ar" ? "الخدمات الخاصة" : "Special Services", dropdown: true, type: "services" },
    { href: "/trips-archive", label: t("nav.ourTrips") },
    { href: "/visa", label: lang === "ar" ? "التأشيرات" : "Visa Services", dropdown: true, type: "visa" },
    { href: "/basic", label: lang === "ar" ? "متطلبات السفر" : "Travel Requirements", dropdown: true, type: "basic" },
  ];
    
  const visaData = [{ title: { en: "Schengen visa", ar: "تأشيرة الشنغن" }, description: { en: "Requirements", ar: "المتطلبات" }, icon: "🏛️", href: "/visa" }];
  const basicData = [
    {
      title: { en: "About Saudi Arabia", ar: "عن المملكة العربية السعودية" },
      description: { en: "Culture and heritage", ar: "الثقافة والتراث" },
      icon: "🏛️",
      href: "/about-saudi",
    },
    {
      title: { en: "Travel Guide", ar: "دليل المسافر" },
      description: { en: "Transportation", ar: "المواصلات" },
      icon: "📋",
      href: "/transportation",
    }
  ];
  
  const servicesData = [
    {
      title: { en: "Private Jet Booking", ar: "طلب استئجار طائرة خاصة" },
      description: { en: "Request private jet services", ar: "طلب خدمات الطيران الخاص" },
      icon: "✈️",
      href: "/international/private-jet",
    },
    {
      title: { en: "Internet Packages", ar: "باقات الإنترنت" },
      description: { en: "Global internet solutions", ar: "حلول الإنترنت العالمية" },
      icon: "🌐",
      href: "/international/internet-packages",
    }
  ];

  const handleDropdownMouseEnter = (type) => {
    if (window.innerWidth > 1024) {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
      setOpenDesktopDropdown(type);
    }
  };

  const handleDropdownMouseLeave = () => {
    if (window.innerWidth > 1024) {
      dropdownTimeoutRef.current = setTimeout(() => {
        setOpenDesktopDropdown(null);
        setOpenSubDropdown(null);
      }, 200);
    }
  };

  const toggleMobileDropdown = (type, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMobileDropdown(openMobileDropdown === type ? null : type);
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

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
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
               <a href="#" className="social-icon"><FaTiktok size={14} /></a>
               <a href="#" className="social-icon"><FaSnapchat size={14} /></a>
               <a href="#" className="social-icon"><FaInstagram size={14} /></a>
               <a href="#" className="social-icon"><SiX size={14} /></a>
            </div>
          </div>
        </div>
      </div>

      <header className="main-header" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className="header-container">
          <Link href={`/${lang}`} className="logo-wrapper">
            <img src="/logo.png" alt="Logo" className="logo-image" />
            <div className="logo-text">
              <span className="logo-title">{lang === "ar" ? "التلال والرمال" : "Tilal Rimal"}</span>
              <span className="logo-subtitle">TOURISM</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            {menuItems.map((item, idx) => (
              <div 
                key={idx} 
                className="nav-item-wrapper"
                onMouseEnter={() => item.dropdown && handleDropdownMouseEnter(item.type)}
                onMouseLeave={() => item.dropdown && handleDropdownMouseLeave()}
              >
                {item.dropdown ? (
                  <button className="nav-link">
                    {item.label} <FaChevronDown size={10} className="ms-1" />
                  </button>
                ) : (
                  <Link href={`/${lang}${item.href}`} className="nav-link">{item.label}</Link>
                )}

                <AnimatePresence>
                  {openDesktopDropdown === item.type && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 10 }}
                      className="dropdown-menu-wrapper"
                    >
                      {item.type === "packages" ? (
                        <div className="dropdown-packages">
                          {Object.entries(displayDestinations).map(([regionKey, data]) => (
                            <div key={regionKey} className="region-group" onMouseEnter={() => setOpenSubDropdown(regionKey)}>
                              <div className="region-trigger">
                                <span>{data.icon} {getRegionLabel(regionKey)}</span>
                                <ChevronRight size={14} />
                              </div>
                              {openSubDropdown === regionKey && data.countries && data.countries.length > 0 && (
                                <div className="sub-menu">
                                  {data.countries.map(c => (
                                    <Link key={c.slug} href={`/${lang}/destinations/${c.slug}`} className="sub-item">
                                      {lang === 'ar' ? c.ar : c.en}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="dropdown-list">
                          {getDropdownData(item.type).map((d, i) => (
                            <Link key={i} href={`/${lang}${d.href}`} className="dropdown-item">
                              <span className="me-2">{d.icon}</span>
                              <div>
                                <div className="fw-bold">{localize(d.title)}</div>
                                <div className="small text-muted">{localize(d.description)}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="header-actions">
            <LanguageSwitcher lang={lang} showFlagOnly />
            {isAuthenticated && (
                <div className="user-menu" ref={userMenuRef}>
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="user-trigger">
                        <FaUserCircle size={20} />
                    </button>
                    {userMenuOpen && (
                        <div className="user-dropdown">
                            <Link href={`/${lang}/dashboard`} className="user-link"><FaUser /> Dashboard</Link>
                            <button onClick={logout} className="user-link logout"><FaSignOutAlt /> Logout</button>
                        </div>
                    )}
                </div>
            )}
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)} className="mobile-overlay" 
            />
            <motion.div 
              initial={{ x: lang === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '-100%' : '100%' }}
              className="mobile-sidebar"
            >
              <div className="mobile-sidebar-header">
                <img src="/logo.png" alt="logo" className="mobile-logo" />
                <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
              </div>

              <div className="mobile-sidebar-content">
                {menuItems.map((item, i) => (
                  <div key={i} className="mobile-nav-item">
                    {item.dropdown ? (
                      <>
                        <button className="mobile-link-toggle" onClick={(e) => toggleMobileDropdown(item.type, e)}>
                          {item.label} {openMobileDropdown === item.type ? <FaChevronUp size={12}/> : <FaChevronDown size={12}/>}
                        </button>
                        {openMobileDropdown === item.type && (
                          <div className="mobile-nested-menu">
                            {item.type === "packages" ? (
                              Object.entries(displayDestinations).map(([regionKey, data]) => (
                                <div key={regionKey} className="mobile-region-section">
                                  <button className="mobile-region-btn" onClick={(e) => toggleSubDropdown(regionKey, e)}>
                                    {data.icon} {getRegionLabel(regionKey)}
                                  </button>
                                  {openSubDropdown === regionKey && data.countries && data.countries.length > 0 && (
                                    <div className="mobile-country-list">
                                      {data.countries.map(c => (
                                        <Link key={c.slug} href={`/${lang}/destinations/${c.slug}`} onClick={() => setMobileMenuOpen(false)}>
                                          {lang === 'ar' ? c.ar : c.en}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              getDropdownData(item.type).map((d, idx) => (
                                <Link key={idx} href={`/${lang}${d.href}`} className="mobile-dropdown-link" onClick={() => setMobileMenuOpen(false)}>
                                  {d.icon} {localize(d.title)}
                                </Link>
                              ))
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link href={`/${lang}${item.href}`} className="mobile-link-toggle" onClick={() => setMobileMenuOpen(false)}>
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

      <style jsx global>{`
        :root {
          --gold: #dfa528;
          --navy: #1a1a2e;
          --white: #ffffff;
          --border: #e8e6e1;
        }

        .top-bar { background: var(--navy); color: white; padding: 6px 0; font-size: 12px; position: fixed; top: 0; width: 100%; z-index: 1001; }
        .top-bar-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; padding: 0 20px; }
        .social-icons { display: flex; gap: 10px; }
        .social-icon { color: white; opacity: 0.8; }

        .main-header { background: white; border-bottom: 1px solid var(--border); position: fixed; top: 30px; width: 100%; z-index: 1000; height: 70px; }
        .header-container { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 100%; padding: 0 20px; }
        
        .logo-wrapper { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .logo-image { height: 45px; }
        .logo-text { display: flex; flex-direction: column; }
        .logo-title { font-weight: bold; color: var(--navy); font-size: 16px; }
        .logo-subtitle { color: var(--gold); font-size: 10px; letter-spacing: 2px; }

        .desktop-nav { display: none; gap: 10px; }
        @media (min-width: 1024px) { .desktop-nav { display: flex; } }

        .nav-link { background: none; border: none; padding: 10px 15px; color: var(--navy); font-weight: 500; cursor: pointer; font-size: 14px; text-decoration: none; display: flex; align-items: center; }
        .nav-link:hover { color: var(--gold); }

        .dropdown-menu-wrapper { position: absolute; top: 100%; background: white; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 8px; min-width: 250px; padding: 10px; z-index: 1000; }
        .dropdown-item { display: flex; align-items: center; padding: 10px; text-decoration: none; color: var(--navy); border-radius: 5px; }
        .dropdown-item:hover { background: #f9f9f9; color: var(--gold); }

        .region-group { position: relative; padding: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-radius: 5px; }
        .region-group:hover { background: #f9f9f9; }
        .sub-menu { position: absolute; left: 100%; top: 0; background: white; border: 1px solid var(--border); min-width: 200px; border-radius: 8px; box-shadow: 10px 0 30px rgba(0,0,0,0.1); padding: 5px; }
        [dir="rtl"] .sub-menu { left: auto; right: 100%; }
        .sub-item { display: block; padding: 8px 15px; text-decoration: none; color: var(--navy); font-size: 13px; }
        .sub-item:hover { background: #fff9eb; color: var(--gold); }

        .mobile-toggle { background: none; border: none; color: var(--navy); cursor: pointer; }
        .mobile-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1050; }
        .mobile-sidebar { position: fixed; top: 0; bottom: 0; width: 300px; background: white; z-index: 1060; padding: 20px; overflow-y: auto; }
        [dir="ltr"] .mobile-sidebar { right: 0; }
        [dir="rtl"] .mobile-sidebar { left: 0; }

        .mobile-sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .mobile-logo { height: 40px; }
        
        .mobile-link-toggle { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border: none; background: none; border-bottom: 1px solid #eee; font-weight: 600; color: var(--navy); text-decoration: none; font-size: 16px; }
        
        .mobile-nested-menu { background: #fcfcfc; padding: 10px; }
        .mobile-region-section { margin-bottom: 5px; }
        .mobile-region-btn { width: 100%; text-align: start; padding: 10px; background: #f0f0f0; border: none; border-radius: 5px; font-weight: 500; margin-bottom: 5px; display: flex; justify-content: space-between; }
        .mobile-country-list { padding: 5px 20px; display: flex; flex-direction: column; gap: 10px; }
        .mobile-country-list a { text-decoration: none; color: #666; font-size: 14px; }
        .mobile-dropdown-link { display: block; padding: 10px; text-decoration: none; color: #444; border-bottom: 1px dashed #eee; }
      `}</style>
    </>
  );
}