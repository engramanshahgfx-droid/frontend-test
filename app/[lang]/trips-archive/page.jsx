import TripsArchive from "@/components/TripsArchive/TripsArchive";
import Testimonials from "@/components/Testimonials"; // Add @/ prefix

export default async function TripsArchivePage({ params }) {
  try {
    const { lang } = await params;
    const validLang = ['ar', 'en'].includes(lang) ? lang : 'ar';
    return (
      <>
        <TripsArchive lang={validLang} />
        <Testimonials lang={validLang} />
      </>
    );
  } catch (error) {
    console.error('Error in TripsArchivePage:', error);
    return <TripsArchive lang="ar" />;
  }
}