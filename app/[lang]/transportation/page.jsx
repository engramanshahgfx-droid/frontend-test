

import Transportation from "@/components/Transportation/Transportation";

export default async function TransportationPage({ params }) {
  try {
    const { lang } = await params;
    const validLang = ['ar', 'en'].includes(lang) ? lang : 'ar';
    return <Transportation lang={validLang} />;
  } catch (error) {
    console.error('Error in TransportationPage:', error);
    return <Transportation lang="ar" />;
  }
}