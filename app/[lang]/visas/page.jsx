import Evisa from "@/components/visa/evisa/evisa";

export const dynamic = 'force-static';

export default async function VisaPage({ params }) {
  const { lang = "ar" } = await params;

  return <Evisa lang={lang} basePath="/visas" countries={[]} />;
}
