'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './SaudiMapBanner.module.css';

const cities = [
  { name: 'الرياض', top: '45%', left: '55%', videoUrl: '/videos/makka.mp4' },
  { name: 'جدة', top: '70%', left: '40%', videoUrl: '/videos/makka.mp4' },
  { name: 'المدينة المنورة', top: '60%', left: '35%', videoUrl: '/makka/medina.mp4' },
  { name: 'الدمام', top: '45%', left: '70%', videoUrl: '/videos/makka.mp4' },
  { name: 'الخبر', top: '48%', left: '72%', videoUrl: '/videos/makka.mp4' },
  { name: 'مكة المكرمة', top: '68%', left: '42%', videoUrl: '/videos/makka.mp4' },
  // Add more cities as needed
];

export default function SaudiMapBanner() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className={styles.banner}>
      <Image
        src="/saudi_map.jpg"
        alt="Saudi Map"
        fill
        priority
        className={styles.mapImage}
      />

      {cities.map((city) => (
        <button
          key={city.name}
          className={styles.cityButton}
          style={{ top: city.top, left: city.left }}
          onClick={() => setActiveVideo(city.videoUrl)}
        >
          {city.name}
        </button>
      ))}

      {activeVideo && (
        <div className={styles.modal} onClick={() => setActiveVideo(null)}>
          <video src={activeVideo} controls autoPlay className={styles.video} />
        </div>
      )}
    </div>
  );
}
