import { db } from "@/configuration/firebase-config";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import BlogClient from "./BlogClient";

const metas = {
  en: {
    title: "Next Future | Digital Solutions & IT Growth Experts",
    description:
      "Accelerate your business with Next Future Information Technology — experts in web and mobile app development, IT consulting, digital marketing, graphic design, and innovative tech solutions. Let’s grow your business together.",
    keywords:
      "IT solutions, digital marketing, web development, mobile apps, IT consulting, graphic design, business growth, Next Future",
  },
  ar: {
    title: "نكست فيوتشر | خبراء الحلول الرقمية ونمو الأعمال",
    description:
      "عزز عملك مع شركة نكست فيوتشر لتقنية المعلومات — خبراء في تطوير المواقع والتطبيقات، استشارات تكنولوجيا المعلومات، التسويق الرقمي، التصميم الجرافيكي، والحلول التقنية المبتكرة. دعنا نساعدك على نمو أعمالك.",
    keywords:
      "حلول تقنية، التسويق الرقمي، تطوير المواقع، تطبيقات الهواتف، استشارات تكنولوجيا المعلومات، التصميم الجرافيكي، نمو الأعمال، نكست فيوتشر",
  },
};


export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = metas[lang] || metas.en;

  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    alternates: {
      canonical: `https://brandraize.com/${lang}/blog`,
      languages: {
        en: "https://brandraize.com/en/blog",
        ar: "https://brandraize.com/ar/blog",
      },
    },
  };
}

export default async function Blog({ params }) {
  const { lang } = await params;

  const articlesCollection = collection(db, "articles");
  const articlesQuery = query(articlesCollection, orderBy("timestamp", "desc"));
  const docsSnapshot = await getDocs(articlesQuery);

  const articles = docsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      title: data.title[lang],
      description: data.description[lang],
      slug: data.title["en"],
      timestamp: data.timestamp?.toDate().toISOString() || null,
    };
  });

  return <BlogClient articles={articles} lang={lang} />;
}
