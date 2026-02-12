"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL, getToken } from '../lib/api';
import { 
  X, Phone, Calendar, Users, MapPin, Music, Trophy, Ship, 
  Coffee, Utensils, Target, Waves as WavesIcon, User, Check,
  ChevronRight, ChevronLeft, Mail, Hotel, Plane, CreditCard,
  Bed, Star, Wifi, Car, Coffee as CoffeeIcon, Clock, Hash, AlertCircle,
  Globe, CreditCard as CreditCardIcon, Briefcase, ShoppingBag,
  Compass, Mountain, GamepadIcon as Gamepad, Fish, Crown
} from "lucide-react";


import { useParams } from "next/navigation";
import { useUI } from "../providers/UIProvider";
import { useAuth } from "../providers/AuthProvider";

export default function ReservationModal() {
  const params = useParams();
  const lang = params?.lang || 'en';
  const isRTL = lang === 'ar';

  const { reservationModal, closeReservationModal, triggerDashboardRefresh } = useUI();
  const { user, isAuthenticated } = useAuth();
  const isOpen = reservationModal?.open;
  const destination = reservationModal?.trip || null;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [bookingType, setBookingType] = useState("activity");
  const [bookingLocation, setBookingLocation] = useState("international"); // "local" or "international"
  const [showValidationError, setShowValidationError] = useState(false);
  const [reservationRef, setReservationRef] = useState(null);
  const [runtimeError, setRuntimeError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Dynamic destinations data from API
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [destinationsLoading, setDestinationsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Saudi regions and local activities for local booking
const saudiRegions = [
  { 
    id: "riyadh", 
    name: { 
      en: "Riyadh Region", 
      ar: "منطقة الرياض",
      zh: "利雅得地区"
    },
    capital: { en: "Riyadh", ar: "الرياض", zh: "利雅得" },
    cities: [
      { en: "Riyadh", ar: "الرياض", zh: "利雅得" },
      { en: "Al-Kharj", ar: "الخرج", zh: "哈尔吉" },
      { en: "Al-Majma'ah", ar: "المجمعة", zh: "迈季迈阿" },
      { en: "Ad-Dilam", ar: "الدلم", zh: "迪拉姆" },
      { en: "Dawadmi", ar: "الدوادمي", zh: "杜瓦迪米" },
      { en: "Afif", ar: "عفيف", zh: "阿菲夫" },
      { en: "Al-Zulfi", ar: "الزلفي", zh: "祖勒菲" },
      { en: "Shaqra", ar: "شقراء", zh: "舍格拉" },
      { en: "Hotat Bani Tamim", ar: "حوطة بني تميم", zh: "胡塔巴尼塔米姆" },
      { en: "Al-Muzahmiyya", ar: "المزاحمية", zh: "穆扎希米耶" },
      { en: "Thadiq", ar: "ثادق", zh: "萨迪格" },
      { en: "Huraymila", ar: "حريملاء", zh: "胡赖米拉" },
      { en: "Dhurma", ar: "ضرما", zh: "杜尔马" },
      { en: "Al-Ghat", ar: "الغاط", zh: "加特" },
      { en: "Wadi ad-Dawasir", ar: "وادي الدواسر", zh: "瓦迪达瓦西尔" },
      { en: "Al Aflaj", ar: "الأفلاج", zh: "艾弗拉吉" },
      { en: "As Sulayyil", ar: "السليل", zh: "苏莱伊勒" },
      { en: "Rumah", ar: "رماح", zh: "鲁马" },
      { en: "Al-Quway'iyah", ar: "القويعية", zh: "古韦伊耶" },
      { en: "Al-Hareeq", ar: "الحريق", zh: "哈里格" },
      { en: "Irqah", ar: "عرقة", zh: "伊尔卡" },
      { en: "Diriyah", ar: "الدرعية", zh: "德拉伊耶" }
    ]
  },
  { 
    id: "makkah", 
    name: { 
      en: "Makkah Region", 
      ar: "منطقة مكة المكرمة",
      zh: "麦加地区"
    },
    capital: { en: "Mecca", ar: "مكة المكرمة", zh: "麦加" },
    cities: [
      { en: "Mecca", ar: "مكة المكرمة", zh: "麦加" },
      { en: "Jeddah", ar: "جدة", zh: "吉达" },
      { en: "Taif", ar: "الطائف", zh: "塔伊夫" },
      { en: "Al Qunfudhah", ar: "القنفذة", zh: "贡富扎" },
      { en: "Al Lith", ar: "الليث", zh: "利斯" },
      { en: "Rabigh", ar: "رابغ", zh: "拉比格" },
      { en: "Al Jumum", ar: "الجموم", zh: "朱穆姆" },
      { en: "Khulays", ar: "خليص", zh: "胡莱斯" },
      { en: "Al Kamil", ar: "الكامل", zh: "卡米勒" },
      { en: "Al Khurmah", ar: "الخرمة", zh: "胡尔马" },
      { en: "Ranyah", ar: "رنية", zh: "拉尼耶" },
      { en: "Turubah", ar: "تربة", zh: "图尔巴" },
      { en: "Az Zaimah", ar: "الزيمة", zh: "扎伊马" },
      { en: "Mastoorah", ar: "مستورة", zh: "马斯图拉" },
      { en: "Qadeimah", ar: "قديمة", zh: "古戴马" }
    ]
  },
  { 
    id: "madinah", 
    name: { 
      en: "Al Madinah Region", 
      ar: "منطقة المدينة المنورة",
      zh: "麦地那地区"
    },
    capital: { en: "Medina", ar: "المدينة المنورة", zh: "麦地那" },
    cities: [
      { en: "Medina", ar: "المدينة المنورة", zh: "麦地那" },
      { en: "Yanbu", ar: "ينبع", zh: "延布" },
      { en: "Al-'Ula", ar: "العلا", zh: "欧拉" },
      { en: "Badr", ar: "بدر", zh: "巴德尔" },
      { en: "Khaybar", ar: "خيبر", zh: "海巴尔" },
      { en: "Mahd adh Dhahab", ar: "مهد الذهب", zh: "迈赫德宰海卜" },
      { en: "Al Hinakiyah", ar: "الحناكية", zh: "希纳基耶" }
    ]
  },
  { 
    id: "eastern", 
    name: { 
      en: "Eastern Province", 
      ar: "المنطقة الشرقية",
      zh: "东部省"
    },
    capital: { en: "Dammam", ar: "الدمام", zh: "达曼" },
    cities: [
      { en: "Dammam", ar: "الدمام", zh: "达曼" },
      { en: "Khobar", ar: "الخبر", zh: "胡拜尔" },
      { en: "Dhahran", ar: "الظهران", zh: "宰赫兰" },
      { en: "Jubail", ar: "الجبيل", zh: "朱拜勒" },
      { en: "Qatif", ar: "القطيف", zh: "卡提夫" },
      { en: "Al Ahsa (Hofuf)", ar: "الأحساء (الهفوف)", zh: "艾赫萨（胡富夫）" },
      { en: "Hafar Al-Batin", ar: "حفر الباطن", zh: "哈费尔巴廷" },
      { en: "Khafji", ar: "الخفجي", zh: "哈夫吉" },
      { en: "Ras Tanura", ar: "رأس تنورة", zh: "拉斯塔努拉" },
      { en: "Abqaiq", ar: "بقيق", zh: "布盖格" },
      { en: "Al Nairyah", ar: "النعيرية", zh: "奈伊里耶" },
      { en: "Qaryat al-Ulya", ar: "قرية العليا", zh: "欧莱雅村" },
      { en: "Uqair", ar: "العقير", zh: "乌凯尔" },
      { en: "Al-Oyoon", ar: "العيون", zh: "欧尤恩" }
    ]
  },
  { 
    id: "asir", 
    name: { 
      en: "Asir Region", 
      ar: "منطقة عسير",
      zh: "阿西尔地区"
    },
    capital: { en: "Abha", ar: "أبها", zh: "艾卜哈" },
    cities: [
      { en: "Abha", ar: "أبها", zh: "艾卜哈" },
      { en: "Khamis Mushait", ar: "خميس مشيط", zh: "海米斯穆谢特" },
      { en: "Bisha", ar: "بيشة", zh: "比沙" },
      { en: "Al-Namas", ar: "النماص", zh: "奈马斯" },
      { en: "Muhayil", ar: "محايل", zh: "穆哈伊勒" },
      { en: "Bareq", ar: "بارق", zh: "巴里克" },
      { en: "Sarat Abidah", ar: "سراة عبيدة", zh: "萨拉特阿比达" },
      { en: "Tathlith", ar: "تثليث", zh: "萨斯利斯" },
      { en: "Rijal Almaa", ar: "رجال ألمع", zh: "里贾勒阿尔马" },
      { en: "Ahad Rafidah", ar: "أحد رفيدة", zh: "艾哈德拉菲达" },
      { en: "Dhahran Al Janub", ar: "ظهران الجنوب", zh: "南宰赫兰" },
      { en: "Balqarn", ar: "بلقرن", zh: "巴尔卡恩" },
      { en: "Tanomah", ar: "تنومة", zh: "塔努马" },
      { en: "Sabt Al Alaya", ar: "سبت العلاية", zh: "塞卜特阿拉亚" }
    ]
  },
  { 
    id: "qassim", 
    name: { 
      en: "Al-Qassim Region", 
      ar: "منطقة القصيم",
      zh: "卡西姆地区"
    },
    capital: { en: "Buraydah", ar: "بريدة", zh: "布赖代" },
    cities: [
      { en: "Buraydah", ar: "بريدة", zh: "布赖代" },
      { en: "Unaizah", ar: "عنيزة", zh: "欧奈宰" },
      { en: "Ar Rass", ar: "الرس", zh: "拉斯" },
      { en: "Al Bukayriyah", ar: "البكيرية", zh: "布凯里耶" },
      { en: "Al Mithnab", ar: "المذنب", zh: "米斯纳卜" },
      { en: "Al Badayea", ar: "البدائع", zh: "巴达伊" },
      { en: "Asyah", ar: "عسيلة", zh: "阿西拉" },
      { en: "Al Nabhaniyah", ar: "النبهانية", zh: "纳卜哈尼耶" },
      { en: "Uyun AlJiwa", ar: "عيون الجواء", zh: "朱瓦泉" },
      { en: "Riyadh Al Khabra", ar: "رياض الخبراء", zh: "海卜拉利雅得" },
      { en: "Al Shimasiyah", ar: "الشماسية", zh: "希马西耶" }
    ]
  },
  { 
    id: "tabuk", 
    name: { 
      en: "Tabuk Region", 
      ar: "منطقة تبوك",
      zh: "塔布克地区"
    },
    capital: { en: "Tabuk", ar: "تبوك", zh: "塔布克" },
    cities: [
      { en: "Tabuk", ar: "تبوك", zh: "塔布克" },
      { en: "Duba", ar: "ضباء", zh: "杜巴" },
      { en: "Al Wajh", ar: "الوجه", zh: "沃季赫" },
      { en: "Haql", ar: "حقل", zh: "哈格勒" },
      { en: "Tayma", ar: "تيماء", zh: "泰马" },
      { en: "Umluj", ar: "أملج", zh: "乌姆卢吉" },
      { en: "Neom", ar: "نيوم", zh: "尼尤姆" }
    ]
  },
  { 
    id: "hail", 
    name: { 
      en: "Ha'il Region", 
      ar: "منطقة حائل",
      zh: "哈伊勒地区"
    },
    capital: { en: "Hail", ar: "حائل", zh: "哈伊勒" },
    cities: [
      { en: "Hail", ar: "حائل", zh: "哈伊勒" },
      { en: "Baqaa", ar: "بقعاء", zh: "巴卡" },
      { en: "Al Khazaiah", ar: "الخزاعية", zh: "哈扎伊耶" },
      { en: "Al Shinan", ar: "الشنان", zh: "希南" },
      { en: "Al-Ghazalah", ar: "الغزالة", zh: "加扎拉" },
      { en: "Al-Sulaymi", ar: "السليمي", zh: "苏莱米" }
    ]
  },
  { 
    id: "northern", 
    name: { 
      en: "Northern Borders Region", 
      ar: "منطقة الحدود الشمالية",
      zh: "北部边境地区"
    },
    capital: { en: "Arar", ar: "عرعر", zh: "阿尔阿尔" },
    cities: [
      { en: "Arar", ar: "عرعر", zh: "阿尔阿尔" },
      { en: "Rafha", ar: "رفحاء", zh: "拉夫哈" },
      { en: "Turaif", ar: "طريف", zh: "图赖夫" },
      { en: "Hafar Al-Batin", ar: "حفر الباطن", zh: "哈费尔巴廷" }
    ]
  },
  { 
    id: "jizan", 
    name: { 
      en: "Jizan Region", 
      ar: "منطقة جازان",
      zh: "吉赞地区"
    },
    capital: { en: "Jizan", ar: "جازان", zh: "吉赞" },
    cities: [
      { en: "Jizan", ar: "جازان", zh: "吉赞" },
      { en: "Sabya", ar: "صبياء", zh: "萨比亚" },
      { en: "Abu Arish", ar: "أبو عريش", zh: "阿布阿里什" },
      { en: "Samtah", ar: "صامطة", zh: "萨姆塔" },
      { en: "Baish", ar: "بيش", zh: "拜什" },
      { en: "Ahad al Masarihah", ar: "أحد المسارحة", zh: "艾哈德马萨里哈" },
      { en: "Al Darb", ar: "الدرب", zh: "达尔布" },
      { en: "Damad", ar: "ضمد", zh: "达马德" },
      { en: "Farasan", ar: "فرسان", zh: "法拉桑群岛" },
      { en: "Al Aridhah", ar: "العارضة", zh: "阿里达" },
      { en: "Al Reeth", ar: "الريث", zh: "赖斯" },
      { en: "Al Edabi", ar: "العداية", zh: "埃达比" },
      { en: "Al Harth", ar: "الحارث", zh: "哈里斯" },
      { en: "Al Dayer", ar: "الدائر", zh: "达耶尔" }
    ]
  },
  { 
    id: "najran", 
    name: { 
      en: "Najran Region", 
      ar: "منطقة نجران",
      zh: "奈季兰地区"
    },
    capital: { en: "Najran", ar: "نجران", zh: "奈季兰" },
    cities: [
      { en: "Najran", ar: "نجران", zh: "奈季兰" },
      { en: "Sharurah", ar: "شرورة", zh: "舍鲁拉" },
      { en: "Hubuna", ar: "حبونا", zh: "胡布纳" },
      { en: "Badr Al Janub", ar: "بدر الجنوب", zh: "南巴德尔" },
      { en: "Yadamah", ar: "يدمة", zh: "耶达马" },
      { en: "Thar", ar: "ثار", zh: "萨尔" },
      { en: "Khubash", ar: "خباش", zh: "胡巴什" },
      { en: "Al Kharkhir", ar: "الخرخير", zh: "海尔希尔" }
    ]
  },
  { 
    id: "bahah", 
    name: { 
      en: "Al-Bahah Region", 
      ar: "منطقة الباحة",
      zh: "巴哈地区"
    },
    capital: { en: "Al Bahah", ar: "الباحة", zh: "巴哈" },
    cities: [
      { en: "Al Bahah", ar: "الباحة", zh: "巴哈" },
      { en: "Baljurashi", ar: "بلجرشي", zh: "拜勒朱尔希" },
      { en: "Al Mandaq", ar: "المندق", zh: "曼达克" },
      { en: "Al Makhwah", ar: "المخواة", zh: "迈赫瓦" },
      { en: "Al Aqiq", ar: "العقيق", zh: "阿基克" },
      { en: "Qilwah", ar: "قلوة", zh: "吉尔瓦" },
      { en: "Al Qara", ar: "القرى", zh: "卡拉" },
      { en: "Al Atawelah", ar: "العطاولة", zh: "阿塔维拉" },
      { en: "Raghadan", ar: "رغدان", zh: "拉格丹" }
    ]
  },
  { 
    id: "jawf", 
    name: { 
      en: "Al-Jawf Region", 
      ar: "منطقة الجوف",
      zh: "焦夫地区"
    },
    capital: { en: "Sakakah", ar: "سكاكا", zh: "塞卡卡" },
    cities: [
      { en: "Sakakah", ar: "سكاكا", zh: "塞卡卡" },
      { en: "Qurayyat", ar: "القريات", zh: "古赖亚特" },
      { en: "Dumat Al-Jandal", ar: "دومة الجندل", zh: "朱拜勒杜马" },
      { en: "Tabarjal", ar: "طبرجل", zh: "泰拜尔杰勒" },
      { en: "Al-Haditha", ar: "الحديثة", zh: "哈迪塞" }
    ]
  }
];

  // Local activities configuration
  const localActivities = {
    entertainment: [
      { id: "dj", name: { en: "DJ", ar: "دي جي" } },
      { id: "singer", name: { en: "Traditional Singer", ar: "مطرب شعبي" } },
      { id: "band", name: { en: "Musical Band", ar: "فرقة موسيقية" } },
      { id: "games", name: { en: "Interactive Games", ar: "ألعاب تفاعلية" } },
    ],
    folkloreShows: [
      { id: "ardha", name: { en: "Ardha (Sword Dance)", ar: "العرضة السعودية" } },
      { id: "mizmar", name: { en: "Mizmar Performance", ar: "عرض المزمار" } },
      { id: "samri", name: { en: "Samri Dance", ar: "رقصة السامري" } },
      { id: "khaliji", name: { en: "Khaliji Music", ar: "الموسيقى الخليجية" } },
    ],
    activities: [
      { id: "horse", name: { en: "Horse Riding", ar: "ركوب الخيل" } },
      { id: "atv", name: { en: "ATV Riding", ar: "ركوب الدراجات الرباعية" } },
      { id: "camel", name: { en: "Camel Riding", ar: "ركوب الجمال" } },
      { id: "diving", name: { en: "Diving & Water Sports", ar: "الغوص والرياضات المائية" } },
      { id: "safari", name: { en: "Desert Safari", ar: "رحلة سفاري" } },
      { id: "climbing", name: { en: "Rock Climbing", ar: "تسلق الصخور" } },
      { id: "hiking", name: { en: "Hiking", ar: "المشي الجبلي" } },
    ],
    seaTrips: [
      { id: "yacht", name: { en: "Yacht Trip", ar: "رحلة يخت" } },
      { id: "boat", name: { en: "Boat Trip", ar: "رحلة قارب" } },
      { id: "fishing", name: { en: "Fishing Trip", ar: "رحلة صيد" } },
    ],
    foodBeverages: [
      { id: "buffet", name: { en: "Open Buffet", ar: "بوفيه مفتوح" } },
      { id: "bbq", name: { en: "Live Grill/BBQ", ar: "شواء مباشر" } },
      { id: "appetizers", name: { en: "Appetizer & Snack Corner", ar: "ركن المقبلات والوجبات الخفيفة" } },
      { id: "juice", name: { en: "Fresh Juice Corner", ar: "ركن العصائر الطازجة" } },
      { id: "fruits", name: { en: "Seasonal Fruits", ar: "فواكه موسمية" } },
      { id: "dessert", name: { en: "Dessert Corner", ar: "ركن الحلويات" } },
    ],
    hotDrinks: [
      { id: "arabic_coffee", name: { en: "Arabic Coffee", ar: "قهوة عربية" } },
      { id: "tea", name: { en: "Tea", ar: "شاي" } },
      { id: "nescafe", name: { en: "Nescafé", ar: "نسكافيه" } },
      { id: "karak", name: { en: "Karak Tea", ar: "شاي كرك" } },
    ]
  };
  const getDefaultDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get default date once for use in all date fields
  const defaultDate = getDefaultDate();

  const [formData, setFormData] = useState({
    // General Info (Both Local & International)
    bookingLocation: "international",
    bookingType: "activity",
    name: "", // Added for local booking
    phoneNumber: "",
    userEmail: "",
    numberOfGuests: 2,

    // Local Booking Specific
    region: "",
    city: "",
    localDestination: "", // Changed from "destination" to avoid conflict
    date: defaultDate,
    entertainment: [],
    folkloreShow: [],
    customEntertainment: "",
    selectedActivities: [],
    selectedSeaTrips: [],
    customActivity: "",
    foodSelection: [],
    hotDrinksSelection: [], // Changed from hotDrinks to avoid conflict
    customDinnerLocal: "",

    // International fields (existing)
    checkInDate: defaultDate,
    checkOutDate: defaultDate,
    roomType: "standard",
    roomCount: 1,
    hotelAmenities: {
      breakfast: true,
      wifi: true,
      parking: false,
      pool: false
    },
    flightFrom: "JED",
    flightTo: "DXB",
    departureDate: defaultDate,
    returnDate: defaultDate,
    flightClass: "economy",
    passengers: 1,
    entertainmentInt: "",
    folkloreShowInt: false,
    activities: {
      sightseeing: false,
      culturalTours: false,
      shopping: false
    },
    foodPreferences: {
      hotDrinks: false,
      customDinner: false,
      other: ""
    },
    specialRequests: ""
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

 // في BookingModal، داخل useEffect الأول:
useEffect(() => {
  if (isOpen) {
    setCurrentStep(1);
    setIsSubmitted(false);
      setRuntimeError(null);
      setSubmitError(null);
      // Reset dynamic destination selection state
      setSelectedCountry("");
      setSelectedCity("");
      setSelectedDestination(null);
      setAvailableCountries([]);
      setAvailableCities([]);
      setAvailableDestinations([]);
      // Start with sensible defaults; allow opener to override
      let initialBookingType = destination?.preferredBookingType || "activity";
      let flightTo = "DXB";
      let initialBookingLocation = "international"; // default

      // Respect explicit bookingLocation provided by the opener
      if (destination?.bookingLocation) {
        initialBookingLocation = destination.bookingLocation;
      } else if (destination?.type === 'domestic' || destination?.type === 'local' || destination?.isLocalService || destination?.isLocalDestination) {
        initialBookingLocation = "local";
      } else {
        initialBookingLocation = "international";
      }

      // Determine booking type from explicit preference or destination hints
      if (destination?.preferredBookingType) {
        initialBookingType = destination.preferredBookingType;
      } else if (destination?.title?.includes("→")) {
        initialBookingType = "flight";
      } else if (destination?.title?.includes("Hotel") || destination?.title?.includes("Resort")) {
        initialBookingType = "hotel";
      } else if ((destination?.description && destination.description.includes("package")) || destination?.title?.includes("Package")) {
        initialBookingType = "package";
      } else {
        initialBookingType = initialBookingType || "activity";
      }

      setBookingType(initialBookingType);
      setBookingLocation(initialBookingLocation); // ensure modal opens on requested tab
      
      setFormData({
        // General Info
        bookingLocation: initialBookingLocation, // استخدام القيمة الصحيحة
        bookingType: initialBookingType,
        name: user?.name || "",
        phoneNumber: user?.phone || "",
        userEmail: user?.email || "",
        numberOfGuests: 2,

        // Local Booking Specific
        region: "",
        city: "",
        localDestination: "",
        date: defaultDate,
        entertainment: [],
        folkloreShow: [],
        customEntertainment: "",
        selectedActivities: [],
        selectedSeaTrips: [],
        customActivity: "",
        foodSelection: [],
        hotDrinksSelection: [],
        customDinnerLocal: "",

        // International fields
        checkInDate: defaultDate,
        checkOutDate: defaultDate,
        roomType: "standard",
        roomCount: 1,
        hotelAmenities: {
          breakfast: true,
          wifi: true,
          parking: false,
          pool: false
        },
        flightFrom: "JED",
        flightTo: flightTo,
        departureDate: defaultDate,
        returnDate: defaultDate,
        flightClass: "economy",
        passengers: 1,
        entertainmentInt: "",
        folkloreShowInt: false,
        activities: {
          sightseeing: false,
          culturalTours: false,
          shopping: false
        },
        foodPreferences: {
          hotDrinks: false,
          customDinner: false,
          other: ""
        },
        specialRequests: "",
       
      });
    }
  }, [isOpen, destination, user]);

  // global runtime error capture (helps reproduce the error inside the modal)
  useEffect(() => {
    const onError = (e) => {
      // Try multiple sources for a human-friendly message
      const msg = e?.message || (e?.error && e.error.message) || (e?.reason && e.reason.message) || (e?.detail && typeof e.detail === 'string' && e.detail) || 'An error occurred';
      // Enhanced logging to capture non-enumerable properties and cross-origin errors
      console.error('[ReservationModal] runtime error', e, { error: e?.error || null, reason: e?.reason || null, stack: e?.error?.stack || e?.stack || null });
      setRuntimeError(msg);
    };

    const onRejection = (e) => {
      const msg = e?.reason?.message || (typeof e?.reason === 'string' && e.reason) || JSON.stringify(e?.reason) || 'Unhandled promise rejection';
      console.error('[ReservationModal] unhandledrejection', e, { reason: e?.reason });
      setRuntimeError(msg);
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  // prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fetch available countries when modal opens for international booking
  useEffect(() => {
    if (isOpen && bookingLocation === "international") {
      const fetchCountries = async () => {
        try {
          setDestinationsLoading(true);
          const response = await fetch(`${API_URL}/international/destinations/countries`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
              setAvailableCountries(data.data);
            }
          }
        } catch (err) {
          console.error('Failed to fetch countries:', err);
        } finally {
          setDestinationsLoading(false);
        }
      };
      fetchCountries();
    }
  }, [isOpen, bookingLocation]);

  // Fetch destinations when country is selected (skip city selection)
  useEffect(() => {
    if (selectedCountry && bookingLocation === "international") {
      const fetchDestinations = async () => {
        try {
          setDestinationsLoading(true);
          const countryName = availableCountries.find(c => c.id === selectedCountry)?.name_en || selectedCountry;
          const response = await fetch(`${API_URL}/international/destinations/filter?country=${encodeURIComponent(countryName)}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
              setAvailableDestinations(data.data);
            }
          }
        } catch (err) {
          console.error('Failed to fetch destinations:', err);
        } finally {
          setDestinationsLoading(false);
        }
      };
      fetchDestinations();
      setSelectedDestination(null);
    }
  }, [selectedCountry, bookingLocation, availableCountries]);

  // When modal opens with a pre-selected destination, set the values
  useEffect(() => {
    if (isOpen && destination && bookingLocation === "international") {
      // If destination has country/city info, pre-select them
      if (destination.country_en || destination.destinationInfo?.country_en) {
        const countryEn = destination.country_en || destination.destinationInfo?.country_en;
        const countryId = countryEn ? countryEn.toLowerCase().replace(/\s+/g, '_') : '';
        if (countryId) {
          setSelectedCountry(countryId);
        }
      }
      if (destination.city_en || destination.destinationInfo?.city_en) {
        const cityEn = destination.city_en || destination.destinationInfo?.city_en;
        const cityId = cityEn ? cityEn.toLowerCase().replace(/\s+/g, '_') : '';
        if (cityId) {
          setTimeout(() => setSelectedCity(cityId), 500); // Delay to let cities load
        }
      }
      if (destination.id || destination.destinationInfo?.id) {
        const destId = destination.id || destination.destinationInfo?.id;
        setTimeout(() => setSelectedDestination(destId), 1000); // Delay to let destinations load
      }
    }
  }, [isOpen, destination, bookingLocation]);

 const content = {
    en: {
      title: "Book Your Trip",
      steps: ["Booking Type", "Details", "Contact Info"],
      bookingLocation: "Booking Type",
      bookLocally: "Activities",
      bookInternationally: "International Trip",
      selectRegion: "Select Region",
      selectCity: "Select City",
      selectCountry: "Select Country",
      selectDestination: "Select Destination",
      chooseCountry: "Choose a country",
      chooseCity: "Choose a city",
      chooseDestination: "Choose a destination",
      loadingDestinations: "Loading...",
      noDestinationsFound: "No destinations found",
      name: "Name",
      date: "Date",
      localDestination: "Specific Location",
      entertainmentOptions: "Entertainment Options",
      folkloreOptions: "Folklore & Cultural Shows",
      localActivities: "Activities",
      seaTrips: "Sea Trips",
      foodBeverages: "Food & Beverages",
      hotDrinksLocal: "Hot Drinks",
      otherOption: "Other (please specify)",
      bookingTypeTitle: "What would you like to book?",
      bookActivity: "Activities & Experience",
      bookHotel: "Hotel & Accommodation",
      bookFlight: "Flights",
      bookPackage: "Complete Package",
      activityTitle: "Activities & Experience",
      numberOfGuests: "Number of Guests",
      dates: "Dates",
      checkIn: "Check-in",
      checkOut: "Check-out",
      entertainment: "Entertainment 🎶",
      entertainmentPlaceholder: "Preferred entertainment (music, shows, etc.)",
      culturalShow: "Traditional Cultural Show",
      activities: "Activities 🌍",
      sightseeing: "Sightseeing",
      culturalTours: "Cultural Tours",
      shopping: "Shopping",

      hotelTitle: "Hotel & Accommodation",
      selectHotel: "Select Hotel",
      roomType: "Room Type",
      roomCount: "Number of Rooms",
      amenities: "Amenities",
      breakfastIncluded: "Breakfast Included",
      freeWifi: "Free WiFi",
      parking: "Parking",
      swimmingPool: "Swimming Pool",

      flightTitle: "Flight Booking",
      flightFrom: "From",
      flightTo: "To",
      departureDate: "Departure Date",
      returnDate: "Return Date",
      flightClass: "Class",
      economy: "Economy",
      business: "Business",
      first: "First Class",
      passengers: "Passengers",
      selectFlight: "Select Flight",
      airline: "Airline",
      departure: "Departure",
      duration: "Duration",

      phoneNumber: "Phone Number",
      email: "Email Address",
      destination: "Destination",
      foodDrinks: "Food & Drinks 🍽",
      hotDrinks: "Hot Drinks (Coffee, Tea)",
      customDinner: "Custom Dinner",
      otherPreferences: "Other Food Preferences",
      otherPreferencesPlaceholder: "Allergies, dietary restrictions, etc.",
      specialRequests: "Special Requests",
      specialRequestsPlaceholder: "Any additional requests or notes...",
      back: "Back",
      next: "Next",
      submit: "Complete Payment",
      processing: "Processing Payment...",
      success: "Booking Request Sent!",
      successMessage: "We'll contact you within 24 hours to confirm your booking.",
      close: "Close",
      required: "* Required fields",
      guestOptions: ["1","2","3","4","5","6","7","8","9","10","10+"],
      validationError: "Please fill all required fields"
    },
    ar: {
      title: "احجز رحلتك",
      steps: ["نوع الحجز", "التفاصيل", "معلومات التواصل"],
      
      // Location selection
      bookingLocation: "نوع الحجز",
      bookLocally: "  تنظيم فعالية",
      bookInternationally: "رحلة دولية",
      
      // Local booking specific
      selectRegion: "اختر المنطقة",
      selectCity: "اختر المدينة",
      selectCountry: "اختر الدولة",
      selectDestination: "اختر الوجهة",
      chooseCountry: "اختر دولة",
      chooseCity: "اختر مدينة",
      chooseDestination: "اختر وجهة",
      loadingDestinations: "جاري التحميل...",
      noDestinationsFound: "لم يتم العثور على وجهات",
      name: "الاسم",
      date: "التاريخ",
      localDestination: "الموقع المحدد",
      entertainmentOptions: "خيارات الترفيه",
      folkloreOptions: "العروض الشعبية والثقافية",
      localActivities: "الأنشطة",
      seaTrips: "رحلات بحرية",
      foodBeverages: "المأكولات والمشروبات",
      hotDrinksLocal: "مشروبات ساخنة",
      otherOption: "خيارات أخرى (يرجى التحديد)",
      
      // International booking
      bookingTypeTitle: "ماذا ترغب في حجزه؟",
      bookActivity: "الأنشطة والتجربة",
      bookHotel: "الفندق والإقامة",
      bookFlight: "رحلات الطيران",
      bookPackage: "باقة كاملة",
      
      activityTitle: "الأنشطة والتجربة",
      numberOfGuests: "عدد الأشخاص",
      dates: "التاريخ",
      checkIn: "تاريخ الوصول",
      checkOut: "تاريخ المغادرة",
      entertainment: "الترفيه 🎶",
      entertainmentPlaceholder: "الترفيه المفضل (موسيقى، عروض، إلخ)",
      culturalShow: "عرض ثقافي تقليدي",
      activities: "الأنشطة 🌍",
      sightseeing: "جولات سياحية",
      culturalTours: "جولات ثقافية",
      shopping: "تسوق",
      
      hotelTitle: "الفندق والإقامة",
      selectHotel: "اختر الفندق",
      roomType: "نوع الغرفة",
      roomCount: "عدد الغرف",
      amenities: "المرافق",
      breakfastIncluded: "إفطار مجاني",
      freeWifi: "واي فاي مجاني",
      parking: "موقف سيارات",
      swimmingPool: "مسبح",
      
      flightTitle: "حجز الطيران",
      flightFrom: "من",
      flightTo: "إلى",
      departureDate: "تاريخ السفر",
      returnDate: "تاريخ العودة",
      flightClass: "الدرجة",
      economy: "اقتصادية",
      business: "رجال الأعمال",
      first: "درجة أولى",
      passengers: "المسافرين",
      selectFlight: "اختر الرحلة",
      airline: "الخطوط الجوية",
      departure: "مغادرة",
      duration: "المدة",
      
      phoneNumber: "رقم الجوال",
      email: "عنوان البريد الإلكتروني",
      destination: "الوجهة",
      foodDrinks: "المأكولات والمشروبات 🍽",
      hotDrinks: "مشروبات ساخنة (قهوة، شاي)",
      customDinner: "عشاء حسب الرغبة",
      otherPreferences: "تفضيلات طعام أخرى",
      otherPreferencesPlaceholder: "حساسية، قيود غذائية، إلخ",
      specialRequests: "طلبات خاصة",
      specialRequestsPlaceholder: "أي طلبات إضافية أو ملاحظات...",
      back: "رجوع",
      next: "التالي",
      submit: "إكمال الدفع",
      processing: "معالجة الدفع...",
      success: "تم إرسال طلب الحجز!",
      successMessage: "سنتصل بك خلال 24 سلة لتأكيد حجزك.",
      close: "إغلاق",
      required: "* الحقول المطلوبة",
      guestOptions: ["١","٢","٣","٤","٥","٦","٧","٨","٩","١٠","١٠+"],
      validationError: "يرجى ملء جميع الحقول المطلوبة"
    },
    zh: {
      title: "预订您的旅程",
      steps: ["预订类型", "详细信息", "联系信息"],
      
      // Location selection
      bookingLocation: "预订类型",
      bookLocally: "活动",
      bookInternationally: "国际旅行",
      
      // Local booking specific
      selectRegion: "选择地区",
      selectCity: "选择城市",
      selectCountry: "选择国家",
      selectDestination: "选择目的地",
      chooseCountry: "选择一个国家",
      chooseCity: "选择一个城市",
      chooseDestination: "选择一个目的地",
      loadingDestinations: "加载中...",
      noDestinationsFound: "未找到目的地",
      name: "姓名",
      date: "日期",
      localDestination: "具体位置",
      entertainmentOptions: "娱乐选项",
      folkloreOptions: "民俗文化表演",
      localActivities: "活动",
      seaTrips: "海上旅行",
      foodBeverages: "食品和饮料",
      hotDrinksLocal: "热饮",
      otherOption: "其他（请具体说明）",
      
      // International booking
      bookingTypeTitle: "您想预订什么？",
      bookActivity: "活动和体验",
      bookHotel: "酒店住宿",
      bookFlight: "航班",
      bookPackage: "完整套餐",
      
      activityTitle: "活动和体验",
      numberOfGuests: "客人数量",
      dates: "日期",
      checkIn: "入住日期",
      checkOut: "退房日期",
      entertainment: "娱乐 🎶",
      entertainmentPlaceholder: "首选的娱乐活动（音乐、表演等）",
      culturalShow: "传统文化表演",
      activities: "活动 🌍",
      sightseeing: "观光",
      culturalTours: "文化游览",
      shopping: "购物",
      
      hotelTitle: "酒店住宿",
      selectHotel: "选择酒店",
      roomType: "房型",
      roomCount: "房间数量",
      amenities: "设施",
      breakfastIncluded: "包含早餐",
      freeWifi: "免费WiFi",
      parking: "停车场",
      swimmingPool: "游泳池",
      
      flightTitle: "航班预订",
      flightFrom: "出发地",
      flightTo: "目的地",
      departureDate: "出发日期",
      returnDate: "返回日期",
      flightClass: "舱位等级",
      economy: "经济舱",
      business: "商务舱",
      first: "头等舱",
      passengers: "乘客",
      selectFlight: "选择航班",
      airline: "航空公司",
      departure: "出发时间",
      duration: "时长",
      
      phoneNumber: "电话号码",
      email: "电子邮件地址",
      destination: "目的地",
      foodDrinks: "食品和饮料 🍽",
      hotDrinks: "热饮（咖啡、茶）",
      customDinner: "定制晚餐",
      otherPreferences: "其他食物偏好",
      otherPreferencesPlaceholder: "过敏、饮食限制等",
      specialRequests: "特殊要求",
      specialRequestsPlaceholder: "任何额外要求或备注...",
      back: "返回",
      next: "下一步",
      submit: "完成支付",
      processing: "处理支付中...",
      success: "预订请求已发送！",
      successMessage: "我们将在24小时内联系您确认您的预订。",
      close: "关闭",
      required: "* 必填字段",
      guestOptions: ["1","2","3","4","5","6","7","8","9","10","10+"],
      validationError: "请填写所有必填字段"
    }
  };
  const t = content[lang] || content.en;

  const handleInputChange = (e) => {
    const { name, value: rawValue, type, checked } = e.target;
    // coerce numeric inputs to Number while allowing empty string during typing
    const value = type === 'number' ? (rawValue === '' ? '' : Number(rawValue)) : rawValue;

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    if (showValidationError) {
      setShowValidationError(false);
    }
  }; 

  const handleBookingTypeChange = (type) => {
    setBookingType(type);
    setFormData(prev => ({ ...prev, bookingType: type }));
    setShowValidationError(false);
  };

  const handleLocalToggle = (field, value) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [field]: updatedArray
      };
    });
  };

  const handleActivityToggle = (activity) => {
    setFormData(prev => ({
      ...prev,
      activities: {
        ...prev.activities,
        [activity]: !prev.activities[activity]
      }
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      hotelAmenities: {
        ...prev.hotelAmenities,
        [amenity]: !prev.hotelAmenities[amenity]
      }
    }));
  };

  const handleFoodToggle = (food) => {
    setFormData(prev => ({
      ...prev,
      foodPreferences: {
        ...prev.foodPreferences,
        [food]: !prev.foodPreferences[food]
      }
    }));
  };

  const isStepValid = () => {
    if (bookingLocation === "local") {
      switch (currentStep) {
        case 1:
          return formData.name && formData.region && formData.city && formData.date && formData.numberOfGuests;
        case 2:
          return true; // Activities step is optional
        case 3:
          return formData.phoneNumber && 
                 formData.userEmail && 
                 /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail);
      default:
          return false;
      }
    } else {
      switch (currentStep) {
        case 1:
          return !!formData.bookingType;
        case 2:
          if (formData.bookingType === "activity") {
            return formData.checkInDate && formData.checkOutDate && formData.numberOfGuests;
          } else if (formData.bookingType === "hotel") {
            return formData.checkInDate && formData.checkOutDate;
          } else if (formData.bookingType === "flight") {
            return formData.flightFrom && formData.flightTo && formData.departureDate;
          } else if (formData.bookingType === "package") {
            return formData.checkInDate && formData.checkOutDate;
          }
          return false;
        case 3:
          return formData.phoneNumber && 
                 formData.userEmail && 
                 /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail);
     default:
          return false;
      }
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      if (isStepValid()) {
        setCurrentStep(currentStep + 1);
        setShowValidationError(false);
      } else {
        setShowValidationError(true);
        const modalContent = document.querySelector('.modal-content-scroll');
        if (modalContent) {
          modalContent.scrollTop = 0;
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowValidationError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === 3) {
      if (!isStepValid()) {
        setShowValidationError(true);
        return;
      }

      try {
        setIsSubmitted(true);
        
        const bookingData = bookingLocation === "local" ? {
          source: "local",
          bookingLocation: "local",
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          userEmail: formData.userEmail,
          numberOfGuests: formData.numberOfGuests,
          region: formData.region,
          city: formData.city,
          destination: formData.localDestination,
          date: formData.date,
          entertainment: formData.entertainment,
          folkloreShow: formData.folkloreShow,
          customEntertainment: formData.customEntertainment,
          selectedActivities: formData.selectedActivities,
          selectedSeaTrips: formData.selectedSeaTrips,
          customActivity: formData.customActivity,
          foodSelection: formData.foodSelection,
          hotDrinks: formData.hotDrinksSelection,
          customDinner: formData.customDinnerLocal,
          specialRequests: formData.specialRequests,
          lang: lang
        } : {
          source: "international",
          bookingType: formData.bookingType,
          // Include dynamic destination selection data
          destinationId: selectedDestination || destination?.id || null,
          destination: (() => {
            // Get selected destination name from dynamic selection or fall back to pre-selected
            const selectedDest = selectedDestination 
              ? availableDestinations.find(d => d.id === selectedDestination) 
              : null;
            if (selectedDest) {
              return lang === 'ar' ? selectedDest.name_ar : selectedDest.name_en;
            }
            return destination?.title || null;
          })(),
          country: (() => {
            const country = availableCountries.find(c => c.id === selectedCountry);
            if (country) {
              return lang === 'ar' ? country.name_ar : (lang === 'zh' ? (country.name_zh || country.name_en) : country.name_en);
            }
            return destination?.country_en || null;
          })(),
          city: (() => {
            const city = availableCities.find(c => c.id === selectedCity);
            if (city) {
              return lang === 'ar' ? city.name_ar : (lang === 'zh' ? (city.name_zh || city.name_en) : city.name_en);
            }
            return destination?.city_en || null;
          })(),
          numberOfGuests: formData.numberOfGuests,
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          phoneNumber: formData.phoneNumber,
          userEmail: formData.userEmail,
          roomType: formData.roomType,
          roomCount: formData.roomCount,
          hotelAmenities: formData.hotelAmenities,
          flightFrom: formData.flightFrom,
          flightTo: formData.flightTo,
          departureDate: formData.departureDate,
          returnDate: formData.returnDate,
          flightClass: formData.flightClass,
          passengers: formData.passengers,
          entertainment: formData.entertainmentInt,
          culturalShow: formData.folkloreShowInt,
          activities: formData.activities,
          foodPreferences: formData.foodPreferences,
          specialRequests: formData.specialRequests,
          lang: lang,
          bookingLocation: "international"
        };

        // Validate preferred date locally before sending
        let preferredDate = bookingLocation === 'local' ? formData.date : (formData.checkInDate || formData.departureDate || null);
        
        // Fallback to default date if somehow empty
        if (!preferredDate) {
          preferredDate = defaultDate;
        }
        
        if (!preferredDate) {
          setSubmitError(lang === 'ar' ? 'الرجاء اختيار التاريخ المفضل' : (lang === 'zh' ? '请选择首选日期。' : 'Please select a preferred date.'));
          setIsSubmitted(false);
          return;
        }

        // Compare date-only (local) to avoid timezone issues
        const today = new Date();
        today.setHours(0,0,0,0);
        const pref = new Date(preferredDate + 'T00:00:00');
        pref.setHours(0,0,0,0);
        if (pref < today) {
          setSubmitError(lang === 'ar' ? 'التاريخ يجب أن يكون اليوم أو بعد اليوم' : (lang === 'zh' ? '首选日期必须是今天或之后。' : 'Preferred date must be today or later.'));
          setIsSubmitted(false);
          return;
        }

        setSubmitError(null);

        // Submit to backend reservations API
        const token = getToken();
        const headers = {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const response = await fetch(`${API_URL}/reservations`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            name: bookingLocation === 'local' ? formData.name : (formData.name || destination?.title || ''),
            email: formData.userEmail,
            phone: formData.phoneNumber,
            trip_type: formData.bookingType || null,
            trip_slug: destination?.slug || null,
            trip_title: (() => {
              if (bookingLocation === 'local') {
                return formData.localDestination || null;
              }
              // Use dynamically selected destination name
              const selectedDest = selectedDestination 
                ? availableDestinations.find(d => d.id === selectedDestination) 
                : null;
              if (selectedDest) {
                return lang === 'ar' ? selectedDest.name_ar : selectedDest.name_en;
              }
              return destination?.title || null;
            })(),
            preferred_date: preferredDate,
            guests: Number(formData.numberOfGuests) || 1,
            notes: formData.specialRequests,
            details: bookingData,
          })
        });

        const result = await response.json();

        if (!response.ok) {
          const msg = result?.message || (result?.errors ? (typeof result.errors === 'object' ? Object.values(result.errors).flat(1).join('; ') : JSON.stringify(result.errors)) : 'Failed to submit reservation');
          setSubmitError(msg);
          setIsSubmitted(false);
          return;
        }

        // Show confirmation and reservation reference
        setReservationRef(result.reservation?.id || null);
        setIsSubmitted(true);

        // Notify dashboard to refresh so new reservation appears
        try {
          triggerDashboardRefresh();
        } catch (e) {
          console.error('Failed to trigger dashboard refresh', e);
        }

        setTimeout(() => {
          closeReservationModal();
          setIsSubmitted(false);
          setReservationRef(null);
        }, 3000);
      } catch (error) {
        console.error("Booking submission error:", error);
        setIsSubmitted(false);
        setSubmitError(error?.message || (lang === 'ar' ? 'حدث خطأ في إرسال الحجز' : lang === 'zh' ? '发送预订时出错' : 'Error submitting booking'));
        alert(lang === "ar" ? "حدث خطأ في إرسال الحجز" : "Error submitting booking: " + (error?.message || ''));
      }
    } else {
      nextStep();
    }
  };

  if (!isOpen) return null;

  const progressPercentage = (currentStep / 3) * 100;

  // ========== RENDER FUNCTIONS ==========

  // Step 1 Renderer
  const renderStep1 = () => {
    if (bookingLocation === "local") {
      return renderLocalStep1();
    } else {
      return renderInternationalStep1();
    }
  };

  const renderLocalStep1 = () => (
    <motion.div
      key="local-step1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="row g-3"
      style={{ flex: 1 }}
    >
      <div className="col-12">
        <h5 className="text-center mb-4" style={{ color: "#fff", fontSize: "1.2rem" }}>
          {t.name} & {t.destination}
        </h5>
      </div>

      <div className="col-md-6">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <User size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.name}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="form-control"
          placeholder={lang === "ar" ? "مثال: أمان" : "Example: Aman"}
          required
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <MapPin size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.selectRegion}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <select
          name="region"
          value={formData.region}
          onChange={handleInputChange}
          className="form-select"
          required
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        >
          <option value="">{lang === "ar" ? "اختر المنطقة" : "Select Region"}</option>
          {saudiRegions.map(region => (
            <option key={region.id} value={region.id}>
              {region.name[lang]}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <MapPin size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.selectCity}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <select
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          className="form-select"
          required
          disabled={!formData.region}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        >
          <option value="">{lang === "ar" ? "اختر المدينة" : "Select City"}</option>
          {formData.region && saudiRegions
            .find(r => r.id === formData.region)
            ?.cities.map((city) => (
              <option key={city.en} value={city[lang] || city.en}>
                {city[lang] || city.en}
              </option>
            ))
          }
        </select>
      </div>

      <div className="col-md-6">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <MapPin size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.localDestination}</span>
        </label>
        <input
          type="text"
          name="localDestination"
          value={formData.localDestination}
          onChange={handleInputChange}
          className="form-control"
          placeholder={lang === "ar" ? "مثال: جدة" : "Example: Jeddah"}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <Calendar size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.date}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="form-control"
          required
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: "#fff" }}>
          <Users size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.numberOfGuests}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <input
          type="number"
          name="numberOfGuests"
          min={1}
          step={1}
          value={formData.numberOfGuests}
          onChange={handleInputChange}
          className="form-control"
          placeholder={lang === "ar" ? "أدخل عدد الأشخاص" : "Enter number of guests"}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
            width: "140px"
          }}
        />
      </div>
    </motion.div>
  );

  const renderInternationalStep1 = () => {
    // Get the selected destination object for display
    const selectedDest = selectedDestination 
      ? availableDestinations.find(d => d.id === selectedDestination) 
      : null;

    return (
      <motion.div
        key="international-step1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="row g-3"
        style={{ flex: 1 }}
      >
        <div className="col-12">
          <h5 className="text-center mb-4" style={{ color: "#fff", fontSize: "1.2rem" }}>
            {t.bookingTypeTitle}
          </h5>
        </div>

        {/* Booking Type Selection */}
        <div className="col-12 d-flex justify-content-center mb-3">
          <div className="col-md-6 px-0">
            <button
              type="button"
              onClick={() => handleBookingTypeChange('activity')}
              className={`btn w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3 ${bookingType === 'activity' ? 'btn-warning' : 'btn-outline-light'}`}
              style={{
                borderRadius: "15px",
                height: "100px",
                border: bookingType === 'activity' ? "2px solid #dfa528" : "1px solid rgba(255,255,255,0.3)",
                background: bookingType === 'activity' ? "rgba(223, 165, 40, 0.1)" : "transparent",
              }}
            >
              <Globe size={30} className="mb-2" />
              <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
                {t.bookActivity}
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Destination Selection */}
        <div className="col-12">
          <div className="bg-dark bg-opacity-25 rounded-3 p-3">
            <h6 className="text-warning mb-3 d-flex align-items-center gap-2">
              <MapPin size={18} />
              {lang === 'ar' ? 'اختر الوجهة' : lang === 'zh' ? '选择目的地' : 'Select Destination'}
            </h6>

            {/* Country Manual Input */}
            <div className="mb-3">
              <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
                <Globe size={16} className="text-warning" />
                <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{lang === 'ar' ? 'الدولة' : lang === 'zh' ? '国家' : 'Country'}</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={lang === 'ar' ? 'أدخل اسم الدولة' : lang === 'zh' ? '输入国家名称（例如：泰国）' : 'Enter country name (e.g., Thailand)'}
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "0.9rem",
                }}
              />
            </div>

            {/* City Manual Input - shows when country is entered */}
            {selectedCountry && (
              <div className="mb-3">
                <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
                  <MapPin size={16} className="text-warning" />
                  <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{lang === 'ar' ? 'المدينة' : lang === 'zh' ? '城市' : 'City'}</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={lang === 'ar' ? 'أدخل اسم المدينة' : lang === 'zh' ? '输入城市名称（例如：曼谷）' : 'Enter city name (e.g., Bangkok)'}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
            )}

            {/* Show pre-selected destination from booking button if not using manual input */}
            {destination && !selectedCountry && !selectedCity && (
              <div className="bg-dark bg-opacity-50 rounded-3 p-3 mt-2">
                <h6 className="mb-1" style={{ color: "#fff", fontSize: "0.95rem" }}>
                  {destination?.title}
                </h6>
                <p className="mb-0 small" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>
                  {destination?.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Step 2 Renderer
  const renderStep2 = () => {
    if (bookingLocation === "local") {
      return renderLocalStep2();
    } else {
      return renderInternationalStep2();
    }
  };

  const renderLocalStep2 = () => (
    <motion.div
      key="local-step2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="row g-2"
      style={{ flex: 1 }}
    >
      <div className="col-12 mb-2">
        <h5 className="text-warning mb-3 d-flex align-items-center gap-2">
          <Target size={20} />
          {lang === "ar" ? "اختر الأنشطة والخدمات" : "Select Activities & Services"}
        </h5>
      </div>

      {/* Entertainment Options */}
      <div className="col-12 mb-3">
        <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: "#fff" }}>
          <Music size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.entertainmentOptions}</span>
        </label>
        <div className="row g-2">
          {localActivities.entertainment.map(item => (
            <div key={item.id} className="col-md-6 mb-2">
              <button
                type="button"
                onClick={() => handleLocalToggle('entertainment', item.id)}
                className={`btn w-100 d-flex align-items-center justify-content-start gap-2 ${formData.entertainment.includes(item.id) ? 'btn-warning' : 'btn-outline-light'}`}
                style={{ 
                  borderRadius: "8px", 
                  padding: "8px 12px",
                  fontSize: "0.85rem",
                  minHeight: "45px",
                }}
              >
                {item.id === "dj" && <Music size={14} />}
                {item.id === "singer" && <User size={14} />}
                {item.id === "band" && <Users size={14} />}
                {item.id === "games" && <Gamepad size={14} />}
                <span>{item.name[lang]}</span>
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <input
            type="text"
            name="customEntertainment"
            value={formData.customEntertainment}
            onChange={handleInputChange}
            className="form-control form-control-sm"
            placeholder={t.otherOption}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "0.85rem",
            }}
          />
        </div>
      </div>

      {/* Folklore Shows */}
      <div className="col-12 mb-3">
        <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: "#fff" }}>
          <Crown size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.folkloreOptions}</span>
        </label>
        <div className="row g-2">
          {localActivities.folkloreShows.map(item => (
            <div key={item.id} className="col-md-6 mb-2">
              <button
                type="button"
                onClick={() => handleLocalToggle('folkloreShow', item.id)}
                className={`btn w-100 d-flex align-items-center justify-content-start gap-2 ${formData.folkloreShow.includes(item.id) ? 'btn-warning' : 'btn-outline-light'}`}
                style={{ 
                  borderRadius: "8px", 
                  padding: "8px 12px",
                  fontSize: "0.85rem",
                  minHeight: "45px",
                }}
              >
                {item.id === "ardha" && <Crown size={14} />}
                {item.id === "mizmar" && <Music size={14} />}
                {item.id === "samri" && <Users size={14} />}
                {item.id === "khaliji" && <Music size={14} />}
                <span>{item.name[lang]}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div className="col-12 mb-3">
        <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: "#fff" }}>
          <Compass size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.localActivities}</span>
        </label>
        <div className="row g-2">
          {localActivities.activities.map(item => (
            <div key={item.id} className="col-md-6 mb-2">
              <button
                type="button"
                onClick={() => handleLocalToggle('selectedActivities', item.id)}
                className={`btn w-100 d-flex align-items-center justify-content-start gap-2 ${formData.selectedActivities.includes(item.id) ? 'btn-warning' : 'btn-outline-light'}`}
                style={{ 
                  borderRadius: "8px", 
                  padding: "8px 12px",
                  fontSize: "0.85rem",
                  minHeight: "45px",
                }}
              >
                {item.id === "horse" && <Target size={14} />}
                {item.id === "atv" && <Car size={14} />}
                {item.id === "camel" && <Users size={14} />}
                {item.id === "diving" && <WavesIcon size={14} />}
                {item.id === "safari" && <Compass size={14} />}
                {item.id === "climbing" && <Mountain size={14} />}
                {item.id === "hiking" && <Compass size={14} />}
                <span>{item.name[lang]}</span>
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <input
            type="text"
            name="customActivity"
            value={formData.customActivity}
            onChange={handleInputChange}
            className="form-control form-control-sm"
            placeholder={t.otherOption}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "0.85rem",
            }}
          />
        </div>
      </div>

      {/* Sea Trips */}
      <div className="col-12 mb-3">
        <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: "#fff" }}>
          <Ship size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.seaTrips}</span>
        </label>
        <div className="row g-2">
          {localActivities.seaTrips.map(item => (
            <div key={item.id} className="col-md-4 mb-2">
              <button
                type="button"
                onClick={() => handleLocalToggle('selectedSeaTrips', item.id)}
                className={`btn w-100 d-flex flex-column align-items-center justify-content-center gap-1 ${formData.selectedSeaTrips.includes(item.id) ? 'btn-warning' : 'btn-outline-light'}`}
                style={{ 
                  borderRadius: "8px", 
                  padding: "10px 6px",
                  fontSize: "0.8rem",
                  minHeight: "70px",
                }}
              >
                {item.id === "yacht" && <Ship size={16} />}
                {item.id === "boat" && <Ship size={16} />}
                {item.id === "fishing" && <Fish size={16} />}
                <span className="text-center" style={{ fontSize: "0.75rem" }}>{item.name[lang]}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Food & Beverages */}
      <div className="col-12 mb-3">
        <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: "#fff" }}>
          <Utensils size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.foodBeverages}</span>
        </label>
        <div className="row g-2">
          {localActivities.foodBeverages.map(item => (
            <div key={item.id} className="col-md-6 mb-2">
              <button
                type="button"
                onClick={() => handleLocalToggle('foodSelection', item.id)}
                className={`btn w-100 d-flex align-items-center justify-content-start gap-2 ${formData.foodSelection.includes(item.id) ? 'btn-warning' : 'btn-outline-light'}`}
                style={{ 
                  borderRadius: "8px", 
                  padding: "8px 12px",
                  fontSize: "0.85rem",
                  minHeight: "45px",
                }}
              >
                <Utensils size={14} />
                <span>{item.name[lang]}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hot Drinks */}
      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: "#fff" }}>
          <Coffee size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.hotDrinksLocal}</span>
        </label>
        <div className="row g-2">
          {localActivities.hotDrinks.map(item => (
            <div key={item.id} className="col-md-6 mb-2">
              <button
                type="button"
                onClick={() => handleLocalToggle('hotDrinksSelection', item.id)}
                className={`btn w-100 d-flex align-items-center justify-content-start gap-2 ${formData.hotDrinksSelection.includes(item.id) ? 'btn-warning' : 'btn-outline-light'}`}
                style={{ 
                  borderRadius: "8px", 
                  padding: "8px 12px",
                  fontSize: "0.85rem",
                  minHeight: "45px",
                }}
              >
                <Coffee size={14} />
                <span>{item.name[lang]}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderInternationalStep2 = () => {
    if (bookingType === "activity") {
      return renderActivityDetails();
    } else if (bookingType === "hotel") {
      return renderHotelDetails();
    } else if (bookingType === "flight") {
      return renderFlightDetails();
    } else {
      return renderPackageDetails();
    }
  };

  const renderActivityDetails = () => (
    <motion.div
      key="activity-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="row g-2"
      style={{ flex: 1 }}
    >
      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: "#fff" }}>
          <MapPin size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.destination}</span>
        </label>
        <div className="bg-dark bg-opacity-50 rounded-3 p-2">
          <h5 className="mb-1" style={{ fontSize: "1rem", color: "#fff" }}>{destination?.title}</h5>
          <p className="mb-0 small" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>
            {destination?.description}
          </p>
        </div>
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <Calendar size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.dates}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label small mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>{t.checkIn} *</label>
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleInputChange}
              className="form-control"
              required
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "0.9rem",
              }}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>{t.checkOut} *</label>
            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleInputChange}
              className="form-control"
              required
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "0.9rem",
              }}
            />
          </div>
        </div>
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: "#fff" }}>
          <Users size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.numberOfGuests}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <input
          type="number"
          name="numberOfGuests"
          min={1}
          step={1}
          value={formData.numberOfGuests}
          onChange={handleInputChange}
          className="form-control"
          placeholder={lang === "ar" ? "أدخل عدد الأشخاص" : "Enter number of guests"}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
            width: "140px"
          }}
        />
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <Music size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.entertainment}</span>
        </label>
        <input
          type="text"
          name="entertainmentInt"
          value={formData.entertainmentInt}
          onChange={handleInputChange}
          className="form-control"
          placeholder={t.entertainmentPlaceholder}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        />
        
        <div className="form-check mt-2">
          <input
            className="form-check-input"
            type="checkbox"
            name="folkloreShowInt"
            id="folkloreShowInt"
            checked={formData.folkloreShowInt}
            onChange={handleInputChange}
            style={{
              backgroundColor: formData.folkloreShowInt ? "#dfa528" : "transparent",
              borderColor: "#dfa528",
            }}
          />
          <label className="form-check-label ms-2" htmlFor="folkloreShowInt" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.9)" }}>
            <Trophy size={13} className="me-1" />
            {t.culturalShow}
          </label>
        </div>
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: "#fff" }}>
          <Target size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.activities}</span>
        </label>
        <div className="row g-2">
          <div className="col-md-4">
            <button
              type="button"
              onClick={() => handleActivityToggle('sightseeing')}
              className={`btn w-100 d-flex align-items-center justify-content-center gap-1 ${formData.activities.sightseeing ? 'btn-warning' : 'btn-outline-light'}`}
              style={{ 
                borderRadius: "8px", 
                padding: "8px 6px",
                fontSize: "0.8rem",
                minHeight: "40px",
              }}
            >
              <Globe size={14} />
              {t.sightseeing}
            </button>
          </div>
          <div className="col-md-4">
            <button
              type="button"
              onClick={() => handleActivityToggle('culturalTours')}
              className={`btn w-100 d-flex align-items-center justify-content-center gap-1 ${formData.activities.culturalTours ? 'btn-warning' : 'btn-outline-light'}`}
              style={{ 
                borderRadius: "8px", 
                padding: "8px 6px",
                fontSize: "0.8rem",
                minHeight: "40px",
              }}
            >
              <Briefcase size={14} />
              {t.culturalTours}
            </button>
          </div>
          <div className="col-md-4">
            <button
              type="button"
              onClick={() => handleActivityToggle('shopping')}
              className={`btn w-100 d-flex align-items-center justify-content-center gap-1 ${formData.activities.shopping ? 'btn-warning' : 'btn-outline-light'}`}
              style={{ 
                borderRadius: "8px", 
                padding: "8px 6px",
                fontSize: "0.8rem",
                minHeight: "40px",
              }}
            >
              <ShoppingBag size={14} />
              {t.shopping}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderHotelDetails = () => (
    <motion.div
      key="hotel-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="row g-2"
      style={{ flex: 1 }}
    >
      <div className="col-12 mb-2">
        <h5 className="text-warning mb-3 d-flex align-items-center gap-2">
          <Hotel size={20} />
          {t.hotelTitle}
        </h5>
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <Calendar size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.dates}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label small mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>{t.checkIn} *</label>
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleInputChange}
              className="form-control"
              required
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "0.9rem",
              }}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>{t.checkOut} *</label>
            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleInputChange}
              className="form-control"
              required
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "0.9rem",
              }}
            />
          </div>
        </div>
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <Bed size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.roomCount}</span>
        </label>
        <div className="d-flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, roomCount: num }))}
              className={`btn px-3 py-2 ${formData.roomCount === num ? 'btn-warning' : 'btn-outline-light'}`}
              style={{ 
                borderRadius: "10px", 
                fontSize: "0.85rem",
              }}
            >
              {num} {lang === "ar" ? "غرفة" : "Room"}{num > 1 ? (lang === "ar" ? "غرف" : "s") : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: "#fff" }}>
          <Star size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.amenities}</span>
        </label>
        <div className="row g-2">
          <div className="col-md-6">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="breakfast"
                checked={formData.hotelAmenities.breakfast}
                onChange={() => handleAmenityToggle('breakfast')}
                style={{
                  backgroundColor: formData.hotelAmenities.breakfast ? "#dfa528" : "transparent",
                  borderColor: "#dfa528",
                }}
              />
              <label className="form-check-label ms-2" htmlFor="breakfast" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.9)" }}>
                <CoffeeIcon size={13} className="me-1" />
                {t.breakfastIncluded}
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="wifi"
                checked={formData.hotelAmenities.wifi}
                onChange={() => handleAmenityToggle('wifi')}
                style={{
                  backgroundColor: formData.hotelAmenities.wifi ? "#dfa528" : "transparent",
                  borderColor: "#dfa528",
                }}
              />
              <label className="form-check-label ms-2" htmlFor="wifi" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.9)" }}>
                <Wifi size={13} className="me-1" />
                {t.freeWifi}
              </label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderFlightDetails = () => (
    <motion.div
      key="flight-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="row g-2"
      style={{ flex: 1 }}
    >
      <div className="col-12 mb-2">
        <h5 className="text-warning mb-3 d-flex align-items-center gap-2">
          <Plane size={20} />
          {t.flightTitle}
        </h5>
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <MapPin size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.flightFrom}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <select
          name="flightFrom"
          value={formData.flightFrom}
          onChange={handleInputChange}
          className="form-select"
          required
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        >
          <option value="JED">Jeddah (JED)</option>
          <option value="RUH">Riyadh (RUH)</option>
          <option value="DMM">Dammam (DMM)</option>
          <option value="MED">Madinah (MED)</option>
        </select>
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <MapPin size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.flightTo}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <select
          name="flightTo"
          value={formData.flightTo}
          onChange={handleInputChange}
          className="form-select"
          required
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        >
          <option value="DXB">Dubai (DXB)</option>
          <option value="IST">Istanbul (IST)</option>
          <option value="LHR">London (LHR)</option>
          <option value="BKK">Bangkok (BKK)</option>
          <option value="CDG">Paris (CDG)</option>
          <option value="MLE">Maldives (MLE)</option>
        </select>
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <Calendar size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.departureDate}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <input
          type="date"
          name="departureDate"
          value={formData.departureDate}
          onChange={handleInputChange}
          className="form-control"
          required
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: "#fff" }}>
          <Users size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.flightClass}</span>
        </label>
        <div className="d-flex flex-wrap gap-2">
          {["economy", "business", "first"].map((flightClass) => (
            <button
              key={flightClass}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, flightClass }))}
              className={`btn px-3 py-2 ${formData.flightClass === flightClass ? 'btn-warning' : 'btn-outline-light'}`}
              style={{ 
                borderRadius: "10px", 
                fontSize: "0.85rem",
              }}
            >
              {flightClass === "economy" ? t.economy :
               flightClass === "business" ? t.business : t.first}
            </button>
          ))}
        </div>
      </div>

      <div className="col-12 mb-2">
        <h6 className="text-white mb-2" style={{ fontSize: "0.9rem" }}>{t.selectFlight}</h6>
        <div className="bg-dark bg-opacity-25 rounded-3 p-2" style={{ maxHeight: "150px", overflowY: "auto" }}>
          {flightOptions.map((flight, index) => (
            <div key={index} className="p-2 border-bottom border-dark">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold small">{flight.airline}</div>
                  <div className="small text-white-50">
                    {flight.from} → {flight.to} • {flight.time}
                  </div>
                </div>
                <div className="text-end">
                  <div className="text-warning fw-bold">{flight.price}</div>
                  <div className="small text-white-50">{flight.duration}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderPackageDetails = () => (
    <motion.div
      key="package-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="row g-2"
      style={{ flex: 1 }}
    >
      <div className="col-12">
        <h5 className="text-warning mb-3">{t.bookPackage}</h5>
        <div className="bg-dark bg-opacity-25 rounded-3 p-3 mb-3">
          <div className="d-flex align-items-center gap-2 mb-2">
            <ShoppingBag size={18} className="text-warning" />
            <span className="fw-bold" style={{ fontSize: "0.95rem", color: "#fff" }}>
              {t.bookHotel} + {t.bookFlight} + {t.bookActivity}
            </span>
          </div>
          <p className="small text-white-50 mb-0">
            {lang === "ar" 
              ? "باقة شاملة تشمل: الإقامة الفندقية + تذاكر الطيران + الأنشطة والترفيه" 
              : "Complete package including: Hotel accommodation + Flight tickets + Activities & Entertainment"}
          </p>
        </div>
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <Calendar size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.dates}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label small mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>{t.checkIn} *</label>
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleInputChange}
              className="form-control"
              required
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "0.9rem",
              }}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>{t.checkOut} *</label>
            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleInputChange}
              className="form-control"
              required
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "0.9rem",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Step 3 Renderer
  const renderStep3 = () => {
    if (bookingLocation === "local") {
      return renderLocalStep3();
    } else {
      return renderInternationalStep3();
    }
  };

  const renderLocalStep3 = () => (
    <motion.div
      key="local-step3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="row g-2"
      style={{ flex: 1 }}
    >
      <div className="col-12 mb-2">
        <h5 className="text-warning mb-3">{lang === "ar" ? "معلومات التواصل" : "Contact Information"}</h5>
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <Phone size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.phoneNumber}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="form-control"
          placeholder={lang === "ar" ? "+966 5X XXX XXXX" : "+966 5X XXX XXXX"}
          required
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <Mail size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.email}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <input
          type="email"
          name="userEmail"
          value={formData.userEmail}
          onChange={handleInputChange}
          className="form-control"
          placeholder={lang === "ar" ? "amanshah12sweer@gmail.com" : "amanshah12sweer@gmail.com"}
          required
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <User size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.specialRequests}</span>
        </label>
        <textarea
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleInputChange}
          className="form-control"
          rows="3"
          placeholder={t.specialRequestsPlaceholder}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
            resize: "vertical",
          }}
        />
      </div>

      <div className="col-12 mb-2">
        <div className="bg-dark bg-opacity-25 rounded-3 p-2 mt-1">
          <h6 className="text-warning mb-2" style={{ fontSize: "0.9rem" }}>
            {lang === "ar" ? "ملخص الحجز المحلي" : "Local Booking Summary"}
          </h6>
          <div className="row small" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>
            <div className="col-6">{t.name}:</div>
            <div className="col-6 text-end">{formData.name}</div>
            
            <div className="col-6">{t.selectRegion}:</div>
            <div className="col-6 text-end">
              {saudiRegions.find(r => r.id === formData.region)?.name[lang]}
            </div>
            
            <div className="col-6">{t.selectCity}:</div>
            <div className="col-6 text-end">{formData.city}</div>
            
            <div className="col-6">{t.date}:</div>
            <div className="col-6 text-end">{formData.date}</div>
            
            <div className="col-6">{t.numberOfGuests}:</div>
            <div className="col-6 text-end">{formData.numberOfGuests} {lang === "ar" ? "أشخاص" : "People"}</div>
            
            {formData.selectedActivities.length > 0 && (
              <>
                <div className="col-6">{t.localActivities}:</div>
                <div className="col-6 text-end">
                  {formData.selectedActivities.length} {lang === "ar" ? "نشاط" : "Activity"}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderInternationalStep3 = () => (
    <motion.div
      key="international-step3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="row g-2"
      style={{ flex: 1 }}
    >
      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <Phone size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.phoneNumber}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="form-control"
          placeholder={lang === "ar" ? "+966 5X XXX XXXX" : "+966 5X XXX XXXX"}
          required
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <Mail size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.email}</span>
          <small className="text-warning ms-1">*</small>
        </label>
        <input
          type="email"
          name="userEmail"
          value={formData.userEmail}
          onChange={handleInputChange}
          className="form-control"
          placeholder={lang === "ar" ? "amanshah12sweer@gmail.com" : "amanshah12sweer@gmail.com"}
          required
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-2" style={{ color: "#fff" }}>
          <Utensils size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.foodDrinks}</span>
        </label>
        
        <div className="row mb-2">
          <div className="col-md-6 mb-1">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="hotDrinks"
                checked={formData.foodPreferences.hotDrinks}
                onChange={() => handleFoodToggle('hotDrinks')}
                style={{
                  backgroundColor: formData.foodPreferences.hotDrinks ? "#dfa528" : "transparent",
                  borderColor: "#dfa528",
                }}
              />
              <label className="form-check-label ms-2" htmlFor="hotDrinks" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.9)" }}>
                <CoffeeIcon size={13} className="me-1" />
                {t.hotDrinks}
              </label>
            </div>
          </div>
          <div className="col-md-6 mb-1">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="customDinner"
                checked={formData.foodPreferences.customDinner}
                onChange={() => handleFoodToggle('customDinner')}
                style={{
                  backgroundColor: formData.foodPreferences.customDinner ? "#dfa528" : "transparent",
                  borderColor: "#dfa528",
                }}
              />
              <label className="form-check-label ms-2" htmlFor="customDinner" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.9)" }}>
                <Utensils size={13} className="me-1" />
                {t.customDinner}
              </label>
            </div>
          </div>
        </div>
        
        <label className="form-label small mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>{t.otherPreferences}</label>
        <input
          type="text"
          name="foodPreferences.other"
          value={formData.foodPreferences.other}
          onChange={handleInputChange}
          className="form-control"
          placeholder={t.otherPreferencesPlaceholder}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div className="col-12 mb-2">
        <label className="form-label d-flex align-items-center gap-2 mb-1" style={{ color: "#fff" }}>
          <User size={16} className="text-warning" />
          <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{t.specialRequests}</span>
        </label>
        <textarea
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleInputChange}
          className="form-control"
          rows="2"
          placeholder={t.specialRequestsPlaceholder}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            fontSize: "0.9rem",
            resize: "vertical",
          }}
        />
      </div>

      <div className="col-12 mb-2">
        <div className="bg-dark bg-opacity-25 rounded-3 p-2 mt-1">
          <h6 className="text-warning mb-2" style={{ fontSize: "0.9rem" }}>
            {lang === "ar" ? "ملخص الحجز الدولي" : "International Booking Summary"}
          </h6>
          <div className="row small" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>
            <div className="col-6">{t.destination}:</div>
            <div className="col-6 text-end">{destination?.title}</div>
            
            <div className="col-6">
              {bookingType === "activity" ? t.bookActivity :
               bookingType === "hotel" ? t.bookHotel :
               bookingType === "flight" ? t.bookFlight : t.bookPackage}:
            </div>
            <div className="col-6 text-end">
              {bookingType === "activity" ? t.bookActivity :
               bookingType === "hotel" ? t.bookHotel :
               bookingType === "flight" ? t.bookFlight : t.bookPackage}
            </div>
            
            <div className="col-6">{t.numberOfGuests}:</div>
            <div className="col-6 text-end">{formData.numberOfGuests} {lang === "ar" ? "أشخاص" : "People"}</div>
            
            <div className="col-6">{t.checkIn}:</div>
            <div className="col-6 text-end">{formData.checkInDate}</div>
            
            <div className="col-6">{t.checkOut}:</div>
            <div className="col-6 text-end">{formData.checkOutDate}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
        padding: isMobile ? "10px" : "20px",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: "spring", damping: 25 }}
        className="rounded-4 overflow-hidden position-relative d-flex flex-column modal-content-scroll"
        style={{
          width: "100%",
          maxWidth: isMobile ? "95%" : "650px",
          height: isMobile ? "90vh" : "85vh",
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
          direction: lang === "ar" ? "rtl" : "ltr",
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => closeReservationModal()}
          className="btn position-absolute border-0"
          style={{
            top: "15px",
            [lang === "ar" ? "left" : "right"]: "15px",
            zIndex: 10,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.1)",
            color: "white",
          }}
        >
          <X size={20} />
        </button>

        {/* Location Selector */}
        {currentStep === 1 && (
          <div className="px-3 pt-3" style={{ flexShrink: 0 }}>
            <h6 className="text-center mb-2" style={{ color: "#fff", fontSize: "0.9rem" }}>
              {t.bookingLocation}
            </h6>
            <div className="d-flex justify-content-center gap-2 mb-2">
              <button
                type="button"
                className={`btn ${bookingLocation === 'local' ? 'btn-warning' : 'btn-outline-light'}`}
                style={{ 
                  borderRadius: '20px', 
                  fontSize: '0.8rem',
                  padding: '6px 15px'
                }}
                onClick={() => setBookingLocation('local')}
              >
                {t.bookLocally}
              </button>
              <button
                type="button"
                className={`btn ${bookingLocation === 'international' ? 'btn-warning' : 'btn-outline-light'}`}
                style={{ 
                  borderRadius: '20px', 
                  fontSize: '0.8rem',
                  padding: '6px 15px'
                }}
                onClick={() => setBookingLocation('international')}
              >
                {t.bookInternationally}
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="position-relative" style={{ height: "4px", background: "rgba(255,255,255,0.1)" }}>
          <motion.div
            className="position-absolute top-0 start-0 h-100"
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            style={{
              background: "linear-gradient(90deg, #dfa528, #ffc107)",
            }}
          />
        </div>

        {/* Step Indicators */}
        <div className="d-flex justify-content-between px-3 py-2" style={{ flexShrink: 0 }}>
          {t.steps.map((step, index) => (
            <div key={index} className="d-flex flex-column align-items-center">
              <div className={`rounded-circle d-flex align-items-center justify-content-center ${currentStep > index + 1 ? 'bg-warning' : currentStep === index + 1 ? 'bg-warning' : 'bg-secondary'}`}
                style={{
                  width: "28px",
                  height: "28px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: currentStep >= index + 1 ? "black" : "white",
                }}
              >
                {index + 1}
              </div>
              <small className="mt-1" style={{ fontSize: "11px", whiteSpace: "nowrap", color: "rgba(255,255,255,0.9)" }}>
                {step}
              </small>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-4 px-3 d-flex flex-column justify-content-center"
              style={{ flex: 1 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: "70px",
                  height: "70px",
                  background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
                  margin: "0 auto",
                }}
              >
                <Check size={35} color="white" />
              </motion.div>
              <h4 className="fw-bold mb-2" style={{ fontSize: "1.3rem", color: "#fff" }}>{t.success}</h4>
              <p className="mb-3" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)" }}>{t.successMessage}</p>
              {reservationRef && (
                <p className="small text-white-50 mb-2" style={{ fontSize: "0.85rem" }}>
                  {lang === 'ar' ? 'مرجع الحجز' : lang === 'zh' ? '预订参考' : 'Reservation ref'}: #{reservationRef}
                </p>
              )}
              <button
                onClick={() => closeReservationModal()}
                className="btn btn-warning px-4 fw-bold"
                style={{ 
                  borderRadius: "25px",
                  fontSize: "0.9rem",
                  padding: "8px 20px",
                  margin: "0 auto",
                }}
              >
                {t.close}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="d-flex flex-column" style={{ flex: 1, minHeight: 0 }}>
              {/* Header */}
              <div 
                className="position-relative"
                style={{
                  height: "90px",
                  flexShrink: 0,
                  background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${destination?.image || '/international/default-bg.jpg'})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="position-absolute bottom-0 start-0 end-0 p-3">
                  <h4 className="fw-bold mb-1" style={{ fontSize: "1.3rem", color: "#fff" }}>{t.title}</h4>
                  <p className="small mb-0" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.9)" }}>
                    {bookingLocation === "local" 
                      ? `${t.bookLocally} • ${t.steps[currentStep - 1]}`
                      : `${destination?.title || ''} • ${t.steps[currentStep - 1]}`}
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <div 
                className="p-3"
                style={{ 
                  flex: 1,
                  overflowY: "auto",
                  minHeight: 0,
                }}
              >
                {/* Validation Error Message */}
                {showValidationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="alert alert-danger d-flex align-items-center gap-2 mb-3 py-2"
                    style={{ 
                      fontSize: "0.8rem",
                      background: "rgba(220, 53, 69, 0.2)",
                      border: "1px solid rgba(220, 53, 69, 0.5)",
                      color: "#f8d7da",
                    }}
                  >
                    <AlertCircle size={14} />
                    {t.validationError}
                  </motion.div>
                )}

                {/* Runtime JS Error Banner (if any) */}
                {runtimeError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="alert alert-warning d-flex align-items-center gap-2 mb-3 py-2"
                    style={{ 
                      fontSize: "0.8rem",
                      background: "rgba(255, 193, 7, 0.12)",
                      border: "1px solid rgba(255, 193, 7, 0.3)",
                      color: "#ffecb5",
                    }}
                  >
                    <AlertCircle size={14} />
                    <div style={{flex:1}}>
                      <strong>{lang === 'ar' ? 'خطأ في الواجهة' : lang === 'zh' ? '界面错误' : 'UI error'}:</strong> {runtimeError}
                      <div className="small mt-1" style={{opacity:0.85}}>{lang === 'ar' ? 'افتح وحدة تحكم المتصفح لمزيد من التفاصيل.' : lang === 'zh' ? '打开浏览器控制台以获取更多详细信息。' : 'Open browser console for more details.'}</div>
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={() => setRuntimeError(null)}>{lang === 'ar' ? 'إخفاء' : lang === 'zh' ? '关闭' : 'Dismiss'}</button>
                  </motion.div>
                )}

                {/* Submit / Validation Error Banner (if any) */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="alert alert-danger d-flex align-items-center gap-2 mb-3 py-2"
                    style={{ 
                      fontSize: "0.8rem",
                      background: "rgba(220, 53, 69, 0.12)",
                      border: "1px solid rgba(220, 53, 69, 0.3)",
                      color: "#f8d7da",
                    }}
                  >
                    <AlertCircle size={14} />
                    <div style={{flex:1}}>
                      <strong>{lang === 'ar' ? 'خطأ' : lang === 'zh' ? '错误' : 'Error'}:</strong> {submitError}
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={() => setSubmitError(null)}>{lang === 'ar' ? 'إخفاء' : lang === 'zh' ? '关闭' : 'Dismiss'}</button>
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                </AnimatePresence>

                {currentStep === 2 && bookingLocation === "international" && bookingType !== "activity" && (
                  <p className="small text-center mt-2 mb-2" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
                    {t.required}
                  </p>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="p-3 border-top border-dark" style={{ flexShrink: 0 }}>
                <div className="d-flex justify-content-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn btn-outline-light px-3 d-flex align-items-center gap-1"
                      style={{ 
                        borderRadius: "20px",
                        fontSize: "0.9rem",
                        padding: "6px 16px",
                        color: "#fff",
                        borderColor: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {lang === "ar" ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                      {t.back}
                    </button>
                  ) : (
                    <div></div>
                  )}

                  <button
                    type="submit"
                    className={`btn px-4 fw-bold d-flex align-items-center gap-1 ${currentStep === 3 ? 'btn-warning' : 'btn-primary'}`}
                    disabled={!isStepValid()}
                    style={{
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      padding: "8px 20px",
                      opacity: isStepValid() ? 1 : 0.6,
                      background: currentStep === 3 
                        ? "linear-gradient(135deg, #dfa528, #b8860b)" 
                        : "linear-gradient(135deg, #0d6efd, #0a58ca)",
                      border: "none",
                      color: currentStep === 3 ? "#000" : "#fff",
                    }}
                  >
                    {currentStep === 3 ? t.submit : t.next}
                    {currentStep < 3 && (lang === "ar" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />)}
                  </button>
                </div>
              </div>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}