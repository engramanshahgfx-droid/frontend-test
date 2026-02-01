// app/visa/page.js
import VisaComponent from "@/components/visa/visa";

export default async function VisaPage({ params }) {
  try {
    const { lang } = await params;
    const validLang = ['ar', 'en'].includes(lang) ? lang : 'ar';
    return <VisaComponent lang={validLang} />;
  } catch (error) {
    console.error('Error in VisaPage:', error);
    return <VisaComponent lang="ar" />;
  }
}