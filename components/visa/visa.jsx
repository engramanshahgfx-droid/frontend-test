// components/visa/visa.jsx
"use client";

import React, { useState } from "react";
import {
  FaPassport,
  FaBuilding,
  FaPlane,
  FaDesktop,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
  FaMoneyBillWave,
  FaClock,
  FaUserCheck,
  FaGlobeAmericas,
  FaShieldAlt,
} from "react-icons/fa";

export default function Visa({ lang }) {
  const [activeMainTab, setActiveMainTab] = useState(1);
  const [activeGccTab, setActiveGccTab] = useState(1);
  const [activeSchengenTab, setActiveSchengenTab] = useState(1);
  const [activeOtherTab, setActiveOtherTab] = useState(1);

  const content = {
    en: {
      heroTitle: "The Magic of Nature As You've Never Seen Before",
      heroSubtitle: "Discover the visa you need to visit Saudi Arabia",
      heroDescription: "Let us plan... while you enjoy the journey",

      welcomeTitle: "Welcome!",
      welcomeDescription: "Our dear neighbors, citizens of GCC countries, do not need a visa. You can travel to Saudi Arabia at any time using your ID or passport.",

      // Main Tabs
      mainTabs: [
        { id: 1, title: "GCC Countries", icon: <FaGlobeAmericas /> },
        { id: 2, title: "Schengen - USA - UK", icon: <FaShieldAlt /> },
        { id: 3, title: "None of the above", icon: <FaPassport /> },
      ],

      // GCC Tabs
      gccTabs: [
        { 
          id: 1, 
          title: "GCC Nationality", 
          icon: <FaDesktop />,
          content: {
            title: "Welcome!",
            description: "Our dear neighbors, citizens of GCC countries, do not need a visa. You can travel to Saudi Arabia at any time using your ID or passport."
          }
        },
        { 
          id: 2, 
          title: "GCC Resident", 
          icon: <FaPlane />,
          content: {
            title: "Information",
            description: "Electronic Visa Cost: 300 SAR (approximately $80 USD)\nApplication Fee: 39.44 SAR (approximately $10.50 USD)\nMedical Insurance Fee: Not included (price determined by service provider)\nNumber of Entries: Multiple entries or single entry according to Saudi Foreign Ministry decision\nValidity Period: Multiple entry visa valid for one year from issuance date and allows stay for up to 90 consecutive days",
            requirements: "You must submit a valid residence permit issued by one of the GCC countries with validity of at least three months after entry date to Saudi Arabia.\nYour passport must be valid for at least six months after entry date to Saudi Arabia.\nFor travelers under 18 years, the traveler's parent must apply for electronic visa first.\nTravelers wishing to perform Umrah can book Umrah appointment through the official Nusuk platform.",
            applyButton: "Apply Now",
            applyLink: "https://visa.visitsaudi.com/"
          }
        }
      ],

      // Schengen/USA/UK Tabs
      schengenTabs: [
        { 
          id: 1, 
          title: "Electronic Visa", 
          icon: <FaDesktop />,
          content: {
            title: "Information",
            description: "Electronic Visa Cost: 395 SAR\nApplication Fee: Included in electronic visa price\nMedical Insurance Fee: Included in electronic visa price\nNumber of Entries: Multiple entries\nValidity Period: Multiple entry visa valid for one year from issuance date and allows stay for up to 90 consecutive days",
            requirements: "You can apply for electronic visa to visit Saudi Arabia at any age. If you are a minor traveling unaccompanied, you must check your country's regulations regarding travel without guardian, as these regulations vary by nationality. Please ensure all requirements are met before submitting application, and for more information you can check the electronic visa guide or contact us for assistance.\nYour passport must be valid for at least six months after entry date to Saudi Arabia except for US citizens - US citizens can enter as long as their passport is valid, regardless of remaining time before expiry.",
            applyButton: "Apply Now",
            applyLink: "https://visa.visitsaudi.com/"
          }
        },
        { 
          id: 2, 
          title: "Visa on Arrival", 
          icon: <FaPlane />,
          content: {
            title: "Information",
            description: "Visa on Arrival Cost: 300 SAR (approximately $80 USD)\nMedical Insurance Fee: 95 SAR (approximately $25.33 USD)\nMultiple Entries: Multiple entries or single entry according to Saudi Foreign Ministry decision\nValidity Period: Multiple entry visa valid for one year from issuance date. Visa allows stay for up to 90 days maximum",
            requirements: "Upon arrival at your destination airport or other entry points in Saudi Arabia, you can use self-service machines or go directly to passport office to apply for visa on arrival.\n\nYou can apply for electronic visa to visit Saudi Arabia at any age. If you are a minor traveling unaccompanied, you must check your country's regulations regarding travel without guardian, as these regulations vary by nationality. Please ensure all requirements are met before submitting application, and for more information you can check the electronic visa guide or contact us for assistance.\nYour passport must be valid for at least six months after entry date to Saudi Arabia except for US citizens where US citizens can enter as long as their passport is valid, regardless of remaining time before expiry.\nTravelers wishing to perform Umrah can book Umrah appointment through the official Nusuk platform."
          }
        },
        { 
          id: 3, 
          title: "Transit Visa", 
          icon: <FaBuilding />,
          content: {
            title: "Information",
            description: "Transit visa allows visitors passing through Saudi Arabia to enter for multiple purposes including performing Umrah, visiting the Prophet's Mosque, or spending short vacation during trips and enjoying events like Riyadh Season and visiting tourist attractions throughout the Kingdom.\n\nNote: Travelers for Umrah or visit purposes must schedule their appointments on the electronic Nusuk platform Nusuk.sa before going to Mecca or Medina."
          }
        }
      ],

      // Other Countries Tabs
      otherTabs: [
        { 
          id: 1, 
          title: "Embassy/Consulate", 
          icon: <FaPassport />,
          content: {
            title: "Information",
            description: "Medical Insurance Fee: Not included (price determined by service provider)\nNumber of Entries: Multiple entries or single entry according to Saudi Foreign Ministry decision\nValidity Period: Multiple entry visa valid for one year from issuance date. Visa allows stay for up to 90 days",
            requirements: "You must be at least 18 years old to enter alone. Travelers under 18 years cannot enter unless accompanied by parent, grandparent, or adult sibling (over 18 years).\nYour passport must be valid for at least six months after entry date to Saudi Arabia.\nThe following documents are also required for embassy/consulate visa: Proof of residence (in country of residence), return ticket, employment proof, financial proof/bank statement, travel itinerary, ID, accommodation address (address during Saudi Arabia visit)."
          }
        },
        { 
          id: 2, 
          title: "Accredited Visa Offices", 
          icon: <FaBuilding />,
          content: {
            title: "Information",
            description: "If you live in one of the following countries, you can use 'Tasheer' visa facilitation services.\n\nAfrica: Cameroon | Chad | Egypt | Ghana | Guinea | Ivory Coast | Mali | Mauritania | Nigeria | South Africa.\nAsia: Indonesia | Japan | Jordan | Kuwait | Maldives | Pakistan | Philippines | Qatar | Singapore | Sri Lanka | South Korea | Tajikistan | United Arab Emirates.\nEurope: Germany | Italy | Netherlands | Sweden | Switzerland.\nAustralia\n\nTravelers wishing to perform Umrah can book Umrah appointment through the official Nusuk platform.",
            searchButton: "Search",
            searchLink: "https://vc.tasheer.com/",
            nusukButton: "Official Nusuk Platform",
            nusukLink: "https://www.nusuk.sa/"
          }
        },
        { 
          id: 3, 
          title: "Transit Visa", 
          icon: <FaBuilding />,
          content: {
            title: "Information",
            description: "Transit visa allows visitors passing through Saudi Arabia to enter for multiple purposes including performing Umrah, visiting the Prophet's Mosque, or spending short vacation during trips and enjoying events like Riyadh Season and visiting tourist attractions throughout the Kingdom.\n\nNote: Travelers for Umrah or visit purposes must schedule their appointments on the electronic Nusuk platform Nusuk.sa before going to Mecca or Medina."
          }
        }
      ],

      applyNow: "Apply Now",
      search: "Search",
      requirements: "Requirements",
      howToApply: "How to Apply"
    },
    ar: {
      heroTitle: "سحر الطبيعة كما لم تره من قبل",
      heroSubtitle: "اكتشف نوع التأشيرة التي تحتاجها لزيارة المملكة العربية السعودية",
      heroDescription: "دعنا نخطط.. وأنت استمتع بالرحلة",

      welcomeTitle: "مرحبا!",
      welcomeDescription: "جيراننا الأعزاء مواطني دول مجلس التعاون الخليجي لا يحتاجون إلى تأشيرة. يمكنكم السفر إلى المملكة العربية السعودية في أي وقت باستخدام هويتكم أو جواز سفركم.",

      // Main Tabs
      mainTabs: [
        { id: 1, title: "دول الخليج", icon: <FaGlobeAmericas /> },
        { id: 2, title: "تأشيرة شنغن - USA - UK", icon: <FaShieldAlt /> },
        { id: 3, title: "لا شيى مما سبق", icon: <FaPassport /> },
      ],

      // GCC Tabs
      gccTabs: [
        { 
          id: 1, 
          title: "جنسية من دول الخليج", 
          icon: <FaDesktop />,
          content: {
            title: "مرحبا!",
            description: "جيراننا الأعزاء مواطني دول مجلس التعاون الخليجي لا يحتاجون إلى تأشيرة. يمكنكم السفر إلى المملكة العربية السعودية في أي وقت باستخدام هويتكم أو جواز سفركم."
          }
        },
        { 
          id: 2, 
          title: "مقيم في دول الخليج", 
          icon: <FaPlane />,
          content: {
            title: "المعلومات",
            description: "تكلفة التأشيرة الإلكترونية: 300 ريال (حوالي 80 دولار أمريكي)\n\nرسوم الطلب: 39.44 ريال (حوالي 10.50 دولار أمريكي)\n\nرسوم التأمين الطبي: غير مشمولة (يتم تحديد السعر بناءاً على مقدم الخدمة)\n\nعدد مرات الدخول: دخول متعدد أو دخول واحد وفقاً لقرار وزارة الخارجية السعودية\n\nمدة الصلاحية: أشيرة الدخول المتعدد صالحة لمدة عام من تاريخ إصدارها وتسمح بالإقامة لمدة لا تتجاوز 90 يوماً متتالية",
            requirements: "يجب عليك تقديم تأشيرة إقامة صادرة من إحدى دول مجلس التعاون الخليجي مع صلاحية لا تقل عن ثلاثة أشهر بعد تاريخ الدخول إلى المملكة العربية السعودية.\nيجب أن يكون جواز سفرك ساري المفعول لمدة لا تقل عن ستة أشهر بعد تاريخ الدخول إلى المملكة العربية السعودية.\nبالنسبة للمسافرين الذين تقل أعمارهم عن 18 عاماً، يتعين على والد المسافر التقدم للحصول على تأشيرة إلكترونية أولاً\n\nيمكن للمسافرين الراغبين في أداء مناسك العمرة بحجز موعد العمرة عبر منصة نُسك الرسمية",
            applyButton: "تقديم الأن",
            applyLink: "https://visa.visitsaudi.com/"
          }
        }
      ],

      // Schengen/USA/UK Tabs
      schengenTabs: [
        { 
          id: 1, 
          title: "التأشيرة الإلكترونية", 
          icon: <FaDesktop />,
          content: {
            title: "المعلومات",
            description: "تكلفة التأشيرة الإلكترونية:: 395 ريال\n\nرسوم التقديم: مشمولة في سعر التأشيرة الإلكترونية\n\nرسوم التأمين الطبي: مشمولة في سعر التأشيرة الإلكترونية\n\nعدد مرات الدخول: دخول متعدد\n\nمدة الصلاحية: تأشيرة الدخول المتعدد صالحة لمدة عام من تاريخ إصدارها وتسمح بالإقامة لمدة لا تتجاوز 90 يوماً متتالية",
            requirements: "يمكنك التقدّم للحصول على التأشيرة الإلكترونية لزيارة السعودية في أي عمر. وإذا كنت قاصراً وتسافر دون مرافق، فيجب عليك مراجعة أنظمة بلدك المتعلقة بالسفر دون ولي أمر، حيث تختلف هذه الأنظمة حسب الجنسية. يُرجى التأكّد من استيفاء جميع المتطلبات قبل تقديم الطلب، وللمزيد من المعلومات يمكنك الاطّلاع على دليل التأشيرة الإلكترونية أو التواصل معنا للحصول على المساعدة.\nيجب أن يكون جواز سفرك ساري المفعول لمدة لا تقل عن ستة أشهر بعد تاريخ الدخول إلى المملكة العربية السعودية باستثناء مواطني الولايات المتحدة الأمريكية يمكن لمواطني الولايات المتحدة الدخول طالما أن جواز سفرهم ساري المفعول، بغض النظر عن الوقت المتبقي قبل انتهاء الصلاحية.",
            applyButton: "تقديم الأن",
            applyLink: "https://visa.visitsaudi.com/"
          }
        },
        { 
          id: 2, 
          title: "التأشيرة عند الوصول", 
          icon: <FaPlane />,
          content: {
            title: "المعلومات",
            description: "تكلفة التأشيرة عند الوصول: 300 ريال (ما يعادل حوالي 80 دولار أمريكي)\n\nرسوم التأمين الطبي: 95 ريال  (ما يعادل حوالي 25.33 دولار أمريكي)\n\nدخول متعدد: دخول متعدد أو دخول واحد وفقاً لقرار وزارة الخارجية السعودية\n\nمدة الصلاحية: تأشيرة الدخول المتعدد صالحة لمدة عام من تاريخ إصدارها. تسمح التأشيرة بالإقامة لمدة تصل إلى 90 يوماً كحد أقصى",
            requirements: "بمجرد وصولك إلى مطار وجهتك أو إحدى نقاط الدخول الأخرى في السعودية، يمكنك استخدام أجهزة الخدمة الذاتية أو توجّه مباشرة إلى مكتب الجوازات للتقدم بطلب للحصول على تأشيرتك عند الوصول.\n\nيمكنك التقدّم للحصول على التأشيرة الإلكترونية لزيارة السعودية في أي عمر. وإذا كنت قاصراً وتسافر دون مرافق، فيجب عليك مراجعة أنظمة بلدك المتعلقة بالسفر دون ولي أمر، حيث تختلف هذه الأنظمة حسب الجنسية. يُرجى التأكّد من استيفاء جميع المتطلبات قبل تقديم الطلب، وللمزيد من المعلومات يمكنك الاطّلاع على دليل التأشيرة الإلكترونية أو التواصل معنا للحصول على المساعدة.\nيجب أن يكون جواز سفرك ساري المفعول لمدة لا تقل عن ستة أشهر بعد تاريخ الدخول إلى المملكة العربية السعودية باستثناء مواطني الولايات المتحدة الأمريكية حيث يمكن لمواطني الولايات المتحدة الدخول طالما أن جواز سفرهم ساري المفعول، بغض النظر عن الوقت المتبقي قبل انتهاء الصلاحية.\nيمكن للمسافرين الراغبين في أداء مناسك العمرة بحجز موعد العمرة عبر منصة نُسك الرسمية"
          }
        },
        { 
          id: 3, 
          title: "تأشيرة المرور \"ترانزيت\"", 
          icon: <FaBuilding />,
          content: {
            title: "المعلومات",
            description: "تسمح تأشيرة المرور \"الترانزيت\" للزوار المارين عبر السعودية بالدخول لأغراض متعددة منها، أداء مناسك العمرة أو زيارة المسجد النبوي أو لقضاء اجازة قصيرة وسط الرحلات والاستمتاع بالفعاليات مثل موسم الرياض وزيارة المعالم السياحية في جميع أنحاء المملكة.\n\nملاحظة: يجب على المسافرين لأغراض العُمرة أو الزيارة جدولة مواعيدهم على منصة نُسك الإلكترونية Nusuk.sa قبل الذهاب إلى مكة المكرمة أو المدينة المنورة."
          }
        }
      ],

      // Other Countries Tabs
      otherTabs: [
        { 
          id: 1, 
          title: "السفارة/القنصلية", 
          icon: <FaPassport />,
          content: {
            title: "المعلومات",
            description: "رسوم التأمين الطبي: غير مشمولة (يتم تحديد السعر بناءاً على مقدم الخدمة)\n\nعدد مرات الدخول: دخول متعدد أو دخول واحد وفقاً لقرار وزارة الخارجية السعودية\n\nمدة الصلاحية: تأشيرة الدخول المتعدد صالحة لمدة عام من تاريخ إصدارها. تسمح التأشيرة بالإقامة لمدة تصل إلى 90 يوماً",
            requirements: "يجب ألا يقل عمرك عن 18 عاماً للدخول بمفردك. لا يجوز للمسافرين الذين تقل أعمارهم عن 18 عاماً الدخول إلا إذا كانوا برفقة أحد الوالدين أو الأجداد أو الأشقاء البالغين (فوق 18 عاماً).\nيجب أن يكون جواز سفرك ساري المفعول لمدة لا تقل عن ستة أشهر بعد تاريخ الدخول إلى المملكة العربية السعودية.\nالوثائق التالية مطلوبة أيضاً للحصول على تأشيرة سفارة/قنصلية/تأشير: إثبات الإقامة (في البلد الذي تقيم فيه)، تذكرة العودة، إثبات العمل، إثبات مالي/كشف الحساب المصرفي، خط سير الرحلة، الهوية، عنوان الإقامة (عنوان الاقامة أثناء زيارة السعودية)."
          }
        },
        { 
          id: 2, 
          title: "مكاتب التأشيرات المعتمدة", 
          icon: <FaBuilding />,
          content: {
            title: "المعلومات",
            description: "إذا كنت تعيش في إحدى الدول التالية، فستتمكن من استخدام خدمات تسهيل الحصول على تأشيرة \"تأشير\".\n\nأفريقيا: الكاميرون | تشاد | مصر | غانا | غينيا | ساحل العاج|  مالي | موريتانيا | نيجيريا | جنوب أفريقيا.\nآسيا: اندونيسيا | اليابان | الأردن | الكويت | جزر المالديف | باكستان | الفلبين | قطر | سنغافورة | سريلانكا | كوريا الجنوبية | طاجيكستان | الإمارات العربية المتحدة.\nأوروبا: ألمانيا | إيطاليا | هولندا | السويد | سويسرا.\nاستراليا\n\nيمكن للمسافرين الراغبين في أداء مناسك العمرة بحجز موعد العمرة عبر منصة نُسك الرسمية",
            searchButton: "أبحث",
            searchLink: "https://vc.tasheer.com/",
            nusukButton: "منصة نُسك الرسمية",
            nusukLink: "https://www.nusuk.sa/"
          }
        },
        { 
          id: 3, 
          title: "تأشيرة المرور \"ترانزيت\"", 
          icon: <FaBuilding />,
          content: {
            title: "المعلومات",
            description: "تسمح تأشيرة المرور \"الترانزيت\" للزوار المارين عبر السعودية بالدخول لأغراض متعددة منها، أداء مناسك العمرة أو زيارة المسجد النبوي أو لقضاء اجازة قصيرة وسط الرحلات والاستمتاع بالفعاليات مثل موسم الرياض وزيارة المعالم السياحية في جميع أنحاء المملكة.\n\nملاحظة: يجب على المسافرين لأغراض العُمرة أو الزيارة جدولة مواعيدهم على منصة نُسك الإلكترونية Nusuk.sa قبل الذهاب إلى مكة المكرمة أو المدينة المنورة."
          }
        }
      ],

      applyNow: "تقديم الأن",
      search: "أبحث",
      requirements: "المتطلبات",
      howToApply: "كيفية التقديم"
    }
  };

  const safeLang = lang && content[lang] ? lang : "ar";
  const t = content[safeLang];
  const isRTL = safeLang === "ar";

  const renderContent = (tabContent) => (
    <div className="tab-content">
      <div className="content-section">
        <h3 className="content-title">{tabContent.title}</h3>
        <p className="content-description">
          {tabContent.description.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>

      {tabContent.requirements && (
        <div className="content-section">
          <h4 className="section-subtitle">{t.requirements}</h4>
          <p className="content-description">
            {tabContent.requirements.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
      )}

      {tabContent.howToApply && (
        <div className="content-section">
          <h4 className="section-subtitle">{t.howToApply}</h4>
          <p className="content-description">{tabContent.howToApply}</p>
        </div>
      )}

      {(tabContent.applyButton || tabContent.searchButton || tabContent.nusukButton) && (
        <div className="action-buttons">
          {tabContent.applyButton && (
            <a href={tabContent.applyLink} className="action-btn primary-btn" target="_blank" rel="noopener noreferrer">
              {tabContent.applyButton}
              {isRTL ? <FaArrowLeft className="ms-2" /> : <FaArrowRight className="ms-2" />}
            </a>
          )}
          {tabContent.searchButton && (
            <a href={tabContent.searchLink} className="action-btn secondary-btn" target="_blank" rel="noopener noreferrer">
              {tabContent.searchButton}
            </a>
          )}
          {tabContent.nusukButton && (
            <a href={tabContent.nusukLink} className="action-btn tertiary-btn" target="_blank" rel="noopener noreferrer">
              {tabContent.nusukButton}
            </a>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="visa-page">
      {/* Hero Section */}
      <section className="visa-hero">
        <div className="video-background">
          <video autoPlay muted loop playsInline className="background-video">
            <source src="/visa.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>
        </div>
        
        <div className="container">
          <div className="row align-items-center min-vh-80">
            <div className="col-lg-8 mx-auto text-center text-white">
              <div className="hero-content">
                <h1 className="display-4 fw-bold mb-4">{t.heroTitle}</h1>
                <p className="lead mb-3">{t.heroSubtitle}</p>
                <p className="hero-description">{t.heroDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabs Section */}
      <section className="visa-tabs-section py-5">
        <div className="container">
          <div className="main-tabs">
            {t.mainTabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeMainTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveMainTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-text">{tab.title}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content-wrapper">
            {/* GCC Countries Tab */}
            {activeMainTab === 1 && (
              <div className="sub-tabs-section">
                <div className="sub-tabs">
                  {t.gccTabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`sub-tab-button ${activeGccTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveGccTab(tab.id)}
                    >
                      <span className="tab-icon">{tab.icon}</span>
                      <span className="tab-text">{tab.title}</span>
                    </button>
                  ))}
                </div>
                <div className="sub-tab-content">
                  {renderContent(t.gccTabs.find(tab => tab.id === activeGccTab).content)}
                </div>
              </div>
            )}

            {/* Schengen/USA/UK Tab */}
            {activeMainTab === 2 && (
              <div className="sub-tabs-section">
                <div className="sub-tabs">
                  {t.schengenTabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`sub-tab-button ${activeSchengenTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveSchengenTab(tab.id)}
                    >
                      <span className="tab-icon">{tab.icon}</span>
                      <span className="tab-text">{tab.title}</span>
                    </button>
                  ))}
                </div>
                <div className="sub-tab-content">
                  {renderContent(t.schengenTabs.find(tab => tab.id === activeSchengenTab).content)}
                </div>
              </div>
            )}

            {/* Other Countries Tab */}
            {activeMainTab === 3 && (
              <div className="sub-tabs-section">
                <div className="sub-tabs">
                  {t.otherTabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`sub-tab-button ${activeOtherTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveOtherTab(tab.id)}
                    >
                      <span className="tab-icon">{tab.icon}</span>
                      <span className="tab-text">{tab.title}</span>
                    </button>
                  ))}
                </div>
                <div className="sub-tab-content">
                  {renderContent(t.otherTabs.find(tab => tab.id === activeOtherTab).content)}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .visa-page {
          background: #f8f9fa;
          font-family: 'Tajawal', sans-serif;
        }

        .visa-hero {
          position: relative;
          padding: 120px 0 80px;
          min-height: 60vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .background-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(138, 119, 121, 0.95) 0%,
            rgba(239, 200, 174, 0.85) 100%
          );
          z-index: 2;
        }

        .visa-hero .container {
          position: relative;
          z-index: 3;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-content h1 {
          font-weight: 800;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          line-height: 1.3;
        }

        .hero-content .lead {
          font-size: 1.5rem;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
          font-weight: 600;
        }

        .hero-description {
          font-size: 1.2rem;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
          color: rgba(255, 255, 255, 0.9);
        }

        .visa-tabs-section {
          background: #f8f9fa;
        }

        .main-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 50px;
          font-weight: 600;
          color: #5d6d7e;
          transition: all 0.3s ease;
          cursor: pointer;
          font-family: 'Tajawal', sans-serif;
        }

        .tab-button:hover {
          border-color: #8a7779;
          color: #8a7779;
          transform: translateY(-2px);
        }

        .tab-button.active {
          background: linear-gradient(45deg, #8a7779, #a89294);
          color: white;
          border-color: #8a7779;
          box-shadow: 0 5px 15px rgba(138, 119, 121, 0.3);
        }

        .tab-icon {
          font-size: 1.2rem;
        }

        .sub-tabs-section {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .sub-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .sub-tab-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 25px;
          font-weight: 500;
          color: #5d6d7e;
          transition: all 0.3s ease;
          cursor: pointer;
          font-family: 'Tajawal', sans-serif;
        }

        .sub-tab-button:hover {
          border-color: #8a7779;
          color: #8a7779;
        }

        .sub-tab-button.active {
          background: linear-gradient(45deg, #8a7779, #a89294);
          color: white;
          border-color: #8a7779;
        }

        .tab-content-wrapper {
          min-height: 400px;
        }

        .content-section {
          margin-bottom: 2rem;
        }

        .content-title {
          color: #2c3e50;
          font-weight: 700;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .section-subtitle {
          color: #8a7779;
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-size: 1.2rem;
        }

        .content-description {
          color: #5d6d7e;
          line-height: 1.8;
          font-size: 1rem;
          white-space: pre-line;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          font-family: 'Tajawal', sans-serif;
        

        .primary-btn {
          background: linear-gradient(45deg, #8a7779, #a89294);
          color: white;
          box-shadow: 0 4px 15px rgba(138, 119, 121, 0.3);
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(138, 119, 121, 0.4);
          color: white;
        }

        .secondary-btn {
          background: transparent;
          border: 2px solid #8a7779;
          color: #8a7779;
        }

        .secondary-btn:hover {
          background: #8a7779;
          color: white;
          transform: translateY(-2px);
        }

        .tertiary-btn {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          color: #5d6d7e;
        }

        .tertiary-btn:hover {
          background: #e9ecef;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .visa-hero {
            padding: 100px 0 60px;
            min-height: 50vh;
          }

          .hero-content h1 {
            font-size: 2.2rem;
          }

          .hero-content .lead {
            font-size: 1.3rem;
          }

          .main-tabs {
            flex-direction: column;
            align-items: center;
          }

          .tab-button {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }

          .sub-tabs {
            flex-direction: column;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-btn {
            justify-content: center;
          }
        }

        @media (max-width: 576px) {
          .hero-content h1 {
            font-size: 1.8rem;
          }

          .sub-tabs-section {
            padding: 1.5rem;
          }

          .content-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}