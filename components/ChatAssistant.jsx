"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  X,
  Maximize2,
  Minimize2,
  RefreshCw,
  Copy,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  ChevronDown,
  Paperclip,
  Zap,
  ArrowUp,
  Headphones,
  Check,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import TravelReservationModal from "@/components/TravelReservationModal";

export default function ChatAssistant({ lang = "en" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [likedStatus, setLikedStatus] = useState({});
  const [selectedAgentModel, setSelectedAgentModel] = useState("Agent");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState("");
  const [showTravelReservationModal, setShowTravelReservationModal] = useState(false);
  const [reservationPackageData, setReservationPackageData] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const isRTL = lang === "ar";

  const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Hostinger Agent Initial Welcome Message
  const initialMessages = [
    {
      id: 1,
      sender: "agent",
      text: isRTL
        ? "أهلاً بك! أي من الخدمات أو البرامج السياحية تود استكشافها اليوم؟ سأقوم بالتحقق من العروض المتاحة وإكمال إجراءات الحجز والتأشيرات بسهولة."
        : "Hi! Which of our travel destinations or services would you like to explore? Once you specify it, I'll verify the available offers and proceed with the booking requirements securely.",
      actions: [
        { type: "reservation", label: isRTL ? "أود تقديم طلب حجز رحلة" : "I would like to book a trip" },
        { type: "jet", label: isRTL ? "أرغب باستئجار طائرة خاصة" : "I want to request a private jet charter" },
        { type: "visa", label: isRTL ? "مساعدة في متطلبات تأشيرة الشنغن" : "Help me with Schengen visa requirements" },
      ],
      timestamp: getFormattedTime(),
    },
  ];

  const [messages, setMessages] = useState(initialMessages);

  // Suggested Topics in Hostinger Quick Action Capsule Style
  const quickTopics = [
    {
      id: "winter_hills",
      label: isRTL ? "رحلة الشتاء والرمال بالعلا" : "Winter Hills & Sands AlUla",
      query: isRTL ? "حدثني عن رحلة الشتاء والرمال بالعلا" : "Tell me about Winter Hills and Sands trip in AlUla",
    },
    {
      id: "egyptian_night",
      label: isRTL ? "الليلة المصرية بالعلا" : "Egyptian Night AlUla",
      query: isRTL ? "تفاصيل الليلة المصرية في العلا" : "Details about Egyptian Night in AlUla",
    },
    {
      id: "foundation_day",
      label: isRTL ? "فعاليات يوم التأسيس" : "Foundation Day Trip",
      query: isRTL ? "برنامج وتفاصيل يوم التأسيس" : "Foundation Day trip highlights",
    },
    {
      id: "transport",
      label: isRTL ? "دليل القطارات والمواصلات" : "Transport & Trains Guide",
      query: isRTL ? "كيف أتأجر سيارة أو أحجز القطار والمترو بالسعودية؟" : "How to use trains, flights, and car rentals in Saudi Arabia?",
    },
    {
      id: "private_jet",
      label: isRTL ? "استئجار طائرة خاصة" : "Private Jet Charter",
      query: isRTL ? "كيف يمكنني طلب حجز طائرة خاصة؟" : "How can I book a private jet charter?",
    },
    {
      id: "internet",
      label: isRTL ? "باقات الإنترنت العالمية" : "Global eSIM & Data",
      query: isRTL ? "أسعار وباقات الإنترنت في الخارج" : "What are the international internet data packages?",
    },
    {
      id: "visa",
      label: isRTL ? "تأشيرة الشنغن والسياحة" : "Schengen & Tourist Visa",
      query: isRTL ? "ما هي شروط ومتطلبات استخراج تأشيرة الشنغن؟" : "What are the requirements for a Schengen visa?",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isThinking, isStreaming, streamingText]);

  // Clean Professional Hostinger Agent Replies
  const generateAgentReply = (userText) => {
    const text = userText.toLowerCase();

    // 1. Winter Hills & Sands
    if (text.includes("winter") || text.includes("شتاء") || text.includes("رمال") || text.includes("hills")) {
      return {
        text: isRTL
          ? "رحلة الشتاء والرمال (جدة - العلا)\n\nاستمتع بتجربة صحراوية فاخرة في أحضان الطبيعة.\n\nأبرز الأنشطة:\n- جلسات سمر دافئة وأمسيات غنائية\n- تقديم مشروبات ساخنة ووجبات مشويات عائلية وتحديات الرماية\n- المدة: ليلة واحدة\n- السعة: 20 إلى 50 شخصاً\n\nيمكنك اختيار تقديم طلب الحجز المباشر أو التواصل مع منسق الرحلات عبر الواتساب."
          : "Winter Hills & Sands Trip (Jeddah - AlUla)\n\nEnjoy an unforgettable luxury desert experience under the stars.\n\nKey Highlights:\n- Evening gatherings and live vocal performances\n- Hot beverages, BBQ dining, and archery challenges\n- Duration: 1 Night\n- Capacity: 20 to 50 persons\n\nYou can proceed with a direct reservation request or contact our trip coordinator via WhatsApp.",
        actions: [
          { type: "reservation", label: isRTL ? "تقديم طلب حجز لرحلة الشتاء والرمال" : "Proceed with booking Winter Hills trip", tripTitle: "Winter Hills and Sands" },
          { type: "whatsapp", label: isRTL ? "التواصل المباشر عبر الواتساب" : "Chat with trip coordinator on WhatsApp", textMsg: "استفسار عن رحلة الشتاء والرمال بالعلا" },
        ],
      };
    }

    // 2. Egyptian Night
    if (text.includes("egyptian") || text.includes("مصري") || text.includes("الليلة المصرية")) {
      return {
        text: isRTL
          ? "الليلة المصرية في الشتاء والرمال (جدة - العلا)\n\nأمسيات طربية أصيلة في قلب الطبيعة الصحراوية.\n\nأبرز الفعاليات:\n- جلسة عود حية مع الفنان العمدة\n- بوفيه عشاء مصري فاخر ومأكولات شرقية\n- المدة: ليلة واحدة\n- السعة: 25 إلى 60 شخصاً"
          : "Egyptian Night at Winter Hills & Sands (Jeddah - AlUla)\n\nAuthentic musical evenings in the desert.\n\nHighlights:\n- Live Oud performance with traditional artist Al-Omda\n- Luxury Egyptian dinner buffet\n- Duration: 1 Night\n- Capacity: 25 to 60 persons",
        actions: [
          { type: "reservation", label: isRTL ? "تقديم طلب حجز الليلة المصرية" : "Proceed with booking Egyptian Night", tripTitle: "Egyptian Night at Winter Hills" },
          { type: "whatsapp", label: isRTL ? "التواصل عبر الواتساب" : "Chat on WhatsApp", textMsg: "استفسار عن حجز الليلة المصرية بالعلا" },
        ],
      };
    }

    // 3. Foundation Day
    if (text.includes("foundation") || text.includes("تأسيس") || text.includes("يوم التأسيس")) {
      return {
        text: isRTL
          ? "رحلة يوم التأسيس في الشتاء والرمال\n\nاحتفل بمعنى التأسيس في أجواء تراثية وتغطية استثنائية.\n\nالفعاليات:\n- مسيرة يوم التأسيس والعروض الفولكلورية\n- معزوفات عود أصيلة، ضيافة عربية، وركوب الخيل والإبل\n- المدة: ليلة واحدة"
          : "Foundation Day at Winter Hills & Sands\n\nCelebrate Saudi Foundation Day with rich heritage and grand festivities.\n\nHighlights:\n- Foundation Day procession and traditional folklore performances\n- Live Oud music, traditional hospitality, horse and camel riding\n- Duration: 1 Night",
        actions: [
          { type: "reservation", label: isRTL ? "حجز فعاليات يوم التأسيس" : "Proceed with booking Foundation Day trip", tripTitle: "Foundation Day Trip" },
          { type: "whatsapp", label: isRTL ? "التواصل عبر الواتساب" : "Chat on WhatsApp", textMsg: "طلب حجز رحلة يوم التأسيس بالعلا" },
        ],
      };
    }

    // 4. Transportation & Trains Guide
    if (text.includes("transport") || text.includes("train") || text.includes("قطار") || text.includes("مترو") || text.includes("طيران") || text.includes("سيارة")) {
      return {
        text: isRTL
          ? "دليل المواصلات والتنقل في السعودية\n\nتتوفر في المملكة منظومة نقل متطورة تضمن الراحة والسهولة:\n\n1. الرحلات الجوية: مطارات محلية ودولية عبر الخطوط السعودية وطيران ناس وأديل.\n2. القطارات: قطار سار للشبكة الشرقية والشمالية، وقطار الحرمين السريع للربط بين مكة وجدة والمدينة المنورة.\n3. مترو الرياض: 6 خطوط رئيسية تخدم 85 محطة حديثة.\n4. تأجير السيارات: طرق سريعة ولوحات إرشادية باللغتين العربية والإنجليزية."
          : "Transportation and Travel Guide for Saudi Arabia\n\nSaudi Arabia offers modern transport infrastructure:\n\n1. Flights: Domestic and international airports via Saudia, Flynas, and Flyadeal.\n2. Trains: SAR Railway (North & East lines) and Haramain High-Speed Train (Makkah, Madinah, Jeddah).\n3. Riyadh Metro: 6 main lines serving 85 modern stations.\n4. Car Rental: Highways with bilingual signage.",
        actions: [
          { type: "navigate", href: "/transportation", label: isRTL ? "استكشاف دليل المواصلات الكامل" : "Explore full transport guide" },
          { type: "whatsapp", label: isRTL ? "ترتيب التنقل والمواصلات" : "Arrange transportation via WhatsApp", textMsg: "ترتيب مواصلات وتنقل داخل السعودية" },
        ],
      };
    }

    // 5. Private Jet Charter
    if (text.includes("jet") || text.includes("طائرة خاصة") || text.includes("استئجار طائرة") || text.includes("خاصة")) {
      return {
        text: isRTL
          ? "خدمة استئجار الطيران الخاص الفاخر\n\nخدمات السفر الفاخر والراحة المطلقة:\n\n- مقصورات فاخرة مع خدمة شخصية على مدار 24 ساعة\n- وصول لأكثر من 5000 مطار خاص حول العالم\n- توفير عرض السعر المباشر خلال ساعتين فقط"
          : "Luxury Private Jet Charter Services\n\nExperience ultimate luxury and privacy in the sky:\n\n- VIP cabins with 24/7 personalized service\n- Access to over 5,000 private airports worldwide\n- Quotation response within 2 hours",
        actions: [
          { type: "navigate", href: "/international/private-jet", label: isRTL ? "تعبئة نموذج طلب طائرة خاصة" : "Fill private jet request form" },
          { type: "whatsapp", label: isRTL ? "طلب عرض سعر عبر الواتساب" : "Get instant jet quote via WhatsApp", textMsg: "طلب عرض سعر طيران خاص" },
        ],
      };
    }

    // 6. Global Internet eSIM
    if (text.includes("internet") || text.includes("إنترنت") || text.includes("انترنت") || text.includes("باقة") || text.includes("esim")) {
      return {
        text: isRTL
          ? "باقات الإنترنت العالمية (تفعيل فوري)\n\nالاتصال السريع في أكثر من 200 دولة:\n\n- 3 جيجابايت: 25 دولار (15 يوماً - 4G/LTE)\n- 5 جيجابايت: 40 دولار (30 يوماً - 5G)\n- 10 جيجابايت: 70 دولار (30 يوماً - 5G)\n- 20 جيجابايت: 130 دولار (60 يوماً - 5G)"
          : "Global Internet Data Packages (Instant Activation)\n\nStay connected in over 200 countries:\n\n- 3 GB: $25 (15 Days - 4G/LTE)\n- 5 GB: $40 (30 Days - 5G Ready)\n- 10 GB: $70 (30 Days - 5G Ready)\n- 20 GB: $130 (60 Days - 5G Ultra)",
        actions: [
          { type: "navigate", href: "/international/internet-packages", label: isRTL ? "استكشاف وتفعيل الباقات" : "Explore & order eSIM data packages" },
          { type: "whatsapp", label: isRTL ? "التواصل عبر الواتساب" : "Order eSIM package via WhatsApp", textMsg: "طلب تفعيل باقة إنترنت عالمية" },
        ],
      };
    }

    // 7. Visa Services
    if (text.includes("visa") || text.includes("تأشير") || text.includes("شنغن") || text.includes("schengen")) {
      return {
        text: isRTL
          ? "خدمة استخراج وتجهيز تأشيرة الشنغن والسياحة\n\nتجهيز الملفات للسعوديين والمقيمين بالمملكة:\n\nالمتطلبات الأساسية:\n1. جواز سفر صالح لمدة 6 أشهر على الأقل\n2. صورتان شخصيتان خلفية بيضاء (3.5 × 4.5 سم)\n3. تأمين طبي يغطي دول الشنغن بحد أدنى 30,000 يورو\n4. حجز طيران وفندق مؤكد مع كشف حساب بنكي لآخر 6 أشهر"
          : "Schengen and Tourist Visa Services\n\nComplete document preparation for Saudis and residents:\n\nRequirements:\n1. Passport valid for at least 6 months\n2. Two white background photos (3.5 x 4.5 cm)\n3. Travel insurance covering Schengen area (minimum 30,000 Euros)\n4. Confirmed flight and hotel reservation with 6-month bank statement",
        actions: [
          { type: "navigate", href: "/visa", label: isRTL ? "رفع مستندات التأشيرة" : "Upload visa application documents" },
          { type: "whatsapp", label: isRTL ? "استشارة تأشيرة عبر الواتساب" : "Free visa consultation on WhatsApp", textMsg: "استفسار عن حجز موعد وتأشيرة الشنغن" },
        ],
      };
    }

    // Default Fallback Response
    return {
      text: isRTL
        ? "أهلاً بك في شركة التلال والرمال لتنظيم الرحلات السياحية.\n\nيسعدنا ترتيب وتنظيم كافة تطلعاتك السياحية والحجوزات بأعلى مستويات الجودة والاحترافية.\n\nاختر من الخيارات المتاحة أو تحدث مباشرة مع المنسق عبر الواتساب:"
        : "Welcome to Tilal Rimal Tourism Organization.\n\nWe are happy to arrange and assist with all your travel requirements and bookings.\n\nPlease select an option below or chat directly with our coordinator via WhatsApp:",
      actions: [
        { type: "reservation", label: isRTL ? "تقديم طلب حجز رحلة" : "Submit reservation request" },
        { type: "whatsapp", label: isRTL ? "التواصل عبر الواتساب" : "Chat with coordinator on WhatsApp", textMsg: "مرحباً، أود الاستفسار عن خدماتكم السياحية" },
      ],
    };
  };

  // Hostinger Word-by-Word Streaming Response Trigger
  const triggerAgentResponse = (userText) => {
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const replyObj = generateAgentReply(userText);
      const words = replyObj.text.split(" ");
      let currentIdx = 0;
      let currentText = "";
      setIsStreaming(true);

      const interval = setInterval(() => {
        if (currentIdx < words.length) {
          currentText += (currentIdx === 0 ? "" : " ") + words[currentIdx];
          setStreamingText(currentText);
          currentIdx++;
        } else {
          clearInterval(interval);
          setIsStreaming(false);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: "agent",
              text: replyObj.text,
              actions: replyObj.actions,
              timestamp: getFormattedTime(),
            },
          ]);
          setStreamingText("");
        }
      }, 28);
    }, 550);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if ((!inputMessage.trim() && !attachedFileName) || isThinking || isStreaming) return;

    let userText = inputMessage.trim();
    if (attachedFileName) {
      userText = userText ? `${userText}\n\n[Attached: ${attachedFileName}]` : `[Attached: ${attachedFileName}]`;
      setAttachedFileName("");
    }

    const newUserMsg = {
      id: Date.now(),
      sender: "user",
      text: userText,
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputMessage("");
    triggerAgentResponse(userText);
  };

  const handleQuickTopicClick = (topic) => {
    if (isThinking || isStreaming) return;
    const userText = topic.query;
    const newUserMsg = {
      id: Date.now(),
      sender: "user",
      text: userText,
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    triggerAgentResponse(userText);
  };

  const handleActionButtonClick = (action) => {
    if (action.type === "reservation") {
      setReservationPackageData({
        title: action.tripTitle || "Tilal Rimal Package",
        name: action.tripTitle || "Tilal Rimal Package",
        id: "chat_pkg_1",
      });
      setShowTravelReservationModal(true);
    } else if (action.type === "jet") {
      router.push(`/${lang}/international/private-jet`);
      setIsOpen(false);
    } else if (action.type === "visa") {
      router.push(`/${lang}/visa`);
      setIsOpen(false);
    } else if (action.type === "whatsapp") {
      const encodedMsg = encodeURIComponent(action.textMsg || "مرحباً، أود الاستفسار والحجز مع شركة التلال والرمال");
      window.open(`https://wa.me/966547305060?text=${encodedMsg}`, "_blank");
    } else if (action.type === "navigate" && action.href) {
      router.push(`/${lang}${action.href}`);
      setIsOpen(false);
    }
  };

  // Fully Working Copy Handler (Clipboard API + Fallback)
  const handleCopyMessage = (id, text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }).catch(() => fallbackCopy(id, text));
    } else {
      fallbackCopy(id, text);
    }
  };

  const fallbackCopy = (id, text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  // Bulletproof Continuous Text-to-Speech Handler for Arabic & English
  const handleSpeakMessage = (id, text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    // If currently speaking this message, stop it cleanly
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text into smooth spoken prose (remove markdown bullet dashes & extra spaces)
    let cleanText = text
      .replace(/<[^>]*>?/gm, "")
      .replace(/[-•*]/g, "")
      .replace(/(\r\n|\n|\r)+/g, ". ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) return;

    // Split text into natural sentence chunks to eliminate Chrome/Edge speech synthesis stuttering
    const sentenceRegex = /[^.!?؛,]+[.!?؛,]?/g;
    const chunks = cleanText.match(sentenceRegex) || [cleanText];

    setSpeakingId(id);

    // Keep global reference array to prevent Chrome V8 garbage collection bug mid-speech
    window._speechUtterances = [];

    let currentChunkIndex = 0;

    const speakNextChunk = () => {
      if (currentChunkIndex >= chunks.length) {
        setSpeakingId(null);
        window._speechUtterances = [];
        return;
      }

      const chunkText = chunks[currentChunkIndex].trim();
      if (!chunkText) {
        currentChunkIndex++;
        speakNextChunk();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.lang = isRTL ? "ar-SA" : "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Select natural Arabic voice if available in browser
      if (isRTL) {
        const voices = window.speechSynthesis.getVoices();
        const arVoice = voices.find(
          (v) => v.lang.startsWith("ar") || v.name.includes("Arabic") || v.name.includes("Maged") || v.name.includes("Tarik") || v.name.includes("Naayf") || v.name.includes("Laila")
        );
        if (arVoice) {
          utterance.voice = arVoice;
        }
      }

      utterance.onend = () => {
        currentChunkIndex++;
        speakNextChunk();
      };

      utterance.onerror = (e) => {
        console.error("Speech chunk error:", e);
        currentChunkIndex++;
        speakNextChunk();
      };

      window._speechUtterances.push(utterance);
      window.speechSynthesis.speak(utterance);
    };

    speakNextChunk();
  };

  // Fully Working Thumbs Up / Down Feedback Handler
  const handleLikeMessage = (id, type) => {
    setLikedStatus((prev) => {
      const current = prev[id];
      if (current === type) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: type };
    });
  };

  // File Attachment Handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
    }
  };

  return (
    <>
      {/* Hidden File Input for Attachments */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Hostinger Agent Trigger Button */}
      <div
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        style={{
          position: "fixed",
          bottom: "25px",
          left: isRTL ? "auto" : "95px",
          right: isRTL ? "95px" : "auto",
          zIndex: 999999,
          cursor: "pointer",
          backgroundColor: "#1C0052",
          border: "1.5px solid #E85D1F",
          borderRadius: "50px",
          padding: "10px 18px",
          boxShadow: "0 10px 30px rgba(28, 0, 82, 0.35)",
          display: isOpen ? "none" : "flex",
          alignItems: "center",
          gap: "10px",
          color: "#ffffff",
          fontWeight: 600,
          fontSize: "0.88rem",
          direction: isRTL ? "rtl" : "ltr",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.04)";
          e.currentTarget.style.boxShadow = "0 14px 35px rgba(28, 0, 82, 0.45)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(28, 0, 82, 0.35)";
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "rgba(232, 93, 31, 0.2)",
            border: "1px solid #E85D1F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFC60B",
            flexShrink: 0,
          }}
        >
          <Headphones size={17} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.2" }}>
          <span style={{ color: "#ffffff", fontSize: "0.85rem", fontWeight: 700 }}>
            {isRTL ? "الوكيل" : "Agent"}
          </span>
          <span style={{ color: "#FFC60B", fontSize: "0.72rem", fontWeight: 500 }}>
            {isRTL ? "خدمة العملاء والحجوزات" : "Travel & Support"}
          </span>
        </div>
      </div>

      {/* Hostinger Exact Replica AI Agent Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: isExpanded ? "16px" : "20px",
            [isRTL ? "left" : "right"]: isExpanded ? "16px" : "20px",
            width: isExpanded ? "calc(100vw - 32px)" : "430px",
            maxWidth: "760px",
            height: isExpanded ? "calc(100vh - 32px)" : "650px",
            maxHeight: "90vh",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 25px 70px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08)",
            zIndex: 999999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            direction: isRTL ? "rtl" : "ltr",
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Hostinger Header Bar */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#1C0052",
                  color: "#FFC60B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Headphones size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "0.96rem", fontWeight: 700, color: "#111827" }}>
                  {isRTL ? "وكيل التلال والرمال" : "Tilal Rimal Agent"}
                </h4>
                <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 500 }}>
                  {isRTL ? "متواجد حالياً" : "Online"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <a
                href="https://wa.me/966547305060"
                target="_blank"
                rel="noreferrer"
                title="WhatsApp Support"
                style={{
                  color: "#25D366",
                  backgroundColor: "#f9fafb",
                  borderRadius: "50%",
                  width: "34px",
                  height: "34px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaWhatsapp size={18} />
              </a>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  background: "#f9fafb",
                  border: "none",
                  color: "#6b7280",
                  borderRadius: "50%",
                  width: "34px",
                  height: "34px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "#f9fafb",
                  border: "none",
                  color: "#6b7280",
                  borderRadius: "50%",
                  width: "34px",
                  height: "34px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                {/* User Message: Lavender Bubble */}
                {msg.sender === "user" ? (
                  <div
                    style={{
                      backgroundColor: "#f0ebff",
                      color: "#111827",
                      padding: "10px 18px",
                      borderRadius: "20px",
                      fontSize: "0.92rem",
                      fontWeight: 500,
                      maxWidth: "85%",
                    }}
                  >
                    {msg.text}
                  </div>
                ) : (
                  /* Agent Message: Plain Text on White Background */
                  <div style={{ width: "100%", maxWidth: "98%" }}>
                    <div
                      style={{
                        color: "#1f2937",
                        fontSize: "0.94rem",
                        lineHeight: "1.65",
                        whiteSpace: "pre-line",
                        fontWeight: 400,
                      }}
                    >
                      {msg.text}
                    </div>

                    {/* Interactive Action Bar (Copy, Sound, Thumbs Up, Thumbs Down, Timestamp) */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        marginTop: "12px",
                        color: "#9ca3af",
                      }}
                    >
                      {/* COPY BUTTON */}
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        title="Copy text"
                        style={{
                          background: "none",
                          border: "none",
                          color: copiedId === msg.id ? "#10b981" : "#9ca3af",
                          cursor: "pointer",
                          padding: "2px",
                          display: "flex",
                          alignItems: "center",
                          transition: "color 0.15s ease",
                        }}
                      >
                        {copiedId === msg.id ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                      </button>

                      {/* VOICE/LISTEN BUTTON */}
                      <button
                        onClick={() => handleSpeakMessage(msg.id, msg.text)}
                        title={speakingId === msg.id ? "Stop listening" : "Listen message"}
                        style={{
                          background: "none",
                          border: "none",
                          color: speakingId === msg.id ? "#1C0052" : "#9ca3af",
                          cursor: "pointer",
                          padding: "2px",
                          display: "flex",
                          alignItems: "center",
                          transition: "color 0.15s ease",
                        }}
                      >
                        <Volume2 size={16} color={speakingId === msg.id ? "#1C0052" : "#9ca3af"} />
                      </button>

                      {/* THUMBS UP BUTTON */}
                      <button
                        onClick={() => handleLikeMessage(msg.id, "like")}
                        title="Good response"
                        style={{
                          background: "none",
                          border: "none",
                          color: likedStatus[msg.id] === "like" ? "#1C0052" : "#9ca3af",
                          cursor: "pointer",
                          padding: "2px",
                          display: "flex",
                          alignItems: "center",
                          transition: "color 0.15s ease",
                        }}
                      >
                        <ThumbsUp
                          size={16}
                          color={likedStatus[msg.id] === "like" ? "#1C0052" : "#9ca3af"}
                          fill={likedStatus[msg.id] === "like" ? "#1C0052" : "none"}
                        />
                      </button>

                      {/* THUMBS DOWN BUTTON */}
                      <button
                        onClick={() => handleLikeMessage(msg.id, "dislike")}
                        title="Poor response"
                        style={{
                          background: "none",
                          border: "none",
                          color: likedStatus[msg.id] === "dislike" ? "#ef4444" : "#9ca3af",
                          cursor: "pointer",
                          padding: "2px",
                          display: "flex",
                          alignItems: "center",
                          transition: "color 0.15s ease",
                        }}
                      >
                        <ThumbsDown
                          size={16}
                          color={likedStatus[msg.id] === "dislike" ? "#ef4444" : "#9ca3af"}
                          fill={likedStatus[msg.id] === "dislike" ? "#ef4444" : "none"}
                        />
                      </button>

                      {/* TIMESTAMP */}
                      <span style={{ fontSize: "0.75rem", color: "#9ca3af", marginLeft: "4px" }}>
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Hostinger Quick Actions Section */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div style={{ marginTop: "18px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#4b5563" }}>
                            {isRTL ? "خيارات سريعة" : "Quick actions"}
                          </span>
                          <div style={{ flex: 1, height: "1px", backgroundColor: "#f0f0f0" }} />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {msg.actions.map((act, actIdx) => (
                            <button
                              key={actIdx}
                              onClick={() => handleActionButtonClick(act)}
                              style={{
                                backgroundColor: "#f6f3ff",
                                color: "#1f2937",
                                border: "none",
                                borderRadius: "24px",
                                padding: "11px 18px",
                                fontSize: "0.88rem",
                                fontWeight: 500,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                textAlign: isRTL ? "right" : "left",
                                transition: "all 0.15s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#ede5ff";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#f6f3ff";
                              }}
                            >
                              <span>{act.label}</span>
                              <ChevronRight size={18} color="#6b7280" style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Hostinger Thinking State */}
            {isThinking && (
              <div style={{ color: "#6b7280", fontSize: "0.9rem", padding: "4px 0" }}>
                {isRTL ? "جاري البحث عن المعلومات..." : "Looking up information..."}
              </div>
            )}

            {/* Hostinger Word-by-Word Streaming State */}
            {isStreaming && (
              <div style={{ width: "100%", maxWidth: "98%" }}>
                <div
                  style={{
                    color: "#1f2937",
                    fontSize: "0.94rem",
                    lineHeight: "1.65",
                    whiteSpace: "pre-line",
                  }}
                >
                  {streamingText}
                  <span style={{ display: "inline-block", width: "6px", height: "14px", backgroundColor: "#1C0052", marginLeft: "2px", verticalAlign: "middle" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Topics Floating Menu Overlay (when Zap ⚡ is toggled) */}
          {showQuickPrompts && (
            <div
              style={{
                backgroundColor: "#FAF6F0",
                padding: "12px 16px",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxHeight: "180px",
                overflowY: "auto",
              }}
            >
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1C0052" }}>
                {isRTL ? "موضوعات سريعة للاستفسار:" : "Suggested quick topics:"}
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {quickTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setShowQuickPrompts(false);
                      handleQuickTopicClick(topic);
                    }}
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "16px",
                      padding: "6px 12px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#1C0052",
                      cursor: "pointer",
                    }}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hostinger Style Input Container */}
          <div style={{ padding: "12px 16px 16px", backgroundColor: "#ffffff" }}>
            {attachedFileName && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.78rem",
                  color: "#1C0052",
                  backgroundColor: "#f0ebff",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  marginBottom: "6px",
                  width: "fit-content",
                }}
              >
                <span>📎 {attachedFileName}</span>
                <button
                  type="button"
                  onClick={() => setAttachedFileName("")}
                  style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", padding: 0 }}
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <form
              onSubmit={handleSendMessage}
              style={{
                borderRadius: "22px",
                border: "1.5px solid #e2e8f0",
                backgroundColor: "#ffffff",
                padding: "12px 16px 10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <textarea
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder={isRTL ? "واصل المحادثة..." : "Continue the conversation..."}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: "0.92rem",
                  color: "#111827",
                  resize: "none",
                  fontFamily: "inherit",
                  direction: isRTL ? "rtl" : "ltr",
                }}
              />

              {/* Input Toolbar Inside Container */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "8px",
                  paddingTop: "4px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px", color: "#9ca3af" }}>
                  {/* ATTACHMENT PAPERCLIP BUTTON */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach file"
                    style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: 0, display: "flex" }}
                  >
                    <Paperclip size={18} />
                  </button>

                  {/* QUICK PROMPTS ZAP BUTTON */}
                  <button
                    type="button"
                    onClick={() => setShowQuickPrompts(!showQuickPrompts)}
                    title="Quick topics"
                    style={{ background: "none", border: "none", color: showQuickPrompts ? "#1C0052" : "#9ca3af", cursor: "pointer", padding: 0, display: "flex" }}
                  >
                    <Zap size={18} />
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>
                  {/* Dropdown Agent Selector */}
                  <div
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "#374151",
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <span style={{ fontSize: "0.85rem", color: "#1C0052" }}>❖</span>
                    <span>{selectedAgentModel}</span>
                    <ChevronDown size={14} color="#6b7280" />
                  </div>

                  {/* Agent Model Selector Popup */}
                  {showModelDropdown && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "35px",
                        right: "40px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                        padding: "6px",
                        zIndex: 99999,
                        minWidth: "150px",
                      }}
                    >
                      <div
                        onClick={() => { setSelectedAgentModel("Agent"); setShowModelDropdown(false); }}
                        style={{
                          padding: "8px 12px",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          borderRadius: "8px",
                          backgroundColor: selectedAgentModel === "Agent" ? "#f0ebff" : "transparent",
                          color: "#1C0052",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>❖ Agent</span>
                        {selectedAgentModel === "Agent" && <Check size={14} color="#1C0052" />}
                      </div>

                      <div
                        onClick={() => { setSelectedAgentModel("Fast Agent"); setShowModelDropdown(false); }}
                        style={{
                          padding: "8px 12px",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          borderRadius: "8px",
                          backgroundColor: selectedAgentModel === "Fast Agent" ? "#f0ebff" : "transparent",
                          color: "#1C0052",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>⚡ Fast Agent</span>
                        {selectedAgentModel === "Fast Agent" && <Check size={14} color="#1C0052" />}
                      </div>
                    </div>
                  )}

                  {/* Circle Send Arrow */}
                  <button
                    type="submit"
                    disabled={(!inputMessage.trim() && !attachedFileName) || isThinking || isStreaming}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      backgroundColor: (inputMessage.trim() || attachedFileName) ? "#1C0052" : "#f3f4f6",
                      color: (inputMessage.trim() || attachedFileName) ? "#ffffff" : "#9ca3af",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: (inputMessage.trim() || attachedFileName) ? "#1C0052" : "not-allowed",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <ArrowUp size={18} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Travel Reservation Modal */}
      <TravelReservationModal
        isOpen={showTravelReservationModal}
        onClose={() => setShowTravelReservationModal(false)}
        packageData={reservationPackageData}
        lang={lang}
      />
    </>
  );
}

