"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FaGlobe,
  FaHotel,
  FaPlane,
  FaTag,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaStar,
  FaClock,
  FaWhatsapp,
} from "react-icons/fa";
import BookingModal from "../../components/IslandDestinations/BookingModal"; // Import the modal component
import { API_URL } from "../../lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function InternationalContent({ lang }) {
  const [activeTab, setActiveTab] = useState("flights");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingData, setSelectedBookingData] = useState({
    type: "flight",
    destination: null,
  });

  // State for dynamic data from API
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transparent 1x1 data URI used to avoid 404 when image is invalid/missing
  const TRANSPARENT_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
  
  // Refs for scrolling to sections
  const flightsSectionRef = useRef(null);
  const hotelsSectionRef = useRef(null);
  const offersSectionRef = useRef(null);
  const destinationsSectionRef = useRef(null);

  // Swiper instances (used to control slides programmatically)
  const flightsSwiperRef = useRef(null);
  const hotelsSwiperRef = useRef(null);
  const packagesSwiperRef = useRef(null);
  const destinationsSwiperRef = useRef(null);

  // Static content for UI labels (fallback)
  const content = {
    en: {
      pageTitle: "International Travel",
      pageSubtitle: "Explore the world with our premium international travel services",
      searchTitle: "Book Your International Trip",
      searchSubtitle: "Find the best deals for flights, hotels, and packages worldwide",
      flightTab: "Flights",
      hotelTab: "Hotels",
      offersTab: "Packages",
      popularDestinationsTab: "Popular Destinations",
      popularDestinations: "Popular Destinations",
      featuredPackages: "Featured International Packages",
      whyChooseUs: "Why Choose Our International Services",
      travelTips: "International Travel Tips",
      bookNow: "Reservation",
      viewDetails: "View Details",
      contactUs: "Contact Us",
      needHelp: "Need Help?",
      contactSupport: "Contact our support team",
      features: [
        {
          icon: <FaGlobe />,
          title: "Global Network",
          description: "Access to 500+ airlines and 200,000+ hotels worldwide"
        },
        {
          icon: <FaCheckCircle />,
          title: "Best Price Guarantee",
          description: "We guarantee the best prices for all our international packages"
        },
        {
          icon: <FaStar />,
          title: "Premium Support",
          description: "24/7 customer support in multiple languages"
        },
        {
          icon: <FaStar />,
          title: "Group Discounts",
          description: "Special discounts for family and group bookings"
        }
      ],
      tips: [
        "Check passport validity (minimum 6 months)",
        "Research visa requirements for your destination",
        "Purchase comprehensive travel insurance",
        "Notify your bank about international travel",
        "Download offline maps and translation apps",
        "Learn basic local phrases"
      ]
    },

    ar: {
      pageTitle: "السفر الدولي",
      pageSubtitle: "استكشف العالم مع خدمات السفر الدولية المميزة لدينا",
      searchTitle: "احجز رحلتك الدولية",
      searchSubtitle: "ابحث عن أفضل العروض للطيران، الفنادق، والحزم حول العالم",
      flightTab: "الطيران",
      hotelTab: "الفنادق",
      offersTab: "الباقات ",
      popularDestinationsTab: "الوجهات المفضلة",
      popularDestinations: "الوجهات المفضلة",
      featuredPackages: "الحزم الدولية المميزة",
      whyChooseUs: "لماذا تختار خدماتنا الدولية",
      travelTips: "نصائح السفر الدولي",
      bookNow: "حجز",
      viewDetails: "عرض التفاصيل",
      contactUs: "تواصل معنا",
      needHelp: "هل تحتاج مساعدة؟",
      contactSupport: "تواصل مع فريق الدعم لدينا",
      features: [
        {
          icon: <FaGlobe />,
          title: "شبكة عالمية",
          description: "الوصول إلى ٥٠٠+ شركة طيران و٢٠٠,٠٠٠+ فندق حول العالم"
        },
        {
          icon: <FaCheckCircle />,
          title: "ضمان أفضل سعر",
          description: "نضمن أفضل الأسعار لجميع حزمنا الدولية"
        },
        {
          icon: <FaStar />,
          title: "دعم مميز",
          description: "دعم العملاء ٢٤/٧ بلغات متعددة"
        },
        {
          icon: <FaStar />,
          title: "خصومات المجموعات",
          description: "خصومات خاصة لحجوزات العائلات والمجموعات"
        }
      ],
      tips: [
        "تحقق من صلاحية الجواز (الحد الأدنى ٦ أشهر)",
        "ابحث عن متطلبات التأشيرة لوجهتك",
        "اشترِ تأمين سفر شامل",
        "أبلغ بنكك عن السفر الدولي",
        "حمّل خرائط وتطبيقات ترجمة دون اتصال",
        "تعلّم بعض العبارات المحلية الأساسية"
      ]
    }
  };

  const t = content[lang] || content.ar;
  const isRTL = lang === "ar";

  // Slider state
  const [currentFlightIndex, setCurrentFlightIndex] = useState(0);
  const [currentHotelIndex, setCurrentHotelIndex] = useState(0);
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);

  // Visible count for responsive slider (desktop:4, tablet:2, mobile:1)
  const [visibleCount, setVisibleCount] = useState(4);

  // Refs for slider containers (used to compute pixel transform)
  const flightsContainerRef = useRef(null);
  const hotelsContainerRef = useRef(null);
  const packagesContainerRef = useRef(null);
  const destinationsContainerRef = useRef(null);

  // Re-render trigger for resize measurements
  const [measureKey, setMeasureKey] = useState(0);
  const GAP = 16; // px

  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      if (w >= 1200) setVisibleCount(4);
      else if (w >= 768) setVisibleCount(2);
      else setVisibleCount(1);
      setMeasureKey(k => k + 1);
      console.debug('[slider] viewport', w, 'visibleCount', visibleCount);
    };

    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  const getMaxIndex = (length) => Math.max(0, length - visibleCount);

  const logAndSet = (setter, updater, type) => {
    setter(prev => {
      const next = updater(prev);
      console.debug(`[slider] ${type} index:`, prev, '->', next);
      return next;
    });
  };

  const nextSlide = (type, length) => {
    const maxIdx = getMaxIndex(length);
    const small = (length || 0) <= visibleCount;
    switch (type) {
      case 'flights':
        logAndSet(setCurrentFlightIndex, (i) => {
          if (small && length > 1) return (i + 1) % length; // advance by 1 when items <= visibleCount
          return i >= maxIdx ? 0 : Math.min(i + visibleCount, maxIdx);
        }, 'flights');
        break;
      case 'hotels':
        logAndSet(setCurrentHotelIndex, (i) => {
          if (small && length > 1) return (i + 1) % length;
          return i >= maxIdx ? 0 : Math.min(i + visibleCount, maxIdx);
        }, 'hotels');
        break;
      case 'packages':
        logAndSet(setCurrentPackageIndex, (i) => {
          if (small && length > 1) return (i + 1) % length;
          return i >= maxIdx ? 0 : Math.min(i + visibleCount, maxIdx);
        }, 'packages');
        break;
      case 'destinations':
        logAndSet(setCurrentDestinationIndex, (i) => {
          if (small && length > 1) return (i + 1) % length;
          return i >= maxIdx ? 0 : Math.min(i + visibleCount, maxIdx);
        }, 'destinations');
        break;
      default:
    }
  };

  const prevSlide = (type, length) => {
    const maxIdx = getMaxIndex(length);
    const small = (length || 0) <= visibleCount;
    switch (type) {
      case 'flights':
        logAndSet(setCurrentFlightIndex, (i) => {
          if (small && length > 1) return (i - 1 + length) % length;
          return i <= 0 ? maxIdx : Math.max(i - visibleCount, 0);
        }, 'flights');
        break;
      case 'hotels':
        logAndSet(setCurrentHotelIndex, (i) => {
          if (small && length > 1) return (i - 1 + length) % length;
          return i <= 0 ? maxIdx : Math.max(i - visibleCount, 0);
        }, 'hotels');
        break;
      case 'packages':
        logAndSet(setCurrentPackageIndex, (i) => {
          if (small && length > 1) return (i - 1 + length) % length;
          return i <= 0 ? maxIdx : Math.max(i - visibleCount, 0);
        }, 'packages');
        break;
      case 'destinations':
        logAndSet(setCurrentDestinationIndex, (i) => {
          if (small && length > 1) return (i - 1 + length) % length;
          return i <= 0 ? maxIdx : Math.max(i - visibleCount, 0);
        }, 'destinations');
        break;
      default:
    }
  };

  const goToSlide = (type, pageIndex, length) => {
    const idx = pageIndex * visibleCount;
    const maxIdx = getMaxIndex(length);
    const clamped = Math.min(idx, maxIdx);
    switch (type) {
      case 'flights': setCurrentFlightIndex(clamped); break;
      case 'hotels': setCurrentHotelIndex(clamped); break;
      case 'packages': setCurrentPackageIndex(clamped); break;
      case 'destinations': setCurrentDestinationIndex(clamped); break;
      default: break;
    }

    // trigger re-measure to avoid stale widths after jumping
    setMeasureKey(k => k + 1);
  };

  // Helpers to compute measured widths/transforms for sliders
  const getContainerRef = (type) => {
    switch (type) {
      case 'flights': return flightsContainerRef.current;
      case 'hotels': return hotelsContainerRef.current;
      case 'packages': return packagesContainerRef.current;
      case 'destinations': return destinationsContainerRef.current;
      default: return null;
    }
  };

  const getSlideWidth = (type) => {
    const ref = getContainerRef(type);
    if (!ref) return null;
    const containerWidth = ref.offsetWidth || 0;
    const slideWidth = Math.floor((containerWidth - GAP * (visibleCount - 1)) / visibleCount);
    return slideWidth;
  };

  // Compute simple percent-based translate with GPU acceleration
  const computeTranslate = (type, index) => {
    const percent = (index * 100) / visibleCount;
    console.log(`[SLIDER] ${type} -> index=${index}, visibleCount=${visibleCount}, percent=${percent}%`);
    return `translate3d(-${percent}%, 0, 0)`;
  };

  // Helper to parse translate value from style transform. Returns percent (negative means left).
  // Accepts an optional containerWidth (px) to convert px -> percent when needed.
  const parseTranslate = (transform, containerWidth) => {
    if (!transform) return 0;
    // Try percent first: translate3d(-25%, 0, 0)
    let m = /translate3d\((-?\d+\.?\d*)%/.exec(transform);
    if (m) return parseFloat(m[1]);
    // Fallback: px values (translateX( -200px ) or translate3d(-200px,...))
    m = /translateX\((-?\d+\.?\d*)px\)/.exec(transform) || /translate3d\((-?\d+\.?\d*)px/.exec(transform);
    if (m) {
      const px = parseFloat(m[1]);
      if (containerWidth && containerWidth > 0) {
        return (px / containerWidth) * 100; // convert px -> percent
      }
      // If no container width available return px value as percent-like number (not ideal)
      return px;
    }
    return 0;
  }; 

  // Swiper.js will handle autoplay, looping and user interactions (touch/drag) natively.
  // Keep slide refs for measurement only where needed.
  const flightsSlidesRef = useRef(null);
  const hotelsSlidesRef = useRef(null);
  const packagesSlidesRef = useRef(null);
  const destinationsSlidesRef = useRef(null);


  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Static data from seeders - complete with real travel data
      // const staticFlights = [
      //   { 
      //     id: 1, 
      //     airline_en: 'Emirates', 
      //     airline_ar: 'الإمارات', 
      //     route_en: 'Dubai - London', 
      //     route_ar: 'دبي - لندن', 
      //     departure_time: '06:00 AM', 
      //     arrival_time: '02:30 PM', 
      //     duration: '7h 30m', 
      //     stops_en: 'Non-stop', 
      //     stops_ar: 'بدون توقف'
      //   },
      //   { 
      //     id: 2, 
      //     airline_en: 'Qatar Airways', 
      //     airline_ar: 'الخطوط الجوية القطرية', 
      //     route_en: 'Doha - Bangkok', 
      //     route_ar: 'الدوحة - بانكوك', 
      //     departure_time: '02:00 PM', 
      //     arrival_time: '11:30 PM', 
      //     duration: '5h 30m', 
      //     stops_en: 'Non-stop', 
      //     stops_ar: 'بدون توقف'
      //   },
      //   { 
      //     id: 3, 
      //     airline_en: 'British Airways', 
      //     airline_ar: 'الخطوط الجوية البريطانية', 
      //     route_en: 'London - New York', 
      //     route_ar: 'لندن - نيويورك', 
      //     departure_time: '10:00 AM', 
      //     arrival_time: '01:00 PM', 
      //     duration: '8h 15m', 
      //     stops_en: 'Non-stop', 
      //     stops_ar: 'بدون توقف'
      //   },
      //   { 
      //     id: 4, 
      //     airline_en: 'Singapore Airlines', 
      //     airline_ar: 'الخطوط الجوية السنغافورية', 
      //     route_en: 'Singapore - Tokyo', 
      //     route_ar: 'سنغافورة - طوكيو', 
      //     departure_time: '11:00 PM', 
      //     arrival_time: '07:00 AM+1', 
      //     duration: '6h 30m', 
      //     stops_en: 'Non-stop', 
      //     stops_ar: 'بدون توقف'
      //   }
      // ];

      // const staticHotels = [
      //   { 
      //     id: 1, 
      //     name_en: 'Burj Al Arab', 
      //     name_ar: 'برج العرب', 
      //     location_en: 'Dubai, UAE', 
      //     location_ar: 'دبي، الإمارات', 
      //     rating: 5, 
      //     image: '/hotels/burj-al-arab.jpg',
      //     amenities_en: '["WiFi","Spa","Pool","Gym"]', 
      //     amenities_ar: '["واي فاي","سبا","مسبح","صالة رياضة"]'
      //   },
      //   { 
      //     id: 2, 
      //     name_en: 'Marina Bay Sands', 
      //     name_ar: 'مارينا باي ساندز', 
      //     location_en: 'Singapore', 
      //     location_ar: 'سنغافورة', 
      //     rating: 5, 
      //     image: '/offers/Singapore.png',
      //     amenities_en: '["WiFi","Rooftop Pool","Fine Dining"]', 
      //     amenities_ar: '["واي فاي","حمام السقف","مطاعم فاخرة"]'
      //   },
      //   { 
      //     id: 3, 
      //     name_en: 'The Plaza New York', 
      //     name_ar: 'ذا بلازا نيويورك', 
      //     location_en: 'New York, USA', 
      //     location_ar: 'نيويورك، الولايات المتحدة', 
      //     rating: 5, 
      //     image: '/brand.jpg',
      //     amenities_en: '["WiFi","Restaurant","Concierge"]', 
      //     amenities_ar: '["واي فاي","مطعم","خدمة كونسيرج"]'
      //   },
      //   { 
      //     id: 4, 
      //     name_en: 'Ritz Paris', 
      //     name_ar: 'ريتز باريس', 
      //     location_en: 'Paris, France', 
      //     location_ar: 'باريس، فرنسا', 
      //     rating: 5, 
      //     image: '/vision.jpg',
      //     amenities_en: '["WiFi","Spa","Michelin Star Dining"]', 
      //     amenities_ar: '["واي فاي","سبا","مطعم نجم ميشلان"]'
      //   }
      // ];

      // const staticPackages = [
      //   {
      //     id: 1,
      //     title_en: 'Trip to AlUla',
      //     title_ar: 'رحلة إلى العلا',
      //     description_en: 'Join us on a trip to AlUla, where you can discover breathtaking natural landscapes and historical landmarks like Hegra (Mada\'in Saleh).',
      //     description_ar: 'انضم إلينا في رحلة إلى العلا، حيث يمكنك اكتشاف المناظر الطبيعية الخلابة والمعالم التاريخية.',
      //     type_en: 'Heritage Tour',
      //     type_ar: 'جولة تراثية',
      //     image: '/cities/alula.jpg',
      //     duration: '3 Days / 2 Nights'
      //   },
      //   {
      //     id: 2,
      //     title_en: 'Charming Sea Cruise in Jeddah',
      //     title_ar: 'رحلة بحرية ساحرة في جدة',
      //     description_en: 'Relax on a sea cruise to Jeddah and enjoy beautiful marine views and beach activities.',
      //     description_ar: 'استمتع برحلة بحرية إلى جدة واستمتع بأجمل المناظر البحرية وأنشطة الشاطئ.',
      //     type_en: 'Beach Cruise',
      //     type_ar: 'رحلة بحرية شاطئية',
      //     image: '/offers/jeddah-sea.png',
      //     duration: '2 Days / 1 Night'
      //   },
      //   {
      //     id: 3,
      //     title_en: 'Dubai Luxury Escape',
      //     title_ar: 'هروب فاخر إلى دبي',
      //     description_en: '5-star experience with shopping and desert safari',
      //     description_ar: 'تجربة من فئة الخمس نجوم مع التسوق والسفاري',
      //     type_en: 'Luxury',
      //     type_ar: 'فاخرة',
      //     image: '/desert2.mp4',
      //     duration: '5 Days / 4 Nights'
      //   },
      //   {
      //     id: 4,
      //     title_en: 'Paris Romance Package',
      //     title_ar: 'حزمة باريس الرومانسية',
      //     description_en: 'Experience the magic of Paris with guided tours and fine dining',
      //     description_ar: 'اختبر سحر باريس مع الجولات الموجهة والعشاء الفاخر',
      //     type_en: 'Romance',
      //     type_ar: 'رومانسية',
      //     image: '/vision.webp',
      //     duration: '5 Days / 4 Nights'
      //   },
      //   {
      //     id: 5,
      //     title_en: 'Singapore City Break',
      //     title_ar: 'عطلة مدينة سنغافورة',
      //     description_en: 'Modern city-state with amazing food and attractions',
      //     description_ar: 'دولة مدينة حديثة مع طعام رائع ومعالم سياحية',
      //     type_en: 'City Break',
      //     type_ar: 'عطلة مدينة',
      //     image: '/offers/Singapore.png',
      //     duration: '4 Days / 3 Nights'
      //   },
      //   {
      //     id: 6,
      //     title_en: 'Bali Paradise Package',
      //     title_ar: 'حزمة جنة بالي',
      //     description_en: 'Tropical paradise with beaches, temples, and culture',
      //     description_ar: 'جنة استوائية مع شواطئ ومعابد وثقافة',
      //     type_en: 'Beach & Culture',
      //     type_ar: 'شاطئ وثقافة',
      //     image: '/offers/Indonesia.png',
      //     duration: '6 Days / 5 Nights'
      //   }
      // ];

      // const staticDestinations = [
      //   { 
      //     id: 1, 
      //     name_en: 'Bali, Indonesia', 
      //     name_ar: 'بالي، إندونيسيا', 
      //     description_en: 'Tropical island paradise with pristine beaches and temples', 
      //     description_ar: 'جنة جزيرة استوائية مع شواطئ خالية ومعابد', 
      //     image: '/offers/Indonesia.png'
      //   },
      //   { 
      //     id: 2, 
      //     name_en: 'Tokyo, Japan', 
      //     name_ar: 'طوكيو، اليابان', 
      //     description_en: 'Modern metropolis with ancient traditions and culture', 
      //     description_ar: 'عاصمة حديثة مع تقاليد قديمة وثقافة غنية', 
      //     image: '/offers/Singapore.png'
      //   },
      //   { 
      //     id: 3, 
      //     name_en: 'Paris, France', 
      //     name_ar: 'باريس، فرنسا', 
      //     description_en: 'The City of Light with iconic landmarks and romance', 
      //     description_ar: 'مدينة الأضواء مع معالم أيقونية ورومانسية', 
      //     image: '/vision.webp'
      //   },
      //   { 
      //     id: 4, 
      //     name_en: 'New York, USA', 
      //     name_ar: 'نيويورك، الولايات المتحدة', 
      //     description_en: 'The city that never sleeps with world-class attractions', 
      //     description_ar: 'المدينة التي لا تنام مع معالم من الدرجة العالمية', 
      //     image: '/brand.jpg'
      //   },
      //   { 
      //     id: 5, 
      //     name_en: 'Dubai, UAE', 
      //     name_ar: 'دبي، الإمارات', 
      //     description_en: 'Luxury destination with stunning architecture and shopping', 
      //     description_ar: 'وجهة فاخرة مع عمارة مذهلة والتسوق العالمي', 
      //     image: '/offers/jeddah-sea.png'
      //   },
      //   { 
      //     id: 6, 
      //     name_en: 'Maldives', 
      //     name_ar: 'جزر المالديف', 
      //     description_en: 'Overwater bungalows and crystal clear waters', 
      //     description_ar: 'أكواخ فوق الماء ومياه صافية جداً', 
      //     image: '/offers/Maldives.jpg'
      //   }
      // ];

      try {
        console.debug('[InternationalContent] Fetching data from backend API...');

        // Fetch flights, hotels, packages, and destinations from backend API in parallel
        const [flightsRes, hotelsRes, packagesRes, destinationsRes] = await Promise.all([
          fetch(`${API_URL}/international/flights`).catch(() => null),
          fetch(`${API_URL}/international/hotels`).catch(() => null),
          fetch(`${API_URL}/international/packages`).catch(() => null),
          fetch(`${API_URL}/international/destinations`).catch(() => null)
        ]);

        // Process flights response
        if (flightsRes && flightsRes.ok) {
          const flightsData = await flightsRes.json();
          const apiFlights = flightsData.data || flightsData;
          if (Array.isArray(apiFlights) && apiFlights.length > 0) {
            console.log('[InternationalContent] ✓ Flights from API:', apiFlights.length, 'items');
            setFlights(apiFlights);
          } else {
            console.log('[InternationalContent] Using static flights data (API returned empty)');
            setFlights(staticFlights);
          }
        } else {
          console.log('[InternationalContent] Using static flights data (API unavailable)');
          setFlights(staticFlights);
        }

        // Process hotels response
        if (hotelsRes && hotelsRes.ok) {
          const hotelsData = await hotelsRes.json();
          const apiHotels = hotelsData.data || hotelsData;
          if (Array.isArray(apiHotels) && apiHotels.length > 0) {
            console.log('[InternationalContent] ✓ Hotels from API:', apiHotels.length, 'items');
            setHotels(apiHotels);
          } else {
            console.log('[InternationalContent] Using static hotels data (API returned empty)');
            setHotels(staticHotels);
          }
        } else {
          console.log('[InternationalContent] Using static hotels data (API unavailable)');
          setHotels(staticHotels);
        }

        // Process packages response
        if (packagesRes && packagesRes.ok) {
          const packagesData = await packagesRes.json();
          const apiPackages = packagesData.data || packagesData;
          if (Array.isArray(apiPackages) && apiPackages.length > 0) {
            console.log('[InternationalContent] ✓ Packages from API:', apiPackages.length, 'items');
            setPackages(apiPackages);
          } else {
            console.log('[InternationalContent] Using static packages data (API returned empty)');
            setPackages(staticPackages);
          }
        } else {
          console.log('[InternationalContent] Using static packages data (API unavailable)');
          setPackages(staticPackages);
        }

        // Process destinations response
        if (destinationsRes && destinationsRes.ok) {
          const destinationsData = await destinationsRes.json();
          const apiDestinations = destinationsData.data || destinationsData;
          if (Array.isArray(apiDestinations) && apiDestinations.length > 0) {
            console.log('[InternationalContent] ✓ Destinations from API:', apiDestinations.length, 'items');
            setDestinations(apiDestinations);
          } else {
            console.log('[InternationalContent] Using static destinations data (API returned empty)');
            setDestinations(staticDestinations);
          }
        } else {
          console.log('[InternationalContent] Using static destinations data (API unavailable)');
          setDestinations(staticDestinations);
        }

        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching international data:', err);
        // Fallback to static data on error
        setFlights(staticFlights);
        setHotels(staticHotels);
        setPackages(staticPackages);
        setDestinations(staticDestinations);
        setError(null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Re-measure when data or visible count changes so transforms are recalculated
  useEffect(() => {
    setMeasureKey(k => k + 1);

    // clamp current indices to valid ranges when length or visibleCount changes
    setCurrentFlightIndex((i) => Math.max(0, Math.min(i, getMaxIndex(flights.length))));
    setCurrentHotelIndex((i) => Math.max(0, Math.min(i, getMaxIndex(hotels.length))));
    setCurrentPackageIndex((i) => Math.max(0, Math.min(i, getMaxIndex(packages.length))));
    setCurrentDestinationIndex((i) => Math.max(0, Math.min(i, getMaxIndex(destinations.length))));

    // schedule a couple of re-measures after layout settle (images may load after render)
    const t1 = setTimeout(() => setMeasureKey(k => k + 1), 120);
    const t2 = setTimeout(() => setMeasureKey(k => k + 1), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [flights.length, hotels.length, packages.length, destinations.length, visibleCount]);

  // Re-measure when containers resize (covers image load, layout shifts)
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const elements = [
      flightsContainerRef.current,
      hotelsContainerRef.current,
      packagesContainerRef.current,
      destinationsContainerRef.current,
    ].filter(Boolean);

    const observers = elements.map((el) => {
      const ro = new ResizeObserver(() => setMeasureKey(k => k + 1));
      ro.observe(el);
      return ro;
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [measureKey]);

  // Manual pointer/drag handlers removed — Swiper handles pointer/touch gestures and momentum natively.

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#fff' }}>
        <p>Loading international travel data...</p>
      </div>
    );
  }

  // Helper functions to get localized data
  const getFlightText = (flight, field) => {
    const fieldKey = lang === "ar" ? `${field}_ar` : `${field}_en`;
    return flight[fieldKey] || "";
  };

  const getHotelText = (hotel, field) => {
    const fieldKey = lang === "ar" ? `${field}_ar` : `${field}_en`;
    return hotel[fieldKey] || "";
  };

  const getPackageText = (pkg, field) => {
    const fieldKey = lang === "ar" ? `${field}_ar` : `${field}_en`;
    return pkg[fieldKey] || "";
  };

  const getDestinationText = (destination, field) => {
    // Handle both API format (title_en/description_en) and static format (name_en/description_en)
    let fieldKey = lang === "ar" ? `${field}_ar` : `${field}_en`;
    
    // If looking for 'name' but it doesn't exist, try 'title' (API uses title_en/title_ar)
    if (field === 'name' && !destination[fieldKey]) {
      fieldKey = lang === "ar" ? 'title_ar' : 'title_en';
    }
    
    return destination[fieldKey] || "";
  };

  // Safely parse a value that may be an array or a JSON-encoded array string
  const parseList = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      // Try JSON.parse first (we store JSON strings from the API)
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // ignore parse error and fall back to comma-split
      }
      // Fallback: split comma-separated strings
      return value.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  // Handle tab click with scroll
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    // Scroll to the corresponding section
    setTimeout(() => {
      if (tab === "flights" && flightsSectionRef.current) {
        flightsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tab === "hotels" && hotelsSectionRef.current) {
        hotelsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tab === "offers" && offersSectionRef.current) {
        offersSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tab === "popular" && destinationsSectionRef.current) {
        destinationsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Handle flight booking
  const handleFlightBooking = (flight) => {
    setSelectedBookingData({
      type: "flight",
      destination: {
        title: getFlightText(flight, 'route'),
        description: `${getFlightText(flight, 'airline_en' === lang ? 'airline_en' : 'airline_ar')} - ${flight.duration} - ${getFlightText(flight, 'stops')}`,
        image: undefined,
        flightInfo: flight
      }
    });
    setIsBookingModalOpen(true);
  };

  // Handle hotel booking
  const handleHotelBooking = (hotel) => {
    setSelectedBookingData({
      type: "hotel",
      destination: {
        title: getHotelText(hotel, 'name'),
        description: getHotelText(hotel, 'location'),
        image: hotel.image || undefined,
        hotelInfo: hotel
      }
    });
    setIsBookingModalOpen(true);
  };

  // Handle package booking
  const handlePackageBooking = (pkg) => {
    setSelectedBookingData({
      type: "package",
      destination: {
        title: getPackageText(pkg, 'title'),
        description: getPackageText(pkg, 'description'),
        image: pkg.image || undefined,
        packageInfo: pkg
      }
    });
    setIsBookingModalOpen(true);
  };

  // Handle destination booking
  const handleDestinationBooking = (destination) => {
    setSelectedBookingData({
      type: "activity",
      destination: {
        title: getDestinationText(destination, 'name'),
        description: getDestinationText(destination, 'description'),
        image: destination.image || undefined,
        destinationInfo: destination
      }
    });
    setIsBookingModalOpen(true);
  };

  // Handle contact button
  const handleContactSupport = () => {
    const message = isRTL 
      ? "أحتاج مساعدة في حجز رحلة دولية" 
      : "I need help booking an international trip";
    const whatsappUrl = `https://wa.me/+966533360423?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Close booking modal
  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedBookingData({
      type: "flight",
      destination: null,
    });
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="international-page">
      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        destination={selectedBookingData.destination}
        lang={lang}
        allowedTypes={selectedBookingData.type ? [selectedBookingData.type] : null}
      />

      {/* Hero Section */}
      <section className="hero-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="hero-title">{t.pageTitle}</h1>
                <p className="hero-subtitle">{t.pageSubtitle}</p>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              {/* <FaGlobe className="hero-icon" /> */}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs Section */}
      <section className="tabs-section py-5">
        <div className="container">
          <div className="tabs-container">
            <div className="text-center mb-5">
              <h2 className="tabs-title">{t.searchTitle}</h2>
              <p className="tabs-subtitle">{t.searchSubtitle}</p>
            </div>

            {/* Tab Navigation */}
            <div className="tabs-navigation">
              <button
                className={`tab-button ${activeTab === "flights" ? "active" : ""}`}
                onClick={() => handleTabClick("flights")}
              >
                <div className="tab-icon-wrapper">
                  <FaPlane className="tab-icon-main" />
                </div>
                <span className="tab-text">{t.flightTab}</span>
                <p className="tab-description">
                  {isRTL ? "ابحث عن أفضل عروض الطيران" : "Find the best flight deals"}
                </p>
              </button>
              
              <button
                className={`tab-button ${activeTab === "hotels" ? "active" : ""}`}
                onClick={() => handleTabClick("hotels")}
              >
                <div className="tab-icon-wrapper">
                  <FaHotel className="tab-icon-main" />
                </div>
                <span className="tab-text">{t.hotelTab}</span>
                <p className="tab-description">
                  {isRTL ? "اختر من أفضل الفنادق العالمية" : "Choose from top international hotels"}
                </p>
              </button>
              
              <button
                className={`tab-button ${activeTab === "offers" ? "active" : ""}`}
                onClick={() => handleTabClick("offers")}
              >
                <div className="tab-icon-wrapper">
                  <FaTag className="tab-icon-main" />
                </div>
                <span className="tab-text">{t.offersTab}</span>
                <p className="tab-description">
                  {isRTL ? "عروض سفر حصرية" : "Exclusive travel packages & offers"}
                </p>
              </button>

              <button
                className={`tab-button ${activeTab === "popular" ? "active" : ""}`}
                onClick={() => handleTabClick("popular")}
              >
                <div className="tab-icon-wrapper">
                  <FaGlobe className="tab-icon-main" />
                </div>
                <span className="tab-text">{t.popularDestinationsTab}</span>
                <p className="tab-description">
                  {isRTL ? "اعرض الوجهات الشعبية" : "Browse our popular destinations"}
                </p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Flights Section */}
      <section className="content-section py-5" ref={flightsSectionRef}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">{isRTL ? "الطيران" : "Flights"}</h2>
            <div className="section-divider"></div>
          </div>

          <div className="slider-wrapper">
            <button className="slider-nav left" onClick={() => flightsSwiperRef.current?.slidePrev()} aria-label="Previous">
              <FaChevronLeft />
            </button>

            <Swiper
              onSwiper={(sw) => (flightsSwiperRef.current = sw)}
              modules={[Autoplay, Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                576: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 }
              }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true, dynamicBullets: true }}
              loop={true}
              speed={600}
              className="swiper-flights"
            >
              {flights.length > 0 ? (
                flights.map((flight) => (
                  <SwiperSlide key={flight.id}>
                    <div className="destination-card">
                      <div className="flight-card-header">
                        <div className="airline-badge">
                          <FaPlane className="airline-icon" />
                          <span>{getFlightText(flight, 'airline')}</span>
                        </div>
                      </div>
                      <div className="destination-content">
                        <h4 className="destination-name">{getFlightText(flight, 'route')}</h4>
                        <div className="flight-times">
                          <div className="time-slot">
                            <span className="time-label">{isRTL ? "المغادرة" : "Departure"}</span>
                            <span className="time-value">{flight.departure_time}</span>
                          </div>
                          <div className="flight-arrow"><FaPlane /></div>
                          <div className="time-slot">
                            <span className="time-label">{isRTL ? "الوصول" : "Arrival"}</span>
                            <span className="time-value">{flight.arrival_time}</span>
                          </div>
                        </div>
                        <div className="flight-details">
                          <span className="detail-tag"><FaClock className="detail-icon" /> {flight.duration}</span>
                          <span className="detail-tag">{getFlightText(flight, 'stops')}</span>
                        </div>
                        <div className="destination-footer">
                          <button className="btn btn-outline-primary" onClick={() => handleFlightBooking(flight)} style={{ background: '#EFC8AE', color: '#000', border: 'none' }}>{t.bookNow}</button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <div className="col-12 text-center" style={{color: '#5d6d7e'}}>
                  <p>No flights available</p>
                </div>
              )}
            </Swiper>

            <button className="slider-nav right" onClick={() => flightsSwiperRef.current?.slideNext()} aria-label="Next">
              <FaChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* Hotels Section */}
      <section className="content-section py-5 bg-light" ref={hotelsSectionRef}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">{isRTL ? "الفنادق" : "Hotels"}</h2>
            <div className="section-divider"></div>
          </div>

          <div className="slider-wrapper">
            <button className="slider-nav left" onClick={() => hotelsSwiperRef.current?.slidePrev()} aria-label="Previous">
              <FaChevronLeft />
            </button>

            <Swiper
              onSwiper={(sw) => (hotelsSwiperRef.current = sw)}
              modules={[Autoplay, Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                576: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 }
              }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true, dynamicBullets: true }}
              loop={true}
              speed={600}
              className="swiper-hotels"
            >
              {hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <SwiperSlide key={hotel.id}>
                    <div className="destination-card hotel-card">
                      <div className="hotel-image">
                        <img src={hotel.image || TRANSPARENT_IMAGE} alt={getHotelText(hotel, 'name')} className="img-fluid" />
                        <div className="hotel-rating">
                          {Array.from({ length: hotel.rating || 0 }).map((_, i) => (<FaStar key={i} className="star-icon" />))}
                        </div>
                      </div>
                      <div className="destination-content">
                        <h4 className="destination-name">{getHotelText(hotel, 'name')}</h4>
                        <p className="destination-description">{getHotelText(hotel, 'location')}</p>
                        <div className="hotel-amenities">{parseList(lang === 'ar' ? hotel.amenities_ar : hotel.amenities_en).slice(0,3).map((amenity, index) => (<span key={index} className="amenity-tag">{amenity}</span>))}</div>
                        <div className="destination-footer"><button className="btn btn-outline-primary" onClick={() => handleHotelBooking(hotel)} style={{ background: '#EFC8AE', color: '#000', border: 'none' }}>{t.bookNow}</button></div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <div className="col-12 text-center" style={{color: '#5d6d7e'}}><p>No hotels available</p></div>
              )}
            </Swiper>

            <button className="slider-nav right" onClick={() => hotelsSwiperRef.current?.slideNext()} aria-label="Next">
              <FaChevronRight />
            </button>
          </div> 
        </div>
      </section>

      {/* Offers Section */}
      <section className="content-section py-5" ref={offersSectionRef}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">{isRTL ? "الباقات" : "Packages"}</h2>
            <div className="section-divider"></div>
          </div>

          <div className="slider-wrapper">
            <button className="slider-nav left" onClick={() => packagesSwiperRef.current?.slidePrev()} aria-label="Previous">
              <FaChevronLeft />
            </button>

            <Swiper
              onSwiper={(sw) => (packagesSwiperRef.current = sw)}
              modules={[Autoplay, Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                576: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 }
              }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true, dynamicBullets: true }}
              loop={true}
              loopAdditionalSlides={2}
              watchSlidesProgress={true}
              speed={600}
              className="swiper-packages"
            >
              {packages.length > 0 ? (
                packages.map((offer) => (
                  <SwiperSlide key={offer.id}>
                    <div className="destination-card package-card">
                      <div className="package-image">
                        <img src={offer.image || TRANSPARENT_IMAGE} alt={getPackageText(offer, 'title')} className="img-fluid" />
                        <div className="package-badge">{getPackageText(offer, 'type')}</div>
                      </div>
                      <div className="destination-content">
                        <h4 className="destination-name">{getPackageText(offer, 'title')}</h4>
                        <p className="destination-description">{getPackageText(offer, 'description')}</p>
                        {offer.duration_en && (
                          <div className="package-duration">
                            <FaClock className="duration-icon" /> {lang === 'ar' ? offer.duration_ar : offer.duration_en}
                          </div>
                        )}
                        <div className="destination-footer">
                          <button className="btn btn-outline-primary" onClick={() => handlePackageBooking(offer)} style={{ background: '#EFC8AE', color: '#000', border: 'none' }}>{t.bookNow}</button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <div className="col-12 text-center" style={{color: '#5d6d7e'}}><p>No packages available</p></div>
              )}
            </Swiper>

            <button className="slider-nav right" onClick={() => packagesSwiperRef.current?.slideNext()} aria-label="Next">
              <FaChevronRight />
            </button>
          </div> 
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations-section py-5 bg-light" ref={destinationsSectionRef}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">{t.popularDestinations}</h2>
            <div className="section-divider"></div>
          </div>

          <div className="slider-wrapper">
            <button className="slider-nav left" onClick={() => destinationsSwiperRef.current?.slidePrev()} aria-label="Previous">
              <FaChevronLeft />
            </button>

            <Swiper
              onSwiper={(sw) => (destinationsSwiperRef.current = sw)}
              modules={[Autoplay, Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                576: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 }
              }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true, dynamicBullets: true }}
              loop={true}
              speed={600}
              className="swiper-destinations"
            >
              {destinations.length > 0 ? (
                destinations.map((destination) => (
                  <SwiperSlide key={destination.id}>
                    <div className="destination-card">
                      <div className="destination-image"><img src={destination.image || destination.featured_image || TRANSPARENT_IMAGE} alt={getDestinationText(destination, 'name')} className="img-fluid" /></div>
                      <div className="destination-content"><h4 className="destination-name">{getDestinationText(destination, 'name')}</h4><p className="destination-description">{getDestinationText(destination, 'description')}</p><div className="destination-footer"><button className="btn btn-outline-primary" onClick={() => handleDestinationBooking(destination)} style={{ background: '#EFC8AE', color: '#000', border: 'none' }}>{t.bookNow}</button></div></div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <div className="col-12 text-center" style={{color: '#5d6d7e'}}><p>No destinations available</p></div>
              )}
            </Swiper>

            <button className="slider-nav right" onClick={() => destinationsSwiperRef.current?.slideNext()} aria-label="Next">
              <FaChevronRight />
            </button>
          </div>
        </div>
      </section>


   

      {/* Why Choose Us */}
      <section className="features-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">{t.whyChooseUs}</h2>
            <div className="section-divider"></div>
          </div>

          <div className="row g-4">
            {t.features.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="feature-card">
                  <div className="feature-icon-wrapper">{feature.icon}</div>
                  <h5 className="feature-title">{feature.title}</h5>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Tips */}
      <section className="tips-section py-5">
        <div className="container">
          <div className="tips-card">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h3 className="tips-title">{t.travelTips}</h3>
                <ul className="tips-list">
                  {t.tips.map((tip, index) => (
                    <li key={index} className="tip-item">
                      <FaCheckCircle className="tip-icon" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-lg-4 text-center">
                <div className="cta-box">
                  <h4>{t.needHelp}</h4>
                  <p>{t.contactSupport}</p>
                  <button
                    onClick={handleContactSupport}
                    className="btn btn-success"
                  >
                    <FaWhatsapp className={isRTL ? "ms-2" : "me-2"} />
                    {t.contactUs}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .international-page {
          background: #000000ff;
          font-family: "Tajawal", sans-serif;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #000000ff 0%, #26272aff 100%);
          padding: 100px 20px 80px;
        }

        .hero-content {
          text-align: center;
        }

        .hero-title {
          color: #f9f9f9ff;
          font-weight: 800;
          font-size: 3.5rem;
          margin-top: 60px;
          margin-bottom: 20px;
          font-family: "Tajawal", sans-serif;
          text-align: center;
        }

        .hero-subtitle {
          color: #b2b3b4ff;
          font-size: 1.2rem;
          line-height: 1.8;
          font-family: "Tajawal", sans-serif;
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }

        .hero-icon {
          font-size: 15rem;
          color: rgba(90, 70, 6, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        /* Tabs Section */
        .tabs-section {
          margin-top: -40px;
          position: relative;
          z-index: 10;
          padding: 40px 20px;
        }

        .tabs-container {
          background: white;
          border-radius: 20px;
          padding: 50px 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
          max-width: 1400px;
          margin: 0 auto;
        }

        .tabs-title {
          color: #5a4606ff;
          font-weight: 700;
          font-size: 2.2rem;
          margin-bottom: 15px;
          text-align: center;
        }

        .tabs-subtitle {
          color: #5d6d7e;
          font-size: 1.1rem;
          text-align: center;
          margin-bottom: 40px;
        }

        .tabs-navigation {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          align-items: stretch;
        }

        .tab-button {
          flex: 1;
          min-width: 200px;
          background: #f8f9fa;
          border: none;
          border-radius: 15px;
          padding: 30px 25px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .tab-button:hover {
          background: #e9ecef;
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .tab-button.active {
          background: linear-gradient(135deg, #8a7779 0%, #efc8ae 100%);
          color: white;
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(138, 119, 121, 0.3);
        }

        .tab-button.active .tab-icon-wrapper {
          background: rgba(255, 255, 255, 0.95);
          color: #8a7779;
          transform: scale(1.1);
        }

        .tab-button.active .tab-description {
          color: rgba(255, 255, 255, 0.95);
        }

        .tab-icon-wrapper {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #8a7779, #efc8ae);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: white;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .tab-icon-main {
          font-size: 2.2rem;
        }

        .tab-text {
          font-weight: 700;
          font-size: 1.1rem;
          color: inherit;
        }

        .tab-description {
          color: #5d6d7e;
          font-size: 0.85rem;
          line-height: 1.5;
          margin: 0;
          transition: all 0.3s ease;
        }

        /* Content Sections */
        .content-section {
          background: white;
          padding: 60px 20px;
        }

        .content-section.bg-light {
          background: #f8f9fa;
        }

        .section-title {
          color: #5a4606ff;
          font-weight: 800;
          font-size: 2.8rem;
          margin-bottom: 15px;
          text-align: center;
        }

        .section-divider {
          width: 100px;
          height: 5px;
          background: linear-gradient(90deg, #8a7779, #efc8ae);
          margin: 20px auto 40px;
          border-radius: 3px;
        }

        .slider-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 1300px;
          margin: 0 auto;
          padding: 20px 0;
        }

        .slides-container {
          width: 100%;
          overflow: hidden;
          border-radius: 10px;
        }

        .slides {
          display: flex;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        .slide {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .content-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          border: 1px solid #e9ecef;
        }

        .content-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
          border-color: #efc8ae;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .content-title {
          color: #5a4606ff;
          font-weight: 700;
          font-size: 1.2rem;
          margin: 0;
        }

        .content-price {
          color: #e74c3c;
          font-weight: 800;
          font-size: 1.5rem;
        }

        .content-body {
          padding: 10px 0;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .content-location {
          color: #5d6d7e;
          font-size: 0.9rem;
          margin-bottom: 15px;
        }

        .content-description {
          color: #5d6d7e;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 15px;
          flex-grow: 1;
        }

        .content-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 15px;
        }

        .slider-nav {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(138, 119, 121, 0.85);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
        }

        .slider-nav:hover {
          background: rgba(138, 119, 121, 1);
          transform: translateY(-50%) scale(1.1);
        }

        .slider-nav.left { left: -60px; }
        .slider-nav.right { right: -60px; }

        .slider-dots {
          text-align: center;
          margin-top: 30px;
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .slider-dots button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(90, 70, 6, 0.2);
          border: none;
          margin: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .slider-dots button:hover {
          background: rgba(90, 70, 6, 0.4);
          transform: scale(1.2);
        }

        .slider-dots button.active {
          background: linear-gradient(135deg, #8a7779, #efc8ae);
          width: 32px;
          border-radius: 6px;
        }

        /* Flight Specific */
        .flight-route {
          text-align: center;
          margin-bottom: 15px;
        }

        .route-path {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          gap: 10px;
        }

        .route-from, .route-to {
          color: #5a4606ff;
          font-weight: 700;
          font-size: 0.95rem;
          text-align: center;
          flex: 1;
        }

        .route-arrow {
          color: #8a7779;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        .route-name {
          color: #5d6d7e;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .content-details {
          display: flex;
          justify-content: space-around;
          border-top: 1px solid #e9ecef;
          padding-top: 12px;
          gap: 10px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          flex: 1;
        }

        .detail-label {
          color: #5d6d7e;
          font-size: 0.8rem;
          margin-bottom: 4px;
        }

        .detail-value {
          color: #5a4606ff;
          font-weight: 700;
          font-size: 0.95rem;
        }

        /* Hotel Specific */
        .hotel-image {
          height: 180px;
          position: relative;
          border-radius: 15px 15px 0 0;
          overflow: hidden;
          background: #f0f0f0;
        }

        .hotel-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .hotel-card:hover .hotel-image img {
          transform: scale(1.05);
        }

        .hotel-rating {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(255, 255, 255, 0.95);
          padding: 6px 12px;
          border-radius: 20px;
          display: flex;
          gap: 3px;
        }

        .star-icon {
          color: #ffd700;
          font-size: 0.85rem;
        }

        .hotel-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }

        .amenity-tag {
          background: linear-gradient(135deg, rgba(138, 119, 121, 0.1), rgba(239, 200, 174, 0.1));
          color: #5a4606ff;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid rgba(138, 119, 121, 0.2);
        }

        /* Offers Specific */
        .offer-badge {
          position: absolute;
          top: -12px;
          left: 15px;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #8a7779, #efc8ae);
          box-shadow: 0 4px 12px rgba(138, 119, 121, 0.3);
        }

        .package-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #8a7779, #efc8ae);
          box-shadow: 0 4px 12px rgba(138, 119, 121, 0.3);
        }

        /* Package Image Specific */
        .package-image {
          height: 380px;
          position: relative;
          border-radius: 15px 15px 0 0;
          overflow: hidden;
          background: #f0f0f0;
          aspect-ratio: 820 / 1120;
        }

        .package-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .package-card:hover .package-image img {
          transform: scale(1.05);
        }

        .package-duration {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #5d6d7e;
          font-size: 0.9rem;
          margin-bottom: 15px;
        }

        .duration-icon {
          color: #8a7779;
        }

        /* Flight Card Specific */
        .flight-card-header {
          background: linear-gradient(135deg, #8a7779, #efc8ae);
          padding: 20px;
          border-radius: 15px 15px 0 0;
          margin: -1px -1px 0 -1px;
        }

        .airline-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .airline-icon {
          font-size: 1.3rem;
        }

        .flight-times {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 15px 0;
          padding: 15px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .time-slot {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .time-label {
          font-size: 0.75rem;
          color: #5d6d7e;
          margin-bottom: 4px;
        }

        .time-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #5a4606ff;
        }

        .flight-arrow {
          color: #8a7779;
          font-size: 1.2rem;
        }

        .flight-details {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 15px;
        }

        .detail-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, rgba(138, 119, 121, 0.1), rgba(239, 200, 174, 0.1));
          color: #5a4606ff;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .detail-icon {
          color: #8a7779;
          font-size: 0.9rem;
        }

        .offer-image {
          height: 160px;
          overflow: hidden;
          border-radius: 10px;
          margin-bottom: 15px;
          background: #f0f0f0;
        }

        .offer-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .content-card:hover .offer-image img {
          transform: scale(1.05);
        }

        /* Destinations */
        .destination-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .destination-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
          border-color: #efc8ae;
        }

        .destination-image {
          height: 380px;
          position: relative;
          overflow: hidden;
          background: #f0f0f0;
          aspect-ratio: 820 / 1120;
        }

        .destination-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .destination-card:hover .destination-image img {
          transform: scale(1.08);
        }

        .destination-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.6) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .destination-card:hover .destination-overlay {
          opacity: 1;
        }

        .destination-content {
          padding: 20px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .destination-name {
          color: #5a4606ff;
          font-weight: 700;
          font-size: 1.3rem;
          margin-bottom: 8px;
        }

        .destination-description {
          color: #5d6d7e;
          margin-bottom: 15px;
          line-height: 1.5;
          font-size: 0.9rem;
          flex-grow: 1;
        }

        .destination-footer {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-top: auto;
        }

        .destination-price {
          color: #e74c3c;
          font-weight: 700;
          font-size: 1.3rem;
        }

        /* Features Section */
        .features-section {
          background: white;
          padding: 60px 20px;
        }

        .feature-card {
          background: linear-gradient(135deg, #ffffff, #f8f9fa);
          padding: 40px 30px;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          height: 100%;
          border: 1px solid #e9ecef;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
          border-color: #efc8ae;
          background: linear-gradient(135deg, #ffffff, #faf9f7);
        }

        .feature-icon-wrapper {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #8a7779, #efc8ae);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 2.5rem;
          color: white;
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon-wrapper {
          transform: scale(1.1);
          box-shadow: 0 10px 25px rgba(138, 119, 121, 0.3);
        }

        .feature-title {
          color: #5a4606ff;
          font-weight: 700;
          font-size: 1.3rem;
          margin-bottom: 12px;
        }

        .feature-description {
          color: #5d6d7e;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        /* Tips Section */
        .tips-section {
          background: linear-gradient(135deg, #8a7779 0%, #efc8ae 100%);
          padding: 60px 20px;
        }

        .tips-card {
          background: white;
          border-radius: 20px;
          padding: 50px 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          max-width: 1200px;
          margin: 0 auto;
        }

        .tips-title {
          color: #5a4606ff;
          font-weight: 800;
          font-size: 2.2rem;
          margin-bottom: 30px;
          text-align: center;
        }

        .tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
          column-count: 2;
          column-gap: 30px;
        }

        .tip-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 18px;
          color: #5d6d7e;
          line-height: 1.6;
          break-inside: avoid;
        }

        .tip-icon {
          color: #27ae60;
          flex-shrink: 0;
          margin-top: 2px;
          font-size: 1.2rem;
        }

        .cta-box {
          background: linear-gradient(135deg, #8a7779, #efc8ae);
          color: white;
          padding: 40px 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          text-align: center;
        }

        .cta-box h4 {
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .cta-box p {
          margin-bottom: 25px;
          opacity: 0.95;
          font-size: 1rem;
        }

        .btn-success {
          background: #25d366;
          border: none;
          padding: 12px 30px;
          border-radius: 25px;
          font-weight: 700;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .btn-success:hover {
          background: #128c7e;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);
        }

        .btn-primary {
          background: linear-gradient(135deg, #8a7779, #efc8ae);
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 700;
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 0.95rem;
          display: inline-block;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(138, 119, 121, 0.4);
        }

        .btn-outline-primary {
          border: 2px solid #8a7779;
          color: #8a7779;
          background: transparent;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 700;
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 0.95rem;
        }

        .btn-outline-primary:hover {
          background: #8a7779;
          color: white;
        }

        .w-100 {
          width: 100%;
        }

        .mt-3 {
          margin-top: 1rem;
        }

        .ms-2 {
          margin-left: 0.5rem;
        }

        .me-2 {
          margin-right: 0.5rem;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .slider-nav.left { left: 0; }
          .slider-nav.right { right: 0; }
          
          .tips-list {
            column-count: 1;
          }
        }

        @media (max-width: 992px) {
          .hero-title {
            font-size: 2.8rem;
          }

          .section-title {
            font-size: 2.2rem;
          }

          .tabs-container {
            padding: 35px 25px;
          }

          .tabs-navigation {
            gap: 15px;
          }

          .tab-button {
            min-width: 160px;
            padding: 20px 15px;
          }

          .tips-card {
            padding: 40px 30px;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 60px 20px;
          }

          .hero-title {
            font-size: 2.2rem;
            margin-top: 40px;
          }

          .tabs-section {
            margin-top: -30px;
            padding: 20px;
          }

          .tabs-container {
            padding: 25px 20px;
          }

          .tabs-title {
            font-size: 1.8rem;
          }

          .section-title {
            font-size: 1.8rem;
          }

          .slider-nav {
            width: 36px;
            height: 36px;
            font-size: 1rem;
          }

          .slider-nav.left { left: 5px; }
          .slider-nav.right { right: 5px; }

          .slider-wrapper {
            padding: 15px 50px;
          }

          .content-card {
            padding: 20px;
          }

          .tabs-navigation {
            flex-direction: column;
          }

          .tab-button {
            width: 100%;
            min-width: auto;
          }

          .destination-footer {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }

          .content-footer {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
        }

        @media (max-width: 576px) {
          .hero-section {
            padding: 50px 15px;
          }

          .hero-title {
            font-size: 1.8rem;
            margin-top: 30px;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .content-section {
            padding: 40px 15px;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .tabs-title {
            font-size: 1.5rem;
          }

          .tabs-container {
            padding: 20px 15px;
          }

          .slider-wrapper {
            padding: 10px 40px;
          }

          .slider-nav {
            width: 32px;
            height: 32px;
            font-size: 0.9rem;
          }

          .slider-nav.left { left: 2px; }
          .slider-nav.right { right: 2px; }

          .slider-dots {
            gap: 6px;
          }

          .slider-dots button {
            width: 8px;
            height: 8px;
          }

          .slider-dots button.active {
            width: 24px;
          }

          .content-card {
            padding: 15px;
          }

          .hotel-image {
            height: 140px;
          }

          .package-image {
            height: 280px;
          }

          .destination-image {
            height: 280px;
          }

          .tips-card {
            padding: 25px 15px;
          }

          .tips-title {
            font-size: 1.5rem;
            margin-bottom: 20px;
          }

          .tip-item {
            margin-bottom: 12px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}