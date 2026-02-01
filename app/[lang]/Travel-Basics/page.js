import TravelBasic from "@/components/TravelBasic/TravelBasic";

export default async function TravelBasicsPage({ params }) {
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  return <TravelBasic lang={lang} />;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  
  const metadata = {
    ar: {
      title: "أساسيات السفر - التلال والرمال",
      description: "دليلك الشامل للسفر إلى المملكة العربية السعودية. تعرف على متطلبات التأشيرة، دليل السفر، والثقافة السعودية.",
    },
    en: {
      title: "Travel Basics - Tilal Rimal",
      description: "Your comprehensive guide to traveling to Saudi Arabia. Learn about visa requirements, travel guide, and Saudi culture.",
    }
  };

  return {
    title: metadata[lang]?.title || metadata.en.title,
    description: metadata[lang]?.description || metadata.en.description,
  };
}