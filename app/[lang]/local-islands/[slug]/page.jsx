"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, Star, Waves, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_URL } from "../../../../lib/api";
import { useUI } from "../../../../providers/UIProvider";

export default function LocalIslandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang || "en";
  const slug = params.slug;
  const { openBookingOrAuth } = useUI();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Static labels
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
    },
  };

  const t = labels[lang] || labels.en;

  // Get localized field
  const getText = (obj, field) => {
    // Special handling for fields without localization suffix
    if (field === "groupSize" || field === "group_size") {
      return obj.group_size || obj.groupSize || "";
    }
    const fieldKey = lang === "ar" ? `${field}_ar` : `${field}_en`;
    return obj[fieldKey] || obj[field] || "";
  };

  // Build image URL
  const getImageUrl = (img) => {
    const placeholder = "/placeholder.png";
    if (!img) return placeholder;

    if (/^https?:\/\//i.test(img)) return img;
    if (img.startsWith("/")) return img;
    if (img.startsWith("storage/")) {
      const backendBase = API_URL.replace(/\/api\/?$/, "");
      return `${backendBase}/${img}`;
    }
    if (img.startsWith("islands/")) {
      const backendBase = API_URL.replace(/\/api\/?$/, "");
      return `${backendBase}/storage/${img}`;
    }

    const backendBase = API_URL.replace(/\/api\/?$/, "");
    return `${backendBase}/storage/islands/${img}`;
  };

  // Parse list
  const parseList = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    return [];
  };

  // Fetch full local list from backend and select by slug
  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      setDestination(null);
      try {
        const apiEndpoint = `${API_URL.replace(/\/$/, '')}/island-destinations/local`;
        console.debug('[LocalIslandDetail] Fetching from:', apiEndpoint);
        
        const res = await fetch(apiEndpoint, { signal: controller.signal });
        console.debug('[LocalIslandDetail] Response status:', res.status);
        
        const json = await res.json();
        console.debug('[LocalIslandDetail] Response data count:', Array.isArray(json.data) ? json.data.length : 0);
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status} - ${json?.message || 'Unknown error'}`);
        }
        
        if (!json?.success) {
          throw new Error(json?.message || 'Failed to load destination');
        }

        const list = Array.isArray(json.data) ? json.data : [];
        const slugList = list.map((d) => ({slug: d.slug, id: d.id, title: d.title_en}));
        console.debug('[LocalIslandDetail] Looking for slug:', slug, 'in list of:', slugList);
        
        // Try to find by slug first, then by ID as fallback
        const found = list.find((d) => {
          const slugMatch = d.slug === slug || d.slug === decodeURIComponent(slug);
          const idMatch = d.id?.toString() === slug;
          if (slugMatch || idMatch) {
            console.debug('[LocalIslandDetail] Found match:', {slug: d.slug, id: d.id, match: slugMatch ? 'slug' : 'id'});
          }
          return slugMatch || idMatch;
        });
        
        setLoading(false);
        
        if (found) {
          console.debug('[LocalIslandDetail] Destination loaded successfully:', found.slug || found.id);
          setDestination(found);
          setError(null);
        } else {
          console.warn('[LocalIslandDetail] Destination not found. Requested slug:', slug, 'Available:', list.map(d => d.slug).join(', '));
          setDestination(null);
          setError(lang === 'ar' ? 'الوجهة غير موجودة. يرجى المحاولة مرة أخرى.' : 'Destination not found. Please try again.');
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('[LocalIslandDetail] fetch error:', err.message, err);
          setError(err.message || 'Error loading destination');
          setDestination(null);
        }
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [slug, lang]);

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
    // Prefer booking modal (handles auth + payment); fallback to WhatsApp if modal unavailable
    const title = getText(destination, "title") || "";
    const amount = destination.price || destination.price_en || 0;
    const slugVal = destination.slug || destination.id || "";

    try {
      openBookingOrAuth({ title, amount, slug: slugVal });
    } catch (e) {
      console.error('openBookingOrAuth not available', e);
      const base =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : API_URL.replace(/\/api\/?$/, "");
      const url = slugVal ? `${base}/${lang}/local-islands/${slugVal}` : base;
      const message =
        lang === "ar"
          ? `مرحبا، أريد الاستفسار عن ${title} (السعر: ${amount}). ${url}`
          : `Hello, I'm interested in ${title} (Price: ${amount}). ${url}`;
      const phoneNumber = "+966547305060";
      const whatsappUrl = `https://wa.me/${encodeURIComponent(phoneNumber)}?text=${encodeURIComponent(
        message
      )}`;
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
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            border: "2px solid rgba(255,255,255,0.3)",
            borderRadius: "25px",
          }}
        >
          <ArrowLeft size={20} />
          {t.backButton}
        </motion.button>

        <div className="row">
          {/* Hero Image */}
          <div className="col-lg-8 mb-5" style={{ maxWidth: "820px" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "820px",
                aspectRatio: "820 / 1120",
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
            >
              <img
                src={getImageUrl(destination.image)}
                alt={getText(destination, "title")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
            </motion.div>
          </div>

          {/* Details Sidebar */}
          <div className="col-lg-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
                padding: "30px",
                borderRadius: "15px",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            >
              {/* Title */}
              <h1
                className="fw-bold mb-3"
                style={{
                  fontSize: "2rem",
                  background:
                    "linear-gradient(135deg, #ffffff, #EFC8AE, #dfa528)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {getText(destination, "title")}
              </h1>

              {/* Rating */}
              <div className="d-flex align-items-center gap-2 mb-4">
                {renderStars(destination.rating || 0)}
                <span className="text-warning fw-bold ms-2">
                  {destination.rating || 0}
                </span>
              </div>

              {/* Price */}
              <div className="mb-4 pb-4 border-bottom border-light border-opacity-25">
                <div
                  className="text-warning fw-bold"
                  style={{ fontSize: "2rem" }}
                >
                  {getText(destination, "price")}
                </div>
                <small className="text-light-50">{t.per_person}</small>
              </div>

              {/* Info Grid */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Clock size={20} className="text-warning" />
                  <div>
                    <small className="d-block text-light-50">
                      {t.duration}
                    </small>
                    <strong>{getText(destination, "duration")}</strong>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <Users size={20} className="text-warning" />
                  <div>
                    <small className="d-block text-light-50">
                      {t.groupSize}
                    </small>
                    <strong>{getText(destination, "groupSize")}</strong>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <MapPin size={20} className="text-warning" />
                  <div>
                    <small className="d-block text-light-50">
                      {t.location}
                    </small>
                    <strong>{getText(destination, "location")}</strong>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <motion.button
                onClick={handleBookNowWhatsApp}
                className="btn w-100 fw-bold py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "#EFC8AE",
                  color: "#000",
                  border: "none",
                  borderRadius: "25px",
                  fontSize: "1rem",
                }}
              >
                {t.bookNow}
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Description Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="row mt-5"
        >
          <div className="col-lg-8">
            <h2 className="fw-bold mb-4" style={{ fontSize: "1.75rem" }}>
              {t.description}
            </h2>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", opacity: 0.95 }}>
              {getText(destination, "description")}
            </p>
          </div>
        </motion.div>

        {/* Features Section */}
        {parseList(lang === "ar"
          ? destination.features_ar || destination.features
          : destination.features || destination.features_en
        ).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="row mt-5"
          >
            <div className="col-lg-8">
              <h2 className="fw-bold mb-4" style={{ fontSize: "1.75rem" }}>
                {t.features}
              </h2>
              <div className="row">
                {parseList(lang === "ar"
                  ? destination.features_ar || destination.features
                  : destination.features || destination.features_en
                ).map((feature, idx) => (
                  <div key={idx} className="col-md-6 mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <Waves size={20} className="text-warning flex-shrink-0" />
                      <span style={{ fontSize: "1.05rem" }}>{feature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Itinerary Section */}
        {getText(destination, "itinerary") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="row mt-5"
          >
            <div className="col-lg-8">
              <h2 className="fw-bold mb-4" style={{ fontSize: "1.75rem" }}>
                {lang === "ar" ? "برنامج الرحلة" : "Itinerary"}
              </h2>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "25px",
                  borderRadius: "15px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "1rem",
                  lineHeight: "1.8",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  fontFamily: "Tajawal, sans-serif",
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                {getText(destination, "itinerary")}
              </div>
            </div>
          </motion.div>
        )}

        {/* Includes Section */}
        {parseList(lang === "ar"
          ? destination.includes_ar || destination.includes
          : destination.includes || destination.includes_en
        ).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="row mt-5"
          >
            <div className="col-lg-8">
              <h2 className="fw-bold mb-4" style={{ fontSize: "1.75rem" }}>
                {lang === "ar" ? "يشمل البرنامج" : "What's Included"}
              </h2>
              <div className="row">
                {parseList(lang === "ar"
                  ? destination.includes_ar || destination.includes
                  : destination.includes || destination.includes_en
                ).map((item, idx) => (
                  <div key={idx} className="col-md-6 mb-3">
                    <div className="d-flex align-items-start gap-3">
                      <Star
                        size={20}
                        className="text-warning flex-shrink-0 mt-1"
                      />
                      <span style={{ fontSize: "1rem" }}>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
