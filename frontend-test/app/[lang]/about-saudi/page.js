import AboutSaudi from "@/components/AboutSaudi/AboutSaudi";

export default async function AboutSaudiPage({ params }) {
  try {
    // ✅ Correct: Destructure AFTER awaiting the params Promise
    const { lang } = await params;
    const validLang = ['ar', 'en', 'zh'].includes(lang) ? lang : 'ar';
    return <AboutSaudi lang={validLang} />;
  } catch (error) {
    console.error('Error in AboutSaudi:', error);
    return <AboutSaudi lang="ar" />;
  }
}

export async function generateMetadata({ params }) {
  // ✅ Fix: Await the params Promise before destructuring
  const { lang } = await params;
  
  const metadata = {
    ar: {
      title: "عن المملكة العربية السعودية - التلال والرمال",
      description: "اكتشف سحر الطبيعة في المملكة العربية السعودية كما لم تره من قبل. تعرف على الثقافة، اللغة، ورؤية المملكة 2030.",
    },
    en: {
      title: "About Saudi Arabia - Tilal Rimal",
      description: "Discover the magic of nature in Saudi Arabia like you've never seen before. Learn about culture, language, and Saudi Vision 2030.",
    },
    zh: {
      title: "关于沙特阿拉伯 - Tilal Rimal",
      description: "像从未见过一样，发现沙特阿拉伯的大自然奇观。了解文化、语言和沙特2030愿景。",
    }
  };

  return {
    title: metadata[lang]?.title || metadata.en.title,
    description: metadata[lang]?.description || metadata.en.description,
  };
}