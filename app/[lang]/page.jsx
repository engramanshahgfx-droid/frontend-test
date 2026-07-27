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
          title: "رحلات المدراس",
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

    zh: {
      // Chinese content
      heroTitle: "欢迎来到Tilal Rimal！我们以极具竞争力的价格提供高品质的旅游体验，将乐趣与宝贵见解融为一体，为您创造难忘的回忆。我们充满热情的年轻团队精心策划和执行每一次旅行，确保为您留下终生的美好记忆。",
      heroSubtitle: "从新视角探索沙特阿拉伯",
      heroDescription: "让我们来规划... 您只管享受旅程。与我们一起探索沙特阿拉伯的美景 - 发现为您量身定制的旅行、文化体验和令人叹为观止的风景。",
      shopNow: "探索优惠",

      // Features/Why Choose section
      whyChooseTitle: "为何选择Tilalr",
      whyChooseDescription: "我们以专业的旅行规划、当地知识和承诺在沙特阿拉伯最美丽的景点创造难忘体验而自豪。",
      features: [
        {
          title: "专业当地导游",
          description: "知识渊博的导游了解沙特阿拉伯的隐藏宝藏和文化见解。",
        },
        {
          title: "定制行程",
          description: "根据您的兴趣、偏好和旅行风格量身打造的旅行。",
        },
        {
          title: "安全与舒适",
          description: "整个旅程中全面的安全措施和舒适的住宿条件。",
        },
        {
          title: "文化沉浸",
          description: "真实体验让您与当地传统和社区建立联系。",
        },
      ],

      // Services section
      discoverTitle: "发现独特目的地",
      discoverDescription: "专为满足不同兴趣和偏好而设计的全面旅行体验。",
      services: [
        {
          title: "学校旅行",
          image: "/services/school-trip.webp",
          description: "我们提供结合学习和娱乐的有趣教育旅行。包括工作坊和参观文化遗址，为学生提供独特的教育体验。",
        },
        {
          title: "企业旅行",
          image: "/services/corporate-trips.jpeg",
          description: "让您的公司活动与众不同！我们提供激励旅行，以增强员工之间的合作和创造力，通过互动活动和团队建设来加强团队精神。",
        },
        {
          title: "家庭和私人团体旅行",
          image: "/services/family-trips.jpeg",
          description: "与家人或朋友共度美好时光！我们提供适合各种口味的定制旅行，独特的体验保证给您留下难忘的回忆。",
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

      {/* <SpecialOffers lang={lang} /> */}
      <TourismOffers lang={lang} maxItems={3} />

      <TourismDestinations lang={lang} />


    </>
  );
}