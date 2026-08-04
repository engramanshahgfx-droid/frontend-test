"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Globe, ArrowRight } from "lucide-react";
import { API_URL } from "@/lib/api";
import HeaderBanners from "@/components/HeaderBanners";

export default function DestinationsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = params?.lang || "en";

  const initialRegion = searchParams.get("region") || "all";
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const labels = {
    en: {
      title: "Our International Destinations",
      subtitle: "Browse our hand-picked destinations grouped by country and find your next adventure.",
      viewTours: "View Trips",
      noDestinations: "No destinations found matching your selection.",
      all: "All Regions",
      europe: "Europe",
      asia: "Asia",
      africa: "Africa",
      australia: "Australia",
    },
    ar: {
      title: "وجهاتنا الدولية",
      subtitle: "تصفح وجهاتنا المختارة بعناية والمصنفة حسب الدول واعثر على مغامرتك القادمة.",
      viewTours: "عرض الرحلات",
      noDestinations: "لا توجد وجهات مطابقة لاختيارك حالياً.",
      all: "جميع المناطق",
      europe: "أوروبا",
      asia: "آسيا",
      africa: "أفريقيا",
      australia: "أستراليا ونيوزيلندا",
    }
  };

  const t = labels[lang] || labels.en;

  const regions = [
    { key: "all", label: t.all },
    { key: "europe", label: t.europe },
    { key: "asia", label: t.asia },
    { key: "africa", label: t.africa },
    { key: "australia", label: t.australia }
  ];

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    const regionParam = searchParams.get("region");
    if (regionParam) {
      setSelectedRegion(regionParam);
    }
  }, [searchParams]);

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${API_URL}/tourism-destinations`);
      const data = await response.json();
      if (data.success) {
        setDestinations(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setError("Failed to load destinations");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return "/placeholder.png";
    if (/^https?:\/\//.test(img)) return img;
    const backendBase = API_URL.replace(/\/api\/?$/, "");
    if (img.startsWith("/")) return `${backendBase}${img}`;
    if (img.startsWith("tourism/")) {
      return `${backendBase}/storage/${img}`;
    }
    return `${backendBase}/storage/tourism/${img}`;
  };

  const slugify = (text) => {
    return text
      ?.toString()
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s+/g, "-")
      ?.replace(/[^\w\-]+/g, "")
      ?.replace(/\-\-+/g, "-");
  };

  const handleCountryClick = (countryNameEn) => {
    const countrySlug = slugify(countryNameEn);
    router.push(`/${lang}/destinations/${countrySlug}`);
  };

  // 1. Filter by Region
  const filteredTours = destinations.filter((tour) => {
    if (selectedRegion === "all") return true;
    return tour.region?.toLowerCase() === selectedRegion.toLowerCase();
  });

  // 2. Group by Country (location_en / location_ar)
  const groupedByCountry = {};
  filteredTours.forEach((tour) => {
    const rawCountryNameEn = tour.location_en ? tour.location_en.trim() : "Other";
    const rawCountryNameAr = tour.location_ar ? tour.location_ar.trim() : "أخرى";

    // Lowercase key to avoid duplicate groups (e.g. England vs england vs England )
    const key = rawCountryNameEn.toLowerCase();

    if (!groupedByCountry[key]) {
      groupedByCountry[key] = {
        nameEn: rawCountryNameEn,
        nameAr: rawCountryNameAr,
        region: tour.region,
        tours: [],
        image: tour.image_url || tour.image
      };
    }
    groupedByCountry[key].tours.push(tour);
  });

  const countriesList = Object.values(groupedByCountry);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-column" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-secondary">Loading destinations...</p>
      </div>
    );
  }

  return (
    <div className="destinations-page-wrapper" style={{
      minHeight: "100vh",
      background: "#FAF6F0",
      padding: "115px 0px 80px 0px"
    }}>
      <style jsx>{`
        @media (max-width: 768px) {
          .destinations-page-wrapper {
            padding: 105px 0px 60px 0px !important;
          }
        }
      `}</style>
      <div className="container" style={{ maxWidth: "1200px" }}>
        <HeaderBanners lang={lang} page="destinations" index={2} />
        {/* Page Header */}
        <div className="text-center mb-4" style={{ marginTop: "10px" }}>
          <h1 className="fw-bold mb-3" style={{ fontSize: "2.5rem", color: "#1C0052" }}>
            {t.title}
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            {t.subtitle}
          </p>
        </div>

        {/* Region Filters */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
          {regions.map((region) => (
            <button
              key={region.key}
              onClick={() => {
                setSelectedRegion(region.key);
                // Update URL parameter without full reload
                const newParams = new URLSearchParams(window.location.search);
                if (region.key === "all") {
                  newParams.delete("region");
                } else {
                  newParams.set("region", region.key);
                }
                router.push(`${window.location.pathname}?${newParams.toString()}`, { scroll: false });
              }}
              style={{
                background: selectedRegion === region.key ? "#E85D1F" : "#FFFFFF",
                color: selectedRegion === region.key ? "#FFFFFF" : "#9d85ceff",
                border: selectedRegion === region.key ? "none" : "1px solid rgba(28, 0, 82, 0.15)",
                boxShadow: selectedRegion === region.key ? "0 4px 15px rgba(232, 93, 31, 0.25)" : "none",
                borderRadius: "10px",
                padding: "10px 24px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FFC60B";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 198, 11, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = selectedRegion === region.key ? "#E85D1F" : "#FFFFFF";
                e.currentTarget.style.color = selectedRegion === region.key ? "#FFFFFF" : "#E85D1F";
                e.currentTarget.style.boxShadow = selectedRegion === region.key ? "0 4px 15px rgba(232, 93, 31, 0.25)" : "none";
              }}
            >
              {region.label}
            </button>
          ))}
        </div>

        {/* Countries Grid */}
        {countriesList.length === 0 ? (
          <div className="text-center py-5">
            <Globe className="text-muted mb-3" size={48} />
            <p className="text-secondary fs-5">{t.noDestinations}</p>
          </div>
        ) : (
          <div className="row g-4">
            {countriesList.map((country) => {
              const localizedName = lang === "ar" ? country.nameAr : country.nameEn;
              return (
                <div key={country.nameEn} className="col-12 col-md-6 col-lg-4">
                  <motion.div
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="card h-100 border-0 shadow-sm overflow-hidden cursor-pointer"
                    onClick={() => handleCountryClick(country.nameEn)}
                    style={{ cursor: "pointer", borderRadius: "16px", border: "1px solid rgba(28, 0, 82, 0.08)", boxShadow: "0 10px 30px rgba(28, 0, 82, 0.08)" }}
                  >
                    <div className="position-relative" style={{ height: "280px", borderRadius: "16px", overflow: "hidden" }}>
                      <img
                        src={getImageUrl(country.image)}
                        alt={localizedName}
                        className="w-100 h-100 object-fit-cover"
                        style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-4"
                        style={{
                          background: "linear-gradient(to top, rgba(28, 0, 82, 0.92) 0%, rgba(28, 0, 82, 0.45) 45%, rgba(28, 0, 82, 0.1) 75%, transparent 100%)",
                          pointerEvents: "none",
                        }}
                      >
                        <span className="badge align-self-start mb-2 px-3 py-2 fw-bold text-uppercase" style={{ fontSize: "0.75rem", background: "#E85D1F", color: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(232, 93, 31, 0.4)" }}>
                          {country.region}
                        </span>
                        <h3 className="text-white fw-bold m-0" style={{ fontSize: "1.5rem", textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)" }}>
                          {localizedName}
                        </h3>
                        <div className="d-flex align-items-center justify-content-between text-white-50 mt-2">
                          <span style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.85)", fontWeight: "500" }}>
                            {country.tours.length} {country.tours.length === 1 ? "Trip" : "Trips"}
                          </span>
                          <span className="d-flex align-items-center gap-1 fw-semibold" style={{ fontSize: "0.9rem", color: "#FFC60B", textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
                            {t.viewTours} <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
