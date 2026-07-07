"use client";
import { useState } from "react";
import Link from "next/link";
import { use } from "react";
import { citiesData } from "@/config/citiesData";
import styles from "./city.module.css";

export default function CityDetail({ params }) {
  const { lang, cityName } = use(params);
  const city = citiesData[cityName.toLowerCase()];

  if (!city) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>City not found</h1>
        <Link href={`/${lang}`}>
          <button style={{ padding: "10px 20px", marginTop: "20px" }}>
            Back to Home
          </button>
        </Link>
      </div>
    );
  }

  const isRTL = lang === "ar";
  const cityName_en = city.nameEn;
  const cityName_ar = city.nameAr;
  const displayName = lang === "ar" ? cityName_ar : cityName_en;
  const description = lang === "ar" ? city.descriptionAr : city.descriptionEn;
  const landmarks = lang === "ar" ? city.landmarksAr : city.landmarksEn;
  const bestTime = lang === "ar" ? city.bestTimeAr : city.bestTimeEn;
  const activities = lang === "ar" ? city.activitiesAr : city.activitiesEn;

  return (
    <div className={styles.container} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={styles.header}>
        <Link href={`/${lang}`}>
          <button className={styles.backButton}>
            {lang === "ar" ? "← العودة" : "← Back"}
          </button>
        </Link>
        <h1 className={styles.cityName}>{displayName}</h1>
      </div>

      {/* Hero Image */}
      <div className={styles.heroSection}>
        <img src={city.image} alt={displayName} className={styles.heroImage} />
        <div className={styles.heroOverlay}></div>
      </div>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        {/* Description Section */}
        <section className={styles.descriptionSection}>
          <p className={styles.description}>{description}</p>
        </section>

        {/* Best Time to Visit */}
        <section className={styles.bestTimeSection}>
          <h2>{lang === "ar" ? "أفضل وقت للزيارة" : "Best Time to Visit"}</h2>
          <p className={styles.bestTimeText}>{bestTime}</p>
        </section>

        {/* Landmarks Section */}
        <section className={styles.landmarksSection}>
          <h2>{lang === "ar" ? "المعالم الرئيسية" : "Major Landmarks"}</h2>
          <div className={styles.landmarksGrid}>
            {landmarks.map((landmark, index) => (
              <div key={index} className={styles.landmarkCard}>
                <div className={styles.landmarkImageWrapper}>
                  <img
                    src={landmark.image}
                    alt={landmark.name}
                    className={styles.landmarkImage}
                  />
                </div>
                <div className={styles.landmarkContent}>
                  <h3 className={styles.landmarkName}>{landmark.name}</h3>
                  <p className={styles.landmarkDescription}>
                    {landmark.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Activities Section */}
        <section className={styles.activitiesSection}>
          <h2>{lang === "ar" ? "الأنشطة الموصى بها" : "Recommended Activities"}</h2>
          <div className={styles.activitiesList}>
            {activities.map((activity, index) => (
              <div key={index} className={styles.activityTag}>
                {activity}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2>{lang === "ar" ? "هل أنت مستعد للمغامرة؟" : "Ready for an Adventure?"}</h2>
          <p>
            {lang === "ar"
              ? "احجز رحلتك إلى هذه المدينة الرائعة اليوم وعايش تجربة لا تُنسى"
              : "Book your trip to this amazing city today and experience unforgettable memories"}
          </p>
          <Link href={`/${lang}/tousimoffers`}>
            <button className={styles.bookButton}>
              {lang === "ar" ? "احجز الآن" : "Book Now"}
            </button>
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          {lang === "ar"
            ? "استكشف المملكة العربية السعودية مع التلال والرمال"
            : "Explore Saudi Arabia with Tilal Rimal"}
        </p>
      </footer>
    </div>
  );
}
