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
  Banknote,
  ExternalLink,
  Building2,
  AlertCircle,
} from "lucide-react";
import { API_URL } from "@/lib/api";

export default function BookingModal({ isOpen, onClose, packageData, lang }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [bankDetails, setBankDetails] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = isRTL ? "الاسم الأول مطلوب" : "First Name is Required";
    if (!formData.last_name) newErrors.last_name = isRTL ? "اسم العائلة مطلوب" : "Last Name is Required";
    if (!formData.email) {
      newErrors.email = isRTL ? "البريد الإلكتروني مطلوب" : "Email is Required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = isRTL ? "البريد الإلكتروني غير صحيح" : "The Email field is not a valid e-mail address.";
    }
    if (!formData.mobile) newErrors.mobile = isRTL ? "رقم الجوال مطلوب" : "Mobile is Required";
    if (!formData.travel_date)
      newErrors.travel_date = isRTL ? "تاريخ السفر مطلوب" : "The Travel Date field is required.";
    if (!formData.guests || formData.guests < 1)
      newErrors.guests = isRTL ? "يرجى اختيار ضيف واحد على الأقل" : "Please select at least 1 guest";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Bank Transfer Submission
  const handleBankTransferSubmit = async (e) => {
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
      payment_method: "bank_transfer",
      booking_type: "destination",
      guests: formData.guests || 1,
      special_requests: formData.special_requests || "",
    };

    console.log("Submitting bank transfer booking:", bookingData);
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
        setBookingId(data.data.id);
        setBankDetails({
          account_number: data.data.bank_account || "SA1234567890",
          iban: data.data.iban || "SA1234567890123456789012",
          bank_name: data.data.bank_name || "البنك الأهلي السعودي",
          amount: packageData?.price || data.data.total_amount || 100,
        });
        setStep(3);
        setPaymentSuccess(true);
        setLoading(false);
      } else {
        if (data.errors) {
          console.log("Validation errors:", data.errors);
          setErrors(data.errors);
        } else {
          setErrors({ submit: data.message || (isRTL ? "حدث خطأ ما" : "Something went wrong") });
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Booking error:", error);
      setErrors({ submit: isRTL ? "فشل إنشاء الحجز. يرجى المحاولة مرة أخرى." : "Failed to create booking. Please try again." });
      setLoading(false);
    }
  };

  // Handle Credit Card Payment - Redirect to Moyasar Hosted Checkout Page
  const handleCreditCardPayment = async () => {
    if (!bookingId) {
      setPaymentError(isRTL ? "يرجى إنشاء الحجز أولاً" : "Please create booking first");
      return;
    }

    setIsRedirecting(true);
    setPaymentError(null);

    try {
      const price = packageData?.price || 100;

      // Prepare the payment payload
      const paymentPayload = {
        booking_id: bookingId,
        amount: Math.round(price * 100), // Moyasar expects amount in smallest currency unit (halalas)
        payment_method: "credit_card",
        success_url: `${window.location.origin}/${lang}/booking-success?booking_id=${bookingId}`,
        cancel_url: `${window.location.origin}/${lang}/booking-cancel?booking_id=${bookingId}`,
      };

      console.log("Initiating payment with payload:", paymentPayload);

      // Call Moyasar API to create a payment session
      const moyasarResponse = await fetch(
        `${API_URL}/payments/moyasar/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(paymentPayload),
        }
      );

      const paymentData = await moyasarResponse.json();
      console.log("Payment response:", paymentData);

      if (paymentData.success && paymentData.payment_url) {
        // Redirect to Moyasar Hosted Checkout Page
        console.log("Redirecting to:", paymentData.payment_url);
        window.location.href = paymentData.payment_url;
        return;
      } else {
        setPaymentError(
          paymentData.message || 
          paymentData.error || 
          (isRTL ? "فشل بدء عملية الدفع" : "Payment initiation failed")
        );
        setIsRedirecting(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(
        isRTL ? "فشل الاتصال ببوابة الدفع. يرجى المحاولة مرة أخرى." : "Failed to connect to payment gateway. Please try again."
      );
      setIsRedirecting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setBankDetails(null);
    setBookingId(null);
    setPaymentSuccess(false);
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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(isRTL ? "تم النسخ!" : "Copied!");
    });
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
      creditCard: "Pay with Credit Card",
      confirm: "Confirm Booking",
      cancel: "Cancel",
      selectPackage: "Select Package",
      data: "Data",
      completed: "Completed",
      bookingSuccess: "Booking Created Successfully!",
      bookingNumber: "Booking Number",
      bankTransferDetails: "Bank Transfer Details",
      accountNumber: "Account Number",
      iban: "IBAN",
      bankName: "Bank Name",
      amount: "Amount",
      copy: "Copy",
      redirecting: "Redirecting to payment gateway...",
      thankYou: "Please complete the payment using the bank transfer details below.",
      guests: "Number of Guests",
      specialRequests: "Special Requests",
      continue: "Continue",
      submit: "Submitting...",
      payWithCard: "Pay with Credit Card",
      securePayment: "Secure payments via Moyasar gateway",
      or: "or",
      paymentSuccess: "Payment Successful!",
      paymentSuccessMessage: "Your booking has been confirmed. We will contact you shortly.",
      payMore: "Pay with Credit Card",
      bankTransferInfo: "Bank account details will be sent after confirmation",
      supports: "Supports Mada, Visa, Mastercard, Apple Pay, Samsung Pay",
      retry: "Retry",
      paymentError: "Payment Error",
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
      creditCard: "ادفع ببطاقة الائتمان",
      confirm: "تأكيد الحجز",
      cancel: "إلغاء",
      selectPackage: "اختر الباقة",
      data: "البيانات",
      completed: "مكتمل",
      bookingSuccess: "تم إنشاء الحجز بنجاح!",
      bookingNumber: "رقم الحجز",
      bankTransferDetails: "تفاصيل التحويل البنكي",
      accountNumber: "رقم الحساب",
      iban: "رقم الآيبان",
      bankName: "اسم البنك",
      amount: "المبلغ",
      copy: "نسخ",
      redirecting: "جاري التوجيه لبوابة الدفع...",
      thankYou: "يرجى إكمال الدفع باستخدام تفاصيل التحويل البنكي أدناه.",
      guests: "عدد الضيوف",
      specialRequests: "طلبات خاصة",
      continue: "متابعة",
      submit: "جاري الإرسال...",
      payWithCard: "ادفع ببطاقة الائتمان",
      securePayment: "مدفوعات آمنة عبر بوابة ميسر",
      or: "أو",
      paymentSuccess: "تم الدفع بنجاح!",
      paymentSuccessMessage: "تم تأكيد حجزك. سنتواصل معك قريباً.",
      payMore: "ادفع ببطاقة الائتمان",
      bankTransferInfo: "سيتم إرسال تفاصيل الحساب البنكي بعد التأكيد",
      supports: "يدعم مدى، فيزا، ماستركارد، آبل باي، سامسونج باي",
      retry: "إعادة المحاولة",
      paymentError: "خطأ في الدفع",
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
                <form onSubmit={handleBankTransferSubmit}>
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
                        {t.lastName}{" "}
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

                    {/* Bank Transfer Info */}
                    <div style={{ gridColumn: "1 / -1", marginTop: "10px" }}>
                      <div
                        style={{
                          background: "#f8f9fa",
                          padding: "15px",
                          borderRadius: "8px",
                          border: "2px solid #28a745",
                          textAlign: "center",
                        }}
                      >
                        <Banknote size={24} color="#28a745" style={{ display: "block", margin: "0 auto 8px" }} />
                        <span style={{ fontWeight: "600", color: "#28a745" }}>
                          {t.bankTransfer}
                        </span>
                        <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                          {t.bankTransferInfo}
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
                        background: "#28a745",
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
                        (e.target.style.background = "#218838")
                      }
                      onMouseLeave={(e) =>
                        !loading &&
                        (e.target.style.background = "#28a745")
                      }
                    >
                      {loading ? t.submit : t.confirm}
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && bankDetails && (
                <div style={{ padding: "10px 0" }}>
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        background: "#d4edda",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 15px",
                      }}
                    >
                      <Check size={35} color="#28a745" />
                    </div>
                    <h3 style={{ color: "#28a745", marginBottom: "5px" }}>
                      {t.bookingSuccess}
                    </h3>
                    <p style={{ color: "#666", fontSize: "14px" }}>
                      {t.thankYou}
                    </p>
                  </div>

                  {/* Payment Error */}
                  {paymentError && (
                    <div
                      style={{
                        background: "#fde8e8",
                        border: "1px solid #f5c6cb",
                        color: "#721c24",
                        padding: "12px 15px",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                      }}
                    >
                      <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <strong>{t.paymentError}:</strong> {paymentError}
                        <button
                          onClick={() => {
                            setPaymentError(null);
                            handleCreditCardPayment();
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#dfa528",
                            cursor: "pointer",
                            fontWeight: "600",
                            marginLeft: "10px",
                            textDecoration: "underline",
                          }}
                        >
                          {t.retry}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Details */}
                  <div
                    style={{
                      background: "#f8f9fa",
                      padding: "20px",
                      borderRadius: "12px",
                      border: "1px solid #e0e0e0",
                      marginBottom: "20px",
                    }}
                  >
                    <h4 style={{ margin: "0 0 15px 0", color: "#2c2c2c", textAlign: "center" }}>
                      <Building2 size={18} style={{ display: "inline", marginRight: "8px" }} />
                      {t.bankTransferDetails}
                    </h4>

                    <div style={{ display: "grid", gap: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#fff", borderRadius: "6px" }}>
                        <span style={{ color: "#666", fontSize: "13px" }}>{t.bankName}</span>
                        <span style={{ fontWeight: "600", fontSize: "14px" }}>{bankDetails.bank_name}</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#fff", borderRadius: "6px" }}>
                        <span style={{ color: "#666", fontSize: "13px" }}>{t.accountNumber}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontWeight: "600", fontSize: "14px" }}>{bankDetails.account_number}</span>
                          <button
                            onClick={() => copyToClipboard(bankDetails.account_number)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#dfa528",
                              cursor: "pointer",
                              padding: "2px 6px",
                              fontSize: "12px",
                            }}
                          >
                            {t.copy}
                          </button>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#fff", borderRadius: "6px" }}>
                        <span style={{ color: "#666", fontSize: "13px" }}>{t.iban}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontWeight: "600", fontSize: "13px", fontFamily: "monospace" }}>{bankDetails.iban}</span>
                          <button
                            onClick={() => copyToClipboard(bankDetails.iban)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#dfa528",
                              cursor: "pointer",
                              padding: "2px 6px",
                              fontSize: "12px",
                            }}
                          >
                            {t.copy}
                          </button>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#fff", borderRadius: "6px", borderTop: "2px solid #dfa528" }}>
                        <span style={{ color: "#666", fontSize: "13px" }}>{t.amount}</span>
                        <span style={{ fontWeight: "700", fontSize: "18px", color: "#dfa528" }}>
                          {bankDetails.amount} SAR
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pay with Credit Card Button */}
                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                      <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }}></div>
                      <span style={{ color: "#999", fontSize: "13px" }}>{t.or}</span>
                      <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }}></div>
                    </div>

                    <button
                      onClick={handleCreditCardPayment}
                      disabled={isRedirecting}
                      style={{
                        width: "100%",
                        padding: "14px",
                        background: isRedirecting 
                          ? "linear-gradient(135deg, #c98c1e 0%, #b87a1a 100%)"
                          : "linear-gradient(135deg, #dfa528 0%, #c98c1e 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "16px",
                        cursor: isRedirecting ? "not-allowed" : "pointer",
                        opacity: isRedirecting ? 0.7 : 1,
                        transition: "all 0.3s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        boxShadow: isRedirecting 
                          ? "none"
                          : "0 4px 15px rgba(223, 165, 40, 0.4)",
                      }}
                      onMouseEnter={(e) =>
                        !isRedirecting &&
                        (e.target.style.background = "linear-gradient(135deg, #c98c1e 0%, #b87a1a 100%)")
                      }
                      onMouseLeave={(e) =>
                        !isRedirecting &&
                        (e.target.style.background = "linear-gradient(135deg, #dfa528 0%, #c98c1e 100%)")
                      }
                    >
                      {isRedirecting ? (
                        <>
                          <span style={{
                            display: "inline-block",
                            width: "20px",
                            height: "20px",
                            border: "3px solid rgba(255,255,255,0.3)",
                            borderTop: "3px solid #fff",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                          }} />
                          {t.redirecting}
                        </>
                      ) : (
                        <>
                          <CreditCard size={20} />
                          {t.payWithCard}
                          <ExternalLink size={16} />
                        </>
                      )}
                    </button>

                    <p style={{ fontSize: "12px", color: "#888", marginTop: "10px" }}>
                      <Lock size={12} style={{ display: "inline", marginRight: "4px" }} />
                      {t.securePayment}
                    </p>
                    <p style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>
                      {t.supports}
                    </p>
                  </div>
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
<style dangerouslySetInnerHTML={{
  __html: `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
}} />;