import React from 'react';
import TourismOffers from '@/components/TourismOffers';

export default function LocalIslandsPage({ params }) {
  const lang = params?.lang || 'en';

const content = {
    en: {
      title: 'Local Island Destinations',
      description: 'Discover beautiful local islands and coastal destinations within Saudi Arabia',
    },
    ar: {
      title: 'وجهات الجزر المحلية',
      description: 'اكتشف الجزر المحلية والوجهات الساحلية الجميلة في المملكة العربية السعودية',
    },
    zh: {
      title: '本地岛屿目的地',
      description: '探索沙特阿拉伯境内美丽的本地岛屿和沿海目的地',
    },
  };

  const pageContent = content[lang] || content.en;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <main className="pt-[60px]">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{pageContent.title}</h1>
            <p className="text-xl text-blue-100">{pageContent.description}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full py-12">
          <TourismOffers lang={lang} />
        </div>
      </main>
    </div>
  );
}
