import InsuranceContent from '@/components/Policies/InsuranceContent';

export default async function InsurancePage({ params }) {
  const { lang } = await params;
  return <InsuranceContent lang={lang} />;
}
