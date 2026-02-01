
import InternationalContent from "@/components/international/InternationalContent";

export default async function International({ params }) {
  try {
    const { lang } = await params;
    const validLang = ['ar', 'en'].includes(lang) ? lang : 'ar';
    return <InternationalContent lang={validLang} />;
  } catch (error) {
    console.error('Error in International page:', error);
    return <InternationalContent lang="ar" />;
  }
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const validLang = ['ar', 'en'].includes(lang) ? lang : 'ar';
  
  const metadata = {
    en: {
      title: "Special Offers & Travel Packages | Your Travel Company",
      description: "Discover amazing travel offers and packages with incredible discounts. Limited-time special deals for your next adventure.",
      keywords: "travel offers, packages, discounts, Saudi Arabia tourism, special deals",
      openGraph: {
        title: "Special Offers & Travel Packages",
        description: "Limited-time offers with incredible discounts on travel packages",
        type: "website",
        images: ["/og-international.jpg"]
      }
    },
    ar: {
      title: "عروض وحزم سفر خاصة | شركة السفر الخاصة بك",
      description: "اكتشف عروض سفر مذهلة وحزم مع خصومات لا تصدق. عروض خاصة محدودة الوقت لمغامرتك القادمة.",
      keywords: "عروض سفر, حزم, خصومات, سياحة السعودية, عروض خاصة",
      openGraph: {
        title: "عروض وحزم سفر خاصة",
        description: "عروض محدودة الوقت مع خصومات مذهلة على حزم السفر",
        type: "website",
        images: ["/og-international.jpg"]
      }
    }
  };
  
  return {
    ...metadata[validLang],
    alternates: {
      canonical: `/international`,
      languages: {
        'ar': '/ar/international',
        'en': '/en/international'
      }
    }
  };
}