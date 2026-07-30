"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Calendar,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  MapPin,
  Users,
  Clock,
  Hotel,
  MessageSquare,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  Plane,
  Building,
} from "lucide-react";
import Image from "next/image";
import { API_URL } from "@/lib/api";

export default function TravelReservationModal({
  isOpen,
  onClose,
  packageData,
  lang = "en",
}) {
  const isRTL = lang === "ar";
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [referenceNo, setReferenceNo] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [reservationType, setReservationType] = useState("individual");

  const [formData, setFormData] = useState({
    // Individual fields
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    nationality: "",
    passport_number: "",
    departure_city: "",

    // Company fields
    company_name: "",
    contact_person_name: "",
    company_cr_number: "",
    company_country: "",
    company_location: "",
    company_address: "",
    company_passports_info: "",

    // Shared fields
    preferred_travel_date: "",
    number_of_adults: 1,
    number_of_children: 0,
    room_type: "Double",
    hotel_preference: "",
    special_requests: "",
    notes: "",
    confirmed: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSubmitError("");
      setLoading(false);
      setErrors({});
      setReservationType("individual");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const labels = {
    en: {
      step1Title: "Selected Package Summary",
      packageName: "Package Name",
      destination: "Destination",
      duration: "Duration",
      tripCode: "Trip Code",
      description: "Description",
      continue: "Continue to Reservation Form",

      step2Title: "Reservation Request Form",
      reservationTypeLabel: "Reservation Type",
      individualType: "Individual Request",
      companyType: "Company / Corporate Request",

      // Individual Fields
      firstName: "First Name",
      lastName: "Last Name",
      nationality: "Nationality",
      passportNumber: "Passport Number",
      departureCity: "Departure City",
      numberOfAdults: "Number of Adults",
      numberOfChildren: "Number of Children",

      // Company Fields
      companyName: "Company / Corporate Name",
      contactPersonName: "Contact Person Name",
      companyCrNumber: "CR / Tax Registration Number",
      companyCountry: "Company Country",
      companyLocation: "Company Location / City",
      companyAddress: "Company Address",
      companyPassportsInfo: "Employee Passports & Group Details",
      numberOfEmployees: "Number of Passengers / Employees",
      accommodationPreference: "Accommodation Preference",

      // Shared Fields
      email: "Email Address",
      mobile: "Mobile / Phone Number",
      preferredTravelDate: "Preferred Travel Date",
      roomType: "Room Type",
      roomSingle: "Single Room",
      roomDouble: "Double Room",
      roomTriple: "Triple Room",
      hotelPreference: "Hotel Preference",
      specialRequests: "Special Requests",
      notes: "Additional Notes",
      confirmCheck: "I confirm that the above information is correct.",
      back: "Back",
      submitReservation: "Submit Reservation",

      step3Title: "Reservation Request Submitted Successfully",
      thankYou: "Thank you for your reservation request.",
      successMsg:
        "Our reservations team will manually review your request and contact you as soon as possible to confirm availability and provide complete booking details.",
      bookingReference: "Booking Reference",
      close: "Close",
      na: "N/A",
      required: "This field is required",
    },
    ar: {
      step1Title: "ملخص الباقة المختارة",
      packageName: "اسم الباقة",
      destination: "الوجهة",
      duration: "المدة",
      tripCode: "رمز الرحلة",
      description: "الوصف",
      continue: "المتابعة لنموذج الحجز",

      step2Title: "نموذج طلب الحجز",
      reservationTypeLabel: "نوع الطلب",
      individualType: "طلب فردي",
      companyType: "طلب شركة / مؤسسة",

      // Individual Fields
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      nationality: "الجنسية",
      passportNumber: "رقم الجواز",
      departureCity: "مدينة المغادرة",
      numberOfAdults: "عدد البالغين",
      numberOfChildren: "عدد الأطفال",

      // Company Fields
      companyName: "اسم الشركة / المؤسسة",
      contactPersonName: "اسم الشخص المسؤول للتواصل",
      companyCrNumber: "رقم السجل التجاري / الرقم الضريبي",
      companyCountry: "دولة الشركة",
      companyLocation: "مدينة / موقع الشركة",
      companyAddress: "عنوان الشركة المفصل",
      companyPassportsInfo: "معلومات جوازات الموظفين / المجموعة",
      numberOfEmployees: "عدد المسافرين / الموظفين",
      accommodationPreference: "تفضيل الإقامة والسكن",

      // Shared Fields
      email: "البريد الإلكتروني",
      mobile: "رقم الجوال / الهاتف",
      preferredTravelDate: "تاريخ السفر المفضل",
      roomType: "نوع الغرفة",
      roomSingle: "غرفة مفردة",
      roomDouble: "غرفة مزدوجة",
      roomTriple: "غرفة ثلاثية",
      hotelPreference: "تفضل الفندق",
      specialRequests: "طلبات خاصة",
      notes: "ملاحظات إضافية",
      confirmCheck: "أؤكد أن المعلومات المذكورة أعلاه صحيحة.",
      back: "رجوع",
      submitReservation: "إرسال طلب الحجز",

      step3Title: "تم تقديم طلب الحجز بنجاح",
      thankYou: "شكراً لك على تقديم طلب الحجز.",
      successMsg:
        "سوف يقوم فريق الحجوزات بمراجعة طلبك يدوياً والتواصل معك في أقرب وقت ممكن لتأكيد التوفر وتزويدك بالتفاصيل الكاملة.",
      bookingReference: "رقم مرجع الحجز",
      close: "إغلاق",
      na: "غير متوفر",
      required: "هذا الحقل مطلوب",
    },
  };
  const t = labels[lang] || labels.en;

  const getFieldValue = (field) => {
    if (!packageData) return "";
    if (isRTL && packageData[`${field}_ar`]) return packageData[`${field}_ar`];
    if (packageData[`${field}_en`]) return packageData[`${field}_en`];
    if (packageData[field]) return packageData[field];
    return "";
  };

  const pkgTitle =
    getFieldValue("title") ||
    packageData?.name ||
    packageData?.title ||
    t.na;

  const pkgDestination =
    getFieldValue("location") || packageData?.region || t.na;

  const pkgDuration =
    getFieldValue("duration") || packageData?.duration || t.na;

  const pkgTripCode =
    packageData?.trip_code ||
    packageData?.basic_info?.trip_code ||
    packageData?.code ||
    (packageData?.id ? `PKG-${packageData.id}` : t.na);

  const pkgDescription =
    getFieldValue("description") ||
    getFieldValue("short_description") ||
    packageData?.description ||
    "";

  const getImageUrl = (imageData) => {
    if (!imageData) return "/placeholder.png";
    if (/^https?:\/\//.test(imageData)) return imageData;
    const backendBase = API_URL.replace(/\/api\/?$/, "");
    if (imageData.startsWith("/")) return `${backendBase}${imageData}`;
    return `${backendBase}/storage/tourism/${imageData}`;
  };

  const pkgImage = getImageUrl(packageData?.image_url || packageData?.image);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (reservationType === "individual") {
      if (!formData.first_name.trim()) newErrors.first_name = t.required;
      if (!formData.last_name.trim()) newErrors.last_name = t.required;
    } else {
      if (!formData.company_name.trim()) newErrors.company_name = t.required;
      if (!formData.contact_person_name.trim()) newErrors.contact_person_name = t.required;
      if (!formData.company_country.trim()) newErrors.company_country = t.required;
      if (!formData.company_location.trim()) newErrors.company_location = t.required;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = isRTL ? "بريد إلكتروني غير صالح" : "Invalid email address";
    }
    if (!formData.mobile.trim()) newErrors.mobile = t.required;
    if (!formData.preferred_travel_date) newErrors.preferred_travel_date = t.required;
    if (!formData.confirmed) {
      newErrors.confirmed = isRTL
        ? "يرجى تأكيد صحة المعلومات"
        : "Please confirm that information is correct";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    setSubmitError("");

    try {
      const payload = {
        reservation_type: reservationType,

        // Individual fields
        first_name: reservationType === "individual" ? formData.first_name : "",
        last_name: reservationType === "individual" ? formData.last_name : "",
        nationality: formData.nationality,
        passport_number: formData.passport_number,
        departure_city: formData.departure_city,

        // Company fields
        company_name: reservationType === "company" ? formData.company_name : "",
        contact_person_name: reservationType === "company" ? formData.contact_person_name : "",
        company_cr_number: formData.company_cr_number,
        company_country: formData.company_country,
        company_location: formData.company_location,
        company_address: formData.company_address,
        company_passports_info: formData.company_passports_info,

        // Shared contact & trip info
        name: reservationType === "company" ? formData.company_name : `${formData.first_name} ${formData.last_name}`.trim(),
        email: formData.email,
        mobile: formData.mobile,
        phone: formData.mobile,
        preferred_travel_date: formData.preferred_travel_date,
        preferred_date: formData.preferred_travel_date,
        number_of_adults: Number(formData.number_of_adults) || 1,
        number_of_children: Number(formData.number_of_children) || 0,
        guests: (Number(formData.number_of_adults) || 1) + (Number(formData.number_of_children) || 0),
        room_type: formData.room_type,
        hotel_preference: formData.hotel_preference,
        special_requests: formData.special_requests,
        notes: formData.notes,

        // Trip Context
        trip_title: pkgTitle,
        package_name: pkgTitle,
        trip_slug: packageData?.slug || "",
        trip_type: "package",
        destination: pkgDestination,
        duration: pkgDuration,
        trip_code: pkgTripCode,
      };

      const res = await fetch(`${API_URL.replace(/\/$/, "")}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || "Submission failed");
      }

      const generatedRef =
        json.reference_no ||
        json.reservation?.reference_no ||
        `RES-2026-${String(json.reservation?.id || Math.floor(100000 + Math.random() * 900000)).padStart(6, "0")}`;

      setReferenceNo(generatedRef);
      setStep(3);
    } catch (err) {
      console.error("[TravelReservationModal] Submit error:", err);
      setSubmitError(err.message || (isRTL ? "حدث خطأ أثناء تقديم الطلب" : "An error occurred while submitting"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(10, 10, 20, 0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          overflowY: "auto",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(223, 165, 40, 0.2)",
            maxWidth: "720px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            direction: isRTL ? "rtl" : "ltr",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Decorative Gold Bar */}
          <div style={{ height: "5px", background: "linear-gradient(90deg, #DFA528 0%, #F3D082 50%, #DFA528 100%)" }} />

          {/* Modal Header */}
          <div
            style={{
              padding: "20px 28px",
              borderBottom: "1px solid #f0e8db",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#FAF6F0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Plane size={22} color="#DFA528" />
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#1C0052" }}>
                {step === 1 && t.step1Title}
                {step === 2 && t.step2Title}
                {step === 3 && t.step3Title}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "rgba(28, 0, 82, 0.05)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#1C0052",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(223, 165, 40, 0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(28, 0, 82, 0.05)")}
            >
              <X size={20} />
            </button>
          </div>

          {/* Step Indicator */}
          <div style={{ padding: "14px 28px", backgroundColor: "#ffffff", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", alignItems: "center", justifySpace: "space-between", gap: "12px" }}>
              {[1, 2, 3].map((s) => (
                <div key={s} style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: step >= s ? "#DFA528" : "#e5e7eb",
                      color: step >= s ? "#ffffff" : "#6b7280",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    {step > s ? <Check size={16} /> : s}
                  </div>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: step === s ? 700 : 500,
                      color: step === s ? "#1C0052" : "#9ca3af",
                    }}
                  >
                    {s === 1 ? t.step1Title : s === 2 ? t.step2Title : t.step3Title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Body */}
          <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1 }}>
            {/* STEP 1: Selected Package Info Only */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: isRTL ? -20 : 20 }} animate={{ opacity: 1, x: 0 }}>
                <div
                  style={{
                    backgroundColor: "#FAF6F0",
                    borderRadius: "14px",
                    border: "1px solid #EFE4D2",
                    overflow: "hidden",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{ position: "relative", height: "200px", width: "100%" }}>
                    <img
                      src={pkgImage}
                      alt={pkgTitle}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "16px",
                        background: "linear-gradient(to top, rgba(28, 0, 82, 0.85), transparent)",
                        color: "#fff",
                      }}
                    >
                      <h4 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>{pkgTitle}</h4>
                    </div>
                  </div>

                  <div style={{ padding: "20px" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "14px",
                        marginBottom: "16px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <MapPin size={18} color="#DFA528" />
                        <div>
                          <span style={{ fontSize: "0.75rem", color: "#6b7280", display: "block" }}>
                            {t.destination}
                          </span>
                          <strong style={{ fontSize: "0.9rem", color: "#1C0052" }}>{pkgDestination}</strong>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Clock size={18} color="#DFA528" />
                        <div>
                          <span style={{ fontSize: "0.75rem", color: "#6b7280", display: "block" }}>
                            {t.duration}
                          </span>
                          <strong style={{ fontSize: "0.9rem", color: "#1C0052" }}>{pkgDuration}</strong>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FileText size={18} color="#DFA528" />
                        <div>
                          <span style={{ fontSize: "0.75rem", color: "#6b7280", display: "block" }}>
                            {t.tripCode}
                          </span>
                          <strong style={{ fontSize: "0.9rem", color: "#1C0052" }}>{pkgTripCode}</strong>
                        </div>
                      </div>
                    </div>

                    {pkgDescription && (
                      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "14px" }}>
                        <span style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 600, display: "block" }}>
                          {t.description}
                        </span>
                        <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: "#374151", lineHeight: "1.5" }}>
                          {pkgDescription.substring(0, 220)}...
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    width: "100%",
                    padding: "14px 24px",
                    backgroundColor: "#DFA528",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(223, 165, 40, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c98c1e")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#DFA528")}
                >
                  <span>{t.continue}</span>
                  {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
              </motion.div>
            )}

            {/* STEP 2: Reservation Request Form */}
            {step === 2 && (
              <motion.form
                initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmitReservation}
              >
                {/* Reservation Type Toggle (Individual vs Company) */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      color: "#1C0052",
                      marginBottom: "8px",
                    }}
                  >
                    {t.reservationTypeLabel}
                  </label>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      type="button"
                      onClick={() => setReservationType("individual")}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: "10px",
                        border: reservationType === "individual" ? "2px solid #DFA528" : "1.5px solid #e5e7eb",
                        backgroundColor: reservationType === "individual" ? "#FAF6F0" : "#ffffff",
                        color: reservationType === "individual" ? "#1C0052" : "#4b5563",
                        fontWeight: reservationType === "individual" ? 700 : 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: reservationType === "individual" ? "0 2px 8px rgba(223, 165, 40, 0.2)" : "none",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <User size={18} color={reservationType === "individual" ? "#DFA528" : "#6b7280"} />
                      <span>{t.individualType}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReservationType("company")}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: "10px",
                        border: reservationType === "company" ? "2px solid #DFA528" : "1.5px solid #e5e7eb",
                        backgroundColor: reservationType === "company" ? "#FAF6F0" : "#ffffff",
                        color: reservationType === "company" ? "#1C0052" : "#4b5563",
                        fontWeight: reservationType === "company" ? 700 : 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: reservationType === "company" ? "0 2px 8px rgba(223, 165, 40, 0.2)" : "none",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Building size={18} color={reservationType === "company" ? "#DFA528" : "#6b7280"} />
                      <span>{t.companyType}</span>
                    </button>
                  </div>
                </div>

                {submitError && (
                  <div
                    style={{
                      padding: "12px 16px",
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fca5a5",
                      borderRadius: "8px",
                      color: "#991b1b",
                      fontSize: "0.85rem",
                      marginBottom: "18px",
                    }}
                  >
                    {submitError}
                  </div>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {/* INDIVIDUAL FIELDS */}
                  {reservationType === "individual" && (
                    <>
                      {/* First Name */}
                      <div>
                        <label style={labelStyle}>
                          {t.firstName} <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          style={inputStyle(errors.first_name)}
                          placeholder={t.firstName}
                        />
                        {errors.first_name && <span style={errorStyle}>{errors.first_name}</span>}
                      </div>

                      {/* Last Name */}
                      <div>
                        <label style={labelStyle}>
                          {t.lastName} <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          style={inputStyle(errors.last_name)}
                          placeholder={t.lastName}
                        />
                        {errors.last_name && <span style={errorStyle}>{errors.last_name}</span>}
                      </div>

                      {/* Nationality */}
                      <div>
                        <label style={labelStyle}>{t.nationality}</label>
                        <input
                          type="text"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleChange}
                          style={inputStyle()}
                          placeholder={t.nationality}
                        />
                      </div>

                      {/* Passport Number */}
                      <div>
                        <label style={labelStyle}>{t.passportNumber}</label>
                        <input
                          type="text"
                          name="passport_number"
                          value={formData.passport_number}
                          onChange={handleChange}
                          style={inputStyle()}
                          placeholder="A12345678"
                        />
                      </div>

                      {/* Departure City */}
                      <div>
                        <label style={labelStyle}>{t.departureCity}</label>
                        <input
                          type="text"
                          name="departure_city"
                          value={formData.departure_city}
                          onChange={handleChange}
                          style={inputStyle()}
                          placeholder={isRTL ? "مثال: الرياض، جدة" : "e.g. Riyadh, Jeddah"}
                        />
                      </div>
                    </>
                  )}

                  {/* COMPANY FIELDS */}
                  {reservationType === "company" && (
                    <>
                      {/* Company Name */}
                      <div>
                        <label style={labelStyle}>
                          {t.companyName} <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="company_name"
                          value={formData.company_name}
                          onChange={handleChange}
                          style={inputStyle(errors.company_name)}
                          placeholder={t.companyName}
                        />
                        {errors.company_name && <span style={errorStyle}>{errors.company_name}</span>}
                      </div>

                      {/* Contact Person Name */}
                      <div>
                        <label style={labelStyle}>
                          {t.contactPersonName} <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="contact_person_name"
                          value={formData.contact_person_name}
                          onChange={handleChange}
                          style={inputStyle(errors.contact_person_name)}
                          placeholder={t.contactPersonName}
                        />
                        {errors.contact_person_name && <span style={errorStyle}>{errors.contact_person_name}</span>}
                      </div>

                      {/* CR / Tax Number */}
                      <div>
                        <label style={labelStyle}>{t.companyCrNumber}</label>
                        <input
                          type="text"
                          name="company_cr_number"
                          value={formData.company_cr_number}
                          onChange={handleChange}
                          style={inputStyle()}
                          placeholder="1010XXXXXX"
                        />
                      </div>

                      {/* Company Country */}
                      <div>
                        <label style={labelStyle}>
                          {t.companyCountry} <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="company_country"
                          value={formData.company_country}
                          onChange={handleChange}
                          style={inputStyle(errors.company_country)}
                          placeholder={isRTL ? "السعودية، الإمارات..." : "Saudi Arabia, UAE..."}
                        />
                        {errors.company_country && <span style={errorStyle}>{errors.company_country}</span>}
                      </div>

                      {/* Company City / Location */}
                      <div>
                        <label style={labelStyle}>
                          {t.companyLocation} <span style={{ color: "#dc2626" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="company_location"
                          value={formData.company_location}
                          onChange={handleChange}
                          style={inputStyle(errors.company_location)}
                          placeholder={isRTL ? "الرياض، جدة..." : "Riyadh, Jeddah..."}
                        />
                        {errors.company_location && <span style={errorStyle}>{errors.company_location}</span>}
                      </div>

                      {/* Company Address */}
                      <div>
                        <label style={labelStyle}>{t.companyAddress}</label>
                        <input
                          type="text"
                          name="company_address"
                          value={formData.company_address}
                          onChange={handleChange}
                          style={inputStyle()}
                          placeholder={isRTL ? "العنوان المفصل..." : "Detailed address..."}
                        />
                      </div>
                    </>
                  )}

                  {/* SHARED CONTACT & TRIP FIELDS */}
                  {/* Email */}
                  <div>
                    <label style={labelStyle}>
                      {t.email} <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={inputStyle(errors.email)}
                      placeholder="example@domain.com"
                    />
                    {errors.email && <span style={errorStyle}>{errors.email}</span>}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label style={labelStyle}>
                      {t.mobile} <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      style={inputStyle(errors.mobile)}
                      placeholder="+966 50 000 0000"
                    />
                    {errors.mobile && <span style={errorStyle}>{errors.mobile}</span>}
                  </div>

                  {/* Preferred Travel Date */}
                  <div>
                    <label style={labelStyle}>
                      {t.preferredTravelDate} <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="date"
                      name="preferred_travel_date"
                      value={formData.preferred_travel_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      style={inputStyle(errors.preferred_travel_date)}
                    />
                    {errors.preferred_travel_date && (
                      <span style={errorStyle}>{errors.preferred_travel_date}</span>
                    )}
                  </div>

                  {/* Number of Adults / Passengers */}
                  <div>
                    <label style={labelStyle}>
                      {reservationType === "company" ? t.numberOfEmployees : t.numberOfAdults}
                    </label>
                    <input
                      type="number"
                      name="number_of_adults"
                      value={formData.number_of_adults}
                      onChange={handleChange}
                      min="1"
                      max="500"
                      style={inputStyle()}
                    />
                  </div>

                  {/* Number of Children (Individual mode only) */}
                  {reservationType === "individual" && (
                    <div>
                      <label style={labelStyle}>{t.numberOfChildren}</label>
                      <input
                        type="number"
                        name="number_of_children"
                        value={formData.number_of_children}
                        onChange={handleChange}
                        min="0"
                        max="50"
                        style={inputStyle()}
                      />
                    </div>
                  )}

                  {/* Room Type / Accommodation Preference */}
                  <div>
                    <label style={labelStyle}>{t.roomType}</label>
                    <select
                      name="room_type"
                      value={formData.room_type}
                      onChange={handleChange}
                      style={inputStyle()}
                    >
                      <option value="Single">{t.roomSingle}</option>
                      <option value="Double">{t.roomDouble}</option>
                      <option value="Triple">{t.roomTriple}</option>
                    </select>
                  </div>

                  {/* Hotel Preference */}
                  <div>
                    <label style={labelStyle}>{t.hotelPreference}</label>
                    <input
                      type="text"
                      name="hotel_preference"
                      value={formData.hotel_preference}
                      onChange={handleChange}
                      style={inputStyle()}
                      placeholder={isRTL ? "مثال: فندق 5 نجوم" : "e.g. 5 Star Hotel"}
                    />
                  </div>

                  {/* Company Employee Passports & Group Info (Company Mode Only) */}
                  {reservationType === "company" && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>{t.companyPassportsInfo}</label>
                      <textarea
                        name="company_passports_info"
                        value={formData.company_passports_info}
                        onChange={handleChange}
                        rows="2"
                        style={{ ...inputStyle(), resize: "vertical" }}
                        placeholder={
                          isRTL
                            ? "أدخل قائمة بأسماء وتفاصيل جوازات الموظفين..."
                            : "Enter list of employee names, passport details, or group requirements..."
                        }
                      />
                    </div>
                  )}

                  {/* Special Requests */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>{t.specialRequests}</label>
                    <textarea
                      name="special_requests"
                      value={formData.special_requests}
                      onChange={handleChange}
                      rows="2"
                      style={{ ...inputStyle(), resize: "vertical" }}
                      placeholder={isRTL ? "أي طلبات خاصة..." : "Any special requests..."}
                    />
                  </div>

                  {/* Notes */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>{t.notes}</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="2"
                      style={{ ...inputStyle(), resize: "vertical" }}
                      placeholder={isRTL ? "ملاحظات إضافية..." : "Additional notes..."}
                    />
                  </div>
                </div>

                {/* Confirmation Checkbox */}
                <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                      fontSize: "0.88rem",
                      color: "#374151",
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="checkbox"
                      name="confirmed"
                      checked={formData.confirmed}
                      onChange={handleChange}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "#DFA528",
                        cursor: "pointer",
                      }}
                    />
                    <span>{t.confirmCheck}</span>
                  </label>
                  {errors.confirmed && <span style={errorStyle}>{errors.confirmed}</span>}
                </div>

                {/* Form Navigation Buttons */}
                <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                    style={{
                      padding: "12px 20px",
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {t.back}
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: "12px 24px",
                      backgroundColor: "#DFA528",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      fontWeight: 700,
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: "0 4px 14px rgba(223, 165, 40, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        <span>{t.submitReservation}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: Success Screen */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center", padding: "20px 10px" }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#ecfdf5",
                    color: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    boxShadow: "0 10px 25px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <CheckCircle2 size={48} />
                </div>

                <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1C0052", margin: "0 0 10px" }}>
                  {t.step3Title}
                </h3>

                <p style={{ fontSize: "1rem", fontWeight: 600, color: "#DFA528", margin: "0 0 14px" }}>
                  {t.thankYou}
                </p>

                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "#4b5563",
                    lineHeight: "1.6",
                    maxWidth: "520px",
                    margin: "0 auto 24px",
                  }}
                >
                  {t.successMsg}
                </p>

                {referenceNo && (
                  <div
                    style={{
                      backgroundColor: "#FAF6F0",
                      border: "2px dashed #DFA528",
                      borderRadius: "12px",
                      padding: "16px 24px",
                      display: "inline-block",
                      marginBottom: "28px",
                    }}
                  >
                    <span style={{ fontSize: "0.8rem", color: "#6b7280", display: "block", marginBottom: "4px" }}>
                      {t.bookingReference}
                    </span>
                    <strong style={{ fontSize: "1.3rem", color: "#1C0052", letterSpacing: "1px" }}>
                      {referenceNo}
                    </strong>
                  </div>
                )}

                <div>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      padding: "12px 36px",
                      backgroundColor: "#1C0052",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "1rem",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(28, 0, 82, 0.2)",
                    }}
                  >
                    {t.close}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "6px",
};

const inputStyle = (error) => ({
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: error ? "1.5px solid #dc2626" : "1.5px solid #d1d5db",
  backgroundColor: "#ffffff",
  fontSize: "0.9rem",
  color: "#111827",
  outline: "none",
  transition: "all 0.2s ease",
});

const errorStyle = {
  fontSize: "0.75rem",
  color: "#dc2626",
  marginTop: "4px",
  display: "block",
};
