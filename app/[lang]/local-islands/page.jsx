'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import IslandDestinationslocal from '@/components/IslandDestinations/IslandDestinationslocal';

export default function LocalIslandsPage() {
  const params = useParams();
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
  };

  const pageContent = content[lang] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{pageContent.title}</h1>
          <p className="text-xl text-blue-100">{pageContent.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <IslandDestinationslocal lang={lang} />
      </div>
    </div>
  );
}
