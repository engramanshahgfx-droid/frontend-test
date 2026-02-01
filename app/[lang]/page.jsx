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
import IslandDestinations from "@/components/IslandDestinations/IslandDestinationsinternational";
import IslandDestinationslocal from "@/components/IslandDestinations/IslandDestinationslocal";

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
    discoverTitle: "Discover Unique Destinations",
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
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://admin.tilalr.com/api';
    console.log('📡 Attempting to fetch services from:', `${apiUrl}/services`);
    
    const res = await fetch(`${apiUrl}/services`, { 
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    console.log('📡 API response status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ API returned data:', data?.length || 0, 'items');
      
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
    } else {
      console.warn('⚠️ API returned status:', res.status, '- using fallback content');
    }
  } catch (err) {
    console.error('❌ Error fetching services:', err?.message || err);
    console.log('📌 Using fallback services:', services?.length || 0, 'items');
  }
  
  console.log('🎯 Final services array passed to component:', services?.length || 0, 'items', services);

  return (
    <>
         <Saudi lang={lang} />
       <StartProject lang={lang} />

       {/* local cities  */}
        <NewServices
        lang={lang}
        servicesData={services}
        sectionTitle={discoverTitle}
        sectionDescription={discoverDescription}
      />
     <IslandDestinationslocal lang={lang} />
     
    <IslandDestinations lang={lang} />
  
     
    </>
  );
}