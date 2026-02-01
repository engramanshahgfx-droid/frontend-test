import TermsContent from "@/components/Terms/TermsContent";

// 1. Make the component 'async'
export default async function TermsPage({ params }) {
  // 2. Await the params before destructuring
  const { lang } = await params;
  
  return <TermsContent lang={lang} />;
}

export async function generateMetadata({ params }) {
  // 3. Await params here as well
  const { lang } = await params;
  
  const metadata = {
    ar: {
      title: "الشروط والأحكام - التلال والرمال",
      description: "تعرف على الشروط والأحكام الخاصة بحجز الرحلات والخدمات مع شركة التلال والرمال لتنظيم الرحلات السياحية.",
    },
    en: {
      title: "Terms & Conditions - Tilal Rimal",
      description: "Learn about the terms and conditions for booking tours and services with Tilal Rimal Tourism Company.",
    }
  };

  return {
    title: metadata[lang]?.title || metadata.en.title,
    description: metadata[lang]?.description || metadata.en.description,
  };
}