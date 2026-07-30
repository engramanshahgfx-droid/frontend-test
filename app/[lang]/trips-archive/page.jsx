import { redirect } from "next/navigation";

export default async function TripsArchivePage({ params }) {
  const { lang } = await params;
  const validLang = ['ar', 'en', 'zh'].includes(lang) ? lang : 'ar';
  redirect(`/${validLang}/about-us`);
}
