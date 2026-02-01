// components/TripDetails/TripDetails.jsx
"use client";

import React from "react";
import {
  FaCalendar,
  FaUsers,
  FaMapMarkerAlt,
  FaClock,
  FaTag,
  FaArrowLeft,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useUI } from "../../providers/UIProvider";

export default function TripDetails({ lang, tripId }) {
  const router = useRouter();
  const { openBookingOrAuth } = useUI();

  // Mock data - replace with actual API call using tripId
  const tripData = {
    "1": {
      en: {
        title: "Egyptian Night",
        date: "February 3, 2025 – 5:00 PM",
        groupSize: "30 persons",
        location: "Jeddah, AlGola",
        duration: "7 hours",
        category: "Musical Session",
        schedule: [
          "4:00 PM - Enter the farm and enjoy evening activities in natural surroundings",
          "5:00 PM - Founding Day march",
          "6:30 – 8:30 PM - Enter the farm and enjoy evening activities in natural surroundings",
          "Color show every half hour",
          "Traditional folk band for men (7 colors)",
          "Women's folk band",
          "Traditional hospitality and Founding Day distributions",
          "Horse or camel riding",
          "Beverages"
        ],
        additionalServices: [
          "Traditional foods",
          "Dinner meals from the farm kitchen",
          "Popcorn, sweet corn, ice cream",
          "Specialty drinks"
        ],
        importantNotes: [
          "Commitment to official Saudi dress code",
          "Arrive on time"
        ],
        image: "/trips/egyptian.jpg"
      },
      ar: {
        title: "ليلة مصرية",
        date: "٣ فبراير ٢٠٢٥ – ٥ مساءً",
        groupSize: "٣٠ شخص",
        location: "جدة, الغولا",
        duration: "٧ ساعات",
        category: "جلسة طربية",
        schedule: [
          "٤ مساءً - دخول المزرعة والاستمتاع بفقرات الأمسية في أجواء الطبيعة",
          "٥ مساءً - مسيرة يوم التأسيس",
          "٦:٣٠ – ٨:٣٠ مساءً - دخول المزرعة والاستمتاع بفقرات الأمسية في أجواء الطبيعة",
          "كل نصف ساعة عرض لون",
          "فرقة استعراضية شعبية رجال (٧ الوان)",
          "فرقة شعبية نسائية",
          "ضيافة شعبية و توزيعات يوم التأسيس",
          "ركوب خيل او جمل",
          "مشروب"
        ],
        additionalServices: [
          "اكلات شعبية",
          "وجبات عشاء من مطبخ المزرعة",
          "فشار, بليلة, ايس كريم",
          "مشروبات مختصة"
        ],
        importantNotes: [
          "الالتزام بالزي الرسمي السعودي",
          "الحضور في المعاد"
        ],
        image: "/trips/egyptian.jpg"
      }
    },
    "2": {
      en: {
        title: "Jeddah Winter",
        date: "January 15, 2024 – 4:00 PM",
        groupSize: "25 persons",
        location: "Jeddah, Corniche",
        duration: "2 days",
        category: "Winter Activities",
        schedule: [
          "Day 1: Winter activities and night events",
          "Day 2: Marine atmosphere and entertainment"
        ],
        additionalServices: [
          "Winter gear rental",
          "Hot beverages",
          "Traditional foods"
        ],
        importantNotes: [
          "Warm clothing recommended",
          "Swimming gear required"
        ],
        image: "/trips/jeddah.jpg"
      },
      ar: {
        title: "شتوية جدة",
        date: "١٥ يناير ٢٠٢٤ – ٤ مساءً",
        groupSize: "٢٥ شخص",
        location: "جدة, الكورنيش",
        duration: "٢ يوم",
        category: "أنشطة شتوية",
        schedule: [
          "اليوم الأول: أنشطة شتوية وسهرات ليلية",
          "اليوم الثاني: أجواء بحرية وترفيه"
        ],
        additionalServices: [
          "تأجير معدات شتوية",
          "مشروبات ساخنة",
          "أطعمة تقليدية"
        ],
        importantNotes: [
          "يوصى بملابس دافئة",
          "معدات السباحة مطلوبة"
        ],
        image: "/trips/jeddah.jpg"
      }
    }
    // Add more trips as needed
  };

  const safeLang = lang && ['ar', 'en'].includes(lang) ? lang : 'ar';
  const isRTL = safeLang === 'ar';
  
  // Get trip data based on ID, fallback to first trip if not found
  const trip = tripData[tripId]?.[safeLang] || tripData["1"][safeLang];

  const goBack = () => {
    router.back();
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="trip-details-page">
      {/* Header */}
      <div className="trip-header">
        <div className="container">
          <button onClick={goBack} className="back-btn">
            <FaArrowLeft className={isRTL ? "ms-2" : "me-2"} />
            {isRTL ? "العودة" : "Back"}
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="trip-hero-image">
        <img src={trip.image} alt={trip.title} />
        <div className="hero-overlay">
          <div className="container">
            <h1 className="trip-title">{trip.title}</h1>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="container py-5">
        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            {/* Basic Info Cards */}
            <div className="row g-3 mb-5">
              <div className="col-md-6 col-lg-3">
                <div className="info-card">
                  <FaCalendar className="info-icon" />
                  <div className="info-content">
                    <h6>{isRTL ? "التوقيت" : "Date & Time"}</h6>
                    <p>{trip.date}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="info-card">
                  <FaUsers className="info-icon" />
                  <div className="info-content">
                    <h6>{isRTL ? "عدد المجموعة" : "Group Size"}</h6>
                    <p>{trip.groupSize}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="info-card">
                  <FaMapMarkerAlt className="info-icon" />
                  <div className="info-content">
                    <h6>{isRTL ? "موقع الرحلة" : "Trip Location"}</h6>
                    <p>{trip.location}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="info-card">
                  <FaClock className="info-icon" />
                  <div className="info-content">
                    <h6>{isRTL ? "مدة الرحلة" : "Trip Duration"}</h6>
                    <p>{trip.duration}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="category-section mb-4">
              <FaTag className="category-icon" />
              <span className="category-text">{trip.category}</span>
            </div>

            {/* Schedule */}
            <div className="section-card mb-4">
              <h3 className="section-title">
                {isRTL ? "جدول الرحلة" : "Trip Schedule"}
              </h3>
              <ul className="schedule-list">
                {trip.schedule.map((item, index) => (
                  <li key={index} className="schedule-item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Services */}
            <div className="section-card mb-4">
              <h3 className="section-title">
                {isRTL ? "خدمات إضافية" : "Additional Services"}
              </h3>
              <ul className="services-list">
                {trip.additionalServices.map((service, index) => (
                  <li key={index} className="service-item">
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Notes */}
            <div className="section-card">
              <h3 className="section-title text-warning">
                {isRTL ? "ملاحظات هامة" : "Important Notes"}
              </h3>
              <ul className="notes-list">
                {trip.importantNotes.map((note, index) => (
                  <li key={index} className="note-item">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="col-lg-4">
            <div className="booking-card">
              <h4 className="booking-title">
                {isRTL ? "احجز رحلتك" : "Book Your Trip"}
              </h4>
              <div className="price-section">
                <span className="price-label">
                  {isRTL ? "السعر:" : "Price:"}
                </span>
                <span className="price-amount">
                  {isRTL ? "٣٥٠ ر.س" : "350 SAR"}
                </span>
              </div>
              <button
                className="book-btn"
                onClick={() => openBookingOrAuth({ title: trip.title, amount: 350, slug: tripId })}
              >
                {isRTL ? "احجز الآن" : "Book Now"}
              </button>
              <div className="booking-info">
                <p>
                  {isRTL 
                    ? "للاستفسارات: ٠٥٠١٢٣٤٥٦٧" 
                    : "For inquiries: 0501234567"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .trip-details-page {
          background: #f8f9fa;
          min-height: 100vh;
          font-family: 'Tajawal', sans-serif;
        }

        .trip-header {
          background: white;
          padding: 1rem 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .back-btn {
          background: #8a7779;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          display: flex;
          align-items: center;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: #a89294;
          transform: translateY(-2px);
        }

        .trip-hero-image {
          position: relative;
          height: 400px;
          overflow: hidden;
        }

        .trip-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7));
          display: flex;
          align-items: flex-end;
          padding-bottom: 2rem;
        }

        .trip-title {
          color: white;
          font-size: 3rem;
          font-weight: 800;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .info-card {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          height: 100%;
        }

        .info-icon {
          color: #8a7779;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .info-content h6 {
          color: #2c3e50;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .info-content p {
          color: #5d6d7e;
          margin: 0;
          font-weight: 600;
        }

        .category-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(45deg, #8a7779, #a89294);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          width: fit-content;
          font-weight: 600;
        }

        .section-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          margin-bottom: 1.5rem;
        }

        .section-title {
          color: #2c3e50;
          font-weight: 700;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .schedule-list, .services-list, .notes-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .schedule-item, .service-item, .note-item {
          padding: 0.75rem 0;
          border-bottom: 1px solid #ecf0f1;
          color: #5d6d7e;
          font-weight: 500;
        }

        .schedule-item:last-child, .service-item:last-child, .note-item:last-child {
          border-bottom: none;
        }

        .notes-list .note-item {
          color: #e74c3c;
          font-weight: 600;
        }

        .booking-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          position: sticky;
          top: 100px;
        }

        .booking-title {
          color: #2c3e50;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .price-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .price-label {
          color: #5d6d7e;
          font-weight: 600;
        }

        .price-amount {
          color: #8a7779;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .book-btn {
          background: linear-gradient(45deg, #8a7779, #a89294);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 25px;
          font-weight: 700;
          font-size: 1.1rem;
          width: 100%;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }

        .book-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(138, 119, 121, 0.4);
        }

        .booking-info {
          text-align: center;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .trip-title {
            font-size: 2rem;
          }
          
          .trip-hero-image {
            height: 300px;
          }
          
          .section-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}