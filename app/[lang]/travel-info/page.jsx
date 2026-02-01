
import TravelInfo from "@/components/TravelInfo/TravelInfo";

export default async function TravelInfoPage({ params }) {
  try {
    const { lang } = await params;
    const validLang = ['ar', 'en'].includes(lang) ? lang : 'ar';
    return <TravelInfo lang={validLang} />;
  } catch (error) {
    console.error('Error in TravelInfo:', error);
    return <TravelInfo lang="ar" />;
  }
}