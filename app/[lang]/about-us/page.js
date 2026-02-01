import About from "@/components/About/About";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  
  const metadata = {
    ar: {
      title: "من نحن - التلال والرمال",
      description: "اكتشف قصة التلال والرمال، رؤيتنا ورسالتنا في تنظيم رحلات سياحية استثنائية في المملكة العربية السعودية.",
    },
    en: {
      title: "About Us - Tilal Rimal",
      description: "Discover the story of Tilal Rimal, our vision and mission in organizing exceptional tourist trips in Saudi Arabia.",
    }
  };

  const validLang = ['ar', 'en'].includes(lang) ? lang : 'en';
  
  return {
    title: metadata[validLang].title,
    description: metadata[validLang].description,
  };
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  const validLang = ['ar', 'en'].includes(lang) ? lang : 'ar';
  
  return <About lang={validLang} />;
}