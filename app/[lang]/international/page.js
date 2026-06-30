
import {
  getInternationalFlightsStatic,
  getInternationalHotelsStatic,
  getInternationalPackagesStatic,
  getInternationalDestinationsStatic,
} from '@/lib/server-api';
import InternationalContent from "@/components/international/InternationalContent";

/**
 * Dynamic rendering - fetches fresh data on each request
 * Data is server-rendered (embedded in HTML) so Google sees all content
 * Content always current (no stale data)
 * Trade-off: Per-request API call instead of cached build
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const validLang = ['ar', 'en', 'zh'].includes(lang) ? lang : 'ar';
  
  const metadata = {
    en: {
      title: "International Travel & Packages | Tilal Rimal",
      description: "Explore world-class international travel packages with flights, hotels, and guided tours. Plan your dream vacation today.",
      keywords: "international travel, travel packages, flights, hotels, world tourism",
    },
    ar: {
      title: "السفر الدولي والحزم | التلال والرمال",
      description: "استكشف حزم سفر دولية فئة عالمية مع رحلات طيران، فنادق، وجولات موجهة. خطط لإجازة أحلامك اليوم.",
      keywords: "السفر الدولي, حزم السفر, الرحلات الجوية, الفنادق, السياحة العالمية",
    },
    zh: {
      title: "国际旅行套餐 | Tilal Rimal",
      description: "探索世界级国际旅行套餐，包括航班、酒店和导游旅游。今天计划您梦想中的假期。",
      keywords: "国际旅行, 旅行套餐, 航班, 酒店, 世界旅游",
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

export default async function International({ params }) {
  const { lang } = await params;
  const validLang = ['ar', 'en', 'zh'].includes(lang) ? lang : 'ar';

  let initialFlights = [];
  let initialHotels = [];
  let initialPackages = [];
  let initialDestinations = [];

  try {
    // Fetch all international data on each request (fresh data)
    [initialFlights, initialHotels, initialPackages, initialDestinations] = await Promise.all([
      getInternationalFlightsStatic(),
      getInternationalHotelsStatic(),
      getInternationalPackagesStatic(),
      getInternationalDestinationsStatic(),
    ]);

    console.log('[International Page] Data loaded (dynamic):', {
      flights: initialFlights.length,
      hotels: initialHotels.length,
      packages: initialPackages.length,
      destinations: initialDestinations.length,
    });
  } catch (error) {
    console.error('[International Page] Error fetching data:', error.message);
    // Component handles empty data gracefully
  }

  return (
    <InternationalContent
      lang={validLang}
      initialFlights={initialFlights}
      initialHotels={initialHotels}
      initialPackages={initialPackages}
      initialDestinations={initialDestinations}
    />
  );
}