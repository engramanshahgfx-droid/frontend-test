

import OffersPage from "@/components/OffersPage/OffersPage";

export default async function OffersRoute({ params }) {
  try {
    const { lang } = await params;
    const validLang = ['ar', 'en'].includes(lang) ? lang : 'ar';
    return <OffersPage lang={validLang} />;
  } catch (error) {
    console.error('Error in OffersPage:', error);
    return <OffersPage lang="ar" />;
  }
}

