"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL, getToken } from "../lib/api";
import {
  X,
  Phone,
  Calendar,
  Users,
  MapPin,
  Music,
  Trophy,
  Ship,
  Coffee,
  Utensils,
  Target,
  User,
  Check,
  ChevronRight,
  ChevronLeft,
  Mail,
  Hotel,
  Plane,
  CreditCard,
  Bed,
  Star,
  Wifi,
  Car,
  Clock,
  AlertCircle,
  Globe,
  Briefcase,
  Compass,
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useUI } from "../providers/UIProvider";
import { useAuth } from "../providers/AuthProvider";

export default function ReservationModal() {
  const params = useParams();
  const lang = params?.lang || "en";
  const isRTL = lang === "ar";

  const { reservationModal, closeReservationModal, triggerDashboardRefresh } = useUI();
  const { user } = useAuth();
  const isOpen = reservationModal?.open;
  const destination = reservationModal?.trip || null;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingType, setBookingType] = useState("activity");
  const [bookingLocation, setBookingLocation] = useState("international");
  const [showValidationError, setShowValidationError] = useState(false);
  const [reservationRef, setReservationRef] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Dynamic destinations data from API
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [destinationsLoading, setDestinationsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Saudi regions data
  const saudiRegions = [
    {
      id: "riyadh",
      name: { en: "Riyadh Region", ar: "منطقة الرياض" },
      cities: [
        { en: "Riyadh", ar: "الرياض" },
        { en: "Al-Kharj", ar: "الخرج" },
        { en: "Diriyah", ar: "الدرعية" },
        { en: "Al-Majma'ah", ar: "المجمعة" },
      ],
    },
    {
      id: "makkah",
      name: { en: "Makkah Region", ar: "منطقة مكة المكرمة" },
      cities: [
        { en: "Jeddah", ar: "جدة" },
        { en: "Mecca", ar: "مكة المكرمة" },
        { en: "Taif", ar: "الطائف" },
        { en: "Rabigh", ar: "رابغ" },
      ],
    },
    {
      id: "madinah",
      name: { en: "Al Madinah Region", ar: "منطقة المدينة المنورة" },
      cities: [
        { en: "Medina", ar: "المدينة المنورة" },
        { en: "Al-'Ula", ar: "العلا" },
        { en: "Yanbu", ar: "ينبع" },
      ],
    },
    {
      id: "eastern",
      name: { en: "Eastern Province", ar: "المنطقة الشرقية" },
      cities: [
        { en: "Dammam", ar: "الدمام" },
        { en: "Khobar", ar: "الخبر" },
        { en: "Jubail", ar: "الجبيل" },
        { en: "Al Ahsa", ar: "الأحساء" },
      ],
    },
    {
      id: "asir",
      name: { en: "Asir Region", ar: "منطقة عسير" },
      cities: [
        { en: "Abha", ar: "أبها" },
        { en: "Khamis Mushait", ar: "خميس مشيط" },
        { en: "Rijal Almaa", ar: "رجال ألمع" },
      ],
    },
    {
      id: "tabuk",
      name: { en: "Tabuk Region", ar: "منطقة تبوك" },
      cities: [
        { en: "Tabuk", ar: "تبوك" },
        { en: "Neom", ar: "نيوم" },
        { en: "Umluj", ar: "أملج" },
      ],
    },
  ];

  const getDefaultDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const defaultDate = getDefaultDate();

  const [formData, setFormData] = useState({
    bookingLocation: "international",
    bookingType: "activity",
    name: "",
    phoneNumber: "",
    userEmail: "",
    numberOfGuests: 2,
    region: "",
    city: "",
    localDestination: "",
    date: defaultDate,
    entertainment: [],
    selectedActivities: [],
    foodSelection: [],
    checkInDate: defaultDate,
    checkOutDate: defaultDate,
    roomType: "standard",
    specialRequests: "",
  });

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsSubmitted(false);
      setSubmitError(null);
      setSelectedCountry("");
      setSelectedDestination(null);

      const loc = destination?.bookingLocation || (destination?.type === "local" ? "local" : "international");
      const bType = destination?.preferredBookingType || "activity";

      setBookingLocation(loc);
      setBookingType(bType);

      setFormData({
        bookingLocation: loc,
        bookingType: bType,
        name: user?.name || "",
        phoneNumber: user?.phone || "",
        userEmail: user?.email || "",
        numberOfGuests: destination?.guests || 2,
        region: "",
        city: "",
        localDestination: destination?.title || "",
        date: defaultDate,
        entertainment: [],
        selectedActivities: [],
        foodSelection: [],
        checkInDate: defaultDate,
        checkOutDate: defaultDate,
        roomType: "standard",
        specialRequests: "",
      });
    }
  }, [isOpen, destination, user]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fetch available countries
  useEffect(() => {
    if (isOpen && bookingLocation === "international") {
      const fetchCountries = async () => {
        try {
          setDestinationsLoading(true);
          const response = await fetch(`${API_URL}/international/destinations/countries`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
              setAvailableCountries(data.data);
            }
          }
        } catch (err) {
          console.error("Failed to fetch countries:", err);
        } finally {
          setDestinationsLoading(false);
        }
      };
      fetchCountries();
    }
  }, [isOpen, bookingLocation]);

  // Fetch destinations by country
  useEffect(() => {
    if (selectedCountry && bookingLocation === "international") {
      const fetchDestinations = async () => {
        try {
          setDestinationsLoading(true);
          const countryObj = availableCountries.find((c) => c.id === selectedCountry);
          const countryName = countryObj?.name_en || selectedCountry;
          const response = await fetch(`${API_URL}/international/destinations/filter?country=${encodeURIComponent(countryName)}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
              setAvailableDestinations(data.data);
            }
          }
        } catch (err) {
          console.error("Failed to fetch destinations:", err);
        } finally {
          setDestinationsLoading(false);
        }
      };
      fetchDestinations();
    }
  }, [selectedCountry, bookingLocation, availableCountries]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (showValidationError) setShowValidationError(false);
  };

  const handleArrayToggle = (field, value) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      if (bookingLocation === "local") {
        return !!formData.region && !!formData.city;
      }
      return true;
    }
    if (currentStep === 2) {
      if (bookingLocation === "local") {
        return !!formData.date && Number(formData.numberOfGuests) > 0;
      }
      return !!formData.checkInDate && Number(formData.numberOfGuests) > 0;
    }
    if (currentStep === 3) {
      return (
        !!formData.name &&
        !!formData.phoneNumber &&
        !!formData.userEmail &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)
      );
    }
    return false;
  };

  const nextStep = () => {
    if (isStepValid()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      setShowValidationError(false);
    } else {
      setShowValidationError(true);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setShowValidationError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      nextStep();
      return;
    }

    if (!isStepValid()) {
      setShowValidationError(true);
      return;
    }

    try {
      setIsSubmitted(true);
      setSubmitError(null);

      const preferredDate = bookingLocation === "local" ? formData.date : formData.checkInDate;
      const tripTitle = bookingLocation === "local"
        ? (formData.localDestination || `${formData.city}, ${formData.region}`)
        : (destination?.title || "International Trip Package");

      const token = getToken();
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: formData.name,
          email: formData.userEmail,
          phone: formData.phoneNumber,
          trip_type: bookingType,
          trip_slug: destination?.slug || null,
          trip_title: tripTitle,
          preferred_date: preferredDate,
          guests: Number(formData.numberOfGuests) || 1,
          notes: formData.specialRequests,
          details: formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to complete reservation");
      }

      setReservationRef(result.reservation?.id || `REF-${Math.floor(100000 + Math.random() * 900000)}`);
      triggerDashboardRefresh?.();

      setTimeout(() => {
        closeReservationModal();
        setIsSubmitted(false);
      }, 4000);
    } catch (error) {
      console.error("Reservation Error:", error);
      setIsSubmitted(false);
      setSubmitError(error?.message || (isRTL ? "حدث خطأ أثناء إرسال طلب الحجز" : "Error submitting reservation request"));
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <motion.div
        initial={{ scale: 0.94, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 20 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "90vh",
          boxShadow: "0 25px 65px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(223, 165, 40, 0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            background: "linear-gradient(135deg, #1C0052 0%, #2D006B 100%)",
            color: "#ffffff",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "3.5px solid #DFA528",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                backgroundColor: "rgba(223, 165, 40, 0.15)",
                border: "1.5px solid #DFA528",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F3D082",
              }}
            >
              <Compass size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#ffffff" }}>
                {isRTL ? "طلب حجز رحلة سياحية" : "Travel Reservation Form"}
              </h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#F3D082" }}>
                {destination?.title ? destination.title : (isRTL ? "شركة التلال والرمال لتنظيم الرحلات" : "Tilal Rimal Tourism Organization")}
              </p>
            </div>
          </div>

          <button
            onClick={closeReservationModal}
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              border: "none",
              color: "#ffffff",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        {!isSubmitted && (
          <div style={{ backgroundColor: "#FAF6F0", padding: "14px 24px", borderBottom: "1px solid #EFE4D2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              {[
                isRTL ? "1. الوجهة والنوع" : "1. Type & Destination",
                isRTL ? "2. التاريخ والضيوف" : "2. Dates & Guests",
                isRTL ? "3. بيانات التواصل" : "3. Contact Info",
              ].map((stepLabel, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: currentStep === idx + 1 ? 700 : 500,
                    color: currentStep === idx + 1 ? "#DFA528" : currentStep > idx + 1 ? "#10b981" : "#6b7280",
                  }}
                >
                  {stepLabel}
                </span>
              ))}
            </div>
            <div style={{ width: "100%", height: "5px", backgroundColor: "#EFE4D2", borderRadius: "10px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${(currentStep / 3) * 100}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #DFA528, #F3D082)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Form Body */}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          {submitError && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                border: "1px solid #fca5a5",
                color: "#991b1b",
                padding: "12px 16px",
                borderRadius: "12px",
                marginBottom: "16px",
                fontSize: "0.88rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <AlertCircle size={18} />
              <span>{submitError}</span>
            </div>
          )}

          {isSubmitted ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  backgroundColor: "#d1fae5",
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <CheckCircle2 size={40} />
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1C0052", marginBottom: "8px" }}>
                {isRTL ? "تم استلام طلب الحجز بنجاح!" : "Reservation Submitted Successfully!"}
              </h3>
              <p style={{ color: "#4b5563", fontSize: "0.95rem", marginBottom: "16px" }}>
                {isRTL
                  ? "سيتواصل معك فريق الحجوزات بشركة التلال والرمال خلال 24 ساعة لتأكيد التفاصيل."
                  : "Our team at Tilal Rimal will contact you within 24 hours to confirm your booking."}
              </p>
              {reservationRef && (
                <div
                  style={{
                    display: "inline-block",
                    backgroundColor: "#FAF6F0",
                    border: "1.5px dashed #DFA528",
                    padding: "10px 20px",
                    borderRadius: "12px",
                    fontWeight: 700,
                    color: "#1C0052",
                    fontSize: "1rem",
                  }}
                >
                  {isRTL ? "رقم المرجعية: " : "Reference No: "} {reservationRef}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* STEP 1: Type & Destination */}
              {currentStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1C0052", marginBottom: "10px", display: "block" }}>
                    {isRTL ? "اختر وجهة ونوع الحجز" : "Select Booking Location"}
                  </label>

                  {/* Location Switcher */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                    <button
                      type="button"
                      onClick={() => setBookingLocation("local")}
                      style={{
                        padding: "14px",
                        borderRadius: "14px",
                        border: bookingLocation === "local" ? "2px solid #DFA528" : "1.5px solid #EFE4D2",
                        backgroundColor: bookingLocation === "local" ? "#FAF6F0" : "#ffffff",
                        color: bookingLocation === "local" ? "#DFA528" : "#4b5563",
                        fontWeight: 700,
                        fontSize: "0.92rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <MapPin size={18} />
                      <span>{isRTL ? "🇸🇦 داخل المملكة (محلي)" : "🇸🇦 Local Saudi Trips"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBookingLocation("international")}
                      style={{
                        padding: "14px",
                        borderRadius: "14px",
                        border: bookingLocation === "international" ? "2px solid #DFA528" : "1.5px solid #EFE4D2",
                        backgroundColor: bookingLocation === "international" ? "#FAF6F0" : "#ffffff",
                        color: bookingLocation === "international" ? "#DFA528" : "#4b5563",
                        fontWeight: 700,
                        fontSize: "0.92rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <Globe size={18} />
                      <span>{isRTL ? "🌍 رحلات دولية" : "🌍 International Trips"}</span>
                    </button>
                  </div>

                  {/* Local Options */}
                  {bookingLocation === "local" ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <div>
                        <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>
                          {isRTL ? "المنطقة *" : "Region *"}
                        </label>
                        <select
                          name="region"
                          value={formData.region}
                          onChange={handleInputChange}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "12px",
                            border: showValidationError && !formData.region ? "1.5px solid #ef4444" : "1.5px solid #EFE4D2",
                            backgroundColor: "#FAF6F0",
                            color: "#1C0052",
                            fontSize: "0.9rem",
                            outline: "none",
                          }}
                        >
                          <option value="">{isRTL ? "اختر المنطقة" : "Select Region"}</option>
                          {saudiRegions.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name[lang] || r.name.en}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>
                          {isRTL ? "المدينة *" : "City *"}
                        </label>
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={!formData.region}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "12px",
                            border: showValidationError && !formData.city ? "1.5px solid #ef4444" : "1.5px solid #EFE4D2",
                            backgroundColor: "#FAF6F0",
                            color: "#1C0052",
                            fontSize: "0.9rem",
                            outline: "none",
                          }}
                        >
                          <option value="">{isRTL ? "اختر المدينة" : "Select City"}</option>
                          {formData.region &&
                            saudiRegions
                              .find((r) => r.id === formData.region)
                              ?.cities.map((c) => (
                                <option key={c.en} value={c[lang] || c.en}>
                                  {c[lang] || c.en}
                                </option>
                              ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    /* International Options */
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <div>
                        <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>
                          {isRTL ? "الدولة *" : "Country *"}
                        </label>
                        <select
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "12px",
                            border: "1.5px solid #EFE4D2",
                            backgroundColor: "#FAF6F0",
                            color: "#1C0052",
                            fontSize: "0.9rem",
                            outline: "none",
                          }}
                        >
                          <option value="">{isRTL ? "اختر الدولة" : "Select Country"}</option>
                          {availableCountries.map((c) => (
                            <option key={c.id} value={c.id}>
                              {isRTL ? c.name_ar : c.name_en}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>
                          {isRTL ? "الوجهة" : "Destination"}
                        </label>
                        <select
                          value={selectedDestination || ""}
                          onChange={(e) => setSelectedDestination(e.target.value)}
                          disabled={!selectedCountry}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "12px",
                            border: "1.5px solid #EFE4D2",
                            backgroundColor: "#FAF6F0",
                            color: "#1C0052",
                            fontSize: "0.9rem",
                            outline: "none",
                          }}
                        >
                          <option value="">{isRTL ? "اختر الوجهة" : "Select Destination"}</option>
                          {availableDestinations.map((d) => (
                            <option key={d.id} value={d.id}>
                              {isRTL ? d.name_ar : d.name_en}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 2: Dates & Guests */}
              {currentStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
                    <div>
                      <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>
                        {isRTL ? "تاريخ السفر المفضّل *" : "Preferred Date *"}
                      </label>
                      <input
                        type="date"
                        name={bookingLocation === "local" ? "date" : "checkInDate"}
                        min={defaultDate}
                        value={bookingLocation === "local" ? formData.date : formData.checkInDate}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          border: "1.5px solid #EFE4D2",
                          backgroundColor: "#FAF6F0",
                          color: "#1C0052",
                          fontSize: "0.9rem",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>
                        {isRTL ? "عدد المسافرين / الضيوف *" : "Number of Guests *"}
                      </label>
                      <input
                        type="number"
                        name="numberOfGuests"
                        min={1}
                        max={50}
                        value={formData.numberOfGuests}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          border: "1.5px solid #EFE4D2",
                          backgroundColor: "#FAF6F0",
                          color: "#1C0052",
                          fontSize: "0.9rem",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "8px", display: "block" }}>
                      {isRTL ? "أنشطة وخدمات إضافية (اختياري)" : "Additional Activities & Options (Optional)"}
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {[
                        { id: "bbq", label: isRTL ? "🍗 وجبة شواء BBQ" : "🍗 Live BBQ Dining" },
                        { id: "safari", label: isRTL ? "🐫 سفاري ركوب الإبل والخيول" : "🐫 Camel & Horse Riding" },
                        { id: "music", label: isRTL ? "🪕 جلسة عود وموسيقى" : "🪕 Live Music & Oud" },
                        { id: "archery", label: isRTL ? "🏹 تحدي الرماية بالقوس" : "🏹 Archery Challenge" },
                      ].map((act) => (
                        <button
                          key={act.id}
                          type="button"
                          onClick={() => handleArrayToggle("selectedActivities", act.id)}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "20px",
                            border: formData.selectedActivities.includes(act.id) ? "1.5px solid #DFA528" : "1.5px solid #EFE4D2",
                            backgroundColor: formData.selectedActivities.includes(act.id) ? "#FAF6F0" : "#ffffff",
                            color: formData.selectedActivities.includes(act.id) ? "#DFA528" : "#4b5563",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Contact Info */}
              {currentStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>
                        {isRTL ? "الاسم الكامل *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={isRTL ? "أدخل اسمك الكامل" : "Enter your full name"}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          border: showValidationError && !formData.name ? "1.5px solid #ef4444" : "1.5px solid #EFE4D2",
                          backgroundColor: "#FAF6F0",
                          color: "#1C0052",
                          fontSize: "0.9rem",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>
                        {isRTL ? "رقم الجوال (واتساب) *" : "Mobile / WhatsApp Number *"}
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+966 5X XXX XXXX"
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          border: showValidationError && !formData.phoneNumber ? "1.5px solid #ef4444" : "1.5px solid #EFE4D2",
                          backgroundColor: "#FAF6F0",
                          color: "#1C0052",
                          fontSize: "0.9rem",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>
                      {isRTL ? "البريد الإلكتروني *" : "Email Address *"}
                    </label>
                    <input
                      type="email"
                      name="userEmail"
                      value={formData.userEmail}
                      onChange={handleInputChange}
                      placeholder="example@mail.com"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "12px",
                        border: showValidationError && !formData.userEmail ? "1.5px solid #ef4444" : "1.5px solid #EFE4D2",
                        backgroundColor: "#FAF6F0",
                        color: "#1C0052",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>
                      {isRTL ? "طلبات وملاحظات خاصة (اختياري)" : "Special Requests (Optional)"}
                    </label>
                    <textarea
                      name="specialRequests"
                      rows={3}
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder={isRTL ? "أذكر أي تجهيزات خاصة مثل الوجبات أو المواصلات..." : "Any special requests or transport notes..."}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "12px",
                        border: "1.5px solid #EFE4D2",
                        backgroundColor: "#FAF6F0",
                        color: "#1C0052",
                        fontSize: "0.9rem",
                        outline: "none",
                        resize: "none",
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "24px",
                  paddingTop: "16px",
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "12px",
                      border: "1.5px solid #EFE4D2",
                      backgroundColor: "#FAF6F0",
                      color: "#1C0052",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    <span>{isRTL ? "السابق" : "Back"}</span>
                  </button>
                ) : <div />}

                <button
                  type="submit"
                  disabled={!isStepValid()}
                  style={{
                    padding: "12px 28px",
                    borderRadius: "12px",
                    border: "none",
                    background: isStepValid()
                      ? "linear-gradient(135deg, #DFA528 0%, #c98c1e 100%)"
                      : "#e5e7eb",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: isStepValid() ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: isStepValid() ? "0 4px 14px rgba(223, 165, 40, 0.35)" : "none",
                  }}
                >
                  <span>
                    {currentStep === 3
                      ? (isRTL ? "إكمال الحجز الآن" : "Complete Reservation")
                      : (isRTL ? "التالي" : "Next")}
                  </span>
                  {currentStep < 3 && (isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />)}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}