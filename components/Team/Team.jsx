"use client";

import { motion } from "framer-motion";
import { Building2, Users, Rocket, Trophy, HardHat, Wrench, Home, Award } from "lucide-react";
import { useEffect, useRef } from "react";
import styles from "./Team.css"; // for glowing overlay

// 🌌 Star Canvas Component
function StarCanvas({ style }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      opacity: Math.random(),
      fade: Math.random() * 0.02 + 0.005,
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height); // keep background transparent

      stars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0 || star.x > width) star.vx *= -1;
        if (star.y < 0 || star.y > height) star.vy *= -1;

        star.opacity += star.fade;
        if (star.opacity > 1 || star.opacity < 0) star.fade *= -1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(206, 172, 36, ${star.opacity})`; // Golden stars
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    draw();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

export default function Team({ lang }) {
  const translations = {
    en: {
      heading: "Building the Future with Excellence & Precision",
      description:
        "At Rock Summit Co. Ltd, we are a dedicated team of construction professionals, engineers, and project managers committed to delivering exceptional contracting services. With years of experience in the construction industry, we've successfully completed numerous projects across residential, commercial, and infrastructure sectors, building lasting structures that stand the test of time.",
      stats: [
        { value: "150+", label: "Projects Completed", text: "Successfully delivered construction projects of all scales." },
        { value: "50+", label: "Expert Team", text: "Skilled professionals including engineers and technicians." },
        { value: "10+", label: "Years Experience", text: "Years of combined expertise in construction and contracting." },
        { value: "120+", label: "Satisfied Clients", text: "Clients who trust us with their construction needs." },
      ],
    },
    ar: {
      heading: "نبني المستقبل بالتميز والدقة",
      description:
        "في شركة القمة الصخرية المحدودة، نحن فريق مخصص من المحترفين في مجال البناء والمهندسين ومديري المشاريع الملتزمين بتقديم خدمات مقاولات استثنائية. مع سنوات من الخبرة في صناعة البناء، أكملنا بنجاح العديد من المشاريع في القطاعات السكنية والتجارية والبنية التحتية، وبناء هياكل دائمة تثبت أمام اختبار الزمن.",
      stats: [
        { value: "150+", label: "المشاريع المكتملة", text: "مشاريع بناء مكتملة بنجاح بجميع المقاييس." },
        { value: "50+", label: "فريق الخبراء", text: "محترفون مهرة يشملون المهندسين والفنيين." },
        { value: "10+", label: "سنوات الخبرة", text: "سنوات من الخبرة المجمعة في البناء والمقاولات." },
        { value: "120+", label: "عملاء راضون", text: "عملاء يثقون بنا في احتياجاتهم الإنشائية." },
      ],
    },
  };

  const t = translations[lang] || translations.en;

  const stats = [
    { icon: <Building2 size={28} className="text-gold-custom" />, ...t.stats[0] },
    { icon: <HardHat size={28} className="text-gold-custom" />, ...t.stats[1] },
    { icon: <Wrench size={28} className="text-gold-custom" />, ...t.stats[2] },
    { icon: <Award size={28} className="text-gold-custom" />, ...t.stats[3] },
  ];

  return (
    <section
      className="py-5 position-relative"
      style={{
        backgroundImage: "url('/team.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        direction: lang === "ar" ? "rtl" : "ltr",
        textAlign: lang === "ar" ? "right" : "left",
        overflow: "hidden",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Dark Overlay */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 0
        }}
      ></div>

      {/* Star Canvas */}
      <StarCanvas />

      {/* Glowing overlay */}
      <motion.div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(206, 172, 36, 0.1), transparent)",
          zIndex: 1
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      <div className="container position-relative" style={{ zIndex: 2 }}>
        {/* Heading */}
        <div className="text-center mb-5">
          <motion.h2
            className="display-5 fw-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t.heading}
          </motion.h2>
          <motion.p
            className="text-white lead"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ 
              maxWidth: "800px", 
              margin: "0 auto",
              color: "#e0e0e0",
              lineHeight: "1.6"
            }}
          >
            {t.description}
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="row g-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="col-lg-3 col-md-6 col-sm-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <motion.div
                className="text-center p-4 rounded-4 shadow-lg h-100"
                style={{
                  background: "rgba(26, 26, 26, 0.8)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(206, 172, 36, 0.3)",
                }}
                whileHover={{ 
                  scale: 1.05, 
                  borderColor: "rgba(206, 172, 36, 0.6)",
                  boxShadow: "0 15px 30px rgba(206, 172, 36, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div
                  className="mb-3 d-flex justify-content-center align-items-center rounded-circle mx-auto"
                  style={{ 
                    width: "70px", 
                    height: "70px", 
                    backgroundColor: "rgba(206, 172, 36, 0.2)",
                    border: "1px solid rgba(206, 172, 36, 0.5)"
                  }}
                >
                  {stat.icon}
                </div>
                <h3 className="fw-bold mb-2" style={{ fontSize: "2.5rem", color: "#ceac24" }}>{stat.value}</h3>
                <h5 className="mb-2" style={{ color: "#ffffff" }}>{stat.label}</h5>
                <p className="mb-0" style={{ color: "#cccccc", lineHeight: "1.5" }}>{stat.text}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Additional Construction Expertise Section */}
        <motion.div
          className="row mt-5 pt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="col-12 text-center">
            <h4 className="mb-4" style={{ color: "#ceac24" }}>
              {lang === "ar" ? "مجالات تخصصنا" : "Our Areas of Expertise"}
            </h4>
            <div className="row g-3">
              {[
                { icon: <Home size={20} color="#ceac24" />, text: lang === "ar" ? "المباني السكنية" : "Residential Buildings" },
                { icon: <Building2 size={20} color="#ceac24" />, text: lang === "ar" ? "المباني التجارية" : "Commercial Buildings" },
                { icon: <Wrench size={20} color="#ceac24" />, text: lang === "ar" ? "البنية التحتية" : "Infrastructure" },
                { icon: <HardHat size={20} color="#ceac24" />, text: lang === "ar" ? "أعمال التشطيب" : "Finishing Works" },
              ].map((item, index) => (
                <div key={index} className="col-lg-3 col-md-6 col-sm-6">
                  <div className="d-flex align-items-center justify-content-center gap-2" style={{ color: "#ffffff" }}>
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          section {
            background-attachment: scroll;
          }
        }
      `}</style>
    </section>
  );
}