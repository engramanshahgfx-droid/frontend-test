"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, Star, Waves, ArrowLeft } from "lucide-react";
import { useUI } from "@/providers/UIProvider";
import { API_URL } from "@/lib/api";

export default function LocalIslandDetailClient({ lang, initialDestination }) {
  const router = useRouter();
  const { openBookingOrAuth } = useUI();

  const [destination] = useState(initialDestination);
  const [loading] = useState(false);
  const [error] = useState(null);

  const labels = {
    en: {
      backButton: "Back",
      bookNow: "Book Now",
      duration: "Duration",
      groupSize: "Group Size",
      location: "Location",
      price: "Price",
      per_person: "per person",
      features: "Features",
      description: "Description",
      itinerary: "Itinerary",
      whatsIncluded: "What's Included",
    },
    ar: {
      backButton: "عودة",
      bookNow: "احجز الآن",
      duration: "المدة",
      groupSize: "حجم المجموعة",
      location: "الموقع",
      price: "السعر",
      per_person: "للشخص",
      features: "المميزات",
      description: "الوصف",
      itinerary: "البرنامج",
      whatsIncluded: "ما هو المشمول",
    },
    zh: {
      backButton: "返回",
      bookNow: "立即预订",
      duration: "行程时间",
      groupSize: "团队规模",
      location: "位置",
      price: "价格",
      per_person: "每人",
      features: "特色",
      description: "描述",
      itinerary: "行程安排",
      whatsIncluded: "包含内容",
    },
  };

  const t = labels[lang] || labels.en;

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "#fff",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #8A7779 0%, #6e6768ff 50%, #5a4f50 100%)",
        }}
      >
        <p>Loading destination details...</p>
      </div>
    );
  }

  if (!destination) {
    const errorMsg = error || (lang === 'ar' ? 'الوجهة غير موجودة' : 'Destination not found');
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "#fff",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #8A7779 0%, #6e6768ff 50%, #5a4f50 100%)",
        }}
      >
        <div>
          <p style={{ color: "#ff6b6b", fontSize: "1.1rem" }}>
            {errorMsg}
          </p>
          <button
            onClick={() => router.back()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#dfa528",
              color: "#333",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {t.backButton}
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={18}
        fill={i < Math.floor(rating) ? "#dfa528" : "none"}
        color="#dfa528"
      />
    ));
  };

  const handleBookNowWhatsApp = () => {
    const title = destination.title || "";
    const amount = destination.price || 0;
    const slugVal = destination.slug || "";

    try {
      openBookingOrAuth({ title, amount, slug: slugVal });
    } catch (e) {
      console.error('openBookingOrAuth not available', e);
      const base = typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : API_URL.replace(/\/api\/?$/, "");
      const url = slugVal ? `${base}/${lang}/local-islands/${slugVal}` : base;
      let message;
      if (lang === "ar") {
        message = `مرحبا، أريد الاستفسار عن ${title} (السعر: ${amount}). ${url}`;
      } else if (lang === "zh") {
        message = `你好，我对${title}感兴趣（价格：${amount}）。${url}`;
      } else {
        message = `Hello, I'm interested in ${title} (Price: ${amount}). ${url}`;
      }
      const phoneNumber = "966547305060";
      const whatsappUrl = `https://wa.me/${encodeURIComponent(phoneNumber)}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, #8A7779 0%, #6e6768ff 50%, #5a4f50 100%)",
        color: "white",
        direction: lang === "ar" ? "rtl" : "ltr",
        minHeight: "100vh",
        padding: "60px 20px",
      }}
    >
      <div className="container">
        {/* Back Button */}
        <motion.button
          onClick={() => router.back()}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="btn d-flex align-items-center gap-2 mb-4"
          style={{
            background: "none",
            border: "none",
            color: "#dfa528",
            cursor: "pointer",
            padding: "10px 0",
          }}
        >
          <ArrowLeft size={20} />
          {t.backButton}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="row g-5"
        >
          {/* Image Section */}
          <div className="col-lg-6">
            <motion.img
              src={destination.image}
              alt={destination.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                width: "100%",
                borderRadius: "15px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
              }}
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
            />
          </div>

          {/* Content Section */}
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="display-5 fw-bold mb-3">{destination.title}</h1>

              {/* Key Details */}
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Clock size={20} color="#dfa528" />
                    <span className="fw-bold">{t.duration}</span>
                  </div>
                  <p className="ms-4">{destination.duration}</p>
                </div>

                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Users size={20} color="#dfa528" />
                    <span className="fw-bold">{t.groupSize}</span>
                  </div>
                  <p className="ms-4">{destination.groupSize}</p>
                </div>

                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <MapPin size={20} color="#dfa528" />
                    <span className="fw-bold">{t.location}</span>
                  </div>
                  <p className="ms-4">{destination.location}</p>
                </div>

                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span style={{ fontSize: "20px", color: "#dfa528", fontWeight: "bold" }}>$</span>
                    <span className="fw-bold">{t.price}</span>
                  </div>
                  <p className="ms-4">{destination.price} {t.per_person}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5 className="fw-bold mb-2" style={{ color: "#dfa528" }}>{t.description}</h5>
                <p>{destination.description}</p>
              </div>

              {/* Features */}
              {destination.features && destination.features.length > 0 && (
                <div className="mb-4">
                  <h5 className="fw-bold mb-2" style={{ color: "#dfa528" }}>{t.features}</h5>
                  <div className="row g-2">
                    {destination.features.map((feature, idx) => (
                      <div key={idx} className="col-sm-6">
                        <div className="badge bg-light text-dark p-2">{feature}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What's Included */}
              {destination.whatsIncluded && destination.whatsIncluded.length > 0 && (
                <div className="mb-4">
                  <h5 className="fw-bold mb-2" style={{ color: "#dfa528" }}>{t.whatsIncluded}</h5>
                  <ul style={{ paddingLeft: "20px" }}>
                    {destination.whatsIncluded.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookNowWhatsApp}
                style={{
                  background: "linear-gradient(135deg, #dfa528 0%, #EFC8AE 100%)",
                  color: "#1a1a1a",
                  border: "none",
                  borderRadius: "8px",
                  padding: "15px 40px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  width: "100%",
                  boxShadow: "0 4px 15px rgba(223, 165, 40, 0.3)",
                }}
              >
                {t.bookNow}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
