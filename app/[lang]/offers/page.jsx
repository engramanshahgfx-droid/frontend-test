

import { getOffersStatic, formatOffersData } from '@/lib/server-api';
import OffersPage from "@/components/OffersPage/OffersPage";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const validLang = ['ar', 'en', 'zh'].includes(lang) ? lang : 'ar';
  
  const metadata = {
    en: {
      title: "Special Offers & Travel Packages | Tilal Rimal",
      description: "Discover amazing travel offers and packages with incredible discounts. Limited-time special deals for your next adventure.",
      keywords: "travel offers, packages, discounts, Saudi Arabia tourism, special deals",
    },
    ar: {
      title: "عروض وحزم سفر خاصة | التلال والرمال",
      description: "اكتشف عروض سفر مذهلة وحزم مع خصومات لا تصدق. عروض خاصة محدودة الوقت لمغامرتك القادمة.",
      keywords: "عروض سفر, حزم, خصومات, سياحة السعودية, عروض خاصة",
    },
    zh: {
      title: "特别优惠与旅行套餐 | Tilal Rimal",
      description: "发现令人惊叹的旅行优惠和套餐，享受难以置信的折扣。为您的下一次探险提供限时特别优惠。",
      keywords: "旅行优惠, 套餐, 折扣, 沙特阿拉伯旅游, 特别优惠",
    }
  };
  
  return {
    ...metadata[validLang],
    alternates: {
      canonical: `/offers`,
      languages: {
        'ar': '/ar/offers',
        'en': '/en/offers'
      }
    }
  };
}

export async function generateStaticParams() {
  return [
    { lang: 'ar' },
    { lang: 'en' },
    { lang: 'zh' },
  ];
}

export default async function OffersRoute({ params }) {
  const { lang } = await params;
  const validLang = ['ar', 'en', 'zh'].includes(lang) ? lang : 'ar';

  try {
    const rawOffers = await getOffersStatic();
    const initialOffers = formatOffersData(rawOffers, validLang);
    return <OffersPage lang={validLang} initialOffers={initialOffers} />;
  } catch (error) {
    console.error('[OffersRoute] Error fetching offers:', error.message);
    // Keep page renderable on API issues; component can still fetch client-side.
    return <OffersPage lang={validLang} initialOffers={[]} />;
  }
}

