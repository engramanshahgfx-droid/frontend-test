import Testimonials from "@/components/Testimonials";
import NewServices from "@/components/NewServices/NewServices";
// import Hero from '../../components/Hero';
import Features from '../../components/Feature';
import Badge from '../../components/Badge/Badge';
import Market from "@/components/MarketLeader/Market";
import Team from "@/components/Team/Team";

import StartProject from "@/components/StartProject/StartProject";
import ValueSlider from "@/components/ValueSlider";
import TeamSection from '@/components/workteam/team';
import Saudi from '@/components/Saudi/Saudi';
import TourismDestinations from "@/components/TourismDestinations";
import TourismOffers from "@/components/TourismOffers";
import SpecialOffers from "@/components/SpecialOffer/SpecialOffers";
import PromoBanners from "@/components/PromoBanners";
import AgencyPros from "@/components/AgencyPros";
import PartnerCarousel from "@/components/PartnerCarousel";
import ModernTestimonials from "@/components/ModernTestimonials";
import Contact from "@/components/contact-us";
import { getApiUrl } from '@/config/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home({ params }) {
  const resolvedParams = await params;
  const { lang } = resolvedParams;

  const content = {
    en: {
      // Hero section
      heroTitle: "Welcome to Tilal Rimal We provide high-quality tourism experiences at competitive prices, blending enjoyment with valuable insights to create unforgettable memories for you. Our passionate young team plans and executes every trip with precision ensuring lasting memories for a lifetime.",
      heroSubtitle: "Discover Saudi Arabia from a New Perspective",
      heroDescription: "Let us plan... while you enjoy the journey. Explore the beauty of Saudi Arabia with us - discover custom-designed trips, cultural experiences, and breathtaking landscapes waiting for you.",
      shopNow: "Explore Offers",

      // Features/Why Choose section
      whyChooseTitle: "Why Choose Tilalr",
      whyChooseDescription: "We take pride in our expert travel planning, local knowledge, and commitment to creating unforgettable experiences in Saudi Arabia's most beautiful destinations.",
      features: [
        {
          title: "Expert Local Guides",
          description: "Knowledgeable guides who know the hidden gems and cultural insights of Saudi Arabia.",
        },
        {
          title: "Customized Itineraries",
          description: "Tailored trips designed to match your interests, preferences, and travel style.",
        },
        {
          title: "Safety & Comfort",
          description: "Comprehensive safety measures and comfortable accommodations throughout your journey.",
        },
        {
          title: "Cultural Immersion",
          description: "Authentic experiences that connect you with local traditions and communities.",
        },
      ],

      // Services section
      discoverTitle: "Discover Unique Destinations.",
      discoverDescription: "Comprehensive travel experiences designed to meet diverse interests and preferences.",
      services: [
        {
          title: "School Trips",
          image: "/services/school-trip.webp",
          description: "We offer fun educational trips that combine learning and entertainment. Includes workshops and visits to cultural sites, providing a unique educational experience for students.",
        },
        {
          title: "Corporate Trips",
          image: "/services/corporate-trips.jpeg",
          description: "Make your company events special! We offer motivational trips to enhance cooperation and creativity among employees, with interactive activities and team building to strengthen group spirit.",
        },
        {
          title: "Family & Private Group Trips",
          image: "/services/family-trips.jpeg",
          description: "Enjoy wonderful time with your family or friends! We offer customized trips suitable for all tastes, with unique experiences that guarantee unforgettable memories.",
        },
      ],
    },
    ar: {
      // Arabic content here (same structure as above)
      heroTitle: " الطبيعة كما لم تره من قبل",
      heroSubtitle: "اكتشف المملكة من منظور جديد",
      heroDescription: "دعنا نخطط.. وأنت استمتع بالرحلة. اكتشف جمال السعودية معنا - اكتشف رحلات مصممة خصيصًا، وتجارب ثقافية، ومناظر طبيعية خلابة في انتظارك.",
      shopNow: "استكشف العروض",

      whyChooseTitle: "لماذا تختار التلال والرمال",
      whyChooseDescription: "نفخر بتخطيط الرحلات الخبير ومعرفتنا المحلية والتزامنا بخلق تجارب لا تُنسى في أجمل الوجهات السعودية.",
      features: [
        {
          title: "مرشدون محليون خبراء",
          description: "مرشدون متمرسون يعرفون الجواهر المخفية والرؤى الثقافية في السعودية.",
        },
        {
          title: "برامج سفر مخصصة",
          description: "رحلات مصممة خصيصًا لتتناسب مع اهتماماتك وتفضيلاتك وأسلوب سفرك.",
        },
        {
          title: "السلامة والراحة",
          description: "إجراءات سلامة شاملة وإقامة مريحة طوال رحلتك.",
        },
        {
          title: "الانغماس الثقافي",
          description: "تجارب أصيلة تربطك بالتقاليد والمجتمعات المحلية.",
        },
      ],

      discoverTitle: "عيش المغامرة في أي وقت مع عروضنا المتجددة",
      discoverDescription: "عيش المغامرة في أي وقت مع عروضنا المتجددة",
      services: [
        {
          title: "رحلات المدارس",
          image: "/services/school-trip.webp",
          description: "نقدم رحلات تعليمية ممتعة تجمع بين التعلم والترفيه. تشمل ورش عمل وزيارات لمواقع ثقافية، مما يوفر تجربة تعليمية فريدة للطلاب.",
        },
        {
          title: "رحلات الشركات",
          image: "/services/corporate-trips.jpeg",
          description: "اجعل فعاليات شركتك مميزة! نقدم رحلات تحفيزية لتعزيز التعاون والإبداع بين الموظفين، مع أنشطة تفاعلية وبناء فرق لتعزيز الروح الجماعية.",
        },
        {
          title: "رحلات العوائل والمجموعات الخاصة",
          image: "/services/family-trips.jpeg",
          description: "استمتع بوقت ممتع مع عائلتك أو أصدقائك! نقدم رحلات مخصصة تناسب جميع الأذواق، مع تجارب فريدة تضمن لكم ذكريات لا تُنسى.",
        },
      ],
    },


  };

  const {
    heroTitle,
    heroSubtitle,
    heroDescription,
    shopNow,
    whyChooseTitle,
    whyChooseDescription,
    features,
    discoverTitle,
    discoverDescription,
  } = content[lang] || content.en;

  // Try to fetch services from backend API (fallback to local content if unavailable)
  let services = (content[lang] && content[lang].services) || content.en.services;

  console.log('🔍 Initial services (from hardcoded content):', services?.length || 0, 'items');

  // Use dynamic API URL detection (env var first, then detect from hostname)
  const apiUrl = getApiUrl();
  try {
    console.log('📡 Attempting to fetch services from:', `${apiUrl}/services`);

    // helper: fetch with timeout & simple retry to fail-fast during backend outages
    const fetchWithTimeout = async (url, options = {}, timeoutMs = 3000, retries = 0) => {
      for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        try {
          const res = await fetch(url, { signal: controller.signal, ...options });
          clearTimeout(id);
          return res;
        } catch (err) {
          clearTimeout(id);
          // If last attempt, rethrow so outer catch handles fallback
          if (attempt === retries) throw err;
          // small backoff before retry
          await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        }
      }
    };

    const res = await fetchWithTimeout(`${apiUrl}/services?lang=${encodeURIComponent(lang)}`, { cache: 'no-store' }, 3000, 0);

    console.log('📡 API response status:', res?.status ?? '<no response>');

    if (res && res.ok) {
      // Try to parse JSON safely
      let data = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        // Response was not JSON; log and fallback
        const bodyText = await res.text().catch(() => '<unavailable>');
        console.warn('⚠️ API returned non-JSON response, body:', bodyText);
      }

      if (data && Array.isArray(data) && data.length > 0) {
        // keep the original structure but normalize image & slug presence
        services = data.map((s) => ({
          title: s.title || s.name || s.titles || s.title_translations || s.title,
          description: s.description || s.description_translations || s.desc || s.description,
          image: s.image || s.image_url || s.imageUrl || '/services/default.jpg',
          slug: s.slug || '',
        }));
        console.log('✅ Services updated from API:', services.length, 'items');
      }
    }
    else {
      // Attempt to read response body for debugging
      let bodyText = '';
      try {
        bodyText = res ? await res.text() : '<no response body>';
      } catch (e) {
        bodyText = '<unavailable>';
      }
      console.warn('⚠️ API returned status:', res?.status ?? '<no status>', 'body:', bodyText, '- using fallback content');
    }
  } catch (err) {
    // Improved diagnostics: log the full error and stack to help identify network/CORS issues
    if (err?.name === 'AbortError') {
      console.warn('⏱️ API request timed out (3s) - backend server may be offline at:', apiUrl);
    } else {
      console.error('❌ Error fetching services:', err?.message || err);
    }
    console.log('📌 Using fallback services - apiUrl:', apiUrl);
  }

  console.log('🎯 Final services array passed to component:', services?.length || 0, 'items', services);

  return (
    <>
      <Saudi lang={lang} />
      {/* <StartProject lang={lang} /> */}

      {/* local cities  */}
      <NewServices
        lang={lang}
        servicesData={services}
        sectionTitle={discoverTitle}
        sectionDescription={discoverDescription}
      />

      <AgencyPros lang={lang} />

      <PartnerCarousel lang={lang} />

      {/* <SpecialOffers lang={lang} /> */}
      <TourismOffers lang={lang} maxItems={3} />

      <PromoBanners lang={lang} index={0} />

      <TourismDestinations lang={lang} maxItems={3} />

      <PromoBanners lang={lang} index={1} />

      <ModernTestimonials lang={lang} />

      <div className="section-header-contact" style={{ textAlign: "center", padding: "0 20px 35px 20px", marginBottom: "0", backgroundColor: "#FAF6F0" }}>
        <span className="accent-tag" style={{
          fontSize: "0.85rem",
          fontWeight: "700",
          letterSpacing: "2px",
          color: "#E85D1F",
          display: "inline-block",
          marginBottom: "12px",
          fontFamily: "'Tajawal', sans-serif"
        }}>
          {lang === "ar" ? "اتصل بنا" : "CONTACT US"}
        </span>
        <h2 style={{
          fontSize: "2.5rem",
          fontWeight: "800",
          color: "#1C0052",
          margin: "0",
          position: "relative",
          paddingBottom: "10px",
          fontFamily: "'Tajawal', sans-serif"
        }}>
          {lang === "ar" ? "تواصل معنا اليوم" : "Get In Touch With Us"}
          <span style={{
            position: "absolute",
            bottom: "0px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60px",
            height: "3px",
            background: "#E85D1F",
            display: "block"
          }}></span>
        </h2>
      </div>

      <Contact lang={lang} hideHero={true} />


    </>
  );
}