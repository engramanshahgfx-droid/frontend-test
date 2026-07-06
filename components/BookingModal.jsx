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
  ExternalLink,
  Building2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { API_URL } from "@/lib/api";

export default function BookingModal({ isOpen, onClose, packageData, lang }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
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
    guests: 1,
    special_requests: "",
    booking_type: "destination",
  });
  const [errors, setErrors] = useState({});
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [showPaymentIframe, setShowPaymentIframe] = useState(false);

  const isRTL = lang === "ar";

  // Get base price from package data
  const getBasePrice = () => {
    return (
      parseFloat(packageData?.price) ||
      parseFloat(packageData?.basic_info?.price) ||
      100
    );
  };

  // Calculate total price based on room type and guests
  const calculateTotalPrice = () => {
    const basePrice = getBasePrice();
    const guests = formData.guests || 1;
    const roomType = formData.room_type;

    if (roomType === "DoubleRoom") {
      if (guests <= 2) {
        return basePrice;
      } else {
        const extraGuests = guests - 2;
        return basePrice + extraGuests * basePrice * 0.5;
      }
    } else {
      return basePrice * guests;
    }
  };

  // Update total amount when form data changes
  useEffect(() => {
    setTotalAmount(calculateTotalPrice());
  }, [formData.guests, formData.room_type, packageData]);

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

      setTotalAmount(calculateTotalPrice());
    }
  }, [packageData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name)
      newErrors.first_name = isRTL
        ? "الاسم الأول مطلوب"
        : "First Name is Required";
    if (!formData.last_name)
      newErrors.last_name = isRTL
        ? "اسم العائلة مطلوب"
        : "Last Name is Required";
    if (!formData.email) {
      newErrors.email = isRTL ? "البريد الإلكتروني مطلوب" : "Email is Required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = isRTL
        ? "البريد الإلكتروني غير صحيح"
        : "The Email field is not a valid e-mail address.";
    }
    if (!formData.mobile)
      newErrors.mobile = isRTL ? "رقم الجوال مطلوب" : "Mobile is Required";
    if (!formData.travel_date)
      newErrors.travel_date = isRTL
        ? "تاريخ السفر مطلوب"
        : "The Travel Date field is required.";
    if (!formData.guests || formData.guests < 1)
      newErrors.guests = isRTL
        ? "يرجى اختيار ضيف واحد على الأقل"
        : "Please select at least 1 guest";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Booking & Payment Submission
  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

    setLoading(true);
    setPaymentError(null);
    setErrors({});

    const packageId = formData.package_id || String(packageData?.id || "");
    const packageCode =
      formData.package_code ||
      packageData?.basic_info?.trip_code ||
      packageData?.trip_code ||
      `PKG-${packageData?.id || "1"}`;

    const calculatedTotal = calculateTotalPrice();

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
      payment_method: "credit_card",
      booking_type: "destination",
      guests: formData.guests || 1,
      special_requests: formData.special_requests || "",
      total_amount: calculatedTotal,
      price: calculatedTotal,
    };

    console.log("Submitting booking:", bookingData);

    try {
      // Step 1: Create the booking
      const bookingResponse = await fetch(`${API_URL}/bookings/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const bookingResult = await bookingResponse.json();
      console.log("Booking response:", bookingResult);

      if (bookingResponse.ok && bookingResult.success) {
        const newBookingId = bookingResult.data.id;
        setBookingId(newBookingId);

        // Step 2: Move to the Moyasar payment form flow.
        setLoading(false);
        setIsRedirecting(true);
        window.location.href = `/${lang}/booking-success?booking_id=${newBookingId}`;
      } else {
        if (bookingResult.errors) {
          setErrors(bookingResult.errors);
        } else {
          setErrors({
            submit: bookingResult.message || (isRTL ? "حدث خطأ ما" : "Something went wrong"),
          });
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Booking error:", error);
      setErrors({
        submit: isRTL
          ? "فشل إنشاء الحجز. يرجى المحاولة مرة أخرى."
          : "Failed to create booking. Please try again.",
      });
      setLoading(false);
    }
  };

const initiatePayment = async (bookingId, amount) => {
  setLoading(false);
  setIsRedirecting(true);
  window.location.href = `/${lang}/booking-success?booking_id=${bookingId}`;
};
  const resetForm = () => {
    setStep(1);
    setBookingId(null);
    setPaymentError(null);
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
      guests: 1,
      special_requests: "",
      booking_type: "destination",
    });
    setErrors({});
    setIsRedirecting(false);
    setTotalAmount(0);
    setPaymentUrl(null);
    setShowPaymentIframe(false);
  };

  const handleClose = () => {
    resetForm();
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
      creditCard: "Pay with Moyasar (Visa, Mada, STC Pay, Apple Pay)",
      confirm: "Confirm Booking & Pay",
      cancel: "Cancel",
      selectPackage: "Select Package",
      data: "Data",
      completed: "Completed",
      bookingSuccess: "Booking Created Successfully!",
      bookingNumber: "Booking Number",
      redirecting: "Redirecting to payment gateway...",
      guests: "Number of Guests",
      specialRequests: "Special Requests",
      continue: "Continue",
      submit: "Processing...",
      payWithCard: "Pay with Credit Card",
      securePayment: "Secure payments via Moyasar gateway",
      paymentSuccess: "Payment Successful!",
      paymentSuccessMessage: "Your booking has been confirmed. We will contact you shortly.",
      payMore: "Pay with Credit Card",
      supports: "Supports Visa, Mada, STC Pay, Apple Pay. Bank transfer fallback available.",
      retry: "Retry",
      paymentError: "Payment Error",
      pricePerPerson: "per person",
      totalAmount: "Total Amount",
      roomPrice: "Room Price",
      additionalGuests: "Additional guests",
      redirectingToPayment: "Redirecting to secure payment page...",
      processingBooking: "Creating your booking...",
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
      creditCard: "ادفع عبر Moyasar (فيزا، مدى، إس تي سي باي، آبل باي)",
      confirm: "تأكيد الحجز والدفع",
      cancel: "إلغاء",
      selectPackage: "اختر الباقة",
      data: "البيانات",
      completed: "مكتمل",
      bookingSuccess: "تم إنشاء الحجز بنجاح!",
      bookingNumber: "رقم الحجز",
      redirecting: "جاري التوجيه لبوابة الدفع...",
      guests: "عدد الضيوف",
      specialRequests: "طلبات خاصة",
      continue: "متابعة",
      submit: "جاري المعالجة...",
      payWithCard: "ادفع ببطاقة الائتمان",
      securePayment: "مدفوعات آمنة عبر بوابة ميسر",
      paymentSuccess: "تم الدفع بنجاح!",
      paymentSuccessMessage: "تم تأكيد حجزك. سنتواصل معك قريباً.",
      payMore: "ادفع ببطاقة الائتمان",
      supports: "يدعم فيزا، مدى، إس تي سي باي، آبل باي. الدفع عبر التحويل البنكي متاح كخيار احتياطي.",
      retry: "إعادة المحاولة",
      paymentError: "خطأ في الدفع",
      pricePerPerson: "للفرد",
      totalAmount: "المبلغ الإجمالي",
      roomPrice: "سعر الغرفة",
      additionalGuests: "ضيوف إضافيين",
      redirectingToPayment: "جاري التوجيه لصفحة الدفع الآمنة...",
      processingBooking: "جاري إنشاء حجزك...",
    },
  };

  const t = labels[lang] || labels.en;

  // Get price breakdown for display
  const getPriceBreakdown = () => {
    const basePrice = getBasePrice();
    const guests = formData.guests || 1;
    const roomType = formData.room_type;

    if (roomType === "DoubleRoom") {
      if (guests <= 2) {
        return {
          basePrice: basePrice,
          extraCost: 0,
          total: basePrice,
          description: t.roomPrice,
        };
      } else {
        const extraGuests = guests - 2;
        const extraCost = extraGuests * basePrice * 0.5;
        return {
          basePrice: basePrice,
          extraCost: extraCost,
          total: basePrice + extraCost,
          description: `${t.roomPrice} + ${extraGuests} ${t.additionalGuests}`,
        };
      }
    } else {
      return {
        basePrice: basePrice * guests,
        extraCost: 0,
        total: basePrice * guests,
        description: `${guests} × ${t.pricePerPerson}`,
      };
    }
  };

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
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "15px",
                [isRTL ? "left" : "right"]: "20px",
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
                          {isRTL ? "رمز الرحلة:" : "Trip Code:"}{" "}
                          {packageData.basic_info.trip_code}
                        </span>
                        <span style={{ marginLeft: "20px" }}>
                          {isRTL ? "عدد الأيام:" : "Days:"}{" "}
                          {packageData.basic_info.days_num}
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "#c98c1e")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "#dfa528")
                    }
                  >
                    {t.continue}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmitBooking}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isRTL ? "1fr 1fr" : "1fr 1fr",
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
                            [isRTL ? "right" : "left"]: "12px",
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
                            padding: isRTL
                              ? "10px 40px 10px 12px"
                              : "10px 12px 10px 40px",
                            border: errors.first_name
                              ? "2px solid #dc3545"
                              : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            transition: "all 0.2s",
                            outline: "none",
                            textAlign: isRTL ? "right" : "left",
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
                        {t.lastName} <span style={{ color: "#dc3545" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <User
                          size={18}
                          style={{
                            position: "absolute",
                            [isRTL ? "right" : "left"]: "12px",
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
                            padding: isRTL
                              ? "10px 40px 10px 12px"
                              : "10px 12px 10px 40px",
                            border: errors.last_name
                              ? "2px solid #dc3545"
                              : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            textAlign: isRTL ? "right" : "left",
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
                            [isRTL ? "right" : "left"]: "12px",
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
                            padding: isRTL
                              ? "10px 40px 10px 12px"
                              : "10px 12px 10px 40px",
                            border: errors.email
                              ? "2px solid #dc3545"
                              : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            textAlign: isRTL ? "right" : "left",
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
                            [isRTL ? "right" : "left"]: "12px",
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
                            padding: isRTL
                              ? "10px 40px 10px 12px"
                              : "10px 12px 10px 40px",
                            border: errors.mobile
                              ? "2px solid #dc3545"
                              : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            textAlign: isRTL ? "right" : "left",
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
                            [isRTL ? "right" : "left"]: "12px",
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
                            padding: isRTL
                              ? "10px 40px 10px 12px"
                              : "10px 12px 10px 40px",
                            border: errors.travel_date
                              ? "2px solid #dc3545"
                              : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            textAlign: isRTL ? "right" : "left",
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
                            [isRTL ? "right" : "left"]: "12px",
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
                            padding: isRTL
                              ? "10px 40px 10px 12px"
                              : "10px 12px 10px 40px",
                            border: "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            background: "#fff",
                            textAlign: isRTL ? "right" : "left",
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
                            [isRTL ? "right" : "left"]: "12px",
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
                            padding: isRTL
                              ? "10px 40px 10px 12px"
                              : "10px 12px 10px 40px",
                            border: errors.guests
                              ? "2px solid #dc3545"
                              : "2px solid #e0e0e0",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            transition: "all 0.2s",
                            textAlign: isRTL ? "right" : "left",
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

                    {/* Price Breakdown Display */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <div
                        style={{
                          background: "#f0f8ff",
                          padding: "15px",
                          borderRadius: "8px",
                          border: "1px solid #d4edda",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontWeight: "600", color: "#2c2c2c" }}>
                            {t.totalAmount}
                          </span>
                          <span
                            style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              color: "#dfa528",
                            }}
                          >
                            {totalAmount} SAR
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#666",
                            marginTop: "4px",
                            textAlign: "right",
                          }}
                        >
                          {getPriceBreakdown().description}
                        </div>
                      </div>
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
                            textAlign: isRTL ? "right" : "left",
                          }}
                        />
                      </div>
                    </div>

                    {/* Payment Method Info */}
                    <div style={{ gridColumn: "1 / -1", marginTop: "10px" }}>
                      <div
                        style={{
                          background: "#f8f9fa",
                          padding: "15px",
                          borderRadius: "8px",
                          border: "2px solid #dfa528",
                          textAlign: "center",
                        }}
                      >
                        <CreditCard
                          size={24}
                          color="#dfa528"
                          style={{ display: "block", margin: "0 auto 8px" }}
                        />
                        <span style={{ fontWeight: "600", color: "#dfa528" }}>
                          {t.creditCard}
                        </span>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#666",
                            marginTop: "4px",
                          }}
                        >
                          {t.supports}
                        </p>
                      </div>
                    </div>
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
                        background: loading ? "#c98c1e" : "#dfa528",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1,
                        fontSize: "14px",
                        transition: "all 0.3s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) =>
                        !loading && (e.target.style.background = "#c98c1e")
                      }
                      onMouseLeave={(e) =>
                        !loading && (e.target.style.background = "#dfa528")
                      }
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                          {t.submit}
                        </>
                      ) : (
                        <>
                          <CreditCard size={16} />
                          {t.confirm} ({totalAmount} SAR)
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <div style={{ padding: "10px 0 0" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <h3 style={{ color: "#28a745", margin: "0 0 6px" }}>
                        {t.bookingSuccess}
                      </h3>
                      <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
                        {t.redirectingToPayment}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentUrl(null);
                        setShowPaymentIframe(false);
                        setStep(2);
                        setPaymentError(null);
                      }}
                      style={{
                        background: "#f0f0f0",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      {t.cancel}
                    </button>
                  </div>

                  {showPaymentIframe && paymentUrl ? (
                    <div
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "10px",
                        overflow: "hidden",
                        minHeight: "620px",
                        background: "#fff",
                      }}
                    >
                      <iframe
                        src={paymentUrl}
                        title="Moyasar payment"
                        style={{ width: "100%", minHeight: "620px", border: "0" }}
                      />
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "40px 20px" }}>
                      <Loader2
                        size={34}
                        color="#dfa528"
                        style={{ animation: "spin 1s linear infinite", marginBottom: "12px" }}
                      />
                      <p style={{ color: "#666", margin: 0 }}>
                        {t.redirectingToPayment}
                      </p>
                    </div>
                  )}

                  {paymentError && (
                    <div
                      style={{
                        background: "#fde8e8",
                        color: "#dc3545",
                        padding: "15px",
                        borderRadius: "8px",
                        marginTop: "15px",
                      }}
                    >
                      <strong>{t.paymentError}:</strong> {paymentError}
                      <button
                        onClick={() => {
                          setPaymentError(null);
                          setStep(2);
                        }}
                        style={{
                          background: "#dfa528",
                          color: "#fff",
                          border: "none",
                          padding: "8px 20px",
                          borderRadius: "20px",
                          cursor: "pointer",
                          marginTop: "10px",
                          fontWeight: "600",
                        }}
                      >
                        {t.retry}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Global styles for spinner animation
<style
  dangerouslySetInnerHTML={{
    __html: `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
  }}
/>;