"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./Saudi.module.css";

const Saudi = ({ lang = "ar" }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  // 1. Text Content
  const content = {
    en: {
      title: "Welcome to Tilal Rimal. We provide high-quality, competitively priced tourism experiences that combine enjoyment with local expertise to create unforgettable memories. Our dedicated team plans every trip with care.",
      subtitle: "",
      desc: "Let us plan while you enjoy the journey.",
            button: "Descover More",  //link with about page 

    },

    ar: {
      title: "مرحبًا بكم في تلال رمال. نقدم تجارب سياحية عالية الجودة وبأسعار تنافسية تجمع بين المتعة والخبرة المحلية لصنع ذكريات لا تُنسى. فريقنا المتفاني يخطط لكل رحلة بعناية — اكتشف السعودية بمنظور جديد.",
      subtitle: "        ",
      desc: "دعنا نخطط بينما تستمتع بالرحلة.",
                  button: "اكتشف المزيد",  //link with about page 

    },
  };

  const t = content[lang] || content.ar;

  const citiesData = [
    {
      id: "alula",
      nameAr: "العلا",
      nameEn: "AlUla",
      top: 15,
      right: 20,
      img: "/about.webp",
      vid: "/videos/.mp4",
    },
    {
      id: "madina",
      nameAr: "المدينة",
      nameEn: "Madina",
      top: 30,
      right: 35,
      img: "/madina.png",
      vid: "/videos/.mp4",
    },
    {
      id: "amlij",
      nameAr: "أملج",
      nameEn: "Amlij",
      top: 45,
      right: 55,
      img: "/al-wajh-island.webp",
      vid: "/videos/.mp4",
    },
    {
      id: "jeddah",
      nameAr: "جدة",
      nameEn: "Jeddah",
      top: 75,
      right: 60,
      img: "/bg12.jpg",
      vid: "/videos/.mp4",
    },
    {
      id: "hail",
      nameAr: "حائل",
      nameEn: "Hail",
      top: 55,
      right: 15,
      img: "/hail.png",
      vid: "/videos/.mp4",
    },
    {
      id: "south",
      nameAr: "الجنوب",
      nameEn: "South",
      top: 80,
      right: 25,
      img: "/south.png",
      vid: "/videos/.mp4",
    },
  ];

  const connections = [
    ["alula", "madina"],
    ["madina", "amlij"],
    ["amlij", "jeddah"],
    ["alula", "hail"],
    ["hail", "south"],
  ];

  const getCity = (id) => citiesData.find((c) => c.id === id);

  return (
    <div className={styles.container}>
      <div className={styles.videoBackground}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className={styles.backgroundVideo}
        >
          <source src="/AllSections.mp4" type="video/mp4" />
        </video>
        <div className={styles.overlay}></div>
      </div>

      <div
        className={`${styles.mainWrapper} ${
          lang === "en" ? styles.wrapperEn : styles.wrapperAr
        }`}
      >
    <div className={styles.textSection}>
  <h1 className={`${styles.mainTitle} whitespace-nowrap overflow-hidden text-white`} style={{ fontSize: "1.75rem" }}>
    {t.title}
  </h1>
  <h2 className={`${styles.subTitle} text-yellow-400 text-[8px] md:text-[10px] whitespace-nowrap`}>
    {t.subtitle}
  </h2>
  <p className={`${styles.description} text-white text-[20px] md:text-[20px] mt-1`}>
    {t.desc}
  </p>
  <Link href={`/${lang}/about-us`}>
    <button 
      style={{
        background: "linear-gradient(135deg, #dfa528 0%, #EFC8AE 100%)",
        marginTop: "24px",
        padding: "12px 32px",
        fontSize: "16px",
        fontWeight: "bold",
        color: "#1a1a1a",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 15px rgba(223, 165, 40, 0.3)",
        textTransform: "capitalize"
      }}
      onMouseEnter={(e) => {
        e.target.style.boxShadow = "0 8px 25px rgba(223, 165, 40, 0.5)";
        e.target.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.target.style.boxShadow = "0 4px 15px rgba(223, 165, 40, 0.3)";
        e.target.style.transform = "translateY(0)";
      }}
    >
      {t.button}
    </button>
  </Link>
</div>

        <div className={styles.mapSection}>
          <svg className={styles.svgLayer}>
            {connections.map(([startId, endId], index) => {
              const c1 = getCity(startId);
              const c2 = getCity(endId);
              if (!c1 || !c2) return null;
              return (
                <line
                  key={index}
                  x1={`${100 - c1.right}%`}
                  y1={`${c1.top}%`}
                  x2={`${100 - c2.right}%`}
                  y2={`${c2.top}%`}
                  className={styles.connectionLine}
                />
              );
            })}
          </svg>

          {citiesData.map((city) => (
            <div
              key={city.id}
              className={styles.cityWrapper}
              style={{ top: `${city.top}%`, right: `${city.right}%` }}
              onClick={() => setSelectedCity(city)}
            >
              <div className={styles.cityCircle}>
                <img
                  src={city.img}
                  alt={city.nameEn}
                  className={styles.cityThumb}
                />
              </div>
              <span className={styles.cityName}>
                {lang === "ar" ? city.nameAr : city.nameEn}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedCity && (
        <div
          className={styles.videoModal}
          onClick={() => setSelectedCity(null)}
        >
          <div
            className={styles.videoContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setSelectedCity(null)}
            >
              ✕
            </button>
            <video controls autoPlay className={styles.videoPlayer}>
              <source src={selectedCity.vid} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default Saudi;
