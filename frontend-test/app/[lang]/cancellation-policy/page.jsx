import CancellationContent from '@/components/Policies/CancellationContent';

export default async function CancellationPage({ params }) {
  const { lang } = await params;
  return <CancellationContent lang={lang} />;
}
