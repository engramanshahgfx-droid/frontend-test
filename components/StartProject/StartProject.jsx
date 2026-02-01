"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Star } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useUI } from "@/providers/UIProvider";

export default function StartProject({ lang }) {
  const videoRef = useRef(null);
  const { openReservationModal } = useUI();

  useEffect(() => {
    // Ensure video plays and loops properly
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  const [activeReservation, setActiveReservation] = useState(null);

  const handleReservation = (type = "domestic") => {
    setActiveReservation(type);
    openReservationModal({
      title: type === "domestic"
        ? (lang === "ar" ? "حجز محلي" : "Domestic Reservation")
        : (lang === "ar" ? "حجز دولي" : "International Reservation"),
      slug: "",
      type,
      // Inform the modal which booking location/tab to open
      bookingLocation: type === "domestic" ? "local" : "international",
      preferredBookingType: "activity",
      isLocalService: type === "domestic",
    });
  }; 

  return (
    <section
      className="position-relative py-5 text-center text-white"
      style={{ minHeight: "70vh", overflow: "hidden" }}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="/travel-video.mp4" type="video/mp4" />
        {/* Fallback image if video doesn't exist */}
        <img
          src="/travel-bg.jpg"
          alt="Travel background"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay for better readability */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      ></div>

      {/* Golden Accent Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: `radial-gradient(circle at 20% 80%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)`,
          zIndex: 1,
        }}
      ></div>

      {/* Content */}
      <div className="container position-relative z-2 d-flex flex-column align-items-center justify-content-center h-100">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <motion.h1
            className="fw-bold display-3"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ color: "#ffffff", fontSize: "1.75rem" }}
          >
            {lang === "ar"
              ? "وجهات مميزة بانتظارك"
              : "Unique destinations await you"}
          </motion.h1>

          <motion.p
            className="lead mx-auto mt-3 mb-5"
            style={{ 
              maxWidth: "700px",
              color: "#e0e0e0",
              lineHeight: "1.6"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {lang === "ar"
              ? "دعنا نخطط لرحلتك المثالية من البداية إلى النهاية. استمتع بتجارب سياحية فريدة، مرشدين محليين، وذكريات تدوم مدى الحياة."
              : "Let us plan your perfect journey from start to finish. Enjoy unique travel experiences, local guides, and memories that last a lifetime."}
          </motion.p> 

          <motion.div
            className="d-flex flex-column flex-sm-row justify-content-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <button
              type="button"
              onClick={() => handleReservation('domestic')}
              className="btn btn-lg d-flex align-items-center justify-content-center gap-2 px-4 py-3 shadow"
              style={{
                background: activeReservation === 'domestic' ? '#bb8002ff' : '#EFC8AE',
                color: activeReservation === 'domestic' ? '#ffffff' : '#000000',
                border: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = activeReservation === 'domestic' ? '0 10px 30px rgba(34,197,94,0.4)' : '0 8px 25px rgba(74,144,226,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.12)';
              }}
              aria-pressed={activeReservation === 'domestic'}
            >
              {lang === "ar" ? "حجز محلي" : "Domestic Reservation"}
              <Calendar size={20} />
            </button>
            <button
              type="button"
              onClick={() => handleReservation('international')}
              className="btn btn-lg d-flex align-items-center gap-2 px-4 py-3"
              style={{
                background: activeReservation === 'international' ? '#bb8002ff' : '#EFC8AE',
                color: activeReservation === 'international' ? '#ffffff' : '#000000',
                border: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = activeReservation === 'international' ? '0 10px 30px rgba(34,197,94,0.4)' : '0 8px 25px rgba(74,144,226,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.12)';
              }}
              aria-pressed={activeReservation === 'international'}
            >
              <MapPin size={20} />{' '}
              {lang === 'ar' ? ' حجز دولي' : 'International Reservation'}
            </button>
          </motion.div>

          {/* Travel Features */}
          <motion.div
            className="row mt-5 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div className="col-md-3 mb-3">
              <div className="d-flex flex-column align-items-center">
                <div
                  className="rounded-circle p-3 mb-2 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "rgba(74, 144, 226, 0.2)",
                    border: "1px solid rgba(74, 144, 226, 0.5)",
                    width: "70px",
                    height: "70px",
                  }}
                >
                  <MapPin size={24} color="#4a90e2" />
                </div>
                <h6 className="fw-bold mb-1" style={{ color: "#ffffff" }}>
                  {lang === "ar" ? "وجهات حصرية" : "Exclusive Destinations"}
                </h6>
                <small style={{ color: "#cccccc" }}>
                  {lang === "ar"
                    ? "أفضل الأماكن المخفية"
                    : "Best hidden places"}
                </small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="d-flex flex-column align-items-center">
                <div
                  className="rounded-circle p-3 mb-2 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "rgba(34, 197, 94, 0.2)",
                    border: "1px solid rgba(34, 197, 94, 0.5)",
                    width: "70px",
                    height: "70px",
                  }}
                >
                  <Users size={24} color="#22c55e" />
                </div>
                <h6 className="fw-bold mb-1" style={{ color: "#ffffff" }}>
                  {lang === "ar" ? "مرشدون محليون" : "Local Guides"}
                </h6>
                <small style={{ color: "#cccccc" }}>
                  {lang === "ar" ? "خبراء بالمنطقة" : "Area experts"}
                </small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="d-flex flex-column align-items-center">
                <div
                  className="rounded-circle p-3 mb-2 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "rgba(245, 158, 11, 0.2)",
                    border: "1px solid rgba(245, 158, 11, 0.5)",
                    width: "70px",
                    height: "70px",
                  }}
                >
                  <Calendar size={24} color="#f59e0b" />
                </div>
                <h6 className="fw-bold mb-1" style={{ color: "#ffffff" }}>
                  {lang === "ar" ? "مرونة المواعيد" : "Flexible Scheduling"}
                </h6>
                <small style={{ color: "#cccccc" }}>
                  {lang === "ar"
                    ? "خطط حسب جدولك"
                    : "Plan around your schedule"}
                </small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="d-flex flex-column align-items-center">
                <div
                  className="rounded-circle p-3 mb-2 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "rgba(168, 85, 247, 0.2)",
                    border: "1px solid rgba(168, 85, 247, 0.5)",
                    width: "70px",
                    height: "70px",
                  }}
                >
                  <Star size={24} color="#a855f7" />
                </div>
                <h6 className="fw-bold mb-1" style={{ color: "#ffffff" }}>
                  {lang === "ar" ? "تقييمات 5 نجوم" : "5-Star Reviews"}
                </h6>
                <small style={{ color: "#cccccc" }}>
                  {lang === "ar" ? "عملاء سعداء" : "Happy customers"}
                </small>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .display-3 {
            font-size: 2.5rem;
          }

          video {
            object-position: center;
          }
        }

        @media (max-width: 576px) {
          .display-3 {
            font-size: 2rem;
          }

          .btn-lg {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
