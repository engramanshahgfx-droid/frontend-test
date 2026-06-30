"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  Calendar,
  User,
  Lock,
  Luggage,
  Check,
  ArrowRight,
  Mail,
  Phone,
  Bed,
  Users,
} from "lucide-react";
import { API_URL } from "@/lib/api";

export default function BookingModal({ isOpen, onClose, packageData, lang }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    travel_date: "",
    room_type: "DoubleRoom",
    package_id: "",
    package_code: "",
    notes: "",
    payment_method: "bank_transfer",
    card_number: "",
    card_holder: "",
    card_expiry: "",
    card_cvv: "",
    guests: 1,
    special_requests: "",
    booking_type: "destination",
  });
  const [errors, setErrors] = useState({});
  const [cardFocused, setCardFocused] = useState("");

  // Define isRTL
  const isRTL = lang === "ar";

  useEffect(() => {
    if (packageData) {
      const packageCode =
        packageData.basic_info?.trip_code ||
        packageData.trip_code ||
        packageData.code ||
        packageData.package_code ||
        `PKG-${packageData.id}`;

      setFormData((prev) => ({
        ...prev,
        package_id: String(packageData.id || packageData.slug || ""),
        package_code: String(packageCode),
      }));
    }
  }, [packageData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "card_number") {
      const cleaned = value.replace(/\D/g, "");
      const formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    if (name === "card_expiry") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length >= 2) {
        const formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
        setFormData((prev) => ({ ...prev, [name]: formatted }));
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    if (name === "card_cvv") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 4) {
        setFormData((prev) => ({ ...prev, [name]: cleaned }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First Name is Required";
    if (!formData.last_name) newErrors.last_name = "Last Name is Required";
    if (!formData.email) {
      newErrors.email = "Email is Required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "The Email field is not a valid e-mail address.";
    }
    if (!formData.mobile) newErrors.mobile = "Mobile is Required";
    if (!formData.travel_date)
      newErrors.travel_date = "The Travel Date field is required.";
    if (!formData.guests || formData.guests < 1)
      newErrors.guests = "Please select at least 1 guest";

    if (formData.payment_method === "credit_card") {
      const cardNumberClean = formData.card_number.replace(/\s/g, "");
      if (cardNumberClean.length < 16) {
        newErrors.card_number = "Please enter a valid 16-digit card number";
      }
      if (!formData.card_holder) {
        newErrors.card_holder = "Card holder name is required";
      }
      if (!formData.card_expiry || formData.card_expiry.length < 5) {
        newErrors.card_expiry = "Please enter a valid expiry date (MM/YY)";
      }
      if (!formData.card_cvv || formData.card_cvv.length < 3) {
        newErrors.card_cvv = "Please enter a valid CVV";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

    const packageId = formData.package_id || String(packageData?.id || "");
    const packageCode =
      formData.package_code ||
      packageData?.basic_info?.trip_code ||
      packageData?.trip_code ||
      `PKG-${packageData?.id || "1"}`;

    const bookingData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      mobile: formData.mobile,
      travel_date: formData.travel_date,
      room_type: formData.room_type,
      package_id: packageId,
      package_code: packageCode,
      notes: formData.notes || "",
      payment_method: formData.payment_method || "bank_transfer",
      booking_type: "destination",
      guests: formData.guests || 1,
      special_requests: formData.special_requests || "",
    };

    console.log("Submitting booking with data:", bookingData);

    // For credit card, validate card details
    if (formData.payment_method === "credit_card") {
      const cardNumberClean = formData.card_number.replace(/\s/g, "");
      if (cardNumberClean.length < 16) {
        setErrors({ card_number: "Please enter a valid 16-digit card number" });
        return;
      }
      if (!formData.card_holder) {
        setErrors({ card_holder: "Card holder name is required" });
        return;
      }
      if (!formData.card_expiry || formData.card_expiry.length < 5) {
        setErrors({ card_expiry: "Please enter a valid expiry date (MM/YY)" });
        return;
      }
      if (!formData.card_cvv || formData.card_cvv.length < 3) {
        setErrors({ card_cvv: "Please enter a valid CVV" });
        return;
      }
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/bookings/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      console.log("Booking response:", data);

      if (response.ok && data.success) {
        // If credit card payment, initiate payment
        if (formData.payment_method === "credit_card") {
          const bookingId = data.data.id;
          const price = data.data.price || 100;

          const moyasarResponse = await fetch(
            `${API_URL}/payments/moyasar/initiate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                booking_id: bookingId,
                amount: price,
                payment_method: "credit_card",
                card_number: formData.card_number.replace(/\s/g, ""),
                card_cvv: formData.card_cvv,
                card_expiry: formData.card_expiry,
                card_holder: formData.card_holder,
              }),
            }
          );

          const paymentData = await moyasarResponse.json();
          console.log("Payment response:", paymentData);

          if (paymentData.success && paymentData.payment_url) {
            window.location.href = paymentData.payment_url;
            return;
          } else {
            setErrors({
              submit: paymentData.message || "Payment initiation failed",
            });
            setLoading(false);
            return;
          }
        }

        // For bank transfer, show success
        setStep(3);
        setTimeout(() => {
          onClose();
          setStep(1);
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            mobile: "",
            travel_date: "",
            room_type: "DoubleRoom",
            package_id: "",
            package_code: "",
            notes: "",
            payment_method: "bank_transfer",
            card_number: "",
            card_holder: "",
            card_expiry: "",
            card_cvv: "",
            guests: 1,
            special_requests: "",
            booking_type: "destination",
          });
        }, 3000);
      } else {
        if (data.errors) {
          console.log("Validation errors:", data.errors);
          setErrors(data.errors);
        } else {
          setErrors({ submit: data.message || "Something went wrong" });
        }
      }
    } catch (error) {
      console.error("Booking error:", error);
      setErrors({ submit: "Failed to create booking. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      mobile: "",
      travel_date: "",
      room_type: "DoubleRoom",
      package_id: "",
      package_code: "",
      notes: "",
      payment_method: "bank_transfer",
      card_number: "",
      card_holder: "",
      card_expiry: "",
      card_cvv: "",
      guests: 1,
      special_requests: "",
      booking_type: "destination",
    });
    setErrors({});
    setStep(1);
    onClose();
  };

  const labels = {
    en: {
      title: "Complete Your Data",
      firstName: "First Name",
      lastName: "Last Name",
      email: "E-mail",
      mobile: "Mobile Number",
      travelDate: "Travel Date",
      roomType: "Room Type",
      doubleRoom: "Double Room",
      singleRoom: "Single Room",
      notes: "Notes",
      paymentMethod: "Payment Method",
      bankTransfer: "Bank Transfer",
      creditCard: "Credit Card",
      confirm: "Confirm Reservation",
      cancel: "Cancel",
      selectPackage: "Select Package",
      data: "Data",
      completed: "Completed",
      bookingSuccess: "Booking Confirmed!",
      bookingNumber: "Booking Number",
      thankYou: "Thank you for your booking. We will contact you shortly.",
      cardNumber: "Card Number",
      cardHolder: "Card Holder Name",
      cardExpiry: "Expiry Date (MM/YY)",
      cardCVV: "CVV",
      cardDetails: "Card Details",
      guests: "Number of Guests",
      specialRequests: "Special Requests",
    },
    ar: {
      title: "أكمل بياناتك",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      email: "البريد الإلكتروني",
      mobile: "رقم الجوال",
      travelDate: "تاريخ السفر",
      roomType: "نوع الغرفة",
      doubleRoom: "غرفة مزدوجة",
      singleRoom: "غرفة فردية",
      notes: "ملاحظات",
      paymentMethod: "طريقة الدفع",
      bankTransfer: "تحويل بنكي",
      creditCard: "بطاقة ائتمان",
      confirm: "تأكيد الحجز",
      cancel: "إلغاء",
      selectPackage: "اختر الباقة",
      data: "البيانات",
      completed: "مكتمل",
      bookingSuccess: "تم تأكيد الحجز!",
      bookingNumber: "رقم الحجز",
      thankYou: "شكراً لحجزك. سنتواصل معك قريباً.",
      cardNumber: "رقم البطاقة",
      cardHolder: "اسم حامل البطاقة",
      cardExpiry: "تاريخ الانتهاء (MM/YY)",
      cardCVV: "رمز CVV",
      cardDetails: "تفاصيل البطاقة",
      guests: "عدد الضيوف",
      specialRequests: "طلبات خاصة",
    },
  };

  const t = labels[lang] || labels.en;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="booking-modal-overlay"
          onClick={handleClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflow: "auto",
          }}
        >
          <motion.div
            className="booking-modal"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "12px",
              maxWidth: "650px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              position: "relative",
            }}
          >
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "15px",
                right: "20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "24px",
                color: "#999",
                zIndex: 10,
                padding: "5px",
              }}
            >
              <X size={24} />
            </button>

            <div
              style={{
                padding: "20px 30px",
                borderBottom: "1px solid #e8e8e8",
                background: "#f8f9fa",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <User size={20} color="#dfa528" />
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#2c2c2c",
                  }}
                >
                  {t.title}
                </span>
              </div>
            </div>

            <div style={{ padding: "20px 30px 0" }}>
              <ul
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    left: "15%",
                    right: "15%",
                    height: "2px",
                    background: "#e0e0e0",
                    zIndex: 0,
                  }}
                ></div>

                {[
                  {
                    id: 1,
                    icon: <Luggage size={16} />,
                    label: t.selectPackage,
                  },
                  { id: 2, icon: <User size={16} />, label: t.data },
                  { id: 3, icon: <Check size={16} />, label: t.completed },
                ].map((s) => (
                  <li
                    key={s.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                      zIndex: 1,
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: step >= s.id ? "#dfa528" : "#e0e0e0",
                        color: step >= s.id ? "#fff" : "#999",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        transition: "all 0.3s",
                        border: step === s.id ? "3px solid #c98c1e" : "none",
                      }}
                    >
                      {step > s.id ? <Check size={16} color="#fff" /> : s.icon}
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        color: step >= s.id ? "#dfa528" : "#999",
                        marginTop: "6px",
                        fontWeight: step >= s.id ? "600" : "400",
                        textAlign: "center",
                      }}
                    >
                      {s.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ padding: "20px 30px 30px" }}>
              {step === 1 && (
                <div>
                  <div
                    style={{
                      background: "#f8f9fa",
                      padding: "20px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    <h4 style={{ margin: "0 0 8px 0", color: "#2c2c2c" }}>
                      {packageData?.title_en || packageData?.title}
                    </h4>
                    {packageData?.basic_info && (
                      <div style={{ fontSize: "14px", color: "#666" }}>
                        <span>
                          Trip Code: {packageData.basic_info.trip_code}
                        </span>
                        <span style={{ marginLeft: "20px" }}>
                          Days: {packageData.basic_info.days_num}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#dfa528",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "#c98c1e")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "#dfa528")
                    }
                  >
                    Continue →{" "}
                    <ArrowRight size={16} style={{ marginLeft: "8px" }} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                    }}
                  >
                    {/* First Name */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          marginBottom: "6px",
                          color: "#333",
                        }}
                      >
                        {t.firstName}{" "}
                        <span style={{ color: "#dc3545" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <User
                          size={18}
                          style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#999",
                          }}
                        />
                        <input
                          type="text"
                          name="first_name"
                          placeholder={t.firstName}
                          value={formData.first_name}
                          onChange={handleChange}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 40px",
                            border: errors.first_name
                              ? "2px solid #dc3545"
                              : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            transition: "all 0.2s",
                            outline: "none",
                          }}
                        />
                      </div>
                      {errors.first_name && (
                        <span
                          style={{
                            color: "#dc3545",
                            fontSize: "13px",
                            marginTop: "4px",
                            display: "block",
                          }}
                        >
                          {errors.first_name}
                        </span>
                      )}
                    </div>

                    {/* Last Name */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          marginBottom: "6px",
                          color: "#333",
                        }}
                      >
                        {t.lastName}{" "}
                        <span style={{ color: "#dc3545" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <User
                          size={18}
                          style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#999",
                          }}
                        />
                        <input
                          type="text"
                          name="last_name"
                          placeholder={t.lastName}
                          value={formData.last_name}
                          onChange={handleChange}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 40px",
                            border: errors.last_name
                              ? "2px solid #dc3545"
                              : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      {errors.last_name && (
                        <span
                          style={{
                            color: "#dc3545",
                            fontSize: "13px",
                            marginTop: "4px",
                            display: "block",
                          }}
                        >
                          {errors.last_name}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          marginBottom: "6px",
                          color: "#333",
                        }}
                      >
                        {t.email} <span style={{ color: "#dc3545" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Mail
                          size={18}
                          style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#999",
                          }}
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder={t.email}
                          value={formData.email}
                          onChange={handleChange}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 40px",
                            border: errors.email
                              ? "2px solid #dc3545"
                              : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      {errors.email && (
                        <span
                          style={{
                            color: "#dc3545",
                            fontSize: "13px",
                            marginTop: "4px",
                            display: "block",
                          }}
                        >
                          {errors.email}
                        </span>
                      )}
                    </div>

                    {/* Mobile */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          marginBottom: "6px",
                          color: "#333",
                        }}
                      >
                        {t.mobile} <span style={{ color: "#dc3545" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Phone
                          size={18}
                          style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#999",
                          }}
                        />
                        <input
                          type="tel"
                          name="mobile"
                          placeholder={t.mobile}
                          value={formData.mobile}
                          onChange={handleChange}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 40px",
                            border: errors.mobile
                              ? "2px solid #dc3545"
                              : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      {errors.mobile && (
                        <span
                          style={{
                            color: "#dc3545",
                            fontSize: "13px",
                            marginTop: "4px",
                            display: "block",
                          }}
                        >
                          {errors.mobile}
                        </span>
                      )}
                    </div>

                    {/* Travel Date */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          marginBottom: "6px",
                          color: "#333",
                        }}
                      >
                        {t.travelDate}{" "}
                        <span style={{ color: "#dc3545" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Calendar
                          size={18}
                          style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#999",
                          }}
                        />
                        <input
                          type="date"
                          name="travel_date"
                          value={formData.travel_date}
                          onChange={handleChange}
                          min={new Date().toISOString().split("T")[0]}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 40px",
                            border: errors.travel_date
                              ? "2px solid #dc3545"
                              : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      {errors.travel_date && (
                        <span
                          style={{
                            color: "#dc3545",
                            fontSize: "13px",
                            marginTop: "4px",
                            display: "block",
                          }}
                        >
                          {errors.travel_date}
                        </span>
                      )}
                    </div>

                    {/* Room Type */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          marginBottom: "6px",
                          color: "#333",
                        }}
                      >
                        {t.roomType} <span style={{ color: "#dc3545" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Bed
                          size={18}
                          style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#999",
                          }}
                        />
                        <select
                          name="room_type"
                          value={formData.room_type}
                          onChange={handleChange}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 40px",
                            border: "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            background: "#fff",
                          }}
                        >
                          <option value="DoubleRoom">{t.doubleRoom}</option>
                          <option value="SingleRoom">{t.singleRoom}</option>
                        </select>
                      </div>
                    </div>

                    {/* Guests Input */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          marginBottom: "6px",
                          color: "#333",
                        }}
                      >
                        {t.guests} <span style={{ color: "#dc3545" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Users
                          size={18}
                          style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#999",
                          }}
                        />
                        <input
                          type="number"
                          name="guests"
                          value={formData.guests}
                          onChange={handleChange}
                          min="1"
                          max="20"
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 40px",
                            border: errors.guests
                              ? "2px solid #dc3545"
                              : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            transition: "all 0.2s",
                          }}
                        />
                      </div>
                      {errors.guests && (
                        <span
                          style={{
                            color: "#dc3545",
                            fontSize: "12px",
                            marginTop: "4px",
                            display: "block",
                          }}
                        >
                          {errors.guests}
                        </span>
                      )}
                    </div>

                    {/* Special Requests */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          marginBottom: "6px",
                          color: "#333",
                        }}
                      >
                        {t.specialRequests}
                      </label>
                      <div style={{ position: "relative" }}>
                        <textarea
                          name="special_requests"
                          placeholder={t.specialRequests}
                          value={formData.special_requests}
                          onChange={handleChange}
                          rows="2"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            resize: "vertical",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div style={{ gridColumn: "1 / -1", marginTop: "10px" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          marginBottom: "6px",
                          color: "#333",
                        }}
                      >
                        {t.paymentMethod}{" "}
                        <span style={{ color: "#dc3545" }}>*</span>
                      </label>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <button
                          type="button"
                          onClick={() =>
                            handleChange({
                              target: {
                                name: "payment_method",
                                value: "bank_transfer",
                              },
                            })
                          }
                          style={{
                            flex: 1,
                            padding: "12px",
                            border:
                              formData.payment_method === "bank_transfer"
                                ? "2px solid #dfa528"
                                : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            background:
                              formData.payment_method === "bank_transfer"
                                ? "rgba(223, 165, 40, 0.05)"
                                : "#fff",
                            cursor: "pointer",
                            fontWeight: "500",
                            fontSize: "14px",
                            transition: "all 0.2s",
                          }}
                        >
                          🏦 {t.bankTransfer}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleChange({
                              target: {
                                name: "payment_method",
                                value: "credit_card",
                              },
                            })
                          }
                          style={{
                            flex: 1,
                            padding: "12px",
                            border:
                              formData.payment_method === "credit_card"
                                ? "2px solid #dfa528"
                                : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            background:
                              formData.payment_method === "credit_card"
                                ? "rgba(223, 165, 40, 0.05)"
                                : "#fff",
                            cursor: "pointer",
                            fontWeight: "500",
                            fontSize: "14px",
                            transition: "all 0.2s",
                          }}
                        >
                          💳 {t.creditCard}
                        </button>
                      </div>
                    </div>

                    {/* Credit Card Fields */}
                    {formData.payment_method === "credit_card" && (
                      <div
                        style={{
                          gridColumn: "1 / -1",
                          marginTop: "10px",
                          borderTop: "2px solid #e8e8e8",
                          paddingTop: "15px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "15px",
                          }}
                        >
                          <CreditCard size={18} color="#dfa528" />
                          <span
                            style={{
                              fontWeight: "600",
                              color: "#333",
                              fontSize: "14px",
                            }}
                          >
                            {t.cardDetails}
                          </span>
                        </div>

                        {/* Card Number */}
                        <div style={{ marginBottom: "15px" }}>
                          <label
                            style={{
                              display: "block",
                              fontSize: "13px",
                              fontWeight: "600",
                              marginBottom: "4px",
                              color: "#333",
                            }}
                          >
                            {t.cardNumber}{" "}
                            <span style={{ color: "#dc3545" }}>*</span>
                          </label>
                          <div style={{ position: "relative" }}>
                            <CreditCard
                              size={16}
                              style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#999",
                              }}
                            />
                            <input
                              type="text"
                              name="card_number"
                              placeholder="1234 5678 9012 3456"
                              value={formData.card_number}
                              onChange={handleChange}
                              maxLength="19"
                              onFocus={() => setCardFocused("card_number")}
                              onBlur={() => setCardFocused("")}
                              style={{
                                width: "100%",
                                padding: "10px 12px 10px 40px",
                                border: errors.card_number
                                  ? "2px solid #dc3545"
                                  : cardFocused === "card_number"
                                    ? "2px solid #dfa528"
                                    : "2px solid #e0e0e0",
                                borderRadius: "8px",
                                fontSize: "14px",
                                outline: "none",
                                transition: "all 0.2s",
                              }}
                            />
                          </div>
                          {errors.card_number && (
                            <span
                              style={{
                                color: "#dc3545",
                                fontSize: "12px",
                                marginTop: "4px",
                                display: "block",
                              }}
                            >
                              {errors.card_number}
                            </span>
                          )}
                        </div>

                        {/* Card Holder */}
                        <div style={{ marginBottom: "15px" }}>
                          <label
                            style={{
                              display: "block",
                              fontSize: "13px",
                              fontWeight: "600",
                              marginBottom: "4px",
                              color: "#333",
                            }}
                          >
                            {t.cardHolder}{" "}
                            <span style={{ color: "#dc3545" }}>*</span>
                          </label>
                          <div style={{ position: "relative" }}>
                            <User
                              size={16}
                              style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#999",
                              }}
                            />
                            <input
                              type="text"
                              name="card_holder"
                              placeholder="John Doe"
                              value={formData.card_holder}
                              onChange={handleChange}
                              onFocus={() => setCardFocused("card_holder")}
                              onBlur={() => setCardFocused("")}
                              style={{
                                width: "100%",
                                padding: "10px 12px 10px 40px",
                                border: errors.card_holder
                                  ? "2px solid #dc3545"
                                  : cardFocused === "card_holder"
                                    ? "2px solid #dfa528"
                                    : "2px solid #e0e0e0",
                                borderRadius: "8px",
                                fontSize: "14px",
                                outline: "none",
                                transition: "all 0.2s",
                              }}
                            />
                          </div>
                          {errors.card_holder && (
                            <span
                              style={{
                                color: "#dc3545",
                                fontSize: "12px",
                                marginTop: "4px",
                                display: "block",
                              }}
                            >
                              {errors.card_holder}
                            </span>
                          )}
                        </div>

                        {/* Expiry and CVV */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "15px",
                          }}
                        >
                          <div>
                            <label
                              style={{
                                display: "block",
                                fontSize: "13px",
                                fontWeight: "600",
                                marginBottom: "4px",
                                color: "#333",
                              }}
                            >
                              {t.cardExpiry}{" "}
                              <span style={{ color: "#dc3545" }}>*</span>
                            </label>
                            <div style={{ position: "relative" }}>
                              <Calendar
                                size={16}
                                style={{
                                  position: "absolute",
                                  left: "12px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  color: "#999",
                                }}
                              />
                              <input
                                type="text"
                                name="card_expiry"
                                placeholder="MM/YY"
                                value={formData.card_expiry}
                                onChange={handleChange}
                                maxLength="5"
                                onFocus={() => setCardFocused("card_expiry")}
                                onBlur={() => setCardFocused("")}
                                style={{
                                  width: "100%",
                                  padding: "10px 12px 10px 40px",
                                  border: errors.card_expiry
                                    ? "2px solid #dc3545"
                                    : cardFocused === "card_expiry"
                                      ? "2px solid #dfa528"
                                      : "2px solid #e0e0e0",
                                  borderRadius: "8px",
                                  fontSize: "14px",
                                  outline: "none",
                                  transition: "all 0.2s",
                                }}
                              />
                            </div>
                            {errors.card_expiry && (
                              <span
                                style={{
                                  color: "#dc3545",
                                  fontSize: "12px",
                                  marginTop: "4px",
                                  display: "block",
                                }}
                              >
                                {errors.card_expiry}
                              </span>
                            )}
                          </div>

                          <div>
                            <label
                              style={{
                                display: "block",
                                fontSize: "13px",
                                fontWeight: "600",
                                marginBottom: "4px",
                                color: "#333",
                              }}
                            >
                              {t.cardCVV}{" "}
                              <span style={{ color: "#dc3545" }}>*</span>
                            </label>
                            <div style={{ position: "relative" }}>
                              <Lock
                                size={16}
                                style={{
                                  position: "absolute",
                                  left: "12px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  color: "#999",
                                }}
                              />
                              <input
                                type="password"
                                name="card_cvv"
                                placeholder="123"
                                value={formData.card_cvv}
                                onChange={handleChange}
                                maxLength="4"
                                onFocus={() => setCardFocused("card_cvv")}
                                onBlur={() => setCardFocused("")}
                                style={{
                                  width: "100%",
                                  padding: "10px 12px 10px 40px",
                                  border: errors.card_cvv
                                    ? "2px solid #dc3545"
                                    : cardFocused === "card_cvv"
                                      ? "2px solid #dfa528"
                                      : "2px solid #e0e0e0",
                                  borderRadius: "8px",
                                  fontSize: "14px",
                                  outline: "none",
                                  transition: "all 0.2s",
                                }}
                              />
                            </div>
                            {errors.card_cvv && (
                              <span
                                style={{
                                  color: "#dc3545",
                                  fontSize: "12px",
                                  marginTop: "4px",
                                  display: "block",
                                }}
                              >
                                {errors.card_cvv}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Secure Payment Info */}
                        <div
                          style={{
                            marginTop: "15px",
                            padding: "12px",
                            background: "#f8f9fa",
                            borderRadius: "8px",
                            fontSize: "12px",
                            color: "#666",
                            textAlign: "center",
                          }}
                        >
                          <Lock
                            size={14}
                            style={{ display: "inline", marginRight: "6px" }}
                          />
                          {isRTL
                            ? "مدفوعات آمنة عبر بوابة ميسر"
                            : "Secure payments via Moyasar gateway"}
                        </div>
                      </div>
                    )}
                  </div>

                  {errors.submit && (
                    <div
                      style={{
                        background: "#fee",
                        color: "#dc3545",
                        padding: "12px",
                        borderRadius: "8px",
                        marginTop: "15px",
                        fontSize: "14px",
                      }}
                    >
                      {errors.submit}
                    </div>
                  )}

                  <div
                    style={{ display: "flex", gap: "12px", marginTop: "20px" }}
                  >
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        background: "#f0f0f0",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        flex: 2,
                        padding: "12px",
                        background:
                          formData.payment_method === "credit_card"
                            ? "#dfa528"
                            : "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.6 : 1,
                        fontSize: "14px",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        !loading &&
                        (e.target.style.background =
                          formData.payment_method === "credit_card"
                            ? "#c98c1e"
                            : "#218838")
                      }
                      onMouseLeave={(e) =>
                        !loading &&
                        (e.target.style.background =
                          formData.payment_method === "credit_card"
                            ? "#dfa528"
                            : "#28a745")
                      }
                    >
                      {loading
                        ? "Submitting..."
                        : formData.payment_method === "credit_card"
                          ? isRTL
                            ? "دفع بالبطاقة"
                            : "Pay with Card"
                          : t.confirm}
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <div style={{ textAlign: "center", padding: "30px 0" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "#d4edda",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <Check size={40} color="#28a745" />
                  </div>
                  <h3 style={{ color: "#28a745", marginBottom: "10px" }}>
                    {t.bookingSuccess}
                  </h3>
                  <p style={{ color: "#666", fontSize: "14px" }}>
                    {t.thankYou}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}