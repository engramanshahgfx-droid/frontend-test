import SchengenVisaPage from "@/components/visa/schengen/SchengenVisaPage";

export default async function SchengenPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "ar";
  
  return <SchengenVisaPage lang={lang} />;
}