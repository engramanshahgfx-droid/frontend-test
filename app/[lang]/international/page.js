
import InternationalContent from "@/components/international/InternationalContent";

export default async function International({ params }) {
  try {
    const { lang } = await params;
    const validLang = ['ar', 'en', 'zh'].includes(lang) ? lang : 'ar';
    return <InternationalContent lang={validLang} />;
  } catch (error) {
    console.error('Error in International page:', error);
    return <InternationalContent lang="ar" />;
  }
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const validLang = ['ar', 'en', 'zh'].includes(lang) ? lang : 'ar';
  
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
    },
    zh: {
      title: "特别优惠与旅行套餐 | 旅行公司",
      description: "发现令人惊叹的旅行优惠和套餐，享受难以置信的折扣。为您的下一次探险提供限时特别优惠。",
      keywords: "旅行优惠, 套餐, 折扣, 沙特阿拉伯旅游, 特别优惠",
      openGraph: {
        title: "特别优惠与旅行套餐",
        description: "对旅行套餐提供限时惊人折扣的特别优惠",
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